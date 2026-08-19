# CI guards

## Large-artifact guard (`check-artifact-bloat.py`)

Prevents the repo from re-accumulating large binary dumps — see
[issue #319](https://github.com/Performant-Labs/performantlabs.com/issues/319).
`docs/pl2/` had grown to 4,117 files / 1.1 GiB of QA screenshots and had to be
purged with a history rewrite. The `docs/*/handoffs/** export-ignore` gitattribute
only limits the blast radius of a recurrence; this guard actually blocks one.

**What fails a change:**
1. A file under a directory whose name is `shots`, `screenshots`, or `Screenshots*`
   (any size, any type).
2. A file larger than **2 MiB** that isn't in `ALLOWLIST_GLOBS`.

Only files **touched by the change set** are examined — pre-existing files (incl.
the legacy screenshots still tracked under `docs/pl2/`) never fail unrelated PRs.

**Enforcement:** CI workflow `.github/workflows/guard-large-artifacts.yml` runs it
on every PR. This is the line of defense that protects `main`.

**Need to commit a genuinely-required large binary?** Add an explicit, justified
glob to `ALLOWLIST_GLOBS` in `check-artifact-bloat.py`.

### Optional local pre-commit hook

Faster feedback before you push (CI still enforces regardless):

```bash
ln -sf ../../scripts/ci/pre-commit-artifact-guard.sh .git/hooks/pre-commit
```
