# useLabItems API 문서

## 개요

`useLabItems`는 실험실(Lab) 아이템 관리를 위한 React Query 훅 모음입니다. 바운티, 실험, 아이디어 등 커뮤니티 참여형 콘텐츠를 조회, 생성, 수정, 삭제할 수 있습니다.

**Import 경로**:
```typescript
import {
  useLabItems,
  useLabItem,
  useLabItemBySlug,
  useLabItemsByCategory,
  useLabItemsByStatus,
  usePublishedLabItems,
  useCreateLabItem,
  useUpdateLabItem,
  useDeleteLabItem,
} from '@/hooks/cms/useLabItems';
```

**관련 타입**: `LabItem`, `LabItemInsert`, `LabItemUpdate`, `LabCategory`, `LabStatus`

---

## 훅 목록

### 1. useLabItems()

전체 Lab 아이템 목록을 조회합니다. 생성일 기준 내림차순 정렬됩니다.

**시그니처**:
```typescript
function useLabItems(): UseQueryResult<LabItem[], Error>
```

**반환값**:
- `data`: `LabItem[]` - Lab 아이템 배열
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

**예시**:
```typescript
const AdminLab = () => {
  const { data: labItems, isLoading, error } = useLabItems();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h2>전체 Lab 아이템: {labItems?.length}개</h2>
      <LabTable items={labItems} />
    </div>
  );
};
```

**에러 처리**:
```typescript
const { data, error } = useLabItems();

if (error) {
  if (error.message.includes('permission denied')) {
    return <AccessDenied />;
  }
  return <ErrorAlert message={error.message} />;
}
```

**캐시 설정**:
- **Query Key**: `['lab_items']`
- **Stale Time**: 5분 (300,000ms)
- **Fallback Value**: `[]` (빈 배열)

---

### 2. useLabItem(id: string)

ID로 단일 Lab 아이템을 조회합니다.

**시그니처**:
```typescript
function useLabItem(id: string): UseQueryResult<LabItem | null, Error>
```

**파라미터**:
- `id`: `string` (UUID) - Lab 아이템 ID

**반환값**:
- `data`: `LabItem | null` - Lab 아이템 객체 또는 null
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
const LabDetailPage = ({ id }: { id: string }) => {
  const { data: labItem, isLoading, error } = useLabItem(id);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!labItem) return <NotFound />;

  return (
    <LabDetail
      title={labItem.title}
      description={labItem.description}
      status={labItem.status}
      techStack={labItem.techStack}
    />
  );
};
```

**조건부 활성화**:
```typescript
// ID가 없으면 쿼리 실행 안 함
const { data } = useLabItem(id); // enabled: !!id (자동)

// 수동 제어
const { data } = useLabItem(id, { enabled: !!id && isAdmin });
```

---

### 3. useLabItemBySlug(slug: string)

Slug로 단일 Lab 아이템을 조회합니다. URL 라우팅에 적합합니다.

**시그니처**:
```typescript
function useLabItemBySlug(slug: string): UseQueryResult<LabItem | null, Error>
```

**파라미터**:
- `slug`: `string` - Lab 아이템 slug (kebab-case)

**반환값**:
- `data`: `LabItem | null` - Lab 아이템 객체 또는 null
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
import { useParams } from 'react-router-dom';

const LabDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: labItem, isLoading } = useLabItemBySlug(slug!);

  if (isLoading) return <Skeleton />;
  if (!labItem) return <NotFound message="Lab 아이템을 찾을 수 없습니다." />;

  return (
    <div>
      <h1>{labItem.title}</h1>
      <p>{labItem.subtitle}</p>
      <MarkdownRenderer content={labItem.content || ''} />
    </div>
  );
};
```

**SEO 최적화**:
```typescript
// Slug는 항상 소문자, 하이픈으로 구분
const slug = 'ai-chatbot-bounty'; // ✅ Good
const slug = 'AI_Chatbot_Bounty'; // ❌ Bad

// React Router 설정
<Route path="/lab/:slug" element={<LabDetailPage />} />
```

---

### 4. useLabItemsByCategory(category?: LabCategory)

카테고리별 Lab 아이템을 조회합니다.

**시그니처**:
```typescript
function useLabItemsByCategory(
  category?: LabCategory
): UseQueryResult<LabItem[], Error>
```

**파라미터**:
- `category`: `LabCategory | undefined` - 카테고리 필터
  - `'experiment'` - 실험
  - `'idea'` - 아이디어
  - `'community'` - 커뮤니티
  - `'research'` - 연구
  - `undefined` - 전체 (카테고리 필터 없음)

