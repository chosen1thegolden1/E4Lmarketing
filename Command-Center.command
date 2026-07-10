#!/bin/bash
# Eat 4 Life — Command Center launcher
# Double-click this file to pull the latest dashboard and open it.

# Move into the folder this script lives in (works no matter where it's run from)
cd "$(dirname "$0")" || exit 1

echo "🧭  Eat 4 Life — Command Center"
echo "-------------------------------"
echo "⬇️  Getting the latest version..."
git pull --quiet && echo "✅  Up to date." || echo "⚠️  Couldn't reach GitHub — opening the version you already have."

echo "🚀  Opening your dashboard..."
open dashboard.html

# Close this helper window automatically after a moment
sleep 1
exit 0
