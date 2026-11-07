"""
trackfx — effects pinned to a tracked person (see track.py), used by igedit.py.

Plan keys:
  "tracks":  {"me": {"file": "me.track.json", "clip": 0}}
  "zooms":   [{"type": "follow", "track": "me", "at": 0, "dur": 6, "scale": 1.5, "ramp": 0.8, "center": [0.5, 0.5]}]
  "trackfx": [{"type": "ring", "track": "me", "at": 0.4, "dur": 2.6, "color": "yellow", "pointer": true},
              {"type": "fire", "track": "me", "at": 3.0, "dur": 3.6, "intensity": 1.0, "trail": 0.6}]
"""
import json, math, os
import numpy as np
import cv2

W, H = 1080, 1920


def _ease(p):
    return -(math.cos(math.pi * max(0, min(1, p))) - 1) / 2


class Track:
    """A tracked path mapped from clip pixels into the 1080x1920 frame (before camera moves)."""

    def __init__(self, spec, base, clip):
        d = json.load(open(os.path.join(base, spec["file"])))
        self.clip = clip
        pts = np.array(d["points"], float)
        self.t = pts[:, 0]
        sw, sh = d["src_w"], d["src_h"]
        fit = clip["fit"]
        if fit in ("blurpad", "contain"):
            sc = min(W / sw, H / sh); ox, oy = (W - sw * sc) / 2, (H - sh * sc) / 2
        else:
            sc = max(W / sw, H / sh); fx, fy = clip["focus"]
            ox, oy = -(sw * sc - W) * fx, -(sh * sc - H) * fy
        self.content = (ox, oy, ox + sw * sc, oy + sh * sc)   # where the clip's picture sits in the frame
        self.xywh = np.stack([pts[:, 1] * sc + ox, pts[:, 2] * sc + oy, pts[:, 3] * sc, pts[:, 4] * sc], 1)
        k = int(spec.get("camera_smooth", 15)) | 1           # heavier smoothing for the camera so it glides
        pad = np.pad(self.xywh, ((k // 2, k // 2), (0, 0)), mode="edge")
        self.cam = np.stack([np.convolve(pad[:, j], np.ones(k) / k, mode="valid") for j in range(4)], 1)

    def at(self, t, smooth=False):
        st = self.clip["t_in"] + (t - self.clip["start"]) * self.clip.get("speed", 1.0)
        if st < self.t[0] - 1e-3 or st > self.t[-1] + 1e-3:
            return None
        arr = self.cam if smooth else self.xywh
        return np.array([np.interp(st, self.t, arr[:, j]) for j in range(4)])


def follow_affine(z, track, t):
    """2x3 affine that zooms in on the tracked person and keeps them framed."""
    p = track.at(t, smooth=True)
    if p is None:
        return None
    lt = t - float(z["at"])
    ramp = float(z.get("ramp", 0.8))
    u = _ease(lt / ramp) if ramp > 0 else 1.0
    rem = float(z["at"]) + float(z.get("dur", 1e9)) - t
    if z.get("release") and rem < float(z["release"]):
        u *= _ease(rem / float(z["release"]))
    cxy = z.get("center", [0.5, 0.5])
    Px, Py = p[0], p[1]
    if "from_scale" in z:          # continue from a previous follow: glide between two zoom levels, stay centered
        fs = float(z["from_scale"])
        s = fs + (float(z.get("scale", 1.5)) - fs) * u
        u = 1.0
    else:
        s = 1 + (float(z.get("scale", 1.5)) - 1) * u
    Qx = Px + (cxy[0] * W - Px) * u
    Qy = Py + (cxy[1] * H - Py) * u
    tx, ty = Qx - s * Px, Qy - s * Py
    # keep the picture covering the frame horizontally (and vertically if it already did)
    x0, y0, x1, y1 = track.content
    tx = min(tx, -s * x0) if s * (x1 - x0) >= W else tx
    tx = max(tx, W - s * x1) if s * (x1 - x0) >= W else tx
    if s * (y1 - y0) >= H:
        ty = min(max(ty, H - s * y1), -s * y0)
    return np.float32([[s, 0, tx], [0, s, ty]])


def apply_pt(M, x, y):
    return M[0, 0] * x + M[0, 1] * y + M[0, 2], M[1, 0] * x + M[1, 1] * y + M[1, 2]


def _rgb(c):
    named = {"yellow": (255, 216, 77), "white": (255, 255, 255), "red": (255, 59, 48), "blue": (10, 132, 255),
             "green": (52, 199, 89), "orange": (255, 140, 30)}
    if isinstance(c, (list, tuple)):
        return tuple(c[:3])
    if c in named:
        return named[c]
    c = c.lstrip("#"); return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))


def _glow_add(frame, layer, x0, y0, blur):
    """Add an RGB float layer (with glow) into frame at (x0,y0), clipped."""
    h, w = layer.shape[:2]
    fx0, fy0, fx1, fy1 = max(0, x0), max(0, y0), min(W, x0 + w), min(H, y0 + h)
    if fx1 <= fx0 or fy1 <= fy0:
        return
    sub = layer[fy0 - y0:fy1 - y0, fx0 - x0:fx1 - x0]
    g = cv2.GaussianBlur(sub, (0, 0), blur)
    a = np.clip(sub.max(2, keepdims=True) / 255.0, 0, 1)
    roi = frame[fy0:fy1, fx0:fx1].astype(np.float32)
    roi = roi * (1 - a) + sub + g * 0.9
    frame[fy0:fy1, fx0:fx1] = np.clip(roi, 0, 255).astype(np.uint8)


class Ring:
    """Glowing ring at the feet that draws on, plus a bouncing pointer over the head."""

    def __init__(self, spec):
        self.s = spec
        self.at, self.dur = float(spec["at"]), float(spec["dur"])
        self.col = _rgb(spec.get("color", "yellow"))

    def draw(self, frame, t, box, M):
        lt = t - self.at
        if not 0 <= lt < self.dur:
            return
        x, y, w, h = box
        fx, fy = apply_pt(M, x, y + h * 0.48)
        hx, hy = apply_pt(M, x, y - h * 0.5)
        hp = h * M[0, 0]
        rx, ry = max(30, hp * float(self.s.get("size", 0.55))), max(10, hp * float(self.s.get("size", 0.55)) * 0.3)
        a = min(1, (self.at + self.dur - t) / 0.15)
        sweep = 360 * _ease(lt / 0.35)
        th = max(3, int(hp * 0.045))
        pad = int(rx + 60)
        lay = np.zeros((pad * 2, pad * 2, 3), np.float32)
        c = tuple(float(v) * a for v in self.col)
        cv2.ellipse(lay, (pad, pad), (int(rx), int(ry)), 0, -90, -90 + sweep, c, th, cv2.LINE_AA)
        pulse = 1 + 0.08 * math.sin(lt * 9)
        cv2.ellipse(lay, (pad, pad), (int(rx * 1.25 * pulse), int(ry * 1.25 * pulse)), 0, -90, -90 + sweep,
                    tuple(v * 0.45 for v in c), max(2, th // 2), cv2.LINE_AA)
        _glow_add(frame, lay, int(fx - pad), int(fy - pad), max(4, th * 1.6))
        if self.s.get("pointer", True) and lt > 0.15:
            bob = math.sin(lt * 7) * hp * 0.05
            sz = max(14, hp * 0.16)
            py = hy - hp * 0.18 + bob
            pts = np.array([[sz, 0], [2 * sz, -sz * 1.1], [0, -sz * 1.1]], np.float32)
            pp = int(sz * 2 + 20)
            lay = np.zeros((pp * 2, pp * 2, 3), np.float32)
            poly = (pts + [pp - sz, pp]).astype(np.int32)
            cv2.fillPoly(lay, [poly], c, cv2.LINE_AA)
            _glow_add(frame, lay, int(hx - pp), int(py - pp), 5)


FIRE_STOPS = np.array([[0.00, 255, 255, 215], [0.18, 255, 225, 110], [0.42, 255, 140, 30],
                       [0.70, 220, 60, 10], [1.00, 70, 15, 5]], np.float32)


def fire_color(age):
    r = np.interp(age, FIRE_STOPS[:, 0], FIRE_STOPS[:, 1])
    g = np.interp(age, FIRE_STOPS[:, 0], FIRE_STOPS[:, 2])
    b = np.interp(age, FIRE_STOPS[:, 0], FIRE_STOPS[:, 3])
    return np.stack([r, g, b], -1)


class Fire:
    """Particle fire that rings the tracked person, rises up their body and leaves a trail as they move."""

    def __init__(self, spec, fps=30):
        self.s = spec
        self.at, self.dur = float(spec["at"]), float(spec["dur"])
        self.k = float(spec.get("intensity", 1.0))
        self.trail = float(spec.get("trail", 0.6))   # 0 = flames glued to the person, 1 = flames stay where spawned
        self.dt = 1 / fps
        self.rng = np.random.default_rng(int(spec.get("seed", 3)))
        self.p = np.zeros((0, 8), np.float32)       # x, y, vx, vy, life, age, size, kind(0 flame/1 spark)
        self.prev = None
        self.blobs = {}

    def blob(self, r):
        r = max(2, int(r))
        if r not in self.blobs:
            ry = int(r * 1.9)                            # tall flame tongue, brighter at the base
            y, x = np.mgrid[-ry:ry + 1, -r:r + 1].astype(np.float32)
            taper = 1 + 0.6 * np.clip(-y / ry, 0, 1)        # narrower toward the tip
            d = np.sqrt((x * taper / r) ** 2 + (y / ry) ** 2)
            self.blobs[r] = (np.clip(1 - d, 0, 1) ** 1.5) * (0.65 + 0.35 * np.clip(y / ry + 0.5, 0, 1))
        return self.blobs[r]

    def step(self, t, box, M):
        lt = t - self.at
        x, y, w, h = box
        fx, fy = apply_pt(M, x, y + h * 0.48)
        hp = h * M[0, 0]
        cx, cy = apply_pt(M, x, y)
        vel = np.zeros(2, np.float32) if self.prev is None else (np.array([fx, fy]) - self.prev) / self.dt
        self.prev = np.array([fx, fy])
        alive = lt < self.dur
        fade_out = min(1, (self.dur - lt) / 0.4) if alive else 0
        if alive:
            burst = 2.2 if lt < 0.3 else 1.0
            n = self.rng.poisson(340 * self.k * burst * self.dt)
            ang = self.rng.uniform(0, 2 * np.pi, n)
            rx, ry = hp * 0.55, hp * 0.17
            on_body = self.rng.random(n) < 0.08
            px = np.where(on_body, cx + self.rng.normal(0, hp * 0.16, n), fx + np.cos(ang) * rx * self.rng.uniform(.7, 1.1, n))
            py = np.where(on_body, fy - self.rng.uniform(0, hp * 0.7, n), fy + np.sin(ang) * ry)
            spark = self.rng.random(n) < 0.12
            vx = self.rng.normal(0, hp * 0.25, n) + (self.rng.normal(0, hp * 1.2, n) if burst > 1 else 0)
            vy = -self.rng.uniform(0.9, 2.0, n) * hp * np.where(spark, 1.6, 1.0)
            life = self.rng.uniform(0.3, 0.6, n) * np.where(spark, 1.4, 1.0) * fade_out
            size = self.rng.uniform(0.06, 0.12, n) * hp * np.where(spark, 0.2, 1.0)
            new = np.stack([px, py, vx, vy, life, np.zeros(n), size, spark.astype(np.float32)], 1).astype(np.float32)
            self.p = np.vstack([self.p, new])
        if not len(self.p):
            return
        # move: rise, flicker sideways, follow the person by (1 - trail)
        self.p[:, 0] += (self.p[:, 2] + vel[0] * (1 - self.trail)) * self.dt + self.rng.normal(0, hp * 0.01, len(self.p))
        self.p[:, 1] += (self.p[:, 3] + vel[1] * (1 - self.trail)) * self.dt
        self.p[:, 2] *= 0.9
        self.p[:, 5] += self.dt
        self.p = self.p[self.p[:, 5] < self.p[:, 4]]

    def draw(self, frame, t, box, M):
        self.step(t, box, M)
        if not len(self.p):
            return
        P = self.p
        age = P[:, 5] / np.maximum(P[:, 4], 1e-3)
        r = P[:, 6] * (1 + 0.5 * age) * (1 - 0.55 * age ** 2)
        x0 = int(max(0, (P[:, 0] - r).min() - 30)); x1 = int(min(W, (P[:, 0] + r).max() + 30))
        y0 = int(max(0, (P[:, 1] - 2 * r).min() - 30)); y1 = int(min(H, (P[:, 1] + 2 * r).max() + 30))
        if x1 <= x0 or y1 <= y0:
            return
        col = np.zeros((y1 - y0, x1 - x0, 3), np.float32)
        den = np.zeros((y1 - y0, x1 - x0), np.float32)
        cols = fire_color(np.where(P[:, 7] > 0, age * 0.5, age))
        inten = (1 - age) ** 1.1 * (0.6 + 0.25 * self.rng.random(len(P)))
        for (px, py), rr, c, k in zip(P[:, :2], r, cols, inten):
            b = self.blob(rr); Ry, R = b.shape[0] // 2, b.shape[1] // 2
            ix, iy = int(px) - x0, int(py) - y0
            ax0, ay0, ax1, ay1 = max(0, ix - R), max(0, iy - Ry), min(x1 - x0, ix + R + 1), min(y1 - y0, iy + Ry + 1)
            if ax1 <= ax0 or ay1 <= ay0:
                continue
            bb = b[ay0 - (iy - Ry):ay1 - (iy - Ry), ax0 - (ix - R):ax1 - (ix - R)] * k
            col[ay0:ay1, ax0:ax1] += bb[..., None] * c
            den[ay0:ay1, ax0:ax1] += bb
        glow = cv2.GaussianBlur(col, (0, 0), 9)
        a = np.clip(den * 0.8, 0, 1)[..., None]
        roi = frame[y0:y1, x0:x1].astype(np.float32)
        roi = roi * (1 - 0.7 * a) + np.clip(col * 0.75, 0, 235) + glow * 0.45
        frame[y0:y1, x0:x1] = np.clip(roi, 0, 255).astype(np.uint8)


def build(plan, base, tl):
    tracks = {}
    for name, spec in (plan.get("tracks") or {}).items():
        tracks[name] = Track(spec, base, tl.clips[int(spec.get("clip", 0))])
    fx = []
    for spec in plan.get("trackfx", []):
        fx.append((spec, {"ring": Ring, "fire": Fire}[spec["type"]](spec)))
    return tracks, fx
