# Plan: One GitHub Issue per Failed Playwright Test with Deduplication

## Current State
- `.github/workflows/test-against-pantheon.yml` creates **one issue for all failures** (lines 241‑277).
- `tests/support/create-failure-issues.js` already implements **per‑test issue creation** with deduplication, but isn't used.
- `.github/workflows/test-against-tugboat.yml` currently has no issue creation step.

## How Deduplication Works (Already Implemented)
The existing script `tests/support/create-failure-issues.js`:

1. Extracts test ID (e.g., `ATK-PW-1050`) from the test name.
2. Searches for open issues with title `FIX: <TEST-ID>`.
3. If found → adds a comment to the existing issue (status: “No change”).
4. If not found → creates a new issue (status: “New”).
5. Posts a single Slack summary of all failures per run.

## Implementation Steps

### 1. Update Pantheon Workflow
Replace inline issue creation in `test-against-pantheon.yml` with:

```yaml
- name: Create/update failure issues per test
  if: ${{ needs.Test-on-Pantheon.result == 'failure' }}
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    FAILURE_ASSIGNEES: 'Copilot'
    FAILURE_LABELS: 'bug,playwright,pantheon,ci,auto-heal'
  run: |
    node tests/support/create-failure-issues.js
```

Remove the existing `Create an issue on failure` and `Assign the issue to Copilot` steps (lines 241‑292).

### 2. Update Tugboat Workflow
Add the same step to `test-against-tugboat.yml` after the Slack/email steps:

```yaml
- name: Create/update failure issues per test
  if: ${{ needs.Test-on-Preview.result == 'failure' }}
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    FAILURE_ASSIGNEES: 'Copilot'
    FAILURE_LABELS: 'bug,playwright,pantheon,ci,auto-heal'
  run: |
    node tests/support/create-failure-issues.js
```

### 3. Ensure Environment Variables
Both workflows already set:
- `JOB_NAME`, `JOB_NUMBER`, `JOB_URL`, `JOB_BRANCH`, `JOB_ENV` in the `Merge‑Blob‑Reports`/`Test‑Teardown` jobs.
- `SLACK_ENABLED` / `SLACK_WEBHOOK_URL` (optional, for Slack summary).

### 4. Test the Change
Run the existing unit test to verify deduplication logic:
```bash
node --test tests/support/create-failure-issues.test.js
```

## Expected Outcome
- Each failed Playwright test gets its own GitHub issue.
- Issues are labeled `auto-heal` and assigned to `Copilot` for automatic healing.
- Repeated failures of the same test will only add a comment to the existing issue (no duplicates).
- A single Slack message per run summarizes all failures and issue statuses.
- The existing `Tests-Healer` agent can then create separate PRs for each fixed test.

## Files to Modify
- `.github/workflows/test-against-pantheon.yml`
- `.github/workflows/test-against-tugboat.yml`

## Notes
- The script reads the CTRF report (`ctrf/ctrf-report.json`) generated during `Merge‑Blob‑Reports`.
- No changes needed to `tests/support/create-failure-issues.js` – it already implements the desired behavior.
- The archived workflow `.github/workflows/copilot-trigger-by-label.yml` shows the original intent to trigger agents on `auto-heal` label; this plan assumes Copilot monitors assigned issues automatically.

---
*Plan created on 2025‑01‑19*