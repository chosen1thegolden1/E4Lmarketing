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
| **Wed** | A2 agency · S2 student | Edit and format the draft | **Zion**, by 5:00 PM PT |
| **Thu** | — | Approve. Then Zion routes the approved batch on | **Chosen**, by 5:00 PM PT |
| **Fri** | A3 agency · S3 student | Load and schedule all 8 in GHL | **Abdullah**, by 5:00 PM PT |
| **Fri** | | Visibility brief: what's going out and what it sells | Claude → **Daniel** + **Sammy** |
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

## The five roles

The chain is short on purpose. One person writes, one edits, one approves, one loads.
Two more watch the results. Nobody does two of those jobs at once.

| Role | Who | What it means |
|---|---|---|
| **Writer** | Claude | Tuesday. Researches, writes eight emails plus two bench, builds the HTML, pushes. |
| **Editor** | Zion | Wednesday. Edits and formats. After Chosen approves, Zion is the one who hands the batch to Abdullah. |
| **Approver** | Chosen | Thursday. Kills or keeps. Silence by 5 PM counts as a yes. |
| **Loader** | Abdullah | Friday. Puts them into GHL and schedules them. Nobody else touches the builder. |
| **Watchers** | Daniel (agency) · Sammy (student) | Standing visibility. Not a task. |

### Tuesday — Claude writes
Runs the `e4l-email-sharpener` skill. Eight emails: four agency (A1, A2, A3, A-SUN),
four student (S1, S2, S3, S-SUN), plus two bench. Each one names its reader, its angle,
and the offer it sells. Every factual claim links to the primary source, never an
aggregator. Then `node scripts/build-emails.js` turns the batch into paste-ready HTML
with the links already live, pushes to the branch, and opens the review doc.

### Wednesday — Zion edits
He is the editor, not a proofreader. He fixes what's wrong in the copy, checks every
link opens, checks every date still reads right, and checks the subject and preview
match the schedule. He no longer hand-builds the links: the builder does that, so his
time goes into the writing instead of the plumbing.

### Thursday — Chosen approves, then Zion routes
Chosen reads the batch and kills or keeps. **Silence by 5 PM Pacific counts as a yes** —
that rule exists so a busy week never becomes a missed week. Once it's approved, Zion
sends the approved batch to Abdullah. That hand-off is Zion's job, not Claude's, and not
Chosen's.

### Friday — Abdullah loads
Claude re-checks every dated claim in the morning and posts the go/no-go. Abdullah then
pastes each email's HTML into the GHL builder, sets subject and preview text from
`SCHEDULE.md`, and schedules each for 8:00 AM Pacific on its send date. Every load ends
with a test send to himself: first name renders, unsubscribe works, every link opens.

> ⚠️ **Abdullah's brief scopes him to E4L Services only** — "never touch the E4L School
> sub-account, no reads, no writes." The student list lives in E4L School. So as written,
> Abdullah can load the agency four and cannot load the student four. Either the wall
> moves for this one job, or the student side needs a named loader. **Unresolved — see
> the open question at the bottom of this doc.**

### Daniel and Sammy — second pair of eyes, one sub-account each
**Daniel covers E4L Services. Sammy covers E4L School.** Not just email: everything that
runs inside their sub-account, and email is one of the things running inside it. Same
shape as Jisan on social — they're accountable for whether the thing is working, so they
have to be able to see it.

Email reaches them two ways:

1. **Friday:** next week's send schedule — dates, subject lines, and the offer each
   email points at. Daniel gets the agency four, Sammy gets the student four.
2. **Monday:** the performance report — sends, clicks, form submissions, bookings,
   pipeline movement, and what changed from last week.

Why the offer and not just the subject line: when a booking or a book order lands, they
have to be able to say which email drove it. Every link carries UTM tags so the report
can attribute it, but the person reading the report still needs to know that Wednesday's
student email was selling the book and Wednesday's agency email was selling the call.
Without that, the numbers are trivia.

### Where Daniel and Sammy are headed
Right now they read the schedule and watch the results. **After a couple of rounds, the
format-and-link check moves to them** — Daniel checks the agency four, Sammy checks the
student four, each inside the sub-account they already own. Zion keeps the copy edit.

That's a deliberate split, not a demotion for anybody. Checking that a link opens and a
merge tag renders is a job for the person who owns the account it runs in, because
they're the one who'll see it break. Judging whether a sentence lands is a different
skill, and that stays with the editor.

