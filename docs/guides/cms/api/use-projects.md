# useProjects API 문서

## 개요

`useProjects` 훅은 프로젝트 데이터를 관리하기 위한 React Query 기반 API입니다. Supabase `projects` 테이블과 상호작용하여 프로젝트 목록 조회, 생성, 수정, 삭제 등의 CRUD 작업을 수행합니다.

**Import 경로**:
```typescript
import {
  useProjects,
  useProject,
  useProjectsByStatus,
  useProjectsByCategory,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '@/hooks/useProjects';
```

**관련 타입**:
```typescript
import type { Project } from '@/types/v2';
```

**데이터베이스**: `public.projects` 테이블

---

## 훅 목록

| 훅 이름 | 타입 | 설명 |
|--------|------|------|
| `useProjects` | Query | 전체 프로젝트 목록 조회 |
| `useProject` | Query | slug로 단일 프로젝트 조회 |
| `useProjectsByStatus` | Query | 상태별 프로젝트 조회 |
| `useProjectsByCategory` | Query | 카테고리별 프로젝트 조회 |
| `useCreateProject` | Mutation | 새 프로젝트 생성 (Admin 전용) |
| `useUpdateProject` | Mutation | 프로젝트 수정 (Admin 전용) |
| `useDeleteProject` | Mutation | 프로젝트 삭제 (Admin 전용) |

---

## Query Hooks

### useProjects()

전체 프로젝트 목록을 조회합니다.

#### 시그니처
```typescript
function useProjects(): UseQueryResult<Project[], Error>
```

#### 파라미터
없음

#### 반환값
- `data`: `Project[]` - 프로젝트 배열 (최신순 정렬)
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

#### 예시
```typescript
import { useProjects } from '@/hooks/useProjects';

function ProjectList() {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {projects.map(project => (
        <li key={project.id}>{project.title}</li>
      ))}
    </ul>
  );
}
```

#### 특징
- **정렬**: `created_at` 기준 내림차순 (최신 프로젝트 우선)
- **캐싱**: 5분 (staleTime: 5 * 60 * 1000)
- **Fallback**: 빈 배열 (`[]`)

---

### useProject(slug)

slug로 단일 프로젝트를 조회합니다.

#### 시그니처
```typescript
function useProject(slug: string): UseQueryResult<Project | null, Error>
```

#### 파라미터
- `slug`: `string` - 프로젝트 slug (예: `"idea-on-action"`, `"compass-navigator"`)

#### 반환값
- `data`: `Project | null` - 프로젝트 객체 (존재하지 않으면 `null`)
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

#### 예시
```typescript
import { useProject } from '@/hooks/useProjects';
import { useParams } from 'react-router-dom';

function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = useProject(slug!);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div>
      <h1>{project.title}</h1>
      <p>{project.summary}</p>
      <span>Status: {project.status}</span>
    </div>
  );
}
```

#### 특징
- **조건부 실행**: slug가 제공될 때만 쿼리 실행 (`enabled: !!slug`)
- **캐싱**: 5분
- **Fallback**: `null`

#### 에러 처리
```typescript
const { data, error } = useProject('non-existent-slug');

if (error) {
  // Supabase 에러: "No rows returned for single() query"
  console.error('프로젝트를 찾을 수 없습니다:', error.message);
}
```

---

### useProjectsByStatus(status)

상태별 프로젝트를 조회합니다.

#### 시그니처
```typescript
type ProjectStatus = 'backlog' | 'in-progress' | 'validate' | 'launched';

function useProjectsByStatus(status?: ProjectStatus): UseQueryResult<Project[], Error>
```

#### 파라미터
- `status`: `ProjectStatus | undefined` - 프로젝트 상태 (선택 사항)
  - `undefined`: 전체 프로젝트 조회 (useProjects와 동일)
  - `'backlog'`: 백로그 상태
  - `'in-progress'`: 진행 중
  - `'validate'`: 검증 단계
  - `'launched'`: 출시됨

#### 반환값
- `data`: `Project[]` - 필터링된 프로젝트 배열
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

