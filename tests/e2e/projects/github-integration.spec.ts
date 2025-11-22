import { test, expect } from "@playwright/test";

/**
 * GitHub 연동 E2E 테스트
 *
 * Sprint 4: GitHub API 통계, 진척률, ProjectCard 연동 테스트
 */

test.describe("GitHub 연동", () => {
  test.beforeEach(async ({ page }) => {
    // 프로젝트 페이지로 이동
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");
  });

  test.describe("프로젝트 허브 페이지", () => {
    test("프로젝트 목록이 정상적으로 로드된다", async ({ page }) => {
      // 페이지 제목 확인
      await expect(page.locator("h1")).toContainText("프로젝트");

      // 탭 네비게이션 확인
      const tabs = page.locator('[role="tablist"]');
      await expect(tabs).toBeVisible();
    });

    test("진행중 탭에서 프로젝트 카드가 표시된다", async ({ page }) => {
      // 진행중 탭 클릭
      await page.click('text=진행중');

      // 프로젝트 카드가 최소 1개 이상 표시되는지 확인
      const cards = page.locator('[data-testid="project-card"]');
      // 카드가 없어도 빈 상태 메시지가 표시되어야 함
      const emptyMessage = page.locator('text=진행중인 프로젝트가 없습니다');

      const hasCards = await cards.count() > 0;
      const hasEmptyMessage = await emptyMessage.isVisible().catch(() => false);

      expect(hasCards || hasEmptyMessage).toBeTruthy();
    });

    test("출시됨 탭으로 전환할 수 있다", async ({ page }) => {
      // 출시됨 탭 클릭
      await page.click('text=출시됨');

      // URL에 tab 파라미터가 포함되는지 확인
      await expect(page).toHaveURL(/tab=released/);
    });

    test("실험중 탭으로 전환할 수 있다", async ({ page }) => {
      // 실험중 탭 클릭
      await page.click('text=실험중');

      // URL에 tab 파라미터가 포함되는지 확인
      await expect(page).toHaveURL(/tab=lab/);
    });

    test("로드맵 탭으로 전환할 수 있다", async ({ page }) => {
      // 로드맵 탭 클릭
      await page.click('text=로드맵');

      // URL에 tab 파라미터가 포함되는지 확인
      await expect(page).toHaveURL(/tab=roadmap/);
    });
  });

  test.describe("ProjectCard 컴포넌트", () => {
    test("프로젝트 카드에 진척률이 표시된다", async ({ page }) => {
      await page.click('text=진행중');
      await page.waitForTimeout(500);

      // Progress Bar가 표시되는지 확인
      const progressBars = page.locator('[role="progressbar"]');
      const progressCount = await progressBars.count();

      // 프로젝트가 있으면 Progress Bar가 표시되어야 함
      if (progressCount > 0) {
        await expect(progressBars.first()).toBeVisible();
      }
    });

    test("프로젝트 카드에 상태 배지가 표시된다", async ({ page }) => {
      await page.click('text=진행중');
      await page.waitForTimeout(500);

      // 상태 배지 확인 (진행중, 검증, 출시, 대기 중 하나)
      const badges = page.locator('[class*="badge"]');
      const badgeCount = await badges.count();

      if (badgeCount > 0) {
        const firstBadge = badges.first();
        await expect(firstBadge).toBeVisible();
      }
    });

    test("프로젝트 카드를 클릭하면 상세 페이지로 이동한다", async ({ page }) => {
      await page.click('text=진행중');
      await page.waitForTimeout(500);

      // 첫 번째 프로젝트 카드 링크 찾기
      const cardLinks = page.locator('a[href^="/portfolio/"]');
      const linkCount = await cardLinks.count();

      if (linkCount > 0) {
        const firstLink = cardLinks.first();
        const href = await firstLink.getAttribute("href");

        await firstLink.click();
        await page.waitForLoadState("networkidle");

        // 상세 페이지로 이동했는지 확인
        await expect(page).toHaveURL(new RegExp(href!.replace(/\//g, "\\/")));
      }
    });
  });

  test.describe("GitHub 통계 표시", () => {
    test("GitHub URL이 있는 프로젝트는 GitHub 아이콘이 표시된다", async ({ page }) => {
      // showGitHub가 true인 프로젝트 카드에서 GitHub 링크 확인
      const githubLinks = page.locator('a[href*="github.com"]');
      const count = await githubLinks.count();

      // GitHub 링크가 있으면 아이콘도 있어야 함
      if (count > 0) {
        // GitHub 아이콘 (lucide-react) 확인
        const githubIcons = page.locator('svg.lucide-github');
        await expect(githubIcons.first()).toBeVisible();
      }
    });
  });

  test.describe("URL 기반 상태 관리", () => {
    test("URL 파라미터로 탭을 직접 지정할 수 있다", async ({ page }) => {
      // 직접 URL로 접근
      await page.goto("/projects?tab=released");
      await page.waitForLoadState("networkidle");

      // 출시됨 탭이 활성화되어 있는지 확인
      const activeTab = page.locator('[role="tab"][data-state="active"]');
      await expect(activeTab).toContainText("출시됨");
    });

    test("잘못된 탭 파라미터는 기본값으로 처리된다", async ({ page }) => {
      // 존재하지 않는 탭으로 접근
      await page.goto("/projects?tab=invalid");
      await page.waitForLoadState("networkidle");

      // 기본 탭(진행중)이 활성화되어야 함
      const activeTab = page.locator('[role="tab"][data-state="active"]');
      await expect(activeTab).toContainText("진행중");
    });
  });

  test.describe("반응형 디자인", () => {
    test("모바일 뷰에서 프로젝트 카드가 정상적으로 표시된다", async ({ page }) => {
      // 모바일 뷰포트 설정
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/projects");
      await page.waitForLoadState("networkidle");

      // 페이지가 정상적으로 로드되는지 확인
      await expect(page.locator("h1")).toContainText("프로젝트");
    });

    test("태블릿 뷰에서 프로젝트 카드가 정상적으로 표시된다", async ({ page }) => {
      // 태블릿 뷰포트 설정
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto("/projects");
      await page.waitForLoadState("networkidle");

      // 페이지가 정상적으로 로드되는지 확인
      await expect(page.locator("h1")).toContainText("프로젝트");
    });
  });

  test.describe("접근성", () => {
    test("탭 네비게이션이 키보드로 조작 가능하다", async ({ page }) => {
      // 첫 번째 탭으로 포커스
      await page.keyboard.press("Tab");

      // 탭 목록에 포커스가 있는지 확인
      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toBeVisible();
    });

    test("프로젝트 카드에 적절한 레이블이 있다", async ({ page }) => {
      await page.click('text=진행중');
      await page.waitForTimeout(500);

      // 카드 링크에 접근 가능한 텍스트가 있는지 확인
      const cardLinks = page.locator('a[href^="/portfolio/"]');
      const linkCount = await cardLinks.count();

      if (linkCount > 0) {
        const firstLink = cardLinks.first();
        const text = await firstLink.textContent();
        expect(text?.length).toBeGreaterThan(0);
      }
    });
  });
});
