## Brief Review (Round 1)

### BLOCK findings
**[B-1]** Source-of-truth for breakpoint unclear — risk of being overwritten  
Why it blocks: If the 1000 px figure originates from Sass / PostCSS variables, design tokens, build-time constants or a CSS-in-JS layer, changing the compiled `.css` files directly will be lost on the next build. The brief assumes “plain CSS only” without proving it from repo structure or build pipeline docs.  
Must clarify/fix: Identify where the 1000 px value is first declared. If it lives in a pre-processor or token file, change it there and let the pipeline regenerate CSS, or freeze the pipeline so hand-edit cannot be clobbered.

**[B-2]** Unverified claim that “JS needs no change”  
Why it blocks: The brief cites only `isDesktopNav()` in `header.js`, but other scripts (e.g. global resize listeners, analytics, A/B helpers, tests) may still compare `window.innerWidth` to 1000. Without a repo-wide grep or doc proof, the assertion is hypothesis.  
Must clarify/fix: Perform/full-text search (code + tests) for `1000`, `> 999`, `>= 1000`, etc., or document that no JS logic depends on the numeric constant. Adjust or delete those occurrences before proceeding.

**[B-3]** Acceptance criteria omit the breakpoint value itself (992 px)  
Why it blocks: Criteria check 991 px and 993 px but ignore behaviour at exactly 992 px, the spec’s boundary. If operators stay mixed (`>`, `<`, `<=`) an off-by-one error could show both nav modes or none at 992 px and still pass the written tests.  
Must clarify/fix: Add an explicit check: “At 992 px width, desktop (inline) navigation is shown and mobile hamburger is hidden.”

### WARN findings
**[W-1]** No regression guard for pages outside header namespace  
Other components (e.g. hero banners, mega-menus) may have crafted layout for the 1000 px header height/overflow combo. Reducing the switch point by 8 px could expose clash for 992-999 px widths. Recommendation: run a visual‐diff test suite or manual QA across primary templates at 992–999 px.

**[W-2]** Cached CSS & long-lived service-worker assets  
If the site ships a service worker or aggressive CDN caching, old CSS may coexist with new JS bundles after deploy, causing inconsistent breakpoints for some users. Consider bumping asset hashes or cache versions.

**[W-3]** Potential rounding issues on high-DPI devices  
`window.innerWidth` can report fractional CSS pixels on zoomed/high-DPI screens, occasionally surfacing 991.67 px, etc. Clarify whether the media queries use `min-width: 992px` (integer) and whether JS uses strict equality checks that could misalign.

### NIT findings
**[NIT-1]** Scope list duplicates folder names (e.g. `language-switcher/language-switcher`) — harmless but noisy.
**[NIT-2]** “No `!important`, no new selectors” is redundant for a value-only change but fine.

### Verdict
BLOCK — 3 blocking finding(s); must resolve before implementation starts.
