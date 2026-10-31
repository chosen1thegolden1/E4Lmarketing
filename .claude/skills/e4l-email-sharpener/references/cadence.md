# Cadence — what goes out, when, to whom

Two lists, two businesses, one rhythm each. Both run off the same wheel.

## The production week (who does what, which day)

The full operating system is `docs/EMAIL_OPERATING_CADENCE.md` in the repo. The short
version, because it changes how you write:

**The batch you are writing is next week's, not this week's.** Claude writes Tuesday,
a second Claude session edits it Tuesday, Chosen approves, Daniel gets it (he took over Sammy's role on Oct 7), and
Abdullah loads it Friday for the following Monday. So a batch written Tuesday has its Monday
email land six days later.

That gap is the single biggest trap in this job. Write every dated claim so it is
still true on its send date, not on the day you write it:

- Say "last week" only if it will still be last week when it sends. Count the days.
- Never write "today", "yesterday", or "this morning" in a broadcast.
- If a thing is dying on a date, put the send day before the date and say so in the
  doc header, loud. A "tomorrow" email that sends after the deadline is a credibility
  fire you can't put out.
- Friday's step re-verifies every dated claim before anything is scheduled. Write the
  notes so that check is possible: name the source and the date it published.

When you finish a batch, run `node scripts/build-emails.js docs/BROADCAST_WEEK_<date>.md`.
It renders each email to paste-ready HTML with live links and fails the build on a
missing UTM, a crossed list, a broken link marker, or an agency email that opens with
"Yo". If the builder fails, the batch is not done.

## Before you write: check the season

`references/seasons.md` holds the US holiday calendar, what each season does to each
reader, and which send slots collide. Read it before choosing angles. The season decides
what the reader is living through that week; the wheel only decides what you sell them.

Two slots a year are right to skip: **Christmas Day and New Year's Day.** Both are
Fridays in 2026/2027. Say the skip in the header so nobody thinks the batch came up short.

## Before you write: pay what the list is owed

Read `docs/PROMISES_OWED.md` first. When an email promises something in a later email —
"I'll go first next time", "more on that Friday", "I'll show you the numbers" — that
promise is recorded there, and clearing it is the first call on next week's slots.

A broken promise is worse than a boring email. The reader does not know the system behind
it; they know they replied and nothing came back. Every unpaid promise makes the next P.S.
that asks for a reply land softer, and the reply rate is the deliverability signal.

If a row is owed and only Chosen can pay it — a story from his life, a number from his
books — ask him. Never invent the payoff, and never quietly drop the row and hope nobody
remembers.

## Weekly rhythm (broadcasts)

**Floor: Monday / Wednesday / Friday, both lists, every week.** Held for months. Add
Sunday when the list can take it — Sunday is the highest-sales day, because Sunday is
when people decide to change.

Rotate the angle so no two sends in a row feel the same:

| | Agency | Student |
|---|---|---|
| Mon | Correlation — dated news → what it means for their business | Story / origin, or Best Way Without |
| Wed | Best Way Without, or Worst Way | Miyagi (one thing they can do tonight) |
| Fri | Results / Paradigm Shift | Results (patient zero) / Lifestyle |
| Sun (when added) | The direct one — a straight offer with a reason why | The "you are enough" deposit, or the 9-word ask |

At least one story a week on each list. A P.S. selling a wheel spoke in at least half
of all sends.

## Promo weeks

One proper promo a month (5–7 days), maybe one 3–4 day mini. Every promo has:

- **A reason why** it exists and why it ends — a problem you noticed, a date, a cohort
  filling, "I want to pay for the trip."
- **One offer.** Not a menu.
- **A deadline.** Real. Kept.
- **Escalation:** open with the offer → a story that sells it → a Results/proof email
  → the Worst Way of not acting → the FAQ on the last day (real questions, bold each
  one, link under every answer) → last-hours reminder sent only to last-7-day openers.
- Two emails Saturday, three Sunday are allowed on the close — only to recent openers.

## Standing direction: the student side is about *From Xbox to Executive* (Chosen, 2026-10-14)

Starting with the batch for the week of Oct 26, the four student emails (S1, S2, S3, S-SUN)
are built around the **subject matter of the book**, not around the week's AI news. Chosen's
words: "Next week's batch needs to be more about the subject matter in Xbox to Executive on
the student side."

- Each student email teaches or dramatizes **one idea from the book**: the gamer-to-business
  translation, tilt control (Ch. 2), the lessons in the story bank. The news hook becomes
  optional garnish, not the spine. Cite a news source only if it truly serves the idea.
- The CTA stays the book. The email now earns it by showing what is inside.
- **Use only book material that is on file.** The book's text is not in this repo. Draw from
  `voice.md` (story bank, tilt control, gaming-to-business) and anything under
  `docs/book/` if it exists. Do not invent chapter titles, quotes or stories. If a chapter
  idea is needed and not on file, flag it in the batch header for Chosen rather than guess.
- Agency side is unchanged.

## Mix in possibility emails on the student side (Chosen, 2026-10-31)

Alongside the book-subject emails and trending topics, mix in **possibility emails**
(Shape 2 in `templates.md`, study notes in `possibility.md`): one thing you can make with
AI, how easy it is, what a business pays for it, the life it buys, and Chosen's belief in
the reader. There's no quota and no calendar. Chosen: *"We don't need to do anything special
for the 12 months."* Use them where they fit, so the pillars stay the reader's north star.

## Sequences (automations in GHL — write once, run forever)

| Sequence | Trigger | Length | Notes |
|---|---|---|---|
| Welcome | Opt-in (book order, scorecard, webinar form) | 7 emails, daily | Origin story by email 2–3. Offer by email 2. Move to broadcasts after. |
| Cold open (agency) | Imported lead | 5 emails / 13 days | `CS-Cold-Open`. Emails 1–2 carry no link by design (domain warmup). |
| Abandoned action | Hit the order form / booking page and stopped | 3–5 emails | Sabri's escalation. +30% on its own. |
| Re-engagement | 90 days no opens | 1 email, 9 words | "Are you still interested in [thing]?" Nothing else. |
| Post-purchase consumption | Book delivered / call booked / course started | 5–7 emails | Help them USE it. This is where the next sale comes from. |

The current GHL workflows on the student side that map to these: "XBox to Executive
Purchased" (→ consumption), "X2E 7-Day Book Nurture" (draft — should be the welcome),
"Broadcast Emails 2026" / "Weekly Newsletter" (→ broadcasts), "Long Term
Nurture/Reactivation" (draft — should be the 9-word). On the agency side:
`CS-Cold-Open` (built through email 1, unpublished).

## The wheel per list

| | Front end (<$100) | Backend ($1K+) | Recurring | North star |
|---|---|---|---|---|
| Student | *From Xbox to Executive* — free + $9.95 shipping | The course / cohort | Membership when it exists | The course |
| Agency | Revenue Scorecard (free) → Game Plan Call | Retainer packages | The monthly retainer | The retainer |

Most emails point at the front end and let the sequence carry them up. The backend
gets its own promo weeks.

## What the Monday report measures — so write toward it

Delivered and bounced per subject line · form submissions per form (X2E opt-in,
webinar signup, scorecard) · bookings per calendar · pipeline stage moves and $ ·
email-attributed conversions (needs UTMs on every link) · opens and clicks once the
token has the stats scope. Replies aren't in the report yet but they're the
deliverability signal — a P.S. question the reader can answer in one line does real work, so keep some in every batch even though not every P.S. is a question.

If a subject line gets sent 30 times and produces nothing, the report will say so. The
rotation exists so there's always a different angle to try next week.
