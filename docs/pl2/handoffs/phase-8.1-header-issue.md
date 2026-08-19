# Phase 8.1 — Site header parity

**Branch:** `aa/pl-homepage-phase-8.1-header`
**Pipeline:** O → F → T → S → O
**Parent:** Phase 8 visual parity audit + the operator-driven header re-assessment ([`header-reassess-20260510.md`](header-reassess-20260510.md)).

The canonical header spec is now codified in:
- `docs/pl2/Previews/homepage.html` (lines 469–514: site header markup + CSS)
- `docs/pl2/Briefs/pl_design_brief.md` §"Per-section mobile behavior" §"Header"
- `~/.claude/projects/.../memory/design_header_nav_breakpoint.md` (memory pointer)

A first commit on this branch (`336c97209`) landed the spec change. F's job is to align the live header to the spec.

---

## Operator's directive

Match the preview literally. **Do not pause to ask permission.** Standing rule for Phase 8: preview is canonical.

---

## Objective

Bring the live homepage's site header into structural and visual parity with the canonical preview.

## Spec (canonical, from preview + brief)

- **Wordmark on the left:** P-badge (28×28 px teal circle with white "P") + "performant labs" wordmark text in display font, weight 500, 18 px.
- **Primary nav on the right:** six links inline — Services, How we do it, Articles, Open source projects, About us, Contact us. 15 px text, ink color, primary color on hover. Gap = `var(--space-xl)`.
- **No right-side CTA pill.** The earlier "Book a testing review" pill on live must be removed. The canonical preview has no CTA in the header (this was the explicit operator decision; updating the canonical preview was part of Phase 8.1 prep).
- **Responsive collapse: `navbar-expand-lg`:**
  - **≥ 992 px:** full inline nav, no hamburger.
  - **< 992 px (covers tablet at 768 and mobile at 375):** primary nav hides; hamburger button appears (44×44 px, `aria-label="Open menu"`, `aria-expanded` state, opens an overlay panel containing the same nav links).
- **Header height:** ~73 px at all viewports (preview measurement). Live currently 98 px (1280) / 82 px (768) / 82 px (375). Reduce.
- **Hairline border-bottom** in canvas color (matches the preview's `border-bottom: 1px solid var(--hairline)`).

## Problem (from header-reassess-20260510.md)

| Viewport | Live | Preview | Status |
|---|---|---|---|
| 1280 | wordmark + 6-link nav (with two labels wrapping due to CTA pill) + "Book a testing review" pill | wordmark + 6-link nav inline, no pill | DELTA: pill must go; nav unwraps once pill is gone |
| 768 | wordmark + hamburger | wordmark + hamburger (matches; hamburger trigger is at < 992 on both) | NEAR MATCH (verify breakpoint) |
| 375 | wordmark + hamburger | wordmark + hamburger | NEAR MATCH |

Header heights differ by ~25 px at all viewports.

## Likely diagnosis directions (for F's trace)

1. **The "Book a testing review" pill** is rendered by the existing live header SDC override or by a Canvas component placed in the header region. Find where it's emitted and remove it (or set its visibility). Likely a header-cta SDC, a Canvas block, or a Twig override that injects the link.
2. **Header height** is probably driven by:
   - Vertical padding (e.g. `padding-block`) on the header element. Preview's `.site-header__inner { height: 72px }` — single fixed height with no padding scaling. Live likely has variable padding from Dripyard / neonbyte.
   - Possible logo-block or CTA-block height pushing the row taller. Removing the CTA may itself reduce height; verify after pill removal before adding more padding overrides.
3. **Hamburger breakpoint:** if live currently triggers the hamburger at < 992 (S's earlier audit said "live shows hamburger at 768" which is consistent with a 992 trigger), no breakpoint change needed. Confirm via the trace.
4. **Wordmark visibility at tablet:** S's first audit claimed live drops the wordmark text and shows only the "P" badge at 768 — but the re-audit said this didn't reproduce. Confirm in your trace; if live does collapse to the badge somewhere, undo that.

## Acceptance criteria

- [ ] Step-3 trace surfaced in F handoff before any change is made; root cause(s) and chosen layer(s) documented per change.
- [ ] **Live homepage header at 1280** renders: wordmark + 6-link nav inline, no pill, no nav-label wrapping.
- [ ] **Live homepage header at 768** renders: wordmark + hamburger button, no inline nav.
- [ ] **Live homepage header at 375** renders: wordmark + hamburger button.
- [ ] Header height ~73 px ± 4 px at all three viewports (Playwright-measured `outerHeight` of the `<header>` or `.site-header` wrapper).
- [ ] Hamburger button at < 992 px is a 44×44 px touch target, has `aria-label`, `aria-expanded`, and opens a focus-trapped overlay (if the overlay isn't already implemented in live, surface it as advisory rather than blocking — overlay behavior can be a follow-up sub-cycle if scope is large; the visible hamburger affordance is the binding requirement here).
- [ ] No regressions on prior fixes:
  - 8.2: hero `padding-inline: 0` on `.hero.theme--white` still served; logo-grid `min-width: 992px` nowrap rule still served.
  - 8.4: feature cards `grid-wrapper--3col-stack-md` class still rendered (3 / 1 / 1 cols).
  - 8.5: hero `min-height: auto`, `padding-block: 120px 96px`, and the dy-section sibling-combinator rule still served.
- [ ] No `!important`. Files staged by explicit path. `component_version` retention rule applies.
- [ ] WCAG: removed pill must not have been the only path to the page it linked to (likely "Book a testing review" linked to /contact-us — confirm /contact-us is reachable via the primary nav, which it is via "Contact us" link). Note any link-loss in advisory.

## Inputs (read all before writing code)

1. `docs/pl2/handoffs/header-reassess-20260510.md` and `header-reassess-20260510-report.html` — the diagnostic re-read with measured deltas.
2. `docs/pl2/Previews/homepage.html` lines 469–514 — canonical header markup + CSS. Inspect via browser at all three viewports.
3. `docs/pl2/Briefs/pl_design_brief.md` §"Per-section mobile behavior" §"Header" — canonical spec.
4. `~/.claude/projects/.../memory/design_header_nav_breakpoint.md` — the memory note.
5. `docs/pl2/theme-change--workflow.md` — 7-step CSS workflow.
6. The current live header source — find via `grep -r "Book a testing review" web/themes/ web/modules/custom/ config/`. Trace from there back to the SDC, Twig, or Canvas component that emits it.
7. Any existing subtheme header CSS — likely `web/themes/custom/performant_labs_20260502/css/components/site-header.css` or similar; if not present, F may need to author it.

## Handoff location

Write your handoff to: `docs/pl2/handoffs/phase-8.1-header-F.md`

## Operating rules (per the F prompt + Phase 8 standing rules)

- 7-step CSS workflow.
- Override at the highest correct layer.
- No `!important`. No `git add .`.
- `component_version` retention applies.
- Run T1 + T2 yourself; do NOT run T3.
- **Do not pause to ask permission.** When the trace surfaces decisions, you choose. The Orchestrator only steers when the brief and preview genuinely contradict each other.
- This is the largest sub-cycle in Phase 8. If your trace surfaces that the pill is rendered by a non-CSS mechanism (e.g. a Canvas component, a Twig template override, or a config_block in `config/sync/`), use whichever mechanism is correct to remove it — the fix doesn't have to be CSS-only.
