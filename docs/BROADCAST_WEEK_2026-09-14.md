# Broadcast emails — week of Sept 14, 2026

Three agency, three student. Value-first, no pitch pressure. These run *alongside*
the `CS-Cold-Open` sequence — different audience, different job. Cold outreach earns
a first reply; these keep a list that already knows Sebastian warm.

**Research date: 2026-09-10.** Every fact below is dated and sourced. Anything with a
deadline in it (Sora, Sept 24) goes stale fast — check before sending.

**Send order:** Mon / Wed / Fri. Agency and student go out the same day, same theme
where it fits, different framing.

**Review doc (the version Chosen + Zion read):**
https://docs.google.com/document/d/1GCMSIAq9SqPstz50pi03nQP5OB9oAcCVM0wouJA3E6c/edit

Earlier drafts are renamed SUPERSEDED rather than deleted, in case their links were
already passed around: `1-zvmUuHjjl7uTNWdNTywSBiQsJz7UFePq7JYNW-0OPw` (v1),
`1ZkvzgncWjAX7CTDibnXi8Byq4AfPnk381PpX0vpZ1h4` (v2, no link markers), and
`13MdjcqP714R3UNePPKXazzBUKI9CR6zKgxCragHzDzk` (v3, aggregator source links), and
`1163_MXKAMKXCM8-WPP_sYGXNRzfB_K6kFK6Hm-cmwDU` (v4, no book link), and
`1goLrhEoKAO3QEIG__e-ufj2-l8hDnK9aC6N6rB_RvFs` (v5, student copy pitched too advanced), and
`1FHiwajnIk6f57RUpdEvliJ7F3059Em71khcHOdS3BCQ` (v6, generic book bridges), and
`1OQhtLTpX2gMFZVLL2qOoNYPtKAHPU2yW-NERq_RLjFk` (v7, gaming talk too heavy).
Drive's API can rename a doc but not rewrite its body, so every revision is a new file.

---

## ⚠️ Two things to sort before these go out

**1. Which domain sends these.** These are broadcasts to a list, not cold sends. But
`gsgagency.com` is still in reputation recovery (repaired 2026-08-18, roughly 3 weeks
in), and a broadcast blast is exactly the volume spike that stalls a recovery. Options:

- Send agency broadcasts from `mail.e4lmarketingdemos.com` — authenticated, aligned, but
  its own warmup is still Stage 1, so ramp it
- Or hold the list broadcasts one more week and watch Google Postmaster first

**2. The student list lives in E4L School.** That sub-account is off-limits to me —
no reads, no writes, per the mission brief. I can write the copy; someone else loads it.

Both lists need the CAN-SPAM footer and a real unsubscribe, same as everything else:

```
Eat 4 Life Marketing · 215 E Regent St, Inglewood, CA 90301
```

Broadcast to a subscribed list should use a proper unsubscribe **link**, not the
"reply stop" line — that shortcut is for cold one-to-one sends only.

---

## Link convention

Every place a link goes is marked. The line reads:

```
the visible text → (LINK: where it points)
```

Zion: hyperlink the visible text, delete the `(LINK: ...)` part. If a marker says
`(LINK: NEEDED — ...)` the URL doesn't exist yet and somebody has to supply it before
that email can go out.

| What | URL |
|---|---|
| Book a call (agency CTA) | `https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call` |
| From Xbox to Executive (student CTA) | `https://joineat4life.com/xboxtoexec` |

**Every link carries UTM tags, or the weekly report can't see it.** The report
attributes purchases and bookings to email through `utm_source=email` on the opportunity.
No UTM, no attribution — the sale happens and the email gets no credit. So every URL in a
marker gets this appended before it ships:

```
?utm_source=email&utm_medium=<agency|student>&utm_campaign=<email id, e.g. S1-2026-09-14>
```

