#!/usr/bin/env node
// GEO report generator (Ops Brief § 03): turns audit runs into a single-file
// HTML report readable by BOTH the client and the manager — plain language,
// before/after, screenshots as proof. Includes the brief's monthly report
// line and a clearly-marked run-notes block for Rozel's QA.
//
//   node src/report.js <slug>            build report for a client's runs
//   node src/report.js                   list slugs that have audit runs
//
// Reads every audits/<slug>/<date>/results.json (chronological), writes
// report.html into the LATEST run's folder, and prints the § 03 dashboard
// line to stdout for pasting into GHL/Slack. Baseline = earliest run,
// current = latest. A score trend renders once two or more runs exist.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GEO_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUDITS = path.join(GEO_ROOT, 'audits');

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const PLATFORM_LABELS = { chatgpt: 'ChatGPT', gemini: 'Gemini', perplexity: 'Perplexity' };
const label = (p) => PLATFORM_LABELS[p] || p;

const slugArg = process.argv[2];
if (!slugArg) {
  const slugs = await fs.readdir(AUDITS).catch(() => []);
  console.log(slugs.length ? `Slugs with audit runs:\n  ${slugs.join('\n  ')}` : 'No audit runs yet.');
  console.log('\nUsage: node src/report.js <slug>');
  process.exit(0);
}

const runDirs = (await fs.readdir(path.join(AUDITS, slugArg)).catch(() => null))?.sort();
if (!runDirs?.length) {
  console.error(`No runs found under audits/${slugArg}/`);
  process.exit(1);
}
const runs = [];
for (const d of runDirs) {
  const p = path.join(AUDITS, slugArg, d, 'results.json');
  try {
    runs.push({ dir: d, ...JSON.parse(await fs.readFile(p, 'utf8')) });
  } catch {
    /* folder without a finished run */
  }
}
if (!runs.length) {
  console.error(`No completed runs (results.json) under audits/${slugArg}/`);
  process.exit(1);
}

const baseline = runs[0];
const current = runs[runs.length - 1];
const currentDir = path.join(AUDITS, slugArg, current.dir);
const month = new Date(current.date + 'T12:00:00Z').toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

// ---- Analysis over the CURRENT run ----------------------------------------
const rows = current.results;
const questions = [...new Set(rows.map((r) => r.text))];
const answered = rows.filter((r) => r.ok);
const hits = answered.filter((r) => r.subjectNamed);
const walls = [...new Set(rows.filter((r) => r.skipped).map((r) => `${label(r.platform)} — ${r.error.replace('platform unavailable this run: ', '')}`))];

