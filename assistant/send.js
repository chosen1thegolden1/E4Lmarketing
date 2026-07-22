#!/usr/bin/env node
// Simple CLI wrapper around the Slack sender.
//
// Usage:
//   node send.js "#channel"        "your message here"
//   node send.js "email@person.com" "your DM here"
//
// It auto-detects: if the target looks like an email, it sends a DM;
// otherwise it posts to the channel.

require("./env");
const { sendMessage, dmByEmail } = require("./slack");

async function main() {
  const [target, ...rest] = process.argv.slice(2);
  const text = rest.join(" ");

  if (!target || !text) {
    console.error('Usage: node send.js "<#channel|email>" "<message>"');
    process.exit(1);
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target);
  if (isEmail) {
    await dmByEmail(target, text);
    console.log(`✅ DM sent to ${target}`);
  } else {
    await sendMessage(target, text);
    console.log(`✅ Message posted to ${target}`);
  }
}

main().catch((err) => {
  console.error(`❌ ${err.message}`);
  process.exit(1);
});
