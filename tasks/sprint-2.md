# Sprint 2 Tasks - Supabase Integration & Community

> **SDD Stage 3**: Tasks (작업 분해)
> **기간**: 5일 (2025-11-14 ~ 2025-11-18)
> **목표**: Static Data → Dynamic Data (Supabase) + Community (Giscus) + Forms

---

## 📋 Task Overview

| Day | Tasks | Duration | Status |
|-----|-------|----------|--------|
| Day 1 | T-2.1 ~ T-2.5 | 8시간 | ⏳ Pending |
| Day 2 | T-2.6 ~ T-2.10 | 8시간 | ⏳ Pending |
| Day 3 | T-2.11 ~ T-2.14 | 8시간 | ⏳ Pending |
| Day 4 | T-2.15 ~ T-2.18 | 8시간 | ⏳ Pending |
| Day 5 | T-2.19 ~ T-2.22 | 8시간 | ⏳ Pending |

**Total**: 22개 작업, 40시간

---

## 🗓️ Day 1: Supabase Schema & CRUD (2025-11-14)

### T-2.1: Supabase 스키마 검증 및 샘플 데이터 삽입
**Duration**: 1.5시간
**Priority**: P0 (Blocker)
**Dependencies**: None

**작업 내용**:
1. 기존 마이그레이션 파일 검토 (`supabase/migrations/20250109000001_create_projects.sql` 등)
2. 필요한 테이블 존재 확인 (`projects`, `roadmap`, `logs`, `bounties`, `newsletter_subscriptions`)
3. `work_with_us_inquiries` 테이블 마이그레이션 파일 생성
4. 샘플 데이터 3개씩 삽입 (총 18개 레코드)

**완료 기준**:
- [ ] `supabase/migrations/20251114000001_create_work_inquiries.sql` 파일 생성
- [ ] 5개 테이블에 샘플 데이터 3개씩 삽입 완료
- [ ] Supabase Dashboard에서 데이터 확인
- [ ] RLS 정책 정상 동작 확인 (anon SELECT 가능, INSERT/UPDATE/DELETE 제한)

**산출물**:
```sql
-- supabase/migrations/20251114000001_create_work_inquiries.sql
CREATE TABLE public.work_with_us_inquiries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  package TEXT NOT NULL,
  budget TEXT,
  brief TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE public.work_with_us_inquiries ENABLE ROW LEVEL SECURITY;
-- ...
```

---

### T-2.2: useProjects 훅 생성 (Portfolio용)
**Duration**: 1.5시간
**Priority**: P1
**Dependencies**: T-2.1

**작업 내용**:
1. `src/hooks/useProjects.ts` 파일 생성
2. `useQuery`로 프로젝트 목록 조회 (`getProjects`)
3. `useQuery`로 단일 프로젝트 조회 (`getProjectById`)
4. 상태별 필터링 함수 (`filterByStatus`)
5. 에러 핸들링 (`handleSupabaseError`)

**완료 기준**:
- [ ] `useProjects.ts` 파일 생성 (150줄 이하)
- [ ] TypeScript 타입 정의 (`Project` 인터페이스)
- [ ] React Query 캐싱 설정 (`staleTime: 5분`)
- [ ] 유닛 테스트 작성 (`useProjects.test.tsx`, 5개 테스트)
- [ ] 빌드 에러 없음 (`npm run build`)

**예시 코드**:
```typescript
export interface Project {
  id: string;
  title: string;
  summary: string;
  status: 'backlog' | 'in-progress' | 'validate' | 'launched';
  tags: string[];
  metrics?: {
    users?: number;
    revenue?: number;
    mvp_date?: string;
  };
  links?: {
    demo?: string;
    github?: string;
    blog?: string;
  };
  created_at: string;
}

export function useProjects() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
    staleTime: 5 * 60 * 1000, // 5분
  });

  return { projects: data, error, isLoading };
}
```

---

### T-2.3: useRoadmap 훅 생성 (Roadmap용)
**Duration**: 1.5시간
**Priority**: P1
**Dependencies**: T-2.1

**작업 내용**:
1. `src/hooks/useRoadmap.ts` 파일 생성
2. `useQuery`로 로드맵 목록 조회 (`getRoadmap`)
3. Quarter별 그룹핑 함수 (`groupByQuarter`)
4. 진행률 계산 함수 (`calculateProgress`)

