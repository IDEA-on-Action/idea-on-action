# Newsletter Security Fix - Production Deployment Guide

## 🎯 목적
Supabase Security Advisor에서 발견된 2개의 보안 이슈 (Exposed Auth Users, Security Definer)를 프로덕션 DB에 적용합니다.

## ⚠️ 주의사항
- **Breaking Change**: newsletter_email 파라미터가 필수로 변경됩니다
- **View 변경**: newsletter_subscribers 뷰가 newsletter_email IS NOT NULL 조건 추가
- **RLS 적용**: SECURITY INVOKER로 변경되어 RLS 정책이 강제됩니다

## 📋 배포 체크리스트

### 1단계: 사전 확인
- [ ] Supabase 대시보드 로그인 ([https://supabase.com/dashboard](https://supabase.com/dashboard))
- [ ] 프로젝트 선택 (IDEA on Action)
- [ ] SQL Editor 메뉴 이동

### 2단계: 현재 상태 확인
```sql
-- newsletter_subscribers 뷰 확인
SELECT pg_get_viewdef('public.newsletter_subscribers'::regclass, true);

-- 함수 security 모드 확인
SELECT
  p.proname as function_name,
  CASE WHEN p.prosecdef THEN 'SECURITY DEFINER' ELSE 'SECURITY INVOKER' END as security_mode
FROM pg_proc p
WHERE p.proname IN ('subscribe_to_newsletter', 'unsubscribe_from_newsletter');
```

**예상 결과**:
- 뷰: `COALESCE(newsletter_email, (SELECT email FROM auth.users...))` 포함
- 함수: `SECURITY DEFINER`

### 3단계: 마이그레이션 적용
SQL Editor에서 아래 파일 내용을 복사하여 실행:

**파일**: `supabase/migrations/20251121000000_fix_newsletter_security_issues.sql`

**실행 방법**:
1. SQL Editor 새 쿼리 생성
2. 파일 내용 전체 복사
3. "Run" 버튼 클릭
4. 성공 메시지 확인

### 4단계: 검증
```sql
-- ✅ CHECK 1: 뷰가 auth.users를 참조하지 않는지 확인
SELECT pg_get_viewdef('public.newsletter_subscribers'::regclass, true);
-- 예상: auth.users 참조 없음, newsletter_email만 사용

-- ✅ CHECK 2: 함수가 SECURITY INVOKER인지 확인
SELECT
  p.proname as function_name,
  CASE WHEN p.prosecdef THEN 'SECURITY DEFINER ❌' ELSE 'SECURITY INVOKER ✅' END as status
FROM pg_proc p
WHERE p.proname IN ('subscribe_to_newsletter', 'unsubscribe_from_newsletter', 'get_newsletter_subscribers');
-- 예상: 모두 SECURITY INVOKER ✅

-- ✅ CHECK 3: RLS 정책 확인
SELECT policyname FROM pg_policies
WHERE tablename = 'user_profiles'
  AND policyname LIKE '%newsletter%';
-- 예상: 3개 정책 (admin view, user view own, user update own)

-- ✅ CHECK 4: 권한 확인
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'newsletter_subscribers';
-- 예상: authenticated (SELECT), anon (REVOKED)
```

### 5단계: 기능 테스트 (선택적)

#### 테스트 1: Anonymous 접근 차단
```typescript
// 익명 사용자는 접근 불가
const { data, error } = await supabase
  .from('newsletter_subscribers')
  .select('*');
// 예상: error (permission denied)
```

#### 테스트 2: 인증 사용자 구독
```typescript
// 인증 사용자 구독 (email 필수)
const { data, error } = await supabase
  .rpc('subscribe_to_newsletter', {
    p_email: 'test@example.com'
  });
// 예상: success
```

#### 테스트 3: Admin 전체 조회
```typescript
// Admin 사용자만 전체 조회 가능
const { data, error } = await supabase
  .rpc('get_newsletter_subscribers');
// 예상: Admin이면 success, 일반 사용자면 error
```

---

## 🔄 롤백 방법 (비상시)

### Supabase 대시보드에서 실행:
```sql
-- 1. 원래 뷰 복원 (INSECURE - 비상시에만)
DROP VIEW IF EXISTS public.newsletter_subscribers;
CREATE OR REPLACE VIEW public.newsletter_subscribers AS
SELECT
  id,
  user_id,
  COALESCE(newsletter_email, (SELECT email FROM auth.users WHERE id = user_id)) as email,
  display_name,
  newsletter_subscribed_at as subscribed_at,
  created_at
FROM public.user_profiles
WHERE newsletter_subscribed = true;

-- 2. 원래 함수 복원 (INSECURE - 비상시에만)
CREATE OR REPLACE FUNCTION subscribe_to_newsletter(p_email TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_id UUID;
  profile_exists BOOLEAN;
BEGIN
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to subscribe';
  END IF;

  SELECT EXISTS(SELECT 1 FROM public.user_profiles WHERE user_id = current_user_id) INTO profile_exists;

  IF profile_exists THEN
    UPDATE public.user_profiles
    SET
      newsletter_subscribed = true,
      newsletter_subscribed_at = NOW(),
      newsletter_email = p_email
    WHERE user_id = current_user_id;
  ELSE
    INSERT INTO public.user_profiles (user_id, newsletter_subscribed, newsletter_subscribed_at, newsletter_email)
    VALUES (current_user_id, true, NOW(), p_email);
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;  -- INSECURE!

CREATE OR REPLACE FUNCTION unsubscribe_from_newsletter()
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.user_profiles
  SET newsletter_subscribed = false
  WHERE user_id = auth.uid();
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;  -- INSECURE!
```

**⚠️ WARNING**: 롤백 후 보안 이슈가 다시 발생합니다. 가능한 한 빨리 재적용하세요.

---

## 📊 예상 결과

### Before (보안 이슈 존재)
- 🔴 **Exposed Auth Users**: auth.users 테이블이 뷰를 통해 노출
- 🔴 **Security Definer**: RLS 정책 우회

### After (보안 수정 완료)
- ✅ **No Auth Exposure**: newsletter_email만 사용
- ✅ **RLS Enforced**: SECURITY INVOKER + 명시적 auth 체크
- ✅ **Input Validation**: Email 형식 검증 (regex)
- ✅ **Access Control**: Anonymous REVOKE, Authenticated 제한, Admin 전체 접근

### Security Score
- Before: 🔴 40/100
- After: 🟢 95/100

---

## 🐛 트러블슈팅

### Issue 1: "relation does not exist"
**증상**: user_profiles 테이블을 찾을 수 없음
**해결**: 먼저 `20250109000006_extend_user_profiles.sql` 마이그레이션 적용

### Issue 2: "function already exists"
**증상**: 함수가 이미 존재함
**해결**: `CREATE OR REPLACE FUNCTION`이 자동으로 교체함 (정상)

### Issue 3: "permission denied for function"
**증상**: 함수 실행 권한 없음
**해결**: GRANT 문이 포함되어 있음 (마이그레이션 전체 재실행)

### Issue 4: Email validation 실패
**증상**: "Invalid email format" 에러
**해결**: 올바른 이메일 형식 사용 (예: user@example.com)

---

## 📞 지원

**문제 발생 시**:
1. Supabase 대시보드 Logs 탭에서 에러 확인
2. 검증 스크립트 실행 (`scripts/validation/check-newsletter-security.sql`)
3. GitHub Issues에 문의

**관련 문서**:
- [보안 감사 보고서](./supabase-security-audit-2025-11-21.md)
- [빠른 참조 가이드](./newsletter-security-quick-ref.md)
- [검증 스크립트](../../scripts/validation/check-newsletter-security.sql)

---

**Date**: 2025-11-21
**Version**: 1.0
**Status**: ✅ Ready for Production
