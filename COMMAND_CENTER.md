# 🧭 Daily Command Center

Your personal AI cockpit, powered by your `CLAUDE.md` profile. Everything is
**READ-ONLY by default** — nothing is ever sent, deleted, or archived without
your explicit "yes."

## What's here

### Sub-agents (`.claude/agents/`)
- **inbox-analyst** — reads recent Gmail (unread + last 24h), sorts it into
  Needs Reply / FYI / Ignore using your importance rules. Read-only.
- **calendar-analyst** — reads today + tomorrow morning, flags conflicts,
  back-to-backs, and prep. Read-only.

### Slash commands (`.claude/commands/`)
- **`/brief`** — runs both analysts in parallel and writes your Morning Brief
  (Top 3 · Calendar · Inbox · Time Blocks). Saves a copy to `daily/`.
- **`/replies`** — drafts replies to your Needs-Reply emails in your voice.
  Shows them first; only saves Gmail drafts if you say so. Never sends.
- **`/wrap`** — end-of-day: captures what got done, logs open loops and
  carry-overs into today's `daily/` note.

## How to run it

Open this project in Claude Code, then:

1. **Morning:** type `/brief` → get your Morning Brief.
2. **Clear your inbox:** type `/replies` → review drafts → tell me which to save.
3. **End of day:** type `/wrap` → answer a couple quick questions → tomorrow's
   setup is logged.

## The one rule
I read and suggest. **You** decide and send. Nothing leaves your accounts
without your explicit go-ahead.