#### 예시
```typescript
import { useProjectsByStatus } from '@/hooks/useProjects';
import { useState } from 'react';

function ProjectFilter() {
  const [status, setStatus] = useState<ProjectStatus | undefined>(undefined);
  const { data: projects, isLoading } = useProjectsByStatus(status);

  return (
    <div>
      <select onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
        <option value="">All</option>
        <option value="backlog">Backlog</option>
        <option value="in-progress">In Progress</option>
        <option value="validate">Validate</option>
        <option value="launched">Launched</option>
      </select>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {projects.map(project => (
            <li key={project.id}>
              {project.title} - {project.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

#### 특징
- **동적 필터링**: status가 `undefined`이면 전체 조회
- **캐싱**: 5분
- **Query Key**: `['projects', 'status', status]` (status별 캐시 분리)

---

### useProjectsByCategory(category)

카테고리별 프로젝트를 조회합니다.

#### 시그니처
```typescript
function useProjectsByCategory(category?: string): UseQueryResult<Project[], Error>
```

#### 파라미터
- `category`: `string | undefined` - 프로젝트 카테고리 (선택 사항)
  - 예: `"web"`, `"mobile"`, `"ai"`, `"saas"`

#### 반환값
- `data`: `Project[]` - 필터링된 프로젝트 배열
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

#### 예시
```typescript
import { useProjectsByCategory } from '@/hooks/useProjects';

