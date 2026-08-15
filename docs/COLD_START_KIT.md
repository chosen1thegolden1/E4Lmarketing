# Cold Start Kit — Send Tomorrow Morning

The light opener series. Five emails over thirteen days, plus the phone script. Nothing heavy,
nothing to build, no calendar link required. Its two jobs:

1. **Warm the sending account** — earn replies, not clicks. Replies are the strongest positive
   signal a young sending domain can get.
2. **Learn the customer** — find out who answers, what they say, which vertical bites. Next
   week's heavier pitches get written off what you learn this week.

The heavy assets (scorecard, GEO audit, voice demo) sit behind this as escalations. You do not
lead with them. You lead with a question.

Full pitch library for next week: `OUTREACH_COPY_BANK.md`.

---

## Read this before you send anything tomorrow

**Get SPF + DKIM on the sending domain today if there is any way to do it.** It's a DNS job —
GHL generates the records, you paste them at the registrar, click verify. Thirty minutes of
Abdullah's time (his Task 3). Without it, tomorrow's batch lands in spam, and a domain that
starts in spam takes weeks to dig out of it. This is the one thing worth delaying a morning for.

**If it isn't done by tomorrow morning, send anyway — but send small and send from Gmail.**
First week out of `chosen1@gsgagency.com` directly: better placement than unauthenticated GHL
infrastructure, and every reply lands in a real inbox you're already watching. Log the sends in
GHL as notes so the contact history is intact, and move the volume into GHL the day the domain
verifies.

Either way the daily numbers below don't change. Ten a day feels slow. Ten a day that land in
the inbox beats a hundred that don't, and week three is where the volume actually shows up.

---

## Step 1 — Get your leads into GHL tonight (15 minutes)

Format your list as CSV with these headers, in this order:

```
First Name,Last Name,Email,Phone,Company Name,Website,City,State,Industry
```

Anything you don't have, leave blank — only **Email** is truly required, and **First Name** or
**Company Name** for the merge fields to read like a human wrote them. A row with neither reads
as "Hey there" and gets deleted.

In **E4L Client Services** (confirm the sub-account name in the top-left switcher before you
touch anything): **Contacts → Import → Upload CSV → map the columns → apply tags on import.**

Tags to apply to the whole batch at import:

```
cold-outreach
status:queued
batch:2026-08-16
industry:<vertical>
city:<city>
```

The `batch:` tag is what lets you pull today's group tomorrow and compare batch to batch later.
Use one tag per import so you never lose track of which list is which.

**Then split the list.** Sort by whichever signal you trust — revenue, review count, how well
you know the vertical — and tag your top 20 `priority:high`. Those get a phone call and a
personalized first line. The rest ride the series as-is.

---

## Step 2 — The daily rhythm

| Day | New emails out | Calls | Also |
|---|---|---|---|
| Day 1 (tomorrow) | 10 | 5 | Only Email 1 goes out. Nothing else exists yet |
| Day 2 | 10 | 5 | Answer every reply within the hour |
| Day 3 | 10 | 5 | Day-1 batch gets Email 2 |
| Day 4–5 | 15/day | 8/day | |
| Week 2 | 20–25/day | 10/day | Day-1 batch hits Email 3 — first link goes out |
| Week 3 | 30–40/day | 10/day | Tighten DMARC to `p=quarantine` if reports are clean |
| Week 4+ | 50+ | as capacity allows | Scale with list quality |

**Send window:** 7:00–9:00am in the prospect's timezone, Tuesday through Thursday hardest.
Monday morning and Friday afternoon are the two worst slots for a local-business owner.

**Non-negotiable daily habit:** answer every reply within the hour, including the rude ones.
Reply speed is both the reputation signal that warms the account and the thing that converts.
An unanswered reply is worse than a send you never made.

**Stop-loss:** if two consecutive days of sends get zero opens, stop and test placement with
mail-tester.com before sending more. Something is filtering you and volume will only make it worse.

---

## Step 3 — The opener series

Five emails, thirteen days. Same thread — **reply to your own previous send** for emails 2
through 5 so it threads. Threaded follow-ups get read more and look less like a campaign.

Merge fields are GHL syntax. `[BRACKETS]` are what you fill in per business.

### Email 1 — Day 1. No link. No pitch. One question.

**Subject:** `quick one about [Company]`

```
{{contact.first_name | default: "Hey"}} — Chosen here, I run a small
marketing shop in LA.

Not a pitch. I'm trying to get a read on something and you'd actually know
the answer: when someone calls [Company] and nobody picks up, what happens
to that call?

Genuinely curious what most [INDUSTRY] owners do about it. One line back is
plenty.

— Chosen · Eat 4 Life Marketing
```

