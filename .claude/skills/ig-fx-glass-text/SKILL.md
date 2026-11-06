---
name: ig-fx-glass-text
description: Glass text effect: a big extruded chrome/frosted-glass 3D word (e.g. a brand name) sits at the top of frame behind the subject's head. Use to brand a beat or name the product/topic.
---

# Glass text (07)
Follow the house rules in `ig-story-editor` (canvas, fonts, colors, captions, render pipeline) unless the brief overrides them.

**Look**: one word in heavy all-caps condensed sans (Anton / Archivo Black), about 200 px tall,
spanning about 80 % of the width, at y≈120 to 330. Silver-glass material: light gray gradient fill
`#E8E8E8→#9A9A9A`, a white inner bevel highlight on top edges, a dark 6 to 10 px offset extrusion
(`#555`→`#222`), 85 % opacity so the background shows through. The subject matte sits above it,
so the head covers the letters.

**Timing**: scale 1.15 → 1.0 and blur 12 → 0 px over 8 frames. Optional slow drift up 10 px during the hold.

**Build**: CSS stacked `text-shadow` for the extrusion, `background-clip:text` gradient, plus a
`-webkit-text-stroke` highlight. Render once as a PNG and animate the transform in ffmpeg, or render the frames.
Composite order: background, then glass text, then subject cut-out.
