#!/usr/bin/env node
// Revenue Leak Scorecard PDF: turns one scorecard submission into a branded
// PDF and hands it back to GHL, which sends the email.
//
// Flow: lead submits the scorecard page -> GHL CS-Scorecard-Intake workflow
// -> repository_dispatch "scorecard_submitted" -> this script:
//   1. render the lead's results to HTML, print to PDF with headless Chrome
//   2. upload the PDF to the GHL media library
//   3. write its URL to the contact's cs_scorecard_pdf_url custom field
//   4. re-add the cs-scorecard-pdf-ready tag (remove first, so a repeat
//      submission fires GHL's "tag added" trigger again)
// GHL's own workflow, triggered by that tag, sends the email. The wording of
// the email lives in GHL, not here.
//
//   node scorecard/build-pdf.js                payload from $SCORECARD_PAYLOAD
//   node scorecard/build-pdf.js payload.json   payload from a file
//   DRY_RUN=1 ...                              build the PDF only, skip GHL
//
// No npm dependencies: Node 20+ fetch/FormData and the runner's Chrome.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(HERE, 'out');
const GHL = 'https://services.leadconnectorhq.com';
const PDF_URL_FIELD = 'contact.cs_scorecard_pdf_url';
const READY_TAG = 'cs-scorecard-pdf-ready';
const BOOKING_URL =
  process.env.SCORECARD_BOOKING_URL ||
  'mailto:chosen1@gsgagency.com?subject=Revenue%20Leak%20Scorecard%20%E2%80%94%20Game%20Plan%20Call';
const PHONE = process.env.SCORECARD_PHONE || '323-772-7075';

// ---- payload ---------------------------------------------------------------

async function readPayload() {
  const raw = process.argv[2]
    ? await fs.readFile(process.argv[2], 'utf8')
    : process.env.SCORECARD_PAYLOAD;
  if (!raw || !raw.trim()) throw new Error('No payload: set SCORECARD_PAYLOAD or pass a JSON file');
  const p = JSON.parse(raw);
  // GHL sends { contact_id, lead: {...} }; accept a flat object too.
  return { contactId: clean(p.contact_id), lead: p.lead && typeof p.lead === 'object' ? p.lead : p };
}

// A GHL merge tag that didn't resolve arrives literally ("{{contact.id}}").
function clean(v) {
  const s = String(v ?? '').trim();
  return /^\{\{.*\}\}$/.test(s) ? '' : s;
}