**Why it's built this way:** no link, no attachment, no ask beyond one sentence. Links in a
first cold send from an unwarmed domain are the single biggest spam trigger you control. This
email is optimized for one thing — a reply — and "what happens to that call" is a question a
business owner has an opinion about.

Swap the question by vertical:

- **Roofing / HVAC / plumbing:** "when someone calls for an estimate and gets voicemail, what happens to that call?"
- **Med spa / salon:** "how many DMs a week come in after you've closed, and who answers them?"
- **Dental / medical:** "what's your actual no-show rate — the real one, not the one on the report?"
- **Real estate:** "when a lead comes in at 9pm, how long before someone talks to them?"
- **Restaurant:** "who's answering the phone during the dinner rush?"
- **Law:** "what happens to an intake call that comes in while you're in court?"

### Email 2 — Day 3. Still no link.

**Subject:** reply on the same thread — leave the subject alone

```
{{contact.first_name | default: "Hey"}} — following up on my own email,
which I realize is a look.

The reason I asked: I've been pulling this same question across a bunch of
[INDUSTRY] shops and the answers are all over the place. Some owners have
it wired. Most say some version of "honestly, no idea."

No wrong answer, and I'm not selling you anything on the back of it. Which
one are you?

— Chosen · Eat 4 Life Marketing
```

### Email 3 — Day 6. First link. The soft offer.

**Subject:** reply on the same thread

```
{{contact.first_name | default: "Hey"}} — last time I'll ask, then I'll get
out of your way.

If you'd rather see the number than guess at it: we built a two-minute
version of the question. Eight questions about how calls, follow-up, and
no-shows actually run at [Company], and it puts a rough dollar figure on
what's slipping past.

Free, no call required, and you see the result on screen immediately.

[SCORECARD LINK]

It's an estimate off industry benchmarks, not a promise — it's a flashlight,
not an invoice.

— Chosen · Eat 4 Life Marketing
```

By day 6 the domain has a week of sending history and some replies behind it. That's when a link
is safe to introduce.

### Email 4 — Day 9. Proof, not pitch.

**Subject:** `the thing that surprised me`

New subject, new thread. Pick **one** of these — whichever matches what you can actually show
that week. Do not send more than one.

**Option A — the AI visibility angle** (leads into the GEO offer):

```
{{contact.first_name | default: "Hey"}} — something from this week worth
two minutes of yours.

I ran a med spa through twenty-one questions on ChatGPT, Gemini, and
Perplexity — the exact things a customer types when they're ready to book.
"best med spa in Newport Beach." "where should I get filler."

She came back named in five of twenty-one. Her competitors took the rest.
Nothing about them is better than her. They're just readable to the machine
and she isn't yet.

I can run the same twenty-one on [Company] and send you the screenshots.
Takes me an afternoon and costs you nothing. Want it?

— Chosen · Eat 4 Life Marketing

AI recommendations change constantly. These are snapshots, not guarantees.
```

**Option B — the voice agent angle** (leads into the demo build):

```
{{contact.first_name | default: "Hey"}} — back to the missed-call question I
asked a couple weeks ago.

Rather than explain what we do about it, I'd rather you just hear it. I can
build [Company] an AI receptionist off your website — knows your services,
answers like your front desk on a good day, books the appointment — and put
her on a live number you can call and try to break.

I've got two demo lines free right now, so I can only do a couple of these.
Want one?

— Chosen · Eat 4 Life Marketing
```

Option B is the highest-converting email in this kit and it is genuinely capacity-limited — the
pool has **two numbers** (`voice-ai-demo-builder/pool.json`), one currently in use. Send it to
two or three prospects at a time, not the whole batch, and only to businesses you'd actually
want to sign. The scarcity line is only worth using because it's true.

### Email 5 — Day 13. The close-the-file email.

**Subject:** `closing your file`

```
{{contact.first_name | default: "Hey"}} — I'll stop here.

If it's timing, name a month and I'll come back then. If it's not a fit,
"not interested" is a complete sentence and I'll take you off the list
today. If you just never got to it, reply with a word and I'll pick it back
up.

Either way, good luck with the rest of the year.

— Chosen · Eat 4 Life Marketing
```

Breakup emails out-reply everything before them. Send it, mean it, and honor it.

---

## Step 4 — The phone script

Call the **published business line**, not a mobile number you scraped. Business lines are fair
game for B2B; personal cells are a different legal question and not worth it for this.

Call the day *after* Email 1 lands. The email is what makes the call land as "oh, that guy"
instead of a cold interruption.

### The call

