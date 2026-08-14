// CSV writer + reader for the lead review sheet. Uses the RFC 4180 quoting
// rules Excel/Sheets both understand — no npm dependency needed.

const HEADERS = [
  'Send?',
  'Business',
  'Website',
  'Email',
  'Phone',
  'City',
  'Rating',
  'Reviews',
  'Subject',
  'Body',
  'Notes',
  'Status',
  'PlaceId',
  'GhlContactId',
];

const escape = (v) => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(rows) {
  const lines = [HEADERS.join(',')];
  for (const r of rows) {
    lines.push(HEADERS.map((h) => escape(r[h])).join(','));
  }
  return lines.join('\n') + '\n';
}

// Minimal CSV parser — handles quoted fields with embedded commas/quotes/newlines.
export function fromCsv(text) {
  const rows = [];
  let cur = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i += 2; continue; }
      if (c === '"') { inQuotes = false; i++; continue; }
      field += c;
      i++;
    } else {
      if (c === '"' && field === '') { inQuotes = true; i++; continue; }
      if (c === ',') { cur.push(field); field = ''; i++; continue; }
      if (c === '\n' || c === '\r') {
        cur.push(field); field = ''; rows.push(cur); cur = [];
        if (c === '\r' && text[i + 1] === '\n') i++;
        i++;
        continue;
      }
      field += c;
      i++;
    }
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur); }
  const headers = rows.shift() || [];
  return rows
    .filter((r) => r.some((v) => v && v.trim()))
    .map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
}

export { HEADERS };
