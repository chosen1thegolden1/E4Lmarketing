#!/usr/bin/env node
// Answer-content generator (Ops Brief § 03, steps 3 & 5): one page per money
// question, written to be the answer an AI can lift.
//
//   node src/content.js <client-slug> --all       setup batch: every question without a page
//   node src/content.js <client-slug> --drip=2    monthly drip: next N uncovered questions (default 2)
//   node src/content.js <client-slug> --question=3  regenerate one specific question (1-7)
//
// Requirements per client (both in the repo):
//   geo/clients.json entry           — name, city, niche (+ optional bookingUrl, trade, problem)
//   geo/clients/<slug>/intake.md     — the client's voice: services, differentiators,
//                                      proof points, tone. Pages are grounded ONLY in
//                                      this file — no invented reviews, stats, or claims.
//
// Output: geo/content/<slug>/<qNN-slug>.html — a standalone, client-branded page:
// H1 = the money question verbatim (city included), first 2–3 sentences answer it
// directly (the quotable block), then process/pricing-approach/proof sections,
// FAQPage JSON-LD, and a booking CTA. geo/content/<slug>/manifest.json tracks
// which questions are covered so the drip never repeats itself.
//
// These are DRAFTS. Rozel QAs every page before it goes on a client site —
// the generator never publishes anything.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { loadQuestions, loadTemplate } from './questions.js';

const GEO_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODEL_CANDIDATES = ['claude-sonnet-5', 'claude-sonnet-4-5', 'claude-sonnet-4-5-20250929'];

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const slug = args.find((a) => !a.startsWith('--'));
if (!slug) {
  console.log('Usage: node src/content.js <client-slug> [--all | --drip=N | --question=N]');
  process.exit(1);
}

const roster = JSON.parse(await fs.readFile(path.join(GEO_ROOT, 'clients.json'), 'utf8'));
const toSlug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const client = roster.find((c) => toSlug(c.name) === slug);
if (!client) {
  console.error(`No clients.json entry matching slug "${slug}". Slugs: ${roster.map((c) => toSlug(c.name)).join(', ')}`);
  process.exit(1);
}

const intakePath = path.join(GEO_ROOT, 'clients', slug, 'intake.md');
let intake;
try {
  intake = await fs.readFile(intakePath, 'utf8');
} catch {
  console.error(`Missing intake doc: geo/clients/${slug}/intake.md — pages must be written in the client's voice, never generic. Create it first (services, differentiators, proof points, tone).`);
  process.exit(1);
}

const template = await loadTemplate(client.niche);
const questions = await loadQuestions(client.niche, {
  city: client.city,
  trade: client.trade,
  problem: client.problem,
});

const outDir = path.join(GEO_ROOT, 'content', slug);
await fs.mkdir(outDir, { recursive: true });
const manifestPath = path.join(outDir, 'manifest.json');
let manifest = {};
try {
  manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
} catch {
  /* first run */
}

// Pick which questions to write this invocation.
const qArg = flag('question');
let picks;
if (qArg) {
  const i = Number(qArg) - 1;
  if (!(i >= 0 && i < questions.length)) {
    console.error(`--question must be 1-${questions.length}`);
    process.exit(1);
  }
  picks = [i];
} else {
  const uncovered = questions.map((_, i) => i).filter((i) => !manifest[`q${i + 1}`]);
  if (!uncovered.length) {
    console.log(`All ${questions.length} money questions already have pages for ${client.name}. Use --question=N to regenerate one.`);
    process.exit(0);
  }
  picks = args.includes('--all') ? uncovered : uncovered.slice(0, Number(flag('drip') || 2));
}

function buildPrompt(question) {
  return `You are writing a web page for a local business. The page's single job: be the best, most direct answer on the internet to one question customers ask AI assistants and search engines.

The business (write in THEIR voice, grounded ONLY in this intake — do not invent reviews, statistics, awards, years, or claims that are not in it):

<intake>
${intake}
</intake>

Business name: ${client.name}
Location: ${client.city}
Industry: ${template.label}

The question this page answers (this exact text will be the H1): "${question}"

Return ONLY a JSON object (no markdown fences):
{
  "metaDescription": "under 155 chars, contains the question's intent and the business name",
  "directAnswer": "2-3 sentences that answer the question directly and completely, naming the business — the quotable block an AI can lift verbatim. No throat-clearing, no 'great question'.",
  "sections": [
    {"heading": "...", "body": "2-5 sentences"}
    // 3-4 sections: how the business approaches this (process), what it costs (APPROACH and ranges only if the intake gives them — never promises or exact quotes), why people choose them (proof from intake only), and anything locally specific
  ],
  "faqs": [
    {"q": "...", "a": "..."}
    // exactly 3 related questions a customer would ask next, with direct 1-3 sentence answers, grounded in the intake
  ],
  "ctaText": "one short sentence inviting the reader to book/call, in the business's voice"
}

Hard rules: never promise results, rankings, or outcomes. Never fabricate testimonials or numbers. Plain, confident, local language — no marketing fluff, no exclamation points. If the intake lacks material for a section, write less rather than inventing.`;
}

