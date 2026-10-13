#!/usr/bin/env python3
"""One line per lead for the Slack DM / final message. Usage: summary_lines.py <batch.json>"""
import json, re, sys
leads = json.load(open(sys.argv[1]))
clean = lambda v: "" if v is None or str(v).strip().lower().startswith("not found") else str(v)
PH = re.compile(r"\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}")
def phone(v):
    m = PH.search(str(v or "")); 
    if not m: return ""
    d = re.sub(r"\D", "", m.group(0))[-10:]; return f"+1 {d[:3]}-{d[3:6]}-{d[6:]}"
band = lambda s: "A" if s >= 80 else "B" if s >= 60 else "C" if s >= 40 else "D"
for l in leads:
    owner = " ".join(x for x in (clean(l.get("owner_first_name")), clean(l.get("owner_last_name"))) if x) or "owner not named"
    title = clean(l.get("owner_title"))
    ph = (phone(l.get("owner_direct_phone")) if clean(l.get("owner_direct_phone")) else "") or phone(l.get("company_phone")) or "no number"
    btc = re.split(r"\s*[;(]|\s+-\s+|\s*—", clean(l.get("best_time_to_call")))[0].strip()[:48]
    att = re.split(r"\s*[(:]|\s+—\s+|\s+-\s+", clean(l.get("attitude_type")))[0].strip()
    offer = re.split(r"\s*[(;:—]|\s+built\s|\s+on\s|\s+paired\s|\s+with\s", clean(l.get("recommended_entry_offer")))[0].strip()
    print(f"{l['_lead_id'][-2:]}. {l['company_name']} — {owner}{(' (' + title + ')') if title else ''} — {l['city']}, {l['state']} — {ph} — {l['lead_score']}/{band(int(l['lead_score']))} — {att} — {offer} — {btc}")
