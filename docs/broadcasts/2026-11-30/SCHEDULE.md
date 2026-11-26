# Send schedule — week of 2026-11-30

Built by `scripts/build-emails.js`. Every link below is already live in the HTML.

**Who does what:** Claude writes · Claude edits in a second pass · **Chosen approves** ·
**Abdullah loads these into GHL** · Daniel is second eyes on E4L Services and Student.
He gets the schedule and the offers so he can tie traffic and sales back to
the sends.

**Send from:** chosen@mail.e4lmarketingdemos.com — never gsgagency.com.
**Send time:** 8:00 AM Pacific, unless the Day column gives another time.
**Merge tags:** first name `{{contact.first_name}}`, unsubscribe `{{unsubscribe_url}}`. Send yourself a
test first — if either renders literally, fix it once in `scripts/build-emails.js`.

| Send date | Day | Side | File | Subject | Preview text | Sells |
|---|---|---|---|---|---|---|
| 2026-11-30 | Monday | agency | `A1.html` | They'll forget you by January | Unless you send them one message this week. | Game Plan Call (agency front end) |
| 2026-11-30 | Monday **2:00 PM PT** | agency | `A4.html` | {{contact.first_name}}, this is gone at midnight | Your whole marketing department, in 100 prompts. $149 for life, until 11:59 PM Pacific. | E4L Vault: $149 lifetime / $39 Lite, ends Mon Nov 30 11:59 PM PT |
| 2026-11-30 | Monday | student | `S1.html` | {{contact.first_name}}, I'll skip the BS. Switch sides. | Every one of those ads, somebody got paid to make. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-11-30 | Monday **2:00 PM PT** | student | `S4.html` | {{contact.first_name}}, midnight. Then it's gone. | 100 AI prompts that do the work businesses pay for. $149 for life or $39 once. | E4L Vault: $149 lifetime / $39 Lite, ends Mon Nov 30 11:59 PM PT |
| 2026-12-01 | Tuesday | agency | `A5.html` | {{contact.first_name}}, it was never on sale | The book behind all of this is $9.95. Every day. | From Xbox to Executive ($9.95 ebook, +$9.95 audiobook) |
| 2026-12-01 | Tuesday | student | `S5.html` | {{contact.first_name}}, missed every Black Friday deal? | Good. The one that matters is still $9.95. | From Xbox to Executive ($9.95 ebook, +$9.95 audiobook) |
| 2026-12-02 | Wednesday | agency | `A2.html` | Google just gave your customers a text button | It sits right next to Call. Where does that text go when you're busy? | Game Plan Call (agency front end) |
| 2026-12-02 | Wednesday | student | `S2.html` | I know what your barber's doing wrong | You've been the customer your whole life. That was the training. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-12-04 | Friday | agency | `A3.html` | Check your card statement | Count the apps you never set up. Then stop feeling bad. | Game Plan Call (agency front end) |
| 2026-12-04 | Friday | student | `S3.html` | {{contact.first_name}}, what are you doing tonight? | Your job owns the day. The night is still yours. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-12-06 | Sunday | agency | `A-SUN.html` | Call yourself tonight | Listen like a stranger would. That's who called you this weekend. | Game Plan Call (agency front end) |
| 2026-12-06 | Sunday | student | `S-SUN.html` | Hi, do you remember last December? | Not a resolution. One job, one business, and a year that's going by anyway. | From Xbox to Executive (book, free + $9.95 shipping) |

## Load checklist — tick each one

- [ ] Paste each file's HTML into the GHL email builder (source/code view), one campaign per row.
- [ ] Subject and preview text copied exactly from the table above.
- [ ] Sending address is chosen@mail.e4lmarketingdemos.com.
- [ ] Schedule each at its time: 8:00 AM Pacific on the send date, unless the Day column gives another time.
- [ ] Test send to yourself: first name renders, unsubscribe works, every link opens.
- [ ] Agency rows go to the agency list, student rows to the student list. Never crossed.

## Bench — not scheduled

- `B1.html` — Somebody tried to buy you as a gift. They got a candle.
- `B2.html` — You don't need followers to get paid
