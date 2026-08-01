# Voice AI Demo Builder

Turn a prospect's website URL into a personalized GoHighLevel Voice AI demo page.

**URL → scrape → generate GHL Voice AI knowledge base → render branded "tap to talk" demo → push to GHL.**

## Pipeline
1. `src/scrape` — `scrape(url) -> RawSite` (Cheerio, Playwright fallback for JS-heavy sites) ✅
2. `src/generate` — one `claude-opus-5` call, strict JSON schema → `DemoSpec { businessName, services[], persona, faqs[], demoCopy{} }` ✅ _(needs `ANTHROPIC_API_KEY`)_
3. `src/render` — fills `templates/demo.html` (E4L brand kit) → `demos/<slug>/index.html` ✅
4. `src/push` — creates a GHL **Voice AI agent** from the spec (knowledge base = `agentPrompt`) ✅ _(verified live)_

## Run it
```bash
npm run scrape -- <url>            # step 1 only (JSON to stdout)
npm run demo   -- <url>            # scrape → generate → render
npm run demo   -- <url> --push     # …and create the GHL Voice AI agent
```
Requires `ANTHROPIC_API_KEY` (generate) and network egress to the prospect's site (scrape).
`--push` also needs GHL creds + egress to `services.leadconnectorhq.com`.

## Brand kit
Gold `#FFC200` on black `#000000`, white text. Display font **Fineday** (self-hosted `@font-face`),
body font **Rethink Sans** (Google Fonts). Voice: big-brother East Coast direct, gaming metaphors.

## Setup
```bash
cd voice-ai-demo-builder
npm install
cp .env.example .env   # fill in keys
```

## Try the scraper
```bash
npm run scrape -- https://example.com
```

## Notes
- Keys live in `.env`, never committed.
- The runtime env/network policy must allow `services.leadconnectorhq.com`.
- Receptionist engine = **GoHighLevel Voice AI** (AI Employee). Widget = GHL Voice AI Chat Widget.
