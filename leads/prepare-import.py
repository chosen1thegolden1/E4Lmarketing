#!/usr/bin/env python3
"""Turn the raw lead sheet into GHL-ready import CSVs.

Input: the JSON dump of the Google Sheet (`{fileContent: "<markdown tables>"}`),
one markdown table per vertical tab. Re-export the sheet and re-run this any
time the list grows.

    python3 leads/prepare-import.py <sheet.json> [--outdir leads/ghl-import]

What it does: normalizes phones to E.164, strips tracking junk off websites,
splits person names, classifies each email as personal or role-based, drops
duplicates and unusable rows, then writes one CSV per vertical plus a
call-only file for rows with a phone but no email.

Priority tiers (drives who gets a call and a hand-written first line):
  A  named person + personal email   -> personalize, call the priority list
  B  named person + role email       -> personalize lightly
  C  no name                         -> company-name merge only
"""
import argparse
import csv
import json
import pathlib
import re
import sys
from collections import Counter, defaultdict

# Tab order in the source sheet. Update if tabs are added or reordered.
VERTICALS = [
    ("hvac", "HVAC"),
    ("roofing", "Roofing"),
    ("dog-grooming", "Dog Grooming"),
    ("dental", "Dental"),
    ("chiropractic", "Chiropractic"),
    ("med-spa", "Med Spa & Aesthetics"),
]

# Mailbox names that reach a front desk rather than a person.
ROLE_MAILBOXES = {
    "info", "office", "contact", "admin", "hello", "sales", "support",
    "service", "services", "frontdesk", "front desk", "reception", "team",
    "billing", "appointments", "appointment", "scheduling", "help", "mail",
    "inquiries", "enquiries", "customerservice", "estimating", "estimates",
    "dispatch", "accounting", "general", "newpatients", "smile", "care",
}

FREEMAIL = {"gmail.com", "yahoo.com", "aol.com", "hotmail.com", "outlook.com",
            "icloud.com", "msn.com", "comcast.net", "sbcglobal.net", "att.net",
            "verizon.net", "bellsouth.net", "me.com", "live.com"}

STATES = {
    "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR",
    "california": "CA", "colorado": "CO", "connecticut": "CT", "delaware": "DE",
    "florida": "FL", "georgia": "GA", "hawaii": "HI", "idaho": "ID",
    "illinois": "IL", "indiana": "IN", "iowa": "IA", "kansas": "KS",
    "kentucky": "KY", "louisiana": "LA", "maine": "ME", "maryland": "MD",
    "massachusetts": "MA", "michigan": "MI", "minnesota": "MN",
    "mississippi": "MS", "missouri": "MO", "montana": "MT", "nebraska": "NE",
    "nevada": "NV", "new hampshire": "NH", "new jersey": "NJ",
    "new mexico": "NM", "new york": "NY", "north carolina": "NC",
    "north dakota": "ND", "ohio": "OH", "oklahoma": "OK", "oregon": "OR",
    "pennsylvania": "PA", "rhode island": "RI", "south carolina": "SC",
    "south dakota": "SD", "tennessee": "TN", "texas": "TX", "utah": "UT",
    "vermont": "VT", "virginia": "VA", "washington": "WA",
    "west virginia": "WV", "wisconsin": "WI", "wyoming": "WY",
    "district of columbia": "DC",
}

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$")

# Words that mark a name cell as a company or department, not a person.
NOT_A_PERSON = re.compile(
    r"\b(llc|inc|corp|company|co\.|group|team|dental|roofing|hvac|salon|clinic|"
    r"center|centre|associates|dds|dmd|office|department)\b", re.I)

# Honorifics that show up glued to a name cell ('Nurse Wojton').
TITLES = re.compile(r"^\s*(dr|doctor|nurse|mr|mrs|ms|miss|prof|professor|rn|np|pa|"
                    r"owner|manager|dds|dmd|md)\b\.?\s*", re.I)


def unescape(s):
    """The markdown export backslash-escapes +, &, _ and friends."""
    return re.sub(r"\\(.)", r"\1", s or "").strip()


