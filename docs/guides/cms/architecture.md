# CMS 아키텍처

**작성일**: 2025-11-15
**버전**: 1.0
**대상**: 개발자

---

## 📋 개요

IDEA on Action CMS는 React + TypeScript + Supabase 기반의 헤드리스 CMS입니다.

**기술 스택**:
- Frontend: React 18, TypeScript, Vite
- UI: shadcn/ui, Radix UI, Tailwind CSS
- State: React Query (TanStack Query)
- Backend: Supabase (PostgreSQL, Auth, Storage)
- Validation: React Hook Form + Zod

---

## 🏗️ 시스템 아키텍처

### 계층 구조

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│   (Admin Pages + Components)        │
├─────────────────────────────────────┤
│         Business Logic Layer        │
│     (React Hooks + Validation)      │
├─────────────────────────────────────┤
│         Data Access Layer           │
│  (Supabase Client + React Query)    │
├─────────────────────────────────────┤
│         Database Layer              │
│    (PostgreSQL + RLS Policies)      │
└─────────────────────────────────────┘
```

### 디렉토리 구조

```
src/
├── pages/admin/              # Admin 페이지 (8개)
│   ├── Dashboard.tsx
│   ├── AdminRoadmap.tsx
│   ├── AdminPortfolio.tsx
│   ├── AdminLab.tsx
│   ├── AdminTeam.tsx
│   ├── AdminBlogCategories.tsx
│   ├── AdminTags.tsx
│   └── AdminUsers.tsx
├── hooks/                    # React Hooks
│   ├── useAuth.ts           # 인증 (순환 참조 주의)
│   ├── useAdmins.ts         # 관리자 CRUD
│   ├── useRoadmapItems.ts   # 로드맵 CRUD
│   ├── usePortfolioItems.ts # 포트폴리오 CRUD
│   ├── useLabItems.ts       # 실험실 CRUD
│   ├── useTeamMembers.ts    # 팀원 CRUD
│   ├── useBlogCategories.ts # 카테고리 CRUD
│   └── useTags.ts           # 태그 CRUD
├── types/
│   └── cms.types.ts         # CMS 타입 정의 (42개)
└── components/
    └── admin/
        └── AdminLayout.tsx  # 공통 레이아웃
```

---

## 🔐 인증 & 권한

### 권한 계층

```
super_admin (최상위)
  └─ admin
      └─ editor (최하위)
```

**권한 매트릭스**:

| 기능 | super_admin | admin | editor |
|------|-------------|-------|--------|
| 조회 | ✅ | ✅ | ✅ |
| 생성 | ✅ | ✅ | ✅ |
| 수정 | ✅ | ✅ | ✅ |
| 삭제 | ✅ | ✅ | ❌ |
| 관리자 관리 | ✅ | ❌ | ❌ |

### RLS 정책 구조

**SECURITY DEFINER 함수** (무한 재귀 방지):

```sql
-- 슈퍼 관리자 확인
CREATE FUNCTION public.is_super_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = user_uuid AND role = 'super_admin'
  );
END;
$$;

-- 관리자 확인
CREATE FUNCTION public.is_admin_user(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = user_uuid
  );
END;
$$;

-- 삭제 권한 확인
CREATE FUNCTION public.can_admin_delete(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = user_uuid
      AND role IN ('super_admin', 'admin')
  );
END;
$$;
```

**RLS 정책 패턴**:

```sql
-- SELECT: 공개 또는 관리자
CREATE POLICY "Public can view published items"
  ON public.{table_name}
  FOR SELECT
  USING (published = true OR public.is_admin_user(auth.uid()));

-- INSERT: 관리자만
CREATE POLICY "Admins can create items"
  ON public.{table_name}
  FOR INSERT
  WITH CHECK (public.is_admin_user(auth.uid()));

-- UPDATE: 관리자만
CREATE POLICY "Admins can update items"
  ON public.{table_name}
  FOR UPDATE
  USING (public.is_admin_user(auth.uid()));

-- DELETE: Super Admin/Admin만 (Editor 제외)
CREATE POLICY "Admins can delete items"
  ON public.{table_name}
  FOR DELETE
  USING (public.can_admin_delete(auth.uid()));
