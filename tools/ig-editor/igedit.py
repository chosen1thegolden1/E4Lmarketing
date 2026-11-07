#!/usr/bin/env python3
"""
igedit — render an IG Story / Reel edit (1080x1920, 30 fps) from a JSON plan.

    python3 igedit.py plan.json            # render
    python3 igedit.py plan.json --preview  # also write a contact sheet PNG next to the output
    python3 igedit.py plan.json --from 4 --to 9   # render only part of the timeline (fast checks)

Plan format: see README.md in this folder. Paths in the plan are relative to the plan file.
"""
import argparse, functools, json, math, os, subprocess, sys, wave

import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, FPS, SR = 1080, 1920, 30, 48000
HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "assets")

FONTS = {
    "heavy": "Inter-Black.otf", "bold": "Inter-ExtraBold.otf", "condensed": "Anton.ttf",
    "serif": "InstrumentSerif.ttf", "script": "GreatVibes.ttf", "marker": "PermanentMarker.ttf",
}
COLORS = {
    "yellow": (255, 216, 77), "white": (255, 255, 255), "ink": (17, 17, 17), "black": (0, 0, 0),
    "cream": (244, 239, 227), "violet": (91, 61, 245), "red": (255, 59, 48), "green": (52, 199, 89),
    "gold": (233, 196, 106), "blue": (10, 132, 255),
}


def rgb(c, default="white"):
    if c is None:
        c = default
    if isinstance(c, (list, tuple)):
        return tuple(int(v) for v in c[:3])
    if c in COLORS:
        return COLORS[c]
    c = c.lstrip("#")
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))


@functools.lru_cache(None)
def font(name, size):
    path = FONTS.get(name, name)
    if not os.path.isabs(path):
        path = os.path.join(ASSETS, "fonts", path)
    return ImageFont.truetype(path, int(size))


# ---------------------------------------------------------------- easing
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))

def ease_out_cubic(p): return 1 - (1 - p) ** 3
def ease_in_cubic(p): return p ** 3
def ease_in_out_sine(p): return -(math.cos(math.pi * p) - 1) / 2
def ease_out_back(p, s=1.9):
    p -= 1
    return 1 + (s + 1) * p ** 3 + s * p ** 2
def ease_out_bounce(p):
    n, d = 7.5625, 2.75
    if p < 1 / d: return n * p * p
    if p < 2 / d: p -= 1.5 / d; return n * p * p + .75
    if p < 2.5 / d: p -= 2.25 / d; return n * p * p + .9375
    p -= 2.625 / d; return n * p * p + .984375


# ---------------------------------------------------------------- media io
def probe(src):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", src],
                         capture_output=True, text=True, check=True).stdout
    info = json.loads(out)
    v = next((s for s in info["streams"] if s["codec_type"] == "video"), None)
    has_audio = any(s["codec_type"] == "audio" for s in info["streams"])
    dur = float(info["format"].get("duration", 0) or 0)
    if v is None:
        return None, None, dur, has_audio
    w, h = int(v["width"]), int(v["height"])
    rot = 0
    for sd in v.get("side_data_list", []) or []:
        if "rotation" in sd:
            rot = int(float(sd["rotation"]))
    rot = int(v.get("tags", {}).get("rotate", rot) or rot)
    if abs(rot) % 180 == 90:
        w, h = h, w
    return w, h, dur, has_audio


class VideoReader:
    """Streams frames of src[t_in : t_in+dur] scaled to (w,h) at FPS. Holds the last frame after the end."""

    def __init__(self, src, t_in, dur, w=W, h=H, fit="cover", focus=(0.5, 0.5), grade=None, loop=False,
                 speed=1.0, interp=True):
        """dur is in SOURCE seconds. speed < 1 = slow motion (motion-interpolated when interp)."""
        self.w, self.h, self.last = w, h, None
        fx, fy = focus
        if fit == "blurpad":
            vf = (f"split[a][b];[a]scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},"
                  f"boxblur=40:2,eq=brightness=-0.08[bg];[b]scale={w}:{h}:force_original_aspect_ratio=decrease[fg];"
                  f"[bg][fg]overlay=(W-w)/2:(H-h)/2")
        elif fit == "contain":
            vf = (f"scale={w}:{h}:force_original_aspect_ratio=decrease,"
                  f"pad={w}:{h}:(ow-iw)/2:(oh-ih)/2:black")
        else:
            vf = (f"scale={w}:{h}:force_original_aspect_ratio=increase,"
                  f"crop={w}:{h}:(iw-{w})*{fx}:(ih-{h})*{fy}")
        if abs(speed - 1) > 1e-3:
            pre_f = f"setpts=(PTS-STARTPTS)/{speed},"
            pre_f += (f"minterpolate=fps={FPS}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1," if interp else f"fps={FPS},")
            vf = pre_f + vf
        vf += f",fps={FPS}"
        if grade:
            vf += "," + grade
        pre = ["-stream_loop", "-1"] if loop else []
        cmd = ["ffmpeg", "-v", "error", *pre, "-ss", f"{t_in:.3f}", "-t", f"{dur:.3f}", "-i", src,
               "-filter_complex" if fit == "blurpad" else "-vf", vf, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
        self.p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
        self.n = w * h * 3

    def read(self):
        buf = self.p.stdout.read(self.n) if self.p else b""
        if len(buf) == self.n:
            self.last = np.frombuffer(buf, np.uint8).reshape(self.h, self.w, 3).copy()
        elif self.last is None:
            self.last = np.zeros((self.h, self.w, 3), np.uint8)
        return self.last

    def close(self):
        if self.p:
            self.p.stdout.close(); self.p.kill(); self.p.wait(); self.p = None


def read_audio(src, t_in, dur, speed=1.0):
    """dur is in OUTPUT seconds; with speed != 1 the source span is dur*speed, slowed and pitched."""
    n = int(round(dur * SR))
    af = ["-af", f"asetrate={SR}*{speed},aresample={SR}"] if abs(speed - 1) > 1e-3 else []
    out = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t_in:.3f}", "-t", f"{dur * speed:.3f}", "-i", src,
                          "-vn", "-ac", "2", "-ar", str(SR), *af, "-f", "f32le", "-"], capture_output=True).stdout
    a = np.frombuffer(out, np.float32).reshape(-1, 2) if out else np.zeros((0, 2), np.float32)
    if len(a) < n:
        a = np.vstack([a, np.zeros((n - len(a), 2), np.float32)])
    return a[:n].copy()


