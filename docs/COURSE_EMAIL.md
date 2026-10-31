# The course email — two states

One email, two versions. Chosen, 2026-10-30: *"I also want this email as a general
broadcast that can go out next week to students AND we'll jazz it up during the black
Friday deals."*

Built on the GAIN shape in `.claude/skills/e4l-email-sharpener/references/templates.md`.

**The course, as Chosen described it (2026-10-30):** 8 video modules, a workbook, 8 weeks
of content, lifetime access. The Black Friday bundle adds the book and the audiobook.

---

## VERSION A — the general broadcast

No deadline, no discount, no price in the copy. **The price lives on the page, not in the
email.** That is deliberate: it removes the one thing nobody has confirmed, and sending
the reader to the page to find it is standard for a backend offer anyway.

**Reader:** S-C (tried and failed), with S-D overhearing · **Angle:** Paradigm Shift · **Spoke:** backend → the course

**Subject:** One job. One client. 90 days.

**Preview text:** Not five skills. One. That's the whole plan.

```
Yo [First Name],

How would you like to pick one skill, land one paying client,
and get paid for it inside 90 days — no degree, no portfolio,
no learning to code?

I know how that sounds. 👀

You've probably tried something like this already. You watched
about half a course, nothing happened, and somewhere in there
you decided the problem was you.

It wasn't. **The problem was the plan.**

Most of them hand you five skills and no order to learn them
in.

So here's the order.

Every business on earth needs five things handled: getting
attention, turning attention into conversations, closing,
delivering, and keeping people happy.

Most of them are running two. Badly.

You don't need all five. You need *one* — sold to *one*
business, delivered well enough that they tell somebody else.

That's the whole course. **Eight modules, one a week, and a
workbook** so you're building the thing instead of watching
somebody else build it. Lifetime access, so it waits for you
if life gets in the way. 💼

- Which of the five jobs to pick first, based on what you're
already better at than you think
- How to find the one business that needs it. Mine was a pizza
shop on Melrose, and it started as a conversation over dinner
- What to charge before you've ever done it once
- How to deliver it so the first client turns into the second

Eight weeks from now you could have one client and one invoice
you sent yourself.

👉 See what's inside: (LINK: NEEDED — course sales page)

Sebastian
Eat 4 Life
Everybody Eats

P.S. I gotta question: out of those five jobs, which one are
you already better at than you think?
```

*Notes:* ~255 words, above the ~200 ceiling, which `templates.md` allows for a backend
offer. GAIN shape: triple promise, named disbelief, the stuck loop, the "until now" turn,
the format, benefit bullets, a near-term payoff, one link. The five jobs, the 90-day plan
and the pizza shop are from `voice.md` and the book, translated and never quoted. Course
format is Chosen's own words from 2026-10-30.

**The near-term payoff line is a real claim, not a template flourish.** "Eight weeks from
now you could have one client" is only honest because the course is eight weeks long and
its whole point is one client. If the course does not actually produce a first client
inside its own run time, that line comes out.

**ONE THING BLOCKS THIS: there is no course sales page on record.** The only URL anywhere
in this repo is the book at `joineat4life.com/xboxtoexec`. `(LINK: NEEDED)` fails the
build on purpose, so this cannot ship by accident. To send it, Chosen gives the course
page URL — and it has to accept
`?utm_source=email&utm_medium=student&utm_campaign=<ID>-<week>` or the Monday report
cannot see the sale.

---

## VERSION B — jazzed up for Black Friday

Same email, four changes. Do not rewrite it from scratch — the list will have seen Version
A, and a Black Friday email that reads as a familiar argument with a number attached
converts better than a stranger.

1. **Subject and preview carry the offer.** The gain promise stays, the price arrives.
2. **The bundle replaces the course alone** — lifetime access plus the book plus the
   audiobook.
3. **$500 goes in the copy**, above the CTA, with the deadline beside it.
4. **One deadline sentence** before the CTA, and it has to be the real window from
   `docs/PROMOS.md`.

Still held out until Chosen confirms: **the $2,000.** It is the strongest line available —
"$500 for what normally runs $2,000" — and it only ships if the course has genuinely sold
at that price. A struck-through price that was never charged is the one marketing claim
that can put a business in real trouble.

The Black Friday sequence is six emails, not one. This is the open. See
`docs/BLACK_FRIDAY_2026.md`.

---

## Slot for Version A — week of 2026-11-09

**Chosen, 2026-10-31: "Well I mean the week after. Whatever. Don't gotta be next week."**
So it is not the Nov 2 batch. It goes in the batch for the **week of Monday 2026-11-09**,
which the writer session writes on **Tuesday 2026-11-03**.

That is the better answer for a reason worth recording: the Nov 2 batch was already written,
edited and sitting on Chosen's GO, with Friday being Abdullah's load day. Re-cutting a slot
in a batch that is already downstream is how a wrong version gets loaded. Nothing in the
Nov 2 batch changes.

**Default slot: S3, Friday 2026-11-13.** The writer may move it to another student slot that
week if the batch reads better that way, but it ships that week and it is not split across
two. Veterans Day falls Wednesday Nov 11 — see `seasons.md`; it is not this email's hook and
this email is not the week's seasonal slot.

**The current S3 in the Nov 2 batch stays where it is.** "Most new Stripe Atlas startups are
one person" ships Friday Nov 6 as written. It was only ever the trade candidate because it
aims at S-D, who is also who buys a course; with the course email moved out a week, there is
nothing to trade.

**One caution worth saying out loud.** The wheel in `cadence.md` has most emails pointing at
the front end and the backend getting its own promo weeks. A course sell in a normal week is
a departure from that, and two weeks before a Black Friday course sale it risks spending the
audience twice. The 4% rule argues the other way: write to the readers already winning and
let the rest overhear. **Chosen asked for it, so it goes in** — but if the Nov 13 send lands
flat, that is the reason to look at first, not the copy.

**Hard gate: the course sales page URL.** `(LINK: NEEDED)` fails the build on purpose, so
this cannot ship by accident. The writer needs the URL by **Tuesday 2026-11-03**. If it is
not on record by then, the writer writes the Nov 9 batch without this email, says so, and
asks Chosen again — it does not invent a URL and does not point the CTA at the book.
