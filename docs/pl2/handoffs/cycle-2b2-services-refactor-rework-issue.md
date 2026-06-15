# Sprint 10 — Cycle 2b.2 — REWORK

**Branch:** `aa/pl-sprint-10-cycle-2b2-services` (continue)
**Mode:** autonomous

## What S found

Two issues:

### 1. P4 direct swap broke /about-us hero

P4's old selector `.dy-section.theme--white .dy-section__content:has(> .button + .button)` matched BOTH /services hero AND /about-us hero. F's "direct swap" added `dy-section--cta-pair` marker only to /services hero — leaving /about-us hero without a marker. /about-us hero CTAs now stack vertically at 1280/768 instead of side-by-side.

### 2. /services vertical drift in wordmark/dogfooding/closing-CTA region

~32-96 px vertical drift originating around y≈3265. Probable cause: one of the new markers (`centered-white` on Dogfooding, `wordmark-strip` on §5, or `cta-pair` on closing CTA) is applying slightly different padding/margin than the pre-refactor selectors did.

## Fixes

### Fix 1 — /about-us hero gets `dy-section--cta-pair` marker

Update `scripts/sprint10-cycle2b2-services-markers.php` (or write a small follow-up script) to also patch /about-us (canvas_page id=17) hero section to add `dy-section--cta-pair` to `additional_classes`. Idempotent. Preserves `component_version`.

OR: restore P4 transition selector (keep both old `:has` AND new marker) — same approach F used for P2. Simpler if you can't find the /about-us hero's Canvas index quickly.

### Fix 2 — bisect /services drift

Compare the new marker-based CSS rules vs the old `:has`-based rules side-by-side. The CSS declarations should be byte-identical to avoid any layout shift. Likely culprits:

- P10 wordmark-strip: did the new marker selector capture all the same declarations? Check both `.dy-section__content` and `.dy-section__header` rules.
- P2 dogfooding: same check — did anything fall through that the old `:has(.dy-section__header .kicker--centered)` was catching that the new marker isn't?
- P8 closing-CTA cleanup: dropping the old `:has` half — did any declaration depend on the OR of both?

Find the diverging declaration, restore it under the new selector, verify pixel-identical.

## Acceptance criteria

- [ ] /about-us hero CTAs render side-by-side at 1280 (matching pre-refactor and matching /services hero).
- [ ] /services AE = 0 at 1280, 768, 375.
- [ ] /about-us AE = 0 at 1280, 768, 375.
- [ ] No regression on other pages.
- [ ] `component_version` preserved.

## Handoff

- F: `docs/pl2/handoffs/cycle-2b2-services-refactor-F-rework.md`
- T: `docs/pl2/handoffs/cycle-2b2-services-refactor-T-rework.md`
- S: `docs/pl2/handoffs/cycle-2b2-services-refactor-S-rework.md`
