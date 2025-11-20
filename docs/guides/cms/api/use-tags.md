# useTags API 문서

## 개요

`useTags`는 전역 태그(Global Tags) 관리를 위한 React Query 훅 모음입니다. 블로그 포스트, Roadmap, Portfolio, Lab 등 모든 콘텐츠 타입에 사용되는 태그를 조회, 생성, 수정, 삭제할 수 있으며, 사용 횟수(usage_count) 추적을 지원합니다.

**Import 경로**:
```typescript
import {
  useTags,
  useTag,
  useTagBySlug,
  usePopularTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
  useIncrementTagUsage,
} from '@/hooks/cms/useTags';
```

**관련 타입**: `Tag`, `TagInsert`, `TagUpdate`

---

## 훅 목록

### 1. useTags()

전체 태그 목록을 조회합니다. 사용 횟수(usage_count) 내림차순 → 생성일 내림차순으로 정렬됩니다.

**시그니처**:
```typescript
function useTags(): UseQueryResult<Tag[], Error>
```

**반환값**:
- `data`: `Tag[]` - 태그 배열
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

**예시**:
```typescript
const AdminTagsPage = () => {
  const { data: tags, isLoading, error } = useTags();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h2>전체 태그: {tags?.length}개</h2>
      <TagTable tags={tags} />
    </div>
  );
};
```

**Public 페이지에서 사용**:
```typescript
const TagCloud = () => {
  const { data: tags } = useTags();

  // 사용 횟수에 따라 폰트 크기 조정
  const getFontSize = (usageCount: number) => {
    const min = 12;
    const max = 32;
    const maxUsage = Math.max(...(tags?.map((t) => t.usageCount) || [1]));
    return min + ((usageCount / maxUsage) * (max - min));
  };

  return (
    <div className="tag-cloud">
      {tags?.map((tag) => (
        <Link
          key={tag.id}
          to={`/blog/tag/${tag.slug}`}
          style={{ fontSize: `${getFontSize(tag.usageCount)}px` }}
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
};
```

**캐시 설정**:
- **Query Key**: `['tags']`
- **Stale Time**: 10분 (600,000ms) - 태그는 상대적으로 정적
- **Fallback Value**: `[]` (빈 배열)

---

### 2. useTag(id: string)

ID로 단일 태그를 조회합니다.

**시그니처**:
```typescript
function useTag(id: string): UseQueryResult<Tag | null, Error>
```

**파라미터**:
- `id`: `string` (UUID) - 태그 ID

**반환값**:
- `data`: `Tag | null` - 태그 객체 또는 null
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
const TagDetailPage = ({ id }: { id: string }) => {
  const { data: tag, isLoading } = useTag(id);

  if (isLoading) return <Skeleton />;
  if (!tag) return <NotFound />;

  return (
    <Card>
      <h2>{tag.name}</h2>
      <Badge>{tag.usageCount}개 콘텐츠</Badge>
      <TaggedContent tagId={tag.id} />
    </Card>
  );
};
```

**조건부 활성화**:
```typescript
// ID가 없으면 쿼리 실행 안 함
const { data } = useTag(id); // enabled: !!id (자동)
```

---

### 3. useTagBySlug(slug: string)

Slug로 단일 태그를 조회합니다. URL 라우팅에 적합합니다.

**시그니처**:
```typescript
function useTagBySlug(slug: string): UseQueryResult<Tag | null, Error>
```

**파라미터**:
- `slug`: `string` - 태그 slug (kebab-case)

**반환값**:
- `data`: `Tag | null` - 태그 객체 또는 null
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
import { useParams } from 'react-router-dom';

const BlogTagPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: tag, isLoading } = useTagBySlug(slug!);

  if (isLoading) return <Skeleton />;
  if (!tag) return <NotFound message="태그를 찾을 수 없습니다." />;

  return (
    <div>
      <h1>#{tag.name}</h1>
      <p>{tag.usageCount}개의 콘텐츠</p>
      <BlogPostsByTag tagSlug={tag.slug} />
    </div>
  );
};
```

**SEO 최적화**:
```typescript
// Slug는 항상 소문자, 하이픈으로 구분
const slug = 'react-hooks'; // ✅ Good
const slug = 'React_Hooks'; // ❌ Bad

// React Router 설정
<Route path="/blog/tag/:slug" element={<BlogTagPage />} />
```

---

### 4. usePopularTags(limit?: number)

사용 횟수가 많은 인기 태그를 조회합니다. 기본값은 10개입니다.

**시그니처**:
```typescript
function usePopularTags(limit?: number): UseQueryResult<Tag[], Error>
```

**파라미터**:
- `limit`: `number` (optional, default: 10) - 조회할 태그 개수

