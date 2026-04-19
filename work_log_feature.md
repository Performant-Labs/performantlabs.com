# Work Log Integration Plan

## Overview
Integrate Hermes work log data (from SQLite) into Drupal to enable tracking, reporting, and display of work activities on the Performant Labs website.

**Testing Methodology**: This project follows the **Three-Tier Verification Hierarchy** from the [Verification Cookbook](docs/ai_guidance/docs/frameworks/drupal/theming/verification-cookbook.md):
- **Tier 1 (Headless)**: Fast CLI/curl checks (1-5s)
- **Tier 2 (Structural Skeleton)**: ARIA tree verification (5-10s) - Primary development loop
- **Tier 3 (Visual Fidelity)**: Screenshots and visual regression (60-90s) - Final validation only

## Current State

### Database Schema (Hermes)
- **Location**: `hermes_logs.db` (copied locally)
- **Table**: `work_logs`
- **Fields**:
  - `id` (TEXT PRIMARY KEY) - Google Calendar event ID
  - `date` (TEXT) - YYYY-MM-DD format
  - `title` (TEXT) - Work log title (stripped of "log:" prefix)
  - `hours` (REAL) - Duration in decimal hours
  - `event_id` (TEXT) - Raw Google event ID (same as id)
  - `ingested_at` (TEXT) - ISO-8601 UTC timestamp of last ingest
  - `project_id` (TEXT) - Project identifier (e.g., 'atk', 'pl-website')
  - `category` (TEXT) - Work category (e.g., 'development', 'meeting', 'admin')
- **Indexes**:
  - `work_logs_date` on date column
  - `work_logs_project_id` on project_id column
- **Current entries**: 3 work logs

### Sample Data
```
date       |title            |hours|project_id  |category
2026-04-16 |ATK Release 2.1  |1.0  |atk         |development
2026-04-16 |ATK Release 2.1  |9.0  |atk         |development
2026-04-16 |New website      |2.5  |pl-website  |development
```

### ✅ Schema Enhancement: Categories Added
**Update**: The SQLite schema has been enhanced with `project_id` and `category` fields to enable proper rollup and aggregation.

**Benefits**:
- Can aggregate hours by project
- Can track time breakdown by category
- Enables meaningful reporting and analytics
- Supports filtering and grouping in Drupal views

**Recommended Categories**:
- `development` - Coding, implementation work
- `meeting` - Client meetings, standups, planning
- `admin` - Administrative tasks, emails
- `research` - Investigation, learning, documentation
- `testing` - QA, bug fixing, validation

## Implementation Plan

### Phase 1: Drupal Data Structure
**Goal**: Create a proper Drupal structure to store work log data

#### Option A: Content Type (Recommended for MVP)
- **Pros**:
  - Quick to set up via UI or config
  - Leverages existing Drupal features (revisions, workflows, permissions)
  - Easy to extend with fields
  - Works with Views out of the box
- **Cons**:
  - Slight overhead for simple data
  - Creates nodes which may be overkill

#### Option B: Custom Entity
- **Pros**:
  - Lightweight, purpose-built
  - Better performance for large datasets
  - More control over storage
- **Cons**:
  - More development time
  - Need to build admin UI
  - More complex to maintain

**Decision**: Start with Content Type, migrate to Custom Entity if needed

#### Fields for Work Log Content Type
- **Title**: Use existing title field (from work log title)
- **Date**: Date field (from date)
- **Hours**: Decimal/Number field (from hours)
- **Event ID**: Text field (from event_id/id)
- **Ingested At**: Datetime field (from ingested_at)
- **Project ID**: Text field or Entity reference (from project_id)
- **Category**: Taxonomy reference or List field (from category)
- **Status**: Published by default

#### Testing Phase 1 (Three-Tier Verification)

**Tier 1 - Headless (1-5s):**
- Verify content type exists: `ddev drush entity:info node | grep work_log`
- Check field definitions: `ddev drush field:list node.work_log`
- Confirm config export: `ls config/default/sync/node.type.work_log.yml`

