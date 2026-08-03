#!/usr/bin/env node
// Polls GHL for new "Voice AI Demo Request" form submissions and processes
// them. Two modes, run in sequence by the poll-submissions workflow:
//   --build  build a demo for each new submission; record pending emails
//            to a runtime file (never committed — lead PII stays out of git)
//   --email  send the outreach email for each pending entry (waits for the
//            deployed page to be live)
//   --dry    parse and print new submissions without building anything
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ghl, creds } from './ghl.js';
import { slugFromUrl } from './slug.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const STATE_PATH = path.join(ROOT, 'demos', 'processed-submissions.json');
const PENDING_PATH = path.join(os.tmpdir(), 'voice-demo-pending-emails.json');
const FORM_NAME = process.env.DEMO_FORM_NAME || 'Voice AI Demo Request';

const mode = process.argv[2] || '--dry';

async function readJson(p, fallback) {
  try {
    return JSON.parse(await fs.readFile(p, 'utf8'));
  } catch {
    return fallback;
  }
}

function extractFields(sub, fieldNames = {}) {
  // Submissions carry answers in `others` keyed by generated field IDs.
  // Resolve IDs to their configured names, then match tolerantly; fall back
  // to value shapes.
  const raw = { email: sub.email, ...((sub.others && typeof sub.others === 'object') ? sub.others : {}) };
  const flat = {};
  for (const [k, v] of Object.entries(raw)) flat[fieldNames[k] || k] = v;
  let website, email, rep;
  for (const [k, v] of Object.entries(flat)) {
    if (typeof v !== 'string' || !v.trim()) continue;
    const key = k.toLowerCase();
    const val = v.trim();
    if (!website && (key.includes('website') || key.includes('site') || /^https?:\/\//i.test(val))) {
      if (/^(https?:\/\/)?[a-z0-9][a-z0-9.-]*\.[a-z]{2,}/i.test(val)) website = val.startsWith('http') ? val : `https://${val}`;
    } else if (!rep && key.includes('rep')) {
      rep = val;
    } else if (!email && (key.includes('email') || /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(val))) {
      email = val;
    }
  }
  if (!email && sub.email) email = sub.email;
  return { website, email, rep };
}

creds();
const { locationId } = { locationId: process.env.GHL_LOCATION_ID };

const { forms } = await ghl('GET', `/forms/?locationId=${locationId}&limit=50`);
const form = forms.find((f) => f.name.trim().toLowerCase() === FORM_NAME.trim().toLowerCase());
if (!form) {
  console.log(`Form "${FORM_NAME}" not found in GHL yet — nothing to do.`);
  process.exit(0);
}

if (mode === '--email') {
  const pending = await readJson(PENDING_PATH, []);
  if (!pending.length) {
    console.log('No pending outreach emails.');
    process.exit(0);
  }
  const state = await readJson(STATE_PATH, {});
  for (const p of pending) {
    try {
      execFileSync('node', ['src/send-email.js', p.website, p.email, ...(p.rep ? [`--rep=${p.rep}`] : [])], {
        cwd: ROOT,
        stdio: 'inherit',
      });
      if (state[p.id]) state[p.id].status = 'emailed';
    } catch {
      console.error(`! email failed for submission ${p.id} — will show as built, not emailed`);
    }
  }
  await fs.writeFile(STATE_PATH, JSON.stringify(state, null, 2) + '\n');
  await fs.rm(PENDING_PATH, { force: true });
  process.exit(0);
}

const res = await ghl(
  'GET',
  `/forms/submissions?locationId=${locationId}&formId=${form.id}&limit=100`
);
const submissions = res.submissions || [];
const state = await readJson(STATE_PATH, {});
const fresh = submissions.filter((s) => !state[s.id]);
console.log(`${submissions.length} submission(s) on "${form.name}", ${fresh.length} new`);

const { customFields } = await ghl('GET', `/locations/${locationId}/customFields`);
const fieldNames = Object.fromEntries(customFields.map((f) => [f.id, f.name]));

if (mode === '--dry') {
  for (const s of fresh) console.log(s.id, extractFields(s, fieldNames));
  process.exit(0);
}

const pending = [];
for (const s of fresh.reverse()) {
  const { website, email, rep } = extractFields(s, fieldNames);
  if (!website) {
    console.error(`! submission ${s.id}: no website found — marking skipped`);
    state[s.id] = { status: 'skipped', reason: 'no website field' };
    continue;
  }
  const slug = slugFromUrl(website);
  console.log(`▸ building ${website} (rep: ${rep || 'none'})`);
  try {
    execFileSync('node', ['src/cli.js', website, '--push', ...(rep ? [`--rep=${rep}`] : [])], {
      cwd: ROOT,
      stdio: 'inherit',
      env: process.env,
    });
    state[s.id] = { status: 'built', slug, rep: rep || null, builtAt: new Date().toISOString() };
    if (email) pending.push({ id: s.id, website, email, rep });
  } catch {
    console.error(`! build failed for ${website} — marked failed, will not retry`);
    state[s.id] = { status: 'failed', slug, reason: 'build error' };
  }
}

await fs.writeFile(STATE_PATH, JSON.stringify(state, null, 2) + '\n');
await fs.writeFile(PENDING_PATH, JSON.stringify(pending, null, 2));
console.log(`Done: ${pending.length} email(s) pending post-deploy.`);
