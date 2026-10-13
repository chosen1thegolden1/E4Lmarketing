#!/usr/bin/env bash
# ./review.sh films/<name> [strip-time]
# Turns the final render into images to critique: contact sheet, glitch strip, phone test, loop check.
set -euo pipefail
FILM="${1:?usage: ./review.sh films/<name> [strip-time]}"
OUT="$FILM/out"
SRC="$OUT/final.mp4"; [ -f "$SRC" ] || SRC="$OUT/silent_9x16.mp4"
T="${2:-4.1}"

# Contact sheet: 2 frames per second, 6 across
ffmpeg -loglevel error -y -i "$SRC" -vf "fps=2,scale=270:-1,tile=6x7" -frames:v 1 "$OUT/review_contact.png"
# Strip: 12 frames around a fast moment, to catch glitches
ffmpeg -loglevel error -y -ss "$T" -i "$SRC" -vf "scale=320:-1,tile=12x1" -frames:v 1 "$OUT/review_strip.png"
# Phone test: how it reads at 360px wide
ffmpeg -loglevel error -y -i "$SRC" -vf "fps=1,scale=360:-1,tile=5x4" -frames:v 1 "$OUT/review_phone.png"
# Loop check: play it twice and watch the seam
ffmpeg -loglevel error -y -stream_loop 1 -i "$SRC" -c copy "$OUT/loop_check.mp4"
# Poster: the logo lockup frame
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")
ffmpeg -loglevel error -y -ss "$(echo "$DUR - 0.6" | bc)" -i "$SRC" -frames:v 1 "$OUT/poster.png"
echo "wrote $OUT/review_contact.png review_strip.png review_phone.png loop_check.mp4 poster.png"
