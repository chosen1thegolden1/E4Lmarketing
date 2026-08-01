/**
 * Smoke test: serves the fixture sites on localhost and runs the real scraper
 * against them — no external network needed.
 *
 *   npm run test:smoke
 *
 * Covers: multi-page crawl, priority-link picking, contact extraction (static engine)
 * and the thin-HTML -> Playwright fallback (JS-rendered fixture).
 */
import "dotenv/config";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scrape } from "../src/scrape/index.js";

const here = path.dirname(fileURLToPath(import.meta.url));

function serve(dir: string): Promise<{ url: string; close: () => void }> {
  const server = http.createServer(async (req, res) => {
    const pathname = new URL(req.url ?? "/", "http://x").pathname;
    const file = pathname === "/" ? "index.html" : pathname.slice(1);
    try {
      const body = await readFile(path.join(dir, file));
      res.writeHead(200, { "content-type": "text/html" }).end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address() as { port: number };
      resolve({ url: `http://127.0.0.1:${port}`, close: () => server.close() });
    });
  });
}

// --- static multi-page site (Cheerio path) ---
{
  const { url, close } = await serve(path.join(here, "fixture-site"));
  try {
    const site = await scrape(url, { log: (m) => console.log(`  [static] ${m}`) });

    assert.equal(site.engine, "cheerio", "static site should not need Playwright");
    const paths = site.pages.map((p) => p.path);
    assert.ok(paths.includes("/"), "home page scraped");
    assert.ok(paths.includes("/about.html"), "about page crawled");
    assert.ok(paths.includes("/services.html"), "services page crawled");
    assert.ok(paths.includes("/contact.html"), "contact page crawled");
    assert.ok(!paths.includes("/style.css"), "asset links skipped");

    assert.match(site.pages[0]!.title, /Joe's Auto Spa/);
    assert.ok(site.contact.phones.some((p) => p.includes("973")), "phone found");
    assert.ok(site.contact.emails.includes("booking@joesautospa.com"), "email found");
    assert.ok(site.contact.socials.facebook && site.contact.socials.instagram, "socials found");
    assert.ok(site.contact.addresses.some((a) => a.includes("Frelinghuysen")), "address found");
    assert.ok(site.contact.hoursLines.length > 0, "hours found");

    const servicesPage = site.pages.find((p) => p.path === "/services.html")!;
    assert.ok(servicesPage.headings.some((h) => /Ceramic Coating/.test(h.text)), "service headings captured");
    console.log("✓ static site: crawl + contact extraction OK");
  } finally {
    close();
  }
}

// --- JS-rendered shell (Playwright fallback path) ---
{
  const { url, close } = await serve(path.join(here, "fixture-site-js"));
  try {
    const site = await scrape(url, { log: (m) => console.log(`  [js] ${m}`) });

    assert.equal(site.engine, "playwright", "thin static HTML should trigger Playwright fallback");
    assert.match(site.pages[0]!.text, /Bella's Salon/, "JS-rendered content captured");
    assert.ok(site.contact.phones.some((p) => p.includes("201")), "phone from rendered DOM");
    assert.ok(site.contact.emails.includes("hello@bellassalonjc.com"), "email from rendered DOM");
    console.log("✓ JS site: Playwright fallback OK");
  } finally {
    close();
  }
}

console.log("\nAll smoke tests passed.");
