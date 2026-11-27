# Broadcast emails — week of Nov 30, 2026

**Send week:** 2026-11-30

**Written 2026-11-24 (Tue) by the Tuesday writer routine.** Target week is the Monday six days from this Tuesday (Nov 30). Every dated claim is pinned to a calendar date. No "today", "yesterday", "tomorrow" or "this morning" anywhere in a broadcast.

**Research date: 2026-11-24.** Fetched and read at the source: the Google Business Profile Community post "Google Small Business Bulletin: Holiday Checklist & New Features" (posted Nov 5, 2026, by Google's Lisa Landsman) (A2), Google Business Profile Help "Chat with customers from your Business Profile" (A2), Adobe's newsroom release "U.S. Holiday Shopping Season to Hit Record $275.1 Billion Online" (Sept 28, 2026) (S1), and e4lagency.com (A1, A2, A3, A-SUN, S1, B1). Everything else is calendar arithmetic, Chosen's story bank, or Chosen's own words.

**Send order:** Mon Nov 30 / Wed Dec 2 / Fri Dec 4 / Sun Dec 6. One agency, one student each day, 8:00 AM Pacific. **Student emails go to the Readers list.** The "Black Friday goes to the whole list" exception does **not** apply, because no promo email is in this batch (see PROMO).

---

## Header block (goes at the top of the review doc)

SEND FROM: chosen@mail.e4lmarketingdemos.com — never gsgagency.com.
CADENCE: Mon / Wed / Fri / Sun. One agency, one student, each day.
FOOTER on every send: Eat 4 Life Marketing · 215 E Regent St, Inglewood, CA 90301 + a real unsubscribe link.
CHAIN: Claude writes → Claude edits → **Chosen approves** → Daniel (both lists) → Abdullah loads.
LINKS: already live in the built HTML. Every URL carries UTMs.
TIME-SENSITIVE: A1 and S1 are pinned to **Mon Nov 30 (Cyber Monday)**: "over the long weekend" and "Cyber Monday" are true only that day. A2 quotes Google's Nov 5 bulletin and the chat help page (menu names can change, so Friday's check re-reads both). S1 quotes Adobe's Sept 28 *forecast* for Cyber Monday and says "forecast"; Adobe may publish actuals before Nov 30, which does not make the forecast line false, but Friday's check looks. A-SUN and S-SUN are pinned to a Sunday. No email carries an image.

**SEASON (read `seasons.md` first).** Holidays in or beside Nov 30 to Dec 6, computed: Thanksgiving is the fourth Thursday of November 2026 = **Thu Nov 26**, so the long weekend is Thu Nov 26 to Sun Nov 29 (beside the week: Black Friday Fri Nov 27, Small Business Saturday Sat Nov 28). **Cyber Monday = the Monday after Thanksgiving = Mon Nov 30, our A1/S1 slot.** Nothing else in `seasons.md` falls in the week; the next listed date is Christmas Eve, Thu Dec 24. What the batch did:
- **Agency, one seasonal email: A1 (Mon Nov 30).** `seasons.md` says owners are *running* promos that weekend, not reading ours, and that "what your follow-up should say to everyone who bought this weekend" is the useful email on the Monday after. A1 is exactly that: the new customers from the long weekend, and the one message that keeps them. No offer of ours, no deadline. A2, A3 and A-SUN do not mention the holiday.
- **Student, one seasonal email: S1 (Mon Nov 30).** `seasons.md` says the student reader is *buying* that week. With no real offer (see PROMO), S1 takes the "deliberately out of the fight" option and flips the day: everybody's selling to you, so here's how you end up on the side that gets paid. It sells the book at its normal price, carries no discount and no deadline. Nothing else on the student side mentions a holiday.
- **Same date, two different emails:** the agency Cyber Monday email is about the owner's new customers; the student one is about the reader switching sides. Nothing is split across lists.
- **December, weeks 1–2 are the flat zone** (`seasons.md`). A3 (the apps you pay for and never set up) and S-SUN ("where do you want to be next December?") lean on the calendar, which is a real clock, not on a holiday, so neither counts as a second seasonal email.
- **No Christmas Day or New Year's Day slot falls in this week.** Nothing is skipped; all eight slots are written.

**PROMO. No promo ships in this batch, and no email carries a deadline.** `docs/PROMOS.md` still has one row headed LIVE (Black Friday / Cyber Monday, student), and it is still not a live offer:
- **No checkout URL exists.** The row lists all three checkouts ($500 lifetime course, book with free audiobook, $50 mini course) as "does not exist yet" / "must be built". There was nothing to WebFetch. `PROMOS.md` is unchanged since Oct 31 (last commit touching it: a06b2d1, a status note).
- **The window was never confirmed**, and none of the six open questions has an answer in the repo.
- **This was the batch the close lived in.** Cyber Monday Mon Nov 30 is the first send of this week, and `PROMOS.md` says the close "needs everything by **Tue Nov 24**", the day this batch was written. It doesn't have it, so **the Black Friday / Cyber Monday promo did not happen**, and this batch does not write a close for an offer that never opened. S1 is the Cyber Monday slot, and it sells the book at its normal price with no deadline.
- **No promo spans into the week after (Dec 7).** There is no other row.
- **"Black Friday Vault sends."** The Nov 22 note in `EMAIL_OPERATING_CADENCE.md` and Monday's report both mention "the Black Friday Vault sends" for this batch. There is **no Vault row in `PROMOS.md`**: no price for the window, no deadline, no checkout. joine4l.com/vault returned no response again on 2026-11-24 (curl status 000). So no email sells the Vault, and Chosen is asked about it.