The handover is ready when both have seen the schedule land twice, caught at least one
real problem between them, and can open their own sub-account's email builder without
being walked through it. Until then they're reading, not gating: **nothing waits on their
sign-off**, and if a week ships without a word from either of them, that is the system
working as designed.

Once it moves, Wednesday becomes: Zion edits the copy, Daniel and Sammy check their own
side's links and formatting, all three done by 5 PM.

## When somebody misses

The batch ships anyway. That is the rule everything else bends around.

| Missed | What happens |
|---|---|
| Zion doesn't edit by Thursday morning | Claude nudges once, then tells Chosen. The batch moves forward unedited — the HTML is already correct by construction. |
| Chosen doesn't approve by Thursday 5 PM | Counts as a yes. Batch goes to Friday. |
| The batch never reaches Abdullah | Claude's Friday message goes to Abdullah directly as a backstop, and tells Chosen it went around Zion. |
| Nothing is scheduled by Friday 5 PM | Claude checks GHL Friday evening and escalates to Chosen. A Monday with nothing queued is the one real failure. |
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

| Step | Routine ID | Cron (UTC) | Pacific |
|---|---|---|---|
| Monday report | `trig_01VBcd6sX3PjEeBthvAa32x5` | `0 14 * * 1` | 7:00 AM Mon |
| Tuesday write | `trig_01Cmnf478rsjFXzSLVLBGY1P` | `0 13 * * 2` | 6:00 AM Tue |
| Wednesday Zion QA | `trig_01EaLNjBSK7Ne9w4JA5wv7Hv` | `30 7 * * 3` | 12:30 AM Tue night / 8:30 AM Lagos |
| Thursday greenlight | `trig_01LbpW3hLtt74wPygNxShdLn` | `30 15 * * 4` | 8:30 AM Thu |
| Friday freshness + hand-off | `trig_018LEeke4LN4WWr485s212GV` | `30 13 * * 5` | 6:30 AM Fri |
| Friday evening: is it queued? | `trig_01SakWNdDC5732ZhhxV5xTz7` | `30 0 * * 6` | 5:30 PM Fri |

Zion's nudge fires on Lagos time because that's where he works.

### These Routines have no connectors attached

Connectors can't be attached to a Routine from inside a session — the platform
refuses it. Every Routine above was created without Slack or Google Drive, which
means **none of them can send a DM or make a doc until someone opens each one in the
claude.ai Routines UI and attaches Slack (and Google Drive on the Tuesday one).**

Until that happens the system half-runs: Tuesday still writes and pushes the batch,
Friday still re-verifies the claims and pushes, and the results land in the push
notification instead of in anyone's Slack. The writing survives. The hand-off doesn't.
That is the single highest-value ten minutes of clicking in this whole setup.

The Monday report Routine has the same gap, and has had it since Sept 17.

## Where things live

| Thing | Path |
|---|---|
| The week's copy | `docs/BROADCAST_WEEK_<Monday>.md` |
| Paste-ready HTML, schedule, QA page | `docs/broadcasts/<Monday>/` |
| The builder | `scripts/build-emails.js` |
| The voice, audiences, frameworks | `.claude/skills/e4l-email-sharpener/` |
| Weekly reports | `reports/email/<Monday>/` |
| Week of Sept 21 preview | https://claude.ai/artifact/RtK5yZCQ34N5ZzfQLJ2nuj |
| Who gets the report | `reports/email/RECIPIENTS.json` |

---

## Open question — who loads the student side?

Abdullah is the loader. His brief (`ABDULLAH_BRIEF.md`) scopes him to **E4L Services
only** and says plainly: never touch the E4L School sub-account, no reads, no writes.
The student list lives in E4L School. So as written he can load the agency four and not
the student four.

That wall was set deliberately, so it isn't Claude's to move. Two ways out:

1. **Sammy loads the student side.** He already owns E4L School as his sub-account, so
   this needs no new access and no change to Abdullah's brief. It does add a doing job
   to someone whose role here is checking — worth naming rather than sliding into.
2. **Widen Abdullah's scope** to cover loading broadcasts in E4L School, and amend his
   brief so the wall carries a stated exception instead of being quietly ignored.

Option 1 is the smaller change and the one the Friday routine assumes until told
otherwise. Either way it needs Chosen's word, because both options alter a boundary he
set on purpose.

Until it's settled, the Friday routine sends the agency four to Abdullah and flags the
student four to Chosen as unassigned. That is a real gap, not a formality: a week where
nobody owns the student load is a week the student list hears nothing.