**Tier 2 - Structural Skeleton (5-10s):**
- Create sample work log node via Drush
- Use browser accessibility tree to verify:
  - [ ] Form has proper field labels (Title, Date, Hours, etc.)
  - [ ] Required fields marked with `aria-required="true"`
  - [ ] Number field for hours has correct input type
  - [ ] Date field has date picker widget
  - [ ] Save button is present and accessible
- Verify node display shows all fields in correct order

**Tier 3 - Visual Fidelity (60-90s):**
- Take screenshot of work log form
- Verify field layout and spacing
- Check responsive design on mobile/tablet
- Confirm styling matches site theme

### Phase 2: Data Migration
**Goal**: Import existing SQLite data into Drupal

#### Approach: Drupal Migrate API
1. **Create custom migration module**: `pl_work_log`
2. **Migration source plugin**: SQLite database source
3. **Migration mapping**: Map SQLite fields to Drupal fields
4. **Migration process**:
   - Read from `hermes_logs.db`
   - Transform data as needed
   - Create/update work log nodes
   - Handle duplicates (use event_id as unique key)

#### Alternative: Drush Script
- Simple PHP script to read SQLite and create nodes
- Faster to implement for one-time import
- Less robust for ongoing syncs

**Decision**: Use Migrate API for flexibility and ongoing sync capability

#### Testing Phase 2 (Three-Tier Verification)

**Tier 1 - Headless (1-5s):**
- Check migration status: `ddev drush migrate:status work_log_import`
- Verify node count: `ddev drush sqlq "SELECT COUNT(*) FROM node WHERE type='work_log'"`
- Confirm migration ran: `ddev drush migrate:messages work_log_import`

**Tier 2 - Structural Skeleton (5-10s):**
- Query migrated nodes via Drush: `ddev drush entity:query node --bundle=work_log`
- Use accessibility tree to verify a migrated node:
  - [ ] Title field populated correctly
  - [ ] Date field shows correct format
  - [ ] Hours field displays as number
  - [ ] Project ID and Category fields present
  - [ ] Event ID preserved for sync
- Test duplicate handling: Re-run migration, verify no duplicates created
- Test rollback: `ddev drush migrate:rollback work_log_import`

**Tier 3 - Visual Fidelity (60-90s):**
- Screenshot migrated work log node display
- Verify field formatting and layout
- Compare SQLite data vs rendered output
- Test edge cases (special characters, empty fields)

### Phase 3: Display & Reporting
**Goal**: Create useful views and reports of work log data

#### Views to Create
1. **Work Log List**:
   - Table view with date, title, hours
   - Filters: date range, project
   - Exposed filters for users

2. **Weekly Summary**:
   - Grouped by week
   - Total hours per week
   - Breakdown by project

3. **Monthly Report**:
   - Calendar view or table
   - Total hours per month
   - Charts/graphs (using Charts module)

4. **Project Breakdown**:
   - Group by project/client
   - Total hours per project
   - Date range filters

#### Dashboard
- Create a work log dashboard page
- Embed multiple views
- Add summary statistics (total hours, avg per day, etc.)

#### Testing Phase 3 (Three-Tier Verification)

**Tier 1 - Headless (1-5s):**
- Verify view exists: `ddev drush views:list | grep work_log`
- Check view output via curl: `ddev exec "curl -sk http://localhost/work-logs | grep '<table'"`
- Validate dashboard route: `ddev exec "curl -sk -o /dev/null -w '%{http_code}' http://localhost/work-log-dashboard"`

**Tier 2 - Structural Skeleton (5-10s):**
- Use accessibility tree to verify Work Log List view:
  - [ ] Table has proper headers (Date, Title, Hours, Project, Category)
  - [ ] Exposed filters present (date range, project dropdown)
  - [ ] Pagination controls visible
  - [ ] Sort links on column headers
- Verify Dashboard page structure:
  - [ ] Summary statistics cards present
  - [ ] Multiple view blocks embedded
  - [ ] Navigation links functional
- Test filter functionality: Apply filter, verify results update

