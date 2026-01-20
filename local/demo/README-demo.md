# 🧠 LLM-Powered Test Healing Demo

Demonstrates how an LLM can automatically analyze and fix failing Playwright tests for Drupal sites.

## 🎯 Demo Overview

This demo shows:
1. **Creating a failing test** with realistic Drupal failure scenarios
2. **Running the test** to generate a CTRF report
3. **Using OpenCode + Ollama** to analyze the failure and suggest fixes
4. **Applying the fix** and verifying it works

## 📁 File Structure

```
local/demo/
├── template-failing-test.spec.js    # Template test that will fail
├── demo-setup.js                    # Setup script (copies template)
├── demo-run.js                      # Run test + healing workflow
├── demo-reset.js                    # Reset to initial state
└── README-demo.md                   # This file
```

## 🧪 Test Scenario

The demo test (`ATK-PW-DEMO-001`) verifies homepage elements but uses **outdated selectors** that will fail:

### **8 Realistic Failure Points:**
1. **Wrong banner text**: `'Performant Labs - Building Amazing Websites'` vs actual `'Performant Labs builds and tests world-class websites'`
2. **Wrong navigation ID**: `#main-navigation` vs actual `#block-mainnavigation`
3. **Wrong button href**: `/learn-more` vs actual `/about-us`
4. **Wrong expertise class**: `.expertise-section` vs actual `.PL-section-medium`
5. **Wrong clients selector**: `.client-logos` vs actual `.clients-block`
6. **Wrong client count**: `10` vs actual number
7. **Performance issue**: `waitForTimeout(3000)` instead of proper waiting
8. **Wrong page title**: `'Home | Performant Labs'` vs actual `'Frontpage | Performant Labs'`

## 🚀 Quick Start

### **Prerequisites**
```bash
# 1. Ensure Ollama is running with tool-calling model
ollama pull mfdoom/deepseek-coder-v2-tool-calling:latest
ollama serve

# 2. Verify DDEV is running
ddev start

# 3. Check OpenCode works
opencode run --model ollama/mfdoom/deepseek-coder-v2-tool-calling:latest "Hello"
```

### **Demo Commands**

```bash
# Full demo (reset, setup, run)
npm run demo:full

# Individual steps
npm run demo:reset    # Clean up previous demo
npm run demo:setup    # Create demo test from template
npm run demo:run      # Execute full demo workflow
```

## 🔄 Demo Workflow

### **Step 1: Setup**
```bash
npm run demo:setup
```
- Creates `tests/demo-healing.spec.js` from template
- Uses real DOM selectors from your Drupal site (via Playwright MCP analysis)

### **Step 2: Run Demo**
```bash
npm run demo:run
```
1. **Runs failing test** → Generates CTRF report
2. **Calls OpenCode** → Analyzes failure with local Ollama
3. **Applies fixes** → Updates test with proper selectors
4. **Verifies fix** → Runs test again to confirm it passes

### **Step 3: Reset (Optional)**
```bash
npm run demo:reset
```
- Removes demo test file
- Clears CTRF reports
- Deletes healing branches
- Switches back to main branch

## 🎬 What to Expect

### **During Demo Run:**
```
🚀 Starting LLM Test Healing Demo...
============================================================
1️⃣  Running failing test...
============================================================
✘ Test fails with 8 errors

============================================================
2️⃣  Test failed as expected. Starting healing process...
============================================================
📝 Analyzing failed test with OpenCode...
✅ Applied fixes to test

============================================================
3️⃣  Verifying the fix...
============================================================
✓ Test passes

============================================================
🎉 Demo Complete!
============================================================
   Original test → Failed
   LLM analysis → Suggested fixes
   Applied fixes → Test now passes
```

### **LLM Fixes Applied:**
1. Updates text expectations to match actual content
2. Fixes selector IDs and classes
3. Corrects href attributes
4. Replaces `waitForTimeout` with proper waiting
5. Adds `waitForLoadState('networkidle')`
6. Uses flexible selectors for Drupal patterns
7. **Note**: LLM may suggest `data-testid` attributes - review these as they may not exist on your site

## 🔧 Technical Details

### **Healing Process**
1. **CTRF Report**: `test:local` generates `ctrf/ctrf-report.json`
2. **OpenCode Analysis**: `heal:local` reads report and calls OpenCode CLI
3. **LLM Prompt**: Includes test details, error messages, and Drupal-specific guidance
4. **Code Extraction**: Parses LLM response for fixed JavaScript code
5. **Apply Changes**: Updates test file with user confirmation (auto-accept in demo)

