# Outreach Copy Bank — Warming Up Cold Prospects

Everything E4L Client Services can legitimately send a potential client **today**, written to
deploy as-is. Chosen's voice: plain, direct, short sentences, no hype, no exclamation points.
Talk like an operator, not an ad.

Guardrails applied to every line in this file (mission brief § 05):

- Tagline is **"AI Marketing Made Easy."** "Everybody Eats" never appears here — student-side only.
- **No promised results.** We promise the work and the positioning. Results get reported, not guaranteed.
- **No pricing in any automated asset.** Price conversations happen live on the Game Plan Call.
  The price sheet is a reply asset, not an outreach asset.
- Signature: `— Chosen · Eat 4 Life Marketing`
- Every asset that shows a number carries the estimate disclaimer.

---

## 1. What you can send right now

| Track | Asset it rides on | Status | Best for |
|---|---|---|---|
| **A · Cold → Scorecard** | `npm run leads` drafter | Touch 1 built · **touches 2–4 written below** | Volume. Trades, real estate, law — verticals with public email |
| **B · Free AI Visibility audit** | `geo/` audit runner | **All copy new below** | The warmest cold open you have. Evidence about *their* business |
| **C · Voice AI demo** | demo builder pipeline | Touch 1 built · **touches 2–3 written below** | Med spas, salons, any vertical that hides its email |
| **D · Scorecard completers** | `CS-Scorecard-Intake` | Day 0/2/5 in brief · **day 12+ written below** | People who already raised a hand |
| **E · Long-term nurture** | GHL, `cs-nurture` tag | **All copy new below** | Everyone who went quiet. The actual warm-up engine |

**Track B is the one to lead with.** A GEO audit costs you one command and hands a stranger a
real finding about their own business — "you're named in 5 of 21 AI answers, here are the
screenshots." That is not a pitch, so it doesn't get read as one. The Beauty Boost Med Spa run
in `geo/audits/` is a live example of a prospect audit already sitting on disk.

### What you cannot send yet

- **Anything at volume.** Task 3 (dedicated sending domain, SPF/DKIM/DMARC) isn't done. Volume
  ladder in § 2.
- **Cold SMS.** See § 2. Not a preference — a legal line.
- **Anything with a booking link in it.** The Game Plan Call calendar (Task 1) isn't created yet,
  so every CTA below is written with `https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call` as a placeholder. Until that link exists,
  use the reply-to-me variant noted under each CTA — asking for a reply works fine and helps
  sender reputation.

---

## 2. Sending rules — read before the first send

### Volume ladder (until the dedicated sending domain is verified)

From the deliverability spec, § 7. A new domain that opens at 50/day gets filtered and stays
filtered.

| Period | Max cold sends/day | Note |
|---|---|---|
| Week 1 | 5–10 | Answer every reply fast. Replies build reputation faster than volume does |
| Week 2 | 15–20 | Watch mail-tester and the DMARC reports |
| Week 3 | 30–40 | Tighten DMARC to `p=quarantine` if reports are clean |
| Week 4+ | 50+ | Scale with list quality. Spam placement returns → stop and re-test |

High-priority named prospects: send from Sebastian's personal Gmail instead. Better placement
than shared GHL infrastructure for one-off outreach, and it's a real person's mailbox.

### CAN-SPAM — every cold email needs this

The drafter does not currently append it. Add it to the GHL template footer so it lands on
everything automatically:

```
Eat 4 Life Marketing · [FULL POSTAL ADDRESS, CITY, STATE ZIP]
Not useful? Reply "stop" and I won't email you again.
```

A physical mailing address and a working opt-out are both required on commercial email. The
plain-language "reply stop" version outperforms a footer unsubscribe link on cold sends and is
compliant as long as you honor it — so honor it same-day, and tag the contact `do-not-contact`.

### SMS — consent-gated, no exceptions

**Do not cold-text a prospect who has not given you their number and agreed to be texted.**
Unsolicited marketing SMS is TCPA exposure at roughly $500–$1,500 per message, and carriers will
kill the A2P 10DLC campaign besides. Every SMS in this file is written for one of two audiences:

