#!/usr/bin/env node
/**
 * build-emails.js — turn a weekly broadcast markdown file into paste-ready,
 * email-safe HTML, one file per email, plus a schedule and a QA page.
 *
 * Why this exists: the batch used to reach GHL through a human retyping links
 * by hand. That made one person a single point of failure for the whole week.
 * Now the links come out live and the human job is QA, not construction.
 *
 *   node scripts/build-emails.js docs/BROADCAST_WEEK_2026-09-21.md
 *
 * Writes docs/broadcasts/<week>/ and exits non-zero on anything that would
 * put a broken email in front of a list.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const FOOTER_ADDRESS = 'Eat 4 Life Marketing · 215 E Regent St, Inglewood, CA 90301';
const FROM = 'chosen@mail.e4lmarketingdemos.com';
// GHL merge tags. If a test send shows these rendering literally, the account
// uses different tags — change them here once, not in eight files.
const TAG_FIRST_NAME = '{{contact.first_name}}';
const TAG_UNSUBSCRIBE = '{{unsubscribe_url}}';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const errors = [];
const warnings = [];
const fail = (id, msg) => errors.push(`${id}: ${msg}`);
const warn = (id, msg) => warnings.push(`${id}: ${msg}`);

function esc(s) {
  return s.replace(/&(?!(?:[a-zA-Z]+|#\d+);)/g, '&amp;')
          .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * A link marker is `visible text → (LINK: url)` or `👉 visible text: (LINK: url)`.
 * Anchor the visible text, keep any leading emoji outside the anchor so the
 * arrow or pointer still reads as decoration rather than part of the link.
 */
