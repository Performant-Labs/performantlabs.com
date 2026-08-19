#!/usr/bin/env python3
"""
Guard against large-artifact / screenshot-dump commits.

Fails when a change set ADDS (or moves/grows) files that are either:
  1. under a known artifact-dump directory  (a path segment named
     `shots`, `screenshots`, or matching `Screenshots*`), regardless of size; or
  2. larger than MAX_BYTES and not explicitly allow-listed, anywhere in the tree.

Only files touched by the change set are examined — pre-existing files elsewhere
in the repo are never evaluated, so this does not retroactively fail PRs for the
legacy screenshots still tracked under docs/pl2/.

See issue #319. Prevention mechanism for the docs/pl2 screenshot-dump problem
(4,117 files / 1.1 GiB) that the `docs/*/handoffs/** export-ignore` gitattribute
only mitigates, not prevents.

Usage:
  # CI: derive the file list from the PR range
  check-artifact-bloat.py --base origin/main --head HEAD

  # Test / manual: check an explicit list (sizes read from working tree)
  check-artifact-bloat.py --paths a/b.png c/d.txt
"""

import argparse
import fnmatch
import os
import re
import subprocess
import sys

# --- Tunables -------------------------------------------------------------

# Any single added file larger than this fails the check (unless allow-listed).
# Everything legitimately tracked today (theme icons, fonts, logos) is far below
# this; every offender in the docs/pl2 dump was well above it.
MAX_BYTES = 2 * 1024 * 1024  # 2 MiB

# A path is a "dump" if any of its directory segments matches one of these
# (case-insensitive). Targets screenshot/artifact directories by name, so it
# catches them wherever they appear and whatever the file type. Observed dump
# dirs: `shots/`, `handoff-S-shots/`, `handoff-S2-shots/`, `screenshots/`,
# `Screenshots1/`.
BLOCKED_DIR_REGEXES = [
    # "shots" as a whole word — matches `shots`, `handoff-S-shots`, `shots-old`,
    # but NOT `snapshots` (Playwright's `*.spec.js-snapshots/` visual baselines
    # are legitimate test assets and must pass).
    re.compile(r"(^|[-_])shots($|[-_])", re.IGNORECASE),
    # any segment containing "screenshot" — `screenshots`, `Screenshots1`, …
    re.compile(r"screenshot", re.IGNORECASE),
]

# Explicit escape hatch: globs (repo-relative) for files that are allowed to
# exceed MAX_BYTES. Keep this short and justified. Empty by default.
ALLOWLIST_GLOBS = [
    # "web/themes/custom/*/assets/hero.mp4",
]

# ------------------------------------------------------------------------


def is_allowlisted(path):
    return any(fnmatch.fnmatch(path, pat) for pat in ALLOWLIST_GLOBS)


def blocked_dir_hit(path):
    """Return the offending segment if any directory segment is a dump dir."""
    segments = path.split("/")[:-1]  # directories only, not the filename
    for seg in segments:
        for rx in BLOCKED_DIR_REGEXES:
            if rx.search(seg):
                return seg
    return None


def changed_files(base, head):
    """Files added/copied/renamed/modified between base...head (merge-base diff)."""
    rng = f"{base}...{head}" if base else head
    out = subprocess.run(
        ["git", "diff", "--diff-filter=ACMR", "--name-only", rng],
        capture_output=True, text=True, check=True,
    ).stdout
    return [ln for ln in out.splitlines() if ln.strip()]


def check(paths):
    violations = []
    for path in paths:
        if not os.path.isfile(path):
            # Deleted in a later commit of the range, or a submodule — skip.
            continue
        seg = blocked_dir_hit(path)
        if seg:
            violations.append((path, os.path.getsize(path),
                               f"under artifact-dump directory '{seg}/'"))
            continue
        size = os.path.getsize(path)
        if size > MAX_BYTES and not is_allowlisted(path):
            violations.append((path, size,
                               f"exceeds {MAX_BYTES // (1024*1024)} MiB size limit"))
    return violations


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="")
    ap.add_argument("--head", default="HEAD")
    ap.add_argument("--paths", nargs="*", help="explicit file list (for testing)")
    args = ap.parse_args()

    paths = args.paths if args.paths is not None else changed_files(args.base, args.head)
    violations = check(paths)

    if not violations:
        print(f"✓ artifact guard: no oversized (> {MAX_BYTES // (1024*1024)} MiB) "
              f"or dump-directory files added ({len(paths)} changed file(s) checked).")
        return 0

    print("✗ artifact guard: this change adds files that must not be committed.\n")
    for path, size, why in sorted(violations, key=lambda v: -v[1]):
        print(f"  {size / (1024*1024):7.2f} MiB  {path}\n            → {why}")
    print(
        "\nScreenshots, QA handoff captures, and other large binary artifacts do not\n"
        "belong in this repo (see issue #319 — a 1.1 GiB dump had to be purged with a\n"
        "history rewrite). Options:\n"
        "  • Remove the file(s) from the commit and store them outside git.\n"
        "  • If a large binary is genuinely required, add an explicit entry to\n"
        "    ALLOWLIST_GLOBS in scripts/ci/check-artifact-bloat.py and justify it.\n"
    )
    return 1


if __name__ == "__main__":
    sys.exit(main())
