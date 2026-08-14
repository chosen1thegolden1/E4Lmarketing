// Lightweight scrape: fetch the homepage only, pull email + one paragraph
// of body copy. Enough for Claude to personalize an email — no crawling.
import * as cheerio from 'cheerio';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

export async function scrapeLight(url) {
  const out = { email: null, tagline: null, blurb: null, error: null };
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' },
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      out.error = `HTTP ${res.status}`;
      return out;
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    $('script, style, noscript, svg, iframe').remove();

    // Email: mailto first, then body regex
    $('a[href^="mailto:"]').each((_, el) => {
      const e = $(el).attr('href').slice(7).split('?')[0].trim();
      if (e && !/example\.com$/i.test(e) && !out.email) out.email = e;
    });
    if (!out.email) {
      const m = $('body').text().match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
      if (m && !/example\.com$/i.test(m[0])) out.email = m[0];
    }

    // Tagline: og:description or meta description
    out.tagline =
      $('meta[property="og:description"]').attr('content')?.trim() ||
      $('meta[name="description"]').attr('content')?.trim() ||
      null;

    // Blurb: first meaty paragraph or first H1/H2 pair
    const paras = [];
    $('h1, h2, p').each((_, el) => {
      const t = $(el).text().replace(/\s+/g, ' ').trim();
      if (t.length >= 20 && t.length <= 400) paras.push(t);
    });
    out.blurb = paras.slice(0, 3).join(' · ').slice(0, 500) || null;
  } catch (err) {
    out.error = err.message.slice(0, 120);
  }
  return out;
}
