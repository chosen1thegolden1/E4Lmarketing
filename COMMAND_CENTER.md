# 🧭 Daily Command Center — v2.2

Your personal AI cockpit, powered by your `CLAUDE.md` profile and brand colors.
**Read-only by default** — nothing is ever sent, deleted, or archived, and the
only writes are (a) your daily notes, (b) Gmail *drafts* you approve, and (c)
your own profile via `/tune`. All three need your explicit "yes."

---

## ⌨️ Commands at a glance

| Command | What it does | Writes anything? |
|---------|--------------|------------------|
| **`/brief`** | Runs the inbox + calendar analysts in parallel → Morning Brief (Top 3 · Calendar · Inbox · Time Blocks). Saves it to `daily/` and refreshes `dashboard.html`. | Daily note + dashboard (yours only) |
| **`/dashboard`** | Rebuilds `dashboard.html` from your latest daily note and opens it in your browser. | Dashboard file only |
| **`/replies`** | Drafts replies to your Needs-Reply emails **in your voice**, shows them, lets you edit, and — only when you say "save 1 and 3" — creates them as Gmail **drafts**. Never sends. | Gmail *drafts*, only on your yes |
| **`/tune`** | You give plain-English feedback about what a brief got wrong; it proposes concrete rule changes, shows a before/after diff, and updates `CLAUDE.md` only after you confirm. | Your profile, only on your yes |
| **`/wrap`** | End-of-day: asks what got done, logs open loops + carry-overs into today's daily note. | Daily note only |

---

## 🔩 Under the hood

### Sub-agents (`.claude/agents/`) — both READ-ONLY
- **inbox-analyst** — reads recent Gmail (unread + last 24h), applies your
  **Sender Rules** as hard overrides first, then sorts everything into
  🔴 Needs Reply / 🟡 FYI / ⚪ Ignore, with a one-line **"why"** on each
  surfaced item. Cannot send, draft, label, archive, or delete.
- **calendar-analyst** — reads today + tomorrow morning, flags conflicts,
  back-to-backs, and prep. Times in PST. Cannot change any event.

### Your profile (`CLAUDE.md`)
- Who you are, VIPs, reply voice, priorities, and the importance rules.
- **Sender Rules** — two lists (`Always ignore` / `Always surface`) that `/tune`
  grows over time. A match here overrides normal judgment; if a sender matches
  both, *Always surface* wins.

### The visual face (`dashboard.html`)
- Single self-contained file in your **brand colors** (Gold `#FFC200`, Black,
  White). Light + premium dark mode. Built from `.claude/dashboard-spec.md`.

### Daily notes (`daily/YYYY-MM-DD.md`)
- One file per day: the Morning Brief, plus the end-of-day Wrap-Up.

---

## 🔁 Your daily rhythm

1. **Morning** — double-click **`Command-Center.command`** (pulls latest + opens
   the dashboard), or run **`/brief`** for a fresh pull.
2. **Clear the inbox** — run **`/replies`**, review the drafts, approve the ones
   you want saved to Gmail, send them yourself.
3. **Something mis-sorted?** — run **`/tune "…"`** and confirm the rule change.
4. **End of day** — run **`/wrap`** to log open loops and tee up tomorrow.

---

## ▶️ Running it on your Mac

**One-click:** double-click **`Command-Center.command`** (pulls latest + opens
the dashboard). First time only: right-click → Open to approve it.

**Fresh data / to use commands:** open the project in Claude Code, then type any
command above. To sync the latest to your laptop:
```
cd ~/Desktop/E4Lmarketing
git pull
```

---

## 🔒 The one rule
I **read and suggest**. **You** decide and send. Nothing leaves your accounts
without your explicit go-ahead — and `/replies` can only ever create *drafts*,
never send.
