import { chromium } from 'playwright';

const BASE = 'https://pl-performantlabs.com.3.ddev.site:8493';
const pages = ['/', '/services', '/how-we-do-it', '/open-source-projects'];
const widths = [375, 320];

const browser = await chromium.launch();
for (const w of widths) {
  for (const p of pages) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: 667 },
      deviceScaleFactor: 1,
      ignoreHTTPSErrors: true,
    });
    const page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const data = await page.evaluate(() => {
      window.scrollTo(9999, 0);
      return {
        scrollX: window.scrollX,
        innerWidth: window.innerWidth,
        docScroll: document.documentElement.scrollWidth,
        docClient: document.documentElement.clientWidth,
        docOffset: document.documentElement.offsetWidth,
        bodyScroll: document.body.scrollWidth,
        bodyClient: document.body.clientWidth,
      };
    });
    console.log(`${p} @ ${w}: scrollX=${data.scrollX} iw=${data.innerWidth} docScroll=${data.docScroll} docClient=${data.docClient} bodyScroll=${data.bodyScroll}`);
    await ctx.close();
  }
}
await browser.close();
