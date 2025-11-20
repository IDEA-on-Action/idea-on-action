# usePortfolioItems API 문서

## 개요

`usePortfolioItems` 훅은 포트폴리오 데이터를 관리하기 위한 React Query 기반 API입니다. Supabase `portfolio_items` 테이블과 상호작용하여 포트폴리오 목록 조회, 생성, 수정, 삭제 등의 CRUD 작업을 수행합니다.

**Import 경로**:
```typescript
import {
  usePortfolioItems,
  usePortfolioItem,
  usePortfolioItemBySlug,
  usePortfolioItemsByType,
  useFeaturedPortfolioItems,
  usePublishedPortfolioItems,
  useCreatePortfolioItem,
  useUpdatePortfolioItem,
  useDeletePortfolioItem,
} from '@/hooks/usePortfolioItems';
```

**관련 타입**:
```typescript
import type { PortfolioItem } from '@/types/v2';
```

**데이터베이스**: `public.portfolio_items` 테이블

---

## 훅 목록

| 훅 이름 | 타입 | 설명 |
|--------|------|------|
| `usePortfolioItems` | Query | 전체 포트폴리오 목록 조회 |
| `usePortfolioItem` | Query | ID로 단일 포트폴리오 조회 |
| `usePortfolioItemBySlug` | Query | slug로 단일 포트폴리오 조회 |
| `usePortfolioItemsByType` | Query | 프로젝트 타입별 조회 |
| `useFeaturedPortfolioItems` | Query | Featured 포트폴리오만 조회 |
| `usePublishedPortfolioItems` | Query | 공개된 포트폴리오만 조회 |
| `useCreatePortfolioItem` | Mutation | 새 포트폴리오 생성 (Admin 전용) |
| `useUpdatePortfolioItem` | Mutation | 포트폴리오 수정 (Admin 전용) |
| `useDeletePortfolioItem` | Mutation | 포트폴리오 삭제 (Admin 전용) |

---

## Query Hooks

### usePortfolioItems()

전체 포트폴리오 목록을 조회합니다.

#### 시그니처
```typescript
function usePortfolioItems(): UseQueryResult<PortfolioItem[], Error>
```

#### 파라미터
없음

#### 반환값
- `data`: `PortfolioItem[]` - 포트폴리오 배열 (최신순 정렬)
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

#### 예시
```typescript
import { usePortfolioItems } from '@/hooks/usePortfolioItems';

function PortfolioList() {
  const { data: items, isLoading, error } = usePortfolioItems();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map(item => (
        <div key={item.id} className="border p-4">
          <img src={item.thumbnail || '/default.jpg'} alt={item.title} />
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
          <span>{item.project_type}</span>
          {item.featured && <span className="badge">Featured</span>}
        </div>
      ))}
    </div>
  );
}
```

#### 특징
- **정렬**: `created_at` 기준 내림차순 (최신 프로젝트 우선)
- **캐싱**: 5분 (staleTime: 5 * 60 * 1000)
- **Fallback**: 빈 배열 (`[]`)

---

### usePortfolioItem(id)

ID로 단일 포트폴리오를 조회합니다.

#### 시그니처
```typescript
function usePortfolioItem(id: string): UseQueryResult<PortfolioItem | null, Error>
```

#### 파라미터
- `id`: `string` - 포트폴리오 ID (UUID)

#### 반환값
- `data`: `PortfolioItem | null` - 포트폴리오 객체 (존재하지 않으면 `null`)
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

#### 예시
```typescript
import { usePortfolioItem } from '@/hooks/usePortfolioItems';

function PortfolioAdmin({ id }: { id: string }) {
  const { data: item, isLoading } = usePortfolioItem(id);

  if (isLoading) return <div>Loading...</div>;
  if (!item) return <div>Not found</div>;

  return (
    <div>
      <h1>{item.title}</h1>
      <p>Type: {item.project_type}</p>
      <p>Published: {item.published ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

#### 특징
- **조건부 실행**: id가 제공될 때만 쿼리 실행 (`enabled: !!id`)
- **캐싱**: 5분
- **Query Key**: `['portfolio_items', id]`

---

### usePortfolioItemBySlug(slug)

slug로 단일 포트폴리오를 조회합니다 (공개 페이지용).

#### 시그니처
```typescript
function usePortfolioItemBySlug(slug: string): UseQueryResult<PortfolioItem | null, Error>
```

#### 파라미터
- `slug`: `string` - 포트폴리오 slug (예: `"idea-on-action"`, `"compass-navigator"`)

#### 반환값
- `data`: `PortfolioItem | null` - 포트폴리오 객체
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

#### 예시
```typescript
import { usePortfolioItemBySlug } from '@/hooks/usePortfolioItems';
import { useParams } from 'react-router-dom';

function PortfolioDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: item, isLoading, error } = usePortfolioItemBySlug(slug!);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!item) return <div>Portfolio not found</div>;

  return (
    <div>
      <h1>{item.title}</h1>
      <p>{item.summary}</p>
      <div>
        <h2>Tech Stack</h2>
        <ul>
          {item.tech_stack.map(tech => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>
      {item.testimonial && (
        <div>
          <h2>Testimonial</h2>
          <blockquote>{item.testimonial.content}</blockquote>
          <cite>- {item.testimonial.author}, {item.testimonial.role}</cite>
        </div>
      )}
    </div>
  );
}
```

#### 특징
- **SEO 친화적**: slug 기반 URL (`/portfolio/idea-on-action`)
- **조건부 실행**: slug가 제공될 때만 쿼리 실행
- **캐싱**: 5분
- **Query Key**: `['portfolio_items', 'slug', slug]`

---

### usePortfolioItemsByType(projectType)

프로젝트 타입별 포트폴리오를 조회합니다.

#### 시그니처
```typescript
type ProjectType = 'mvp' | 'fullstack' | 'design' | 'operations';

function usePortfolioItemsByType(
  projectType?: ProjectType
): UseQueryResult<PortfolioItem[], Error>
```

#### 파라미터
- `projectType`: `ProjectType | undefined` - 프로젝트 타입 (선택 사항)
  - `undefined`: 전체 포트폴리오 조회
  - `'mvp'`: MVP 개발
  - `'fullstack'`: 풀스택 개발
  - `'design'`: 디자인 시스템
  - `'operations'`: 운영 관리

#### 반환값
- `data`: `PortfolioItem[]` - 필터링된 포트폴리오 배열
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

#### 예시
```typescript
import { usePortfolioItemsByType } from '@/hooks/usePortfolioItems';
import { useState } from 'react';

function TypeFilter() {
  const [type, setType] = useState<ProjectType | undefined>(undefined);
  const { data: items, isLoading } = usePortfolioItemsByType(type);

  return (
    <div>
      <select onChange={(e) => setType(e.target.value as ProjectType)}>
        <option value="">All Types</option>
        <option value="mvp">MVP Development</option>
        <option value="fullstack">Fullstack Development</option>
        <option value="design">Design System</option>
        <option value="operations">Operations Management</option>
      </select>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id}>{item.title} - {item.project_type}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

#### 특징
- **동적 필터링**: projectType이 `undefined`이면 전체 조회
- **캐싱**: 5분
- **Query Key**: `['portfolio_items', 'type', projectType]`

---

### useFeaturedPortfolioItems()

Featured 포트폴리오만 조회합니다.

#### 시그니처
```typescript
function useFeaturedPortfolioItems(): UseQueryResult<PortfolioItem[], Error>
```

#### 파라미터
없음

#### 반환값
- `data`: `PortfolioItem[]` - Featured 포트폴리오 배열
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

#### 예시
```typescript
import { useFeaturedPortfolioItems } from '@/hooks/usePortfolioItems';

function FeaturedSection() {
  const { data: featured, isLoading } = useFeaturedPortfolioItems();

  if (isLoading) return <div>Loading featured projects...</div>;

  return (
    <div>
      <h2>Featured Projects ({featured.length})</h2>
      <div className="grid grid-cols-2 gap-4">
        {featured.map(item => (
          <div key={item.id} className="featured-card">
            <img src={item.thumbnail} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### 특징
- **필터링**: `featured: true` 조건만
- **정렬**: `created_at` 기준 내림차순
- **캐싱**: 5분
- **Query Key**: `['portfolio_items', 'featured']`

---

### usePublishedPortfolioItems()

공개된 포트폴리오만 조회합니다 (공개 페이지용).

#### 시그니처
```typescript
function usePublishedPortfolioItems(): UseQueryResult<PortfolioItem[], Error>
```

#### 파라미터
없음

#### 반환값
- `data`: `PortfolioItem[]` - 공개된 포트폴리오 배열
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

#### 예시
```typescript
import { usePublishedPortfolioItems } from '@/hooks/usePortfolioItems';

function PublicPortfolioPage() {
  const { data: items, isLoading } = usePublishedPortfolioItems();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Our Work</h1>
      <p>We have completed {items.length} projects.</p>
      <div className="portfolio-grid">
        {items.map(item => (
          <a key={item.id} href={`/portfolio/${item.slug}`} className="portfolio-card">
            <img src={item.thumbnail} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
```

#### 특징
- **필터링**: `published: true` 조건만
- **정렬**: `created_at` 기준 내림차순
- **캐싱**: 5분
- **Query Key**: `['portfolio_items', 'published']`

---

## Mutation Hooks

### useCreatePortfolioItem()

새 포트폴리오를 생성합니다 (Admin 전용).

#### 시그니처
```typescript
type PortfolioItemInsert = Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>;

function useCreatePortfolioItem(): UseMutationResult<
  PortfolioItem,
  Error,
  PortfolioItemInsert
>
```

#### 파라미터
- `mutationFn` 인자: `PortfolioItemInsert` - 생성할 포트폴리오 데이터

#### 반환값
- `mutate`: `(item: PortfolioItemInsert) => void` - 동기 실행
- `mutateAsync`: `(item: PortfolioItemInsert) => Promise<PortfolioItem>` - 비동기 실행
- `isPending`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `data`: `PortfolioItem | undefined` - 생성된 포트폴리오

#### 예시
```typescript
import { useCreatePortfolioItem } from '@/hooks/usePortfolioItems';
import { toast } from 'sonner';

function CreatePortfolioForm() {
  const createItem = useCreatePortfolioItem();

  const handleSubmit = async (data: PortfolioItemInsert) => {
    try {
      const newItem = await createItem.mutateAsync(data);
      toast.success(`포트폴리오 "${newItem.title}"이 생성되었습니다.`);
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
        description: formData.get('description') as string,
        client_name: formData.get('client_name') as string,
        client_logo: null,
        project_type: formData.get('project_type') as ProjectType,
        thumbnail: formData.get('thumbnail') as string,
        images: [],
        tech_stack: [],
        project_url: null,
        github_url: null,
        duration: null,
        team_size: null,
        start_date: null,
        end_date: null,
        challenges: null,
        solutions: null,
        outcomes: null,
        testimonial: {},
        featured: false,
        published: false,
        created_by: null,
      });
    }}>
      <input name="slug" placeholder="Slug" required />
      <input name="title" placeholder="Title" required />
      <textarea name="summary" placeholder="Summary" required />
      <textarea name="description" placeholder="Description" />
      <input name="client_name" placeholder="Client Name" />
      <select name="project_type" required>
        <option value="mvp">MVP Development</option>
        <option value="fullstack">Fullstack Development</option>
        <option value="design">Design System</option>
        <option value="operations">Operations Management</option>
      </select>
      <input name="thumbnail" placeholder="Thumbnail URL" />
      <button type="submit" disabled={createItem.isPending}>
        {createItem.isPending ? '생성 중...' : '포트폴리오 생성'}
      </button>
    </form>
  );
}
```

#### 특징
- **자동 캐시 무효화**: 성공 시 `['portfolio_items']` 쿼리 재조회
- **RLS 정책**: Admin 권한 필요

#### 에러 처리
```typescript
try {
  await createItem.mutateAsync(newItem);
} catch (error) {
  if (error.code === '23505') {
    // Unique constraint violation (slug already exists)
    toast.error('이미 존재하는 slug입니다.');
  } else if (error.code === '42501') {
    // Insufficient privilege
    toast.error('권한이 없습니다.');
  } else {
    toast.error(`에러: ${error.message}`);
  }
}
```

---

### useUpdatePortfolioItem()

포트폴리오를 수정합니다 (Admin 전용).

#### 시그니처
```typescript
type PortfolioItemUpdate = Partial<PortfolioItem>;

function useUpdatePortfolioItem(): UseMutationResult<
  PortfolioItem,
  Error,
  { id: string; updates: PortfolioItemUpdate }
>
```

#### 파라미터
- `id`: `string` - 포트폴리오 ID
- `updates`: `Partial<PortfolioItem>` - 수정할 필드 (부분 업데이트)

#### 반환값
- `mutate`: `({ id, updates }) => void` - 동기 실행
- `mutateAsync`: `({ id, updates }) => Promise<PortfolioItem>` - 비동기 실행
- `isPending`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `data`: `PortfolioItem | undefined` - 수정된 포트폴리오

#### 예시
```typescript
import { useUpdatePortfolioItem } from '@/hooks/usePortfolioItems';
import { toast } from 'sonner';

function FeaturedToggle({ item }: { item: PortfolioItem }) {
  const updateItem = useUpdatePortfolioItem();

  const handleToggle = async () => {
    try {
      await updateItem.mutateAsync({
        id: item.id,
        updates: { featured: !item.featured },
      });
      toast.success(item.featured ? 'Featured 제거됨' : 'Featured 설정됨');
    } catch (error) {
      toast.error(`변경 실패: ${error.message}`);
    }
  };

  return (
    <button onClick={handleToggle} disabled={updateItem.isPending}>
      {item.featured ? '⭐ Featured' : 'Set as Featured'}
    </button>
  );
}
```

#### 특징
- **부분 업데이트**: 변경할 필드만 전달
- **자동 캐시 무효화**: 성공 시 `['portfolio_items']`, `['portfolio_items', id]`, `['portfolio_items', 'slug', slug]` 쿼리 재조회
- **RLS 정책**: Admin 권한 필요

#### 에러 처리
```typescript
try {
  await updateItem.mutateAsync({ id, updates });
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

### useDeletePortfolioItem()

포트폴리오를 삭제합니다 (Admin 전용).

#### 시그니처
```typescript
function useDeletePortfolioItem(): UseMutationResult<string, Error, string>
```

#### 파라미터
- `id`: `string` - 삭제할 포트폴리오 ID

#### 반환값
- `mutate`: `(id: string) => void` - 동기 실행
- `mutateAsync`: `(id: string) => Promise<string>` - 비동기 실행 (삭제된 ID 반환)
- `isPending`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체

#### 예시
```typescript
import { useDeletePortfolioItem } from '@/hooks/usePortfolioItems';
import { toast } from 'sonner';

function DeleteButton({ itemId, itemTitle }: { itemId: string; itemTitle: string }) {
  const deleteItem = useDeletePortfolioItem();

  const handleDelete = async () => {
    if (!confirm(`"${itemTitle}" 포트폴리오를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteItem.mutateAsync(itemId);
      toast.success('포트폴리오가 삭제되었습니다.');
    } catch (error) {
      toast.error(`삭제 실패: ${error.message}`);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleteItem.isPending}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      {deleteItem.isPending ? '삭제 중...' : '삭제'}
    </button>
  );
}
```

#### 특징
- **자동 캐시 무효화**: 성공 시 `['portfolio_items']` 쿼리 재조회
- **RLS 정책**: Admin 권한 필요
- **영구 삭제**: 데이터베이스에서 완전히 삭제됨 (복구 불가)

---

## Best Practices

### 1. Testimonial 관리

```typescript
import { useUpdatePortfolioItem } from '@/hooks/usePortfolioItems';

function TestimonialForm({ item }: { item: PortfolioItem }) {
  const updateItem = useUpdatePortfolioItem();

  const handleSubmit = async (data: PortfolioTestimonial) => {
    await updateItem.mutateAsync({
      id: item.id,
      updates: {
        testimonial: {
          ...item.testimonial,
          ...data,
        },
      },
    });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleSubmit({
        author: formData.get('author') as string,
        role: formData.get('role') as string,
        company: formData.get('company') as string,
        content: formData.get('content') as string,
        avatar: formData.get('avatar') as string,
      });
    }}>
      <input name="author" placeholder="Author" />
      <input name="role" placeholder="Role" />
      <input name="company" placeholder="Company" />
      <textarea name="content" placeholder="Content" />
      <input name="avatar" placeholder="Avatar URL" />
      <button type="submit">Save Testimonial</button>
    </form>
  );
}
```

### 2. Tech Stack 배열 관리

```typescript
import { useUpdatePortfolioItem } from '@/hooks/usePortfolioItems';