const LINK_LINE = /^(\s*)(.*?)\s*(?:→|:)\s*\(LINK:\s*([^)\s]+)\)\s*$/;
const LEADING_DECOR = /^((?:[^\w\[(]|\s)*)(.*)$/u;

function renderBody(raw, id) {
  const links = [];
  const html = raw.split('\n').map((line) => {
    const m = line.match(LINK_LINE);
    if (!m) {
      if (line.includes('(LINK')) fail(id, `link marker the builder could not read: ${line.trim()}`);
      return esc(line);
    }
    const [, indent, textRaw, url] = m;
    if (!/^https?:\/\//.test(url)) fail(id, `link is not a real URL: ${url}`);
    if (!/[?&]utm_source=email/.test(url)) fail(id, `link has no UTMs, the report will go blind on it: ${url}`);
    if (/gsgagency\.com/i.test(url)) fail(id, `link points at gsgagency.com: ${url}`);
    links.push(url);
    const [, decor, text] = textRaw.match(LEADING_DECOR);
    if (!text.trim()) fail(id, `link has no visible text: ${line.trim()}`);
    return `${esc(indent)}${esc(decor)}<a href="${url}" style="color:#2a78d6;font-weight:600;">${esc(text)}</a>`;
  }).join('\n');
  return { html, links };
}

/**
 * Body text is written as a text message: blank lines separate paragraphs.
 *
 * Inside a paragraph the source is hard-wrapped around 60 characters so it
 * reads well in the doc. Those wraps are not meant to survive into the email,
 * where a forced break at 60 characters looks ragged on a phone. A wrap is
 * cosmetic when the line runs long and stops mid-thought; a break the writer
 * meant is short, or lands after a full stop. Keep those, drop the rest.
 */
const SOFT_WRAP_MIN = 45;

function reflow(block) {
  const lines = block.split('\n').map((l) => l.trimEnd()).filter((l, i, a) => l || i < a.length);
  const out = [];
  for (const line of lines) {
    const prev = out[out.length - 1];
    if (prev !== undefined && prev.length >= SOFT_WRAP_MIN && !/[.?!:]$/.test(prev)) {
      out[out.length - 1] = `${prev} ${line.trimStart()}`;
    } else {
      out.push(line);
    }
  }
  return out.join('<br>');
}

function paragraphs(bodyHtml) {
  return bodyHtml.split(/\n{2,}/).map((block) => {
    const inner = reflow(block);
    if (!inner.trim()) return '';
    return `<p style="margin:0 0 18px;">${inner}</p>`;
  }).filter(Boolean).join('\n          ');
}

function wrap(email) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(email.subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f2;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(email.preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f2;">
  <tr>
    <td align="center" style="padding:24px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:6px;">
        <tr>
          <td style="padding:32px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#1a1a1a;">
          ${paragraphs(email.bodyHtml)}
          </td>
        </tr>
        <tr>
          <td style="padding:0 28px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:#6b6b68;border-top:1px solid #e6e6e3;padding-top:20px;">
            ${esc(FOOTER_ADDRESS)}<br>
            <a href="${TAG_UNSUBSCRIBE}" style="color:#6b6b68;">Unsubscribe</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function parse(md, week) {
  const emails = [];
  // Each email is a heading whose first token is its ID.
  const re = /^(#{2,3})\s+(A-SUN|S-SUN|A\d+|S\d+|B\d+)\s+—\s+(.*)$/gm;
  const heads = [];
  let m;
  while ((m = re.exec(md)) !== null) heads.push({ id: m[2], rest: m[3], start: m.index, after: re.lastIndex });

  heads.forEach((h, i) => {
    const chunk = md.slice(h.after, i + 1 < heads.length ? heads[i + 1].start : md.length);
    const proposed = /propos/i.test(h.rest);
    const day = DAYS.find((d) => h.rest.includes(d)) || null;
    const bench = /^B\d+$/.test(h.id);

    const subject = (chunk.match(/^\*\*Subject:\*\*\s*(.+)$/m) || [])[1];
    const preview = (chunk.match(/^\*\*Preview text:\*\*\s*(.+)$/m) || [])[1];
    const meta = (chunk.match(/^\*\*Reader:\*\*\s*(.+)$/m) || [])[1] || '';
    const fence = chunk.match(/```\n([\s\S]*?)\n```/);

    const key = proposed ? `${h.id}-alt` : h.id;
    if (!subject) fail(key, 'no subject line');
    if (!preview) fail(key, 'no preview text');
    if (!fence) { fail(key, 'no email body found'); return; }

    const raw = fence[1];
    if (/gsgagency\.com/i.test(raw)) fail(key, 'body mentions gsgagency.com');
    if (!bench && !proposed && !day) fail(key, 'no send day in the heading');

    const { html, links } = renderBody(raw, key);
    const side = h.id.startsWith('A') ? 'agency' : 'student';
    if (side === 'agency' && /^\s*Yo\b/m.test(raw)) fail(key, 'agency email opens with "Yo" — agency opens with "Hey"');
    if (side === 'student' && /^\s*Hey\s+\[/m.test(raw)) warn(key, 'student email opens with "Hey" — student opens with "Yo"');
    links.forEach((u) => {
      const med = (u.match(/utm_medium=([a-z]+)/) || [])[1];
      if (med && med !== side) fail(key, `utm_medium=${med} on a ${side} email`);
    });
    if (!links.length && !/S-SUN/.test(h.id)) warn(key, 'no links at all — deliberate?');

    emails.push({
      id: h.id, key, side, day, bench, proposed, subject, preview, meta,
      bodyHtml: html.replace(/\[First Name\]/g, TAG_FIRST_NAME),
      linkCount: links.length, week,
    });
  });
  return emails;
}

function sendDate(weekMonday, day) {
  const offset = { Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6 }[day];
  const d = new Date(`${weekMonday}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

function main() {
  const src = process.argv[2];
  if (!src) { console.error('usage: node scripts/build-emails.js docs/BROADCAST_WEEK_<YYYY-MM-DD>.md'); process.exit(2); }
  const week = (path.basename(src).match(/(\d{4}-\d{2}-\d{2})/) || [])[1];
  if (!week) { console.error('filename must carry the week-of Monday date'); process.exit(2); }

  const md = fs.readFileSync(src, 'utf8');
  const emails = parse(md, week);
  if (!emails.length) { console.error('no emails found — has the doc format changed?'); process.exit(2); }

  const outDir = path.join(path.dirname(src), 'broadcasts', week);
  fs.mkdirSync(outDir, { recursive: true });

  const live = emails.filter((e) => !e.bench && !e.proposed);
  for (const e of emails) fs.writeFileSync(path.join(outDir, `${e.key}.html`), wrap(e));

  const rows = live
    .map((e) => ({ ...e, date: sendDate(week, e.day) }))
    .sort((a, b) => (a.date === b.date ? a.side.localeCompare(b.side) : a.date.localeCompare(b.date)));

  const schedule = `# Send schedule — week of ${week}

Built by \`scripts/build-emails.js\`. Every link below is already live in the HTML.
Daniel loads the agency side, Sammy loads the student side.

**Send from:** ${FROM} — never gsgagency.com.
**Send time:** 8:00 AM Pacific.
**Merge tags:** first name \`${TAG_FIRST_NAME}\`, unsubscribe \`${TAG_UNSUBSCRIBE}\`. Send yourself a
test first — if either renders literally, fix it once in \`scripts/build-emails.js\`.

| Send date | Day | Side | File | Subject | Preview text | Links |
|---|---|---|---|---|---|---|
${rows.map((e) => `| ${e.date} | ${e.day} | ${e.side} | \`${e.key}.html\` | ${e.subject} | ${e.preview} | ${e.linkCount} |`).join('\n')}

## Load checklist — tick each one

- [ ] Paste each file's HTML into the GHL email builder (source/code view), one campaign per row.
- [ ] Subject and preview text copied exactly from the table above.
- [ ] Sending address is ${FROM}.
- [ ] Schedule for 8:00 AM Pacific on the send date shown.
- [ ] Test send to yourself: first name renders, unsubscribe works, every link opens.
- [ ] Agency rows go to the agency list, student rows to the student list. Never crossed.

${emails.filter((e) => e.bench).length ? `## Bench — not scheduled\n\n${emails.filter((e) => e.bench).map((e) => `- \`${e.key}.html\` — ${e.subject}`).join('\n')}\n` : ''}${emails.filter((e) => e.proposed).length ? `## Proposed alternates — Chosen's call, not scheduled\n\n${emails.filter((e) => e.proposed).map((e) => `- \`${e.key}.html\` — ${e.subject}`).join('\n')}\n` : ''}`;

  fs.writeFileSync(path.join(outDir, 'SCHEDULE.md'), schedule);

  // One page Zion can scroll to QA the whole week.
  const qa = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>E4L Broadcast — week of ${week}</title>
<style>
:root{--surface:#fcfcfb;--ink:#0b0b0b;--muted:#52514e;--line:#e6e6e3;--accent:#2a78d6;}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--surface:#141413;--ink:#f2f2ef;--muted:#a3a29e;--line:#2c2c2a;--accent:#6ba6ef;}}
:root[data-theme="dark"]{--surface:#141413;--ink:#f2f2ef;--muted:#a3a29e;--line:#2c2c2a;--accent:#6ba6ef;}
body{margin:0;background:var(--surface);color:var(--ink);font:16px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;padding-block:32px;padding-left:16px;padding-right:16px;}
main{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:32px;}
h1{font-size:24px;margin:0;}
article{border:1px solid var(--line);border-radius:8px;overflow:hidden;}
header{padding:16px 20px;border-bottom:1px solid var(--line);}
.id{font:600 12px/1 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);}
.subj{font-size:18px;font-weight:600;margin:6px 0 4px;}
.prev,.meta{color:var(--muted);font-size:13px;margin:0;}
iframe{width:100%;height:640px;border:0;display:block;background:#f4f4f2;}
</style></head><body><main>
<h1>Broadcast QA — week of ${week}</h1>
<p style="margin:0;color:var(--muted);">Links are live. Click every one. Flag anything wrong in the Google Doc as a comment, don't edit the copy.</p>
<div style="overflow-x:auto;"><table style="border-collapse:collapse;width:100%;font-size:14px;">
<caption style="text-align:left;font-weight:600;padding-bottom:8px;">Send schedule — 8:00 AM Pacific, from ${FROM}</caption>
<thead><tr>${['Send', 'Day', 'Side', 'Subject'].map((h) => `<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);color:var(--muted);font-weight:600;">${h}</th>`).join('')}</tr></thead>
<tbody>${rows.map((e) => `<tr><td style="padding:8px 10px;border-bottom:1px solid var(--line);font-variant-numeric:tabular-nums;white-space:nowrap;">${e.date}</td><td style="padding:8px 10px;border-bottom:1px solid var(--line);">${e.day}</td><td style="padding:8px 10px;border-bottom:1px solid var(--line);">${e.side}</td><td style="padding:8px 10px;border-bottom:1px solid var(--line);">${esc(e.subject)}</td></tr>`).join('')}</tbody>
</table></div>
${emails.map((e) => `<article>
<header><div class="id">${e.key}${e.day ? ` · ${e.day}` : e.bench ? ' · bench' : ' · proposed'} · ${e.side}</div>
<div class="subj">${esc(e.subject)}</div><p class="prev">${esc(e.preview)}</p><p class="meta">${esc(e.meta.replace(/\*\*/g, ''))}</p></header>
<iframe src="${e.key}.html" title="${esc(e.subject)}" loading="lazy"></iframe></article>`).join('\n')}
</main></body></html>`;
  fs.writeFileSync(path.join(outDir, 'index.html'), qa);

  for (const w of warnings) console.warn(`  warn  ${w}`);
  if (errors.length) {
    console.error(`\n${errors.length} problem(s) — nothing is safe to send:\n`);
    for (const e of errors) console.error(`  FAIL  ${e}`);
    process.exit(1);
  }
  console.log(`Built ${emails.length} emails (${live.length} scheduled) → ${outDir}`);
  for (const e of rows) console.log(`  ${e.date}  ${e.side.padEnd(7)}  ${e.key.padEnd(6)}  ${e.subject}`);
}

main();
