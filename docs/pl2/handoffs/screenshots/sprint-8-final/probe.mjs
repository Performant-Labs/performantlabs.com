import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'https://pl-performantlabs.com.3.ddev.site:8493';
const OUT = '/Users/andreangelantoni/Sites/pl-performantlabs.com.3/docs/pl2/handoffs/screenshots/sprint-8-final';
mkdirSync(OUT, { recursive: true });

// Sprint 8 final baseline: link integrity + heading-hierarchy are the binding
// signals (already verified by T). Visual sanity narrowed to /contact-us
// (J.2 page-title-in-main carry-forward) + footer chrome at 1280 and 375.
const pages = [
  { slug: 'contact-us', path: '/contact-us' },
  { slug: 'home', path: '/' }, // footer chrome reference; same on every page
];
const viewports = [
  { w: 375, h: 667 },
  { w: 1280, h: 800 },
];

const probeFn = () => {
  window.scrollTo(9999, 0);
  const scrollXAfter = window.scrollX;
  window.scrollTo(0, 0);
  const vw = window.innerWidth;
  const docScroll = document.documentElement.scrollWidth;
  const docClient = document.documentElement.clientWidth;
  const offenders = [];
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 && r.width > 0) {
      let p = el.parentElement; let inHealFlow = false;
      while (p) {
        if (p.classList && p.classList.contains('heal-flow')) { inHealFlow = true; break; }
        p = p.parentElement;
      }
      if (inHealFlow) return;
      let sel = el.tagName.toLowerCase();
      if (el.id) sel += '#' + el.id;
      if (el.className && typeof el.className === 'string') {
        const cls = el.className.trim().split(/\s+/).slice(0, 3).join('.');
        if (cls) sel += '.' + cls;
      }
      offenders.push({ sel, right: Math.round(r.right), overflowBy: Math.round(r.right - vw) });
    }
  });
  const h1 = document.querySelector('main h1') || document.querySelector('h1');
  let h1Info = null;
  if (h1) {
    const r = h1.getBoundingClientRect();
    h1Info = {
      text: (h1.textContent || '').trim().slice(0, 80),
      inMain: !!h1.closest('main'),
      left: Math.round(r.left), right: Math.round(r.right),
      inViewport: r.left >= 0 && r.right <= vw + 1,
    };
  }
  const h1Count = document.querySelectorAll('h1').length;
  const h1InMainCount = document.querySelectorAll('main h1').length;
  // Footer presence + signature CTA
  const footer = document.querySelector('footer');
  let footerInfo = null;
  if (footer) {
    const r = footer.getBoundingClientRect();
    const cta = footer.querySelector('a[href="/contact-us"]');
    const ctaR = cta ? cta.getBoundingClientRect() : null;
    footerInfo = {
      present: true,
      width: Math.round(r.width),
      bottomCTA: cta ? {
        text: (cta.textContent || '').trim().slice(0, 40),
        href: cta.getAttribute('href'),
        width: Math.round(ctaR.width),
        height: Math.round(ctaR.height),
      } : null,
    };
  }
  return { vw, docScroll, docClient, scrollXAfter, offenderCount: offenders.length, offenders: offenders.slice(0, 5), h1: h1Info, h1Count, h1InMainCount, footer: footerInfo };
};

const results = {};
const browser = await chromium.launch();
for (const v of viewports) {
  for (const pg of pages) {
    const context = await browser.newContext({
      viewport: { width: v.w, height: v.h },
      deviceScaleFactor: 1,
      ignoreHTTPSErrors: true,
    });
    const page = await context.newPage();
    const url = BASE + pg.path;
    console.log(`Probing ${url} at ${v.w}x${v.h}`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(500);
    const data = await page.evaluate(probeFn);
    const shotPath = join(OUT, `t3-${pg.slug}-${v.w}-live-20260512.png`);
    await page.screenshot({ path: shotPath, fullPage: true });
    results[`${pg.slug}@${v.w}`] = { url, viewport: v.w, ...data };
    await context.close();
  }
}
await browser.close();
writeFileSync(join(OUT, 'probe-results.json'), JSON.stringify(results, null, 2));
console.log('Done.');
