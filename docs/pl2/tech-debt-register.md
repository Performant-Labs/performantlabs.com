# Technical-Debt Register — `/services` + `/`

> **Last assembled:** 2026-05-11; **brought to zero** 2026-05-12 by Sprints 6 → 11; **Sprint 12 added 3 documentation-only items** (FB-5, FB-7, FB-8 — none blocking).
> **Pages covered:** all 7 shipped pages.
> **Source docs:** [`handoffs/sprint-4-wrap.md`](handoffs/sprint-4-wrap.md) through [`handoffs/sprint-12-wrap.md`](handoffs/sprint-12-wrap.md).

## Status: ZERO blocking items

All previously-identified tech-debt items closed as of Sprint 11 (2026-05-12). Sprint 12 (`/about-us` preview-fidelity) added three documentation-only items (FB-5, FB-7, FB-8 — all advisory / pre-existing surfaces / workflow-refinement candidate; none blocking, none WCAG-related). Operator-approved brand-color exceptions (ADV-S5 button `--primary` 2.21:1, brk-3 breadcrumb 3.12:1) remain live as documented design choices, allowlisted in `.pa11yci.json`. **Two operator-side action items** (FU-4 mkcert env line + ADV-S5/brk-3 token-tweak re-eval) documented for whenever the operator chooses.

Items below shown for traceability. All historically-closed entries struck through.

---

## A. WCAG / pa11y

| ID | Page(s) | Item | Source | Disposition |
|---|---|---|---|---|
| ADV-S5 | site-wide button | Primary `button--primary` white-on-teal `#62bbcb` ≈ **2.21 : 1** (fails AA normal-text) | services runbook §Final advisory | Future button-token revision OR brand-color exception. Operator-approved as live state. |
| brk-3 | `/`, `/articles`, `/contact-us` (breadcrumb link) | Breadcrumb link contrast ≈ **3.12–3.58 : 1** (fails AA normal-text) | Sprint 4 cycle 5 + Sprint 5 final pa11y | Pre-existing; operator-approved. |
| ~~FU-3~~ | ~~site-wide pa11y wiring~~ | ~~Install `.pa11yci.json` allowlist~~ | Sprint 4 FU-3 | **CLOSED 2026-05-12 by Sprint 9 cycle 2.** `.pa11yci.json` at repo root with surgical `hideElements` allowlist for `.button--primary` family + `.breadcrumb__link`. `npx --yes pa11y-ci --config .pa11yci.json` runs 7 URLs / 0 errors. Replaces the PC-5 wording workaround. |
| ~~R8 / ADV-S1~~ | ~~`/services` mobile hero~~ | ~~Mobile 375 px horizontal overflow on hero (WCAG 1.4.10 reflow)~~ | services runbook §Final advisory | **CLOSED 2026-05-12 — empirically resolved by intervening commits (`d8622f6` heal-flow, `26026741d` mobile hero, `40a4b0511` 768 hero, `4256e1f07` articles 1.4.10, `51b2ba340` FU-2). Sprint 7 audit + final baseline confirmed 16 probes clean (4 landing pages × 4 viewports). See [Sprint 7 wrap](handoffs/sprint-7-wrap.md).** |
| ~~FU-7b~~ | ~~`/articles`~~ | ~~Article cards use `<h3>` without intervening `<h2>`~~ | Sprint 4 FU-7b | **CLOSED 2026-05-12 by Sprint 9 cycle 2.** `views-view-unformatted--articles--page-1.html.twig` now emits visually-hidden `<h2>Articles</h2>` between H1 and the article-card H3s. Per-page scope (SDC unchanged; 5 other consuming pages unaffected). WCAG 1.3.1 + 2.4.6 PASS. |

---

## B. Preview ↔ live ↔ brief drift

Items where `docs/pl2/Previews/*.html` or `docs/pl2/briefs/pl_design_brief.md` no longer agree with shipped live, after Sprint 4 + 5 reconciliations.

