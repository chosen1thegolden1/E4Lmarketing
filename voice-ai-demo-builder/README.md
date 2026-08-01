# Voice AI Demo Builder

Turn any local-business website into a polished Voice AI receptionist demo — and optionally spin up the matching GoHighLevel Voice AI agent — in one command.

## Pipeline

1. **Scrape** — crawls up to 6 same-origin pages (browser UA, cheerio), extracting titles, headings, body copy, phones, and emails.
2. **Generate** — sends the scraped content to Claude, which returns a structured JSON blob: business profile, voice-agent config (greeting, full system prompt, sample call transcript), and demo-page copy.
3. **Render** — writes a standalone branded demo page to `demos/<slug>/index.html` (plus `data.json` with the raw generated content).
4. **Push** (optional, `--push`) — creates the Voice AI agent in GoHighLevel via `POST /voice-ai/agents` with the generated name, greeting, and prompt.

## Usage

```bash
npm install
npm run demo -- https://example-business.com/ [--push]
```

## Environment

| Variable | Purpose |
| --- | --- |
| `ANTHROPIC_API_KEY` (or `LLM_API_KEY`) | Claude API key for content generation |
| `GHL_API_TOKEN` | GoHighLevel private-integration token (`pit-…`) — needs Voice AI scopes |
| `GHL_LOCATION_ID` | GoHighLevel sub-account (location) ID the agent is created in |

## Output

- `demos/<slug>/index.html` — self-contained demo page: hero, live-call transcript mockup, agent card with greeting + full prompt, value props, how-it-works, FAQs, CTA.
- `demos/<slug>/data.json` — the structured content Claude generated (also what gets pushed to GHL).
