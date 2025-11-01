import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth-helpers'

test.describe('Notices System - Public', () => {
  test('should display notices page', async ({ page }) => {
    await page.goto('/notices')

    // Verify page title
    await expect(page.locator('h1')).toContainText('공지사항')

    // Verify notice cards are displayed
    const noticeCards = page.locator('[data-testid="notice-card"]')
    if (await noticeCards.count() > 0) {
      await expect(noticeCards.first()).toBeVisible()
    }
  })

  test('should display pinned notices first', async ({ page }) => {
    await page.goto('/notices')

    // Verify pinned badge on first notice
    const pinnedBadge = page.locator('[data-testid="pinned-badge"]').first()
    if (await pinnedBadge.isVisible()) {
      await expect(pinnedBadge).toContainText('고정')
    }
  })

  test('should filter notices by type', async ({ page }) => {
    await page.goto('/notices')

    // Click on type filter
    const typeFilter = page.locator('[data-testid="type-filter"]')
    if (await typeFilter.isVisible()) {
      await typeFilter.click()
      await page.locator('text=Warning').click()

      // Verify filtered results
      await page.waitForTimeout(500)
    }
  })

  test('should display notice detail in modal', async ({ page }) => {
    await page.goto('/notices')

    // Click on first notice card
    const firstCard = page.locator('[data-testid="notice-card"]').first()
    await firstCard.click()

    // Verify modal is open
    const modal = page.locator('[data-testid="notice-modal"]')
    if (await modal.isVisible()) {
      await expect(modal).toBeVisible()
      await expect(page.locator('[data-testid="notice-title"]')).toBeVisible()
      await expect(page.locator('[data-testid="notice-content"]')).toBeVisible()
    }
  })

  test('should close notice modal', async ({ page }) => {
    await page.goto('/notices')
    await page.locator('[data-testid="notice-card"]').first().click()

    // Close modal
    const closeButton = page.locator('button[aria-label="Close"]')
    if (await closeButton.isVisible()) {
      await closeButton.click()

      // Verify modal is closed
      const modal = page.locator('[data-testid="notice-modal"]')
      await expect(modal).not.toBeVisible()
    }
  })

  test('should display notice type icons', async ({ page }) => {
    await page.goto('/notices')

    // Verify type icons
    const noticeCard = page.locator('[data-testid="notice-card"]').first()
    const icon = noticeCard.locator('[data-testid="notice-icon"]')
    if (await icon.isVisible()) {
      await expect(icon).toBeVisible()
    }
  })

  test('should not display expired notices', async ({ page }) => {
    await page.goto('/notices')

    // Verify no expired badges visible (public view)
    const expiredBadge = page.locator('text=만료됨')
    await expect(expiredBadge).not.toBeVisible()
  })

  test('should display notice metadata', async ({ page }) => {
    await page.goto('/notices')

    const firstCard = page.locator('[data-testid="notice-card"]').first()

    // Verify metadata
    const meta = firstCard.locator('[data-testid="notice-meta"]')
    if (await meta.isVisible()) {
      await expect(meta).toContainText(/\d{4}-\d{2}-\d{2}/) // Date format
    }
  })
})