1. Someone who submitted the scorecard (they typed their own phone number into your form), or
2. Someone who has already replied to an email.

**Open item for Chosen:** the scorecard lead gate (`revenue-leak-scorecard-GHL.html`, the `g-phone`
field) collects a phone number but carries no consent line — so the day-2 SMS #1 in the mission
brief is currently sending on an implied consent that isn't documented. The guardrail says don't
redesign the page, and I haven't touched it. Recommended one-line addition under the gate button,
your call:

> By submitting you agree we may text you about your results. Message and data rates may apply.
> Reply STOP to opt out.

Every SMS thread also needs a working STOP handler in GHL before the first send.

### Personalization floor

The opening line must reference something only that business would recognize — a service on their
site, their review count, the neighborhood, a real audit finding. If a draft's opener would read
identically to the next prospect on the list, it's a template and it will get treated like one.
That's the same bar Rozel already applies when reviewing a batch (`LEADS_GUIDE.md`).

---

## 3. Track A — Cold email → Revenue Leak Scorecard

Touch 1 is generated per-business by `npm run leads`. The tool sends once and stops; there is no
follow-up mechanism in the code. Build touches 2–4 as a GHL workflow triggered by the
`status:sent` tag, each with an "if replied → exit" condition.

**Sequence:** Day 0 (tool) → Day 3 → Day 7 → Day 14 breakup. Then stop. Four touches is the
ceiling on a cold list.

### Touch 2 — Day 3

**Subject:** `the two-minute version`

```
{{contact.first_name | default: "Hey"}} — following my note from Monday.

Short version of what the scorecard does: eight questions, and it puts a
number on what's slipping past you every month. Missed calls, follow-up
that dies after one attempt, a list going cold, no-shows nobody chased.

Most owners are wrong about which one is their biggest. That's the useful
part.

[SCORECARD LINK]

— Chosen · Eat 4 Life Marketing
```

### Touch 3 — Day 7

**Subject:** `the leak nobody looks at`

```
{{contact.first_name | default: "Hey"}} — one thing, then I'll leave the
scorecard alone.

The gap that costs {{contact.industry | default: "most shops"}} the most
isn't lead flow. It's the ninety seconds after someone calls and gets
voicemail. They don't leave a message. They call the next name on the list.
You never find out it happened, so it never shows up as a problem.

That's the whole reason we build what we build — AI Marketing Made Easy,
systems that catch what you already earned.

Two minutes if you want your number: [SCORECARD LINK]

— Chosen · Eat 4 Life Marketing
```

### Touch 4 — Day 14, breakup

**Subject:** `closing your file`

```
{{contact.first_name | default: "Hey"}} — I'll stop here.

If it's timing, tell me a month and I'll come back then. If it's not a fit,
"not interested" is a complete sentence and I'll take you off the list
today.

If it's just that you never got to it, the link is still live and takes two
minutes: [SCORECARD LINK]

Either way, good luck with the rest of the year.

— Chosen · Eat 4 Life Marketing
```

Breakup emails reliably out-reply every touch before them. Do not skip it, and do not make it
passive-aggressive — the version above gives a genuine out, which is why it gets answered.

---

## 4. Track B — Free AI Visibility audit (the warm opener)

Run the audit first, lead with the finding. `node src/audit.js "<Business>" "<City, ST>" <niche>`
produces `summary.md`, `report.html`, and a screenshot per answer. **Rozel QAs the report before
it goes out** — the runner never auto-sends.

This works because it is not a pitch. You did work, you found something, you're telling them.

### B1 — The finding email (touch 1)

**Subject:** `ChatGPT doesn't know [Business] exists`

Adjust the subject to the actual worst platform in the run — `summary.md` names the biggest-gap
platform.

```
{{contact.first_name | default: "Hey"}} — I ran a check on
{{contact.company_name}} this week and got a result worth sending you.

When someone asks ChatGPT, Gemini, or Perplexity who to call for
[SERVICE] in [CITY] — twenty-one versions of that question — you came
back named in [X].

These came back instead: [TOP 3 COMPETITORS FROM summary.md].

I screenshotted every answer. Want the file? Reply and I'll send it — no
strings, it's your business's data.

— Chosen · Eat 4 Life Marketing

AI recommendations change constantly. These are snapshots, not guarantees.
```