function parseJson(text) {
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) t = fence[1].trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('no JSON in model response');
  return JSON.parse(t.slice(start, end + 1));
}

async function generate(question) {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.LLM_API_KEY;
  if (!apiKey) throw new Error('Set ANTHROPIC_API_KEY (or LLM_API_KEY).');
  const client_ = new Anthropic({ apiKey, baseURL: 'https://api.anthropic.com' });
  let lastErr;
  for (const model of MODEL_CANDIDATES) {
    try {
      const msg = await client_.messages.create({
        model,
        max_tokens: 3000,
        messages: [{ role: 'user', content: buildPrompt(question) }],
      });
      const out = parseJson(msg.content.filter((b) => b.type === 'text').map((b) => b.text).join(''));
      for (const k of ['directAnswer', 'sections', 'faqs', 'ctaText']) {
        if (!out[k]) throw new Error(`model response missing "${k}"`);
      }
      return out;
    } catch (err) {
      if (err instanceof Anthropic.NotFoundError) {
        lastErr = err;
        continue;
      }
      throw err;
    }
  }
  throw lastErr ?? new Error('no usable Claude model');
}

function renderPage(question, c) {
  const booking = client.bookingUrl || `mailto:${client.contactEmail || ''}` || '#book';
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: c.directAnswer } },
      ...c.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    ],
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(question)} — ${esc(client.name)}</title>
<meta name="description" content="${esc(c.metaDescription)}">
<script type="application/ld+json">
${JSON.stringify(faqLd, null, 2)}
</script>
<style>
  body { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; color: #1c2530; line-height: 1.65; margin: 0; background: #fff; }
  main { max-width: 720px; margin: 0 auto; padding: 40px 22px 64px; }
  h1 { font-size: clamp(26px, 4.5vw, 36px); line-height: 1.2; }
  .answer { font-size: 18px; background: #f6f8fa; border-left: 4px solid #2a6df4; padding: 16px 20px; border-radius: 0 10px 10px 0; margin: 22px 0 30px; }
  h2 { font-size: 21px; margin-top: 34px; }
  .faq h3 { font-size: 17px; margin-bottom: 4px; }
  .cta { margin-top: 40px; background: #1c2530; color: #fff; border-radius: 12px; padding: 26px; text-align: center; }
  .cta a { display: inline-block; margin-top: 12px; background: #2a6df4; color: #fff; text-decoration: none; font-weight: 700; padding: 12px 28px; border-radius: 999px; }
</style>
</head>
<body>
<main>
  <h1>${esc(question)}</h1>
  <p class="answer">${esc(c.directAnswer)}</p>
  ${c.sections.map((s) => `<h2>${esc(s.heading)}</h2>\n  <p>${esc(s.body)}</p>`).join('\n  ')}
  <section class="faq">
    <h2>Related questions</h2>
    ${c.faqs.map((f) => `<h3>${esc(f.q)}</h3>\n    <p>${esc(f.a)}</p>`).join('\n    ')}
  </section>
  <div class="cta">
    <p>${esc(c.ctaText)}</p>
    <a href="${esc(booking)}">Book now</a>
  </div>
</main>
</body>
</html>
`;
}

console.log(`\nAnswer content for ${client.name} (${template.label}) — ${picks.length} page(s):`);
for (const i of picks) {
  const question = questions[i];
  process.stdout.write(`  q${i + 1}: "${question}" ... `);
  const c = await generate(question);
  const file = `q${String(i + 1).padStart(2, '0')}-${toSlug(question).slice(0, 60)}.html`;
  await fs.writeFile(path.join(outDir, file), renderPage(question, c));
  manifest[`q${i + 1}`] = { question, file, generatedAt: new Date().toISOString() };
  console.log(`✓ ${file}`);
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

const covered = Object.keys(manifest).length;
console.log(`\n${covered}/${questions.length} money questions now have pages → geo/content/${slug}/`);
console.log('Drafts only — Rozel QAs each page before it goes on the client site.');
