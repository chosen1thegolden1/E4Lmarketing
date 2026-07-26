# NEXT SESSION — Student Nurture Funnel (Activate AI Income 2026)

Paste the block below into a fresh Claude Code session (same repo/environment) to
pick up exactly where we left off. Everything needed to continue is here.

## Where things stand

- **GHL is connected and working** (`services.leadconnectorhq.com` reachable).
- The **student nurture → webinar email funnel is fully written** — front half
  (Emails 1–4 + $9.95 confirmation upsell) and back half (Track 1 buyer
  onboarding B1–B2; Track 2 non-buyer/no-show R1 → C1 → C2 → C3 → C4 downsell).
- Full copy lives in the branded **playbook artifact**:
  https://claude.ai/code/artifact/573e961a-7441-4a67-a9ea-cd7d98e3ac60
- Goal driving this work: **lift campaign click-through rate** — one CTA per
  email, per-email UTM tags so clicks are measurable in GHL.

## Still open (values to slot in)

| Placeholder | Fills | Notes |
|---|---|---|
| `{{WEBINAR_DATE}}` | Nurture Emails 3 & 4 | Pending from Rozel (Slack) |
| `{{COURSE_CHECKOUT_LINK}}` | Track 2 (C1–C3) | Course enrollment / checkout page |
| `{{REPLAY_LINK}}` | Email R1 | Webinar replay URL |
| `{{COURSE_LOGIN_LINK}}` | Emails B1–B2 | Member login for buyers |
| `{{CART_CLOSE}}` | C1–C3 | Enrollment deadline, e.g. "Sunday 11:59 PM PT" |

Already resolved: audiobook checkout (`https://joineat4life.com/check-out`) and the
webinar registration link + per-email UTMs.

## Key facts / IDs

- **GHL location ID:** `zSBqmFrgOtGwd4ALyIsD`
- **Webinar registration form (base):**
  `https://api.leadconnectorhq.com/widget/form/RirsSM0TEf2ITZoUvi0o`
  Per-email UTM tail:
  `?utm_source=email&utm_medium=nurture&utm_campaign=aiincome2026&utm_content=e1_hook`
  (…`e2_teach`, `e3_invite`, `e4_lastcall`)
- **Audiobook ($9.95) checkout:** `https://joineat4life.com/check-out`
  (funnel "New Xbox to Executive", id `d6yhcpSiY8e7AGRk5Iww`)
- **Webinar:** "Activate AI Income in 2026" — the course sells IN the webinar.
- **Existing GHL workflows to reuse:** "Email Reminders — Activate AI Income in
  2026 Webinar", "Post - Webinar Sequence" (draft), "XBox to Executive Purchased".
- **Slack — Rozel (webinar-dates contact):** user `U06MM1L690X`, DM channel
  `D06NQBSL4QY`.

## Segmentation tags (drive the funnel)

| Event | Tag | Routes to |
|---|---|---|
| Registers for webinar | `registered` | Reminder sequence |
| Buys $9.95 audiobook | `audiobook-buyer` | (warm tag) |
| Attended live | `attended` | Track 2 · C1 (Recap) |
| Registered, no-show | `no-show` | Track 2 · R1 (Replay) |
| Purchased course | `course-purchased` | Track 1 onboarding (exits Track 2) |

---

## Handoff prompt (copy/paste into a new session)

```
E4L MARKETING — CONTINUE THE STUDENT NURTURE FUNNEL BUILD

Context: You're picking up a marketing-automation project for Eat 4 Life Marketing
(E4L). GHL (GoHighLevel) is connected and working. We built a student nurture →
webinar email funnel to lift campaign click-through rate, and it's fully written.
I need you to pick up where the last session left off.

FIRST, GET ORIENTED:
1. Read assistant/NEXT-SESSION.md and assistant/STATUS.md for full context.
2. Verify GHL is live: `cd assistant && node ghl-cli.js workflows` (lists ~29 workflows).
3. Read the full funnel copy in the published playbook:
   https://claude.ai/code/artifact/573e961a-7441-4a67-a9ea-cd7d98e3ac60

KEY FACTS / IDs:
- GHL location ID: zSBqmFrgOtGwd4ALyIsD
- Webinar form (base): https://api.leadconnectorhq.com/widget/form/RirsSM0TEf2ITZoUvi0o
  Per-email UTM tail: ?utm_source=email&utm_medium=nurture&utm_campaign=aiincome2026&utm_content=e1_hook (…e2_teach, e3_invite, e4_lastcall)
- Audiobook ($9.95) checkout: https://joineat4life.com/check-out (funnel "New Xbox to Executive", id d6yhcpSiY8e7AGRk5Iww)
- Webinar: "Activate AI Income in 2026". Course sells IN the webinar.
- Reuse workflows: "Email Reminders — Activate AI Income in 2026 Webinar", "Post - Webinar Sequence" (draft), "XBox to Executive Purchased".
- Slack: Rozel (webinar dates) — user U06MM1L690X, DM channel D06NQBSL4QY.

STILL OPEN (I'll paste these):
- {{WEBINAR_DATE}} → Emails 3 & 4
- {{COURSE_CHECKOUT_LINK}} → course enrollment (Track 2)
- {{REPLAY_LINK}} → webinar replay (R1)
- {{COURSE_LOGIN_LINK}} → member login for buyers (B1–B2)
- {{CART_CLOSE}} → enrollment deadline (e.g. "Sunday 11:59 PM PT")

WHAT I WANT NEXT:
- Slot every value into the copy and UPDATE the playbook artifact (same URL, via
  the Artifact tool with url: set to it) so it's 100% filled.
- Then prep it all copy-paste-ready for GHL, mapped step-by-step to the workflows above.
- Do NOT send anything to real contacts without my explicit go-ahead.
```
