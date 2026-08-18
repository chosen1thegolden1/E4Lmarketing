# CS-Cold-Open — GHL build sheet

Click-by-click build for the cold outreach workflow. Copy is from
`COLD_START_KIT.md` § 3; this is the wiring. GHL's API can't create workflows, so
this is a UI build — about 20 minutes if you work straight down the page.

**Build it now, switch it on later.** Nothing sends until you publish the
workflow and start tagging contacts, so none of this is blocked by the
`gsgagency.com` DNS work.

Everything below is in **E4L Services**. Confirm the sub-account name in the
top-left before you start.

---

## The design decision that saves you five workflows

The opener question changes per vertical — a roofer gets "when someone calls for
an estimate and gets voicemail, what happens to that call?", a med spa gets a
question about after-hours DMs. The obvious build is six near-identical
workflows, one per vertical. Don't.

Instead: **the question lives in `cs_opener_question`, set in bulk per vertical
after import.** Email 1 merges it. One workflow covers all six verticals, and
changing the question you're testing is a bulk field edit rather than a workflow
rebuild. That is what the field was created for.

### Set the field before you build

Contacts → filter `industry:<vertical>` → select all → Edit → `cs_opener_question`:

| Filter | `cs_opener_question` value |
|---|---|
| `industry:roofing`, `industry:hvac` | `when someone calls for an estimate and gets voicemail, what happens to that call?` |
| `industry:dental` | `what's your actual no-show rate — the real one, not the one on the report?` |
| `industry:med-spa` | `how many DMs a week come in after you've closed, and who answers them?` |
| `industry:chiropractic` | `when a new patient calls and nobody picks up, what happens to that call?` |
| `industry:dog-grooming` | `how many booking calls come in while you've got both hands on a dog?` |

Set `cs_lead_source` to `sheet-import` on the whole batch in the same pass.

---

## Volume control: tag 10 a day

**Trigger tag is `outreach:start`.** The workflow does everything including
Email 1 — you control volume by how many contacts you tag each morning, not by
hand-sending.

This replaces the "send 10 manually" step in the Cold Start Kit. Same volume
discipline, but every send is logged, merge fields render consistently, and
`cs_outreach_step` tells you where everyone is. Hand-sending ten a day drifts
within a week.

Daily: Contacts → filter `priority:a` + `industry:hvac` + `status:queued` →
select 10 → Add Tag `outreach:start`. Done.

---

## Who goes in

**Tier A and B only** — `priority:a` or `priority:b`. Those have a real first
name.

The 44 tier-C contacts have no first name, and `Hi ,` is worse than no email at
all. Run them through a duplicate workflow (`CS-Cold-Open-NoName`) where Email 1
opens `Hi — Chosen here` and drops the name merge entirely. Build that second,
after the main one works.

---

## Workflow settings (set these first — they're easy to miss)

Workflows → **Create Workflow** → Start from Scratch → name `CS-Cold-Open`.

Then the **Settings** tab, before adding any steps:

| Setting | Value | Why |
|---|---|---|
| **Stop on Response** | **ON** | The whole point. Anyone who replies exits immediately |
| Allow Re-entry | OFF | Nobody gets the sequence twice |
| Time Window | 7:00am – 11:00am, contact's timezone | Local-morning delivery |
| Days | Tue, Wed, Thu | Monday morning and Friday afternoon are the two worst slots |
| Stop on Unsubscribe | ON | |

The Time Window matters: without it, a wait step lands mail at 3am and the
open rate drops for no reason.

---

## Steps, in order

### 1 · Trigger
**Contact Tag** → Tag Added → `outreach:start`

Filter: `priority` is `A` **or** `priority` is `B`

### 2 · Update Contact Field
- `cs_outreach_step` → `1`
- `cs_last_touch` → today's date

### 3 · Email — `CS-Open-1`
Subject: `quick one about {{contact.company_name}}`

```
Hi {{contact.first_name}} — Chosen here, I run a small marketing shop in LA.

Not a pitch. I'm trying to get a read on something and you'd actually know
the answer: {{contact.cs_opener_question}}

Genuinely curious what most {{contact.cs_industry}} owners do about it.
One line back is plenty.

— Chosen · Eat 4 Life Marketing
```
**No link, no attachment, no image.** First contact from a domain with thin
sending history — every link is a spam signal you don't need yet.

### 4 · Wait — 2 days

### 5 · Condition — has `do-not-contact` tag?
→ **Yes:** exit workflow. **No:** continue.

Repeat this condition before every send below. Stop-on-Response covers replies;
this covers people your reps mark off manually.

### 6 · Update Contact Field → `cs_outreach_step` = `2`, `cs_last_touch` = today

### 7 · Email — `CS-Open-2`
Subject: leave blank to thread onto the previous email if your GHL version
supports it; otherwise `re: {{contact.company_name}}`

