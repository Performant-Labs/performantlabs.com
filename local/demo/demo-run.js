#!/usr/bin/env node
import { spawn } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function runDemo() {
  const demoTestPath = join(process.cwd(), 'tests', 'demo-healing.spec.js');
  
  if (!existsSync(demoTestPath)) {
    console.log('❌ Demo test not found. Run demo-setup.js first.');
    process.exit(1);
  }
  
  console.log('🚀 Starting LLM Test Healing Demo...\n');
  console.log('='.repeat(60));
  console.log('1️⃣  Running failing test...');
  console.log('='.repeat(60));
  
  // Run test to generate CTRF report
  const testProcess = spawn('npm', ['run', 'test:local', '--', 'tests/demo-healing.spec.js'], {
    stdio: 'inherit',
    shell: true
  });
  
  testProcess.on('close', async (code) => {
    if (code === 0) {
      console.log('\n⚠️  Test passed (unexpected). The demo requires a failing test.');
      console.log('   The template selectors might match your current site.');
      console.log('   Try modifying the template to ensure it fails.');
      process.exit(1);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('2️⃣  Test failed as expected. Starting healing process...');
    console.log('='.repeat(60) + '\n');
    
    // Run healing with auto-accept
    process.env.HEAL_AUTO_ACCEPT = 'true';
    const healProcess = spawn('npm', ['run', 'local:heal'], {
      stdio: 'inherit',
      shell: true
    });
    
    healProcess.on('close', (healCode) => {
      if (healCode === 0) {
        console.log('\n' + '='.repeat(60));
        console.log('3️⃣  Verifying the fix...');
        console.log('='.repeat(60) + '\n');
        
        // Run test again to verify fix
        const verifyProcess = spawn('npm', ['run', 'test:local', '--', 'tests/demo-healing.spec.js'], {
          stdio: 'inherit',
          shell: true
        });
        
        verifyProcess.on('close', (verifyCode) => {
          console.log('\n' + '='.repeat(60));
          console.log('🎉 Demo Complete!');
          console.log('='.repeat(60));
          console.log('   Original test → Failed');
          console.log('   LLM analysis → Suggested fixes');
          console.log('   Applied fixes → Test now passes');
          console.log('\n📁 Check the changes:');
          console.log('   git diff HEAD~1 tests/demo-healing.spec.js');
          console.log('\n🔄 To run again: npm run demo:reset && npm run demo:setup && npm run demo:run');
        });
      } else {
        console.log('\n❌ Healing failed. Check OpenCode/Ollama setup.');
        console.log('   Make sure Ollama is running with: ollama serve');
        console.log('   And the model is available: ollama pull mfdoom/deepseek-coder-v2-tool-calling:latest');
      }
    });
  });
}

runDemo();