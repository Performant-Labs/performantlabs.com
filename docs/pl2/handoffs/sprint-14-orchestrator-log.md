# Sprint 14 — Orchestrator Log

**Sprint:** 14 — `/about-us` preview-fidelity (high-quality ImageMagick diff)
**Opened:** 2026-05-13
**Mode:** Autonomous
**Integration branch:** `aa/pl-sprint-14-about-us-fidelity-hq`
**Runbook:** `docs/pl2/pl-plan--sprint-14-about-us-fidelity-hq.md`

---

## Kickoff confirmation table

| Item | Value |
|---|---|
| Page | `/about-us` |
| Project / slug | pl2 |
| Runbook | `docs/pl2/pl-plan--sprint-14-about-us-fidelity-hq.md` |
| Workflow spec | `docs/pl2/workflow-ofts.md` |
| Handoff directory | `docs/pl2/handoffs/` |
| Issue source | inline issue files in handoff dir (local-only) |
| Branch pattern (integration) | `aa/pl-sprint-14-about-us-fidelity-hq` |
| Branch pattern (cycle) | `aa/pl-sprint-14-cycle-N-[slug]` |
| Current phase | Cycle 1 — S-only HQ audit |
| Approval checkpoint rule | Autonomous; pre-commitments PC-1..PC-10 resolve every 🛑 |
| Env verified | live `/about-us` HTTP 200 at kickoff |
| Diff method | DSSIM primary, PSNR + fuzz-AE secondary, 2× DPR, Drupal-chrome mask |

---

## Kickoff pre-commitments captured

Reproduced verbatim from the kickoff briefing:

- **PC-1** Brief tokens > preview > content > live. Hard a11y floors win.
- **PC-2** Cycle carve driven by Cycle 1 audit.
- **PC-3** F Step-3 layer trace autonomous; L5 preferred; L1 only with cross-page sweep + S confirmation.
- **PC-4** Higher-quality diff method (DSSIM primary, PSNR + fuzz-AE secondary).
- **PC-5** pa11y "0 errors with allowlist applied" (Sprint 9 standard).
- **PC-6** Canvas `component_version` preserved.
- **PC-7** Specificity-safe `.dy-section.dy-section--<marker>` for any new markers.
- **PC-8** Per-section delta judged against documented intent + DSSIM threshold table.
- **PC-9** Silent-park on S ADVISORY-HOLD.
- **PC-10** Hard-stop floor — env breakage / availability / new WCAG regression / config schema deletion / cross-page sweep failure on L1 token change.

Autonomous-mode prerequisite satisfied: every 🛑 in the runbook has a pre-commitment resolution captured above.

---

## Carry-forwards from Sprint 13 wrap

- **F-NEW-1** — preview hero H1 desktop short 64 → 72. Preview-doc layer fix.
- **F-NEW-2** — live hero H1 mobile short 36 → 44 vs brief 44. L1 token; cross-page sweep required.

---

## Cycle log

### Cycle 1 — S-only HQ preview-vs-live audit (2026-05-13)

- Branch: integration (S-only)
- Verdict: **REWORK** — Cycle 2..N carve recommended
- HQ method confirmed: 2× DPR, DSSIM primary, chrome mask, anchored crops. Per-section DSSIM 0.17–0.26 across every section (well above 0.05 REAL-DELTA floor).
- Findings catalog:
  - **F-NEW-1** (pre-committed, preview-doc) — preview H1 desktop 64 → 72 px
  - **F-NEW-2** (pre-committed, L1 token + cross-page sweep) — live H1 mobile 36 → 44 px
  - **F-NEW-3** (NEW, preview-doc) — preview §E primary CTA token: `#62BBCB`/white → `#5DC6E8`/`#1F1A14` (brief line 319)
  - **F-NEW-4** (NEW, operator decision) — CTA suffix-icon component delta (live 56 px / preview 45 px). S recommends Option C (brief-doc only); **silent-parked per PC-9** as autonomous-mode advisory
  - F-NEW-5/6/7 — deferred (sitewide typography pass)
- WCAG 32 criteria enumerated; zero `/about-us`-specific regressions; ADV-S5 + 2.5.8 carry-forwards unchanged
- Artifacts: `docs/pl2/handoffs/sprint-14-cycle-1-{audit.md,report.html}`, `scripts/sprint-14-cycle-1-*.mjs` (5 durable scripts), `docs/pl2/handoffs/screenshots/sprint-14-cycle-1/` (84 PNGs)
- Commit: pending

### Cycle 2 — Preview-doc batch (F-NEW-1 + F-NEW-3) — MERGED

