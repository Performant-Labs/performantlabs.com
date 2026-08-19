# Briefs

Reference documents for the PL2 site overhaul. Two kinds live here.

## Foundational briefs (living)

Apply to every page and every component. Treat as the source of truth; update them when a project-wide decision changes.

| File | Purpose |
|------|---------|
| [`pl_brand_brief.md`](pl_brand_brief.md) | Brand voice, positioning, audience. |
| [`pl_copy_brief.md`](pl_copy_brief.md) | Copy guidelines — sentence case, tone, punctuation rules. |
| [`pl_design_brief.md`](pl_design_brief.md) | Visual system — color tokens, typography scale, spacing, responsive breakpoint table, header / footer chrome rules. |

When the brief and an implementation disagree, the brief wins — but if it disagrees with a *shipped* implementation that the operator has signed off on, update the brief rather than the implementation. The brief is the durable record.

## Page-specific component briefs

One per page; translates the foundational briefs into the specific Dripyard SDC components that the page uses, with override types (libraries-extend / bundle-copy / bespoke) and section-by-section mapping.

While a page is being built, its component brief is active — F reads it, T verifies against it, S audits against it. Once the page ships and the runbook is closed, the brief's working purpose is over and it moves to [`archive/`](archive/) as a historical record.

| Page | Status | Brief location |
|------|--------|----------------|
| Homepage | Shipped (Phase 1–8, 2026-05-03 → 2026-05-11) | [`archive/pl_homepage_components.md`](archive/pl_homepage_components.md) |
| Services | Planned (post Sprint 4) | not yet written |
| About | Planned | not yet written |
| How We Do It | Shipped (2026-05-06) | none authored — followed homepage components brief |
| Articles | Shipped (2026-05-06) | none authored |
| Open Source Projects | Shipped (2026-05-07) | none authored |
| Contact Us | Shipped (2026-05-08) | none authored |
| Book pages (`/automated-testing-kit`) | Shipped | none authored |
| Article detail | Shipped (Phase 1, 2026-05-06) | none authored |

Per-page component briefs are not mandatory — most pages reused the homepage's component set with minor additions. Author one only when a page introduces enough new components / overrides that a section-by-section map is worth the effort.

## When to archive

Move a page-specific brief to [`archive/`](archive/) when **all** of these are true:

- The page's overhaul plan (`pl-plan--<page>.md`) is marked complete or merged.
- No active sprint references the brief as in-flight input.
- The brief has not been updated for a continuing initiative on the same page.

The brief in `archive/` remains readable and link-able as historical context. Update references in other docs when archiving so paths stay valid.
