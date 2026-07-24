# Metrics, Benchmarks & Statistical Guardrails

Reference for the VALIDATE stage. Benchmarks are **starting anchors**, not
laws — every account has its own baseline. Always compare a variant to *its own
account's* history before comparing to industry numbers.

## Core formulas

| Metric | Formula | What it tells you |
|---|---|---|
| CPM | (Spend / Impressions) × 1000 | Cost to reach the audience. Rising CPM = auction pressure or fatigue. |
| Hook rate | 3-sec video views / Impressions | Did the opening stop the scroll? (video) |
| Hold rate | ThruPlays / 3-sec views | Did they keep watching? |
| CTR (all) | Clicks / Impressions | Overall interest. |
| CTR (link) | Link clicks / Impressions | Truer intent signal than all-clicks. |
| CPC | Spend / Link clicks | Cost to get them to the site. |
| Landing CVR | Conversions / Landing page views | Does the page/offer close? |
| CPA / CPL | Spend / Conversions (or Leads) | The money metric for lead/sale goals. |
| ROAS | Revenue / Spend | The money metric for ecommerce. |
| Frequency | Impressions / Reach | Fatigue gauge in cold audiences. |

## Benchmark anchors (refine per account)

**Meta (cold traffic, physical product / offer):**
- CTR (link): healthy ≈ **1%+**; great ≈ 2%+; below ~0.6% the creative/offer is weak.
- Hook rate (video): healthy ≈ **25–30%+**; below ~20% the first 3s is failing.
- CPM: wildly niche/geo dependent — track *your* baseline; a 30%+ jump is a flag.
- Frequency: keep cold-audience **< ~2.5–3** before refreshing creative.

**Google:**
- Search CTR: healthy ≈ **3–5%+** on decent intent keywords; low CTR = ad copy/keyword match.
- Display CTR: much lower (~0.5%) — normal; judge on CVR/CPA, not CTR.
- Impression share lost (budget) → you're capped, a scale signal.
- Quality Score < 5 → fix relevance (keyword ↔ ad ↔ landing page match).

## Statistical guardrails (don't crown luck)

- **Minimum conversions to trust a CPA:** ~**15–20+** on the variant. Below
  ~10, treat the CPA as directional only.
- **Minimum spend:** ≥ **1× target CPA** before killing; ≥ **3× target CPA**
  before crowning/scaling.
- **Significance:** for a real A/B call, you want ~**95% confidence**. Rough
  gut-check: if two variants are within ~15–20% of each other on CPA with
  double-digit conversions each, it's probably a tie — keep both or let it run.
- **Time:** ≥ 3–4 days and never judge mid-learning-phase or on one weekend.
- **Beware ratios on tiny denominators:** "50% CVR" on 2 clicks is noise.

## The diagnostic ladder (top-down)

Find the **first** stage below benchmark — that's the real problem. Fixing a
lower stage while an upper one leaks wastes spend.

1. **CPM off?** → auction/audience problem. Widen/adjust targeting or bid.
2. **Hook rate / CTR off, CPM fine?** → creative problem. New hook, new opening,
   new angle. The impression is cheap; the ad isn't earning attention/click.
3. **CPC fine but CVR/CPA off?** → post-click problem. Landing page, offer,
   message-match, or audience quality — not the creative.
4. **Everything fine but ROAS thin?** → economics/AOV problem, not a media
   problem. Pricing, upsells, LTV — flag it, don't just cut budget.

## Quick reference: what each symptom usually means

- **Cheap clicks, no conversions** → landing page / offer / audience mismatch.
- **Expensive clicks, good CVR** → creative or audience too narrow; CPMs high.
- **Great day-1, decaying by day-4** → small audience saturating, or learning
  phase was never really exited. Check frequency.
- **CPA spikes right after you scaled** → you jumped budget too hard and reset
  learning, or edited the winning ad. Roll back the increase.
