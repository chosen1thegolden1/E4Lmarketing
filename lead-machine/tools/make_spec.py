#!/usr/bin/env python3
"""Assemble the workbook spec (columns, reference tabs, suppression) from the research JSON + lead rows.
Usage: python3 make_spec.py <leads.json or ''> <spec_out.json> [--batch-only]
"""
import csv, json, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
R = os.path.join(ROOT, 'research')
leads_path, out_path = sys.argv[1], sys.argv[2]
batch_only = '--batch-only' in sys.argv

# ---- Leads columns: (header, width, kind, options, lead_field, note)
C = [
 ("Lead ID", 14, "bot", None, "_lead_id", "YYYYMMDD-NN, unique forever"),
 ("Date Added", 11, "bot", None, "_date", None),
 ("Batch", 8, "bot", None, "_batch", None),
 ("Review Decision", 14, "reviewer", ["Approve", "Hold", "Reject"], None, "YOU fill this. Approve = goes to GHL Import tab filter."),
 ("Status", 14, "reviewer", ["New", "Reviewed", "Loaded to GHL", "Emailed", "Called", "Replied", "Booked", "Dead"], None, "YOU update as you work the lead."),
 ("Lead Score", 9, "bot", None, "lead_score", "0–100 from the Scoring Rubric tab"),
 ("Score Band", 16, "formula", None, None, "Formula from Lead Score"),
 ("Company Name", 28, "bot", None, "company_name", None),
 ("Owner First Name", 13, "bot", None, "owner_first_name", None),
 ("Owner Last Name", 13, "bot", None, "owner_last_name", None),
 ("Owner Title", 16, "bot", None, "owner_title", None),
 ("Owner Email", 28, "bot", None, "owner_email", "Only emails found on a public page. 'Not found' is honest."),
 ("Owner Email Type", 16, "bot", ["Personal (named)", "Role (owner@/sales@)", "Generic (info@/office@)", "None found"], "owner_email_type", None),
 ("Owner Email Confidence", 14, "bot", ["Confirmed", "Likely", "Unverified", "Not found"], "owner_email_confidence", None),
 ("Owner Direct Phone", 17, "bot", None, "owner_direct_phone", None),
 ("Company Phone", 17, "bot", None, "company_phone", None),
 ("Niche", 16, "bot", None, "niche", None),
 ("Niche Segment", 10, "bot", ["core", "extend"], "niche_segment", None),
 ("City", 15, "bot", None, "city", None),
 ("State", 7, "bot", None, "state", None),
 ("Why Now", 40, "bot", None, "why_now", "One line: why this lead, why this week"),
 ("Attitude Type", 22, "bot", None, "attitude_type", "See Attitude Guide tab"),
 ("Recommended Entry Offer", 22, "bot", ["Voice AI live demo", "Free GEO audit", "Revenue Leak Scorecard", "Speed-to-lead automation", "AI-readable site build"], "recommended_entry_offer", "Per Chosen's Service–Industry Matrix"),
 ("First-Fit Tier", 12, "bot", ["Recover", "Accelerate", "Own", "À la carte"], "first_fit_tier", "Internal only — never quoted in outreach"),
 ("Suggested Subject Line", 34, "bot", None, "suggested_subject_line", None),
 ("Personalized First Line", 50, "bot", None, "personalized_first_line", "Opening sentence of the cold email"),
 ("Call Angle", 50, "bot", None, "call_angle", "For Sam / Chosen on the phone"),
 ("Likely Objection", 40, "bot", None, "likely_objection", None),
 ("Best Opening Moment", 40, "bot", None, "best_opening_moment", "The one thing to reference first"),
 ("Pain Signals", 50, "bot", None, "pain_signals", None),
 ("Trigger Events", 36, "bot", None, "trigger_events", None),
 ("Attitude Evidence", 44, "bot", None, "attitude_evidence", None),
 ("Owner Background", 44, "bot", None, "owner_background", None),
 ("Owner Personality / Values Cues", 44, "bot", None, "owner_personality_cues", None),
 ("Owner Role Type", 20, "bot", ["Owner-operator", "Owner (absentee / multi-business)", "Manager / non-owner decision-maker", "Unknown"], "owner_role_type", None),
 ("Owner LinkedIn", 30, "bot", None, "owner_linkedin", None),
 ("Owner Other Socials", 30, "bot", None, "owner_other_socials", None),
 ("Website", 30, "bot", None, "website", None),
 ("Company Email (generic)", 26, "bot", None, "company_email_generic", None),
 ("Street Address", 28, "bot", None, "street_address", None),
 ("ZIP", 8, "bot", None, "zip", None),
 ("Service Area", 26, "bot", None, "service_area", None),
 ("Google Maps URL", 26, "bot", None, "google_maps_url", None),
 ("Google Rating", 9, "bot", None, "google_rating", None),
 ("Review Count", 9, "bot", None, "review_count", None),
 ("Founded / Years in Business", 16, "bot", None, "founded_or_years", None),
 ("Team Size (est.)", 14, "bot", None, "team_size_estimate", None),
 ("Locations", 9, "bot", None, "locations_count", None),
 ("Sub-services", 30, "bot", None, "sub_services", None),
 ("Tech Adoption", 16, "bot", None, "tech_adoption", None),
 ("Marketing Sophistication", 16, "bot", None, "marketing_sophistication", None),
 ("Growth Stage", 14, "bot", None, "growth_stage", None),
 ("Review Response Behavior", 30, "bot", None, "review_response_behavior", None),
 ("After-Hours Handling", 30, "bot", None, "after_hours_handling", None),
 ("Online Booking", 16, "bot", None, "online_booking", None),
 ("Chat / Text on Site", 16, "bot", None, "chat_or_text_on_site", None),
 ("Vendors Detected", 30, "bot", None, "vendors_detected", None),
 ("Ads Running", 24, "bot", None, "ads_running", None),
 ("AI Search Presence", 30, "bot", None, "ai_search_presence", "Named by ChatGPT/Perplexity for the money questions? (quick check)"),
 ("Disqualifier Check", 30, "bot", None, "disqualifier_check", None),
 ("Score Breakdown", 60, "bot", None, "score_breakdown", "Dimension: pts/weight — evidence"),
 ("Evidence Links", 60, "bot", None, "evidence_links", "Every URL relied on"),
 ("Research Confidence", 12, "bot", ["High", "Medium", "Low"], "research_confidence", None),
 ("Notes for Chosen", 50, "bot", None, "notes_for_chosen", None),
 ("Reviewer Notes", 40, "reviewer", None, None, "YOU: anything for Sam / Rozel"),
 ("GHL Contact ID", 22, "reviewer", None, None, "YOU: paste after import"),
 ("Loaded to GHL", 12, "reviewer", None, None, "YOU: date"),
]
lead_columns = []
for name, width, kind, options, field, note in C:
    d = {"name": name, "width": width, "kind": kind}
    if options: d["options"] = options
    if note: d["note"] = note
    lead_columns.append(d)