**Tier 3 - Visual Fidelity (60-90s):**
- Screenshot all views (list, weekly, monthly, project breakdown)
- Verify table styling and alignment
- Test responsive breakpoints (desktop, tablet, mobile)
- Validate chart rendering (if using Charts module)
- Check color scheme matches site theme

### Phase 4: Ongoing Sync
**Goal**: Keep Drupal in sync with Hermes data

#### Options
1. **Manual Import**: Run migration on demand via Drush
2. **Scheduled Import**: Cron job to run migration periodically
3. **API Integration**: Hermes pushes updates to Drupal via REST API
4. **Webhook**: Hermes triggers Drupal import on data changes

**Decision**: Manual import only. Run `ddev drush migrate:import work_log_import` as needed. No cron job.

#### Testing Phase 4 (Three-Tier Verification)

**Tier 1 - Headless (1-5s):**
- Test manual migration: `ddev drush migrate:import work_log_import`
- Check cron status: `ddev drush core:cron`
- Verify migration ran: `ddev drush migrate:status work_log_import`
- Check for errors: `ddev drush watchdog:show --type=migrate`

**Tier 2 - Structural Skeleton (5-10s):**
- Add new entry to SQLite, run sync, verify node created
- Update existing entry in SQLite, run sync, verify node updated (not duplicated)
- Use accessibility tree to confirm synced data:
  - [ ] New nodes appear in work log list
  - [ ] Updated nodes show new values
  - [ ] No duplicate entries for same event_id
- Test error handling: Corrupt SQLite file, verify graceful failure

**Tier 3 - Visual Fidelity (60-90s):**
- Screenshot before/after sync to verify changes
- Monitor sync performance with larger datasets
- Verify logging output is readable and useful

### Phase 5: Future Enhancements
- **Time Tracking UI**: Allow manual entry of work logs in Drupal
- **Client Portal**: Show work logs to clients (filtered by project)
- **Invoicing Integration**: Link work logs to invoices
- **Analytics**: Deeper insights into time allocation
- **Mobile App**: React Native app to log time on the go

## Technical Requirements

### Drupal Modules Needed
- **Core**: Node, Field, Views, Datetime
- **Contrib**:
  - `migrate_plus` - Enhanced migration tools
  - `migrate_tools` - Drush commands for migrations
  - `migrate_source_csv` or custom SQLite source plugin
  - `charts` (optional) - For visualizations
  - `views_aggregator` (optional) - For summary calculations

### Development Tasks
1. Create `pl_work_log` custom module
2. Define Work Log content type (via config or UI)
3. Create migration configuration
4. Build SQLite source plugin (if needed)
5. Create Views for display
6. Build dashboard page
7. Write documentation
8. Create Drush commands for import

## Timeline Estimate
- **Phase 1** (Content Type): 2-3 hours + 1 hour testing
- **Phase 2** (Migration): 4-6 hours + 2 hours testing
- **Phase 3** (Views/Reports): 3-4 hours + 1.5 hours testing
- **Phase 4** (Sync Setup): 1-2 hours + 1 hour testing
- **Documentation**: 1-2 hours
- **Final Integration Testing**: 1-2 hours

**Total**: 16.5-23.5 hours

## Questions to Resolve
1. ~~**Category Strategy**~~ ✅ RESOLVED: Added `project_id` and `category` fields to SQLite schema
2. ~~**Visibility**~~ ✅ RESOLVED: Private — accessible only to authenticated (logged-in) users
3. ~~**Editing imported logs**~~ ✅ RESOLVED: Not yet — imported logs are read-only for now
4. ~~**Permissions model**~~ ✅ RESOLVED: Admin-only — anyone with an admin account can access
5. ~~**Preserve Google Calendar event ID**~~ ✅ RESOLVED: Yes, for sync
6. ~~**Single vs multi-user**~~ ✅ RESOLVED: Single user
7. ~~**Categories format**~~ ✅ RESOLVED: Taxonomy vocabulary (not free-form text)
8. ~~**Separate Projects entity**~~ ✅ RESOLVED: Yes — create a Projects taxonomy vocabulary

