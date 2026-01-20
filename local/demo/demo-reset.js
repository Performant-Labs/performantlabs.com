#!/usr/bin/env node
import { unlinkSync, existsSync, rmSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function resetDemo() {
  const demoTestPath = join(process.cwd(), 'tests', 'demo-healing.spec.js');
  
  console.log('🔄 Resetting demo...\n');
  
  // Remove demo test file
  if (existsSync(demoTestPath)) {
    unlinkSync(demoTestPath);
    console.log('✅ Removed demo test file');
  } else {
    console.log('ℹ️  Demo test file not found (already removed)');
  }
  
  // Clean up CTRF reports
  const ctrfDir = join(process.cwd(), 'ctrf');
  if (existsSync(ctrfDir)) {
    try {
      const files = execSync(`find "${ctrfDir}" -name "*.json" -type f`, { encoding: 'utf8' });
      files.trim().split('\n').forEach(file => {
        if (file.trim()) {
          unlinkSync(file.trim());
        }
      });
      console.log('✅ Cleared CTRF reports');
    } catch (e) {
      console.log('ℹ️  No CTRF reports to clear');
    }
  }
  
  // Remove any healing branches
  try {
    const branches = execSync('git branch --list "heal/*"', { encoding: 'utf8' });
    const branchList = branches.trim().split('\n').filter(b => b.trim());
    
    if (branchList.length > 0) {
      // Get current branch
      const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      
      branchList.forEach(branch => {
        const branchName = branch.replace('*', '').trim();
        if (branchName && branchName !== currentBranch && branchName.startsWith('heal/')) {
          try {
            execSync(`git branch -D ${branchName}`, { stdio: 'pipe' });
            console.log(`✅ Deleted branch: ${branchName}`);
          } catch (e) {
            console.log(`⚠️  Could not delete branch ${branchName}: ${e.message}`);
          }
        }
      });
    } else {
      console.log('ℹ️  No healing branches found');
    }
  } catch (e) {
    console.log('ℹ️  Not a git repository or git error');
  }
  
  // Switch back to main if not already
  try {
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    if (currentBranch !== 'main') {
      execSync('git checkout main', { stdio: 'pipe' });
      console.log('✅ Switched to main branch');
    } else {
      console.log('ℹ️  Already on main branch');
    }
  } catch (e) {
    console.log('ℹ️  Not a git repository');
  }
  
  // Clean up any leftover prompt files
  try {
    const promptFiles = execSync('find local -name "heal-prompt-*.txt" -type f', { encoding: 'utf8' });
    promptFiles.trim().split('\n').forEach(file => {
      if (file.trim()) {
        unlinkSync(file.trim());
      }
    });
    console.log('✅ Cleared prompt files');
  } catch (e) {
    // Ignore errors
  }
  
  console.log('\n🔄 Demo reset complete. Ready for new demo run.');
  console.log('\n🚀 Next steps:');
  console.log('   1. npm run demo:setup - Create new demo test');
  console.log('   2. npm run demo:run - Execute full demo');
  console.log('   3. npm run demo:full - Reset, setup, and run in one command');
}

resetDemo();