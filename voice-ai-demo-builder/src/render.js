import fs from 'node:fs/promises';
import path from 'node:path';

const fmtPhone = (p) => {
  const d = String(p ?? '').replace(/\D/g, '');
  const n = d.length === 11 && d.startsWith('1') ? d.slice(1) : d;
  return n.length === 10 ? `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}` : p;
};

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export async function renderDemo(data, outRoot) {
  const { business: b, agent: a, page: p } = data;
  const slug = (data._slug || b.slug || b.name || 'demo')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const dir = path.join(outRoot, slug);
  await fs.mkdir(dir, { recursive: true });

  const transcript = (a.sampleConversation || [])
    .map(
      (t) => `
        <div class="msg ${t.role === 'agent' ? 'agent' : 'caller'}">
          <span class="who">${t.role === 'agent' ? esc(a.agentName) : 'Caller'}</span>
          <p>${esc(t.text)}</p>
        </div>`
    )
    .join('');

  const stats = (p.stats || [])
    .map((s) => `<div class="stat"><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`)
    .join('');

  const props = (p.valueProps || [])
    .map(
      (v) => `
      <div class="card">
        <div class="icon">${esc(v.icon)}</div>
        <h3>${esc(v.title)}</h3>
        <p>${esc(v.desc)}</p>
      </div>`
    )
    .join('');

  const steps = (p.howItWorks || [])
    .map(
      (s) => `
      <div class="step">
        <div class="num">${esc(s.step)}</div>
        <div><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p></div>
      </div>`
    )
    .join('');

  const caps = (a.capabilities || []).map((c) => `<li>${esc(c)}</li>`).join('');

  const demoPhone = data._demoPhone || null;
  const demoTel = demoPhone ? `tel:${String(demoPhone).replace(/[^\d+]/g, '')}` : null;

  const faqs = (a.faqs || [])
    .map(
      (f) => `
      <details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Voice AI Demo — ${esc(b.name)}</title>
<style>
  :root { --brand: ${esc(b.brandColor || '#1a3c5e')}; --accent: ${esc(b.accentColor || '#e8842c')}; --ink: #16202b; --muted: #5b6b7b; --bg: #f6f8fa; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: var(--ink); background: var(--bg); line-height: 1.6; }
  .wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
  header.hero { background: linear-gradient(135deg, var(--brand), color-mix(in srgb, var(--brand) 60%, black)); color: #fff; padding: 72px 0 56px; }
  .kicker { display: inline-block; background: var(--accent); color: #fff; font-size: 13px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: 6px 14px; border-radius: 999px; margin-bottom: 20px; }
  .hero h1 { font-size: clamp(30px, 4.5vw, 46px); line-height: 1.15; max-width: 760px; }
  .hero .sub { margin-top: 16px; font-size: 18px; max-width: 680px; opacity: .92; }
  .hero .biz { margin-top: 26px; font-size: 14px; opacity: .8; }
  .stats { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 34px; }
  .stat { background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.22); border-radius: 12px; padding: 14px 22px; }
  .stat strong { display: block; font-size: 26px; }
  .stat span { font-size: 13px; opacity: .85; }
  section { padding: 56px 0; }
  h2 { font-size: 28px; margin-bottom: 8px; }
  .lede { color: var(--muted); margin-bottom: 32px; max-width: 640px; }
  .demo-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 40px; align-items: start; }
  @media (max-width: 820px) { .demo-grid { grid-template-columns: 1fr; } }
  .phone { background: #fff; border-radius: 24px; box-shadow: 0 12px 40px rgba(0,0,0,.12); overflow: hidden; border: 1px solid #e3e8ee; }
  .phone-top { background: var(--brand); color: #fff; padding: 18px 22px; display: flex; align-items: center; gap: 12px; }
  .phone-top .dot { width: 10px; height: 10px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 0 4px rgba(74,222,128,.25); }
  .phone-top small { display: block; opacity: .8; }
  .transcript { padding: 20px; max-height: 520px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
  .msg { max-width: 86%; padding: 10px 14px; border-radius: 14px; font-size: 14.5px; }
  .msg .who { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; opacity: .65; margin-bottom: 2px; }
  .msg.agent { align-self: flex-start; background: #eef2f7; border-bottom-left-radius: 4px; }
  .msg.caller { align-self: flex-end; background: color-mix(in srgb, var(--accent) 16%, white); border-bottom-right-radius: 4px; }
  .agent-card { background: #fff; border: 1px solid #e3e8ee; border-radius: 16px; padding: 26px; box-shadow: 0 6px 24px rgba(0,0,0,.06); }
  .agent-card h3 { margin-bottom: 6px; }
  .greeting { background: color-mix(in srgb, var(--brand) 8%, white); border-left: 4px solid var(--brand); padding: 12px 16px; border-radius: 0 10px 10px 0; font-style: italic; margin: 14px 0 20px; }
  .caps { list-style: none; display: grid; gap: 8px; margin-bottom: 20px; }
  .caps li { padding-left: 26px; position: relative; }
  .caps li::before { content: '✓'; position: absolute; left: 0; color: var(--accent); font-weight: 800; }
  details.prompt { border: 1px solid #e3e8ee; border-radius: 10px; }
  details.prompt summary { cursor: pointer; padding: 12px 16px; font-weight: 600; }
  details.prompt pre { white-space: pre-wrap; font-family: ui-monospace, monospace; font-size: 12.5px; padding: 0 16px 16px; color: var(--muted); }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
  .card { background: #fff; border: 1px solid #e3e8ee; border-radius: 14px; padding: 24px; }
  .card .icon { font-size: 30px; margin-bottom: 10px; }
  .card h3 { font-size: 17px; margin-bottom: 6px; }
  .card p { font-size: 14.5px; color: var(--muted); }
  .steps { display: grid; gap: 22px; max-width: 720px; }
  .step { display: flex; gap: 18px; align-items: flex-start; }
  .num { flex: 0 0 40px; height: 40px; border-radius: 50%; background: var(--brand); color: #fff; display: grid; place-items: center; font-weight: 800; }
  .faqs details { background: #fff; border: 1px solid #e3e8ee; border-radius: 10px; margin-bottom: 10px; }
  .faqs summary { cursor: pointer; padding: 14px 18px; font-weight: 600; }
  .faqs p { padding: 0 18px 14px; color: var(--muted); }
  .cta { background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 65%, black)); color: #fff; text-align: center; border-radius: 20px; padding: 48px 28px; margin: 20px 0 60px; }
  .cta h2 { margin-bottom: 10px; }
  .cta p { max-width: 560px; margin: 0 auto 22px; opacity: .95; }
  .btn { display: inline-block; background: #fff; color: var(--ink); font-weight: 700; padding: 14px 32px; border-radius: 999px; text-decoration: none; }
  .call-btn { display: inline-flex; align-items: center; gap: 12px; background: var(--accent); color: #fff; text-decoration: none; font-weight: 800; font-size: 19px; padding: 16px 30px; border-radius: 999px; margin-top: 28px; box-shadow: 0 8px 24px rgba(0,0,0,.25); transition: transform .12s ease; }
  .call-btn:hover { transform: translateY(-2px); }
  .call-btn .ring { width: 14px; height: 14px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 0 0 rgba(74,222,128,.7); animation: pulse 1.8s infinite; }
  .call-btn small { display: block; font-size: 12px; font-weight: 600; opacity: .85; }
  @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(74,222,128,.7); } 70% { box-shadow: 0 0 0 10px rgba(74,222,128,0); } 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); } }
  .call-card { margin: 16px 0 20px; background: color-mix(in srgb, var(--accent) 10%, white); border: 1px dashed var(--accent); border-radius: 12px; padding: 14px 18px; }
  .call-card a { color: var(--brand); font-weight: 800; font-size: 20px; text-decoration: none; }
  .call-card span { display: block; font-size: 13px; color: var(--muted); }
  footer { text-align: center; padding: 26px 0 40px; color: var(--muted); font-size: 13.5px; }
</style>
</head>
<body>
<header class="hero">
  <div class="wrap">
    <span class="kicker">Voice AI Receptionist Demo</span>
    <h1>${esc(p.heroHeadline)}</h1>
    <p class="sub">${esc(p.heroSub)}</p>
    ${demoTel ? `<a class="call-btn" href="${esc(demoTel)}"><span class="ring"></span><span>Call ${esc(a.agentName)} live: ${esc(fmtPhone(demoPhone))}<small>Tap to try the demo line right now</small></span></a>` : ''}
    <p class="biz">Prepared for <strong>${esc(b.name)}</strong> · ${esc(b.industry)}${b.location ? ' · ' + esc(b.location) : ''}</p>
    <div class="stats">${stats}</div>
  </div>
</header>

<section>
  <div class="wrap">
    <h2>Hear how ${esc(a.agentName)} answers your phones</h2>
    <p class="lede">A real inbound-call flow, built from your website. ${esc(a.agentName)} greets every caller, qualifies the job, and books the estimate — even at 2 AM.</p>
    <div class="demo-grid">
      <div class="phone">
        <div class="phone-top">
          <span class="dot"></span>
          <div><strong>${esc(a.agentName)} · AI Receptionist</strong><small>Incoming call — ${esc(b.shortName)}</small></div>
        </div>
        <div class="transcript">${transcript}</div>
      </div>
      <div class="agent-card">
        <h3>Meet ${esc(a.agentName)}</h3>
        <p>Your always-on receptionist, trained on ${esc(b.name)}.</p>
        <div class="greeting">“${esc(a.welcomeMessage)}”</div>
        ${demoTel ? `<div class="call-card"><a href="${esc(demoTel)}">📞 ${esc(fmtPhone(demoPhone))}</a><span>Live demo line — call and talk to ${esc(a.agentName)} yourself</span></div>` : ''}
        <ul class="caps">${caps}</ul>
        <details class="prompt">
          <summary>View full agent instructions</summary>
          <pre>${esc(a.prompt)}</pre>
        </details>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <h2>Why ${esc(b.shortName)} needs this</h2>
    <p class="lede">Every missed call is a roof someone else quoted. Here's what changes the day ${esc(a.agentName)} goes live.</p>
    <div class="cards">${props}</div>
  </div>
</section>

<section>
  <div class="wrap">
    <h2>How it works</h2>
    <div class="steps">${steps}</div>
  </div>
</section>

<section>
  <div class="wrap faqs">
    <h2>Questions owners ask us</h2>
    ${faqs}
  </div>
</section>

<div class="wrap">
  <div class="cta">
    <h2>Ready to stop missing calls?</h2>
    <p>${esc(p.closingCta)}</p>
    ${demoTel ? `<a class="btn" href="${esc(demoTel)}" style="margin-right:12px">📞 Call ${esc(a.agentName)} now</a>` : ''}
    <a class="btn" href="mailto:chosen1@gsgagency.com?subject=Voice%20AI%20for%20${encodeURIComponent(b.name)}">Go live with ${esc(a.agentName)}</a>
  </div>
</div>

<footer>
  Demo generated from <a href="${esc(data._sourceUrl || '#')}">${esc(data._sourceUrl || 'your website')}</a> · Built by Eat 4 Life Marketing
</footer>
</body>
</html>
`;

  const htmlPath = path.join(dir, 'index.html');
  await fs.writeFile(htmlPath, html);
  await fs.writeFile(path.join(dir, 'data.json'), JSON.stringify(data, null, 2));
  return { slug, dir, htmlPath };
}
