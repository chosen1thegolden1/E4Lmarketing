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
| 2026-11-23 | Monday | agency | `A1.html` | Did your customers just move to Vice City? | GTA 6 dropped Thursday. Here's how your shop shows up in it. | Game Plan Call (agency front end) |
| 2026-11-23 | Monday | student | `S1.html` | AI + GTA = 🤯 | Vice City is open. So is the best content window of the year. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-11-25 | Wednesday | agency | `A2.html` | Did that October quote ever actually say no? | Five quiet days. One list worth an hour of them. | Game Plan Call (agency front end) |
| 2026-11-25 | Wednesday | student | `S2.html` | Thursday's dinner is a boss fight | Somebody's gonna ask "so what are you doing now?" You'll have an answer. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-11-27 | Friday | agency | `A3.html` | Who sent you your best customer? | One name. One text. No pitch in this one. | Game Plan Call (agency front end) |
| 2026-11-27 | Friday | student | `S3.html` | One side quest. Ten minutes. This weekend. | Do day 1. Just day 1. That's how every grind you ever won started. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-11-29 | Sunday | agency | `A-SUN.html` | How many times did you answer "how much?" this week? | Same question. Same answer. Your Sunday. | Game Plan Call (agency front end) |
| 2026-11-29 | Sunday | student | `S-SUN.html` | You're not a single hero anymore | You tried to carry solo. You still lost. | From Xbox to Executive (book, free + $9.95 shipping) |

## Load checklist — tick each one

- [ ] Paste each file's HTML into the GHL email builder (source/code view), one campaign per row.
- [ ] Subject and preview text copied exactly from the table above.
- [ ] Sending address is chosen@mail.e4lmarketingdemos.com.
- [ ] Schedule for 8:00 AM Pacific on the send date shown.
- [ ] Test send to yourself: first name renders, unsubscribe works, every link opens.
- [ ] Agency rows go to the agency list, student rows to the student list. Never crossed.
- [ ] **`A1.html` has an image.** Upload `vice-city-barbershop.jpg` (it's in this folder) to GHL Media, then replace the image's `src` with the GHL URL. Left as is, it shows in the preview and arrives **blank** in a real inbox.
- [ ] **`S1.html` has an image.** Upload `vice-city-barbershop.jpg` (it's in this folder) to GHL Media, then replace the image's `src` with the GHL URL. Left as is, it shows in the preview and arrives **blank** in a real inbox.

## Bench — not scheduled

- `B3.html` — Who told you "you're the best" this year?
- `B4.html` — You think you have to be smooth to sell
- `B1.html` — I'd build a quiz before a website
- `B2.html` — Did you answer your last bad review?
