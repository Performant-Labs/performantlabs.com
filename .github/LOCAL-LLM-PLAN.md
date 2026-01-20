# Plan: Environment-Aware LLM Selection for Test Healing

## Goal
Modify the test failure healing system to:
1. Detect when running on GitHub-hosted vs self‑hosted (local) runners.
2. Use a cloud LLM (Claude Sonnet) on GitHub‑hosted runners with external Copilot service.
3. Use a local LLM (e.g., Ollama, LM Studio) on self‑hosted runners with direct local healing.
4. **Cloud mode**: Create GitHub issues for failed tests → external Copilot handles healing.
5. **Local mode**: Run local healing directly (no GitHub issues) → local LLM analyzes and fixes tests.

## Current Architecture
- Workflows create GitHub issues labeled `auto‑heal` and assign them to `Copilot`.
- The external Copilot service (opencode.ai) runs the `Tests‑Healer` agent.
- The agent uses the model configured in the user's opencode setup (default: Claude Sonnet).

## Detection Mechanism
GitHub Actions provides these environment variables:
- `GITHUB_ACTIONS`: `"true"` on any GitHub Actions runner (including act).
- `RUNNER_ENVIRONMENT`: `"github‑hosted"` or `"self‑hosted"`.
- `CI`: `"true"` on any CI environment.

