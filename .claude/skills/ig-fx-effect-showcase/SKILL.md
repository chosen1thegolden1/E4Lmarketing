---
name: ig-fx-effect-showcase
description: The 'N effects / N tips' list-video wrapper: talking-head A-roll full frame, a taped title sticker, two taped paper notes with a running checklist that highlights the current item, and an inset 9:16 demo card with an NN/NN counter chip. Use when a brief is a listicle or a 'here's everything X can do' video.
---

# Effect showcase (listicle wrapper)
Follow the house rules in `ig-story-editor` (canvas, fonts, colors, captions, render pipeline) unless the brief overrides them.

**Layout (1080x1920)**
- Background: full-frame talking-head A-roll (creator to camera, mic in shot is fine).
- **Title sticker**, top center at y≈90 to 260: cream paper `#F4EFE3`, slightly torn/rough edge,
  2 strips of translucent tape on top, rotated -2°. Two lines of ink heavy sans, e.g.
  "17 video effects / claude can create". The number sits in a yellow `#FFD84D` box.
- **Two taped notes**, left (x≈0 to 300) and right (x≈780 to 1080), y≈240 to 600, rotated ±3°. Tiny mono header
  ("EFFECTS 01–08" / "EFFECTS 09–17"), then a list in 28 px sans with item numbers in faint mono.
  - Done items get a small ✓ prefix.
  - The current item gets a yellow marker highlight behind the text (a rect wipes left→right over 5 frames).
- **Demo card**: 9:16 inset, about 500x890, centered horizontally, top at about y=690. Rounded r=28,
  2 to 3 px white stroke, shadow. It plays the effect demo clip.
- **Counter chip**: top-left inside the card, "06/17". Dark translucent pill, white mono 26 px.
- Kinetic captions render *inside* the demo card (they belong to the demo clip).

**Timing**
- Each item runs 1.2 to 1.6 s. The checklist highlight, counter, and card content all switch on the same frame.
- Last item → card flies off or the whole layout cuts to `ig-fx-card-wall-montage`.

**Build**
Notes, sticker, and checklist states are one HTML page that takes a `current` index and renders a transparent PNG.
Re-render only when the index changes. The card is ffmpeg `overlay` of the scaled demo clip with a rounded-corner alpha mask.
