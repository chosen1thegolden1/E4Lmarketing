---
name: ig-fx-pull-out-reveal
description: Pull-out reveal: the full-frame shot shrinks back to reveal it was playing inside an app/browser/editor UI on a light background, then UI elements (menu, progress bar) animate. Use to show 'this was made in tool X' or to transition into a screen demo.
---

# Pull-out reveal (09)
Follow the house rules in `ig-story-editor` (canvas, fonts, colors, captions, render pipeline) unless the brief overrides them.

**Look**: the A-roll scales from 1.0 down to about 0.62, anchored slightly above center. Around it a
light UI appears: cream/off-white `#F4EFE3` page, a browser bar with a URL pill on top, a small
"Assistant" label top-right, and a timeline/progress bar under the video with a blue fill.
After it settles, a dropdown menu pops out on the left (white card, 4 to 5 rows). Captions stay
centered on the shrunken video.

**Timing**: the shrink takes 10 to 12 frames, easeOutCubic, with a slight overshoot (0.60 → 0.62). The menu
pops 6 frames later. Total beat about 1.3 s.

**Build**: render the UI chrome as a static PNG with a transparent hole. Animate the video with ffmpeg
`scale` plus `overlay` using expressions (or a PIL per-frame loop). Add a rounded-corner mask on the video.
For a real tool, use a real screenshot instead.