| ID | Surface | Item | Source | Disposition |
|---|---|---|---|---|
| FU-S5-3 | preview file | `Previews/services.html` wordmark items use `opacity: 0.8` (computed contrast 4.47 : 1, fails AA). Live now better than preview. | Sprint 5 cycle 4 S advisory | One-line edit to the preview. |
| FU-S5-4 | brief | Brief silent on services-page mobile wordmark wrap. Live: 4 + 2; preview: 3 + 3. | Sprint 5 cycle 4 S advisory | One-line brief amendment OR documented acceptance. |
| FU-1 | runbook | Sprint 4 cycle 2 AC4 "zero visual delta" was empirically wrong (brand-correction necessarily flipped pale-lavender bands to cream on `/articles`, `/contact-us`, `/open-source-projects`). | Sprint 4 wrap | Rewrite the AC if the runbook is reused. Doc-only; not a new cycle. |
| FB-1 (Sprint 12) | `Previews/about-us.html:488` | Right-side "Book a testing review" CTA pill contradicts canonical no-pill header pattern (memory `design_header_nav_breakpoint.md`). | Sprint 12 cycle 1 audit | Docs hygiene pass; live header is correct; no live remediation needed. |
| FB-2 (Sprint 12) | `Previews/about-us.html` `<992px` media query | Preview hides nav without hamburger toggle, contradicting `navbar-expand-lg` family pattern. | Sprint 12 cycle 1 audit | Docs hygiene pass; live header is correct; no live remediation needed. |
| FB-8 (Sprint 12) | brief vs preview vs live | Brief specifies 32 px internal card padding at three locations (`pl_design_brief.md` lines 335, 355, 488); preview and live both use 48 px (Sprint 5 Cycle 2 audit-justified). Per PC-1 brief > preview, but the brief value contradicts deliberate audit-reviewed shipped behavior. | Sprint 12 cycle 4 F finding | **Operator decision.** Three resolution paths: (i) amend brief to 48 px to match shipped reality; (ii) open a future sprint to reduce card padding to 32 px (touches all card consumers site-wide); (iii) defer indefinitely. Not a regression. |

---

## C. Layout / responsive

| ID | Page(s) | Item | Source | Disposition |
|---|---|---|---|---|
| FU-S5-1 | `/services` § engagements | Grid at 768 px: preview collapses to 1-col at ≤ 991 px; live keeps 2 × 2. (Cycle 1 audit misclassified E4 at 768 as MATCH.) | Sprint 5 cycle 2 S advisory | Single L5 rule in `grid-wrapper.css`. Could be a micro-cycle or fold into the next services-adjacent sprint. |
| FU-S5-5 | `/services` § nearshore | H2 wraps at the page-level container (~1140 px) at 1280 instead of the preview's content-cap (~640 px). | Sprint 5 cycle 5 closure | Either (a) add a Canvas-class marker (e.g. `nearshore-section`) so L5 can scope cleanly, or (b) `:nth-of-type` selector (fragile). Recommend (a), bundled with the next Canvas-class-pattern cycle. |
| FU-5 | `/` (homepage) | §J.4 "How we do it" header label may wrap at 1280; closed as "probably resolved" by phase-8.6 header rework but not visually re-verified. | Sprint 4 FU-5 | Operator spot-check at next visit; if wrap returns, file a header micro-cycle. |
| FU-S5-2 | `/services` cross-section | Section H2 + intro paragraph typography drift (live H2 smaller than preview across § engagements / § nearshore / § proof). Pre-committed Sprint 5 typography-canon cycle was closed as no-op; this is the residual. | Sprint 5 cycle 2 S advisory | L3 token revision; high-risk cascade — needs its own audit cycle first. |

---

## D. Routing / footer / forms