**반환값**:
- `data`: `LabItem[]` - Lab 아이템 배열
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
const LabCategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<LabCategory>('experiment');
  const { data: labItems, isLoading } = useLabItemsByCategory(selectedCategory);

  return (
    <div>
      <CategoryFilter value={selectedCategory} onChange={setSelectedCategory} />
      {isLoading ? (
        <SkeletonGrid count={6} />
      ) : (
        <LabGrid items={labItems} />
      )}
    </div>
  );
};
```

**카테고리 필터 UI**:
```typescript
const CategoryFilter = ({ value, onChange }) => {
  const categories: LabCategory[] = ['experiment', 'idea', 'community', 'research'];

  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList>
        <TabsTrigger value={undefined}>전체</TabsTrigger>
        {categories.map((cat) => (
          <TabsTrigger key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
```

---

### 5. useLabItemsByStatus(status?: LabStatus)

상태별 Lab 아이템을 조회합니다.

**시그니처**:
```typescript
function useLabItemsByStatus(
  status?: LabStatus
): UseQueryResult<LabItem[], Error>
```

**파라미터**:
- `status`: `LabStatus | undefined` - 상태 필터
  - `'exploring'` - 탐색 중
  - `'developing'` - 개발 중
  - `'testing'` - 테스트 중
  - `'completed'` - 완료
  - `'archived'` - 보관됨
  - `undefined` - 전체

**반환값**:
- `data`: `LabItem[]` - Lab 아이템 배열
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
const AdminLabStatusBoard = () => {
  const statuses: LabStatus[] = ['exploring', 'developing', 'testing', 'completed'];

  return (
    <div className="grid grid-cols-4 gap-4">
      {statuses.map((status) => (
        <StatusColumn key={status} status={status} />
      ))}
    </div>
  );
};

const StatusColumn = ({ status }: { status: LabStatus }) => {
  const { data: labItems } = useLabItemsByStatus(status);

  return (
    <div className="border rounded-lg p-4">
      <h3>{status}: {labItems?.length}개</h3>
      <LabList items={labItems || []} />
    </div>
  );
};
```

**Kanban 보드 스타일**:
```typescript
// Drag & Drop 통합 예시
const [activeStatus, setActiveStatus] = useState<LabStatus>('exploring');
const { mutate: updateLabItem } = useUpdateLabItem();

const handleDrop = (itemId: string, newStatus: LabStatus) => {
  updateLabItem({
    id: itemId,
    updates: { status: newStatus },
  });
};
```

---

### 6. usePublishedLabItems()

공개된(published=true) Lab 아이템만 조회합니다. 퍼블릭 페이지용입니다.

**시그니처**:
```typescript
function usePublishedLabItems(): UseQueryResult<LabItem[], Error>
```

**반환값**:
- `data`: `LabItem[]` - 공개된 Lab 아이템 배열
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
// Public Lab 페이지 (비로그인 사용자도 접근 가능)
const PublicLabPage = () => {
  const { data: labItems, isLoading } = usePublishedLabItems();

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1>🧪 실험실</h1>
      <p>진행 중인 바운티와 실험 프로젝트를 확인하세요.</p>
      <LabGrid items={labItems || []} />
    </div>
  );
};
```

**Draft vs Published 분리**:
```typescript
const AdminLabPage = () => {
  const { data: allItems } = useLabItems(); // 전체 (Admin)
  const { data: publishedItems } = usePublishedLabItems(); // 공개된 것만

  const draftItems = allItems?.filter((item) => !item.published) || [];

  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">전체 ({allItems?.length})</TabsTrigger>
        <TabsTrigger value="published">공개 ({publishedItems?.length})</TabsTrigger>
        <TabsTrigger value="draft">비공개 ({draftItems.length})</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
```

---

### 7. useCreateLabItem()

새 Lab 아이템을 생성합니다. (Admin 전용)

**시그니처**:
```typescript
function useCreateLabItem(): UseMutationResult<LabItem, Error, LabItemInsert>
```

**파라미터** (mutate 함수):
- `item`: `LabItemInsert` - 생성할 Lab 아이템 데이터

**반환값**:
- `mutate`: `(item: LabItemInsert) => void` - 생성 함수
- `mutateAsync`: `(item: LabItemInsert) => Promise<LabItem>` - 비동기 생성 함수
- `isLoading`: `boolean` - 생성 중 상태
- `isSuccess`: `boolean` - 성공 여부
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
import { useForm } from 'react-hook-form';

const CreateLabForm = () => {
  const { register, handleSubmit } = useForm<LabItemInsert>();
  const { mutate, isLoading } = useCreateLabItem();

  const onSubmit = (data: LabItemInsert) => {
    mutate(data, {
      onSuccess: (newItem) => {
        toast.success(`${newItem.title} 생성 완료!`);
        navigate(`/admin/lab/${newItem.id}`);
      },
      onError: (error) => {
        toast.error(`생성 실패: ${error.message}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('title')} placeholder="제목" />
      <Textarea {...register('description')} placeholder="설명" />
      <Select {...register('category')}>
        <option value="experiment">실험</option>
        <option value="idea">아이디어</option>
      </Select>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '생성 중...' : '생성'}
      </Button>
    </form>
  );
};
```

**Async/Await 패턴**:
```typescript
const { mutateAsync } = useCreateLabItem();

