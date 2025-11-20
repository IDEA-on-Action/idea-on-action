# useRoadmapItems API 문서

## 개요

`useRoadmapItems` 훅은 로드맵 데이터를 관리하기 위한 React Query 기반 API입니다. Supabase `roadmap_items` 테이블과 상호작용하여 로드맵 목록 조회, 생성, 수정, 삭제 등의 CRUD 작업을 수행합니다.

**Import 경로**:
```typescript
import {
  useRoadmapItems,
  useRoadmapItem,
  useRoadmapItemsByCategory,
  useRoadmapItemsByStatus,
  usePublishedRoadmapItems,
  useCreateRoadmapItem,
  useUpdateRoadmapItem,
  useDeleteRoadmapItem,
} from '@/hooks/useRoadmapItems';
```

**관련 타입**:
```typescript
import type { RoadmapItem } from '@/types/v2';
```

**데이터베이스**: `public.roadmap_items` 테이블

---

## 훅 목록

| 훅 이름 | 타입 | 설명 |
|--------|------|------|
| `useRoadmapItems` | Query | 전체 로드맵 목록 조회 (우선순위 정렬) |
| `useRoadmapItem` | Query | ID로 단일 로드맵 조회 |
| `useRoadmapItemsByCategory` | Query | 카테고리별 로드맵 조회 |
| `useRoadmapItemsByStatus` | Query | 상태별 로드맵 조회 |
| `usePublishedRoadmapItems` | Query | 공개된 로드맵만 조회 |
| `useCreateRoadmapItem` | Mutation | 새 로드맵 생성 (Admin 전용) |
| `useUpdateRoadmapItem` | Mutation | 로드맵 수정 (Admin 전용) |
| `useDeleteRoadmapItem` | Mutation | 로드맵 삭제 (Admin 전용) |

---

## Query Hooks

### useRoadmapItems()

전체 로드맵 목록을 조회합니다.

#### 시그니처
```typescript
function useRoadmapItems(): UseQueryResult<RoadmapItem[], Error>
```

#### 파라미터
없음

#### 반환값
- `data`: `RoadmapItem[]` - 로드맵 배열 (우선순위 정렬)
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

#### 예시
```typescript
import { useRoadmapItems } from '@/hooks/useRoadmapItems';

function RoadmapList() {
  const { data: items, isLoading, error } = useRoadmapItems();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <h3>{item.title}</h3>
          <span>{item.category} | {item.status}</span>
          <progress value={item.progress} max={100}>{item.progress}%</progress>
        </li>
      ))}
    </ul>
  );
}
```

#### 특징
- **정렬**: `priority` (내림차순) → `created_at` (내림차순)
- **캐싱**: 5분 (staleTime: 5 * 60 * 1000)
- **Fallback**: 빈 배열 (`[]`)

---

### useRoadmapItem(id)

ID로 단일 로드맵을 조회합니다.

#### 시그니처
```typescript
function useRoadmapItem(id: string): UseQueryResult<RoadmapItem | null, Error>
```

#### 파라미터
- `id`: `string` - 로드맵 ID (UUID)

#### 반환값
- `data`: `RoadmapItem | null` - 로드맵 객체 (존재하지 않으면 `null`)
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

#### 예시
```typescript
import { useRoadmapItem } from '@/hooks/useRoadmapItems';
import { useParams } from 'react-router-dom';

function RoadmapDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading, error } = useRoadmapItem(id!);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!item) return <div>Roadmap not found</div>;

  return (
    <div>
      <h1>{item.title}</h1>
      <p>{item.description}</p>
      <div>
        <span>Category: {item.category}</span>
        <span>Status: {item.status}</span>
        <span>Progress: {item.progress}%</span>
        <span>Priority: {item.priority}</span>
      </div>
    </div>
  );
}
```

#### 특징
- **조건부 실행**: id가 제공될 때만 쿼리 실행 (`enabled: !!id`)
- **캐싱**: 5분
- **Fallback**: `null`

---

### useRoadmapItemsByCategory(category)

카테고리별 로드맵을 조회합니다.

#### 시그니처
```typescript
type RoadmapCategory = 'service' | 'platform' | 'internal';

function useRoadmapItemsByCategory(
  category?: RoadmapCategory
): UseQueryResult<RoadmapItem[], Error>
```

#### 파라미터
- `category`: `RoadmapCategory | undefined` - 로드맵 카테고리 (선택 사항)
  - `undefined`: 전체 로드맵 조회
  - `'service'`: 서비스 관련
  - `'platform'`: 플랫폼 관련
  - `'internal'`: 내부 프로젝트

#### 반환값
- `data`: `RoadmapItem[]` - 필터링된 로드맵 배열
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

