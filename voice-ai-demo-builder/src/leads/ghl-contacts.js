// Push cold-outreach leads into GHL as contacts. Each contact carries the
// drafted email as a note so Rozel/Sebastian can see it inline in GHL.
import { ghl, creds } from '../ghl.js';

const TAGS_BASE = ['cold-outreach'];

const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export async function upsertLeadContact({ lead, draft, industry, city, status = 'drafted' }) {
  const { locationId } = creds();
  const tags = [
    ...TAGS_BASE,
    `industry:${slug(industry)}`,
    `city:${slug(city)}`,
    `status:${status}`,
  ];
  const contact = await ghl('POST', '/contacts/upsert', {
    locationId,
    email: lead.email || undefined,
    phone: lead.phone || undefined,
    companyName: lead.name,
    website: lead.website,
    address1: lead.address,
    tags,
    source: 'cold-outreach:google-places',
  });
  const id = contact.contact?.id || contact.id;

  // Attach the drafted email as a note so Rozel can see it on the contact.
  if (id && draft) {
    try {
      await ghl('POST', `/contacts/${id}/notes`, {
        body: `DRAFT COLD OUTREACH — ${status.toUpperCase()}\n\nSubject: ${draft.subject}\n\n${draft.body}`,
      });
    } catch {
      /* notes aren't fatal — carry on */
    }
  }
  return id;
}

export async function markSent(contactId) {
  return ghl('POST', `/contacts/${contactId}/tags`, {
    tags: ['status:sent'],
  }).catch(() => {});
}

export async function removeDraftTag(contactId) {
  return ghl('DELETE', `/contacts/${contactId}/tags`, {
    tags: ['status:drafted'],
  }).catch(() => {});
}
