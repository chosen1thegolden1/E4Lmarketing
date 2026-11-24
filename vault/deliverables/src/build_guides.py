"""Build the Start Here guides (Lite, Lifetime) and the Skills Install Guide.
Run build_prompts.py first: it writes prompt-pages.json, used for page references."""
import json, pathlib
from weasyprint import HTML

SRC = pathlib.Path(__file__).resolve().parent
OUT = SRC.parent
PG = json.loads((SRC / "prompt-pages.json").read_text())

def page(id_): return f'{id_}, page {PG[id_]}'

COVER = """<section class="cover">
  <img class="art" src="../../malik-vault.jpg" alt="">
  <div class="top">
    <img class="wm" src="../../wordmark-gold.png" alt="E4L">
    <span class="badge">{badge}</span>
    <h1>{h1}</h1>
    <p>{p}</p>
  </div>
</section>"""

def doc(title, docname, body):
    return f"""<!doctype html><html><head><meta charset="utf-8"><title>{title}</title>
<link rel="stylesheet" href="brand.css"><style>
.box{{display:flex;gap:12px;align-items:flex-start;background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin-bottom:8px;break-inside:avoid}}
.box .ic{{flex:0 0 .9in;font-family:'Space Mono',monospace;font-size:8pt;text-transform:uppercase;letter-spacing:.05em;background:var(--ink);color:var(--gold);border-radius:8px;padding:7px 8px;text-align:center}}
.box h3{{font-size:12.5pt;margin-bottom:2px}}
.box p{{font-size:10pt;color:var(--muted)}}
.say{{font-family:'Space Mono',monospace;font-size:8.6pt;background:#FFF6D6;border-radius:6px;padding:2px 6px;color:var(--ink)}}
</style></head><body><span class="docname">{docname}</span>{body}</body></html>"""

def render(name, html):
    f = SRC / (name + ".html")
    f.write_text(html)
    HTML(filename=str(f)).write_pdf(str(OUT / (name + ".pdf")))

QUICK_WINS = f"""
<h3 class="sub">Your first 30 minutes: three quick wins</h3>
<div class="step"><span class="n">1</span><div><h3>Stop losing missed calls</h3><p>Open the 100 Prompts PDF to <b>{page('EM-08')}</b> and write the text that goes out when you can't pick up. Then do <b>{page('EM-07')}</b> so new form leads hear from you in minutes, not days. Load both into your phone or CRM.</p></div></div>
<div class="step"><span class="n">2</span><div><h3>Pick five hooks and plan a $10 a day test</h3><p>Open <b>50 Ad Hooks That Stop the Scroll</b>, pick one hook from each of the five angles and fill in the blanks. Then run <b>{page('AD-18')}</b> for the ads, audiences and what to judge after 7 days.</p></div></div>
<div class="step"><span class="n">3</span><div><h3>Make your offer easy to say yes to</h3><p>Run <b>{page('OF-02')}</b> to price your service in three tiers, then <b>{page('OF-05')}</b> for word-for-word answers to the objections you hear most.</p></div></div>
"""

HOW = """
<h3 class="sub">How every prompt works</h3>
<p class="lead" style="margin-bottom:8px">Copy the whole black box. Replace each gold <span class="c">[BLANK]</span> with your real details and delete the brackets. Paste it into ChatGPT, Claude or Gemini (free versions work). Then ask for changes like you'd ask a person: "shorter", "more like how I talk", "give me 3 more".</p>
"""

HONEST = """<p class="note"><b>Keep it honest.</b> Only use numbers, reviews, deadlines and spot limits that are true. Prompts are tools, not guarantees: your results depend on your business and how you use them.</p>"""

