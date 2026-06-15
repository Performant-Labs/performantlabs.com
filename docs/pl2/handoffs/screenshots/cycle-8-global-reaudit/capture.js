// Playwright capture for Phase 8 global re-audit
// Captures full-page PNG for live and preview at 1280x800, 768x1024, 375x667.
const { chromium } = require('playwright');

const OUT = __dirname;
const DATE = '20260511';

const targets = [
  { name: 'live',    url: 'https://pl-performantlabs.com.3.ddev.site:8493/' },
  { name: 'preview', url: 'http://localhost:8765/homepage.html' },
];
const viewports = [
  { label: '1280', width: 1280, height: 800 },
  { label: '768',  width: 768,  height: 1024 },
  { label: '375',  width: 375,  height: 667 },
];

(async () => {
  const browser = await chromium.launch({ args: ['--ignore-certificate-errors'] });
  for (const t of targets) {
    for (const v of viewports) {
      const ctx = await browser.newContext({
        viewport: { width: v.width, height: v.height },
        deviceScaleFactor: 1,
        ignoreHTTPSErrors: true,
      });
      const page = await ctx.newPage();
      await page.goto(t.url, { waitUntil: 'networkidle', timeout: 30000 });
      // Disable smooth scroll / animation for a stable capture
      await page.addStyleTag({ content: '*{animation-duration:0s !important; transition-duration:0s !important;}' });
      await page.waitForTimeout(500);
      const file = `${OUT}/t3-homepage-${v.label}-${t.name}-${DATE}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log('wrote', file);
      await ctx.close();
    }
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
