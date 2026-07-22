// Zero-dependency Slack sender for the E4L Assistant.
// Uses Node's built-in fetch (Node 18+), so there's nothing to npm install.
//
// Reads the bot token from the SLACK_BOT_TOKEN env var (loaded from .env).
// Exposes two helpers:
//   sendMessage(channel, text)  -> post to a channel ("#sales" or "C0123..." id)
//   dmByEmail(email, text)      -> look a person up by email and DM them

const SLACK_API = "https://slack.com/api";

function token() {
  const t = process.env.SLACK_BOT_TOKEN;
  if (!t) {
    throw new Error(
      "SLACK_BOT_TOKEN is not set. Copy assistant/.env.example to assistant/.env and paste your xoxb- token."
    );
  }
  return t;
}

async function slackCall(method, body) {
  const res = await fetch(`${SLACK_API}/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Slack API error on ${method}: ${data.error}`);
  }
  return data;
}

// Post a message to a channel. `channel` can be "#name" or a channel ID.
async function sendMessage(channel, text) {
  return slackCall("chat.postMessage", { channel, text });
}

// Find a user by email, then send them a direct message.
async function dmByEmail(email, text) {
  const { user } = await slackCall("users.lookupByEmail", { email });
  return slackCall("chat.postMessage", { channel: user.id, text });
}

module.exports = { sendMessage, dmByEmail };
