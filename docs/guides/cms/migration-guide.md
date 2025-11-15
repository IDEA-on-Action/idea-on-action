# CMS 마이그레이션 실행 가이드

**작성일**: 2025-11-15
**버전**: 1.0
**상태**: Phase 1 (데이터베이스 스키마)

---

## 📋 개요

CMS 관리자 모드 Phase 1의 데이터베이스 스키마를 Supabase에 적용하는 가이드입니다.

---

## ⚠️ 중요 사항

### RLS 정책 순환 참조 문제 해결

**문제**: admins 테이블의 RLS 정책이 자기 자신을 참조하여 "infinite recursion detected" 오류 발생

**해결**: `SECURITY DEFINER` 함수를 사용하여 RLS 우회

- `is_super_admin(user_uuid)` - Super Admin 권한 확인
- `is_admin_user(user_uuid)` - 모든 관리자 권한 확인
- `can_admin_delete(user_uuid)` - 삭제 권한 확인 (Super Admin/Admin만)

---

## 📦 마이그레이션 파일 목록

총 **9개 파일** (순서대로 실행):

### 1단계: Core 테이블 (4개)

1. **20251115170300_create_admins_table_v2.sql** (✅ 필수)
   - admins 테이블 생성
   - is_super_admin() 함수 생성
   - RLS 정책 (무한 재귀 수정)

2. **20251115170301_create_roadmap_items_table.sql**
   - roadmap_items 테이블 생성
   - 5개 인덱스, RLS 정책

3. **20251115170302_create_portfolio_items_table.sql**
   - portfolio_items 테이블 생성
   - 5개 인덱스, RLS 정책

4. **20251115170303_create_lab_items_table.sql**
   - lab_items 테이블 생성
   - 5개 인덱스, RLS 정책

### 2단계: Blog 관련 테이블 (2개)

5. **20251115170304_update_blog_posts_for_cms_v2.sql** (✅ v2 - 안전 버전)
   - 기존 blog_posts 테이블 CMS 호환 업데이트
   - 컬럼 추가 (summary, tags, featured)
   - Helper 함수 추가 (is_blog_post_published)
   - ⚠️ RLS 정책은 step 9에서 추가됨 (무한 재귀 방지)

6. **20251115170306_create_blog_categories_table_v3.sql** (✅ v3 - FK 수정 버전)
   - blog_categories 테이블 생성
   - 2개 인덱스, RLS 정책
   - 기본 카테고리 4개 삽입
   - ⚠️ 기존 blog_posts의 orphan category_id를 NULL로 초기화 (FK 제약 조건 추가 전)

### 3단계: 기타 테이블 (2개)

7. **20251115170305_create_team_members_table.sql**
   - team_members 테이블 생성
   - 3개 인덱스, RLS 정책

8. **20251115170307_create_tags_table.sql**
   - tags 테이블 생성
   - 3개 인덱스, RLS 정책

### 4단계: RLS 정책 업데이트 (1개)

9. **20251115170308_update_cms_rls_policies.sql** (✅ 필수)
   - 모든 CMS 테이블의 RLS 정책을 SECURITY DEFINER 함수 사용으로 변경
   - is_admin_user(), can_admin_delete() 함수 생성
   - blog_posts에 CMS admin RLS 정책 추가 (기존 RBAC 정책과 공존)

---

## 🚀 실행 방법

### 옵션 1: Supabase Dashboard (권장)

