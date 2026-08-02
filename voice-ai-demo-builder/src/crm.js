import { ghl, creds } from './ghl.js';

let fieldCache;

async function fieldIds() {
  if (fieldCache) return fieldCache;
  const { locationId } = creds();
  const { customFields } = await ghl('GET', `/locations/${locationId}/customFields`);
  const byKey = Object.fromEntries(customFields.map((f) => [f.fieldKey, f.id]));
  fieldCache = {
    demoUrl: byKey['contact.voice_demo_url'],
    demoPhone: byKey['contact.voice_demo_phone'],
  };
  return fieldCache;
}

/**
 * Upsert the lead in GHL: contact record with demo URL + demo phone custom
 * fields, voice-demo tag, and rep attribution tag. A GHL workflow watching the
 * voice-demo tag (or the Voice Demo URL field) can then send the outreach email.
 */
export async function upsertLead({ email, business, website, demoUrl, demoPhone, rep }) {
  const { locationId } = creds();
  const ids = await fieldIds();
  const customFields = [];
  if (demoUrl && ids.demoUrl) customFields.push({ id: ids.demoUrl, value: demoUrl });
  if (demoPhone && ids.demoPhone) customFields.push({ id: ids.demoPhone, value: demoPhone });
  const tags = ['voice-demo'];
  if (rep) tags.push(`rep:${rep.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
  const res = await ghl('POST', '/contacts/upsert', {
    locationId,
    email,
    companyName: business,
    website,
    tags,
    customFields,
    source: 'voice-ai-demo-builder',
  });
  return res.contact;
}