The book link becomes `https://joineat4life.com/xboxtoexec?utm_source=email&utm_medium=student&utm_campaign=S1-2026-09-14`.
Whoever formats the doc adds these; Daniel and Sammy also turn on GHL's own
"UTM tracking" toggle on every bulk send so the click itself is tagged too.

The originals in the appendix keep Chosen's own `[INSERT ...]` placeholders — they're
reference copy, not send copy, so they stay exactly as he wrote them.

**Every link was checked and returns 200, with one exception:** the Constant Contact
report (used in A3 and B2) blocks automated checks, so I couldn't confirm it from here.
Zion — open that one in a browser before send. Everything else is verified live,
including the book page.

**Note on the book CTA:** the landing page gives the paperback + digital free against
$9.95 shipping (audiobook +$9.99). The CTA still reads just "Get From Xbox to Executive"
and does not mention the free offer — still Chosen's call whether to say it out loud.

**The two sides are written for different reading levels on purpose.** Agency copy talks
to owners who already run something. Student copy assumes the reader has never done any
of this: no jargon, no assumed portfolio, nothing that expects them to already know what
an API or a "pipeline" is. If a student email starts sounding like it's for someone
skilled up, that's a bug — flag it.

---

## How the two lists pair up

Every email here is written for ONE list. Nothing gets sent to both as-is.

Two things break an agency email on the student list, and both come straight from
Chosen's own originals:

- **The CTA.** Agency ends on "Book a call." Student ends on the book.
- **The signoff.** "Holla Back – Get ya Dolla Back" is student-side only.

So topics cross over, copy doesn't. That's already happening — Meta Muse is Monday's
agency email (A1) *and* Wednesday's student email (S2), written twice from scratch.

| | Agency | Student |
|---|---|---|
| **Mon** | A1 — Muse | S1 — build a website tonight |
| **Wed** | A2 — Sora sunset | S2 — Muse |
| **Fri** | A3 — 48% stat | S3 — robot factory |

B1 and B2 at the bottom are student versions of A2 and A3, written out in full. Not
scheduled — there if those topics should run both ways, or as swaps for S2/S3.

---

# AGENCY SIDE

## A1 — Monday

**Subject:** Your customer asked an AI about you last week

**Preview text:** And you weren't in the room for it.

```
Yo [First Name],

Meta just dropped something called Muse. It's a personal AI
assistant — and here's the part that matters: it lives inside
WhatsApp. 👀

There's a Muse app too — but they don't need it. It works right
inside the app already on their phone.

Which means the buying conversation now starts somewhere you
can't see.

1. It's free, and it's already where your customers are.
Free tier, plus paid plans at $20 and $100/month. But most people
will never pay — they'll just use the free one, in the app they
already have open.

Your customer doesn't Google "best roofer near me" anymore. They
ask. And they get ONE answer, not ten blue links.

Read the launch → (LINK: https://siliconangle.com/2026/09/08/meta-debuts-its-secure-by-design-personal-ai-agent-muse/)

2. One answer means one winner.
Ten search results meant ten chances. One AI answer means one
business gets named and everybody else doesn't exist.

That's not a small change to how you get found. That's the whole
game moving.

3. You can check what it says about you. Today.
Open any AI assistant. Ask it the exact question a customer would
ask to find a business like yours. In your city.

See if you come up. See who does instead.

That takes 4 minutes and it's the most useful 4 minutes you'll
spend this week. Most owners have never once checked.

The part that gets me: this isn't coming. It shipped last Tuesday.

If you run the test and don't like the answer, that's fixable —
but only if somebody's actually working on it.

👉 Book a call: (LINK: https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call)

P.S. I gotta question: when's the last time you asked an AI about
your OWN business?

Sebastian
Eat 4 Life
```

*Source: Meta Muse launch, Sept 8 2026 — https://siliconangle.com/2026/09/08/meta-debuts-its-secure-by-design-personal-ai-agent-muse/*

---

## A2 — Wednesday

**Subject:** A tool 1000s of businesses use dies Sept 24