**완료 기준**:
- [ ] `useRoadmap.ts` 파일 생성 (120줄 이하)
- [ ] TypeScript 타입 정의 (`RoadmapItem` 인터페이스)
- [ ] React Query 캐싱 설정 (`staleTime: 10분`)
- [ ] 유닛 테스트 작성 (`useRoadmap.test.tsx`, 4개 테스트)
- [ ] 빌드 에러 없음

**예시 코드**:
```typescript
export interface RoadmapItem {
  id: number;
  quarter: string; // "2025-Q1"
  goal: string;
  progress: number; // 0-100
  owner: string;
  related_projects: string[]; // project ids
}

export function useRoadmap() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['roadmap'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roadmap')
        .select('*')
        .order('quarter', { ascending: true });

      if (error) throw error;
      return data as RoadmapItem[];
    },
    staleTime: 10 * 60 * 1000, // 10분
  });

  return { roadmap: data, error, isLoading };
}
```

---

### T-2.4: useLogs 훅 생성 (Now용)
**Duration**: 1.5시간
**Priority**: P1
**Dependencies**: T-2.1

**작업 내용**:
1. `src/hooks/useLogs.ts` 파일 생성
2. `useQuery`로 로그 목록 조회 (`getLogs`)
3. 타입별 필터링 함수 (`filterByType`)
4. 주간 그룹핑 함수 (`groupByWeek`)

**완료 기준**:
- [ ] `useLogs.ts` 파일 생성 (140줄 이하)
- [ ] TypeScript 타입 정의 (`Log` 인터페이스)
- [ ] React Query 캐싱 설정 (`staleTime: 2분`)
- [ ] 유닛 테스트 작성 (`useLogs.test.tsx`, 5개 테스트)
- [ ] 빌드 에러 없음

**예시 코드**:
```typescript
export interface Log {
  id: number;
  type: 'decision' | 'learning' | 'release';
  content: string;
  project_id?: string;
  created_at: string;
}

export function useLogs() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Log[];
    },
    staleTime: 2 * 60 * 1000, // 2분
  });

  return { logs: data, error, isLoading };
}
```

---

### T-2.5: useBounties 훅 생성 (Lab용)
**Duration**: 1.5시간
**Priority**: P1
**Dependencies**: T-2.1

**작업 내용**:
1. `src/hooks/useBounties.ts` 파일 생성
2. `useQuery`로 바운티 목록 조회 (`getBounties`)
3. 상태별 필터링 함수 (`filterByStatus`)
4. 정렬 함수 (`sortByDeadline`, `sortByReward`)

**완료 기준**:
- [ ] `useBounties.ts` 파일 생성 (150줄 이하)
- [ ] TypeScript 타입 정의 (`Bounty` 인터페이스)
- [ ] React Query 캐싱 설정 (`staleTime: 5분`)
- [ ] 유닛 테스트 작성 (`useBounties.test.tsx`, 5개 테스트)
- [ ] 빌드 에러 없음

**예시 코드**:
```typescript
export interface Bounty {
  id: number;
  title: string;
  skill: string;
  reward: number;
  deadline: string;
  status: 'open' | 'assigned' | 'done';
  applicants: string[]; // user uuids
}

export function useBounties() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['bounties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bounties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Bounty[];
    },
    staleTime: 5 * 60 * 1000, // 5분
  });

  return { bounties: data, error, isLoading };
}
```

---

## 🗓️ Day 2: Dynamic Pages (2025-11-15)

### T-2.6: Portfolio 페이지 동적화
**Duration**: 2시간
**Priority**: P1
**Dependencies**: T-2.2

**작업 내용**:
1. `src/pages/Portfolio.tsx` 수정
2. 정적 JSON → `useProjects()` 훅으로 교체
3. 로딩/에러/빈 상태 UI 추가
4. 프로젝트 카드 컴포넌트 재사용

**완료 기준**:
- [ ] `Portfolio.tsx` 파일 수정 (200줄 이하)
- [ ] 로딩 중: 스켈레톤 UI 3개
- [ ] 에러 발생: ErrorState 컴포넌트 표시
- [ ] 데이터 없음: EmptyState 컴포넌트 표시
- [ ] 필터링 UI (상태별 탭: All, In Progress, Launched)
- [ ] 반응형 그리드 (1열 → 2열 → 3열)
- [ ] E2E 테스트 작성 (`portfolio.spec.ts`, 5개 시나리오)