**Why ask instead of attaching:** a reply is the single strongest deliverability signal you can
earn on a young domain, and a prospect who asks for the file reads it. Attach on the first send
only for a named, high-priority prospect.

### B2 — Report delivery (fires on reply)

**Subject:** `[Business] — your AI visibility report`

```
Attached. Open it in a browser — the screenshots of the actual answers are
embedded, so you can see exactly what was said and who got named.

Three things worth your attention:

1. You were named in [X] of 21.
2. [PLATFORM] is the big gap — [Y] of 7 there.
3. [COMPETITOR] shows up [N] times. Nothing about them is better than you.
   They're just readable to the machine and you aren't yet.

That last one is fixable, and it's a positioning problem, not an ad-spend
problem.

Happy to walk you through what moves it — 20 minutes, and you keep the
report either way: https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call

— Chosen · Eat 4 Life Marketing

AI recommendations change constantly. These are snapshots, not guarantees.
```

**Before the calendar exists:** replace the CTA with *"Want the 20-minute version of what moves
it? Say when and I'll send times."*

### B3 — No-reply follow-up, day 5

**Subject:** `re: [Business] AI check`

```
{{contact.first_name | default: "Hey"}} — the report from last week is still
sitting here with your name on it.

One line from it: for "[MONEY QUESTION FROM THE RUN]" the answer named
[COMPETITOR] and not you. That's a customer with their wallet out, being
handed to someone else, on a question you should own.

Say the word and I'll send it over.

— Chosen · Eat 4 Life Marketing
```

### B4 — Re-audit, ~30 days later (long-game warm-up)

The monthly loop re-runs every roster client. Add a prospect you like to `geo/clients.json` and
you get a second data point for free, which makes this email possible:

**Subject:** `ran [Business] again — it moved`

```
{{contact.first_name | default: "Hey"}} — re-ran the AI check on
{{contact.company_name}} this morning. Month over month you went from
[X] to [Y] of 21.

Nothing I did. That's the platforms reshuffling, which is the point I keep
making: this moves whether or not anyone's steering it. Right now nobody's
steering yours.

Both reports are attached if you want to see the delta.

— Chosen · Eat 4 Life Marketing

AI recommendations change constantly. These are snapshots, not guarantees.
```

---

## 5. Track C — Voice AI demo follow-ups

Touch 1 lives in `voice-ai-demo-builder/EMAIL_TEMPLATE.md` and fires 10 minutes after the demo
page deploys. These two extend it. Wire as a workflow on the `voice-demo` tag.

### C2 — Day 3, no call to the demo line

**Subject:** `she's still answering`

```
{{contact.first_name | default: "Hey"}} — the receptionist I built for
{{contact.company_name}} is still live. Nobody's called her yet.

Sixty seconds: {{contact.voice_demo_phone}}

Ask her what you charge for a service call. Ask her for Saturday. Try to
trip her up — that's the useful test, and she's not offended.

She answers the ones your crew can't pick up mid-job. That's the entire
pitch.

— Chosen · Eat 4 Life Marketing
```

### C3 — Day 7, final

**Subject:** `taking her down Friday`

```
{{contact.first_name | default: "Hey"}} — the demo agent for
{{contact.company_name}} comes down Friday. Demo numbers rotate to the next
build.

If you want to hear it before then: {{contact.voice_demo_phone}}

If you'd rather have her on your real business line instead of a demo one,
that's a 20-minute conversation: https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call

And if it's a no, no hard feelings — reply "stop" and I'm out of your inbox.

— Chosen · Eat 4 Life Marketing
```

Only send C3 if the number genuinely rotates out of the pool. A deadline you don't honor is the
last email that prospect reads carefully.

---

## 6. Track D — After the scorecard

Day 0 Email #1, day 2 SMS #1, and day 5 Email #2 are specified verbatim in the mission brief
§ 03 and are **not reproduced or altered here** — use the brief. The brief stops at day 5 and
tags `cs-nurture` with nothing behind it. This closes that gap.

