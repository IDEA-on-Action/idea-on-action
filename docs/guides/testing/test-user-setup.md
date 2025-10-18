# 테스트 사용자 설정 가이드

**목적**: E2E 테스트용 관리자 계정 생성

**날짜**: 2025-10-18

---

## 📋 개요

Playwright E2E 테스트를 실행하려면 Supabase에 테스트 전용 관리자 계정이 필요합니다.

**테스트 사용자 정보**:
- **이메일**: `test-admin@ideaonaction.local`
- **비밀번호**: `TestAdmin123!`
- **역할**: `admin`

---

## 🔧 설정 방법

### 방법 1: Supabase Dashboard (권장)

#### 1단계: Supabase 대시보드 접속
1. https://supabase.com/dashboard 접속
2. 프로젝트 선택 (`zykjdneewbzyazfukzyg`)

#### 2단계: Authentication 페이지로 이동
1. 왼쪽 메뉴에서 **Authentication** 클릭
2. **Users** 탭 선택

#### 3단계: 테스트 사용자 생성
1. **Add User** 버튼 클릭
2. 다음 정보 입력:
   - **Email**: `test-admin@ideaonaction.local`
   - **Password**: `TestAdmin123!`
   - **Auto Confirm User**: ✅ 체크 (이메일 인증 생략)
3. **Create User** 클릭

#### 4단계: 관리자 권한 부여
1. 생성된 사용자의 **User ID** 복사 (UUID 형식)
2. 왼쪽 메뉴에서 **SQL Editor** 클릭
3. 다음 SQL 실행:

```sql
-- profiles 테이블에 관리자 프로필 추가
INSERT INTO public.profiles (id, username, full_name, role)
VALUES (
  '<USER_ID_여기에_붙여넣기>',  -- 복사한 User ID
  'test-admin',
  'Test Administrator',
  'admin'
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin';
```

4. **Run** 버튼 클릭

---

### 방법 2: SQL Editor (빠른 방법)

Supabase SQL Editor에서 다음 스크립트 실행:

```sql
-- 1. Auth 사용자 생성 (Supabase Auth)
-- 주의: Supabase Auth는 직접 SQL로 사용자를 생성할 수 없습니다.
-- Dashboard의 Authentication > Users > Add User를 사용해야 합니다.

-- 2. 사용자 ID 조회 (생성 후 실행)
SELECT id, email, created_at
FROM auth.users
WHERE email = 'test-admin@ideaonaction.local';

-- 3. 관리자 프로필 추가 (위에서 조회한 ID 사용)
INSERT INTO public.profiles (id, username, full_name, role)
VALUES (
  '<USER_ID_여기에_붙여넣기>',
  'test-admin',
  'Test Administrator',
  'admin'
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- 4. 관리자 권한 확인
SELECT p.id, p.username, p.role, u.email
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';
```

---

## ✅ 검증

### 1. 수동 로그인 테스트
1. 개발 서버 실행: `npm run dev`
2. http://localhost:8080/login 접속
3. 테스트 계정으로 로그인:
   - **Email/Username**: `test-admin` 또는 `test-admin@ideaonaction.local`
   - **Password**: `TestAdmin123!`
4. `/admin` 페이지 접근 가능 확인

### 2. E2E 테스트 실행
```bash
# 단일 테스트 실행
npx playwright test tests/e2e/admin/dashboard.spec.ts --project=chromium

# 전체 관리자 테스트 실행
npx playwright test tests/e2e/admin --project=chromium
```

---

## 🔒 보안 고려사항

### 프로덕션 vs 개발 환경

**프로덕션 (www.ideaonaction.ai)**:
- ❌ 테스트 사용자 생성 금지
- ✅ 실제 관리자 계정만 사용

**개발/스테이징**:
- ✅ 테스트 사용자 생성 허용
- ✅ E2E 테스트 실행 가능

### 환경 분리

`.env.local` 파일에서 환경 구분:

```bash
# 개발 환경
VITE_SUPABASE_URL=https://zykjdneewbzyazfukzyg.supabase.co
VITE_SUPABASE_ANON_KEY=<YOUR_ANON_KEY>

# 프로덕션 환경 (Vercel)
# Vercel 대시보드에서 별도 환경 변수 설정
```

---

## 🧹 테스트 데이터 정리

테스트 완료 후 생성된 데이터 삭제:

```sql
-- 테스트 중 생성된 서비스 삭제
DELETE FROM public.services
WHERE name LIKE 'E2E 테스트%' OR name LIKE 'Updated -%';

-- 테스트 사용자 삭제 (필요시)
-- 주의: Dashboard에서 수동 삭제 권장
DELETE FROM public.profiles
WHERE username = 'test-admin';

-- Auth 사용자는 Dashboard > Authentication > Users에서 삭제
```

---

## 📝 테스트 픽스처 설정

테스트 사용자 정보는 `tests/fixtures/users.ts`에 저장되어 있습니다:

```typescript
export const testUsers = {
  admin: {
    email: 'test-admin@ideaonaction.local',
    password: 'TestAdmin123!',
    username: 'test-admin',
    role: 'admin'
  }
}
```

---

## 🆘 문제 해결

### 로그인 실패
**증상**: "Invalid credentials" 에러

**해결 방법**:
1. Supabase Dashboard > Authentication > Users에서 사용자 존재 확인
2. 이메일 확인 상태 체크 (Confirmed 상태여야 함)
3. 비밀번호 재설정 시도

### 관리자 페이지 접근 불가 (403)
**증상**: 로그인은 되지만 `/admin` 접근 시 403 Forbidden

**해결 방법**:
```sql
-- profiles 테이블에서 role 확인
SELECT id, username, role
FROM public.profiles
WHERE email = 'test-admin@ideaonaction.local';

-- role이 'admin'이 아니면 업데이트
UPDATE public.profiles
SET role = 'admin'
WHERE username = 'test-admin';
```

### RLS (Row Level Security) 정책 문제
**증상**: 데이터 조회/생성/수정/삭제 불가

**해결 방법**:
```sql
-- profiles 테이블 RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- 관리자 정책이 없으면 추가
CREATE POLICY "Admins can do everything"
ON public.profiles
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);
```

---

## 📚 참고 문서

- [Supabase Auth API](https://supabase.com/docs/reference/javascript/auth-signup)
- [Playwright Authentication](https://playwright.dev/docs/auth)
- [테스트 전략](./test-strategy.md)
- [E2E 테스트 가이드](./e2e-guide.md)

---

**다음 단계**: [E2E 테스트 실행 →](./e2e-guide.md)
