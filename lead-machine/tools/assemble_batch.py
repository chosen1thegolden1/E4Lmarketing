#!/usr/bin/env python3
"""Turn a hunt_workflow result into a delivered batch.

Usage:
  python3 assemble_batch.py --result <workflow result .json> --date YYYY-MM-DD --batch N \
      [--repo /home/user/E4Lmarketing] [--min-score 55] [--max 10] [--sheet-url URL] [--issues "text"]

Reads result.leads (lead records, optionally with _verify from the Verify stage), applies verifier
corrections, drops disqualified / dropped / duplicate / suppressed leads, keeps the top N by score,
assigns Lead IDs, writes batches/<date>.json + .csv, and appends seen.csv, run-log.csv,
niche-decisions.csv and targets.csv. Prints the summary lines for the final message.
"""
import argparse, csv, json, os, re, sys
from urllib.parse import urlparse

ap = argparse.ArgumentParser()
ap.add_argument('--result', required=True); ap.add_argument('--date', required=True); ap.add_argument('--batch', required=True, type=int)
ap.add_argument('--repo', default='/home/user/E4Lmarketing'); ap.add_argument('--min-score', type=int, default=55); ap.add_argument('--max', type=int, default=10)
ap.add_argument('--sheet-url', default=''); ap.add_argument('--issues', default=''); ap.add_argument('--dry-run', action='store_true')
a = ap.parse_args()
LM = os.path.join(a.repo, 'lead-machine'); DATA = os.path.join(LM, 'data'); BATCHES = os.path.join(LM, 'batches')

def norm(s): return re.sub(r'[^a-z0-9]+', '', (s or '').lower().replace('&', 'and')).replace('llc', '').replace('inc', '')
def dom(u):
    u = (u or '').strip()
    if not u or u.lower() == 'not found': return ''
    if '@' in u: return u.split('@')[1].lower()
    try:
        h = urlparse(u if u.startswith('http') else 'https://' + u).hostname or ''
        return h.lower().replace('www.', '')
    except Exception: return ''

raw = json.load(open(a.result))
res = raw.get('result', raw)
if isinstance(res, str): res = json.loads(res)
leads = res.get('leads', []); targets = res.get('targets', [])

# off-limits
blocked_dom, blocked_name = set(), set()
for fn in ('suppression.csv', 'seen.csv'):
    p = os.path.join(DATA, fn)
    if os.path.exists(p):
        for r in csv.DictReader(open(p)):
            d = (r.get('Domain') or '').lower().strip()
            if d: blocked_dom.add(d)
            n = norm(r.get('Company') or '')
            if n: blocked_name.add(n)

kept, dropped = [], []
seen_dom, seen_name = set(), set()
for l in leads:
    name = l.get('company_name', ''); d = dom(l.get('website', ''))
    if not l.get('qualified'):
        dropped.append((name, 'not qualified: ' + (l.get('disqualified_reason') or ''))); continue
    v = l.get('_verify')
    if v:
        if v.get('verdict') == 'drop':
            dropped.append((name, 'verifier dropped: ' + v.get('reason', ''))); continue
        for k, val in (v.get('corrected_fields') or {}).items():
            if k in l: l[k] = val
        if isinstance(v.get('adjusted_score'), int): l['lead_score'] = v['adjusted_score']
        if v.get('adjusted_confidence'): l['research_confidence'] = v['adjusted_confidence']
        l['_verified'] = v.get('verdict')
    if (d and d in blocked_dom) or norm(name) in blocked_name:
        dropped.append((name, 'on suppression/seen list')); continue
    if (d and d in seen_dom) or norm(name) in seen_name:
        dropped.append((name, 'duplicate within batch')); continue
    if int(l.get('lead_score', 0)) < a.min_score:
        dropped.append((name, f"score {l.get('lead_score')} below {a.min_score}")); continue
    seen_dom.add(d); seen_name.add(norm(name)); kept.append(l)

kept.sort(key=lambda x: -int(x.get('lead_score', 0)))
final = kept[:a.max]
overflow = kept[a.max:]
ymd = a.date.replace('-', '')
for i, l in enumerate(final, 1):
    l['_lead_id'] = f"{ymd}-{i:02d}"; l['_date'] = a.date; l['_batch'] = a.batch
    l.pop('_verify', None)

if a.dry_run:
    print(json.dumps({'kept': [(l['company_name'], l['lead_score']) for l in final], 'dropped': dropped, 'overflow': [(l['company_name'], l['lead_score']) for l in overflow]}, indent=1)); sys.exit(0)

os.makedirs(BATCHES, exist_ok=True)
json.dump(final, open(os.path.join(BATCHES, f'{a.date}.json'), 'w'), indent=1)
cols = sorted({k for l in final for k in l.keys()}, key=lambda k: (not k.startswith('_'), k))
with open(os.path.join(BATCHES, f'{a.date}.csv'), 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=cols); w.writeheader(); [w.writerow({k: l.get(k, '') for k in cols}) for l in final]

with open(os.path.join(DATA, 'seen.csv'), 'a', newline='') as f:
    w = csv.writer(f)
    for l in final:
        w.writerow([l['_lead_id'], a.date, a.batch, l['company_name'], dom(l.get('website')), l.get('owner_email', ''), l.get('city', ''), l.get('state', ''), l.get('niche', ''), l.get('lead_score', ''), a.sheet_url])

verdicts = [f"{t.get('target')}: {t.get('verdict')}" for t in targets if t.get('verdict')]
reviewed = sum(int(t.get('reviewed') or 0) for t in targets)
avg = round(sum(int(l['lead_score']) for l in final) / len(final), 1) if final else 0
with open(os.path.join(DATA, 'run-log.csv'), 'a', newline='') as f:
    csv.writer(f).writerow([a.date, a.batch, ' | '.join(t.get('target', '') for t in targets), reviewed, len(final), avg, ' | '.join(verdicts), a.issues or ('dropped: ' + '; '.join(f'{n} ({r})' for n, r in dropped)), a.sheet_url])
with open(os.path.join(DATA, 'niche-decisions.csv'), 'a', newline='') as f:
    w = csv.writer(f)
    for t in targets:
        if t.get('verdict'): w.writerow([a.date, t.get('target', ''), '', '', t.get('verdict', ''), '', 'lead machine'])

# targets.csv last-run update (match by niche keyword in the target key)
tp = os.path.join(DATA, 'targets.csv')
if os.path.exists(tp):
    rows = list(csv.DictReader(open(tp))); fns = list(rows[0].keys()) if rows else []
    for r in rows:
        key = norm(r['Niche'].split('/')[0].split('(')[0])[:6]
        hits = [t for t in targets if key and key in norm(t.get('target', ''))]
        if hits:
            r['Last run date'] = a.date
            n = sum(1 for l in final if key in norm(l.get('niche', '')))
            r['Last run result'] = f"{n} delivered / {len(hits)} target(s); " + '; '.join(t.get('target', '') for t in hits)
    with open(tp, 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=fns); w.writeheader(); w.writerows(rows)

print(f"DELIVERED {len(final)} leads (avg {avg}); dropped {len(dropped)}; overflow {len(overflow)}")
for l in final:
    print(f"- {l['company_name']} — {l.get('owner_first_name','')} {l.get('owner_last_name','')} ({l.get('owner_title','')}) — {l.get('city','')}, {l.get('state','')} — {l['lead_score']} — {l.get('attitude_type','')} — {l.get('recommended_entry_offer','')} — {l.get('why_now','')}")
for n, r in dropped: print(f"  dropped: {n} — {r}")
