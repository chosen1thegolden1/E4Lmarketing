// Weekly email performance pull across both sub-accounts. READ-ONLY.
//
// Produces the numbers behind the Monday email report: what went out, what got
// opened and clicked (per subject line), what it led to (appointments,
// pipeline movement, purchases), and the hygiene problems that would make any
// of those numbers lie. A separate step writes the "what worked / what didn't"
// note on top of this — this file only collects.
//
//   node src/email-report.js [--days 7] [--out ../reports/email]
//
// Tokens per side (each optional — a missing side is reported, not fatal):
//   GHL_STUDENTS_TOKEN / GHL_STUDENTS_LOCATION   Eat 4 Life Students (school)
//   GHL_SERVICES_TOKEN / GHL_SERVICES_LOCATION   E4L Services (agency)
// Falls back to GHL_API_TOKEN / GHL_LOCATION_ID for whichever side that ID is.
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://services.leadconnectorhq.com';
const STUDENTS_ID = 'zSBqmFrgOtGwd4ALyIsD';
const SERVICES_ID = 'cVjZYdYSOnOs4rZPrzcs';

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const DAYS = Number(flag('days', 7));
const OUT = flag('out', path.resolve(process.cwd(), '../reports/email'));
const UNTIL = new Date();
const SINCE = new Date(UNTIL.getTime() - DAYS * 864e5);

// The only HTTP verb in this file. Retries 429s; never throws on a 4xx so one
// unscoped endpoint can't sink the whole report.
async function get(token, p) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(BASE + p, { headers: { Authorization: `Bearer ${token}`, Version: '2021-07-28', Accept: 'application/json' } });
    if (r.status === 429) { await new Promise(res => setTimeout(res, 1500 * (attempt + 1))); continue; }
    const t = await r.text();
    let j; try { j = JSON.parse(t); } catch { j = { raw: t.slice(0, 200) }; }
    return { s: r.status, j };
  }
  return { s: 429, j: { error: 'rate limited after retries' } };
}
const inWindow = d => { const t = new Date(d).getTime(); return t >= SINCE.getTime() && t <= UNTIL.getTime(); };
const pct = (a, b) => b ? Math.round((a / b) * 1000) / 10 : 0;

