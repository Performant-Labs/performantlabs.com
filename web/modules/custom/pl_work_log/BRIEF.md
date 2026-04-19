# pl_work_log Module — Implementation Brief

## Purpose
Imports work log time-tracking data from an external SQLite database (`hermes_logs.db`) into Drupal, and provides views, a dashboard, and admin tools to manage it.

## Architecture

### Data Flow
```
hermes_logs.db (SQLite) → Drupal Migrate API → work_log nodes (Drupal DB)
```

The Migrate API was chosen over direct SQLite reads so that data lives natively in Drupal's entity system — enabling Views, caching, search indexing, and access control without custom query layers.

### Module Location
`web/modules/custom/pl_work_log/`

### Key Files
| File | Purpose |
|---|---|
| `pl_work_log.info.yml` | Module definition; depends on migrate, migrate_plus, migrate_tools |
| `pl_work_log.install` | `hook_schema()` for category rules table, `hook_install()` seeds taxonomy terms + default rules, `hook_uninstall()` cleans up nodes/terms, `update_10001` creates rules table on existing installs |
| `pl_work_log.module` | Registers the SQLite DB connection dynamically via `Database::addConnectionInfo()` |
| `pl_work_log.routing.yml` | Routes: dashboard, actions (ingest/rollback/category-mapping) |
| `pl_work_log.links.menu.yml` | Sidebar menu links (Dashboard, All Work Logs, By Project, Actions) |
| `config/install/*.yml` | Content type `work_log`, 6 fields, 2 taxonomy vocabularies, custom menu, sidebar block placement — all with enforced module dependencies for clean uninstall |
| `config/optional/views.view.work_log_list.yml` | Table view at `/work-logs` with exposed project/category filters, sortable columns, pagination |
| `config/optional/views.view.work_log_by_project.yml` | View at `/work-logs/by-project` grouped by project |
| `migrations/work_log_import.yml` | Migration config: source → process → destination mapping, `track_changes: true` for idempotent re-runs |
| `data/hermes_logs.db` | The SQLite source database (committed to repo) |

### Custom Plugins
| Class | Type | What it does |
|---|---|---|
| `src/Plugin/migrate/source/HermesWorkLog.php` | Migrate Source | Queries `work_logs` table from `hermes_sqlite` DB connection |
| `src/Plugin/migrate/process/TermByMachineName.php` | Migrate Process | Maps machine names → taxonomy term IDs (used for projects) |
| `src/Plugin/migrate/process/CategoryAutoMap.php` | Migrate Process | Rule-based category assignment; reads rules from `pl_work_log_category_rules` DB table, falls back to config for override/fallback settings |

### Controllers & Forms
| Class | Route | What it does |
|---|---|---|
| `DashboardController` | `/work-log-dashboard` | Summary stats (week/month/total hours with date ranges), embeds recent logs + project breakdown view blocks |
| `ActionsController` | `/work-logs/actions` | Migration status + links to ingest/rollback/mapping |
| `IngestForm` | `/work-logs/actions/ingest` | Confirmation form that runs `MigrateExecutable::import()` |
| `RollbackForm` | `/work-logs/actions/rollback` | Confirmation form that runs `MigrateExecutable::rollback()` |
| `CategoryRulesForm` | `/work-logs/actions/category-mapping` | Draggable table for CRUD on category mapping rules |

## Database Table: `pl_work_log_category_rules`
Columns: `id` (serial PK), `label`, `field_name` (title|project_id), `match_type` (contains|exact|regex), `pattern`, `category` (machine name), `weight` (sort order). Rules are evaluated in weight order; first match wins.

## Content Type: `work_log`
Fields: `field_work_log_date` (date), `field_work_log_hours` (decimal), `field_work_log_project` (taxonomy ref → projects), `field_work_log_category` (taxonomy ref → work_log_categories), `field_work_log_event_id` (string), `field_work_log_ingested_at` (datetime).

## Key Design Decisions
- **Migration over direct read**: Data lives in Drupal entities, works with Views/caching/permissions natively.
- **Idempotent import**: Map table + `track_changes` means re-running import creates no duplicates; changed source rows update in place.
- **Enforced dependencies**: All config YAML has `dependencies.enforced.module: pl_work_log` so uninstalling the module removes everything cleanly.
- **Machine names in term descriptions**: Taxonomy terms store their machine name in the description field for reliable migration mapping.
- **DB-backed rules over config**: Category mapping rules use a custom schema table for UI editability; override/fallback settings remain in simple config.
- **Sidebar menu scoped to work log pages**: Block visibility restricts the Work Log menu to `/work-log-dashboard` and `/work-logs/*` only.
- **No cron**: Import is manual only (`ddev drush migrate:import work_log_import` or via the UI ingest form).

## Drush Commands
```bash
ddev drush migrate:import work_log_import   # Import/sync
ddev drush migrate:rollback work_log_import # Remove all imported nodes
ddev drush migrate:status work_log_import   # Check status
```
