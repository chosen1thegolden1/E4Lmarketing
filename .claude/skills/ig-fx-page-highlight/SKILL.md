---
name: ig-fx-page-highlight
description: Page highlight: a website/landing page screenshot enters tilted in 3D and settles flat on a dark background under a tracked-caps header, scrolls, and a yellow highlighter sweeps across key lines one by one. Use to show the offer/landing page before the CTA.
---

# Page highlight
Follow the house rules in `ig-story-editor` (canvas, fonts, colors, captions, render pipeline) unless the brief overrides them.

**Look**: near-black background. Header at top in wide-tracked yellow caps, mono-ish, 34 px:
"INSIDE THE LAB" (use the brief's version). The page screenshot sits in a white card at about 90 % width.
It enters at `rotateY(-18deg) rotateX(8deg)` and settles flat. The page then scrolls to the
offer/bullets. Yellow `#FFD84D` highlighter rects (85 % opacity, multiply) wipe left → right across lines
one after another, 4 to 6 frames per line, like a marker pass.

**Timing**: settle 12 frames, scroll about 1 s, then a highlight pass of about 1.5 s. The CTA (`ig-fx-kinetic-cta`)
overlaps at the bottom during the highlight pass.

**Build**: full-page screenshot of the real page with Playwright (`fullPage:true`), plus line boxes
from DOM `getClientRects()` for exact highlight rects. Then a Playwright animation page renders the frames.
