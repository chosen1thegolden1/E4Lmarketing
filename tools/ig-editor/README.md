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
`kenburns` (slow zoom across the whole clip: `1.3` pushes in 1.0→1.3, `[1.4, 1.0]` zooms out),
`zoom_focus [x,y]` (the point the clip's zoom/kenburns aims at, e.g. `[0.3, 0.3]` = upper-left), `volume`, `mute`, and `transition` *into* this clip:
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

## Tracking a person + effects that follow them
```bash
# 1. track (box = x,y,w,h in the clip's pixels at --at; --key t,cx,cy hand-places them through occlusions)
python3 tools/ig-editor/track.py clip.mp4 --at 4.0 --box 492,251,22,49 --from 3 --to 9.2 -o me.track.json --check check.jpg
```
2. Add the track and its effects to the plan:
```json
"tracks":  {"me": {"file": "me.track.json", "clip": 0}},
"zooms":   [{"type": "follow", "track": "me", "at": 0, "dur": 6.6, "scale": 1.85, "ramp": 1.0}],
"trackfx": [{"type": "ring", "track": "me", "at": 0.4, "dur": 2.6, "color": "yellow", "pointer": true},
            {"type": "fire", "track": "me", "at": 3.03, "dur": 3.6, "intensity": 1.0, "trail": 0.55}]
```
- `follow` zooms in and keeps the tracked person framed. The camera glides on a smoothed path.
- `ring` draws a glowing ring at the feet that draws itself on, with a bouncing pointer over the head.
- `fire` is a ring of particle flames at the feet. It bursts on start and moves with the person.
  `trail` controls how much the flames lag behind when they run: 0 means glued to them, 1 means the flames stay where they spawned.
- Times are timeline seconds. The ring gets a whoosh and the fire gets a hit sound automatically.
