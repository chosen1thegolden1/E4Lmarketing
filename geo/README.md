# GEO Loop — AI Search Visibility

Home of the **AI Search Visibility (GEO)** service tooling (Ops Brief: *E4L-Ops-Brief-GEO-Loop.pdf* in Drive). The audit script asks each client's **money questions** on ChatGPT, Gemini, and Perplexity and logs who gets recommended — score format `X/21` (7 questions × 3 platforms).

## The audit runner (one command in, evidence out)

```bash
cd geo && npm install
node src/audit.js "Eat 4 Life Marketing" "Los Angeles, CA" marketing-agency
node src/audit.js "Some Med Spa" "Newport Beach, CA" med-spa
node src/audit.js "Acme Garage Doors" "Austin, TX" home-services --trade="garage door repair company" --problem="a garage door stuck open"
```

Options: `--platforms=chatgpt,gemini,perplexity` (limit/rerun), `--ghl-email=<contact>` (also write `cs_geo_score` to that GHL contact when the field is wired), `--out=DIR`.

How it works: each question runs in a **fresh logged-out browser session** (new context, no cookies, no history) on each platform; the answer is captured as text + a screenshot; Claude extracts which businesses were named in order, whether the subject was named, and the competitors. Failed asks count as *not named* and are listed in the output — never silently dropped.

Output per run, committed as evidence under `audits/<slug>/<date>/`:

- `summary.md` — the one-page summary: **Named in X of 21**, top competitors, biggest-gap platform, per-question ✓/—/✗ grid
- `results.json` — full per-question log (businesses named, order, subject Y/N, competitors, timestamps)
- `screenshots/<slug>_<platform>_q<n>_<date>.jpg` — one per answer

GHL: the runner checks whether the `cs_geo_score` custom field exists and reports it in the summary; it writes the score only when the field is wired **and** `--ghl-email` is given. It never blocks on GHL.

Container note: in the Claude Code remote environment the runner automatically uses the pre-installed Chromium and caps the proxy TLS handshake at 1.2 (still certificate-verified) — see `src/browser.js`. On any other machine it uses Playwright's own Chromium; run `npx playwright install chromium` once.

## Money-question templates (`money-questions/`)

One editable JSON file per niche, **exactly 7 questions each**. This is the full pre-loaded industry matrix:

| Niche key | Covers |
| --- | --- |
| `med-spa` | Med spas & aesthetics *(brief starter set, verbatim)* |
| `roofing`, `plumbing`, `hvac`, `electrical`, `landscaping` | Home services, pre-filled per trade |
| `home-services` | Generic trade pattern (`[trade]`, `[problem]`) for any other trade |
| `dental` | Dentists & orthodontics *(brief starter set, verbatim)* |
| `pi-law` | Personal injury law |
| `veterinary` | Vets & animal hospitals |
| `fitness` | Gyms, trainers, studios |
| `salon` | Salons & barbershops |
| `real-estate` | Agents, teams, property management |
| `auto-dealer` | Auto sales & service |
| `restaurant` | Restaurants & catering |
| `marketing-agency` | AI marketing agencies (E4L's own baseline set — mixes national AI-niche intent with local, so it sets `allowNonLocal`) |

### Editing (Rozel)

- Keep **7 questions per file** — the `X/21` score depends on it.
- Placeholders use square brackets. `[city]` must appear in every question (location is phrased into the question, per the brief). The generic `home-services` file also uses `[trade]` and `[problem]`.
- Write questions the way a real buyer types them into an AI — plain, local, high intent. No brand names, no jargon.
- After any edit, run `npm run validate` from `geo/` — it catches count, placeholder, and duplicate mistakes before an audit runs on a bad set.

### Using from code / CLI

```bash
cd geo
npm run validate                                   # check all templates
node src/questions.js                              # list niches
node src/questions.js med-spa "Newport Beach"      # preview the 21-question basis for a client
node src/questions.js home-services Austin "garage door repair company" "a garage door stuck open"
```

```js
import { loadQuestions } from './src/questions.js';
const questions = await loadQuestions('dental', { city: 'Culver City' });
```

The loader throws if a placeholder is missing a value, so a half-filled question can never reach a platform.

## Guardrails (from the brief, § 05)

- Never promise citations, rankings, or results — positioning, not outcomes. Every report carries: *"AI recommendations change constantly; these are snapshots, not guarantees."*
- Client-facing copy says **"AI Marketing Made Easy"** — never "Everybody Eats".
- `CS-` naming on every GHL asset; E4L Client Services sub-account only; nothing ever routes to Chosen.
