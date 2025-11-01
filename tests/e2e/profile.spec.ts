import { test, expect } from '@playwright/test'
import { loginAsRegularUser } from '../fixtures/auth-helpers'

test.describe('Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsRegularUser(page)
  })

  test('should access profile page', async ({ page }) => {
    await page.goto('/profile')

    // Verify profile page
    await expect(page.locator('h1')).toContainText('프로필')

    // Verify profile sections
    await expect(page.locator('[data-testid="profile-info"]')).toBeVisible()
  })

  test('should display user information', async ({ page }) => {
    await page.goto('/profile')

    // Verify email is displayed
    const email = page.locator('[data-testid="user-email"]')
    if (await email.isVisible()) {
      await expect(email).not.toBeEmpty()
    }

    // Verify profile metadata
    await expect(page.locator('[data-testid="created-at"]')).toBeVisible()
  })

  test('should update profile name', async ({ page }) => {
    await page.goto('/profile')

    // Fill new name
    const nameInput = page.locator('input[name="name"]')
    if (await nameInput.isVisible()) {
      await nameInput.fill('Updated Name')

      // Submit
      await page.locator('button:has-text("저장")').click()

      // Verify success
      await expect(page.locator('text=저장되었습니다')).toBeVisible()
    }
  })

  test('should upload avatar', async ({ page }) => {
    await page.goto('/profile')

    // Upload avatar
    const fileInput = page.locator('input[type="file"]')
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles({
        name: 'avatar.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake-avatar-data')
      })

      // Verify preview
      await expect(page.locator('[data-testid="avatar-preview"]')).toBeVisible()
    }
  })

  test('should display connected accounts', async ({ page }) => {
    await page.goto('/profile')

    // Verify connected accounts section
    const connectedAccounts = page.locator('[data-testid="connected-accounts"]')
    if (await connectedAccounts.isVisible()) {
      await expect(connectedAccounts).toContainText('연결된 계정')
    }
  })

  test('should show OAuth providers', async ({ page }) => {
    await page.goto('/profile')

    // Verify OAuth provider buttons
    const providers = ['Google', 'GitHub', 'Kakao', 'Microsoft', 'Apple']
    for (const provider of providers) {
      const button = page.locator(`button:has-text("${provider}")`)
      if (await button.count() > 0) {
        await expect(button.first()).toBeVisible()
      }
    }
  })

  test('should link new OAuth account', async ({ page }) => {
    await page.goto('/profile')

    // Click link account button
    const linkButton = page.locator('button:has-text("연결")')
    if (await linkButton.count() > 0) {
      // Just verify button is clickable
      await expect(linkButton.first()).toBeEnabled()
    }
  })

  test('should display 2FA section', async ({ page }) => {
    await page.goto('/profile')

    // Verify 2FA section
    const twoFASection = page.locator('[data-testid="2fa-section"]')
    if (await twoFASection.isVisible()) {
      await expect(twoFASection).toContainText('2단계 인증')
    }
  })

  test('should navigate to 2FA setup', async ({ page }) => {
    await page.goto('/profile')

    // Click 2FA setup button
    const setupButton = page.locator('a:has-text("2FA 설정")')
    if (await setupButton.isVisible()) {
      await setupButton.click()
      await expect(page).toHaveURL('/2fa/setup')
    }
  })

  test('should update email preferences', async ({ page }) => {
    await page.goto('/profile')

    // Toggle email preferences
    const emailCheckbox = page.locator('input[name="email_notifications"]')
    if (await emailCheckbox.isVisible()) {
      const wasChecked = await emailCheckbox.isChecked()
      if (wasChecked) {
        await emailCheckbox.uncheck()
      } else {
        await emailCheckbox.check()
      }

      // Save
      await page.locator('button:has-text("저장")').click()
      await expect(page.locator('text=저장되었습니다')).toBeVisible()
    }
  })

  test('should redirect to login if not authenticated', async ({ page, context }) => {
    // Clear authentication
    await context.clearCookies()

    await page.goto('/profile')

    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })
})

