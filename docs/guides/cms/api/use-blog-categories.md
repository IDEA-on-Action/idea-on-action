# useBlogCategories API 문서

## 개요

`useBlogCategories`는 블로그 카테고리 관리를 위한 React Query 훅 모음입니다. 블로그 포스트를 분류하는 카테고리를 조회, 생성, 수정, 삭제할 수 있으며, 색상(color)과 아이콘(icon) 커스터마이징을 지원합니다.

**Import 경로**:
```typescript
import {
  useBlogCategories,
  useBlogCategory,
  useBlogCategoryBySlug,
  useCreateBlogCategory,
  useUpdateBlogCategory,
  useDeleteBlogCategory,
  useUpdateCategoryPostCount,
} from '@/hooks/cms/useBlogCategories';
```

**관련 타입**: `BlogCategory`, `BlogCategoryInsert`, `BlogCategoryUpdate`

---

## 훅 목록

### 1. useBlogCategories()

전체 블로그 카테고리 목록을 조회합니다. 이름(name) 기준 오름차순으로 정렬됩니다.

**시그니처**:
```typescript
function useBlogCategories(): UseQueryResult<BlogCategory[], Error>
```

**반환값**:
- `data`: `BlogCategory[]` - 카테고리 배열
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

**예시**:
```typescript
const AdminBlogCategoriesPage = () => {
  const { data: categories, isLoading, error } = useBlogCategories();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h2>블로그 카테고리: {categories?.length}개</h2>
      <CategoryTable categories={categories} />
    </div>
  );
};
```

**Public 페이지에서 사용**:
```typescript
const BlogCategoryFilter = () => {
  const { data: categories } = useBlogCategories();

  return (
    <nav className="category-nav">
      {categories?.map((category) => (
        <Link
          key={category.id}
          to={`/blog/category/${category.slug}`}
          style={{ color: category.color }}
        >
          <Icon name={category.icon} />
          {category.name} ({category.postCount})
        </Link>
      ))}
    </nav>
  );
};
```

**캐시 설정**:
- **Query Key**: `['blog_categories']`
- **Stale Time**: 10분 (600,000ms) - 카테고리는 상대적으로 정적
- **Fallback Value**: `[]` (빈 배열)

---

### 2. useBlogCategory(id: string)

ID로 단일 블로그 카테고리를 조회합니다.

**시그니처**:
```typescript
function useBlogCategory(id: string): UseQueryResult<BlogCategory | null, Error>
```

**파라미터**:
- `id`: `string` (UUID) - 카테고리 ID

**반환값**:
- `data`: `BlogCategory | null` - 카테고리 객체 또는 null
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
const EditCategoryModal = ({ categoryId }: { categoryId: string }) => {
  const { data: category, isLoading } = useBlogCategory(categoryId);

  if (isLoading) return <Skeleton />;
  if (!category) return <NotFound />;

  return (
    <EditCategoryForm
      category={category}
      onSubmit={(updates) => updateCategory({ id: categoryId, updates })}
    />
  );
};
```

**조건부 활성화**:
```typescript
// ID가 없으면 쿼리 실행 안 함
const { data } = useBlogCategory(id); // enabled: !!id (자동)
```

---

### 3. useBlogCategoryBySlug(slug: string)

Slug로 단일 블로그 카테고리를 조회합니다. URL 라우팅에 적합합니다.

**시그니처**:
```typescript
function useBlogCategoryBySlug(slug: string): UseQueryResult<BlogCategory | null, Error>
```

**파라미터**:
- `slug`: `string` - 카테고리 slug (kebab-case)

**반환값**:
- `data`: `BlogCategory | null` - 카테고리 객체 또는 null
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
import { useParams } from 'react-router-dom';

const BlogCategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: category, isLoading } = useBlogCategoryBySlug(slug!);

  if (isLoading) return <Skeleton />;
  if (!category) return <NotFound message="카테고리를 찾을 수 없습니다." />;

  return (
    <div>
      <CategoryHeader
        name={category.name}
        description={category.description}
        color={category.color}
        icon={category.icon}
        postCount={category.postCount}
      />
      <BlogPostsInCategory categoryId={category.id} />
    </div>
  );
};
```

