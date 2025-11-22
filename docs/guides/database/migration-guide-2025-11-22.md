# 2025-11-22 마이그레이션 가이드

> Supabase Dashboard SQL Editor를 통한 마이그레이션 적용 가이드

## 개요

이 가이드는 2025년 11월 22일자 마이그레이션을 Supabase Dashboard에서 안전하게 적용하는 방법을 설명합니다.

### 포함된 마이그레이션

| 파일명 | 설명 | 우선순위 |
|--------|------|----------|
| `20251122000000_fix_function_search_path.sql` | Newsletter 함수 Search Path 보안 | 높음 |
| `20251122000001_fix_critical_functions_search_path.sql` | 67개 함수 Search Path 보안 | 높음 |
| `20251122000001_rename_compass_to_minu.sql` | Compass -> Minu 브랜드 전환 | 중간 |
| `20251122100000_create_media_library_table.sql` | Media Library 테이블 생성 | 중간 |

### 영향 범위 요약

- **보안 강화 함수**: 70개
  - Newsletter 함수: 3개
  - 인증/보안 함수: 9개
  - 분석/비즈니스 함수: 10개
  - 구독/결제 함수: 3개
  - Activity 함수: 5개
  - 트리거 함수: 40개
- **데이터 변경**: services, subscription_plans 테이블
- **신규 생성**: minu_integration_view, media_library 테이블

---

## 적용 전 준비사항

### 1. 백업 확인

```sql
-- Supabase Dashboard > Settings > Database > Backups
-- Point-in-time Recovery 활성화 확인
-- 또는 수동 백업 수행
```

### 2. 현재 상태 확인

적용 전 현재 데이터베이스 상태를 확인합니다:

```sql
-- 서비스 현황 확인
SELECT id, title, slug, description
FROM services
WHERE slug IN ('navigator', 'cartographer', 'captain', 'harbor', 'find', 'frame', 'build', 'keep')
ORDER BY title;

-- 구독 플랜 현황 확인
SELECT id, plan_name, service_id
FROM subscription_plans
WHERE plan_name LIKE '%Compass%' OR plan_name LIKE '%COMPASS%' OR plan_name LIKE '%Minu%'
ORDER BY plan_name;

-- 기존 뷰 확인
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name IN ('compass_integration_view', 'minu_integration_view');

-- media_library 테이블 존재 여부
SELECT EXISTS (
  SELECT FROM pg_tables
  WHERE schemaname = 'public' AND tablename = 'media_library'
) as media_library_exists;

-- search_path 미설정 함수 수 확인
SELECT COUNT(*) as functions_without_search_path
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proconfig IS NULL;
```

---

## Supabase Dashboard SQL Editor 사용법

### 1. SQL Editor 접근

