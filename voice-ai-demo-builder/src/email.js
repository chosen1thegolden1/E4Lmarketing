import { ghl, creds } from './ghl.js';

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const fmtPhone = (p) => {
  const d = String(p ?? '').replace(/\D/g, '');
  const n = d.length === 11 && d.startsWith('1') ? d.slice(1) : d;
  return n.length === 10 ? `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}` : p;
};

export function renderOutreachEmail(data, demoUrl) {
  const { business: b, agent: a } = data;
  const phone = data._demoPhone ? fmtPhone(data._demoPhone) : null;
  const tel = data._demoPhone ? `tel:${String(data._demoPhone).replace(/[^\d+]/g, '')}` : null;
  const brand = esc(b.brandColor || '#1a3c5e');

  const subject = `I built ${b.name} an AI receptionist — ${a.agentName} is answering your calls right now`;

  const html = `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;color:#16202b;line-height:1.6">
  <p>Hi there,</p>
  <p>I'll keep this short because the demo speaks for itself — literally.</p>
  <p>I went through the ${esc(b.name)} website and built you your own AI receptionist.
  ${esc(a.agentName)} already knows your services, answers like a seasoned front-desk pro,
  and books estimates 24/7 — nights, weekends, and every call your crew can't pick up mid-job.</p>
  ${
    phone
      ? `<p style="margin:24px 0"><a href="${esc(tel)}" style="background:${brand};color:#ffffff;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:8px;display:inline-block">📞 Call ${esc(a.agentName)} now: ${esc(phone)}</a><br>
  <span style="font-size:13px;color:#5b6b7b">Ask anything a customer would — watch the qualification happen live.</span></p>`
      : ''
  }
  <p><a href="${esc(demoUrl)}" style="color:${brand};font-weight:700">🖥 See the full demo page we built for ${esc(b.shortName || b.name)}</a></p>
  <p>No slide deck, no "book a discovery call to learn more." The product is answering your phone, today.</p>
  <p>If you like what you hear, just reply to this email — we can have ${esc(a.agentName)} on your real business line this week.</p>
  <p>— Eat 4 Life Marketing</p>
  <p style="font-size:13px;color:#5b6b7b">P.S. Every missed call is a job your competitor quoted. ${esc(a.agentName)} hasn't missed one yet.</p>
  <hr style="border:none;border-top:1px solid #e3e8ee;margin:24px 0 12px">
  <p style="font-size:12px;color:#8a99a8">Eat 4 Life Marketing · Los Angeles, CA<br>
  You're receiving this one-time note because we built this demo from your public website.
  Reply "unsubscribe" and we'll never contact you again — the demo line will also be retired.</p>
</div>`;

  return { subject, html };
}

export async function sendOutreachEmail({ contactId, subject, html }) {
  creds();
  return ghl('POST', '/conversations/messages', {
    type: 'Email',
    contactId,
    subject,
    html,
  });
}
