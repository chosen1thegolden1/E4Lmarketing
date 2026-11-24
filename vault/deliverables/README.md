# E4L Vault: day-one buyer packs

What a buyer downloads after checkout.

| Pack | Checkout | File | Inside |
|---|---|---|---|
| Vault Lite | $39 | `E4L-Vault-Lite.zip` | 1 START HERE, 2 E4L Vault 100 Prompts, 3 50 Ad Hooks That Stop the Scroll |
| Lifetime Pass | $149 | `E4L-Vault-Lifetime.zip` | Everything in Lite, plus 4 Skills: Skills Install Guide, the six skill zips to upload, and a Project version (instructions + prompts file) for plans without Skills |

The loose PDFs here (`E4L-Vault-100-Prompts.pdf`, `Start-Here-Lite.pdf`, `Start-Here-Lifetime.pdf`, `Skills-Install-Guide.pdf`) are the same files that go in the zips.

## Rebuild

Needs WeasyPrint and the Rethink Sans and Space Mono fonts installed. From the repo root:

```
python3 vault/deliverables/src/build_prompts.py
python3 vault/deliverables/src/build_guides.py
cd vault && bash deliverables/src/package.sh
```

The prompts PDF is built straight from `vault/content/prompts/*.md`, so edit the prompts there and rebuild. Page numbers in the contents and in Start Here update on their own.

## Delivery

Upload both zips to GHL Media. Put each zip's link on its checkout's thank-you page and in its purchase confirmation email. Tag Lifetime buyers (for example `vault-lifetime`): Start Here tells them new drops come to the email they bought with.

## Not in the packs on day one

- New skills, systems and workflows after launch (promised to Lifetime on the page). Nothing new is scheduled yet.
- A monthly Vault plan (the page says that after Cyber Monday you're "paying monthly").
- Terms and Privacy pages (still placeholder links on the page).
- Anything from the old Vault page: GHL snapshots, monthly live call, tutorials, prompt builder, ads training, member area.
