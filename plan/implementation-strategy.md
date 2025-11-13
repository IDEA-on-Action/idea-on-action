# Version 2.0 구현 전략 (Implementation Strategy)

> 구현 순서, 우선순위, 위험 관리 전략

**작성일**: 2025-11-13
**버전**: 2.0.0
**상태**: 📋 Draft

---

## 🎯 전체 구현 전략

### Big Picture
```
Sprint 1 (Week 1) → Sprint 2 (Week 2) → Sprint 3 (Week 3)
      │                    │                    │
      ▼                    ▼                    ▼
  정적 페이지         Supabase 연동         자동화 & 배포
   (28시간)             (40시간)             (40시간)
```

### 핵심 원칙
1. **점진적 구현**: 정적 → 동적 → 자동화 순서
2. **위험 우선**: 불확실성 높은 작업 먼저
3. **테스트 주도**: 각 Sprint마다 테스트 작성
4. **문서 동기화**: 코드 변경 시 명세 업데이트

---

## 📅 Sprint별 구현 전략

### Sprint 1: Structure & Static Data (Week 1)

#### 목표
- 정보 아키텍처 구축
- 정적 데이터 기반 페이지 완성
- SEO 최적화

#### 우선순위
1. **High**: 라우팅, About, Portfolio, Roadmap
2. **Medium**: Now, Lab, Home 강화
3. **Low**: SEO/OG 메타태그

#### 구현 순서
```
Day 1-2: 라우팅 & About 페이지
├── Task-S1-001: 라우팅 구조 확장
├── Task-S1-002: About 페이지 구현
└── 검증: 페이지 접근 가능, 렌더링 성공

Day 3-4: 정적 데이터 & Portfolio
├── Task-S1-003: projects.json 생성
├── Task-S1-004: Portfolio 페이지 구현
├── Task-S1-005: Portfolio 상세 페이지
└── 검증: 필터 동작, 상세 페이지 동작

Day 5-6: Roadmap, Now, Lab
├── Task-S1-006: roadmap.json, logs.json, bounties.json 생성
├── Task-S1-007: Roadmap 페이지 구현
├── Task-S1-008: Now 페이지 구현
├── Task-S1-009: Lab 페이지 구현
└── 검증: 모든 페이지 렌더링

Day 7: Home 강화 & SEO
├── Task-S1-010: Home 페이지 강화
├── Task-S1-011: SEO/OG 메타태그 추가
├── Task-S1-012: Lighthouse 성능 검증
└── 검증: Lighthouse 90+ 달성
```

#### 위험 관리
- **위험**: 정적 데이터 형식 불일치
- **완화**: TypeScript 타입 정의로 검증
- **위험**: Lighthouse 점수 미달
- **완화**: 이미지 최적화, Lazy Loading

---

### Sprint 2: Supabase Integration & Community (Week 2)

#### 목표
- Supabase 테이블 생성 및 연동
- Admin CRUD 페이지 구현
- Giscus, Newsletter 통합

#### 우선순위
1. **High**: Supabase 스키마, CRUD 훅, Admin 페이지
2. **Medium**: Giscus, Newsletter
3. **Low**: Work with Us 폼

#### 구현 순서
```
Day 1-2: Supabase 스키마 & 훅
├── Supabase Migration 파일 작성
├── RLS 정책 설정
├── useProjects, useRoadmap, useLogs, useBounties, usePosts 훅
└── 검증: Supabase 테이블 생성, 훅 동작

Day 3-4: 페이지 Supabase 연동
├── Portfolio 페이지 (정적 → Supabase)
├── Roadmap 페이지 (정적 → Supabase)
├── Now 페이지 (정적 → Supabase)
├── Lab 페이지 (정적 → Supabase)
└── 검증: 데이터 정상 표시, 에러 처리

Day 5-6: Admin CRUD 페이지
├── /admin/projects (목록, 생성, 수정, 삭제)
├── /admin/roadmap (목록, 생성, 수정, 삭제)
├── /admin/logs (목록, 생성, 수정, 삭제)
├── /admin/bounties (목록, 생성, 수정, 삭제)
└── 검증: CRUD 동작, 관리자 권한 확인

Day 7: Giscus, Newsletter, Work with Us
├── Giscus 통합 (Community, BlogPost)
├── Newsletter 통합 (Footer, Home)
├── Work with Us 폼 구현
└── 검증: 댓글 로드, 구독 가능, 폼 제출 성공
```

