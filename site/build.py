#!/usr/bin/env python3
"""Build the E4L Marketing site.

Two targets are produced from the same sources:
  dist/ghl/      one self-contained HTML file per page, ready to paste into a
                 GoHighLevel funnel page (Custom Code element). Links use GHL
                 paths (/services, /pricing ...) and images use ASSET_BASE.
  dist/preview/  the same pages with relative links and local images, for
                 opening in a browser or publishing as a static preview.

Usage:  python3 site/build.py
"""
import re, pathlib, json, shutil

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / "src"
DIST = ROOT / "dist"
REPO = ROOT.parent

# ---------------------------------------------------------------------------
# Deployment config. Edit these once, rebuild, paste.
# ---------------------------------------------------------------------------
CONFIG = {
    # Where the Malik PNGs and the wordmark live when hosted. For GHL, upload
    # the files in assets/malik and assets/brand to the Media Library and put
    # that folder URL here (must end with a slash).
    "ASSET_BASE": "https://chosen1thegolden1.github.io/E4Lmarketing/assets/",
    # GHL inbound-webhook URLs (Workflow -> trigger: Inbound Webhook).
    "LEAD_WEBHOOK_URL": "",      # contact / "talk to Malik's team" form
    "AUDIT_WEBHOOK_URL": "",     # free AI visibility audit form
    # GHL calendar: public booking link and the embed URL for the iframe.
    "CALENDAR_URL": "https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call",
    "CALENDAR_EMBED_URL": "https://api.leadconnectorhq.com/widget/bookings/cs-game-plan-call",
    # Other destinations.
    "SCORECARD_URL": "/scorecard",
    # E4L School public site. Leave empty until it exists; the footer link hides itself.
    "SCHOOL_URL": "",
    "EMAIL": "chosen1@gsgagency.com",
    # Malik the chat agent (ElevenLabs Conversational AI). The widget loads on
    # every page when this is set; leave it empty to ship the site without it.
    "ELEVENLABS_AGENT_ID": "agent_3601m4czfzgrf8b9cnynhjzjqj8g",
    "SITE_NAME": "Eat 4 Life Marketing",
    # Show "from $X" floors on the site. Set to false to hide every dollar
    # figure and keep pricing on the Game Plan Call only.
    "SHOW_PRICES": True,
}

PAGES = [
    # (source file, GHL path, preview filename, <title>)
    ("home.html",     "/",         "index.html",    "Eat 4 Life Marketing | Your AI Guide"),
    ("systems.html",  "/systems",  "systems.html",  "Systems | Eat 4 Life Marketing"),
    ("creative.html", "/creative", "creative.html", "Creative | Eat 4 Life Marketing"),
    ("faq.html",      "/faq",      "faq.html",      "Questions | Eat 4 Life Marketing"),
    ("pricing.html",  "/pricing",  "pricing.html",  "How pricing works | Eat 4 Life Marketing"),
    ("book.html",     "/book",     "book.html",     "Book a Game Plan Call | Eat 4 Life Marketing"),
    ("thanks.html",   "/thanks",   "thanks.html",   "You're booked | Eat 4 Life Marketing"),
    ("404.html",      "/404",      "404.html",      "That page left | Eat 4 Life Marketing"),
]

LINKS_GHL = {"home": "/", "systems": "/systems", "creative": "/creative", "faq": "/faq",
             "pricing": "/pricing", "book": "/book", "thanks": "/thanks", "scorecard": CONFIG["SCORECARD_URL"]}
LINKS_PREVIEW = {"home": "index.html", "systems": "systems.html", "creative": "creative.html", "faq": "faq.html",
                 "pricing": "pricing.html", "book": "book.html", "thanks": "thanks.html", "scorecard": CONFIG["SCORECARD_URL"]}


def faq_html():
    """Render src/data/faqs.json into accordion markup. Add questions there."""
    import html as H
    groups = json.loads((SRC / "data" / "faqs.json").read_text(encoding="utf-8"))
    out = []
    n = 0
    for g in groups:
        out.append(f'<h2 class="faq-group" id="faq-{re.sub(r"[^a-z]+","-",g["group"].lower()).strip("-")}">{H.escape(g["group"])}</h2>')
        for it in g["items"]:
            n += 1
            out.append(
                f'<details class="faq" data-say="{H.escape(it.get("say",""), quote=True)}">'
                f'<summary><span class="n">{n:02d}</span><span class="q">{H.escape(it["q"])}</span><span class="pm" aria-hidden="true"></span></summary>'
                f'<div class="a"><p>{H.escape(it["a"])}</p></div></details>')
    return "\n".join(out)


