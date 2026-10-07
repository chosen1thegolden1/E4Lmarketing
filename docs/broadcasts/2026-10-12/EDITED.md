# Editor pass — week of Oct 12, 2026

Batch arrived by the repo (`docs/BROADCAST_WEEK_2026-10-12.md`, commit 6a2c7f5). No handoff artifact needed.

## What the edit changed
- **Emoji counts.** S3, S-SUN and B1 were one short of the student four. Added 🎯 (S3), 💰 (S-SUN), 🛠️ (B1). Agency emails already at 2–3, none in an opening sentence, 👉 on every CTA.
- **S1 list.** Numbered steps now have blank lines between them.
- Bold (1–2 each), italics (0–1 each), the four structural blank lines and paragraph length were already in range. Nothing else touched. No fact, number, story, URL, UTM or greeting changed.

## Subjects rewritten (read aloud, "headline on a news site" test)
- **A2** "Stop wiring things together" → **"Your Zapier account is a monument"**. Lifted from the email's own line; a person talking, not an instruction.
- **S1** "Four out of five businesses haven't started" → **"The barbershop isn't lazy. It's busy."** The stat was a headline. Preview now adds the beat instead of restating: "Four in five businesses haven't started on AI. Here's tonight's side quest."
- **B1** (bench) "Business owners are getting free AI classes" → **"Somebody's teaching your future clients AI for free"**.
- **B2** (bench) "Over half of the businesses using AI aim it at marketing" → **"Everybody points the AI at the same department"**.

Kept: A1 "Nobody is hiring. Good.", A3 "A robot is going to call your shop", A-SUN, S2, S3, S-SUN — all already sound like a person.

## Flagged, not fixed
1. **A1 subject says "Nobody is hiring"** while the body says the country added 29,000 jobs. It's hyperbole in Chosen's voice, but it is looser than the body. Your call.
2. **S-SUN needs a true line from Chosen.** The "showing up for the small thing" line is a paraphrase; confirm it sounds like him.
3. **A3 is not fresh news** (Google, July 2025). B2 is the swap if he wants only new.
4. **A2, S3, B1 cite Anthropic, which makes Claude.** Vendor numbers, labelled as such in the copy. Swap if it reads as endorsement.
5. **A1 and S2 link the BLS release page**, which gets replaced by the October release after Nov 1. Fine for this week; Friday's check should confirm.
6. **Monday-report proposals** at the bottom of the batch file need Chosen's confirmation ("I found out the hard way" is invented).

## Build
`node scripts/build-emails.js docs/BROADCAST_WEEK_2026-10-12.md` passes (10 emails, 8 scheduled).

---

# Revision — Oct 7, after Chosen's notes

- **A1 contradiction fixed.** Subject was "Nobody is hiring. Good." against a body saying the country added 29,000 jobs. Now **"29,000 jobs. In the whole country."** with preview "Everybody's freezing hiring. Here's what that gets wrong." Body line "Nobody can hire their way to the next 20%" softened to "Hiring your way to the next 20% is a long shot right now."
- **A2 replaced.** The Zapier / Anthropic email is gone. New A2 is a revenue-leak email for A-1: **"You're not bad at sales. You're leaking."** Twists the knife on the day-to-day (same hours, smaller number, ads into a bucket with a hole), then the business (BLS: about half of 2013 openings closed within five years, about a third left at year ten). The copy says plainly it cannot say what killed them; the "leak" line is an opinion. Four-minute test, then the call.
- **Flag:** BLS Table 7 was read by the fetch tool only (BLS blocks scripted downloads). Friday's check should open the link and confirm 50.6% and 34.7%.
- **S-SUN** still needs one true, specific moment from Chosen.
- Anthropic flag now applies to S3 and B1 only. Build passes.

- **A2 subject changed on Chosen's word** to "Is your ship leaking?" with preview "Plug the hole...". The body's bucket line became a boat line so the metaphor matches.
- **A2 body link is now the Revenue Leak Scorecard** (https://e4lmarketingdemos.com/scorecard, UTM'd), replacing the four-minute test and the BLS link. Copy names it "the Revenue Leak Scorecard" and uses the page's own claim (free, two minutes, no signup to see your number). BLS is still named in the text.
- **Flag:** `docs/OUTREACH_COPY_BANK.md` still says the /scorecard funnel isn't deployed. It is live as of today; that note is stale.