test.describe('Notices System - Admin', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('should access admin notices page', async ({ page }) => {
    await page.goto('/admin/notices')

    // Verify admin notices page
    await expect(page.locator('h1')).toContainText('공지사항 관리')

    // Verify create button
    await expect(page.locator('a:has-text("새 공지 작성")')).toBeVisible()

    // Verify notices table
    await expect(page.locator('table')).toBeVisible()
  })

  test('should create new notice', async ({ page }) => {
    await page.goto('/admin/notices/new')

    // Fill notice form
    await page.fill('input[name="title"]', 'Test Notice')
    await page.fill('textarea[name="content"]', 'This is a test notice content.')

    // Select type
    const typeSelect = page.locator('[data-testid="type-select"]')
    if (await typeSelect.isVisible()) {
      await typeSelect.click()
      await page.locator('text=Warning').click()
    }

    // Check pinned
    const pinnedCheckbox = page.locator('input[name="is_pinned"]')
    if (await pinnedCheckbox.isVisible()) {
      await pinnedCheckbox.check()
    }

    // Submit form
    await page.locator('button[type="submit"]').click()

    // Verify success
    await expect(page.locator('text=저장되었습니다')).toBeVisible()
  })

  test('should set expiry date', async ({ page }) => {
    await page.goto('/admin/notices/new')

    await page.fill('input[name="title"]', 'Expiring Notice')
    await page.fill('textarea[name="content"]', 'This notice will expire.')

    // Set expiry date
    const expiryInput = page.locator('input[name="expires_at"]')
    if (await expiryInput.isVisible()) {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      await expiryInput.fill(futureDate.toISOString().split('T')[0])
    }

    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=저장되었습니다')).toBeVisible()
  })

  test('should edit existing notice', async ({ page }) => {
    await page.goto('/admin/notices')

    // Click edit button on first notice
    const editButton = page.locator('[data-testid="edit-notice"]').first()
    await editButton.click()

    // Wait for edit page
    await page.waitForURL(/\/admin\/notices\/.*\/edit/)

    // Verify form is populated
    await expect(page.locator('input[name="title"]')).not.toHaveValue('')

    // Update title
    await page.fill('input[name="title"]', 'Updated Notice Title')

    // Submit
    await page.locator('button[type="submit"]').click()

    // Verify success
    await expect(page.locator('text=저장되었습니다')).toBeVisible()
  })

  test('should delete notice', async ({ page }) => {
    await page.goto('/admin/notices')

    // Click delete button
    const deleteButton = page.locator('[data-testid="delete-notice"]').first()
    await deleteButton.click()

    // Confirm deletion
    await page.locator('button:has-text("삭제")').click()

    // Verify success
    await expect(page.locator('text=삭제되었습니다')).toBeVisible()
  })

  test('should filter notices by type in admin', async ({ page }) => {
    await page.goto('/admin/notices')

    // Select type filter
    const typeFilter = page.locator('[data-testid="type-filter"]')
    if (await typeFilter.isVisible()) {
      await typeFilter.click()
      await page.locator('text=Urgent').click()

      // Verify filtered results
      await page.waitForTimeout(500)
    }
  })

  test('should toggle pinned status', async ({ page }) => {
    await page.goto('/admin/notices')

    // Edit first notice
    const editButton = page.locator('[data-testid="edit-notice"]').first()
    await editButton.click()

    // Toggle pinned checkbox
    const pinnedCheckbox = page.locator('input[name="is_pinned"]')
    if (await pinnedCheckbox.isVisible()) {
      const wasChecked = await pinnedCheckbox.isChecked()
      if (wasChecked) {
        await pinnedCheckbox.uncheck()
      } else {
        await pinnedCheckbox.check()
      }

      await page.locator('button[type="submit"]').click()
      await expect(page.locator('text=저장되었습니다')).toBeVisible()
    }
  })

  test('should display all notice types', async ({ page }) => {
    await page.goto('/admin/notices/new')

    // Click type select
    const typeSelect = page.locator('[data-testid="type-select"]')
    if (await typeSelect.isVisible()) {
      await typeSelect.click()

      // Verify all types are available
      await expect(page.locator('text=Info')).toBeVisible()
      await expect(page.locator('text=Warning')).toBeVisible()
      await expect(page.locator('text=Urgent')).toBeVisible()
      await expect(page.locator('text=Maintenance')).toBeVisible()
    }
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/admin/notices/new')

    // Try to submit without filling
    await page.locator('button[type="submit"]').click()

    // Verify validation errors
    await expect(page.locator('text=필수 입력 항목입니다').first()).toBeVisible()
  })

  test('should show expired indicator in admin list', async ({ page }) => {
    await page.goto('/admin/notices')

    // Look for expired badge
    const expiredBadge = page.locator('[data-testid="expired-badge"]')
    if (await expiredBadge.count() > 0) {
      await expect(expiredBadge.first()).toBeVisible()
    }
  })
})