def read(p):
    return (SRC / p).read_text(encoding="utf-8")


def render(template, ctx):
    # partials first so their placeholders get filled too
    def partial(m):
        return read("partials/" + m.group(1).strip() + ".html")
    out = re.sub(r"\{\{>\s*([\w-]+)\s*\}\}", partial, template)
    out = re.sub(r"\{\{>\s*([\w-]+)\s*\}\}", partial, out)  # nested partials
    # conditional blocks {{#SHOW_PRICES}}...{{/SHOW_PRICES}}
    def cond(m):
        key, body = m.group(1), m.group(2)
        return body if ctx.get(key) else ""
    out = re.sub(r"\{\{#(\w+)\}\}(.*?)\{\{/\1\}\}", cond, out, flags=re.S)
    def var(m):
        k = m.group(1)
        if k not in ctx:
            raise KeyError(f"unknown template variable {k}")
        return str(ctx[k])
    return re.sub(r"\{\{(\w+)\}\}", var, out)


def strip_doc(html):
    """Artifact hosting wraps the main page in its own document skeleton, so
    drop ours and keep only what belongs inside: title, links, style, body."""
    html = re.sub(r"<!DOCTYPE html>\s*<html[^>]*>\s*<head>\s*", "", html)
    html = re.sub(r"<meta charset=[^>]*>\s*", "", html)
    html = re.sub(r"<meta name=\"viewport\"[^>]*>\s*", "", html)
    html = html.replace("</head>\n<body style=\"margin:0;background:#FFFFFF\">", "")
    html = html.replace("</body>\n</html>", "")
    return html


def build():
    if DIST.exists():
        shutil.rmtree(DIST)
    (DIST / "ghl").mkdir(parents=True)
    (DIST / "preview" / "assets").mkdir(parents=True)
    (DIST / "artifact" / "assets").mkdir(parents=True)
    css = read("shared.css")
    js = read("shared.js")
    for src, ghl_path, preview_name, title in PAGES:
        page = read("pages/" + src)
        for target, links, asset_base, out_path in (
            ("ghl", LINKS_GHL, CONFIG["ASSET_BASE"], DIST / "ghl" / src),
            ("preview", LINKS_PREVIEW, "assets/", DIST / "preview" / preview_name),
            ("artifact", LINKS_PREVIEW, "assets/", DIST / "artifact" / preview_name),
        ):
            ctx = dict(CONFIG)
            ctx.update({"LINK_" + k.upper(): v for k, v in links.items()})
            ctx.update({"ASSET": asset_base, "TITLE": title, "TARGET": target, "FAQ_ITEMS": faq_html(),
                        "SHARED_CSS": css, "SHARED_JS": js,
                        "CONFIG_JSON": json.dumps({k: v for k, v in CONFIG.items()}),
                        # the hosted artifact preview blocks third-party scripts, so no widget there
                        "MALIK_CHAT": CONFIG["ELEVENLABS_AGENT_ID"] if target != "artifact" else "",
                        "ACTIVE_" + src.split(".")[0].upper(): "is-active"})
            for p in PAGES:
                ctx.setdefault("ACTIVE_" + p[0].split(".")[0].upper(), "")
            html = render(read("layout.html").replace("{{PAGE}}", page), ctx)
            if target == "artifact" and preview_name == "index.html":
                html = strip_doc(html)
            out_path.write_text(html, encoding="utf-8")
    # copy images for the preview and artifact targets
    for folder in ("malik", "brand"):
        srcdir = REPO / "assets" / folder
        if srcdir.exists():
            for tgt in ("preview", "artifact"):
                shutil.copytree(srcdir, DIST / tgt / "assets" / folder, dirs_exist_ok=True)
    print("built", len(PAGES), "pages ->", DIST)


if __name__ == "__main__":
    build()