FIELD = {name: field for name, _, _, _, field, _ in C}

rows = []
if leads_path and os.path.exists(leads_path):
    for l in json.load(open(leads_path)):
        row = {}
        for name, field in FIELD.items():
            if field: row[name] = l.get(field, "")
        row["Status"] = "New"
        rows.append(row)

slug = '=IF({Company Name}="","",LOWER(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(TRIM({X})," ","-"),"/","-"),"&","and")))'
ghl_map = [
  {"ghl": "Review Decision", "from": "Review Decision", "width": 14},
  {"ghl": "First Name", "from": "Owner First Name"},
  {"ghl": "Last Name", "from": "Owner Last Name"},
  {"ghl": "Email", "formula": '=IF(OR({Owner Email}="",{Owner Email}="Not found"),IF(OR({Company Email (generic)}="",{Company Email (generic)}="Not found"),"",{Company Email (generic)}),{Owner Email})', "width": 28},
  {"ghl": "Phone", "formula": '=IF(OR({Owner Direct Phone}="",{Owner Direct Phone}="Not found"),{Company Phone},{Owner Direct Phone})', "width": 17},
  {"ghl": "Company Name", "from": "Company Name", "width": 28},
  {"ghl": "Website", "from": "Website", "width": 30},
  {"ghl": "Address", "from": "Street Address", "width": 28},
  {"ghl": "City", "from": "City"},
  {"ghl": "State", "from": "State", "width": 7},
  {"ghl": "Postal Code", "from": "ZIP", "width": 10},
  {"ghl": "Source", "literal": "cold-outreach:lead-machine"},
  {"ghl": "Tags", "formula": '=IF({Company Name}="","","cold-outreach,lead-machine,status:drafted,industry:"&LOWER(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(TRIM({Niche})," ","-"),"/","-"),"&","and"))&",city:"&LOWER(SUBSTITUTE(TRIM({City})," ","-"))&",entry:"&LOWER(SUBSTITUTE(TRIM({Recommended Entry Offer})," ","-"))&",attitude:"&LOWER(SUBSTITUTE(SUBSTITUTE(TRIM({Attitude Type})," ","-"),"/","-")))', "width": 60},
  {"ghl": "LM Lead ID", "from": "Lead ID", "width": 14},
  {"ghl": "LM Lead Score", "from": "Lead Score", "width": 10},
  {"ghl": "LM Attitude", "from": "Attitude Type", "width": 22},
  {"ghl": "LM Entry Offer", "from": "Recommended Entry Offer", "width": 22},
  {"ghl": "LM Owner LinkedIn", "from": "Owner LinkedIn", "width": 30},
  {"ghl": "LM Why Now", "from": "Why Now", "width": 40},
  {"ghl": "LM First Line", "from": "Personalized First Line", "width": 50},
  {"ghl": "LM Call Angle", "from": "Call Angle", "width": 50},
  {"ghl": "LM Owner Title", "from": "Owner Title", "width": 16},
]

