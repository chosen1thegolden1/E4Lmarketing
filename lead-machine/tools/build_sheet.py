#!/usr/bin/env python3
"""Build the E4L Lead Machine review workbook from a JSON spec.

Usage: python3 build_sheet.py spec.json out.xlsx
The spec drives every column, dropdown, reference tab and example row so the
workbook can be regenerated whenever the prompt's output schema changes.
"""
import json
import re
import sys
from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.comments import Comment

YELLOW = "FFC200"   # E4L brand yellow
BLACK = "000000"
GREY = "F2F2F2"
GREEN = "C6EFCE"
AMBER = "FFEB9C"
RED = "FFC7CE"
BLUE_INPUT = "0000FF"

FONT = "Arial"
HDR_FONT = Font(name=FONT, bold=True, color=BLACK, size=10)
HDR_FILL = PatternFill("solid", fgColor=YELLOW)
BODY_FONT = Font(name=FONT, size=10)
NOTE_FONT = Font(name=FONT, size=9, italic=True, color="555555")
TITLE_FONT = Font(name=FONT, bold=True, size=14)
H2_FONT = Font(name=FONT, bold=True, size=11)
THIN = Side(style="thin", color="BFBFBF")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
WRAP = Alignment(wrap_text=True, vertical="top")
TOP = Alignment(vertical="top")


def style_header(ws, ncols, row=1):
    for c in range(1, ncols + 1):
        cell = ws.cell(row=row, column=c)
        cell.font = HDR_FONT
        cell.fill = HDR_FILL
        cell.border = BORDER
        cell.alignment = Alignment(wrap_text=True, vertical="center")
    ws.row_dimensions[row].height = 32


def write_table(ws, headers, rows, widths=None, start_row=1, wrap=True):
    for i, h in enumerate(headers, 1):
        ws.cell(row=start_row, column=i, value=h)
    style_header(ws, len(headers), start_row)
    for r_i, row in enumerate(rows, start_row + 1):
        for c_i, v in enumerate(row, 1):
            cell = ws.cell(row=r_i, column=c_i, value=v)
            cell.font = BODY_FONT
            cell.border = BORDER
            cell.alignment = WRAP if wrap else TOP
    if widths:
        for i, w in enumerate(widths, 1):
            ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = ws.cell(row=start_row + 1, column=1)
    last_col = get_column_letter(len(headers))
    ws.auto_filter.ref = f"A{start_row}:{last_col}{max(start_row + 1, start_row + len(rows))}"


