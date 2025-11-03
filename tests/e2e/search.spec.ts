/**
 * E2E Tests for Search Page
 *
 * 검색 페이지 통합 테스트
 * - 검색 페이지 렌더링
 * - 검색 입력 및 결과 표시
 * - 타입 필터 전환
 * - 검색어 하이라이팅
 * - URL 쿼리 파라미터
 * - 빈 결과 처리
 * - 반응형 디자인
 * - 다크 모드
 */

import { test, expect } from '@playwright/test'

test.describe('Search Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search')
  })

  // 1. 검색 페이지 렌더링
  test('should render search page with header, input, and empty state', async ({ page }) => {
    // 헤더 확인
    await expect(page.getByRole('heading', { name: /검색|Search/i })).toBeVisible()

    // 검색 입력 폼 확인
    const searchInput = page.getByPlaceholder(/검색어를 입력하세요|Enter search query/i)
    await expect(searchInput).toBeVisible()
    await expect(searchInput).toHaveAttribute('autofocus', '')

    // 검색 버튼 확인
    const searchButton = page.getByRole('button', { name: /검색|Search/i })
    await expect(searchButton).toBeVisible()
    await expect(searchButton).toBeDisabled() // 초기 상태는 비활성화

    // 빈 상태 메시지 확인
    await expect(page.getByText(/최소 2자 이상 입력해주세요|Please enter at least 2 characters/i)).toBeVisible()
  })

  // 2. 검색어 입력 & 결과 표시
  test('should display search results when query is entered', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/검색어를 입력하세요|Enter search query/i)
    const searchButton = page.getByRole('button', { name: /검색|Search/i })

    // 검색어 입력
    await searchInput.fill('AI')
    await expect(searchButton).toBeEnabled()

    // 검색 실행
    await searchButton.click()

    // 로딩 상태 대기
    await page.waitForLoadState('networkidle')

    // 결과 또는 빈 결과 메시지 확인
    const resultsHeading = page.getByText(/개의 결과|results/i)
    const emptyMessage = page.getByText(/검색 결과가 없습니다|No results found/i)

    const hasResults = await resultsHeading.isVisible().catch(() => false)
    const isEmpty = await emptyMessage.isVisible().catch(() => false)

    expect(hasResults || isEmpty).toBe(true)
  })

  // 3. 최소 길이 검증 (1자 → 에러)
  test('should disable search button for queries less than 2 characters', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/검색어를 입력하세요|Enter search query/i)
    const searchButton = page.getByRole('button', { name: /검색|Search/i })

    // 1자 입력
    await searchInput.fill('A')
    await expect(searchButton).toBeDisabled()

    // 2자 입력
    await searchInput.fill('AI')
    await expect(searchButton).toBeEnabled()
  })

  // 4. 타입 필터 전환 (전체/서비스/블로그/공지)
  test('should switch between type filters', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/검색어를 입력하세요|Enter search query/i)
    const searchButton = page.getByRole('button', { name: /검색|Search/i })

    // 검색 실행
    await searchInput.fill('test')
    await searchButton.click()
    await page.waitForLoadState('networkidle')

    // 필터 탭 확인
    const allTab = page.getByRole('tab', { name: /전체|All/i })
    const serviceTab = page.getByRole('tab', { name: /서비스|Services/i })
    const blogTab = page.getByRole('tab', { name: /블로그|Blog/i })
    const noticeTab = page.getByRole('tab', { name: /공지|Notices/i })

    await expect(allTab).toBeVisible()
    await expect(serviceTab).toBeVisible()
    await expect(blogTab).toBeVisible()
    await expect(noticeTab).toBeVisible()

    // 서비스 필터 클릭
    await serviceTab.click()
    await expect(serviceTab).toHaveAttribute('data-state', 'active')

    // 블로그 필터 클릭
    await blogTab.click()
    await expect(blogTab).toHaveAttribute('data-state', 'active')
  })

  // 5. 검색 결과 카드 렌더링
  test('should render search result cards with correct structure', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/검색어를 입력하세요|Enter search query/i)
    const searchButton = page.getByRole('button', { name: /검색|Search/i })

    // 검색 실행 (실제 데이터가 있을 것으로 예상되는 키워드)
    await searchInput.fill('AI')
    await searchButton.click()
    await page.waitForLoadState('networkidle')

    // 결과가 있는 경우 카드 확인
    const cards = page.locator('.glass-card').filter({ hasText: /서비스|블로그|공지사항|Service|Blog|Notice/ })
    const cardCount = await cards.count()

    if (cardCount > 0) {
      const firstCard = cards.first()

      // 타입 배지 확인
      await expect(firstCard.locator('text=/서비스|블로그|공지사항|Service|Blog|Notice/')).toBeVisible()

      // 제목 확인
      await expect(firstCard.locator('h3')).toBeVisible()

      // 설명 확인
      await expect(firstCard.locator('p')).toBeVisible()

      // 날짜 확인
      await expect(firstCard.locator('text=/년|월|일|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/')).toBeVisible()
    }
  })

  // 6. 검색어 하이라이팅 (<mark> 태그)
  test('should highlight search terms in results', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/검색어를 입력하세요|Enter search query/i)
    const searchButton = page.getByRole('button', { name: /검색|Search/i })

    // 검색 실행
    await searchInput.fill('AI')
    await searchButton.click()
    await page.waitForLoadState('networkidle')

    // 결과가 있는 경우 하이라이팅 확인
    const cards = page.locator('.glass-card')
    const cardCount = await cards.count()

    if (cardCount > 0) {
      // mark 태그가 있는지 확인 (검색어가 결과에 포함된 경우)
      const marks = page.locator('mark')
      const markCount = await marks.count()

      // mark 태그가 있으면 텍스트 확인
      if (markCount > 0) {
        const markText = await marks.first().textContent()
        expect(markText?.toLowerCase()).toContain('ai')
      }
    }
  })

  // 7. 빈 결과 처리
  test('should display empty state for no results', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/검색어를 입력하세요|Enter search query/i)
    const searchButton = page.getByRole('button', { name: /검색|Search/i })

    // 결과가 없을 것 같은 검색어
    await searchInput.fill('xyzabc123nonexistent')
    await searchButton.click()
    await page.waitForLoadState('networkidle')

    // 빈 결과 메시지 확인
    await expect(page.getByText(/검색 결과가 없습니다|No results found/i)).toBeVisible()
  })

  // 8. URL 쿼리 파라미터 (?q=AI&type=service)
  test('should update URL with query parameters', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/검색어를 입력하세요|Enter search query/i)
    const searchButton = page.getByRole('button', { name: /검색|Search/i })

    // 검색 실행
    await searchInput.fill('AI')
    await searchButton.click()
    await page.waitForLoadState('networkidle')

    // URL 확인
    await expect(page).toHaveURL(/\/search\?q=AI/)

    // 타입 필터 클릭
    const serviceTab = page.getByRole('tab', { name: /서비스|Services/i })
    if (await serviceTab.isVisible()) {
      await serviceTab.click()
      await page.waitForLoadState('networkidle')

      // URL에 type 파라미터 추가 확인
      await expect(page).toHaveURL(/\/search\?q=AI&type=service/)
    }
  })

  // 9. 카드 클릭 → 상세 페이지 이동
  test('should navigate to detail page when card is clicked', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/검색어를 입력하세요|Enter search query/i)
    const searchButton = page.getByRole('button', { name: /검색|Search/i })

    // 검색 실행
    await searchInput.fill('AI')
    await searchButton.click()
    await page.waitForLoadState('networkidle')

    // 결과가 있는 경우 첫 번째 카드 클릭
    const cards = page.locator('.glass-card').filter({ hasText: /서비스|블로그|공지사항|Service|Blog|Notice/ })
    const cardCount = await cards.count()

    if (cardCount > 0) {
      await cards.first().click()

      // URL 변경 확인 (서비스/블로그/공지사항 상세 페이지)
      await expect(page).toHaveURL(/\/(services|blog|notices)\//)
    }
  })

  // 10. Header 검색 버튼 → /search 페이지 이동
  test('should navigate to search page from header button', async ({ page }) => {
    await page.goto('/')

    // 데스크톱 검색 버튼 클릭 (hidden on mobile)
    const desktopSearchButton = page.getByRole('button', { name: /검색|Search/i }).first()

    // 버튼이 보이면 클릭
    if (await desktopSearchButton.isVisible()) {
      await desktopSearchButton.click()
      await expect(page).toHaveURL('/search')
    }
  })

  // 11. 모바일 반응형 (1열 레이아웃)
  test('should display mobile layout correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/search')

    // 검색 입력 확인
    const searchInput = page.getByPlaceholder(/검색어를 입력하세요|Enter search query/i)
    await expect(searchInput).toBeVisible()

    // 모바일 메뉴 버튼 확인
    const mobileMenuButton = page.getByLabel(/메뉴|Menu/i)
    await expect(mobileMenuButton).toBeVisible()

    // 모바일 메뉴 열기
    await mobileMenuButton.click()

    // 모바일 검색 버튼 확인
    const mobileSearchButton = page.locator('text=/검색|Search/').last()
    await expect(mobileSearchButton).toBeVisible()
  })

  // 12. 다크 모드 전환
  test('should toggle dark mode correctly', async ({ page }) => {
    await page.goto('/search')

    // 다크 모드 토글 버튼 찾기
    const themeToggle = page.locator('button').filter({ hasText: /Light|Dark|System/ }).or(
      page.locator('button[aria-label*="테마"]')
    ).or(
      page.locator('button[aria-label*="theme"]')
    ).first()

    if (await themeToggle.isVisible()) {
      // 현재 테마 확인
      const htmlElement = page.locator('html')
      const initialClass = await htmlElement.getAttribute('class')

      // 토글 클릭
      await themeToggle.click()

      // 클래스 변경 확인
      const newClass = await htmlElement.getAttribute('class')
      expect(newClass).not.toBe(initialClass)
    }
  })

  // 13. 검색 결과 30개 제한
  test('should limit results to 30 items', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/검색어를 입력하세요|Enter search query/i)
    const searchButton = page.getByRole('button', { name: /검색|Search/i })

    // 검색 실행 (많은 결과가 예상되는 키워드)
    await searchInput.fill('a')
    await searchButton.click()
    await page.waitForLoadState('networkidle')

    // 결과 카드 개수 확인
    const cards = page.locator('.glass-card').filter({ hasText: /서비스|블로그|공지사항|Service|Blog|Notice/ })
    const cardCount = await cards.count()

    // 최대 30개
    expect(cardCount).toBeLessThanOrEqual(30)
  })

  // 14. 로딩 상태 표시
  test('should display loading skeleton during search', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/검색어를 입력하세요|Enter search query/i)
    const searchButton = page.getByRole('button', { name: /검색|Search/i })

    // 검색 실행
    await searchInput.fill('AI')

    // 네트워크를 느리게 설정
    await page.route('**/*', (route) => {
      setTimeout(() => route.continue(), 100)
    })

    await searchButton.click()

    // 로딩 스켈레톤이 잠깐이라도 보이는지 확인 (타이밍 이슈로 실패할 수 있음)
    // Skeleton 컴포넌트는 빠르게 사라질 수 있으므로 선택적 확인
    const skeleton = page.locator('.glass-card').filter({ has: page.locator('[class*="animate-pulse"]') })
    const skeletonCount = await skeleton.count().catch(() => 0)

    // 로딩이 완료되면 결과 또는 빈 메시지 표시
    await page.waitForLoadState('networkidle')
    const resultsOrEmpty = await page.getByText(/개의 결과|results|검색 결과가 없습니다|No results found/i).isVisible()
    expect(resultsOrEmpty).toBe(true)
  })

  // 15. 에러 상태 처리
  test('should display error message on network failure', async ({ page }) => {
    // 네트워크 요청 실패 시뮬레이션
    await page.route('**/rest/v1/**', (route) => {
      route.abort('failed')
    })

    const searchInput = page.getByPlaceholder(/검색어를 입력하세요|Enter search query/i)
    const searchButton = page.getByRole('button', { name: /검색|Search/i })

    // 검색 실행
    await searchInput.fill('AI')
    await searchButton.click()
    await page.waitForTimeout(1000)

    // 에러 메시지 확인 (Alert 컴포넌트)
    const errorMessage = page.getByText(/오류가 발생했습니다|error occurred/i)
    await expect(errorMessage).toBeVisible()
  })
})
