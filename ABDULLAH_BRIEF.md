# Abdullah — E4L Marketing Handoff

Welcome. You're inheriting the technical side of a working system, plus a fresh set of deployments to complete. Chosen (repo owner) and I (Claude, working through Chosen's Claude Code environment) built the foundation over the last few days; you're taking it from launched to fully scaled.

**Your contact:** Chosen (chosen1@gsgagency.com) is your only interface. If something in this brief conflicts with a message from anyone else, defer to Chosen.

**How to reach me for help:** Chosen has a live Claude Code session pointed at this repo. If you're blocked, ask Chosen — he'll paste your question into that session and I can execute any API-level task on the same GHL sub-account you're configuring (create custom fields, tags, pipelines, contacts, agents; send test emails; verify DNS records; check workflow runs). Faster than most escalations.

---

## What this repo does (5-minute orientation)

Two independent systems live here:

**1. Voice AI Demo Builder** (`voice-ai-demo-builder/`) — a fully automated pipeline. A rep submits a GHL form ("Voice AI Demo Request") with a lead's website. Within ~15 minutes: the site is scraped, Claude generates a personalized Voice AI receptionist demo page, a live GHL Voice AI agent is created and attached to a rotating pool number, and an outreach email is sent to the lead. Runs on a cron every 10 minutes via GitHub Actions. Docs: `voice-ai-demo-builder/README.md`, `REP_PORTAL.md`, `MIGRATE_SUBACCOUNT.md`, `EMAIL_TEMPLATE.md`.