```
{{contact.first_name}} — following up on my own email, which I realize is
a look.

The reason I asked: I've been putting that same question to a bunch of
{{contact.cs_industry}} shops and the answers are all over the place. Some
owners have it wired. Most say some version of "honestly, no idea."

No wrong answer, and I'm not selling you anything on the back of it. Which
one are you?

— Chosen · Eat 4 Life Marketing
```
Still no link.

### 8 · Wait — 3 days · then the `do-not-contact` condition · then step = `3`

### 9 · Email — `CS-Open-3` — **first link goes out here**
Subject: `the two-minute version`

```
{{contact.first_name}} — last time I'll ask, then I'll get out of your way.

If you'd rather see the number than guess at it: we built a two-minute
version of the question. Eight questions about how calls, follow-up, and
no-shows actually run at {{contact.company_name}}, and it puts a rough
dollar figure on what's slipping past.

Free, no call required, and you see the result on screen immediately.

[SCORECARD LINK]

It's an estimate off industry benchmarks, not a promise — a flashlight,
not an invoice.

— Chosen · Eat 4 Life Marketing
```
By day 6 the domain has a week of history and some replies behind it. That's
when a link is safe to introduce.

### 10 · Wait — 3 days · condition · step = `4`

### 11 · Email — `CS-Open-4`
Subject: `the thing that surprised me`

Use **Option A (GEO)** or **Option B (voice demo)** from `COLD_START_KIT.md` § 3,
Email 4. Pick one per batch — never both.

⚠️ Option B is capacity-capped to the **two** numbers in `pool.json`, one of
which is in use. Only send it to a handful of prospects you'd genuinely want to
sign. The scarcity line in it is true, which is the only reason it's worth using.

### 12 · Wait — 4 days · condition · step = `5`

### 13 · Email — `CS-Open-5`
Subject: `closing your file`

```
{{contact.first_name}} — I'll stop here.

If it's timing, name a month and I'll come back then. If it's not a fit,
"not interested" is a complete sentence and I'll take you off the list
today. If you just never got to it, reply with a word and I'll pick it
back up.

Either way, good luck with the rest of the year.

— Chosen · Eat 4 Life Marketing
```

### 14 · Remove Tag `status:queued` · Add Tag `cs-nurture`

Anyone who finishes all five without replying lands in the monthly nurture
track — `OUTREACH_COPY_BANK.md` § 7.

---

## The footer — required on every one of the five

Put it in the email template footer so it can't be forgotten:

```
Eat 4 Life Marketing · 215 E Regent St, Inglewood, CA 90301
Not useful? Reply "stop" and I won't email you again.
```

A physical postal address and a working opt-out are both legally required on
commercial email. Honor every stop the same day and tag `do-not-contact`.

Address confirmed 2026-08-18. Complete — paste the two lines above into the GHL
email template footer once, so every send in every sequence inherits it.

---

## Sender settings — CONFIRMED LIVE 2026-08-18

Verified in E4L Services → Settings → Email Services:

| | |
|---|---|
| Sending domain | `mail.e4lmarketingdemos.com` — default, SSL issued, Workflow Domain 100% |
| From name | `Chosen` |
| From email | `chosen@mail.e4lmarketingdemos.com` |
| Reply / Forward / BCC | intentionally **empty** |
| GHL warmup | Stage 1, ceiling 1000/day |

The `mail.` prefix is load-bearing in two directions. The bare
`e4lmarketingdemos.com` has no MX records, so replies to an address there
vanish; and the DKIM key is published under `mx._domainkey.mail`, so a From:
header on the bare domain would fail DMARC alignment.

**The from-address had to be set explicitly.** GHL's Dedicated Header was
empty ("Name not provided / Email not provided"), which meant outbound would
fall back to the Business Profile address — `Chosen1@gsgagency.com`. That
would have DKIM-signed every campaign email as `mail.e4lmarketingdemos.com`
while showing a `gsgagency.com` From: header: DMARC misalignment on every
send, invisible under `p=none` and catastrophic the moment that domain
tightens to `p=quarantine`. Set via the domain card's ⋯ → Set Headers.

**Reply/Forward/BCC stay empty on purpose.** Replies must land in GHL
Conversations so Stop-on-Response can fire and the sequence exits. A
Reply-To pointing at Gmail would send replies somewhere GHL cannot see, and
the workflow would keep emailing people who already answered.

## Before you switch it on

- [ ] Send one test to yourself. Confirm **every merge field renders** — no blank
      `{{ }}`, no `Hi ,`
- [ ] Confirm the from-address is the `mail.` subdomain
- [ ] Confirm the footer carries a real postal address
- [ ] Run mail-tester.com on a workflow send. Target 9+
- [ ] Walk the workflow in test mode — do not wait 13 real days
- [ ] Delete the test contact

Then tag ten HVAC tier-A contacts and watch what happens.
