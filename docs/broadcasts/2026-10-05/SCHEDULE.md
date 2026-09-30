# Send schedule — week of 2026-10-05

Built by `scripts/build-emails.js`. Every link below is already live in the HTML.

**Who does what:** Claude writes · Claude edits in a second pass · **Chosen approves** ·
**Abdullah loads these into GHL** · Daniel is second eyes on E4L Services, Sammy on E4L
School. They get the schedule and the offers so they can tie traffic and sales back to
the sends.

**Send from:** chosen@mail.e4lmarketingdemos.com — never gsgagency.com.
**Send time:** 8:00 AM Pacific.
**Merge tags:** first name `{{contact.first_name}}`, unsubscribe `{{unsubscribe_url}}`. Send yourself a
test first — if either renders literally, fix it once in `scripts/build-emails.js`.

| Send date | Day | Side | File | Subject | Preview text | Sells |
|---|---|---|---|---|---|---|
| 2026-10-05 | Monday | agency | `A1.html` | Meta just gave your business a free employee | It plugs into your QuickBooks. And your Stripe. | Game Plan Call (agency front end) |
| 2026-10-05 | Monday | student | `S1.html` | Meta just handed you something to sell | It's free. The barbershop won't touch it. You will. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-10-07 | Wednesday | agency | `A2.html` | You're never going to finish that course | Good news. Microsoft says you don't have to. | Game Plan Call (agency front end) |
| 2026-10-07 | Wednesday | student | `S2.html` | They had the degree. They're working retail. | The Census Bureau counted. It wasn't you either. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-10-09 | Friday | agency | `A3.html` | Half your customers asked a robot about you last month | It was 9% the year before. What did it say about you? | Game Plan Call (agency front end) |
| 2026-10-09 | Friday | student | `S3.html` | You're charging like a freelancer | Microsoft just made that job free. Read this before you quote anybody. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-10-11 | Sunday | agency | `A-SUN.html` | How many people did you ghost last quarter? | Not on purpose. That's what makes it expensive. | Game Plan Call (agency front end) |
| 2026-10-11 | Sunday | student | `S-SUN.html` | The layoffs aren't coming for you | 123 economists said who they are coming for. | From Xbox to Executive (book, free + $9.95 shipping) |

## Load checklist — tick each one

- [ ] Paste each file's HTML into the GHL email builder (source/code view), one campaign per row.
- [ ] Subject and preview text copied exactly from the table above.
- [ ] Sending address is chosen@mail.e4lmarketingdemos.com.
- [ ] Schedule for 8:00 AM Pacific on the send date shown.
- [ ] Test send to yourself: first name renders, unsubscribe works, every link opens.
- [ ] Agency rows go to the agency list, student rows to the student list. Never crossed.

## Bench — not scheduled

- `B1.html` — Five million robots clocked in this year
- `B2.html` — If your phone went quiet, Google did it
