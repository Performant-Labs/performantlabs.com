#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(import.meta.url);

async function setupLocalLLM() {
  console.log('🔧 Setting up local LLM configuration for OpenCode...\n');
  
  // Check for Ollama
  try {
    console.log('Checking for Ollama...');
    execSync('which ollama', { stdio: 'pipe' });
    console.log('✅ Ollama found');
    
    // Try to list available models
    try {
      const modelsOutput = execSync('ollama list --format json', { stdio: 'pipe' }).toString();
      const models = JSON.parse(modelsOutput);
      console.log('📚 Available models:');
      models.forEach(model => {
        console.log(`   - ${model.name} (${model.size})`);
      });
      
      // Recommend a coding model if not present
      const hasCodingModel = models.some(m => 
        m.name.includes('codellama') || 
        m.name.includes('deepseek-coder') ||
        m.name.includes('qwen-coder')
      );
      
      if (!hasCodingModel) {
        console.log('\n💡 Recommended coding model not found.');
        console.log('   Run: `ollama pull deepseek-coder-v2:16b`');
        console.log('   Or: `ollama pull codellama:latest`');
      }
    } catch (error) {
      console.log('ℹ️  Could not list models. Run `ollama pull codellama:latest` to download a model.');
    }
    
    // Check if Ollama service is running
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      if (!response.ok) {
        console.log('⚠️  Ollama service may not be running.');
        console.log('   Start it with: `ollama serve`');
        console.log('   (Or run in background: `ollama serve &`)');
      }
    } catch (error) {
      console.log('⚠️  Ollama service not responding on localhost:11434');
      console.log('   Start it with: `ollama serve`');
    }
  } catch (error) {
    console.log('❌ Ollama not found. Please install from https://ollama.com/download');
    console.log('   Then run: `ollama pull deepseek-coder-v2:16b`');
  }
  
  // Check for LM Studio (common alternative)
  try {
    // Common LM Studio paths
    const lmStudioPaths = [
      '/Applications/LM Studio.app',
      'C:\\Program Files\\LM Studio',
      '~/Applications/LM Studio.app'
    ];
    
    let lmStudioFound = false;
    for (const path of lmStudioPaths) {
      try {
        // Simple check for macOS
        if (path.includes('.app') && existsSync(path.replace('~', process.env.HOME || ''))) {
          console.log('✅ LM Studio found');
          lmStudioFound = true;
          break;
        }
      } catch (e) {}
    }
    
    if (!lmStudioFound) {
      console.log('ℹ️  LM Studio not detected (optional alternative to Ollama)');
    }
  } catch (error) {
    // Ignore LM Studio errors
  }
  
  // Create OpenCode configuration
  const opencodeDir = join(process.cwd(), '.opencode');
  if (!existsSync(opencodeDir)) {
    mkdirSync(opencodeDir, { recursive: true });
    console.log('📁 Created .opencode directory');
  }
  
  const config = {
    version: '1',
    model: {
      provider: 'ollama',
      model: 'deepseek-coder-v2:16b',
      options: {
        temperature: 0.1,
        maxTokens: 4000
      }
    },
    // Local development settings
    local: {
      preferLocal: true,
      fallbackToCloud: false
    }
  };
  
  const configPath = join(opencodeDir, 'config.json');
  writeFileSync(
    configPath,
    JSON.stringify(config, null, 2)
  );
  
  console.log('\n✅ Created OpenCode configuration at .opencode/config.json');
  console.log('   Model: ollama/deepseek-coder-v2:16b');
  console.log('   Temperature: 0.1 (low for deterministic code generation)');
  
  // Test OpenCode CLI
  console.log('\n🔍 Testing OpenCode CLI...');
  try {
    execSync('which opencode', { stdio: 'pipe' });
    console.log('✅ OpenCode CLI found');
    
    // Try to list models
    try {
      const models = execSync('opencode models', { stdio: 'pipe' }).toString();
      const ollamaModels = models.split('\n').filter(line => line.includes('ollama/'));
      if (ollamaModels.length > 0) {
        console.log('✅ OpenCode can see Ollama models');
      }
    } catch (error) {
      console.log('⚠️  Could not list OpenCode models');
    }
  } catch (error) {
    console.log('❌ OpenCode CLI not found');
    console.log('   Install with: `npm install -g @anomalyco/opencode`');
    console.log('   Or: `curl -fsSL https://opencode.ai/install.sh | sh`');
  }
  
  console.log('\n📋 Setup complete! Next steps:');
  console.log('   1. Ensure Ollama is running: `ollama serve`');
  console.log('   2. Download a coding model: `ollama pull deepseek-coder-v2:16b`');
  console.log('   3. Test the local workflow:');
  console.log('      - Start DDEV: `ddev start`');
  console.log('      - Run tests: `npm run test:local`');
  console.log('      - Heal failures: `npm run heal:local`');
  console.log('\n💡 Tips:');
  console.log('   - Run `ollama serve &` to start in background');
  console.log('   - Use `npm run test-and-heal` for combined workflow');
  console.log('   - Check `.opencode/config.json` to customize model settings');
}

// Run setup
if (import.meta.url === `file://${process.argv[1]}`) {
  setupLocalLLM().catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
}