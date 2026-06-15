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

They are **thin pointers**: each composes the ai_guidance core role
(`~/Sites/ai_guidance/pipelines/website-{frontend,audit}/core/roles/…`) + the platform adapter
(`drupal-canvas-sdc`) + this project's profile (`docs/pl2/frontend-pipeline-profile.md`).

## Install / sync
After editing here (or after `git pull`), copy into the live location:
```bash
cp docs/pl2/agents/*.md ~/.claude/agents/
```
If you edit a live agent in `~/.claude/agents/`, copy it back here and commit so the versioned
source stays current. (Pre-thinning originals are archived at `~/.claude/agents/_archive-pre-thin-20260612/`.)
