import { test, expect } from '@playwright/test';

/**
 * 서비스 페이지 E2E 테스트
 *
 * 테스트 시나리오:
 * - 서비스 목록 페이지 렌더링
 * - 서비스 카드 표시
 * - 서비스 상세 페이지 접근
 * - 필터링 및 정렬 기능
 * - 반응형 디자인
 */

test.describe('서비스: 목록 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services');
  });

  test('서비스 목록 페이지가 로드됨', async ({ page }) => {
    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/서비스|Services|IDEA on Action/i);

    // 페이지 헤딩 확인
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('서비스 카드가 표시됨', async ({ page }) => {
    // 서비스 카드 찾기
    const serviceCards = page.locator('[data-testid="service-card"], article, .service-card, [class*="card"]');

    // 최소 1개 이상의 카드 존재
    await expect(serviceCards.first()).toBeVisible();

    // 카드 개수 확인
    const count = await serviceCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('서비스 카드에 필수 정보가 포함됨', async ({ page }) => {
    // 첫 번째 서비스 카드
    const firstCard = page.locator('[data-testid="service-card"], article, .service-card').first();

    if (await firstCard.isVisible()) {
      // 제목 확인
      const title = firstCard.locator('h2, h3, [class*="title"]');
      await expect(title.first()).toBeVisible();

      // 설명 또는 본문 확인
      const description = firstCard.locator('p, [class*="description"]');
      if (await description.count() > 0) {
        await expect(description.first()).toBeVisible();
      }
    }
  });

  test('서비스 카드 클릭 시 상세 페이지로 이동', async ({ page }) => {
    // 첫 번째 서비스 카드의 링크 찾기
    const firstCardLink = page.locator('a[href*="/services/"], [data-testid="service-card"] a').first();

    if (await firstCardLink.isVisible()) {
      await firstCardLink.click();

      // URL이 변경되었는지 확인
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/services\/[^/]+/);
    } else {
      test.skip();
    }
  });

  test('빈 상태 메시지 표시 (서비스가 없을 때)', async ({ page }) => {
    // 서비스 카드가 없으면 빈 상태 메시지 표시
    const serviceCards = page.locator('[data-testid="service-card"], article, .service-card');
    const cardCount = await serviceCards.count();

    if (cardCount === 0) {
      // 빈 상태 메시지 확인
      const emptyMessage = page.locator('text=/서비스가 없습니다|No services|Empty/i');
      await expect(emptyMessage).toBeVisible();
    }
  });
});

test.describe('서비스: 상세 페이지', () => {
  test('서비스 상세 페이지가 로드됨', async ({ page }) => {
    // 먼저 목록 페이지로 이동
    await page.goto('/services');

    // 첫 번째 서비스 링크 찾기
    const firstServiceLink = page.locator('a[href*="/services/"]').first();

    if (await firstServiceLink.isVisible()) {
      const href = await firstServiceLink.getAttribute('href');
      await page.goto(href!);

      // 상세 페이지 렌더링 확인
      await page.waitForLoadState('networkidle');

      // 페이지가 로드되었는지 확인
      const body = page.locator('body');
      await expect(body).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('서비스 상세 정보가 표시됨', async ({ page }) => {
    // 목록 페이지에서 첫 번째 서비스로 이동
    await page.goto('/services');
    const firstServiceLink = page.locator('a[href*="/services/"]').first();

    if (await firstServiceLink.isVisible()) {
      await firstServiceLink.click();
      await page.waitForLoadState('networkidle');

      // 제목 확인
      const title = page.getByRole('heading', { level: 1 });
      await expect(title).toBeVisible();

      // 뒤로 가기 버튼 또는 목록으로 가기 링크
      const backButton = page.locator('a[href="/services"], button:has-text("뒤로"), button:has-text("Back")').first();
      if (await backButton.count() > 0) {
        await expect(backButton).toBeVisible();
      }
    } else {
      test.skip();
    }
  });

  test('404 페이지: 존재하지 않는 서비스', async ({ page }) => {
    // 존재하지 않는 서비스 ID로 접근
    await page.goto('/services/nonexistent-service-12345');

    // 404 메시지 또는 에러 페이지 확인
    await page.waitForTimeout(2000);

    const errorMessages = [
      'text=/404|Not Found|찾을 수 없습니다|존재하지 않습니다/i',
      'h1:has-text("404")',
      'h1:has-text("Not Found")'
    ];

    let errorFound = false;
    for (const selector of errorMessages) {
      if (await page.locator(selector).count() > 0) {
        errorFound = true;
        break;
      }
    }

    expect(errorFound).toBeTruthy();
  });
});

test.describe('서비스: 반응형 디자인', () => {
  test('모바일 뷰포트에서 정상 작동', async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 });

    // 서비스 목록 페이지 로드
    await page.goto('/services');

    // 페이지 헤딩 표시
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // 서비스 카드가 세로로 쌓임 (1열)
    const serviceCards = page.locator('[data-testid="service-card"], article, .service-card');
    if (await serviceCards.count() > 1) {
      const firstCard = serviceCards.nth(0);
      const secondCard = serviceCards.nth(1);

      const firstBox = await firstCard.boundingBox();
      const secondBox = await secondCard.boundingBox();

      if (firstBox && secondBox) {
        // 두 번째 카드가 첫 번째 카드 아래에 있음
        expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 10);
      }
    }
  });

  test('태블릿 뷰포트에서 정상 작동', async ({ page }) => {
    // 태블릿 뷰포트 설정
    await page.setViewportSize({ width: 768, height: 1024 });

    // 서비스 목록 페이지 로드
    await page.goto('/services');

    // 페이지 렌더링 확인
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // 서비스 카드 표시
    const serviceCards = page.locator('[data-testid="service-card"], article, .service-card');
    await expect(serviceCards.first()).toBeVisible();
  });
});
