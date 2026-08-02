# Appointment-Setting Email — Voice AI Demo

Paste this into a GHL email template. Merge fields pull from the contact record,
which the demo builder fills automatically (`Voice Demo URL`, `Voice Demo Phone`).
Wire it to a workflow triggered by the `voice-demo` tag with a short delay
(5–10 min) so the page is deployed before the email lands.

---

**Subject options (test these against each other):**

1. `I built {{contact.company_name}} an AI receptionist — she's live right now`
2. `Your phones are missing calls. I fixed it (demo inside)`
3. `Call this number and hear something wild: {{contact.voice_demo_phone}}`

**Body:**

Hi {{contact.first_name | default: "there"}},

I'll keep this short because the demo speaks for itself — literally.

I went through your website and built {{contact.company_name}} its own
AI receptionist. She already knows your services, answers like a
seasoned front-desk pro, and books estimates 24/7 — nights, weekends,
and every call your crew can't pick up mid-job.

She's live right now:

**📞 Call her: {{contact.voice_demo_phone}}**
Ask her anything a customer would — watch her qualify you and offer to book.

**🖥 See the full demo:** {{contact.voice_demo_url}}

No slide deck, no "book a discovery call to learn more." The product is
answering your phone, today.

If you like what you hear, reply to this email or grab 15 minutes here:
[BOOKING LINK] — we can have her on your real business line this week.

[REP SIGNATURE]

P.S. — Every missed call is a job your competitor quoted. She hasn't
missed one yet.

---

**Workflow wiring (one-time setup in GHL):**

1. Trigger: Contact Tag Added → `voice-demo`
2. Wait: 10 minutes (lets Pages deploy finish)
3. Send email: this template
4. Optional: If no click in 3 days → follow-up email; if no reply in 7 days →
   task for the rep whose `rep:*` tag is on the contact.

**Commission attribution:** every contact a rep submits carries their
`rep:<name>` tag — filter contacts/opportunities by that tag to calculate
payouts on closed deals.
