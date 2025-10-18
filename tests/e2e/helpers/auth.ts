/**
 * Authentication helper functions for E2E tests
 */

import { Page } from '@playwright/test';
import { getLoginCredentials } from '../../fixtures/users';

/**
 * Login as admin user
 */
export async function loginAsAdmin(page: Page) {
  const credentials = getLoginCredentials('admin');
  await page.goto('/login');

  // Fill login form (using placeholder selectors since inputs don't have name attributes)
  await page.fill('input[placeholder*="이메일" i], input[placeholder*="email" i]', credentials.identifier);
  await page.fill('input[type="password"]', credentials.password);
  await page.click('button[type="submit"]');

  // Wait for login to complete
  await page.waitForURL('/', { timeout: 15000 });
}

/**
 * Login as regular user
 */
export async function loginAsRegularUser(page: Page) {
  const credentials = getLoginCredentials('regularUser');
  await page.goto('/login');

  await page.fill('input[placeholder*="이메일" i], input[placeholder*="email" i]', credentials.identifier);
  await page.fill('input[type="password"]', credentials.password);
  await page.click('button[type="submit"]');

  await page.waitForURL('/', { timeout: 15000 });
}
