#!/usr/bin/env bash
# Assemble the two buyer packs from the built PDFs and the skills. Run from vault/.
set -euo pipefail
D=deliverables; B="$D/build"
rm -rf "${B:?}" && mkdir -p "$B"
for tier in Lite Lifetime; do
  P="$B/E4L-Vault-$tier"; mkdir -p "$P"
  cp "$D/Start-Here-$tier.pdf" "$P/1 START HERE.pdf"
  cp "$D/E4L-Vault-100-Prompts.pdf" "$P/2 E4L Vault 100 Prompts.pdf"
  cp pdfs/ad-hooks/50-ad-hooks.pdf "$P/3 50 Ad Hooks That Stop the Scroll.pdf"
done
S="$B/E4L-Vault-Lifetime/4 Skills"; mkdir -p "$S/Upload to Claude or ChatGPT" "$S/No Skills on your plan - Project version"
cp "$D/Skills-Install-Guide.pdf" "$S/Skills Install Guide.pdf"
declare -A NAME=([e4l-ad-writer]="Ad Writer" [e4l-email-writer]="Email Writer" [e4l-content-planner]="Content Planner" [e4l-offer-builder]="Offer Builder" [e4l-clip-finder]="Clip Finder" [e4l-results-reader]="Results Reader")
for k in "${!NAME[@]}"; do
  cp "skills/dist/$k.zip" "$S/Upload to Claude or ChatGPT/"
  PV="$S/No Skills on your plan - Project version/${NAME[$k]}"; mkdir -p "$PV"
  sed "s/\`references\/prompts.md\` from this folder/prompts.md from this folder/" "skills/$k/PROJECT.md" > "$PV/Project instructions.txt"
  [ -f "skills/$k/references/prompts.md" ] && cp "skills/$k/references/prompts.md" "$PV/prompts.md"
done
(cd "$B" && zip -qrX ../E4L-Vault-Lite.zip E4L-Vault-Lite && zip -qrX ../E4L-Vault-Lifetime.zip E4L-Vault-Lifetime)
rm -rf "${B:?}"
ls -la "$D"/*.zip