readme = [
 {"heading": "What this is", "lines": [
   "The review sheet for E4L's daily lead machine. Claude finds, qualifies, and researches ~10 small-business leads per run and writes them here. You review, approve, and load the approved rows into GoHighLevel (E4L Services sub-account). Nothing is emailed or called from this sheet.",
   "Daily batches arrive as dated sheets in the same Drive folder ('E4L Leads — YYYY-MM-DD'). This master file holds the playbook tabs, the suppression list, and the run log so the whole system is readable in one place.",
 ]},
 {"heading": "Daily review in 5 steps (≈15 minutes for 10 rows)", "lines": [
   "1. Open the Leads tab. Rows are sorted by Lead Score. Read Why Now, Attitude Type, Pain Signals, and the Personalized First Line.",
   "2. Set Review Decision: Approve (load into GHL), Hold (good but not now), Reject (wrong fit — tell us why in Reviewer Notes so the rubric learns).",
   "3. Skim Owner Email Confidence. 'Confirmed' = seen on their own site/profile. 'Likely' = public but indirect. 'Not found' = call it (Sam) or use the generic inbox.",
   "4. Go to the GHL Import tab, filter column A to Approve, File → Download → CSV, then Contacts → Import in GHL. Map the columns 1:1 (the LM* columns are custom fields — create them once in GHL as single-line text, or skip them and paste the row into a contact note).",
   "5. Set Status to 'Loaded to GHL' and paste the GHL Contact ID. The daily run reads this file's Suppression and Seen lists so nobody is pitched twice.",
 ]},
 {"heading": "How to read the scores", "lines": [
   "Lead Score is 0–100 against the Scoring Rubric tab (weights sum to 100). Score Band: A (80+) send today · B (60–79) worth a touch · C (40–59) hold · D (<40) reject. Hard disqualifiers (chains, franchises, no website, closed, already using an AI receptionist) never make it into the sheet.",
   "Research Confidence tells you how much public evidence existed. A High-confidence 70 beats a Low-confidence 85.",
   "Attitude Type is the bot's read of how the owner thinks (see the Attitude Guide tab) and drives the Call Angle and the first line. 'Unclear' means not enough public signal — lead with the demo, not the pitch.",
 ]},
 {"heading": "What the bot will never do", "lines": [
   "Invent or pattern-guess an email, phone, or name (blank or 'Not found' instead). Use anything behind a login or paywall. Promise results, rankings, or revenue in any suggested copy. Quote prices. Re-pitch anyone on the Suppression tab or on an earlier batch.",
 ]},
 {"heading": "Changing the machine", "lines": [
   "Add a company to the Suppression tab to block it forever. Add or edit rows on the Niche Playbook tab to change what gets chased (the daily run reads it). Reject reasons in Reviewer Notes are read on the next run.",
   "Source files, playbooks, and the daily operator prompt live in the E4Lmarketing repo under lead-machine/.",
 ]},
]

# reference tabs from research
N = json.load(open(os.path.join(R, 'niches.json')))
niche_rows = []
for g in N:
    for n in g['niches']:
        niche_rows.append([n['niche'], n['segment'], n['fit_score'], n['best_entry_offer'], n['email_reachability'], n['size_sweet_spot'], n['why'], " | ".join(n['primary_pains']), " | ".join(n['need_signals']), " | ".join(n['disqualifiers']), ", ".join(n['decision_maker_titles']), n['typical_owner_attitude'], " | ".join(n['find_them_queries'])])
niche_rows.sort(key=lambda r: (-r[2], r[1], r[0]))
rules = "\n\n".join(g['niche_decision_rule'] for g in N)

