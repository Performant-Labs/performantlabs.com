import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'https://pl-performantlabs.com.3.ddev.site:8493';
const OUT = '/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/screenshots/sprint-7-cycle-1';
mkdirSync(OUT, { recursive: true });

const pages = [
  { slug: 'home', path: '/' },
  { slug: 'services', path: '/services' },
  { slug: 'how-we-do-it', path: '/how-we-do-it' },
  { slug: 'open-source-projects', path: '/open-source-projects' },
];
const widths = [375, 320];

const enumerateOffendersFn = () => {
  const vw = window.innerWidth;
  const docScroll = document.documentElement.scrollWidth;
  const docClient = document.documentElement.clientWidth;
  const bodyScroll = document.body.scrollWidth;
  const bodyClient = document.body.clientWidth;
  const offenders = [];
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 && r.width > 0) {
      // Build a short selector
      let sel = el.tagName.toLowerCase();
      if (el.id) sel += '#' + el.id;
      if (el.className && typeof el.className === 'string') {
        const cls = el.className.trim().split(/\s+/).slice(0, 4).join('.');
        if (cls) sel += '.' + cls;
      }
      // Parent chain (3)
      const parents = [];
      let p = el.parentElement; let depth = 0;
      while (p && depth < 3) {
        let psel = p.tagName.toLowerCase();
        if (p.id) psel += '#' + p.id;
        if (p.className && typeof p.className === 'string') {
          const c = p.className.trim().split(/\s+/).slice(0, 3).join('.');
          if (c) psel += '.' + c;
        }
        const pstyle = getComputedStyle(p);
        parents.push({ sel: psel, display: pstyle.display, minWidth: pstyle.minWidth, overflowX: pstyle.overflowX });
        p = p.parentElement; depth++;
      }
      const cs = getComputedStyle(el);
      offenders.push({
        sel,
        right: Math.round(r.right),
        left: Math.round(r.left),
        width: Math.round(r.width),
        overflowBy: Math.round(r.right - vw),
        display: cs.display,
        position: cs.position,
        minWidth: cs.minWidth,
        whiteSpace: cs.whiteSpace,
        overflowX: cs.overflowX,
        parents,
      });
    }
  });
  // Sort by right edge descending, then dedupe by selector keeping widest
  offenders.sort((a, b) => b.right - a.right);
  return { vw, docScroll, docClient, bodyScroll, bodyClient, offenders: offenders.slice(0, 40) };
};

const results = {};

const browser = await chromium.launch();
for (const w of widths) {
  for (const pg of pages) {
    const context = await browser.newContext({
      viewport: { width: w, height: 667 },
      deviceScaleFactor: 1,
      ignoreHTTPSErrors: true,
    });
    const page = await context.newPage();
    const url = BASE + pg.path;
    console.log(`Probing ${url} at ${w}px`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(500);
    const data = await page.evaluate(enumerateOffendersFn);
    const shotPath = join(OUT, `t3-${pg.slug}-${w}-live-20260512.png`);
    await page.screenshot({ path: shotPath, fullPage: true });
    results[`${pg.slug}@${w}`] = { url, viewport: w, ...data, screenshot: shotPath };
    await context.close();
  }
}
await browser.close();

writeFileSync(join(OUT, 'probe-results.json'), JSON.stringify(results, null, 2));
console.log('Done. Results written.');