#### 위험 관리
- **위험**: RLS 정책 오류 (403 Forbidden)
- **완화**: fix-rls-policies-all.sql 참고, 테스트 계정 검증
- **위험**: Supabase 무료 플랜 제한 초과
- **완화**: 데이터 크기 모니터링, 정기 정리

---

### Sprint 3: Automation & Open Metrics (Week 3)

#### 목표
- Weekly Recap 자동 생성
- Status 페이지 구축
- E2E/Unit 테스트 작성
- 프로덕션 배포

#### 우선순위
1. **High**: Weekly Recap, Status 페이지, E2E 테스트
2. **Medium**: 단위 테스트, SEO 최적화
3. **Low**: 이벤트 트래킹

#### 구현 순서
```
Day 1-2: Weekly Recap & Status 페이지
├── Supabase Edge Function (generate-weekly-recap)
├── Cron Job 설정
├── Status 페이지 구현
├── aggregate-metrics Edge Function
└── 검증: Recap 생성 성공, Metrics API 동작

Day 3-4: 이벤트 트래킹 & 단위 테스트
├── GA4 이벤트 정의 및 삽입
├── 훅 테스트 (useProjects, useRoadmap, etc.)
├── 컴포넌트 테스트 (ProjectCard, RoadmapCard, etc.)
└── 검증: 이벤트 트래킹 동작, 테스트 통과

Day 5-6: E2E 테스트
├── 사용자 여정 테스트 (3개)
├── CRUD 테스트 (5개)
├── 폼 제출 테스트 (2개)
└── 검증: E2E 테스트 통과 (20개)

Day 7: SEO 최적화 & 최종 배포
├── sitemap.xml 동적 생성
├── robots.txt 업데이트
├── 구조화 데이터 (JSON-LD)
├── 최종 배포 (Vercel)
└── 검증: Lighthouse 90+, 프로덕션 정상 동작
```

#### 위험 관리
- **위험**: Edge Function 타임아웃 (30초 제한)
- **완화**: 로직 최적화, 배치 처리
- **위험**: E2E 테스트 불안정 (Flaky Tests)
- **완화**: 명시적 대기, 재시도 로직

---

## 🔄 구현 패턴

### 1. 페이지 구현 패턴

#### Step 1: 라우팅 추가
```typescript
// App.tsx
<Route path="/new-page" element={<NewPage />} />
```

#### Step 2: 페이지 컴포넌트 생성
```typescript
// src/pages/NewPage.tsx
import { PageLayout } from '@/components/layout/PageLayout';

export function NewPage() {
  return (
    <PageLayout>
      <HeroSection />
      <Section>{/* Content */}</Section>
    </PageLayout>
  );
}
```

#### Step 3: 데이터 훅 연동
```typescript
// src/hooks/useData.ts
export function useData() {
  return useQuery({
    queryKey: ['data'],
    queryFn: () => supabase.from('table').select()
  });
}
```

#### Step 4: 테스트 작성
```typescript
// tests/e2e/new-page.spec.ts
test('renders new page', async ({ page }) => {
  await page.goto('/new-page');
  await expect(page).toHaveTitle(/New Page/);
});
```

---

### 2. CRUD 구현 패턴

#### Step 1: 훅 생성
```typescript
// src/hooks/useEntity.ts
export function useEntity() {
  const list = useQuery({ /* ... */ });
  const create = useMutation({ /* ... */ });
  const update = useMutation({ /* ... */ });
  const remove = useMutation({ /* ... */ });
  return { list, create, update, remove };
}
```

