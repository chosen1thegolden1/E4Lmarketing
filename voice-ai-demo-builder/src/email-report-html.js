// Renders the weekly email report as an HTML email.
//
// Email clients strip <style> blocks and ignore most CSS, so everything is
// tables + inline styles. Palette is the validated dataviz reference set:
// surface #fcfcfb, ink #0b0b0b / #52514e, accent #2a78d6, and the reserved
// status set (good #0ca30c, warning #fab219, critical #d03b3b) — each status
// always ships with an icon + a word, never color alone.
const INK = '#0b0b0b', INK2 = '#52514e', SURF = '#fcfcfb', LINE = '#e6e5e1', ACCENT = '#2a78d6';
const GOOD = '#0ca30c', WARN = '#fab219', CRIT = '#d03b3b';
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const n = v => `<span style="font-variant-numeric:tabular-nums">${esc(v)}</span>`;

// note.md → { working: [], notWorking: [], change: [] }. Headings are matched
// loosely so the Monday session doesn't have to be exact.
export function parseNote(md = '') {
  const out = { working: [], notWorking: [], change: [] };
  let cur = null;
  for (const raw of md.split('\n')) {
    const line = raw.trim();
    if (/^#+\s/.test(line)) { const h = line.replace(/^#+\s*/, '').toLowerCase(); cur = /not|isn|didn/.test(h) ? 'notWorking' : /chang|next|this week/.test(h) ? 'change' : /work/.test(h) ? 'working' : null; continue; }
    if (cur && /^[-*•]\s+/.test(line)) out[cur].push(line.replace(/^[-*•]\s+/, ''));
    else if (cur && line && !/^[-*•]/.test(line) && out[cur].length) out[cur][out[cur].length - 1] += ' ' + line;
    else if (cur && line) out[cur].push(line);
  }
  return out;
}

function callout(icon, label, color, items) {
  if (!items.length) return '';
  const lis = items.map(i => `<li style="margin:0 0 8px 0;line-height:1.45">${esc(i)}</li>`).join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px 0;page-break-inside:avoid;break-inside:avoid"><tr>
    <td style="width:5px;background:${color};border-radius:3px 0 0 3px"></td>
    <td style="padding:12px 16px;background:#ffffff;border:1px solid ${LINE};border-left:0;border-radius:0 6px 6px 0">
      <div style="font:700 11px/1 ${FONT};letter-spacing:.08em;text-transform:uppercase;color:${INK2};margin:0 0 8px 0">${icon}&nbsp; ${esc(label)}</div>
      <ul style="margin:0;padding:0 0 0 18px;font:15px ${FONT};color:${INK}">${lis}</ul>
    </td></tr></table>`;
}

function tile(label, value, sub) {
  return `<td style="padding:0 6px 12px 0;vertical-align:top" width="25%">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid ${LINE};border-radius:6px"><tr><td style="padding:14px 14px 12px 14px">
      <div style="font:600 11px/1 ${FONT};letter-spacing:.06em;text-transform:uppercase;color:${INK2}">${esc(label)}</div>
      <div style="font:700 30px/1.1 ${FONT};color:${INK};margin:8px 0 2px 0;font-variant-numeric:tabular-nums">${esc(value)}</div>
      ${sub ? `<div style="font:12px ${FONT};color:${INK2}">${esc(sub)}</div>` : ''}
    </td></tr></table></td>`;
}

function subjectTable(side) {
  const rows = side.workflowEmails || [];
  if (!rows.length) return `<p style="font:14px ${FONT};color:${INK2};margin:0">No workflow emails in this window.</p>`;
  const eng = side.hasEngagement;
  const TOP = 10, shown = rows.slice(0, TOP), rest = rows.length - shown.length;
  const th = t => `<th align="${/Subject/.test(t) ? 'left' : 'right'}" style="padding:8px 10px;font:600 11px ${FONT};letter-spacing:.05em;text-transform:uppercase;color:${INK2};border-bottom:2px solid ${LINE}">${t}</th>`;
  const td = (v, r = true) => `<td align="${r ? 'right' : 'left'}" style="padding:9px 10px;font:14px ${FONT};color:${INK};border-bottom:1px solid ${LINE}">${r ? n(v) : esc(v)}</td>`;
  const head = ['Subject line', 'Sent', 'Delivered', ...(eng ? ['Opened', 'Clicked', 'Open %', 'Click %'] : []), 'Bounced'].map(th).join('');
  const body = shown.map((w, i) => `<tr style="background:${i % 2 ? '#f6f5f2' : '#ffffff'}">${td(w.subject, false)}${td(w.sent)}${td(w.delivered)}${eng ? td(w.opened) + td(w.clicked) + td(w.openRate + '%') + td(w.clickRate + '%') : ''}${td(w.bounced)}</tr>`).join('');
  const more = rest > 0 ? `<p style="font:12px ${FONT};color:${INK2};margin:8px 0 0 0">…and ${rest} more subject line${rest > 1 ? 's' : ''} with fewer sends. Full list in the archive.</p>` : '';
  const gap = !eng && rows.length ? `<p style="font:13px ${FONT};color:${INK2};margin:10px 0 0 0;padding:10px 12px;background:#f6f5f2;border-radius:6px">ⓘ&nbsp; <b>Opens and clicks aren't in this table.</b> GHL's per-message status only records delivery. They appear once the token has the email-stats scope.</p>` : '';
  return `<div style="overflow-x:auto;-webkit-overflow-scrolling:touch"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;min-width:480px"><tr>${head}</tr>${body}</table></div>${more}${gap}`;
}

function h2(t) { return `<h2 style="font:700 18px ${FONT};color:${INK};margin:28px 0 12px 0;padding:0 0 6px 0;border-bottom:1px solid ${LINE}">${esc(t)}</h2>`; }
function h3(t) { return `<h3 style="font:600 13px ${FONT};letter-spacing:.05em;text-transform:uppercase;color:${INK2};margin:22px 0 10px 0">${esc(t)}</h3>`; }
function list(items, color) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="width:4px;background:${color};border-radius:2px"></td><td style="padding:2px 0 2px 14px"><ul style="margin:0;padding:0 0 0 18px;font:14px ${FONT};color:${INK};line-height:1.5">${items.map(i => `<li style="margin:0 0 6px 0">${esc(i)}</li>`).join('')}</ul></td></tr></table>`;
}

function sideBlock(s) {
  if (s.unavailable) return `${h2(s.side)}<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="width:5px;background:${WARN};border-radius:3px"></td><td style="padding:12px 16px;font:14px ${FONT};color:${INK}">⚠️&nbsp; <b>Not pulled.</b> ${esc(s.unavailable)}.</td></tr></table>`;
  const delivered = s.workflowEmails.reduce((a, w) => a + w.delivered, 0) + s.campaigns.reduce((a, c) => a + c.sent, 0);
  const bounced = s.workflowEmails.reduce((a, w) => a + w.bounced, 0) + s.campaigns.reduce((a, c) => a + c.failed, 0);
  const moved = s.pipelines.reduce((a, p) => a + p.movedThisWindow, 0);
  const purchases = s.pipelines.reduce((a, p) => a + Object.entries(p.byStage).filter(([st]) => p.purchaseStages.includes(st)).reduce((b, [, v]) => b + v.moved, 0), 0);
  let html = `<div style="page-break-before:always;break-before:page"></div>` + h2(`${s.side} — ${s.locationName}`);
  html += `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="page-break-inside:avoid;break-inside:avoid"><tr>${tile('Delivered', delivered, `${s.workflowEmailsTotal} workflow · ${s.campaigns.length} broadcast`)}${tile('Bounced', bounced, delivered ? `${Math.round(bounced / delivered * 1000) / 10}% of sent` : '')}${tile('Form fills', s.formsTotal, s.forms.map(f => f.form).slice(0, 2).join(', ') || 'none this week')}${tile('Booked', s.appointmentsTotal, s.appointments.map(a => a.calendar).slice(0, 2).join(', ') || 'none this week')}</tr></table>`;
  html += `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="page-break-inside:avoid;break-inside:avoid"><tr>${tile('Stage moves', moved, 'across all pipelines')}${tile('Purchases', purchases, 'entered a paid stage')}<td width="50%"></td></tr></table>`;
  html += h3('Subject lines') + subjectTable(s);
  if (s.campaigns.length) { html += h3('Broadcasts'); html += `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">` + s.campaigns.map(c => `<tr><td style="padding:8px 10px;font:14px ${FONT};color:${INK};border-bottom:1px solid ${LINE}">${esc(c.subject)}</td><td align="right" style="padding:8px 10px;font:14px ${FONT};color:${INK};border-bottom:1px solid ${LINE}">${n(c.sent)} sent${c.stats ? ` · ${n(c.stats.opened ?? c.stats.opens ?? '—')} opened · ${n(c.stats.clicked ?? c.stats.clicks ?? '—')} clicked` : ''}${c.utm ? '' : ' · <span style="color:' + CRIT + '">no UTM</span>'}</td></tr>`).join('') + '</table>'; }
  if (s.forms.length || s.appointments.length) { html += h3('Where conversions came from'); html += list([...s.forms.map(f => `${f.form}: ${f.submissions} submission${f.submissions === 1 ? '' : 's'}`), ...s.appointments.map(a => `${a.calendar}: ${a.booked} booked`)], ACCENT); }
  const stageLines = s.pipelines.flatMap(p => Object.entries(p.byStage).map(([st, b]) => `${p.name} → ${st}: ${b.moved} moved${b.value ? `, $${b.value}` : ''}${b.fromEmail ? `, ${b.fromEmail} from email` : ''}`));
  html += h3('Pipeline movement') + (stageLines.length ? list(stageLines, ACCENT) : `<p style="font:14px ${FONT};color:${INK2};margin:0">Nothing changed stage this week.</p>`);
  if (s.hygiene.length) html += h3('⚠️ Problems distorting these numbers') + list(s.hygiene, WARN);
  if (s.gaps.length) html += `<p style="font:12px ${FONT};color:${INK2};margin:16px 0 0 0;line-height:1.5"><b>Data gaps:</b> ${s.gaps.map(esc).join(' ')}</p>`;
  return html;
}