#### 예시
```typescript
import { useRoadmapItemsByCategory } from '@/hooks/useRoadmapItems';
import { useState } from 'react';

function CategoryFilter() {
  const [category, setCategory] = useState<RoadmapCategory | undefined>(undefined);
  const { data: items, isLoading } = useRoadmapItemsByCategory(category);

  return (
    <div>
      <select onChange={(e) => setCategory(e.target.value as RoadmapCategory)}>
        <option value="">All Categories</option>
        <option value="service">Service</option>
        <option value="platform">Platform</option>
        <option value="internal">Internal</option>
      </select>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id}>{item.title} - {item.category}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

#### 특징
- **동적 필터링**: category가 `undefined`이면 전체 조회
- **캐싱**: 5분
- **Query Key**: `['roadmap-items', 'category', category]`

---

### useRoadmapItemsByStatus(status)

상태별 로드맵을 조회합니다.

#### 시그니처
```typescript
type RoadmapStatus = 'planned' | 'in-progress' | 'completed' | 'on-hold';

function useRoadmapItemsByStatus(
  status?: RoadmapStatus
): UseQueryResult<RoadmapItem[], Error>
```

#### 파라미터
- `status`: `RoadmapStatus | undefined` - 로드맵 상태 (선택 사항)
  - `undefined`: 전체 로드맵 조회
  - `'planned'`: 계획됨
  - `'in-progress'`: 진행 중
  - `'completed'`: 완료됨
  - `'on-hold'`: 보류됨

#### 반환값
- `data`: `RoadmapItem[]` - 필터링된 로드맵 배열
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

#### 예시
```typescript
import { useRoadmapItemsByStatus } from '@/hooks/useRoadmapItems';

function StatusBoard() {
  const { data: planned } = useRoadmapItemsByStatus('planned');
  const { data: inProgress } = useRoadmapItemsByStatus('in-progress');
  const { data: completed } = useRoadmapItemsByStatus('completed');

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <h2>Planned ({planned.length})</h2>
        {planned.map(item => (
          <div key={item.id}>{item.title}</div>
        ))}
      </div>
      <div>
        <h2>In Progress ({inProgress.length})</h2>
        {inProgress.map(item => (
          <div key={item.id}>{item.title}</div>
        ))}
      </div>
      <div>
        <h2>Completed ({completed.length})</h2>
        {completed.map(item => (
          <div key={item.id}>{item.title}</div>
        ))}
      </div>
    </div>
  );
}
```

#### 특징
- **동적 필터링**: status가 `undefined`이면 전체 조회
- **캐싱**: 5분
- **Query Key**: `['roadmap-items', 'status', status]`

---

### usePublishedRoadmapItems()

공개된 로드맵만 조회합니다 (공개 페이지용).

#### 시그니처
```typescript
function usePublishedRoadmapItems(): UseQueryResult<RoadmapItem[], Error>
```

#### 파라미터
없음

#### 반환값
- `data`: `RoadmapItem[]` - 공개된 로드맵 배열
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

#### 예시
```typescript
import { usePublishedRoadmapItems } from '@/hooks/useRoadmapItems';

