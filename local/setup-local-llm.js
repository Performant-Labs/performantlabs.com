#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

class LLMSetup {
  constructor() {
    this.opencodeConfigDir = join(process.cwd(), '.opencode');
    this.opencodeConfigPath = join(this.opencodeConfigDir, 'config.json');
  }
  
  checkOllama() {
    console.log('🔍 Checking Ollama installation...');
    
    try {
      // Check if ollama command exists
      execSync('which ollama', { stdio: 'pipe' });
      console.log('✅ Ollama is installed');
      
      // Check if ollama is running
      try {
        const response = execSync('curl -s http://localhost:11434/api/tags', { stdio: 'pipe' });
        const data = JSON.parse(response.toString());
        console.log('✅ Ollama is running');
        console.log(`📦 Available models: ${data.models?.map(m => m.name).join(', ') || 'none'}`);
        return true;
      } catch (error) {
        console.log('⚠️  Ollama is not running. Start it with: ollama serve');
        return false;
      }
    } catch (error) {
      console.log('❌ Ollama is not installed');
      console.log('📥 Install from: https://ollama.com/download');
      return false;
    }
  }
  
  recommendModel() {
    console.log('\n💡 Recommended model for test healing:');
    console.log('   ollama pull mfdoom/deepseek-coder-v2-tool-calling:latest');
    console.log('\n🔧 This model supports tool calling required by OpenCode');
  }
  
  createOpenCodeConfig() {
    console.log('\n⚙️  Creating OpenCode configuration...');
    
    mkdirSync(this.opencodeConfigDir, { recursive: true });
    
    const config = {
      version: "1",
      model: {
        provider: "ollama",
        model: "mfdoom/deepseek-coder-v2-tool-calling:latest",
        options: {
          temperature: 0.1,
          maxTokens: 4000
        }
      },
      local: {
        preferLocal: true,
        fallbackToCloud: false
      }
    };
    
    writeFileSync(this.opencodeConfigPath, JSON.stringify(config, null, 2), 'utf8');
    console.log(`✅ Created OpenCode config at ${this.opencodeConfigPath}`);
  }
  
  testOpenCode() {
    console.log('\n🧪 Testing OpenCode integration...');
    
    try {
      execSync('which opencode', { stdio: 'pipe' });
      console.log('✅ OpenCode is installed');
      
      // Simple test
      console.log('   Testing with simple prompt...');
      try {
        const result = execSync(
          'opencode run --model ollama/mfdoom/deepseek-coder-v2-tool-calling:latest "What is 2+2?" 2>&1 | head -5',
          { stdio: 'pipe', encoding: 'utf8' }
        );
        console.log('✅ OpenCode works with Ollama');
        console.log(`   Sample output: ${result.substring(0, 100)}...`);
      } catch (error) {
        console.log('⚠️  OpenCode test failed. Make sure the model is pulled:');
        console.log('   ollama pull mfdoom/deepseek-coder-v2-tool-calling:latest');
      }
    } catch (error) {
      console.log('❌ OpenCode is not installed');
      console.log('📥 Install with: npm install -g opencode-ai');
    }
  }
  
  main() {
    console.log('🧠 Setting up Local LLM for Test Healing\n');
    
    const ollamaOk = this.checkOllama();
    
    if (ollamaOk) {
      this.recommendModel();
      this.createOpenCodeConfig();
      this.testOpenCode();
      
      console.log('\n🎉 Setup complete!');
      console.log('\n🚀 Next steps:');
      console.log('   1. Ensure Ollama is running: ollama serve');
      console.log('   2. Pull the recommended model if not already:');
      console.log('      ollama pull mfdoom/deepseek-coder-v2-tool-calling:latest');
      console.log('   3. Test the healing workflow:');
      console.log('      npm run test:local -- tests/demo-healing.spec.js');
      console.log('      npm run heal:local');
    } else {
      console.log('\n❌ Cannot proceed without Ollama.');
      console.log('\n📋 Installation instructions:');
      console.log('   1. Download Ollama: https://ollama.com/download');
      console.log('   2. Install and start: ollama serve');
      console.log('   3. Pull a model: ollama pull mfdoom/deepseek-coder-v2-tool-calling:latest');
      console.log('   4. Run this setup again: npm run setup:local-llm');
    }
  }
}

// Run setup
const setup = new LLMSetup();
setup.main();