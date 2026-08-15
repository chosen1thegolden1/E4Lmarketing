#!/usr/bin/env node
// One-shot setup for the mission-brief CS-* assets in E4L Services:
// 8 custom fields, 6 tags, and the CS-Agency-Pipeline with 6 stages.
// Idempotent — safe to re-run.
import { ghl } from './ghl.js';
import { assertServicesLocation } from './location-guard.js';

const locationId = await assertServicesLocation();

const CS_FIELDS = [
  { name: 'cs_leak_monthly', dataType: 'NUMERICAL' },
  { name: 'cs_leak_annual', dataType: 'NUMERICAL' },
  { name: 'cs_grade', dataType: 'TEXT' },
  { name: 'cs_recommended_tier', dataType: 'TEXT' },
  { name: 'cs_industry', dataType: 'TEXT' },
  { name: 'cs_customer_value', dataType: 'NUMERICAL' },
  { name: 'cs_monthly_inquiries', dataType: 'NUMERICAL' },
  { name: 'cs_database_size', dataType: 'NUMERICAL' },
];

const CS_TAGS = [
  'cs-scorecard-lead',
  'cs-tier-recover',
  'cs-tier-accelerate',
  'cs-tier-own',
  'cs-client-active',
  'cs-nurture',
];

const CS_STAGES = [
  'New Lead',
  'Scorecard Complete',
  'Discovery Booked',
  'Demo / Proposal',
  'Closed Won',
  'Closed Lost / Nurture',
];

console.log(`\n▸ Location: ${locationId}\n`);

console.log('▸ Custom fields (CS)...');
const { customFields } = await ghl('GET', `/locations/${locationId}/customFields`);
const byName = Object.fromEntries(customFields.map((f) => [f.name, f]));
for (const want of CS_FIELDS) {
  if (byName[want.name]) {
    console.log(`  = ${want.name} exists (${byName[want.name].id})`);
  } else {
    const { customField } = await ghl('POST', `/locations/${locationId}/customFields`, want);
    console.log(`  + ${want.name} created (${customField.id})`);
  }
}

console.log('\n▸ Tags (CS)...');
// GHL contact tags are namespaced per location; endpoint accepts create.
let existingTags = [];
try {
  const res = await ghl('GET', `/locations/${locationId}/tags`);
  existingTags = (res.tags || []).map((t) => (t.name || '').toLowerCase());
} catch (err) {
  console.log(`  ! could not list existing tags (${err.message}); will attempt to create all`);
}
for (const name of CS_TAGS) {
  if (existingTags.includes(name)) {
    console.log(`  = ${name} exists`);
    continue;
  }
  try {
    await ghl('POST', `/locations/${locationId}/tags`, { name });
    console.log(`  + ${name} created`);
  } catch (err) {
    // Tags are often created on-the-fly by contact upserts; if create isn't
    // supported by this token's scope, that's fine — the workflow will create
    // them when it first applies them.
    console.log(`  ~ ${name}: ${err.message.slice(0, 90)} (harmless — will auto-create on first apply)`);
  }
}

console.log('\n▸ CS-Agency-Pipeline...');
const { pipelines } = await ghl('GET', `/opportunities/pipelines?locationId=${locationId}`);
let pipe = pipelines.find((p) => p.name === 'CS-Agency-Pipeline');
if (pipe) {
  console.log(`  = CS-Agency-Pipeline exists (${pipe.id})`);
} else {
  try {
    const res = await ghl('POST', `/opportunities/pipelines`, {
      locationId,
      name: 'CS-Agency-Pipeline',
      stages: CS_STAGES.map((s, i) => ({ name: s, position: i })),
    });
    pipe = res.pipeline || res;
    console.log(`  + CS-Agency-Pipeline created (${pipe.id})`);
  } catch (err) {
    console.log(`  ! could not create pipeline via API: ${err.message.slice(0, 200)}`);
    console.log(`    Abdullah: build in UI (Opportunities → Pipelines → New) with these stages:`);
    CS_STAGES.forEach((s, i) => console.log(`      ${i + 1}. ${s}`));
  }
}

console.log('\nDone. Everything above is idempotent — safe to re-run.');
