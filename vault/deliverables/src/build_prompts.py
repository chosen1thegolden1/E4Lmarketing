"""Build the buyer-facing 100 Prompts PDF from vault/content/prompts/*.md.
Run from anywhere: python3 vault/deliverables/src/build_prompts.py
Needs WeasyPrint plus the Rethink Sans and Space Mono fonts installed."""
import re, html, pathlib
from weasyprint import HTML

SRC = pathlib.Path(__file__).resolve().parent
VAULT = SRC.parents[1]
OUT = SRC.parent

ROOMS = [  # file, room name as sold on the page, short pitch
    ("02-email.md", "Email and text", "Speed-to-lead, missed-call text-backs, follow-ups and win-backs."),
    ("04-offers.md", "Offers and sales", "Build the offer, price it in three tiers, handle the objections."),
    ("03-content.md", "Content", "A 30-day calendar, scripts, carousels and captions in your voice."),
    ("05-analytics.md", "Analytics", "Read your numbers, find the leak, pick the one move that matters."),
    ("01-ads.md", "Ads", "Write the ad, test it on $10 a day, judge it after 7 days."),
]

def esc(s): return html.escape(s, quote=False)

def inline(s):
    s = esc(s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"`([^`]+)`", r'<span class="c">\1</span>', s)
    return s

def parse(path):
    text = path.read_text()
    title = re.search(r"^# (.+)$", text, re.M).group(1).strip()
    head, *blocks = re.split(r"^### ", text, flags=re.M)
    intro = " ".join(l for l in head.splitlines()[1:] if l.strip() and not l.startswith("---"))
    prompts = []
    for b in blocks:
        first, rest = b.split("\n", 1)
        pid, ptitle = first.split(" ", 1)
        code = re.search(r"```text\n(.*?)\n```", rest, re.S).group(1)
        def field(name):
            m = re.search(r"\*\*" + re.escape(name) + r":\*\*\s*(.+)", rest)
            return m.group(1).strip() if m else ""
        prompts.append(dict(id=pid, title=ptitle.strip(), use=field("Use it when"), get=field("You'll get"),
                            works=field("Works in"), tip=field("Pro tip"), code=code))
    return title, intro, prompts

def code_html(code):
    c = esc(code)
    return re.sub(r"\[([^\]\n]+)\]", r'<span class="b">[\1]</span>', c)

rooms = []
for i, (fn, name, pitch) in enumerate(ROOMS, 1):
    _, intro, prompts = parse(VAULT / "content" / "prompts" / fn)
    rooms.append(dict(n=i, name=name, pitch=pitch, intro=intro, prompts=prompts, anchor=f"room{i}"))
assert sum(len(r["prompts"]) for r in rooms) == 100

css_extra = """
.toc-room{break-inside:avoid;margin-bottom:12px}
.toc-room h3{font-size:12pt;white-space:nowrap;display:flex;justify-content:space-between;border-bottom:2px solid var(--ink);padding-bottom:4px;margin-bottom:4px}
.toc-room h3 a{color:inherit;text-decoration:none}
.toc-room h3 span.num{color:var(--gold-ink);font-family:'Space Mono',monospace;font-size:10pt}
.toc{columns:2;column-gap:.35in}
.toc a.row{display:flex;gap:8px;color:var(--ink);text-decoration:none;font-size:8.2pt;line-height:1.25;padding:1.5px 0;border-bottom:1px dotted var(--line)}
.toc a.row b{font-family:'Space Mono',monospace;font-size:7.6pt;color:var(--gold-ink);flex:0 0 .45in}
.toc a.row span{flex:1}
.toc a.row i{font-style:normal;font-family:'Space Mono',monospace;font-size:7.6pt;color:var(--muted);padding-left:4px}
.room-open{break-before:page;string-set:room attr(data-room)}
.room-head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid var(--ink);padding-bottom:10px;margin-bottom:12px}
.room-head h2{font-size:32pt}
.room-head .num{font-family:'Space Mono',monospace;font-size:46pt;font-weight:700;color:var(--gold);line-height:1}
.room-intro{font-size:11.5pt;color:var(--muted);margin-bottom:16px}
.prompt{background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-bottom:14px;break-inside:avoid}
.prompt .id{display:inline-block;font-family:'Space Mono',monospace;font-weight:700;font-size:8.5pt;background:var(--gold);padding:2px 8px;border-radius:999px;margin-bottom:6px}
.prompt h3{font-size:14pt;margin-bottom:8px;break-after:avoid}
.prompt .meta{font-size:9.6pt;color:var(--muted);margin-bottom:3px}
.prompt .meta b{color:var(--ink)}
.prompt .copy{font-family:'Space Mono',monospace;font-size:7.4pt;text-transform:uppercase;letter-spacing:.06em;color:var(--gold-ink);margin:9px 0 4px}
.prompt pre{font-family:'Space Mono',monospace;font-size:8pt;line-height:1.5;white-space:pre-wrap;background:var(--ink);color:#EDEAE0;border-radius:9px;padding:11px 13px}
.prompt pre .b{color:var(--gold);font-weight:700}
.prompt .tip{margin-top:9px;font-size:9.6pt;background:#FFF6D6;border-radius:8px;padding:8px 11px}
.prompt .tip b{font-family:'Space Mono',monospace;text-transform:uppercase;font-size:7.8pt;color:var(--gold-ink);margin-right:6px}
.rooms5{display:flex;gap:7px;margin-top:16px}
.rooms5 div{flex:1;background:var(--ink);color:#fff;border-radius:10px;padding:10px 9px;font-size:8.6pt;line-height:1.3}
.rooms5 b{display:block;color:var(--gold);font-size:10.5pt;margin-bottom:3px}
"""