- Branch: `aa/pl-sprint-14-cycle-2-about-us-preview-doc` → merged `--no-ff` into integration
- Verdict: F PASS → T PASS → **S PASS**
- F changes: 3 lines in `docs/pl2/Previews/about-us.html` (hero H1 72px + ls -2px; new `.closing-cta .btn--primary` rule with bg/color + hover)
- S verification: preview-pre-fix vs preview-post-fix diff localized exactly to H1 word stack (hero@1280 AE 11.55% / DSSIM 0.0807) and §E primary button (closing-cta@1280 AE 1.50% / DSSIM 0.00234). No spillover, no surprise regions.
- Section-level DSSIM vs live unchanged (0.193 / 0.169) — expected; per-section DSSIM is dominated by F-NEW-4 (CTA suffix-icon chrome) and body-lg sitewide drift, both out of Cycle 2 scope
- S advisory (logged, not blocking): F's autonomous re-run of `sprint-14-cycle-1-capture.mjs` overwrote Cycle 1 baseline PNGs. **O restored from cycle-1 commit `b099fa4ea` before committing Cycle 2.** Consider parameterizing capture scripts with per-cycle output dirs in future sprints.
- WCAG: zero `/about-us` regressions; ADV-S5 carry-forward unchanged

### Cycle 3 — Mobile H1 36→44 px on `/about-us` (F-NEW-2) — MERGED

- Branch: `aa/pl-sprint-14-cycle-3-mobile-display-xl-token` → merged `--no-ff` into integration
- Verdict: F PASS → T PASS-with-procedural-note → **S PASS** (cross-page sweep PASS)
- **F trace deviation (scope-narrowing).** 7-step trace revealed `--title-size` was already 44 px; the actual bug was `/about-us` hero missing the `landing-hero` marker class. Fix scope narrowed from L1 token cascade (every landing page) to Canvas-content patch (one section). PC-3 explicitly prefers L5; the marker activates the existing FU-2 L5 rule.
- F changes: `scripts/sprint14-cycle3-about-us-landing-hero.php` (idempotent, preserves `component_version=e6079b189d228dad`) + preview line 514 (40→44 px). **Zero CSS files touched.**
- T procedural note: the new PHP script was untracked at T's run time; O staged it at the gate commit (`scripts/` artifacts are durable per workflow). Not a real blocker.
- S audit: `/about-us` mobile H1 confirmed 44/-1 tracking/Rubik 500/lh 1.05 per brief. Cross-page sweep: `/`, `/services`, `/how-we-do-it`, `/open-source-projects` all render H1 at 44 px with no horizontal scroll — pre-existing `landing-hero` markers continued to fire the same rule. Desktop /about-us H1 still 72 px. WCAG 17.27:1.
- **S advisory (logged, not surfaced — pre-existing).** Three sibling pages produce single-word orphans at 375 px (`confidence.` / `teams.` / `runs.`) despite `text-wrap: balance` active. Pre-dates Cycle 3 — those pages were already at 44 px before this sprint. Follow-up: future copy-edit or `<wbr>` micro-cycle. Filed to backlog.

---

## Sprint close

All three actionable findings from the Cycle 1 HQ audit closed:
- F-NEW-1 (preview H1 desktop 64→72) → Cycle 2 ✅
- F-NEW-2 (live H1 mobile 36→44) → Cycle 3 ✅ (via landing-hero marker; not L1 token)
- F-NEW-3 (preview §E primary CTA token) → Cycle 2 ✅

Silent-parked items (autonomous-mode policy):
- F-NEW-4 (CTA suffix-icon component delta) — Option C recommended (brief-doc only). Operator can revisit at sprint wrap or open a future "CTA-component spec audit" sprint.

Carried forward (out-of-/about-us scope):
- F-NEW-5 (live `display-md` line-height +1.2 px) — sitewide typography pass.
- F-NEW-6/7 (body-lg sitewide drift) — sitewide token cycle.
- Open-source card-CTA structure — Sprint 12 carry-forward, operator-decision pending.
- Sibling-page orphan words (Cycle 3 advisory) — copy-edit / `<wbr>` micro-cycle.

Next step: merge integration → local main `--no-ff`; write `sprint-14-wrap.md`.

### Silent-parked (autonomous-mode log only; not surfaced)

- F-NEW-4 (CTA suffix-icon) — Option C accepted: brief-doc clarification, not a Sprint 14 cycle. Operator can revisit at sprint wrap if a "CTA-component spec audit" sprint warrants opening.
