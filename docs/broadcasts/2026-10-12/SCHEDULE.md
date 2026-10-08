# Send schedule — week of 2026-10-12

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
| 2026-10-12 | Monday | agency | `A1.html` | 29,000 jobs. In the whole country. | Everybody's freezing hiring. Here's what that gets wrong. | Game Plan Call (agency front end) |
| 2026-10-12 | Monday | student | `S1.html` | The barbershop isn't lazy. It's busy. | Four in five businesses haven't started on AI. Here's tonight's side quest. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-10-14 | Wednesday | agency | `A2.html` | Is your ship leaking? | Plug the hole... | Game Plan Call (agency front end) |
| 2026-10-14 | Wednesday | student | `S2.html` | It's not your résumé | The whole country added 29,000 jobs in September. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-10-16 | Friday | agency | `A3.html` | A robot is going to call your shop | Google already does it. Here's the setting that decides. | Game Plan Call (agency front end) |
| 2026-10-16 | Friday | student | `S3.html` | You're still billing by the hour | There are 43 pre-built workflows now. Which one did you sell? | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-10-18 | Sunday | agency | `A-SUN.html` | What's the oldest thing in your inbox? | Somebody's still waiting on it. | Game Plan Call (agency front end) |
| 2026-10-18 | Sunday | student | `S-SUN.html` | It's Sunday. Start the boring part. | A job I hated paid for the thing I loved. | From Xbox to Executive (book, free + $9.95 shipping) |

## Load checklist — tick each one

- [ ] Paste each file's HTML into the GHL email builder (source/code view), one campaign per row.
- [ ] Subject and preview text copied exactly from the table above.
- [ ] Sending address is chosen@mail.e4lmarketingdemos.com.
- [ ] Schedule for 8:00 AM Pacific on the send date shown.
- [ ] Test send to yourself: first name renders, unsubscribe works, every link opens.
- [ ] Agency rows go to the agency list, student rows to the student list. Never crossed.

## Bench — not scheduled

- `B1.html` — Somebody's teaching your future clients AI for free
- `B2.html` — Everybody points the AI at the same department
