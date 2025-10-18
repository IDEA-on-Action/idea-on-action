/**
 * Visual Regression Tests - Dark Mode
 *
 * Tests theme switching functionality and dark mode appearance
 */

import { test, expect } from '@playwright/test';

test.describe('Dark Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should toggle dark mode on homepage', async ({ page }) => {
    // Get initial theme (using data-theme attribute)
    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');

    // Find theme toggle button (dropdown trigger)
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="테마" i]').first();
    await expect(themeToggle).toBeVisible();

    // Click to open dropdown menu
    await themeToggle.click();
    await page.waitForTimeout(300);

    // Select dark mode from dropdown
    const darkOption = page.getByRole('menuitem', { name: /다크|dark/i });
    await expect(darkOption).toBeVisible();
    await darkOption.click();
    await page.waitForTimeout(500);

    // Check if theme changed to dark
    const darkTheme = await html.getAttribute('data-theme');
    expect(darkTheme).toBe('dark');

    // Should have 'dark' class
    const hasDarkClass = await html.evaluate((el) => el.classList.contains('dark'));
    expect(hasDarkClass).toBeTruthy();

    // Toggle back to light
    await themeToggle.click();
    await page.waitForTimeout(300);

    const lightOption = page.getByRole('menuitem', { name: /라이트|light/i });
    await expect(lightOption).toBeVisible();
    await lightOption.click();
    await page.waitForTimeout(500);

    const finalTheme = await html.getAttribute('data-theme');
    expect(finalTheme).toBe('light');
  });

  test('should persist dark mode across navigation', async ({ page }) => {
    // Enable dark mode
    const html = page.locator('html');
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="테마" i]').first();

    await themeToggle.click();
    await page.waitForTimeout(300);

    const darkOption = page.getByRole('menuitem', { name: /다크|dark/i });
    await expect(darkOption).toBeVisible();
    await darkOption.click();
    await page.waitForTimeout(500);

    const darkTheme = await html.getAttribute('data-theme');
    expect(darkTheme).toBe('dark');

    // Navigate to services page
    await page.goto('/services');
    await page.waitForTimeout(500);

    // Check if dark mode persisted
    const servicesTheme = await html.getAttribute('data-theme');
    expect(servicesTheme).toBe(darkTheme);

    // Navigate to about section
    await page.goto('/#about');
    await page.waitForTimeout(500);

    const aboutTheme = await html.getAttribute('data-theme');
    expect(aboutTheme).toBe(darkTheme);
  });

  test('should apply dark mode styles to all components', async ({ page }) => {
    // Enable dark mode
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="테마" i]').first();
    await themeToggle.click();
    await page.waitForTimeout(300);

    const darkOption = page.getByRole('menuitem', { name: /다크|dark/i });
    await expect(darkOption).toBeVisible();
    await darkOption.click();
    await page.waitForTimeout(500);

    // Check header has dark background
    const header = page.locator('header, nav').first();
    const headerBg = await header.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Dark mode should have darker backgrounds (not white)
    expect(headerBg).not.toBe('rgb(255, 255, 255)');

    // Check if cards have dark styling
    const cards = page.locator('.glass-card, [class*="card"]').first();
    if (await cards.count() > 0) {
      const cardBg = await cards.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      expect(cardBg).not.toBe('rgb(255, 255, 255)');
    }
  });

  test('should toggle dark mode in services page', async ({ page }) => {
    await page.goto('/services');

    const html = page.locator('html');
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="테마" i]').first();

    // Get initial state
    const initialTheme = await html.getAttribute('data-theme');

    // Toggle dark mode via dropdown
    await themeToggle.click();
    await page.waitForTimeout(300);

    const darkOption = page.getByRole('menuitem', { name: /다크|dark/i });
    await expect(darkOption).toBeVisible();
    await darkOption.click();
    await page.waitForTimeout(500);

    const darkTheme = await html.getAttribute('data-theme');
    expect(darkTheme).toBe('dark');

    // Verify service cards are visible in dark mode
    const serviceCards = page.locator('[class*="service"], [class*="card"]');
    if (await serviceCards.count() > 0) {
      await expect(serviceCards.first()).toBeVisible();
    }
  });

  test('should maintain readability in dark mode', async ({ page }) => {
    // Enable dark mode
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="테마" i]').first();
    await themeToggle.click();
    await page.waitForTimeout(300);

    const darkOption = page.getByRole('menuitem', { name: /다크|dark/i });
    await expect(darkOption).toBeVisible();
    await darkOption.click();
    await page.waitForTimeout(500);

    // Check text elements have sufficient contrast
    const headings = page.locator('h1, h2, h3').first();
    if (await headings.count() > 0) {
      const color = await headings.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      // Text should not be black in dark mode
      expect(color).not.toBe('rgb(0, 0, 0)');
    }

    // Check body text
    const paragraphs = page.locator('p').first();
    if (await paragraphs.count() > 0) {
      const color = await paragraphs.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      // Text should be light in dark mode
      expect(color).not.toBe('rgb(0, 0, 0)');
    }
  });

  test('should handle system theme preference', async ({ page }) => {
    // This test checks if the theme toggle supports system preference
    const html = page.locator('html');

    // Initial state (should have data-theme attribute)
    const initialTheme = await html.getAttribute('data-theme');
    expect(initialTheme).toBeTruthy();
    expect(['light', 'dark']).toContain(initialTheme);

    // Theme toggle should exist
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="테마" i]').first();
    await expect(themeToggle).toBeVisible();

    // Switch to dark mode
    await themeToggle.click();
    await page.waitForTimeout(300);

    const darkOption = page.getByRole('menuitem', { name: /다크|dark/i });
    await expect(darkOption).toBeVisible();
    await darkOption.click();
    await page.waitForTimeout(500);

    const darkTheme = await html.getAttribute('data-theme');
    expect(darkTheme).toBe('dark');

    // Switch back to light mode
    await themeToggle.click();
    await page.waitForTimeout(300);

    const lightOption = page.getByRole('menuitem', { name: /라이트|light/i });
    await expect(lightOption).toBeVisible();
    await lightOption.click();
    await page.waitForTimeout(500);

    const lightTheme = await html.getAttribute('data-theme');
    expect(lightTheme).toBe('light');
  });

  test('should work in admin dashboard', async ({ page }) => {
    // Note: This test requires authentication
    // Skip if not logged in, otherwise test dark mode in admin

    await page.goto('/admin');

    // Check if redirected to login (not authenticated)
    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    // If on admin page, test dark mode
    const html = page.locator('html');
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="테마" i]').first();

    if (await themeToggle.count() > 0) {
      const initialTheme = await html.getAttribute('data-theme');

      await themeToggle.click();
      await page.waitForTimeout(300);

      const darkOption = page.getByRole('menuitem', { name: /다크|dark/i });
      await expect(darkOption).toBeVisible();
      await darkOption.click();
      await page.waitForTimeout(500);

      const darkTheme = await html.getAttribute('data-theme');
      expect(darkTheme).toBe('dark');
      expect(darkTheme).not.toBe(initialTheme);
    }
  });

  test('should take screenshot in both light and dark modes', async ({ page }) => {
    // Light mode screenshot
    await expect(page).toHaveScreenshot('homepage-light.png', {
      fullPage: false,
      maxDiffPixels: 100
    });

    // Toggle to dark mode
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="테마" i]').first();
    await themeToggle.click();
    await page.waitForTimeout(300);

    const darkOption = page.getByRole('menuitem', { name: /다크|dark/i });
    await expect(darkOption).toBeVisible();
    await darkOption.click();
    await page.waitForTimeout(500);

    // Dark mode screenshot
    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: false,
      maxDiffPixels: 100
    });
  });
});