function PublicRoadmapPage() {
  const { data: items, isLoading } = usePublishedRoadmapItems();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Our Roadmap</h1>
      <p>We have {items.length} initiatives in progress.</p>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <progress value={item.progress} max={100}>{item.progress}%</progress>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### 특징
- **필터링**: `published: true` 조건만
- **정렬**: `priority` (내림차순) → `created_at` (내림차순)
- **캐싱**: 5분
- **Query Key**: `['roadmap-items', 'published']`

---

## Mutation Hooks

### useCreateRoadmapItem()

새 로드맵을 생성합니다 (Admin 전용).

#### 시그니처
```typescript
type RoadmapItemInsert = Omit<RoadmapItem, 'id' | 'created_at' | 'updated_at'>;

function useCreateRoadmapItem(): UseMutationResult<
  RoadmapItem,
  Error,
  RoadmapItemInsert
>
```

#### 파라미터
- `mutationFn` 인자: `RoadmapItemInsert` - 생성할 로드맵 데이터

#### 반환값
- `mutate`: `(item: RoadmapItemInsert) => void` - 동기 실행
- `mutateAsync`: `(item: RoadmapItemInsert) => Promise<RoadmapItem>` - 비동기 실행
- `isPending`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `data`: `RoadmapItem | undefined` - 생성된 로드맵

#### 예시
```typescript
import { useCreateRoadmapItem } from '@/hooks/useRoadmapItems';
import { toast } from 'sonner';

function CreateRoadmapForm() {
  const createItem = useCreateRoadmapItem();

  const handleSubmit = async (data: RoadmapItemInsert) => {
    // Progress 검증 (0-100)
    if (data.progress < 0 || data.progress > 100) {
      toast.error('Progress must be between 0 and 100');
      return;
    }

    try {
      const newItem = await createItem.mutateAsync(data);
      toast.success(`로드맵 "${newItem.title}"이 생성되었습니다.`);
    } catch (error) {
      toast.error(`생성 실패: ${error.message}`);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleSubmit({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as RoadmapCategory,
        status: 'planned',
        progress: parseInt(formData.get('progress') as string, 10) || 0,
        priority: parseInt(formData.get('priority') as string, 10) || 0,
        start_date: formData.get('start_date') as string || null,
        end_date: formData.get('end_date') as string || null,
        tags: [],
        published: false,
        created_by: null,
      });
    }}>
      <input name="title" placeholder="Title" required />
      <textarea name="description" placeholder="Description" />
      <select name="category" required>
        <option value="service">Service</option>
        <option value="platform">Platform</option>
        <option value="internal">Internal</option>
      </select>
      <input type="number" name="progress" min="0" max="100" defaultValue="0" />
      <input type="number" name="priority" defaultValue="0" />
      <input type="date" name="start_date" />
      <input type="date" name="end_date" />
      <button type="submit" disabled={createItem.isPending}>
        {createItem.isPending ? '생성 중...' : '로드맵 생성'}
      </button>
    </form>
  );
}
```

#### 특징
- **Progress 검증**: 0-100 범위 체크 (mutationFn 내부)
- **자동 캐시 무효화**: 성공 시 `['roadmap-items']` 쿼리 재조회
- **RLS 정책**: Admin 권한 필요

#### 에러 처리
```typescript
try {
  await createItem.mutateAsync(newItem);
} catch (error) {
  if (error.message.includes('Progress must be between 0 and 100')) {
    toast.error('진행률은 0-100 사이여야 합니다.');
  } else if (error.code === '42501') {
    toast.error('권한이 없습니다.');
  } else {
    toast.error(`에러: ${error.message}`);
  }
}
```

---

### useUpdateRoadmapItem()

로드맵을 수정합니다 (Admin 전용).

#### 시그니처
```typescript
type RoadmapItemUpdate = Partial<RoadmapItem>;

function useUpdateRoadmapItem(): UseMutationResult<
  RoadmapItem,
  Error,
  { id: string; updates: RoadmapItemUpdate }
>
```

#### 파라미터
- `id`: `string` - 로드맵 ID
- `updates`: `Partial<RoadmapItem>` - 수정할 필드 (부분 업데이트)

#### 반환값
- `mutate`: `({ id, updates }) => void` - 동기 실행
- `mutateAsync`: `({ id, updates }) => Promise<RoadmapItem>` - 비동기 실행
- `isPending`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `data`: `RoadmapItem | undefined` - 수정된 로드맵

#### 예시
```typescript
import { useUpdateRoadmapItem } from '@/hooks/useRoadmapItems';
import { toast } from 'sonner';

function UpdateProgressSlider({ item }: { item: RoadmapItem }) {
  const updateItem = useUpdateRoadmapItem();

  const handleProgressChange = async (newProgress: number) => {
    // Progress 검증 (0-100)
    if (newProgress < 0 || newProgress > 100) {
      toast.error('Progress must be between 0 and 100');
      return;
    }

    try {
      await updateItem.mutateAsync({
        id: item.id,
        updates: { progress: newProgress },
      });
      toast.success('진행률이 업데이트되었습니다.');
    } catch (error) {
      toast.error(`업데이트 실패: ${error.message}`);
    }
  };

  return (
    <div>
      <label>Progress: {item.progress}%</label>
      <input
        type="range"
        min="0"
        max="100"
        value={item.progress}
        onChange={(e) => handleProgressChange(parseInt(e.target.value, 10))}
        disabled={updateItem.isPending}
      />
    </div>
  );
}
```

#### 특징
- **Progress 검증**: `updates.progress`가 제공되면 0-100 범위 체크
- **자동 캐시 무효화**: 성공 시 `['roadmap-items']`, `['roadmap-items', id]` 쿼리 재조회
- **RLS 정책**: Admin 권한 필요

#### 에러 처리
```typescript
try {
  await updateItem.mutateAsync({ id, updates: { progress: 150 } });
} catch (error) {
  // Progress must be between 0 and 100
  toast.error(error.message);
}
```

---

### useDeleteRoadmapItem()

로드맵을 삭제합니다 (Admin 전용).

#### 시그니처
```typescript
function useDeleteRoadmapItem(): UseMutationResult<string, Error, string>
```

#### 파라미터
- `id`: `string` - 삭제할 로드맵 ID

#### 반환값
- `mutate`: `(id: string) => void` - 동기 실행
- `mutateAsync`: `(id: string) => Promise<string>` - 비동기 실행 (삭제된 ID 반환)
- `isPending`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체

#### 예시
```typescript
import { useDeleteRoadmapItem } from '@/hooks/useRoadmapItems';
import { toast } from 'sonner';

function DeleteButton({ itemId, itemTitle }: { itemId: string; itemTitle: string }) {
  const deleteItem = useDeleteRoadmapItem();

  const handleDelete = async () => {
    if (!confirm(`"${itemTitle}" 로드맵을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteItem.mutateAsync(itemId);
      toast.success('로드맵이 삭제되었습니다.');
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
- **자동 캐시 무효화**: 성공 시 `['roadmap-items']` 쿼리 재조회
- **RLS 정책**: Admin 권한 필요
- **영구 삭제**: 데이터베이스에서 완전히 삭제됨 (복구 불가)

---

## Best Practices

### 1. Progress 검증 패턴

```typescript
import { useUpdateRoadmapItem } from '@/hooks/useRoadmapItems';

function ProgressValidator({ item }: { item: RoadmapItem }) {
  const updateItem = useUpdateRoadmapItem();

  const validateAndUpdate = async (progress: number) => {
    // Client-side validation
    if (progress < 0 || progress > 100) {
      alert('Progress must be between 0 and 100');
      return;
    }

    try {
      // Server-side validation (in mutationFn)
      await updateItem.mutateAsync({ id: item.id, updates: { progress } });
    } catch (error) {
      // Handle server error
      console.error(error.message);
    }
  };

  return <input type="range" min="0" max="100" onChange={(e) => validateAndUpdate(+e.target.value)} />;
}
```

### 2. 상태 전환 플로우

```typescript
import { useUpdateRoadmapItem } from '@/hooks/useRoadmapItems';

function StatusWorkflow({ item }: { item: RoadmapItem }) {
  const updateItem = useUpdateRoadmapItem();

  const nextStatus = {
    planned: 'in-progress',
    'in-progress': 'completed',
    completed: null,
    'on-hold': 'in-progress',
  } as const;

  const handleNext = async () => {
    const next = nextStatus[item.status];
    if (!next) {
      alert('Already completed');
      return;
    }

    await updateItem.mutateAsync({
      id: item.id,
      updates: {
        status: next,
        progress: next === 'completed' ? 100 : item.progress,
      },
    });
  };

  return <button onClick={handleNext}>Next: {nextStatus[item.status]}</button>;
}
```

### 3. 공개/비공개 토글

```typescript
import { useUpdateRoadmapItem } from '@/hooks/useRoadmapItems';

function PublishToggle({ item }: { item: RoadmapItem }) {
  const updateItem = useUpdateRoadmapItem();

  const handleToggle = async () => {
    await updateItem.mutateAsync({
      id: item.id,
      updates: { published: !item.published },
    });
  };

  return (
    <button onClick={handleToggle}>
      {item.published ? 'Unpublish' : 'Publish'}
    </button>
  );
}
```

### 4. 우선순위 정렬

```typescript
import { useRoadmapItems } from '@/hooks/useRoadmapItems';

function PrioritizedRoadmap() {
  const { data: items } = useRoadmapItems();

  // Already sorted by priority DESC, created_at DESC
  const highPriority = items.filter(item => item.priority >= 50);
  const mediumPriority = items.filter(item => item.priority >= 20 && item.priority < 50);
  const lowPriority = items.filter(item => item.priority < 20);

  return (
    <div>
      <h2>High Priority ({highPriority.length})</h2>
      {highPriority.map(item => <div key={item.id}>{item.title}</div>)}

      <h2>Medium Priority ({mediumPriority.length})</h2>
      {mediumPriority.map(item => <div key={item.id}>{item.title}</div>)}

      <h2>Low Priority ({lowPriority.length})</h2>
      {lowPriority.map(item => <div key={item.id}>{item.title}</div>)}
    </div>
  );
}
```

---

## 관련 타입

### RoadmapItem 타입

```typescript
export interface RoadmapItem {
  id: string;
  title: string;
  description?: string;
  category: 'service' | 'platform' | 'internal';
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;          // 0-100 (validated)
  priority: number;          // Sorting order
  start_date?: string;       // YYYY-MM-DD
  end_date?: string;         // YYYY-MM-DD
  tags: string[];
  published: boolean;
  created_by?: string | null; // UUID (FK to admins.user_id)
  created_at: string;        // ISO 8601
  updated_at: string;        // ISO 8601
}
```

---

## 관련 문서

- **[RoadmapItem 타입 정의](../../../types/v2.ts)** - TypeScript 타입
- **[AdminRoadmap 가이드](../admin-roadmap-guide.md)** - 관리자 UI 사용법
- **[Supabase RLS 정책](../../database/rls-policies.md)** - 권한 관리

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2025-11-21 | 1.0.0 | 초기 문서 작성 |

---

**문서 위치**: `docs/guides/cms/api/use-roadmap-items.md`
**작성자**: Claude (AI)
**최종 검토**: 2025-11-21
