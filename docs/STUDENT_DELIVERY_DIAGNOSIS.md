# Why the student emails aren't landing — diagnosis, 2026-11-02

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

## The most likely explanation (unconfirmed)

Both can be true if **the student emails are being scheduled inside E4L Services**, the
only sub-account Abdullah's invite ever covered, to a student list or tag there, and not
to the ~2,900 contacts in the Students sub-account. That would explain:

- why the Students sub-account shows nothing since Oct 11,
- why Daniel still sees a send with opens (6%), and
- why it "isn't hitting": the real student list may not be getting them, and whatever list
  is getting them opens at 6%, against 17.4% for agency.

**Asked to confirm, Nov 2:** Abdullah and Daniel, by Slack DM: which sub-account, which list,
and a screenshot.

## What to fix, in order

1. **Find where they're sending.** (Asked.) If it's Services: decide whether the student emails
   move to the Students sub-account (Abdullah needs an invite there; Chosen confirmed
   2026-10-31 he's allowed) or the student list moves to Services. Either way, one list,
   one place.
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
