# Abdullah — GEO Loop Handoff (AI Search Visibility)

You're taking the GEO loop from **built and tested** to **fully live**. Everything below is yours to execute — nothing routes back to Chosen except two access grants he's doing up front. Same ground rules as your main brief (`ABDULLAH_BRIEF.md`): Chosen is your only interface; if anything conflicts, defer to him.

**What this system is:** the "AI Search Visibility" service from the GEO Ops Brief (*E4L-Ops-Brief-GEO-Loop.pdf* in Drive). One command asks ChatGPT, Gemini, and Perplexity a client's 7 money questions, logs who gets recommended, screenshots every answer, and produces a client-ready report. A GitHub Action re-runs it monthly for every client on the roster. It is **completely separate from the Voice AI demo builder** — different folder (`geo/`), different workflow, different GHL assets. Breaking one cannot break the other.

**Already done and tested** (nothing to rebuild): 16 niche question templates, the audit runner, the report generator, the monthly workflow, and two real runs with evidence in `geo/audits/` — E4L's own baseline (0/21) and a Newport Beach med spa demo (5/21). Read `geo/README.md` for how the pieces work.

---

## Chosen does first (access grants)

- [ ] **Task 2 hand-back:** this is a personal repo, so the Secrets page is owner-only (GitHub has no Admin role for collaborators on personal repos). You gather the three values in Task 2 and send them to Chosen; he pastes them (Settings → Secrets and variables → Actions → New repository secret). That's his only touch.
- [ ] Decide on the optional OpenAI API key (Task 5) — it's his billing.

## Task 1 — Merge the PR (activates the automation)

A PR titled **"GEO loop: question templates, audit runner, reports, monthly automation"** is open on the repo. Scheduled workflows only fire from the default branch, so the monthly loop is dormant until this merges.

1. Review the PR (the diff is the whole `geo/` folder + one workflow file — nothing touches the demo builder).
2. Merge it.

## Task 2 — Repo secrets (you gather, Chosen pastes)

Collect these values, then send them to Chosen in one message — he pastes them under repo → Settings → Secrets and variables → **Actions** (owner-only page):

| Secret | Value | Where you get it |
|---|---|---|
| `GHL_API_TOKEN` | Private Integration token (`pit-…`) | **E4L Services** sub-account → Settings → Private Integrations → new integration, scopes: **contacts** + **custom fields** (view + edit). Never the School sub-account. |
| `GHL_LOCATION_ID` | `cVjZYdYSOnOs4rZPrzcs` | E4L Services location ID (verify in Settings → Business Profile) |
| `SLACK_WEBHOOK_URL` | Incoming webhook URL for **#cs-ops** | Task 3 |
| `ANTHROPIC_API_KEY` | should already exist from the demo builder | just confirm it's listed |
| `OPENAI_API_KEY` | optional — see Task 5 | Chosen decides |

⚠️ If `GHL_API_TOKEN`/`GHL_LOCATION_ID` already exist as secrets (the demo builder uses the same names), confirm with Chosen they already point at E4L Services before changing anything — the demo builder reads them too.

## Task 3 — Slack webhook for #cs-ops

1. [api.slack.com/apps](https://api.slack.com/apps) → **Create New App** → From scratch → name `E4L GEO Loop`, pick the workspace.
2. **Incoming Webhooks** → Activate → **Add New Webhook to Workspace** → channel **#cs-ops**.
3. Copy the webhook URL → paste as the `SLACK_WEBHOOK_URL` secret (Task 2).

## Task 4 — GHL field in E4L Services

Create one custom **contact** field, type **Single Line Text**, named **`CS GEO Score`** (E4L Services → Settings → Custom Fields). That's the whole GHL footprint of this system. The audit writes to it only for roster clients with a `ghlEmail` set.

## Task 5 — Optional: full ChatGPT coverage

ChatGPT's logged-out site only allows a few automated questions per IP, so some monthly runs will show ChatGPT as "not tested — re-tests next cycle." That is expected and reported honestly. If Chosen approves an `OPENAI_API_KEY` secret, ping him to tell Claude (via his Claude Code session) to add the API fallback adapter — that part is a code change, not yours.

## Task 6 — Prove it end to end

1. Repo → **Actions → GEO Monthly Loop → Run workflow**.
2. Wait for it to finish (~15 min), then verify all three:
   - a new commit "GEO monthly loop: audits + reports …" with fresh files under `geo/audits/eat-4-life-marketing/`
   - a summary message posted in **#cs-ops**
   - open the newest `report.html` from that commit — it should read clean enough to send a client
3. Post in #cs-ops: `GEO loop live end-to-end — [link to the run]`.

## Ongoing (this is the whole job after setup)

- **New GEO client** = add one entry to `geo/clients.json` and merge: `{ "name": "...", "city": "...", "niche": "med-spa" }` (niche keys are the filenames in `geo/money-questions/`; generic trades also take `"trade"` and `"problem"`; add `"ghlEmail"` to write the score to their GHL contact). The next monthly run picks them up automatically.
- **Prospect pitch audit on demand**: Actions → GEO Monthly Loop → Run workflow after temporarily adding the prospect to the roster — or ask Chosen to have Claude run a one-off.
- **Rozel's QA gate**: reports are generated, never auto-sent. Rozel reviews `report.html` before anything reaches a client.

## Guardrails (same as ever)

- E4L Services sub-account only. **Never** the School.
- Client-facing copy: **"AI Marketing Made Easy."** Never "Everybody Eats."
- Never promise citations, rankings, or results — the reports already carry the disclaimer; don't remove it.
- Nothing in this loop creates a task for Chosen.

## Definition of Done

- [ ] PR merged; `GEO Monthly Loop` visible under Actions on the default branch
- [ ] All secrets set (Task 2 table complete)
- [ ] `CS GEO Score` field exists in E4L Services
- [ ] Manual workflow run: evidence committed + #cs-ops post + readable report (Task 6)
- [ ] Confirmation posted in #cs-ops
- [ ] Chosen's task count from this loop: zero
