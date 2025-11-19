# Supabase 마이그레이션 실행 가이드

> **목적**: RLS 정책 수정으로 테스트 실패 문제 해결

## 🎯 마이그레이션 개요

**파일**: `supabase/migrations/fix-rls-policies-all.sql`

**수정 내역**:
- ✅ notifications 테이블 생성 + RLS 정책 4개
- ✅ carts 테이블 RLS 정책 4개 재생성
- ✅ cart_items 테이블 RLS 정책 4개 재생성
- ✅ user_roles 테이블 RLS 정책 2개 재생성
- ✅ roles 테이블 RLS 정책 1개 재생성
- ✅ user_profiles 테이블 RLS 정책 4개 재생성
- ✅ roadmap 테이블 RLS 정책 4개 재생성

---

## 📋 실행 방법

### 방법 1: Supabase Dashboard (권장) ⭐

**1단계: Dashboard 접속**
```
https://supabase.com/dashboard/project/zykjdneewbzyazfukzyg
```

**2단계: SQL Editor 열기**
- 왼쪽 메뉴 → `SQL Editor` 클릭
- `+ New query` 버튼 클릭

**3단계: SQL 복사 & 실행**
1. `supabase/migrations/fix-rls-policies-all.sql` 파일 전체 복사
2. SQL Editor에 붙여넣기
3. `RUN` 버튼 클릭 또는 `Ctrl+Enter`

**4단계: 결과 확인**
- 성공 메시지:
  ```
  ✅ RLS 정책 수정 완료!
  - notifications 테이블: 생성 + RLS 정책 4개
  - carts 테이블: RLS 정책 4개 재생성
  - cart_items 테이블: RLS 정책 4개 재생성
  - user_roles 테이블: RLS 정책 2개 재생성
  - roles 테이블: RLS 정책 1개 재생성
  - user_profiles 테이블: RLS 정책 4개 재생성
  - roadmap 테이블: RLS 정책 4개 재생성

  ⚠️ 주의: 프로덕션 환경에서는 user_roles, user_profiles 정책을 더 엄격하게 설정하세요
  ```

---

### 방법 2: psql 사용 (고급)

**전제 조건**: PostgreSQL psql 클라이언트 설치

**1단계: Database URL 확인**
- Supabase Dashboard → Settings → Database
- Connection string 복사 (Direct connection)

**2단계: psql 연결**
```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.zykjdneewbzyazfukzyg.supabase.co:5432/postgres"
```

**3단계: SQL 파일 실행**
```bash
\i supabase/migrations/fix-rls-policies-all.sql
```

---

## ✅ 마이그레이션 후 확인 사항

### 1. RLS 정책 확인
```sql
-- notifications 테이블 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'notifications';

-- 예상 결과: 4개 정책
-- 1. Users can view their own notifications (SELECT)
-- 2. Users can update their own notifications (UPDATE)
-- 3. Users can delete their own notifications (DELETE)
-- 4. Service role can insert notifications (INSERT)
```

### 2. 테이블 존재 확인
```sql
-- notifications 테이블 존재 확인
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'notifications';
```

### 3. 테스트 재실행
```bash
# E2E 테스트 재실행
npm run test:e2e

# 특정 테스트만 실행
npx playwright test tests/e2e/newsletter.spec.ts --project=chromium
npx playwright test tests/e2e/status.spec.ts --project=chromium
```

---

## 🔍 트러블슈팅

### 오류 1: "relation does not exist"
**원인**: 테이블이 아직 생성되지 않음

**해결**:
1. 이전 마이그레이션 파일들이 모두 실행되었는지 확인
2. `20251020000000_create_services_tables.sql` ~ `20251111000003_revenue_functions.sql` 순서대로 실행

### 오류 2: "policy already exists"
**원인**: RLS 정책이 이미 존재함

**해결**:
- SQL 파일에 `DROP POLICY IF EXISTS` 구문이 있으므로 재실행 가능
- 수동으로 삭제 후 재실행:
  ```sql
  DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
  ```

### 오류 3: "permission denied"
**원인**: 권한 부족

**해결**:
- Service Role Key 사용 필요
- Dashboard에서는 자동으로 관리자 권한으로 실행됨

---

## 📊 마이그레이션 영향 범위

### 테스트 개선 예상:
- ✅ Newsletter 테스트: DB 연결 문제 해결
- ✅ Status 페이지 테스트: RLS 정책으로 데이터 접근 가능
- ✅ 인증/권한 테스트: user_roles, user_profiles 정책 수정

### 예상 성과:
- **Before**: 17개 통과 / 8개 스킵 / 18개 실패
- **After**: 25~30개 통과 / 0~5개 스킵 / 8~13개 실패

---

## 📝 다음 단계

1. **마이그레이션 실행** (Supabase Dashboard)
2. **테스트 재실행** (`npm run test:e2e`)
3. **결과 확인** (통과/실패 비율)
4. **추가 수정** (필요시)

---

## 📞 도움이 필요하신가요?

- Supabase Dashboard: https://supabase.com/dashboard
- Supabase Docs: https://supabase.com/docs
- RLS 가이드: https://supabase.com/docs/guides/auth/row-level-security

---

**마지막 업데이트**: 2025-11-09
**작성자**: Claude Code Assistant
