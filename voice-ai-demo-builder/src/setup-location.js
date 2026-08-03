#!/usr/bin/env node
// Prepares a GHL sub-account to run the demo builder. Idempotent — safe to
// re-run. Verifies credentials, creates the custom fields the pipeline writes
// to, and reports what still needs doing by hand.
//
//   GHL_API_TOKEN=pit-... GHL_LOCATION_ID=... npm run setup-location
import { ghl } from './ghl.js';

const token = process.env.GHL_API_TOKEN;
const locationId = process.env.GHL_LOCATION_ID;
if (!token || !locationId) {
  console.error('Set GHL_API_TOKEN and GHL_LOCATION_ID for the TARGET sub-account.');
  process.exit(1);
}

const REQUIRED_FIELDS = [
  { name: 'Voice Demo URL', dataType: 'TEXT', key: 'contact.voice_demo_url' },
  { name: 'Voice Demo Phone', dataType: 'PHONE', key: 'contact.voice_demo_phone' },
];
const FORM_NAME = process.env.DEMO_FORM_NAME || 'Voice AI Demo Request';

console.log('\n▸ Verifying token against the location ...');
let location;
try {
  ({ location } = await ghl('GET', `/locations/${locationId}`));
} catch (err) {
  console.error(`  ✗ ${err.message}`);
  console.error('\n  The token cannot reach this location. Make sure the private');
  console.error('  integration was created INSIDE this sub-account, with Voice AI,');
  console.error('  Contacts, and Custom Fields scopes enabled.');
  process.exit(1);
}
console.log(`  ✓ "${location.name}" (${locationId})`);

console.log('▸ Ensuring custom fields ...');
const { customFields } = await ghl('GET', `/locations/${locationId}/customFields`);
const byKey = Object.fromEntries(customFields.map((f) => [f.fieldKey, f]));
for (const want of REQUIRED_FIELDS) {
  const existing = byKey[want.key] || customFields.find((f) => f.name === want.name);
  if (existing) {
    console.log(`  = ${want.name} already exists (${existing.id})`);
  } else {
    const { customField } = await ghl('POST', `/locations/${locationId}/customFields`, {
      name: want.name,
      dataType: want.dataType,
    });
    console.log(`  + created ${want.name} (${customField.id})`);
  }
}

console.log('▸ Checking the rep intake form ...');
const { forms } = await ghl('GET', `/forms/?locationId=${locationId}&limit=50`);
const form = forms.find((f) => f.name.trim().toLowerCase() === FORM_NAME.trim().toLowerCase());
console.log(
  form
    ? `  ✓ "${form.name}" found (${form.id})`
    : `  ! "${FORM_NAME}" not found — build it in Sites → Forms (see REP_PORTAL.md)`
);

console.log('▸ Phone numbers available for the demo pool ...');
let numbers = [];
try {
  const res = await ghl('GET', `/phone-system/numbers/location/${locationId}`);
  numbers = res.numbers || [];
} catch {
  console.log('  ! could not read phone numbers (scope may be missing) — check in GHL');
}
if (numbers.length) {
  for (const n of numbers) {
    const flags = [n.isDefaultNumber && 'DEFAULT', n.linkedUser && 'linked to a user']
      .filter(Boolean)
      .join(', ');
    console.log(`  ${n.phoneNumber}  ${n.friendlyName || ''}${flags ? `  [${flags}]` : ''}`);
  }
  console.log('\n  Put only dedicated demo numbers in pool.json — never a number');
  console.log('  marked DEFAULT or linked to a user (the agent would answer their calls).');
} else {
  console.log('  none yet — buy demo numbers in Settings → Phone Numbers');
}

console.log(`\nRemaining manual steps:`);
console.log(`  1. ${form ? '✓ form exists' : `build the "${FORM_NAME}" form (REP_PORTAL.md)`}`);
console.log(`  2. list this location's demo numbers in pool.json`);
console.log(`  3. set GHL_API_TOKEN + GHL_LOCATION_ID repo secrets to this sub-account`);
console.log(`  4. point the dedicated sending domain at THIS sub-account (deliverability PDF)\n`);
