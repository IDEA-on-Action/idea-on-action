# CMS 관리자 모드 아키텍처 설계

**작성일**: 2025-11-15
**버전**: 1.0
**담당자**: Sinclair Seo

---

## 1. 시스템 아키텍처 개요

### 1.1 전체 구조

```
┌─────────────────────────────────────────────────────┐
│           Public Website (Frontend)                 │
│        React + TypeScript + Vite                    │
│  /roadmap, /portfolio, /lab, /blog, /team          │
└──────────────┬──────────────────────────────────────┘
               │
               │ Supabase Client (API Calls)
               │
               ▼
┌─────────────────────────────────────────────────────┐
│             Supabase Backend                        │
│  ┌───────────────┐  ┌──────────────┐              │
│  │  PostgreSQL   │  │  Supabase    │              │
│  │  (Database)   │  │  Auth        │              │
│  │               │  │  (RLS)       │              │
│  └───────────────┘  └──────────────┘              │
│                                                     │
│  ┌───────────────┐  ┌──────────────┐              │
│  │  Supabase     │  │  Realtime    │              │
│  │  Storage      │  │  (Optional)  │              │
│  └───────────────┘  └──────────────┘              │
└──────────────▲──────────────────────────────────────┘
               │
               │ Admin API (Protected)
               │
┌──────────────┴──────────────────────────────────────┐
│         Admin Dashboard (Frontend)                  │
│             /admin/* routes                         │
│        Protected by ProtectedRoute                  │
│  /admin/roadmap, /admin/portfolio, etc.             │
└─────────────────────────────────────────────────────┘
```

### 1.2 계층 구조 (Layered Architecture)

```
┌────────────────────────────────────────────┐
│      Presentation Layer (UI)              │
│  - Pages (AdminRoadmap, AdminPortfolio)   │
│  - Components (RoadmapForm, ImageUpload)  │
│  - Layouts (AdminLayout, Sidebar)         │
└────────────────┬───────────────────────────┘
                 │
┌────────────────▼───────────────────────────┐
│      Business Logic Layer                 │
│  - Hooks (useCRUD, useFileUpload)         │
│  - Stores (authStore, uiStore)            │
│  - Validators (Zod schemas)               │
└────────────────┬───────────────────────────┘
                 │
┌────────────────▼───────────────────────────┐
│      Data Access Layer                    │
│  - Supabase Client (API calls)            │
│  - React Query (caching, mutations)       │
│  - RPC functions                          │
└────────────────┬───────────────────────────┘
                 │
┌────────────────▼───────────────────────────┐
│      Data Layer (Supabase)                │
│  - PostgreSQL Database                    │
│  - RLS Policies                           │
│  - Storage Buckets                        │
└────────────────────────────────────────────┘
```

---

## 2. 데이터베이스 스키마

### 2.1 ERD (Entity Relationship Diagram)

```
┌─────────────────────┐
│   auth.users        │ (Supabase Auth)
│  - id (UUID)        │
│  - email            │
│  - created_at       │
└──────────┬──────────┘
           │ 1
           │
           │ N
┌──────────▼──────────┐
│   admins            │
│  - id (UUID)        │
│  - user_id (FK)     │
│  - role             │ ← Super Admin, Admin, Editor
│  - created_at       │
│  - updated_at       │
└─────────────────────┘

         ┌────────────────────────────────┐
         │                                │
         ▼                                ▼
┌─────────────────────┐        ┌─────────────────────┐
│  roadmap_items      │        │  portfolio_items    │
│  - id (UUID)        │        │  - id (UUID)        │
│  - title            │        │  - title            │
│  - category         │        │  - slug (UNIQUE)    │
│  - status           │        │  - project_type     │
│  - progress (%)     │        │  - client_name      │
│  - tags[]           │        │  - tech_stack[]     │
│  - published        │        │  - images[]         │
│  - created_by (FK)  │        │  - published        │
│  - created_at       │        │  - created_by (FK)  │
│  - updated_at       │        │  - created_at       │
└─────────────────────┘        └─────────────────────┘

         │                                │
         │                                │
         ▼                                ▼
┌─────────────────────┐        ┌─────────────────────┐
│  lab_items          │        │  blog_posts         │
│  - id (UUID)        │        │  - id (UUID)        │
│  - slug (UNIQUE)    │        │  - slug (UNIQUE)    │
│  - category         │        │  - content (MD)     │
│  - status           │        │  - category_id (FK) │
│  - contributors[]   │        │  - tags[]           │
│  - published        │        │  - views            │
│  - created_by (FK)  │        │  - published        │
│  - created_at       │        │  - author_id (FK)   │
└─────────────────────┘        └──────────┬──────────┘
                                          │
                                          │ N
                                          │
                                          │ 1
                               ┌──────────▼──────────┐
                               │  blog_categories    │
                               │  - id (UUID)        │
                               │  - name             │
                               │  - slug (UNIQUE)    │
                               │  - color            │
                               │  - icon             │
                               └─────────────────────┘

┌─────────────────────┐        ┌─────────────────────┐
│  team_members       │        │  tags               │
│  - id (UUID)        │        │  - id (UUID)        │
│  - name             │        │  - name (UNIQUE)    │
│  - role             │        │  - slug (UNIQUE)    │
│  - skills[]         │        │  - usage_count      │
│  - priority         │        │  - created_at       │
│  - active           │        └─────────────────────┘
└─────────────────────┘
```

