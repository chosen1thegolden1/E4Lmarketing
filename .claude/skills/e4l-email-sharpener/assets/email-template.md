# Output shape — what goes in the review doc

Every email in the batch uses exactly this. Zion reviews it; the formatter hyperlinks
it; Daniel and Sammy load it. If it doesn't look like this, it stalls.

```
## <ID> — <Day>            e.g. ## A1 — Monday   /   ## S2 — Wednesday

**Subject:** <Curiosity + Benefit. No emoji. Raises the jugular objection.>

**Preview text:** <One line. Extends the subject, doesn't repeat it.>

**Reader:** <segment ID from audiences.md, e.g. A-3 or S-C>
**Angle:** <Story / RVL / Miyagi / Correlation / Without / Worst Way / Paradigm / FAQ>
**Spoke:** <front end / backend / recurring / promo>

```
Yo [First Name],

<hook — one or two lines>

1. <beat header>
<2–4 short lines>

<optional> See the thing → (LINK: https://example.com/story?utm_source=email&utm_medium=<agency|student>&utm_campaign=<ID>-<YYYY-MM-DD>)

2. <beat header>
<2–4 short lines>

3. <the one they can DO today>
<2–4 short lines>

<the turn — "The part that gets me:" / the lesson>

<bridge to the offer — one or two lines, never a bolted-on ad>

👉 <CTA text>: (LINK: <url>?utm_source=email&utm_medium=<agency|student>&utm_campaign=<ID>-<date>)

<signoff block — see below>

P.S. I gotta question: <one-line-answerable question>
```

*Notes:* <anything Zion needs — a date that expires, a claim to eyeball, a swap>
*Source:* <the actual story URL, dated>
```

## Signoff blocks

Agency:
```
Sebastian
Eat 4 Life
```

Student:
```
Holla Back – Get ya Dolla Back. ✊🏾
Sebastian
Eat 4 Life
```

## CTAs

| List | CTA line | URL |
|---|---|---|
| Agency | 👉 Book a call | `https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call` |
| Student | 👉 Get From Xbox to Executive | `https://joineat4life.com/xboxtoexec` |

The book page is free + $9.95 shipping. Whether the CTA says that out loud is
Chosen's call — ask if it hasn't been decided for the batch.

## Link rules

- Every URL gets `?utm_source=email&utm_medium=<agency|student>&utm_campaign=<ID>-<date>`.
  Without it the sale happens and the Monday report can't see which email caused it.
- Every link sits inside `(LINK: …)` so the formatter knows what to hyperlink. Never a
  bare arrow.
- Link to the actual story, never an aggregator front page — those move on and the
  link goes dead. Check it loads.
- If a URL doesn't exist yet: `(LINK: NEEDED — what it should point to)`. That's a
  stop sign, not a placeholder.

## Footer (every send, both lists)

```
Eat 4 Life Marketing · 215 E Regent St, Inglewood, CA 90301
<real unsubscribe link>
```

## Batch header (top of the doc)

Send-from address · the gsgagency.com wall · cadence · footer · review chain (Chosen +
Zion → Daniel and Sammy; Abdullah for GHL) · research date · anything time-sensitive.
See `docs/BROADCAST_WEEK_2026-09-14.md` for the shape already in use.
