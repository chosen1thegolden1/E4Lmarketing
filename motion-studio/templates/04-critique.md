# Critique loop (guide step 9)

Make the review images first:

```
node stills.mjs films/[name]                  # one frame per shot-list beat: out/contact_9x16.png + out/phone_9x16.png
node stills.mjs films/[name] --strip 4.2      # 12 consecutive frames at a fast moment: out/strip_9x16.png
./review.sh films/[name] 4.2                  # after a render: contact, strip, phone, loop check, poster
```

Then:

```
Open the contact sheet, the strip and the phone sheet and look at them properly.
Be a harsh motion director, not a proud author.

Score 1-10: hook in first 2s, readability at phone size, motion quality, variety
(new thing every 2-4s), composition, brand accuracy, sound sync.

List the 3 biggest problems with timestamps. Hunt for: text overlapping during swaps,
anything sliding instead of easing, corner labels and frame borders, centered-on-gradient
shots, blurry scaled text, a dead beat with nothing happening, an empty container mid-morph,
a stutter at the loop seam.

Fix them, re-render only the affected seconds (render.mjs --from/--to), show me the new
contact sheet and new scores. Log every round in docs/review_log.md.
```

Run at least 3 rounds. Iteration is the method, not a failure.