| ID | Page(s) | Item | Source | Disposition |
|---|---|---|---|---|
| ~~F.8~~ | ~~site footer~~ | ~~Footer Services sub-list anchor `#testing-suite-takeover` is broken~~ | services runbook §Final advisory | **CLOSED 2026-05-12 by Sprint 8 audit — live footer menu (`menu_link_content` id=35) and live card both use `#test-suite-takeover`. No mismatch in shipped state.** |
| ~~F.9~~ | ~~site footer~~ | ~~Footer "Contact us" link uses bare `/contact`~~ | services runbook §Final advisory | **CLOSED 2026-05-12 by Sprint 8 audit — every rendered footer link points to `/contact-us` directly; zero `/contact` references in rendered HTML.** |
| ~~ADV-C1~~ | ~~site-wide~~ | ~~`/form/contact` returns 404~~ | services runbook §Final advisory | **CLOSED 2026-05-12 by Sprint 8 audit — `/form/contact` does not 404; Drupal redirect entity id=90 serves 301 → `/contact-us`. Zero rendered links point to `/form/contact` anyway.** |
| ~~ADV-CU1~~ | ~~`/contact-us`~~ | ~~Page has no H1~~ | services runbook §Final advisory | **CLOSED 2026-05-12 by Sprint 8 audit — `/contact-us` has exactly one body H1; heading hierarchy clean per WCAG 2.4.6.** |

---

## E. Architecture / fragility