### 2.2 인덱스 전략

**roadmap_items**:
- `idx_roadmap_status` (status)
- `idx_roadmap_published` (published)
- `idx_roadmap_category` (category)
- `idx_roadmap_created_by` (created_by)

**portfolio_items**:
- `idx_portfolio_slug` (slug, UNIQUE)
- `idx_portfolio_published` (published)
- `idx_portfolio_featured` (featured)
- `idx_portfolio_project_type` (project_type)

**blog_posts**:
- `idx_blog_slug` (slug, UNIQUE)
- `idx_blog_published` (published)
- `idx_blog_author` (author_id)
- `idx_blog_category` (category_id)
- `idx_blog_published_at` (published_at DESC)

---

## 3. 인증 및 권한 시스템

### 3.1 Supabase Auth 플로우

```
┌──────────────┐
│  User Login  │
│ (Email/Pass) │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Supabase Auth    │ ← auth.users 테이블에 생성
│ (JWT 토큰 발급)  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Check admins     │ ← admins 테이블 조회
│ table            │   (user_id로 역할 확인)
└──────┬───────────┘
       │
       ├─ Yes ──▶ Admin Dashboard 접근 허용
       │
       └─ No ───▶ 403 Forbidden
```

### 3.2 RLS (Row Level Security) 정책

**admins 테이블**:
```sql
-- SELECT: 관리자만 조회 가능
CREATE POLICY "Admins can view all admins"
  ON admins FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM admins));

-- INSERT/UPDATE/DELETE: Super Admin만 가능
CREATE POLICY "Super admins can manage admins"
  ON admins FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM admins WHERE role = 'super_admin'
    )
  );
```

**roadmap_items 테이블**:
```sql
-- SELECT: 공개된 항목은 모든 사용자 조회 가능
CREATE POLICY "Public can view published roadmap items"
  ON roadmap_items FOR SELECT
  USING (published = true);

-- INSERT/UPDATE: 관리자만 가능
CREATE POLICY "Admins can create roadmap items"
  ON roadmap_items FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM admins));

CREATE POLICY "Admins can update roadmap items"
  ON roadmap_items FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM admins));

-- DELETE: Admin 이상만 가능 (Editor 제외)
CREATE POLICY "Admins can delete roadmap items"
  ON roadmap_items FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM admins WHERE role IN ('super_admin', 'admin')
    )
  );
```

### 3.3 프론트엔드 권한 체크

```typescript
// src/hooks/usePermissions.ts
export const usePermissions = () => {
  const { user, isAdmin, adminRole } = useAuth()

  const can = (action: Action, resource: Resource): boolean => {
    if (!isAdmin) return false

    const permission = `${resource}:${action}` // "roadmap:delete"
    return permissions[adminRole].includes(permission) ||
           permissions[adminRole].includes(`${resource}:*`) ||
           permissions[adminRole].includes('*')
  }

  return { can }
}

// 사용 예시
const { can } = usePermissions()

<Button
  onClick={handleDelete}
  disabled={!can('delete', 'roadmap')}
>
  삭제
</Button>
```

---

## 4. 컴포넌트 아키텍처

### 4.1 디렉토리 구조