def clean_phone(raw):
    """'· \\+1 510-616-9857' -> '+15106169857'. Returns '' if not a US number."""
    digits = re.sub(r"\D", "", unescape(raw))
    if len(digits) == 11 and digits.startswith("1"):
        digits = digits[1:]
    if len(digits) != 10 or digits[0] in "01":
        return ""
    return "+1" + digits


def clean_website(raw):
    """Drop tracking params and trailing slashes; keep the real page."""
    url = unescape(raw).split("?")[0].split("#")[0].rstrip("/")
    return url if url.startswith("http") else ""


def split_location(raw):
    """'Oakland, CA, United States' -> ('Oakland', 'CA')."""
    parts = [p.strip() for p in unescape(raw).split(",") if p.strip()]
    parts = [p for p in parts if p.lower() not in ("united states", "usa", "us")]
    if not parts:
        return "", ""
    city = parts[0]
    state = ""
    if len(parts) > 1:
        s = parts[1]
        state = s.upper() if len(s) == 2 else STATES.get(s.lower(), s)
    return city, state


def split_name(raw):
    """'Sherry Singer' -> ('Sherry','Singer'). Drops initials and company names."""
    name = unescape(raw)
    if not name or NOT_A_PERSON.search(name):
        return "", ""
    titled = bool(TITLES.match(name))
    name = TITLES.sub("", name)
    name = re.sub(r"\b(dds|dmd|md|do|dc|phd|jr|sr|iii|ii)\b\.?", "", name, flags=re.I)
    parts = [p for p in re.split(r"\s+", name.strip()) if p]
    if not parts:
        return "", ""
    # 'Nurse Wojton' — what survives a stripped honorific is the surname, not a
    # first name. Leave first empty and let first_from_email fill it.
    if titled and len(parts) == 1:
        return "", parts[0].strip(".,").title()
    first = parts[0].strip(".,")
    # "Harry I" — a bare initial is not a usable last name.
    last = parts[-1].strip(".,") if len(parts) > 1 and len(parts[-1].strip(".,")) > 1 else ""
    if len(first) < 2:
        return "", ""
    return first.title(), last.title()


def first_from_email(email):
    """'lynn@centeraesthetic.com' -> 'Lynn'.

    Only fires when the sheet gave us no first name at all, and only for a
    mailbox that is a single clean word — 'mpum@' or 'j.smith@' stay empty
    rather than greeting someone as "Hi Mpum".
    """
    local = email.partition("@")[0].lower()
    if not re.fullmatch(r"[a-z]{2,12}", local) or local in ROLE_MAILBOXES:
        return ""
    return local.title()


def classify_email(email):
    """-> ('personal'|'role', domain, is_freemail)"""
    local, _, domain = email.partition("@")
    domain = domain.lower()
    base = re.split(r"[._+-]", local.lower())[0]
    kind = "role" if (local.lower() in ROLE_MAILBOXES or base in ROLE_MAILBOXES) else "personal"
    return kind, domain, domain in FREEMAIL


