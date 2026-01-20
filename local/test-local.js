#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function backupConfig() {
  const configPath = join(process.cwd(), 'playwright.atk.config.js');
  const backupPath = join(process.cwd(), 'playwright.atk.config.js.backup');
  
  if (fs.existsSync(configPath)) {
    fs.copyFileSync(configPath, backupPath);
    return backupPath;
  }
  return null;
}

function restoreConfig(backupPath) {
  if (backupPath && fs.existsSync(backupPath)) {
    const configPath = join(process.cwd(), 'playwright.atk.config.js');
    fs.copyFileSync(backupPath, configPath);
    fs.unlinkSync(backupPath);
    console.log('🔧 Restored original playwright.atk.config.js');
  }
}

function updateConfigForLocal() {
  const configPath = join(process.cwd(), 'playwright.atk.config.js');
  
  if (!fs.existsSync(configPath)) {
    console.log('⚠️  playwright.atk.config.js not found, skipping config update');
    return null;
  }
  
  let content = fs.readFileSync(configPath, 'utf8');
  const originalContent = content;
  
  // Ensure operatingMode is 'native' for local development
  content = content.replace(/operatingMode:\s*['"][^'"]*['"]/, "operatingMode: 'native'");
  
  // Ensure pantheon.isTarget is false
  content = content.replace(/pantheon:\s*{[^}]*isTarget:\s*[^,}]*/g, (match) => {
    return match.replace(/isTarget:\s*[^,}]*/, 'isTarget: false');
  });
  
  // Ensure tugboat.isTarget is false  
  content = content.replace(/tugboat:\s*{[^}]*isTarget:\s*[^,}]*/g, (match) => {
    return match.replace(/isTarget:\s*[^,}]*/, 'isTarget: false');
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(configPath, content, 'utf8');
    console.log('🔧 Updated playwright.atk.config.js for local development');
    console.log('   - Set operatingMode: "native"');
    console.log('   - Set pantheon.isTarget: false');
    console.log('   - Set tugboat.isTarget: false');
  } else {
    console.log('✓ playwright.atk.config.js already configured for local development');
  }
  
  return configPath;
}

function validateLocalEnvironment() {
  console.log('🔍 Validating local development environment...');
  
  // Check if DDEV is likely running (we can't actually check without making HTTP request)
  console.log('   Assuming DDEV is running at https://performant-labs.ddev.site:8493');
  console.log('   (Run `ddev start` if site is not accessible)');
  
  // Check if playwright.atk.config.js exists
  const configPath = join(process.cwd(), 'playwright.atk.config.js');
  if (!fs.existsSync(configPath)) {
    console.log('❌ playwright.atk.config.js not found');
    console.log('   This file is required for ATK tests');
    return false;
  }
  
  console.log('✓ Environment validation passed\n');
  return true;
}

async function runLocalTests() {
  console.log('🚀 Running Playwright tests against local DDEV environment...\n');
  
  // Set environment variables for local development
  process.env.BASE_URL = 'https://performant-labs.ddev.site:8493';
  process.env.CI = 'false';
  process.env.ATK_REPORT_TARGET = ''; // Disable external reporters for local
  
  const args = [
    'playwright',
    'test',
    '--reporter=html,list',  // HTML report for local viewing
    '--workers=1',           // Sequential execution for easier debugging
    '--timeout=120000'       // Longer timeout for local development
  ];
  
  // Add any additional arguments passed to the script
  if (process.argv.length > 2) {
    args.push(...process.argv.slice(2));
  }
  
  console.log(`Command: npx ${args.join(' ')}\n`);
  
  return new Promise((resolve, reject) => {
    const child = spawn('npx', args, {
      stdio: 'inherit',
      shell: true
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ All tests passed!');
        resolve(true);
      } else {
        console.log(`\n❌ Tests failed with exit code ${code}`);
        resolve(false); // Resolve with false (not reject) to continue to healing
      }
    });
    
    child.on('error', (error) => {
      console.error(`Failed to run tests: ${error.message}`);
      reject(error);
    });
  });
}

// Main execution
async function main() {
  let backupPath = null;
  
  try {
    // Step 1: Validate environment
    if (!validateLocalEnvironment()) {
      process.exit(1);
    }
    
    // Step 2: Backup and update config
    console.log('📋 Checking ATK configuration...');
    backupPath = backupConfig();
    updateConfigForLocal();
    
    // Step 3: Run tests
    const success = await runLocalTests();
    
    // Step 4: Check if CTRF report exists for healing
    const ctrfReportPath = join(process.cwd(), 'ctrf', 'ctrf-report.json');
    if (!success && fs.existsSync(ctrfReportPath)) {
      console.log('\n📋 Test failures detected. CTRF report available for healing.');
      console.log('   Run `npm run heal:local` to attempt automatic fixes.');
    } else if (!success) {
      console.log('\n📋 Test failures detected. No CTRF report found.');
    }
    
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error(`Error running local tests: ${error.message}`);
    process.exit(1);
  } finally {
    // Always restore original config
    if (backupPath) {
      restoreConfig(backupPath);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}