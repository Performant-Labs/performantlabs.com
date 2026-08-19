# Runbook — Elevate the V2 theme into the canonical repo (pristine DripYard parents, all customization in our subtheme)

**Status:** DRAFT v3 for review — do not execute until approved.
**Created:** 2026-06-14 · **Revised:** 2026-06-14 (v3) after confirming the canonical-repo move,
the DripYard 1.1.4 zip layout, and operator decisions.
**Goal:** Promote the V2 theme out of the `.3` scratch checkout into the **canonical production repo**
(`~/Sites/pl-performantlabs.com`), matching DripYard's recommended architecture — `dripyard_base` +
`neonbyte` stay **pristine and overwrite-able on update**, and **all** our customization lives in our
subtheme `performant_labs_v2`. The theme is **installed but NOT activated** this pass; prod keeps running
`performant_labs` (v1).

## Operator decisions locked (2026-06-14)
- **Canonical repo:** `~/Sites/pl-performantlabs.com` (origin `git@github.com:Performant-Labs/performantlabs.com.git`,
  deploys to Pantheon). `.2` / `.3` were scratch; everything moves here. **Do not activate the new theme yet.**
- **V2 name:** `performant_labs_v2` (confirmed).
- **Pristine parents location:** DripYard's own layout — the `dripyard_themes/` wrapper from the zip, placed at
  `web/themes/dripyard_themes/` (tracked; **not** under the git-ignored `web/themes/contrib`).
- **Pristine source:** `~/Downloads/neonbyte-1.1.4.zip` (ships `dripyard_themes/{dripyard_base, neonbyte,
  neonbyte_subtheme}`; `neonbyte` is license-stamped to andre.angelantoni@performantlabs.com, v1.1.4).
- **Subtheme strategy:** start from the **fresh `neonbyte_subtheme` starter** (1.1.4), rename to
  `performant_labs_v2`, and **re-apply** our customizations as clean overrides (our work = the diff).
- **Verification:** stage files + **stand up DDEV in the canonical repo and verify** v2 renders
  (install-not-activate) + audit/state checks.
- **Push posture:** branch `aa/theme-v2-elevation`, **push the branch** to origin; nothing reaches
  `main`/Pantheon until cutover.
- **W-01 / W-06 upstream:** **do NOT file yet.** Re-validate them against pristine 1.1.4 after install; only then
  decide whether they're still real and worth reporting to DripYard.

## DripYard distribution model (confirmed from dripyard.com + the 1.1.4 zip)
- No license key, no external dependency, **Composer optional** — themes are self-contained. (neonbyte carries an
  in-file license header, not a runtime key.)
- **Distribution = download the zip from the dripyard.com dashboard.** No authenticated Composer repo.
- **Update procedure (their words):** overwrite the `dripyard_base` and purchased-theme (`neonbyte`) folders;
  **keep your subtheme folder.** "Because all changes are kept within the subtheme, you're free to update the
  parent theme as needed." Review the CHANGELOG each update.
- **Shipped layout = the suggested install layout:** a single `dripyard_themes/` folder holding
  `dripyard_base/`, `neonbyte/`, and a `neonbyte_subtheme/` starter.

## Current state (verified 2026-06-14)
- **Canonical `~/Sites/pl-performantlabs.com`:** full Drupal 11.3 site, DDEV, Pantheon deploy. Active theme =
  `web/themes/custom/performant_labs` (v1, custom). **No DripYard themes present; no path-repos in composer.json.**
  `web/themes/contrib` is git-ignored; `web/themes/custom/*` and a new `web/themes/dripyard_themes/` are tracked.
- **`.3` scratch:** holds all recent work — authored subtheme `web/themes/custom/performant_labs_20260502`,
  parents under `themes/{dripyard_base,neonbyte}` (Composer path-repo `symlink:false`, edited by W-01…W-06),
  `docs/pl2/*` (profile, audit configs, agents mirror, designs, this runbook), local-only git.
- **W-01…W-06 edited neonbyte directly** in `.3` — those edits do not move to canonical as parent edits; they are
  re-evaluated against pristine 1.1.4 and, where still wanted, re-expressed as subtheme overrides.

