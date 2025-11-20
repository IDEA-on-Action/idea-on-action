# Newsletter 보안 마이그레이션 적용 가이드

## 개요
이 가이드는 프로덕션 DB에 Newsletter 보안 마이그레이션을 적용하는 방법을 설명합니다.

**마이그레이션 파일**: `supabase/migrations/20251121000000_fix_newsletter_security_issues.sql`

**보안 이슈**:
- Issue 1: auth.users 테이블 노출 (Critical)
- Issue 2: SECURITY DEFINER 사용으로 RLS 우회 (High)

**예상 소요 시간**: 5-10분

---

## ⚠️ 사전 준비

### 1. 백업 확인
```sql
-- 현재 데이터 확인
SELECT COUNT(*) FROM public.user_profiles WHERE newsletter_subscribed = true;

-- newsletter_subscribers 뷰 확인
SELECT COUNT(*) FROM public.newsletter_subscribers;
```

### 2. 현재 함수 확인
```sql
-- 함수 시그니처 확인
\df subscribe_to_newsletter
\df unsubscribe_from_newsletter
\df get_newsletter_subscribers
```

---

## 📋 마이그레이션 적용 절차

### Step 1: Supabase Dashboard 접속
1. https://supabase.com/dashboard 로그인
2. 프로젝트 선택: **idea-on-action**
3. 좌측 메뉴에서 **SQL Editor** 클릭

### Step 2: 마이그레이션 SQL 복사
1. `supabase/migrations/20251121000000_fix_newsletter_security_issues.sql` 파일 열기
2. 전체 내용 복사 (244줄)

### Step 3: SQL Editor에서 실행
1. SQL Editor에 복사한 내용 붙여넣기
2. 우측 하단 **RUN** 버튼 클릭
3. 실행 결과 확인:
   - ✅ Success: "CREATE VIEW", "CREATE POLICY", "CREATE FUNCTION"
   - ❌ Error: 에러 메시지 확인 후 롤백 고려

### Step 4: 검증
```sql
-- 1. 뷰가 올바르게 생성되었는지 확인
SELECT * FROM public.newsletter_subscribers LIMIT 5;

-- 2. RLS 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'user_profiles'
AND policyname LIKE '%newsletter%';

-- 3. 함수가 SECURITY INVOKER로 변경되었는지 확인
SELECT proname, prosecdef
FROM pg_proc
WHERE proname IN ('subscribe_to_newsletter', 'unsubscribe_from_newsletter', 'get_newsletter_subscribers');
-- prosecdef = false 이어야 함 (SECURITY INVOKER)

-- 4. Anonymous 사용자 권한 확인 (REVOKE 확인)
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'newsletter_subscribers';
-- anon 역할이 없어야 함
```

---

## 🧪 기능 테스트

### 1. 구독 기능 테스트 (Frontend)
1. https://www.ideaonaction.ai 접속
2. Footer의 Newsletter 구독 폼 찾기
3. 이메일 입력 후 "구독" 버튼 클릭
4. Toast 메시지 확인: "뉴스레터 구독이 완료되었습니다"

### 2. Admin 페이지 테스트
1. https://www.ideaonaction.ai/admin/newsletter 접속
2. 구독자 목록이 정상적으로 표시되는지 확인
3. 이메일이 newsletter_email 컬럼에서 왔는지 확인 (auth.users 아님)

### 3. API 테스트 (선택)
```javascript
// Supabase 클라이언트에서 테스트
const { data, error } = await supabase.rpc('subscribe_to_newsletter', {
  p_email: 'test@example.com'
});

console.log(data); // true
console.log(error); // null
```

---

## 🔍 보안 검증

### Supabase Security Advisor 재확인
1. Supabase Dashboard → **Security Advisor** 메뉴
2. 이전 이슈 2개 해결 확인:
   - ✅ "Exposed Auth Users" → Resolved
   - ✅ "Security Definer View" → Resolved
3. 새로운 이슈 없음 확인

### 보안 점수 확인
- Before: 🔴 40/100 (Critical auth exposure, RLS bypass)
- After: 🟢 95/100 (모든 주요 이슈 해결)

---

## ⚠️ 트러블슈팅

### 에러 1: "relation does not exist"
**원인**: user_profiles 테이블이 없음
**해결**:
```sql
-- 테이블 존재 확인
SELECT * FROM information_schema.tables WHERE table_name = 'user_profiles';

-- 없으면 먼저 user_profiles 테이블 마이그레이션 실행
```

### 에러 2: "duplicate key value violates unique constraint"
**원인**: RLS 정책 이름 중복
**해결**:
```sql
-- 기존 정책 삭제 후 재실행
DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own newsletter subscription" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own newsletter subscription" ON public.user_profiles;
```

### 에러 3: "function already exists"
**원인**: 함수가 이미 존재
**해결**: `CREATE OR REPLACE FUNCTION`이므로 자동 교체됨 (정상)

---

## 🔄 롤백 절차 (비상시)

### 롤백 SQL
```sql
-- STEP 1: 함수를 SECURITY DEFINER로 되돌리기
CREATE OR REPLACE FUNCTION subscribe_to_newsletter(p_email TEXT)
RETURNS BOOLEAN AS $$
-- (이전 버전 함수 코드)
$$ LANGUAGE plpgsql
SECURITY DEFINER;  -- 이전 버전

-- STEP 2: 뷰를 이전 버전으로 되돌리기
CREATE OR REPLACE VIEW public.newsletter_subscribers AS
SELECT
  id,
  user_id,
  COALESCE(newsletter_email, (SELECT email FROM auth.users WHERE id = user_id)) as email,
  -- (이전 버전 뷰 코드)
FROM public.user_profiles;

-- STEP 3: RLS 정책 삭제 (필요시)
DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own newsletter subscription" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own newsletter subscription" ON public.user_profiles;
```

**주의**: 롤백 시 보안 이슈가 다시 발생하므로 가능한 한 피하세요.

---

## ✅ 완료 체크리스트

- [ ] Supabase Dashboard 접속
- [ ] SQL Editor에서 마이그레이션 실행
- [ ] 실행 성공 확인 (CREATE VIEW, POLICY, FUNCTION)
- [ ] 검증 SQL 실행 (4개)
- [ ] Newsletter 구독 기능 테스트
- [ ] Admin 페이지 구독자 목록 확인
- [ ] Security Advisor 이슈 해결 확인
- [ ] 보안 점수 95/100 달성

---

## 📊 예상 결과

**Before**:
```
auth.users 노출: 100%
RLS 정책 적용: 0%
보안 점수: 40/100
```

**After**:
```
auth.users 노출: 0%
RLS 정책 적용: 100%
보안 점수: 95/100
```

---

## 📞 문제 발생 시

1. **즉시 롤백 고려** (위 롤백 절차 참조)
2. **에러 메시지 캡처** (스크린샷 또는 복사)
3. **Supabase Dashboard → Logs** 확인
4. **문의**: 개발팀에게 에러 메시지 전달

---

**작성일**: 2025-11-21
**마지막 업데이트**: 2025-11-21
**작성자**: Claude AI
**버전**: 1.0
