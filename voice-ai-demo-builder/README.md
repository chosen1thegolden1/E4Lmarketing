# Voice AI Demo Builder

Turn a prospect's website URL into a personalized GoHighLevel Voice AI demo page.

**URL → scrape → generate GHL Voice AI knowledge base → render branded "tap to talk" demo → push to GHL.**

## Pipeline
1. `src/scrape` — `scrape(url) -> RawSite` (Cheerio, Playwright fallback for JS-heavy sites) ✅
2. `src/generate` — one Claude call, strict JSON: `{ businessName, services[], persona, faqs[], demoCopy{} }` _(TODO)_
3. `src/render` — writes `demos/<slug>/index.html` from `templates/` + E4L brand kit _(TODO)_
4. GHL push — create the Voice AI knowledge base for the prospect _(TODO)_

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
