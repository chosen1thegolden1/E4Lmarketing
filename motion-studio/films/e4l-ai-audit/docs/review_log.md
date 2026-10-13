# Review log — E4L AI Audit reel

Scored 1–10 per round from `node stills.mjs` contact/phone sheets and `--strip` frame strips on every morph.

| Round | Hook | Phone readability | Motion | Variety | Composition | Brand | Sound sync |
|---|---|---|---|---|---|---|---|
| 1 | 8 | 6 | 7 | 8 | 5 | 6 | – |
| 2 | 8 | 7 | 6 | 9 | 8 | 8 | – |
| 3 | 8 | 8 | 8 | 9 | 8 | 8 | 8 |
| 4 (1:1, 16:9) | 8 | 8 | 8 | 9 | 8 | 8 | 8 |

## Round 1 — 3 worst problems
1. **Composition, 2–4 s and 6–10 s:** the bottom ~45% of the frame is dead while the pill and report sit at the top.
   → Replaced the small niche chips with a huge niche word ("ROOFING." / "DENTAL." …) swapping on every beat;
   moved the report down and enlarged the 7/3 number block.
2. **Brand, 14–18 s:** "EAT 4 LIFE MARKETING" was a 30 px kicker. → Real lockup: "Eat 4 Life" in the display
   face at 240 px, brand line "MARKETING · AI MARKETING MADE EASY" under it, rule drawn in.
3. **Motion, 7.9 s / 9.9 s:** exits used the same soft spring as entrances, leaving half-gone glyphs on the next
   beat. → Separate, stiffer exit spring (`typeOut`, k 560 critically damped).

## Round 2 — 3 worst problems
1. **Motion, every morph (4.0, 6.0, 10.0, 12.0 s):** frame strips showed the container **empty for ~8 frames**
   (old content left before the new content arrived). → Overlapping swap behind a short blur (`swapA`);
   the container is never empty now.
2. **Readability, 2–4 s:** question text ran under the send button. → Text fits the space left of the button.
3. **Readability:** mono kickers were 28 px, ~9 px on a phone. → 32 px minimum, auto-fit to their column.

## Round 3 — sound
Score synthesized at 120 BPM; every SFX placed on the film's grid (`docs/cues.json`). Mastered −14.0 LUFS,
−3.1 dBTP. `beats.py` on the final mix measures 119.7 BPM. Waveform/spectrogram check: hits at 12 s (gold
takeover), 14 s (lockup), 16 s (CTA chord); no clipping.

## Round 4 — square and wide formats
1. Hook: "ASK" collided with the "AI." block. → Hook lines sized to the room above the block.
2. 1:1: "7 money questions" and "CHATGPT GEMINI PERPLEXITY" ran into the report. → Number block and kickers fit
   the type column.
3. 16:9: the receipts grid was a thin 7 × 2 strip. → 5 columns in landscape.

## What I'd improve next
- A voiceover (ElevenLabs key in `.env`) reading the hook and the CTA.
- A real E4L logo file (the brand's "EFL" mark) for the lockup instead of the typeset wordmark.
- A version per niche (roofing, dental, HVAC, med spa) using that niche's own questions and an approved
  client's real before/after audit, which would give a stronger "proof" number than 21.