**예시 코드**:
```tsx
export function Portfolio() {
  const { projects, error, isLoading } = useProjects();
  const [filter, setFilter] = useState<string>('all');

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!projects || projects.length === 0) {
    return <EmptyState message="아직 프로젝트가 없습니다" />;
  }

  const filtered = filter === 'all'
    ? projects
    : projects.filter((p) => p.status === filter);

  return (
    <PageLayout title="Portfolio" description="진행 중인 프로젝트">
      <FilterTabs value={filter} onChange={setFilter} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </PageLayout>
  );
}
```

---

### T-2.7: Portfolio 상세 페이지 생성
**Duration**: 2시간
**Priority**: P1
**Dependencies**: T-2.6

**작업 내용**:
1. `src/pages/PortfolioDetail.tsx` 파일 생성
2. URL 파라미터로 프로젝트 ID 받기 (`useParams`)
3. `getProjectById()` 훅으로 상세 데이터 조회
4. 메트릭스, 링크, 관련 로드맵 표시

**완료 기준**:
- [ ] `PortfolioDetail.tsx` 파일 생성 (250줄 이하)
- [ ] URL: `/portfolio/:id`
- [ ] 로딩/에러/404 상태 처리
- [ ] 메트릭스 카드 3개 (사용자, 매출, MVP 날짜)
- [ ] 외부 링크 버튼 (Demo, GitHub, Blog)
- [ ] 관련 로드맵 섹션 (연결된 분기 목표)
- [ ] E2E 테스트 작성 (`portfolio-detail.spec.ts`, 4개 시나리오)

---

### T-2.8: Roadmap 페이지 동적화
**Duration**: 1.5시간
**Priority**: P1
**Dependencies**: T-2.3

**작업 내용**:
1. `src/pages/Roadmap.tsx` 수정
2. 정적 JSON → `useRoadmap()` 훅으로 교체
3. Quarter별 탭 UI 추가
4. 진행률 원형 차트 컴포넌트 재사용

**완료 기준**:
- [ ] `Roadmap.tsx` 파일 수정 (180줄 이하)
- [ ] Quarter 탭 (2025-Q1, 2025-Q2, 2025-Q3, 2025-Q4)
- [ ] 진행률 원형 차트 (0-100%)
- [ ] 목표 카드 (goal, owner, progress, related_projects)
- [ ] 반응형 레이아웃 (1열 → 2열)
- [ ] E2E 테스트 작성 (`roadmap.spec.ts`, 4개 시나리오)

---

### T-2.9: Now 페이지 동적화
**Duration**: 1.5시간
**Priority**: P1
**Dependencies**: T-2.4

**작업 내용**:
1. `src/pages/Now.tsx` 수정
2. 정적 JSON → `useLogs()` 훅으로 교체
3. 주간 그룹핑 UI (최근 4주)
4. 타입별 아이콘 및 배지

**완료 기준**:
- [ ] `Now.tsx` 파일 수정 (200줄 이하)
- [ ] 주간 섹션 (Week of Nov 11, Week of Nov 4, ...)
- [ ] 타입별 아이콘 (💡 Decision, 📚 Learning, 🚀 Release)
- [ ] 타임라인 UI (세로 선 + 날짜)
- [ ] 프로젝트 연결 (project_id → 프로젝트 이름)
- [ ] E2E 테스트 작성 (`now.spec.ts`, 4개 시나리오)

---

### T-2.10: Lab 페이지 동적화
**Duration**: 1시간
**Priority**: P1
**Dependencies**: T-2.5

**작업 내용**:
1. `src/pages/Lab.tsx` 수정
2. 정적 JSON → `useBounties()` 훅으로 교체
3. 바운티 카드 컴포넌트 재사용
4. 상태별 필터 UI (Open, Assigned, Done)

**완료 기준**:
- [ ] `Lab.tsx` 파일 수정 (150줄 이하)
- [ ] 바운티 카드 (제목, 스킬, 보상, 마감일, 상태)
- [ ] 필터 탭 (All, Open, Assigned, Done)
- [ ] 정렬 옵션 (마감일순, 보상순)
- [ ] E2E 테스트 작성 (`lab.spec.ts`, 3개 시나리오)

---

