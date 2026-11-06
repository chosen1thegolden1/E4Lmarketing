#!/usr/bin/env python3
"""
autoplan — turn raw talking-head footage into a starting edit plan.

    python3 autoplan.py raw.mp4 [more.mp4 ...] -o plan.json [--keywords money,leads] [--hook "Stop losing leads"]

What it does:
  1. Transcribes each clip with word timestamps (faster-whisper).
  2. Jump-cuts out silences/dead air (gaps > --gap seconds).
  3. Alternates a 1.0x / 1.12x framing on each cut so the jump cuts feel intentional.
  4. Adds a punch-zoom + shake on keywords, word-synced captions, a hook headline and a progress bar.
The resulting plan.json is meant to be edited (add images, texts, effects) and then rendered with igedit.py.
"""
import argparse, json, os, sys, tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from igedit import probe, read_audio, write_wav, transcribe, clean, STOP  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("clips", nargs="+")
    ap.add_argument("-o", "--out", default="plan.json")
    ap.add_argument("--gap", type=float, default=0.45, help="silence longer than this is cut")
    ap.add_argument("--pad", type=float, default=0.10, help="keep this much air around speech")
    ap.add_argument("--keywords", default="", help="comma list of words to punch-zoom + highlight")
    ap.add_argument("--hook", default="", help="headline that slams in over the first beat")
    ap.add_argument("--model", default="base.en")
    ap.add_argument("--no-cut", action="store_true", help="keep the footage uncut")
    a = ap.parse_args()

    out_dir = os.path.dirname(os.path.abspath(a.out))
    kws = [k.strip() for k in a.keywords.split(",") if k.strip()]
    clips, words_tl, t = [], [], 0.0
    zoom_toggle = False
    for src in a.clips:
        _, _, dur, has_audio = probe(src)
        with tempfile.TemporaryDirectory() as td:
            wav = os.path.join(td, "a.wav")
            write_wav(wav, read_audio(src, 0, dur))
            words = transcribe(wav, a.model) if has_audio else []
        print(f"[autoplan] {os.path.basename(src)}: {len(words)} words", file=sys.stderr)
        # speech segments
        segs = []
        if a.no_cut or not words:
            segs = [(0.0, dur, words)]
        else:
            cur = [words[0]]
            for w in words[1:]:
                if w["start"] - cur[-1]["end"] > a.gap:
                    segs.append(cur); cur = []
                cur.append(w)
            segs.append(cur)
            segs = [(max(0, s[0]["start"] - a.pad), min(dur, s[-1]["end"] + a.pad), s) for s in segs]
        rel = os.path.relpath(os.path.abspath(src), out_dir)
        for s0, s1, ws in segs:
            clips.append({"src": rel, "in": round(s0, 3), "out": round(s1, 3),
                          "zoom": 1.12 if zoom_toggle else 1.0, "transition": "cut"})
            zoom_toggle = not zoom_toggle
            for w in ws:
                words_tl.append({"word": w["word"], "start": round(t + w["start"] - s0, 3), "end": round(t + w["end"] - s0, 3)})
            t += s1 - s0

    zooms, shakes = [], []
    kwset = {k.lower() for k in kws}
    last = -9
    for w in words_tl:
        c = clean(w["word"])
        if c in kwset and w["start"] - last > 1.5:
            zooms.append({"at": w["start"], "dur": max(.5, w["end"] - w["start"] + .35), "scale": 1.22, "type": "punch"})
            shakes.append({"at": w["start"], "dur": .18, "amount": 8})
            last = w["start"]

    texts = []
    if a.hook:
        texts.append({"text": a.hook, "style": "slam", "at": 0.05, "dur": 2.2, "y": 0.27, "hide_captions": False})

    plan = {
        "output": "edit.mp4",
        "look": "punchy",
        "progress_bar": True,
        "sfx": True,
        "clips": clips,
        "captions": {"words": words_tl, "keywords": kws, "y": 0.66, "style": "pop", "max_words": 3},
        "zooms": zooms,
        "shakes": shakes,
        "texts": texts,
        "images": [],
    }
    json.dump(plan, open(a.out, "w"), indent=1)
    print(f"[autoplan] {len(clips)} cuts, {t:.1f}s after trimming → {a.out}", file=sys.stderr)


if __name__ == "__main__":
    main()