## Target state (in the canonical repo)
- `web/themes/dripyard_themes/{dripyard_base,neonbyte,neonbyte_subtheme}` — **pristine** 1.1.4, git-tracked, never
  edited; updated by overwriting with a fresh download. (We keep the shipped `neonbyte_subtheme` starter as a
  pristine reference; our real subtheme is the renamed copy below.)
- `web/themes/custom/performant_labs_v2/` — the canonical V2 subtheme (fresh starter, renamed), base `neonbyte`,
  holding **all** customization as overrides. **Installed but not default.**
- `web/themes/custom/performant_labs` (v1) — **stays active**; untouched this pass.
- `docs/pl2/*` — migrated from `.3` (profile, audit-ui config, agents mirror, designs, runbooks).
- Pipeline scan roots = the **subtheme**; `dripyard_themes/*` = read-only context (findings there are
  advisory-upstream, reported to DripYard, never auto-fixed).

---

## Stage 0 — Branch, backup, unzip pristine
- [ ] In canonical: `git checkout -b aa/theme-v2-elevation`; `ddev start`; `ddev export-db --file=docs/pl2/backups/pre-v2-$(date).sql.gz`; `ddev drush cex` baseline (clean tree before changes).
- [ ] Unzip `~/Downloads/neonbyte-1.1.4.zip` to a scratch dir (e.g. `/tmp/dripyard-1.1.4/`); confirm
      `dripyard_themes/{dripyard_base,neonbyte,neonbyte_subtheme}` and note neonbyte version = 1.1.4.

## Stage 1 — Drop pristine parents into the canonical repo (tracked)
- [ ] Copy `dripyard_themes/` → `web/themes/dripyard_themes/` (base + neonbyte + neonbyte_subtheme starter).
- [ ] Confirm it's **outside** `web/themes/contrib` so it's tracked (it is — contrib is the only ignored theme path).
- [ ] `ddev drush cr`; confirm Drupal discovers `dripyard_base` + `neonbyte` from the new location. Edit nothing in them.

## Stage 2 — Create performant_labs_v2 from the fresh starter
- [ ] Copy `web/themes/dripyard_themes/neonbyte_subtheme` → `web/themes/custom/performant_labs_v2`.
- [ ] Rename `.info.yml` + `*.theme` + library namespaces from the starter's machine name → `performant_labs_v2`;
      set `base theme: neonbyte`; update self-referential library names.
- [ ] `ddev drush cr`; verify `performant_labs_v2` appears on the Appearance page (uninstalled is fine).

## Stage 3 — Re-apply our customizations as subtheme overrides
Bring our work from `.3`'s `performant_labs_20260502` into `performant_labs_v2` — **as overrides on the 1.1.4
starter**, not by copying the old subtheme wholesale. Diff `.3`'s subtheme against the fresh starter to get the
real delta (our components + token overrides + templates), then port that delta.
- [ ] **Custom components** (article-card, chapter-index, heal-flow, kicker, etc.) + templates + theme config → copy in.
- [ ] **W-02** (undefined `--color-text-color-loud`): **define the token in the subtheme** (clean override). ✅
- [ ] **W-05** (teal contrast, pending operator color decision): **token override in the subtheme**. ✅
- [ ] **W-03** (tokenized `-150px` margin): upstream refactor, not a bug → **drop**, unless the offset should be a
      subtheme variable (then set it in the subtheme).
- [ ] **W-04** (coupling comments): upstream documentation → **drop**.
- [ ] **W-01** (`!important` + `[class]` removal) and **W-06** (nav breakpoint): **re-validate against pristine 1.1.4
      first** (Stage 5 render check). 1.1.4 may already differ. Only if still real: prefer a subtheme re-assertion;
      if not cleanly overridable, accept upstream and note for a possible later DripYard report. **Do not file upstream now.**
- [ ] Ensure subtheme CSS loads **after** neonbyte (Layer 5 via `libraries-extend`) so overrides win.

