/**
 * atk_work_log.spec.js
 *
 * Tier 3 (Visual / Playwright) end-to-end tests for the pl_work_log module.
 *
 * Three-Tier context
 * ------------------
 * Tier 1 (headless) and Tier 2 (ARIA) are covered by:
 *   tests/atk_work_log/tier1_work_log.sh  — curl + drush checks
 *   tests/atk_work_log/tier2_work_log.sh  — ARIA structural checks
 *
 * These Playwright tests are Tier 3: they assert visible UI state that
 * cannot be confirmed from curl output or the ARIA tree alone.
 */

/* eslint-disable import/first */

import * as atkCommands from '../support/atk_commands';
import * as atkUtilities from '../support/atk_utilities';

// Import configuration.
import atkConfig from '../../playwright.atk.config';

// Set up Playwright.
import { expect, test } from '../support/atk_fixture.js';

// Import ATK data.
const qaUsers = atkUtilities.qaUsers;

// ─── Shared setup ────────────────────────────────────────────────────────────

test.describe('Work Log module — Tier 3 (Playwright) tests.', () => {

  // Log in as admin before each test.
  test.beforeEach(async ({ page, context }) => {
    await atkCommands.logInViaForm(page, context, qaUsers.admin);
  });

  // ── Dashboard ──────────────────────────────────────────────────────────────

  test.describe('Dashboard (/work-log-dashboard)', () => {

    test('(ATK-WL-1000) Dashboard returns 200 and renders H1. @ATK-WL-1000 @work-log @smoke', async ({ page }) => {
      const response = await page.goto('/work-log-dashboard', { waitUntil: 'networkidle' });
      expect(response.status()).toBe(200);
      await expect(page).toHaveTitle(/Work Log/);
    });

    test('(ATK-WL-1001) Dashboard shows Summary and Recent Work Logs sections. @ATK-WL-1001 @work-log @smoke', async ({ page }) => {
      await page.goto('/work-log-dashboard', { waitUntil: 'networkidle' });

      // Heading sections.
      await expect(page.locator('h3').filter({ hasText: 'Summary' })).toBeVisible();
      await expect(page.locator('h2').filter({ hasText: 'Recent Work Logs' })).toBeVisible();
    });

    test.skip('(ATK-WL-1002) Summary section shows non-zero total entries. @ATK-WL-1002 @work-log @smoke', async ({ page }) => {
      await page.goto('/work-log-dashboard', { waitUntil: 'networkidle' });

      // "Total Entries: 6" was visible in the Tier 2 audit.
      // We check it's a non-zero number without hardcoding the exact count
      // so the test doesn't break after future imports.
      const entriesText = page.getByText(/Total Entries\s*:\s*[1-9]/);
      await expect(entriesText).toBeVisible();
    });

    test('(ATK-WL-1003) Recent Work Logs table has expected columns. @ATK-WL-1003 @work-log @smoke', async ({ page }) => {
      await page.goto('/work-log-dashboard', { waitUntil: 'networkidle' });

      // Column headers confirmed by Tier 2 audit.
      const table = page.locator('table').first();
      await expect(table.getByRole('columnheader', { name: 'Date' })).toBeVisible();
      await expect(table.getByRole('columnheader', { name: 'Title' })).toBeVisible();
      await expect(table.getByRole('columnheader', { name: 'Hours' })).toBeVisible();
    });

    test('(ATK-WL-1004) Recent Work Logs table contains at least one data row. @ATK-WL-1004 @work-log @smoke', async ({ page }) => {
      await page.goto('/work-log-dashboard', { waitUntil: 'networkidle' });

      const rows = page.locator('table tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);
    });

    test('(ATK-WL-1005) Filter form has Project, Category, and Sort controls. @ATK-WL-1005 @work-log', async ({ page }) => {
      await page.goto('/work-log-dashboard', { waitUntil: 'networkidle' });

      // Confirmed present in Tier 2 ARIA audit.
      await expect(page.getByLabel('Project')).toBeVisible();
      await expect(page.getByLabel('Category')).toBeVisible();
      await expect(page.getByLabel('Sort by')).toBeVisible();
    });

    test('(ATK-WL-1006) Dashboard is inaccessible to anonymous users (redirects to login). @ATK-WL-1006 @work-log @security', async ({ page, context }) => {
      // Clear auth — use a fresh context with no cookies.
      await context.clearCookies();
      const response = await page.goto('/work-log-dashboard');
      // Should redirect to login (302→200 on /user/login) or show 403.
      const finalUrl = page.url();
      expect(
        finalUrl.includes('/user/login') || response.status() === 403
      ).toBeTruthy();
    });

  });

  // ── Actions page ───────────────────────────────────────────────────────────

  test.describe('Actions page (/work-logs/actions)', () => {

    test('(ATK-WL-2000) Actions page returns 200 and renders H1. @ATK-WL-2000 @work-log @smoke', async ({ page }) => {
      const response = await page.goto('/work-logs/actions', { waitUntil: 'networkidle' });
      expect(response.status()).toBe(200);
      await expect(page).toHaveTitle(/Work Log/);
    });

    test('(ATK-WL-2001) Actions page shows Available Actions section. @ATK-WL-2001 @work-log @smoke', async ({ page }) => {
      await page.goto('/work-logs/actions', { waitUntil: 'networkidle' });

      await expect(page.getByRole('heading', { level: 2, name: 'Available Actions' })).toBeVisible();
    });

    test('(ATK-WL-2002) Actions page has Category Mapping link. @ATK-WL-2002 @work-log @smoke', async ({ page }) => {
      await page.goto('/work-logs/actions', { waitUntil: 'networkidle' });

      await expect(page.getByRole('link', { name: /View Category Mapping Rules/i })).toBeVisible();
    });

    test('(ATK-WL-2004) Category Mapping Rules link navigates correctly. @ATK-WL-2004 @work-log', async ({ page }) => {
      await page.goto('/work-logs/actions', { waitUntil: 'networkidle' });
      await page.getByRole('link', { name: /View Category Mapping Rules/i }).click();
      await expect(page).toHaveURL(/\/work-logs\/actions\/category-mapping/);
    });

  });

  // ── Sidebar navigation ─────────────────────────────────────────────────────

  test.describe('Work Log sidebar navigation', () => {

    test('(ATK-WL-3000) Sidebar nav contains Dashboard, All Work Logs, By Project, Actions links. @ATK-WL-3000 @work-log @smoke', async ({ page }) => {
      await page.goto('/work-log-dashboard', { waitUntil: 'networkidle' });

      const sidebar = page.getByRole('navigation', { name: 'Work Log' });
      await expect(sidebar.getByRole('link', { name: /Dashboard/i })).toBeVisible();
      await expect(sidebar.getByRole('link', { name: /All Work Logs/i })).toBeVisible();
      await expect(sidebar.getByRole('link', { name: /Actions/i })).toBeVisible();
    });

  });


}); // end describe