**Preview text:** Two weeks. Then it's gone.

```
Yo [First Name],

OpenAI is shutting down the Sora API on September 24th.

If that means nothing to you — good, keep it that way. But
here's why I'm writing about it anyway. 👇

1. People built real businesses on that thing.
Video pipelines. Client deliverables. Whole content operations.
Two weeks from now the plug comes out and everything downstream
of it breaks.

Not because anybody did anything wrong. The tool just... ended.

See the shutdown notice → (LINK: https://developers.openai.com/api/docs/deprecations)

2. Everybody's scrambling to the same three doors.
Google Veo, Runway, Kling. They all work. People will migrate,
rebuild, and get on with it.

The migration isn't the expensive part. The two weeks of nobody
knowing what happens next — that's the expensive part.

3. Here's the actual lesson, and it's not about video.
Own the asset. Rent the tool.

Your customer list, your before-and-after photos, your reviews,
the phone number people know — that's yours. It doesn't sunset.

The software that turns it into marketing? Rented. Always.
Pick the ones that are easy to walk away from.

Quick gut-check: if the tool you rely on most announced it was
closing in 14 days, what would break?

If you don't know the answer, that IS the answer. 😅

Worth 20 minutes to map what you own versus what you're renting.

👉 Book a call: (LINK: https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call)

P.S. I gotta question: what's the one tool your business genuinely
could not run without?

Sebastian
Eat 4 Life
```

*Source: OpenAI deprecations table (Sora 2 / Videos API, removal 2026-09-24) — https://developers.openai.com/api/docs/deprecations
Background: https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation*

---

## A3 — Friday

**Subject:** 48% of your competitors are doing this now

**Preview text:** And it's working. That's the problem.

```
Yo [First Name],

Fresh numbers on small business + AI, and they cut both ways.

1. Almost half already use AI to write their emails.
48% of small businesses use it for emails or subject lines.
That was a weird thing to admit two years ago. Now it's Tuesday.

2. And it's working — measurably.
Businesses using AI report email success at 53%. The ones not
using it: 35%.

That's a big enough gap that "I'll get to it eventually" is
costing real money.

See the report → (LINK: https://www.constantcontact.com/blog/small-business-now-report/)

3. But here's the trap nobody's talking about.
If half the market is generating emails from the same handful
of tools... every inbox starts sounding the same.

Same polish. Same rhythm. Same three-bullet structure. Same
"I hope this finds you well."

Which means polish stopped being the advantage. Being SPECIFIC
did.

One sentence only you could write — the neighborhood, the job
you did last week, the thing their website says — beats four
paragraphs of perfectly-generated nothing.

Use AI for the speed. Bring the specifics yourself. That's the
whole play. 🎯

The businesses winning right now aren't the ones using the most
AI. They're the ones that still sound like a person.

👉 Book a call: (LINK: https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call)

P.S. I gotta question: could a customer tell your last marketing
email from your competitor's?

Sebastian
Eat 4 Life
```

*Source: Constant Contact Small Business Now Report — https://www.constantcontact.com/blog/small-business-now-report/*

---

# STUDENT SIDE

**Written for somebody who has never done this.** No jargon, no assumed portfolio, no
"you already know what an API is." Every side quest is something they could finish
tonight on a phone. Each one ends on the same idea: *doing it once is a favor, doing it
the same way every time for a price is a business* — which is the on-ramp to the book.

## S1 — Monday

**Subject:** You could build somebody a website tonight

**Preview text:** No coding. I'm serious.

