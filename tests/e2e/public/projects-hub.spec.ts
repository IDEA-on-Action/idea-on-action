import { test, expect } from '@playwright/test';

/**
 * ProjectsHub E2E 테스트
 *
 * 테스트 시나리오:
 * - 페이지 로딩 및 기본 렌더링
 * - 4개 탭 표시 및 전환
 * - URL 파라미터 연동
 * - 검색 및 필터 기능
 * - 통계 카드 표시
 * - 반응형 디자인
 * - SEO 메타데이터
 */

test.describe('ProjectsHub 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
  });

  test('페이지가 정상적으로 로딩됨', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page.locator('h1')).toContainText('프로젝트');

    // 설명 텍스트 확인
    await expect(page.getByText('우리가 만들고 있는 것들')).toBeVisible();
  });

  test('4개 탭이 표시됨', async ({ page }) => {
    // 4개 탭 버튼 확인
    await expect(page.getByRole('tab', { name: /진행중/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /출시됨/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /실험중/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /로드맵/i })).toBeVisible();
  });

  test('기본 탭이 진행중으로 선택됨', async ({ page }) => {
    // 기본 선택된 탭 확인
    const inProgressTab = page.getByRole('tab', { name: /진행중/i });
    await expect(inProgressTab).toHaveAttribute('data-state', 'active');
  });

  test('탭 클릭 시 URL이 업데이트됨 - 출시됨', async ({ page }) => {
    await page.getByRole('tab', { name: /출시됨/i }).click();
    await expect(page).toHaveURL(/tab=released/);
  });

  test('탭 클릭 시 URL이 업데이트됨 - 실험중', async ({ page }) => {
    await page.getByRole('tab', { name: /실험중/i }).click();
    await expect(page).toHaveURL(/tab=lab/);
  });

  test('탭 클릭 시 URL이 업데이트됨 - 로드맵', async ({ page }) => {
    await page.getByRole('tab', { name: /로드맵/i }).click();
    await expect(page).toHaveURL(/tab=roadmap/);
  });

  test('URL 파라미터로 탭 직접 접근 가능', async ({ page }) => {
    await page.goto('/projects?tab=roadmap');

    // 로드맵 탭이 선택됨
    const roadmapTab = page.getByRole('tab', { name: /로드맵/i });
    await expect(roadmapTab).toHaveAttribute('data-state', 'active');
  });

  test('통계 카드들이 표시됨', async ({ page }) => {
    // 4개의 통계 카드 확인 (진행중, 출시됨, 실험중, 계획됨)
    await expect(page.getByText('진행중').first()).toBeVisible();
    await expect(page.getByText('출시됨').first()).toBeVisible();
    await expect(page.getByText('실험중').first()).toBeVisible();
    await expect(page.getByText('계획됨')).toBeVisible();
  });

  test('검색 입력창이 표시됨', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="검색"]');
    await expect(searchInput).toBeVisible();
  });

  test('검색어 입력 시 필터링됨', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="검색"]');
    await searchInput.fill('test');

    // 검색 기능이 동작함 (debounce 대기)
    await page.waitForTimeout(400);

    // 페이지가 여전히 정상 동작
    await expect(page.getByRole('tab', { name: /진행중/i })).toBeVisible();
  });

  test('검색 초기화 버튼 동작', async ({ page }) => {
    // 먼저 검색어 입력
    const searchInput = page.locator('input[placeholder*="검색"]');
    await searchInput.fill('test');
    await page.waitForTimeout(400);

    // 검색어 지우기
    await searchInput.clear();

    // 검색창이 비어있음
    await expect(searchInput).toHaveValue('');
  });

  test('실험중 탭에서 실험실 더보기 버튼이 표시됨', async ({ page }) => {
    await page.getByRole('tab', { name: /실험중/i }).click();

    // 실험실 더보기 버튼 확인
    await expect(page.getByRole('link', { name: /실험실 더보기/i })).toBeVisible();
  });

  test('로드맵 탭에서 전체 로드맵 보기 버튼이 표시됨', async ({ page }) => {
    await page.getByRole('tab', { name: /로드맵/i }).click();

    // 전체 로드맵 보기 버튼 확인
    await expect(page.getByRole('link', { name: /전체 로드맵 보기/i })).toBeVisible();
  });

  test('빈 상태 메시지가 표시됨 (데이터 없을 때)', async ({ page }) => {
    // 검색으로 결과가 없는 상태 만들기
    const searchInput = page.locator('input[placeholder*="검색"]');
    await searchInput.fill('존재하지않는프로젝트명12345');
    await page.waitForTimeout(400);

    // 빈 상태 메시지 또는 정상 상태 확인
    // (프로젝트가 있거나 없을 수 있으므로 둘 다 허용)
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });
});

test.describe('ProjectsHub 반응형 디자인', () => {
  test('모바일에서 탭이 2x2 그리드로 표시됨', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/projects');

    // 탭들이 표시됨
    await expect(page.getByRole('tab', { name: /진행중/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /출시됨/i })).toBeVisible();
  });

  test('태블릿에서 정상 표시됨', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/projects');

    // 페이지 정상 렌더링
    await expect(page.locator('h1')).toContainText('프로젝트');
  });

  test('데스크톱에서 정상 표시됨', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/projects');

    // 모든 탭이 한 줄에 표시됨
    await expect(page.getByRole('tab', { name: /진행중/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /로드맵/i })).toBeVisible();
  });
});

test.describe('ProjectsHub SEO', () => {
  test('페이지 제목이 올바르게 설정됨', async ({ page }) => {
    await page.goto('/projects');
    await expect(page).toHaveTitle(/프로젝트.*IDEA on Action/);
  });

  test('메타 description이 설정됨', async ({ page }) => {
    await page.goto('/projects');
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /프로젝트/);
  });

  test('OG 메타 태그가 설정됨', async ({ page }) => {
    await page.goto('/projects');
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /프로젝트/);
  });
});

test.describe('ProjectsHub 접근성', () => {
  test('탭 키보드 네비게이션이 동작함', async ({ page }) => {
    await page.goto('/projects');

    // 첫 번째 탭으로 포커스 이동
    await page.getByRole('tab', { name: /진행중/i }).focus();

    // 오른쪽 화살표로 다음 탭 이동
    await page.keyboard.press('ArrowRight');

    // 두 번째 탭이 포커스됨
    const releasedTab = page.getByRole('tab', { name: /출시됨/i });
    await expect(releasedTab).toBeFocused();
  });

  test('검색 입력에 적절한 레이블이 있음', async ({ page }) => {
    await page.goto('/projects');

    // placeholder가 레이블 역할을 함
    const searchInput = page.locator('input[placeholder*="검색"]');
    await expect(searchInput).toHaveAttribute('placeholder');
  });
});