### D4 — Day 12

**Subject:** `the part of your scorecard nobody reads`

```
{{contact.first_name}} — your scorecard gave you a number. Here's the part
underneath it.

The number came from four leaks: calls that don't get answered, follow-up
that stops after one attempt, a database nobody's touched, and no-shows
nobody chased. Yours weren't even. One of them is doing most of the damage.

Twenty minutes and I'll tell you which — and what seals it. You keep the
map whether or not you ever work with us.

https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call

— Chosen · Eat 4 Life Marketing

Your figures are estimates from industry benchmarks. The call is where we
look at your real ones.
```

### D5 — Day 21

**Subject:** `not chasing you`

```
{{contact.first_name}} — I'm not going to keep pushing the call.

Standing offer instead: whenever you want it, twenty minutes, we look at
your real numbers, and I tell you straight whether we're a fit. If we're
not, I'll say so — I'd rather do that than take a bad-fit deal and have you
right back where you started in six months.

https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call, or reply with a week that works.

— Chosen · Eat 4 Life Marketing
```

### D6 — Day 30 → hand off to Track E

**Subject:** `once a month, that's it`

```
{{contact.first_name}} — last one from this thread.

I'm moving you to the monthly list: one email a month, whatever we learned
that month that a {{contact.cs_industry | default: "local business"}} owner
can use. No sequence, no pitch pressure. Reply "stop" any time and it ends.

The scorecard number is still yours, and so is the call whenever you want
it: https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call

— Chosen · Eat 4 Life Marketing
```

---

## 7. Track E — The monthly nurture (the real warm-up engine)

One email a month to everyone tagged `cs-nurture` who hasn't opted out. This is the track that
actually warms a list, because it costs the reader nothing and arrives whether or not they ever
reply. Rule: **each one teaches something usable even if they never hire you.**

Format that works, every month:

```
Subject: [one specific, concrete thing]

[One sentence on what happened or what you saw.]

[Three to five sentences of the actual finding — a number, a screenshot, a
before/after, a thing that broke and what fixed it.]

[One sentence on why it matters for a business like theirs.]

Reply if you want the detail on any of this.

— Chosen · Eat 4 Life Marketing
```

Twelve months of subjects you can already fill from work you're doing anyway — no invention
needed:

1. `we audit ourselves too — here's our number` — publish E4L's own GEO baseline. You already
   run it monthly, and running the thing you sell on yourself is the most credible email you own.
2. `21 questions we ask ChatGPT about every client`
3. `the 90 seconds after a missed call`
4. `what a med spa's AI visibility looked like before and after`
5. `why "we'll call you back" is a revenue number`
6. `an AI receptionist answered 40 calls last month. here's the transcript that mattered`
7. `dead database, four days of texts, what came back`
8. `the follow-up sequence we run on ourselves`
9. `what changed in AI search this quarter`
10. `no-shows aren't a scheduling problem`
11. `the question your competitor is winning and you're not`
12. `everything we learned this year, in one page`

Never promise results in any of them. Show the work, cite what happened, let it stand.

---

## 8. SMS bank — opted-in contacts only

Re-read § 2 first. These go to scorecard completers and people who already replied. Nothing here
goes to a purchased or scraped number.

**S1 — Day 2 after scorecard.** Mission brief § 03 SMS #1, verbatim. Don't rewrite it.

