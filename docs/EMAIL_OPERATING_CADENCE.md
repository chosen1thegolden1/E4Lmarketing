# The E4L email week — the system

One rhythm, four sends a week per list, and a named owner for every day. Written
down because "we'll do it next week" is how a broadcast program dies.

**Agreed Sept 20, 2026.** Sends Monday / Wednesday / Friday / Sunday, both lists.
Claude writes and edits Tuesday. Chosen gives the GO. Abdullah loads Friday for the
week ahead. Nothing about that moves.

> **Update, Oct 7, 2026 (Chosen): Sammy is no longer in this loop. Daniel has taken Sammy's
> role.** Daniel is now the single router and watcher for **both** lists: the agency four
> (E4L Services) and the student four (E4L School). Nothing goes to Sammy any more: no GO
> DM, no Monday report, no Friday copy. Everywhere below that once said "Daniel and Sammy"
> now means Daniel alone.
>
> **Routine 3 (`trig_01M6zQLriHnZzHXgq3bD9EkC`) is stored in the Routines UI, not in this
> repo, and its prompt still names Sammy.** Until someone edits it there, any Wednesday or
> Thursday session must follow this document over its own prompt: send **one** DM to Daniel
> (`U0C0JE303KN`) holding both batches, and send nothing to Sammy (`U0C082R2RT3`).

---

## The week at a glance

Two clocks run at once. The **send clock** is this week's batch going out. The
**build clock** is next week's batch being made. They overlap on purpose — by the
time Monday's email lands, next Monday's is already being written.

| Day | Sends (8:00 AM PT) | Build — next week's batch | Owner |
|---|---|---|---|
| **Mon** | A1 agency · S1 student | Weekly performance report, 7:00 AM PT | Claude |
| **Tue 6:00 AM** | — | **Write** all eight plus two bench | Claude — routine 1 |
| **Tue 9:30 AM** | — | **Edit and format**, then a push notification to Chosen | Claude — routine 2 |
| **Tue → Wed** | — | Chosen reads them and replies **GO** in Slack | **Chosen** |
| **Wed / Thu 8:30 AM** | A2 · S2 *(Wed)* | On GO: out to Daniel, both batches in one DM | Claude — routine 3 |
| **Fri 6:30 AM** | A3 · S3 | Freshness re-check · Abdullah loads **next week** | Claude → **Abdullah** |
| **Sat** | — | — | — |
| **Sun** | A-SUN agency · S-SUN student | — | — |

Sunday is on the list because Sunday is when people decide to change. It is the
highest-sales day of the week and the shortest email of the week.

## Why the build runs a week ahead

Because a batch built the same week it sends can't survive one sick day. Running
seven days ahead means Chosen can be on calls all Wednesday, or Abdullah can lose a day,
and Monday still goes out. The buffer is the whole point — and it is what let this survive
losing the person who used to be the editor.

The cost is staleness: an email written Tuesday sends the following Monday, six
days later. The Monday agency email is the news one, so **Friday's step includes a
freshness re-check** — every dated claim gets re-verified before anything is
scheduled, and anything that died during the week gets pulled or swapped. A stale
fact in a cold email is worse than no email.

---

## The roles

Writing and editing are two different jobs and they now run as two different sessions.
That split is the point: a writer deep in an argument is not thinking about how the thing
scans on a phone, so a second pass with only that job does it properly.

