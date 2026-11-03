# Send schedule — week of 2026-11-09

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
| 2026-11-09 | Monday | agency | `A1.html` | The Gen Z kid was half right | Posting more was the right half. Nobody sold you the other one. | E4L Agency website (Scorecard + Game Plan Call live there) |
| 2026-11-09 | Monday | student | `S1.html` | Your first client might be a taco truck | One picture. One business. That's the whole first move. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-11-11 | Wednesday | agency | `A2.html` | Did you pay for a call you never answered? | Twenty seconds on the line. Nobody home. Still your lead. | Game Plan Call (agency front end) |
| 2026-11-11 | Wednesday | student | `S2.html` | I don't have a degree | The permission slip you're waiting on might not exist. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-11-13 | Friday | agency | `A3.html` | A robot is about to call your business | 848 calls went out in early October. Only 1 in 25 businesses had an AI picking up. | Game Plan Call (agency front end) |
| 2026-11-13 | Friday | student | `S3.html` | The holidays are coming. The money isn't. | Thirteen days, $0, ten minutes a day. Better than scrolling. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-11-15 | Sunday | agency | `A-SUN.html` | What does your January look like? | Whoever starts in November is already running by March. | Game Plan Call (agency front end) |
| 2026-11-15 | Sunday | student | `S-SUN.html` | You haven't eaten yet | Everyone works hard, so everyone eats. | From Xbox to Executive (book, free + $9.95 shipping) |

## Load checklist — tick each one

- [ ] Paste each file's HTML into the GHL email builder (source/code view), one campaign per row.
- [ ] Subject and preview text copied exactly from the table above.
- [ ] Sending address is chosen@mail.e4lmarketingdemos.com.
- [ ] Schedule for 8:00 AM Pacific on the send date shown.
- [ ] Test send to yourself: first name renders, unsubscribe works, every link opens.
- [ ] Agency rows go to the agency list, student rows to the student list. Never crossed.
- [ ] **`S1.html` has an image.** Upload `taco-truck-promo.jpg` (it's in this folder) to GHL Media, then replace the image's `src` with the GHL URL. Left as is, it shows in the preview and arrives **blank** in a real inbox.

## Bench — not scheduled

- `B1.html` — Before the agency, I showed up
- `B2.html` — The vendor burned you. Don't quit the game.
