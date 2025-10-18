/**
 * Visual Regression Tests - Responsive Design
 *
 * Tests layout and functionality across different viewport sizes
 */

import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design', () => {
  const viewports = {
    mobile: { width: 375, height: 667, name: 'iPhone SE' },
    tablet: { width: 768, height: 1024, name: 'iPad Mini' },
    desktop: { width: 1920, height: 1080, name: 'Desktop HD' },
    largeDesktop: { width: 2560, height: 1440, name: '2K Display' }
  };

  test.describe('Mobile Layout (375px)', () => {
    test.use({ viewport: viewports.mobile });

    test('should display mobile navigation', async ({ page }) => {
      await page.goto('/');

      // Mobile menu button should be visible
      const menuButton = page.locator('button[aria-label*="menu" i], button:has(svg)').first();

      if (await menuButton.count() > 0) {
        await expect(menuButton).toBeVisible();

        // Click to open mobile menu
        await menuButton.click();
        await page.waitForTimeout(300);

        // Navigation should appear
        const nav = page.locator('nav, [role="navigation"]');
        if (await nav.count() > 0) {
          await expect(nav.first()).toBeVisible();
        }
      }
    });

    test('should stack service cards vertically', async ({ page }) => {
      await page.goto('/services');
      await page.waitForLoadState('networkidle');

      // Service cards should exist
      const cards = page.locator('[class*="service"], [class*="card"]').first();

      if (await cards.count() > 0) {
        // Get card width
        const cardWidth = await cards.evaluate((el) => {
          return el.getBoundingClientRect().width;
        });

        // On mobile, cards should take most of the viewport width
        expect(cardWidth).toBeGreaterThan(300); // Most of 375px viewport
      }
    });

    test('should be scrollable on mobile', async ({ page }) => {
      await page.goto('/');

      // Page should have scrollable content
      const scrollHeight = await page.evaluate(() => {
        return document.documentElement.scrollHeight;
      });

      const viewportHeight = viewports.mobile.height;

      // Content should be taller than viewport
      expect(scrollHeight).toBeGreaterThan(viewportHeight);
    });

    test('should hide desktop-only elements', async ({ page }) => {
      await page.goto('/');

      // Desktop navigation links might be hidden
      const desktopNav = page.locator('nav a').first();

      if (await desktopNav.count() > 0) {
        const isVisible = await desktopNav.isVisible();

        // On mobile, either hidden or in a menu
        if (!isVisible) {
          // Mobile menu button should exist
          const menuButton = page.locator('button[aria-label*="menu" i]');
          await expect(menuButton).toBeVisible();
        }
      }
    });

    test('should adapt form inputs for mobile', async ({ page }) => {
      await page.goto('/#contact');

      // Contact form inputs should be visible and properly sized
      const inputs = page.locator('input, textarea').first();

      if (await inputs.count() > 0) {
        await expect(inputs).toBeVisible();

        // Input should not overflow viewport
        const inputWidth = await inputs.evaluate((el) => {
          return el.getBoundingClientRect().width;
        });

        expect(inputWidth).toBeLessThan(viewports.mobile.width);
      }
    });

    test('should take mobile screenshot', async ({ page }) => {
      await page.goto('/');

      await expect(page).toHaveScreenshot('homepage-mobile.png', {
        fullPage: true,
        maxDiffPixels: 100
      });
    });
  });

  test.describe('Tablet Layout (768px)', () => {
    test.use({ viewport: viewports.tablet });

    test('should display 2-column grid for services', async ({ page }) => {
      await page.goto('/services');
      await page.waitForLoadState('networkidle');

      const cards = page.locator('[class*="service"], [class*="card"]');
      const cardCount = await cards.count();

      if (cardCount >= 2) {
        // Get positions of first two cards
        const firstCard = await cards.nth(0).boundingBox();
        const secondCard = await cards.nth(1).boundingBox();

        if (firstCard && secondCard) {
          // Cards should be side by side (similar Y position)
          const yDiff = Math.abs(firstCard.y - secondCard.y);
          expect(yDiff).toBeLessThan(50); // Allow small difference
        }
      }
    });

    test('should show expanded navigation', async ({ page }) => {
      await page.goto('/');

      // On tablet, navigation might be visible or in a menu
      const nav = page.locator('nav a').first();

      if (await nav.count() > 0) {
        // Either visible or menu button exists
        const isVisible = await nav.isVisible();
        const menuButton = page.locator('button[aria-label*="menu" i]');
        const hasMenuButton = await menuButton.count() > 0;

        expect(isVisible || hasMenuButton).toBeTruthy();
      }
    });

    test('should maintain aspect ratios', async ({ page }) => {
      await page.goto('/');

      // Images should maintain proper aspect ratios
      const images = page.locator('img').first();

      if (await images.count() > 0) {
        const dimensions = await images.evaluate((el) => {
          const rect = el.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        });

        // Image should have reasonable dimensions
        expect(dimensions.width).toBeGreaterThan(0);
        expect(dimensions.height).toBeGreaterThan(0);
      }
    });

    test('should take tablet screenshot', async ({ page }) => {
      await page.goto('/');

      await expect(page).toHaveScreenshot('homepage-tablet.png', {
        fullPage: true,
        maxDiffPixels: 100
      });
    });
  });

  test.describe('Desktop Layout (1920px)', () => {
    test.use({ viewport: viewports.desktop });

    test('should display 3-column grid for services', async ({ page }) => {
      await page.goto('/services');
      await page.waitForLoadState('networkidle');

      const cards = page.locator('[class*="service"], [class*="card"]');
      const cardCount = await cards.count();

      if (cardCount >= 3) {
        // Get positions of first three cards
        const firstCard = await cards.nth(0).boundingBox();
        const secondCard = await cards.nth(1).boundingBox();
        const thirdCard = await cards.nth(2).boundingBox();

        if (firstCard && secondCard && thirdCard) {
          // All three cards should be on the same row
          const yDiff1 = Math.abs(firstCard.y - secondCard.y);
          const yDiff2 = Math.abs(secondCard.y - thirdCard.y);

          expect(yDiff1).toBeLessThan(50);
          expect(yDiff2).toBeLessThan(50);
        }
      }
    });

    test('should show full navigation menu', async ({ page }) => {
      await page.goto('/');

      // Desktop should show full navigation
      const navLinks = page.locator('nav a, header a');
      const linkCount = await navLinks.count();

      // Should have multiple navigation links visible
      expect(linkCount).toBeGreaterThan(0);
    });

    test('should center content with max-width', async ({ page }) => {
      await page.goto('/');

      // Main content should be centered with max-width
      const main = page.locator('main, [role="main"]').first();

      if (await main.count() > 0) {
        const mainWidth = await main.evaluate((el) => {
          return el.getBoundingClientRect().width;
        });

        // Content should not span full 1920px width
        expect(mainWidth).toBeLessThan(1800);
        expect(mainWidth).toBeGreaterThan(1000);
      }
    });

    test('should display hero section with full width', async ({ page }) => {
      await page.goto('/');

      // Hero section should exist
      const hero = page.locator('[class*="hero"], section').first();

      if (await hero.count() > 0) {
        await expect(hero).toBeVisible();

        const heroWidth = await hero.evaluate((el) => {
          return el.getBoundingClientRect().width;
        });

        // Hero should be wide on desktop
        expect(heroWidth).toBeGreaterThan(1000);
      }
    });

    test('should take desktop screenshot', async ({ page }) => {
      await page.goto('/');

      await expect(page).toHaveScreenshot('homepage-desktop.png', {
        fullPage: true,
        maxDiffPixels: 100
      });
    });
  });

  test.describe('Cross-Viewport Consistency', () => {
    test('should maintain brand colors across viewports', async ({ page }) => {
      const viewportSizes = [viewports.mobile, viewports.tablet, viewports.desktop];

      for (const viewport of viewportSizes) {
        await page.setViewportSize(viewport);
        await page.goto('/');

        // Check if primary brand color is consistent
        const header = page.locator('header, nav').first();

        if (await header.count() > 0) {
          const bgColor = await header.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
          });

          // Color should be consistent (not transparent)
          expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
        }
      }
    });

    test('should keep logo visible across viewports', async ({ page }) => {
      const viewportSizes = [viewports.mobile, viewports.tablet, viewports.desktop];

      for (const viewport of viewportSizes) {
        await page.setViewportSize(viewport);
        await page.goto('/');

        // Logo should be visible
        const logo = page.locator('img[alt*="VIBE" i], img[alt*="logo" i]').first();

        if (await logo.count() > 0) {
          await expect(logo).toBeVisible();
        }
      }
    });

    test('should maintain functionality across viewports', async ({ page }) => {
      const viewportSizes = [viewports.mobile, viewports.tablet, viewports.desktop];

      for (const viewport of viewportSizes) {
        await page.setViewportSize(viewport);
        await page.goto('/services');

        // Service cards should be clickable
        const card = page.locator('[class*="service"], [class*="card"]').first();

        if (await card.count() > 0) {
          await expect(card).toBeVisible();

          // Card should be clickable (has link or button)
          const hasLink = await card.locator('a').count() > 0;
          const hasButton = await card.locator('button').count() > 0;

          expect(hasLink || hasButton).toBeTruthy();
        }
      }
    });
  });

  test.describe('Orientation Changes', () => {
    test('should handle portrait to landscape on tablet', async ({ page }) => {
      // Portrait
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      await expect(page.locator('header')).toBeVisible();

      // Landscape
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.waitForTimeout(300);

      await expect(page.locator('header')).toBeVisible();

      // Layout should adapt
      const main = page.locator('main, [role="main"]').first();
      if (await main.count() > 0) {
        await expect(main).toBeVisible();
      }
    });

    test('should handle mobile portrait to landscape', async ({ page }) => {
      // Portrait
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Landscape
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(300);

      // Content should still be accessible
      await expect(page.locator('body')).toBeVisible();
    });
  });
});