```
Yo [First Name],

One number first, then I'ma show you something.

More than a third of entry-level jobs now ask for AI skills.
A year ago, almost none did.

See the report → (LINK: https://www.naceweb.org/job-market/trends-and-predictions/demand-for-ai-skills-in-entry-level-jobs-nearly-triples-since-fall-2025)

Here's what nobody tells you: "AI skills" doesn't mean coding.
It doesn't mean a degree. It means you know how to ask for
what you want.

Let me prove it to you.

1. Think of a business with no website. 🎯
Your barber. The lady who does nails. Your uncle with the lawn
equipment. Somebody who's been saying "I gotta get online"
for two years straight.

You already know three people like this.

2. Ask ChatGPT to build it. Just talk to it normal.
Copy this exactly:

"Build me a simple one-page website for a barber shop called
[NAME] in [CITY]. Put the hours, the prices, the phone number,
and a button to text for an appointment. Make it look good on
a phone. Then tell me step by step how to put it online —
explain it like I've never done this before."

That's it. That's the whole thing. It writes the website AND
it walks you through putting it up.

First one might take you an hour, because you're learning.
The second one takes 20 minutes.

3. Don't offer. Just show up with it. 💼
Don't walk in saying "I could build you a website." Everybody
says that. They've heard it.

Walk in with it already made. Pull it up on your phone.
"I made this for you. What would you change?"

That's a whole different conversation. That's the one where
money comes up.

Now here's the part I really want you to catch:

A website is not a business. Doing it one time is a favor.

Doing it the same way every time, for a set price, with a way
for people to find you — that's a business. That's the part
most people never figure out.

Every business needs five jobs handled to actually grow.
Getting customers in the door. Following up with them. Taking
care of them. Getting known. Actually delivering the work.

Most small businesses are doing two of them. That's not me
talking down on anybody — that's just the gap. And that gap
is the reason they need somebody.

That website you just built? That's the first one. Getting
customers in the door. The one that puts money on the board.

And you don't learn all five. You learn ONE well enough to get
paid, then go find one business that needs it.

That's the whole 90-day plan in From Xbox to Executive. I went
from gaming to running a real company — the book lays out all
five jobs, but it starts you on one.

👉 Get From Xbox to Executive: (LINK: https://joineat4life.com/xboxtoexec)

Holla Back – Get ya Dolla Back. ✊🏾
Sebastian
Eat 4 Life

P.S. I gotta question: who's the first person you'd build one
for?
```

*Source: NACE Job Outlook 2026 Spring Update — https://www.naceweb.org/job-market/trends-and-predictions/demand-for-ai-skills-in-entry-level-jobs-nearly-triples-since-fall-2025*

---

## S2 — Wednesday

**Subject:** There's a free AI inside WhatsApp now

**Preview text:** Same app your group chat is in.

```
Yo [First Name],

Meta put a free AI assistant called Muse inside WhatsApp. Same
app you already text in. Nothing to download. 👀

See what it does → (LINK: https://siliconangle.com/2026/09/08/meta-debuts-its-secure-by-design-personal-ai-agent-muse/)

Most people gonna use it to settle arguments about basketball.

You gonna use it to find somebody's problem and fix it. Watch.

1. Pick a business you actually go to. 🎮
The wing spot. The barbershop. The nail place. Somewhere you've
been more than once.

2. Ask it what customers wish they knew.
Copy this:

"Pretend you're a customer trying to find a [type of business]
in [city]. What are the 10 questions you'd want answered before
you booked? Then tell me which ones most of these businesses
forget to put online."

Read what comes back. That list is reasons people didn't call
that business. You just made it in five minutes.

3. Fix ONE of them. Then show them. 💰
Pick the easiest one on the list. Write the answer out nice.

Text it to the owner or walk it in:
"I noticed people always ask this and it's not on your page.
So I wrote it for you."

Worst thing that happens: they say no thanks and you're out
20 minutes.

Best thing that happens: you just got paid for the first time
for something you did on your phone.

Now the part that turns it into money:

That same prompt works for ANY business. Change two words, run
it again. Change two words, run it again.

Do it once, it's a favor. Do it for five businesses this week
and you've got something you can charge for.

And look at what you actually just did.

You found a job that business isn't doing.

That's the whole skill, right there. And you did it on your
phone in five minutes.

In From Xbox to Executive I break every business into five
jobs that have to get handled. Most are doing two of them and
can't figure out why they're stuck.

You just spotted the missing one. The book shows you how to be
the person who fills it.

👉 Get From Xbox to Executive: (LINK: https://joineat4life.com/xboxtoexec)

Holla Back – Get ya Dolla Back. ✊🏾
Sebastian
Eat 4 Life

P.S. I gotta question: which spot would you fix first if they
let you?
```