1. [Supabase Dashboard](https://supabase.com/dashboard) 로그인
2. 프로젝트 선택 (zykjdneewbzyazfukzyg)
3. 좌측 메뉴에서 **SQL Editor** 클릭

### 2. 스크립트 실행

1. **New query** 버튼 클릭
2. 스크립트 전체 복사 붙여넣기:
   - 파일: `scripts/sql/apply-2025-11-22-migrations.sql`
3. **Run** 버튼 클릭 (또는 Cmd/Ctrl + Enter)

### 3. 실행 순서 (권장)

전체 스크립트를 한 번에 실행해도 되지만, 안전을 위해 섹션별로 실행할 수 있습니다:

| 순서 | 섹션 | 설명 |
|------|------|------|
| 1 | SECTION 1 | Newsletter 함수 보안 강화 |
| 2 | SECTION 2 | Critical 함수 보안 강화 |
| 3 | SECTION 3 | Compass -> Minu 브랜드 전환 |
| 4 | SECTION 4 | Media Library 테이블 생성 |

---

## 적용 후 검증 쿼리

### 1. Newsletter 함수 검증

```sql
-- Newsletter 함수 search_path 확인
SELECT
  p.proname as function_name,
  CASE
    WHEN p.proconfig IS NULL THEN 'No search_path'
    WHEN 'search_path=public, pg_temp' = ANY(p.proconfig) THEN 'Secure'
    ELSE 'Other config: ' || array_to_string(p.proconfig, ', ')
  END as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN (
  'subscribe_to_newsletter',
  'unsubscribe_from_newsletter',
  'get_newsletter_subscribers'
)
ORDER BY p.proname;
```

**기대 결과**: 모든 함수가 'Secure' 상태

### 2. Critical 함수 검증

```sql
-- Critical 함수 search_path 확인 (28개)
SELECT
  p.proname as function_name,
  CASE
    WHEN p.proconfig IS NULL THEN 'No search_path'
    WHEN 'search_path=public, pg_temp' = ANY(p.proconfig) THEN 'Secure'
    ELSE 'Other'
  END as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN (
  'generate_password_reset_token',
  'verify_password_reset_token',
  'generate_email_verification_token',
  'verify_email_token',
  'lock_account_on_failed_attempts',
  'is_account_locked',
  'get_recent_failed_attempts',
  'get_user_permissions',
  'user_has_permission',
  'get_revenue_by_date',
  'get_revenue_by_service',
  'get_kpis',
  'calculate_bounce_rate',
  'calculate_funnel',
  'get_event_counts',
  'get_weekly_stats',
  'get_weekly_logs',
  'get_weekly_project_activity',
  'get_user_recent_activity',
  'has_active_subscription',
  'expire_subscriptions',
  'generate_order_number',
  'apply_to_bounty',
  'log_action',
  'get_record_activity',
  'get_session_timeline',
  'get_media_by_type_category',
  'is_blog_post_published'
)
ORDER BY p.proname;
```

**기대 결과**: 모든 함수가 'Secure' 상태 (일부 존재하지 않는 함수는 목록에 표시되지 않음)

### 3. 트리거 함수 검증

```sql
-- 트리거 함수 search_path 확인
SELECT
  COUNT(*) as total_trigger_functions,
  SUM(CASE WHEN p.proconfig IS NULL THEN 1 ELSE 0 END) as without_search_path,
  SUM(CASE WHEN 'search_path=public, pg_temp' = ANY(p.proconfig) THEN 1 ELSE 0 END) as with_search_path
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND (
  p.proname LIKE 'update_%_updated_at'
  OR p.proname LIKE 'set_cms_%_created_by'
  OR p.proname LIKE 'set_cms_%_uploaded_by'
  OR p.proname IN ('log_cms_activity', 'restrict_lab_user_updates', 'set_proposal_user_id', 'update_order_payment_id', 'trigger_weekly_recap')
);
```

**기대 결과**: `without_search_path = 0`

### 4. Minu 브랜드 전환 검증

```sql
-- 서비스 업데이트 확인
SELECT id, title, slug, LEFT(description, 50) as description_preview
FROM services
WHERE slug IN ('find', 'frame', 'build', 'keep')
ORDER BY
  CASE slug
    WHEN 'find' THEN 1
    WHEN 'frame' THEN 2
    WHEN 'build' THEN 3
    WHEN 'keep' THEN 4
  END;

-- 뷰 생성 확인
SELECT table_name, view_definition IS NOT NULL as has_definition
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name IN ('minu_integration_view', 'compass_integration_view');

-- 뷰 데이터 조회 테스트
SELECT COUNT(*) as total_users FROM minu_integration_view;
```

**기대 결과**:
- 4개 서비스가 Minu 이름으로 변경됨
- minu_integration_view, compass_integration_view 두 뷰 존재

### 5. Media Library 테이블 검증

```sql
-- 테이블 존재 확인
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'media_library') as column_count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'media_library';

-- 인덱스 확인
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'media_library'
ORDER BY indexname;

-- RLS 정책 확인
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'media_library'
ORDER BY policyname;

-- 테스트 INSERT (관리자 권한 필요)
-- INSERT INTO media_library (filename, original_filename, file_size, mime_type, storage_path, uploaded_by)
-- VALUES ('test.jpg', 'test.jpg', 1000, 'image/jpeg', '/media/test.jpg', auth.uid());
```

**기대 결과**:
- media_library 테이블: 14개 컬럼
- 인덱스: 5개 생성
- RLS 정책: 4개 (select, insert, update, delete)

### 6. 전체 보안 점수 확인

```sql
-- search_path 미설정 함수 수 재확인 (마이그레이션 후 감소해야 함)
SELECT COUNT(*) as remaining_functions_without_search_path
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proconfig IS NULL;

-- 보안 점수 계산
WITH stats AS (
  SELECT
    COUNT(*) as total,
    SUM(CASE WHEN p.proconfig IS NOT NULL THEN 1 ELSE 0 END) as secured
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public'
)
SELECT
  total as total_functions,
  secured as secured_functions,
  ROUND((secured::numeric / NULLIF(total, 0) * 100), 1) as security_score_percent
FROM stats;
```

---

## 문제 해결

### 오류: 함수가 존재하지 않음

일부 ALTER FUNCTION 명령이 실패할 수 있습니다. 이는 해당 함수가 아직 생성되지 않았기 때문입니다.

```sql
-- 오류 예시
-- ERROR: function generate_password_reset_token(text) does not exist

-- 해결: 해당 ALTER FUNCTION 라인을 주석 처리하고 다시 실행
```

### 오류: 뷰 종속성

뷰 삭제 시 종속성 오류가 발생할 수 있습니다.

```sql
-- CASCADE 옵션 사용
DROP VIEW IF EXISTS public.compass_integration_view CASCADE;
```

### 오류: 테이블 이미 존재

media_library 테이블이 이미 존재하는 경우:

```sql
-- 기존 테이블 확인 후 필요시 삭제
DROP TABLE IF EXISTS public.media_library CASCADE;
```

---

## 롤백 절차

문제 발생 시 다음 롤백 스크립트를 실행합니다:

```sql
-- =====================================================
-- [ROLLBACK] 2025-11-22 마이그레이션 롤백
-- =====================================================

-- 1. Media Library 롤백
DROP TABLE IF EXISTS public.media_library CASCADE;
DROP FUNCTION IF EXISTS update_media_library_updated_at();

-- 2. Minu -> Compass 브랜드 롤백
UPDATE services SET title = 'COMPASS Navigator', slug = 'navigator' WHERE slug = 'find';
UPDATE services SET title = 'COMPASS Cartographer', slug = 'cartographer' WHERE slug = 'frame';
UPDATE services SET title = 'COMPASS Captain', slug = 'captain' WHERE slug = 'build';
UPDATE services SET title = 'COMPASS Harbor', slug = 'harbor' WHERE slug = 'keep';

UPDATE subscription_plans
SET plan_name = REPLACE(plan_name, 'Minu Find', 'COMPASS Navigator')
WHERE plan_name LIKE '%Minu Find%';

DROP VIEW IF EXISTS public.minu_integration_view;
DROP VIEW IF EXISTS public.compass_integration_view;

-- 3. Function Search Path 롤백 (권장하지 않음 - 보안 강화 유지)
-- search_path 설정은 보안 강화이므로 롤백하지 않는 것을 권장합니다.
```

---

## 관련 문서

- [DB Security Verification Report](./db-security-verification-2025-11-22.md)
- [Supabase 마이그레이션 가이드](https://supabase.com/docs/guides/getting-started/local-development#database-migrations)
- [PostgreSQL Search Path Security](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-SEARCH-PATH)

---

## 체크리스트

### 적용 전
- [ ] Supabase Dashboard 백업 확인
- [ ] 현재 상태 확인 쿼리 실행
- [ ] 개발 환경에서 먼저 테스트 (선택)

### 적용 중
- [ ] 스크립트 전체 또는 섹션별 실행
- [ ] 오류 메시지 확인 및 대응

### 적용 후
- [ ] Newsletter 함수 검증 완료
- [ ] Critical 함수 검증 완료
- [ ] Minu 브랜드 전환 검증 완료
- [ ] Media Library 테이블 검증 완료
- [ ] 전체 보안 점수 확인

---

**작성일**: 2025-11-22
**작성자**: Claude AI
**상태**: Production Ready
