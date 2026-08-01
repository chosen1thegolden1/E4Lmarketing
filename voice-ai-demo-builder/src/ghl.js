const BASE = 'https://services.leadconnectorhq.com';

function creds() {
  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    throw new Error('Set GHL_API_TOKEN and GHL_LOCATION_ID in the environment.');
  }
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
  if (!res.ok) {
    throw new Error(`GHL ${method} ${path} -> HTTP ${res.status}: ${JSON.stringify(json).slice(0, 500)}`);
  }
  return json;
}

export async function createVoiceAgent(data) {
  const { locationId } = creds();
  const { business: b, agent: a } = data;
  // GHL caps agentName at 40 chars
  let agentName = `${a.agentName} — ${b.shortName || b.name}`;
  if (agentName.length > 40) agentName = a.agentName.slice(0, 40);
  const payload = {
    locationId,
    agentName,
    businessName: b.name,
    welcomeMessage: a.welcomeMessage,
    agentPrompt: a.prompt,
    language: 'en-US',
    timezone: b.timezone || 'America/New_York',
  };
  return ghl('POST', '/voice-ai/agents', payload);
}

export async function listVoiceAgents() {
  const { locationId } = creds();
  return ghl('GET', `/voice-ai/agents?locationId=${encodeURIComponent(locationId)}`);
}