*Source: Meta Muse launch, Sept 8 2026 — https://siliconangle.com/2026/09/08/meta-debuts-its-secure-by-design-personal-ai-agent-muse/*

---

## S3 — Friday

**Subject:** They turned on a robot factory last week

**Preview text:** Not a movie. A real one.

```
Yo [First Name],

XPeng switched on a factory that builds humanoid robots. Real
building. Robots walking off the line. Last week. 🤖

Each hand has 21 different ways it can move. A real hand isn't
far off that.

See the build → (LINK: https://www.xpeng.com/news/01a080371029a057bc8e8a02a2c6012b)

I'm not telling you this so you go build robots. I'm telling
you because of what it means for you.

1. The future keeps showing up early. ⚡
Robots working in a factory was supposed to be a 2035 thing.
It happened this month.

So every time you catch yourself thinking "that's years away" —
go check. It usually isn't.

2. New machines make new jobs. Weird ones.
Somebody has to train these things. Somebody has to test them
and write down what broke. Somebody has to explain to a normal
business owner what the thing even does.

Those jobs are brand new. Which means NOBODY has ten years of
experience in them. Not one person on earth.

That's the only door that's ever wide open when you're starting
out — the one where nobody has experience yet.

3. So get early on purpose. 🎯
Ask ChatGPT this:

"What jobs will exist in the next 3 years because of AI and
robots that barely exist right now? For each one, tell me what
it pays, and the first thing I'd need to learn."

Read it. Pick the one that sounds the most like you. Go learn
that one thing.

That's the whole move. That's it.

I did the same thing with gaming before anybody thought it was
a real career. People laughed. Then it stopped being funny.

Being early is a strategy. When you don't have experience yet,
it's honestly the only one that works — you go where nobody
else has experience either.

But being early is only half of it. You still gotta know what
to DO when you get there. That part I had to learn the hard
way.

From Xbox to Executive is the other half. Five jobs every
business needs handled, which one to learn first, and how to
get paid for it inside 90 days.

👉 Get From Xbox to Executive: (LINK: https://joineat4life.com/xboxtoexec)

Holla Back – Get ya Dolla Back. ✊🏾
Sebastian
Eat 4 Life

P.S. I gotta question: what's something everybody says is
"years away" that you think shows up next year?
```

*Source: XPeng IRON production line, Sept 8 2026 — https://www.xpeng.com/news/01a080371029a057bc8e8a02a2c6012b*

---

## Bench — student versions of A2 and A3

Not on the schedule. The Sora story and the "everybody sounds the same" story both work
on the student list — they just needed writing from scratch, not relabeling. Use these if
those topics should run both ways, or as swaps for S2/S3.

### B1 — student version of A2 (Sora sunset) — dead after Sept 24

**Subject:** The app people built businesses on just died

**Preview text:** Here's why that's good news for you.

