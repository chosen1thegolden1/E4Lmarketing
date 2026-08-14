// Money-question template loader for the GEO audit script (Ops Brief § 02).
//
// Templates live in geo/money-questions/, one JSON file per niche, 7
// questions each. Placeholders use [brackets]: every niche uses [city];
// the generic home-services pattern also needs [trade] and [problem].
//
//   import { loadQuestions } from './questions.js';
//   const qs = await loadQuestions('med-spa', { city: 'Newport Beach' });
//
// CLI preview (what the audit will ask, before wiring the platforms):
//   node src/questions.js <niche> <city> [trade] [problem]
//   node src/questions.js            # lists available niches

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const QUESTIONS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'money-questions');

export async function listNiches() {
  const files = await fs.readdir(QUESTIONS_DIR);
  return files
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
    .sort();
}

export async function loadTemplate(niche) {
  const file = path.join(QUESTIONS_DIR, `${niche}.json`);
  let raw;
  try {
    raw = await fs.readFile(file, 'utf8');
  } catch {
    throw new Error(`Unknown niche "${niche}". Available: ${(await listNiches()).join(', ')}`);
  }
  return JSON.parse(raw);
}

// Fill [placeholders] with values. Throws if a needed value is missing, so a
// half-filled question can never reach an AI platform.
export function fillQuestions(template, vars = {}) {
  return template.questions.map((q) => {
    const filled = q.replace(/\[([a-z-]+)\]/gi, (_, name) => {
      const v = vars[name];
      if (!v) {
        throw new Error(
          `Template "${template.niche}" needs a value for [${name}] (question: "${q}")`
        );
      }
      return v;
    });
    return filled;
  });
}

export async function loadQuestions(niche, vars) {
  return fillQuestions(await loadTemplate(niche), vars);
}

// CLI preview mode
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [niche, city, trade, problem] = process.argv.slice(2);
  if (!niche) {
    console.log('Niches:', (await listNiches()).join(', '));
    console.log('Usage: node src/questions.js <niche> <city> [trade] [problem]');
    process.exit(0);
  }
  const qs = await loadQuestions(niche, { city, trade, problem });
  qs.forEach((q, i) => console.log(`${i + 1}. ${q}`));
}
