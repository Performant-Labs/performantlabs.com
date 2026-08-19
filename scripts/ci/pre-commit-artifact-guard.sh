#!/usr/bin/env bash
#
# Optional local pre-commit hook — early mirror of the CI "Guard against large
# artifacts" check (issue #319). CI is the real gate; this just fails faster,
# before you push. Install with:
#
#   ln -sf ../../scripts/ci/pre-commit-artifact-guard.sh .git/hooks/pre-commit
#
# (or append a call to it from an existing hook / your pre-commit framework).
#
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"

# Staged additions/copies/renames/modifications, NUL-safe.
# Portable to macOS bash 3.2 (no `mapfile`).
staged=()
while IFS= read -r -d '' f; do
  staged+=("$f")
done < <(git diff --cached --diff-filter=ACMR --name-only -z)

if [ "${#staged[@]}" -eq 0 ]; then
  exit 0
fi

python3 "$repo_root/scripts/ci/check-artifact-bloat.py" --paths "${staged[@]}"