**Zion has left the team.** He was the editor and the hand-off to Abdullah. The editor
seat is now a Claude session, and the hand-off is Daniel (who took over Sammy's role on Oct 7).

| Role | Who | When |
|---|---|---|
| **Writer** | Claude | Tuesday 6:00 AM |
| **Editor** | Claude, a separate session | Tuesday 9:30 AM |
| **Approver** | **Chosen** | Reads Tuesday, replies GO Wednesday |
| **Distributor** | Claude, on the GO | Wednesday or Thursday 8:30 AM |
| **Router** | Daniel (agency and student) | He passes it to Abdullah |
| **Loader** | Abdullah | Friday, for the week starting Monday |
| **Watcher** | Daniel on E4L Services and E4L School | Standing |

### Tuesday 6:00 AM — Claude writes
Runs the `e4l-email-sharpener` skill. Eight emails plus two bench. Each names its reader,
its angle, and the offer it sells. Every factual claim links to the primary source, never
an aggregator. Builds, commits, pushes. It messages nobody — the editor does that.

### Tuesday 9:30 AM — Claude edits
A separate session whose only job is `references/formatting.md`: typos, clumsy sentences,
**bold**, *italics*, emoji counts, and spacing. It may not touch a fact, a number, a
story, a link, a UTM tag or the greeting. It writes `EDITED.md` saying what it changed and
what it flagged, rebuilds, pushes, and publishes the rendered batch as a page.

If Tuesday's write never landed, the editor writes the batch itself rather than reporting
a gap. A missed week is the one outcome worth breaking role boundaries over.

### Why the loop does not depend on git

Scheduled sessions in this environment have not been able to push. Three weeks of Routine
runs reported success while committing nothing: the writer did its work, hit a 403, and the
batch died with the container. That is a GitHub access problem and it is being fixed
separately — but the weekly loop must not wait on it, because a loop with a single point of
failure is what produced those three empty weeks.

**So the batch travels by artifact, and git is the archive.** Every scheduled session has
the Artifact tool; none of them reliably has push. Three hand-offs, each with a fallback:

| Hand-off | First choice | Fallback |
|---|---|---|
| Writer → Editor | the branch | a page titled `E4L batch handoff — week of <Monday>`, holding the markdown in a `<pre>` |
| Editor → Chosen | — | the preview page, titled `E4L Broadcast — week of <Monday>` |
| Editor → Wednesday | `PREVIEW.txt` in the repo | that same preview page, found by title |

Those titles are load-bearing. A session that cannot pull finds the previous step's output by
listing artifacts and matching the title exactly, so changing the wording breaks the chain.

Every session still commits and pushes at the end. A 403 there is expected, is recorded, and
is never worked around: no force push, no pushing to another branch, no opening a pull
request. When GitHub access is fixed, the archive fills back in on its own and nothing else
has to change.

**The double-send guard moved too.** `DISTRIBUTED.txt` cannot be trusted when pushes fail, so
Wednesday's session checks its own Slack history with Daniel before sending. If
he already has this week's batch, it stops.

### How the preview link travels
The editor publishes the rendered batch as a private page and writes that URL into
`docs/broadcasts/<Monday>/PREVIEW.txt`, one line, nothing else. That file is the only way
Wednesday's session knows the link, because it runs in a fresh container that never saw the
publish. No `PREVIEW.txt` means Daniel gets a GitHub path instead of something
they can read on a phone.

### Tuesday → Wednesday — Chosen approves
The editor sends a **push notification** and a Slack DM with the page link and the eight
subject lines. Nothing moves until Chosen replies.

- **`GO`** (or approved / send it / 👍 / ✅) means distribute.
- **Anything substantive** is notes. Claude applies them, rebuilds, and asks again.
- **Silence is not approval.** Chosen asked to be the gate here, so waiting is the correct
  behavior, not a failure. This is the one step in the whole system that blocks.

### Wednesday or Thursday 8:30 AM — out to Daniel
On the GO, Claude writes `APPROVED.txt` with Chosen's exact words, then sends **one DM to
Daniel** holding both batches, the agency four and the student four, in two clearly
labelled sections with the preview link. Daniel owns both sides now, so there is nothing
to split. Nothing goes to Sammy.

The DM carries the **edited, final** batch, sorted into two sections, **Agency** first and
**Student** second. Each section lists its four emails with send date, subject line, and
what the email sells (the call, or the book), plus the preview link. Only the edited
version goes out, never the writer's draft.

It says plainly: these are final, and get them to Abdullah for Friday's load. Then `DISTRIBUTED.txt` is written so a second firing can't send it twice.

It fires Wednesday **and** Thursday because a Routine cannot sit and wait overnight for a
reply. Thursday is the retry, not a second batch.

### Friday 6:30 AM — Abdullah loads next week
Claude re-verifies every dated claim first, then sends Abdullah his Friday update with
**the email load as item 1**: "load and schedule the broadcast emails for the week of
<Monday>." The week is named explicitly so there is never doubt about which batch.

Abdullah gets the links whether or not Daniel already sent them. A duplicate
link costs nothing; a lost batch costs the week.

> ⚠️ **Abdullah's brief scopes him to E4L Services only** — "never touch the E4L School
> sub-account, no reads, no writes." The student list lives in E4L School. So as written,
> Abdullah can load the agency four and cannot load the student four. **Unresolved — see
> the open question at the bottom of this doc.**

### Daniel — second pair of eyes on both sub-accounts
**Daniel covers E4L Services and E4L School** (he took over E4L School from Sammy on
Oct 7). Not just email: everything that runs inside those sub-accounts, and email is one
of the things running inside them.

Email reaches him twice a week:

1. **On the GO:** both fours, final, to route to Abdullah.
2. **Monday:** the performance report — sends, clicks, form submissions, bookings,
   pipeline movement, and what changed from last week.

They get told what each email **sells**, not just its subject line. When a booking or a
book order lands, they have to be able to say which email drove it. The UTM tags let the
report attribute it; the person reading the report still needs to know that Wednesday's
student email was selling the book and Wednesday's agency email was selling the call.
Without that, the numbers are trivia.

### Where Daniel is headed
Right now he routes and he watches. **After a couple of rounds, the format-and-link check
moves to him**, inside each sub-account he now owns: the agency four in E4L Services,
the student four in E4L School.

Checking that a link opens and a merge tag renders belongs to whoever owns the account it
runs in, because they're the one who'll see it break. Judging whether a sentence lands is
a different skill, and that stays with the editor pass.

The handover is ready when he has received the batch twice, caught at least one real
problem, and can open each sub-account's email builder without being walked through it.
Until then nothing waits on his sign-off.

## When somebody misses

The batch ships anyway. That is the rule everything else bends around.

| Missed | What happens |
|---|---|
| Tuesday's write doesn't land | The 9:30 editor session writes the batch itself and tells Chosen it covered. |
| Chosen doesn't reply GO | Nothing is distributed. One nudge Wednesday, one Thursday, then it waits. This step is allowed to block — it's the only one. |
| Chosen leaves notes instead | Claude applies them, rebuilds, and asks again. No distribution on a firing where the copy just changed. |
| Daniel doesn't route it | Friday's update goes to Abdullah with the links anyway, and Chosen is told it went around him. |
| Nothing is scheduled by Friday 5 PM | Claude checks GHL Friday evening and escalates to Chosen. A Monday with nothing queued is the one real failure. |
| A dated claim died during the week | Friday's re-check pulls that email and its bench replacement goes instead. That's what the bench is for. |

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
| **1. Write** | `trig_01Cmnf478rsjFXzSLVLBGY1P` | `0 13 * * 2` | 6:00 AM Tue |
| **2. Edit + your check** | `trig_01QTNr9k6H9QLzeej6kw5GvM` | `30 16 * * 2` | 9:30 AM Tue |
| **3. Your GO → Daniel** | `trig_01M6zQLriHnZzHXgq3bD9EkC` | `30 15 * * 3,4` | 8:30 AM Wed and Thu |
| Friday: Abdullah loads | `trig_018LEeke4LN4WWr485s212GV` | `30 13 * * 5` | 6:30 AM Fri |
| Friday evening: is it queued? | `trig_01SakWNdDC5732ZhhxV5xTz7` | `30 0 * * 6` | 5:30 PM Fri |

Retired with Zion's departure: the Wednesday editor nudge and the Thursday greenlight
routine. Approval now happens on Chosen's own reply rather than on a clock, so routine 3
absorbed both.


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
| The editor's rulebook | `.claude/skills/e4l-email-sharpener/references/formatting.md` |
| Weekly reports | `reports/email/<Monday>/` |
| Per-week state | `docs/broadcasts/<Monday>/` — `PREVIEW.txt`, `EDITED.md`, `APPROVED.txt`, `DISTRIBUTED.txt` |
| Week of Sept 21 preview | https://claude.ai/artifact/RtK5yZCQ34N5ZzfQLJ2nuj |
| Who gets the report | `reports/email/RECIPIENTS.json` |

---

## Open question — who loads the student side?

Abdullah is the loader. His brief (`ABDULLAH_BRIEF.md`) scopes him to **E4L Services
only** and says plainly: never touch the E4L School sub-account, no reads, no writes.
The student list lives in E4L School. So as written he can load the agency four and not
the student four.

That wall was set deliberately, so it isn't Claude's to move. Two ways out:

1. **Daniel loads the student side.** He now owns E4L School as well as E4L Services
   (he took Sammy's role Oct 7), so this needs no new access and no change to Abdullah's
   brief. It does add a doing job to someone whose role here is checking, and a second
   sub-account to someone who had one, so it is worth naming rather than sliding into.
2. **Widen Abdullah's scope** to cover loading broadcasts in E4L School, and amend his
   brief so the wall carries a stated exception instead of being quietly ignored.

Option 1 is the smaller change and the one the Friday routine assumes until told
otherwise. Either way it needs Chosen's word, because both options alter a boundary he
set on purpose.

Until it's settled, the Friday routine sends the agency four to Abdullah and flags the
student four to Chosen as unassigned. That is a real gap, not a formality: a week where
nobody owns the student load is a week the student list hears nothing.
