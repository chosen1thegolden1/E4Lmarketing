# E4L Email System — Build Spec

The complete automated email machine: tags, sequences, triggers, and the
weekly operating rhythm. Copy for each sequence lives in the sibling files:

- `student-welcome.md` — new opt-ins → 8-Week AI Course (5 emails)
- `student-book.md` — existing student list → book offer (3 emails)
- `company-nurture.md` — warm/touched company leads → services (5 emails)

Brand voice: **Eat 4 Life · "AI Departments, Installed."** Direct, confident,
systems language ("installed", "live in 14 days", "front door"). No corporate
fluff.

## 1. Tagging backbone

Every contact gets one tag from each group:

| Group | Tags |
|---|---|
| Audience | `aud:student` · `aud:company` |
| Temp | `cold` · `warm` · `engaged` · `client` |
| Source | `src:in-person` · `src:organic` · `src:ads` · `src:funnel` · `src:cold-email` |
| Sequence | `seq:student-welcome` · `seq:student-book` · `seq:company-nurture` (added on enroll) |

## 2. Enrollment triggers (build these in GHL)

| When | Then |
|---|---|
| Tag `aud:student` + `warm` added AND contact is NEW (no `seq:*` history) | Enroll in **Student Welcome** (course track), add `seq:student-welcome` |
| Existing student list (manual batch, approved by owner) | Enroll in **Student Book** campaign, add `seq:student-book` |
| Tag `aud:company` + (`warm` or `engaged`) added | Enroll in **Company Nurture**, add `seq:company-nurture` |
| Contact REPLIES or books a call | **Stop sequence immediately**, tag `engaged`, notify Slack #general |
| Contact becomes customer | Tag `client`, remove from all sequences |

Rules that apply to every sequence:
- **Stop on reply. Stop on booking. Always.** Nothing worse than an automated
  email landing after a human conversation started.
- Unsubscribe footer on every email (GHL handles).
- Send window: 8am–6pm contact's timezone, weekdays preferred.
- Cold company outreach is NOT in GHL — separate domain/tool. Engaged cold
  replies graduate into Company Nurture here.

## 3. Weekly operating rhythm (the "check in weekly" goal)

Claude runs weekly, owner reviews ~30 min:

1. **Digest**: new leads by source, sequence enrollment counts, opens/clicks/
   replies, who moved to `engaged`/`client`.
2. **Enrollments**: new warm leads tagged + enrolled (batch approved if any
   are ambiguous).
3. **Flags**: decisions only the owner can make (pricing questions, odd
   replies, sequence tweaks suggested by the data).
4. Owner approves → Claude executes.

## 4. Pre-flight checklist (before ANY sequence goes live)

- [ ] Sending domain verified in GHL (SPF/DKIM/DMARC green) — **biggest
      deliverability factor, do first**
- [ ] Physical mailing address in email footer
- [ ] Unsubscribe link renders and works
- [ ] Test send of every email to owner's inbox (check spam folder too)
- [ ] All merge fields ({{contact.first_name}} etc.) fall back gracefully
- [ ] Links tested — course funnel, book, booking calendar
- [ ] Stop-on-reply + stop-on-booking wired and tested
- [ ] Segments verified: students and companies cannot cross-receive
- [ ] Owner has approved final copy of every email

## 5. Placeholders to fill before launch

| Placeholder | Where | Needed |
|---|---|---|
| `[LEAD MAGNET]` | student-welcome #1 | what the opt-in actually delivers |
| `[BOOK TITLE]` / `[BOOK LINK]` | student-book | book name + purchase/claim link |
| `[BOOKING LINK]` | company-nurture | GHL calendar link for discovery calls |
| `[CASE STUDY OK?]` | company-nurture #2 | permission to reference the dual-brand med spa install (anonymized by default) |

Course funnel link (live): https://joineat4life.com/get-it-done-576544
