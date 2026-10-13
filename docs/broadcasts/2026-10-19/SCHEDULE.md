# Send schedule — week of 2026-10-19

Built by `scripts/build-emails.js`. Every link below is already live in the HTML.

**Who does what:** Claude writes · Claude edits in a second pass · **Chosen approves** ·
**Abdullah loads these into GHL** · Daniel is second eyes on E4L Services and Student.
He gets the schedule and the offers so he can tie traffic and sales back to
the sends.

**Send from:** chosen@mail.e4lmarketingdemos.com — never gsgagency.com.
**Send time:** 8:00 AM Pacific.
**Merge tags:** first name `{{contact.first_name}}`, unsubscribe `{{unsubscribe_url}}`. Send yourself a
test first — if either renders literally, fix it once in `scripts/build-emails.js`.

| Send date | Day | Side | File | Subject | Preview text | Sells |
|---|---|---|---|---|---|---|
| 2026-10-19 | Monday | agency | `A1.html` | Google gave its AI an email address | And a calendar. And a seat in the company directory. | Game Plan Call (agency front end) |
| 2026-10-19 | Monday | student | `S1.html` | More than half of workers already use AI. Did anyone teach them? | Nobody taught you either. Here's tonight's side quest. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-10-21 | Wednesday | agency | `A2.html` | Your team is already using AI. You didn't pick it. | More than half of workers say so. | Game Plan Call (agency front end) |
| 2026-10-21 | Wednesday | student | `S2.html` | You didn't quit. You got sold a Notion template. | Same thing happened to me, in a different game. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-10-23 | Friday | agency | `A3.html` | A cold email got me $4,000 | A roofer. No pitch deck. Here's the part that mattered. | Game Plan Call (agency front end) |
| 2026-10-23 | Friday | student | `S3.html` | Your next client's AI is going to need a manager | It has its own email address. Who's telling it what to do? | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-10-25 | Sunday | agency | `A-SUN.html` | Call your own number | Tonight. After you close. | Game Plan Call (agency front end) |
| 2026-10-25 | Sunday | student | `S-SUN.html` | My first client came from a dinner | No pitch deck. No cold email. Just a conversation. | From Xbox to Executive (book, free + $9.95 shipping) |

## Load checklist — tick each one

- [ ] Paste each file's HTML into the GHL email builder (source/code view), one campaign per row.
- [ ] Subject and preview text copied exactly from the table above.
- [ ] Sending address is chosen@mail.e4lmarketingdemos.com.
- [ ] Schedule for 8:00 AM Pacific on the send date shown.
- [ ] Test send to yourself: first name renders, unsubscribe works, every link opens.
- [ ] Agency rows go to the agency list, student rows to the student list. Never crossed.

## Bench — not scheduled

- `B1.html` — Google's AI will write the owner's review replies. So what's left for you?
- `B2.html` — The smallest shops are the least likely to be using AI
