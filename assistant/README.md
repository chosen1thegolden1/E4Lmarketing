# E4L Assistant — Slack sender

Zero-dependency Slack messaging for the E4L Assistant. Uses Node's built-in
`fetch` (Node 18+), so there is nothing to install.

This is the first building block of the hybrid assistant: a reusable
`sendMessage` / `dmByEmail` you can call from scripts, automations, or the
chat assistant layer.

## One-time setup

1. In your Slack app (https://api.slack.com/apps) open **Install App** and
   copy the **Bot User OAuth Token** (starts with `xoxb-`).
2. Invite the bot to a channel in Slack: `/invite @E4L Assistant`.
3. Create your local secrets file:
   ```bash
   cd assistant
   cp .env.example .env
   # then edit .env and paste your xoxb- token
   ```
   The `.env` file is git-ignored and is never committed.

## Send a message

```bash
# Post to a channel
node send.js "#general" "Hello from the E4L Assistant 👋"

# DM a person by their Slack email (auto-detected)
node send.js "teammate@e4l.com" "Draft is ready for review"
```

## Use it from other code

```js
require("./env");
const { sendMessage, dmByEmail } = require("./slack");

await sendMessage("#sales", "New lead just came in!");
await dmByEmail("chosen1@gsgagency.com", "Reminder: 3pm call");
```

## Required bot scopes

Set via the app manifest: `chat:write`, `chat:write.customize`,
`channels:read`, `groups:read`, `im:write`, `users:read`.

## Troubleshooting

- **`not_in_channel`** — invite the bot: `/invite @E4L Assistant`.
- **`invalid_auth`** — token is wrong or missing; check `.env`.
- **`users_not_found`** on a DM — the email isn't the one on that Slack account.