# ---------------------------------------------------------------- sprites (RGBA uint8 numpy)
def pil_to_np(img):
    return np.array(img.convert("RGBA"))


def add_shadow(img, offset=(0, 8), blur=14, opacity=0.55, pad=40):
    w, h = img.size
    canvas = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    a = img.split()[3].point(lambda v: int(v * opacity))
    sh = Image.new("RGBA", img.size, (0, 0, 0, 255)); sh.putalpha(a)
    canvas.alpha_composite(sh, (pad + offset[0], pad + offset[1]))
    canvas = canvas.filter(ImageFilter.GaussianBlur(blur))
    canvas.alpha_composite(img, (pad, pad))
    return canvas


def text_image(text, fnt, size, fill, stroke=0, stroke_fill=(0, 0, 0), tracking=0.0, max_w=None,
               align="center", line_gap=0.05):
    f = font(fnt, size)
    words, lines = text.split(" "), []
    if max_w:
        cur = ""
        for wd in words:
            test = (cur + " " + wd).strip()
            if cur and measure(test, f, tracking) > max_w:
                lines.append(cur); cur = wd
            else:
                cur = test
        lines.append(cur)
    else:
        lines = text.split("\n")
    asc, desc = f.getmetrics()
    lh = int((asc + desc) * (1 + line_gap))
    widths = [measure(l, f, tracking) for l in lines]
    tw = int(max(widths) + stroke * 2 + 8)
    th = int(lh * len(lines) + stroke * 2 + 8)
    img = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    for i, (l, lw) in enumerate(zip(lines, widths)):
        x = {"center": (tw - lw) / 2, "left": stroke + 4, "right": tw - lw - stroke - 4}[align]
        y = stroke + 4 + i * lh
        if tracking:
            for ch in l:
                d.text((x, y), ch, font=f, fill=fill, stroke_width=stroke, stroke_fill=stroke_fill)
                x += f.getlength(ch) + tracking * size
        else:
            d.text((x, y), l, font=f, fill=fill, stroke_width=stroke, stroke_fill=stroke_fill)
    return img


def measure(s, f, tracking=0.0):
    if not tracking:
        return f.getlength(s)
    return sum(f.getlength(c) for c in s) + tracking * f.size * max(0, len(s) - 1)


def rounded_mask(w, h, r):
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, w - 1, h - 1], r, fill=255)
    return m


def frame_image(img, kind, radius=28, border=6, border_color=(255, 255, 255)):
    """Wrap an RGBA PIL image in a card / sticker / circle / polaroid frame."""
    img = img.convert("RGBA")
    w, h = img.size
    if kind == "card":
        b = border
        out = Image.new("RGBA", (w + 2 * b, h + 2 * b), (0, 0, 0, 0))
        bg = Image.new("RGBA", out.size, border_color + (255,))
        out.paste(bg, (0, 0), rounded_mask(*out.size, radius + b))
        inner = img.copy(); inner.putalpha(rounded_mask(w, h, radius))
        out.alpha_composite(inner, (b, b))
        return add_shadow(out, blur=18, opacity=0.5)
    if kind == "polaroid":
        b = max(14, w // 22)
        out = Image.new("RGBA", (w + 2 * b, h + b + b * 4), (250, 250, 246, 255))
        out.alpha_composite(img, (b, b))
        return add_shadow(out, blur=16, opacity=0.5)
    if kind == "circle":
        s = min(w, h)
        img = img.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s))
        b = border
        out = Image.new("RGBA", (s + 2 * b, s + 2 * b), (0, 0, 0, 0))
        d = ImageDraw.Draw(out); d.ellipse([0, 0, s + 2 * b - 1, s + 2 * b - 1], fill=border_color + (255,))
        m = Image.new("L", (s, s), 0); ImageDraw.Draw(m).ellipse([0, 0, s - 1, s - 1], fill=255)
        img.putalpha(m); out.alpha_composite(img, (b, b))
        return add_shadow(out, blur=16, opacity=0.5)
    if kind == "sticker":
        b = max(10, border * 2)
        pad = b + 4
        base = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0)); base.alpha_composite(img, (pad, pad))
        a = np.array(base.split()[3])
        k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * b + 1, 2 * b + 1))
        outline = cv2.dilate((a > 40).astype(np.uint8) * 255, k)
        outline = cv2.GaussianBlur(outline, (3, 3), 0)
        out = Image.new("RGBA", base.size, border_color + (0,)); out.putalpha(Image.fromarray(outline))
        out.alpha_composite(base)
        return add_shadow(out, blur=14, opacity=0.5)
    return img


def rotate_sprite(sp, deg):
    if not deg:
        return sp
    h, w = sp.shape[:2]
    M = cv2.getRotationMatrix2D((w / 2, h / 2), deg, 1.0)
    c, s = abs(M[0, 0]), abs(M[0, 1])
    nw, nh = int(h * s + w * c), int(h * c + w * s)
    M[0, 2] += nw / 2 - w / 2; M[1, 2] += nh / 2 - h / 2
    return cv2.warpAffine(sp, M, (nw, nh), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))


def blit(frame, sp, cx, cy, alpha=1.0, scale=1.0, rot=0.0, crop_x=1.0):
    """Alpha-blend sprite sp (RGBA) centered at (cx,cy) into frame (RGB uint8), in place."""
    if alpha <= 0.003 or scale <= 0.01:
        return
    if crop_x < 1.0:
        if crop_x <= 0.01:
            return
        ow = sp.shape[1]; cw = max(1, int(ow * crop_x)); sp = sp[:, :cw]
        cx -= (ow - cw) / 2 * scale
    if rot:
        sp = rotate_sprite(sp, rot)
    if abs(scale - 1) > 1e-3:
        sp = cv2.resize(sp, (max(1, int(sp.shape[1] * scale)), max(1, int(sp.shape[0] * scale))),
                        interpolation=cv2.INTER_AREA if scale < 1 else cv2.INTER_LINEAR)
    h, w = sp.shape[:2]
    x0, y0 = int(round(cx - w / 2)), int(round(cy - h / 2))
    fx0, fy0, fx1, fy1 = max(0, x0), max(0, y0), min(frame.shape[1], x0 + w), min(frame.shape[0], y0 + h)
    if fx1 <= fx0 or fy1 <= fy0:
        return
    s = sp[fy0 - y0:fy1 - y0, fx0 - x0:fx1 - x0].astype(np.float32)
    a = s[..., 3:4] * (alpha / 255.0)
    roi = frame[fy0:fy1, fx0:fx1].astype(np.float32)
    frame[fy0:fy1, fx0:fx1] = (roi * (1 - a) + s[..., :3] * a).astype(np.uint8)


