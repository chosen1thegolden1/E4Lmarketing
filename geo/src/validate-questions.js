// Validates every money-question template. Run after any edit:
//   npm run validate   (from geo/)
//
// Checks: valid JSON, required fields, exactly 7 questions, niche matches
// filename, every bracket token in a question is a declared placeholder,
// every declared placeholder is actually used, [city] present in every
// question (the brief requires location phrased into the question).
// A template may set "allowNonLocal": true to relax the per-question [city]
// rule (e.g. marketing-agency mixes national AI-niche intent with local);
// [city] must still appear in at least one question.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const QUESTIONS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'money-questions');
const QUESTIONS_PER_NICHE = 7;

const errors = [];
const files = (await fs.readdir(QUESTIONS_DIR)).filter((f) => f.endsWith('.json')).sort();

for (const file of files) {
  const fail = (msg) => errors.push(`${file}: ${msg}`);
  let t;
  try {
    t = JSON.parse(await fs.readFile(path.join(QUESTIONS_DIR, file), 'utf8'));
  } catch (err) {
    fail(`invalid JSON — ${err.message}`);
    continue;
  }

  for (const field of ['niche', 'label', 'placeholders', 'questions']) {
    if (!t[field]) fail(`missing "${field}"`);
  }
  if (!t.questions) continue;

  if (t.niche !== file.replace(/\.json$/, '')) fail(`niche "${t.niche}" does not match filename`);
  if (t.questions.length !== QUESTIONS_PER_NICHE) {
    fail(`${t.questions.length} questions — the audit spec requires exactly ${QUESTIONS_PER_NICHE} (score is X/21 across 3 platforms)`);
  }
  if (new Set(t.questions).size !== t.questions.length) fail('duplicate questions');

  const declared = new Set(t.placeholders || []);
  const used = new Set();
  if (t.allowNonLocal && !t.questions.some((q) => q.includes('[city]'))) {
    fail('allowNonLocal template must still use [city] in at least one question');
  }
  for (const q of t.questions) {
    if (!t.allowNonLocal && !q.includes('[city]')) fail(`question lacks [city]: "${q}"`);
    for (const m of q.matchAll(/\[([a-z-]+)\]/gi)) {
      used.add(m[1]);
      if (!declared.has(m[1])) fail(`undeclared placeholder [${m[1]}] in "${q}"`);
    }
  }
  for (const p of declared) {
    if (!used.has(p)) fail(`declared placeholder [${p}] never used`);
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`✓ ${files.length} niche template(s) valid, ${QUESTIONS_PER_NICHE} questions each: ${files.map((f) => f.replace(/\.json$/, '')).join(', ')}`);
