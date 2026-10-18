# Revenue Leak Scorecard PDF

When a lead finishes the Revenue Leak Scorecard, they get a branded PDF of
their results by email a minute or two later. GHL sends the email; GitHub
builds the PDF.

```
scorecard page ──> GHL CS-Scorecard-Intake ──(repository_dispatch)──> GitHub Action "Scorecard PDF"
                                                                          │ builds PDF (headless Chrome)
                                                                          │ uploads it to GHL Media
                                                                          │ sets contact.cs_scorecard_pdf_url
                                                                          ▼ re-adds tag cs-scorecard-pdf-ready
                         GHL "Scorecard PDF email" workflow (tag added) ──> sends the email with the PDF link
```


> **One email only.** Every lead gets the same follow-up email with their PDF link. There is no "no-PDF" version and no fallback email. Do not build one.

## GHL setup (one time)

1. **Custom field:** create a contact custom field, single-line text, named
   `cs_scorecard_pdf_url` (key `contact.cs_scorecard_pdf_url`).
2. **Tag:** `cs-scorecard-pdf-ready` (created automatically the first time, or create it up front).
3. **Dispatch step** at the end of `CS-Scorecard-Intake` (after the contact is created/updated):
   Webhook / Custom webhook, `POST https://api.github.com/repos/chosen1thegolden1/E4Lmarketing/dispatches`
   - Headers: `Accept: application/vnd.github+json`, `Authorization: Bearer {{custom_values.github_dispatch_token}}`
   - Body (JSON). Keep the scorecard values under `lead`: GitHub allows only 10 top-level keys in `client_payload`.
     ```json
     {
       "event_type": "scorecard_submitted",
       "client_payload": {
         "contact_id": "{{contact.id}}",
         "lead": {
           "first_name": "...", "company_name": "...", "email": "...",
           "industry": "...", "customer_value": "...", "monthly_inquiries": "...",
           "database_size": "...", "leak_monthly": "...", "leak_annual": "...",
           "grade": "...", "recommended_tier": "...",
           "leak_missed_calls": "...", "leak_slow_response": "...",
           "leak_dead_database": "...", "leak_no_shows": "...", "leak_follow_up": "..."
         }
       }
     }
     ```
     Each `"..."` is the matching value the scorecard page posted into the inbound webhook.
     Only `first_name`, `email` and `leak_monthly` are required. Without the five `leak_*`
     breakdown values the PDF still works, but lists the five leaks unranked instead of
     ranking them by dollars. A success response is `204` with an empty body.
4. **Email workflow:** trigger "Contact Tag added: `cs-scorecard-pdf-ready`" → Send Email,
   linking to `{{contact.cs_scorecard_pdf_url}}`.

## Repo setup

- Secrets `GHL_API_TOKEN` and `GHL_LOCATION_ID` (already used by the GEO loop). The token
  needs to be able to read custom fields, upload media, update contacts and add/remove tags.
- Optional repo variable `SCORECARD_BOOKING_URL`: the Game Plan Call booking link used on the
  PDF's button. Without it the button opens an email to chosen1@gsgagency.com.

## Testing

Actions → **Scorecard PDF** → Run workflow, paste a payload. With "dry run" ticked it only
builds the PDF: download it from the run's **Artifacts** (kept 3 days). Untick it to also
deliver to the GHL contact in the payload, which fires the real email.

Locally: `DRY_RUN=1 node scorecard/build-pdf.js payload.json` (needs Chrome or Chromium;
set `CHROME_BIN` if it isn't found).