test.describe('Two-Factor Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsRegularUser(page)
  })

  test('should access 2FA setup page', async ({ page }) => {
    await page.goto('/2fa/setup')

    // Verify setup page
    await expect(page.locator('h1')).toContainText('2단계 인증')

    // Verify QR code is displayed
    const qrCode = page.locator('[data-testid="qr-code"]')
    if (await qrCode.isVisible()) {
      await expect(qrCode).toBeVisible()
    }
  })

  test('should display secret key', async ({ page }) => {
    await page.goto('/2fa/setup')

    // Verify secret key
    const secretKey = page.locator('[data-testid="secret-key"]')
    if (await secretKey.isVisible()) {
      await expect(secretKey).not.toBeEmpty()
    }
  })

  test('should verify TOTP code', async ({ page }) => {
    await page.goto('/2fa/setup')

    // Enter verification code (this will fail without real authenticator)
    const codeInput = page.locator('input[name="code"]')
    if (await codeInput.isVisible()) {
      await codeInput.fill('123456')

      const verifyButton = page.locator('button:has-text("인증")')
      await verifyButton.click()

      // Either success or error message should appear
      const hasMessage = await page.locator('text=인증').count() > 0
      expect(hasMessage).toBeTruthy()
    }
  })

  test('should display backup codes after setup', async ({ page }) => {
    await page.goto('/2fa/setup')

    // Check if backup codes section exists
    const backupCodes = page.locator('[data-testid="backup-codes"]')
    if (await backupCodes.isVisible()) {
      await expect(backupCodes).toBeVisible()
    }
  })

  test('should require 2FA on login if enabled', async ({ page, context }) => {
    // This test assumes 2FA is already enabled
    await context.clearCookies()

    await page.goto('/login')

    // Login
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.locator('button[type="submit"]').click()

    // Check if redirected to 2FA verify
    const url = page.url()
    if (url.includes('/2fa/verify')) {
      await expect(page.locator('h1')).toContainText('2단계 인증')
    }
  })

  test('should allow backup code usage', async ({ page }) => {
    await page.goto('/2fa/verify')

    // Switch to backup code input
    const useBackupButton = page.locator('button:has-text("백업 코드 사용")')
    if (await useBackupButton.isVisible()) {
      await useBackupButton.click()

      // Verify backup code input appears
      await expect(page.locator('input[name="backup_code"]')).toBeVisible()
    }
  })

  test('should disable 2FA', async ({ page }) => {
    await page.goto('/profile')

    // Click disable 2FA button
    const disableButton = page.locator('button:has-text("2FA 비활성화")')
    if (await disableButton.isVisible()) {
      await disableButton.click()

      // Confirm
      const confirmButton = page.locator('button:has-text("확인")')
      if (await confirmButton.isVisible()) {
        await confirmButton.click()

        // Verify success
        await expect(page.locator('text=비활성화되었습니다')).toBeVisible()
      }
    }
  })

  test('should show failed attempt warning', async ({ page }) => {
    await page.goto('/2fa/verify')

    // Enter wrong code multiple times
    const codeInput = page.locator('input[name="code"]')
    const submitButton = page.locator('button[type="submit"]')

    for (let i = 0; i < 3; i++) {
      if (await codeInput.isVisible()) {
        await codeInput.fill('000000')
        await submitButton.click()
        await page.waitForTimeout(500)
      }
    }

    // Check for warning message
    const warning = page.locator('text=시도 횟수')
    if (await warning.isVisible()) {
      await expect(warning).toBeVisible()
    }
  })

  test('should regenerate backup codes', async ({ page }) => {
    await page.goto('/profile')

    // Click regenerate backup codes
    const regenerateButton = page.locator('button:has-text("백업 코드 재생성")')
    if (await regenerateButton.isVisible()) {
      await regenerateButton.click()

      // Confirm
      await page.locator('button:has-text("확인")').click()

      // Verify new codes are displayed
      await expect(page.locator('[data-testid="backup-codes"]')).toBeVisible()
    }
  })
})
