# Send schedule — week of 2026-10-26

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
| 2026-10-26 | Monday | agency | `A1.html` | This AI model costs a tenth of the old one | Anthropic's new small model, new price. What's your excuse now? | Game Plan Call (agency front end) |
| 2026-10-26 | Monday | student | `S1.html` | 3 things about the $1.7 billion Roblox paid out | Not to Roblox. To the people who built stuff on it. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-10-28 | Wednesday | agency | `A2.html` | 534,947 filings. 29,022 businesses. | Census counts the paperwork and the payroll separately. The gap is the story. | Game Plan Call (agency front end) |
| 2026-10-28 | Wednesday | student | `S2.html` | People laughed. Then it stopped being funny. | I was a pro gamer before anybody called that a career. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-10-30 | Friday | agency | `A3.html` | "I'll think about it" is a question | The sales floor taught me this. Your follow-up probably hasn't. | Game Plan Call (agency front end) |
| 2026-10-30 | Friday | student | `S3.html` | 534,947 people filed to start a business | Somebody has to build their first page and write their first email. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-11-01 | Sunday | agency | `A-SUN.html` | The five who went quiet | Ten minutes tonight. Before the week starts. | Game Plan Call (agency front end) |
| 2026-11-01 | Sunday | student | `S-SUN.html` | The boring gig that moved me to LA | Nobody posts about this part. | From Xbox to Executive (book, free + $9.95 shipping) |

## Load checklist — tick each one

- [ ] Paste each file's HTML into the GHL email builder (source/code view), one campaign per row.
- [ ] Subject and preview text copied exactly from the table above.
- [ ] Sending address is chosen@mail.e4lmarketingdemos.com.
- [ ] Schedule for 8:00 AM Pacific on the send date shown.
- [ ] Test send to yourself: first name renders, unsubscribe works, every link opens.
- [ ] Agency rows go to the agency list, student rows to the student list. Never crossed.

## Bench — not scheduled

- `B1.html` — Over half of workers already used AI on the job
- `B2.html` — Google says clean data beat bigger budgets