## Stage 4 — Migrate docs/pl2 and pipeline config into the canonical repo
- [ ] Copy `.3/docs/pl2/*` → canonical `docs/pl2/*` (profile, `audit-ui.config.json`, `agents/`, designs, runbooks).
- [ ] Update `docs/pl2/frontend-pipeline-profile.md` + `audit-ui.config.json`: project → `~/Sites/pl-performantlabs.com`;
      theme name → `performant_labs_v2`; **scan roots → `web/themes/custom/performant_labs_v2`**; parents
      (`web/themes/dripyard_themes/*`) listed **context-only** (cascade resolution, not findings); site base URL → the
      canonical repo's ddev URL (capture from `ddev describe`); stateful-surface/nav selectors carried over.
- [ ] Note in profile/audit roles: **findings inside `dripyard_themes/*` are advisory-upstream** (report to DripYard,
      never auto-fix) — only the subtheme is fixable.

## Stage 5 — Stand up & verify (install, do NOT activate)
- [ ] `ddev drush theme:install performant_labs_v2` (install only; **leave `system.theme.default = performant_labs`**).
- [ ] Render-verify v2 without making it the site default — preview via theme-specific render / a temporary
      block-layout-free check, or temporarily set default on the branch only long enough to screenshot, then revert.
      (Decide the least-invasive method at run time; the requirement is *proof it renders*, not activation.)
- [ ] **Re-validate W-01 and W-06 against pristine 1.1.4**: does 1.1.4 still ship `!important`/`[class]` where W-01
      flagged? Is the nav breakpoint still 1000px? Record findings — these drive the "drop / override / report" call.
- [ ] Run the audit pipeline (scan roots = subtheme) + the state-invariant suite. Capture results in a timestamped
      run folder under `docs/pl2/handoffs/audits/`.

## Stage 6 — Establish the DripYard update workflow (the payoff)
Write `docs/pl2/dripyard-update-workflow.md`:
1. Backup (db + branch). 2. Download the new zip; read CHANGELOG. 3. **Overwrite** `web/themes/dripyard_themes/`
   (parents + starter) from the zip; commit the vendor bump. 4. **Run the audit pipeline as the regression guard**
   (scans our subtheme + cascade against the new parents). 5. Visual/T2.5 check. 6. Deploy.
Because parents are pristine and our work is in the subtheme, the overwrite is clean and nothing is lost.

## Stage 7 — Commit & push the branch (no cutover)
- [ ] `drush cr`; canonical site still 200 on **v1** (`performant_labs` still default; v2 installed-not-active).
- [ ] Audit + state-invariant suite green for v2.
- [ ] Commit on `aa/theme-v2-elevation`; **push the branch** to origin. **Do not merge to `main`** (no Pantheon
      deploy of the inactive theme until cutover). Open a draft PR if useful for tracking.

## Cutover (LATER — separate, explicitly-approved session)
Not in this runbook's scope. When ready: set `system.theme.default = performant_labs_v2`, reassign `block.block.*`
and theme-scoped config from `performant_labs` → `performant_labs_v2`, `drush cim`, retire v1, merge to `main`,
deploy. The risky config-rename work happens then, on its own branch with a fresh db/config snapshot.

## Risks & rollback
- **Wrong-place edits creeping into parents** — guard: never edit `web/themes/dripyard_themes/*`; all changes land in
  the subtheme; the audit pipeline's blast-radius/containment checks catch escapes.
- **Losing a real customization in the .3→v2 port** — guard: the Stage 3 diff (`.3` subtheme vs fresh 1.1.4 starter)
  is the authoritative checklist of what to carry; don't skip it.
- **Cross-repo drift while `.3` still exists** — once migrated + pushed, treat `.3` as read-only/archive; canonical is
  the single source. (Don't resume editing `.3`.)
- **Accidental activation** — every step keeps `system.theme.default = performant_labs`; verification must not leave
  v2 as default.
- Rollback this pass = delete the branch + the new theme dirs; canonical `main`/prod is never touched.

## Open questions (none blocking — confirm at cutover, not now)
1. At cutover: reclaim plain `performant_labs` as the machine name, or keep `performant_labs_v2`? (Affects the v1→v2
   config-reassignment + later cleanup. Deferred to the cutover session.)
2. W-01 / W-06 upstream report to DripYard — decided **after** Stage 5 re-validation against 1.1.4.