# ---------------------------------------------------------------- subject matte
class Segmenter:
    def __init__(self):
        import mediapipe as mp
        from mediapipe.tasks import python as mpt
        from mediapipe.tasks.python import vision
        self.mp = mp
        opts = vision.ImageSegmenterOptions(
            base_options=mpt.BaseOptions(model_asset_path=os.path.join(ASSETS, "models", "selfie_segmenter.tflite")),
            output_confidence_masks=True, running_mode=vision.RunningMode.IMAGE)
        self.seg = vision.ImageSegmenter.create_from_options(opts)
        self.prev = None

    def __call__(self, rgb_img, smooth=True):
        im = self.mp.Image(image_format=self.mp.ImageFormat.SRGB, data=np.ascontiguousarray(rgb_img))
        m = self.seg.segment(im).confidence_masks[0].numpy_view().astype(np.float32)
        if m.shape[:2] != rgb_img.shape[:2]:
            m = cv2.resize(m, (rgb_img.shape[1], rgb_img.shape[0]))
        m = np.clip((m - 0.35) / 0.3, 0, 1)
        m = cv2.GaussianBlur(m, (7, 7), 0)
        if smooth and self.prev is not None and self.prev.shape == m.shape:
            m = 0.6 * m + 0.4 * self.prev
        self.prev = m
        return m


_SEG = None
def segmenter():
    global _SEG
    if _SEG is None:
        _SEG = Segmenter()
    return _SEG


def cutout_image(img):
    """Remove the background of a photo of a person (mediapipe selfie model)."""
    rgbimg = np.array(img.convert("RGB"))
    m = segmenter()(rgbimg, smooth=False)
    out = img.convert("RGBA"); out.putalpha(Image.fromarray((m * 255).astype(np.uint8)))
    bbox = out.getbbox()
    return out.crop(bbox) if bbox else out


# ---------------------------------------------------------------- sfx synthesis
def synth(kind, vol=1.0):
    rng = np.random.default_rng(7)
    if kind == "pop":
        n = int(.09 * SR); t = np.arange(n) / SR
        f = 380 + 900 * (t / t[-1])
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .028) * .7
    elif kind == "thud":
        n = int(.35 * SR); t = np.arange(n) / SR
        f = 95 * np.exp(-t / .12) + 40
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .11) * .95
        s += rng.normal(0, 1, n) * np.exp(-t / .012) * .25
    elif kind == "whoosh":
        n = int(.38 * SR); t = np.arange(n) / SR
        noise = rng.normal(0, 1, n)
        env = np.sin(np.pi * t / t[-1]) ** 2
        out, y = np.zeros(n), 0.0
        for i in range(n):  # one-pole lowpass with a sweeping cutoff
            a = .02 + .25 * (t[i] / t[-1])
            y += a * (noise[i] - y); out[i] = y
        s = out * env * 2.2
    elif kind == "hit":
        n = int(.18 * SR); t = np.arange(n) / SR
        s = rng.normal(0, 1, n) * np.exp(-t / .03) * .5 + np.sin(2 * np.pi * 60 * t) * np.exp(-t / .08) * .6
    elif kind == "tick":
        n = int(.025 * SR); t = np.arange(n) / SR
        s = np.sin(2 * np.pi * 2400 * t) * np.exp(-t / .004) * .5
    elif kind == "riser":
        n = int(.8 * SR); t = np.arange(n) / SR
        f = 200 + 1400 * (t / t[-1]) ** 2
        s = (np.sin(2 * np.pi * np.cumsum(f) / SR) * .25 + rng.normal(0, 1, n) * .15) * (t / t[-1]) ** 2
    else:
        return np.zeros((1, 2), np.float32)
    s = (s * vol).astype(np.float32)
    return np.stack([s, s], 1)


# ---------------------------------------------------------------- layers
ANIM_SFX = {"pop": "pop", "slam": "thud", "drop": "thud", "spin": "whoosh", "slide-left": "whoosh",
            "slide-right": "whoosh", "slide-up": "whoosh", "slide-down": "whoosh", "zoom": "pop",
            "wipe": "whoosh", "type": None, "fade": None, "none": None}


