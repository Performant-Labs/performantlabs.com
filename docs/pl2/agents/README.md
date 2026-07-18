# pl2 pipeline agents — versioned source for `~/.claude/agents/`

These seven files are the **version-controlled source of truth** for the Claude Code subagents
that run the pl2 website pipelines. The *live* copies Claude Code actually loads are in
`~/.claude/agents/` (user-global, not in any repo) — these are the committed mirror so the
wiring has a git safety net.

| Agent | Pipeline | Role |
|---|---|---|
| `orchestrator.md` | build (O-F-A-T-S) | O |
| `feature-implementor.md` | build | F |
| `architecture-reviewer.md` | build | A (+ per-change blast-radius gate) |
| `tester.md` | build | T |
| `spec-auditor.md` | build | S (Opus, vision) |
| `audit-orchestrator.md` | audit (O-W-O) | O |
| `website-auditor.md` | audit | W |

> **Pipeline currency (2026-07):** The **audit pipeline was extracted** to its own repo —
> `github.com/Performant-Labs/website-audit` (local `~/Projects/website-audit`) — so the two audit
> agents point there, not into the playbook. The playbook front-end pipeline also gained an optional
> **U (UI-walkthrough)** phase between T and S
> (`~/Projects/playbook/pipelines/website-frontend/core/roles/ui-walkthrough.md`); it is **not**
> mirrored here because the name would clobber the shared coding-pipeline `~/.claude/agents/ui-walkthrough.md`
> — adopt it under a `pl2-ui-walkthrough` name if/when a U phase is run.

They are **thin pointers**: each composes the core role (front-end: `~/Projects/playbook/pipelines/website-frontend/core/roles/…`; audit: `~/Projects/website-audit/core/roles/…`) + the platform adapter
(`drupal-canvas-sdc`) + this project's profile (`docs/pl2/frontend-pipeline-profile.md`).

## Install / sync
After editing here (or after `git pull`), copy into the live location:
```bash
cp docs/pl2/agents/*.md ~/.claude/agents/
```
If you edit a live agent in `~/.claude/agents/`, copy it back here and commit so the versioned
source stays current. (Pre-thinning originals are archived at `~/.claude/agents/_archive-pre-thin-20260612/`.)