```

---

## 📊 데이터베이스 스키마

### CMS 테이블 (8개)

1. **admins** - 관리자 계정
   - user_id (UUID, FK to auth.users)
   - role (super_admin, admin, editor)

2. **roadmap_items** - 로드맵 항목
   - quarter, theme, progress, risk_level
   - published, priority

3. **portfolio_items** - 포트폴리오 프로젝트
   - slug, title, summary, description
   - project_type, status, tech_stack
   - testimonial (JSONB)
   - featured, published

4. **lab_items** - 실험실 아이템
   - title, slug, category, status, difficulty
   - tech_stack, learning_objectives
   - published, featured

5. **team_members** - 팀원 정보
   - name, role, bio, avatar
   - skills, social_links (JSONB)
   - active, priority

6. **blog_categories** - 블로그 카테고리
   - name, slug, color, icon
   - post_count (자동 업데이트)

7. **tags** - 공통 태그
   - name, slug
   - usage_count (자동 업데이트)

8. **blog_posts** - 블로그 포스트 (기존 확장)
   - summary, tags, featured (CMS 추가)

### 관계도

```
admins (1) ─────┐
                │
                ├─ roadmap_items (N)
                ├─ portfolio_items (N)
                ├─ lab_items (N)
                ├─ team_members (N)
                ├─ blog_categories (N)
                ├─ tags (N)
                └─ blog_posts (N)

blog_categories (1) ───> blog_posts (N)
tags (N) <───> blog_posts (N)  # 다대다
```

---

## 🎣 React Hooks 아키텍처

### 훅 패턴

**쿼리 훅 (조회)**:
```typescript
export function useRoadmapItems() {
  return useSupabaseQuery<RoadmapItem[]>({
    queryKey: ['roadmap_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roadmap_items')
        .select('*')
        .order('priority', { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
}
```

**뮤테이션 훅 (생성/수정/삭제)**:
```typescript
export function useCreateRoadmapItem() {
  const queryClient = useQueryClient();

  return useSupabaseMutation<RoadmapItem, RoadmapItemInsert>(
    async (data) => {
      const { data: result, error } = await supabase
        .from('roadmap_items')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['roadmap_items'] });
        toast.success('로드맵 생성 완료');
      },
      onError: (error) => {
        toast.error(`생성 실패: ${error.message}`);
      },
    }
  );
}
```

### 캐싱 전략

**staleTime 설정**:
- 정적 데이터 (카테고리, 태그): 10분
- 동적 데이터 (로드맵, 포트폴리오): 5분
- 실시간 데이터 (관리자 목록): 3분

**Query Key 구조**:
```typescript
// 목록 조회
['roadmap_items']

// 단일 조회
['roadmap_items', itemId]

// 필터링 조회
['roadmap_items', 'quarter', '2025 Q1']
```

---

## 🎨 UI 컴포넌트 패턴

### AdminLayout

**구조**:
```typescript
<AdminLayout>
  <Helmet>
    <title>페이지 제목 | Admin</title>
  </Helmet>

  <div className="space-y-6">
    {/* Header */}
    <div className="flex justify-between items-center">
      <h1>페이지 제목</h1>
      <Button>+ 추가</Button>
    </div>

    {/* Filters */}
    <div className="flex gap-4">
      <Input placeholder="검색..." />
      <Select>...</Select>
    </div>

    {/* Content */}
    {isLoading && <LoadingState />}
    {error && <ErrorState />}
    {data?.length === 0 && <EmptyState />}
    {data && <Table>...</Table>}
  </div>

  {/* Dialogs */}
  <Dialog>...</Dialog>
  <AlertDialog>...</AlertDialog>
</AdminLayout>
```

### 폼 검증 (React Hook Form + Zod)

```typescript
const formSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  slug: z.string()
    .min(1, 'Slug는 필수입니다')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'kebab-case 형식'),
  progress: z.number().min(0).max(100),
  published: z.boolean().default(false),
});

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: editingItem || {
    title: '',
    slug: '',
    progress: 0,
    published: false,
  },
});
```

---

## ⚠️ 중요 고려사항

### 순환 참조 방지

**문제**: useAuth ↔ useIsAdmin 무한 루프

**해결**:
```typescript
// ❌ 잘못된 방법
export function useIsAdmin() {
  const { user } = useAuth();  // 순환 참조!
  // ...
}

// ✅ 올바른 방법
export function useIsAdmin() {
  // useAuth 대신 직접 Supabase auth 호출
  const { data: { user } } = await supabase.auth.getUser();
  // ...
}
```

### 타입 안전성

**snake_case ↔ camelCase 변환**:
```typescript
// Database (snake_case)
interface RoadmapItemDB {
  risk_level: string;
  created_at: string;
}

// Frontend (camelCase)
interface RoadmapItem {
  riskLevel: string;
  createdAt: string;
}