```
src/admin/
├── layouts/
│   ├── AdminLayout.tsx          # 관리자 전체 레이아웃
│   ├── Sidebar.tsx              # 사이드바 네비게이션
│   ├── Header.tsx               # 헤더 (프로필, 알림)
│   └── Breadcrumb.tsx           # 경로 표시
│
├── pages/
│   ├── Dashboard.tsx            # 대시보드 (통계)
│   ├── roadmap/
│   │   ├── RoadmapList.tsx      # 로드맵 목록
│   │   ├── RoadmapForm.tsx      # 생성/수정 폼
│   │   └── RoadmapDetail.tsx    # 상세 보기 (선택)
│   ├── portfolio/
│   │   ├── PortfolioList.tsx
│   │   ├── PortfolioForm.tsx
│   │   └── PortfolioDetail.tsx
│   ├── lab/
│   ├── blog/
│   ├── team/
│   ├── media/
│   │   ├── MediaLibrary.tsx
│   │   └── MediaUploader.tsx
│   └── settings/
│       ├── Profile.tsx
│       └── Admins.tsx           # Super Admin만
│
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Table.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── Loading.tsx
│   ├── forms/
│   │   ├── FormField.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── MultiSelect.tsx
│   │   └── DatePicker.tsx
│   ├── editor/
│   │   ├── RichTextEditor.tsx   # Tiptap 기반
│   │   ├── MarkdownEditor.tsx
│   │   └── CodeEditor.tsx
│   └── media/
│       ├── MediaGrid.tsx
│       └── ImagePreview.tsx
│
├── hooks/
│   ├── useAuth.ts               # 기존 훅 재사용
│   ├── usePermissions.ts        # 권한 체크
│   ├── useCRUD.ts               # 공통 CRUD 로직
│   ├── useFileUpload.ts         # 파일 업로드
│   └── useToast.ts              # 토스트 메시지
│
├── services/
│   ├── api/
│   │   ├── roadmap.ts
│   │   ├── portfolio.ts
│   │   ├── lab.ts
│   │   ├── blog.ts
│   │   └── media.ts
│   └── supabase.ts              # 기존 클라이언트 재사용
│
├── stores/
│   ├── authStore.ts             # 기존 스토어 재사용
│   ├── uiStore.ts               # 사이드바 상태 등
│   └── mediaStore.ts            # 미디어 라이브러리 상태
│
├── types/
│   ├── database.types.ts        # Supabase 타입
│   ├── admin.types.ts           # 관리자 타입
│   └── common.types.ts          # 공통 타입
│
└── utils/
    ├── validation.ts            # Zod 스키마
    ├── formatting.ts            # 날짜, 숫자 포맷
    └── constants.ts             # 상수
```

### 4.2 컴포넌트 패턴

#### Compound Component Pattern (Sidebar)
```typescript
// Sidebar.tsx
export const Sidebar = ({ children }: { children: React.ReactNode }) => {
  return <aside className="sidebar">{children}</aside>
}

Sidebar.Section = ({ title, children }: SidebarSectionProps) => {
  return (
    <div className="sidebar-section">
      <h3>{title}</h3>
      {children}
    </div>
  )
}

Sidebar.Link = ({ to, icon, children }: SidebarLinkProps) => {
  return (
    <NavLink to={to} className="sidebar-link">
      {icon && <Icon name={icon} />}
      {children}
    </NavLink>
  )
}

// 사용 예시
<Sidebar>
  <Sidebar.Section title="콘텐츠">
    <Sidebar.Link to="/admin/roadmap" icon="map">로드맵</Sidebar.Link>
    <Sidebar.Link to="/admin/portfolio" icon="briefcase">포트폴리오</Sidebar.Link>
  </Sidebar.Section>
</Sidebar>
```

#### Render Props Pattern (Table)
```typescript
// Table.tsx
interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  renderRow: (item: T) => React.ReactNode
}

export const Table = <T,>({ data, columns, renderRow }: TableProps<T>) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map(col => <th key={col.key}>{col.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map(renderRow)}
      </tbody>
    </table>
  )
}
```

---

## 5. 상태 관리 전략

### 5.1 서버 상태 (React Query)

```typescript
// src/hooks/useCRUD.ts
export const useCRUD = <T>(table: string) => {
  const queryClient = useQueryClient()

  // 목록 조회
  const { data, isLoading, error } = useQuery({
    queryKey: [table, 'list'],
    queryFn: () => supabase.from(table).select('*'),
    staleTime: 5 * 60 * 1000, // 5분
  })

  // 생성
  const createMutation = useMutation({
    mutationFn: (item: Partial<T>) =>
      supabase.from(table).insert([item]).select().single(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table, 'list'] })
      toast.success('저장되었습니다')
    },
  })

  // 수정
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) =>
      supabase.from(table).update(data).eq('id', id).select().single(),
    onMutate: async ({ id, data }) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: [table, 'list'] })
      const previous = queryClient.getQueryData([table, 'list'])
      queryClient.setQueryData([table, 'list'], (old: T[]) =>
        old.map(item => item.id === id ? { ...item, ...data } : item)
      )
      return { previous }
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData([table, 'list'], context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [table, 'list'] })
    },
  })

  // 삭제
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      supabase.from(table).delete().eq('id', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table, 'list'] })
      toast.success('삭제되었습니다')
    },
  })

  return {
    data,
    isLoading,
    error,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
  }
}
```

