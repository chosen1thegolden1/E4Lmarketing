import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { slugFromUrl } from "./lib/slug.js";
import { scrape } from "./scrape/index.js";

const [, , command, ...args] = process.argv;

async function main() {
  switch (command) {
    case "scrape": {
      const url = args.find((a) => !a.startsWith("--"));
      if (!url) fail("Usage: npm run scrape -- <url> [--playwright] [--max-pages=N]");
      const engine = args.includes("--playwright") ? ("playwright" as const) : undefined;
      const maxPages = intFlag(args, "--max-pages");

      const site = await scrape(url, { engine, maxPages, log: (m) => console.error(`  [scrape] ${m}`) });

      const slug = slugFromUrl(site.url);
      const outPath = path.join("out", `${slug}.rawsite.json`);
      await mkdir("out", { recursive: true });
      await writeFile(outPath, JSON.stringify(site, null, 2));

      console.log(`\nScraped ${site.url} (engine: ${site.engine})`);
      console.log(`  pages:  ${site.pages.map((p) => p.path).join(", ")}`);
      console.log(`  phones: ${site.contact.phones.join(", ") || "—"}`);
      console.log(`  emails: ${site.contact.emails.join(", ") || "—"}`);
      console.log(`  socials: ${Object.keys(site.contact.socials).join(", ") || "—"}`);
      console.log(`  saved:  ${outPath}`);
      break;
    }
    case "generate":
      fail("Not built yet — next step: RawSite -> KnowledgeBase (one LLM call, strict JSON schema).");
      break;
    case "render":
      fail("Not built yet — needs the demo-page HTML template pasted into templates/ first.");
      break;
    default:
      fail("Usage: npm run <scrape|generate|render> -- <args>");
  }
}

function intFlag(args: string[], name: string): number | undefined {
  const raw = args.find((a) => a.startsWith(`${name}=`))?.split("=")[1];
  return raw ? Number(raw) : undefined;
}

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