async function pullSide(side, token, locationId) {
  const out = { side, locationId, window: { since: SINCE.toISOString(), until: UNTIL.toISOString(), days: DAYS }, gaps: [], hygiene: [] };
  const loc = await get(token, `/locations/${locationId}`);
  out.locationName = loc.j?.location?.name || '(unreadable)';

  // --- 1. Bulk / broadcast campaigns -------------------------------------
  const es = await get(token, `/emails/schedule?locationId=${locationId}&limit=100`);
  const schedules = es.j.schedules || [];
  out.campaigns = [];
  for (const c of schedules) {
    const when = c.dateAdded ? new Date(c.dateAdded) : null;
    const active = when && inWindow(when) && (c.successCount || 0) > 0;
    if (c.status === 'pause' && (c.queuedCount || 0) > 0)
      out.hygiene.push(`Paused campaign still holding ${c.queuedCount} queued contacts: "${c.subject}" (${when?.toISOString().slice(0, 10)})`);
    if (!active) continue;
    const row = { id: c.id, subject: c.subject, sentAt: when.toISOString(), sent: c.successCount || 0, failed: (c.failed || 0) + (c.error || 0), utm: !!c.hasUtmTracking, tracking: !!c.hasTracking };
    const st = await get(token, `/emails/schedule/${c.id}/stats`);
    if (st.s === 200) Object.assign(row, { stats: st.j });
    else row.statsGap = `stats endpoint returned ${st.s} — token needs the email-stats scope`;
    out.campaigns.push(row);
  }
  if (out.campaigns.some(c => c.statsGap)) out.gaps.push('Campaign open/click totals need the email-stats scope on this token (endpoint exists, returned 401).');

  // --- 2. Workflow emails, per subject line --------------------------------
  // No workflow-level stats endpoint exists, so walk recent conversations →
  // outbound emails → per-message status. Bounded so a big list can't run away.
  const MAX_CONVOS = 800;
  const bySubject = {};
  let convos = [], page = 0, exhausted = false;
  while (convos.length < MAX_CONVOS && !exhausted) {
    const r = await get(token, `/conversations/search?locationId=${locationId}&limit=100&sortBy=last_message_date&sort=desc${page ? `&startAfterDate=${convos.at(-1).lastMessageDate}` : ''}`);
    const batch = r.j.conversations || [];
    if (!batch.length) break;
    for (const c of batch) { if (c.lastMessageDate && new Date(c.lastMessageDate) < SINCE) { exhausted = true; break; } convos.push(c); }
    page++;
    if (batch.length < 100) break;
  }
  if (!exhausted && convos.length >= MAX_CONVOS) out.gaps.push(`Workflow-email walk capped at ${MAX_CONVOS} conversations; totals below are a floor, not a count.`);
  let emailsSeen = 0;
  for (const c of convos) {
    if (!(c.messageTypes || []).some(t => /EMAIL/i.test(t)) && !/EMAIL/i.test(c.lastMessageType || '')) continue;
    const m = await get(token, `/conversations/${c.id}/messages?limit=20`);
    const msgs = m.j.messages?.messages || m.j.messages || [];
    for (const msg of msgs) {
      if (msg.direction !== 'outbound' || !/EMAIL/i.test(msg.messageType || '') || !inWindow(msg.dateAdded)) continue;
      for (const mid of msg.meta?.email?.messageIds || []) {
        const e = await get(token, `/conversations/messages/email/${mid}`);
        if (e.s !== 200) continue;
        const em = e.j.emailMessage || e.j;
        const subj = em.subject || msg.meta?.email?.subject || '(no subject)';
        const row = (bySubject[subj] ||= { subject: subj, source: msg.source || '?', sent: 0, byStatus: {} });
        row.sent++; row.byStatus[em.status || 'unknown'] = (row.byStatus[em.status || 'unknown'] || 0) + 1;
        emailsSeen++;
      }
    }
  }
  out.workflowEmails = Object.values(bySubject).map(r => {
    const s = r.byStatus;
    const delivered = (s.delivered || 0) + (s.opened || 0) + (s.read || 0) + (s.clicked || 0);
    const opened = (s.opened || 0) + (s.read || 0) + (s.clicked || 0);
    return { ...r, delivered, opened, clicked: s.clicked || 0, bounced: (s.bounced || 0) + (s.undelivered || 0) + (s.failed || 0), openRate: pct(opened, delivered), clickRate: pct(s.clicked || 0, delivered) };
  }).sort((a, b) => b.sent - a.sent);
  out.workflowEmailsTotal = emailsSeen;
  // GHL's per-message status records delivery, not engagement — every email
  // reads "delivered" forever. Opens and clicks live in the separate stats
  // store behind /emails/schedule/{id}/stats, which this token cannot read.
  out.hasEngagement = out.workflowEmails.some(w => w.opened || w.clicked);
  if (!out.hasEngagement && emailsSeen) out.gaps.push('Opens and clicks are NOT in these numbers: the per-message status field only records delivery. Bulk-campaign opens/clicks need the email-stats scope; workflow-email opens are UI-only.');

  // --- 3. Appointments -----------------------------------------------------
  const cal = await get(token, `/calendars/?locationId=${locationId}`);
  out.appointments = [];
  for (const c of cal.j.calendars || []) {
    const ev = await get(token, `/calendars/events?locationId=${locationId}&calendarId=${c.id}&startTime=${SINCE.getTime()}&endTime=${UNTIL.getTime()}`);
    const events = ev.j.events || [];
    if (events.length) out.appointments.push({ calendar: c.name, booked: events.length, statuses: events.reduce((a, e) => (a[e.appointmentStatus || e.status || '?'] = (a[e.appointmentStatus || e.status || '?'] || 0) + 1, a), {}) });
  }
  out.appointmentsTotal = out.appointments.reduce((a, r) => a + r.booked, 0);

  // --- 3b. Form submissions (the real conversion points) -------------------
  // Student side: "Xbox to Executive - Optin Form" and the webinar signup.
  // Agency side: the Revenue Scorecard. Bookings are already counted above.
  const fm = await get(token, `/forms/?locationId=${locationId}&limit=100`);
  const formName = Object.fromEntries((fm.j.forms || []).map(f => [f.id, f.name]));
  const sub = await get(token, `/forms/submissions?locationId=${locationId}&startAt=${SINCE.toISOString().slice(0, 10)}&endAt=${UNTIL.toISOString().slice(0, 10)}&limit=100`);
  const byForm = {};
  for (const s of sub.j.submissions || []) { const n = formName[s.formId] || s.formId; byForm[n] = (byForm[n] || 0) + 1; }
  out.forms = Object.entries(byForm).map(([form, submissions]) => ({ form, submissions })).sort((a, b) => b.submissions - a.submissions);
  out.formsTotal = (sub.j.submissions || []).length;
  out.formsKnown = Object.values(formName);

  // --- 4. Pipeline movement + purchases ------------------------------------
  const pl = await get(token, `/opportunities/pipelines?locationId=${locationId}`);
  out.pipelines = [];
  for (const p of pl.j.pipelines || []) {
    const stageName = Object.fromEntries((p.stages || []).map(s => [s.id, s.name]));
    let all = [], pg = 1;
    while (pg <= 10) { const r = await get(token, `/opportunities/search?location_id=${locationId}&pipeline_id=${p.id}&limit=100&page=${pg}`); const o = r.j.opportunities || []; all.push(...o); if (o.length < 100) break; pg++; }
    const moved = all.filter(o => inWindow(o.lastStageChangeAt));
    const byStage = {};
    for (const o of moved) { const n = stageName[o.pipelineStageId] || '?'; const b = (byStage[n] ||= { moved: 0, value: 0, fromEmail: 0 }); b.moved++; b.value += o.monetaryValue || 0; if ((o.attributions || []).some(a => /email/i.test(a.utmSource || a.utmMedium || ''))) b.fromEmail++; }
    const purchaseStages = (p.stages || []).filter(s => /purchas|paid|enrolled|closed/i.test(s.name)).map(s => s.name);
    const zeroValuePurchases = all.filter(o => purchaseStages.includes(stageName[o.pipelineStageId]) && !(o.monetaryValue > 0)).length;
    if (zeroValuePurchases) out.hygiene.push(`Pipeline "${p.name}": ${zeroValuePurchases} opportunities sit in a paid stage with $0 recorded — revenue from email can't be reported until values are entered.`);
    const first = p.stages?.[0]?.name; const stalled = all.filter(o => stageName[o.pipelineStageId] === first && o.status === 'open').length;
    if (all.length >= 50 && stalled / all.length > 0.8) out.hygiene.push(`Pipeline "${p.name}": ${stalled} of ${all.length} (${pct(stalled, all.length)}%) still at "${first}" — the pipeline isn't being worked, so stage-based conversion will read as zero.`);
    const sources = {}; for (const o of all) { const k = (o.source || '(none)').trim(); sources[k] = (sources[k] || 0) + 1; }
    const lower = {}; for (const k of Object.keys(sources)) { const l = k.toLowerCase(); (lower[l] ||= []).push(k); }
    for (const v of Object.values(lower)) if (v.length > 1) out.hygiene.push(`Pipeline "${p.name}": source is split by casing — ${v.map(x => `"${x}"`).join(' vs ')} — attribution counts are being divided.`);
    out.pipelines.push({ name: p.name, total: all.length, movedThisWindow: moved.length, byStage, purchaseStages });
  }

  return out;
}

