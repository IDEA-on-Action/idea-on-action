# useTeamMembers API 문서

## 개요

`useTeamMembers`는 팀원(Team Members) 관리를 위한 React Query 훅 모음입니다. About 페이지에 표시되는 팀원 정보를 조회, 생성, 수정, 삭제할 수 있으며, 우선순위(priority) 기반 정렬을 지원합니다.

**Import 경로**:
```typescript
import {
  useTeamMembers,
  useTeamMember,
  useActiveTeamMembers,
  useCreateTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember,
  useToggleTeamMemberActive,
} from '@/hooks/useTeamMembers';
```

**관련 타입**: `TeamMember`, `TeamMemberInsert`, `TeamMemberUpdate`, `TeamMemberSocialLinks`

---

## 훅 목록

### 1. useTeamMembers()

전체 팀원 목록을 조회합니다. 우선순위(priority) 내림차순 → 생성일 내림차순으로 정렬됩니다.

**시그니처**:
```typescript
function useTeamMembers(): UseQueryResult<TeamMember[], Error>
```

**반환값**:
- `data`: `TeamMember[]` - 팀원 배열
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체
- `refetch`: `() => void` - 데이터 재조회 함수

**예시**:
```typescript
const AdminTeamPage = () => {
  const { data: teamMembers, isLoading, error } = useTeamMembers();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h2>전체 팀원: {teamMembers?.length}명</h2>
      <TeamTable members={teamMembers} />
    </div>
  );
};
```

**우선순위 정렬**:
```typescript
// DB 쿼리 순서:
// 1. ORDER BY priority DESC (높은 우선순위가 먼저)
// 2. ORDER BY created_at DESC (최신 생성이 먼저)

// 예시 결과:
// [
//   { name: 'Alice', priority: 100, created_at: '2023-01-01' },
//   { name: 'Bob', priority: 90, created_at: '2023-01-02' },
//   { name: 'Charlie', priority: 90, created_at: '2023-01-01' }, // 같은 priority면 created_at 우선
// ]
```

**캐시 설정**:
- **Query Key**: `['team-members']`
- **Stale Time**: 5분 (300,000ms)
- **Fallback Value**: `[]` (빈 배열)

---

### 2. useTeamMember(id: string)

ID로 단일 팀원을 조회합니다.

**시그니처**:
```typescript
function useTeamMember(id: string): UseQueryResult<TeamMember | null, Error>
```

**파라미터**:
- `id`: `string` (UUID) - 팀원 ID

**반환값**:
- `data`: `TeamMember | null` - 팀원 객체 또는 null
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
const TeamMemberDetailPage = ({ id }: { id: string }) => {
  const { data: member, isLoading, error } = useTeamMember(id);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!member) return <NotFound />;

  return (
    <Card>
      <Avatar src={member.avatar} alt={member.name} />
      <h2>{member.name}</h2>
      <p>{member.role}</p>
      <p>{member.bio}</p>
      <SocialLinks links={member.socialLinks} />
      <SkillBadges skills={member.skills} />
    </Card>
  );
};
```

**조건부 활성화**:
```typescript
// ID가 없으면 쿼리 실행 안 함
const { data } = useTeamMember(id); // enabled: !!id (자동)

// 수동 제어
const { data } = useTeamMember(id, { enabled: !!id && isAdmin });
```

---

### 3. useActiveTeamMembers()

활성(active=true) 팀원만 조회합니다. 퍼블릭 About 페이지용입니다.

**시그니처**:
```typescript
function useActiveTeamMembers(): UseQueryResult<TeamMember[], Error>
```

**반환값**:
- `data`: `TeamMember[]` - 활성 팀원 배열
- `isLoading`: `boolean` - 로딩 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
// Public About 페이지 (비로그인 사용자도 접근 가능)
const AboutPage = () => {
  const { data: teamMembers, isLoading } = useActiveTeamMembers();

  if (isLoading) return <Spinner />;

  return (
    <section className="team-section">
      <h2>우리 팀</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teamMembers?.map((member) => (
          <TeamCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
};
```