function num(v) {
  const n = Number(clean(v).replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---- content (mirrors revenue-leak-scorecard-GHL.html) --------------------

const INDUSTRY_NOTES = {
  'Med Spa / Aesthetics': 'med spas',
  'Home Services (HVAC, plumbing, roofing)': 'the trades',
  'Dental / Medical': 'practices',
  'Law Firm': 'firms',
  'Fitness / Wellness': 'studios',
  'Salon / Barbershop': 'shops',
  'Real Estate': 'teams',
};

const LEAKS = [
  {
    key: 'missed_calls',
    name: 'Missed calls',
    what: 'Callers who never rang back after voicemail picked up.',
    fix: 'Answer every call: an AI voice agent picks up 24/7, books the appointment, and texts back anyone who hangs up.',
  },
  {
    key: 'slow_response',
    name: 'Slow response',
    what: 'Leads that chose whoever answered first.',
    fix: 'Reply to every web lead and DM in under 60 seconds, automatically, day or night.',
  },
  {
    key: 'dead_database',
    name: 'Dead database',
    what: 'Past customers and old leads nobody is talking to.',
    fix: 'Run a reactivation campaign to the list you already have. It is the cheapest revenue you will ever find.',
  },
  {
    key: 'no_shows',
    name: 'No-shows',
    what: 'Booked revenue that never walked in, and never got rescheduled.',
    fix: 'Automated reminders before every appointment, and a reschedule chase for anyone who misses.',
  },
  {
    key: 'follow_up',
    name: 'Follow-up drop-off',
    what: 'Deals that needed touch #4 and #5, and got touch #1.',
    fix: 'A five-plus touch follow-up sequence that runs itself, so nobody falls through the cracks.',
  },
];

function tierCopy(tier, dbSize, industry) {
  const db = dbSize.toLocaleString('en-US');
  const note = INDUSTRY_NOTES[industry] || 'businesses like yours';
  switch (tier) {
    case 'OWN':
      return `You're leaking on every front at real volume. <b>Own</b> puts an AI voice agent on every call, a chatbot on every message, monthly reactivation on your database of ${db}, and revenue attribution so you can see every recovered dollar. We run the entire front of house.`;
    case 'ACCELERATE':
      return `Your biggest money is the follow-up gap and the ${db} contacts sitting cold. <b>Accelerate</b> adds 24/7 chat capture, quarterly database reactivation, and automated estimate-chasing on top of the full Recover system. This is where most ${note} land.`;
    case 'RECOVER':
      return `Your leak is concentrated where it always starts: the phone and the follow-up. <b>Recover</b> installs the catch-net: an AI voice agent on every call, 60-second response on every inquiry, automated booking and no-show chase. Stop the bleeding first.`;
    default:
      return '';
  }
}

function gradeClass(grade) {
  if (/TIGHT/i.test(grade)) return 'good';
  if (/LEAK/i.test(grade)) return 'warn';
  return 'bad';
}

export function renderHtml({ lead, date = new Date() }) {
  const first = clean(lead.first_name) || 'there';
  const company = clean(lead.company_name);
  const industry = clean(lead.industry);
  const monthly = num(lead.leak_monthly);
  const annual = num(lead.leak_annual) || monthly * 12;
  const grade = clean(lead.grade).toUpperCase();
  const tier = clean(lead.recommended_tier).toUpperCase();
  const dbSize = num(lead.database_size);

  const leaks = LEAKS.map((l) => ({ ...l, amount: num(lead[`leak_${l.key}`]) }));
  const hasBreakdown = leaks.some((l) => l.amount > 0);
  const ranked = hasBreakdown ? [...leaks].sort((a, b) => b.amount - a.amount) : leaks;

  const when = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const preparedFor = company ? `${esc(first)} · ${esc(company)}` : esc(first);

  const leakRows = ranked
    .map((l, i) => {
      const sealed = hasBreakdown && l.amount < 50;
      const amt = !hasBreakdown ? '' : sealed ? '<span class="sealed">✓ sealed</span>' : `${money(l.amount)}<small>/mo</small>`;
      return `<tr class="${sealed ? 'is-sealed' : ''}">
        <td class="rank">${hasBreakdown ? String(i + 1).padStart(2, '0') : '•'}</td>
        <td><div class="ln">${esc(l.name)}${hasBreakdown ? '' : ` <span class="lw" style="font-weight:400">· ${esc(l.what)}</span>`}</div>${hasBreakdown ? `<div class="lw">${esc(l.what)}</div>` : ''}
            ${sealed ? '' : `<div class="lf"><b>Fix:</b> ${esc(l.fix)}</div>`}</td>
        <td class="amt">${amt}</td>
      </tr>`;
    })
    .join('');

  const tierText = tierCopy(tier, dbSize, industry);

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Rethink+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  @page { size: Letter; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Rethink Sans', 'Segoe UI', Arial, sans-serif; color: #111; background: #fff;
         -webkit-print-color-adjust: exact; print-color-adjust: exact; font-size: 12px; line-height: 1.45; }
  .page { padding: 0 0 16px; }
  header { background: #000; color: #fff; padding: 24px 44px 20px; border-bottom: 6px solid #FFC200; }
  .brand { color: #FFC200; font-weight: 800; letter-spacing: .14em; font-size: 11px; }
  h1 { margin: 6px 0 2px; font-size: 27px; line-height: 1.05; font-weight: 800; letter-spacing: -.01em; }
  h1 em { font-style: normal; color: #FFC200; }
  .meta { color: #bbb; font-size: 12px; }
  .meta b { color: #fff; font-weight: 600; }
  main { padding: 0 44px; }
  .hero { display: flex; gap: 20px; align-items: stretch; margin-top: 20px; }
  .big { flex: 1.3; background: #000; color: #fff; border-radius: 14px; padding: 16px 22px; }
  .big .l { color: #FFC200; font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
  .big .n { font-size: 40px; font-weight: 800; line-height: 1.05; margin-top: 4px; }
  .big .n small { font-size: 16px; color: #bbb; font-weight: 500; }
  .big .y { color: #ddd; margin-top: 4px; }
  .big .y b { color: #FFC200; }
  .side { flex: 1; display: flex; flex-direction: column; gap: 12px; }
  .chip { border: 2px solid #000; border-radius: 12px; padding: 9px 16px; }
  .chip .l { font-size: 10.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #555; }
  .chip .v { font-size: 20px; font-weight: 800; margin-top: 2px; }
  .chip.good .v { color: #138a36; } .chip.warn .v { color: #b86e00; } .chip.bad .v { color: #c0261d; }
  .chip.tier { background: #FFC200; border-color: #FFC200; }
  h2 { font-size: 15px; font-weight: 800; margin: 18px 0 2px; letter-spacing: -.005em; }
  .sub { color: #555; margin: 0 0 4px; }
  table { width: 100%; border-collapse: collapse; line-height: 1.35; }
  td { vertical-align: top; padding: 6px 6px; border-bottom: 1px solid #e6e6e6; }
  td.rank { width: 30px; font-weight: 800; color: #FFC200; font-size: 15px; -webkit-text-stroke: .4px #000; }
  .ln { font-weight: 700; font-size: 13.5px; }
  .lw { color: #555; }
  .lf { margin-top: 3px; }
  td.amt { text-align: right; white-space: nowrap; font-weight: 800; font-size: 16px; width: 120px; }
  td.amt small { font-size: 11px; color: #777; font-weight: 500; }
  .sealed { color: #138a36; font-size: 13px; }
  tr.is-sealed .ln { color: #777; }
  .rec { margin-top: 14px; border-left: 6px solid #FFC200; background: #fafafa; padding: 10px 16px; border-radius: 0 12px 12px 0; }
  .rec .t { font-size: 10.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #555; }
  .rec .name { font-size: 18px; font-weight: 800; margin: 2px 0 4px; }
  .rec .name span { background: #FFC200; padding: 0 6px; border-radius: 4px; }
  .rec p { margin: 4px 0 0; }
  .call { margin-top: 14px; background: #000; color: #fff; border-radius: 14px; padding: 14px 20px; display: flex; gap: 20px; align-items: center; }
  .call .tx { flex: 1; }
  .call .h { color: #FFC200; font-weight: 800; font-size: 15px; }
  .call p { margin: 4px 0 0; color: #ddd; }
  .btn { display: inline-block; background: #FFC200; color: #000; font-weight: 800; text-decoration: none; padding: 11px 16px; border-radius: 10px; white-space: nowrap; }
  .call .ph { color: #bbb; font-size: 11.5px; margin-top: 6px; text-align: center; }
  .fine { color: #777; font-size: 9.5px; margin-top: 10px; line-height: 1.45; }
</style></head><body><div class="page">
<header>
  <div class="brand">EAT 4 LIFE MARKETING · AI MARKETING MADE EASY</div>
  <h1>THE REVENUE <em>LEAK</em> SCORECARD</h1>
  <div class="meta">Prepared for <b>${preparedFor}</b>${industry ? ` · ${esc(industry)}` : ''} · ${esc(when)}</div>
</header>
<main>
  <div class="hero">
    <div class="big">
      <div class="l">Your estimated revenue leak</div>
      <div class="n">${money(monthly)}<small> / month</small></div>
      <div class="y">Roughly <b>${money(annual)}</b> a year walking out the door.</div>
    </div>
    <div class="side">
      ${grade ? `<div class="chip ${gradeClass(grade)}"><div class="l">Grade</div><div class="v">${esc(grade)}</div></div>` : ''}
      ${tier ? `<div class="chip tier"><div class="l">Recommended system</div><div class="v">E4L ${esc(tier)}</div></div>` : ''}
    </div>
  </div>

  <h2>${hasBreakdown ? 'Where the money is leaking, biggest first' : 'Where the money usually leaks'}</h2>
  <p class="sub">${hasBreakdown ? 'Each line is a fix. Start at the top: that is where the fastest money is.' : 'These are the five places businesses lose the most. Your total above is spread across them.'}</p>
  <table>${leakRows}</table>

  ${tierText ? `<div class="rec"><div class="t">The system that seals it</div>
    <div class="name">E4L <span>${esc(tier)}</span></div><p>${tierText}</p>
    ${annual > 0 ? `<p>Sealing even <b>half</b> of this leak would be worth roughly <b>${money(annual / 2)}</b> a year to you.</p>` : ''}</div>` : ''}

  <div class="call">
    <div class="tx">
      <div class="h">Want a second pair of eyes on this?</div>
      <p>Book a free 20-minute Game Plan Call. We look at your real numbers together, point out the one or two fixes that would pay off first, and you leave with a plan you can run with or without us. If we're not the right fit, we'll tell you.</p>
    </div>
    <div><a class="btn" href="${esc(BOOKING_URL)}">Book my Game Plan Call</a><div class="ph">or call / text ${esc(PHONE)}</div></div>
  </div>

  <div class="fine">These figures are directional estimates built from your answers and published industry benchmarks (missed-call rates, lead response decay, reactivation and no-show averages). They are not a guarantee of results; they're a flashlight. The call is where we look at your real numbers. Eat 4 Life Marketing · chosen1@gsgagency.com · ${esc(PHONE)}</div>
</main>
</div></body></html>`;
}

// ---- PDF -------------------------------------------------------------------

function chromeBin() {
  const candidates = [
    process.env.CHROME_BIN,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/opt/pw-browsers/chromium',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  const bin = candidates.find((c) => existsSync(c));
  if (!bin) throw new Error(`No Chrome/Chromium found (tried ${candidates.join(', ')}); set CHROME_BIN`);
  return bin;
}

async function printPdf(html, pdfPath) {
  const htmlPath = pdfPath.replace(/\.pdf$/, '.html');
  await fs.writeFile(htmlPath, html);
  const r = spawnSync(
    chromeBin(),
    [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--no-pdf-header-footer',
      '--print-to-pdf-no-header',
      '--virtual-time-budget=8000',
      `--print-to-pdf=${pdfPath}`,
      `file://${htmlPath}`,
    ],
    { encoding: 'utf8', timeout: 90000 }
  );
  const ok = await fs.stat(pdfPath).then((s) => s.size > 1000, () => false);
  if (!ok) throw new Error(`Chrome did not produce a PDF (exit ${r.status}): ${(r.stderr || '').slice(-500)}`);
}

// ---- GHL ---------------------------------------------------------------------

function ghlCreds() {
  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  return token && locationId ? { token, locationId } : null;
}

async function ghl(method, p, { json, form } = {}) {
  const { token } = ghlCreds();
  const headers = { Authorization: `Bearer ${token}`, Version: '2021-07-28', Accept: 'application/json' };
  if (json) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${GHL}${p}`, {
    method,
    headers,
    body: json ? JSON.stringify(json) : form,
    signal: AbortSignal.timeout(60000),
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  if (!res.ok) throw new Error(`GHL ${method} ${p.split('?')[0]} -> HTTP ${res.status}: ${JSON.stringify(body).slice(0, 300)}`);
  return body;
}

async function resolveContactId(contactId, lead) {
  if (/^[A-Za-z0-9]{8,}$/.test(contactId)) return contactId;
  const email = clean(lead.email);
  if (!email) throw new Error('No usable contact_id and no email to look the contact up by');
  const { locationId } = ghlCreds();
  const res = await ghl('POST', '/contacts/upsert', { json: { locationId, email } });
  const id = res.contact?.id;
  if (!id) throw new Error('Contact upsert by email returned no id');
  return id;
}

async function pdfUrlFieldId() {
  const { locationId } = ghlCreds();
  const { customFields } = await ghl('GET', `/locations/${locationId}/customFields`);
  const f = (customFields || []).find(
    (x) => x.fieldKey === PDF_URL_FIELD || /^cs[_ -]?scorecard[_ -]?pdf[_ -]?url$/i.test(x.name || '')
  );
  if (!f) throw new Error(`Custom field ${PDF_URL_FIELD} not found in GHL. Create it (single-line text) first.`);
  return f.id;
}

async function deliver({ contactId, lead, pdfPath }) {
  const [id, fieldId] = await Promise.all([resolveContactId(contactId, lead), pdfUrlFieldId()]);

  const form = new FormData();
  const first = (clean(lead.first_name) || 'Lead').replace(/[^\w -]/g, '');
  form.append('file', new Blob([await fs.readFile(pdfPath)], { type: 'application/pdf' }), `Revenue Leak Scorecard - ${first}.pdf`);
  form.append('name', `Revenue Leak Scorecard - ${first} - ${id}.pdf`);
  const up = await ghl('POST', '/medias/upload-file', { form });
  if (!up.url) throw new Error(`Media upload returned no url: ${JSON.stringify(up).slice(0, 200)}`);

  await ghl('PUT', `/contacts/${id}`, { json: { customFields: [{ id: fieldId, field_value: up.url }] } });
  // Remove then add, so a second submission still counts as "tag added".
  await ghl('DELETE', `/contacts/${id}/tags`, { json: { tags: [READY_TAG] } }).catch(() => {});
  await ghl('POST', `/contacts/${id}/tags`, { json: { tags: [READY_TAG] } });
  return { contactId: id, url: up.url };
}

// ---- main --------------------------------------------------------------------

async function main() {
  const { contactId, lead } = await readPayload();
  await fs.mkdir(OUT_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const pdfPath = path.join(OUT_DIR, `scorecard-${stamp}.pdf`);
  await printPdf(renderHtml({ lead }), pdfPath);
  console.log(`PDF built: ${path.relative(process.cwd(), pdfPath)}`);

  if (process.env.DRY_RUN === '1') {
    console.log('DRY_RUN=1: skipping GHL upload.');
    return;
  }
  if (!ghlCreds()) throw new Error('GHL_API_TOKEN / GHL_LOCATION_ID not set (use DRY_RUN=1 to build the PDF only)');
  const { contactId: id } = await deliver({ contactId, lead, pdfPath });
  console.log(`Delivered to GHL contact ${id}: ${PDF_URL_FIELD} set, tag ${READY_TAG} added.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(`scorecard PDF failed: ${err.message}`);
    process.exit(1);
  });
}
