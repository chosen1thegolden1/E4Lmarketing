#!/usr/bin/env node
// Custom fields and tags the cold-outreach program needs, on top of the
// mission-brief CS-* assets created by setup-cs.js.
//
//   npm run setup-outreach
//
// Idempotent — safe to re-run. Writes only into E4L Services (see
// location-guard.js); refuses to run anywhere else.
import { ghl } from './ghl.js';
import { assertServicesLocation } from './location-guard.js';

const locationId = await assertServicesLocation();

// SINGLE_OPTIONS keeps the pick-lists clean in the UI, but the field API is
// fussy about option shapes across GHL versions — anything that won't create
// as a dropdown falls back to TEXT rather than failing the run.
const FIELDS = [
  // --- AI Search Visibility (GEO) -----------------------------------------
  // geo/src/audit.js already looks for cs_geo_score and reports it missing on
  // every run; without it, scores get filed in the repo instead of the CRM.
  { name: 'cs_geo_score', dataType: 'TEXT',
    note: 'Latest AI visibility score, e.g. "5/21"' },
  { name: 'cs_geo_score_baseline', dataType: 'TEXT',
    note: 'First audit score — makes month-over-month deltas possible' },
  { name: 'cs_geo_last_audit', dataType: 'DATE',
    note: 'Date of the most recent audit run' },

  // --- Cold outreach tracking ---------------------------------------------
  { name: 'cs_lead_source', dataType: 'TEXT',
    note: 'sheet-import / google-places / scorecard / referral' },
  { name: 'cs_outreach_batch', dataType: 'TEXT',
    note: 'Import batch, e.g. "2026-08-16-hvac"' },
  { name: 'cs_outreach_step', dataType: 'TEXT',
    note: 'Last opener email sent (1-5) — where they are in the series' },
  { name: 'cs_opener_question', dataType: 'TEXT',
    note: 'Which vertical question was used — the A/B learning loop' },
  { name: 'cs_email_type', dataType: 'SINGLE_OPTIONS',
    options: ['personal', 'role'],
    note: 'Reaches a person vs. a front desk — changes how you open' },
  { name: 'cs_priority', dataType: 'SINGLE_OPTIONS',
    options: ['A', 'B', 'C'],
    note: 'A = named person + personal email (call these)' },

  // --- Phone ---------------------------------------------------------------
  { name: 'cs_call_outcome', dataType: 'SINGLE_OPTIONS',
    options: ['no-answer', 'voicemail', 'spoke', 'callback-requested', 'do-not-contact'],
    note: 'Result of the most recent call attempt' },
  { name: 'cs_call_notes', dataType: 'LARGE_TEXT',
    note: 'What they actually said — week one is a listening exercise' },
  { name: 'cs_last_touch', dataType: 'DATE',
    note: 'Last outbound of any kind. Stops double-touching a contact' },
];

// Fixed tags. The dynamic ones (batch:, industry:, city:, priority:) are
// created by GHL on first apply and don't need declaring.
const TAGS = [
  'cold-outreach',
  'status:queued',
  'status:sent',
  'status:engaged',
  'do-not-contact',
  'called:no-answer',
  'called:voicemail',
  'called:spoke',
];

console.log('\n▸ Outreach custom fields...');
const { customFields } = await ghl('GET', `/locations/${locationId}/customFields`);
const byName = Object.fromEntries((customFields || []).map((f) => [f.name, f]));

for (const field of FIELDS) {
  if (byName[field.name]) {
    console.log(`  = ${field.name} exists (${byName[field.name].id})`);
    continue;
  }
  const payload = { name: field.name, dataType: field.dataType };
  if (field.options) {
    payload.options = field.options;
  }
  try {
    const { customField } = await ghl('POST', `/locations/${locationId}/customFields`, payload);
    console.log(`  + ${field.name} created (${customField.id}) — ${field.note}`);
  } catch (err) {
    if (field.options) {
      try {
        const { customField } = await ghl('POST', `/locations/${locationId}/customFields`, {
          name: field.name,
          dataType: 'TEXT',
        });
        console.log(`  + ${field.name} created as TEXT (${customField.id}) — dropdown rejected, `
          + `set options in the UI if you want them`);
        continue;
      } catch (fallbackErr) {
        console.log(`  ! ${field.name}: ${fallbackErr.message.slice(0, 120)}`);
        continue;
      }
    }
    console.log(`  ! ${field.name}: ${err.message.slice(0, 120)}`);
  }
}

console.log('\n▸ Outreach tags...');
let existing = [];
try {
  const res = await ghl('GET', `/locations/${locationId}/tags`);
  existing = (res.tags || []).map((t) => (t.name || '').toLowerCase());
} catch (err) {
  console.log(`  ! could not list tags (${err.message.slice(0, 80)}); attempting all`);
}
for (const name of TAGS) {
  if (existing.includes(name)) {
    console.log(`  = ${name} exists`);
    continue;
  }
  try {
    await ghl('POST', `/locations/${locationId}/tags`, { name });
    console.log(`  + ${name} created`);
  } catch (err) {
    console.log(`  ~ ${name}: ${err.message.slice(0, 70)} (harmless — auto-creates on first apply)`);
  }
}

console.log('\nDone. Idempotent — safe to re-run.\n');
console.log('Next: Contacts → Import → map the CSV columns in leads/ghl-import/,');
console.log('applying the Tags column on import. See docs/COLD_START_KIT.md.\n');
