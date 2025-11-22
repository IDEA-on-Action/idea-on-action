# Sprint 2: 프로젝트 페이지 통합

> Phase 2 - 포트폴리오 + 로드맵 + 실험실 → 프로젝트 허브 통합

**시작일**: 2025-11-23 (즉시 시작)
**종료일**: 2025-11-27 (예정)
**소요 기간**: 4일 (병렬 진행)
**의존성**: Sprint 1 완료 ✅
**상태**: 🚀 진행 중

---

## 스프린트 목표

1. ProjectsHub 완성 (탭 기반 통합)
2. 기존 Portfolio, Lab, Roadmap 로직 이전
3. 프로젝트 카드 진척률 표시
4. 프로젝트 상세 페이지 개선

---

## 작업 목록

### TASK-010: ProjectsHub.tsx 완성
**예상 시간**: 3시간
**담당**: Agent 1
**의존성**: Sprint 1 완료

**설명**:
Sprint 1에서 생성한 스켈레톤을 완성

**구현 내용**:
- 탭 네비게이션 (진행중/출시됨/실험중/로드맵)
- URL 쿼리 파라미터 연동
- 프로젝트 통계 표시 (전체, 진행중, 출시, 실험중)
- 필터 및 검색 기능

**완료 기준**:
- [ ] 4개 탭 전환 동작
- [ ] URL 쿼리 파라미터 동기화
- [ ] 통계 카드 표시
- [ ] 반응형 레이아웃

---

### TASK-011: 탭 컴포넌트 추출
**예상 시간**: 4시간
**담당**: Agent 1
**의존성**: TASK-010

**생성할 파일**:
```
src/pages/projects/tabs/InProgressTab.tsx
src/pages/projects/tabs/ReleasedTab.tsx
src/pages/projects/tabs/LabTab.tsx
src/pages/projects/tabs/RoadmapTab.tsx
```

**InProgressTab.tsx**:
- 기존 Portfolio.tsx에서 "진행중" 상태 필터 로직 이전
- useProjects({ status: 'in-progress' }) 사용
- ProjectCard 컴포넌트 사용

**ReleasedTab.tsx**:
- 기존 Portfolio.tsx에서 "출시" 상태 필터 로직 이전
- useProjects({ status: 'released' }) 사용

**LabTab.tsx**:
- 기존 Lab.tsx 로직 이전
- useBounties() 사용
- 바운티 카드 컴포넌트 재사용

**RoadmapTab.tsx**:
- 기존 Roadmap.tsx 로직 이전
- useRoadmap() 사용
- 분기별 필터, 마일스톤 표시

**완료 기준**:
- [ ] 4개 탭 컴포넌트 생성
- [ ] 각 탭 데이터 로딩 정상
- [ ] 기존 기능 100% 유지

---

### TASK-012: ProjectCard.tsx 확장
**예상 시간**: 2시간
**담당**: Agent 2
**의존성**: 없음

**설명**:
기존 프로젝트 카드에 진척률 및 추가 정보 표시

**추가 기능**:
```typescript
interface ProjectCardProps {
  // 기존
  project: Project;

  // 신규
  showProgress?: boolean;  // 진척률 표시
  showGitHub?: boolean;    // GitHub 정보 표시
  compact?: boolean;       // 컴팩트 모드 (홈용)
}
```

**표시 요소**:
- 진척률 Progress Bar (0-100%)
- 상태 배지 (진행중/검증/출시/대기)
- GitHub 정보 (커밋 수, 기여자 수) - Phase 4에서 연동
- 기술 스택 태그

**완료 기준**:
- [ ] Progress Bar 표시
- [ ] 상태 배지 표시
- [ ] compact 모드 동작
- [ ] 기존 기능 유지

---

### TASK-013: ProjectDetail.tsx 생성
**예상 시간**: 3시간
**담당**: Agent 2
**의존성**: TASK-012