```
Yo [First Name],

OpenAI is shutting off Sora. It made AI videos. People built
whole little businesses on it. On September 24th it stops
working. 😵‍💫

Read the notice → (LINK: https://developers.openai.com/api/docs/deprecations)

Sounds like bad news. It's actually the most useful lesson I
can hand you right now.

1. Don't fall in love with an app. 🎮
Nobody is gonna hire you because you know Sora. Or ChatGPT.
Or whatever's hot next month.

They hire you because you can take a messy idea and turn it
into something that looks good.

Apps get shut off. That doesn't.

2. Learn the part that never disappears.
Ask this:

"What makes somebody keep watching a short video past the
first 3 seconds? Give me 5 things and an example of each.
Don't name any specific apps."

Now you learned something that works in every app, forever.
Nobody can turn that off.

3. Right now, being the one who KNOWS is worth money. 💡
There are business owners today using Sora with no idea it's
shutting off. In two weeks their videos just stop.

You could be the person who tells them. And who knows where
to send them instead.

That text is worth more than anything on a resume:
"Hey — the video app you're using shuts down Sept 24. Here's
what I'd switch you to."

Send that to five local businesses. See who writes back.

Last thing, and it matters:

Your videos, your edits, the people who've seen your work —
that's yours. Nobody can shut that off.

Every app you use is rented. Always. So don't build your whole
thing on top of one of them.

And the skill you're actually building here has a name.

Getting a business known. The posts, the videos, the presence
that makes a whole neighborhood feel like they know that spot.

In From Xbox to Executive I call it the Amplifier, and it's
one of five jobs every business needs. It almost never closes
the sale by itself. It's the reason the sale was easy.

Apps come and go. That job doesn't.

👉 Get From Xbox to Executive: (LINK: https://joineat4life.com/xboxtoexec)

Holla Back – Get ya Dolla Back. ✊🏾
Sebastian
Eat 4 Life

P.S. I gotta question: what's one app you'd be stuck without if
it disappeared in 14 days?
```

**Notes:** Same Sora source as A2. Dead copy after Sept 24 — if it slips, don't reschedule it, cut it.

*Source: https://developers.openai.com/api/docs/deprecations*

---

### B2 — student version of A3 (48% stat)

**Subject:** Everybody's emails sound the same now

**Preview text:** That's your opening.

```
Yo [First Name],

Almost half of small businesses now use AI to write their
emails. And it's working — they get better results than the
ones who don't.

See the report → (LINK: https://www.constantcontact.com/blog/small-business-now-report/)

But here's what nobody's saying out loud 👇

1. When everybody uses the same three apps, everybody starts
sounding the same.
Same clean paragraphs. Same three bullet points. Same "I hope
this email finds you well."

It's like when everybody unlocked the same gun. The gear
stopped being the advantage. Went right back to who could
actually play.

2. Being specific is the whole edge now. 🎯
One sentence only YOU could write beats four perfect paragraphs
of nothing.

Try it. Ten minutes:

Pick a business you know. Look at their page, their reviews,
their IG. Then write ONE sentence about them that a stranger
could not have written.

Something like: "Y'all are the only shop on the block open
Sunday and half your reviews say it."

That's the skill. That's the whole thing.

3. Now go use it. 💼
Copy this:

"Here's what I noticed about this business: [your sentence].
Write me a short, honest 5-sentence email offering to help them
with [one thing]. No hype words. Sound like a real person who
did their homework, not an ad."

Read it. Fix anything that doesn't sound like you. Send it.

Businesses will pay for this TODAY. Most of them are drowning
in generic and they know it.

The ones winning right now aren't using the most AI. They're
the ones that still sound like a person.

Same goes for you.

And the thing you just practiced is a real job somebody pays
for.

Email and follow-up — the messages that keep working while the
owner is asleep. It's one of five jobs I break down in From
Xbox to Executive.

Honestly it's one of the easiest ones to sell, because almost
nobody is doing it and the client sees the difference inside
30 days.

👉 Get From Xbox to Executive: (LINK: https://joineat4life.com/xboxtoexec)

Holla Back – Get ya Dolla Back. ✊🏾
Sebastian
Eat 4 Life

P.S. I gotta question: what's one thing you'd notice about a
business that a stranger wouldn't?
```

**Notes:** Same stat source as A3. No expiry — this one keeps.

*Source: https://www.constantcontact.com/blog/small-business-now-report/*

---

# The book's framework (internal reference — do not copy into emails)

From Xbox to Executive breaks a business into **five roles, framed as an Overwatch team
comp**. That framing is the book's, and it's great *in the book*.