## 🗓️ Day 3: Giscus Integration (2025-11-16)

### T-2.11: @giscus/react 패키지 설치 및 설정
**Duration**: 1시간
**Priority**: P0 (Blocker)
**Dependencies**: None

**작업 내용**:
1. `npm install @giscus/react` 실행
2. 환경 변수 6개 추가 (`.env.local`)
3. Vite 환경 변수 타입 정의 (`src/vite-env.d.ts`)

**완료 기준**:
- [ ] `package.json`에 `@giscus/react: ^3.1.x` 추가
- [ ] `.env.local`에 6개 변수 추가 (VITE_GISCUS_*)
- [ ] `src/vite-env.d.ts`에 타입 정의 추가
- [ ] `npm run build` 성공

**환경 변수**:
```bash
VITE_GISCUS_REPO=IDEA-on-Action/idea-on-action
VITE_GISCUS_REPO_ID=R_kgDOQBAuJw
VITE_GISCUS_CATEGORY_GENERAL=General
VITE_GISCUS_CATEGORY_GENERAL_ID=DIC_kwDOQBAuJ84CxmNK
VITE_GISCUS_CATEGORY_BLOG=Blog Comments
VITE_GISCUS_CATEGORY_BLOG_ID=DIC_kwDOQBAuJ84CxmNn
```

---

### T-2.12: GiscusComments 컴포넌트 생성
**Duration**: 2시간
**Priority**: P1
**Dependencies**: T-2.11

**작업 내용**:
1. `src/components/community/GiscusComments.tsx` 파일 생성
2. Giscus 래퍼 컴포넌트 (category prop 지원)
3. 다크 모드 자동 전환 (`useTheme` 훅 연동)
4. 로딩 상태 UI

**완료 기준**:
- [ ] `GiscusComments.tsx` 파일 생성 (100줄 이하)
- [ ] Props: `category: 'general' | 'blog'`
- [ ] 다크 모드 자동 전환 (`theme={resolvedTheme === 'dark' ? 'dark' : 'light'}`)
- [ ] 로딩 중: 스켈레톤 UI
- [ ] 에러 처리: Fallback UI
- [ ] 유닛 테스트 작성 (`GiscusComments.test.tsx`, 4개 테스트)

**예시 코드**:
```tsx
import Giscus from '@giscus/react';
import { useTheme } from '@/hooks/useTheme';

interface GiscusCommentsProps {
  category: 'general' | 'blog';
}

export function GiscusComments({ category }: GiscusCommentsProps) {
  const { resolvedTheme } = useTheme();

  const categoryId = category === 'general'
    ? import.meta.env.VITE_GISCUS_CATEGORY_GENERAL_ID
    : import.meta.env.VITE_GISCUS_CATEGORY_BLOG_ID;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">댓글</h2>
      <Giscus
        repo={import.meta.env.VITE_GISCUS_REPO}
        repoId={import.meta.env.VITE_GISCUS_REPO_ID}
        category={category === 'general' ? 'General' : 'Blog Comments'}
        categoryId={categoryId}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang="ko"
        loading="lazy"
      />
    </div>
  );
}
```

---

### T-2.13: Community 페이지에 Giscus 통합
**Duration**: 1.5시간
**Priority**: P1
**Dependencies**: T-2.12

**작업 내용**:
1. `src/pages/Community.tsx` 수정
2. `<GiscusComments category="general" />` 추가
3. 커뮤니티 소개 섹션 추가
4. 참여 가이드라인 추가

**완료 기준**:
- [ ] `Community.tsx` 파일 수정 (150줄 이하)
- [ ] 커뮤니티 소개 Hero 섹션
- [ ] Giscus 댓글 위젯 (General 카테고리)
- [ ] 참여 가이드라인 섹션
- [ ] E2E 테스트 작성 (`community.spec.ts`, 3개 시나리오)

---

### T-2.14: BlogPost 페이지에 Giscus 통합
**Duration**: 1.5시간
**Priority**: P1
**Dependencies**: T-2.12

**작업 내용**:
1. `src/pages/BlogPost.tsx` 수정
2. `<GiscusComments category="blog" />` 추가
3. 댓글 섹션 구분선 추가