class Layer:
    def __init__(self, spec, base_dir):
        self.s = spec
        self.at = float(spec.get("at", 0))
        self.dur = float(spec.get("dur", 1.5))
        self.end = self.at + self.dur
        self.anim = spec.get("anim", "pop")
        self.anim_out = spec.get("out", "fade")
        self.in_d = float(spec.get("in_dur", 0.28 if self.anim != "type" else 0))
        self.out_d = float(spec.get("out_dur", 0.15))
        self.x = float(spec.get("x", 0.5)) * W
        self.y = float(spec.get("y", 0.5)) * H
        self.rot = float(spec.get("rotate", 0))
        self.float = bool(spec.get("float", False))
        self.behind = bool(spec.get("behind", False))
        self.base_dir = base_dir

    def active(self, t):
        return self.at <= t < self.end

    def state(self, t):
        """-> alpha, scale, dx, dy, rot, crop_x"""
        lt = t - self.at
        a, sc, dx, dy, rot, cx = 1.0, 1.0, 0.0, 0.0, 0.0, 1.0
        if self.in_d > 0 and lt < self.in_d:
            p = clamp(lt / self.in_d)
            an = self.anim
            if an == "pop":
                sc = max(0.0, ease_out_back(p)); a = clamp(p * 3)
            elif an == "slam":
                sc = 1 + 0.7 * (1 - ease_out_cubic(p)); a = clamp(p * 2.5)
            elif an == "zoom":
                sc = 1.35 - 0.35 * ease_out_cubic(p); a = clamp(p * 2)
            elif an == "fade":
                a = p; dy = 30 * (1 - ease_out_cubic(p))
            elif an == "drop":
                dy = -(1 - ease_out_bounce(p)) * 700; a = clamp(p * 4)
            elif an == "spin":
                sc = ease_out_back(p); rot = -200 * (1 - ease_out_cubic(p)); a = clamp(p * 3)
            elif an.startswith("slide-"):
                q = 1 - ease_out_back(p, 1.2)
                d = {"slide-left": (W, 0), "slide-right": (-W, 0), "slide-up": (0, H * .6), "slide-down": (0, -H * .6)}[an]
                dx, dy = d[0] * q, d[1] * q
            elif an == "wipe":
                cx = ease_out_cubic(p)
        rem = self.end - t
        if self.anim_out != "cut" and rem < self.out_d:
            q = clamp(rem / self.out_d)
            if self.anim_out == "pop":
                sc *= ease_in_cubic(q) * 0.3 + 0.7 * q; a *= q
            elif self.anim_out.startswith("slide-"):
                d = {"slide-left": (-W, 0), "slide-right": (W, 0), "slide-up": (0, -H * .6), "slide-down": (0, H * .6)}[self.anim_out]
                dx += d[0] * ease_in_cubic(1 - q); dy += d[1] * ease_in_cubic(1 - q)
            else:
                a *= q
        if self.float:
            dy += math.sin(2 * math.pi * lt / 2.4) * 9
            rot += math.sin(2 * math.pi * lt / 3.1) * 1.5
        return a, sc, dx, dy, rot, cx

    def sprite(self, t):
        raise NotImplementedError

    def draw(self, frame, t):
        a, sc, dx, dy, rot, cx = self.state(t)
        sp = self.sprite(t)
        if sp is not None:
            blit(frame, sp, self.x + dx, self.y + dy, a, sc, rot, cx)

    def sfx(self):
        k = self.s.get("sfx", ANIM_SFX.get(self.anim))
        return [(self.at, k)] if k else []


class TextLayer(Layer):
    STYLES = {
        # style: (font, size, fill, stroke, uppercase, tracking)
        "slam": ("heavy", 170, "white", 0, False, 0), "headline": ("heavy", 110, "white", 0, False, 0),
        "condensed": ("condensed", 220, "white", 0, True, 0), "label": ("bold", 42, "white", 0, True, .32),
        "script": ("script", 150, "gold", 0, False, 0), "serif": ("serif", 120, "white", 0, False, 0),
        "marker": ("marker", 110, "yellow", 0, False, 0), "bar": ("heavy", 96, "ink", 0, False, 0),
        "pill": ("heavy", 56, "ink", 0, False, 0), "box": ("heavy", 72, "white", 0, False, 0),
        "outline": ("heavy", 170, "white", 0, False, 0), "count": ("heavy", 180, "yellow", 0, False, 0),
    }

    def __init__(self, spec, base_dir):
        super().__init__(spec, base_dir)
        style = spec.get("style", "slam")
        f, size, fill, stroke, upper, track = self.STYLES.get(style, self.STYLES["slam"])
        self.style = style
        self.fnt = spec.get("font", f)
        self.size = spec.get("size", size)
        self.fill = rgb(spec.get("color"), fill)
        self.upper = spec.get("uppercase", upper)
        self.track = spec.get("tracking", track)
        self.max_w = spec.get("max_width", 0.88) * W
        self.bg = rgb(spec.get("bg"), "yellow" if style in ("bar", "pill") else "ink")
        if "anim" not in spec:
            self.anim = {"slam": "slam", "condensed": "slam", "outline": "slam", "bar": "wipe", "label": "fade",
                         "script": "fade", "serif": "fade", "count": "pop"}.get(style, "pop")
            self.in_d = float(spec.get("in_dur", 0.22 if self.anim == "slam" else 0.28))
        if self.anim == "type":
            self.type_cps = float(spec.get("cps", 22))
        self.cache = {}

    def _render(self, text):
        if text in self.cache:
            return self.cache[text]
        txt = text.upper() if self.upper else text
        if self.style == "outline":
            img = text_image(txt, self.fnt, self.size, (0, 0, 0, 0), stroke=6, stroke_fill=self.fill + (255,), max_w=self.max_w)
        else:
            stroke = int(self.s.get("stroke", 3 if self.style in ("script", "serif", "marker") else 0))
            img = text_image(txt, self.fnt, self.size, self.fill + (255,), tracking=self.track, max_w=self.max_w,
                             stroke=stroke, stroke_fill=rgb(self.s.get("stroke_color"), "ink") + (255,))
        if self.style in ("bar", "pill", "box"):
            px, py = (int(self.size * .35), int(self.size * .12)) if self.style == "bar" else (int(self.size * .5), int(self.size * .22))
            w, h = img.size
            bgimg = Image.new("RGBA", (w + 2 * px, h + 2 * py), (0, 0, 0, 0))
            r = int(self.size * (.12 if self.style == "bar" else .5 if self.style == "pill" else .2))
            ImageDraw.Draw(bgimg).rounded_rectangle([0, 0, bgimg.width - 1, bgimg.height - 1], r, fill=self.bg + (255,))
            bgimg.alpha_composite(img, (px, py))
            img = bgimg
        img = add_shadow(img, blur=12 if self.size > 80 else 8, opacity=.5)
        sp = rotate_sprite(pil_to_np(img), self.rot)
        self.cache[text] = sp
        return sp

    def sprite(self, t):
        text = str(self.s.get("text", ""))
        if self.anim == "type":
            n = int((t - self.at) * self.type_cps) + 1
            text = text[:max(1, n)]
        if self.style == "count":
            p = ease_out_cubic(clamp((t - self.at) / float(self.s.get("count_dur", 0.9))))
            a, b = float(self.s.get("from", 0)), float(self.s.get("to", 100))
            v = a + (b - a) * p
            dec = int(self.s.get("decimals", 0))
            num = f"{v:,.{dec}f}"
            text = f"{self.s.get('prefix', '')}{num}{self.s.get('suffix', '')}"
        return self._render(text)

    def sfx(self):
        ev = super().sfx()
        if self.anim == "type":
            n = len(str(self.s.get("text", "")))
            ev += [(self.at + i / self.type_cps, "tick") for i in range(0, n, 2)]
        return ev


