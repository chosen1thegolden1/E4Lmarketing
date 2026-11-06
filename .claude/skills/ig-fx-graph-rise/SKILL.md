---
name: ig-fx-graph-rise
description: Graph rise effect: a yellow growth line chart draws up from lower-left past the subject's head while JAN–JUN month ticks sit across the top; ends in a yellow '10X ↗' pill. Use when the voiceover mentions growth, results, scaling, or a multiplier.
---

# Graph rise (06)
Follow the house rules in `ig-story-editor` (canvas, fonts, colors, captions, render pipeline) unless the brief overrides them.

**Look**
- Month labels JAN FEB MAR APR MAY JUN across the top of the frame (y≈150), small wide-tracked white
  caps at 70 % opacity, evenly spaced.
- A thin (5 px) yellow `#FFD84D` line rises jaggedly from bottom-left to top-right, crossing behind or
  beside the head, with a soft glow (blur 8 px, 40 %).
- At the line's end a yellow pill appears with ink text "10X ↗" (bold, 34 px), popping with easeOutBack.
  Swap in the brief's number ("3X", "+212%", "$40K").

**Timing**: the line draws on over about 18 frames, timed so the pill pops on the key word
(reference: on "capable"). Hold about 0.5 s.

**Build**: an HTML SVG polyline with `stroke-dashoffset` driven by t, rendered as transparent frames and overlaid.
For more depth, put the subject matte above the line so it passes behind the head.
