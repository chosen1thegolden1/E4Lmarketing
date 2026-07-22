# E4L Assistant — build status & next steps

Multi-platform assistant that acts across Slack, GoHighLevel, and Google
Calendar directly from Claude (no 3rd-party automation tool like Make/n8n).

## ✅ Done

- **Slack messaging** — working end-to-end via the official Slack connector
  in claude.ai. Test message posted to #general successfully. Also built a
  zero-dependency bot-token sender (`slack.js`, `send.js`) for future
  always-on automations.
- **Google Calendar** — already connected in Claude; ready to use.
- **GoHighLevel client** — `ghl.js` + `ghl-cli.js` built and pushed. Covers
  contacts, tags, opportunities, pipelines, conversations (SMS/email),
  calendars/appointments, and workflow list + enroll.
  - NOTE: GHL's API cannot create a workflow's steps. Our code is the
    automation engine; we enroll contacts into existing GHL workflows.

## ⏳ Blocked only on one thing: network access

The GHL API host `services.leadconnectorhq.com` is blocked by this
environment's **Trusted** network policy. Fix: set the environment's
Network access to **Custom** and allow:

```
services.leadconnectorhq.com
*.leadconnectorhq.com
```

(keep the default package-manager list checked)

Credentials are provided via environment variables (set in the environment
config, NOT committed):

```
GHL_API_TOKEN=<private integration token, starts with pit->
GHL_LOCATION_ID=zSBqmFrgOtGwd4ALyIsD
```

## ▶️ First thing to do in the next session (after network is set)

Run the GHL connection test:

```bash
cd assistant && node ghl-cli.js workflows
```

If it lists workflows, GHL is connected. Then build the first automation
(user is deciding between: new lead -> contact + Slack alert; new lead ->
enroll in workflow; or book appointment + SMS confirmation).

## Architecture recap

```
MODE 1 (now):    You -> Claude -> [ghl.js / slack.js] -> GHL + Slack + Calendar
MODE 2 (later):  Event in GHL -> webhook -> [same code] -> GHL + Slack + Calendar
```
Same code; only the trigger changes. Prove flows on-demand (Mode 1), then
promote the good ones to always-on (Mode 2).