class ImageLayer(Layer):
    def __init__(self, spec, base_dir):
        super().__init__(spec, base_dir)
        self.src = os.path.join(base_dir, spec["src"])
        self.wpx = int(float(spec.get("w", 0.5)) * W)
        self.kind = spec.get("frame", "card")
        self.is_video = os.path.splitext(self.src)[1].lower() in (".mp4", ".mov", ".m4v", ".webm", ".mkv")
        self.reader, self.static = None, None
        self.border_color = rgb(spec.get("border_color"), "white")
        if not self.is_video:
            img = Image.open(self.src).convert("RGBA")
            if spec.get("cutout"):
                img = cutout_image(img)
            img = img.resize((self.wpx, max(1, int(img.height * self.wpx / img.width))), Image.LANCZOS)
            img = frame_image(img, self.kind, radius=int(spec.get("radius", 28)), border=int(spec.get("border", 6)),
                              border_color=self.border_color)
            self.static = rotate_sprite(pil_to_np(img), self.rot)
        else:
            vw, vh, vdur, _ = probe(self.src)
            aspect = spec.get("aspect")  # e.g. 0.5625 to force 9:16
            hpx = int(self.wpx / aspect) if aspect else int(self.wpx * vh / vw)
            self.vsize = (self.wpx - self.wpx % 2, hpx - hpx % 2)
            self.v_in = float(spec.get("in", 0))
            self.mask = None

    def sprite(self, t):
        if self.static is not None:
            return self.static
        if self.reader is None:
            self.reader = VideoReader(self.src, self.v_in, self.dur + 1, *self.vsize, loop=True)
        fr = self.reader.read()
        w, h = self.vsize
        r = int(self.s.get("radius", 28)); b = int(self.s.get("border", 6)) if self.kind == "card" else 0
        if self.mask is None:
            self.mask = np.array(rounded_mask(w, h, r if self.kind == "card" else 0))
            sh = Image.new("RGBA", (w + 2 * b + 80, h + 2 * b + 80), (0, 0, 0, 0))
            box = Image.new("RGBA", (w + 2 * b, h + 2 * b), self.border_color + (255,))
            sh.paste(Image.new("RGBA", box.size, (0, 0, 0, 120)), (40, 48), rounded_mask(*box.size, r + b))
            sh = sh.filter(ImageFilter.GaussianBlur(18))
            sh.paste(box, (40, 40), rounded_mask(*box.size, r + b))
            self.frame_bg = np.array(sh)
        sp = self.frame_bg.copy()
        rgba = np.dstack([fr, self.mask])
        y0, x0 = 40 + b, 40 + b
        a = rgba[..., 3:4] / 255.0
        sp[y0:y0 + h, x0:x0 + w, :3] = (sp[y0:y0 + h, x0:x0 + w, :3] * (1 - a) + fr * a).astype(np.uint8)
        sp[y0:y0 + h, x0:x0 + w, 3] = np.maximum(sp[y0:y0 + h, x0:x0 + w, 3], rgba[..., 3])
        return rotate_sprite(sp, self.rot)


# ---------------------------------------------------------------- captions
STOP = set("""a an the and or but so to of in on at for with from by is are was were be been am i you he she it we they
me my your our their this that these those just really very can could should would will do does did not no yes if then
than as like about into out up down over get got have has had its it's i'm you're we're they're what when where who how
why all any some more most much many one two because there here also too even still now""".split())


def chunk_words(words, max_words=3, max_gap=0.3, max_len=1.3):
    groups, cur = [], []
    for w in words:
        if cur and (len(cur) >= max_words or w["start"] - cur[-1]["end"] > max_gap or w["end"] - cur[0]["start"] > max_len):
            groups.append(cur); cur = []
        cur.append(w)
        if w["word"].rstrip()[-1:] in ".?!,;:":
            groups.append(cur); cur = []
    if cur:
        groups.append(cur)
    return groups


class Captions:
    def __init__(self, cfg, words):
        self.cfg = cfg
        self.size = int(cfg.get("size", 84))
        self.y = float(cfg.get("y", 0.66)) * H
        self.fnt = cfg.get("font", "heavy")
        self.upper = cfg.get("uppercase", False)
        self.hl = rgb(cfg.get("highlight"), "yellow")
        self.color = rgb(cfg.get("color"), "white")
        self.style = cfg.get("style", "pop")  # pop | box | karaoke
        self.hide = [tuple(r) for r in cfg.get("hide", [])]
        kws = {k.lower().strip(".,!?") for k in cfg.get("keywords", [])}
        self.groups = chunk_words(words, int(cfg.get("max_words", 3)))
        self.key = {}
        for gi, g in enumerate(self.groups):
            idx = [i for i, w in enumerate(g) if clean(w["word"]) in kws]
            if not idx and cfg.get("auto_keywords", True):
                cand = [(len(clean(w["word"])), i) for i, w in enumerate(g)
                        if clean(w["word"]) not in STOP and len(clean(w["word"])) >= 4]
                if cand and (gi % 2 == 0 or max(cand)[0] >= 7):
                    idx = [max(cand)[1]]
            self.key[gi] = set(idx)
        self.cache = {}

    def word_sprite(self, text, col, boxed):
        k = (text, col, boxed)
        if k not in self.cache:
            t = text.upper() if self.upper else text
            img = text_image(t, self.fnt, self.size, (self.hl if boxed else col) + (255,) if not boxed else rgb("ink") + (255,),
                             stroke=0 if boxed else 4, stroke_fill=(0, 0, 0, 200))
            if boxed:
                px, py = int(self.size * .18), int(self.size * .06)
                bg = Image.new("RGBA", (img.width + 2 * px, img.height + 2 * py), (0, 0, 0, 0))
                ImageDraw.Draw(bg).rounded_rectangle([0, 0, bg.width - 1, bg.height - 1], int(self.size * .2), fill=self.hl + (255,))
                bg.alpha_composite(img, (px, py)); img = bg
            self.cache[k] = pil_to_np(add_shadow(img, offset=(0, 5), blur=9, opacity=.6, pad=24))
        return self.cache[k]

    def draw(self, frame, t):
        if any(a <= t < b for a, b in self.hide):
            return
        for gi, g in enumerate(self.groups):
            g_end = g[-1]["end"] + 0.12
            nxt = self.groups[gi + 1][0]["start"] if gi + 1 < len(self.groups) else g_end + 1
            if g[0]["start"] <= t < min(max(g_end, g[0]["start"] + .35), nxt):
                self._draw_group(frame, t, gi, g)
                return

    def _draw_group(self, frame, t, gi, g):
        vis = [w for w in g if w["start"] <= t] if self.style != "karaoke" else g
        sprites = []
        for i, w in enumerate(vis):
            is_key = i in self.key[gi]
            active = self.style == "karaoke" and w["start"] <= t < w["end"] + .05
            if self.style == "box":
                sp = self.word_sprite(w["word"].strip(), self.color, is_key)
            else:
                col = self.hl if (is_key or active) else self.color
                if self.style == "karaoke" and w["start"] > t:
                    col = tuple(int(c * .75) for c in self.color)
                sp = self.word_sprite(w["word"].strip(), col, False)
            sprites.append((w, sp))
        gap = -2 * 24 + int(self.size * .26)  # sprites carry 24px shadow padding each side
        max_w = W * .9
        lines, cur, cw = [], [], 0
        for w, sp in sprites:
            sw = sp.shape[1]
            if cur and cw + gap + sw > max_w:
                lines.append(cur); cur, cw = [], 0
            cur.append((w, sp)); cw += (gap if cw else 0) + sw
        if cur:
            lines.append(cur)
        lh = int(self.size * 1.12)
        y = self.y - (len(lines) - 1) * lh / 2
        for line in lines:
            tw = sum(sp.shape[1] for _, sp in line) + gap * (len(line) - 1)
            x = W / 2 - tw / 2
            for w, sp in line:
                p = clamp((t - w["start"]) / 0.13)
                sc = 0.72 + 0.28 * ease_out_back(p) if self.style != "karaoke" else 1.0
                blit(frame, sp, x + sp.shape[1] / 2, y, clamp(p * 3) if self.style != "karaoke" else 1, sc)
                x += sp.shape[1] + gap
            y += lh


