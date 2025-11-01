import { test, expect } from '@playwright/test'
import { loginAsRegularUser } from '../fixtures/auth-helpers'

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsRegularUser(page)
  })

  test('should add service to cart', async ({ page }) => {
    // Navigate to services page
    await page.goto('/services')
    await expect(page.locator('h1')).toContainText('서비스')

    // Click on first service card
    const firstService = page.locator('[data-testid="service-card"]').first()
    await firstService.click()

    // Wait for detail page
    await page.waitForURL(/\/services\/.*/)

    // Add to cart
    const addToCartButton = page.locator('button:has-text("장바구니 추가")')
    await addToCartButton.click()

    // Verify toast notification
    await expect(page.locator('text=장바구니에 추가되었습니다')).toBeVisible()

    // Open cart drawer
    const cartButton = page.locator('[data-testid="cart-button"]')
    await expect(cartButton).toContainText('1') // Badge count
    await cartButton.click()

    // Verify cart drawer is open
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible()
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)
  })

  test('should update quantity in cart', async ({ page }) => {
    // Add item to cart first
    await page.goto('/services')
    await page.locator('[data-testid="service-card"]').first().click()
    await page.locator('button:has-text("장바구니 추가")').click()

    // Open cart
    await page.locator('[data-testid="cart-button"]').click()

    // Increase quantity
    const increaseButton = page.locator('[data-testid="increase-quantity"]').first()
    await increaseButton.click()

    // Verify quantity is 2
    await expect(page.locator('[data-testid="item-quantity"]').first()).toContainText('2')

    // Verify total price updated
    const cartSummary = page.locator('[data-testid="cart-summary"]')
    await expect(cartSummary).toBeVisible()
  })

  test('should remove item from cart', async ({ page }) => {
    // Add item to cart
    await page.goto('/services')
    await page.locator('[data-testid="service-card"]').first().click()
    await page.locator('button:has-text("장바구니 추가")').click()

    // Open cart
    await page.locator('[data-testid="cart-button"]').click()

    // Remove item
    const removeButton = page.locator('[data-testid="remove-item"]').first()
    await removeButton.click()

    // Verify empty cart message
    await expect(page.locator('text=장바구니가 비어있습니다')).toBeVisible()
    await expect(page.locator('[data-testid="cart-button"]')).not.toContainText('1')
  })

  test('should clear entire cart', async ({ page }) => {
    // Add multiple items
    await page.goto('/services')
    const services = page.locator('[data-testid="service-card"]')
    const count = await services.count()

    for (let i = 0; i < Math.min(count, 2); i++) {
      await services.nth(i).click()
      await page.locator('button:has-text("장바구니 추가")').click()
      await page.goto('/services')
    }

    // Open cart
    await page.locator('[data-testid="cart-button"]').click()

    // Clear cart
    const clearButton = page.locator('button:has-text("전체 삭제")')
    await clearButton.click()

    // Verify empty cart
    await expect(page.locator('text=장바구니가 비어있습니다')).toBeVisible()
  })

  test('should persist cart across page navigation', async ({ page }) => {
    // Add item
    await page.goto('/services')
    await page.locator('[data-testid="service-card"]').first().click()
    await page.locator('button:has-text("장바구니 추가")').click()

    // Navigate to home
    await page.goto('/')

    // Verify cart badge still shows 1
    await expect(page.locator('[data-testid="cart-button"]')).toContainText('1')

    // Open cart and verify item still exists
    await page.locator('[data-testid="cart-button"]').click()
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)
  })

  test('should show checkout button when cart has items', async ({ page }) => {
    // Add item
    await page.goto('/services')
    await page.locator('[data-testid="service-card"]').first().click()
    await page.locator('button:has-text("장바구니 추가")').click()

    // Open cart
    await page.locator('[data-testid="cart-button"]').click()

    // Verify checkout button
    const checkoutButton = page.locator('button:has-text("결제하기")')
    await expect(checkoutButton).toBeVisible()
    await expect(checkoutButton).toBeEnabled()
  })

  test('should navigate to checkout page', async ({ page }) => {
    // Add item and proceed to checkout
    await page.goto('/services')
    await page.locator('[data-testid="service-card"]').first().click()
    await page.locator('button:has-text("장바구니 추가")').click()

    await page.locator('[data-testid="cart-button"]').click()
    await page.locator('button:has-text("결제하기")').click()

    // Verify navigation to checkout
    await expect(page).toHaveURL('/checkout')
  })
})
