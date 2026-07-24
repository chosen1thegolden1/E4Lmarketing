# Platform Playbooks — Meta & Google

Platform-specific structure for the TEST and SCALE stages. The methodology in
`SKILL.md` is the same across both; this file covers the mechanics.

## Meta (Facebook / Instagram)

### Campaign structure for a clean creative test
- **ABO test campaign** (Ad set Budget Optimization): one ad set per variant,
  **equal budgets**, same audience, same optimization event. This isolates the
  creative and gives the client a clean read.
- Once you have a winner, **duplicate it into a CBO / Advantage+ campaign** to
  scale — do not scale inside the little test ad set.
- Keep **audiences broad** for creative tests on modern Meta; let the algorithm
  find the buyer. Narrow audiences make CPMs jump and muddy the read.

### Learning phase
- ~**50 optimization events per ad set per 7 days** to exit learning.
- Editing budget >~20%, creative, audience, optimization event, or bid
  **re-enters** the learning phase. Batch your edits; don't poke daily.

### Scaling on Meta
- **Vertical:** +~20% budget every 2–3 days. Or duplicate at a higher budget.
- **Horizontal:** new lookalikes (1% → 1–3% → 3–5%), new placements, new geos,
  new creative angles built from the winner.
- **Advantage+ Shopping (ASC)** for ecommerce scale once you have proven creative.

### Creative-angle library (E4L default test matrix)
Test these as the *variable* (one axis per test):
- **Hook style:** pain-led · result-led · curiosity/question · pattern-interrupt · social-proof
- **Format:** UGC talking-head · product demo · unboxing · text-on-screen · founder story · testimonial
- **Offer framing:** discount · bonus/bundle · risk-reversal (guarantee) · scarcity/urgency
- **Length:** 6–10s hook-test vs 20–40s full-story
The Higgsfield/motion-design stack in this workspace can generate these
variants; brief each batch from the last winner.

### Fatigue signals (loop back to TEST)
Frequency > ~2.5–3 in cold audiences, rising CPM, falling CTR/hook rate,
climbing CPA on a previously stable ad. Refresh creative *before* CPA blows up.

## Google Ads

### Clean tests
- Use **Experiments / Drafts** to split-test ad copy, landing pages, or bidding
  strategies against a control with proper measurement.
- **Responsive Search Ads:** feed strong, distinct headlines/descriptions; pin
  sparingly; let Google rotate and read asset performance ratings.
- Test **one lever** per experiment: keywords OR copy OR bidding OR landing page.

### Bidding & maturity
- Smart Bidding (tCPA / tROAS / Maximize conversions) needs **conversion
  volume + ~1–2 weeks** to stabilize. Don't yank targets daily.
- Watch **Impression Share lost to budget** — that's a scale signal (you're
  leaving demand on the table).
- **Quality Score / Ad Relevance** low → the keyword ↔ ad ↔ landing page story
  is broken. Fix relevance before raising bids.

### Scaling on Google
- Raise budgets gradually where impression share is capped.
- Expand keywords from **search-terms report** winners; add negatives from the
  losers.
- Duplicate winning themes into new ad groups rather than cramming one ad group.

## Cross-platform notes
- **Attribution differs** (Meta 7-day-click vs Google last-click/data-driven).
  Don't compare CPAs 1:1 across platforms without noting the window.
- **Server-side / conversions API (Meta CAPI, Google enhanced conversions)** —
  if signal is weak, optimization suffers upstream of any creative. Flag tracking
  health before blaming creative.
- Keep **naming conventions identical** across platforms so reporting is uniform
  when a client runs both.
