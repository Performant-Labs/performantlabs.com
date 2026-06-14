# Phase 8 — Visual parity audit: live homepage vs `Previews/homepage.html`

**Branch:** `aa/pl-homepage-phase-8-visual-parity`
**Pipeline (this cycle):** O → S → O (audit-only; no F work yet)
**Phase 8 of `docs/pl2/pl-plan--homepage-overhaul.md`** (Activation).

---

## Operator's directive

Phases 1–7 are checked complete. Before activating `performant_labs_20260502` as the default theme, the operator wants a definitive answer to one question:

> Does the live homepage at `https://pl-performantlabs.com.3.ddev.site:8493/` visually match the operator-approved preview at `docs/pl2/Previews/homepage.html`?

If yes, we proceed to theme activation. If no, every delta becomes a sub-issue (`aa/pl-homepage-phase-8.X-[section]`) for the standard F → T → S loop.

The operator wants to **see** what S sees — not just read a verdict. S must produce an interactive visual report alongside the standard handoff.

---

## Objective

Run the Tier 3 visual parity audit per `workflow-ofts.md` §S §"Tier 3 visual checks" at the three design-brief breakpoints, and deliver:

1. A standard `phase-8-visual-parity-S.md` handoff with the verdict.
2. **NEW:** A self-contained HTML visual delta report the operator opens in a browser to *see* every difference S identifies. Path: `docs/pl2/handoffs/phase-8-visual-parity-report.html`.

---

## Scope

### Required: Tier 3 capture (per S prompt)

1. **Bootstrap Playwright + ImageMagick** if not already on the machine. `which compare` and `node_modules/playwright` checks first; `npm install --no-save playwright && npx playwright install chromium` if missing.

2. **Serve the static preview** locally so Playwright renders it identically to a real browser:
   ```bash
   cd docs/pl2/Previews && python3 -m http.server 8765 &
   ```

3. **Capture full-page PNGs at three viewports** for both live and preview:
   - 1280×800 (desktop)
   - 768×1024 (tablet)
   - 375×667 (mobile)

   Live URL: `https://pl-performantlabs.com.3.ddev.site:8493/` (no `?theme=` query — Phase 7 confirmed default theme is `performant_labs_20260502`; verify with `ddev drush cget system.theme default` before capture).
   Preview URL: `http://localhost:8765/homepage.html`.

   Save under `docs/pl2/handoffs/screenshots/cycle-8/` with naming `t3-homepage-[viewport]-{live,preview}-[YYYYMMDD].png`.

4. **Pixel diff per viewport** with ImageMagick:
   ```bash
   compare -metric AE \
     screenshots/cycle-8/t3-homepage-1280-live-[date].png \
     screenshots/cycle-8/t3-homepage-1280-preview-[date].png \
     screenshots/cycle-8/t3-homepage-1280-diff-[date].png 2>&1
   ```
   Record pixels-different and compute whole-page delta % (`pixels / (w*h) * 100`).

5. **Side-by-side composite per viewport:**
   ```bash
   convert +append live.png preview.png composite.png
   ```

### Required: New visual delta report (operator-facing)

Write `docs/pl2/handoffs/phase-8-visual-parity-report.html` — a single self-contained HTML file the operator opens in a browser. It must include:

1. **Top-level summary in plain English.** A bulleted "What I see different" list that names each visible delta in operator-readable terms. Examples of acceptable phrasing:
   - "Hero CTA buttons appear ~8 px taller on live than preview at 1280."
   - "Section 4 (heal-flow) — terracotta accent under step numbers is missing on live at all viewports."
   - "Mobile (375): logo grid wraps to 3 rows on live, 2 rows on preview."

   No deltas → state that explicitly: "No visible differences detected at any viewport."

2. **A toggle-overlay comparator** per viewport. Either:
   - A CSS-only image comparison slider (drag to wipe between live and preview), or
   - Click-to-toggle (button switches the displayed image between live, preview, and diff).

   Implementation hint: a `<div>` with two stacked absolutely-positioned `<img>` and a draggable `<input type="range">` controlling `clip-path` works in pure HTML/CSS/JS — no framework needed.

3. **The ImageMagick diff PNG** below each comparator (the red-highlighted overlay), so the operator can spot concentrated red regions visually.

4. **A per-section delta table** with anchored thumbnails. Columns: Section name | Viewport | Status (MATCH / DELTA / REWORK) | Description | Crop preview (cropped from the diff PNG, ~300 px wide).

5. **Verdict banner** at top: PASS / REWORK with the threshold metrics (pixels-different and %) per viewport.

The report should look usable on its own — basic typography, sensible layout, no external dependencies (CDN-hosted assets are OK if needed; pure local-relative paths preferred).

### Required: Standard S handoff

Write `docs/pl2/handoffs/phase-8-visual-parity-S.md` per the template in `workflow-ofts.md` §S, including:

- Visual diff results table (viewport, pixels-different, delta %, diff PNG path, composite path, **report.html anchor**).
- Per-section delta description.
- Design brief compliance table (token sweep — colors, type, spacing, accents).
- WCAG 2.2 AA audit (keyboard, focus rings, forced-colors, reduced-motion, 200 % zoom, heading hierarchy, alt text, mobile touch targets, mobile typography scale, mobile layout collapse).
- Static preview comparison section by section.
- Verdict (PASS or REWORK with numbered changes).

---

## Acceptance criteria (this audit cycle)

- [ ] Playwright + ImageMagick preconditions confirmed; if not satisfiable, S returns CANNOT-AUDIT.
- [ ] PNGs captured at 1280×800, 768×1024, 375×667 for both live and preview.
- [ ] ImageMagick `compare` produced a diff PNG and a numerical pixel count for each viewport.
- [ ] Side-by-side composite produced for each viewport.
- [ ] **`phase-8-visual-parity-report.html` exists and opens in a browser without errors**, with comparator + diff + per-section table + plain-English delta list.
- [ ] `phase-8-visual-parity-S.md` handoff written per the workflow-ofts template, with a verdict and (if REWORK) a numbered list of required fixes.
- [ ] Verdict thresholds applied per `workflow-ofts.md` §S §"Verdict thresholds": <2 % presumed MATCH, 2–5 % triaged, >5 % presumed REWORK.

---

## Inputs (read before starting)

1. `docs/pl2/workflow-ofts.md` §S — full S protocol, including the Tier 3 visual-diff mandate and verdict thresholds.
2. `docs/pl2/Previews/homepage.html` — the operator-approved visual reference.
3. `docs/pl2/Briefs/pl_design_brief.md` — visual tokens, typography, responsive behavior block.
4. `docs/pl2/Briefs/pl_homepage_components.md` — section-to-component mapping.
5. `docs/pl2/pl-plan--homepage-overhaul.md` §Phase 8 — acceptance criteria source.
6. `~/Sites/ai_guidance/testing/verification-cookbook.md` — T3 protocol.

---

## Handoff locations

- Standard handoff: `docs/pl2/handoffs/phase-8-visual-parity-S.md`
- Visual report (new): `docs/pl2/handoffs/phase-8-visual-parity-report.html`
- Screenshots dir: `docs/pl2/handoffs/screenshots/cycle-8/`

---

## Operating rules

- S does not write CSS or fix deltas. S reports — O decides — F fixes.
- If preconditions fail, return CANNOT-AUDIT. Do not downgrade to prose-only screenshot description.
- Token-correct + pixel-divergent is REWORK, not PASS.
- The operator personally reviews `phase-8-visual-parity-report.html` before O proceeds. S's PASS verdict is necessary but not sufficient for commit.