| ID | Surface | Item | Source | Disposition |
|---|---|---|---|---|
| ~~ADV-3 (C2)~~ | ~~`dy-section.css` + `logo-grid.css`~~ | ~~DOM-shape-sniffing selectors~~ | services runbook + Sprint 5 cycle 3 | **CLOSED 2026-05-12 by Sprint 10 cycles 2b.1-2b.4.** 12 fragile patterns migrated to 9 new class-based markers (`dy-section--centered-light`, `dy-section--centered-white`, `dy-section--cta-pair`, `dy-section--kicker-inline`, `dy-section--tight-header`, `dy-section--bio-block`, `dy-section--wordmark-strip`, `dy-section--logo-grid`, `dy-section--post-hero-logos`). Refactor verified pixel-identical (AE=0 across 4 pages × 3 viewports per cycle). 2 transition selectors remain (P2 + P3 — kept until /open-source-projects gets markers; documented in Sprint 10 wrap). |
| ~~component_version~~ | ~~Canvas patches~~ | ~~Canvas throws `OutOfRangeException` on NULL~~ | Sprint 5 cycles 2/3/4 | **CLOSED 2026-05-12 by Sprint 10 cycle 2a.** Workflow doc fix across 9 files / 17 hit-locations: `~/.claude/agents/feature-implementor.md`, `workflow-ofts.md`, 7 runbooks. New canonical wording: "Preserve `component_version` (do NOT set to NULL — Canvas throws `OutOfRangeException`)." |
| FB-5 (Sprint 12) | `web/themes/custom/performant_labs_20260502/css/components/dy-section.css:483` | Pre-existing dead selector `.dy-section.theme--white .dy-section__content > .text + .heading.h3` no longer matches any DOM (h3 now follows `.grid-wrapper`, not `.text`, after Sprint 12 Cycle 2). Predates Sprint 12. | Sprint 12 cycle 2 F finding | Not harmful (no false matches). Candidate for a future housekeeping cycle. |
| FB-7 (Sprint 12) | workflow doc | Codify "PC-1 supersedes scope-split when (a) brief unambiguous, (b) AE empirically confined to affected element, (c) contrast preserved or improved" precedent in `workflow-ofts.md` §F. Empirically established in Sprint 12 cycle 3 (F's non-scope-split L3 cross-page token edit, accepted post-hoc on inflated-S sub-perceptual evidence). | Sprint 12 cycle 3 procedural | One-paragraph docs addition. Operator decision. |

---

## F. Brand assets / content ambiguity

| ID | Page(s) | Item | Source | Disposition |
|---|---|---|---|---|
| Hero image | `/services` | `thinker_1600.png` retired (text-only interim). Drupal-specific replacement is task #59 follow-on. | services runbook §Final advisory | Out of scope for fidelity sprints. |
| Logos | `/services` (legacy) | Anthropic + OpenAI placeholder PNGs were sourced as Simple Icons CC0 PNGs. Sprint 5 cycle 4 dropped them entirely (preview shows 6 wordmarks, not 8). | services runbook §Final advisory + Sprint 5 cycle 4 | Resolved by removal. Re-add only if content brief overrides preview. |

---

## G. Environment / hygiene

| ID | Item | Source | Disposition |
|---|---|---|---|
| ~~FU-4~~ | ~~Host-shell `curl` rejects DDEV mkcert chain~~ | Sprint 4 FU-4 | **Documented 2026-05-12 by Sprint 11.** Exact one-line fix (operator action; cannot be applied by F/O): `echo 'export CURL_CA_BUNDLE="$(mkcert -CAROOT)/rootCA.pem"' >> ~/.zshrc && source ~/.zshrc`. Verified by Sprint 11 cycle 1 Thread E. Closed as documented; operator runs the line when convenient. |
| ~~FU-8 + carry~~ | ~~Merged Sprint-4..10 cycle branches not deleted~~ | Sprint 4 FU-8 + carry | **CLOSED 2026-05-12 by Sprint 11 wrap.** 65 merged branches `git branch -d`-deleted in one batch. Only `main`, `main-backup-pre-reconcile-2026-05-06`, `apply-designa-homepage`, `vc/homepage-comparison` remain locally. |
| ~~FU-5~~ | ~~Spot-check `/` at 1280 for J.4 header wrap~~ | Sprint 4 FU-5 | **CLOSED 2026-05-12 by Sprint 11 cycle 1 Thread C.** Header at 1280 confirmed clean: 6 nav labels single-line, "How we do it" width=94.8px. Screenshot in handoff. |
| ~~Orphan themes~~ | ~~`performant_labs_20260411` + `_20260418` directories~~ | Sprint 8 audit | **CLOSED 2026-05-12 by Sprint 11 cycles 2a + 2e.** Both themes uninstalled; on-disk directories deleted (~2.8 MB / 84 files); 30+ orphan config files removed via `cex`. Services SDC migration (cycle 2e) closed the final reference. `grep -rl 'performant_labs_20260418\|performant_labs_20260411' config/sync/` returns 0. |
| ~~ADV-3 transition selectors~~ | ~~P2 + P3 transition selectors in `dy-section.css`~~ | Sprint 10 wrap | **CLOSED 2026-05-12 by Sprint 11 cycles 2b/2c/2d.** P2 fully migrated to `.dy-section--centered-white` across 8 sections (6 consumers in 2c + 2 in 2b). P1 fully migrated to `.dy-section--centered-light` across 6 sections (4 in 2d + 2 pre-existing). Both `:has(.dy-section__header .kicker--centered)` and `:has(.kicker--centered)` fully dropped from CSS. Zero shape-sniffing transition selectors remain. |

---

## Closed / superseded (kept for traceability)

- **FU-2** — Live CSS reconciliation for landing-page hero H1 (services + how-we-do-it + open-source-projects). **Closed** 2026-05-11 in commit `9a2999dbc` (option A).
- **FU-6** — heal-flow needed for Services? **Closed** by Sprint 5 cycle 1 audit: preview contains no heal-flow section.
- **FU-7** (Sprint 4 mobile inconsistency 40 vs 44) — **Closed** as part of FU-2 (commit `9a2999dbc`).
- **All four Sprint 5 cycle 1 catalog REWORK items** (engagements E1–E6, closing-cta C1–C3, proof P1–P2) — shipped in cycles 2/3/4.
- **FU-S5-1** — `/services` § engagements 768 grid collapse. **Closed** 2026-05-11 by Sprint 6 cycle 2.
- **FU-S5-3** — Preview wordmark `opacity: 0.8` removed. **Closed** 2026-05-11 by Sprint 6 cycle 1.
- **FU-S5-4** — Brief mobile wordmark wrap spec added. **Closed** 2026-05-11 by Sprint 6 cycle 1.
- **FU-S5-5** — `/services` § nearshore container-cap via Canvas-class marker. **Closed** 2026-05-11 by Sprint 6 cycle 3.
- **FU-1** — Sprint 4 Cycle 2 AC4 wording correction. **Closed** 2026-05-11 by Sprint 6 cycle 1.
- **R8 / ADV-S1** — Mobile hero overflow site-wide. **Closed** 2026-05-12 by Sprint 7. Found empirically resolved by intervening commits; 16-probe regression baseline established (4 landing pages × 4 viewports clean on WCAG 1.4.10).
- **F.8, F.9, ADV-C1, ADV-CU1** (Bundle 3) — Footer + contact webform sweep. **Closed** 2026-05-12 by Sprint 8. All four found empirically resolved; 147-link inventory baseline established (7 pages × all header/footer/CTA hrefs clean; `/contact-us` H1 clean per WCAG 2.4.6).
- **FU-3** — pa11y allowlist install. **Closed** 2026-05-12 by Sprint 9 cycle 2. `.pa11yci.json` shipped at repo root with surgical `hideElements` allowlist; 7-URL pa11y-ci sweep returns 0 errors.
- **FU-7b** — `/articles` h3 heading skip. **Closed** 2026-05-12 by Sprint 9 cycle 2. Visually-hidden h2 in views template; per-page scope; SDC unchanged.
- **ADV-3 (selector-class refactor)** — `dy-section.css` + `logo-grid.css` fragile DOM-sniffing selectors. **Closed** 2026-05-12 by Sprint 10 cycles 2b.1–2b.4. 12 patterns migrated to 9 class-based markers; AE=0 pixel-identical refactor verified across 4 pages × 3 viewports per cycle. 2 transition selectors deferred (P2 + P3 wait for /open-source-projects markers — backlog).
- **component_version workflow doc fix** — Sprint 5+ workaround codified. **Closed** 2026-05-12 by Sprint 10 cycle 2a. 9 files / 17 hit-locations updated to "Preserve `component_version`" wording.
- **Sprint 12 (`/about-us` preview-fidelity)** — 5 cycles, integration merged to main at `5e7a307d1`. Cycle 1 audit + bio re-nest (Cycle 2, R9 restore) + kicker L3 token alignment (Cycle 3) + card padding no-op verified (Cycle 4) + wrap verification sweep (Cycle 5). WCAG 21/21. See [Sprint 12 wrap](handoffs/sprint-12-wrap.md).

---

## Quick triage view (operator's call)

If picking the **next sprint** off this register, the remaining bundles are:

1. ~~Brief/preview reconciliation micro-sprint~~ — **CLOSED by Sprint 6**.
2. ~~Services responsive + nearshore polish~~ — **CLOSED by Sprint 6**.
3. ~~Footer + contact webform sweep~~ — **CLOSED by Sprint 8**.
4. ~~A11y debt sweep~~ — **CLOSED by Sprint 9** (FU-3 + FU-7b shipped; ADV-S5 + brk-3 remain operator-approved exceptions, allowlisted in `.pa11yci.json`).
5. ~~Cycle-debt branch R8~~ — **CLOSED by Sprint 7** (empirically resolved; baseline established).
6. ~~Architectural cleanup~~ — **CLOSED by Sprint 10.** ADV-3 + component_version workflow doc fix.
7. **Hygiene:** FU-4 env, FU-5 spot-check.
8. **Brief reconciliation (FB-8):** decide whether to amend brief to 48 px or open a sprint to reduce card padding to 32 px. Operator decision.
9. **Workflow doc refinement (FB-7):** one-paragraph addition to `workflow-ofts.md` §F codifying the PC-1-supersedes-scope-split precedent.
10. **Preview docs hygiene (FB-1, FB-2):** update `docs/pl2/Previews/about-us.html` to align preview header chrome with canonical family pattern.

After Sprint 12, remaining items are documentation / docs-hygiene / operator-decision. No WCAG, no shipped-page tech debt, no architectural fragility.

**Pattern observed across Sprints 7 + 8:** Two consecutive bundles found empirically resolved on audit, with regression-prevention baselines established instead of fixes. **Lesson: open every remaining bundle with an audit cycle first.**

**Pattern continuation in Sprint 9:** unlike 7+8, Sprint 9 produced actual code/config — but still benefited from the audit-first opener. The audit identified the smallest correct fix (visually-hidden h2 in the per-page views template, not the SDC) and prevented a 5-page cascade that the runbook default would have caused.

**Pattern continuation in Sprint 12:** Cycle 1 audit produced a 4-cycle carve; Cycle 2's F reinterpreted the issue structurally (no component migration needed, only a marker class change); Cycle 4's F resolved the audit row as a no-op (Sprint 5 Cycle 2 had already shipped the equivalent cadence). Two of four fix cycles collapsed to substantially simpler work than the audit anticipated. **Audit-first scales; F's Step-3 trace is the safety valve against over-engineered fix paths.**