**반환값**:
- `data`: `Tag[]` - 인기 태그 배열
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
const PopularTagsSidebar = () => {
  const { data: popularTags, isLoading } = usePopularTags(5); // 상위 5개

  if (isLoading) return <Skeleton />;

  return (
    <aside>
      <h3>인기 태그</h3>
      <ul>
        {popularTags?.map((tag) => (
          <li key={tag.id}>
            <Link to={`/blog/tag/${tag.slug}`}>
              #{tag.name} <Badge>{tag.usageCount}</Badge>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};
```

**다양한 개수 조회**:
```typescript
// Top 3 태그
const { data: top3 } = usePopularTags(3);

// Top 20 태그
const { data: top20 } = usePopularTags(20);

// 기본값 (Top 10)
const { data: top10 } = usePopularTags();
```

**캐시 설정**:
- **Query Key**: `['tags', 'popular', limit]`
- **Stale Time**: 10분
- **Fallback Value**: `[]`

---

### 5. useCreateTag()

새 태그를 생성합니다. (Admin 전용)

**시그니처**:
```typescript
function useCreateTag(): UseMutationResult<Tag, Error, TagInsert>
```

**파라미터** (mutate 함수):
- `tag`: `TagInsert` - 생성할 태그 데이터

**반환값**:
- `mutate`: `(tag: TagInsert) => void` - 생성 함수
- `mutateAsync`: `(tag: TagInsert) => Promise<Tag>` - 비동기 생성 함수
- `isLoading`: `boolean` - 생성 중 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
import { useForm } from 'react-hook-form';

const CreateTagForm = () => {
  const { register, handleSubmit } = useForm<TagInsert>();
  const { mutate, isLoading } = useCreateTag();

  const onSubmit = (data: TagInsert) => {
    mutate(data, {
      onSuccess: (newTag) => {
        toast.success(`${newTag.name} 태그 생성 완료!`);
        navigate('/admin/tags');
      },
      onError: (error) => {
        if (error.message.includes('duplicate')) {
          toast.error('이미 존재하는 태그입니다.');
        } else {
          toast.error(`생성 실패: ${error.message}`);
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('name')} placeholder="태그 이름" required />
      <Input {...register('slug')} placeholder="slug (kebab-case)" required />
      <Input
        {...register('usageCount', { valueAsNumber: true })}
        type="number"
        defaultValue={0}
        placeholder="사용 횟수"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '생성 중...' : '생성'}
      </Button>
    </form>
  );
};
```

**자동 Slug 생성**:
```typescript
import slugify from 'slugify';

const TagForm = () => {
  const { register, setValue, watch } = useForm<TagInsert>();
  const name = watch('name');

  // 이름 변경 시 slug 자동 생성
  useEffect(() => {
    if (name) {
      setValue('slug', slugify(name, { lower: true, strict: true }));
    }
  }, [name, setValue]);

  return (
    <form>
      <Input {...register('name')} placeholder="태그 이름" />
      <Input {...register('slug')} placeholder="slug (자동 생성됨)" />
    </form>
  );
};
```

**Unique 제약**:
```typescript
// name과 slug는 unique 제약이 있음
// DB 레벨에서 중복 검증 (에러 발생)

// ✅ Good
mutate({ name: 'React', slug: 'react', usageCount: 0 });

// ❌ Bad - 이미 존재하는 name
mutate({ name: 'React', slug: 'react-2', usageCount: 0 }); // Error: duplicate key

// ❌ Bad - 이미 존재하는 slug
mutate({ name: 'React Hooks', slug: 'react', usageCount: 0 }); // Error: duplicate key
```

---

### 6. useUpdateTag()

기존 태그를 수정합니다. (Admin 전용)

**시그니처**:
```typescript
function useUpdateTag(): UseMutationResult<
  Tag,
  Error,
  { id: string; updates: TagUpdate }
>
```

**파라미터** (mutate 함수):
- `id`: `string` - 태그 ID
- `updates`: `TagUpdate` - 수정할 필드 (부분 업데이트)

**반환값**:
- `mutate`: `({ id, updates }) => void` - 수정 함수
- `mutateAsync`: `({ id, updates }) => Promise<Tag>` - 비동기 수정 함수
- `isLoading`: `boolean` - 수정 중 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
const EditTagForm = ({ tag }: { tag: Tag }) => {
  const { register, handleSubmit } = useForm<TagUpdate>({
    defaultValues: tag,
  });
  const { mutate, isLoading } = useUpdateTag();

  const onSubmit = (updates: TagUpdate) => {
    mutate(
      { id: tag.id, updates },
      {
        onSuccess: () => {
          toast.success('태그 수정 완료!');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('name')} />
      <Input {...register('slug')} />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '저장 중...' : '저장'}
      </Button>
    </form>
  );
};
```

**부분 업데이트**:
```typescript
// 이름만 변경
mutate({ id: '123', updates: { name: '새 이름' } });

// 여러 필드 동시 변경
mutate({
  id: '123',
  updates: {
    name: '새 이름',
    slug: 'new-slug',
  },
});
```

**주의사항**:
```typescript
// usageCount는 수동으로 수정하지 마세요
// useIncrementTagUsage 훅을 사용하세요

// ❌ Bad - 수동 업데이트
mutate({ id: '123', updates: { usageCount: 10 } });

// ✅ Good - 자동 증가 함수 사용
const { mutate: incrementUsage } = useIncrementTagUsage();
incrementUsage('123');
```

**캐시 무효화**:
```typescript
// 훅이 자동으로 처리하는 캐시 무효화:
// - ['tags'] - 전체 태그 목록
// - ['tags', id] - 해당 태그 상세
// - ['tags', 'slug', slug] - slug로 조회한 캐시
```

---

### 7. useDeleteTag()

태그를 삭제합니다. (Admin 전용)

**시그니처**:
```typescript
function useDeleteTag(): UseMutationResult<string, Error, string>
```

**파라미터** (mutate 함수):
- `id`: `string` - 삭제할 태그 ID

**반환값**:
- `mutate`: `(id: string) => void` - 삭제 함수
- `mutateAsync`: `(id: string) => Promise<string>` - 비동기 삭제 함수
- `isLoading`: `boolean` - 삭제 중 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
const TagTableRow = ({ tag }: { tag: Tag }) => {
  const { mutate: deleteTag, isLoading } = useDeleteTag();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (tag.usageCount > 0) {
      toast.warning(
        `${tag.usageCount}개의 콘텐츠에 사용 중입니다. 정말 삭제하시겠습니까?`
      );
    }

    deleteTag(tag.id, {
      onSuccess: () => {
        toast.success(`${tag.name} 삭제 완료`);
        setShowConfirm(false);
      },
      onError: (error) => {
        toast.error(`삭제 실패: ${error.message}`);
      },
    });
  };

  return (
    <tr>
      <td>#{tag.name}</td>
      <td>
        <UsageBadge count={tag.usageCount} />
      </td>
      <td>
        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              삭제
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>태그 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                #{tag.name}을(를) 삭제하시겠습니까?
                {tag.usageCount > 0 && (
                  <span className="text-yellow-500">
                    경고: {tag.usageCount}개의 콘텐츠에 사용 중입니다.
                  </span>
                )}
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
const { mutateAsync: deleteTag } = useDeleteTag();

const handleBulkDelete = async (ids: string[]) => {
  const confirmMessage = `${ids.length}개의 태그를 삭제하시겠습니까?`;
  if (!window.confirm(confirmMessage)) return;

  try {
    await Promise.all(ids.map((id) => deleteTag(id)));
    toast.success(`${ids.length}개 태그 삭제 완료`);
  } catch (error) {
    toast.error('일부 태그 삭제 실패');
  }
};
```

---

### 8. useIncrementTagUsage()

태그 사용 횟수를 1 증가시킵니다. (내부 사용, Admin 전용)

**시그니처**:
```typescript
function useIncrementTagUsage(): UseMutationResult<Tag, Error, string>
```

**파라미터** (mutate 함수):
- `tagId`: `string` - 태그 ID

**반환값**:
- `mutate`: `(tagId: string) => void` - 증가 함수
- `mutateAsync`: `(tagId: string) => Promise<Tag>` - 비동기 증가 함수
- `isLoading`: `boolean` - 처리 중 상태
- `error`: `Error | null` - 에러 객체

**사용 시나리오**:
블로그 포스트, Roadmap, Portfolio, Lab 등에 태그가 추가될 때 자동으로 호출됩니다.

**예시**:
```typescript
import { useCreateBlogPost, useIncrementTagUsage } from '@/hooks';

const CreateBlogPostForm = () => {
  const { mutate: createPost } = useCreateBlogPost();
  const { mutate: incrementTagUsage } = useIncrementTagUsage();

  const handleSubmit = (data: BlogPostInsert) => {
    // 1. 블로그 포스트 생성
    createPost(data, {
      onSuccess: (newPost) => {
        // 2. 각 태그의 사용 횟수 증가
        newPost.tags.forEach((tagId) => {
          incrementTagUsage(tagId);
        });
        toast.success('포스트 생성 완료!');
      },
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

**Supabase RPC 함수**:
```sql
-- DB 함수 (선택 사항)
CREATE OR REPLACE FUNCTION increment_tag_usage(tag_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE tags
  SET usage_count = usage_count + 1
  WHERE id = tag_id;
END;
$$ LANGUAGE plpgsql;
```

**Fallback 동작**:
```typescript
// RPC 함수가 없으면 자동으로 fallback 로직 실행
// 1. 현재 usage_count 조회
// 2. usage_count + 1 업데이트
// 3. 업데이트된 Tag 반환
```

**캐시 무효화**:
```typescript
// 훅이 자동으로 처리하는 캐시 무효화:
// - ['tags'] - 전체 태그 목록 (정렬 순서 변경될 수 있음)
// - ['tags', tagId] - 해당 태그 상세
// - ['tags', 'popular'] - 인기 태그 목록 (순위 변경될 수 있음)
```

---

## Best Practices

### 1. Slug 자동 생성 및 검증

태그 이름에서 slug를 자동 생성하고, kebab-case 형식을 검증하세요.

```typescript
import slugify from 'slugify';

const generateTagSlug = (name: string): string => {
  return slugify(name, {
    lower: true, // 소문자 변환
    strict: true, // 특수문자 제거
    locale: 'ko', // 한글 지원
  });
};

// 사용 예시
const TagForm = () => {
  const { register, setValue, watch } = useForm<TagInsert>();
  const name = watch('name');

  useEffect(() => {
    if (name) {
      setValue('slug', generateTagSlug(name));
    }
  }, [name, setValue]);

  return (
    <form>
      <Input {...register('name')} placeholder="태그 이름" />
      <Input {...register('slug')} placeholder="slug (자동 생성됨)" readOnly />
    </form>
  );
};
```

### 2. Usage Count 자동 관리

태그 사용 횟수는 수동으로 업데이트하지 말고, `useIncrementTagUsage` 훅을 사용하세요.

```typescript
// ✅ Good - 자동 증가
const { mutate: incrementUsage } = useIncrementTagUsage();
tags.forEach((tagId) => incrementUsage(tagId));

// ❌ Bad - 수동 업데이트
const { mutate: updateTag } = useUpdateTag();
updateTag({ id: tagId, updates: { usageCount: tag.usageCount + 1 } });
```

### 3. 중복 태그 방지

태그 생성 전에 이미 존재하는지 확인하세요.

```typescript
const { data: existingTags } = useTags();

const findExistingTag = (name: string): Tag | undefined => {
  return existingTags?.find(
    (tag) => tag.name.toLowerCase() === name.toLowerCase()
  );
};

const handleCreateTag = (name: string) => {
  const existing = findExistingTag(name);
  if (existing) {
    toast.error('이미 존재하는 태그입니다.');
    return;
  }

  mutate({ name, slug: generateTagSlug(name), usageCount: 0 });
};
```

### 4. Usage Badge 표시

태그 사용 횟수에 따라 다른 스타일을 적용하세요.

```typescript
const UsageBadge = ({ count }: { count: number }) => {
  const getVariant = () => {
    if (count === 0) return 'secondary';
    if (count < 10) return 'default';
    return 'success';
  };

  const getLabel = () => {
    if (count === 0) return '미사용';
    if (count < 10) return `${count}회`;
    return `${count}회+`;
  };

  return <Badge variant={getVariant()}>{getLabel()}</Badge>;
};
```

### 5. 태그 검색 기능

태그 이름으로 검색할 수 있는 기능을 추가하세요.

```typescript
const TagSearchInput = () => {
  const { data: allTags } = useTags();
  const [search, setSearch] = useState('');

  const filteredTags = useMemo(() => {
    if (!search) return allTags;
    return allTags?.filter((tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [allTags, search]);

  return (
    <div>
      <Input
        type="search"
        placeholder="태그 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <TagList tags={filteredTags} />
    </div>
  );
};
```

---

## 관련 타입

### Tag

```typescript
interface Tag {
  id: string; // UUID
  name: string; // unique
  slug: string; // unique, kebab-case
  usageCount: number; // cached count (default: 0)
  createdAt: string; // ISO 8601
}
```

### TagInsert

```typescript
type TagInsert = Omit<Tag, 'id' | 'createdAt'>;
```

### TagUpdate

```typescript
type TagUpdate = Partial<Omit<Tag, 'id' | 'createdAt'>>;
```

---

## 추가 리소스

- [React Query 공식 문서](https://tanstack.com/query/latest)
- [Supabase RPC 함수 가이드](https://supabase.com/docs/guides/database/functions)
- [Admin Tags 페이지 가이드](../admin-tags-guide.md)
- [CMS TypeScript 타입 정의](../../../types/cms.types.ts)