function CategoryProjects({ category }: { category: string }) {
  const { data: projects, isLoading, error } = useProjectsByCategory(category);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Category: {category}</h2>
      <p>Projects: {projects.length}</p>
      <ul>
        {projects.map(project => (
          <li key={project.id}>{project.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### 특징
- **동적 필터링**: category가 `undefined`이면 전체 조회
- **캐싱**: 5분
- **Query Key**: `['projects', 'category', category]`

---

## Mutation Hooks

### useCreateProject()

새 프로젝트를 생성합니다 (Admin 전용).

#### 시그니처
```typescript
type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'>;

function useCreateProject(): UseMutationResult<
  Project,
  Error,
  ProjectInsert
>
```

#### 파라미터
- `mutationFn` 인자: `ProjectInsert` - 생성할 프로젝트 데이터

#### 반환값
- `mutate`: `(project: ProjectInsert) => void` - 동기 실행
- `mutateAsync`: `(project: ProjectInsert) => Promise<Project>` - 비동기 실행
- `isPending`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `data`: `Project | undefined` - 생성된 프로젝트

#### 예시
```typescript
import { useCreateProject } from '@/hooks/useProjects';
import { toast } from 'sonner';

function CreateProjectForm() {
  const createProject = useCreateProject();

  const handleSubmit = async (data: ProjectInsert) => {
    try {
      const newProject = await createProject.mutateAsync(data);
      toast.success(`프로젝트 "${newProject.title}"가 생성되었습니다.`);
    } catch (error) {
      toast.error(`생성 실패: ${error.message}`);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleSubmit({
        slug: formData.get('slug') as string,
        title: formData.get('title') as string,
        summary: formData.get('summary') as string,
        status: 'backlog',
        category: formData.get('category') as string,
        tags: [],
        metrics: { progress: 0, contributors: 0, commits: 0, tests: 0 },
        tech: { frontend: [], backend: null, testing: null, deployment: [] },
        links: {},
        timeline: {
          started: new Date().toISOString(),
          launched: null,
          updated: new Date().toISOString(),
        },
      });
    }}>
      <input name="slug" placeholder="Slug" required />
      <input name="title" placeholder="Title" required />
      <textarea name="summary" placeholder="Summary" required />
      <input name="category" placeholder="Category" required />
      <button type="submit" disabled={createProject.isPending}>
        {createProject.isPending ? '생성 중...' : '프로젝트 생성'}
      </button>
    </form>
  );
}
```

#### 특징
- **자동 캐시 무효화**: 성공 시 `['projects']` 쿼리 재조회
- **RLS 정책**: Admin 권한 필요 (Supabase RLS에서 검증)

#### 에러 처리
```typescript
try {
  await createProject.mutateAsync(newProject);
} catch (error) {
  if (error.code === '23505') {
    // Unique constraint violation (slug already exists)
    toast.error('이미 존재하는 slug입니다.');
  } else if (error.code === '42501') {
    // Insufficient privilege (not admin)
    toast.error('권한이 없습니다.');
  } else {
    toast.error(`에러: ${error.message}`);
  }
}
```

---

### useUpdateProject()

프로젝트를 수정합니다 (Admin 전용).

#### 시그니처
```typescript
type ProjectUpdate = Partial<Project>;

function useUpdateProject(): UseMutationResult<
  Project,
  Error,
  { id: string; updates: ProjectUpdate }
>
```

#### 파라미터
- `id`: `string` - 프로젝트 ID
- `updates`: `Partial<Project>` - 수정할 필드 (부분 업데이트)

#### 반환값
- `mutate`: `({ id, updates }) => void` - 동기 실행
- `mutateAsync`: `({ id, updates }) => Promise<Project>` - 비동기 실행
- `isPending`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `data`: `Project | undefined` - 수정된 프로젝트

#### 예시
```typescript
import { useUpdateProject } from '@/hooks/useProjects';
import { toast } from 'sonner';

function UpdateProjectStatus({ project }: { project: Project }) {
  const updateProject = useUpdateProject();

  const handleStatusChange = async (newStatus: Project['status']) => {
    try {
      await updateProject.mutateAsync({
        id: project.id,
        updates: { status: newStatus },
      });
      toast.success('상태가 변경되었습니다.');
    } catch (error) {
      toast.error(`변경 실패: ${error.message}`);
    }
  };

  return (
    <select
      value={project.status}
      onChange={(e) => handleStatusChange(e.target.value as Project['status'])}
      disabled={updateProject.isPending}
    >
      <option value="backlog">Backlog</option>
      <option value="in-progress">In Progress</option>
      <option value="validate">Validate</option>
      <option value="launched">Launched</option>
    </select>
  );
}
```

#### 특징
- **부분 업데이트**: 변경할 필드만 전달
- **자동 캐시 무효화**: 성공 시 `['projects']`, `['projects', slug]` 쿼리 재조회
- **RLS 정책**: Admin 권한 필요

#### 에러 처리
```typescript
try {
  await updateProject.mutateAsync({ id, updates });
} catch (error) {
  if (error.code === '23503') {
    // Foreign key violation
    toast.error('유효하지 않은 참조입니다.');
  } else if (error.code === '42501') {
    // Insufficient privilege
    toast.error('수정 권한이 없습니다.');
  } else {
    toast.error(`수정 실패: ${error.message}`);
  }
}
```

---

### useDeleteProject()

프로젝트를 삭제합니다 (Admin 전용).

#### 시그니처
```typescript
function useDeleteProject(): UseMutationResult<string, Error, string>
```

#### 파라미터
- `id`: `string` - 삭제할 프로젝트 ID

#### 반환값
- `mutate`: `(id: string) => void` - 동기 실행
- `mutateAsync`: `(id: string) => Promise<string>` - 비동기 실행 (삭제된 ID 반환)
- `isPending`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체

#### 예시
```typescript
import { useDeleteProject } from '@/hooks/useProjects';
import { toast } from 'sonner';

function DeleteProjectButton({ projectId, projectTitle }: { projectId: string; projectTitle: string }) {
  const deleteProject = useDeleteProject();

  const handleDelete = async () => {
    if (!confirm(`"${projectTitle}" 프로젝트를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteProject.mutateAsync(projectId);
      toast.success('프로젝트가 삭제되었습니다.');
    } catch (error) {
      toast.error(`삭제 실패: ${error.message}`);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleteProject.isPending}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      {deleteProject.isPending ? '삭제 중...' : '삭제'}
    </button>
  );
}
```

#### 특징
- **자동 캐시 무효화**: 성공 시 `['projects']` 쿼리 재조회
- **RLS 정책**: Admin 권한 필요
- **영구 삭제**: 데이터베이스에서 완전히 삭제됨 (복구 불가)

#### 에러 처리
```typescript
try {
  await deleteProject.mutateAsync(projectId);
} catch (error) {
  if (error.code === '23503') {
    // Foreign key constraint (다른 테이블에서 참조 중)
    toast.error('다른 데이터에서 참조 중인 프로젝트는 삭제할 수 없습니다.');
  } else if (error.code === '42501') {
    // Insufficient privilege
    toast.error('삭제 권한이 없습니다.');
  } else {
    toast.error(`삭제 실패: ${error.message}`);
  }
}
```

---

## Best Practices

### 1. 에러 처리 패턴

```typescript
import { useProject } from '@/hooks/useProjects';
import { toast } from 'sonner';

function ProjectDetailSafe({ slug }: { slug: string }) {
  const { data: project, isLoading, error } = useProject(slug);

  // 로딩 상태
  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  // 에러 상태
  if (error) {
    toast.error(`프로젝트 조회 실패: ${error.message}`);
    return <div className="text-red-600">Error: {error.message}</div>;
  }

  // 데이터 없음
  if (!project) {
    return <div className="text-gray-500">프로젝트를 찾을 수 없습니다.</div>;
  }

  // 정상 렌더링
  return <div>{project.title}</div>;
}
```

### 2. Optimistic Update

```typescript
import { useUpdateProject } from '@/hooks/useProjects';
import { useQueryClient } from '@tanstack/react-query';

function OptimisticStatusUpdate({ project }: { project: Project }) {
  const queryClient = useQueryClient();
  const updateProject = useUpdateProject();

  const handleStatusChange = (newStatus: Project['status']) => {
    // Optimistic update
    queryClient.setQueryData(['projects', project.slug], (old: Project) => ({
      ...old,
      status: newStatus,
    }));

    // 실제 업데이트
    updateProject.mutate(
      { id: project.id, updates: { status: newStatus } },
      {
        onError: () => {
          // 실패 시 rollback
          queryClient.invalidateQueries({ queryKey: ['projects', project.slug] });
        },
      }
    );
  };

  return <StatusSelect value={project.status} onChange={handleStatusChange} />;
}
```

### 3. 조건부 쿼리 실행

```typescript
import { useProject } from '@/hooks/useProjects';

function ConditionalProjectLoad({ slug }: { slug?: string }) {
  // slug가 undefined이면 쿼리 실행하지 않음
  const { data, isLoading } = useProject(slug!);

  if (!slug) {
    return <div>No slug provided</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{data?.title}</div>;
}
```

### 4. 캐시 수동 무효화

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { useDeleteProject } from '@/hooks/useProjects';

function ManualCacheInvalidation() {
  const queryClient = useQueryClient();
  const deleteProject = useDeleteProject();

  const handleDelete = async (id: string) => {
    await deleteProject.mutateAsync(id);

    // 특정 쿼리만 무효화
    queryClient.invalidateQueries({ queryKey: ['projects', 'status', 'backlog'] });

    // 모든 projects 쿼리 무효화
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };

  return <button onClick={() => handleDelete('project-id')}>Delete</button>;
}
```

### 5. 데이터 프리페칭

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

function ProjectListWithPrefetch() {
  const queryClient = useQueryClient();

  const handleMouseEnter = (slug: string) => {
    // 프로젝트 상세 미리 로드
    queryClient.prefetchQuery({
      queryKey: ['projects', slug],
      queryFn: async () => {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .single();
        return data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <div>
      {projects.map(project => (
        <div key={project.id} onMouseEnter={() => handleMouseEnter(project.slug)}>
          {project.title}
        </div>
      ))}
    </div>
  );
}
```

---

## 관련 타입

### Project 타입

```typescript
export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  status: 'backlog' | 'in-progress' | 'validate' | 'launched';
  category: string;
  image?: string;
  tags: string[];
  metrics: ProjectMetrics;
  tech: ProjectTech;
  links: ProjectLinks;
  timeline: ProjectTimeline;
  highlights?: string[];
  // Storytelling fields (optional)
  problem?: string;
  solution?: string;
  impact?: ProjectImpact;
  created_at: string;
  updated_at: string;
}

export interface ProjectMetrics {
  progress: number;        // 0-100
  contributors: number;
  commits: number;
  tests: number;
  coverage?: number;       // 0-100
}

export interface ProjectTech {
  frontend?: string[];
  backend?: string[] | null;
  testing?: string[] | null;
  deployment?: string[];
}

export interface ProjectLinks {
  github?: string;
  demo?: string | null;
  docs?: string | null;
}

export interface ProjectTimeline {
  started: string;         // ISO 8601
  launched?: string | null;
  updated: string;
}

export interface ProjectImpact {
  users?: string;          // "5,000명 사용 중"
  timeSaved?: string;      // "월 100시간 절감"
  satisfaction?: string;   // "4.8/5.0"
  revenue?: string;        // "월 500만원 매출"
}
```

---

## 관련 문서

- **[Project 타입 정의](../../../types/v2.ts)** - TypeScript 타입
- **[Supabase RLS 정책](../../database/rls-policies.md)** - 권한 관리
- **[React Query 가이드](../../frontend/react-query.md)** - React Query 기본
- **[Admin 가이드](../admin-portfolio-guide.md)** - 관리자 UI 사용법

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2025-11-21 | 1.0.0 | 초기 문서 작성 |

---

**문서 위치**: `docs/guides/cms/api/use-projects.md`
**작성자**: Claude (AI)
**최종 검토**: 2025-11-21