const competitorCounts = {};
for (const r of rows) for (const c of r.competitors || []) competitorCounts[c] = (competitorCounts[c] || 0) + 1;
const topCompetitors = Object.entries(competitorCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

const perPlatform = current.platforms.map((p) => {
  const pr = rows.filter((r) => r.platform === p);
  const ok = pr.filter((r) => r.ok);
  const named = ok.filter((r) => r.subjectNamed).length;
  const failed = pr.length - ok.length;
  let note;
  if (failed === pr.length) note = 'Could not be tested this run — it limits automated logged-out questions. It re-tests next cycle.';
  else if (named === 0) note = `Answered ${ok.length} of ${pr.length} questions and never mentioned ${current.subject}.`;
  else note = `Recommends ${current.subject} on ${named} of ${pr.length} questions.`;
  return { platform: p, named, answeredCount: ok.length, total: pr.length, failed, note };
});

// New-this-run wins vs baseline (only meaningful with 2+ runs)
const baselineHitKeys = new Set(
  baseline.results.filter((r) => r.ok && r.subjectNamed).map((r) => `${r.platform}|${r.text}`)
);
const newWins = runs.length > 1 ? hits.filter((r) => !baselineHitKeys.has(`${r.platform}|${r.text}`)) : [];

// ---- The § 03 monthly report line ------------------------------------------
const newWinLine = newWins.length
  ? ` New: recommended by ${label(newWins[0].platform)} for "${newWins[0].text}".`
  : '';
const nextAction =
  walls.length ? `re-test ${walls.map((w) => w.split(' — ')[0]).join(', ')} once its limit resets`
  : hits.length === 0 ? 'publish answer content for the biggest-gap platform'
  : 'continue the monthly content drip and re-test';
const reportLine = `AI VISIBILITY — ${month}. Baseline: named in ${baseline.named}/${baseline.total} AI answers. This month: named in ${current.named}/${current.total}.${newWinLine} Screenshots attached. Next: ${nextAction}.`;

// ---- Proof screenshots (curated, embedded) ---------------------------------
async function embed(row) {
  try {
    const buf = await fs.readFile(path.join(currentDir, row.screenshot));
    return `data:image/jpeg;base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}
const proof = [];
for (const r of hits.slice(0, 4)) {
  const src = await embed(r);
  if (src) proof.push({ src, cls: 'win', caption: `${label(r.platform)} — “${r.text}” — ${current.subject} is named.` });
}
const absences = answered.filter((r) => !r.subjectNamed && (r.businesses || []).length > 0);
for (const r of absences.slice(0, Math.max(2, 6 - proof.length))) {
  if (proof.length >= 6) break;
  const src = await embed(r);
  if (src)
    proof.push({
      src,
      cls: 'gap',
      caption: `${label(r.platform)} — “${r.text}” — others are recommended; ${current.subject} is absent.`,
    });
}

// ---- Trend (renders only with 2+ runs) -------------------------------------
// Single measure over time → bars in one brand hue, direct-labeled, no legend.
function trendSvg() {
  if (runs.length < 2) return '';
  const w = 640, h = 220, pad = 36, bw = Math.min(72, (w - pad * 2) / runs.length - 16);
  const max = Math.max(...runs.map((r) => r.total));
  const bars = runs
    .map((r, i) => {
      const x = pad + (i + 0.5) * ((w - pad * 2) / runs.length) - bw / 2;
      const bh = Math.max(3, (r.named / max) * (h - 70));
      const y = h - 40 - bh;
      return `
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="4" fill="#FFC200" stroke="#111" stroke-width="1"/>
      <text x="${x + bw / 2}" y="${y - 8}" text-anchor="middle" class="tv">${r.named}/${r.total}</text>
      <text x="${x + bw / 2}" y="${h - 18}" text-anchor="middle" class="tl">${r.date}</text>`;
    })
    .join('');
  return `
  <section>
    <h2>Score over time</h2>
    <svg viewBox="0 0 ${w} ${h}" role="img" aria-label="AI visibility score by audit date" style="max-width:${w}px;width:100%">
      <style>.tv{font:600 14px 'Space Mono',monospace;fill:#111}.tl{font:12px sans-serif;fill:#666}</style>
      <line x1="${pad}" y1="${h - 40}" x2="${w - pad}" y2="${h - 40}" stroke="#ddd"/>
      ${bars}
    </svg>
  </section>`;
}

// ---- Question grid ---------------------------------------------------------
const cell = (p, q) => {
  const r = rows.find((x) => x.platform === p && x.text === q);
  if (!r) return '<td class="c">·</td>';
  if (!r.ok) return '<td class="c miss" title="could not be tested this run">✗</td>';
  return r.subjectNamed ? '<td class="c hit">✓</td>' : '<td class="c">—</td>';
};
const grid = `
<table>
  <thead><tr><th>What your customers ask AI</th>${current.platforms.map((p) => `<th class="c">${label(p)}</th>`).join('')}</tr></thead>
  <tbody>
    ${questions.map((q) => `<tr><td>${esc(q)}</td>${current.platforms.map((p) => cell(p, q)).join('')}</tr>`).join('\n    ')}
  </tbody>
</table>
<p class="legend"><span class="hit">✓</span> ${esc(current.subject)} named &nbsp;·&nbsp; — answered, not named &nbsp;·&nbsp; <span class="miss">✗</span> not tested this run</p>`;

// ---- Assemble --------------------------------------------------------------
const pct = current.total ? Math.round((current.named / current.total) * 100) : 0;
const heroMsg =
  current.named === 0
    ? `When customers ask AI who to call, <strong>${esc(current.subject)} is not in the answer yet</strong> — competitors are.`
    : `AI already names ${esc(current.subject)} in ${current.named} answers — the plan below grows that number.`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AI Search Visibility — ${esc(current.subject)} — ${esc(month)}</title>
<style>
  :root { --gold: #FFC200; --ink: #111; --muted: #666; --line: #e5e5e5; --bg: #fff; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Rethink Sans', 'Segoe UI', system-ui, sans-serif; color: var(--ink); background: var(--bg); line-height: 1.55; }
  .wrap { max-width: 860px; margin: 0 auto; padding: 0 24px 48px; }
  header { background: #000; color: #fff; padding: 26px 0; margin-bottom: 36px; border-bottom: 4px solid var(--gold); }
  header .wrap { padding-bottom: 0; }
  .brand { font: 700 13px 'Space Mono', monospace; letter-spacing: .12em; color: var(--gold); text-transform: uppercase; }
  header h1 { font-size: 26px; margin-top: 6px; }
  header .sub { color: #bbb; font-size: 14px; margin-top: 4px; }
  section { margin-bottom: 36px; }
  h2 { font-size: 19px; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid var(--line); }
  .hero { display: flex; gap: 28px; align-items: center; flex-wrap: wrap; background: #faf8f2; border: 1px solid var(--line); border-left: 6px solid var(--gold); border-radius: 10px; padding: 22px 26px; }
  .hero .score { font: 700 44px 'Space Mono', monospace; white-space: nowrap; }
  .hero .score small { font-size: 18px; color: var(--muted); display: block; font-weight: 400; }
  .hero p { max-width: 460px; }
  .tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
  .tile { border: 1px solid var(--line); border-radius: 10px; padding: 16px 18px; }
  .tile .n { font: 700 26px 'Space Mono', monospace; }
  .tile .p { font-weight: 700; margin-bottom: 2px; }
  .tile .note { font-size: 13.5px; color: var(--muted); margin-top: 6px; }
  table { border-collapse: collapse; width: 100%; font-size: 14.5px; }
  th, td { border: 1px solid var(--line); padding: 8px 12px; text-align: left; }
  th { background: #f6f6f6; }
  td.c, th.c { text-align: center; width: 92px; }
  .hit { color: #157f3d; font-weight: 700; }
  .miss { color: #b3261e; }
  .legend { font-size: 13px; color: var(--muted); margin-top: 8px; }
  .comp li { margin-left: 20px; margin-bottom: 4px; }
  .mono { font-family: 'Space Mono', monospace; font-size: 13.5px; background: #111; color: #fff; border-radius: 8px; padding: 14px 18px; overflow-x: auto; }
  .mono b { color: var(--gold); }
  .proof { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 18px; }
  figure { border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
  figure.win { border-color: #157f3d; }
  figure img { width: 100%; height: 340px; object-fit: cover; object-position: top; display: block; }
  figcaption { font-size: 13px; padding: 10px 12px; border-top: 1px solid var(--line); }
  figure.win figcaption { background: #f0f7f2; }
  .notes { background: #f6f6f6; border: 1px dashed #bbb; border-radius: 10px; padding: 16px 20px; font-size: 14px; }
  .notes h2 { border: 0; margin-bottom: 8px; padding: 0; font-size: 15px; text-transform: uppercase; letter-spacing: .06em; }
  .notes li { margin-left: 20px; margin-bottom: 4px; }
  footer { border-top: 2px solid var(--line); padding-top: 16px; font-size: 13px; color: var(--muted); }
  footer .disclaimer { font-style: italic; margin-bottom: 8px; }
  @media print { header { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .proof { grid-template-columns: 1fr 1fr; } }
</style>
</head>
<body>
<header>
  <div class="wrap">
    <div class="brand">Eat 4 Life Marketing · AI Marketing Made Easy</div>
    <h1>AI Search Visibility Report — ${esc(current.subject)}</h1>
    <div class="sub">${esc(current.city)} · ${esc(current.label)} · ${esc(month)}${runs.length > 1 ? ` · audit ${runs.length} (baseline ${esc(baseline.date)})` : ' · baseline audit'}</div>
  </div>
</header>
<div class="wrap">

<section>
  <div class="hero">
    <div class="score">${current.named}<small>of ${current.total} AI answers<br>name ${esc(current.subject)}</small></div>
    <p>We asked <strong>ChatGPT, Gemini, and Perplexity</strong> the ${questions.length} questions your customers actually type when they're ready to buy — fresh sessions, no history, just like a real person. ${heroMsg}</p>
  </div>
</section>

<section>
  <h2>Platform by platform</h2>
  <div class="tiles">
    ${perPlatform.map((pp) => `
    <div class="tile">
      <div class="p">${label(pp.platform)}</div>
      <div class="n">${pp.failed === pp.total ? '—' : `${pp.named}/${pp.total}`}</div>
      <div class="note">${esc(pp.note)}</div>
    </div>`).join('')}
  </div>
</section>

${trendSvg()}

<section>
  <h2>Question by question</h2>
  ${grid}
</section>

${topCompetitors.length ? `
<section>
  <h2>Who AI recommends instead</h2>
  <p>Across all answers this month, these businesses were named — each mention is a customer conversation happening without you:</p>
  <ul class="comp">
    ${topCompetitors.map(([n, c]) => `<li><strong>${esc(n)}</strong> — named ${c}×</li>`).join('\n    ')}
  </ul>
</section>` : ''}

${proof.length ? `
<section>
  <h2>The receipts</h2>
  <p>Exactly what the AI said, captured the moment we asked:</p>
  <div class="proof">
    ${proof.map((s) => `<figure class="${s.cls}"><img src="${s.src}" alt="${esc(s.caption)}"><figcaption>${esc(s.caption)}</figcaption></figure>`).join('\n    ')}
  </div>
</section>` : ''}

<section>
  <h2>Dashboard line</h2>
  <div class="mono"><b>${esc(reportLine)}</b></div>
</section>

<section class="notes">
  <h2>Run notes (ops)</h2>
  <ul>
    <li>Score (cs_geo_score): <strong>${esc(current.score)}</strong> · asks: ${answered.length} answered, ${current.failedAsks} not completed.</li>
    ${walls.length ? walls.map((w) => `<li>Platform limit hit: ${esc(w)}. Those questions count as “not named” and re-test next cycle.</li>`).join('\n    ') : '<li>All platforms tested normally.</li>'}
    ${(() => {
      const api = rows.filter((r) => r.via === 'api').length;
      return api ? `<li>${api} ChatGPT answer(s) captured via the OpenAI API (fresh stateless sessions; chatgpt.com was rate-limited) — their screenshots are labeled evidence cards.</li>` : '';
    })()}
    <li>Next action: ${esc(nextAction)}.</li>
    <li>Full per-question log: <code>results.json</code> · every screenshot: <code>screenshots/</code>.</li>
  </ul>
</section>

<footer>
  <div class="disclaimer">AI recommendations change constantly; these are snapshots, not guarantees. Figures are directional, drawn from live answers on the dates shown.</div>
  Prepared by Eat 4 Life Marketing · AI Marketing Made Easy · chosen1@gsgagency.com
</footer>
</div>
</body>
</html>
`;

const outPath = path.join(currentDir, 'report.html');
await fs.writeFile(outPath, html);
console.log(`report: ${path.relative(process.cwd(), outPath)}`);
console.log(`\n${reportLine}`);