**QUEUE.** `docs/EMAIL_QUEUE.md` has two rows aimed at the week of Nov 30, both student, and **neither ships:**
- **The course email, Version A (default slot S1):** held for the **fourth week**. Gate unmet: no course sales page URL, and Chosen has not confirmed the "Eight weeks from now" line. Moved to the week of **Dec 7** (slot S2, Wed Dec 9), gate needed by **Tue Dec 1**. That puts two queued rows on the student list that week (possibility #3 on S1), which the queue file's rule 5 allows (raised to two on Oct 31).
- **The course email, Version B (the Cyber Monday close):** held. Gate unmet: the promo never went live (no window, no $500 checkout). The row itself says "If the promo never goes live, B waits for the next promo," and there is no next promo, so it moves to **Unscheduled** and Chosen is asked.
- **No agency row targets this week.** Every slot is the week's own work. The next agency row is Dec 28 (A2, "The fortune is in the follow up").

## ⚠️ Things to settle before this sends

- **Chosen's notes, 2026-11-26 (applied):** all eight subjects swapped to his versions. The GHL first-name merge tag `{{contact.first_name}}` is used as-is in subjects, so the loader pastes it exactly. Three agency previews were rewritten, because the new subjects now say what the old previews said (A1, A2, A3). Bodies untouched.
- **Four sale emails added (Chosen, 2026-11-26):** the E4L Vault last day (A4/S4, **Mon Nov 30 at 2:00 PM PT**, a second send that day, after the 8 AM email) and the book (A5/S5, **Tue Dec 1, 8:00 AM PT**). Facts come from the live pages, read 2026-11-26: Vault $149 Lifetime ("Only 50 Lifetime Passes") and $39 Vault Lite, both one-time, both ending 11:59 PM Pacific on Cyber Monday. The book is $9.95, with **no Black Friday price on the page**, so the book emails sell it as "never on sale" and invent no discount. Live row in `docs/PROMOS.md`.

**1. A1 says "we set it up so every new customer gets that message on time, from your accounts."** That describes what the agency builds for an owner (follow-up texts and emails to past buyers), which e4lagency.com doesn't spell out for past customers in so many words; the site's lines are about inbound replies in under 60 seconds and "your accounts, not ours." **Chosen: confirm we do follow-up to past buyers, or the editor trims that sentence to the call offer only.**

**2. S2 retells the pizza shop on Melrose** as "two people talking, and one of us recognizing what the other needed." That is the story bank's wording turned around a little ("one recognizing what the other knew"). **A real detail from that dinner** (what the shop was getting wrong that he noticed) would make S2 his.

**3. S3 says "I was a pro gamer. I'm the last person who'll tell you to stop playing."** The first half is the story bank; the second is an opinion written in his voice. **Chosen: OK, or cut.**

**4. A-SUN asks owners to reply, and says "I read them."** That leans on the Oct 15 confirmation that someone reads agency replies. If that's no longer true, cut the P.S. line.

**5. The "I'll go first" promise (S2, Oct 21) is still owed, six weeks now.** S-SUN's "what were you hoping would be different by now?" is the natural place for it, but nothing in this batch claims to pay it. See Promises below.

## Angle rotation this week

| | Reader | Angle | Sells |
|---|---|---|---|
| A1 Mon | A-1 · owner with new faces from the long weekend | Worst Way (the second message nobody sends) — **seasonal** | the call |
| A2 Wed | A-1 · owner who's mid-job when the customer reaches out | Correlation (Google's Maps change → their phone at 8pm) | the call |
| A3 Fri | A-3 · great at the business, bad at tools | Paradigm Shift / forgiveness (pile 3) | the call |
| A-SUN | A-2 · busy, profitable, not hearing what callers hear | Miyagi (a two-minute test) | the call |
| S1 Mon | S-A · just found out this exists, being sold to all day | Paradigm Shift → possibility (switch sides) — **seasonal** | the book |
| S2 Wed | S-B · believes Chosen, not yet themselves | Miyagi (you already noticed the dropped job) | the book |
| S3 Fri | S-A · has a job, and has evenings | Lifestyle / Best Way Without (without quitting the job) | the book |
| S-SUN | S-C · tried and failed, doing the year's arithmetic | Paradigm Shift (start with one job, not a year) | the book |

---

# AGENCY SIDE

## A1 — Monday

**Subject:** They'll forget you by January

**Preview text:** Unless you send them one message this week.

**Reader:** A-1 (owner with new faces from the long weekend) · **Angle:** Worst Way (the second message nobody sends) · **Spoke:** front end → the call

```
Hey [First Name],

Who bought from you over the long weekend?

Not the regulars. The new faces.

The woman who grabbed a gift card for her sister.
The guy who finally booked after looking at you for months.
The family that walked in because the place next door was packed.

They liked you enough to pay you.

Here's the part that should sting a little.

Most businesses never contact that customer again.

Not because anything went wrong. Because nobody sent the second message.

By January, you're "that place… what was it called?"

**A customer who never hears from you again didn't leave. They just forgot.**

So this week, send every new customer one message. Three lines:

1. Thanks for coming in.
Use their name.

2. One useful thing.
How to take care of what they bought, or when it's worth coming back.

3. The next step.
"Want me to hold a spot for you in January?"

No discount. No coupon. Just a business that remembered them. 👀

Doing it once, by hand, is easy.

Doing it every week, by hand, falls apart by February, because you're busy doing the actual work.

That's the part we take off your plate.

We set it up so every new customer gets that message on time, and your customer list stays in your accounts, not ours.

Twenty minutes and I'll show you what that looks like for your shop.

👉 Book a call: (LINK: https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call?utm_source=email&utm_medium=agency&utm_campaign=A1-2026-11-30)

Sebastian
Eat 4 Life
AI Marketing Made Easy

P.S. A gift card buyer is two customers. The one who paid, and the one who's going to walk in with it.
```

*Notes:* **The week's one seasonal agency email**, pinned to **Mon Nov 30 (Cyber Monday)**: "over the long weekend" means Thanksgiving weekend, Thu Nov 26 to Sun Nov 29 (calendar arithmetic). `seasons.md`: on the Monday after, owners need "what your follow-up should say to everyone who bought this weekend." It never says "Cyber Monday" or "Black Friday" and sells nothing of ours with a deadline. "Most businesses never contact that customer again" is the writer's opinion about a common habit, said without a number; **editor: don't turn it into a statistic.** The gift card, the booker and the family are illustrations, not real customers. "Hold a spot for you in January" offers nothing that isn't real (no discount, no held price). "Your customer list stays in your accounts, not ours" is e4lagency.com, read 2026-11-24 ("Your customer list, your calls, your numbers live in your accounts, not ours"). **"We set it up so every new customer gets that message on time" needs Chosen's OK (see Things to settle #1).** Emoji: 👀 👉 = two.
*Source:* none external (e4lagency.com, read 2026-11-24).

---

## A2 — Wednesday

**Subject:** Google just gave your customers a text button

**Preview text:** It sits right next to Call. Where does that text go when you're busy?

**Reader:** A-1 (owner who's mid-job when the customer reaches out) · **Angle:** Correlation (Google's change → their phone at 8pm) · **Spoke:** front end → the call

```
Hey [First Name],

Picture the customer who doesn't want to call you.

She's at work. Or it's 9pm. Or she just hates the phone.

She finds you on Google Maps.

And now, right next to the Call button, there's a new one. Message.

That's not me guessing. Google announced it on November 5.

Customers on Android and iPhone "can now find a prominent Message button right next to 'Call' on your Google Maps listing."

Read Google's announcement → (LINK: https://support.google.com/business/thread/476642299?hl=en&utm_source=email&utm_medium=agency&utm_campaign=A2-2026-11-30)

Google even says why it matters to you.

When you're mid-appointment or out on a job, customers get a way to reach you *instead of giving up*.

So here's the uncomfortable question.

When she taps Message, where does it go? 👀

To a phone in your truck? A tablet at the front desk nobody checks after six? Nowhere at all?

A customer who's waiting is a customer who's already opening the next listing.

**The button is free. The answer is the part that costs you.**

Here's the five-minute check, straight from Google's help page:

1. Go to your Business Profile and click Edit profile, then Contact.

2. Next to "Chat," select Edit.

3. Pick Text message, and enter a number that can actually receive texts. Click Save.

One heads-up. Google says chat is only available in select regions, so it might not show up for your profile.

Then text that number yourself at 8pm, and time the reply.

If the honest answer is "first thing in the morning," that's the job our AI Front Desk does.

Every missed call, DM, text and form gets a reply in under 60 seconds, then gets followed up until they book. A named person on our team supervises it.

👉 Book a call: (LINK: https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call?utm_source=email&utm_medium=agency&utm_campaign=A2-2026-11-30)

Sebastian
Eat 4 Life
AI Marketing Made Easy

P.S. If you add both WhatsApp and text, Google only shows customers the text option. Pick the one you actually check.
```