def start_here(tier):
    life = tier == "Lifetime"
    files = [
        ("PDF", "E4L Vault 100 Prompts", "All 100 prompts across five rooms: email and text, offers and sales, content, analytics and ads. Contents on page 3."),
        ("PDF", "50 Ad Hooks That Stop the Scroll", "Fill-in-the-blank opening lines for Facebook and Instagram ads, plus 3 bonus prompts."),
    ]
    if life:
        files.append(("Folder", "Skills", "Six AI helpers you can just talk to: Ad Writer, Email Writer, Content Planner, Offer Builder, Clip Finder and Results Reader. Open the Skills Install Guide inside."))
    boxes = "".join(f'<div class="box"><span class="ic">{k}</span><div><h3>{n}</h3><p>{d}</p></div></div>' for k, n, d in files)
    cover = COVER.format(
        badge=f"E4L Vault · {'Lifetime Pass' if life else 'Vault Lite'}",
        h1="You're in.<br><span>Start here.</span>",
        p="Ten minutes with this guide and you'll know exactly what's in your Vault and what to run first.")
    skills = ""
    if life:
        skills = f"""
<section class="break">
<span class="kicker">Lifetime Pass</span>
<h2 class="page-title">Install your six skills (about 15 minutes)</h2>
<p class="lead">The prompts are the library. The skills are helpers that already know the library. Install one, tell it about your business once, then just ask: <span class="say">write me 3 ads for my fall special</span>.</p>
<div class="step"><span class="n">1</span><div><h3>Open the Skills folder</h3><p>Start with the <b>Skills Install Guide</b>. It walks you through Claude, ChatGPT, and the Project version for plans without Skills.</p></div></div>
<div class="step"><span class="n">2</span><div><h3>Install one skill first</h3><p>Pick the job you need most this week. Most people start with <b>Email Writer</b> (missed-call texts and follow-ups) or <b>Ad Writer</b>.</p></div></div>
<div class="step"><span class="n">3</span><div><h3>Answer six quick questions, save your Business Card</h3><p>The first time you use any skill, it asks about your business and hands you a Business Card. Save it. Paste it into any new chat and every skill skips the setup.</p></div></div>
<div class="dark"><b>Use it for your clients too.</b> Your Lifetime Pass covers your own business and your clients' work. Please don't resell or share the Vault files themselves.</div>
<div class="dark"><b>New drops come to you.</b> Lifetime includes every new skill, system and workflow we add, the day it ships. We'll send each one to the email you bought with, so keep that address and watch for mail from E4L.</div>
</section>"""
    license_ = ("" if life else
        '<p class="note"><b>Your Vault Lite.</b> All 100 prompts and the 50 Ad Hooks pack are yours to keep, for use on your own business. New skills, systems and workflows are part of the Lifetime Pass. Please don\'t resell or share the files.</p>')
    body = f"""{cover}
<section>
<span class="kicker">What's in your Vault</span>
<h2 class="page-title">Everything you just unlocked</h2>
{boxes}
{HOW}
{QUICK_WINS}
</section>
{skills}
<section class="break">
<span class="kicker">Need a hand?</span>
<h2 class="page-title">Stuck on a download or a prompt?</h2>
<p class="lead">Reply to your purchase email and tell us what you were trying to do. A real person on the E4L team will help you get it working.</p>
{HONEST}
{license_}
<p class="note">© Eat 4 Life Marketing · E4L Vault.</p>
</section>"""
    render(f"Start-Here-{tier}", doc(f"E4L Vault: Start Here ({tier})", f"E4L Vault · Start here · {tier}", body))

SKILLS = [
    ("Ad Writer", "e4l-ad-writer", "Facebook, Instagram and Google ads, hooks, video scripts, fixes and a $10 a day test plan.", "write me 3 ads for my fall special"),
    ("Email Writer", "e4l-email-writer", "Welcome, launch, win-back and follow-up emails, plus missed-call and reminder texts.", "write the text that goes out when I miss a call"),
    ("Content Planner", "e4l-content-planner", "30-day calendars, video scripts, carousels and captions that sound like you.", "plan a week of posts, 3 a week, Instagram only"),
    ("Offer Builder", "e4l-offer-builder", "Offers, pricing tiers, landing pages, objection scripts and proposals.", "price my service in three tiers"),
    ("Clip Finder", "e4l-clip-finder", "Finds the best short clips in a long video from its transcript, with times and captions.", "here's my transcript, give me 3 clips for Reels"),
    ("Results Reader", "e4l-results-reader", "Reads your ad, email and funnel numbers in plain English and says what to change.", "here are my ad results, what should I change?"),
]