**S2 — No-show recovery** (booked the call, didn't attend):
```
{{contact.first_name}} — Chosen. Missed you at 2. No worries, it happens.
Want me to grab you another 20 min this week? https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call
```

**S3 — After a positive email reply, to convert to a call:**
```
{{contact.first_name}} — Chosen from Eat 4 Life, following your email.
Easier to just talk it through — Thursday 10am or Friday 2pm work?
```

**S4 — Demo line nudge** (voice-AI prospects who replied but never called):
```
{{contact.first_name}} — the AI receptionist I built for
{{contact.company_name}} is live at {{contact.voice_demo_phone}}. 60
seconds, ask her anything a customer would. Reply STOP to opt out.
```

Every first SMS to a contact carries `Reply STOP to opt out`. Every subsequent one honors it.

---

## 9. Subject line bank

Chosen's voice: lowercase, specific, no colons, no "quick question," no emojis. Test in pairs.

**Curiosity, business-specific**
- `ChatGPT doesn't know [Business] exists`
- `ran [Business] through 21 AI questions`
- `[Competitor] came up. you didn't`
- `your Google reviews are fine. that's not the problem`

**Direct, problem-named**
- `the 90 seconds after a missed call`
- `who answers your phone at 7pm`
- `[X] of 21`
- `the leak nobody looks at`

**Low-pressure / re-engagement**
- `the two-minute version`
- `not chasing you`
- `closing your file`
- `once a month, that's it`

**Avoid entirely:** anything with "opportunity," "synergy," "circle back," "just checking in,"
"I hope this finds you well," ALL CAPS, or more than one question mark. The drafter's system
prompt already bans most of these — keep hand-written copy to the same bar.

---

## 10. Reply handling — first responses, ready to paste

**"What does it cost?"**
```
Depends what you actually need, and I'd be guessing right now. Twenty
minutes on the phone and I can give you a straight number instead of a
range — plus what I'd do first if it were my business.

https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call
```
Do not send the price sheet cold. It's an eight-page document that answers a question they
haven't asked precisely enough yet, and it turns a conversation into a comparison.

**"Send me some info."**
```
Sure — what's the piece you're weighing? Whether the AI answers calls well
enough, what it takes to install, or what it costs? I'll send the one that
matters and skip the brochure.
```

**"We already have an agency."**
```
Good — most of what we do sits underneath an agency rather than replacing
one. They run the ads, we catch what comes back. If they're handling
follow-up and phones too, you're covered and I'll leave it there.
```

**"Not interested."**
```
Understood — you're off the list as of now. If it changes, you know where
I am.
```
Then actually remove them. Tag `do-not-contact`. A cold list stays sendable only if the people
who said no genuinely stop hearing from you.

---

## 11. Wiring — where each piece lives

| Copy | GHL trigger | Exit condition |
|---|---|---|
| A touch 1 | `npm run leads -- --send` | — |
| A touches 2–4 | Tag added `status:sent` → waits 3/7/14d | Any reply, or `do-not-contact` |
| B1 | Manual send after Rozel QAs the report | — |
| B2 | Manual, on reply | — |
| B3 | Tag `geo-audit-sent` → wait 5d | Reply |
| B4 | Manual after the monthly re-audit | Reply |
| C2–C3 | Tag `voice-demo` → wait 3/7d | Demo line called, or reply |
| D1–D3 | `CS-Scorecard-Intake` (built per brief) | Discovery Booked |
| D4–D6 | Extend `CS-Scorecard-Intake` past day 5 | Discovery Booked |
| E | Tag `cs-nurture`, monthly broadcast | Opt-out |

All new assets get the `CS-` prefix and live in **E4L Client Services only**. Suggested names:
`CS-Cold-Followup`, `CS-GEO-Audit-Outreach`, `CS-Voice-Demo-Followup`, `CS-Nurture-Monthly`.

---

## 12. Open decisions for Chosen

1. **Scorecard SMS consent line** — § 2. Needed before SMS #1 goes to a real prospect. The
   guardrail says don't redesign the page; adding one line of consent text is a deployment
   change, but it's your call to make, not mine.
2. **Postal address for the CAN-SPAM footer** — required on every cold email, and I don't have
   one to put in.
3. **Calendar link** (Task 1) — every CTA in this file is placeholdered. Until it exists, the
   reply-to-me variants are live and work fine.
4. **Which track leads** — my recommendation is B (GEO audit) for named prospects and A (volume
   scorecard) for the list, running in parallel. B converts far better per send and is capped by
   how many audits you want to run; A scales but is capped by the sending ladder in § 2.
5. **Adding prospects to `geo/clients.json`** — puts them in the monthly re-audit loop and makes
   B4 possible at zero marginal cost. Worth doing for anyone you'd genuinely want to sign.

---

*Figures in any outreach asset are directional estimates from published industry benchmarks, not
guarantees. AI visibility snapshots change constantly. AI Marketing Made Easy.*
