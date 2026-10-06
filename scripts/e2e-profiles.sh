#!/usr/bin/env bash
# Builds a second launch profile into its own dist dir and runs the leakage spec
# against it, so profile switching is proven on rendered pages, not only in unit tests.
set -euo pipefail
PROFILE="${1:-motherboard-only}"
DIST=".next-${PROFILE}"
export HUSKY_PREFLIGHT=skip
echo "[e2e-profiles] building profile ${PROFILE} into ${DIST}"
HUSKY_LAUNCH_PROFILE="$PROFILE" HUSKY_DIST_DIR="$DIST" npx next build > /dev/null
echo "[e2e-profiles] testing profile ${PROFILE}"
HUSKY_LAUNCH_PROFILE="$PROFILE" HUSKY_DIST_DIR="$DIST" PORT=3200 npx playwright test tests/e2e/leakage.spec.ts tests/e2e/smoke.spec.ts --project=desktop