### **Drupal-Specific Patterns**
The LLM is prompted to:
- Use role-based selectors over numeric IDs
- Prefer `[id^="block-"]` for Drupal blocks
- Use `:has-text()` for text content (Drupal often changes text)
- Add proper waiting for Drupal's JavaScript
- Use regex for hrefs (`/about-us/` instead of exact match)

## 🐛 Troubleshooting

### **Common Issues:**

**OpenCode fails with "model does not support tools"**
```bash
# Use tool-calling model
ollama pull mfdoom/deepseek-coder-v2-tool-calling:latest
# Update heal-local.js to use this model
```

**OpenCode fails with "ProviderModelNotFoundError" (case sensitivity)**
```bash
# OpenCode requires lowercase model names
# The demo automatically converts model names to lowercase
# Check: ollama list | grep -i "deepseek-coder"
```

**Test passes unexpectedly**
- The template selectors might match your current site
- Modify `local/demo/template-failing-test.spec.js` to ensure failures

**Ollama not running**
```bash
ollama serve
# Check: curl http://localhost:11434/api/tags
```

**DDEV not accessible**
```bash
ddev start
# Check: curl -I https://performant-labs.ddev.site:8493
```

**Healing produces incorrect data-testid selectors**
- The LLM may suggest `data-testid` attributes that don't exist
- This demonstrates the need for human review of LLM suggestions
- Real fix: Update selectors to match actual site structure

### **Debug Mode**
```bash
# Enable debug output
export DEBUG_HEAL=true
npm run demo:run
```

## 📊 Demo Success Metrics

- **Time to fix**: < 2 minutes from failure to healed
- **Accuracy**: LLM identifies all 8 failure causes
- **Code quality**: Applies Playwright best practices  
- **Repeatability**: Can run demo multiple times
- **Case handling**: Automatically fixes model name case sensitivity

## 🔧 Technical Implementation

### **Key Features:**
1. **Automatic model detection** - Finds best tool-calling model from Ollama
2. **Case sensitivity fix** - Converts `MFDoom/deepseek-coder-v2-tool-calling:latest` → `mfdoom/deepseek-coder-v2-tool-calling:latest`
3. **CTRF integration** - Uses standardized test reporting format
4. **Git workflow** - Creates healing branches for review
5. **Human-in-the-loop** - Shows diffs before applying changes (auto-accept optional)

### **Real Drupal Patterns:**
- Based on actual DOM analysis via Playwright MCP
- Uses real selectors from your Performant Labs site
- Simulates common Drupal maintenance challenges
- Follows your existing test patterns

## 🎯 Use Cases

### **Real-World Applications:**
1. **Drupal theme updates**: CSS class changes break tests
2. **Content updates**: Marketing text changes
3. **Navigation restructures**: Menu ID/class changes
4. **Performance optimization**: Remove unnecessary waits
5. **Best practices**: Update to modern selector patterns

### **Team Benefits:**
- **Faster debugging**: LLM analyzes failures instantly
- **Consistent fixes**: Follows project patterns
- **Knowledge sharing**: Shows proper fix patterns
- **Reduced maintenance**: Automated test updates

## 🔮 Future Enhancements

Potential improvements:
1. **Batch healing**: Fix multiple tests at once
2. **Custom prompts**: Team-specific healing rules
3. **CI integration**: Auto-heal in pipeline
4. **Test generation**: Create tests from user stories
5. **Visual diff**: Show before/after screenshots

## 📚 Resources

- [OpenCode Documentation](https://opencode.ai/docs)
- [Playwright MCP Server](https://github.com/microsoft/playwright-mcp-server)
- [Ollama Models](https://ollama.com/library)
- [CTRF Format](https://github.com/ctrf-io/ctrf)

## 🆘 Support

Issues with the demo? Check:
1. Console output for specific errors
2. `ctrf/ctrf-report.json` for test details
3. OpenCode logs: `~/.local/share/opencode/log/`
4. Ollama status: `ollama list`

Or run the full diagnostic:
```bash
npm run demo:reset
npm run demo:setup
HEAL_AUTO_ACCEPT=true DEBUG_HEAL=true npm run heal:local
```