const handleCreate = async (data: LabItemInsert) => {
  try {
    const newItem = await mutateAsync(data);
    console.log('생성된 아이템:', newItem);
    navigate(`/admin/lab/${newItem.id}`);
  } catch (error) {
    console.error('생성 실패:', error);
    toast.error('생성 중 오류가 발생했습니다.');
  }
};
```

---

### 8. useUpdateLabItem()

기존 Lab 아이템을 수정합니다. (Admin 전용)

**시그니처**:
```typescript
function useUpdateLabItem(): UseMutationResult<
  LabItem,
  Error,
  { id: string; updates: LabItemUpdate }
>
```

**파라미터** (mutate 함수):
- `id`: `string` - Lab 아이템 ID
- `updates`: `LabItemUpdate` - 수정할 필드 (부분 업데이트)

**반환값**:
- `mutate`: `({ id, updates }) => void` - 수정 함수
- `mutateAsync`: `({ id, updates }) => Promise<LabItem>` - 비동기 수정 함수
- `isLoading`: `boolean` - 수정 중 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
const EditLabForm = ({ labItem }: { labItem: LabItem }) => {
  const { register, handleSubmit } = useForm<LabItemUpdate>({
    defaultValues: labItem,
  });
  const { mutate, isLoading } = useUpdateLabItem();

  const onSubmit = (updates: LabItemUpdate) => {
    mutate(
      { id: labItem.id, updates },
      {
        onSuccess: (updated) => {
          toast.success('수정 완료!');
          queryClient.invalidateQueries(['lab_items', labItem.id]);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('title')} />
      <Textarea {...register('description')} />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '저장 중...' : '저장'}
      </Button>
    </form>
  );
};
```

**부분 업데이트**:
```typescript
// Status만 변경
mutate({ id: '123', updates: { status: 'completed' } });

// 여러 필드 동시 변경
mutate({
  id: '123',
  updates: {
    title: '새 제목',
    description: '새 설명',
    published: true,
  },
});
```

**캐시 무효화**:
```typescript
// 훅이 자동으로 처리하는 캐시 무효화:
// - ['lab_items'] - 전체 목록
// - ['lab_items', id] - 해당 아이템 상세
// - ['lab_items', 'slug', slug] - slug로 조회한 캐시
```

---

### 9. useDeleteLabItem()

Lab 아이템을 삭제합니다. (Admin 전용)

**시그니처**:
```typescript
function useDeleteLabItem(): UseMutationResult<string, Error, string>
```

**파라미터** (mutate 함수):
- `id`: `string` - 삭제할 Lab 아이템 ID

**반환값**:
- `mutate`: `(id: string) => void` - 삭제 함수
- `mutateAsync`: `(id: string) => Promise<string>` - 비동기 삭제 함수
- `isLoading`: `boolean` - 삭제 중 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
const LabTableRow = ({ labItem }: { labItem: LabItem }) => {
  const { mutate: deleteLabItem, isLoading } = useDeleteLabItem();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    deleteLabItem(labItem.id, {
      onSuccess: () => {
        toast.success(`${labItem.title} 삭제 완료`);
        setShowConfirm(false);
      },
      onError: (error) => {
        toast.error(`삭제 실패: ${error.message}`);
      },
    });
  };

  return (
    <tr>
      <td>{labItem.title}</td>
      <td>
        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              삭제
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                {labItem.title}을(를) 삭제하면 복구할 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
                {isLoading ? '삭제 중...' : '삭제'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  );
};
```

**Bulk Delete (일괄 삭제)**:
```typescript
const { mutateAsync: deleteLabItem } = useDeleteLabItem();

