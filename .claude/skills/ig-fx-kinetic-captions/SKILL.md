---
name: ig-fx-kinetic-captions
description: Word-synced kinetic captions in the E4L IG style: 1-3 words at a time, heavy white sans, key word in yellow. Use on every talking-head beat of an IG Story/Reel edit.
---

# Kinetic captions
Follow the house rules in `ig-story-editor` (canvas, fonts, colors, captions, render pipeline) unless the brief overrides them.

**Look**
- Inter Black / Montserrat ExtraBold, 64 to 78 px on 1080w, sentence case (lowercase reads fine),
  white with shadow `0 4px 12px rgba(0,0,0,.6)`, no box.
- Centered at about y=1250. Groups of 1 to 3 words. A group builds word by word: "should" → "should be" →
  "should be capable" → "should be capable of".
- The key word in each group (noun, number, verb that carries the claim) is `#FFD84D`.
  Examples from the reference: "This new **opus** model", "But the **truth** is", "own course **selling**".
- Each new word pops: scale 0.85 → 1.0 over 4 frames easeOutBack, opacity 0 → 1 over 2 frames.
- Variant **caps label**: small (40 px) letter-spaced uppercase white on the chest for emphasis words
  ("COURSE", "PLATFORM", "MEANING", "BUILD YOUR OWN"). Use it during dolly zoom or interface world.
- Variant **script word**: gold script (e.g. "Pinyon Script"/"Great Vibes", `#E9C46A`) with a tiny sans
  word above it ("using / *Claude*"). Use it for a brand or product name, at most once per video.

**Build**
1. faster-whisper `word_timestamps=True` → JSON of words with start/end.
2. Chunk the words: break at punctuation, after 3 words, or at gaps over 250 ms.
3. Pick the key word per chunk (longest content word, or one the brief names).
4. Render with Playwright, one transparent frame per video frame, then overlay.
   Or write ASS subtitles with `\t` scale tags for a quick pass.
