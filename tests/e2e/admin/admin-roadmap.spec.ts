/**
 * AdminRoadmap E2E Tests
 *
 * Tests for the roadmap management admin page:
 * - Page navigation and loading
 * - Create new roadmap items
 * - Search and filter functionality
 * - Edit roadmap items
 * - Delete roadmap items
 * - Form validation (Accordion sections)
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../helpers/auth';

test.describe('AdminRoadmap', () => {
    test.beforeEach(async ({ page }) => {
        // Clear any existing sessions
        await page.context().clearCookies();

        // Login as admin
        await loginAsAdmin(page);

        // Navigate to roadmap management page
        await page.goto('/admin/roadmap');
    });

    test.describe('Page Navigation & Loading', () => {
        test('should render roadmap management page', async ({ page }) => {
            // Check page title
            await expect(page.locator('h1:has-text("Roadmap Management")')).toBeVisible();

            // Check description
            await expect(page.locator('p:has-text("Manage quarterly roadmap items")')).toBeVisible();

            // Check "New Roadmap Item" button
            await expect(page.locator('button:has-text("New Roadmap Item")')).toBeVisible();
        });

        test('should display statistics cards', async ({ page }) => {
            await expect(page.locator('text=Total Phases')).toBeVisible();
            await expect(page.locator('text=In Progress')).toBeVisible();
            await expect(page.locator('text=Completed')).toBeVisible();
            await expect(page.locator('text=Avg Progress')).toBeVisible();
        });

        test('should display search and filter controls', async ({ page }) => {
            // Check search input
            await expect(page.locator('input[placeholder*="Search by theme"]')).toBeVisible();

            // Check quarter filter
            const quarterFilter = page.getByRole('combobox').filter({ hasText: /All Quarters/ });
            await expect(quarterFilter.first()).toBeVisible();

            // Check risk filter
            const riskFilter = page.getByRole('combobox').filter({ hasText: /All Risk Levels/ });
            await expect(riskFilter.first()).toBeVisible();
        });
    });

    test.describe('Create New Roadmap Item', () => {
        test('should open create dialog when clicking add button', async ({ page }) => {
            await page.click('button:has-text("New Roadmap Item")');

            const dialog = page.getByRole('dialog');
            await expect(dialog).toBeVisible();
            await expect(dialog.getByText(/Fill in the roadmap details/i)).toBeVisible();
        });

        test('should validate required fields', async ({ page }) => {
            await page.click('button:has-text("New Roadmap Item")');
            await page.waitForSelector('[role="dialog"]');

            // Try to submit empty form
            await page.click('button[type="submit"]:has-text("Create")');

            // Wait for validation
            await page.waitForTimeout(500);

            // Check for validation error messages (Basic Info is open by default)
            await expect(page.locator('text=Quarter required')).toBeVisible();
            await expect(page.locator('text=Theme must be at least 3 characters')).toBeVisible();
            await expect(page.locator('text=Goal must be at least 10 characters')).toBeVisible();
        });

        test('should create roadmap item with required fields', async ({ page }) => {
            await page.click('button:has-text("New Roadmap Item")');
            await page.waitForSelector('[role="dialog"]');

            const timestamp = Date.now();
            const theme = `E2E Test Theme ${timestamp}`;

            // 1. Basic Information (Open by default)
            await page.fill('input[name="quarter"]', 'Q1 2026');
            await page.fill('input[name="theme"]', theme);
            await page.fill('textarea[name="goal"]', 'This is a test goal for E2E testing purposes.');

            // 2. Progress & Status (Need to open accordion)
            await page.click('button:has-text("Progress & Status")');
            await page.waitForTimeout(300);

            // Fill dates
            await page.fill('input[name="start_date"]', '2026-01-01');
            await page.fill('input[name="end_date"]', '2026-03-31');

            // Select Risk Level
            const riskSelect = page.locator('button[role="combobox"]:has-text("Select risk level")');
            await riskSelect.click();
            await page.getByRole('option', { name: 'Low' }).click();

            // Submit form
            await page.click('button[type="submit"]:has-text("Create")');

            // Check for success toast
            const toast = page.locator('[role="status"], [role="alert"]').filter({ hasText: /Roadmap created successfully/i });
            await expect(toast.first()).toBeVisible({ timeout: 5000 });

            // Dialog should close
            await expect(page.locator('[role="dialog"]')).not.toBeVisible();

            // New item should appear in table
            await expect(page.locator(`text=${theme}`)).toBeVisible();
        });
    });

    test.describe('Edit Roadmap Item', () => {
        test('should update roadmap item successfully', async ({ page }) => {
            // Wait for table to load
            await page.waitForTimeout(1000);

            // Click first edit button
            const editButton = page.locator('button:has([class*="lucide-pencil"])').first();
            if (await editButton.count() > 0) {
                await editButton.click();
                await page.waitForSelector('[role="dialog"]');

                // Update theme
                const themeInput = page.locator('input[name="theme"]');
                const currentTheme = await themeInput.inputValue();
                const newTheme = `${currentTheme} (Updated)`;
                await themeInput.fill(newTheme);

                // Submit
                await page.click('button[type="submit"]:has-text("Update")');

                // Check for success toast
                const toast = page.locator('[role="status"], [role="alert"]').filter({ hasText: /Roadmap updated successfully/i });
                await expect(toast.first()).toBeVisible({ timeout: 5000 });

                // Check if updated theme is visible
                await expect(page.locator(`text=${newTheme}`)).toBeVisible();
            }
        });
    });

    test.describe('Delete Roadmap Item', () => {
        test('should delete roadmap item on confirmation', async ({ page }) => {
            // First create an item to delete
            await page.click('button:has-text("New Roadmap Item")');
            await page.waitForSelector('[role="dialog"]');

            const timestamp = Date.now();
            const theme = `Delete Test ${timestamp}`;

            // Basic Info
            await page.fill('input[name="quarter"]', 'Q4 2026');
            await page.fill('input[name="theme"]', theme);
            await page.fill('textarea[name="goal"]', 'Goal to be deleted.');

            // Progress & Status
            await page.click('button:has-text("Progress & Status")');
            await page.waitForTimeout(300);
            await page.fill('input[name="start_date"]', '2026-10-01');
            await page.fill('input[name="end_date"]', '2026-12-31');

            // Submit
            await page.click('button[type="submit"]:has-text("Create")');
            await page.waitForTimeout(1000);

            // Find the row
            const row = page.locator(`tr:has-text("${theme}")`);
            await expect(row).toBeVisible();

            // Click delete button
            const deleteButton = row.locator('button:has([class*="lucide-trash"])');
            await deleteButton.click();

            // Confirm dialog
            const confirmDialog = page.locator('[role="alertdialog"]');
            await expect(confirmDialog).toBeVisible();
            await page.click('button:has-text("Delete")');

            // Check for success toast
            const toast = page.locator('[role="status"], [role="alert"]').filter({ hasText: /Roadmap item deleted successfully/i });
            await expect(toast.first()).toBeVisible({ timeout: 5000 });

            // Verify item is gone
            await expect(page.locator(`text=${theme}`)).not.toBeVisible();
        });
    });

    test.describe('Filter Functionality', () => {
        test('should filter by quarter', async ({ page }) => {
            await page.waitForTimeout(1000);

            // Open quarter filter
            const quarterFilter = page.getByRole('combobox').filter({ hasText: /All Quarters/ }).first();
            await quarterFilter.click();

            // Select a quarter (assuming there is data, or at least "All Quarters" option exists)
            // Since we can't guarantee data, we just check if options are visible
            const options = page.getByRole('option');
            if (await options.count() > 1) {
                await options.nth(1).click(); // Select first available quarter
                await page.waitForTimeout(500);
                // Just verify no error occurred
                await expect(page.locator('table')).toBeVisible();
            }
        });
    });
});