const handleBulkDelete = async (ids: string[]) => {
  try {
    await Promise.all(ids.map((id) => deleteLabItem(id)));
    toast.success(`${ids.length}개 아이템 삭제 완료`);
  } catch (error) {
    toast.error('일부 아이템 삭제 실패');
  }
};
```

---

## Best Practices

### 1. 조건부 쿼리 활성화

ID나 slug가 없을 때 쿼리 실행을 방지하세요.

```typescript
// ✅ Good - 자동 활성화 제어
const { data } = useLabItem(id); // enabled: !!id (자동)

// ✅ Good - 수동 활성화 제어
const { data } = useLabItem(id, { enabled: !!id && isAdmin });

// ❌ Bad - 항상 실행됨
const { data } = useLabItem(undefined); // 불필요한 쿼리
```

### 2. 에러 처리

모든 쿼리와 뮤테이션에 에러 처리를 추가하세요.

```typescript
// ✅ Good - 에러 UI 표시
const { data, error } = useLabItems();
if (error) return <ErrorMessage error={error} />;

// ✅ Good - 뮤테이션 에러 처리
mutate(data, {
  onError: (error) => {
    toast.error(error.message);
  },
});
```

### 3. 로딩 상태 UI

로딩 중에는 스켈레톤이나 스피너를 표시하세요.

```typescript
// ✅ Good - 로딩 UI
const { data, isLoading } = useLabItems();
if (isLoading) return <SkeletonGrid count={6} />;

// ❌ Bad - 로딩 상태 무시
const { data } = useLabItems();
return <LabGrid items={data} />; // data가 undefined일 수 있음
```

### 4. Optimistic Update

사용자 경험 향상을 위해 낙관적 업데이트를 사용하세요.

```typescript
const { mutate: updateLabItem } = useUpdateLabItem();
const queryClient = useQueryClient();

mutate(
  { id, updates },
  {
    onMutate: async ({ id, updates }) => {
      // 이전 캐시 저장
      await queryClient.cancelQueries(['lab_items', id]);
      const previousData = queryClient.getQueryData(['lab_items', id]);

      // 낙관적 업데이트
      queryClient.setQueryData(['lab_items', id], (old: LabItem) => ({
        ...old,
        ...updates,
      }));

      return { previousData };
    },
    onError: (err, variables, context) => {
      // 롤백
      queryClient.setQueryData(['lab_items', id], context.previousData);
    },
  }
);
```

### 5. Contributor 필드 관리

Contributors는 문자열 배열이므로 추가/제거 로직을 별도로 구현하세요.

```typescript
const addContributor = (labItem: LabItem, newContributor: string) => {
  const { mutate } = useUpdateLabItem();

  mutate({
    id: labItem.id,
    updates: {
      contributors: [...labItem.contributors, newContributor],
    },
  });
};

const removeContributor = (labItem: LabItem, contributorToRemove: string) => {
  const { mutate } = useUpdateLabItem();

  mutate({
    id: labItem.id,
    updates: {
      contributors: labItem.contributors.filter((c) => c !== contributorToRemove),
    },
  });
};
```

---

## 관련 타입

### LabItem

```typescript
interface LabItem {
  id: string; // UUID
  slug: string; // unique, kebab-case
  title: string;
  subtitle: string | null;
  description: string;
  content: string | null; // Markdown
  category: LabCategory;
  status: LabStatus;
  techStack: string[]; // 기술 스택
  githubUrl: string | null;
  demoUrl: string | null;
  contributors: string[]; // 기여자 배열
  startDate: string | null; // YYYY-MM-DD
  tags: string[];
  published: boolean;
  createdBy: string | null; // UUID (admins.user_id)
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### LabCategory

```typescript
type LabCategory = 'experiment' | 'idea' | 'community' | 'research';
```

### LabStatus

```typescript
type LabStatus = 'exploring' | 'developing' | 'testing' | 'completed' | 'archived';
```

### LabItemInsert

```typescript
type LabItemInsert = Omit<LabItem, 'id' | 'createdAt' | 'updatedAt'>;
```

### LabItemUpdate

```typescript
type LabItemUpdate = Partial<Omit<LabItem, 'id' | 'createdAt' | 'updatedAt'>>;
```

---

## 추가 리소스

- [React Query 공식 문서](https://tanstack.com/query/latest)
- [Supabase RLS 정책 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [Admin Lab 페이지 가이드](../admin-lab-guide.md)
- [CMS TypeScript 타입 정의](../../../types/cms.types.ts)
