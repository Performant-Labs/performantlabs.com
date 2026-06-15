## Implementation Review (Round 1)

### BLOCK findings
**[B-1]** themes/neonbyte/components/header/header.js (plus any other header JS): the hand-off asserts that  
“isDesktopNav() derives the mode from `mobileNavigationButton.clientHeight === 0`” and that **no JS compares `innerWidth` to 1 000 px**.  
That statement has not been proven from source in the review notes.  
If even a single JS branch still gates on `1000`, CSS and JS will disagree between 992 – 1 000 px, breaking menu toggling (e.g. sticky-header resize, scroll spy, focus trap).  
Until a repository-wide grep + manual inspection of the header JS confirms that **no constant 1000 or hard-coded media query remains**, runtime behaviour is only a hypothesis.  
Remediation: search all *.js, *.ts, inline scripts for `1000` / `innerWidth` / `matchMedia.*1000` / `.clientWidth >=` etc.; update or delete any hits, then document the result.

### WARN findings
**[W-1]** web/themes/contrib/neonbyte/**…** — The patch duplicates every CSS edit in the Composer-installed copy.  
That directory is rebuilt on every `composer install` and should be treated as read-only. Editing it by hand risks:
• reviewers chasing double diffs,  
• future fixes landing in only one location,  
• silent loss of the change in the next CI job that runs `composer install`.  
Recommendation: drop the web-copy commits, keep `themes/neonbyte/` as the single source of truth and rely on Composer’s path repository to propagate the change.

**[W-2]** CSS still relies on Media Queries Level 4 range syntax `@media (width >= 992px)` / `< 992px>`.  
Because the site already used the same syntax this is not new, but confirm that the project’s browser-support matrix (especially Firefox < 63, Samsung Internet < 17, any embedded WebViews) is still acceptable.

**[W-3]** Operator normalisation changed `<= 1000` to `< 992`.  
Pixel values are integers, but zoom or DPR scaling can yield fractional CSS pixels. 991.99 px evaluates “< 992” true, so the gap is effectively 0 px; still, add a visual sanity test at 991.5 px and 992.0 px in the regression suite to be sure there is no flicker.

### NIT findings
**[NIT-1]** Replacing 33 literals by hand is brittle. Consider introducing a CSS custom property `--pl-header-breakpoint` or a PostCSS variable so the next change touches one line, not 66.

**[NIT-2]** The PR description’s “Diff” section is empty. Including at least one representative hunk helps code reviewers scan for accidental selector edits.

### Verdict
BLOCK — 1 blocking finding must be resolved (prove no JS still references the old 1 000 px breakpoint) before testing proceeds.
