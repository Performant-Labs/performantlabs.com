import { test, expect } from '@playwright/test';

test.describe('Demo: LLM Test Healing for Drupal Site', () => {
  test('ATK-PW-DEMO-001 - Verify homepage critical elements', async ({ page }) => {
    await page.goto('https://performant-labs.ddev.site:8493');
    
    // 1. BANNER TITLE - Text content changed
    const bannerTitle = page.locator('[data-testid="banner-title"]');
    await expect(bannerTitle).toHaveText('Performant Labs - Building Amazing Websites');
    
    // 2. NAVIGATION MENU - Structure changed
    const mainNav = page.locator('#main-navigation');
    await expect(mainNav).toBeVisible();
    
    // 3. LEARN MORE BUTTON - Href changed
    const learnMoreButton = page.locator('[data-testid="learn-more-button"]');
    await expect(learnMoreButton).toHaveAttribute('href', '/about-us');
    
    // 4. EXPERTISE SECTION - Layout changed
    const expertiseSection = page.locator('.expertise-section');
    await expect(expertiseSection).toBeVisible();
    
    // 5. CLIENTS SECTION - Content changed
    const clients = page.locator('[data-testid="clients"]');
    await expect(clients).toHaveCount(10);
    
    // 6. PERFORMANCE ISSUE - Unnecessary wait
    await page.waitForLoadState('networkidle');
    
    // 7. MISSING PROPER WAITING
    // Should have: await page.waitForLoadState('networkidle');
    
    // 8. PAGE TITLE - Changed
    await expect(page).toHaveTitle('Home | Performant Labs');
  });
});