*Notes:* Facts, all read 2026-11-24 at Google's own pages. **The bulletin** (Google Business Profile Community, "Google Small Business Bulletin 🎁 Holiday Checklist & New Features", posted Thu Nov 5, 2026 19:07 UTC by Lisa Landsman, Google): "customers on both Android and iOS can now find a prominent **Message** button right next to "Call" on your Google Maps listing"; "Catches leads when you can't pick up: When you're mid-appointment or on an off-site job, customers have an immediate fallback to reach out… instead of giving up"; tapping Message routes to "WhatsApp and SMS/Text." The email says "Android and iPhone" for "Android and iOS" and quotes the button sentence exactly from "can now find". *instead of giving up* is italicised as Google's phrase. **The help page** (support.google.com/business/answer/15013580, "Chat with customers from your Business Profile", undated, ©2026 Google): steps "Go to your Business Profile. Click Edit profile → Contact. Next to "Chat," select Edit… Select either WhatsApp or Text message… a phone number that can receive text messages. Click Save"; "Chat options are currently available for select regions and might not be available for your Business Profile"; "If you add both options, only the text message option will be shown to customers" (the P.S.); needs a claimed and verified profile. **Editor: keep both quotes and the three steps exact.** The customer at 9pm, the truck and the tablet are illustrations. "A customer who's waiting is… opening the next listing" is opinion. Front Desk lines are e4lagency.com, read 2026-11-24 ("Every missed call, DM, text, and form fill gets a reply in under 60 seconds, then gets followed up until they book"; "Every agent we install has a named human on our team supervising it"). Two links: the bulletin (source) and the call (CTA). Emoji: 👀 👉 = two.
*Source:* https://support.google.com/business/thread/476642299 (Google, posted Nov 5, 2026) · https://support.google.com/business/answer/15013580 (Google Business Profile Help, undated, read 2026-11-24)

---

## A3 — Friday

**Subject:** Check your card statement

**Preview text:** Count the apps you never set up. Then stop feeling bad.

**Reader:** A-3 (great at the business, bad at tools) · **Angle:** Paradigm Shift / forgiveness · **Spoke:** front end → the call

```
Hey [First Name],

Pull up last month's card statement.

Scroll past the gas and the supplies.

Find the software. The monthly ones. $29. $49. $97. $297.

Now sort them into three piles:

1. Use it every week.
2. Use it sometimes.
3. Paid for it, started the setup video, never finished.

Pile 3 is the one nobody talks about. 😅

The scheduling app that was gonna end the phone tag.
The email tool that was gonna bring customers back.
The "all-in-one" that was gonna replace the other five.

They're still billing you. They're just not doing anything.

Here's what I want you to hear.

**That's not a you problem. Most of these tools are built for people whose whole job is the tool.**

You close people face to face every week. You make payroll. You fix what breaks.

Not finishing a setup video says nothing about whether you can run a business. You already run one.

So here's the move this weekend:

Cancel anything in pile 3 you can't explain in one sentence.

Keep the one or two you'd actually miss.

And be honest about the rest. Things are never going to slow down enough for you to set them up. They haven't yet.

You bring the business.

We install what's worth keeping, in your accounts, not ours, and a named person on our team runs it with you.

Twenty minutes and we'll look at what you're already paying for.

👉 Book a call: (LINK: https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call?utm_source=email&utm_medium=agency&utm_campaign=A3-2026-11-30)

Sebastian
Eat 4 Life
AI Marketing Made Easy

P.S. If pile 3 is longer than pile 1, you're not bad at tech. You got sold tools when what you needed was help.
```

*Notes:* No external claim. The four prices are illustrations of common monthly software price points, not quotes of any product; **editor: don't name a product.** "Most of these tools are built for people whose whole job is the tool" is a stance, said as one (`audiences.md`, A-3: "The tools *are* badly designed"). "This weekend" is true on a Friday send (Fri Dec 4). e4lagency.com, read 2026-11-24: "Your customer list, your calls, your numbers live in your accounts, not ours"; "Every agent we install has a named human on our team supervising it." "Runs it with you" is the writer's plain version of that supervision line. Not seasonal: a card statement is there every month. Emoji: 😅 👉 = two.
*Source:* none external (e4lagency.com, read 2026-11-24).

---

## A-SUN — Sunday

**Subject:** Call yourself tonight

**Preview text:** Listen like a stranger would. That's who called you this weekend.

**Reader:** A-2 (busy, profitable, has never heard what callers hear) · **Angle:** Miyagi (a two-minute test) · **Spoke:** front end → the call

```
Hey [First Name],

Quick Sunday one. A two-minute test.

Grab a phone that isn't yours. Your kid's. Your partner's.

Sometime this evening, call your own business.

And listen like a stranger would.

Does it ring out? Is the greeting from three years ago? Is the voicemail box full?

That's what a new customer heard if they called you this weekend. 👀

Sunday's when people finally sit down with the thing they've been putting off.

The roof that leaked again.
The tooth that still hurts.
The car that's been making that noise since October.

My bet: they don't leave a voicemail. They call the next name.

**You don't lose that customer Monday morning. You lose them Sunday night, and you never find out.**

That's what our AI Front Desk is for. Every call, even the 7pm one.

A reply in under 60 seconds, then follow-up until they book. A named person on our team supervises it.

Twenty minutes and I'll show you what your callers would hear instead.

👉 Book a call: (LINK: https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call?utm_source=email&utm_medium=agency&utm_campaign=ASUN-2026-11-30)

Sebastian
Eat 4 Life
AI Marketing Made Easy

P.S. If the test went fine, hit reply and tell me. I read them.
```

*Notes:* Pinned to a Sunday send (Sun Dec 6): "this evening" and "this weekend" are true that day. Not seasonal. "Sunday's when people finally sit down…" is JFSI's Sunday principle said as observation; "My bet: they don't leave a voicemail" is opinion, said as opinion. **Editor: don't add a percentage of callers who hang up.** The greeting, the full box and the three problems are illustrations. e4lagency.com, read 2026-11-24: "Every call, even the 7pm one"; "reply in under 60 seconds, then gets followed up until they book"; "Every agent we install has a named human on our team supervising it." The P.S. leans on the standing commitment that someone reads agency replies (confirmed Oct 15). Emoji: 👀 👉 = two.
*Source:* none external (e4lagency.com, read 2026-11-24).

---

# STUDENT SIDE

## S1 — Monday

