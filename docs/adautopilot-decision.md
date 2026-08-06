# AdAutopilot — Decision Record & Install Plan

**Status:** DECIDED — buy it. Not yet purchased.
**Decided:** 2026-08-06
**Owner:** Chosen (chosen1@gsgagency.com)
**Product:** https://www.getadautopilot.com — $97 one-time, full source

---

## The decision

Buy AdAutopilot instead of building automated media buying from scratch.

**Why:** $97 for working source vs. 6–10 weeks of build time with Claude Code, or
$7.5k–30k on Upwork. The Meta Marketing API integration alone (auth, ad account
permissions, creative uploads, campaign structure, insights polling, rate limits)
is 2–4 weeks before the AI decision layer even starts.

Even if a custom v2 happens later, $97 to read a working system's architecture is
the cheapest R&D available.

## What it is

Self-hosted **Next.js + Supabase** source code. Not a SaaS login — you get the repo
and own it forever.

- Generates ad copy + campaign structure, publishes to Meta via Marketing API
- Auto-pauses underperformers against thresholds you set
- Builds landing page variants
- White-label PDF client reports, weekly
- Integrations: Meta Ads, GoHighLevel, Foreplay (competitor ad library), Supabase
- Requires your own Anthropic API key

**Unconfirmed until we open the repo:** whether it generates images/video or only
copy + structure. If copy-only, we bolt on image generation — Higgsfield is already
connected to this environment, which is an advantage most buyers don't have.

## Real cost of ownership

The $97 is the headline, not the total.

| Item | Cost |
|---|---|
| AdAutopilot source | $97 one-time |
| Anthropic API tokens | $50–500/mo (scales with clients + batch frequency) |
| Supabase Pro (needed past ~2 clients) | $25/mo |
| Vercel hosting | $0–20/mo |
| Deploy + debug time | ~10 hrs upfront, ~2 hrs/mo ongoing |

**Realistic: ~$100–600/mo + time.**

## Known risks

1. **Founder/abandonment risk** — solo $97 product. If the creator stops updating,
   maintenance is ours. Meta's API changes constantly.
2. **Code quality unknown** — won't know until we open the repo. If it's spaghetti,
   extending it (TikTok, YouTube) gets painful.
3. **Meta app review is a gate** — `ads_management` permission review takes days to
   3 weeks and Meta can reject. Not AdAutopilot's fault, but it blocks go-live.
4. **Compliance / brand safety — the big one.** AI-generated copy can hallucinate
   claims or miss disclaimers. Publishing that to a client's account can get their
   ad account restricted or banned. **Human review before publish is mandatory.**
   This is what the Ad QA role exists for.
5. **Client positioning** — some clients react badly to "AI runs my ads." Frame it
   as AI-assisted, human-reviewed.
6. **Doesn't supply strategy** — if the offer or targeting is wrong, it will lose
   money efficiently.

**Deal-breaker test (passed):** if the creator vanished and Meta broke the API next
month, could we afford a week to fix it? Yes. Risk/reward at $97 is asymmetric.

---

## Install sequence

### Phase 0 — Chosen only (~1 hour of clicking, cannot be delegated)

These require identity, payment methods, and ad account ownership. No hired dev or
agent can do them.

- [ ] Buy AdAutopilot ($97). GitHub username for repo access: **`chosen1thegolden1`**
- [ ] **Start Meta app review for `ads_management`** ← do this FIRST, it's the long
      pole. Days-to-weeks of calendar time; the clock only runs once started.
- [ ] Create Supabase account + project
- [ ] Create Vercel account
- [ ] Create/confirm Anthropic API key for the tool's own usage
- [ ] Hand the API keys/tokens to the Claude Code session

### Phase 1 — Claude Code session (~1–2 hours)

- [ ] Clone the AdAutopilot repo, read the code, assess quality
- [ ] Confirm whether creative generation is copy-only or includes images/video
- [ ] Run Supabase schema/migrations
- [ ] Wire env vars and config
- [ ] Deploy to Vercel
- [ ] Debug
- [ ] Write team SOPs

### Phase 2 — E4L as client #1

Dogfood before any paying client sees it.

