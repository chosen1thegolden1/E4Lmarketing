#!/usr/bin/env node
// Sends the outreach email for an already-built demo, after waiting for the
// public page to go live. Run by the GitHub workflow after the Pages deploy,
// or manually: node src/send-email.js <website-url> <lead-email> [--rep=X]
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { slugFromUrl } from './slug.js';
import { upsertLead } from './crm.js';
import { renderOutreachEmail, sendOutreachEmail } from './email.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEMOS_DIR = path.join(__dirname, '..', 'demos');

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const [websiteUrl, leadEmail] = args.filter((a) => !a.startsWith('--'));
const rep = flag('rep');

if (!websiteUrl || !leadEmail) {
  console.error('Usage: node src/send-email.js <website-url> <lead-email> [--rep=X]');
  process.exit(1);
}

const baseUrl = process.env.DEMO_BASE_URL?.replace(/\/+$/, '');
if (!baseUrl) {
  console.error('DEMO_BASE_URL must be set so the email can link to the live page.');
  process.exit(1);
}

const slug = slugFromUrl(websiteUrl);
const demoUrl = `${baseUrl}/${slug}/`;
const data = JSON.parse(await fs.readFile(path.join(DEMOS_DIR, slug, 'data.json'), 'utf8'));

// Wait for the deployed page (Pages deploy runs in parallel) — up to ~4 min.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let live = false;
for (let i = 0; i < 24; i++) {
  try {
    const res = await fetch(demoUrl, { method: 'HEAD' });
    if (res.ok) {
      live = true;
      break;
    }
  } catch {
    /* not up yet */
  }
  await sleep(10_000);
}
if (!live) {
  console.error(`Page never went live at ${demoUrl} — not sending the email.`);
  process.exit(1);
}
console.log(`✓ page live: ${demoUrl}`);

const contact = await upsertLead({
  email: leadEmail,
  business: data.business.name,
  website: websiteUrl,
  demoUrl,
  demoPhone: data._demoPhone,
  rep,
});
const { subject, html } = renderOutreachEmail(data, demoUrl);
await sendOutreachEmail({ contactId: contact.id, subject, html });
console.log(`✓ outreach email sent to ${leadEmail} (contact ${contact.id})`);
console.log(`  subject: ${subject}`);