**Subject:** {{contact.first_name}}, I'll skip the BS. Switch sides.

**Preview text:** Every one of those ads, somebody got paid to make.

**Reader:** S-A (just found out this exists, being sold to all day) · **Angle:** Paradigm Shift → possibility · **Spoke:** front end → the book

```
Yo [First Name],

It's Cyber Monday.

Adobe forecast that people in the US would spend over $15 billion online on this one day.

See Adobe's forecast → (LINK: https://news.adobe.com/news/2026/09/adobe-us-holiday-shopping-season-to-hit-record?utm_source=email&utm_medium=student&utm_campaign=S1-2026-11-30)

Your inbox is the proof. Your feed too. 👀

Now flip it around.

Every one of those ads came from somewhere.

Somebody wrote the email. Somebody made the picture. Somebody got paid for it.

The big brands have whole teams for that.

The bakery down your street doesn't. Neither does your barber. Or the nail shop by the gas station.

Here's what you can do this week, from your phone.

Open ChatGPT and type this:

"Make a bold holiday promo image for a local bakery called Sugar Block. Text on the image: GIFT BOXES FOR THE HOLIDAYS. Warm lights, cozy vibe."

In under a minute, you're holding a promo a small shop would actually post. 🤯

Swap in a real shop near you. Then DM it to them.

"Made this for you. It's free. Want one every week in December?"

**That's how you switch sides. You stop being the person getting sold to, and become the person businesses pay.**

And businesses do pay. Our agency's creative packs start at **$750**.

That's ONE client. 💼

My first client was a pizza shop on Melrose. No pitch deck. No portfolio. A conversation over dinner.

The book is the plan. Which job to pick. How to find the one business that needs it. How to get paid for it inside 90 days.

👉 Get From Xbox to Executive: (LINK: https://joineat4life.com/xboxtoexec?utm_source=email&utm_medium=student&utm_campaign=S1-2026-11-30)

Holla Back – Get ya Dolla Back. ✊🏾
Sebastian
Eat 4 Life

P.S. Next Cyber Monday, I want you on the other side of the screen.
```

*Notes:* **The week's one seasonal student email**, pinned to **Mon Nov 30, Cyber Monday** ("It's Cyber Monday" is true only that day; Cyber Monday 2026 = the Monday after Thanksgiving Thu Nov 26, calendar arithmetic). Subject is about the reader's next move, not Chosen or a tool (Chosen, Nov 22; Monday's report). **Adobe**, news.adobe.com, Sept 28, 2026, "Adobe: U.S. Holiday Shopping Season to Hit Record $275.1 Billion Online, Rising 6.7% YoY": Cyber Monday forecast "with consumers spending over $15 billion online in a single day ($15.1 billion, up 6.2% YoY)." The email says **forecast**, because it is one. **Editor: don't change "forecast" to "spent"; if Adobe publishes actuals before Friday's check, the forecast line is still true as written.** News sits in the body as garnish, never the subject. **Price:** e4lagency.com, read 2026-11-24: Creative Packs "from $750", one-time ("Fuel for a campaign or a launch"). It's what a business pays E4L, not what the reader will earn; "That's ONE client" is the possibility-series line Chosen approved Oct 31. **No income claim; editor, keep it that way** (`possibility.md` walls). "Under a minute" is the possibility series' loose claim for ChatGPT image generation, already in use; don't tighten it to "seconds". "Sugar Block" is an invented example name inside a prompt, not a real business. No offer of ours, no deadline, no "Happy". The pizza shop on Melrose is the story bank. "Get paid for it inside 90 days" is the book's 90-day plan, as worded in S-SUN on Nov 29. Emoji: 👀 🤯 💼 👉 ✊🏾 = five.
*Source:* https://news.adobe.com/news/2026/09/adobe-us-holiday-shopping-season-to-hit-record (Adobe, Sept 28, 2026) · e4lagency.com (read 2026-11-24)

---

## S2 — Wednesday

**Subject:** I know what your barber's doing wrong

**Preview text:** You've been the customer your whole life. That was the training.