// The claude.ai Artifact tool wraps content in its own <html>/<body>, so the
// Monday page is the same markup minus the document shell, plus a <title>.
export function renderArtifact(sides, note, win) {
  const full = renderHtml(sides, note, win);
  const inner = full.slice(full.indexOf('<table role="presentation" width="100%"'), full.lastIndexOf('</body>'));
  const d = s => new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `<title>E4L Email Report ${d(win.since)}–${d(win.until)}</title>\n<style>body{background:${SURF};margin:0}</style>\n` + inner;
}

export function renderHtml(sides, note, { since, until }) {
  const d = s => new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const noteHtml = (note.working.length || note.notWorking.length || note.change.length)
    ? callout('✅', 'What worked', GOOD, note.working) + callout('⛔', "What didn't", CRIT, note.notWorking) + callout('→', 'Change this week', ACCENT, note.change)
    : `<p style="font:14px ${FONT};color:${INK2}">Note not written for this week.</p>`;
  return `<!doctype html><html><body style="margin:0;padding:0;background:${SURF};-webkit-print-color-adjust:exact;print-color-adjust:exact">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SURF}"><tr><td align="center" style="padding-block:24px;padding-inline:16px">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%">
  <tr><td style="background:#1a1a19;border-radius:8px 8px 0 0;padding:22px 26px">
    <div style="font:600 11px/1 ${FONT};letter-spacing:.1em;text-transform:uppercase;color:#c3c2b7">Eat 4 Life · weekly email report</div>
    <div style="font:700 24px/1.2 ${FONT};color:#ffffff;margin:8px 0 0 0">${d(since)} – ${d(until)}</div>
  </td></tr>
  <tr><td style="background:${SURF};padding:22px 26px 30px 26px;border:1px solid ${LINE};border-top:0;border-radius:0 0 8px 8px">
    ${noteHtml}
    ${sides.map(sideBlock).join('')}
    <p style="font:12px ${FONT};color:${INK2};margin:30px 0 0 0;padding-top:14px;border-top:1px solid ${LINE}">Numbers come straight from GHL's API, read-only, every Monday. Full data and history live in <span style="font-family:monospace">reports/email/</span> in the repo. If a number looks wrong, the data file will show why.</p>
  </td></tr>
</table></td></tr></table></body></html>`;
}
