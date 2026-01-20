#!/usr/bin/env node
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { spawn, execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

class LocalTestHealer {
  constructor() {
    this.ctrfReportPath = join(process.cwd(), 'ctrf', 'ctrf-report.json');
    this.logger = this.createLogger();
    this.opencodeConfigPath = join(process.cwd(), '.opencode', 'config.json');
    this.healingBranch = `heal/local-fixes-${Date.now()}`;
    this.recommendedModel = null;
  }
  
  createLogger() {
    return {
      info: (msg, ...args) => console.log(`📝 ${msg}`, ...args),
      warn: (msg, ...args) => console.log(`⚠️ ${msg}`, ...args),
      error: (msg, ...args) => console.log(`❌ ${msg}`, ...args),
      success: (msg, ...args) => console.log(`✅ ${msg}`, ...args),
      debug: (msg, ...args) => console.log(`🔍 ${msg}`, ...args)
    };
  }

  stripAnsi(text) {
    if (!text) return text;
    // Remove ANSI escape codes
    return text.replace(/\x1b\[[0-9;]*m/g, '');
  }

  async checkLocalLLM() {
    this.logger.info('Checking for local LLM (Ollama/LM Studio)...');
    
    // Check if Ollama is running
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      if (response.ok) {
        const data = await response.json();
        const models = data.models?.map(m => m.name) || [];
        const modelsString = models.join(', ');
        this.logger.success(`Ollama available with models: ${modelsString}`);
        
        // Find a model that supports tool calling (prefer tool-calling variants)
        let recommendedModel = null;
        const toolCallingModels = models.filter(m => m.includes('tool') || m.includes('tool-calling'));
        const codingModels = models.filter(m => m.includes('coder') || m.includes('code'));
        
        if (toolCallingModels.length > 0) {
          recommendedModel = toolCallingModels[0];
          this.logger.info(`Found tool-calling model: ${recommendedModel}`);
        } else if (codingModels.length > 0) {
          recommendedModel = codingModels[0];
          this.logger.warn(`No tool-calling model found. Using coding model: ${recommendedModel}`);
          this.logger.warn('This model may not support tool calling and could cause OpenCode errors.');
        } else if (models.length > 0) {
          recommendedModel = models[0];
          this.logger.warn(`Using generic model: ${recommendedModel}. Tool calling may fail.`);
        }
        
        // Ensure model name is lowercase for OpenCode compatibility
        if (recommendedModel) {
          recommendedModel = recommendedModel.toLowerCase();
        }
        
        return { 
          available: true, 
          provider: 'ollama', 
          models: data.models,
          recommendedModel: recommendedModel ? `ollama/${recommendedModel}` : null
        };
      }
    } catch (error) {
      this.logger.warn('Ollama not available on localhost:11434');
    }
    
    // Check OpenCode config for local models
    if (existsSync(this.opencodeConfigPath)) {
      try {
        const config = JSON.parse(readFileSync(this.opencodeConfigPath, 'utf8'));
        if (config.model?.provider === 'ollama' || config.model?.provider?.includes('local')) {
          this.logger.success(`OpenCode configured for local model: ${config.model.model}`);
          return { 
            available: true, 
            provider: 'opencode-config', 
            config,
            recommendedModel: config.model.model
          };
        }
      } catch (error) {
        this.logger.debug('Error reading OpenCode config:', error.message);
      }
    }
    
    this.logger.error('No local LLM detected. Please install Ollama or configure OpenCode.');
    this.logger.info('Installation: https://ollama.com/download');
    this.logger.info('Recommended model: `ollama pull mfdoom/deepseek-coder-v2-tool-calling:latest`');
    this.logger.info('Or run: `npm run setup:local-llm`');
    
    return { available: false, provider: null, recommendedModel: null };
  }
  
  async readCTRFReport() {
    if (!existsSync(this.ctrfReportPath)) {
      throw new Error(`CTRF report not found at ${this.ctrfReportPath}. Run tests first with 'npm run test:local'.`);
    }
    
    this.logger.info(`Reading CTRF report from ${this.ctrfReportPath}`);
    const report = JSON.parse(readFileSync(this.ctrfReportPath, 'utf8'));
    
    // Extract failed tests (only failed, not skipped)
    const failedTests = report.results?.tests?.filter(test => 
      test.status === 'failed'
    ) || [];
    
    return {
      totalTests: report.results?.summary?.tests || 0,
      passed: report.results?.summary?.passed || 0,
      failed: report.results?.summary?.failed || 0,
      skipped: report.results?.summary?.skipped || 0,
      failedTests,
      report
    };
  }
  
  async getTestFileContent(testFilePath) {
    if (!existsSync(testFilePath)) {
      throw new Error(`Test file not found: ${testFilePath}`);
    }
    return readFileSync(testFilePath, 'utf8');
  }
  
  createHealingPrompt(test, testContent) {
    const testIdMatch = test.name.match(/ATK-PW-\d+/);
    const testId = testIdMatch ? testIdMatch[0] : 'unknown';
    const error = this.stripAnsi(test.message || test.trace || 'No error details provided');
    
    return `You are an expert Playwright test engineer. Analyze this failing test and fix it.

TEST DETAILS:
- Test ID: ${testId}
- File: ${test.filePath}
- Test Name: ${test.name}
- Status: ${test.status}
- Error: ${error}

CURRENT TEST CODE:
\`\`\`javascript
${testContent}
\`\`\`

ANALYSIS INSTRUCTIONS:
1. First understand WHY the test is failing. Common issues:
   - Selector issues (element not found, wrong selector)
   - Timing issues (needs proper waits)
   - Page structure changes
   - Authentication/state issues
   - Environment differences (local vs CI)

2. Focus on ROBUST selectors:
   - Prefer data-testid attributes
   - Use aria-label or text content if data-testid not available
   - Avoid fragile CSS class selectors
   - Use getByRole() with proper options

3. Fix the test to work against LOCAL DDEV environment:
   - BASE_URL: https://performant-labs.ddev.site:8493
   - Use proper waits: await page.waitForSelector(), await expect().toBeVisible()
   - Add appropriate timeouts for local development

4. IMPORTANT: Return ONLY the fixed test code, no explanations.
   - Preserve the test structure and imports
   - Keep the test ID comment if present
   - Make minimal changes needed to fix the test

FIXED TEST CODE:
\`\`\`javascript
`;
  }
  
  async healTestWithOpenCode(test, testContent) {
    this.logger.info(`Analyzing failed test: ${test.name}`);
    
    const prompt = this.createHealingPrompt(test, testContent);
    
    // Create a temporary file with the prompt
    const tempPromptFile = join(process.cwd(), 'local', `heal-prompt-${Date.now()}.txt`);
    mkdirSync(dirname(tempPromptFile), { recursive: true });
    writeFileSync(tempPromptFile, prompt, 'utf8');
    
    this.logger.debug(`Created prompt file: ${tempPromptFile}`);
    
    // Use OpenCode CLI with local model
    const model = this.recommendedModel || 'ollama/mfdoom/deepseek-coder-v2-tool-calling:latest';
    const args = [
      'run',
      '--model', model,
      'Analyze and fix this failing Playwright test',
      '-f', tempPromptFile
    ];
    
    this.logger.info(`Running OpenCode analysis for test ${test.name}...`);
    
    return new Promise((resolve, reject) => {
      const child = spawn('opencode', args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: false
      });
      
      // Close stdin immediately to signal no more input
      child.stdin.end();
      
      let output = '';
      let errorOutput = '';
      
      // Set a timeout to kill the process if it takes too long
      const timeout = setTimeout(() => {
        child.kill('SIGTERM');
        reject(new Error('OpenCode timeout after 120 seconds'));
      }, 120000);
      
      child.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      child.on('close', (code) => {
        clearTimeout(timeout);
        
        // Clean up temp file
        try {
          if (existsSync(tempPromptFile)) {
            // Keep for debugging: unlinkSync(tempPromptFile);
          }
        } catch (e) {}
        
        if (code !== 0) {
          this.logger.error(`OpenCode failed with code ${code}: ${errorOutput}`);
          reject(new Error(`OpenCode failed: ${errorOutput}`));
          return;
        }
        
        // Parse the response to extract fixed code
        const fixedCode = this.extractFixedCode(output);
        if (!fixedCode) {
          this.logger.warn(`Could not extract fixed code from OpenCode response`);
          this.logger.debug(`OpenCode output: ${output.substring(0, 500)}...`);
          reject(new Error('No fixed code found in OpenCode response'));
          return;
        }
        
        resolve({ success: true, fixedCode, originalCode: testContent, test });
      });
      
      child.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }
  
  extractFixedCode(output) {
    // Split by code block markers
    const parts = output.split(/```+javascript/);
    if (parts.length < 2) {
      return null;
    }
    
    // Take the last code block (the one generated by the model)
    const lastBlock = parts[parts.length - 1];
    
    // Find the closing backticks
    const closingIndex = lastBlock.indexOf('```');
    if (closingIndex === -1) {
      return null;
    }
    
    // Extract the code (trim whitespace)
    const code = lastBlock.substring(0, closingIndex).trim();
    return code || null;
  }
  
  async applyFix(testFilePath, originalCode, fixedCode) {
    if (originalCode === fixedCode) {
      this.logger.warn(`No changes needed for ${basename(testFilePath)}`);
      return false;
    }
    
    // Show diff to user
    this.logger.info(`\nChanges for ${basename(testFilePath)}:`);
    this.showSimpleDiff(originalCode, fixedCode);
    
    // Auto-accept for testing if environment variable set
    if (process.env.HEAL_AUTO_ACCEPT === 'true') {
      writeFileSync(testFilePath, fixedCode, 'utf8');
      this.logger.success(`Auto-applied fixes to ${testFilePath} (HEAL_AUTO_ACCEPT=true)`);
      return true;
    }
    
    // Ask for confirmation
    const readline = (await import('readline')).default;
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise((resolve) => {
      rl.question('Apply these changes? (y/N): ', (answer) => {
        rl.close();
        
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          writeFileSync(testFilePath, fixedCode, 'utf8');
          this.logger.success(`Applied fixes to ${testFilePath}`);
          resolve(true);
        } else {
          this.logger.warn(`Skipped changes for ${testFilePath}`);
          resolve(false);
        }
      });
    });
  }
  
  showSimpleDiff(original, fixed) {
    const originalLines = original.split('\n');
    const fixedLines = fixed.split('\n');
    
    // Simple diff - just show lines that changed
    for (let i = 0; i < Math.max(originalLines.length, fixedLines.length); i++) {
      const orig = originalLines[i] || '';
      const fix = fixedLines[i] || '';
      
      if (orig !== fix) {
        if (orig && fix) {
          console.log(`  Line ${i + 1}: - ${orig}`);
          console.log(`           + ${fix}`);
        } else if (orig) {
          console.log(`  Line ${i + 1}: - ${orig}`);
        } else if (fix) {
          console.log(`  Line ${i + 1}: + ${fix}`);
        }
      }
    }
  }
  
  async createGitBranch() {
    try {
      // Check if we're in a git repo
      execSync('git rev-parse --is-inside-work-tree', { stdio: 'pipe' });
      
      // Create and switch to new branch
      execSync(`git checkout -b ${this.healingBranch}`, { stdio: 'pipe' });
      this.logger.success(`Created and switched to branch: ${this.healingBranch}`);
      return true;
    } catch (error) {
      this.logger.warn(`Not a git repository or git error: ${error.message}`);
      return false;
    }
  }
  
  async commitChanges(testFiles) {
    try {
      // Add changed files
      execSync(`git add ${testFiles.map(f => `"${f}"`).join(' ')}`, { stdio: 'pipe' });
      
      // Create commit
      const commitMessage = `Heal: Fix ${testFiles.length} failed test(s) using local LLM`;
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'pipe' });
      
      this.logger.success(`Committed changes: ${commitMessage}`);
      return true;
    } catch (error) {
      this.logger.warn(`Could not commit changes: ${error.message}`);
      return false;
    }
  }
  
  async main() {
    this.logger.info('🧠 Starting local test healing...\n');
    
    // Step 1: Check local LLM
    const llmCheck = await this.checkLocalLLM();
    if (!llmCheck.available) {
      this.logger.error('Cannot proceed without local LLM.');
      this.logger.info('Run `npm run setup:local-llm` for setup instructions.');
      process.exit(1);
    }
    
    // Store recommended model for OpenCode
    this.recommendedModel = llmCheck.recommendedModel || 'ollama/mfdoom/deepseek-coder-v2-tool-calling:latest';
    
    // Step 2: Read CTRF report
    let reportData;
    try {
      reportData = await this.readCTRFReport();
      this.logger.info(`Found ${reportData.failedTests.length} failed/skipped tests`);
      
      if (reportData.failedTests.length === 0) {
        this.logger.success('No failed tests to heal!');
        return;
      }
      
      // Show summary
      this.logger.info(`Test Summary: ${reportData.passed} passed, ${reportData.failed} failed, ${reportData.skipped} skipped`);
    } catch (error) {
      this.logger.error(error.message);
      this.logger.info('Run `npm run test:local` first to generate test report.');
      process.exit(1);
    }
    
    // Step 3: Create git branch for healing
    const gitAvailable = await this.createGitBranch();
    
    // Step 4: Process each failed test
    const results = [];
    const fixedFiles = [];
    
    for (const test of reportData.failedTests) {
      try {
        this.logger.info(`\n--- Processing: ${test.name} ---`);
        
        // Get test file content (filePath is absolute)
        const testFilePath = test.filePath;
        const testContent = await this.getTestFileContent(testFilePath);
        
        // Analyze and get fix from OpenCode
        const healResult = await this.healTestWithOpenCode(test, testContent);
        
        // Apply fix with user confirmation
        const applied = await this.applyFix(testFilePath, healResult.originalCode, healResult.fixedCode);
        
        if (applied) {
          fixedFiles.push(test.filePath);
          results.push({ success: true, test: test.name, file: test.filePath });
        } else {
          results.push({ success: false, test: test.name, reason: 'User skipped' });
        }
        
      } catch (error) {
        this.logger.error(`Failed to heal test ${test.name}: ${error.message}`);
        results.push({ success: false, test: test.name, error: error.message });
      }
    }
    
    // Step 5: Commit changes if any files were fixed
    if (fixedFiles.length > 0 && gitAvailable) {
      this.logger.info(`\nCommitting ${fixedFiles.length} fixed test(s)...`);
      await this.commitChanges(fixedFiles);
    }
    
    // Step 6: Summary
    this.logger.info('\n📊 Healing Summary:');
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    this.logger.info(`  Successful: ${successful}`);
    this.logger.info(`  Failed/Skipped: ${failed}`);
    
    if (successful > 0) {
      if (gitAvailable) {
        this.logger.success(`\n✅ Created healing branch: ${this.healingBranch}`);
        this.logger.info('Next steps:');
        this.logger.info(`  1. Review changes: git diff main...${this.healingBranch}`);
        this.logger.info('  2. Test fixes: npm run test:local');
        this.logger.info('  3. Push branch: git push -u origin ' + this.healingBranch);
      } else {
        this.logger.success(`\n✅ Fixed ${successful} test(s) locally`);
        this.logger.info('Run `npm run test:local` to verify the fixes.');
      }
    } else {
      this.logger.warn('\n⚠️ No tests were successfully healed.');
      this.logger.info('You may need to manually fix the test failures.');
    }
  }
}

// Run the healer
if (import.meta.url === `file://${process.argv[1]}`) {
  const healer = new LocalTestHealer();
  healer.main().catch(error => {
    console.error('Fatal error in healing process:', error);
    process.exit(1);
  });
}