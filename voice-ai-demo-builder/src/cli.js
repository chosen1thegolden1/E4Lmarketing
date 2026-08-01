#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scrapeSite } from './scrape.js';
import { generateDemo } from './generate.js';
import { renderDemo } from './render.js';
import { createVoiceAgent } from './ghl.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEMOS_DIR = path.join(__dirname, '..', 'demos');

function usage() {
  console.log('Usage: npm run demo -- <website-url> [--push] [--demo-phone=+15551234567]');
  console.log('  --push          also create the GoHighLevel Voice AI agent');
  console.log('  --demo-phone=N  put a click-to-call demo number on the page');
  process.exit(1);
}

const args = process.argv.slice(2);
const push = args.includes('--push');
const demoPhoneArg = args.find((a) => a.startsWith('--demo-phone='))?.split('=')[1];
const url = args.find((a) => !a.startsWith('--'));
if (!url) usage();
try {
  new URL(url);
} catch {
  console.error(`Invalid URL: ${url}`);
  process.exit(1);
}

console.log(`\n▸ Scraping ${url} ...`);
const site = await scrapeSite(url);
console.log(`  ✓ ${site.pages.length} page(s) scraped — "${site.siteTitle}"`);

console.log('▸ Generating demo content with Claude ...');
const data = await generateDemo(site);
data._sourceUrl = site.startUrl;
console.log(`  ✓ generated with ${data._model} — business: ${data.business.name}`);

if (demoPhoneArg) data._demoPhone = demoPhoneArg;

console.log('▸ Rendering demo page ...');
let { slug, htmlPath } = await renderDemo(data, DEMOS_DIR);
console.log(`  ✓ ${path.relative(process.cwd(), htmlPath)}`);

if (push) {
  console.log('▸ Creating GoHighLevel Voice AI agent ...');
  const agent = await createVoiceAgent(data);
  console.log(`  ✓ agent created: "${agent.agentName}" (id: ${agent.id})`);
  console.log(`    greeting: ${agent.welcomeMessage}`);
  const inbound = agent.inboundNumbers?.[0] || agent.inboundNumber;
  if (inbound && !data._demoPhone) {
    data._demoPhone = inbound;
    ({ slug, htmlPath } = await renderDemo(data, DEMOS_DIR));
    console.log(`  ✓ page re-rendered with click-to-call demo line ${inbound}`);
  }
}

console.log(`\nDone. Open demos/${slug}/index.html to view the demo.\n`);