**Active vs Inactive 분리**:
```typescript
const AdminTeamPage = () => {
  const { data: allMembers } = useTeamMembers(); // 전체 (Admin)
  const { data: activeMembers } = useActiveTeamMembers(); // 활성만

  const inactiveMembers = allMembers?.filter((m) => !m.active) || [];

  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">전체 ({allMembers?.length})</TabsTrigger>
        <TabsTrigger value="active">활성 ({activeMembers?.length})</TabsTrigger>
        <TabsTrigger value="inactive">비활성 ({inactiveMembers.length})</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
```

**캐시 설정**:
- **Query Key**: `['team-members', 'active']`
- **Stale Time**: 5분
- **Fallback Value**: `[]`

---

### 4. useCreateTeamMember()

새 팀원을 생성합니다. (Admin 전용)

**시그니처**:
```typescript
function useCreateTeamMember(): UseMutationResult<TeamMember, Error, TeamMemberInsert>
```

**파라미터** (mutate 함수):
- `member`: `TeamMemberInsert` - 생성할 팀원 데이터

**반환값**:
- `mutate`: `(member: TeamMemberInsert) => void` - 생성 함수
- `mutateAsync`: `(member: TeamMemberInsert) => Promise<TeamMember>` - 비동기 생성 함수
- `isLoading`: `boolean` - 생성 중 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
import { useForm } from 'react-hook-form';

