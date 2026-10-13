#!/usr/bin/env python3
"""Export the Sam Call Sheet and GHL Import as CSV (values) from a batch spec, for Drive upload (CSV → Google Sheet).
Usage: export_csvs.py <spec.json> <out_prefix>   -> <out_prefix>_sam_call_sheet.csv, <out_prefix>_ghl_import.csv"""
import csv, json, re, sys
from openpyxl.utils import get_column_letter
spec = json.load(open(sys.argv[1])); prefix = sys.argv[2]; rows = spec["example_rows"]
clean = lambda v: "" if v is None or str(v).strip().lower().startswith("not found") else str(v)
PH = re.compile(r"\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}")
def phone(v):
    m = PH.search(str(v or ""))
    if not m: return ""
    d = re.sub(r"\D", "", m.group(0))[-10:]
    return f"+1 {d[:3]}-{d[3:6]}-{d[6:]}"
tab = [t for t in spec["static_tabs"] if t["name"] == "Sam Call Sheet"][0]; cols = tab["columns"]
letters = {c["header"]: get_column_letter(i) for i, c in enumerate(cols, 1)}
with open(f"{prefix}_sam_call_sheet.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow([c["header"] for c in cols])
    for r_i, ex in enumerate(rows, 2):
        row = []
        for c in cols:
            if "from" in c: v = ex.get(c["from"], "")
            elif "join" in c: v = " ".join(x for x in (clean(ex.get(k, "")) for k in c["join"]) if x)
            elif "coalesce" in c:
                if c.get("phone"): v = next((phone(ex.get(k)) for k in c["coalesce"] if clean(ex.get(k, "")) and phone(ex.get(k))), "")
                else: v = next((ex.get(k) for k in c["coalesce"] if clean(ex.get(k, ""))), "")
            elif "formula" in c:
                v = c["formula"].replace("{r}", str(r_i))
                for h, L in letters.items(): v = v.replace("{" + h + "}", f"{L}{r_i}")
            else: v = ""
            row.append(v if str(v).startswith("=") else re.sub(r"\s+", " ", str(v)).strip())
        w.writerow(row)
slug = lambda s: re.sub(r"[^a-z0-9]+", "-", str(s).lower().replace("&", "and")).strip("-")
hdr = ["First Name", "Last Name", "Email", "Phone", "Company Name", "Website", "Address", "City", "State", "Postal Code", "Source", "Tags", "LM Lead ID", "LM Lead Score", "LM Attitude", "LM Entry Offer", "LM Owner LinkedIn", "LM Why Now", "LM First Line", "LM Call Angle", "LM Owner Title"]
with open(f"{prefix}_ghl_import.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow(hdr)
    for ex in rows:
        email = clean(ex.get("Owner Email", "")) or clean(ex.get("Company Email (generic)", ""))
        ph = phone(ex.get("Owner Direct Phone", "")) if clean(ex.get("Owner Direct Phone", "")) else ""
        ph = ph or phone(ex.get("Company Phone", ""))
        tags = f"cold-outreach,lead-machine,status:drafted,industry:{slug(ex.get('Niche'))},city:{slug(ex.get('City'))},entry:{slug(re.split(r'[(;:—]', str(ex.get('Recommended Entry Offer','')))[0])},attitude:{slug(re.split(r'[(:—]', str(ex.get('Attitude Type','')))[0])}"
        w.writerow([ex.get("Owner First Name", ""), ex.get("Owner Last Name", ""), email, ph, ex.get("Company Name", ""), ex.get("Website", ""), clean(ex.get("Street Address", "")), ex.get("City", ""), ex.get("State", ""), clean(ex.get("ZIP", "")), "cold-outreach:lead-machine", tags, ex.get("Lead ID", ""), ex.get("Lead Score", ""), ex.get("Attitude Type", ""), ex.get("Recommended Entry Offer", ""), clean(ex.get("Owner LinkedIn", "")), ex.get("Why Now", ""), ex.get("Personalized First Line", ""), ex.get("Call Angle", ""), ex.get("Owner Title", "")])
import os
for s in ("_sam_call_sheet.csv", "_ghl_import.csv"): print(prefix + s, os.path.getsize(prefix + s), "chars")
