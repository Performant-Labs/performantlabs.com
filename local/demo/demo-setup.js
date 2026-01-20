#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function setupDemo() {
  const templatePath = join(__dirname, 'template-failing-test.spec.js');
  const demoTestPath = join(process.cwd(), 'tests', 'demo-healing.spec.js');
  
  if (existsSync(demoTestPath)) {
    console.log('⚠️  Demo test already exists. Run demo-reset.js first.');
    process.exit(1);
  }
  
  copyFileSync(templatePath, demoTestPath);
  
  console.log('✅ Created demo test at:', demoTestPath);
  console.log('\n📋 Test will fail because:');
  console.log('   1. Wrong banner text expectation');
  console.log('   2. Wrong navigation ID (#main-navigation vs #block-mainnavigation)');
  console.log('   3. Wrong button href (/learn-more vs /about-us)');
  console.log('   4. Wrong expertise section class');
  console.log('   5. Wrong clients selector and count');
  console.log('   6. Unnecessary waitForTimeout');
  console.log('   7. Missing proper page load waiting');
  console.log('   8. Wrong page title expectation');
  console.log('\n🔍 Based on actual site structure from Playwright MCP analysis');
  console.log('\n🚀 Next: Run `npm run demo:run` to execute the demo');
}

setupDemo();