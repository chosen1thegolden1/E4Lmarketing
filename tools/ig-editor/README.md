# igedit: E4L IG Story / Reel editor

Renders 1080x1920, 30 fps edits from raw clips plus a JSON plan. It handles jump cuts, zooms, transitions,
word-synced captions, kinetic text, pop-out images and videos, text behind the subject, and synthesized SFX and music.

```bash
# one-time setup in a fresh container
pip install faster-whisper mediapipe opencv-python-headless pillow numpy
apt-get install -y libegl1 libgles2          # needed by mediapipe (subject cut-outs)

# 1. raw footage -> starting plan (transcribe, cut dead air, alternate zooms, captions)
python3 autoplan.py raw.mp4 -o work/plan.json --keywords leads,booked --hook "Stop losing leads"
# 2. add texts/images/effects to work/plan.json
# 3. render (add --preview for a contact sheet; --from/--to to render one section quickly)
python3 igedit.py work/plan.json --preview
```
Paths in a plan are relative to the plan file. Speed is about 2.5x real time on 4 CPUs.
Beats with text behind the subject run slower, because the person cut-out is computed every frame.

## Plan reference
**Top level:** `output`, `look` (`punchy` | `warm` | `cool` | `bw` | raw ffmpeg filter), `progress_bar`, `sfx`
(true/false), `sfx_volume`, `music {src, volume, in, fade_out}`, `sfx_events [{at, kind}]`
(kinds: pop, thud, whoosh, hit, tick, riser), `flashes [{at, dur}]`.

**clips[]** play back to back: `src` (video or still image), `in`, `out`, `zoom` (static punch-in, e.g. 1.12),
`focus [x,y]` crop focus 0 to 1, `fit` (`cover` | `blurpad` for horizontal footage | `contain`),
`kenburns` (end scale for a slow push), `volume`, `mute`, and `transition` *into* this clip:
`cut` | `punch` | `whip` | `flash` | `glitch` | `zoomblur`.

**captions:** `auto: true` (transcribe) or `words: [{word,start,end}]`, `keywords []` (shown in yellow),
`style` (`pop` | `box` (key word in a yellow box) | `karaoke`), `y`, `size`, `max_words`, `uppercase`,
`color`, `highlight`, `hide [[a,b]]`.

**zooms[]:** `{at, dur, scale, type: punch|slow|out, focus:[x,y], release}`. **shakes[]:** `{at, dur, amount}`.

**texts[]:** `text`, `style`, `at`, `dur`, `x`, `y` (0 to 1), `size`, `color`, `bg`, `font`, `rotate`,
`anim`, `out`, `in_dur`, `out_dur`, `float`, `behind` (renders behind the person), `hide_captions`, `z`.
Styles:
- `slam`: huge heavy text with a camera shake on landing
- `headline`
- `condensed`: tall Anton caps
- `outline`
- `bar`: ink text on a yellow bar that wipes on
- `pill`: e.g. "10X ↗"
- `box`
- `label`: tracked small caps
- `script`: gold handwriting
- `serif`
- `marker`
- `count`: number counts up, with `from`, `to`, `prefix`, `suffix`, `decimals`, `count_dur`

**images[]:** `src` (png/jpg **or a video** for picture-in-picture), `w` (fraction of width), `x`, `y`,
`frame` (`card` | `sticker` | `polaroid` | `circle` | `none`), `cutout: true` (removes the background from a
photo of a person), `rotate`, `radius`, `border`, `border_color`, `aspect` (video only, e.g. 0.5625),
`in` (video start), plus the same `at`/`dur`/`anim`/`out`/`float`/`behind`/`z` keys as texts.

**anim** (in) and **out:** `pop` | `slam` | `zoom` | `fade` | `drop` | `spin` | `wipe` | `type` |
`slide-left` | `slide-right` | `slide-up` | `slide-down` | `none`; out also accepts `cut`.
Every pop, slam, slide, and transition automatically gets a matching sound effect.
