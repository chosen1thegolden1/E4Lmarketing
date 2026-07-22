// Zero-dependency GoHighLevel (LeadConnector) API v2 client for the E4L Assistant.
// Uses Node's built-in fetch (Node 18+) — nothing to npm install.
//
// Auth: a Private Integration Token (Sub-account > Settings > Private Integrations).
// Put it in assistant/.env as GHL_API_TOKEN, plus your GHL_LOCATION_ID (sub-account id).
//
// NOTE on workflows: GHL's API cannot CREATE a workflow's steps. It can list
// workflows and enroll a contact into an existing one. So we treat GHL as the
// system of record + delivery, and let OUR code be the automation engine.

const GHL_API = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28"; // required by the v2 API

function cfg() {
  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token) {
    throw new Error(
      "GHL_API_TOKEN is not set. Add it to assistant/.env (Sub-account > Settings > Private Integrations)."
    );
  }
  if (!locationId) {
    throw new Error(
      "GHL_LOCATION_ID is not set. Add your sub-account id to assistant/.env."
    );
  }
  return { token, locationId };
}

async function ghlCall(method, pathname, { query, body } = {}) {
  const { token } = cfg();
  const url = new URL(GHL_API + pathname);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Version: GHL_VERSION,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const msg = data.message || data.error || res.statusText;
    throw new Error(`GHL API ${res.status} on ${method} ${pathname}: ${msg}`);
  }
  return data;
}

// ---- Contacts -------------------------------------------------------------

// Create a contact. `fields` supports firstName, lastName, email, phone,
// tags (array), source, and custom fields. locationId is added automatically.
async function createContact(fields) {
  const { locationId } = cfg();
  const data = await ghlCall("POST", "/contacts/", {
    body: { locationId, ...fields },
  });
  return data.contact || data;
}

// Update an existing contact by id.
async function updateContact(contactId, fields) {
  const data = await ghlCall("PUT", `/contacts/${contactId}`, { body: fields });
  return data.contact || data;
}

// Search contacts by a free-text query (name, email, phone).
async function searchContacts(query, limit = 20) {
  const { locationId } = cfg();
  const data = await ghlCall("POST", "/contacts/search", {
    body: { locationId, page: 1, pageLimit: limit, query },
  });
  return data.contacts || [];
}

// Add tags to a contact.
async function addTags(contactId, tags) {
  return ghlCall("POST", `/contacts/${contactId}/tags`, {
    body: { tags: Array.isArray(tags) ? tags : [tags] },
  });
}

// ---- Workflows ------------------------------------------------------------

// List existing workflows in the sub-account (read-only — the API can't create them).
async function listWorkflows() {
  const { locationId } = cfg();
  const data = await ghlCall("GET", "/workflows/", { query: { locationId } });
  return data.workflows || [];
}

// Enroll a contact into an existing workflow (this is how we "run" GHL automations).
async function enrollInWorkflow(contactId, workflowId) {
  return ghlCall("POST", `/contacts/${contactId}/workflow/${workflowId}`, {
    body: {},
  });
}

// ---- Opportunities --------------------------------------------------------

// Create an opportunity in a pipeline stage for a contact.
async function createOpportunity({ pipelineId, stageId, contactId, name, monetaryValue, status = "open" }) {
  const { locationId } = cfg();
  const data = await ghlCall("POST", "/opportunities/", {
    body: { locationId, pipelineId, pipelineStageId: stageId, contactId, name, monetaryValue, status },
  });
  return data.opportunity || data;
}

async function listPipelines() {
  const { locationId } = cfg();
  const data = await ghlCall("GET", "/opportunities/pipelines", { query: { locationId } });
  return data.pipelines || [];
}

// ---- Conversations (send SMS / email) ------------------------------------

// Send a message to a contact. type: "SMS" or "Email".
async function sendMessage(contactId, { type = "SMS", message, subject, html }) {
  const body = { type, contactId };
  if (type === "Email") {
    body.subject = subject;
    body.html = html || message;
  } else {
    body.message = message;
  }
  return ghlCall("POST", "/conversations/messages", { body });
}

// ---- Calendars / appointments --------------------------------------------

async function listCalendars() {
  const { locationId } = cfg();
  const data = await ghlCall("GET", "/calendars/", { query: { locationId } });
  return data.calendars || [];
}

// Book an appointment. startTime/endTime are ISO strings.
async function bookAppointment({ calendarId, contactId, startTime, endTime, title }) {
  const { locationId } = cfg();
  const data = await ghlCall("POST", "/calendars/events/appointments", {
    body: { locationId, calendarId, contactId, startTime, endTime, title },
  });
  return data;
}

module.exports = {
  ghlCall,
  createContact,
  updateContact,
  searchContacts,
  addTags,
  listWorkflows,
  enrollInWorkflow,
  createOpportunity,
  listPipelines,
  sendMessage,
  listCalendars,
  bookAppointment,
};