// --- Markdown rendering ----------------------------------------------------
function render(sides) {
  const L = [];
  const d = s => s.slice(0, 10);
  L.push(`# Weekly email report — ${d(SINCE.toISOString())} to ${d(UNTIL.toISOString())}`, '');
  for (const s of sides) {
    L.push(`## ${s.side} — ${s.locationName}`, '');
    if (s.unavailable) { L.push(`_Not pulled: ${s.unavailable}_`, ''); continue; }
    L.push(`### Broadcasts sent this week`);
    if (!s.campaigns.length) L.push('_None._');
    else { L.push('| Subject | Sent | Failed | Opens | Clicks | UTM |', '|---|---|---|---|---|---|'); for (const c of s.campaigns) L.push(`| ${c.subject} | ${c.sent} | ${c.failed} | ${c.stats?.opened ?? c.stats?.opens ?? '—'} | ${c.stats?.clicked ?? c.stats?.clicks ?? '—'} | ${c.utm ? 'yes' : '**no**'} |`); }
    L.push('', `### Workflow emails by subject line (${s.workflowEmailsTotal} emails seen)`);
    if (!s.workflowEmails.length) L.push('_None in window._');
    else if (s.hasEngagement) { L.push('| Subject | Sent | Delivered | Opened | Clicked | Bounced | Open % | Click % |', '|---|---|---|---|---|---|---|---|'); for (const w of s.workflowEmails) L.push(`| ${w.subject} | ${w.sent} | ${w.delivered} | ${w.opened} | ${w.clicked} | ${w.bounced} | ${w.openRate} | ${w.clickRate} |`); }
    else { L.push('| Subject | Sent | Delivered | Bounced |', '|---|---|---|---|'); for (const w of s.workflowEmails) L.push(`| ${w.subject} | ${w.sent} | ${w.delivered} | ${w.bounced} |`); }
    L.push('', `### Form submissions: ${s.formsTotal}`);
    if (!s.forms.length) L.push(`_None this week._ (forms on this account: ${s.formsKnown.join(', ')})`);
    for (const f of s.forms) L.push(`- ${f.form}: ${f.submissions}`);
    L.push('', `### Appointments booked: ${s.appointmentsTotal}`);
    for (const a of s.appointments) L.push(`- ${a.calendar}: ${a.booked} (${Object.entries(a.statuses).map(([k, v]) => `${k} ${v}`).join(', ')})`);
    L.push('', `### Pipeline movement`);
    for (const p of s.pipelines) {
      L.push(`**${p.name}** — ${p.movedThisWindow} of ${p.total} moved stage this week`);
      for (const [stage, b] of Object.entries(p.byStage)) L.push(`- ${stage}: ${b.moved} moved${b.value ? `, $${b.value}` : ''}${b.fromEmail ? `, ${b.fromEmail} attributed to email` : ''}`);
    }
    if (s.gaps.length) { L.push('', '### Data gaps'); for (const g of s.gaps) L.push(`- ${g}`); }
    if (s.hygiene.length) { L.push('', '### Hygiene problems that distort these numbers'); for (const h of s.hygiene) L.push(`- ${h}`); }
    L.push('');
  }
  return L.join('\n');
}

