---
name: ig-fx-tick-list
description: Tick list effect: checklist items type on one by one with circle checkboxes over a slightly dimmed shot, each getting ticked. Use for steps, features, deliverables, or 'what you get' beats.
---

# Tick list (17)
Follow the house rules in `ig-story-editor` (canvas, fonts, colors, captions, render pipeline) unless the brief overrides them.

**Look**: a translucent dark panel (`rgba(0,0,0,.55)`, r=18, blur-behind feel) centered at mid-chest,
about 700 px wide. Rows are a circle checkbox (28 px, white stroke) plus white sans 36 px text.
The A-roll stays visible and is dimmed 20 %.

**Timing**: each row types on at about 25 chars/s with a blinking caret. When it finishes, the circle fills
and a ✓ draws over 4 frames. Next row starts 4 frames after. Text can grow in place
("Run an agent" → "Run an agent swarm").

**Build**: HTML panel with typed text driven by t. Render transparent frames and overlay. The brief supplies the rows.
