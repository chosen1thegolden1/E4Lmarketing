// Refuse to write CS-* assets into the wrong sub-account.
//
// Why this exists: GHL_LOCATION_ID in a working environment may still point at
// the original "Eat 4 Life" (school) sub-account from the demo builder's first
// deployment. Running a setup script against that ID quietly creates every CS-*
// field, tag, and pipeline in the school — a guardrail violation that is
// tedious to unpick and invisible until someone notices the assets are missing
// from E4L Services.
//
// Every setup script calls this before its first write.
import { ghl } from './ghl.js';

// E4L Services (per ABDULLAH_BRIEF.md). Override with CS_EXPECT_LOCATION_ID
// when standing up a genuinely new sub-account.
export const E4L_SERVICES_ID = 'cVjZYdYSOnOs4rZPrzcs';

export async function assertServicesLocation() {
  const locationId = process.env.GHL_LOCATION_ID;
  const expected = process.env.CS_EXPECT_LOCATION_ID || E4L_SERVICES_ID;

  if (!process.env.GHL_API_TOKEN || !locationId) {
    console.error('Set GHL_API_TOKEN and GHL_LOCATION_ID for the TARGET sub-account.');
    process.exit(1);
  }

  if (locationId !== expected) {
    let name = '(could not read name)';
    try {
      const res = await ghl('GET', `/locations/${locationId}`);
      name = (res.location || res).name || name;
    } catch {
      /* naming it is a nicety; the ID mismatch is already disqualifying */
    }
    console.error(`\n✗ REFUSING TO WRITE — wrong sub-account.\n`);
    console.error(`  GHL_LOCATION_ID : ${locationId}  ("${name}")`);
    console.error(`  Expected        : ${expected}  (E4L Services)\n`);
    console.error('  Guardrail: never create or modify assets outside E4L Services.');
    console.error('  Fix: export GHL_LOCATION_ID and a GHL_API_TOKEN scoped to E4L');
    console.error('  Services, then re-run. To target a different sub-account on');
    console.error('  purpose, set CS_EXPECT_LOCATION_ID to that ID as well.\n');
    process.exit(2);
  }

  // ID matches — confirm the token can actually reach it before we start.
  let name = '';
  try {
    const res = await ghl('GET', `/locations/${locationId}`);
    name = (res.location || res).name || '';
  } catch (err) {
    console.error(`\n✗ Token cannot read location ${locationId}: ${err.message.slice(0, 160)}`);
    console.error('  The token is scoped to a different sub-account. Get one for');
    console.error('  E4L Services (Settings → API Keys / Private Integrations).\n');
    process.exit(2);
  }

  console.log(`▸ Location verified: ${name} (${locationId})`);
  return locationId;
}
