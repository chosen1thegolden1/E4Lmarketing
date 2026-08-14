// Minimal GHL helper for the GEO audit: check whether the cs_geo_score
// custom field is wired, and (when a contact email is provided) write the
// score to it. The audit never blocks on GHL — callers treat failures as
// "not wired" and file evidence in the repo instead.

const BASE = 'https://services.leadconnectorhq.com';

function creds() {
  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) return null;
  return { token, locationId };
}

async function ghl(method, path, body) {
  const { token } = creds();
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Version: '2021-07-28',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok) throw new Error(`GHL ${method} ${path} -> HTTP ${res.status}: ${JSON.stringify(json).slice(0, 300)}`);
  return json;
}

// Returns { wired: bool, fieldId?, locationName?, reason? } — never throws.
export async function checkGeoScoreField() {
  const c = creds();
  if (!c) return { wired: false, reason: 'GHL credentials not set in environment' };
  try {
    const [{ customFields }, loc] = await Promise.all([
      ghl('GET', `/locations/${c.locationId}/customFields`),
      ghl('GET', `/locations/${c.locationId}`).catch(() => null),
    ]);
    const field = (customFields || []).find(
      (f) => f.fieldKey === 'contact.cs_geo_score' || /^cs[_ -]?geo[_ -]?score$/i.test(f.name || '')
    );
    const locationName = loc?.location?.name || loc?.name;
    if (!field) return { wired: false, locationName, reason: 'cs_geo_score custom field not found' };
    return { wired: true, fieldId: field.id, locationName };
  } catch (err) {
    return { wired: false, reason: err.message };
  }
}

// Upsert the contact by email and write the score. Only called when the
// audit is invoked with --ghl-email. Throws on failure (caller catches).
export async function writeGeoScore({ email, businessName, fieldId, score }) {
  const { locationId } = creds();
  const res = await ghl('POST', '/contacts/upsert', {
    locationId,
    email,
    companyName: businessName,
    customFields: [{ id: fieldId, value: score }],
  });
  return res.contact?.id;
}