def parse(path):
    """Split the markdown dump into one row-list per vertical tab."""
    content = json.loads(pathlib.Path(path).read_text())["fileContent"]
    blocks, cur = [], None
    for line in content.split("\n"):
        if "Company Name |" in line and "Website" in line:
            cur = []
            blocks.append(cur)
            continue
        if cur is None or line.strip().startswith("| :-:"):
            continue
        if line.strip().startswith("|") and line.count("|") >= 6:
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if len(cells) < 6 or not any(cells):
                continue
            # A dozen company names contain a literal '|' ("FLOW HVAC NY | PTAC
            # Repair NYC"), which the markdown export doesn't escape — the row
            # splits into extra cells and every field after it shifts left.
            # The last five columns are always right, so fold the overflow back
            # into the company name.
            if len(cells) > 6:
                head = [c.rstrip("\\").strip() for c in cells[:len(cells) - 5]]
                cells = [" | ".join(c for c in head if c)] + cells[len(cells) - 5:]
            cur.append(cells[:6])
    return blocks


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("sheet", help="JSON dump of the lead sheet")
    ap.add_argument("--outdir", default="leads/ghl-import")
    ap.add_argument("--batch", default="2026-08-16", help="batch tag date")
    args = ap.parse_args()

    blocks = parse(args.sheet)
    if len(blocks) != len(VERTICALS):
        print(f"warning: sheet has {len(blocks)} tabs, VERTICALS lists "
              f"{len(VERTICALS)} — check the tab order", file=sys.stderr)

    outdir = pathlib.Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    seen_email = {}
    company_count = Counter()
    call_only, stats = [], []
    dropped = defaultdict(int)

    header = ["First Name", "Last Name", "Email", "Phone", "Company Name",
              "Website", "City", "State", "Industry", "Tags", "Email Type",
              "Priority"]

    for (slug, label), rows in zip(VERTICALS, blocks):
        out, tiers = [], Counter()
        for company, website, phone, location, person, email in rows:
            company = unescape(company)
            email = unescape(email).lower().strip()
            if not company:
                dropped["no company"] += 1
                continue
            if not EMAIL_RE.match(email):
                phone_e164 = clean_phone(phone)
                if phone_e164:
                    city, state = split_location(location)
                    call_only.append([company, phone_e164, clean_website(website),
                                      city, state, label])
                dropped["no usable email"] += 1
                continue
            if email in seen_email:
                dropped[f"duplicate email (first seen: {seen_email[email]})"] += 1
                continue
            seen_email[email] = slug

            first, last = split_name(person)
            kind, _, _ = classify_email(email)
            if not first and kind == "personal":
                first = first_from_email(email)
            city, state = split_location(location)
            company_count[company.lower()] += 1

            priority = "A" if (first and kind == "personal") else ("B" if first else "C")
            tiers[priority] += 1

            tags = " ".join([
                "cold-outreach", "status:queued", f"batch:{args.batch}",
                f"industry:{slug}", f"city:{re.sub(r'[^a-z0-9]+', '-', city.lower()).strip('-')}",
                f"priority:{priority.lower()}",
            ])

            out.append([first, last, email, clean_phone(phone), company,
                        clean_website(website), city, state, label, tags,
                        kind, priority])

        path = outdir / f"{args.batch}-{slug}.csv"
        with path.open("w", newline="") as fh:
            w = csv.writer(fh)
            w.writerow(header)
            w.writerows(out)
        stats.append((label, slug, len(rows), len(out), tiers, path))

    if call_only:
        path = outdir / f"{args.batch}-call-only.csv"
        with path.open("w", newline="") as fh:
            w = csv.writer(fh)
            w.writerow(["Company Name", "Phone", "Website", "City", "State", "Industry"])
            w.writerows(call_only)

    total = sum(s[3] for s in stats)
    print(f"\n{'vertical':<24} {'raw':>5} {'clean':>6} {'A':>5} {'B':>5} {'C':>5}")
    print("-" * 56)
    for label, _, raw, clean, tiers, _ in stats:
        print(f"{label:<24} {raw:>5} {clean:>6} {tiers['A']:>5} {tiers['B']:>5} {tiers['C']:>5}")
    print("-" * 56)
    print(f"{'TOTAL':<24} {sum(s[2] for s in stats):>5} {total:>6}")
    print(f"\ncall-only (phone, no email): {len(call_only)}")
    print("\ndropped:")
    for reason, n in sorted(dropped.items(), key=lambda x: -x[1])[:10]:
        print(f"  {n:>4}  {reason}")
    dupes = [(c, n) for c, n in company_count.items() if n > 1]
    if dupes:
        print(f"\n{len(dupes)} companies appear more than once (multi-contact — "
              f"send to one person only):")
        for c, n in sorted(dupes, key=lambda x: -x[1])[:10]:
            print(f"  {n}x  {c}")
    print(f"\nwrote {len(stats)} CSVs to {outdir}/")


if __name__ == "__main__":
    main()
