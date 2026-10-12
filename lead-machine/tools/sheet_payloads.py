#!/usr/bin/env python3
"""Emit Google Sheets connector payloads for a batch spec (from make_spec.py).

Usage: python3 sheet_payloads.py <spec.json> <outdir> [--chunk-chars 60000]

Writes <outdir>/plan.json describing the calls to make, plus one JSON file per call:
  1. requests_tabs.json       -> update_spreadsheet: rename Sheet1 to README, addSheet for every other tab
  2. values_<tab>_<k>.json    -> update_formulas: {"range": "'Tab'!A<row>", "values": [[...], ...]} chunks
  3. requests_format_<tab>.json -> update_spreadsheet: header style, widths, freeze, wrap, dropdowns, conditional colors, filter
Values and formulas go in the same arrays (both write tools parse alike). Text that looks like a
number, date, phone (+1 ...) or formula is prefixed with an apostrophe so Sheets keeps it as text.
"""
import json, os, re, sys
from openpyxl.utils import get_column_letter

spec_path, outdir = sys.argv[1], sys.argv[2]
CHUNK = int(sys.argv[sys.argv.index('--chunk-chars') + 1]) if '--chunk-chars' in sys.argv else 60000
spec = json.load(open(spec_path)); os.makedirs(outdir, exist_ok=True)

YELLOW = {"red": 1, "green": 0.76, "blue": 0}
GREEN = {"red": 0.78, "green": 0.94, "blue": 0.81}; AMBER = {"red": 1, "green": 0.92, "blue": 0.61}; RED = {"red": 1, "green": 0.78, "blue": 0.81}
BLUE = {"red": 0, "green": 0, "blue": 1}

def text(v):
    if v is None: return None
    if isinstance(v, bool): return v
    if isinstance(v, (int, float)): return v
    s = str(v)
    if s == "": return ""
    if s.startswith("="): return s          # a real formula
    if re.match(r"^[+\-'@]|^\d", s): return "'" + s   # phones, IDs, zips, dates-as-text, leading quotes
    return s

def grid(sheet_id, r0, r1, c0, c1):
    g = {"sheetId": sheet_id, "startRowIndex": r0, "startColumnIndex": c0, "endColumnIndex": c1}
    if r1 is not None: g["endRowIndex"] = r1
    return g

def chunk_rows(tab, rows):
    """split rows into chunks whose JSON is under CHUNK chars; returns [(start_row_1based, rows)]"""
    out, cur, size, start = [], [], 0, 1
    for i, r in enumerate(rows, 1):
        s = len(json.dumps(r))
        if cur and size + s > CHUNK:
            out.append((start, cur)); cur, size, start = [], 0, i
        cur.append(r); size += s
    if cur: out.append((start, cur))
    return out

plan = {"spreadsheet_title": spec["title"], "calls": []}
tabs = []  # (name, sheet_id, headers, rows, format requests)

# ---- Leads
cols = spec["lead_columns"]; names = [c["name"] for c in cols]
L = {n: get_column_letter(i) for i, n in enumerate(names, 1)}
score, band, dec = spec["score_column"], spec["band_column"], spec["decision_column"]
leads_rows = [names]
n_leads = len(spec.get("example_rows", []))
for r_i, ex in enumerate(spec.get("example_rows", []), 2):
    row = []
    for c in cols:
        if c["name"] == band:
            row.append(f'=IF({L[score]}{r_i}="","",IF({L[score]}{r_i}>=80,"A — send today",IF({L[score]}{r_i}>=60,"B — worth a touch",IF({L[score]}{r_i}>=40,"C — hold","D — reject"))))')
        else:
            row.append(text(ex.get(c["name"], "")))
    leads_rows.append(row)
tabs.append(("Leads", 1001, names, leads_rows, cols))

# ---- GHL Import (formulas over Leads)
gm = spec["ghl_map"]; gh = [m["ghl"] for m in gm]
ghl_rows = [gh]
for r_i in range(2, n_leads + 2):
    row = []
    for m in gm:
        if "from" in m:
            row.append(f'=IF(Leads!{L[m["from"]]}{r_i}="","",Leads!{L[m["from"]]}{r_i})')
        elif "formula" in m:
            f = m["formula"].replace("{r}", str(r_i))
            for nm, Lx in L.items(): f = f.replace("{" + nm + "}", f"Leads!{Lx}{r_i}")
            row.append(f)
        else:
            row.append(m.get("literal", ""))
    ghl_rows.append(row)
tabs.append(("GHL Import", 1003, gh, ghl_rows, [{"name": h, "width": m.get("width", 20)} for h, m in zip(gh, gm)]))

