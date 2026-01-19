# Plan: Environment-Aware LLM Selection for Test Healing

## Goal
Modify the test failure healing system to:
1. Detect when running on GitHub-hosted vs self‑hosted (local) runners.
2. Use a cloud LLM (Claude Sonnet) on GitHub‑hosted runners.
3. Use a local LLM (e.g., Ollama, LM Studio) on self‑hosted runners.
4. Maintain the same per‑test issue creation and deduplication.

## Current Architecture
- Workflows create GitHub issues labeled `auto‑heal` and assign them to `Copilot`.
- The external Copilot service (opencode.ai) runs the `Tests‑Healer` agent.
- The agent uses the model configured in the user’s opencode setup (default: Claude Sonnet).

## Detection Mechanism
GitHub Actions provides these environment variables:
- `GITHUB_ACTIONS`: `"true"` on any GitHub Actions runner (including act).
- `RUNNER_ENVIRONMENT`: `"github‑hosted"` or `"self‑hosted"`.
- `CI`: `"true"` on any CI environment.

**act-specific variables:**
- `ACT`: `"true"` when running under [nektos/act](https://github.com/nektos/act).
- `GITHUB_ACTOR`: Often set to `nektos/act` or a custom name.

We’ll add a custom variable `USE_LOCAL_LLM` that can be set manually for local runs. The detection logic will treat **act runs** as local unless explicitly overridden.

## Implementation Steps

### 1. Add Environment Detection to Workflows
In both `test‑against‑pantheon.yml` and `test‑against‑tugboat.yml`, add a step that sets a job output:

```yaml
- name: Determine LLM environment
  id: llm-env
  run: |
    # Detect act (local GitHub Actions simulator)
    if [[ "${{ env.ACT }}" == "true" || "${{ env.GITHUB_ACTOR }}" == "nektos/act"* ]]; then
      echo "llm_mode=local" >> $GITHUB_OUTPUT
    # Self-hosted runner or manual override
    elif [[ "${{ env.RUNNER_ENVIRONMENT }}" == "self-hosted" || "${{ env.USE_LOCAL_LLM }}" == "true" ]]; then
      echo "llm_mode=local" >> $GITHUB_OUTPUT
    # Default to cloud (GitHub-hosted runner)
    else
      echo "llm_mode=cloud" >> $GITHUB_OUTPUT
    fi
```

### 2. Create a Dynamic OpenCode Configuration Script
Create `scripts/setup‑opencode‑config.js` that writes `.opencode/config.json` based on `llm_mode`:

```javascript
import { writeFileSync } from 'fs';
import { join } from 'path';

const mode = process.env.LLM_MODE || 'cloud';
const config = {
  version: '1',
  model: mode === 'local' 
    ? { provider: 'ollama', model: 'codellama:latest' }  // example
    : { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' }
};

writeFileSync(
  join(process.cwd(), '.opencode', 'config.json'),
  JSON.stringify(config, null, 2)
);
```

### 3. Modify the Issue Assignment Step
Replace the current `Assign the issue to Copilot` step with a conditional block:

```yaml
- name: Handle test healing
  if: ${{ always() && steps.create_issue.outputs.issue_number }}
  env:
    LLM_MODE: ${{ steps.llm-env.outputs.llm_mode }}
  run: |
    # Setup OpenCode configuration
    node scripts/setup-opencode-config.js
    
    if [[ "$LLM_MODE" == "cloud" ]]; then
      # Use the existing Copilot assignment action
      # (keep the current external action)
      echo "Using cloud LLM via Copilot assignment"
    else
      # Run local healing script
      echo "Using local LLM for test healing"
      node scripts/local-test-healer.js \
        --issue ${{ steps.create_issue.outputs.issue_number }} \
        --report-path ctrf/ctrf-report.json
    fi
```

### 4. Create Local Test Healer Script
Create `scripts/local‑test‑healer.js` that:
- Reads the CTRF report to identify failed tests.
- For each failed test, uses the opencode CLI with the local model configuration to:
  - Analyze the test failure.
  - Apply fixes (editing test files).
  - Create a new branch and pull request (as instructed in `tests‑healer.agent.md`).

This script essentially replicates what the external Copilot service would do, but locally.

### 5. Update Agent Instructions (Optional)
Add a note to `.github/agents/tests‑healer.agent.md` that the agent should respect the `LLM_MODE` environment variable if present, though the actual model selection is handled by the opencode configuration.

### 6. Local Development Setup
Add a `Makefile` target or `package.json` script to run the healing pipeline locally:

```json
"scripts": {
  "heal-local": "USE_LOCAL_LLM=true node scripts/local-test-healer.js"
}
```

## Files to Create/Modify
- `.github/workflows/test‑against‑pantheon.yml`
- `.github/workflows/test‑against‑tugboat.yml`
- `scripts/setup‑opencode‑config.js`
- `scripts/local‑test‑healer.js`
- `.github/agents/tests‑healer.agent.md` (optional note)
- `package.json` (optional script)

## Testing the Change
1. **GitHub‑hosted runner**: Run the workflow normally; verify that issues are still assigned to Copilot (cloud LLM).
2. **Self‑hosted runner**: Set up a local runner with Ollama/LM Studio, run the workflow, and verify that the local script is invoked and creates PRs.
3. **act local simulator**: Run the workflow with `act`; verify that detection works and local LLM path is used.
4. **Manual local run**: Use `npm run heal‑local` to trigger healing for an existing issue.

## Considerations
- **Local LLM availability**: The local machine must have a compatible LLM installed and accessible.
- **Performance**: Local LLMs may be slower; consider timeouts.
- **Fallback**: If local LLM fails, the script could fall back to cloud mode.
- **Security**: Local LLMs keep code private; cloud LLMs send code to external providers.
- **Issue creation in act**: When running under `act`, GitHub API calls may fail or create real issues. Consider adding a `DRY_RUN` mode that skips issue creation and PR submission, logging actions instead.

## Alternative Approach
Instead of modifying workflows, configure opencode globally to use local models when running on self‑hosted runners via its own configuration system. This plan keeps the logic within the repository.

---
*Plan created on 2025‑01‑19*