**설명**:
기존 PortfolioDetail.tsx를 이전 및 확장

**표시 요소**:
- 프로젝트 제목, 설명
- 진척률 (큰 Progress Bar)
- 타임라인 (마일스톤)
- 기술 스택
- GitHub 링크
- 팀/기여자 정보
- 갤러리 (스크린샷)

**완료 기준**:
- [ ] /projects/:slug 접근 가능
- [ ] 기존 PortfolioDetail 기능 유지
- [ ] 타임라인 표시
- [ ] 반응형 레이아웃

---

### TASK-014: 기존 훅 연동 검증
**예상 시간**: 1시간
**담당**: Agent 3
**의존성**: TASK-011

**검증 항목**:
```typescript
// 프로젝트
useProjects() - 필터링, 정렬 동작 확인
useProjectBySlug() - 상세 조회 동작 확인

// 바운티
useBounties() - 필터링 동작 확인

// 로드맵
useRoadmap() - 분기별 필터 동작 확인
```

**완료 기준**:
- [ ] 모든 훅 정상 동작
- [ ] 에러 핸들링 정상
- [ ] 로딩 상태 표시

---

### TASK-015: E2E 테스트 작성 (프로젝트)
**예상 시간**: 2시간
**담당**: Agent 4
**의존성**: TASK-010~014

**테스트 파일**:
```
tests/e2e/projects/projects-hub.spec.ts
tests/e2e/projects/project-detail.spec.ts
```

**테스트 케이스**:
```typescript
test.describe('ProjectsHub', () => {
  test('displays 4 tabs', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByRole('tab')).toHaveCount(4);
  });

  test('tab navigation updates URL', async ({ page }) => {
    await page.goto('/projects');
    await page.getByRole('tab', { name: '로드맵' }).click();
    await expect(page).toHaveURL('/projects?tab=roadmap');
  });

  test('in-progress tab shows projects', async ({ page }) => {
    await page.goto('/projects?tab=in-progress');
    await expect(page.getByTestId('project-card')).toBeVisible();
  });

  test('lab tab shows bounties', async ({ page }) => {
    await page.goto('/projects?tab=lab');
    await expect(page.getByTestId('bounty-card')).toBeVisible();
  });
});
```

**완료 기준**:
- [ ] ProjectsHub 테스트 10개 작성
- [ ] ProjectDetail 테스트 5개 작성
- [ ] 전체 테스트 통과

---

## 스프린트 일정

```
Day 1 (월):
├── TASK-010: ProjectsHub 완성 (Agent 1)
├── TASK-012: ProjectCard 확장 (Agent 2)
└── 코드 리뷰

Day 2 (화):
├── TASK-011: 탭 컴포넌트 추출 시작 (Agent 1)
├── TASK-013: ProjectDetail 생성 (Agent 2)
└── 병렬 진행

Day 3 (수):
├── TASK-011: 탭 컴포넌트 계속 (Agent 1)
├── TASK-014: 훅 연동 검증 (Agent 3)
└── 버그 수정

Day 4 (목):
├── TASK-015: E2E 테스트 (Agent 4)
├── 통합 테스트
└── 리팩토링

Day 5 (금):
├── 최종 검증
├── 빌드 테스트
└── Sprint 3 준비
```

---

## 완료 기준

### 필수
- [ ] /projects 페이지 4개 탭 동작
- [ ] 기존 Portfolio, Lab, Roadmap 기능 100% 유지
- [ ] 프로젝트 카드 진척률 표시
- [ ] 프로젝트 상세 페이지 동작

### 선택
- [ ] E2E 테스트 15개 이상
- [ ] Lighthouse 점수 90+ 유지
- [ ] 번들 크기 5% 이내 증가

---

## 관련 문서

- [sprint-1.md](./sprint-1.md)
- [sprint-3.md](./sprint-3.md)
- [architecture.md](../../plan/site-restructure/architecture.md)