#### Step 2: Admin 페이지 생성
```typescript
// src/pages/admin/AdminEntity.tsx
export function AdminEntity() {
  const { list, create, update, remove } = useEntity();
  return (
    <AdminLayout>
      <EntityTable data={list.data} onDelete={remove} />
    </AdminLayout>
  );
}
```

#### Step 3: 폼 컴포넌트
```typescript
// src/components/admin/EntityForm.tsx
export function EntityForm() {
  const { register, handleSubmit } = useForm();
  const { create } = useEntity();
  return <form onSubmit={handleSubmit(create.mutate)} />;
}
```

#### Step 4: E2E 테스트
```typescript
// tests/e2e/admin-entity.spec.ts
test('create entity', async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto('/admin/entity');
  await page.click('button:has-text("생성")');
  await page.fill('input[name="title"]', 'Test');
  await page.click('button:has-text("저장")');
  await expect(page.locator('text=Test')).toBeVisible();
});
```

---

### 3. 컴포넌트 재사용 패턴

#### Composition Pattern
```typescript
// Bad: 하나의 큰 컴포넌트
function LargeComponent() {
  return <div>{/* 200줄 */}</div>;
}

// Good: 작은 컴포넌트 조합
function Container() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}
```

#### Render Props Pattern
```typescript
// 재사용 가능한 로직
function DataProvider({ children }) {
  const { data, loading } = useData();
  return children({ data, loading });
}

// 사용
<DataProvider>
  {({ data, loading }) => (
    loading ? <LoadingState /> : <DataTable data={data} />
  )}
</DataProvider>
```

---

## 🧪 테스트 전략

### 1. TDD (Test-Driven Development) 적용

#### Red-Green-Refactor 사이클
```
1. Red: 실패하는 테스트 작성
2. Green: 테스트 통과하는 최소 코드 작성
3. Refactor: 코드 개선 (테스트는 계속 통과)
```

#### 예시: useProjects 훅
```typescript
// 1. Red: 테스트 작성
test('fetches projects', async () => {
  const { result } = renderHook(() => useProjects());
  await waitFor(() => expect(result.current.data).toHaveLength(3));
});

// 2. Green: 최소 코드
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => supabase.from('projects').select()
  });
}

// 3. Refactor: 에러 처리, 타입 추가
export function useProjects() {
  return useSupabaseQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => supabase.from('projects').select(),
    select: (data) => data ?? []
  });
}
```

---

### 2. 테스트 피라미드

```
       /\
      /E2E\       (20개) - 사용자 여정, CRUD, 폼 제출
     /------\
    / Unit  \     (35개) - 훅, 컴포넌트, 유틸
   /----------\
  / Integration\ (자동) - React Query + Supabase
 /--------------\
```

---

## 🔐 보안 구현 전략

### 1. RLS 정책 우선 구현
```sql
-- 1단계: 기본 정책 (모든 접근 차단)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 2단계: SELECT 허용 (모든 사용자)
CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  USING (true);

-- 3단계: INSERT/UPDATE/DELETE 허용 (관리자만)
CREATE POLICY "Only admins can modify projects"
  ON projects FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

### 2. 입력 검증 (Zod)
```typescript
// 1단계: 스키마 정의
const ProjectSchema = z.object({
  title: z.string().min(1).max(100),
  summary: z.string().min(1).max(500),
  status: z.enum(['backlog', 'in-progress', 'validate', 'launched'])
});

// 2단계: 폼 통합
const { register, handleSubmit } = useForm({
  resolver: zodResolver(ProjectSchema)
});

// 3단계: 백엔드 검증 (Edge Function)
const result = ProjectSchema.safeParse(body);
if (!result.success) {
  return new Response(JSON.stringify(result.error), { status: 400 });
}
```

---

## 📊 성능 최적화 전략

### 1. Code Splitting
```typescript
// 1단계: React.lazy로 페이지 분리
const Portfolio = lazy(() => import('./pages/Portfolio'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));