# ---- static tabs (Sam Call Sheet)
sid = 1002
for tab in spec.get("static_tabs", []):
    tcols = tab["columns"]; th = [c["header"] for c in tcols]
    TL = {h: get_column_letter(i) for i, h in enumerate(th, 1)}
    rows = [th]
    clean = lambda v: "" if v is None or str(v).strip().lower() == "not found" else v
    for r_i, ex in enumerate(spec.get("example_rows", []), 2):
        row = []
        for c in tcols:
            if "from" in c: v = ex.get(c["from"], "")
            elif "join" in c: v = " ".join(str(x) for x in (clean(ex.get(k, "")) for k in c["join"]) if x)
            elif "coalesce" in c: v = next((ex.get(k) for k in c["coalesce"] if clean(ex.get(k, ""))), "")
            elif "formula" in c:
                v = c["formula"].replace("{r}", str(r_i))
                for h, Lx in TL.items(): v = v.replace("{" + h + "}", f"{Lx}{r_i}")
            else: v = ""
            row.append(text(v))
        rows.append(row)
    fmt_cols = [{"name": c["header"], "width": c.get("width", 18), "kind": c.get("kind"), "options": c.get("options"), "highlight": c.get("highlight"), "number_format": c.get("number_format")} for c in tcols]
    tabs.append((tab["name"], sid, th, rows, fmt_cols)); sid += 1

# ---- reference + input tabs (master only)
sid = 1010
for tab in spec.get("reference_tabs", []) + spec.get("input_tabs", []):
    rows = [tab["headers"]] + [[text(v) for v in r] for r in tab.get("rows", [])]
    fmt_cols = [{"name": h, "width": w} for h, w in zip(tab["headers"], tab.get("widths", [18] * len(tab["headers"])))]
    for d in tab.get("dropdowns", []):
        for fc in fmt_cols:
            if fc["name"] == d["col"]: fc["options"] = d["options"]
    tabs.append((tab["name"], sid, tab["headers"], rows, fmt_cols)); sid += 1

# ---- README (Sheet1 / id 0)
readme_rows = [[spec["title"]], [spec.get("subtitle", "")], [""]]
for block in spec["readme"]:
    readme_rows.append([block["heading"]]); readme_rows += [[ln] for ln in block["lines"]]; readme_rows.append([""])
tabs.insert(0, ("README", 0, ["README"], readme_rows, [{"name": "README", "width": 120}]))

# ---- call 1: tabs
reqs = [{"updateSheetProperties": {"properties": {"sheetId": 0, "title": "README"}, "fields": "title"}}]
order = [t[0] for t in spec.get("tab_order", [])] if False else spec.get("tab_order", [])
for name, sheet_id, headers, rows, fcols in tabs:
    if sheet_id == 0: continue
    idx = order.index(name) if name in order else None
    props = {"sheetId": sheet_id, "title": name, "gridProperties": {"rowCount": max(len(rows) + 50, 100), "columnCount": max(len(headers) + 2, 5)}}
    if idx is not None: props["index"] = idx
    reqs.append({"addSheet": {"properties": props}})
json.dump({"requests": reqs}, open(f"{outdir}/requests_tabs.json", "w"), indent=1)
plan["calls"].append({"tool": "update_spreadsheet", "file": "requests_tabs.json", "note": "rename Sheet1 to README and add every tab (ids fixed: Leads 1001, Sam Call Sheet 1002, GHL Import 1003, reference tabs 1010+)"})

# ---- calls 2..: values per tab, chunked
for name, sheet_id, headers, rows, fcols in tabs:
    for k, (start, chunk) in enumerate(chunk_rows(name, rows), 1):
        fn = f"values_{re.sub(r'[^a-z0-9]+', '_', name.lower())}_{k}.json"
        json.dump({"range": f"'{name}'!A{start}", "values": chunk}, open(f"{outdir}/{fn}", "w"))
        plan["calls"].append({"tool": "update_formulas", "file": fn, "rows": len(chunk), "chars": os.path.getsize(f"{outdir}/{fn}")})