**Reader:** S-B (believes Chosen, doesn't yet believe themselves) · **Angle:** Miyagi (you already noticed the dropped job) · **Spoke:** front end → the book

```
Yo [First Name],

Think about a place you go every month. Your barber. The taco spot. The gym.

Now answer fast.

What drives you crazy about it?

You DM'd them and nobody answered for three days.
Their website still says "summer hours."
You'd book every two weeks if they'd just send you a reminder.

You came up with that in about five seconds. 👀

That's not complaining.

That's a business consult you've been giving away for free.

**You don't need to be a business expert. You need to notice what a business keeps dropping.**

And you've been the customer your whole life. That was the training. 🎮

In From Xbox to Executive I break it down like this.

Every business needs five jobs handled: getting attention, turning attention into conversations, closing, delivering, and keeping people happy.

Most are running two.

Those three things you just noticed? Every one is a dropped job.

The DM nobody answered: conversations.
The dusty website: attention.
The reminder that never came: keeping people happy.

And AI turns each of those into something one person can fix from a phone. 📱

My first client was a pizza shop on Melrose. It started as a conversation over dinner.

Two people talking, and one of us recognizing what the other needed. 🍕

Your move this week: pick ONE of those three things. Just one.

Then ask yourself, "Could I fix that?"

The book shows you what comes next.

👉 Get From Xbox to Executive: (LINK: https://joineat4life.com/xboxtoexec?utm_source=email&utm_medium=student&utm_campaign=S2-2026-11-30)

Holla Back – Get ya Dolla Back. ✊🏾
Sebastian
Eat 4 Life

P.S. I got a question: what's the one thing your barber keeps getting wrong? Reply and tell me.
```

*Notes:* Not seasonal. Subject is about the reader (their barber, their eye), not Chosen or a tool. No external claim. The three complaints are illustrations, not a real shop. The five jobs are translated, never Damage/Support/Tank; "Most are running two" is the story bank. "AI turns each of those into something one person can fix from a phone" echoes Chosen's own "AI covers the parts that used to take a whole staff" (`voice.md`). The pizza shop line is the story bank, slightly turned ("one recognizing what the other knew" → "what the other needed"); **see Things to settle #2.** No income claim, no price. Emoji: 👀 🎮 📱 🍕 👉 ✊🏾 = six.
*Source:* Chosen's story bank (`references/voice.md`).

---

## S3 — Friday

**Subject:** {{contact.first_name}}, what are you doing tonight?

**Preview text:** Your job owns the day. The night is still yours.

**Reader:** S-A (has a job, and has evenings) · **Angle:** Lifestyle / Best Way Without (without quitting the job) · **Spoke:** front end → the book

```
Yo [First Name],

Real question.

Your job owns 9 to 5. Maybe more.

But 7pm to midnight? That's still yours.

And you know what usually happens to it. You get home. You eat. You scroll. You queue up "one game."

Next thing you know it's 1am. 🎮

I was a pro gamer. I'm the last person who'll tell you to stop playing.

But here's the math nobody does.

One hour a night. Five nights a week. By the end of February, that's about 60 hours.

You've put 60 hours into a game without blinking.

Put 60 hours into ONE skill and you're not a beginner anymore. ⏰

**You don't have to quit your job. You have to take back one hour of your night.**

And that hour goes further than it used to.

You're not a single hero anymore. ❌
You're a whole team in one chair. ✅

A promo image for a shop. A week of their posts. A one-page website. One person, one laptop, one hour.

The person who loads our emails every week lives twelve hours ahead of me. Different side of the planet. Same team.

That's what the other side of that hour looks like.

The book shows you which skill to spend it on, and the 90-day plan to get paid for it.

👉 Get From Xbox to Executive: (LINK: https://joineat4life.com/xboxtoexec?utm_source=email&utm_medium=student&utm_campaign=S3-2026-11-30)

Holla Back – Get ya Dolla Back. ✊🏾
Sebastian
Eat 4 Life

P.S. Keep the game. Just play it after the hour. 😂
```

*Notes:* Not seasonal. Subject is about the reader's time. **Arithmetic:** Fri Dec 4 to Sun Feb 28, 2027 is 12 weeks and 2 days; 5 hours a week × ~12 weeks = ~60 hours ("about 60"). "Put 60 hours into ONE skill and you're not a beginner anymore" is opinion, not a promise of income. "I was a pro gamer" is the story bank; "I'm the last person who'll tell you to stop playing" is a line in his voice that **needs his OK (Things to settle #3).** The ❌/✅ pair is Chosen's own book line from the gold standard (`voice.md`); **editor: keep it exact.** The three things you can make are the possibility series' modest tool claims (image, posts, one-page site). "The person who loads our emails… twelve hours ahead of me" is from the possibility series' story-bank facts, approved by Chosen Oct 31. No price, no income claim. Emoji: 🎮 ⏰ ❌ ✅ 👉 ✊🏾 😂 = seven.
*Source:* Chosen's story bank and own words (`references/voice.md`; `docs/emails/STUDENT_POSSIBILITY_SERIES.md`).

---

## S-SUN — Sunday

**Subject:** Hi, do you remember last December?

**Preview text:** Not a resolution. One job, one business, and a year that's going by anyway.

**Reader:** S-C (tried and failed, doing the year's arithmetic) · **Angle:** Paradigm Shift (start with one job, not a year) · **Spoke:** front end → the book

```
Yo [First Name],

Sunday thought.

Go back exactly one year. December 2025.

What were you hoping would be different by now? 👀

If the honest answer is "most of it," you're not behind.

You just never got a plan that started small enough.

Here's the thing about a year. It goes by whether you start or not. ⏳

So don't start with a year.

Start with one job.

Every business needs five things handled. Pick ONE. Find ONE business that keeps dropping it. Get paid for it inside 90 days. 🎯

That's not a resolution. Resolutions wait for January, and most of them are gone before the snow is.

This one starts on a Sunday in December.

**Next December, you're either a year down the road, or a year older with the same plan.**

The book is the road. One skill, one client, 90 days.

👉 Get From Xbox to Executive: (LINK: https://joineat4life.com/xboxtoexec?utm_source=email&utm_medium=student&utm_campaign=SSUN-2026-11-30)

Holla Back – Get ya Dolla Back. ✊🏾
Sebastian
Eat 4 Life

P.S. Write down one thing you want to be true next December. Put it somewhere you'll see it every Sunday.
```

*Notes:* Pinned to a Sunday send (Sun Dec 6). "This one starts on a Sunday in December" is true that day. Not a holiday email: it leans on the calendar (`seasons.md`, December: "'this time next year' is the whole hook"), not on Christmas or New Year's. "Most of them are gone before the snow is" is a line, not a statistic; **editor: don't add a resolution-quitting percentage** (no primary source on file). Five jobs and "one skill, one client, 90 days" are the book's plan (story bank). No price, no deadline, no income claim. Emoji: 👀 ⏳ 🎯 👉 ✊🏾 = five.
*Source:* Chosen's story bank (`references/voice.md`).

---

# Bench — swaps, not scheduled

## A4 — Monday 2:00 PM

**Subject:** {{contact.first_name}}, this is gone at midnight

**Preview text:** Your whole marketing department, in 100 prompts. $149 for life, until 11:59 PM Pacific.

**Reader:** A-1 (owner doing every marketing job alone) · **Angle:** Worst Way → last day of a live promo · **Spoke:** promo → the E4L Vault

```
Hey [First Name],

Quick one. The clock's running.

At 11:59 PM Pacific tonight, the E4L Vault's one-time prices
disappear.

Think about how you've been doing marketing all year.

Answering the same "how much?" text at 9pm. Staring at a blank
post on a Tuesday. Writing an offer from scratch, again. Paying
for ads you're not sure are working. Watching a missed call turn
into a customer for the guy down the street.

That's the slow, expensive, exhausting, do-it-all-yourself way.

The Vault is 100 ready-to-use AI prompts that hand that work to
the machine. Five rooms. A whole marketing department:

- Email and text: the missed call gets a text back before they call somebody else.
- Offers and sales: build your offer, price it three ways, and answer the 10 objections you hear most.
- Content: a 30-day calendar and posts in your own voice, so your page never goes dark.
- Analytics: find where money is leaking and the one fix that matters this month.
- Ads: write the ad, test it on $10 a day, and know what to judge after 7 days.

Two ways in. Both one payment. **Both gone at 11:59 PM Pacific
tonight.**

**$149, for life.** All 100 prompts, the 50 Ad Hooks pack, and
every new skill, system and workflow we add, the day it ships.
Only 50 Lifetime Passes exist.

$39, Vault Lite. All 100 prompts and the 50 Ad Hooks pack.
Nothing recurring.

Tomorrow morning you'll have the same phone, the same inbox and
the same blank Tuesday post. The only question is whether you
face them alone or with a department behind you.

Prompts are tools, not magic. You still run the business. You
just stop running the marketing by yourself. 🔥

👉 Open the Vault: (LINK: https://joineat4life.com/vault?utm_source=email&utm_medium=agency&utm_campaign=A4-2026-11-30)

Sebastian
Eat 4 Life
AI Marketing Made Easy

P.S. Already know you want lifetime? Here's the direct door. Only 50, and none after midnight: (LINK: https://joineat4life.com/lifetime-checkout?utm_source=email&utm_medium=agency&utm_campaign=A4-2026-11-30)
```

*Notes:* **Live promo, last day** (`docs/PROMOS.md`, Vault row). Chosen, 2026-11-26: "Sell the WHOLE Vault and what it does for the business… adjective-filled and knife-turning… Monday framed as the last day." Every product claim is from joineat4life.com/vault, read 2026-11-26: "$149 once for life"; "Only 50 Lifetime Passes"; "$39 once", "One payment. Nothing recurring."; Lifetime includes "All 100 prompts across all five rooms", "The 50 Ad Hooks pack", "Every new skill, system and workflow we drop, the day it ships"; Lite has no new skills; the five rooms are summarized in plain words from the page's own descriptions; the deadline is "Gone at 11:59 PM Pacific on Cyber Monday" (Mon Nov 30). **The page says "Only 50 Lifetime Passes," not "first 50 buyers," and we have no count of how many are left, so the email never says "almost gone."** "Prompts are tools, not magic" echoes the page footer ("Prompts are tools, not guarantees"). No result promised. Jargon translated for owners ("speed-to-lead" became "the missed call gets a text back"; "funnel leaks" became "where money is leaking"). **Sends at 2:00 PM PT, the second agency send that day.** Emoji: 🔥 👉 = two.
*Source:* https://joineat4life.com/vault (read 2026-11-26)

---

## A5 — Tuesday

**Subject:** {{contact.first_name}}, it was never on sale

**Preview text:** The book behind all of this is $9.95. Every day.

**Reader:** A-1 (owner tired of countdown timers) · **Angle:** Paradigm Shift (the anti-sale) · **Spoke:** front end → the book

```
Hey [First Name],

Your inbox spent the last five days screaming LAST CHANCE.

This isn't one of those.

My book, From Xbox to Executive, wasn't on sale for Black Friday.
It's $9.95. It was $9.95 last week, and it'll be $9.95 next week.

So why should an owner read a book with "Xbox" in the title?

Because every business on earth needs five jobs handled: getting
attention, turning attention into conversations, closing,
delivering, and keeping people happy.

Most businesses are doing two of them well. The other three leak
money quietly, every single week.

**The book walks you through all five**, so you can see which one
your business is dropping, and how one person with AI doing the
heavy lifting covers what used to take a whole team.

Read it in an evening. Rather listen in the truck? The audiobook
is an add-on for another $9.95.

👉 Get From Xbox to Executive: (LINK: https://joineat4life.com/?utm_source=email&utm_medium=agency&utm_campaign=A5-2026-11-30)

Sebastian
Eat 4 Life
AI Marketing Made Easy

P.S. No countdown timer. No "only 3 left." Just a $9.95 book that might show you the one job your business keeps skipping. 📘
```

*Notes:* Chosen, 2026-11-26, asked for "a Black Friday email for each list pushing the book… Check the live page for any Black Friday price before you write the offer." **The live page (joineat4life.com, read 2026-11-26) shows no Black Friday or sale price:** "Get your eBook for just $9.95"; "YES add the Audiobook +$9.95"; no struck-through price, no deadline. So this sells the book honestly as never on sale, and **sends Tuesday after the sale weekend**, not into the Cyber Monday noise. **This also settles the old book-price question: $9.95 ebook, +$9.95 audiobook, not "free + $9.95 shipping."** The five jobs are the book's five roles, translated per `voice.md`. "AI doing the heavy lifting… what used to take a whole team" is the book's line as quoted in the student gold standard. "Most businesses are doing two of them well" is Chosen's opinion (it's in the course email too). The agency CTA is normally the call; this one is the book because Chosen asked for it. Emoji: 👉 📘 = two.
*Source:* https://joineat4life.com (read 2026-11-26)

---

## S4 — Monday 2:00 PM

**Subject:** {{contact.first_name}}, midnight. Then it's gone.

**Preview text:** 100 AI prompts that do the work businesses pay for. $149 for life or $39 once.

**Reader:** S-B (wants in, needs the tools) · **Angle:** last day of a live promo · **Spoke:** promo → the E4L Vault

```
Yo [First Name],

You know that feeling when the shop rotates at midnight and the
skin you wanted is gone for good?

That's tonight. 🎮

At 11:59 PM Pacific, the E4L Vault's one-time prices disappear.

Here's what you'd be walking away from. 100 AI prompts that do the
exact work businesses pay somebody to do, in five rooms:

- Email and text: the text-back that catches a missed call before the customer calls somebody else.
- Offers and sales: build an offer, price it three ways, handle the 10 objections you'll hear most.
- Content: a 30-day calendar and posts in a brand's own voice.
- Analytics: find where a business is leaking money and the one move that matters.
- Ads: write the ad, test it on $10 a day, know what to judge after 7 days.

Read that list again. That's not a course you watch. That's a
whole marketing department, sitting in your pocket. 💰

And the Lifetime Pass says it straight: use it on your business
and your clients' work.

So picture it. One laptop. A coffee shop in a different city. You
running a barbershop's texts and a taco truck's posts off prompts
you already own. ✈️

Two ways in. Both one payment.

**$149, for life.** All 100 prompts, the 50 Ad Hooks pack, and
every new skill, system and workflow, the day it drops. Only 50
Lifetime Passes exist.

$39, Vault Lite. All 100 prompts plus the 50 Ad Hooks pack.
Nothing recurring.

**After midnight, both prices are gone.**

Everybody else spent Black Friday buying stuff that loses value
the second it ships. This is the one thing in your cart that works
for you.

Prompts are tools, not a shortcut to a paycheck. You still have to
show up. But you won't be showing up empty-handed.

I believe you're going to use this.

👉 Open the Vault: (LINK: https://joineat4life.com/vault?utm_source=email&utm_medium=student&utm_campaign=S4-2026-11-30)

Holla Back – Get ya Dolla Back. ✊🏾
Sebastian
Eat 4 Life

P.S. Know you want lifetime? Straight to checkout. Only 50, and none after midnight: (LINK: https://joineat4life.com/lifetime-checkout?utm_source=email&utm_medium=student&utm_campaign=S4-2026-11-30)
```

*Notes:* **Live promo, last day** (`docs/PROMOS.md`, Vault row). Same page facts as A4 (joineat4life.com/vault, read 2026-11-26), including "Use it on your business and your clients' work" (Lifetime), quoted. **No income claim to the reader:** "the exact work businesses pay somebody to do" describes the work, not what the reader will earn, and "Prompts are tools, not a shortcut to a paycheck" keeps it honest (the page says "Prompts are tools, not guarantees"). "Picture it" is an invitation, not a promise. No "almost gone": the page gives no count. The subject is about the reader's deadline, per the Nov 22 reader-first rule. **Sends at 2:00 PM PT, the second student send that day.** Per the Readers-list rule's exception, sale emails go to the **whole** student list. Emoji: 🎮 💰 ✈️ 👉 ✊🏾.
*Source:* https://joineat4life.com/vault (read 2026-11-26)

---

## S5 — Tuesday

**Subject:** {{contact.first_name}}, missed every Black Friday deal?

**Preview text:** Good. The one that matters is still $9.95.

**Reader:** S-A (just found out this is possible) · **Angle:** Paradigm Shift (the anti-sale) · **Spoke:** front end → the book

```
Yo [First Name],

If you spent the weekend watching deals expire, I've got good news.

The one that matters didn't.

From Xbox to Executive is $9.95. It wasn't marked down for Black
Friday, because it never needed to be. That's the price of a
burrito. 🌯

Here's what's inside for you:

- How to pick ONE skill from the five jobs every business needs, starting with what you're already good at.
- How the first client usually starts. Mine was a pizza shop on Melrose, over dinner.
- How AI turns one person into a whole team, so "I don't know anybody" and "I don't have experience" stop being reasons.

**The book shows you how to pick ONE skill and get paid for it
inside 90 days.**

Rather listen on the bus? Add the audiobook for another $9.95. 🎧

You've grinded harder for a skin than this book will ever ask of
you. 🎮

I believe this is the cheapest step you'll ever take toward the
life you keep picturing.

👉 Get From Xbox to Executive: (LINK: https://joineat4life.com/?utm_source=email&utm_medium=student&utm_campaign=S5-2026-11-30)

Holla Back – Get ya Dolla Back. ✊🏾
Sebastian
Eat 4 Life

P.S. I got a question: what's the ONE skill you'd pick if you started tonight? Hit reply. I read these.
```

*Notes:* Chosen, 2026-11-26: a Black Friday book email for the student list. **The live page has no Black Friday price** ($9.95 ebook, +$9.95 audiobook, read 2026-11-26), so it runs on the honest "never needed a sale" angle, **Tuesday after the sale weekend**. "The price of a burrito" is a comparison. The pizza shop on Melrose is in the story bank (X2E). The five jobs and "AI turns one person into a whole team" are book material on file (`voice.md` gold standard). "Pick ONE skill and get paid for it inside 90 days" is the book's own promise, as used before. The subject is about the reader, per the Nov 22 rule. Emoji: 🌯 🎧 🎮 👉 ✊🏾.
*Source:* https://joineat4life.com (read 2026-11-26)

---

### B1 — agency, the gift card

**Subject:** Somebody tried to buy you as a gift. They got a candle.

**Preview text:** You never even knew that sale existed.

**Reader:** A-1 (service business that doesn't push gift cards) · **Angle:** Worst Way (the sale that walked) · **Spoke:** front end → the call

```
Hey [First Name],

Somebody wanted to give you as a gift this year.

A daughter who wanted to book her mom a massage.
A guy who wanted his brother's truck detailed.
A wife who wanted to cover the dog's grooming for a year.

They looked you up.

And they couldn't find a way to buy it.

So they bought a candle. 🕯️

You never knew that sale existed.

**A gift card is two customers. The one who pays, and the one who walks in with it.**

And the second one is somebody who might never have found you on their own.

So this week, put "Gift cards available" in three places:

1. The top of your website.

2. A post on your Google Business Profile.

3. Every receipt and "thanks for coming in" text you send in December.

That's it. No discount needed.

Then make sure that when the gift card person walks in, you get their name and number, so they're not a one-time visit.

That second part is where we come in. Twenty minutes and I'll show you how.

👉 Book a call: (LINK: https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call?utm_source=email&utm_medium=agency&utm_campaign=B1-2026-11-30)

Sebastian
Eat 4 Life
AI Marketing Made Easy

P.S. If you already sell them, check your website on your phone. Can you find the gift card in under ten seconds?
```

*Notes:* **Seasonal**, so it can only replace **A1** (the week's one seasonal agency email), never A2, A3 or A-SUN. No external claim. The three would-be gift buyers and the candle are illustrations. "A gift card is two customers" repeats A1's P.S. on purpose; if B1 replaces A1, the line appears once. Google Posts exist on Business Profiles (Google's Nov 5 bulletin: "Publish seasonal specials or event announcements with Google Posts"). No offer of ours, no deadline. Emoji: 🕯️ 👉 = two.
*Source:* https://support.google.com/business/thread/476642299 (Google, Nov 5, 2026), for Google Posts only.

---

### B2 — student, the followers

**Subject:** You don't need followers to get paid

**Preview text:** Zero followers. One business. That's enough to start.

**Reader:** S-A (thinks you need an audience first) · **Angle:** Best Way Without (without the following) · **Spoke:** front end → the book

```
Yo [First Name],

Quick one.

Somewhere along the way you got told you need an audience first.

10K followers. A brand. A face for the camera.

Then, maybe, somebody pays you. 😮‍💨

That's backwards.

The barber down your street doesn't care how many followers you have.

He cares whether his chairs are full on Tuesday.

**Businesses don't pay for your following. They pay for their problem going away.**

The DM nobody answers. The posts nobody makes. The customers who never come back.

You can fix one of those with zero followers and a phone. 📱

My first client was a pizza shop on Melrose. I didn't pitch them a follower count. It was a conversation over dinner. 🍕

Followers are nice. They're just not the door.

One business is the door. 🚪

The book shows you which job to pick, and how to find the one business that needs it.

👉 Get From Xbox to Executive: (LINK: https://joineat4life.com/xboxtoexec?utm_source=email&utm_medium=student&utm_campaign=B2-2026-11-30)

Holla Back – Get ya Dolla Back. ✊🏾
Sebastian
Eat 4 Life

P.S. I got a question: if you had zero followers forever, what would you still want to get paid for?
```

*Notes:* Not seasonal, so it can replace any student slot. No external claim. "The barber doesn't care how many followers you have" is opinion. Pizza shop on Melrose: story bank ("no pitch deck… a conversation over dinner"). No price, no income claim. Emoji: 😮‍💨 📱 🍕 🚪 👉 ✊🏾 = six.
*Source:* Chosen's story bank (`references/voice.md`).

---

## Monday report follow-through

The Nov 23 report's "Change this week" said: *every student subject in the Nov 30 batch (Black Friday Vault sends included) leads with the reader's money, time or job — no subject that opens with "I" or names a tool.* How the batch acted on it:
- **All four student subjects (and the bench) lead with the reader**, none opens with "I", none names a tool: S1 "Everybody's selling to you this week. Want to switch sides?" (their money and next move), S2 "You already know what your barber is doing wrong" (their eye), S3 "What are you doing with 7pm to midnight?" (their time), S-SUN "Last December, what were you hoping would change?" (their year; editor rewrite), B2 "You don't need followers to get paid" (their money).
- **Tools and Chosen's story moved inside the emails.** ChatGPT appears only inside S1's body; the pizza shop and the pro-gaming past sit mid-email.
- **"Black Friday Vault sends included":** there are none to include. No Vault row exists in `PROMOS.md` and joine4l.com/vault doesn't respond (see PROMO). Asked Chosen.
- **Agency:** unchanged from Chosen's Nov 6 direction. All four talk about the owner's new customers, texts, card statement and Sunday calls. "We" appears only after the owner's problem is made.

## Promises

`PROMISES_OWED.md`: the Oct 21 "I'll go first next time" ("What's the last thing you finished?") is **still unpaid, six weeks past due.** Only Chosen can pay it with a true thing he finished. S-SUN ("What were you hoping would be different by now?") would carry it naturally as a P.S.; the writer did not invent his answer. Nothing new is promised in this batch: S2's P.S. asks for a reply but promises nothing back.

## Sources not used, and why

- **Adobe's Black Friday and Cyber Week actuals.** Not published at the source by Nov 24 (Black Friday is Nov 27). S1 uses the Sept 28 forecast and says "forecast."
- **Adobe's season total ($275.1B) and mobile share (63%).** True at the source, but one number is enough; S1 uses the Cyber Monday figure because it's the send day.
- **Search Engine Roundtable, Relevant Audience and TechRadar write-ups of the Maps Message button.** Secondary. Google's own bulletin and help page were read and used instead.
- **"Business Profile in Gemini" (same Google bulletin).** The bulletin says Workspace access is "rolling out now" while a secondary source reported the help page still excluded work accounts on Nov 7. Conflicting, so left out.
- **Any "percentage of customers who never come back" or "callers who hang up on voicemail" figure.** None read at a primary source, so A1 and A-SUN state these as opinion without a number.
- **"8% course completion" (`audiences.md`).** Still no primary source on file.
- **E4L Vault (joine4l.com/vault).** No `PROMOS.md` row, page not responding on 2026-11-24. Not sold.
- **Drip client screenshot ($14,960).** True and on file, but it ran on both lists in the week of Nov 16 (agency A1, student S-SUN Nov 22). Resting it a few weeks.

## Friday freshness check

To run Fri 2026-12-04 (send dates Nov 30 / Dec 2 / Dec 4 / Dec 6). **Note: A1 and S1 send Mon Nov 30, before Friday's check runs. Abdullah loads them on Fri Nov 27; whoever runs that load should re-read the two lines below for A1 and S1.** Re-fetch every Source line at the primary page.

| Email | Source | What to confirm |
|---|---|---|
| A2 | support.google.com/business/thread/476642299 | "can now find a prominent Message button right next to "Call" on your Google Maps listing"; "instead of giving up"; posted Nov 5. |
| A2 | support.google.com/business/answer/15013580 | Steps still Edit profile → Contact → Chat → Edit → Text message → Save; "select regions" caveat; "only the text message option will be shown" if both added. |
| S1 | news.adobe.com/news/2026/09/adobe-us-holiday-shopping-season-to-hit-record | Cyber Monday "over $15 billion online in a single day" still on the page. The email says "forecast", so published actuals don't make it false. |
| A1, A2, A3, A-SUN, S1 | e4lagency.com | "reply in under 60 seconds, then gets followed up until they book", "Every call, even the 7pm one", named human supervising, "your accounts, not ours", Creative Packs "from $750" unchanged. |
| Book link | joineat4life.com/xboxtoexec | Loads (200 on 2026-11-24). No email states a book price. |
| Booking link | api.leadconnectorhq.com/widget/bookings/cs-game-plan-call | 200 on 2026-11-24 (JS widget); test-send click-through confirms. |
| PROMOS | `docs/PROMOS.md` | Nothing to swap in. The Black Friday / Cyber Monday window has passed. |

**Relative dates on the send day:** A1 "over the long weekend" and S1 "It's Cyber Monday" are true only on Mon Nov 30. A3 "this weekend" means Sat–Sun Dec 5–6 (Fri send). S3 "by the end of February" is counted from Fri Dec 4. A-SUN "this evening", "this weekend" and S-SUN "a Sunday in December" are pinned to Sun Dec 6. No deadline anywhere.

### Done Fri 2026-11-27 (Black Friday), for sends Mon Nov 30 to Sun Dec 6

**Approval state at the time of the check:** no `APPROVED.txt`, no `DISTRIBUTED.txt`, and no GO from Chosen in the Slack DM after the last GO request (Fri Nov 27 02:35 CAT). The copy was **not** sent to Abdullah or Daniel; Chosen was told the batch is waiting on his GO.

**Every link loaded (HTTP 200, 2026-11-27):** the booking widget `api.leadconnectorhq.com/widget/bookings/cs-game-plan-call`, Google's bulletin thread 476642299, Google help answer 15013580, the Adobe release, `joineat4life.com/xboxtoexec`, `joineat4life.com/`, `joineat4life.com/vault`, `joineat4life.com/lifetime-checkout` and `e4lagency.com`. Every link in the twelve scheduled HTML files is one of these (plus `{{unsubscribe_url}}`).

| Email | Re-checked at the source | Result |
|---|---|---|
| A2 | Google bulletin: "customers on both Android and iOS can now find a prominent Message button right next to "Call" on your Google Maps listing"; "…instead of giving up"; author Lisa Landsman | Still on the page, word for word. |
| A2 | Help page 15013580: Edit profile → Contact → Chat → Edit → WhatsApp or Text message → Save; "select regions" caveat; "only the text message option will be shown" | Unchanged. |
| S1 | Adobe, Sept 28, 2026: Cyber Monday (Nov. 30) "consumers spending over $15 billion…", $15.1B, +6.2% | Unchanged. Email says "forecast", so it stays true on Mon Nov 30. |
| A1, A2, A3, A-SUN, S1 | e4lagency.com: reply in under 60 seconds then followed up until they book; "Every call, even the 7pm one"; named human supervising; "your accounts, not ours"; Creative Packs "from $750" | All five present, verbatim. |
| A4, S4 | joineat4life.com/vault: $149 once for life, $39 Lite, "Only 50 Lifetime Passes", Lifetime = 100 prompts + 50 Ad Hooks + every new skill the day it ships, Lite excludes new skills, "Use it on your business and your clients' work", five rooms, "Prompts are tools, not guarantees", deadline "Gone at 11:59 PM Pacific on Cyber Monday" | All unchanged. No sold-out or remaining-count language, so the emails' "never says almost gone" still holds. Deadline is after the 2:00 PM PT Monday send, so the emails are alive. |
| A4, S4 P.S. | joineat4life.com/lifetime-checkout | Loads, shows the $149 Lifetime Pass and the same Cyber Monday deadline. |
| A5, S5 | joineat4life.com: "Get your eBook for just $9.95", "YES add the Audiobook +$9.95", **no Black Friday / sale / struck-through price on Black Friday itself** | "It was never on sale" / "It wasn't marked down for Black Friday" are still true. If a book sale is added before Tue Dec 1, A5 and S5 become false and must be pulled. |
| S1, S2, S3, S-SUN, B2 | joineat4life.com/xboxtoexec: From Xbox to Executive, $9.95 | Loads. |

**Relative dates, read on each send date:** A1 "over the long weekend" and S1 "It's Cyber Monday" are right on Mon Nov 30. A4/S4 "tonight… 11:59 PM Pacific" are right on Mon Nov 30 at 2 PM PT. A5 "the last five days" (Thu Nov 26 to Mon Nov 30) and S5 "the weekend" are right on Tue Dec 1. A2 "Google announced it on November 5" is a fixed date, so it reads right on Wed Dec 2; the subject's "just" is Chosen's own wording, left as is. A3 "this weekend" (Dec 5–6), S3 "by the end of February", A-SUN "this evening" and S-SUN "a Sunday in December" all hold on their days.

**Deadlines:** the only deadline in the batch is the Vault's, 11:59 PM PT Mon Nov 30, after its send. Nothing has died. No bench swap.

**Changed:** nothing in the copy. This section only.
