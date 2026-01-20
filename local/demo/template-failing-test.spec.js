import { test, expect } from '@playwright/test';

test.describe('Demo: LLM Test Healing for Drupal Site', () => {
  test('ATK-PW-DEMO-001 - Verify homepage critical elements', async ({ page }) => {
    // This test will fail because it uses outdated selectors and expectations
    // based on common Drupal site changes
    
    await page.goto('https://performant-labs.ddev.site:8493');
    
    // 1. BANNER TITLE - Text content changed
    // Current: "Performant Labs builds and tests world-class websites"
    // Old expectation (will fail):
    const bannerTitle = page.locator('.pl-banner--title');
    await expect(bannerTitle).toHaveText('Performant Labs - Building Amazing Websites');
    
    // 2. NAVIGATION MENU - Structure changed
    // Current: #block-mainnavigation with specific links
    // Old selector (will fail):
    const mainNav = page.locator('#main-navigation'); // Wrong ID
    await expect(mainNav).toBeVisible();
    
    // 3. LEARN MORE BUTTON - Href changed
    // Current: href="/about-us"
    // Old expectation (will fail):
    const learnMoreButton = page.locator('.default-button');
    await expect(learnMoreButton).toHaveAttribute('href', '/learn-more'); // Wrong href
    
    // 4. EXPERTISE SECTION - Layout changed
    // Current: 3 columns with specific text
    // Old expectation (will fail):
    const expertiseSection = page.locator('.expertise-section'); // Wrong class
    await expect(expertiseSection).toBeVisible();
    
    // 5. CLIENTS SECTION - Content changed
    // Current: .clients-block with client logos
    // Old expectation (will fail):
    const clients = page.locator('.client-logos'); // Wrong selector
    await expect(clients).toHaveCount(10); // Wrong count
    
    // 6. PERFORMANCE ISSUE - Unnecessary wait
    await page.waitForTimeout(3000); // Should use proper waiting
    
    // 7. MISSING PROPER WAITING
    // Should have: await page.waitForLoadState('networkidle')
    
    // 8. PAGE TITLE - Changed
    // Current: "Frontpage | Performant Labs"
    // Old expectation (will fail):
    await expect(page).toHaveTitle('Home | Performant Labs');
  });
});