**SEO 최적화**:
```typescript
// Slug는 항상 소문자, 하이픈으로 구분
const slug = 'web-development'; // ✅ Good
const slug = 'Web_Development'; // ❌ Bad

// React Router 설정
<Route path="/blog/category/:slug" element={<BlogCategoryPage />} />
```

---

### 4. useCreateBlogCategory()

새 블로그 카테고리를 생성합니다. (Admin 전용)

**시그니처**:
```typescript
function useCreateBlogCategory(): UseMutationResult<BlogCategory, Error, BlogCategoryInsert>
```

**파라미터** (mutate 함수):
- `category`: `BlogCategoryInsert` - 생성할 카테고리 데이터

**반환값**:
- `mutate`: `(category: BlogCategoryInsert) => void` - 생성 함수
- `mutateAsync`: `(category: BlogCategoryInsert) => Promise<BlogCategory>` - 비동기 생성 함수
- `isLoading`: `boolean` - 생성 중 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
import { useForm } from 'react-hook-form';

const CreateCategoryForm = () => {
  const { register, handleSubmit } = useForm<BlogCategoryInsert>();
  const { mutate, isLoading } = useCreateBlogCategory();

  const onSubmit = (data: BlogCategoryInsert) => {
    mutate(data, {
      onSuccess: (newCategory) => {
        toast.success(`${newCategory.name} 카테고리 생성 완료!`);
        navigate('/admin/blog/categories');
      },
      onError: (error) => {
        toast.error(`생성 실패: ${error.message}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('name')} placeholder="카테고리 이름" required />
      <Input {...register('slug')} placeholder="slug (kebab-case)" required />
      <Textarea {...register('description')} placeholder="설명" />
      <Input
        {...register('color')}
        type="color"
        defaultValue="#3b82f6"
        placeholder="색상 (#RRGGBB)"
      />
      <Input {...register('icon')} placeholder="아이콘 이름" defaultValue="folder" />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '생성 중...' : '생성'}
      </Button>
    </form>
  );
};
```

**Color Picker 통합**:
```typescript
import { useState } from 'react';

const CategoryFormWithColorPicker = () => {
  const [color, setColor] = useState('#3b82f6');
  const { mutate } = useCreateBlogCategory();

  const handleSubmit = (data: BlogCategoryInsert) => {
    mutate({
      ...data,
      color, // 선택한 색상 추가
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <ColorPicker value={color} onChange={setColor} />
      {/* ... 나머지 필드 */}
    </form>
  );
};
```

**Color 검증**:
```typescript
// 훅 내부에서 자동 검증
// Hex color code (#RRGGBB) 형식만 허용
// 예시: #3b82f6 (파란색), #ef4444 (빨간색)

// ✅ Valid
mutate({ name: 'Tech', slug: 'tech', color: '#3b82f6' });

// ❌ Invalid - 에러 발생
mutate({ name: 'Tech', slug: 'tech', color: 'blue' }); // Error: Invalid hex color code
mutate({ name: 'Tech', slug: 'tech', color: '#3b82f' }); // Error: Expected format: #RRGGBB
```

---

### 5. useUpdateBlogCategory()

기존 블로그 카테고리를 수정합니다. (Admin 전용)

**시그니처**:
```typescript
function useUpdateBlogCategory(): UseMutationResult<
  BlogCategory,
  Error,
  { id: string; updates: BlogCategoryUpdate }
>
```

**파라미터** (mutate 함수):
- `id`: `string` - 카테고리 ID
- `updates`: `BlogCategoryUpdate` - 수정할 필드 (부분 업데이트)

**반환값**:
- `mutate`: `({ id, updates }) => void` - 수정 함수
- `mutateAsync`: `({ id, updates }) => Promise<BlogCategory>` - 비동기 수정 함수
- `isLoading`: `boolean` - 수정 중 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
const EditCategoryForm = ({ category }: { category: BlogCategory }) => {
  const { register, handleSubmit } = useForm<BlogCategoryUpdate>({
    defaultValues: category,
  });
  const { mutate, isLoading } = useUpdateBlogCategory();

  const onSubmit = (updates: BlogCategoryUpdate) => {
    mutate(
      { id: category.id, updates },
      {
        onSuccess: () => {
          toast.success('카테고리 수정 완료!');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('name')} />
      <Input {...register('slug')} />
      <Textarea {...register('description')} />
      <Input {...register('color')} type="color" />
      <Input {...register('icon')} />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '저장 중...' : '저장'}
      </Button>
    </form>
  );
};
```

**부분 업데이트**:
```typescript
// 색상만 변경
mutate({ id: '123', updates: { color: '#ef4444' } });

// 여러 필드 동시 변경
mutate({
  id: '123',
  updates: {
    name: '새 이름',
    description: '새 설명',
    icon: 'book',
  },
});
```

**캐시 무효화**:
```typescript
// 훅이 자동으로 처리하는 캐시 무효화:
// - ['blog_categories'] - 전체 카테고리 목록
// - ['blog_categories', id] - 해당 카테고리 상세
// - ['blog_categories', 'slug', slug] - slug로 조회한 캐시
```

---

### 6. useDeleteBlogCategory()

블로그 카테고리를 삭제합니다. (Admin 전용)

**시그니처**:
```typescript
function useDeleteBlogCategory(): UseMutationResult<string, Error, string>
```

**파라미터** (mutate 함수):
- `id`: `string` - 삭제할 카테고리 ID

**반환값**:
- `mutate`: `(id: string) => void` - 삭제 함수
- `mutateAsync`: `(id: string) => Promise<string>` - 비동기 삭제 함수
- `isLoading`: `boolean` - 삭제 중 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
const CategoryTableRow = ({ category }: { category: BlogCategory }) => {
  const { mutate: deleteCategory, isLoading } = useDeleteBlogCategory();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (category.postCount > 0) {
      toast.error(`${category.postCount}개의 포스트가 연결되어 있습니다. 먼저 포스트를 이동하세요.`);
      return;
    }

    deleteCategory(category.id, {
      onSuccess: () => {
        toast.success(`${category.name} 삭제 완료`);
        setShowConfirm(false);
      },
      onError: (error) => {
        toast.error(`삭제 실패: ${error.message}`);
      },
    });
  };

  return (
    <tr>
      <td>
        <Badge style={{ backgroundColor: category.color }}>
          <Icon name={category.icon} />
          {category.name}
        </Badge>
      </td>
      <td>{category.postCount}개 포스트</td>
      <td>
        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              삭제
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>카테고리 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                {category.name}을(를) 삭제하시겠습니까?
                {category.postCount > 0 && (
                  <span className="text-red-500">
                    경고: {category.postCount}개의 포스트가 연결되어 있습니다.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isLoading || category.postCount > 0}
              >
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

**삭제 전 검증**:
```typescript
const safeDeleteCategory = (category: BlogCategory) => {
  const { mutateAsync } = useDeleteBlogCategory();

  // 1. 포스트 개수 확인
  if (category.postCount > 0) {
    throw new Error(`${category.postCount}개의 포스트가 연결되어 있습니다.`);
  }

  // 2. 확인 후 삭제
  return mutateAsync(category.id);
};
```

---

### 7. useUpdateCategoryPostCount()

카테고리의 포스트 개수를 업데이트합니다. (내부 사용, Admin 전용)

**시그니처**:
```typescript
function useUpdateCategoryPostCount(): UseMutationResult<
  BlogCategory,
  Error,
  { id: string; count: number }
>
```

**파라미터** (mutate 함수):
- `id`: `string` - 카테고리 ID
- `count`: `number` - 새 포스트 개수

**반환값**:
- `mutate`: `({ id, count }) => void` - 업데이트 함수
- `mutateAsync`: `({ id, count }) => Promise<BlogCategory>` - 비동기 업데이트 함수
- `isLoading`: `boolean` - 처리 중 상태
- `error`: `Error | null` - 에러 객체

**사용 시나리오**:
블로그 포스트가 생성/삭제될 때 카테고리의 `post_count` 필드를 동기화합니다.

**예시**:
```typescript
import { useCreateBlogPost, useUpdateCategoryPostCount } from '@/hooks';

const CreateBlogPostForm = () => {
  const { mutate: createPost } = useCreateBlogPost();
  const { mutate: updateCount } = useUpdateCategoryPostCount();

  const handleSubmit = (data: BlogPostInsert) => {
    // 1. 포스트 생성
    createPost(data, {
      onSuccess: (newPost) => {
        // 2. 카테고리 포스트 개수 증가
        updateCount({
          id: newPost.categoryId,
          count: currentCategory.postCount + 1,
        });
        toast.success('포스트 생성 완료!');
      },
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

**자동 동기화 (권장)**:
```typescript
// Supabase Trigger를 사용하여 자동 동기화 (DB 레벨)
// CREATE TRIGGER update_category_post_count
// AFTER INSERT OR DELETE ON blog_posts
// FOR EACH ROW EXECUTE FUNCTION sync_category_post_count();

// 이 훅은 수동 동기화가 필요할 때만 사용
```

**캐시 무효화**:
```typescript
// 훅이 자동으로 처리하는 캐시 무효화:
// - ['blog_categories'] - 전체 카테고리 목록
// - ['blog_categories', id] - 해당 카테고리 상세
```

---

## Best Practices

### 1. Color 검증 및 기본값

Hex color code 형식을 항상 검증하고, 기본값을 제공하세요.

```typescript
// ✅ Good - 기본값 제공
const createCategory = (name: string) => {
  mutate({
    name,
    slug: kebabCase(name),
    color: '#3b82f6', // 기본 파란색
    icon: 'folder', // 기본 아이콘
  });
};

// ✅ Good - 색상 검증
const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};

// ❌ Bad - 검증 없이 사용
mutate({ name: 'Tech', slug: 'tech', color: 'blue' }); // 에러 발생
```

### 2. Icon 선택 UI

Lucide Icons 목록을 제공하여 사용자가 선택할 수 있게 하세요.

```typescript
import * as LucideIcons from 'lucide-react';

const IconPicker = ({ value, onChange }) => {
  const iconNames = Object.keys(LucideIcons).filter(
    (key) => !key.startsWith('Lucide') && typeof LucideIcons[key] === 'function'
  );

  return (
    <Select value={value} onValueChange={onChange}>
      {iconNames.map((iconName) => {
        const Icon = LucideIcons[iconName];
        return (
          <SelectItem key={iconName} value={iconName}>
            <Icon size={16} /> {iconName}
          </SelectItem>
        );
      })}
    </Select>
  );
};
```

### 3. Post Count 동기화

카테고리 삭제 전 포스트 개수를 확인하세요.

```typescript
const safeDeleteCategory = (category: BlogCategory) => {
  if (category.postCount > 0) {
    toast.error(
      `이 카테고리에 ${category.postCount}개의 포스트가 있습니다. 먼저 포스트를 다른 카테고리로 이동하세요.`
    );
    return;
  }

  mutate(category.id);
};
```

### 4. Slug 자동 생성

카테고리 이름에서 slug를 자동 생성하세요.

```typescript
import slugify from 'slugify';

const generateSlug = (name: string): string => {
  return slugify(name, {
    lower: true, // 소문자 변환
    strict: true, // 특수문자 제거
    locale: 'ko', // 한글 지원
  });
};

// 사용 예시
const onNameChange = (name: string) => {
  setValue('slug', generateSlug(name)); // React Hook Form
};
```

### 5. Color Theme 일관성

카테고리 색상을 프로젝트의 색상 팔레트와 일치시키세요.

```typescript
const COLOR_PRESETS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
];

const ColorPresetPicker = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-6 gap-2">
      {COLOR_PRESETS.map((preset) => (
        <button
          key={preset.value}
          className="w-8 h-8 rounded-full border-2"
          style={{ backgroundColor: preset.value }}
          onClick={() => onSelect(preset.value)}
          title={preset.name}
        />
      ))}
    </div>
  );
};
```

---

## 관련 타입

### BlogCategory

```typescript
interface BlogCategory {
  id: string; // UUID
  name: string;
  slug: string; // unique, kebab-case
  description: string | null;
  color: string; // hex color code (default: #3b82f6)
  icon: string; // icon name (default: folder)
  postCount: number; // cached count
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### BlogCategoryInsert

```typescript
type BlogCategoryInsert = Omit<BlogCategory, 'id' | 'createdAt' | 'updatedAt'>;
```

### BlogCategoryUpdate

```typescript
type BlogCategoryUpdate = Partial<Omit<BlogCategory, 'id' | 'createdAt' | 'updatedAt'>>;
```

---

## 추가 리소스

- [React Query 공식 문서](https://tanstack.com/query/latest)
- [Lucide Icons](https://lucide.dev/icons/) - 아이콘 목록
- [Admin Blog Categories 페이지 가이드](../admin-blog-categories-guide.md)
- [CMS TypeScript 타입 정의](../../../types/cms.types.ts)