### 5.2 클라이언트 상태 (Zustand)

```typescript
// src/stores/uiStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage', // LocalStorage 키
    }
  )
)
```

---

## 6. 파일 업로드 아키텍처

### 6.1 Supabase Storage 구조

```
buckets/
├── public/                      # 공개 버킷
│   ├── roadmap/
│   │   ├── thumbnails/          # 썸네일 (리사이징)
│   │   └── original/            # 원본
│   ├── portfolio/
│   │   ├── thumbnails/
│   │   └── original/
│   ├── lab/
│   ├── blog/
│   ├── team/
│   └── general/
└── private/                     # 비공개 버킷
    └── admin/                   # 관리자 전용
```

### 6.2 파일 업로드 플로우

```
┌──────────────────┐
│  User Selects    │
│  File (Drag&Drop)│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Client-side     │
│  Validation      │ ← 파일 크기, MIME 타입
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Generate UUID   │
│  Filename        │ ← abc-123.png
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Supabase        │
│  Storage Upload  │ ← public/portfolio/original/abc-123.png
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Get Public URL  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Save URL to     │
│  Database        │ ← portfolio_items.images[]
└──────────────────┘
```

### 6.3 이미지 최적화 (선택)

```typescript
// src/hooks/useFileUpload.ts
export const useFileUpload = () => {
  const uploadWithThumbnail = async (file: File, bucket: string, folder: string) => {
    // 1. 원본 업로드
    const originalPath = `${folder}/original/${uuid()}.${getExtension(file)}`
    const { data: originalData } = await supabase.storage
      .from(bucket)
      .upload(originalPath, file)

    // 2. 썸네일 생성 (선택: Sharp 또는 Supabase Image Transformation)
    const thumbnailPath = `${folder}/thumbnails/${uuid()}.webp`
    const resized = await resizeImage(file, { width: 400, height: 300 })
    await supabase.storage.from(bucket).upload(thumbnailPath, resized)

    // 3. Public URL 반환
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(originalPath)

    return publicUrl
  }

  return { uploadWithThumbnail }
}
```

---

## 7. 리치 텍스트 에디터 아키텍처

### 7.1 Tiptap 설정

```typescript
// src/components/editor/RichTextEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { lowlight } from 'lowlight'

export const RichTextEditor = ({ content, onChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()) // 또는 editor.getJSON()
    },
  })

  return (
    <div className="editor-wrapper">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
```

### 7.2 이미지 삽입 플로우

```
┌──────────────────┐
│  User Clicks     │
│  Image Button    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Open Media      │
│  Library Modal   │
└────────┬─────────┘
         │
         ├─ Select Existing Image ──▶ Insert URL
         │
         └─ Upload New Image ────────▶ Upload → Insert URL
```

---

## 8. 성능 최적화 전략

### 8.1 Code Splitting

```typescript
// src/App.tsx
const AdminDashboard = React.lazy(() => import('@/admin/pages/Dashboard'))
const AdminRoadmap = React.lazy(() => import('@/admin/pages/roadmap/RoadmapList'))
const AdminPortfolio = React.lazy(() => import('@/admin/pages/portfolio/PortfolioList'))

<Routes>
  <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
    <Route index element={<Suspense fallback={<Loading />}><AdminDashboard /></Suspense>} />
    <Route path="roadmap" element={<Suspense fallback={<Loading />}><AdminRoadmap /></Suspense>} />
    <Route path="portfolio" element={<Suspense fallback={<Loading />}><AdminPortfolio /></Suspense>} />
  </Route>
</Routes>
```

### 8.2 React Query 캐싱 전략

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5분
      cacheTime: 10 * 60 * 1000,     // 10분
      refetchOnWindowFocus: false,   // 포커스 시 재요청 안 함
      retry: 1,                      // 1회만 재시도
    },
  },
})
```

### 8.3 이미지 Lazy Loading

```typescript
<img
  src={imageUrl}
  loading="lazy"
  alt="..."
/>
```

---

## 9. 보안 아키텍처

### 9.1 HTTPS 강제

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    https: true, // 개발 환경
  },
})

// 프로덕션: Vercel 자동 HTTPS
```

### 9.2 XSS 방지

```typescript
// src/utils/sanitize.ts
import DOMPurify from 'dompurify'

export const sanitizeHTML = (html: string) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'class'],
  })
}

// 사용 예시
<div dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }} />
```

### 9.3 CSRF 방지

Supabase Auth JWT 토큰 자동 포함 (axios/fetch interceptor 불필요)

---

**작성자**: Sinclair Seo (with Claude)
**다음 문서**: [tech-stack.md](./tech-stack.md), [implementation-strategy.md](./implementation-strategy.md)