def build(PAGES):
  parts = [f"""<!doctype html><html><head><meta charset="utf-8"><title>E4L Vault: 100 Prompts</title>
<link rel="stylesheet" href="brand.css"><style>{css_extra}</style></head><body>
<span class="docname">E4L Vault · 100 Prompts</span>
<section class="cover">
  <img class="art" src="../../malik-vault.jpg" alt="">
  <div class="top">
    <img class="wm" src="../../wordmark-gold.png" alt="E4L">
    <span class="badge">E4L Vault · The Prompt Library</span>
    <h1>Your whole marketing<br>department, in <span>100 prompts.</span></h1>
    <p>Five rooms: email and text, offers and sales, content, analytics and ads. Copy one, fill in your business, paste it into ChatGPT, Claude or Gemini.</p>
  </div>
</section>

<section>
  <span class="kicker">Start here</span>
  <h2 class="page-title">Four steps. Every prompt works the same way.</h2>
  <p class="lead">You don't need to be good with AI. Each prompt already tells the AI who to be, what to write and which mistakes to avoid. Your job is to give it the facts about your business.</p>
  <div class="step"><span class="n">1</span><div><h3>Pick the room for this week's problem</h3><p>Leads going cold? Email and text. Can't explain your offer? Offers and sales. Feed gone quiet? Content. Spending and can't tell what works? Analytics or Ads.</p></div></div>
  <div class="step"><span class="n">2</span><div><h3>Copy the prompt in the black box</h3><p>Everything inside the box is the prompt. Copy all of it, top to bottom.</p></div></div>
  <div class="step"><span class="n">3</span><div><h3>Fill in the gold <code>[BLANKS]</code></h3><p>Replace every word in square brackets with your real details: your business, your city, your real price, a real review. Delete the brackets. Specific beats clever every time.</p></div></div>
  <div class="step"><span class="n">4</span><div><h3>Paste it into ChatGPT, Claude or Gemini</h3><p>Free versions work. Read what comes back, then use the Pro tip under the prompt to make it sharper. Ask for changes the way you'd ask a person: "shorter", "more like how I talk", "give me 3 more".</p></div></div>
  <div class="rooms5">{''.join(f'<div><b>{r["n"]:02d} {r["name"]}</b>{r["pitch"]}</div>' for r in rooms)}</div>
  <p class="note"><b>Keep it honest.</b> Only use numbers, reviews, deadlines and spot limits that are true. The prompts tell the AI not to invent results, so give it real ones. Prompts are tools, not guarantees: your results depend on your business and how you use them.</p>
</section>

<section class="break">
  <span class="kicker">Contents</span>
  <h2 class="page-title">All 100 prompts</h2>
  <div class="toc">"""]
  for r in rooms:
      rows = "".join(f'<a class="row" href="#{p["id"]}"><b>{p["id"]}</b><span>{esc(p["title"])}</span><i>{PAGES.get(p["id"], "")}</i></a>' for p in r["prompts"])
      parts.append(f'<div class="toc-room"><h3><a href="#{r["anchor"]}">{r["name"]}</a><span class="num">{r["n"]:02d}</span></h3>{rows}</div>')
  parts.append("</div></section>")

  for r in rooms:
      parts.append(f'<section class="room-open" id="{r["anchor"]}" data-room="Room {r["n"]:02d} · {r["name"]}">'
                   f'<div class="room-head"><h2>{r["name"]}</h2><span class="num">{r["n"]:02d}</span></div>'
                   f'<p class="room-intro">{inline(r["intro"])}</p>')
      for p in r["prompts"]:
          parts.append(f'''<div class="prompt" id="{p["id"]}"><span class="id">{p["id"]}</span>
<h3>{esc(p["title"])}</h3>
<p class="meta"><b>Use it when:</b> {inline(p["use"])}</p>
<p class="meta"><b>You'll get:</b> {inline(p["get"])}</p>
<p class="meta"><b>Works in:</b> {inline(p["works"])}</p>
<p class="copy">Copy everything in the box</p>
<pre>{code_html(p["code"])}</pre>
<p class="tip"><b>Pro tip</b>{inline(p["tip"])}</p></div>''')
      parts.append("</section>")

  parts.append('<section class="break"><span class="kicker">You made it</span><h2 class="page-title">Pick one prompt and run it today.</h2>'
               '<p class="lead">Don\'t try to run all 100 this week. Start with one room, one prompt and one real result, then come back for the next.</p>'
               '<p class="note">Please don\'t resell or share these files. © Eat 4 Life Marketing · E4L Vault.</p></section>')
  parts.append("</body></html>")

  return "\n".join(parts)

src = SRC / "prompts.html"
src.write_text(build({}))
doc = HTML(filename=str(src)).render()
pages = {a: i + 1 for i, pg in enumerate(doc.pages) for a in pg.anchors}
src.write_text(build(pages))
import json; (SRC / "prompt-pages.json").write_text(json.dumps({k: v for k, v in pages.items() if "-" in k}, indent=0))
HTML(filename=str(src)).write_pdf(str(OUT / "E4L-Vault-100-Prompts.pdf"))
print("ok")