- [ ] Connect E4L's own Meta Business Manager + Pixel
- [ ] Feed it the offer, ICP, brand voice, budget
- [ ] Set guardrails: daily spend cap, kill thresholds (CPA above $X after Y clicks),
      max ads per batch
- [ ] Approve first batch manually, publish
- [ ] Run 2–3 weeks, review Friday reports, tune guardrails
- [ ] **Open question:** advertise the Services side (agency lead gen) or the Learning
      side (courses/books)? Recommendation is Services — higher LTV, more room to
      spend and learn.

### Phase 3 — Sell it

- [ ] 30-day E4L case study as proof
- [ ] Sales page + pricing
- [ ] Client onboarding doc ("here's the Meta access I need from you")
- [ ] First outside client

---

## Per-client workflow (once live)

**Onboarding, ~30–60 min per client:**
1. Client grants Partner access to their Meta Business Manager (ad account + Page +
   Pixel). Biggest friction point — walk them through it once.
2. Add client to AdAutopilot: offer, ICP, monthly budget, brand voice, past winners.
3. Connect their GHL sub-account for lead sync + attribution.
4. Optional: point Foreplay at 3–5 competitors to mine angles.
5. Set guardrails.

**Weekly loop, mostly hands-off:**
1. AdAutopilot generates the batch (headlines, primary text, angles, hooks).
2. **Human reviews and approves.** Non-negotiable — see risk #5.
3. On approve → publishes to their Business Manager via Meta Marketing API.
4. Runs ads, pulls performance daily.
5. Auto-pauses losers per guardrails.
6. Friday: white-label PDF report → review → send to client.

First client takes ~2 hrs to onboard plus close monitoring for 1–2 weeks while
guardrails calibrate. After that, ~30 min/week per client.

---

## Team model (the reason this is worth it)

Automation drops the skill floor, so the team doesn't need senior media buyers.

| Role | Cost | Load |
|---|---|---|
| Chosen — founder/strategist | — | positioning, sales, client relationships |
| Ad QA / Reviewer | $2–4k/mo (or VA) | reviews + approves AI batches, watches performance — **20–40 clients** |
| Client Success | $1–2k/mo (VA) | Friday reports, routine comms, flags issues |
| Creative Specialist (optional) | varies | custom video/design beyond AI output |

**3 people running 30–40 clients at ~$5–7k/mo labor.** Traditional agency structure
for the same load is 4–6 senior buyers at $30–50k/mo.

The Ad QA role is also the compliance safety net for risk #5. It is not optional
headcount.

---

## Platform expansion (later — do NOT do this first)

Owning the source means any platform with an API can be added.

- **TikTok Ads** — full Marketing API, similar campaign → ad group → ad structure.
  ~1–2 weeks once we know how the Meta adapter is built. Natural fit with the
  Higgsfield vertical video pipeline.
- **YouTube** — runs through the **Google Ads API**, not YouTube directly. More
  complex, and Google requires developer token approval (1–3 weeks, one-time).
  Highest ceiling though: Search + Display + YouTube in one API.

**Caveats:** creative formats differ per platform (TikTok wants vertical UGC, YouTube
wants 6s bumpers / skippable in-stream), performance thresholds need separate
calibration per platform, and every added platform is more API maintenance surface.

**Sequencing:** Meta only for 60–90 days → dogfood + 1–2 real clients → then TikTok →
then Google Ads. Meta + TikTok working = cross-platform automated media buying, which
almost no small agency offers. That's the moat.

---

## How this stacks with existing E4L offers

Ads become top-of-funnel for the systems already built in this repo:

**Ads → traffic → Revenue Leak Scorecard quiz funnel → qualified leads → Voice AI
receptionist.**

That's a stacked productized offer. Nobody else in the space is running all three.

---

## Notes

- AdAutopilot should live in **its own repo**, not this one. E4Lmarketing is a static
  marketing site plus the voice-ai-demo-builder pipeline; no backend to share.
- It is completely fine to buy the $97, park it, and come back in three weeks. The
  code doesn't expire. The only thing that should not wait is the Meta app review —
  that clock only runs once started.
