import * as cheerio from 'cheerio';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const MAX_PAGES = 6;
const MAX_TEXT_PER_PAGE = 6000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchHtml(url, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': UA,
          Accept: 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(20_000),
      });
      // Retry 403/429/5xx — often bot-protection or rate limits that clear on backoff
      if ([403, 429, 500, 502, 503].includes(res.status)) {
        throw new Error(`HTTP ${res.status}`);
      }
      if (!res.ok) throw Object.assign(new Error(`GET ${url} -> HTTP ${res.status}`), { fatal: true });
      const type = res.headers.get('content-type') || '';
      if (!type.includes('text/html')) {
        throw Object.assign(new Error(`GET ${url} -> not HTML (${type})`), { fatal: true });
      }
      return res.text();
    } catch (err) {
      if (err.fatal) throw err;
      lastErr = err;
      if (i < attempts - 1) await sleep(2000 * 2 ** i);
    }
  }
  throw new Error(`GET ${url} failed after ${attempts} attempts: ${lastErr.message}`);
}

function extractPage(url, html) {
  const $ = cheerio.load(html);
  $('script, style, noscript, svg, iframe').remove();

  const title = $('title').first().text().trim();
  const metaDesc = $('meta[name="description"]').attr('content')?.trim() || '';

  const headings = [];
  $('h1, h2, h3').each((_, el) => {
    const t = $(el).text().replace(/\s+/g, ' ').trim();
    if (t && t.length > 2 && !headings.includes(t)) headings.push(t);
  });

  const seen = new Set();
  const blocks = [];
  $('p, li, blockquote, figcaption').each((_, el) => {
    const t = $(el).text().replace(/\s+/g, ' ').trim();
    if (t.length >= 20 && !seen.has(t)) {
      seen.add(t);
      blocks.push(t);
    }
  });
  let text = blocks.join('\n');
  if (text.length > MAX_TEXT_PER_PAGE) text = text.slice(0, MAX_TEXT_PER_PAGE) + '…';

  const phones = new Set();
  const emails = new Set();
  $('a[href^="tel:"]').each((_, el) =>
    phones.add(decodeURIComponent($(el).attr('href').slice(4)).trim())
  );
  $('a[href^="mailto:"]').each((_, el) =>
    emails.add($(el).attr('href').slice(7).split('?')[0].trim())
  );
  const bodyText = $('body').text();
  for (const m of bodyText.matchAll(/(?:\+1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/g)) {
    phones.add(m[0].trim());
  }

  const internalLinks = new Set();
  const origin = new URL(url).origin;
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    try {
      const u = new URL(href, origin);
      if (u.origin !== origin) return;
      u.hash = '';
      u.search = '';
      const p = u.pathname;
      if (/\.(jpg|jpeg|png|gif|pdf|zip|css|js|ico|svg|webp)$/i.test(p)) return;
      if (/^\/(cart|checkout|search|account|login|commerce)/i.test(p)) return;
      internalLinks.add(u.href);
    } catch {
      /* ignore malformed hrefs */
    }
  });

  return { url, title, metaDesc, headings, text, phones: [...phones], emails: [...emails], internalLinks: [...internalLinks] };
}

export async function scrapeSite(startUrl) {
  const start = new URL(startUrl).href;
  const visited = new Set();
  const queue = [start];
  const pages = [];

  while (queue.length && pages.length < MAX_PAGES) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);
    try {
      const html = await fetchHtml(url);
      const page = extractPage(url, html);
      pages.push(page);
      for (const link of page.internalLinks) {
        if (!visited.has(link) && !queue.includes(link)) queue.push(link);
      }
    } catch (err) {
      console.warn(`  ! skipped ${url}: ${err.message}`);
    }
  }

  if (!pages.length) throw new Error(`Could not scrape any pages from ${startUrl}`);

  const phones = [...new Set(pages.flatMap((p) => p.phones))];
  const emails = [...new Set(pages.flatMap((p) => p.emails))].filter(
    (e) => !/example\.com$/i.test(e)
  );

  return {
    startUrl: start,
    hostname: new URL(start).hostname,
    siteTitle: pages[0].title,
    phones,
    emails,
    pages: pages.map(({ url, title, metaDesc, headings, text }) => ({
      url,
      title,
      metaDesc,
      headings,
      text,
    })),
  };
}