function TechStackManager({ item }: { item: PortfolioItem }) {
  const updateItem = useUpdatePortfolioItem();

  const addTech = async (newTech: string) => {
    await updateItem.mutateAsync({
      id: item.id,
      updates: {
        tech_stack: [...item.tech_stack, newTech],
      },
    });
  };

  const removeTech = async (techToRemove: string) => {
    await updateItem.mutateAsync({
      id: item.id,
      updates: {
        tech_stack: item.tech_stack.filter(t => t !== techToRemove),
      },
    });
  };

  return (
    <div>
      <ul>
        {item.tech_stack.map(tech => (
          <li key={tech}>
            {tech}
            <button onClick={() => removeTech(tech)}>Remove</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.currentTarget.value) {
            addTech(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
        placeholder="Add tech (press Enter)"
      />
    </div>
  );
}
```

### 3. 이미지 갤러리 관리

```typescript
import { useUpdatePortfolioItem } from '@/hooks/usePortfolioItems';

function ImageGallery({ item }: { item: PortfolioItem }) {
  const updateItem = useUpdatePortfolioItem();

  const addImage = async (url: string) => {
    await updateItem.mutateAsync({
      id: item.id,
      updates: {
        images: [...item.images, url],
      },
    });
  };

  const removeImage = async (index: number) => {
    await updateItem.mutateAsync({
      id: item.id,
      updates: {
        images: item.images.filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {item.images.map((url, index) => (
          <div key={index} className="relative">
            <img src={url} alt={`Gallery ${index + 1}`} />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 bg-red-600 text-white"
            >
              X
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Image URL"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.currentTarget.value) {
            addImage(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
      />
    </div>
  );
}
```

### 4. Featured 포트폴리오 회전 배너

```typescript
import { useFeaturedPortfolioItems } from '@/hooks/usePortfolioItems';
import { useState, useEffect } from 'react';

function FeaturedCarousel() {
  const { data: featured } = useFeaturedPortfolioItems();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!featured || featured.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length);
    }, 5000); // 5초마다 변경

    return () => clearInterval(interval);
  }, [featured]);

  if (!featured || featured.length === 0) return null;

  const item = featured[current];

  return (
    <div className="carousel">
      <img src={item.thumbnail} alt={item.title} />
      <h2>{item.title}</h2>
      <p>{item.summary}</p>
      <div className="dots">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={i === current ? 'active' : ''}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 관련 타입

### PortfolioItem 타입

```typescript
export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  client_name?: string;
  client_logo?: string;
  project_type: 'mvp' | 'fullstack' | 'design' | 'operations';
  thumbnail?: string;
  images: string[];
  tech_stack: string[];
  project_url?: string;
  github_url?: string;
  duration?: string;
  team_size?: number;
  start_date?: string;  // YYYY-MM-DD
  end_date?: string;    // YYYY-MM-DD
  challenges?: string;
  solutions?: string;
  outcomes?: string;
  testimonial: PortfolioTestimonial;
  featured: boolean;
  published: boolean;
  created_by?: string | null; // UUID (FK to admins.user_id)
  created_at: string;  // ISO 8601
  updated_at: string;  // ISO 8601
}

export interface PortfolioTestimonial {
  author?: string;
  role?: string;
  company?: string;
  content?: string;
  avatar?: string;
}
```

---

## 관련 문서

- **[PortfolioItem 타입 정의](../../../types/v2.ts)** - TypeScript 타입
- **[AdminPortfolio 가이드](../admin-portfolio-guide.md)** - 관리자 UI 사용법
- **[Supabase RLS 정책](../../database/rls-policies.md)** - 권한 관리

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2025-11-21 | 1.0.0 | 초기 문서 작성 |

---

**문서 위치**: `docs/guides/cms/api/use-portfolio-items.md`
**작성자**: Claude (AI)
**최종 검토**: 2025-11-21