def install_guide():
    rows = "".join(f'<tr><td><b>{n}</b></td><td>{d}</td><td><span class="say">{s}</span></td></tr>' for n, f, d, s in SKILLS)
    cover = COVER.format(badge="E4L Vault · Lifetime Pass", h1="Your six skills.<br><span>Installed in 15 minutes.</span>",
                         p="Helpers that already know all 100 Vault prompts. Tell one about your business once, then just ask for what you need.")
    body = f"""{cover}
<section>
<span class="kicker">The six skills</span>
<h2 class="page-title">One job each</h2>
<table class="t"><tr><th>Skill</th><th>What it does</th><th>Try saying</th></tr>{rows}</table>
<p class="lead">Your Skills folder has two folders. <b>Upload to Claude or ChatGPT</b> holds the six zip files. <b>No Skills on your plan - Project version</b> holds the same six skills as copy-paste instructions.</p>

<h3 class="sub">Option A: Install in Claude</h3>
<div class="step"><span class="n">1</span><div><h3>Don't unzip the file</h3><p>Pick a zip from <b>Upload to Claude or ChatGPT</b>. Claude wants the zip as it is.</p></div></div>
<div class="step"><span class="n">2</span><div><h3>Open Settings, find Skills</h3><p>In Claude, open Settings and look for Skills (under Capabilities). Turn Skills on if it's off.</p></div></div>
<div class="step"><span class="n">3</span><div><h3>Upload the zip</h3><p>Repeat for each skill you want. Six uploads takes about five minutes.</p></div></div>
<div class="step"><span class="n">4</span><div><h3>Start a new chat and ask</h3><p>Ask for what you need in plain words, like <span class="say">write me 3 ads for my fall special</span>. Claude picks up the right skill on its own.</p></div></div>
<p class="note">Menu names in Claude move around. If you can't find Skills, or your plan doesn't have it, use Option C. It does the same job.</p>

<h3 class="sub">Option B: Install in ChatGPT</h3>
<p class="lead">If your ChatGPT plan has Skills, upload the same zip files there, the same way. If it doesn't have Skills yet, use Option C.</p>

<h3 class="sub">Option C: Project version (any plan, ChatGPT or Claude)</h3>
<div class="step"><span class="n">1</span><div><h3>Create a new Project</h3><p>In ChatGPT or Claude, create a Project. In ChatGPT a custom GPT works too.</p></div></div>
<div class="step"><span class="n">2</span><div><h3>Add the skill's prompts file</h3><p>Open <b>No Skills on your plan - Project version</b>, then the skill's folder. Upload <b>prompts.md</b> to the Project's files (or the GPT's Knowledge). Clip Finder doesn't need one.</p></div></div>
<div class="step"><span class="n">3</span><div><h3>Paste the instructions</h3><p>Open <b>Project instructions.txt</b>, copy everything below the line, and paste it into the Project's instructions. Save.</p></div></div>
<div class="step"><span class="n">4</span><div><h3>Chat inside that Project</h3><p>Every new chat in that Project runs the skill.</p></div></div>

<h3 class="sub">Save your Business Card</h3>
<p class="lead">The first time you use any skill, it asks six quick questions and gives you a Business Card. Save it in your notes. Paste it into any new chat, or add it to your Project files, and every skill skips the setup.</p>
<div class="dark"><b>Your Lifetime Pass</b> covers your own business and your clients' work. Please don't resell or share these files. © Eat 4 Life Marketing · E4L Vault.</div>
</section>"""
    render("Skills-Install-Guide", doc("E4L Vault: Skills Install Guide", "E4L Vault · Skills install guide", body))

start_here("Lite")
start_here("Lifetime")
install_guide()
print("ok")
