# Send schedule — week of 2026-11-23

Built by `scripts/build-emails.js`. Every link below is already live in the HTML.

**Who does what:** Claude writes · Claude edits in a second pass · **Chosen approves** ·
**Abdullah loads these into GHL** · Daniel is second eyes on E4L Services and Student.
He gets the schedule and the offers so he can tie traffic and sales back to
the sends.

**Send from:** agency (A6) from chosen@mail.e4lmarketingdemos.com; student (S6) from chosen@mail.joineat4life.com, as every week. Never gsgagency.com.
**Send time:** 8:00 AM Pacific, unless the Day column gives another time.
**Merge tags:** first name `{{contact.first_name}}`, unsubscribe `{{unsubscribe_url}}`. Send yourself a
test first — if either renders literally, fix it once in `scripts/build-emails.js`.

| Send date | Day | Side | File | Subject | Preview text | Sells |
|---|---|---|---|---|---|---|
| 2026-11-28 | Saturday | agency | `A6.html` | {{contact.first_name}}, your marketing team just showed up | 100 AI prompts that do the jobs you've been doing alone. $149 for life or $39 once, through Cyber Monday. | E4L Vault: $149 lifetime / $39 Lite, ends Mon Nov 30 11:59 PM PT |
| 2026-11-28 | Saturday | student | `S6.html` | {{contact.first_name}}, your Black Friday loot drop is here | 100 AI prompts that do the work businesses pay for. $149 for life or $39 once, through Cyber Monday. | E4L Vault: $149 lifetime / $39 Lite, ends Mon Nov 30 11:59 PM PT |

## Load checklist — tick each one

- [ ] Paste each file's HTML into the GHL email builder (source/code view), one campaign per row.
- [ ] Subject and preview text copied exactly from the table above.
- [ ] Sending address: A6 from chosen@mail.e4lmarketingdemos.com, S6 from chosen@mail.joineat4life.com.
- [ ] Schedule each at its time: 8:00 AM Pacific on the send date, unless the Day column gives another time.
- [ ] Test send to yourself: first name renders, unsubscribe works, every link opens.
- [ ] Agency rows go to the agency list, student rows to the whole student list (Black Friday exception). Never crossed.