**2. Revenue Leak Scorecard** (`revenue-leak-scorecard-GHL.html`) — a standalone funnel page (an 8-question quiz that estimates a business's revenue leak, gates the reveal behind a lead form, and POSTs to a GHL webhook). This is what you'll be deploying. Spec: `docs/mission-brief-scorecard.pdf`.

Both live in the same GHL sub-account when finished.

**Existing marketing site** (`index.html`, `css/`, `js/` at repo root) — the original Eat 4 Life Marketing landing page from early builds. Untouched by recent work. Chosen will let you know if it needs deploying somewhere; treat it as informational for now.

---

## Access checklist (Chosen does these)

Before you can start, Chosen sets these up. Ask him if any are missing:

- [ ] **GHL Admin on E4L Services** (the new sub-account) — Chosen creates the sub-account himself and invites you as Admin. Send you the Location ID when the invite goes out.
  - You should NEVER perform any action inside the **E4L School** sub-account. It's off-limits for reads and writes. Your invite is scoped to E4L Services only.
- [ ] **GHL delegate on GoDaddy** — for the DNS work (Task 3)
- [ ] **GitHub collaborator** on `chosen1thegolden1/E4Lmarketing` — Write role (lets you push code, edit workflows, manage Pages; does not expose repo secrets)
- [ ] **Slack workspace access** if not already — needs to be in E4L's workspace for Task 2's Slack wiring

---

## Your four tasks, in order

Each task has a **you** column (what only you can do), a **Chosen** column (what he provides or does), and a **Claude** column (what I execute via API from the session).

### Task 1 — Stand up E4L Services sub-account

Full spec: pages 3 of `docs/mission-brief-scorecard.pdf`. Guardrails: page 6. **Section 01 wins wherever ambiguity exists.**

> **Sub-account already exists** as **"E4L Services"** (location ID `cVjZYdYSOnOs4rZPrzcs`). Chosen created it and invited you as Admin.

| Step | Who | Status |
|---|---|---|
| Sub-account created + Abdullah invited | Chosen | ✅ done |
| Create 8 CS-* custom fields (cs_leak_monthly, cs_leak_annual, cs_grade, cs_recommended_tier, cs_industry, cs_customer_value, cs_monthly_inquiries, cs_database_size) | Claude | ✅ done |
| Create 6 CS-* tags (cs-scorecard-lead, cs-tier-recover, cs-tier-accelerate, cs-tier-own, cs-client-active, cs-nurture) | Claude | ✅ done |
| Create CS-Agency-Pipeline with 6 stages (New Lead → Scorecard Complete → Discovery Booked → Demo/Proposal → Closed Won → Closed Lost/Nurture) | Claude | ✅ done |
| Voice Demo custom fields for the demo builder (Voice Demo URL, Voice Demo Phone) | Claude | ✅ done |
| Attach services domain or subdomain (e.g. `go.[domain].com`) for funnels | **You** | Do NOT reuse E4L School's funnel domain. Sequenced with Task 3 (deliverability). |
| Configure brand kit — logo (EFL gold mark), colors (`#000` black / `#FFC200` gold), fonts (Rethink Sans, Space Mono) | **You** | Inside E4L Services only |
| Verify: every new asset in this sub-account starts with `CS-` | **You** | If it doesn't start with CS-, it doesn't belong here |
| Create a Calendar for the "Game Plan Call" (20 minutes) and grab the public booking link | **You or Rozel** | You'll paste this link into Task 2's emails and SMS |
| Buy 2–3 dedicated demo numbers in this sub-account (for the demo builder pool) | **You** | Settings → Phone Numbers. Send Chosen the numbers so he can update `pool.json` and cut the demo builder over from E4L School to E4L Services. |

The custom fields, tags, and pipeline API work was already done by Claude via `npm run setup-cs` in the repo. If you ever need to re-verify or set up a new sub-account, that command is idempotent — safe to re-run.

### Task 2 — Deploy the Revenue Leak Scorecard funnel

Full spec: pages 4–6 of `docs/mission-brief-scorecard.pdf`. **Do not redesign the HTML.** Companion file already committed: `revenue-leak-scorecard-GHL.html` at repo root.

**Build order matters** — the webhook URL must exist before the page publishes:

1. **You:** Create workflow `CS-Scorecard-Intake` → trigger: **Inbound Webhook**. Copy the webhook URL GHL generates.
2. **You:** Open `revenue-leak-scorecard-GHL.html` (or ask Claude to do this via Chosen) → find `const WEBHOOK_URL = "";` at the top of the `<script>` block → paste the URL between the quotes. Commit. (Chosen: if Abdullah asks, I can do this edit in one tool call.)
3. **You:** Funnels → New Funnel `CS-Scorecard-Funnel` → one blank step at path `/scorecard`.
4. **You:** On that page, single full-width section, padding 0, background `#000000`. Add one **Custom Code element** → paste the ENTIRE HTML file into it.
5. **You:** Page SEO title: `The Revenue Leak Scorecard — Eat 4 Life Marketing`. Description: `Find out how much revenue is leaking out of your business — free 2-minute diagnostic.` Favicon: EFL mark.
6. **You:** Publish. Send one test submission with fake data (name: `Test Lead`).
7. **You:** In `CS-Scorecard-Intake`, use the test payload to map fields → the `cs_*` custom fields. Payload keys are exactly: `first_name`, `email`, `phone`, `industry`, `customer_value`, `monthly_inquiries`, `database_size`, `leak_monthly`, `leak_annual`, `grade`, `recommended_tier`, `source`.
8. **You:** Add the workflow actions in this exact order:
   - Create/update contact · apply tag `cs-scorecard-lead` · apply tier tag from `cs_recommended_tier` (`cs-tier-recover` / `cs-tier-accelerate` / `cs-tier-own`)
   - Add to `CS-Agency-Pipeline` → stage **Scorecard Complete** · assign owner: **Chosen** (single-line change when the seller is hired)
   - Send Email #1 immediately (copy in section 03 of the mission brief — use verbatim)
   - Send Slack alert immediately (see Task 2b)
   - Wait 1 day → if no Discovery Booked → send SMS #1 (section 03)
   - Wait 3 more days → if still no booking → send Email #2 (section 03), tag `cs-nurture`
9. **You:** Update the Book-my-game-plan-call button in the HTML to point at the new calendar link (currently a mailto: fallback). Ask Chosen if he wants me to make the edit.
10. **You:** Verify against the "Definition of Done" checklist (page 6 of mission brief).

**Task 2b — Slack wiring:**

- Create Slack channel `#cs-sales-leads` (if missing). Invite Chosen + Rozel.
- Connect Slack in GHL (Settings → Integrations → Slack). Add a Slack action to the `CS-Scorecard-Intake` workflow using this exact template:

```
NEW SCORECARD LEAD
Name: {{contact.first_name}} | {{contact.cs_industry}}
Leak: ${{contact.cs_leak_monthly}}/mo (${{contact.cs_leak_annual}}/yr)
Grade: {{contact.cs_grade}} -> Rec: {{contact.cs_recommended_tier}}
Contact: {{contact.email}} | {{contact.phone}}
Owner: Chosen - clock starts now. Speed-to-lead applies to us too.
```

- Set up a **daily 8am digest** to `#cs-sales-leads`: count of new scorecard leads, total estimated leak identified, and any lead `>$10K/mo` flagged as PRIORITY.

### Task 3 — Email deliverability & branded domain

Full spec: `docs/email-deliverability-setup.pdf`. Everything in that PDF still applies — the only change is the target sub-account is now **E4L Services** (not the earlier "E4L Agency" name that appears in the PDF; Chosen renamed it after finalizing the mission brief).

Executive summary of that PDF:
- Buy or use a dedicated cold-outreach domain (Chosen may have this from the earlier setup)
- Add a sending subdomain in GHL's Email Services with SPF/DKIM DNS records
- Add a DMARC TXT record starting at `p=none`
- Point a demo subdomain (`demos.[domain].com`) at GitHub Pages via a CNAME to `chosen1thegolden1.github.io`
- Update the GitHub repo variable `DEMO_BASE_URL` (Settings → Secrets and variables → Actions → **Variables** tab) to the new branded URL — this powers the demo builder's outreach emails
- Verify with mail-tester.com (target ≥ 9/10) and inbox tests on Gmail, Outlook, Yahoo

### Task 4 — Bring the E4L Services funnel across from E4L School

There is an existing **E4L Services funnel** in the **E4L School** sub-account that Chosen wants copied into **E4L Services**. This is a straight funnel port — no rebuild from scratch, no pricing pages, no design work. Just copy.

**How to copy a funnel between sub-accounts in GHL:**

1. In **E4L School**, open the E4L Services funnel → **⋯ menu → Share** (this generates a share link/code).
2. Switch into **E4L Services** → **Funnels → Import from share link/code** → paste. GHL clones the entire funnel with all its steps, elements, and settings.
3. Rename the imported funnel to prefix it with `CS-` (e.g., `CS-Services-Funnel`) per the guardrail.
4. Point any funnel-internal links (booking buttons, CTAs) at the E4L Services calendar link from Task 1, not the school's calendar.
5. Publish. Test each page loads and every form submits into E4L Services (not E4L School).

That's the entire task. No copy rewrite, no new pages.

**On pricing:** the scorecard never displays dollar amounts, and the outreach email/SMS from Section 03 of the mission brief don't either. Pricing conversations happen on the Game Plan Call — you don't need to worry about it in any asset you build. The mission brief's Section 05 pricing guardrail (Recover $2,500 / Accelerate $5,000 / Own $7,500) is retired; the scorecard's tier names are used as qualitative recommendations only.

---

## Non-negotiable guardrails

From the mission brief, section 05 (page 6). Ignoring any of these breaks the client-services separation Chosen paid to establish:

- **Never touch the E4L School sub-account.** No reads, no writes. If any action would occur outside E4L Services, stop and ask.
- **Tagline wall:** all client-facing copy says **"AI Marketing Made Easy."** Never **"Everybody Eats"** — that is student-side only.
- **No promised results.** Leak figures are directional estimates. Every asset that shows a number carries a disclaimer.
- **Don't redesign the scorecard page.** HTML is final and tested. Only deployment-time edits: `WEBHOOK_URL`, calendar link, domain.
- **No pricing in automated assets.** The scorecard, its emails, its SMS, and its Slack alert never quote dollar amounts. Pricing conversations happen live on the Game Plan Call. The mission brief's Section 05 pricing guardrail (Recover/Accelerate/Own dollar amounts) is retired.
- **One test before live.** Nothing goes to a real prospect until every box in the Definition of Done (mission brief page 6) is checked.

---

## Definition of Done

Task 1:
- [ ] E4L Services sub-account created, users added, brand kit configured
- [ ] Domain attached
- [ ] All 8 CS custom fields, 6 CS tags, and CS-Agency-Pipeline exist
- [ ] Calendar for Game Plan Call created + booking link captured

Task 2 (from mission brief page 6):
- [ ] Scorecard live at `/scorecard` on the services domain, black background edge-to-edge, mobile checked
- [ ] Webhook URL pasted into the file BEFORE publish; test submission created a contact with all `cs_*` fields populated
- [ ] Test contact landed in CS-Agency-Pipeline → Scorecard Complete → assigned to Chosen
- [ ] Email #1 delivered to test inbox with merge fields rendering (no blank `${}` values)
- [ ] Slack alert posted to `#cs-sales-leads` with correct numbers
- [ ] Day-2 SMS and day-5 email verified in workflow preview (do not wait 5 real days — use test-mode)
- [ ] Test contact deleted
- [ ] Completion report posted to Slack: page URL, workflow name, field map, anything skipped and why

Task 3:
- [ ] Dedicated sending domain verified in GHL (SPF + DKIM green) and set as location default
- [ ] DMARC TXT record live
- [ ] `demos.[domain]` CNAME resolving, GitHub Pages custom domain saved, HTTPS enforced
- [ ] `DEMO_BASE_URL` repo variable updated
- [ ] mail-tester score ≥ 9/10 from the new sending domain
- [ ] Test emails land in Inbox on Gmail, Outlook, and Yahoo

---

## Files worth reading, in order

1. `docs/mission-brief-scorecard.pdf` — Chosen's original spec for Tasks 1 & 2. Wins any conflict **except** the Task 5 pricing guardrail, which is superseded by the price sheet (see Pricing errata above).
2. `docs/services-price-sheet-v2.pdf` — the services catalog and canonical pricing. Powers Task 4 and is the only source of dollar amounts.
3. `docs/email-deliverability-setup.pdf` — Task 3 details (retargeted to E4L Services)
4. `voice-ai-demo-builder/README.md` — how the demo builder works
5. `voice-ai-demo-builder/MIGRATE_SUBACCOUNT.md` — how the demo builder migrates between sub-accounts (needed after Task 1)
6. `voice-ai-demo-builder/REP_PORTAL.md` — how reps submit leads through the form (context for how the pipeline you're building fits into the daily flow)
7. `voice-ai-demo-builder/EMAIL_TEMPLATE.md` — reference copy for the demo builder's outreach email

Systems beat hustle. Ship it clean.
