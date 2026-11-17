# Send schedule — week of 2026-11-23

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
| 2026-11-23 | Monday | agency | `A1.html` | Who told you "you're the best" this year? | Google never heard it. | Game Plan Call (agency front end) |
| 2026-11-23 | Monday | student | `S1.html` | I learned to sell on a sales floor | Nobody there wanted a speech. They wanted to see it work. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-11-25 | Wednesday | agency | `A2.html` | The quote you sent in October | Five quiet days. One list worth an hour of them. | Game Plan Call (agency front end) |
| 2026-11-25 | Wednesday | student | `S2.html` | Thursday's a boss fight. Here's your build. | For when somebody at the table asks "so what are you doing now?" | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-11-27 | Friday | agency | `A3.html` | Who sent you your best customer? | One name. One text. No pitch in this one. | Game Plan Call (agency front end) |
| 2026-11-27 | Friday | student | `S3.html` | One side quest. Ten minutes. This weekend. | Your phone, one prompt, zero experience. That's the whole quest. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-11-29 | Sunday | agency | `A-SUN.html` | How many times did you answer "how much?" this week? | Same question. Same answer. Your Sunday. | Game Plan Call (agency front end) |
| 2026-11-29 | Sunday | student | `S-SUN.html` | You're not a single hero anymore | A line from my book, for anybody still trying to carry solo. | From Xbox to Executive (book, free + $9.95 shipping) |

## Load checklist — tick each one

- [ ] Paste each file's HTML into the GHL email builder (source/code view), one campaign per row.
- [ ] Subject and preview text copied exactly from the table above.
- [ ] Sending address is chosen@mail.e4lmarketingdemos.com.
- [ ] Schedule for 8:00 AM Pacific on the send date shown.
- [ ] Test send to yourself: first name renders, unsubscribe works, every link opens.
- [ ] Agency rows go to the agency list, student rows to the student list. Never crossed.

## Bench — not scheduled

- `B1.html` — I'd build a quiz before a website
- `B2.html` — Did you answer your last bad review?