**The emails translate it into plain English.** A reader who plays Madden once a month,
or hasn't touched a controller since college, should still get every point. So in the
copy it's "five jobs every business needs handled" and "most are only doing two" — never
"ranged Damage" or "a broken comp gets rolled." Save the class names for the book; the
email just has to leave them knowing which job they'd be doing.

| Role | Department | What it does |
|---|---|---|
| **Damage** | Sales & Funnels | Turns attention into money. The carry. Fastest visible win for a client. |
| **Damage (ranged)** | Marketing — email, SMS, ads | Works the whole map. Reaches people at scale while the owner sleeps. |
| **Support (healer)** | Customer Service | Keeps the customers you already won. Stops the bleed-out. |
| **Support (buff)** | Content & Social | The Amplifier. Rarely closes a sale; makes every other role hit harder. |
| **Tank** | Customer Fulfillment | Delivers what sales promised. Where reputations are made or destroyed. |

**The two ideas that do the most work — say them plainly in email:**

- *"A broken comp gets rolled."* → in copy: most small businesses are only doing two of
  the five jobs, and that gap is why they need somebody.
- *"You're not a single hero anymore. You're a whole team in one chair."* → in copy: AI
  covers the parts that used to take a whole staff, which is why one person can do this
  now.

**And the 90-day plan matters as much as the comp:** the goal of the first 90 days is
*one* paying client, not five. Days 1–30 learn ONE role. Days 31–60 land one client.
Days 61–90 deliver. "Not all five departments. One." Any student email that implies they
need to learn everything is fighting the book.

**Where this week's emails land:**

| Email | Job it bridges to | Book role behind it |
|---|---|---|
| S1 — build a website | Getting customers in the door | Damage (Sales & Funnels) |
| S2 — Muse, find the gap | Spotting the job a business isn't doing | The broken comp |
| S3 — robot factory | Getting early, then pick one job | The 90-day plan |
| B1 — Sora shuts off | Getting a business known ("the Amplifier") | Content & Social |
| B2 — emails sound the same | Email and follow-up | Ranged Damage (Marketing) |

---

# How these get written each week

The research is the job. The format is fixed; the facts have to be current.

**Every Monday, before writing:**

1. Search for the week's AI launches, shutdowns, and funding — anything dated
2. Search the small-business / local-business AI angle specifically
3. Search the jobs-and-skills angle for the student side
4. Pick **one theme per email**, three concrete beats under it

**The rules that make these work:**

- **Every fact is dated and sourced.** A deadline (Sept 24) or a launch date beats a
  vague trend. If it can't be dated, it isn't news, it's filler.
- **Three beats, not five.** Chosen's format. Item 3 is always the one they can DO today.
- **Agency = "what this means for YOUR business."** Student = "here's the side quest."
- **Student copy assumes zero experience.** No jargon. Nothing that expects them to
  already have a portfolio, clients, or a skill. If a normal person couldn't do it
  tonight on their phone, it's the wrong side quest.
- **Every student email lands on the same idea:** doing it once is a favor, doing it the
  same way every time for a price is a business. That's the bridge to the book.
- **Name the actual job the email maps to** — "getting customers in the door," "email and
  follow-up" — not a generic "five departments." The framework table above is the
  reference. A named job makes the email and the book feel like one thing; a generic
  mention reads like an ad bolted on the end.
- **Gaming is the handshake, not the vocabulary.** The reader should finish an email
  knowing Sebastian came out of gaming, and seeing their own relationship with it in his
  story — without ever needing to know a specific game to follow the point. One reference
  any casual player gets (the "everybody unlocked the same gun" line, "side quest",
  waiting on GTA 6) beats three that need Overwatch knowledge. If a line only lands for
  someone deep in the culture, it's costing you the reader who isn't.
- **Link to the actual story**, never an aggregator front page or a homepage. Those move
  on and the link goes dead. Check every URL loads before it ships.
