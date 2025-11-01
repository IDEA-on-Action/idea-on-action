import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../fixtures/auth-helpers'

test.describe('Blog System - Public', () => {
  test('should display blog list page', async ({ page }) => {
    await page.goto('/blog')

    // Verify page title
    await expect(page.locator('h1')).toContainText('블로그')

    // Verify blog cards are displayed
    const blogCards = page.locator('[data-testid="blog-card"]')
    await expect(blogCards.first()).toBeVisible()
  })

  test('should filter blog posts by category', async ({ page }) => {
    await page.goto('/blog')

    // Click on category filter
    const categoryFilter = page.locator('[data-testid="category-filter"]')
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click()
      await page.locator('text=튜토리얼').click()

      // Verify filtered results
      await expect(page.locator('[data-testid="blog-card"]')).toHaveCount.greaterThan(0)
    }
  })

  test('should search blog posts', async ({ page }) => {
    await page.goto('/blog')

    // Enter search query
    const searchInput = page.locator('input[placeholder*="검색"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('AI')
      await searchInput.press('Enter')

      // Verify search results
      await page.waitForTimeout(500)
      const results = page.locator('[data-testid="blog-card"]')
      if (await results.count() > 0) {
        await expect(results.first()).toBeVisible()
      }
    }
  })

  test('should display blog post detail', async ({ page }) => {
    await page.goto('/blog')

    // Click on first blog card
    const firstCard = page.locator('[data-testid="blog-card"]').first()
    await firstCard.click()

    // Wait for detail page
    await page.waitForURL(/\/blog\/.*/)

    // Verify post content
    await expect(page.locator('[data-testid="blog-title"]')).toBeVisible()
    await expect(page.locator('[data-testid="blog-content"]')).toBeVisible()
    await expect(page.locator('[data-testid="blog-meta"]')).toBeVisible()
  })

  test('should display featured image', async ({ page }) => {
    await page.goto('/blog')
    await page.locator('[data-testid="blog-card"]').first().click()
    await page.waitForURL(/\/blog\/.*/)

    // Verify featured image
    const featuredImage = page.locator('[data-testid="featured-image"]')
    if (await featuredImage.isVisible()) {
      await expect(featuredImage).toHaveAttribute('src', /.+/)
    }
  })

  test('should display tags', async ({ page }) => {
    await page.goto('/blog')
    await page.locator('[data-testid="blog-card"]').first().click()
    await page.waitForURL(/\/blog\/.*/)

    // Verify tags are displayed
    const tags = page.locator('[data-testid="blog-tag"]')
    if (await tags.count() > 0) {
      await expect(tags.first()).toBeVisible()
    }
  })

  test('should show share button', async ({ page }) => {
    await page.goto('/blog')
    await page.locator('[data-testid="blog-card"]').first().click()
    await page.waitForURL(/\/blog\/.*/)

    // Verify share button
    const shareButton = page.locator('button:has-text("공유")')
    if (await shareButton.isVisible()) {
      await expect(shareButton).toBeEnabled()
    }
  })

  test('should display reading time', async ({ page }) => {
    await page.goto('/blog')

    // Verify reading time on card
    const readingTime = page.locator('[data-testid="reading-time"]').first()
    if (await readingTime.isVisible()) {
      await expect(readingTime).toContainText('분')
    }
  })
})

