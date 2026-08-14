#!/usr/bin/env node
// GEO audit runner (Ops Brief § 02): one command in, evidence out.
//
//   node src/audit.js "<business name>" "<city>" <niche> [options]
//
//   --trade=X       fill [trade] (generic home-services template)
//   --problem=X     fill [problem] (generic home-services template)
//   --platforms=a,b limit platforms (default: chatgpt,gemini,perplexity)
//   --ghl-email=X   also write the score to this contact's cs_geo_score
//   --out=DIR       output root (default: geo/audits)
//
// Per question, per platform (fresh logged-out session, no history):
// ask → capture answer text + screenshot → analyze (businesses named, in
// order; subject named Y/N; competitors). Output: results.json + summary.md
// + screenshots/, score X/21. GHL cs_geo_score written only when wired and
// an email is given — the audit never blocks on GHL.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadQuestions, loadTemplate } from './questions.js';
import { launchBrowser, askQuestion, isPlatformUnavailable, PLATFORM_KEYS, platformLabel } from './browser.js';
import { analyzeAnswer } from './analyze.js';
import { checkGeoScoreField, writeGeoScore } from './ghl.js';

const GEO_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const positional = args.filter((a) => !a.startsWith('--'));
const [businessName, city, niche] = positional;

if (!businessName || !city || !niche) {
  console.log('Usage: node src/audit.js "<business name>" "<city>" <niche> [--trade=X] [--problem=X] [--platforms=a,b] [--ghl-email=X] [--out=DIR]');
  process.exit(1);
}

const platforms = (flag('platforms') || PLATFORM_KEYS.join(',')).split(',').map((s) => s.trim());
for (const p of platforms) {
  if (!PLATFORM_KEYS.includes(p)) {
    console.error(`Unknown platform "${p}". Valid: ${PLATFORM_KEYS.join(', ')}`);
    process.exit(1);
  }
}

const template = await loadTemplate(niche);
const questions = await loadQuestions(niche, { city, trade: flag('trade'), problem: flag('problem') });
const total = questions.length * platforms.length;

const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const date = new Date().toISOString().slice(0, 10);

// Never overwrite a completed run's evidence: same-day reruns get an
// attempt-numbered folder (…/2026-08-14, …/2026-08-14-2, …).
let outDir = path.resolve(GEO_ROOT, flag('out') || 'audits', slug, date);
for (let attempt = 2; ; attempt++) {
  const done = await fs.access(path.join(outDir, 'results.json')).then(() => true, () => false);
  if (!done) break;
  outDir = path.resolve(GEO_ROOT, flag('out') || 'audits', slug, `${date}-${attempt}`);
}
const shotsDir = path.join(outDir, 'screenshots');
await fs.mkdir(shotsDir, { recursive: true });

console.log(`\nGEO audit: ${businessName} · ${city} · ${template.label}`);
console.log(`${questions.length} questions × ${platforms.length} platforms = ${total} asks → ${path.relative(process.cwd(), outDir)}\n`);

const startedAt = new Date().toISOString();
const results = [];

const browserFor = {};
await Promise.all(
  platforms.map(async (platformKey) => {
    browserFor[platformKey] = await launchBrowser();
  })
);

// Platforms run in parallel; questions run sequentially within a platform.
// Every ask uses a fresh browser context (no cookies/history carryover).
await Promise.all(
  platforms.map(async (platformKey) => {
    const browser = browserFor[platformKey];
    let unavailable = null; // circuit breaker: quota/bot wall reason
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const qn = i + 1;
      const shotFile = `${slug}_${platformKey}_q${qn}_${date}.jpg`;
      const askedAt = new Date().toISOString();
      if (unavailable) {
        results.push({
          platform: platformKey,
          question: qn,
          text: question,
          askedAt,
          ok: false,
          skipped: true,
          error: `platform unavailable this run: ${unavailable}`,
        });
        console.log(`  [${platformKey} q${qn}/${questions.length}] ⊘ skipped (${unavailable})`);
        continue;
      }
      const res = await askQuestion(browser, platformKey, question, path.join(shotsDir, shotFile));
      if (!res.ok && isPlatformUnavailable(res.error)) unavailable = res.error;
      const row = {
        platform: platformKey,
        question: qn,
        text: question,
        askedAt,
        ok: res.ok,
        screenshot: `screenshots/${shotFile}`,
      };
      if (res.ok) {
        try {
          const analysis = await analyzeAnswer({
            subject: businessName,
            platform: platformLabel(platformKey),
            question,
            answerText: res.answerText,
          });
          Object.assign(row, analysis, { answerChars: res.answerText.length });
        } catch (err) {
          row.ok = false;
          row.error = `analysis failed: ${err.message.split('\n')[0]}`;
        }
      } else {
        row.error = res.error;
      }
      results.push(row);
      const mark = row.ok ? (row.subjectNamed ? '★ NAMED' : '·') : `✗ ${row.error}`;
      console.log(`  [${platformKey} q${qn}/${questions.length}] ${mark}  ${question}`);
    }
    await browser.close();
  })
);

