import { scrape } from "./index";

const url = process.argv[2];
if (!url) {
  console.error("Usage: npm run scrape -- <url>");
  process.exit(1);
}

scrape(url)
  .then((site) => console.log(JSON.stringify(site, null, 2)))
  .catch((err) => {
    console.error("Scrape failed:", err?.message || err);
    process.exit(1);
  });