// --- Main ------------------------------------------------------------------
const sidesCfg = [
  { side: 'Students (school)', token: process.env.GHL_STUDENTS_TOKEN, loc: process.env.GHL_STUDENTS_LOCATION || STUDENTS_ID },
  { side: 'Agency (E4L Services)', token: process.env.GHL_SERVICES_TOKEN, loc: process.env.GHL_SERVICES_LOCATION || SERVICES_ID },
];
for (const c of sidesCfg) if (!c.token && process.env.GHL_API_TOKEN && process.env.GHL_LOCATION_ID === c.loc) c.token = process.env.GHL_API_TOKEN;

const results = [];
for (const c of sidesCfg) {
  if (!c.token) { results.push({ side: c.side, locationName: c.loc, unavailable: 'no API token configured for this sub-account' }); continue; }
  process.stderr.write(`pulling ${c.side}…\n`);
  results.push(await pullSide(c.side, c.token, c.loc));
}
const stamp = UNTIL.toISOString().slice(0, 10);
const dir = path.join(OUT, stamp);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'data.json'), JSON.stringify(results, null, 2));
const md = render(results);
fs.writeFileSync(path.join(dir, 'report.md'), md);
process.stdout.write(md);
process.stderr.write(`\nwrote ${dir}/{data.json,report.md}\n`);
