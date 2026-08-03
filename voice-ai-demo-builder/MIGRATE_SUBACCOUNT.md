# Moving the Demo Builder to Its Own Sub-Account

The demo builder is **code that points at a location ID** — not a GHL asset. Its
entire footprint inside a sub-account is two custom fields, one form, and
whatever agents/contacts it has created. Moving it is a config change, not a
data migration.

## Direction: move the demo builder, never the students

| | Students side | Demo builder side |
| --- | --- | --- |
| Contacts | ~2,900 with years of history | a handful, mostly tests |
| Assets | funnels, forms, workflows, pipelines, email history | 2 custom fields, 1 form |
| Phone | A2P-registered texting numbers | demo numbers (cheap to re-buy) |
| Cost to move | conversation history, notes, appointments, attribution all lost on export/import | ~15 minutes |

Exporting contacts to a new sub-account carries names/emails/custom fields but
**not** conversation threads, notes, appointment history, or attribution. Never
pay that price for the larger, older side of the business.

## Snapshots: not the tool for this

A GHL snapshot carries funnels, workflows, forms, custom fields, and pipelines.
It does **not** carry contacts, phone numbers, or Voice AI agents. For this
system a snapshot would move exactly two custom fields and one form — which
`npm run setup-location` recreates in seconds, versioned in git. Skip the
snapshot.

## Migration steps

1. **Create the sub-account** (agency level) — e.g. "E4L Voice AI Demos".
2. **Private integration** — inside the NEW sub-account: Settings → Private
   Integrations → New. Scopes: Voice AI, Contacts, Custom Fields, and phone
   numbers (read). Copy the `pit-…` token.
3. **Prepare the location** — run against the new sub-account:
   ```bash
   GHL_API_TOKEN=pit-NEW GHL_LOCATION_ID=NEW_ID npm run setup-location
   ```
   Creates the custom fields and prints exactly what's left.
4. **Buy demo numbers** in the new sub-account (2–3 to start). Numbers do not
   move between sub-accounts self-serve — buying fresh is cheaper than the
   support ticket, and it returns the borrowed numbers to their owners.
5. **Rebuild the rep form** in the new sub-account — see `REP_PORTAL.md`. Same
   name (`Voice AI Demo Request`), same three fields. Reshare the new link with
   reps; the old link dies with the old form.
6. **Update repo secrets** — `GHL_API_TOKEN` and `GHL_LOCATION_ID` to the new
   sub-account's values.
7. **Update `pool.json`** with the new numbers, and reset `demos/registry.json`
   to `{}` (old agent IDs live in the old sub-account and are meaningless in
   the new one). Existing demo pages keep working — they're static HTML — but
   their call buttons point at old-sub-account numbers until rebuilt.
8. **Rebuild any keeper demos** (one command each) so their agents live in the
   new sub-account:
   ```bash
   npm run demo -- https://theirsite.com --push
   ```
9. **Clean up the old sub-account** — delete the Voice AI agents, the two
   custom fields, and the form from the students' location so nothing is
   left half-wired.

## Deliverability: sequence this correctly

The dedicated sending domain must be configured **in whichever sub-account
sends the outreach**. If the contractor sets it up in the students' sub-account
and the demo builder then moves, that work has to be redone in the new location.

**Decide the sub-account split before the contractor starts** — or tell them
immediately which location to target. Everything in the deliverability PDF
applies unchanged; only the target sub-account differs.

## Bonus: this split is good hygiene anyway

Cold outreach and student nurture should never share a sending reputation. A
spam complaint from cold prospecting shouldn't be able to hurt deliverability
to paying students, and vice versa. Separate sub-accounts with separate sending
domains gives that isolation for free.