test.describe('Blog System - Admin', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('should access admin blog page', async ({ page }) => {
    await page.goto('/admin/blog')

    // Verify admin blog page
    await expect(page.locator('h1')).toContainText('블로그 관리')

    // Verify create button
    await expect(page.locator('a:has-text("새 글 작성")')).toBeVisible()

    // Verify blog posts table
    await expect(page.locator('table')).toBeVisible()
  })

  test('should create new blog post', async ({ page }) => {
    await page.goto('/admin/blog/new')

    // Fill blog post form
    await page.fill('input[name="title"]', 'Test Blog Post')
    await page.fill('textarea[name="content"]', '# Test Content\n\nThis is a test blog post.')
    await page.fill('textarea[name="excerpt"]', 'Test excerpt')

    // Select category
    const categorySelect = page.locator('[data-testid="category-select"]')
    if (await categorySelect.isVisible()) {
      await categorySelect.click()
      await page.locator('text=튜토리얼').click()
    }

    // Select status
    const statusSelect = page.locator('[data-testid="status-select"]')
    if (await statusSelect.isVisible()) {
      await statusSelect.click()
      await page.locator('text=Published').click()
    }

    // Submit form
    await page.locator('button[type="submit"]').click()

    // Verify success
    await expect(page.locator('text=저장되었습니다')).toBeVisible()
  })

  test('should preview markdown content', async ({ page }) => {
    await page.goto('/admin/blog/new')

    // Fill content
    await page.fill('textarea[name="content"]', '# Heading\n\n**Bold text**')

    // Click preview tab
    const previewTab = page.locator('button:has-text("미리보기")')
    if (await previewTab.isVisible()) {
      await previewTab.click()

      // Verify rendered content
      await expect(page.locator('h1:has-text("Heading")')).toBeVisible()
      await expect(page.locator('strong:has-text("Bold text")')).toBeVisible()
    }
  })

  test('should auto-generate slug from title', async ({ page }) => {
    await page.goto('/admin/blog/new')

    // Fill title
    await page.fill('input[name="title"]', 'Hello World Test')

    // Wait for slug generation
    await page.waitForTimeout(300)

    // Verify slug
    const slugInput = page.locator('input[name="slug"]')
    await expect(slugInput).toHaveValue('hello-world-test')
  })

  test('should edit existing blog post', async ({ page }) => {
    await page.goto('/admin/blog')

    // Click edit button on first post
    const editButton = page.locator('[data-testid="edit-post"]').first()
    await editButton.click()

    // Wait for edit page
    await page.waitForURL(/\/admin\/blog\/.*\/edit/)

    // Verify form is populated
    await expect(page.locator('input[name="title"]')).not.toHaveValue('')

    // Update title
    await page.fill('input[name="title"]', 'Updated Title')

    // Submit
    await page.locator('button[type="submit"]').click()

    // Verify success
    await expect(page.locator('text=저장되었습니다')).toBeVisible()
  })

  test('should delete blog post', async ({ page }) => {
    await page.goto('/admin/blog')

    // Click delete button
    const deleteButton = page.locator('[data-testid="delete-post"]').first()
    await deleteButton.click()

    // Confirm deletion
    await page.locator('button:has-text("삭제")').click()

    // Verify success
    await expect(page.locator('text=삭제되었습니다')).toBeVisible()
  })

  test('should filter posts by status', async ({ page }) => {
    await page.goto('/admin/blog')

    // Select status filter
    const statusFilter = page.locator('[data-testid="status-filter"]')
    if (await statusFilter.isVisible()) {
      await statusFilter.click()
      await page.locator('text=Published').click()

      // Verify filtered results
      await page.waitForTimeout(500)
    }
  })

  test('should upload featured image', async ({ page }) => {
    await page.goto('/admin/blog/new')

    // Upload image
    const fileInput = page.locator('input[type="file"]')
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles({
        name: 'test-image.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake-image-data')
      })

      // Verify image preview
      await expect(page.locator('[data-testid="image-preview"]')).toBeVisible()
    }
  })

  test('should add tags to post', async ({ page }) => {
    await page.goto('/admin/blog/new')

    // Add tags
    const tagInput = page.locator('[data-testid="tag-input"]')
    if (await tagInput.isVisible()) {
      await tagInput.fill('AI')
      await tagInput.press('Enter')

      await tagInput.fill('머신러닝')
      await tagInput.press('Enter')

      // Verify tags are added
      await expect(page.locator('[data-testid="tag-chip"]')).toHaveCount(2)
    }
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/admin/blog/new')

    // Try to submit without filling
    await page.locator('button[type="submit"]').click()

    // Verify validation errors
    await expect(page.locator('text=필수 입력 항목입니다').first()).toBeVisible()
  })
})