def build(spec, out):
    wb = Workbook()

    # ---------------- README ----------------
    ws = wb.active
    ws.title = "README"
    ws.column_dimensions["A"].width = 120
    r = 1
    ws.cell(row=r, column=1, value=spec["title"]).font = TITLE_FONT
    r += 1
    ws.cell(row=r, column=1, value=spec.get("subtitle", "")).font = NOTE_FONT
    r += 2
    for block in spec["readme"]:
        ws.cell(row=r, column=1, value=block["heading"]).font = H2_FONT
        r += 1
        for line in block["lines"]:
            c = ws.cell(row=r, column=1, value=line)
            c.font = BODY_FONT
            c.alignment = WRAP
            r += 1
        r += 1
    # legend
    ws.cell(row=r, column=1, value="Legend").font = H2_FONT
    r += 1
    legend = [
        ("Yellow header", HDR_FILL, "Column written by the bot (do not rename — the prompt's output schema uses these exact names)."),
        ("Blue text", None, "Cells YOU fill in during review (Review Decision, Reviewer Notes, GHL Contact ID, Loaded to GHL)."),
        ("Green / amber / red score", None, "Score band: 80–100 send today · 60–79 worth a touch · below 60 hold or reject."),
    ]
    for label, fill, text in legend:
        c = ws.cell(row=r, column=1, value=f"{label} — {text}")
        c.font = BODY_FONT if label != "Blue text" else Font(name=FONT, size=10, color=BLUE_INPUT)
        if fill:
            c.fill = fill
        c.alignment = WRAP
        r += 1

    # ---------------- Leads ----------------
    cols = spec["lead_columns"]  # list of {name, width, kind, options?, note?}
    headers = [c["name"] for c in cols]
    ws = wb.create_sheet("Leads")
    for i, h in enumerate(headers, 1):
        cell = ws.cell(row=1, column=i, value=h)
        note = cols[i - 1].get("note")
        if note:
            cell.comment = Comment(note, "E4L Lead Machine")
    style_header(ws, len(headers))
    for i, c in enumerate(cols, 1):
        ws.column_dimensions[get_column_letter(i)].width = c.get("width", 18)
    name_to_letter = {c["name"]: get_column_letter(i) for i, c in enumerate(cols, 1)}

    max_rows = spec.get("lead_rows", 2000)
    last_row = max_rows + 1
    # example rows
    for r_i, ex in enumerate(spec.get("example_rows", []), 2):
        for i, c in enumerate(cols, 1):
            v = ex.get(c["name"], "")
            cell = ws.cell(row=r_i, column=i, value=v)
            cell.font = BODY_FONT
            cell.alignment = WRAP
            cell.border = BORDER
        ws.row_dimensions[r_i].height = 120
    # formulas + reviewer-input styling
    score_col = name_to_letter[spec["score_column"]]
    band_col = name_to_letter[spec["band_column"]]
    for rr in range(2, last_row + 1):
        ws[f"{band_col}{rr}"] = (
            f'=IF({score_col}{rr}="","",IF({score_col}{rr}>=80,"A — send today",'
            f'IF({score_col}{rr}>=60,"B — worth a touch",IF({score_col}{rr}>=40,"C — hold","D — reject"))))'
        )
        ws[f"{band_col}{rr}"].font = BODY_FONT
    for c in cols:
        if c.get("kind") == "reviewer":
            L = name_to_letter[c["name"]]
            for rr in range(2, last_row + 1):
                ws[f"{L}{rr}"].font = Font(name=FONT, size=10, color=BLUE_INPUT)
    # dropdowns
    for c in cols:
        if c.get("options"):
            L = name_to_letter[c["name"]]
            opts = ",".join(c["options"])
            if len(opts) > 250:
                # openpyxl inline lists are capped; spill to a hidden Lists sheet
                raise SystemExit(f"dropdown too long for {c['name']}; use list sheet")
            dv = DataValidation(type="list", formula1=f'"{opts}"', allow_blank=True, showDropDown=False)
            dv.error = "Pick one of the listed values"
            dv.errorTitle = "Invalid value"
            ws.add_data_validation(dv)
            dv.add(f"{L}2:{L}{last_row}")
    # conditional formats
    ws.conditional_formatting.add(f"{score_col}2:{score_col}{last_row}", CellIsRule(operator="greaterThanOrEqual", formula=["80"], fill=PatternFill("solid", fgColor=GREEN)))
    ws.conditional_formatting.add(f"{score_col}2:{score_col}{last_row}", CellIsRule(operator="between", formula=["60", "79.999"], fill=PatternFill("solid", fgColor=AMBER)))
    ws.conditional_formatting.add(f"{score_col}2:{score_col}{last_row}", CellIsRule(operator="lessThan", formula=["60"], fill=PatternFill("solid", fgColor=RED)))
    dec_col = name_to_letter[spec["decision_column"]]
    ws.conditional_formatting.add(f"{dec_col}2:{dec_col}{last_row}", FormulaRule(formula=[f'{dec_col}2="Approve"'], fill=PatternFill("solid", fgColor=GREEN)))
    ws.conditional_formatting.add(f"{dec_col}2:{dec_col}{last_row}", FormulaRule(formula=[f'{dec_col}2="Reject"'], fill=PatternFill("solid", fgColor=RED)))
    ws.conditional_formatting.add(f"{dec_col}2:{dec_col}{last_row}", FormulaRule(formula=[f'{dec_col}2="Hold"'], fill=PatternFill("solid", fgColor=AMBER)))
    ws.freeze_panes = spec.get("freeze", "D2")
    ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}{last_row}"

    # ---------------- GHL Import (mirror) ----------------
    ws2 = wb.create_sheet("GHL Import")
    gmap = spec["ghl_map"]  # list of {ghl: header, from: lead col name | literal:..., }
    gh = [m["ghl"] for m in gmap]
    for i, h in enumerate(gh, 1):
        ws2.cell(row=1, column=i, value=h)
    style_header(ws2, len(gh))
    for i, m in enumerate(gmap, 1):
        ws2.column_dimensions[get_column_letter(i)].width = m.get("width", 20)
    for rr in range(2, last_row + 1):
        for i, m in enumerate(gmap, 1):
            if "from" in m:
                src = name_to_letter[m["from"]]
                f = f'=IF(Leads!{src}{rr}="","",Leads!{src}{rr})'
            elif "formula" in m:
                f = m["formula"].replace("{r}", str(rr))
                for nm, L in name_to_letter.items():
                    f = f.replace("{" + nm + "}", f"Leads!{L}{rr}")
            else:
                f = m.get("literal", "")
            ws2.cell(row=rr, column=i, value=f).font = BODY_FONT
    ws2.freeze_panes = "B2"
    ws2.auto_filter.ref = f"A1:{get_column_letter(len(gh))}{last_row}"
    ws2.cell(row=last_row + 2, column=1, value="How to export: filter column A (Review Decision) to Approve, then File → Download → CSV. Import that CSV in GHL (Contacts → Import). Columns map 1:1 to GHL fields; Tags are comma-separated.").font = NOTE_FONT

    # ---------------- static tabs (values copied at build time, so sorting is safe) ----------------
    for tab in spec.get("static_tabs", []):
        wsx = wb.create_sheet(tab["name"])
        tcols = tab["columns"]
        for i, c in enumerate(tcols, 1):
            cell = wsx.cell(row=1, column=i, value=c["header"])
            if c.get("note"):
                cell.comment = Comment(c["note"], "E4L Lead Machine")
            wsx.column_dimensions[get_column_letter(i)].width = c.get("width", 18)
        style_header(wsx, len(tcols))
        letters = {c["header"]: get_column_letter(i) for i, c in enumerate(tcols, 1)}
        exs = spec.get("example_rows", [])
        last = max(len(exs) + 1, 2) + tab.get("spare_rows", 0)
        clean = lambda v: "" if v is None or str(v).strip().lower().startswith("not found") else v
        PH = re.compile(r"\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}")
        phone = lambda v: (lambda m: ("+1 " + re.sub(r"\D", "", m.group(0))[-10:][:3] + "-" + re.sub(r"\D", "", m.group(0))[-10:][3:6] + "-" + re.sub(r"\D", "", m.group(0))[-10:][6:]) if m else "")(PH.search(str(v or "")))
        for r_i in range(2, last + 1):
            ex = exs[r_i - 2] if r_i - 2 < len(exs) else None
            for i, c in enumerate(tcols, 1):
                if "from" in c:
                    v = ex.get(c["from"], "") if ex else ""
                elif "join" in c:
                    v = " ".join(str(x) for x in (clean(ex.get(k, "")) for k in c["join"]) if x) if ex else ""
                elif "coalesce" in c:
                    if c.get("phone"):
                        v = next((phone(ex.get(k)) for k in c["coalesce"] if ex and clean(ex.get(k, "")) and phone(ex.get(k))), "") if ex else ""
                    else:
                        v = next((ex.get(k) for k in c["coalesce"] if clean(ex.get(k, ""))), "") if ex else ""
                elif "formula" in c:
                    v = c["formula"].replace("{r}", str(r_i))
                    for h, L in letters.items():
                        v = v.replace("{" + h + "}", f"{L}{r_i}")
                else:
                    v = ""
                cell = wsx.cell(row=r_i, column=i, value=v)
                cell.border = BORDER
                cell.alignment = WRAP
                cell.font = Font(name=FONT, size=10, color=BLUE_INPUT) if c.get("kind") == "input" else BODY_FONT
                if c.get("number_format"):
                    cell.number_format = c["number_format"]
            if ex:
                wsx.row_dimensions[r_i].height = tab.get("row_height", 90)
        for c in tcols:
            if c.get("options"):
                L = letters[c["header"]]
                dv = DataValidation(type="list", formula1='"' + ",".join(c["options"]) + '"', allow_blank=True)
                wsx.add_data_validation(dv)
                dv.add(f"{L}2:{L}{last}")
            if c.get("highlight"):
                L = letters[c["header"]]
                for val, color in c["highlight"].items():
                    wsx.conditional_formatting.add(f"{L}2:{L}{last}", FormulaRule(formula=[f'{L}2="{val}"'], fill=PatternFill("solid", fgColor=color)))
        wsx.freeze_panes = tab.get("freeze", "D2")
        wsx.auto_filter.ref = f"A1:{get_column_letter(len(tcols))}{last}"
        if tab.get("note"):
            wsx.cell(row=last + 2, column=1, value=tab["note"]).font = NOTE_FONT

    # ---------------- reference tabs ----------------
    for tab in spec["reference_tabs"]:
        wsx = wb.create_sheet(tab["name"])
        write_table(wsx, tab["headers"], tab["rows"], tab.get("widths"))
        if tab.get("note"):
            wsx.cell(row=len(tab["rows"]) + 3, column=1, value=tab["note"]).font = NOTE_FONT

    # ---------------- Suppression / Run Log / Niche Decisions (input tabs) ----------------
    for tab in spec["input_tabs"]:
        wsx = wb.create_sheet(tab["name"])
        write_table(wsx, tab["headers"], tab.get("rows", []), tab.get("widths"))
        for c in tab.get("dropdowns", []):
            L = get_column_letter(tab["headers"].index(c["col"]) + 1)
            dv = DataValidation(type="list", formula1='"' + ",".join(c["options"]) + '"', allow_blank=True)
            wsx.add_data_validation(dv)
            dv.add(f"{L}2:{L}1000")
        if tab.get("note"):
            wsx.cell(row=max(3, len(tab.get("rows", [])) + 3), column=1, value=tab["note"]).font = NOTE_FONT

    # order tabs
    order = spec.get("tab_order")
    if order:
        wb._sheets = [wb[n] for n in order if n in wb.sheetnames] + [s for s in wb._sheets if s.title not in order]
    wb.save(out)
    print(f"wrote {out} with tabs: {wb.sheetnames}")


if __name__ == "__main__":
    spec = json.load(open(sys.argv[1]))
    build(spec, sys.argv[2])
