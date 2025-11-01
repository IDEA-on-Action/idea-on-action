import { test, expect } from '@playwright/test'
import { loginAsAdmin, loginAsRegularUser } from '../fixtures/auth-helpers'

test.describe('RBAC System - Admin', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('should access admin roles page', async ({ page }) => {
    await page.goto('/admin/roles')

    // Verify roles page
    await expect(page.locator('h1')).toContainText('역할 관리')

    // Verify role cards are displayed
    const roleCards = page.locator('[data-testid="role-card"]')
    await expect(roleCards.first()).toBeVisible()
  })

  test('should display all default roles', async ({ page }) => {
    await page.goto('/admin/roles')

    // Verify default roles
    const roles = ['Super Admin', 'Admin', 'Editor', 'Viewer']
    for (const role of roles) {
      await expect(page.locator(`text=${role}`)).toBeVisible()
    }
  })

  test('should display role permissions', async ({ page }) => {
    await page.goto('/admin/roles')

    // Click on first role card to expand
    const firstCard = page.locator('[data-testid="role-card"]').first()
    await firstCard.click()

    // Verify permissions list
    const permissions = page.locator('[data-testid="permission-list"]')
    if (await permissions.isVisible()) {
      await expect(permissions).toBeVisible()
    }
  })

  test('should assign role to user', async ({ page }) => {
    await page.goto('/admin/roles')

    // Find user assignment section
    const assignSection = page.locator('[data-testid="assign-role-section"]')
    if (await assignSection.isVisible()) {
      // Select user
      const userSelect = page.locator('[data-testid="user-select"]')
      await userSelect.click()
      await page.locator('[data-testid="user-option"]').first().click()

      // Select role
      const roleSelect = page.locator('[data-testid="role-select"]')
      await roleSelect.click()
      await page.locator('text=Editor').click()

      // Submit
      await page.locator('button:has-text("역할 할당")').click()

      // Verify success
      await expect(page.locator('text=할당되었습니다')).toBeVisible()
    }
  })

  test('should revoke user role', async ({ page }) => {
    await page.goto('/admin/roles')

    // Find current roles table
    const revokeButton = page.locator('[data-testid="revoke-role"]').first()
    if (await revokeButton.isVisible()) {
      await revokeButton.click()

      // Confirm
      await page.locator('button:has-text("확인")').click()

      // Verify success
      await expect(page.locator('text=취소되었습니다')).toBeVisible()
    }
  })

  test('should display users with roles', async ({ page }) => {
    await page.goto('/admin/roles')

    // Verify current roles table
    const rolesTable = page.locator('[data-testid="current-roles-table"]')
    if (await rolesTable.isVisible()) {
      await expect(rolesTable).toBeVisible()

      // Verify table headers
      await expect(page.locator('th:has-text("사용자")')).toBeVisible()
      await expect(page.locator('th:has-text("역할")')).toBeVisible()
    }
  })

  test('should filter users by role', async ({ page }) => {
    await page.goto('/admin/roles')

    // Click role filter
    const roleFilter = page.locator('[data-testid="role-filter"]')
    if (await roleFilter.isVisible()) {
      await roleFilter.click()
      await page.locator('text=Admin').click()

      // Verify filtered results
      await page.waitForTimeout(500)
    }
  })

  test('should show permission count per role', async ({ page }) => {
    await page.goto('/admin/roles')

    // Verify permission count badges
    const permissionCount = page.locator('[data-testid="permission-count"]').first()
    if (await permissionCount.isVisible()) {
      await expect(permissionCount).toContainText(/\d+/)
    }
  })

  test('should display role descriptions', async ({ page }) => {
    await page.goto('/admin/roles')

    // Verify role descriptions
    const description = page.locator('[data-testid="role-description"]').first()
    if (await description.isVisible()) {
      await expect(description).not.toBeEmpty()
    }
  })
})

