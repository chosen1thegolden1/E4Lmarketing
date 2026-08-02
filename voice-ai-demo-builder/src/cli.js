#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scrapeSite } from './scrape.js';
import { generateDemo } from './generate.js';
import { renderDemo } from './render.js';
import { createVoiceAgent } from './ghl.js';
import { assignNumber } from './pool.js';
import { upsertLead } from './crm.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEMOS_DIR = path.join(__dirname, '..', 'demos');

function usage() {
  console.log('Usage: npm run demo -- <website-url> [options]');
  console.log('  --push            create the GHL Voice AI agent + assign a pool number');
  console.log('  --email=X         lead email — upserts the GHL contact with demo URL/phone');
  console.log('  --rep=X           rep/affiliate ID for attribution (rep:X tag on the contact)');
  console.log('  --slug=X          override the output folder name (default: from lead domain)');
  console.log('  --demo-phone=N    put a specific click-to-call number on the page (skips pool)');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const push = args.includes('--push');
const leadEmail = flag('email');
const rep = flag('rep');
const demoPhoneArg = flag('demo-phone');
const url = args.find((a) => !a.startsWith('--'));
if (!url) usage();
let parsedUrl;
try {
  parsedUrl = new URL(url);
} catch {
  console.error(`Invalid URL: ${url}`);
  process.exit(1);
}

// Deterministic slug from the lead's domain (e.g. allthingsroofing.squarespace.com
// -> "allthingsroofing"), so the demo URL is knowable before the build finishes.
const labels = parsedUrl.hostname.split('.');
const defaultSlug = (labels[0] === 'www' ? labels[1] : labels[0])
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-');
const slug = flag('slug') || defaultSlug;

const baseUrl = process.env.DEMO_BASE_URL?.replace(/\/+$/, '');
const demoUrl = baseUrl ? `${baseUrl}/${slug}/` : null;

console.log(`\n▸ Scraping ${url} ...`);
const site = await scrapeSite(url);
console.log(`  ✓ ${site.pages.length} page(s) scraped — "${site.siteTitle}"`);

console.log('▸ Generating demo content with Claude ...');
const data = await generateDemo(site);
data._sourceUrl = site.startUrl;
data._slug = slug;
if (demoPhoneArg) data._demoPhone = demoPhoneArg;
console.log(`  ✓ generated with ${data._model} — business: ${data.business.name}`);

console.log('▸ Rendering demo page ...');
let { htmlPath } = await renderDemo(data, DEMOS_DIR);
console.log(`  ✓ ${path.relative(process.cwd(), htmlPath)}`);

if (push) {
  console.log('▸ Creating GoHighLevel Voice AI agent ...');
  const agent = await createVoiceAgent(data);
  console.log(`  ✓ agent created: "${agent.agentName}" (id: ${agent.id})`);

  if (!data._demoPhone) {
    console.log('▸ Assigning demo number from pool ...');
    const number = await assignNumber({
      slug,
      agentId: agent.id,
      agentName: agent.agentName,
      business: data.business.name,
      leadEmail,
      rep,
    });
    data._demoPhone = number;
    ({ htmlPath } = await renderDemo(data, DEMOS_DIR));
    console.log(`  ✓ ${number} attached — page re-rendered with click-to-call`);
  }
}

if (leadEmail) {
  console.log('▸ Updating GHL contact ...');
  const contact = await upsertLead({
    email: leadEmail,
    business: data.business.name,
    website: site.startUrl,
    demoUrl,
    demoPhone: data._demoPhone,
    rep,
  });
  console.log(`  ✓ contact ${contact.id} tagged voice-demo${rep ? ` + rep:${rep}` : ''}`);
}

console.log(`\nDone.`);
console.log(`  page:  demos/${slug}/index.html`);
if (demoUrl) console.log(`  url:   ${demoUrl}`);
if (data._demoPhone) console.log(`  line:  ${data._demoPhone}`);
console.log();