def clean(w):
    return w.lower().strip().strip(".,!?;:\"'")


def transcribe(wav_path, model="base.en"):
    from faster_whisper import WhisperModel
    m = WhisperModel(model, device="cpu", compute_type="int8")
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", wav_path, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    audio = np.frombuffer(raw, np.float32).copy()
    segs, _ = m.transcribe(audio, word_timestamps=True, vad_filter=True)
    words = []
    for s in segs:
        for w in s.words or []:
            words.append({"word": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)})
    return words


# ---------------------------------------------------------------- timeline
class Timeline:
    def __init__(self, plan, base):
        self.base = base
        self.grade = {"punchy": "eq=contrast=1.07:saturation=1.18:brightness=0.01",
                      "warm": "eq=contrast=1.05:saturation=1.1,colorbalance=rs=.04:bs=-.04",
                      "cool": "eq=contrast=1.06:saturation=1.05,colorbalance=rs=-.03:bs=.04",
                      "bw": "hue=s=0,eq=contrast=1.15", None: None}.get(plan.get("look"), plan.get("look"))
        self.clips, t = [], 0.0
        for c in plan["clips"]:
            src = os.path.join(base, c["src"])
            vw, vh, vdur, has_audio = probe(src)
            t_in = float(c.get("in", 0))
            t_out = float(c.get("out", vdur if vdur else t_in + float(c.get("dur", 3))))
            if "dur" in c and "out" not in c:
                t_out = t_in + float(c["dur"])
            is_img = vw is not None and vdur < 0.1
            speed = float(c.get("speed", 1.0))
            clip = dict(src=src, t_in=t_in, dur=(t_out - t_in) / speed, speed=speed, interp=c.get("interp", True),
                        grade=c.get("grade"), start=t, fit=c.get("fit", "cover"),
                        focus=tuple(c.get("focus", [0.5, 0.5])), zoom=float(c.get("zoom", 1.0)),
                        transition=c.get("transition", "cut"), volume=float(c.get("volume", 1.0)),
                        has_audio=has_audio and not c.get("mute"), still=is_img, kenburns=c.get("kenburns"), zoom_focus=c.get("zoom_focus"))
            self.clips.append(clip)
            t += clip["dur"]
        self.duration = t

    def clip_at(self, t):
        for i, c in enumerate(self.clips):
            if c["start"] <= t < c["start"] + c["dur"]:
                return i
        return len(self.clips) - 1

    def audio(self):
        parts = []
        for c in self.clips:
            n = int(round(c["dur"] * SR))
            if c["has_audio"]:
                a = read_audio(c["src"], c["t_in"], c["dur"], c["speed"]) * c["volume"]
                f = min(len(a) // 2, int(.012 * SR))  # de-click
                if f:
                    ramp = np.linspace(0, 1, f, dtype=np.float32)[:, None]
                    a[:f] *= ramp; a[-f:] *= ramp[::-1]
            else:
                a = np.zeros((n, 2), np.float32)
            parts.append(a[:n] if len(a) >= n else np.vstack([a, np.zeros((n - len(a), 2), np.float32)]))
        return np.vstack(parts) if parts else np.zeros((0, 2), np.float32)


def warp(frame, s, cx, cy, dx=0, dy=0):
    if abs(s - 1) < 1e-3 and abs(dx) < .5 and abs(dy) < .5:
        return frame
    M = np.float32([[s, 0, (1 - s) * cx + dx], [0, s, (1 - s) * cy + dy]])
    return cv2.warpAffine(frame, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)


def zoom_blur(frame, s, cx, cy, amount, k=6):
    acc = np.zeros_like(frame, np.float32)
    for i in range(k):
        acc += warp(frame, s * (1 + amount * i / k), cx, cy)
    return (acc / k).astype(np.uint8)


# ---------------------------------------------------------------- render
def render(plan_path, t_from=None, t_to=None, preview=False):
    plan = json.load(open(plan_path))
    base = os.path.dirname(os.path.abspath(plan_path))
    out = os.path.join(base, plan.get("output", "out.mp4"))
    tl = Timeline(plan, base)
    dur = float(plan.get("duration", tl.duration))
    t0 = float(t_from or 0); t1 = float(t_to or dur)
    nframes = int(round((t1 - t0) * FPS))
    print(f"[igedit] timeline {dur:.2f}s, rendering {t0:.2f}-{t1:.2f}s ({nframes} frames)")

    # audio first (captions may need it)
    speech = tl.audio()
    speech = speech[:int(dur * SR)]
    tmp = out + ".tmp"
    os.makedirs(tmp, exist_ok=True)

    layers = []
    for spec in plan.get("images", []):
        layers.append(ImageLayer(spec, base))
    for spec in plan.get("texts", []):
        layers.append(TextLayer(spec, base))
    layers.sort(key=lambda l: l.s.get("z", 0))

    caps = None
    cfg = plan.get("captions")
    if cfg:
        words = cfg.get("words")
        if words is None and cfg.get("auto"):
            wav = os.path.join(tmp, "speech.wav"); write_wav(wav, speech)
            print("[igedit] transcribing for captions…")
            words = transcribe(wav, cfg.get("model", "base.en"))
            json.dump(words, open(os.path.join(base, os.path.splitext(plan.get("output", "out.mp4"))[0] + ".words.json"), "w"), indent=1)
        if words:
            for spec in plan.get("texts", []) + plan.get("images", []):
                if spec.get("hide_captions"):
                    cfg.setdefault("hide", []).append([spec.get("at", 0), spec.get("at", 0) + spec.get("dur", 1.5)])
            caps = Captions(cfg, words)

    # camera moves
    zooms = list(plan.get("zooms", []))
    shakes = list(plan.get("shakes", []))
    for l in layers:
        if l.anim == "slam" and l.s.get("shake", True):
            shakes.append({"at": l.at + l.in_d * .8, "dur": .18, "amount": 14})
    flashes = list(plan.get("flashes", []))
    import trackfx
    tracks, tfx = trackfx.build(plan, base, tl)
    follows = [z for z in zooms if z.get("type") == "follow"]
    zooms = [z for z in zooms if z.get("type") != "follow"]

    def camera(t):
        s, dx, dy = 1.0, 0.0, 0.0
        cx, cy = W / 2, H * .42
        for z in zooms:
            at, d = float(z["at"]), float(z.get("dur", 1.0))
            if not at <= t < at + d:
                continue
            sc = float(z.get("scale", 1.2)); typ = z.get("type", "punch")
            fc = z.get("focus", [0.5, 0.42]); cx, cy = fc[0] * W, fc[1] * H
            lt = t - at
            if typ == "punch":
                ramp_in, ramp_out = .1, float(z.get("release", .12))
                p = ease_out_cubic(clamp(lt / ramp_in)) * (1 if lt < d - ramp_out else clamp((at + d - t) / ramp_out))
                s *= 1 + (sc - 1) * p
            elif typ == "slow":
                s *= 1 + (sc - 1) * ease_in_out_sine(clamp(lt / d))
            elif typ == "out":
                s *= sc - (sc - 1) * ease_out_cubic(clamp(lt / d))
        for sh in shakes:
            at, d = float(sh["at"]), float(sh.get("dur", .25))
            if at <= t < at + d:
                amt = float(sh.get("amount", 12)) * (1 - (t - at) / d)
                ph = (t - at) * 90
                dx += math.sin(ph * 1.7) * amt; dy += math.cos(ph * 2.3) * amt
                s *= 1.02
        return s, cx, cy, dx, dy

    seg_needed = any(l.behind for l in layers)
    readers = {}
    vw = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                           "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
                           "-pix_fmt", "yuv420p", os.path.join(tmp, "video.mp4")], stdin=subprocess.PIPE)
    sheet = []
    for fi in range(nframes):
        t = t0 + fi / FPS
        ci = tl.clip_at(t)
        c = tl.clips[ci]
        for k in list(readers):
            if k < ci:
                readers.pop(k).close()
        if ci not in readers:
            lt = max(0.0, t - c["start"])
            if c["still"]:
                readers[ci] = VideoReader(c["src"], 0, c["dur"] + 1, fit=c["fit"], focus=c["focus"], grade=tl.grade, loop=True)
            else:
                g = tl.grade
                if c["grade"]:
                    g = {"replay": "eq=saturation=0.8:contrast=1.12:brightness=-0.02,vignette=PI/4.5"}.get(c["grade"], c["grade"])
                sp = c["speed"]
                readers[ci] = VideoReader(c["src"], c["t_in"] + lt * sp, (c["dur"] - lt) * sp + .5, fit=c["fit"],
                                          focus=c["focus"], grade=g, speed=sp, interp=c["interp"])
        frame = readers[ci].read()
        A = np.float32([[1, 0, 0], [0, 1, 0]])
        for z in follows:
            if float(z["at"]) <= t < float(z["at"]) + float(z.get("dur", 1e9)) and z["track"] in tracks:
                Af = trackfx.follow_affine(z, tracks[z["track"]], t)
                if Af is not None:
                    A = Af
                    frame = cv2.warpAffine(frame, A, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)

        s, cx, cy, dx, dy = camera(t)
        s *= c["zoom"]
        if c["zoom_focus"] and not any(float(z["at"]) <= t < float(z["at"]) + float(z.get("dur", 1)) and "focus" in z for z in zooms):
            cx, cy = c["zoom_focus"][0] * W, c["zoom_focus"][1] * H
        if c["kenburns"]:
            kb = c["kenburns"]
            k0, k1 = (float(kb[0]), float(kb[1])) if isinstance(kb, (list, tuple)) else (1.0, float(kb))
            p = ease_in_out_sine(clamp((t - c["start"]) / c["dur"]))
            s *= k0 + (k1 - k0) * p
        blur_amt, mblur, flash = 0.0, 0, 0.0
        # transition out of this clip (owned by the next clip)
        if ci + 1 < len(tl.clips):
            nxt = tl.clips[ci + 1]; T = nxt["start"]; tr = nxt["transition"]; r = T - t
            if tr == "punch" and r < .2:
                p = ease_in_cubic(1 - r / .2); s *= 1 + .55 * p; blur_amt = .08 * p
            elif tr == "whip" and r < .15:
                p = ease_in_cubic(1 - r / .15); dx -= W * .6 * p; mblur = int(120 * p)
            elif tr == "zoomblur" and r < .2:
                p = ease_in_cubic(1 - r / .2); s *= 1 + .3 * p; blur_amt = .12 * p
            elif tr == "flash" and r < .1:
                flash = 1 - r / .1
        tr, T = c["transition"], c["start"]
        lt = t - T
        if ci > 0:
            if tr == "punch" and lt < .22:
                p = ease_out_cubic(lt / .22); s *= 1.18 - .18 * p; blur_amt = max(blur_amt, .06 * (1 - p))
            elif tr == "whip" and lt < .15:
                p = ease_out_cubic(lt / .15); dx += W * .6 * (1 - p); mblur = max(mblur, int(120 * (1 - p)))
            elif tr == "zoomblur" and lt < .22:
                p = ease_out_cubic(lt / .22); s *= 1.25 - .25 * p; blur_amt = max(blur_amt, .1 * (1 - p))
            elif tr == "flash" and lt < .18:
                flash = max(flash, 1 - lt / .18)
            elif tr == "glitch" and lt < .2:
                pass
        if blur_amt > 0.005:
            frame = zoom_blur(frame, s, cx, cy, blur_amt)
        else:
            frame = warp(frame, s, cx, cy, dx, dy)
        if mblur > 2:
            frame = cv2.blur(frame, (mblur, 1))
        if tr == "glitch" and ci > 0 and lt < .2:
            o = int(30 * (1 - lt / .2))
            frame = frame.copy(); frame[..., 0] = np.roll(frame[..., 0], o, 1); frame[..., 2] = np.roll(frame[..., 2], -o, 1)
        frame = np.ascontiguousarray(frame)
        if tfx:
            B = np.float32([[s, 0, (1 - s) * cx + dx], [0, s, (1 - s) * cy + dy]])
            M = np.hstack([B[:, :2] @ A[:, :2], (B[:, :2] @ A[:, 2] + B[:, 2])[:, None]]).astype(np.float32)
            for spec, fxo in tfx:
                if fxo.at <= t < fxo.at + fxo.dur + 1.0:
                    box = tracks[spec["track"]].at(t) if spec["track"] in tracks else None
                    if box is not None:
                        fxo.draw(frame, t, box, M)

        active = [l for l in layers if l.active(t)]
        if seg_needed and any(l.behind for l in active):
            orig = frame.copy()
            matte = segmenter()(frame)[..., None]
            for l in active:
                if l.behind:
                    l.draw(frame, t)
            frame = (orig * matte + frame * (1 - matte)).astype(np.uint8)
        for l in active:
            if not l.behind:
                l.draw(frame, t)
        if caps:
            caps.draw(frame, t)
        for fl in flashes:
            if fl["at"] <= t < fl["at"] + fl.get("dur", .15):
                flash = max(flash, 1 - (t - fl["at"]) / fl.get("dur", .15))
        if flash > 0:
            frame = (frame * (1 - .85 * flash) + 255 * .85 * flash).astype(np.uint8)
        if plan.get("progress_bar"):
            bw = int(W * (t / dur)); frame[0:10, :bw] = rgb(plan.get("progress_color"), "yellow")
        vw.stdin.write(frame.tobytes())
        if preview and fi % max(1, nframes // 24) == 0:
            sheet.append(cv2.resize(frame, (270, 480)))
        if fi % 30 == 0:
            print(f"\r[igedit] {fi}/{nframes}", end="", flush=True)
    for r in readers.values():
        r.close()
    for l in layers:
        if isinstance(l, ImageLayer) and l.reader:
            l.reader.close()
    vw.stdin.close(); vw.wait()
    print()

    # audio mix
    n = int(round((t1 - t0) * SR))
    mix = speech[int(t0 * SR):int(t0 * SR) + n].copy()
    if len(mix) < n:
        mix = np.vstack([mix, np.zeros((n - len(mix), 2), np.float32)])
    sv = float(plan.get("sfx_volume", 0.35))
    if plan.get("sfx", True):
        events = [ev for l in layers for ev in l.sfx()]
        for c in tl.clips[1:]:
            if c["transition"] in ("punch", "whip", "zoomblur"):
                events.append((c["start"] - .2, "whoosh"))
            elif c["transition"] in ("flash", "glitch"):
                events.append((c["start"], "hit"))
        events += [(e["at"], e["kind"]) for e in plan.get("sfx_events", [])]
        events += [(f["at"], "hit") for f in plan.get("trackfx", []) if f["type"] == "fire"]
        events += [(f["at"], "whoosh") for f in plan.get("trackfx", []) if f["type"] == "ring"]
        for at, kind in events:
            s = synth(kind, sv); i = int((at - t0) * SR)
            if i < 0 or i >= n:
                continue
            j = min(n, i + len(s)); mix[i:j] += s[:j - i]
    mus = plan.get("music")
    if mus:
        m = read_audio(os.path.join(base, mus["src"]), float(mus.get("in", 0)) + t0, t1 - t0) * float(mus.get("volume", .18))
        fo = int(float(mus.get("fade_out", 1.0)) * SR)
        if fo:
            m[-fo:] *= np.linspace(1, 0, fo, dtype=np.float32)[:, None]
        mix += m[:n]
    mix = np.tanh(mix * 1.1) / np.tanh(1.1)
    wav = os.path.join(tmp, "mix.wav"); write_wav(wav, mix)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(tmp, "video.mp4"), "-i", wav, "-c:v", "copy",
                    "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out], check=True)
    if preview and sheet:
        while len(sheet) % 6:
            sheet.append(np.zeros_like(sheet[0]))
        rows = [np.hstack(sheet[i:i + 6]) for i in range(0, len(sheet), 6)]
        cv2.imwrite(os.path.splitext(out)[0] + "_sheet.jpg", cv2.cvtColor(np.vstack(rows), cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 85])
    print(f"[igedit] wrote {out}")
    return out


def write_wav(path, a):
    a = np.clip(a, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((a * 32767).astype(np.int16).tobytes())


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("plan")
    ap.add_argument("--from", dest="t_from", type=float)
    ap.add_argument("--to", dest="t_to", type=float)
    ap.add_argument("--preview", action="store_true")
    a = ap.parse_args()
    render(a.plan, a.t_from, a.t_to, a.preview)