1. [Supabase Dashboard](https://app.supabase.com/project/zykjdneewbzyazfukzyg/editor) 접속
2. **SQL Editor** 탭으로 이동
3. 아래 순서대로 각 파일 내용을 복사 → 실행:

#### 1단계: Core 테이블 생성

```sql
-- 1. admins 테이블 (RLS 정책 수정 버전)
-- 파일: 20251115170300_create_admins_table_v2.sql
-- [내용 복사 → 실행]

-- 2. roadmap_items 테이블
-- 파일: 20251115170301_create_roadmap_items_table.sql
-- [내용 복사 → 실행]

-- 3. portfolio_items 테이블
-- 파일: 20251115170302_create_portfolio_items_table.sql
-- [내용 복사 → 실행]

-- 4. lab_items 테이블
-- 파일: 20251115170303_create_lab_items_table.sql
-- [내용 복사 → 실행]
```

#### 2단계: Blog 관련 테이블

```sql
-- 5. blog_posts 업데이트 (v2 - 안전 버전)
-- 파일: 20251115170304_update_blog_posts_for_cms_v2.sql
-- [내용 복사 → 실행]

-- 6. blog_categories 테이블 (v3 - FK 수정 버전)
-- 파일: 20251115170306_create_blog_categories_table_v3.sql
-- [내용 복사 → 실행]
```

#### 3단계: 기타 테이블

```sql
-- 7. team_members 테이블
-- 파일: 20251115170305_create_team_members_table.sql
-- [내용 복사 → 실행]

-- 8. tags 테이블
-- 파일: 20251115170307_create_tags_table.sql
-- [내용 복사 → 실행]
```

#### 4단계: RLS 정책 업데이트

```sql
-- 9. RLS 정책 업데이트 (모든 테이블)
-- 파일: 20251115170308_update_cms_rls_policies.sql
-- [내용 복사 → 실행]
```

### 옵션 2: Supabase CLI (로컬)

```bash
# 1. Supabase 로컬 환경 시작
npx supabase start

# 2. 마이그레이션 적용
npx supabase db push

# 3. 타입 생성
npx supabase gen types typescript --local > src/types/database.types.ts
```

---

## ✅ 검증

### 1. 테이블 생성 확인

```sql
-- 8개 CMS 테이블 확인
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'admins',
    'roadmap_items',
    'portfolio_items',
    'lab_items',
    'blog_posts',
    'team_members',
    'blog_categories',
    'tags'
  )
ORDER BY table_name;
```

**예상 결과**: 8개 테이블 모두 표시

### 2. RLS 정책 확인

```sql
-- admins 테이블 RLS 정책 확인
SELECT policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'admins';
```

**예상 결과**: 4개 정책
- Authenticated users can view admins (SELECT)
- Super admins can insert admins (INSERT)
- Super admins can update admins (UPDATE)
- Super admins can delete admins (DELETE)

### 3. SECURITY DEFINER 함수 확인

```sql
-- Helper 함수 확인
SELECT
  routine_name,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('is_super_admin', 'is_admin_user', 'can_admin_delete');
```

**예상 결과**: 3개 함수, 모두 `DEFINER`

### 4. 테스트 스크립트 실행

```bash
# CMS 테이블 구조 확인
node scripts/check-cms-tables.cjs
```

**예상 결과**: 모든 테이블 `✅ Table exists`

---

## 🔧 Super Admin 초기 설정

마이그레이션 완료 후 **반드시** Super Admin 계정을 생성해야 합니다.

### 1. 사용자 ID 확인

```sql
SELECT id, email
FROM auth.users
WHERE email = 'admin@ideaonaction.local';
```

### 2. Super Admin 추가

```sql
-- 위에서 확인한 ID를 사용
INSERT INTO public.admins (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'super_admin')
ON CONFLICT (user_id) DO NOTHING;
```

### 3. 확인

```sql
SELECT
  a.id,
  a.user_id,
  a.role,
  u.email
FROM public.admins a
JOIN auth.users u ON a.user_id = u.id;
```

---

## 📊 생성된 테이블 요약

| 테이블 | 컬럼 수 | 인덱스 수 | RLS 정책 수 | 용도 |
|--------|---------|-----------|-------------|------|
| admins | 5 | 2 | 4 | 관리자 계정 |
| roadmap_items | 14 | 5 | 4 | 로드맵 아이템 |
| portfolio_items | 24 | 5 | 4 | 포트폴리오 프로젝트 |
| lab_items | 16 | 5 | 4 | 실험실 아이템 |
| blog_posts | 20+ | 6+ | 8+ | 블로그 포스트 (기존 + 확장) |
| team_members | 11 | 3 | 4 | 팀원 정보 |
| blog_categories | 8 | 2 | 4 | 블로그 카테고리 |
| tags | 5 | 3 | 4 | 공통 태그 |

**총계**:
- 테이블: 8개
- 인덱스: 31+개
- RLS 정책: 36+개
- SECURITY DEFINER 함수: 3개

---

## ⚠️ 주의사항

1. **순서 준수**: 마이그레이션 파일은 반드시 번호 순서대로 실행
2. **Super Admin 생성**: 마이그레이션 후 즉시 Super Admin 계정 생성
3. **RLS 정책 테스트**: Super Admin 계정으로 로그인하여 권한 확인
4. **백업**: 프로덕션 환경에서는 사전 백업 필수

---

## 🐛 문제 해결

### "infinite recursion detected" 오류

**원인**: RLS 정책이 자기 자신을 참조

**해결**: `20251115170300_create_admins_table_v2.sql` 실행 (SECURITY DEFINER 함수 사용)

### "permission denied" 오류

**원인**: anon/authenticated 역할에 권한 없음

**해결**: 각 마이그레이션 파일에 `GRANT` 문 포함됨 (자동 해결)

### blog_posts 테이블 충돌

**원인**: 기존 blog_posts 테이블 존재

**해결**: `20251115170304_update_blog_posts_for_cms.sql` 사용 (기존 테이블 확장)

---

## 📚 다음 단계

마이그레이션 완료 후:

1. **CMS-010**: TypeScript 타입 생성
   ```bash
   npx supabase gen types typescript > src/types/database.types.ts
   ```

2. **CMS-011**: Super Admin 계정 생성 (위 가이드 참조)

3. **CMS-012**: useAuth 훅 확장 (isAdmin, adminRole 추가)

4. **Phase 1 다음 작업**: [tasks/cms-backlog.md](../../../tasks/cms-backlog.md) 참조

---

**작성자**: Claude (with Sinclair Seo)
**최종 업데이트**: 2025-11-15
