import { test, expect } from '@playwright/test'
import { loginAsRegularUser } from '../fixtures/auth-helpers'

test.describe('Checkout Process', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsRegularUser(page)

    // Add item to cart
    await page.goto('/services')
    await page.locator('[data-testid="service-card"]').first().click()
    await page.locator('button:has-text("장바구니 추가")').click()
  })

  test('should display checkout form', async ({ page }) => {
    await page.goto('/checkout')

    // Verify checkout page elements
    await expect(page.locator('h1')).toContainText('주문/결제')
    await expect(page.locator('form')).toBeVisible()

    // Verify required fields
    await expect(page.locator('input[name="shipping_name"]')).toBeVisible()
    await expect(page.locator('input[name="shipping_phone"]')).toBeVisible()
    await expect(page.locator('input[name="shipping_address"]')).toBeVisible()
    await expect(page.locator('input[name="shipping_zipcode"]')).toBeVisible()
  })

  test('should display order summary', async ({ page }) => {
    await page.goto('/checkout')

    // Verify order summary section
    const orderSummary = page.locator('[data-testid="order-summary"]')
    await expect(orderSummary).toBeVisible()

    // Verify items are listed
    await expect(page.locator('[data-testid="order-item"]')).toHaveCount(1)

    // Verify total calculation
    await expect(page.locator('[data-testid="order-total"]')).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/checkout')

    // Try to submit without filling
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Verify validation errors
    await expect(page.locator('text=필수 입력 항목입니다')).toHaveCount(4) // name, phone, address, zipcode
  })

  test('should fill and submit checkout form', async ({ page }) => {
    await page.goto('/checkout')

    // Fill shipping information
    await page.fill('input[name="shipping_name"]', '홍길동')
    await page.fill('input[name="shipping_phone"]', '010-1234-5678')
    await page.fill('input[name="shipping_address"]', '서울시 강남구 테헤란로 123')
    await page.fill('input[name="shipping_zipcode"]', '06234')
    await page.fill('textarea[name="notes"]', '배송 전 연락 부탁드립니다')

    // Submit form
    await page.locator('button[type="submit"]').click()

    // Should navigate to payment page
    await page.waitForURL('/checkout/payment')
  })

  test('should display payment options', async ({ page }) => {
    // Complete checkout form first
    await page.goto('/checkout')
    await page.fill('input[name="shipping_name"]', '홍길동')
    await page.fill('input[name="shipping_phone"]', '010-1234-5678')
    await page.fill('input[name="shipping_address"]', '서울시 강남구 테헤란로 123')
    await page.fill('input[name="shipping_zipcode"]', '06234')
    await page.locator('button[type="submit"]').click()

    // Verify payment page
    await page.waitForURL('/checkout/payment')
    await expect(page.locator('h1')).toContainText('결제 수단 선택')

    // Verify payment methods
    await expect(page.locator('button:has-text("카카오페이")')).toBeVisible()
    await expect(page.locator('button:has-text("토스페이먼츠")')).toBeVisible()
  })

  test('should redirect to login if not authenticated', async ({ page, context }) => {
    // Clear authentication
    await context.clearCookies()

    await page.goto('/checkout')

    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })

  test('should redirect to services if cart is empty', async ({ page }) => {
    // Clear cart
    await page.goto('/')
    await page.locator('[data-testid="cart-button"]').click()
    const clearButton = page.locator('button:has-text("전체 삭제")')
    if (await clearButton.isVisible()) {
      await clearButton.click()
    }

    // Try to access checkout
    await page.goto('/checkout')

    // Should show empty cart message or redirect
    const isEmpty = await page.locator('text=장바구니가 비어있습니다').isVisible()
    const isRedirected = page.url().includes('/services')

    expect(isEmpty || isRedirected).toBeTruthy()
  })

  test('should allow editing shipping address', async ({ page }) => {
    await page.goto('/checkout')

    // Fill initial address
    await page.fill('input[name="shipping_address"]', '서울시 강남구')

    // Edit address
    await page.fill('input[name="shipping_address"]', '서울시 서초구 서초대로 123')

    // Verify updated value
    await expect(page.locator('input[name="shipping_address"]')).toHaveValue('서울시 서초구 서초대로 123')
  })

  test('should display shipping cost if applicable', async ({ page }) => {
    await page.goto('/checkout')

    const orderSummary = page.locator('[data-testid="order-summary"]')
    await expect(orderSummary).toBeVisible()

    // Check if shipping cost is displayed
    const shippingCost = page.locator('[data-testid="shipping-cost"]')
    if (await shippingCost.isVisible()) {
      await expect(shippingCost).toContainText('배송비')
    }
  })
})
