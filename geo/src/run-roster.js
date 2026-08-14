#!/usr/bin/env node
// Monthly GEO loop driver: run the audit + report for every client in
// clients.json (Ops Brief § 01, steps 6–7). One client failing never stops
// the rest; the summary of what ran (and the § 03 dashboard lines) prints at
// the end so the calling workflow can post it.
//
// Roster entry: { name, city, niche, trade?, problem?, ghlEmail? }

import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const GEO_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const roster = JSON.parse(await fs.readFile(path.join(GEO_ROOT, 'clients.json'), 'utf8'));

if (!roster.length) {
  console.log('clients.json is empty — nothing to run.');
  process.exit(0);
}

const lines = [];
let failures = 0;
for (const c of roster) {
  const args = ['src/audit.js', c.name, c.city, c.niche];
  if (c.trade) args.push(`--trade=${c.trade}`);
  if (c.problem) args.push(`--problem=${c.problem}`);
  if (c.ghlEmail) args.push(`--ghl-email=${c.ghlEmail}`);
  const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  console.log(`\n════ ${c.name} (${c.niche}) ════`);
  try {
    execFileSync('node', args, { cwd: GEO_ROOT, stdio: 'inherit' });
    const out = execFileSync('node', ['src/report.js', slug], { cwd: GEO_ROOT, encoding: 'utf8' });
    process.stdout.write(out);
    const line = out.split('\n').find((l) => l.startsWith('AI VISIBILITY'));
    if (line) lines.push(`${c.name}: ${line}`);
  } catch (err) {
    failures++;
    console.error(`! ${c.name} failed: ${err.message.split('\n')[0]} — continuing with next client`);
    lines.push(`${c.name}: RUN FAILED — needs a manual re-run (see workflow log)`);
  }
}

console.log('\n──── monthly loop done ────');
for (const l of lines) console.log(l);
if (failures) console.log(`${failures} client(s) failed — Rozel: re-run those manually.`);