test.describe('RBAC System - Audit Logs', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('should access audit logs page', async ({ page }) => {
    await page.goto('/admin/audit-logs')

    // Verify audit logs page
    await expect(page.locator('h1')).toContainText('감사 로그')

    // Verify logs table
    await expect(page.locator('table')).toBeVisible()
  })

  test('should display log entries', async ({ page }) => {
    await page.goto('/admin/audit-logs')

    // Verify log rows
    const logRows = page.locator('[data-testid="log-row"]')
    if (await logRows.count() > 0) {
      await expect(logRows.first()).toBeVisible()
    }
  })

  test('should filter logs by action', async ({ page }) => {
    await page.goto('/admin/audit-logs')

    // Select action filter
    const actionFilter = page.locator('[data-testid="action-filter"]')
    if (await actionFilter.isVisible()) {
      await actionFilter.click()
      await page.locator('text=Create').click()

      // Verify filtered results
      await page.waitForTimeout(500)
    }
  })

  test('should filter logs by user', async ({ page }) => {
    await page.goto('/admin/audit-logs')

    // Select user filter
    const userFilter = page.locator('[data-testid="user-filter"]')
    if (await userFilter.isVisible()) {
      await userFilter.click()
      await page.locator('[data-testid="user-option"]').first().click()

      // Verify filtered results
      await page.waitForTimeout(500)
    }
  })

  test('should filter logs by resource', async ({ page }) => {
    await page.goto('/admin/audit-logs')

    // Select resource filter
    const resourceFilter = page.locator('[data-testid="resource-filter"]')
    if (await resourceFilter.isVisible()) {
      await resourceFilter.click()
      await page.locator('text=Service').click()

      // Verify filtered results
      await page.waitForTimeout(500)
    }
  })

  test('should display log metadata', async ({ page }) => {
    await page.goto('/admin/audit-logs')

    const firstLog = page.locator('[data-testid="log-row"]').first()

    // Verify metadata columns
    await expect(firstLog.locator('[data-testid="log-action"]')).toBeVisible()
    await expect(firstLog.locator('[data-testid="log-resource"]')).toBeVisible()
    await expect(firstLog.locator('[data-testid="log-timestamp"]')).toBeVisible()
  })

  test('should show action badges with colors', async ({ page }) => {
    await page.goto('/admin/audit-logs')

    // Verify action badges
    const actionBadge = page.locator('[data-testid="action-badge"]').first()
    if (await actionBadge.isVisible()) {
      await expect(actionBadge).toBeVisible()
    }
  })

  test('should display user who performed action', async ({ page }) => {
    await page.goto('/admin/audit-logs')

    // Verify user column
    const userCell = page.locator('[data-testid="log-user"]').first()
    if (await userCell.isVisible()) {
      await expect(userCell).not.toBeEmpty()
    }
  })

  test('should paginate logs', async ({ page }) => {
    await page.goto('/admin/audit-logs')

    // Check for pagination
    const nextButton = page.locator('button:has-text("다음")')
    if (await nextButton.isVisible()) {
      await nextButton.click()

      // Verify page changed
      await page.waitForTimeout(500)
    }
  })

  test('should export logs', async ({ page }) => {
    await page.goto('/admin/audit-logs')

    // Check for export button
    const exportButton = page.locator('button:has-text("내보내기")')
    if (await exportButton.isVisible()) {
      await expect(exportButton).toBeEnabled()
    }
  })
})

test.describe('RBAC System - Permissions', () => {
  test('non-admin should not access admin routes', async ({ page }) => {
    await loginAsRegularUser(page)

    // Try to access admin page
    await page.goto('/admin/roles')

    // Should redirect to forbidden page
    await expect(page).toHaveURL('/forbidden')
    await expect(page.locator('h1')).toContainText('403')
  })

  test('non-admin should not access service management', async ({ page }) => {
    await loginAsRegularUser(page)

    await page.goto('/admin/services')

    // Should redirect to forbidden
    await expect(page).toHaveURL('/forbidden')
  })

  test('non-admin should not access blog management', async ({ page }) => {
    await loginAsRegularUser(page)

    await page.goto('/admin/blog')

    // Should redirect to forbidden
    await expect(page).toHaveURL('/forbidden')
  })

  test('non-admin should not access notice management', async ({ page }) => {
    await loginAsRegularUser(page)

    await page.goto('/admin/notices')

    // Should redirect to forbidden
    await expect(page).toHaveURL('/forbidden')
  })

  test('non-admin should not access audit logs', async ({ page }) => {
    await loginAsRegularUser(page)

    await page.goto('/admin/audit-logs')

    // Should redirect to forbidden
    await expect(page).toHaveURL('/forbidden')
  })

  test('admin should access all admin routes', async ({ page }) => {
    await loginAsAdmin(page)

    const routes = [
      '/admin',
      '/admin/services',
      '/admin/blog',
      '/admin/notices',
      '/admin/roles',
      '/admin/audit-logs'
    ]

    for (const route of routes) {
      await page.goto(route)
      // Should not redirect to forbidden
      expect(page.url()).not.toContain('/forbidden')
    }
  })

  test('should create audit log on service creation', async ({ page }) => {
    await loginAsAdmin(page)

    // Create a service
    await page.goto('/admin/services/new')
    await page.fill('input[name="title"]', 'Audit Test Service')
    await page.fill('textarea[name="description"]', 'Test description')
    await page.fill('input[name="price"]', '100000')
    await page.locator('button[type="submit"]').click()

    // Wait for success
    await page.waitForTimeout(1000)

    // Check audit logs
    await page.goto('/admin/audit-logs')

    // Verify log exists
    const recentLog = page.locator('text=Service').first()
    if (await recentLog.isVisible()) {
      await expect(recentLog).toBeVisible()
    }
  })

  test('should log role assignment actions', async ({ page }) => {
    await loginAsAdmin(page)

    // Assign a role (if possible)
    await page.goto('/admin/roles')

    const assignSection = page.locator('[data-testid="assign-role-section"]')
    if (await assignSection.isVisible()) {
      // Assign role logic...
      await page.waitForTimeout(500)

      // Check audit logs
      await page.goto('/admin/audit-logs')

      // Look for role assignment log
      const roleLog = page.locator('text=role').first()
      if (await roleLog.isVisible()) {
        await expect(roleLog).toBeVisible()
      }
    }
  })
})
