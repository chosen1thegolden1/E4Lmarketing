# Send schedule — week of 2026-11-30

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
| 2026-11-30 | Monday | agency | `A1.html` | Who bought from you over the long weekend? | By January they won't remember your name. Unless you send one message. | Game Plan Call (agency front end) |
| 2026-11-30 | Monday | student | `S1.html` | Everybody's selling to you this week. Want to switch sides? | Every one of those ads, somebody got paid to make. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-12-02 | Wednesday | agency | `A2.html` | Somebody tried to text you from Google Maps | Google put a Message button right next to Call. Where does that text go? | Game Plan Call (agency front end) |
| 2026-12-02 | Wednesday | student | `S2.html` | You already know what your barber is doing wrong | You've been the customer your whole life. That was the training. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-12-04 | Friday | agency | `A3.html` | How many apps are you paying for that you never set up? | Open last month's card statement. Count them. Then stop feeling bad. | Game Plan Call (agency front end) |
| 2026-12-04 | Friday | student | `S3.html` | What are you doing with 7pm to midnight? | Your job owns the day. The night is still yours. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-12-06 | Sunday | agency | `A-SUN.html` | What does a customer hear when they call you on a Sunday? | Find out this evening. From a number your phone won't recognize. | Game Plan Call (agency front end) |
| 2026-12-06 | Sunday | student | `S-SUN.html` | Where do you want to be by next December? | Not a resolution. One job, one business, and a year that's going by anyway. | From Xbox to Executive (book, free + $9.95 shipping) |

## Load checklist — tick each one

- [ ] Paste each file's HTML into the GHL email builder (source/code view), one campaign per row.
- [ ] Subject and preview text copied exactly from the table above.
- [ ] Sending address is chosen@mail.e4lmarketingdemos.com.
- [ ] Schedule for 8:00 AM Pacific on the send date shown.
- [ ] Test send to yourself: first name renders, unsubscribe works, every link opens.
- [ ] Agency rows go to the agency list, student rows to the student list. Never crossed.

## Bench — not scheduled

- `B1.html` — Did somebody try to give you as a gift this year?
- `B2.html` — You don't need followers to get paid
