---
name: ig-fx-sketch-boil
description: Sketch boil effect: a white hand-drawn outline traced around the subject plus doodles (crown, stars) that redraw with jitter every few frames, like line-boil animation. Use to make a person or product feel 'special' or playful.
---

# Sketch boil (05)
Follow the house rules in `ig-story-editor` (canvas, fonts, colors, captions, render pipeline) unless the brief overrides them.

**Look**: a 6 px white marker line follows the subject's silhouette about 20 px outside the matte edge.
Doodles sit near the head: an outline crown above it and a star with a yellow `#FFD84D` fill
to one side. The lines are not clean. Every 3 frames the path is redrawn with new noise, so it "boils".

**Build**
1. Subject matte → contour (`cv2.findContours`). Dilate 20 px. Simplify (approxPolyDP, eps 2).
2. Every 3 frames, add perlin/random offsets (±3 px) to the points, draw a Catmull-Rom spline at 6 px
   white with round caps, and add slight width variation.
3. Doodles are SVG paths with the same jitter, anchored to the head bbox from the matte (top-most point).
4. Entrance: stroke draws on over 8 frames (dash-offset), then boils for the rest of the beat.