// 2단계: Suspense로 로딩 처리
<Suspense fallback={<LoadingState />}>
  <Portfolio />
</Suspense>

// 3단계: Vite manualChunks로 vendor 분리
manualChunks: {
  'vendor-react': ['react', 'react-dom'],
  'pages-admin': ['src/pages/admin/**']
}
```

### 2. 이미지 최적화
```typescript
// 1단계: WebP 형식 사용
<img src="image.webp" alt="..." />

// 2단계: Lazy Loading
<img src="..." loading="lazy" />

// 3단계: Supabase Storage CDN
const url = supabase.storage
  .from('project-images')
  .getPublicUrl('image.webp').data.publicUrl;
```

### 3. React Query 캐싱
```typescript
// 1단계: staleTime 설정 (5분)
staleTime: 5 * 60 * 1000

// 2단계: cacheTime 설정 (10분)
cacheTime: 10 * 60 * 1000

// 3단계: 낙관적 업데이트
onMutate: async (newData) => {
  await queryClient.cancelQueries({ queryKey: ['projects'] });
  const previous = queryClient.getQueryData(['projects']);
  queryClient.setQueryData(['projects'], (old) => [...old, newData]);
  return { previous };
}
```

---

## 🚀 배포 전략

### 1. 브랜치 전략
```
feature/new-feature → develop → staging → main
       │                 │          │        │
       │                 │          │        │
     PR 생성          자동 배포   QA 테스트  프로덕션
                    (Preview)   (Preview)  (Production)
```

### 2. 배포 체크리스트
```markdown
- [ ] 빌드 성공 (0 에러)
- [ ] 린트 에러 0개
- [ ] 단위 테스트 통과 (80% 커버리지)
- [ ] E2E 테스트 통과 (20개)
- [ ] Lighthouse CI 통과 (Performance 90+)
- [ ] 환경 변수 설정 (Vercel Secrets)
- [ ] RLS 정책 적용 확인
- [ ] 수동 테스트 (주요 여정 3개)
```

### 3. 롤백 계획
```
1. Vercel 대시보드에서 이전 배포로 롤백 (즉시)
2. GitHub Revert Commit (코드 복원)
3. Supabase Migration Revert (데이터베이스 복원)
4. Slack 알림 (팀 공유)
5. Incident Report 작성 (원인 분석, 재발 방지)
```

---

## 📝 문서 동기화 전략

### 1. 코드 변경 시
```
1. 명세 업데이트 (spec/*.md)
2. 플랜 업데이트 (plan/*.md)
3. 태스크 체크 (tasks/*.md)
4. CLAUDE.md 업데이트 (최신 업데이트 섹션)
5. project-todo.md 업데이트
```

### 2. Sprint 완료 시
```
1. Sprint 완료 기준 확인 (tasks/sprint-N.md)
2. 완료율 업데이트 (0% → 100%)
3. 릴리스 노트 작성 (docs/project/changelog.md)
4. 로드맵 진행률 업데이트 (docs/project/roadmap.md)
5. 회고 문서 작성 (docs/archive/sprint-N-retrospective.md)
```

---

## 🔍 품질 관리 전략

### 1. 코드 리뷰
```
- PR 템플릿 사용 (변경 사항, 테스트, 스크린샷)
- 최소 1명 승인 필수 (main 브랜치)
- 린트 에러 0개 필수
- 테스트 통과 필수
```

### 2. 지속적 개선
```
- 매 Sprint 회고 (Keep, Problem, Try)
- 성능 모니터링 (Lighthouse, Vercel Analytics)
- 에러 추적 (Sentry)
- 사용자 피드백 (Giscus, Newsletter)
```

---

**Last Updated**: 2025-11-13
**Version**: 2.0.0
**Status**: 📋 Draft
**Next Review**: Sprint 완료 시
