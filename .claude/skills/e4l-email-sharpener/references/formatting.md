# The editor pass — proofread and format

A separate job from writing, done by a separate session, on purpose. The writer is
arguing; the editor is making the argument survive a thumb moving at speed. Two
different jobs, and doing them in one pass means the second one never really happens.

This pass changes **how the email looks and reads**, not what it says.

---

## What the editor may change

- Typos, doubled words, wrong homophones, broken punctuation.
- Sentences that are correct but clumsy, where a shorter one says the same thing.
- **Bold**, *italics*, emoji, line breaks, paragraph splits, list spacing.
- A subject line or preview text that misses badly — flagged in the notes, never
  changed silently.

## What the editor may never change

- The argument, the claim, the number, the story. Those came from research and from
  Chosen's real life. An editor who "improves" a fact has invented one.
- Any URL, any UTM tag, any `(LINK: …)` marker.
- The greeting. Agency is `Hey [First Name],` and student is `Yo [First Name],`.
- The CTA target. One per email, already chosen.
- Anything that makes the email longer. This pass only ever removes words.

If something is wrong in a way the editor can't fix inside those rules, it goes in the
notes for Chosen. Flagging beats fixing when the fix is somebody else's call.

---

## Bold — the skim path

Someone who reads only the bold text should still get the point. That's the test.

- **One or two bolds per email.** Three is the ceiling and it's already too many.
- Bold **the one line you'd keep** if you could keep one. Usually the turn in the
  argument, not the opener and not the pitch.
- Bold **the number that carries the argument** when there is one: `**48%**`, not the
  whole sentence around it.
- Bold **the headline half of a numbered item**, never the explanation under it.
- Never bold a full paragraph. A bolded paragraph reads as shouting and the reader
  discounts all of it.
- Never bold the CTA text. The link already renders blue and semibold, so bolding it
  makes it heavier than the thing it's asking for.

## Italics — the voice drop

Italics are the aside, the change in tone, the thing said quieter. They carry voice,
not emphasis.

- The turn inward: *that's the part that gets me*.
- A phrase the reader would actually say or think, or a search they'd type:
  *best roofer near me*.
- One word inside a sentence, where the stress changes the meaning: it's not that they
  stopped looking, it's that they stopped *searching*.
- **At most three per email.** Italics are cheap and they stop working fast.
- Never italicize a whole paragraph — at phone size it turns into a grey smear.

## Emoji — a beat, not decoration

Emoji are how this voice breathes. They mark a beat the way a pause would out loud. Used
as garnish they make the email look like every other broadcast in the inbox.

- **Agency: two or three. Student: four or five.** That gap is the voice difference
  between the lists, and it's the whole reason to treat them separately.
- `👉` marks the CTA. Always. It is the one fixed convention in this document and it is
  the reader's cue that the ask is coming.
- A reveal can carry `👀`. A list headline can end on a beat: `⚡`, `🤖`, `💼`.
- **Never in the first sentence.** The first line has to earn attention before it spends
  any, and an opening emoji reads as marketing before the reader has decided to trust it.
- Never two in a row, and never two of the same one in an email.
- The subject line gets none unless it is doing real work there. Most don't.

## Spacing — where the reading actually happens

This is the part that moves numbers, and it's the part that gets skipped. A well-argued
email in one dense block does not get read on a phone.

- **One idea per paragraph. One to three lines each.** If a paragraph needs four, it is
  two paragraphs.
- Blank line after the greeting. Blank line before the CTA. Blank line before the
  signature. Blank line before the P.S. No exceptions — these four are the email's
  skeleton.
- Numbered items get a blank line between them, and the headline of each sits on its
  own line above its explanation.
- **Vary the lengths.** Three paragraphs of identical size read as a wall no matter how
  short they are. A one-line paragraph after a three-line one is a drumbeat.
- The longest paragraph in the email should be the story or the argument, never the
  pitch. If the pitch is the longest thing, cut it until it isn't.
- Don't hard-wrap mid-sentence to force a line break. The builder unwraps cosmetic
  wraps, and a break the writer meant is short or lands after a full stop.

---

## What the builder enforces for you

You do not have to remember all of this. `scripts/build-emails.js` fails the build on:
a leftover asterisk, a missing UTM tag, a crossed list, an unreadable link marker, an
agency email opening with "Yo", a bench email that doesn't say which list it's for, and
**an emoji in the opening sentence**. Emoji counts, bold counts and paragraph length are
still yours to judge.

A file marked `**Style checks:** archived` gets style rules as warnings instead of
failures, so a rule written today never retroactively fails a batch that already sent.
Correctness rules are never waived.

## How the markup reaches the email

Write `**bold**` and `*italic*` in the markdown. `scripts/build-emails.js` renders them
as `<strong>` and `<em>`, applies them to link text but never to a URL, and **fails the
build on a leftover asterisk** — an unclosed marker would otherwise ship as a literal
`*` to the whole list. Underscores are not emphasis, because they appear inside real
words and URLs.

## Before handing it on

1. Read every email out loud. Anywhere you stumble, the reader stumbles harder.
2. Do the bold-only pass: read just the bold text. Does it still make the point?
3. Count the emoji. Agency two to three, student four to five.
4. Check the four structural blank lines are all there.
5. Confirm no paragraph runs past three lines.
6. Run the builder. It has to pass, not nearly pass.
7. Write the notes: what you fixed, what you flagged, and anything you'd want Chosen to
   look at before it goes out.