**완료 기준**:
- [ ] `BlogPost.tsx` 파일 수정 (기존 + 10줄)
- [ ] 블로그 본문 아래 댓글 위젯 (Blog Comments 카테고리)
- [ ] 구분선 (Divider) 추가
- [ ] E2E 테스트 작성 (`blog.spec.ts` 수정, +2개 시나리오)

**추가 사항**:
- [ ] Giscus App 설치 확인 (https://github.com/apps/giscus)
- [ ] GitHub Discussions 활성화 확인 (이미 완료됨)

---

## 🗓️ Day 4: Forms (Work with Us + Newsletter) (2025-11-17)

### T-2.15: resend 패키지 설치 및 이메일 전송 함수 생성
**Duration**: 1.5시간
**Priority**: P0 (Blocker)
**Dependencies**: None (Resend 도메인 검증 완료 필요)

**작업 내용**:
1. `npm install resend` 실행
2. `src/lib/email.ts` 파일 생성
3. `sendWorkWithUsEmail()` 함수 구현
4. 환경 변수 2개 추가 (`.env.local`)

**완료 기준**:
- [ ] `package.json`에 `resend: ^4.0.x` 추가
- [ ] `.env.local`에 2개 변수 추가:
  - `VITE_RESEND_FROM_EMAIL=noreply@ideaonaction.ai`
  - `RESEND_API_KEY=re_xxx` (서버 전용, VITE_ 없음)
- [ ] `src/lib/email.ts` 파일 생성 (80줄 이하)
- [ ] 비동기 에러 처리 (`.catch()` 패턴)
- [ ] 유닛 테스트 작성 (`email.test.ts`, 3개 테스트)

**예시 코드**:
```typescript
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export interface WorkWithUsEmailData {
  name: string;
  email: string;
  company?: string;
  package: string;
  budget?: string;
  brief: string;
}

export async function sendWorkWithUsEmail(data: WorkWithUsEmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: `IDEA on Action <${import.meta.env.VITE_RESEND_FROM_EMAIL}>`,
      to: ['sinclairseo@gmail.com'],
      subject: `[문의] ${data.name} - ${data.package}`,
      html: `
        <h2>Work with Us 문의</h2>
        <p><strong>이름:</strong> ${data.name}</p>
        <p><strong>이메일:</strong> ${data.email}</p>
        ${data.company ? `<p><strong>회사:</strong> ${data.company}</p>` : ''}
        <p><strong>패키지:</strong> ${data.package}</p>
        ${data.budget ? `<p><strong>예산:</strong> ${data.budget}</p>` : ''}
        <p><strong>상세 설명:</strong></p>
        <p>${data.brief}</p>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      throw error;
    }

    return result;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}
```

---

### T-2.16: useWorkInquiries 훅 생성
**Duration**: 1.5시간
**Priority**: P1
**Dependencies**: T-2.1, T-2.15

**작업 내용**:
1. `src/hooks/useWorkInquiries.ts` 파일 생성
2. `useMutation`으로 문의 제출 함수 (`submitInquiry`)
3. Supabase INSERT + 이메일 발송 (비동기)
4. 에러 핸들링 (DB 실패 시 사용자 경험 우선)

**완료 기준**:
- [ ] `useWorkInquiries.ts` 파일 생성 (120줄 이하)
- [ ] TypeScript 타입 정의 (`WorkInquiry` 인터페이스)
- [ ] Supabase INSERT 성공 시 Toast 성공 메시지
- [ ] 이메일 발송은 비동기 (실패해도 사용자 차단 안 함)
- [ ] 유닛 테스트 작성 (`useWorkInquiries.test.tsx`, 4개 테스트)

**예시 코드**:
```typescript
export interface WorkInquiry {
  name: string;
  email: string;
  company?: string;
  package: string;
  budget?: string;
  brief: string;
}

