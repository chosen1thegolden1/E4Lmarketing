#!/usr/bin/env node
// Lead list generator + cold outreach drafter.
//
// DRAFT MODE:
//   npm run leads -- --industry="med spa" --city="Austin" --count=20
//   -> Pulls leads from Google Places, scrapes each site for email + a blurb,
//      drafts a personalized cold email with Claude, upserts each as a GHL
//      contact tagged status:drafted, writes leads-out/YYYY-MM-DD-slug.csv
//      for Rozel to review.
//
// SEND MODE:
//   npm run leads -- --send --file=leads-out/2026-08-11-med-spa-austin.csv
//   -> Reads the reviewed CSV. Sends only rows where Send? column is TRUE.
//      Updates contact tag from status:drafted -> status:sent.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchPlaces } from './leads/places.js';
import { scrapeLight } from './leads/scrape-light.js';
import { draftEmail } from './leads/draft.js';
import { toCsv, fromCsv, HEADERS } from './leads/csv.js';
import { upsertLeadContact, markSent, removeDraftTag } from './leads/ghl-contacts.js';
import { sendOutreachEmail } from './email.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'leads-out');
const DEFAULT_SCORECARD = process.env.SCORECARD_URL || 'https://e4lmarketingdemos.com/scorecard';

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const has = (name) => args.includes(`--${name}`);

function usage() {
  console.log(`
Usage:
  npm run leads -- --industry="med spa" --city="Austin" --count=20
  npm run leads -- --send --file=leads-out/<file>.csv

Options:
  --industry=STR         industry keyword (e.g. "med spa", "roofing", "dental")
  --city=STR             city or metro (e.g. "Austin", "Los Angeles")
  --count=N              how many leads to pull (default 20, max 60)
  --scorecard-url=URL    override the scorecard link (default: ${DEFAULT_SCORECARD})
  --push                 also upsert each lead into GHL as a draft contact (default: on)
  --no-push              skip GHL upsert (dry CSV only)
  --send                 SEND MODE: read a reviewed CSV and send approved rows
  --file=PATH            (SEND MODE) path to the reviewed CSV
`);
  process.exit(1);
}

const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const truthy = (v) => /^(true|yes|y|1|x|✓|✔)$/i.test(String(v || '').trim());

async function drive() {
  const industry = flag('industry');
  const city = flag('city');
  const count = Math.min(60, Math.max(1, parseInt(flag('count') || '20', 10)));
  const scorecardUrl = flag('scorecard-url') || DEFAULT_SCORECARD;
  const push = !has('no-push');
  if (!industry || !city) usage();

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_PLACES_API_KEY missing in env');

  console.log(`\n▸ Searching Google Places for "${industry} in ${city}" (target: ${count}) ...`);
  const places = await searchPlaces({
    apiKey,
    query: `${industry} in ${city}`,
    count: Math.ceil(count * 1.4), // over-fetch, we drop rows with no email
    skipChains: true,
  });
  console.log(`  ✓ ${places.length} candidates (chains + no-website filtered out)\n`);

  await fs.mkdir(OUT_DIR, { recursive: true });
  const rows = [];
  let processed = 0;

  for (const p of places) {
    if (rows.length >= count) break;
    processed++;
    process.stdout.write(`  ${processed}. ${p.name} ... `);

    const scrape = await scrapeLight(p.website);
    if (!scrape.email) {
      console.log(`skipped (no email on site${scrape.error ? `; ${scrape.error}` : ''})`);
      continue;
    }

    let draft;
    try {
      draft = await draftEmail({ industry, scorecardUrl, business: p, city, scrape });
    } catch (err) {
      console.log(`skipped (draft failed: ${err.message.slice(0, 60)})`);
      continue;
    }

    let ghlId = '';
    if (push) {
      try {
        ghlId = await upsertLeadContact({
          lead: { ...p, email: scrape.email },
          draft,
          industry,
          city,
          status: 'drafted',
        });
      } catch (err) {
        console.log(`GHL upsert failed (${err.message.slice(0, 60)}) — CSV still written`);
      }
    }

    rows.push({
      'Send?': '',
      Business: p.name,
      Website: p.website,
      Email: scrape.email,
      Phone: p.phone,
      City: city,
      Rating: p.rating ?? '',
      Reviews: p.reviewCount ?? '',
      Subject: draft.subject,
      Body: draft.body,
      Notes: '',
      Status: 'drafted',
      PlaceId: p.placeId,
      GhlContactId: ghlId || '',
    });
    console.log(`✓ drafted → ${scrape.email}`);
  }

  const date = new Date().toISOString().slice(0, 10);
  const filename = `${date}-${slugify(industry)}-${slugify(city)}.csv`;
  const out = path.join(OUT_DIR, filename);
  await fs.writeFile(out, toCsv(rows));

  console.log(`\n${rows.length} drafts ready.`);
  console.log(`\nCSV:  ${path.relative(process.cwd(), out)}`);
  console.log(`Next: share the CSV with Rozel. She checks the "Send?" box on the good ones and`);
  console.log(`      returns it. Then run:  npm run leads -- --send --file=${path.relative(process.cwd(), out)}\n`);
}

async function send() {
  const file = flag('file');
  if (!file) usage();
  const csvText = await fs.readFile(file, 'utf8');
  const rows = fromCsv(csvText);
  const approved = rows.filter((r) => truthy(r['Send?']));
  console.log(`\n▸ ${rows.length} rows in file · ${approved.length} approved for send\n`);

  let ok = 0;
  let fail = 0;
  for (const r of approved) {
    process.stdout.write(`  ${r.Business} (${r.Email}) ... `);
    if (!r.GhlContactId) {
      console.log(`skip — no GHL contact id in row (was the draft mode run with --no-push?)`);
      fail++;
      continue;
    }
    try {
      await sendOutreachEmail({
        contactId: r.GhlContactId,
        subject: r.Subject,
        html: r.Body.split(/\r?\n\r?\n/)
          .map((p) => `<p>${p.replace(/\r?\n/g, '<br>').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</p>`)
          .join(''),
      });
      await markSent(r.GhlContactId);
      await removeDraftTag(r.GhlContactId);
      console.log(`sent ✓`);
      ok++;
    } catch (err) {
      console.log(`failed (${err.message.slice(0, 80)})`);
      fail++;
    }
  }
  console.log(`\nDone. ${ok} sent, ${fail} failed.`);
}

if (has('send')) await send();
else await drive();