// 변환 함수 사용
const toCamelCase = (item: RoadmapItemDB): RoadmapItem => ({
  riskLevel: item.risk_level,
  createdAt: item.created_at,
});
```

### 에러 처리

**일관된 에러 처리**:
```typescript
try {
  const { data, error } = await supabase.from('table').select();
  if (error) throw error;
  return data;
} catch (error) {
  devError(error, {
    service: 'CMS',
    operation: 'Fetch Items',
  });
  throw error;
}
```

---

## 🚀 성능 최적화

### Lazy Loading

모든 Admin 페이지는 React.lazy로 지연 로딩:

```typescript
const AdminPortfolio = lazy(() => import('./pages/admin/AdminPortfolio'));
```

### Bundle 분석

**Admin Pages Bundle Size**:
- AdminPortfolio: 17.60 kB (4.83 kB gzip)
- AdminLab: 13.99 kB (4.42 kB gzip)
- AdminTeam: 13.31 kB (4.39 kB gzip)
- AdminBlogCategories: 9.37 kB (3.39 kB gzip)
- AdminTags: 7.21 kB (2.82 kB gzip)
- AdminUsers: 8.32 kB (3.24 kB gzip)

**Total**: ~70 kB (27 kB gzip)

---

## 🔄 데이터 흐름

### 조회 플로우

```
User Action (페이지 방문)
  ↓
React Component (useRoadmapItems)
  ↓
React Query (캐시 확인)
  ↓ (캐시 미스)
Supabase Client (쿼리 실행)
  ↓
PostgreSQL (RLS 정책 확인)
  ↓
Supabase Client (응답 수신)
  ↓
React Query (캐시 업데이트)
  ↓
React Component (리렌더링)
```

### 생성/수정 플로우

```
User Action (폼 제출)
  ↓
React Hook Form (검증)
  ↓
Zod Schema (타입 검증)
  ↓
Mutation Hook (useCreateRoadmapItem)
  ↓
Supabase Client (INSERT/UPDATE)
  ↓
PostgreSQL (RLS 정책 확인)
  ↓
Supabase Client (응답 수신)
  ↓
React Query (캐시 무효화)
  ↓
Toast Notification (성공/실패)
  ↓
Dialog Close (폼 초기화)
```

---

## 🧪 테스트 전략

### 단위 테스트 (Vitest)

**Hook 테스트**:
```typescript
describe('useRoadmapItems', () => {
  it('관리자는 모든 항목 조회 가능', async () => {
    mockSupabase.from().select().returns({
      data: [{ id: 1, title: 'Test' }],
      error: null,
    });

    const { result } = renderHook(() => useRoadmapItems());

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
    });
  });
});
```

### E2E 테스트 (Playwright)

**CRUD 시나리오**:
```typescript
test('로드맵 생성 플로우', async ({ page }) => {
  await page.goto('/admin/roadmap');
  await page.click('text=+ 새 로드맵');
  await page.fill('[name="title"]', '2025 Q1 로드맵');
  await page.fill('[name="slug"]', '2025-q1');
  await page.click('text=저장');

  await expect(page.locator('text=생성 완료')).toBeVisible();
});
```

---

## 📚 참고 문서

- [마이그레이션 가이드](./migration-guide.md)
- [사용자 가이드](./admin-guide.md)
- [Supabase RLS 문서](https://supabase.com/docs/guides/auth/row-level-security)
- [React Query 문서](https://tanstack.com/query/latest)
- [shadcn/ui 문서](https://ui.shadcn.com/)

---

## 🔧 트러블슈팅

### 자주 발생하는 문제

#### 1. RLS 정책 권한 오류

**증상**: `new row violates row-level security policy`

**원인**: RLS 정책이 INSERT/UPDATE를 차단

**해결**:
```sql
-- 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'roadmap_items';

-- 권한 확인
SELECT public.is_admin_user(auth.uid());
```

#### 2. 순환 참조 무한 루프

**증상**: 브라우저 멈춤, 메모리 부족

**원인**: useAuth ↔ useIsAdmin 순환 참조

**해결**: useAuth 대신 `supabase.auth.getUser()` 직접 호출

#### 3. React Query 캐시 동기화 문제

**증상**: 생성/수정 후 목록 업데이트 안 됨

**원인**: Query 무효화 누락

**해결**:
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['roadmap_items'] });
}
```

---

**작성자**: Claude (with Sinclair Seo)
**최종 업데이트**: 2025-11-15