export function useWorkInquiries() {
  const mutation = useMutation({
    mutationFn: async (data: WorkInquiry) => {
      // 1. Supabase 저장 (동기)
      const { error: dbError } = await supabase
        .from('work_with_us_inquiries')
        .insert(data);

      if (dbError) throw dbError;

      // 2. 이메일 발송 (비동기, 논블로킹)
      sendWorkWithUsEmail(data).catch((error) => {
        console.error('Email send failed (non-blocking):', error);
      });

      return data;
    },
    onSuccess: () => {
      toast.success('문의가 접수되었습니다');
    },
    onError: (error) => {
      console.error('Work inquiry error:', error);
      toast.error('문의 접수에 실패했습니다');
    },
  });

  return { submitInquiry: mutation.mutate, isSubmitting: mutation.isPending };
}
```

---

### T-2.17: WorkWithUsForm 컴포넌트 생성 및 페이지 통합
**Duration**: 2.5시간
**Priority**: P1
**Dependencies**: T-2.16

**작업 내용**:
1. `src/components/forms/WorkWithUsForm.tsx` 파일 생성
2. React Hook Form + Zod 스키마
3. 패키지 선택 (3개: MVP, Growth, Custom)
4. 예산 범위 선택 (Optional)
5. `src/pages/WorkWithUs.tsx` 수정하여 폼 통합

**완료 기준**:
- [ ] `WorkWithUsForm.tsx` 파일 생성 (250줄 이하)
- [ ] Zod 스키마 (name, email, package 필수, company/budget/brief 선택)
- [ ] 패키지 라디오 버튼 3개 (MVP, Growth, Custom)
- [ ] 예산 범위 Select (Optional)
- [ ] Brief 텍스트영역 (최대 1000자)
- [ ] 제출 중 로딩 상태 (버튼 disabled)
- [ ] 성공 시 폼 초기화
- [ ] `WorkWithUs.tsx` 페이지 수정 (폼 통합)
- [ ] E2E 테스트 작성 (`work-with-us.spec.ts`, 6개 시나리오)
- [ ] 유닛 테스트 작성 (`WorkWithUsForm.test.tsx`, 5개 테스트)

**예시 Zod 스키마**:
```typescript
const workWithUsSchema = z.object({
  name: z.string().min(2, '이름을 입력해주세요'),
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
  company: z.string().optional(),
  package: z.enum(['MVP', 'Growth', 'Custom'], {
    required_error: '패키지를 선택해주세요',
  }),
  budget: z.string().optional(),
  brief: z.string().min(10, '최소 10자 이상 입력해주세요').max(1000),
});
```

---

### T-2.18: NewsletterForm 컴포넌트 생성 및 Footer 통합
**Duration**: 2.5시간
**Priority**: P2
**Dependencies**: T-2.1

**작업 내용**:
1. `src/components/forms/NewsletterForm.tsx` 파일 생성
2. React Hook Form + Zod 스키마 (이메일만)
3. `useNewsletter` 훅 생성 (`submitSubscription`)
4. Footer에 Newsletter 섹션 추가
5. Home 페이지에 inline 폼 추가 (Optional)

**완료 기준**:
- [ ] `NewsletterForm.tsx` 파일 생성 (150줄 이하)
- [ ] `useNewsletter.ts` 훅 생성 (80줄 이하)
- [ ] Zod 스키마 (이메일만, 중복 체크)
- [ ] Supabase INSERT (`newsletter_subscriptions` 테이블)
- [ ] 중복 이메일 검증 (Toast info 메시지)
- [ ] Footer 수정 (Newsletter 섹션 추가)
- [ ] E2E 테스트 작성 (`newsletter.spec.ts`, 5개 시나리오)
- [ ] 유닛 테스트 작성 (`NewsletterForm.test.tsx`, 4개 테스트)

**예시 코드**:
```typescript
// src/hooks/useNewsletter.ts
export function useNewsletter() {
  const mutation = useMutation({
    mutationFn: async (email: string) => {
      // 1. 중복 확인
      const { data: existing } = await supabase
        .from('newsletter_subscriptions')
        .select('id')
        .eq('email', email)
        .single();

      if (existing) {
        toast.info('이미 구독 중입니다');
        return;
      }

      // 2. 구독 저장
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({ email });

      if (error) throw error;

      return { email };
    },
    onSuccess: () => {
      toast.success('뉴스레터 구독 신청 완료! 📬');
    },
    onError: (error) => {
      console.error('Newsletter subscription error:', error);
      toast.error('구독 신청에 실패했습니다');
    },
  });

  return { subscribe: mutation.mutate, isSubscribing: mutation.isPending };
}
```

---

## 🗓️ Day 5: Testing & QA & Deployment (2025-11-18)

### T-2.19: E2E 테스트 실행 및 버그 수정
**Duration**: 2.5시간
**Priority**: P0 (Blocker)
**Dependencies**: T-2.6 ~ T-2.18

**작업 내용**:
1. 모든 E2E 테스트 실행 (`npm run test:e2e`)
2. 실패한 테스트 분석 및 수정
3. 스크린샷/비디오 확인
4. 테스트 커버리지 확인

**완료 기준**:
- [ ] E2E 테스트 30개 이상 통과 (Sprint 2 신규 20개 포함)
- [ ] 실패율 5% 이하
- [ ] 버그 수정 커밋 (필요시)
- [ ] Playwright 리포트 생성

**테스트 시나리오 체크리스트**:
- [ ] Portfolio 목록 렌더링
- [ ] Portfolio 상세 페이지 접근
- [ ] Roadmap Quarter 필터링
- [ ] Now 페이지 로그 표시
- [ ] Lab 바운티 필터링
- [ ] Community Giscus 로드
- [ ] Blog Giscus 로드
- [ ] Work with Us 폼 제출 (유효/무효 입력)
- [ ] Newsletter 폼 제출 (중복 체크)

---

### T-2.20: 유닛 테스트 실행 및 커버리지 확인
**Duration**: 1.5시간
**Priority**: P1
**Dependencies**: T-2.2 ~ T-2.18

**작업 내용**:
1. 모든 유닛 테스트 실행 (`npm run test:unit`)
2. 커버리지 리포트 확인 (`npm run test:coverage`)
3. 80% 미만 파일 추가 테스트 작성

**완료 기준**:
- [ ] 유닛 테스트 25개 이상 통과 (Sprint 2 신규 20개 포함)
- [ ] 커버리지 80% 이상 (Hooks, Components)
- [ ] 실패한 테스트 수정
- [ ] Coverage 리포트 생성

---

### T-2.21: Lighthouse CI 실행 및 성능 검증
**Duration**: 1.5시간
**Priority**: P1
**Dependencies**: T-2.19

**작업 내용**:
1. Lighthouse CI 실행 (`npm run lighthouse`)
2. 성능 점수 확인 (90+ 목표)
3. 번들 크기 확인 (+50KB 이내)
4. 최적화 필요 항목 수정

**완료 기준**:
- [ ] Performance 90+ 점
- [ ] Accessibility 95+ 점
- [ ] Best Practices 90+ 점
- [ ] SEO 90+ 점
- [ ] 번들 크기 증가 +50KB 이내 (gzip)
- [ ] Core Web Vitals 통과 (LCP < 2.5s, FID < 100ms, CLS < 0.1)

**최적화 체크리스트**:
- [ ] Lazy Loading (React.lazy) 적용
- [ ] 이미지 최적화 (WebP, lazy loading)
- [ ] React Query 캐싱 확인
- [ ] 불필요한 리렌더링 제거 (React.memo)

---

### T-2.22: 문서 업데이트 및 배포
**Duration**: 2.5시간
**Priority**: P1
**Dependencies**: T-2.21

**작업 내용**:
1. `CLAUDE.md` 업데이트 (Sprint 2 완료 상태)
2. `project-todo.md` 업데이트 (완료 항목 체크)
3. `docs/project/changelog.md` 업데이트 (Sprint 2 변경사항)
4. `.env.sprint2.template` → Vercel 환경 변수 등록 가이드 작성
5. Git commit & push
6. Vercel 자동 배포 확인

**완료 기준**:
- [ ] `CLAUDE.md` 업데이트:
  - "현재 버전: 2.0.0-sprint2.0"
  - "상태: ✅ Sprint 2 완료"
  - Sprint 2 주요 변경사항 기록
- [ ] `project-todo.md` 업데이트:
  - Sprint 2 작업 22개 체크
  - Sprint 3 작업 추가 (Optional)
- [ ] `docs/project/changelog.md` 업데이트:
  - Sprint 2 버전 로그 (2.0.0-sprint2.0)
  - 신규 기능 6개 목록
  - 파일 변경 통계
- [ ] Vercel 환경 변수 등록 가이드:
  - `docs/guides/deployment/vercel-env-sprint2.md` 생성
  - 7개 환경 변수 등록 방법
- [ ] Git commit:
  - `feat: Sprint 2 완료 - Supabase Integration & Community`
  - 파일 변경: 30+ files
  - 코드 추가: ~2,500줄
- [ ] Vercel 배포 확인:
  - Production URL 접근 (https://www.ideaonaction.ai/)
  - 5개 신규 페이지 정상 동작 확인
  - Giscus 댓글 로드 확인
  - Work with Us 폼 제출 테스트 (1회)

---

## 📊 Sprint 2 완료 기준

### 기능 체크리스트 (14개)
- [ ] FR-2.1.1: 프로젝트 데이터 조회 (Portfolio 페이지)
- [ ] FR-2.1.2: 프로젝트 상세 조회 (Portfolio/:id 페이지)
- [ ] FR-2.1.3: 로드맵 데이터 조회 (Roadmap 페이지)
- [ ] FR-2.1.4: 로그 데이터 조회 (Now 페이지)
- [ ] FR-2.1.5: 바운티 데이터 조회 (Lab 페이지)
- [ ] FR-2.2.1: Community 페이지 Giscus 통합
- [ ] FR-2.2.2: Blog 페이지 Giscus 통합
- [ ] FR-2.2.3: 다크 모드 자동 전환
- [ ] FR-2.3.1: Work with Us 폼 제출
- [ ] FR-2.3.2: 이메일 알림 발송 (Resend)
- [ ] FR-2.3.3: Supabase 데이터 저장
- [ ] FR-2.4.1: Newsletter 구독 폼
- [ ] FR-2.4.2: 중복 이메일 검증
- [ ] FR-2.4.3: Supabase 데이터 저장

### 비기능 체크리스트 (9개)
- [ ] NF-2.1: Lighthouse Performance 90+
- [ ] NF-2.2: 번들 크기 +50KB 이내
- [ ] NF-2.3: E2E 테스트 30개 이상
- [ ] NF-2.4: 유닛 테스트 커버리지 80%
- [ ] NF-2.5: TypeScript Strict Mode
- [ ] NF-2.6: Accessibility (WCAG 2.1 AA)
- [ ] NF-2.7: 반응형 디자인 (모바일/태블릿/데스크탑)
- [ ] NF-2.8: 에러 핸들링 (Toast 메시지)
- [ ] NF-2.9: 로딩 상태 UI (Skeleton, Spinner)

### 배포 체크리스트 (7개)
- [ ] Vercel 환경 변수 7개 등록
- [ ] GitHub Secrets 1개 등록 (RESEND_API_KEY)
- [ ] Supabase 마이그레이션 배포
- [ ] Giscus App 설치 확인
- [ ] Resend 도메인 검증 완료
- [ ] Production 배포 성공
- [ ] 5개 신규 페이지 정상 동작

---

## 🎯 성공 메트릭스

| 메트릭 | 목표 | 측정 방법 |
|--------|------|-----------|
| 페이지 정상 동작 | 5/5 페이지 | 수동 테스트 |
| 데이터 표시 | 3건 이상/페이지 | Supabase Dashboard |
| E2E 테스트 통과율 | 95% 이상 | Playwright Report |
| 유닛 테스트 커버리지 | 80% 이상 | Coverage Report |
| Lighthouse 성능 | 90+ 점 | Lighthouse CI |
| 번들 크기 증가 | +50KB 이내 | Vite Build Output |
| 배포 성공률 | 100% | Vercel Dashboard |

---

## 📝 작업 후 문서 업데이트 체크리스트

**필수 문서** (5분):
- [ ] `CLAUDE.md` - Sprint 2 완료 상태, 버전 업데이트
- [ ] `project-todo.md` - 22개 작업 체크
- [ ] `docs/project/changelog.md` - Sprint 2 변경사항

**중요 문서** (10분):
- [ ] `docs/guides/deployment/vercel-env-sprint2.md` - 환경 변수 가이드
- [ ] `docs/project/roadmap.md` - Sprint 2 진행률 100%

**선택 문서** (필요시):
- [ ] `spec/sprint-3/` - Sprint 3 명세 (다음 단계)
- [ ] `plan/sprint-3/` - Sprint 3 계획 (다음 단계)

---

**다음 단계**: Sprint 3 - Automation & Open Metrics (1주)

- [ ] P0: Weekly Recap 자동 생성 (Supabase Function + CRON)
- [ ] P1: Status 페이지 - Open Metrics (프로젝트 수, 참여자, 댓글 수, 바운티 완료율)
- [ ] P2: 이벤트 트래킹 (GA4 15개 이벤트)
- [ ] P3: SEO 최종 점검 (Sitemap, robots.txt, 구조화 데이터)
