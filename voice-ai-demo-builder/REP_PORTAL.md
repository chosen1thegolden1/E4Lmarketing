# Rep Portal — GHL Form → Demo Builder

Reps and affiliates submit leads through a branded GHL form. They never see
GitHub. Flow:

```
Rep fills form → GHL workflow → webhook → GitHub builds demo
  → page live + agent + number + contact tagged → GHL emails the lead
```

## 1. Create the form (GHL → Sites → Forms → Builder)

Name: **Voice AI Demo Request**. Fields:

| Field | Type | Maps to |
| --- | --- | --- |
| Lead's Website | Text (required) | workflow input `website_url` |
| Lead's Email | Email (required) | workflow input `lead_email` |
| Your Rep Code | Dropdown (required) | workflow input `rep` |

Make **Your Rep Code** a dropdown with one option per rep (e.g. `alex`,
`jordan`, `sam`). Onboarding a new rep = adding a dropdown option. Share the
form's public link with reps — that link IS the portal.

> Tip: set the form to capture the REP's email too if you want submission
> receipts, but keep "Lead's Email" as its own custom field so it doesn't
> create the contact under the rep's address.

## 2. Create the GitHub token (one-time, owner only)

1. github.com → Settings → Developer settings → **Fine-grained tokens** → Generate new token
2. Name: `ghl-demo-trigger` · Expiration: 1 year
3. Repository access: **Only select repositories** → `chosen1thegolden1/E4Lmarketing`
4. Permissions → Repository permissions → **Actions: Read and write** (nothing else)
5. Generate, copy the `github_pat_…` value. It goes ONLY into the webhook
   header below (never into the repo).

## 3. Create the workflow (GHL → Automation → Workflows)

Trigger: **Form Submitted** → Voice AI Demo Request

Action: **Custom Webhook**
- Method: `POST`
- URL:
  `https://api.github.com/repos/chosen1thegolden1/E4Lmarketing/actions/workflows/build-demo.yml/dispatches`
- Headers:
  - `Authorization`: `Bearer github_pat_XXXX` (the token from step 2)
  - `Accept`: `application/vnd.github+json`
  - `Content-Type`: `application/json`
- Body (raw JSON — replace the merge-field placeholders with GHL's field
  picker values for your form fields):

```json
{
  "ref": "claude/build-eat4life-website-01V86jRtpmdCuFxu3he73xcf",
  "inputs": {
    "website_url": "{{contact.leads_website}}",
    "lead_email": "{{contact.leads_email}}",
    "rep": "{{contact.your_rep_code}}"
  }
}
```

GitHub replies `204 No Content` on success (no body — that's normal).

## 4. What happens automatically after submit

- Demo page live at `https://chosen1thegolden1.github.io/E4Lmarketing/<lead-domain>/` (~3 min)
- Voice AI agent created + pool number attached
- Lead upserted as a GHL contact: `voice-demo` tag, `rep:<code>` tag,
  Voice Demo URL + Voice Demo Phone fields filled
- The `voice-demo` tag fires the outreach email workflow (see EMAIL_TEMPLATE.md)

## 5. Rep accountability

- Filter contacts by `rep:<code>` for per-rep pipeline and commissions
- The form submissions list is the raw activity log
- `demos/registry.json` shows which rep burned which pool number
