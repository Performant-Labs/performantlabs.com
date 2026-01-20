#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

class LocalTestRunner {
  constructor() {
    this.atkConfigPath = join(process.cwd(), 'playwright.atk.config.js');
    this.backupConfigPath = join(process.cwd(), 'playwright.atk.config.js.backup');
    this.ctrfDir = join(process.cwd(), 'ctrf');
    this.logger = this.createLogger();
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
  
  validateEnvironment() {
    this.logger.info('🔍 Validating local development environment...');
    this.logger.info('   Assuming DDEV is running at https://performant-labs.ddev.site:8493');
    this.logger.info('   (Run `ddev start` if site is not accessible)');
    this.logger.success('Environment validation passed');
  }
  
  backupConfig() {
    if (existsSync(this.atkConfigPath)) {
      const configContent = readFileSync(this.atkConfigPath, 'utf8');
      writeFileSync(this.backupConfigPath, configContent, 'utf8');
      this.logger.debug(`Backed up config to ${this.backupConfigPath}`);
      return true;
    }
    return false;
  }
  
  updateConfigForLocal() {
    if (!existsSync(this.atkConfigPath)) {
      this.logger.error(`ATK config not found at ${this.atkConfigPath}`);
      return false;
    }
    
    let configContent = readFileSync(this.atkConfigPath, 'utf8');
    
    // Update config for local development
    configContent = configContent.replace(
      /operatingMode:\s*["'][^"']*["']/,
      'operatingMode: "native"'
    );
    
    configContent = configContent.replace(
      /pantheon:\s*{[^}]*isTarget:\s*[^,}]*/,
      'pantheon: {\n      isTarget: false'
    );
    
    configContent = configContent.replace(
      /tugboat:\s*{[^}]*isTarget:\s*[^,}]*/,
      'tugboat: {\n      isTarget: false'
    );
    
    writeFileSync(this.atkConfigPath, configContent, 'utf8');
    this.logger.success('🔧 Updated playwright.atk.config.js for local development');
    this.logger.info('   - Set operatingMode: "native"');
    this.logger.info('   - Set pantheon.isTarget: false');
    this.logger.info('   - Set tugboat.isTarget: false');
    
    return true;
  }
  
  restoreConfig() {
    if (existsSync(this.backupConfigPath)) {
      const backupContent = readFileSync(this.backupConfigPath, 'utf8');
      writeFileSync(this.atkConfigPath, backupContent, 'utf8');
      // Clean up backup file
      // unlinkSync(this.backupConfigPath);
      this.logger.debug('Restored original config');
      return true;
    }
    return false;
  }
  
  runPlaywrightTests(testPattern) {
    this.logger.info('🚀 Running Playwright tests against local DDEV environment...\n');
    
    // Ensure CTRF directory exists
    mkdirSync(this.ctrfDir, { recursive: true });
    
    // Set environment variables for local testing
    const env = {
      ...process.env,
      BASE_URL: 'https://performant-labs.ddev.site:8493',
      CI: 'false',
      NODE_ENV: 'test'
    };
    
    const args = [
      'test',
      '--workers=1',
      '--timeout=120000'
    ];
    
    if (testPattern) {
      args.push(testPattern);
    }
    
    this.logger.info(`Command: BASE_URL=https://performant-labs.ddev.site:8493 npx playwright ${args.join(' ')}`);
    
    return new Promise((resolve, reject) => {
      const child = spawn('npx', ['playwright', ...args], {
        stdio: 'inherit',
        env,
        shell: true
      });
      
      child.on('close', (code) => {
        resolve(code);
      });
      
      child.on('error', (error) => {
        reject(error);
      });
    });
  }
  
  async main() {
    const testPattern = process.argv[2] || '';
    
    try {
      // Step 1: Validate environment
      this.validateEnvironment();
      
      // Step 2: Backup and update config
      this.backupConfig();
      this.updateConfigForLocal();
      
      // Step 3: Run tests
      const exitCode = await this.runPlaywrightTests(testPattern);
      
      // Step 4: Always restore config
      this.restoreConfig();
      
      if (exitCode === 0) {
        this.logger.success('\n✅ All tests passed!');
      } else {
        this.logger.info(`\n📊 Test execution completed with exit code: ${exitCode}`);
        this.logger.info(`CTRF report generated at: ${join(this.ctrfDir, 'ctrf-report.json')}`);
      }
      
      process.exit(exitCode);
      
    } catch (error) {
      this.logger.error('Fatal error:', error.message);
      
      // Always try to restore config on error
      this.restoreConfig();
      
      process.exit(1);
    }
  }
}

// Run the test runner
if (import.meta.url === `file://${process.argv[1]}`) {
  const runner = new LocalTestRunner();
  runner.main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}