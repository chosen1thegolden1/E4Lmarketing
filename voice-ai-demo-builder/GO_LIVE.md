# Go-Live Runbook — Conditional Forwarding

How to move a client from demo to production. The client keeps their number
with their carrier; one conditional-forwarding rule sends only their
**missed** calls to the agent. Nothing ports, rollback is one dial code, and
the whole setup is ~1 hour on our side + 2 minutes on theirs.

Pitch line: *"Nothing about your number changes — you set one forwarding
rule, and the calls you're already missing start getting answered and booked.
Turn it off any time."*

## Our side (before the client touches anything)

1. **Buy a dedicated number** in GHL (Settings → Phone Numbers) in the
   client's area code. Never point a client's forwarding at a pool number —
   pool numbers recycle every `maxAgeDays` and their line would go dead.
2. **Production-ize the agent** (the demo agent can be promoted in place):
   - Attach the dedicated number (`updateAgentNumbers` or GHL UI).
   - Point `sendPostCallNotificationTo` at the client's email(s), not our
     admins.
   - Create the client's estimate calendar in GHL and add an
     appointment-booking **action** to the agent so booked times are real.
   - Review the prompt with the client — hours, service area, anything the
     scrape missed.
3. **Test end-to-end**: call the dedicated number, book a fake estimate,
   confirm the calendar event, the contact note, and the client's
   notification email all fire.

## Client side (2 minutes, on their phone)

Conditional forwarding = forward **only when busy or unanswered**. The
client dials one code on the phone that owns the business number, pointing
at the dedicated number we bought (full 10 digits, e.g. 8XXXXXXXXX):

| Carrier | Enable | Disable |
| --- | --- | --- |
| T-Mobile / AT&T (GSM) | `**004*1<number>#` | `##004#` |
| Verizon | `*71<number>` | `*73` |
| Landline / VoIP | set "no-answer forwarding" in the provider portal | same portal |

Notes:
- Codes vary by carrier/plan — if a code errors, the carrier's support line
  or app has the equivalent "busy/no-answer forwarding" setting.
- Default no-answer delay is ~20–25 seconds (4–5 rings). On GSM carriers the
  delay is tunable: `**61*1<number>**<seconds>#` (5–30 s, multiples of 5).
- The client's phone behavior does not change at all when they answer.

## Verify together (5 minutes, on the go-live call)

1. Client silences their phone; you call the business number.
2. It rings 4–5 times, then the agent answers with the client's greeting.
3. Book a test estimate; confirm the client received the notification email
   and sees the calendar event.
4. Client un-silences the phone; call again and have them answer — confirm a
   normal answered call is untouched.

## Rollback

One dial code (`##004#` / `*73` / portal toggle). Calls roll to their old
voicemail again immediately. Make sure the client knows this before they
sign anything — it is the strongest trust lever in the close.