- **One CTA.** Agency → book a call. Student → the book. Never both.
- **P.S. is always a question**, and always answerable in one line. That's what earns
  replies, and replies are what keep the domain healthy.
- **Never promise results.** Report what happened; let them draw the line.
- Agency copy says **"AI Marketing Made Easy."** "Everybody Eats" is student-side only.

**Where the links go:** mark every one as `visible text → (LINK: url)` so whoever loads
it knows exactly which words to hyperlink and where they point. Never ship a bare arrow
with no marker — that's how a link silently goes out dead. If the URL doesn't exist yet,
write `(LINK: NEEDED — what it should point to)` so it shows up as a blocker in review
instead of getting missed.


---

# Appendix — Chosen's two originals (voice reference)

These are the templates every email above was written against. **Don't send them** — the
GPT-6 Astra news is from an earlier cycle. They're here so each week's batch can be
checked against the real voice.

### Original — agency

```
Subject: ChatGPT just went NUTS
Preview text: No seriously-it's insane

Yo [First Name],

I went down a GPT-6 Astra rabbit hole… and had to send you these. 👀 Astra is the newest version of ChatGPT (think IPhone 18 vs IPhone 17)

1. Someone built a game with 10,000+ planets.
They used Astra to create a space game where you can fly, land, and explore. This used to take 6 MONTHS. Now we can do it in 6 minutes 😵‍💫.

Imagine a mini-game for YOUR brand where customers play to unlock an offer.

You bring the idea and feedback. AI handles much of the coding. That makes testing a custom game a whole lot more approachable.

Check out the game →

2. Someone created a house you can actually walk through.
Virtually, using Astra with Blender and Unreal Engine.

Think renovations, event spaces, or your next showroom.

If you want a virtual room made? Any room-20 minutes.

Describe changes in everyday language and explore them before paying for physical changes. Move the idea around while it's still pixels. Your wallet will appreciate that. 😂

See the walkthrough →

3. It worked INSIDE Adobe Premiere to edit a video.
Dan Shipper says his team used Astra to make the first cut of a published video.

That footage sitting on your phone? Think about handing off the rough edit.

Less manual cutting for your team. More time to polish the story and get it published.

See his breakdown →

The part that excites me: ideas we kept putting off are getting easier to try.

Got one already? Let's figure out what this could unlock for your business.

👉 Book a call: [INSERT CALENDAR LINK]

P.S. I gotta question : What are you gonna do with YOUR extra time?

Sebastian
Eat 4 Life
```

### Original — student

```
Preview text: Your next side quest just got interesting.

Yo [First Name],

We're still waiting on GTA 6… and someone used GPT-6 Astra to build a game with 10,000+ planets.

Fly there. Land. Get out and explore. 👀

You gotta see this →

Now imagine making something YOU would actually play.

Here's a little side quest:

1. Build your first mini-game. 🎮
Try this prompt with Astra:

"Build a simple basketball shooting game that runs in my browser. Include a score and a timer. Tell me how to run it, and explain how it works like I'm a beginner."

AI can handle much of the coding while you learn what makes the game work.

2. Play it. Then make it better.
Too easy? Ask for a moving hoop. Something broken? Describe what happened.

You're practicing how to explain an idea, test it, and improve it. Those skills travel way beyond gaming. Businesses will Pay you TODAY to do this FOR them.

3. Give it a business mission. 💡
Imagine adapting it for a local gym's shooting challenge.

Now you've got a sample project to show a business owner—and a reason to learn about offers, marketing, and customers.

That's the energy behind From Xbox to Executive.

I went from professional gaming to business. The book connects those worlds and breaks down the five departments behind a digital business, so you can find where your skills fit.

Have fun building. Learn what makes the business work.

👉 Get From Xbox to Executive: [INSERT BOOK LINK]

Holla Back – Get ya Dolla Back. ✊🏾
Sebastian
Eat 4 Life

P.S. I gotta question: If you could build your own game… what would it be?
```
