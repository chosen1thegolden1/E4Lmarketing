---
name: ig-fx-phone-frame
description: Phone frame effect: a phone mockup showing a social post/profile sits partly behind the cut-out subject, as if they're holding up or standing in front of their own content. Use when talking about a post, an account, a course, or a result on social.
---

# Phone frame (10)
Follow the house rules in `ig-story-editor` (canvas, fonts, colors, captions, render pipeline) unless the brief overrides them.

**Look**: a black modern phone (thin bezel, dynamic island, r=48) about 340x700, placed top-left at
x≈40, y≈300, tilted -6°. It shows a social post, profile, or app screen. The subject cut-out is above it
and overlaps the phone's right edge. Works best on a close-up (shoulders up).

**Timing**: the phone slides in from off-left plus 20° rotation over 8 frames, easeOutBack. During the hold it floats
±6 px. Exit by sliding out or cutting.

**Build**: phone mockup PNG (draw it in HTML/CSS) with the screenshot clipped into the screen.
Composite order: background, then phone, then subject matte. A drop shadow on the phone sells the depth.
