/**
 * Authentication Helper Functions for E2E Tests
 *
 * Provides reusable login functions for different user roles
 */

import { Page } from '@playwright/test';
import { testUsers, getLoginCredentials } from './users';

/**
 * Login as admin user
 * @param page - Playwright page object
 */
export async function loginAsAdmin(page: Page) {
  const credentials = getLoginCredentials('admin');

  await page.goto('/login');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Fill in login form (username or email)
  await page.fill('input[type="email"], input[name="email"], input[placeholder*="이메일"]', credentials.email);
  await page.fill('input[type="password"], input[name="password"]', credentials.password);

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for navigation to complete
  await page.waitForURL('/', { timeout: 10000 });

  // Wait for authentication to be established
  await page.waitForTimeout(1000);
}

/**
 * Login as regular user
 * @param page - Playwright page object
 */
export async function loginAsRegularUser(page: Page) {
  const credentials = getLoginCredentials('regularUser');

  await page.goto('/login');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Fill in login form
  await page.fill('input[type="email"], input[name="email"], input[placeholder*="이메일"]', credentials.email);
  await page.fill('input[type="password"], input[name="password"]', credentials.password);

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for navigation to complete
  await page.waitForURL('/', { timeout: 10000 });

  // Wait for authentication to be established
  await page.waitForTimeout(1000);
}

/**
 * Logout current user
 * @param page - Playwright page object
 */
export async function logout(page: Page) {
  // Click on user avatar/menu
  await page.click('[data-testid="user-menu"], button[aria-label*="사용자"], button:has-text("로그아웃")');

  // Click logout button
  await page.click('button:has-text("로그아웃"), a:has-text("로그아웃")');

  // Wait for redirect to home or login page
  await page.waitForURL(/\/(login)?$/, { timeout: 5000 });
}

/**
 * Check if user is logged in
 * @param page - Playwright page object
 * @returns true if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    // Check for user avatar or logout button
    const userMenu = await page.locator('[data-testid="user-menu"], button[aria-label*="사용자"]').count();
    return userMenu > 0;
  } catch {
    return false;
  }
}

/**
 * Check if user is admin
 * @param page - Playwright page object
 * @returns true if user is admin
 */
export async function isAdmin(page: Page): Promise<boolean> {
  try {
    // Try to navigate to admin page
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Check if we're still on admin page (not redirected to 403)
    const url = page.url();
    return url.includes('/admin') && !url.includes('403');
  } catch {
    return false;
  }
}
