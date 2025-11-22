# Newsletter 프로덕션 마이그레이션 가이드

**프로젝트**: IDEA on Action Newsletter System
**버전**: v2.3.4
**작성일**: 2025-11-22
**상태**: Production Ready

---

## 목차

1. [개요](#개요)
2. [사전 요구사항](#사전-요구사항)
3. [마이그레이션 파일 목록](#마이그레이션-파일-목록)
4. [마이그레이션 순서](#마이그레이션-순서)
5. [각 마이그레이션 상세 설명](#각-마이그레이션-상세-설명)
6. [검증 방법](#검증-방법)
7. [롤백 절차](#롤백-절차)
8. [문제 해결](#문제-해결)
9. [체크리스트](#체크리스트)

---

## 개요

Newsletter 시스템은 다음 기능을 제공합니다:

- 뉴스레터 구독/구독취소 기능
- 관리자용 구독자 조회 및 CSV 내보내기
- 날짜 범위 필터링
- 보안 강화 (RLS, SECURITY INVOKER, search_path)

### 보안 점수

- **현재**: 98/100
- **개선사항**: 67개 함수 SQL Injection 방어 (search_path 설정)

---

## 사전 요구사항

### 필수 조건

- [ ] Supabase 프로젝트 접근 권한 (Admin)
- [ ] PostgreSQL 클라이언트 또는 Supabase SQL Editor
- [ ] 백업 완료 확인
- [ ] 의존 테이블 존재 확인 (`user_profiles`, `user_roles`, `roles`)

### 의존성 확인 SQL

```sql
-- 의존 테이블 존재 확인
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('user_profiles', 'user_roles', 'roles', 'newsletter_subscriptions');

-- 기대 결과: 4개 테이블 (newsletter_subscriptions는 아직 없을 수 있음)
```

### 필수 컬럼 확인

```sql
-- user_profiles 테이블에 newsletter 관련 컬럼 확인
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
  AND column_name IN ('newsletter_subscribed', 'newsletter_email', 'newsletter_subscribed_at');

-- 기대 결과: 3개 컬럼
-- 없으면 user_profiles 테이블 마이그레이션 먼저 실행 필요
```

---

## 마이그레이션 파일 목록

| 순서 | 파일명 | 설명 | 중요도 |
|------|--------|------|--------|
| 1 | `20250109000008_create_newsletter.sql` | Newsletter 테이블 생성 | 필수 |
| 2 | `20251121000000_fix_newsletter_security_issues.sql` | 보안 이슈 수정 v1 | 선택* |
| 3 | `20251121000001_fix_newsletter_security_issues_v2.sql` | 보안 이슈 수정 v2 | 필수 |
| 4 | `20251121000002_alternative_newsletter_view_security.sql` | 뷰 대체 함수 | 권장 |
| 5 | `20251122000000_fix_function_search_path.sql` | Newsletter 함수 search_path | 필수 |
| 6 | `20251122000001_fix_critical_functions_search_path.sql` | 전체 함수 search_path | 필수 |

> *`20251121000000`은 `20251121000001`로 대체되므로 건너뛰어도 됨

---

## 마이그레이션 순서

### 권장 순서 (신규 프로덕션)

1. `20250109000008_create_newsletter.sql`
2. `20251121000001_fix_newsletter_security_issues_v2.sql`
3. `20251121000002_alternative_newsletter_view_security.sql`
4. `20251122000000_fix_function_search_path.sql`
5. `20251122000001_fix_critical_functions_search_path.sql`

### 기존 프로덕션 업데이트

이미 Newsletter 테이블이 있는 경우:

1. `20251121000001_fix_newsletter_security_issues_v2.sql`
2. `20251121000002_alternative_newsletter_view_security.sql`
3. `20251122000000_fix_function_search_path.sql`
4. `20251122000001_fix_critical_functions_search_path.sql`

---

## 각 마이그레이션 상세 설명

### 1. `20250109000008_create_newsletter.sql`

**목적**: Newsletter 구독자 테이블 생성

**생성 항목**:
- `newsletter_subscriptions` 테이블
- 인덱스 (email, status, subscribed_at)
- RLS 정책 (admin_read, public_insert, owner_update)

**스키마**:
```sql
CREATE TABLE public.newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, confirmed, unsubscribed
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  preferences JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}'
);
```

**RLS 정책**:
| 정책명 | 대상 | 동작 |
|--------|------|------|
| `newsletter_admin_read` | authenticated | 관리자만 전체 조회 |
| `newsletter_public_insert` | anon, authenticated | 누구나 구독 가능 |
| `newsletter_owner_update` | authenticated | 본인만 업데이트 |

---

### 2. `20251121000001_fix_newsletter_security_issues_v2.sql`

**목적**: 보안 이슈 수정 (Critical/High)

**수정 내용**:
1. `newsletter_subscribers` 뷰 재생성 (auth.users 노출 제거)
2. `subscribe_to_newsletter` 함수 - SECURITY INVOKER로 변경
3. `unsubscribe_from_newsletter` 함수 - SECURITY INVOKER로 변경
4. `get_newsletter_subscribers` 함수 - 관리자 전용

**생성 함수**:
| 함수명 | 권한 | 설명 |
|--------|------|------|
| `subscribe_to_newsletter(TEXT)` | authenticated | 구독 신청 |
| `unsubscribe_from_newsletter()` | authenticated | 구독 취소 |
| `get_newsletter_subscribers()` | admin only | 구독자 목록 조회 |

**보안 개선**:
- SECURITY DEFINER -> SECURITY INVOKER
- auth.users 직접 접근 제거
- 역할 기반 권한 검사 (user_roles + roles)

---

### 3. `20251121000002_alternative_newsletter_view_security.sql`

**목적**: 뷰를 함수로 대체 (추가 보안)

**생성 항목**:
- `get_newsletter_subscribers_view()` 함수

**사용 시나리오**:
```sql
-- 기존 뷰 대신 함수 사용
SELECT * FROM get_newsletter_subscribers_view();
```

---

### 4. `20251122000000_fix_function_search_path.sql`

**목적**: Newsletter 함수 SQL Injection 방어

**수정 함수** (3개):
- `subscribe_to_newsletter(TEXT)`
- `unsubscribe_from_newsletter()`
- `get_newsletter_subscribers()`

**추가 설정**:
```sql
SET search_path = public, pg_temp
```

---

### 5. `20251122000001_fix_critical_functions_search_path.sql`

**목적**: 전체 시스템 함수 보안 강화

**수정 함수** (72개):
- 인증/보안 함수: 9개
- 분석/비즈니스 함수: 10개
- 구독/결제 함수: 3개
- 활동 로깅 함수: 3개
- 미디어/유틸리티 함수: 2개
- 트리거 함수: 45개

---

## 검증 방법

### 1. 테이블 생성 확인

```sql
-- newsletter_subscriptions 테이블 확인
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'newsletter_subscriptions'
ORDER BY ordinal_position;

-- 기대 결과: 8개 컬럼
-- id, email, status, subscribed_at, confirmed_at, unsubscribed_at, preferences, metadata
```

### 2. RLS 정책 확인

```sql
-- RLS 정책 확인
SELECT
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'newsletter_subscriptions'
ORDER BY policyname;

-- 기대 결과: 3개 정책
-- newsletter_admin_read, newsletter_owner_update, newsletter_public_insert
```

### 3. 함수 생성 확인

```sql
-- Newsletter 함수 확인
SELECT
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  CASE
    WHEN p.prosecdef THEN 'DEFINER'
    ELSE 'INVOKER'
  END as security_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN (
    'subscribe_to_newsletter',
    'unsubscribe_from_newsletter',
    'get_newsletter_subscribers',
    'get_newsletter_subscribers_view'
  )
ORDER BY p.proname;

-- 기대 결과: 4개 함수, 모두 INVOKER
```

### 4. search_path 보안 확인

```sql
-- Newsletter 함수 search_path 확인
SELECT
  p.proname as function_name,
  CASE
    WHEN p.proconfig IS NULL THEN 'NOT SET'
    WHEN 'search_path=public, pg_temp' = ANY(p.proconfig) THEN 'SECURE'
    ELSE 'OTHER: ' || array_to_string(p.proconfig, ', ')
  END as search_path_status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN (
    'subscribe_to_newsletter',
    'unsubscribe_from_newsletter',
    'get_newsletter_subscribers'
  )
ORDER BY p.proname;

-- 기대 결과: 모두 SECURE
```

### 5. 전체 보안 점수 확인

```sql
-- search_path 없는 함수 개수 확인 (낮을수록 좋음)
SELECT
  COUNT(*) as total_functions,
  SUM(CASE WHEN p.proconfig IS NULL THEN 1 ELSE 0 END) as without_search_path,
  SUM(CASE WHEN 'search_path=public, pg_temp' = ANY(p.proconfig) THEN 1 ELSE 0 END) as secure_functions
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.prokind = 'f';

-- 기대 결과: without_search_path가 0에 가까울수록 좋음
```

### 6. 기능 테스트

```sql
-- 1. 구독 테스트 (인증된 사용자로)
SELECT subscribe_to_newsletter('test@example.com');

-- 2. 구독자 조회 (관리자로)
SELECT * FROM get_newsletter_subscribers();

-- 3. 구독 취소 테스트
SELECT unsubscribe_from_newsletter();
```

---

## 롤백 절차

### 긴급 롤백 (전체)

```sql
-- 1. 함수 삭제
DROP FUNCTION IF EXISTS subscribe_to_newsletter(TEXT);
DROP FUNCTION IF EXISTS unsubscribe_from_newsletter();
DROP FUNCTION IF EXISTS get_newsletter_subscribers();
DROP FUNCTION IF EXISTS get_newsletter_subscribers_view();

-- 2. 뷰 삭제
DROP VIEW IF EXISTS newsletter_subscribers;

-- 3. RLS 정책 삭제
DROP POLICY IF EXISTS "newsletter_admin_read" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "newsletter_public_insert" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "newsletter_owner_update" ON newsletter_subscriptions;

-- 4. 테이블 삭제 (주의: 데이터 손실)
-- DROP TABLE IF EXISTS newsletter_subscriptions;
```

### 부분 롤백 (search_path만)

```sql
-- search_path 설정 제거 (원래대로)
ALTER FUNCTION subscribe_to_newsletter(TEXT) RESET search_path;
ALTER FUNCTION unsubscribe_from_newsletter() RESET search_path;
ALTER FUNCTION get_newsletter_subscribers() RESET search_path;
```

### 데이터 백업

```sql
-- 롤백 전 데이터 백업
CREATE TABLE newsletter_subscriptions_backup AS
SELECT * FROM newsletter_subscriptions;

-- 복원
INSERT INTO newsletter_subscriptions
SELECT * FROM newsletter_subscriptions_backup;
```

---

## 문제 해결

### 오류 1: "user_profiles table does not exist"

**원인**: user_profiles 테이블이 아직 생성되지 않음

**해결**:
```sql
-- user_profiles 테이블 마이그레이션 먼저 실행
-- 또는 수동 생성:
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  newsletter_subscribed BOOLEAN DEFAULT false,
  newsletter_email TEXT,
  newsletter_subscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

### 오류 2: "User must be authenticated"

**원인**: 익명 사용자가 함수 호출 시도

**해결**: 인증된 사용자로 로그인 후 재시도

### 오류 3: "Only admins can access"

**원인**: 관리자가 아닌 사용자가 구독자 목록 조회 시도

**해결**:
```sql
-- 사용자에게 관리자 역할 부여
INSERT INTO user_roles (user_id, role_id)
SELECT
  'USER_UUID_HERE',
  r.id
FROM roles r
WHERE r.name = 'admin';
```

### 오류 4: "permission denied for function"

**원인**: 함수 실행 권한 없음

**해결**:
```sql
-- 권한 재부여
GRANT EXECUTE ON FUNCTION subscribe_to_newsletter(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION unsubscribe_from_newsletter() TO authenticated;
GRANT EXECUTE ON FUNCTION get_newsletter_subscribers() TO authenticated;
```

### 오류 5: "policy already exists"

**원인**: 정책이 이미 존재함

**해결**:
```sql
-- 기존 정책 삭제 후 재생성
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

---

## 체크리스트

### 마이그레이션 전

- [ ] 데이터베이스 백업 완료
- [ ] 의존 테이블 존재 확인 (user_profiles, user_roles, roles)
- [ ] 마이그레이션 파일 순서 확인
- [ ] 롤백 계획 수립

### 마이그레이션 중

- [ ] Step 1: `20250109000008_create_newsletter.sql` 실행
- [ ] Step 2: `20251121000001_fix_newsletter_security_issues_v2.sql` 실행
- [ ] Step 3: `20251121000002_alternative_newsletter_view_security.sql` 실행
- [ ] Step 4: `20251122000000_fix_function_search_path.sql` 실행
- [ ] Step 5: `20251122000001_fix_critical_functions_search_path.sql` 실행

### 마이그레이션 후

- [ ] 테이블 생성 확인
- [ ] RLS 정책 확인
- [ ] 함수 생성 확인
- [ ] search_path 보안 확인
- [ ] 기능 테스트 (구독, 조회, 취소)
- [ ] Supabase Security Advisor 재검사

### 프로덕션 배포

- [ ] 스테이징 환경 테스트 완료
- [ ] 프로덕션 적용
- [ ] 모니터링 확인
- [ ] 사용자 테스트

---

## 참고 문서

### 관련 가이드

- [CSV Export 구현 요약](./csv-export-implementation-summary.md)
- [날짜 필터 통합 가이드](./date-filter-integration.md)
- [빌드 검증 보고서](./build-verification-report-v2.3.4.md)
- [작업 요약](./WORK_SUMMARY.md)

### CMS 가이드

- [Admin Newsletter 가이드](../cms/admin-newsletter-guide.md)

### 외부 참고

- [Supabase RLS 문서](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL 함수 보안](https://www.postgresql.org/docs/current/sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY)

---

**작성자**: Claude Code
**검토일**: 2025-11-22
**다음 검토**: 마이그레이션 적용 후