## Phase 6: Hermes REST API Integration ✅ IMPLEMENTED

**Goal**: Replace the committed SQLite file with a live REST API on Hermes (Spiderman), secured with a bearer token. The existing Migrate API pipeline stays intact — only the data source changes.

**Status**: Fully implemented and tested on 2026-04-19.

### Architecture

```
┌─────────────────────────┐       HTTP + Bearer Token            ┌──────────────────────────┐
│  Drupal (Pantheon/DDEV) │  ──  GET /api/work-logs?since=...  → │  Hermes (Spiderman)      │
│                         │  ←  JSON response ───────────────── │  Python stdlib + SQLite  │
│  HermesApiWorkLog       │                                      │  /opt/data/logs.db       │
│  (source plugin)        │                                      │  Port 8090               │
└─────────────────────────┘                                      └──────────────────────────┘
```

**Approach implemented**: New HTTP source plugin (`HermesApiWorkLog`) extending `SourcePluginBase`. Fetches JSON from Hermes API, yields rows to Migrate API. Single-step: `drush migrate:import work_log_api_import` calls the API directly.

---

### 6.1 Hermes Side (Spiderman) ✅

#### What Was Built

- **`work_log_api.py`** — Zero-dependency Python API server using only stdlib (`http.server`, `sqlite3`, `json`)
- **`hermes-entrypoint-wrapper.sh`** — Starts the API as a background process, then execs the main Hermes command
- Deployed to `/opt/data/scripts/` inside the `hermes-personal-manager-1` container
- Port 8090 exposed in `compose.yaml`, reachable via Tailscale

#### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/work-logs` | Bearer token | Return all work logs (JSON) |
| `GET` | `/api/work-logs?since=<ISO-8601>` | Bearer token | Logs ingested after timestamp |
| `GET` | `/api/health` | None | Health check with DB row count |

#### Infrastructure Details

