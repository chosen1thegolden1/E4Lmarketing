#!/usr/bin/env python3
"""Render a batch of lead records as HTML dossiers (one section per lead) for upload as a Google Doc.

Usage: python3 dossier_html.py <batch.json> <out_prefix> [--max-chars 120000]
Writes <out_prefix>_part1.html, _part2.html ... each under --max-chars (whole leads only).
"""
import html, json, sys
src, prefix = sys.argv[1], sys.argv[2]
MAX = int(sys.argv[sys.argv.index('--max-chars') + 1]) if '--max-chars' in sys.argv else 120000
leads = json.load(open(src))
ORDER = [
 ("Why now", "why_now"), ("Recommended entry offer", "recommended_entry_offer"), ("First-fit tier (internal)", "first_fit_tier"),
 ("Owner", None), ("Owner title", "owner_title"), ("Owner role", "owner_role_type"), ("Owner email", "owner_email"), ("Email type / confidence", None),
 ("Owner direct phone", "owner_direct_phone"), ("Company phone", "company_phone"), ("Owner LinkedIn", "owner_linkedin"), ("Other socials", "owner_other_socials"),
 ("Website", "website"), ("Address", None), ("Service area", "service_area"), ("Google rating / reviews", None), ("Founded / years", "founded_or_years"),
 ("Team size", "team_size_estimate"), ("Locations", "locations_count"), ("Sub-services", "sub_services"),
 ("Attitude type", "attitude_type"), ("Attitude evidence", "attitude_evidence"), ("Tech adoption", "tech_adoption"), ("Marketing sophistication", "marketing_sophistication"),
 ("Growth stage", "growth_stage"), ("Review response behavior", "review_response_behavior"),
 ("Owner background", "owner_background"), ("Owner personality / values cues", "owner_personality_cues"), ("Best opening moment", "best_opening_moment"),
 ("Pain signals", "pain_signals"), ("Trigger events", "trigger_events"), ("After-hours handling", "after_hours_handling"), ("Online booking", "online_booking"),
 ("Chat / text on site", "chat_or_text_on_site"), ("Vendors detected", "vendors_detected"), ("Ads running", "ads_running"), ("AI search presence", "ai_search_presence"),
 ("FOR SAM — business hours", "business_hours"), ("FOR SAM — timezone", "timezone"), ("FOR SAM — best time to call", "best_time_to_call"),
 ("FOR SAM — 20-second opener", "call_opener"), ("FOR SAM — gatekeeper notes", "gatekeeper_notes"), ("Call angle", "call_angle"), ("Likely objection", "likely_objection"),
 ("Suggested subject line", "suggested_subject_line"), ("Personalized first line (email)", "personalized_first_line"),
 ("Disqualifier check", "disqualifier_check"), ("Score breakdown", "score_breakdown"), ("Research confidence", "research_confidence"),
 ("Notes for Chosen", "notes_for_chosen"), ("Evidence links", "evidence_links"),
]
def esc(v): return html.escape(str(v if v is not None else ""))
def section(l):
    name = f"{l.get('owner_first_name','')} {l.get('owner_last_name','')}".strip() or "Owner not identified"
    out = [f"<h2>{esc(l.get('_lead_id',''))} · {esc(l.get('company_name',''))} — {esc(l.get('city',''))}, {esc(l.get('state',''))} · score {esc(l.get('lead_score',''))}</h2>",
           f"<p><b>{esc(l.get('niche',''))}</b> ({esc(l.get('niche_segment',''))}) · {esc(l.get('attitude_type',''))} · {esc(l.get('recommended_entry_offer',''))}</p>", "<table border='1' cellpadding='4'>"]
    for label, key in ORDER:
        if key is None:
            if label == "Owner": val = name
            elif label == "Email type / confidence": val = f"{l.get('owner_email_type','')} / {l.get('owner_email_confidence','')}"
            elif label == "Address": val = ", ".join(x for x in (l.get('street_address',''), l.get('city',''), l.get('state',''), l.get('zip','')) if x)
            elif label == "Google rating / reviews": val = f"{l.get('google_rating','')} / {l.get('review_count','')}"
            else: val = ""
        else:
            val = l.get(key, "")
        if key == "evidence_links":
            links = [u.strip() for u in str(val).split(",") if u.strip()]
            val_html = "<br>".join(f"<a href='{esc(u)}'>{esc(u)}</a>" for u in links)
        else:
            val_html = esc(val).replace("\n", "<br>")
        out.append(f"<tr><td style='width:22%'><b>{esc(label)}</b></td><td>{val_html}</td></tr>")
    out.append("</table>")
    return "\n".join(out)
head = "<html><head><meta charset='utf-8'><style>body{font-family:Arial;font-size:10pt} h2{margin-top:28px} td{vertical-align:top}</style></head><body>"
parts, cur, size = [], [], 0
for l in leads:
    s = section(l)
    if cur and size + len(s) > MAX:
        parts.append(cur); cur, size = [], 0
    cur.append(s); size += len(s)
if cur: parts.append(cur)
for i, p in enumerate(parts, 1):
    title = f"<h1>E4L lead dossiers — {leads[0].get('_date','')} (batch {leads[0].get('_batch','')}) — part {i} of {len(parts)}</h1><p>One section per lead. Facts come only from the public pages listed under Evidence links; 'Not found' means no public source existed. Nothing here promises results or quotes prices.</p>"
    doc = head + title + "\n".join(p) + "</body></html>"
    fn = f"{prefix}_part{i}.html"; open(fn, "w").write(doc)
    print(fn, len(doc), "chars,", len(p), "leads")
