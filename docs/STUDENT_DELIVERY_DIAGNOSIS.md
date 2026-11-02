# Why the student emails aren't landing — diagnosis, 2026-11-02

> **RESOLVED the same evening: the emails went out.** Chosen's GHL screenshot (Students →
> Marketing → Emails → Statistics) shows every student email sent as a **Bulk Action
> campaign**: about 2,000 delivered each, 100% delivered. Opens 6.1% / 6.4% / **17.9%** (Sun,
> "Nobody was clapping when I moved to LA") / 6.2%, clicks 0.10–0.30%. The report reads
> email Campaigns only, so it said "none." The report now says it can't see Bulk Actions.
> The real problem is engagement, not delivery. See `reports/email/2026-11-02/note.md`.
> Everything below is the investigation as it happened, including a wrong guess.

Chosen, 2026-11-02: *"I feel like the emails aren't hitting the students… Let's fix this now."*

## What the data says (read-only, from the Eat 4 Life Students sub-account)

| Week | Student broadcasts the Students sub-account sent |
|---|---|
| Oct 5 | **3**: about 2,000 each, with 355–385 failures per send (~18%) |
| Oct 12 | none |
| Oct 19 | none |
| Oct 26 | none |
| Nov 2 | none scheduled; nothing from S1 in conversations at its 8 AM PT send |

The `/emails/schedule` list for the Students sub-account (checked live, Nov 2, 3:14 PM PT)
ends at S1–S-Sunday for Oct 5–11. Its most recent conversations on Nov 2 are only the
automated nurture workflow, a handful of contacts.

## What the team says

- **Abdullah, Nov 2, 10:47 AM PT:** "I have scheduled all the emails for the agency and
  student account; everything is in order, and the Monday emails went out on time."
- **Daniel, Nov 2:** "Monday's A1 and S1 went out." And "the report shows 'no broadcasts',
  but S1–S4 went out last week (S2 opened at 6%)."

## What we actually know, and the correction

**Corrected 2026-11-02, same evening.** An earlier version of this section guessed that
Abdullah only had access to E4L Services and was sending the student emails from there.
**That was wrong.** Chosen checked: Abdullah is in both sub-accounts.

What the data really shows is narrower than "the emails didn't go out." The Students
token's `/emails/schedule` view lists **email campaigns** only. GHL can also send email by
**Bulk Actions** (select contacts → send email) and by workflows, and this view can't see
those. Abdullah being in both accounts, and Daniel quoting a 6% open on S2, fit
"sent, by a route the report can't see."

**The 30-second check (Chosen, in GHL → Students):** Marketing → Emails → Campaigns for
today's S1, "Zelda comes back Thursday. Steal the idea." If it's not there, Contacts → Bulk
Actions history for an email action this morning. Either one shows recipients, delivered
and opened.

**The system failure, whichever way it lands:** the Monday report said "no student
broadcasts" three weeks running, the Friday check said "nothing queued" twice, and the
loader said "loaded." Nothing reconciled those three until Chosen noticed. The fix:
broadcasts are loaded as **Campaigns** so both checks can see them, and the report flags a
mismatch with the team the first week it happens.

## What to fix, in order

1. **Confirm how they're sending:** Campaign, Bulk Action, or not at all (the check above). If
   it's Bulk Actions, switch to Campaigns so the report and the Friday check can see them.
2. **Services read token** (`GHL_SERVICES_TOKEN`), so the Monday report can see the agency side,
   and the student emails if they're being sent from there.
3. **Email-stats permission on both tokens.** The Students token gets 401 on campaign stats, so
   the report has never shown a student open rate. We only know "6%" because Daniel looked.
4. **List hygiene.** About 18% of the Oct 5 sends failed. Abdullah has since filtered invalid
   contacts (Daniel, Nov 2). Also open: a paused campaign still holding 1,227 queued contacts
   ("Feb 4th – The day you stop trading time for money"), and a nurture workflow sending
   ~40–55 emails a week at near-zero opens. Unengaged sends drag down the sending domain both
   lists share.
5. **Then the copy.** Copy can't move a 6% open rate on a list that isn't getting the email, or
   is getting it in spam. Once delivery is confirmed, the energy direction (2026-10-31) is
   the test.