**act-specific variables:**
- `ACT`: `"true"` when running under [nektos/act](https://github.com/nektos/act).
- `GITHUB_ACTOR`: Often set to `nektos/act` or a custom name.

We'll add custom variables:
- `USE_LOCAL_LLM`: Manual override for local LLM mode (true=force local, false=force cloud)
- `CREATE_ISSUES_LOCAL`: Optional flag to create real GitHub issues in local mode (default: false)

## Implementation Phases

### Phase 1: Environment Detection and Mode Selection
**Goal**: Detect environment reliably and select appropriate healing path.

1. **Enhanced environment detection script**:
   - Detect act runs (ACT=true, GITHUB_ACTOR=nektos/act*)
   - Detect self-hosted runners (RUNNER_ENVIRONMENT=self-hosted)
   - Set LLM_MODE (cloud/local) based on environment and USE_LOCAL_LLM override
   - Optionally check CREATE_ISSUES_LOCAL flag for local mode with issue creation

2. **Update workflow files**:
   - Add environment detection step to both Pantheon and Tugboat workflows
   - Pass detection outputs to subsequent steps

3. **Create basic logging utility**:
   - Structured JSON logging for local operations
   - Log level control via environment variables

### Phase 2: Local LLM Integration and Health Checks
**Goal**: Ensure local LLM is available and healthy before attempting to use it.

1. **Local LLM health check script**:
   - Test Ollama API endpoint (http://localhost:11434)
   - Test OpenAI-compatible endpoints (LM Studio, etc.)
   - Validate model availability
   - Return health status and capabilities

2. **Fallback mechanism**:
   - If local LLM unavailable → log warning → fallback to cloud mode
   - If local LLM times out → retry with longer timeout → fallback

3. **Model configuration**:
   - Configurable local model names (default: codellama:latest)
   - Support for multiple LLM providers (Ollama, LM Studio, LocalAI)

### Phase 3: OpenCode CLI Integration
**Goal**: Integrate with OpenCode CLI for local test healing.

1. **OpenCode CLI validation**:
   - Check if `opencode` command is available
   - Validate OpenCode version compatibility
   - Setup `.opencode/config.json` dynamically

2. **Dynamic OpenCode configuration**:
   - Write config based on LLM_MODE and available local models
   - Support both cloud (Anthropic Claude) and local providers
   - Cache configuration to avoid repeated writes

3. **OpenCode CLI wrapper**:
   - Abstract OpenCode CLI calls for consistent error handling
   - Add timeouts and retry logic
   - Capture and parse OpenCode output

### Phase 4: Local Test Healer Script with Error Handling
**Goal**: Create robust local healing script with comprehensive error handling.

1. **Core healing logic**:
   - Read CTRF report to identify failed tests
   - Extract test IDs and failure details
   - For each failed test, use OpenCode to analyze and fix
   - Follow `tests‑healer.agent.md` instructions

2. **Error handling**:
   - Structured error types (LLM error, OpenCode error, Git error, API error)
   - Retry logic with exponential backoff
   - Graceful degradation when components fail

3. **Issue creation control**:
   - Use `shouldCreateIssues` from detection to decide GitHub API calls
   - Local mode: Skip issue creation by default (CREATE_ISSUES_LOCAL=false)
   - Cloud mode: Always create issues for failed tests
   - Log actions for transparency

4. **Integration with per-test issue creation**:
   - Coordinate with `create-failure-issues.js` script
   - Handle multiple failed tests in single run
   - Create separate PRs for distinct test failures

### Phase 5: Testing, Documentation, and Polish
**Goal**: Ensure solution works reliably and is well-documented.

1. **Testing strategy**:
   - GitHub-hosted runner: verify cloud LLM path still works
   - Self-hosted runner: test local LLM integration
    - act simulator: test environment detection and local healing path
   - Manual local run: test `npm run heal-local` script

2. **Documentation**:
   - Local setup guide (Ollama installation, model downloads)
   - OpenCode CLI installation instructions
   - Configuration options reference
   - Troubleshooting guide

3. **Package.json integration**:
   - Add `heal-local` script
   - Add `check-llm-health` script
   - Add `setup-opencode-config` script

## Detailed Implementation

### Phase 1: Environment Detection Script (`scripts/detect-environment.js`)
```javascript
export function detectEnvironment() {
  const env = {
    isCI: process.env.CI === 'true',
    isGitHubActions: process.env.GITHUB_ACTIONS === 'true',
    runnerEnv: process.env.RUNNER_ENVIRONMENT || 'github-hosted',
    isAct: process.env.ACT === 'true',
    githubActor: process.env.GITHUB_ACTOR || '',
    hasGitHubToken: !!process.env.GITHUB_TOKEN,
    useLocalLLM: process.env.USE_LOCAL_LLM === 'true',
    createIssuesLocal: process.env.CREATE_ISSUES_LOCAL === 'true'
  };

  // Determine LLM mode (and thus healing path)
  let llmMode = 'cloud';
  if (env.useLocalLLM || env.runnerEnv === 'self-hosted' || 
      env.isAct || env.githubActor.startsWith('nektos/act')) {
    llmMode = 'local';
  }

  // Determine if we should create GitHub issues
  // Cloud mode always creates issues, local mode only if CREATE_ISSUES_LOCAL=true
  const shouldCreateIssues = llmMode === 'cloud' || 
                           (llmMode === 'local' && env.createIssuesLocal);

  return { 
    llmMode, 
    shouldCreateIssues,
    env 
  };
}
```

### Phase 1: Updated Workflow Step
```yaml
- name: Determine LLM environment and mode
  id: detect-env
  run: |
    node scripts/detect-environment.js > env-output.json
    LLM_MODE=$(jq -r '.llmMode' env-output.json)
    CREATE_ISSUES=$(jq -r '.shouldCreateIssues' env-output.json)
    echo "llm_mode=$LLM_MODE" >> $GITHUB_OUTPUT
    echo "create_issues=$CREATE_ISSUES" >> $GITHUB_OUTPUT
    echo "Detected: LLM_MODE=$LLM_MODE, CREATE_ISSUES=$CREATE_ISSUES"
```

### Phase 2: LLM Health Check (`scripts/check-llm-health.js`)
```javascript
export async function checkLocalLLMHealth(options = {}) {
  const { timeout = 10000, model = 'codellama:latest' } = options;
  
  const endpoints = [
    { url: 'http://localhost:11434/api/generate', type: 'ollama' },
    { url: 'http://localhost:1234/v1/chat/completions', type: 'openai' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          model,
          prompt: 'test',
          stream: false,
          max_tokens: 1
        }),
        signal: AbortSignal.timeout(timeout)
      });
      
      if (response.ok) {
        return { 
          healthy: true, 
          provider: endpoint.type,
          endpoint: endpoint.url 
        };
      }
    } catch (error) {
      continue; // Try next endpoint
    }
  }
  
  return { healthy: false, error: 'No local LLM endpoint responding' };
}
```

### Phase 3: OpenCode Configuration (`scripts/setup-opencode-config.js`)
```javascript
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export function setupOpenCodeConfig(llmMode, localProvider = 'ollama', localModel = 'codellama:latest') {
  const configDir = join(process.cwd(), '.opencode');
  
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  const config = {
    version: '1',
    model: llmMode === 'local' 
      ? { 
          provider: localProvider, 
          model: localModel,
          options: { temperature: 0.1, maxTokens: 4000 }
        }
      : { 
          provider: 'anthropic', 
          model: 'claude-3-5-sonnet-20241022',
          options: { temperature: 0.1, maxTokens: 4000 }
        }
  };

  writeFileSync(
    join(configDir, 'config.json'),
    JSON.stringify(config, null, 2)
  );

  return config;
}
```

### Phase 4: Local Test Healer Entry Point
```javascript
// scripts/local-test-healer.js
import { detectEnvironment } from './detect-environment.js';
import { checkLocalLLMHealth } from './check-llm-health.js';
import { setupOpenCodeConfig } from './setup-opencode-config.js';
import { Logger } from './logger.js';

async function main() {
  const logger = new Logger({ level: process.env.LOG_LEVEL || 'info' });
  const { llmMode, shouldCreateIssues, env } = detectEnvironment();
  
  logger.info(`Starting test healer: LLM_MODE=${llmMode}, CREATE_ISSUES=${shouldCreateIssues}`);
  logger.debug('Environment:', env);
  
  // Health check for local LLM
  let effectiveLLMMode = llmMode;
  if (llmMode === 'local') {
    const health = await checkLocalLLMHealth();
    if (!health.healthy) {
      logger.warn('Local LLM not available, cannot fall back to cloud mode locally');
      logger.error('Local LLM required for local healing mode. Exiting.');
      process.exit(1);
    }
  }
  
  // Setup OpenCode configuration
  const config = setupOpenCodeConfig(effectiveLLMMode);
  logger.info(`OpenCode configured for: ${config.model.provider}/${config.model.model}`);
  
  // Determine healing path based on mode
  if (effectiveLLMMode === 'local') {
    logger.info('Running local healing path (no GitHub issues by default)');
    // Local healing logic here...
  } else {
    logger.info('Running cloud healing path (GitHub issues + external Copilot)');
    // Cloud path: issues should already be created by workflow
  }
}
```

## Files to Create/Modify

### Phase 1
- `scripts/detect-environment.js` - Enhanced environment detection
- `scripts/logger.js` - Structured logging utility
- `.github/workflows/test‑against‑pantheon.yml` - Add detection step
- `.github/workflows/test‑against‑tugboat.yml` - Add detection step

### Phase 2  
- `scripts/check-llm-health.js` - LLM health checks
- `scripts/llm-fallback.js` - Fallback mechanism

### Phase 3
- `scripts/setup-opencode-config.js` - Dynamic OpenCode config
- `scripts/opencode-wrapper.js` - OpenCode CLI abstraction

### Phase 4
- `scripts/local-test-healer.js` - Main healing logic
- `scripts/healing-core.js` - Core healing algorithms
- `scripts/error-handler.js` - Error handling utilities

### Phase 5
- `docs/local-llm-setup.md` - Documentation
- `package.json` - Scripts and dependencies
- `.github/agents/tests‑healer.agent.md` - Optional updates

## Security Considerations
- **Local LLM**: Keeps code private, no external data transmission
- **Cloud LLM**: Sends code to external provider (Anthropic)
- **GitHub Tokens**: Never log tokens, validate permissions
- **Local Mode Defaults**: Local runs skip GitHub API calls by default (CREATE_ISSUES_LOCAL=false)

## Testing Checklist
- [ ] GitHub-hosted runner uses cloud LLM (Claude)
- [ ] Self-hosted runner with Ollama uses local LLM
- [ ] act simulator detected as local mode
- [ ] Local mode skips GitHub API calls by default (CREATE_ISSUES_LOCAL=false)
- [ ] Local LLM health check detects unavailable LLM
- [ ] Fallback to cloud when local LLM fails
- [ ] OpenCode CLI integration works correctly
- [ ] Per-test issue creation coordinates with healing

---
*Plan updated on 2025‑01‑19*