results.sort((a, b) => (a.platform === b.platform ? a.question - b.question : a.platform.localeCompare(b.platform)));

// ---- Score + summary -------------------------------------------------------
const named = results.filter((r) => r.ok && r.subjectNamed);
const failed = results.filter((r) => !r.ok);
const score = `${named.length}/${total}`;

const competitorCounts = {};
for (const r of results) {
  for (const c of r.competitors || []) {
    competitorCounts[c] = (competitorCounts[c] || 0) + 1;
  }
}
const topCompetitors = Object.entries(competitorCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8);

const perPlatform = platforms.map((p) => {
  const rows = results.filter((r) => r.platform === p);
  return { platform: p, named: rows.filter((r) => r.ok && r.subjectNamed).length, failed: rows.filter((r) => !r.ok).length };
});
const biggestGap = [...perPlatform].sort((a, b) => a.named - b.named)[0];

// GHL: report wiring status; write only when wired AND an email was given.
const ghlStatus = await checkGeoScoreField();
let ghlLine;
if (!ghlStatus.wired) {
  ghlLine = `cs_geo_score not wired (${ghlStatus.reason}) — score filed in repo instead`;
} else if (flag('ghl-email')) {
  try {
    const contactId = await writeGeoScore({
      email: flag('ghl-email'),
      businessName,
      fieldId: ghlStatus.fieldId,
      score,
    });
    ghlLine = `cs_geo_score = ${score} written to contact ${contactId} (${flag('ghl-email')})`;
  } catch (err) {
    ghlLine = `cs_geo_score write failed (${err.message.split('\n')[0]}) — score filed in repo instead`;
  }
} else {
  ghlLine = `cs_geo_score field is wired (${ghlStatus.locationName || 'location'}); no --ghl-email given, so score filed in repo only`;
}

const cell = (p, qn) => {
  const r = results.find((x) => x.platform === p && x.question === qn);
  if (!r) return ' ';
  if (!r.ok) return '✗';
  return r.subjectNamed ? '**✓**' : '—';
};

const summary = `# AI Search Visibility Audit — ${businessName}

**${city} · ${template.label} · ${date}**

## Named in ${named.length} of ${total} AI answers.

${topCompetitors.length ? `**Competitors named:** ${topCompetitors.map(([n, c]) => `${n} (${c}×)`).join(', ')}` : '**Competitors named:** none extracted'}
**Biggest gap:** ${platformLabel(biggestGap.platform)} — named in ${biggestGap.named}/${questions.length} answers there.

| # | Money question | ${platforms.map(platformLabel).join(' | ')} |
|---|---|${platforms.map(() => ':---:').join('|')}|
${questions.map((q, i) => `| ${i + 1} | ${q} | ${platforms.map((p) => cell(p, i + 1)).join(' | ')} |`).join('\n')}

✓ = ${businessName} named · — = answered, not named · ✗ = ask failed (counts as not named)
${failed.length ? `\n${failed.length} of ${total} asks failed (${[...new Set(failed.map((f) => platformLabel(f.platform)))].join(', ')}) — details in results.json.` : '\nAll asks completed.'}${(() => {
  const walls = [...new Set(results.filter((r) => r.skipped).map((r) => `${platformLabel(r.platform)} — ${r.error.replace('platform unavailable this run: ', '')}`))];
  return walls.length ? `\nPlatform walls hit this run: ${walls.join('; ')}. Re-run the audit for those once the limit resets.` : '';
})()}

- **Score (cs_geo_score):** ${score}
- **GHL:** ${ghlLine}
- **Evidence:** one screenshot per answer in \`screenshots/\`, full per-question log in \`results.json\`.

*AI recommendations change constantly; these are snapshots, not guarantees.*
`;

const runMeta = {
  subject: businessName,
  city,
  niche,
  label: template.label,
  date,
  startedAt,
  finishedAt: new Date().toISOString(),
  platforms,
  score,
  named: named.length,
  total,
  failedAsks: failed.length,
  ghl: ghlLine,
  results,
};

await fs.writeFile(path.join(outDir, 'results.json'), JSON.stringify(runMeta, null, 2) + '\n');
await fs.writeFile(path.join(outDir, 'summary.md'), summary);

console.log(`\n━━━ ${businessName}: named in ${named.length} of ${total} AI answers (score ${score}) ━━━`);
console.log(`Biggest gap: ${platformLabel(biggestGap.platform)}. Failed asks: ${failed.length}.`);
console.log(`GHL: ${ghlLine}`);
console.log(`\n  summary: ${path.relative(process.cwd(), path.join(outDir, 'summary.md'))}`);
console.log(`  log:     ${path.relative(process.cwd(), path.join(outDir, 'results.json'))}`);
console.log(`  shots:   ${path.relative(process.cwd(), shotsDir)}\n`);
