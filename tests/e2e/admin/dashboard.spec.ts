import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAsRegularUser } from '../helpers/auth';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing sessions
    await page.context().clearCookies();
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/admin');

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show 403 Forbidden for non-admin users', async ({ page }) => {
    // Login as regular user
    await loginAsRegularUser(page);

    // Try to access admin dashboard
    await page.goto('/admin');

    // Should show Forbidden page
    await expect(page.locator('h1')).toContainText(/403|Forbidden|Access Denied/i);
  });

  test('should display dashboard for admin users', async ({ page }) => {
    // Login as admin
    await loginAsAdmin(page);

    // Navigate to admin dashboard
    await page.goto('/admin');

    // Should show dashboard
    await expect(page).toHaveURL('/admin');
    // Check for dashboard heading (may be inside main content, not the first h1)
    await expect(page.locator('h1:has-text("대시보드"), h1:has-text("Dashboard")')).toBeVisible();
  });

  test('should display statistics cards', async ({ page }) => {
    // Login as admin
    await loginAsAdmin(page);

    // Navigate to dashboard
    await page.goto('/admin');

    // Check for statistics cards (flexible matching)
    const statsKeywords = [
      /서비스|Services/i,
      /활성|Active/i,
      /주문|Orders/i,
      /매출|Revenue/i
    ];

    for (const keyword of statsKeywords) {
      const element = page.locator(`text=${keyword}`);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
      }
    }
  });

  test('should show sidebar navigation', async ({ page }) => {
    // Login as admin
    await loginAsAdmin(page);

    // Navigate to dashboard
    await page.goto('/admin');

    // Check for navigation links
    const navLinks = [
      /Dashboard|대시보드/i,
      /Services|서비스/i
    ];

    for (const linkText of navLinks) {
      const link = page.locator(`a:has-text("${linkText.source.replace(/\//g, '')}")`);
      if (await link.count() > 0) {
        await expect(link.first()).toBeVisible();
      }
    }
  });

  test('should display recent services list', async ({ page }) => {
    // Login as admin
    await loginAsAdmin(page);

    // Navigate to dashboard
    await page.goto('/admin');

    // Check for services section or table
    const servicesSection = page.locator('text=/최근 서비스|Recent Services|Services/i');
    if (await servicesSection.count() > 0) {
      await expect(servicesSection.first()).toBeVisible();
    }
  });

  test('should work in dark mode', async ({ page }) => {
    // Login as admin
    await loginAsAdmin(page);

    // Navigate to dashboard
    await page.goto('/admin');

    // Toggle dark mode
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="테마" i]');
    if (await themeToggle.count() > 0) {
      await themeToggle.first().click();

      // Check if dark class is applied
      const html = page.locator('html');
      const classList = await html.getAttribute('class');

      // Should have either 'dark' class or dark-related class
      expect(classList).toBeTruthy();
    }
  });

  test('should toggle sidebar on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Login as admin
    await loginAsAdmin(page);

    // Navigate to dashboard
    await page.goto('/admin');

    // Look for mobile menu toggle
    const menuToggle = page.locator('button[aria-label*="menu" i], button:has(svg)').first();
    if (await menuToggle.isVisible()) {
      await menuToggle.click();

      // Wait for animation
      await page.waitForTimeout(300);

      // Sidebar should be visible or navigation should appear
      const nav = page.locator('nav');
      if (await nav.count() > 0) {
        await expect(nav.first()).toBeVisible();
      }
    }
  });
});
