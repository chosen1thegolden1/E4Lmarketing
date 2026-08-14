// Hunter.io Domain Search — finds business emails from a domain name.
// Docs: https://hunter.io/api-documentation/v2#domain-search
//
// NOT WIRED INTO leads-cli.js YET. Parked here for the day scraping alone
// can't keep up with volume (typically when we push into verticals like
// med spa / restaurant / salon that hide behind contact forms).
//
// To activate: sign up at hunter.io (~$49/mo Starter = 500 lookups),
// set HUNTER_API_KEY in env, then import findEmail from this file into
// leads-cli.js after the scrape-light step:
//
//   if (!scrape.email && process.env.HUNTER_API_KEY) {
//     const found = await findEmail(p.website, process.env.HUNTER_API_KEY);
//     if (found) scrape.email = found.email;
//   }

const ENDPOINT = 'https://api.hunter.io/v2/domain-search';

// Titles that suggest a decision-maker for cold outreach to local businesses.
const DECISION_MAKER = /\b(owner|founder|ceo|coo|cmo|president|principal|partner|director|managing|proprietor|md)\b/i;

function domainFromUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * Returns the best email for cold outreach to a business, or null if none.
 * Prefers decision-makers, then any high-confidence personal, then generic.
 */
export async function findEmail(website, apiKey) {
  if (!apiKey) return null;
  const domain = domainFromUrl(website);
  if (!domain) return null;

  const url = `${ENDPOINT}?domain=${encodeURIComponent(domain)}&limit=25&api_key=${encodeURIComponent(apiKey)}`;
  let data;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) {
      // 401/402 = plan/auth issue. 429 = rate limit. 404 = domain unknown.
      // In all cases, silently fall through — Rozel isn't blocked by Hunter.
      return null;
    }
    data = await res.json();
  } catch {
    return null;
  }

  const emails = (data?.data?.emails || []).filter((e) => e.value && (e.confidence ?? 0) >= 60);
  if (!emails.length) return null;

  const score = (e) => {
    let s = e.confidence || 0;
    const position = (e.position || '').trim();
    if (DECISION_MAKER.test(position)) s += 40;
    if (e.type === 'personal') s += 10;
    if (e.first_name || e.last_name) s += 5;
    return s;
  };
  emails.sort((a, b) => score(b) - score(a));
  const best = emails[0];

  return {
    email: best.value,
    firstName: best.first_name || null,
    lastName: best.last_name || null,
    position: best.position || null,
    confidence: best.confidence || null,
    source: 'hunter',
  };
}
