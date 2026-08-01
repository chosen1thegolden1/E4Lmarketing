// Offline smoke test: serves a realistic business page on loopback and scrapes it.
// Loopback isn't subject to the egress allowlist, so this validates the full
// scrape() pipeline (fetch -> extract -> RawSite) without external network access.
//   npx tsx test/local-smoke.ts
import http from "node:http";
import { scrape } from "../src/scrape/index";

const HTML = `<!doctype html><html><head>
<title>Lux You Med Spa — Botox, Fillers & Facials in Austin, TX</title>
<meta name="description" content="Lux You Med Spa offers Botox, dermal fillers, HydraFacials, and laser treatments in Austin. Book your free consultation today.">
<meta property="og:image" content="https://luxyou.example/og.jpg">
</head><body>
<header><nav>
  <a href="/">Home</a><a href="/services">Services</a><a href="/about">About</a><a href="/contact">Contact</a>
</nav></header>
<h1>Look Like You, Only Luxed.</h1>
<h2>Our Services</h2>
<ul><li>Botox &amp; Dysport</li><li>Dermal Fillers</li><li>HydraFacial</li><li>Laser Hair Removal</li><li>Microneedling</li></ul>
<h2>Why Lux You</h2>
<p>Board-certified injectors. 5,000+ treatments performed. Same-week appointments.</p>
<h3>Hours</h3><p>Mon–Sat 9am–6pm</p>
<p>Call <a href="tel:+15125550142">(512) 555-0142</a> or email <a href="mailto:hello@luxyoumedspa.com">hello@luxyoumedspa.com</a>.</p>
<footer>
  <a href="https://instagram.com/luxyoumedspa">Instagram</a>
  <a href="https://facebook.com/luxyoumedspa">Facebook</a>
</footer>
</body></html>`;

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "text/html");
  res.end(HTML);
});

server.listen(0, async () => {
  const addr = server.address();
  const port = typeof addr === "object" && addr ? addr.port : 0;
  try {
    const site = await scrape(`http://127.0.0.1:${port}`);
    console.log(JSON.stringify(site, null, 2));
  } catch (err) {
    console.error("smoke failed:", (err as Error)?.message || err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