> "Hey — is this [First Name]? … Chosen, I sent you an email yesterday morning, probably buried
> by now. Thirty seconds and I'll let you go.
>
> I'm asking every [INDUSTRY] owner in [City] the same question, because the answers have been
> all over the place: when somebody calls you and nobody picks up — busy day, after hours,
> whatever — what happens to that call?"

Then **stop talking.** The whole script is the question. Whatever they say next is the
conversation.

**If they engage:** ask one more — *"and does anybody follow up on it, or is it gone?"* — then:

> "That's the same answer I get from most people, which is why I asked. We build the thing that
> catches those. I'm not going to pitch you on the phone — can I send you a two-minute thing
> that puts a number on it? Same email address?"

**If they're busy:** *"No problem. I'll leave it in your inbox — subject line's 'quick one about
[Company].' Worth thirty seconds when you get a minute."* Then hang up first. Ending the call
before they have to is a real advantage.

**If they say "we're all set":** *"Good — most people aren't. I'll get out of your hair."* Tag
`do-not-contact` and remove them. No second pass.

### Voicemail (keep it under 20 seconds)

> "[First Name] — Chosen, Eat 4 Life Marketing, in LA. Sent you an email yesterday, subject line
> 'quick one about [Company].' One question in it, one line back is plenty. Not selling you
> anything today. Thanks."

Say the company name and the subject line. That's what makes them find the email instead of
deleting it.

### Log every call in GHL

Same-day, on the contact record, one line: what they said, and one of these tags —

```
called:no-answer · called:voicemail · called:spoke · do-not-contact
```

The point of week one isn't just booked calls. It's finding out what these owners actually say
so next week's copy is written off their words instead of your guesses.

---

## Step 5 — When someone bites

Replies escalate. Do not run someone who's engaged through the rest of the series — pull them
out and go to the matching asset.

| They said | Send this | Then |
|---|---|---|
| Any answer to the question in Email 1 | Reply like a human, ask one follow-up | Escalate on their *second* reply, not their first |
| "What do you do exactly?" | Scorecard link, one line of setup | Book the call off the result |
| "Sure, run the AI thing" | `node src/audit.js "<Business>" "<City, ST>" <niche>` → Rozel QAs → send `report.html` | Copy Bank § 4, B2 |
| "Yeah build the demo" | Demo builder pipeline. Check pool capacity first | Copy Bank § 5, C2–C3 |
| "What does it cost?" | Copy Bank § 10. **Don't send the price sheet cold** | Book the call |
| "Not interested" | One line, remove them, `do-not-contact` | Nothing further, ever |

Everyone who replies at all comes out of the series and goes to `status:engaged`. Everyone who
finishes all five without replying goes to `cs-nurture` — one email a month, Copy Bank § 7.

---

## Step 6 — What to check Friday

Five numbers, every Friday. They tell you what to change on Monday.

1. **Sent** — did you hit the daily number, or did the day get away from you
2. **Replies** — the one that matters. **Target 5–10%.** Under 3% means the question is wrong for
   the vertical, not that you need more volume
3. **Positive vs. negative replies** — a "not interested" is still a warm signal for the account
   and still teaches you something
4. **Calls connected** — and what they actually said, in their words
5. **Bounces** — over 3% and the list quality is a problem. Clean it before you send more, because
   bounces damage the domain faster than anything else on this page

Whichever question got the most replies becomes the opener for next week's batch. That's the whole
optimization loop — run it weekly, don't overthink it.

---

## The compliance floor

Two things, non-negotiable, on every send:

**1. CAN-SPAM footer on every cold email.** Put it in the GHL template footer so it can't be
forgotten:

```
Eat 4 Life Marketing · [FULL POSTAL ADDRESS, CITY, STATE ZIP]
Not useful? Reply "stop" and I won't email you again.
```

Needs a real physical mailing address — I don't have one to fill in. Honor every stop same-day.

**2. No cold SMS.** Not in this kit, not this week. Texting a prospect who never gave you their
number is TCPA exposure at roughly $500–$1,500 per message and it will get the A2P campaign
killed. Text only people who typed their own number into the scorecard or who already replied.
SMS copy for those two groups is in Copy Bank § 8.

---

## Tomorrow morning, in order

1. Import the list, tag it, split off `priority:high` — 15 min
2. Paste Email 1 into GHL as a template, add the CAN-SPAM footer, set the vertical question — 10 min
3. Send 10. Watch them go out. Confirm one landed in a real inbox you control — 15 min
4. Make 5 calls off the `priority:high` group — 30 min
5. Answer every reply within the hour, all day

That's the morning. Everything heavier waits for next week, and it'll be better written because
of what today teaches you.

*Figures in any outreach asset are directional estimates from published industry benchmarks, not
guarantees. AI Marketing Made Easy.*
