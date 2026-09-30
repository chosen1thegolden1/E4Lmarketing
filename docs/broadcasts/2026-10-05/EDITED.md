# Editor pass — week of Oct 5, 2026

Written and edited 2026-09-30 in a live session, because the Sept 29 writer routine
produced the batch and then failed to push (no repository was attached to the Routines, so
it hit a 403). Written fresh rather than recovered from the stranded patch files.

## What the edit changed

Every email came out of the writing pass with a working argument and no shape. The edit
added the skim path and the breathing room, and took nothing out of the argument.

| | Bold | Italics | Emoji | Target met |
|---|---|---|---|---|
| A1 · A2 · A3 · A-SUN | 2 each | 1–2 each | 2 each | agency 2–3 ✅ |
| S1 · S2 · S3 · S-SUN | 2 each | 1 each | 4 each | student 4–5 ✅ |
| B1 · B2 | 2 each | 1 each | 4 / 2 | ✅ |

**Bold went on the turn in the argument, not the opener and not the pitch.** The
bold-only read of each email still makes its point — that was the test. Examples: A1
keeps "That part is going to zero" and "The AI will happily build the wrong follow-up
sequence, perfectly, forever." A3 keeps "Not 'will.' Did. Last month." and "There was
just nobody home." S2 keeps "It wasn't you" and "Don't go apply. Go have something to
show."

**Italics carry the voice drop, never emphasis.** *operate software* in A1, *Any* mention
of you learning anything in A2, *Restaurants and retail* in S2, *inside its own building*
in S3.

**Two emoji were moved off the opening sentence** — S1's 👀 and S3's 🤖. The rule is that
the first line earns attention before it spends any. Both now land on a later beat, which
is where 👀 and 🤖 do their actual work.

**One line was added, not removed:** S1 gained "That's it. That's the side quest. 🎮" —
the gaming handshake the student side is supposed to carry, and it was missing.

Nothing else was added. No fact, number, story, link, UTM tag or greeting was touched.

## Flagged rather than fixed

1. **A-SUN promises a screen share.** "I'll share my screen and we'll find yours," and
   that the call opens by looking at their CRM instead of pitching. Raised Sept 20, never
   confirmed. Outside what an editor may change, so it stays flagged: if that isn't how
   the Game Plan Call runs, the email needs rewriting, not softening.
2. **The September jobs report lands around Oct 2**, before the first send. S-SUN argues
   the market is re-sorting rather than collapsing. Friday's freshness check must
   re-verify it.
3. **B2 expires Wed Oct 7.** It says Google's spam update is "still going," which is true
   through roughly Oct 8 and false after. It is a bench swap for A1 or A2 only.
4. **Two caveats cost the copy some punch and stay in.** S2 quotes Indeed's 46% pay figure
   then says the entry-level gap is almost nothing. A2 says Copilot is not free. Both facts
   are one click from the reader, so hiding them would get caught.
5. **No moment from Chosen in any of these.** They run on the news and the story bank. The
   pizza shop and the pro-gaming years are carrying the personal weight in S1 and B1. One
   line about his actual week would go in A1 before this sends.

## Builder changes this pass forced

Three real bugs surfaced while building this batch, all fixed:

- **A bench email could not be agency.** Side was inferred from the ID prefix, so B2 read
  as student and failed on its own UTM tags. Side now comes from the segment code on the
  Reader line, and a bench email without one fails rather than being guessed — guessing
  would cross an agency email onto the student list.
- **Emphasis spanning a wrapped line never closed.** Emphasis was applied per line, so
  `**bold**` straddling a 60-character wrap shipped its asterisks. Those markers are now
  pulled onto one line first; a marker containing a blank line is still malformed and
  still fails.
- **The no-emoji-in-the-opener rule was only in prose.** It is now enforced by the
  builder, as a style check — which means it fails live work and only warns on a file
  marked archived, so a rule written today cannot retroactively fail mail that already
  sent.

---

# Second editor pass — 2026-09-30 (separate session)

Independent read of the whole batch against `formatting.md`. The first pass had the bold,
italics and emoji counts right, so this one was about the reader's thumb.

## What changed

- **Ten paragraphs ran past three lines** and were split at the sentence break, no words
  added or removed: A1, A3, S1 (two), S2 (three), S3 (two), S-SUN. Every email now
  has a short paragraph after a longer one instead of a block.
- **B2's numbered list had one bold headline and two plain ones.** Bold on item 1 came off,
  so the email carries one bold, on the turn in the opener.
- Emoji recount: agency 2 each, student 4 each, none in an opening sentence, `👉` on every CTA.
  Bold 1–2 and italics 1–2 per email. All in range, so nothing to change.

## Subject lines

Read all eight aloud against the sauce.md test. None rewritten: the previous session's
rewrites already sound like a person, not a news site. Preview text adds a second beat in
every case and none restates its subject.

## Flagged, not fixed

1. **A3 subject says "Half your customers."** The survey found 52% of *consumers* had used AI
   to find a local business. It is a vendor survey (SOCi), not their customers. It's a
   scene-not-stat rewrite on purpose, but it is the loosest claim in the batch.
2. **S3 preview is the longest of the eight** and may truncate on a phone before "quote anybody."
3. Earlier flags stand: jobs report around Oct 2 vs S-SUN, B2 dies after Oct 7, no moment of
   Chosen's own in any email.