| Item | Value |
|------|-------|
| Host | `spiderman.tail26a498.ts.net` (Tailscale) |
| Container | `hermes-personal-manager-1` |
| Port | 8090 (mapped 8090:8090) |
| DB path | `/opt/data/logs.db` → `work_logs` table |
| Script | `/opt/data/scripts/work_log_api.py` |
| Entrypoint | `/opt/data/scripts/hermes-entrypoint-wrapper.sh` |
| Compose file | `/opt/stacks/hermes/compose.yaml` |
| Env file | `/opt/stacks/hermes/.env` (`WORK_LOG_API_TOKEN`, `WORK_LOG_API_PORT`) |
| Config repo | [Performant-Labs/hermes-config](https://github.com/Performant-Labs/hermes-config) (private) |

#### Authentication

- **Mechanism**: Bearer token in `Authorization` header
- **Token**: 256-bit random (`openssl rand -hex 32`), stored in `WORK_LOG_API_TOKEN` env var
- **Rejection**: Returns `401 Unauthorized` with JSON error body
- **Audit logging**: Timestamp + IP logged for every request

#### Backups

- **Cron**: Every 6 hours via root crontab
- **Method**: Python `sqlite3.backup()` for crash-safe copies of `logs.db`, `state.db`, `response_store.db`
- **Location**: `/opt/hermes-backups/<date>/`
- **Retention**: 30 days

#### Hermes Tasks
1. [x] Implement zero-dependency Python API server (`work_log_api.py`)
2. [x] Implement bearer token authentication
3. [x] Implement `GET /api/work-logs` with optional `since` param
4. [x] Implement `GET /api/health`
5. [x] Set `WORK_LOG_API_TOKEN` env var in compose `.env`
6. [x] Expose port 8090 in `compose.yaml`
7. [x] Create entrypoint wrapper for auto-start on container restart
8. [x] Test from host and remotely via Tailscale
9. [x] Create private config repo (Performant-Labs/hermes-config)
10. [x] Set up automated SQLite backups (cron, 6h, 30-day retention)

---

### 6.2 Drupal Side ✅

#### Token Storage

- **Local (DDEV)**: `.ddev/config.yaml` web_environment
  ```yaml
  web_environment:
    - HERMES_API_URL=http://spiderman.tail26a498.ts.net:8090/api/work-logs
    - HERMES_API_TOKEN=<token>
  ```

- **Production (Pantheon)**: Pantheon environment variables (not yet configured)

- Fallback order: migration YAML config → `Settings::get()` → `getenv()`

#### Files Created

| File | Purpose |
|------|---------|
| `src/Plugin/migrate/source/HermesApiWorkLog.php` | Migrate source plugin; fetches from Hermes API via Guzzle with bearer token |
| `migrations/work_log_api_import.yml` | API migration config; identical process/destination to SQLite migration |

#### Drupal Tasks
1. [x] Create `HermesApiWorkLog.php` source plugin
2. [x] Create `work_log_api_import.yml` migration config
3. [x] Add `HERMES_API_URL` and `HERMES_API_TOKEN` env vars to DDEV config
4. [ ] Add same env vars to Pantheon (when deploying to production)
5. [x] Update BRIEF.md with new plugin docs
6. [x] Test API migration against real Hermes API — 6 items imported, idempotent re-run confirmed

---

### 6.3 Security Checklist

- [x] Token is ≥ 256 bits entropy (`openssl rand -hex 32`)
- [x] Token stored only in environment variables (never in code or config YAML)
- [ ] Hermes API served over HTTPS (TLS) — currently HTTP over Tailscale (encrypted tunnel)
- [x] Hermes rejects requests without valid bearer token (401)
- [ ] Consider IP allowlisting on Spiderman's firewall (Pantheon outbound IPs are documented)
- [ ] Token rotation plan: regenerate token, update both Hermes env and Drupal env, run a test import
- [ ] Rate limiting on Hermes (optional but recommended)
- [x] Audit log on Hermes: log timestamp + IP of each API call

---

### 6.4 Test Results (2026-04-19)

| Test | Result |
|------|--------|
| Health check (no auth) | ✅ `GET /api/health` returns status + row count |
| Missing auth header | ✅ Returns 401 with error message |
| Invalid token | ✅ Returns 401 with error message |
| Valid token — all logs | ✅ Returns 6 work logs with correct schema |
| `since` filter | ✅ Filters by `ingested_at` correctly |
| Mac → Spiderman via Tailscale | ✅ Reachable at `spiderman.tail26a498.ts.net:8090` |
| DDEV → Spiderman | ✅ Works with full Tailscale FQDN |
| `drush migrate:status` | ✅ Both migrations visible (SQLite + API) |
| `drush migrate:import work_log_api_import` | ✅ 6 created, 0 failed |
| Idempotent re-run | ✅ 0 created, 0 duplicates |

---

### 6.5 Remaining Steps

| Step | Status |
|------|--------|
| ~~Implement & deploy Hermes API on Spiderman~~ | ✅ Done |
| ~~Generate token, set env vars on both sides~~ | ✅ Done |
| ~~Create `HermesApiWorkLog` plugin + migration config~~ | ✅ Done |
| ~~Test against real Hermes API~~ | ✅ Done |
| Deploy Drupal changes to Pantheon | Pending |
| Set Pantheon env vars (`HERMES_API_URL`, `HERMES_API_TOKEN`) | Pending |
| Run `drush migrate:import work_log_api_import` on Pantheon | Pending |
| (Optional) Remove `data/hermes_logs.db` from repo once API is stable | Pending |

## Next Steps
1. ~~Create the Work Log content type~~ ✅ Done
2. ~~Set up the custom module structure~~ ✅ Done
3. ~~Implement the SQLite migration~~ ✅ Done
4. ~~Build the views~~ ✅ Done
5. ~~Implement Hermes REST API on Spiderman~~ ✅ Done
6. ~~Create Drupal API source plugin~~ ✅ Done
7. ~~Test end-to-end with real Hermes data~~ ✅ Done
8. Deploy to Pantheon and configure production env vars
9. Rollback SQLite migration, switch to API migration in production