const CreateTeamMemberForm = () => {
  const { register, handleSubmit } = useForm<TeamMemberInsert>();
  const { mutate, isLoading } = useCreateTeamMember();

  const onSubmit = (data: TeamMemberInsert) => {
    mutate(data, {
      onSuccess: (newMember) => {
        toast.success(`${newMember.name} 추가 완료!`);
        navigate('/admin/team');
      },
      onError: (error) => {
        toast.error(`추가 실패: ${error.message}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('name')} placeholder="이름" required />
      <Input {...register('role')} placeholder="직책" required />
      <Textarea {...register('bio')} placeholder="소개" />
      <Input {...register('avatar')} placeholder="아바타 URL" />
      <Input {...register('email')} type="email" placeholder="이메일" />
      <Input {...register('priority', { valueAsNumber: true })} type="number" placeholder="우선순위" />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '추가 중...' : '추가'}
      </Button>
    </form>
  );
};
```

**Social Links 입력**:
```typescript
const TeamMemberForm = () => {
  const { register, handleSubmit } = useForm<TeamMemberInsert>();

  const onSubmit = (data: TeamMemberInsert) => {
    // socialLinks를 JSONB 객체로 변환
    const teamMember: TeamMemberInsert = {
      ...data,
      socialLinks: {
        github: data.github || undefined,
        linkedin: data.linkedin || undefined,
        twitter: data.twitter || undefined,
        website: data.website || undefined,
      },
    };

    mutate(teamMember);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3>소셜 링크</h3>
      <Input {...register('github')} placeholder="GitHub URL" />
      <Input {...register('linkedin')} placeholder="LinkedIn URL" />
      <Input {...register('twitter')} placeholder="Twitter URL" />
      <Input {...register('website')} placeholder="Website URL" />
    </form>
  );
};
```

---

### 5. useUpdateTeamMember()

기존 팀원 정보를 수정합니다. (Admin 전용)

**시그니처**:
```typescript
function useUpdateTeamMember(): UseMutationResult<
  TeamMember,
  Error,
  { id: string; updates: TeamMemberUpdate }
>
```

**파라미터** (mutate 함수):
- `id`: `string` - 팀원 ID
- `updates`: `TeamMemberUpdate` - 수정할 필드 (부분 업데이트)

**반환값**:
- `mutate`: `({ id, updates }) => void` - 수정 함수
- `mutateAsync`: `({ id, updates }) => Promise<TeamMember>` - 비동기 수정 함수
- `isLoading`: `boolean` - 수정 중 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
const EditTeamMemberForm = ({ member }: { member: TeamMember }) => {
  const { register, handleSubmit } = useForm<TeamMemberUpdate>({
    defaultValues: member,
  });
  const { mutate, isLoading } = useUpdateTeamMember();

  const onSubmit = (updates: TeamMemberUpdate) => {
    mutate(
      { id: member.id, updates },
      {
        onSuccess: () => {
          toast.success('수정 완료!');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('name')} />
      <Input {...register('role')} />
      <Textarea {...register('bio')} />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '저장 중...' : '저장'}
      </Button>
    </form>
  );
};
```

**부분 업데이트**:
```typescript
// 우선순위만 변경
mutate({ id: '123', updates: { priority: 100 } });

// 여러 필드 동시 변경
mutate({
  id: '123',
  updates: {
    name: '새 이름',
    role: '새 직책',
    active: true,
  },
});
```

**캐시 무효화**:
```typescript
// 훅이 자동으로 처리하는 캐시 무효화:
// - ['team-members'] - 전체 목록
// - ['team-members', id] - 해당 팀원 상세
```

---

### 6. useDeleteTeamMember()

팀원을 삭제합니다. (Admin 전용)

**시그니처**:
```typescript
function useDeleteTeamMember(): UseMutationResult<string, Error, string>
```

**파라미터** (mutate 함수):
- `id`: `string` - 삭제할 팀원 ID

**반환값**:
- `mutate`: `(id: string) => void` - 삭제 함수
- `mutateAsync`: `(id: string) => Promise<string>` - 비동기 삭제 함수
- `isLoading`: `boolean` - 삭제 중 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
const TeamTableRow = ({ member }: { member: TeamMember }) => {
  const { mutate: deleteMember, isLoading } = useDeleteTeamMember();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    deleteMember(member.id, {
      onSuccess: () => {
        toast.success(`${member.name} 삭제 완료`);
        setShowConfirm(false);
      },
      onError: (error) => {
        toast.error(`삭제 실패: ${error.message}`);
      },
    });
  };

  return (
    <tr>
      <td>{member.name}</td>
      <td>{member.role}</td>
      <td>
        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              삭제
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>팀원 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                {member.name}을(를) 삭제하시겠습니까? 이 작업은 복구할 수 없습니다.
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

---

### 7. useToggleTeamMemberActive()

팀원의 활성 상태를 토글합니다. (Admin 전용)

**시그니처**:
```typescript
function useToggleTeamMemberActive(): UseMutationResult<
  TeamMember,
  Error,
  { id: string; active: boolean }
>
```

**파라미터** (mutate 함수):
- `id`: `string` - 팀원 ID
- `active`: `boolean` - 새 활성 상태

**반환값**:
- `mutate`: `({ id, active }) => void` - 토글 함수
- `mutateAsync`: `({ id, active }) => Promise<TeamMember>` - 비동기 토글 함수
- `isLoading`: `boolean` - 처리 중 상태
- `error`: `Error | null` - 에러 객체

**예시**:
```typescript
const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  const { mutate: toggleActive, isLoading } = useToggleTeamMemberActive();

  const handleToggle = () => {
    toggleActive(
      { id: member.id, active: !member.active },
      {
        onSuccess: (updated) => {
          toast.success(
            updated.active
              ? `${updated.name}을(를) 활성화했습니다.`
              : `${updated.name}을(를) 비활성화했습니다.`
          );
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <h3>{member.name}</h3>
        <Badge variant={member.active ? 'success' : 'secondary'}>
          {member.active ? '활성' : '비활성'}
        </Badge>
      </CardHeader>
      <CardContent>
        <Switch
          checked={member.active}
          onCheckedChange={handleToggle}
          disabled={isLoading}
        />
      </CardContent>
    </Card>
  );
};
```

**Bulk Toggle (일괄 토글)**:
```typescript
const { mutateAsync: toggleActive } = useToggleTeamMemberActive();

const handleBulkActivate = async (ids: string[]) => {
  try {
    await Promise.all(ids.map((id) => toggleActive({ id, active: true })));
    toast.success(`${ids.length}명 활성화 완료`);
  } catch (error) {
    toast.error('일부 팀원 활성화 실패');
  }
};
```

**캐시 무효화**:
```typescript
// 훅이 자동으로 처리하는 캐시 무효화:
// - ['team-members'] - 전체 목록
// - ['team-members', id] - 해당 팀원 상세
// - ['team-members', 'active'] - 활성 팀원 목록
```

---

## Best Practices

### 1. Priority 기반 정렬

우선순위(priority)를 활용하여 팀원 순서를 제어하세요.

```typescript
// ✅ Good - 우선순위 명시
const teamMember: TeamMemberInsert = {
  name: 'Alice',
  role: 'CEO',
  priority: 100, // 가장 먼저 표시
};

// ✅ Good - 동적 우선순위 조정
const moveMemberToTop = (member: TeamMember) => {
  const { mutate } = useUpdateTeamMember();
  mutate({ id: member.id, updates: { priority: 100 } });
};
```

### 2. Social Links 검증

소셜 링크 URL이 유효한지 검증하세요.

```typescript
const validateSocialLinks = (links: TeamMemberSocialLinks): boolean => {
  const urlRegex = /^https?:\/\/.+/;

  if (links.github && !urlRegex.test(links.github)) return false;
  if (links.linkedin && !urlRegex.test(links.linkedin)) return false;
  if (links.twitter && !urlRegex.test(links.twitter)) return false;
  if (links.website && !urlRegex.test(links.website)) return false;

  return true;
};

// 사용 예시
const onSubmit = (data: TeamMemberInsert) => {
  if (!validateSocialLinks(data.socialLinks)) {
    toast.error('유효하지 않은 URL이 있습니다.');
    return;
  }
  mutate(data);
};
```

### 3. Avatar 업로드

아바타 이미지를 Supabase Storage에 업로드하세요.

```typescript
import { supabase } from '@/integrations/supabase/client';

const uploadAvatar = async (file: File, memberId: string): Promise<string> => {
  const fileName = `${memberId}-${Date.now()}.${file.name.split('.').pop()}`;
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file);

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
};

// 사용 예시
const handleAvatarUpload = async (file: File, memberId: string) => {
  const avatarUrl = await uploadAvatar(file, memberId);
  mutate({ id: memberId, updates: { avatar: avatarUrl } });
};
```

### 4. Skills 배열 관리

Skills는 문자열 배열이므로 추가/제거 로직을 별도로 구현하세요.

```typescript
const addSkill = (member: TeamMember, newSkill: string) => {
  const { mutate } = useUpdateTeamMember();

  mutate({
    id: member.id,
    updates: {
      skills: [...member.skills, newSkill],
    },
  });
};

const removeSkill = (member: TeamMember, skillToRemove: string) => {
  const { mutate } = useUpdateTeamMember();

  mutate({
    id: member.id,
    updates: {
      skills: member.skills.filter((s) => s !== skillToRemove),
    },
  });
};
```

### 5. Active/Inactive 필터링

Admin 페이지에서는 Active/Inactive를 명확히 구분하세요.

```typescript
const AdminTeamPage = () => {
  const { data: allMembers } = useTeamMembers();
  const { data: activeMembers } = useActiveTeamMembers();

  const inactiveMembers = useMemo(
    () => allMembers?.filter((m) => !m.active) || [],
    [allMembers]
  );

  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">
          전체 <Badge>{allMembers?.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="active">
          활성 <Badge variant="success">{activeMembers?.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="inactive">
          비활성 <Badge variant="secondary">{inactiveMembers.length}</Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
```

---

## 관련 타입

### TeamMember

```typescript
interface TeamMember {
  id: string; // UUID
  name: string;
  role: string;
  bio: string | null;
  avatar: string | null; // 아바타 URL
  email: string | null;
  skills: string[]; // 기술 스택
  socialLinks: TeamMemberSocialLinks; // JSONB
  priority: number; // 표시 순서 (높을수록 먼저)
  active: boolean; // 활성 상태
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### TeamMemberSocialLinks

```typescript
interface TeamMemberSocialLinks {
  github?: string; // GitHub URL
  linkedin?: string; // LinkedIn URL
  twitter?: string; // Twitter URL
  website?: string; // 개인 웹사이트 URL
}
```

### TeamMemberInsert

```typescript
type TeamMemberInsert = Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>;
```

### TeamMemberUpdate

```typescript
type TeamMemberUpdate = Partial<Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>>;
```

---

## 추가 리소스

- [React Query 공식 문서](https://tanstack.com/query/latest)
- [Supabase Storage 가이드](https://supabase.com/docs/guides/storage)
- [Admin Team 페이지 가이드](../admin-team-guide.md)
- [CMS TypeScript 타입 정의](../../../types/cms.types.ts)
