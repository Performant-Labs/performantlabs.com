# Upgrade Comparison Plan

Step-by-step plan for comparing a Drupal upgrade on Dev against the Live environment using the **Three-Tier Verification Hierarchy** defined in `verification-cookbook.md`.

---

## Prerequisites

- The upgrade has been deployed to the Dev environment.
- The Live environment is running the current production code.
- The URL list is defined in `upgrade-comparison-urls.md`.

---

## Step 1 — Compile URL List

Review and finalize the URLs in `upgrade-comparison-urls.md`. Include all top-level pages, listing pages, landing pages, and a representative sample of content pages (e.g. articles). Exclude deep book/documentation pages unless they are structurally unique.

---

## Step 2 — Tier 1: Headless Checks (curl)

For each URL, run instant headless checks against both environments.

### Checks
- **HTTP status code** — both environments should return `200`.
- **H1 tag content** — the primary heading should match between Dev and Live.

### Method
```bash
for url in / /services /how-we-do-it ...; do
  DEV_STATUS=$(curl -sk -o /dev/null -w '%{http_code}' "https://dev-performant-labs.pantheonsite.io$url")
  LIVE_STATUS=$(curl -sk -o /dev/null -w '%{http_code}' "https://performantlabs.com$url")
  DEV_H1=$(curl -sk "https://dev-performant-labs.pantheonsite.io$url" | grep -oP '<h1[^>]*>\K[^<]+')
  LIVE_H1=$(curl -sk "https://performantlabs.com$url" | grep -oP '<h1[^>]*>\K[^<]+')
  echo "$url | Dev:$DEV_STATUS Live:$LIVE_STATUS | H1 match: $([ "$DEV_H1" = "$LIVE_H1" ] && echo YES || echo NO)"
done
```

### Pass Criteria
- All URLs return `200` on both environments.
- H1 content matches for all URLs.
- Any mismatches are flagged for Tier 2 investigation.

---

## Step 3 — Tier 2: Structural Skeleton (ARIA Snapshots)

For each URL, capture the ARIA accessibility tree on both environments and compare structural elements.

### Checks
- **Landmarks** — `banner`, `main`, `navigation`, `contentinfo` are present.
- **Heading hierarchy** — H1–H6 levels and text match.
- **Navigation links** — main menu links are present and correct.
- **Buttons and forms** — interactive elements are present.
- **Component presence** — key sections (hero, cards, sidebars) appear.

### Method
Use the browser snapshot tool (Playwright MCP or similar) to capture the ARIA tree for each URL on both environments. Diff the two snapshots to identify structural differences.

### Pass Criteria
- Landmark structure matches between Dev and Live.
- Heading text and hierarchy match.
- No missing interactive elements (links, buttons, form fields).
- Structural differences are limited to expected upgrade changes.

---

## Step 4 — Tier 3: Visual Fidelity (Screenshots)

Only escalate to this tier after Tier 2 passes. Capture full-page screenshots on both environments and compare.

### Checks
- **Layout** — page structure and spacing are consistent.
- **Colors and typography** — no unexpected visual regressions.
- **Responsive** — check at desktop (1280px) and mobile (375px) widths.

### Method
Use Playwright to capture screenshots at consistent viewport sizes. Compare Dev vs Live screenshots side by side or via pixel-diff tooling.

### Pass Criteria
- No unexpected visual regressions beyond known upgrade changes.
- Layout and spacing are consistent between environments.

---

## Reporting

Summarize results in a table:

| URL | Tier 1 (Status) | Tier 1 (H1) | Tier 2 (Structure) | Tier 3 (Visual) |
|-----|-----------------|-------------|--------------------|-----------------| 
| `/` | ✅ / ❌ | ✅ / ❌ | ✅ / ❌ | ✅ / ❌ |

Flag any failures with details for remediation.
