# The E4L email week — the system

One rhythm, four sends a week per list, and a named owner for every day. Written
down because "we'll do it next week" is how a broadcast program dies.

**Agreed Sept 20, 2026.** Sends Monday / Wednesday / Friday / Sunday, both lists.
Zion reviews Wednesday. Daniel and Sammy load Friday. Nothing about that moves.

---

## The week at a glance

Two clocks run at once. The **send clock** is this week's batch going out. The
**build clock** is next week's batch being made. They overlap on purpose — by the
time Monday's email lands, next Monday's is already being written.

| Day | Sends (8:00 AM PT) | Build — next week's batch | Owner |
|---|---|---|---|
| **Mon** | A1 agency · S1 student | Weekly performance report, 7:00 AM PT | Claude → Slack |
| **Tue** | — | Write all 8. Push, build HTML, open the review doc | Claude, 6:00 AM PT |
| **Wed** | A2 agency · S2 student | Review and QA the draft. Comments only | **Zion**, by 5:00 PM PT |
| **Thu** | — | Greenlight or notes. Silence counts as yes | **Chosen**, by 5:00 PM PT |
| **Fri** | A3 agency · S3 student | Load and schedule all 8 in GHL | **Daniel** (agency) · **Sammy** (student), by 5:00 PM PT |
| **Sat** | — | — | — |
| **Sun** | A-SUN agency · S-SUN student | — | — |

Sunday is on the list because Sunday is when people decide to change. It is the
highest-sales day of the week and the shortest email of the week.

## Why the build runs a week ahead

Because a batch built the same week it sends can't survive one sick day. Running
seven days ahead means Zion can be out Wednesday, or Chosen can be on calls all
Thursday, and Monday still goes out. The buffer is the whole point.

The cost is staleness: an email written Tuesday sends the following Monday, six
days later. The Monday agency email is the news one, so **Friday's step includes a
freshness re-check** — every dated claim gets re-verified before anything is
scheduled, and anything that died during the week gets pulled or swapped. A stale
fact in a cold email is worse than no email.

---

## What each owner actually does

### Tuesday — Claude writes
Runs the `e4l-email-sharpener` skill. Eight emails: four agency (A1, A2, A3, A-SUN),
four student (S1, S2, S3, S-SUN). Each one names its reader, its angle, and the
wheel spoke it sells. Every factual claim links to the primary source, never an
aggregator. Then `node scripts/build-emails.js` turns the batch into paste-ready
HTML with the links already live, pushes to the branch, and opens the review doc.

### Wednesday — Zion reviews
Opens `docs/broadcasts/<week>/index.html` and the Google Doc. His job is QA, not
construction: click every link, check every date, check the subject and preview
match the table, flag anything that reads wrong. **He comments, he does not edit.**
Copy changes go back through Claude so the skill's rules stay intact.

Zion no longer hand-builds the links. That used to make one person the single point
of failure for the whole week. The builder does it now, and his review is a safety
net rather than a bottleneck.

### Thursday — Chosen greenlights
Reads the batch, kills or keeps. Notes go in the doc as comments. **Silence by 5 PM
Pacific counts as a yes** — that rule exists so a busy week never becomes a missed
week. If something needs to change, say so Thursday, not Friday afternoon.

### Friday — Daniel and Sammy load
Claude re-checks the dated claims in the morning and posts the go/no-go. Then Daniel
takes the four agency emails and Sammy takes the four student emails, pastes the HTML
into GHL, sets subject and preview text from `SCHEDULE.md`, and schedules each for
8:00 AM Pacific on its send date.

Every load ends with a test send to yourself. First name renders, unsubscribe works,
every link opens. Tick the checklist in `SCHEDULE.md`.

### Monday — the report closes the loop
The weekly report lands in Slack at 7 AM Pacific with what worked, what didn't, and
one change for the week. That report is the input to Tuesday's writing. The loop is
the system: write → send → measure → write better.

---

## When somebody misses

The batch ships anyway. That is the rule everything else bends around.

| Missed | What happens |
|---|---|
| Zion doesn't review by Thursday morning | Claude nudges once, then tells Chosen. The batch moves forward unreviewed — the HTML is already correct by construction. |
| Chosen doesn't greenlight by Thursday 5 PM | Counts as a yes. Batch goes to Friday. |
| Nothing is scheduled by Friday 5 PM | Claude DMs Daniel and Sammy, then escalates to Chosen. A Monday with nothing queued is the one real failure. |
| A dated claim died during the week | Friday's re-check pulls that email. Its bench replacement goes instead. That's what the bench is for. |

## Standing rules

- **Send from** `chosen@mail.e4lmarketingdemos.com`. Never gsgagency.com. Not once.
- **Agency opens "Hey [First Name]," — student opens "Yo [First Name],"** The builder
  fails the batch if this is wrong.
- **Every link carries UTMs.** No UTMs means the Monday report can't see which email
  made the sale, which means the whole measurement loop is decoration. The builder
  fails the batch on a bare link.
- **Agency copy never crosses to the student list**, and the reverse. The builder
  fails the batch if `utm_medium` doesn't match the side.
- **Never invent a fact, a number, or a story.** Chosen's moments come from Chosen.
- **The bench is real.** Two extra emails a week, written and ready, so a pulled
  email never means a skipped send.

## Dates and daylight saving

All times above are Pacific. The Routines that fire these steps are set in UTC
against Pacific Daylight Time. **Pacific goes back to standard time on Nov 1, 2026** —
on that date every cron below needs +1 hour or the whole week drifts an hour early.

| Step | Cron (UTC) | Pacific |
|---|---|---|
| Monday report | `0 14 * * 1` | 7:00 AM Mon |
| Tuesday write | `0 13 * * 2` | 6:00 AM Tue |
| Wednesday Zion review | `30 7 * * 3` | 12:30 AM Tue night / 8:30 AM Lagos |
| Thursday greenlight | `30 15 * * 4` | 8:30 AM Thu |
| Friday load | `30 13 * * 5` | 6:30 AM Fri |

Zion's nudge fires on Lagos time because that's where he works.

## Where things live

| Thing | Path |
|---|---|
| The week's copy | `docs/BROADCAST_WEEK_<Monday>.md` |
| Paste-ready HTML, schedule, QA page | `docs/broadcasts/<Monday>/` |
| The builder | `scripts/build-emails.js` |
| The voice, audiences, frameworks | `.claude/skills/e4l-email-sharpener/` |
| Weekly reports | `reports/email/<Monday>/` |
| Who gets the report | `reports/email/RECIPIENTS.json` |
