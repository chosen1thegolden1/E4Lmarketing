#!/usr/bin/env python3
"""
track — follow one person/object through a clip so effects can be pinned to it.

    python3 track.py clip.mp4 --at 4.0 --box 492,251,22,49 --from 3.0 --to 9.0 -o me.track.json [--check sheet.jpg]

--box is x,y,w,h in the clip's own pixels at time --at (use a frame grab to find it).
Tracks forward to --to and backward to --from with OpenCV CSRT (on 3x upscaled frames for small, far-away
subjects), smooths the path, and writes {"src_w","src_h","fps","points":[[t,cx,cy,w,h],...]} in source pixels.
--fix t,x,y,w,h (repeatable) re-seeds the tracker at that moment when it drifts: tracking is
re-run from each fix, so manual keyframes always win.
--key t,cx,cy (repeatable) hand-places the center through occlusions; keys are interpolated.
--check writes a contact sheet with the tracked box drawn, to review before rendering.
"""
import argparse, json
import numpy as np
import cv2


def read_frames(src):
    cap = cv2.VideoCapture(src)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    frames = []
    while True:
        ok, f = cap.read()
        if not ok:
            break
        frames.append(f)
    return frames, fps


def run(frames, i0, i1, box, up):
    """Track from frame i0 (box known) toward i1 (either direction). Returns {idx: (cx,cy,w,h)}."""
    step = 1 if i1 >= i0 else -1
    tr = cv2.TrackerCSRT_create()
    big = lambda f: cv2.resize(f, None, fx=up, fy=up, interpolation=cv2.INTER_CUBIC)
    x, y, w, h = box
    tr.init(big(frames[i0]), tuple(int(v * up) for v in (x, y, w, h)))
    out = {i0: (x + w / 2, y + h / 2, w, h)}
    for i in range(i0 + step, i1 + step, step):
        ok, b = tr.update(big(frames[i]))
        if ok:
            bx, by, bw, bh = (v / up for v in b)
            out[i] = (bx + bw / 2, by + bh / 2, bw, bh)
        else:
            out[i] = out[i - step]
    return out


def smooth(vals, k=5):
    vals = np.asarray(vals, float)
    if len(vals) < k:
        return vals
    pad = k // 2
    v = np.pad(vals, ((pad, pad), (0, 0)), mode="edge")
    ker = np.ones(k) / k
    return np.stack([np.convolve(v[:, j], ker, mode="valid") for j in range(vals.shape[1])], 1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--at", type=float, required=True)
    ap.add_argument("--box", required=True)
    ap.add_argument("--from", dest="t_from", type=float)
    ap.add_argument("--to", type=float)
    ap.add_argument("--fix", action="append", default=[], help="t,x,y,w,h manual keyframe")
    ap.add_argument("--key", action="append", default=[],
                    help="t,cx,cy manual keyframe (center); consecutive keys are interpolated and override the tracker")
    ap.add_argument("--up", type=float, default=3.0)
    ap.add_argument("-o", "--out", default="track.json")
    ap.add_argument("--check")
    a = ap.parse_args()

    frames, fps = read_frames(a.src)
    n = len(frames)
    idx = lambda t: max(0, min(n - 1, int(round(t * fps))))
    i_from = idx(a.t_from if a.t_from is not None else a.at)
    i_to = idx(a.to if a.to is not None else n / fps)
    seeds = [(idx(a.at), [float(v) for v in a.box.split(",")])]
    for f in a.fix:
        t, *b = [float(v) for v in f.split(",")]
        seeds.append((idx(t), b))
    seeds.sort()
    pts = {}
    # forward from each seed until the next seed; backward from the first seed
    for k, (i, b) in enumerate(seeds):
        end = seeds[k + 1][0] - 1 if k + 1 < len(seeds) else i_to
        pts.update(run(frames, i, max(i, end), b, a.up))
    if i_from < seeds[0][0]:
        pts.update(run(frames, seeds[0][0], i_from, seeds[0][1], a.up))
    if a.key:
        ks = sorted([float(v) for v in k.split(",")] for k in a.key)
        for (t0, x0, y0), (t1, x1, y1) in zip(ks, ks[1:]):
            for i in range(idx(t0), idx(t1) + 1):
                u = (i / fps - t0) / max(1e-6, t1 - t0)
                w0, h0 = pts.get(i, (0, 0, 22, 45))[2:]
                pts[i] = (x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, w0, h0)
    keys = sorted(k for k in pts if i_from <= k <= i_to)
    sm = smooth([pts[k] for k in keys])
    points = [[round(k / fps, 4)] + [round(float(v), 2) for v in s] for k, s in zip(keys, sm)]
    h, w = frames[0].shape[:2]
    json.dump({"src_w": w, "src_h": h, "fps": fps, "points": points}, open(a.out, "w"))
    print(f"[track] {len(points)} points {points[0][0]:.2f}s → {points[-1][0]:.2f}s → {a.out}")

    if a.check:
        tiles = []
        for p in points[::max(1, len(points) // 24)]:
            f = frames[idx(p[0])].copy()
            cx, cy, bw, bh = p[1:]
            cv2.rectangle(f, (int(cx - bw / 2), int(cy - bh / 2)), (int(cx + bw / 2), int(cy + bh / 2)), (0, 255, 255), 2)
            cv2.putText(f, f"{p[0]:.2f}", (6, 22), cv2.FONT_HERSHEY_SIMPLEX, .7, (0, 255, 255), 2)
            tiles.append(cv2.resize(f, (w * 360 // h, 360)))
        while len(tiles) % 6:
            tiles.append(np.zeros_like(tiles[0]))
        cv2.imwrite(a.check, np.vstack([np.hstack(tiles[i:i + 6]) for i in range(0, len(tiles), 6)]))


if __name__ == "__main__":
    main()