# ---- formatting per tab
for name, sheet_id, headers, rows, fcols in tabs:
    nrows, ncols = len(rows), len(headers)
    R = []
    R.append({"repeatCell": {"range": grid(sheet_id, 0, 1, 0, ncols), "cell": {"userEnteredFormat": {"backgroundColor": YELLOW, "textFormat": {"bold": True, "fontFamily": "Arial", "fontSize": 10}, "wrapStrategy": "WRAP", "verticalAlignment": "MIDDLE"}}, "fields": "userEnteredFormat.backgroundColor,userEnteredFormat.textFormat,userEnteredFormat.wrapStrategy,userEnteredFormat.verticalAlignment"}})
    if nrows > 1:
        R.append({"repeatCell": {"range": grid(sheet_id, 1, nrows, 0, ncols), "cell": {"userEnteredFormat": {"textFormat": {"fontFamily": "Arial", "fontSize": 10}, "wrapStrategy": "WRAP", "verticalAlignment": "TOP"}}, "fields": "userEnteredFormat.textFormat,userEnteredFormat.wrapStrategy,userEnteredFormat.verticalAlignment"}})
    for i, fc in enumerate(fcols):
        R.append({"updateDimensionProperties": {"range": {"sheetId": sheet_id, "dimension": "COLUMNS", "startIndex": i, "endIndex": i + 1}, "properties": {"pixelSize": int(fc.get("width", 18) * 7.2)}, "fields": "pixelSize"}})
        if fc.get("kind") in ("reviewer", "input") and nrows > 1:
            R.append({"repeatCell": {"range": grid(sheet_id, 1, nrows + 50, i, i + 1), "cell": {"userEnteredFormat": {"textFormat": {"foregroundColor": BLUE, "fontFamily": "Arial", "fontSize": 10}}}, "fields": "userEnteredFormat.textFormat"}})
        if fc.get("options"):
            R.append({"setDataValidation": {"range": grid(sheet_id, 1, nrows + 50, i, i + 1), "rule": {"condition": {"type": "ONE_OF_LIST", "values": [{"userEnteredValue": o} for o in fc["options"]]}, "showCustomUi": True, "strict": False}}})
        if fc.get("number_format"):
            R.append({"repeatCell": {"range": grid(sheet_id, 1, nrows + 50, i, i + 1), "cell": {"userEnteredFormat": {"numberFormat": {"type": "DATE", "pattern": fc["number_format"]}}}, "fields": "userEnteredFormat.numberFormat"}})
        for val, color in (fc.get("highlight") or {}).items():
            rgb = {"C6EFCE": GREEN, "FFEB9C": AMBER, "FFC7CE": RED}.get(color, AMBER)
            R.append({"addConditionalFormatRule": {"rule": {"ranges": [grid(sheet_id, 1, nrows + 50, i, i + 1)], "booleanRule": {"condition": {"type": "TEXT_EQ", "values": [{"userEnteredValue": val}]}, "format": {"backgroundColor": rgb}}}, "index": 0}})
    if name == "Leads":
        si = names.index(score); di = names.index(dec)
        for cond, val, rgb in (("NUMBER_GREATER_THAN_EQ", "80", GREEN), ("NUMBER_BETWEEN", ["60", "79.999"], AMBER), ("NUMBER_LESS", "60", RED)):
            vals = [{"userEnteredValue": v} for v in (val if isinstance(val, list) else [val])]
            R.append({"addConditionalFormatRule": {"rule": {"ranges": [grid(sheet_id, 1, nrows + 50, si, si + 1)], "booleanRule": {"condition": {"type": cond, "values": vals}, "format": {"backgroundColor": rgb}}}, "index": 0}})
        for val, rgb in (("Approve", GREEN), ("Hold", AMBER), ("Reject", RED)):
            R.append({"addConditionalFormatRule": {"rule": {"ranges": [grid(sheet_id, 1, nrows + 50, di, di + 1)], "booleanRule": {"condition": {"type": "TEXT_EQ", "values": [{"userEnteredValue": val}]}, "format": {"backgroundColor": rgb}}}, "index": 0}})
    frozen_cols = {"Leads": 8, "Sam Call Sheet": 3, "GHL Import": 1}.get(name, 1)
    R.append({"updateSheetProperties": {"properties": {"sheetId": sheet_id, "gridProperties": {"frozenRowCount": 1, "frozenColumnCount": frozen_cols if sheet_id else 0}}, "fields": "gridProperties.frozenRowCount,gridProperties.frozenColumnCount"}})
    if sheet_id and nrows > 1:
        R.append({"setBasicFilter": {"filter": {"range": grid(sheet_id, 0, nrows, 0, ncols)}}})
    fn = f"requests_format_{re.sub(r'[^a-z0-9]+', '_', name.lower())}.json"
    json.dump({"requests": R}, open(f"{outdir}/{fn}", "w"))
    plan["calls"].append({"tool": "update_spreadsheet", "file": fn, "requests": len(R)})

json.dump(plan, open(f"{outdir}/plan.json", "w"), indent=1)
print(f"{len(plan['calls'])} calls planned -> {outdir}/plan.json")
for c in plan["calls"]: print(" ", c)
