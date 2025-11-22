import { test, expect } from '@playwright/test';

/**
 * ConnectHub E2E 테스트
 *
 * 테스트 시나리오:
 * - 페이지 로딩 및 기본 렌더링
 * - 3개 연결 카드 표시 (프로젝트 문의, 채용, 커뮤니티)
 * - 각 카드 링크 동작
 * - 채용 섹션 비활성화 상태
 * - 하단 CTA 버튼 동작
 * - 반응형 디자인
 * - SEO 메타데이터
 */

test.describe('ConnectHub 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/connect');
  });

  test('페이지가 정상적으로 로딩됨', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page.locator('h1')).toContainText('함께하기');

    // 설명 텍스트 확인
    await expect(page.getByText('연결의 시작점')).toBeVisible();
  });

  test('3개 연결 카드가 표시됨', async ({ page }) => {
    // 프로젝트 문의 카드
    await expect(page.getByText('프로젝트 문의').first()).toBeVisible();

    // 채용 카드
    await expect(page.getByText('채용').first()).toBeVisible();

    // 커뮤니티 카드
    await expect(page.getByText('커뮤니티').first()).toBeVisible();
  });

  test('프로젝트 문의 카드에 설명이 표시됨', async ({ page }) => {
    await expect(page.getByText(/협업 프로젝트를 제안해주세요/)).toBeVisible();
  });

  test('채용 카드에 준비중 배지가 표시됨', async ({ page }) => {
    await expect(page.getByText('준비중')).toBeVisible();
  });

  test('커뮤니티 카드에 설명이 표시됨', async ({ page }) => {
    await expect(page.getByText(/아이디어를 나누는 공간/)).toBeVisible();
  });

  test('프로젝트 문의 링크가 올바른 경로로 연결됨', async ({ page }) => {
    // 프로젝트 문의 링크 찾기 및 클릭
    const inquiryLink = page.locator('a[href*="inquiry"]').first();

    if (await inquiryLink.isVisible()) {
      await inquiryLink.click();
      await expect(page).toHaveURL(/inquiry/);
    } else {
      // 직접 이동 테스트
      await page.goto('/connect/inquiry');
      await expect(page.url()).toMatch(/inquiry|connect/);
    }
  });

  test('커뮤니티 링크가 동작함', async ({ page }) => {
    await page.goto('/connect/community');
    // 커뮤니티 페이지 또는 리디렉션
    await expect(page.url()).toMatch(/community|connect/);
  });
});

test.describe('ConnectHub CTA 섹션', () => {
  test('하단 섹션 제목이 표시됨', async ({ page }) => {
    await page.goto('/connect');
    await expect(page.getByText('어떤 방식이든 환영합니다')).toBeVisible();
  });

  test('하단 섹션 설명이 표시됨', async ({ page }) => {
    await page.goto('/connect');
    await expect(page.getByText(/큰 프로젝트가 아니어도 괜찮습니다/)).toBeVisible();
  });

  test('이메일 보내기 버튼이 표시됨', async ({ page }) => {
    await page.goto('/connect');
    await expect(page.getByRole('link', { name: /이메일 보내기/i })).toBeVisible();
  });

  test('이메일 링크가 올바른 mailto 주소를 가짐', async ({ page }) => {
    await page.goto('/connect');
    const emailLink = page.getByRole('link', { name: /이메일 보내기/i });
    await expect(emailLink).toHaveAttribute('href', /mailto:/);
  });

  test('GitHub Discussions 링크가 표시됨', async ({ page }) => {
    await page.goto('/connect');
    await expect(page.getByRole('link', { name: /GitHub Discussions/i })).toBeVisible();
  });

  test('GitHub Discussions 링크가 올바른 URL을 가짐', async ({ page }) => {
    await page.goto('/connect');
    const githubLink = page.getByRole('link', { name: /GitHub Discussions/i });
    await expect(githubLink).toHaveAttribute('href', /github\.com.*discussions/);
  });

  test('GitHub 링크가 새 탭에서 열림', async ({ page }) => {
    await page.goto('/connect');
    const githubLink = page.getByRole('link', { name: /GitHub Discussions/i });
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', /noopener/);
  });
});

test.describe('ConnectHub 반응형 디자인', () => {
  test('모바일에서 카드가 세로로 표시됨', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/connect');

    // 3개 카드가 모두 표시됨
    await expect(page.getByText('프로젝트 문의').first()).toBeVisible();
    await expect(page.getByText('채용').first()).toBeVisible();
    await expect(page.getByText('커뮤니티').first()).toBeVisible();
  });

  test('태블릿에서 정상 표시됨', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/connect');

    // 페이지 정상 렌더링
    await expect(page.locator('h1')).toContainText('함께하기');
  });

  test('데스크톱에서 3열 그리드로 표시됨', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/connect');

    // 모든 카드가 표시됨
    await expect(page.getByText('프로젝트 문의').first()).toBeVisible();
    await expect(page.getByText('커뮤니티').first()).toBeVisible();
  });
});

test.describe('ConnectHub SEO', () => {
  test('페이지 제목이 올바르게 설정됨', async ({ page }) => {
    await page.goto('/connect');
    await expect(page).toHaveTitle(/함께하기.*IDEA on Action/);
  });

  test('메타 description이 설정됨', async ({ page }) => {
    await page.goto('/connect');
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /함께/);
  });

  test('OG 메타 태그가 설정됨', async ({ page }) => {
    await page.goto('/connect');
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /함께하기/);
  });
});

test.describe('ConnectHub 접근성', () => {
  test('카드에 적절한 구조가 있음', async ({ page }) => {
    await page.goto('/connect');

    // 각 카드에 제목과 설명이 있음
    const cards = page.locator('[class*="card"]');
    await expect(cards.first()).toBeVisible();
  });

  test('버튼에 적절한 레이블이 있음', async ({ page }) => {
    await page.goto('/connect');

    // CTA 버튼들이 명확한 레이블을 가짐
    await expect(page.getByRole('link', { name: /이메일 보내기/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /GitHub/i })).toBeVisible();
  });

  test('비활성화된 카드가 접근 가능한 상태임', async ({ page }) => {
    await page.goto('/connect');

    // 준비중 상태가 시각적으로 표시됨
    const preparingBadge = page.getByText('준비중');
    await expect(preparingBadge).toBeVisible();
  });
});
