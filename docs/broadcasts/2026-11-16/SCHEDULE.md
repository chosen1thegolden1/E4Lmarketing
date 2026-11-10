# Send schedule — week of 2026-11-16

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
| 2026-11-16 | Monday | agency | `A1.html` | If you're not doing this you have a problem | Everyone you ever sold to is still in there. | Game Plan Call (agency front end) |
| 2026-11-16 | Monday | student | `S1.html` | I worked the gigs before any of this | The first job isn't the opposite of the dream. It's the on-ramp. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-11-18 | Wednesday | agency | `A2.html` | Who owes you money right now? | 47% last year. 59% now. Somebody is covering that gap, and it's not them. | Game Plan Call (agency front end) |
| 2026-11-18 | Wednesday | student | `S2.html` | What did you master in your favorite game? | I'll go first. Then I'll tell you what came after. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-11-20 | Friday | agency | `A3.html` | Does Google know you're closed Thursday? | One setting. A couple of minutes. Before the holiday week. | Game Plan Call (agency front end) |
| 2026-11-20 | Friday | student | `S3.html` | Type one paragraph. Get a website. | No code. No templates. Just tell it what the business does. | From Xbox to Executive (book, free + $9.95 shipping) |
| 2026-11-22 | Sunday | agency | `A-SUN.html` | Who's texting your business tonight? | Monday morning is a long time to wait. | Game Plan Call (agency front end) |
| 2026-11-22 | Sunday | student | `S-SUN.html` | This is what ONE client looks like | $14,960 in a month. From emails. Not one of them was a TikTok. | From Xbox to Executive (book, free + $9.95 shipping) |

## Load checklist — tick each one

- [ ] Paste each file's HTML into the GHL email builder (source/code view), one campaign per row.
- [ ] Subject and preview text copied exactly from the table above.
- [ ] Sending address is chosen@mail.e4lmarketingdemos.com.
- [ ] Schedule for 8:00 AM Pacific on the send date shown.
- [ ] Test send to yourself: first name renders, unsubscribe works, every link opens.
- [ ] Agency rows go to the agency list, student rows to the student list. Never crossed.
- [ ] **`A1.html` has an image.** Upload `drip-client-sept-2026.jpg` (it's in this folder) to GHL Media, then replace the image's `src` with the GHL URL. Left as is, it shows in the preview and arrives **blank** in a real inbox.
- [ ] **`S3.html` has an image.** Upload `braids-site.jpg` (it's in this folder) to GHL Media, then replace the image's `src` with the GHL URL. Left as is, it shows in the preview and arrives **blank** in a real inbox.
- [ ] **`S-SUN.html` has an image.** Upload `drip-client-sept-2026.jpg` (it's in this folder) to GHL Media, then replace the image's `src` with the GHL URL. Left as is, it shows in the preview and arrives **blank** in a real inbox.

## Bench — not scheduled

- `B1.html` — One business. $497 a month. Just to post.
- `B2.html` — The vendor burned you. Don't quit the game.