rub = json.load(open(os.path.join(R, 'rubric.json')))
rubric_rows = [["HARD DISQUALIFIER", 0, x, ""] for x in rub['hard_disqualifiers']]
rubric_rows += [[d['name'], d['weight'], d['scoring_guide'], "; ".join(d['evidence_sources'])] for d in rub['dimensions']]
rubric_rows += [[f"BAND {b['label']} ({b['min']}–{b['max']})", "", b['meaning'], ""] for b in rub['bands']]
rubric_rows += [["MINIMUM EVIDENCE RULE", "", rub['minimum_evidence_rule'], ""]]
rubric_rows += [["TIE-BREAKER", "", t, ""] for t in rub['tie_breakers']]

att = json.load(open(os.path.join(R, 'attitude.json')))
att_rows = [[t['label'], t['outreach_priority'], t['definition'], " | ".join(t['public_signals']), t['how_to_approach'], t['best_hook'], t['avoid']] for t in att['attitude_types']]
att_rows += [[f"DIMENSION: {d['name']}", "", " / ".join(d['values']), d['how_to_read'], "", "", ""] for d in att['secondary_dimensions']]
att_rows += [["EVIDENCE RULE", "", att['evidence_rule'], "", "", "", ""]]

supp = list(csv.DictReader(open(os.path.join(ROOT, 'data', 'suppression.csv'))))
supp_rows = [[r['Company'], r['Domain'], r['Email'], r['City'], r['Niche'], r['Reason'], r['Added']] for r in supp]

spec = {
  "title": "E4L Lead Machine — Review Sheet" if not batch_only else "E4L Leads — daily batch",
  "subtitle": "Eat 4 Life Marketing · AI Marketing Made Easy · built by Claude, reviewed by humans",
  "readme": readme,
  "lead_columns": lead_columns,
  "score_column": "Lead Score", "band_column": "Score Band", "decision_column": "Review Decision",
  "freeze": "I2", "lead_rows": 400 if batch_only else 2000,
  "example_rows": rows,
  "ghl_map": ghl_map,
  "reference_tabs": [] if batch_only else [
    {"name": "Niche Playbook", "headers": ["Niche", "Segment", "Fit (1–5)", "Entry offer", "Email reach", "Size sweet spot", "Why", "Primary pains", "Need signals (public)", "Disqualifiers", "Decision-maker titles", "Typical owner attitude", "Find-them queries ({city})"], "rows": niche_rows, "widths": [26, 9, 8, 22, 10, 40, 60, 60, 70, 60, 30, 50, 60], "note": "NICHE DECISION RULE for anything not listed:\n" + rules},
    {"name": "Scoring Rubric", "headers": ["Item", "Weight", "How to score / meaning", "Evidence sources"], "rows": rubric_rows, "widths": [34, 8, 90, 60]},
    {"name": "Attitude Guide", "headers": ["Attitude type", "Outreach priority", "Definition", "Public signals", "How to approach", "Best hook", "Avoid"], "rows": att_rows, "widths": [26, 10, 50, 70, 50, 50, 40]},
  ],
  "input_tabs": [] if batch_only else [
    {"name": "Suppression", "headers": ["Company", "Domain", "Email", "City", "Niche", "Reason", "Added"], "rows": supp_rows, "widths": [36, 30, 30, 26, 16, 44, 11], "dropdowns": [{"col": "Reason", "options": ["Client", "Already contacted", "Opted out / do not contact", "Competitor", "Bad fit", "E4L itself"]}], "note": "Add a row to block a company forever. The daily run matches on Domain first, then on Company name."},
    {"name": "Run Log", "headers": ["Run date", "Batch", "Targets (niche · metro)", "Candidates reviewed", "Leads delivered", "Avg score", "Niche decisions", "Issues / notes", "Sheet link"], "rows": [], "widths": [11, 8, 50, 10, 10, 8, 50, 60, 40]},
    {"name": "Niche Decisions", "headers": ["Date", "Niche", "Verdict", "Fit (1–5)", "Reasoning", "Entry offer", "Decided by"], "rows": [], "widths": [11, 26, 10, 8, 80, 22, 14], "dropdowns": [{"col": "Verdict", "options": ["core", "extend", "skip", "test batch"]}]},
  ],
  "tab_order": ["README", "Leads", "GHL Import", "Niche Playbook", "Scoring Rubric", "Attitude Guide", "Suppression", "Run Log", "Niche Decisions"],
}
json.dump(spec, open(out_path, 'w'), indent=1)
print(f"spec: {len(lead_columns)} lead columns, {len(rows)} lead rows, {len(niche_rows)} niches, {len(supp_rows)} suppression rows -> {out_path}")
