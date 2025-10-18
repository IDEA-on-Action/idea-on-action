# E2E 테스트 빠른 시작 가이드

**목적**: 5분 안에 E2E 테스트 실행하기

**날짜**: 2025-10-18

---

## 🚀 빠른 시작 (5분)

### 1단계: Supabase에 테스트 사용자 생성 (2분)

#### Supabase Dashboard 접속
1. https://supabase.com/dashboard 접속
2. 프로젝트 선택: `zykjdneewbzyazfukzyg`

#### 관리자 테스트 사용자 생성
1. **Authentication** > **Users** 클릭
2. **Add User** 버튼 클릭
3. 다음 정보 입력:
   ```
   Email: test-admin@ideaonaction.local
   Password: TestAdmin123!
   Auto Confirm User: ✅ 체크
   ```
4. **Create User** 클릭
5. 생성된 사용자의 **User ID** 복사 (UUID 형식)

#### 관리자 권한 부여
1. **SQL Editor** 클릭
2. 다음 SQL 실행 (User ID 붙여넣기):
   ```sql
   INSERT INTO public.profiles (id, username, full_name, role)
   VALUES (
     '<복사한_USER_ID>',
     'test-admin',
     'Test Administrator',
     'admin'
   )
   ON CONFLICT (id) DO UPDATE
   SET role = 'admin';
   ```
3. **Run** 클릭

---

### 2단계: 개발 서버 실행 (1분)

```bash
npm run dev
```

서버가 http://localhost:8080 에서 실행되는지 확인

---

### 3단계: 테스트 실행 (2분)

#### 단일 테스트 파일 실행 (빠름)
```bash
# 대시보드 테스트만 실행
npx playwright test tests/e2e/admin/dashboard.spec.ts --project=chromium

# UI 모드로 디버깅
npx playwright test tests/e2e/admin/dashboard.spec.ts --ui
```

#### 전체 관리자 테스트 실행 (느림)
```bash
# Chromium만 사용 (빠름)
npx playwright test tests/e2e/admin --project=chromium

# 모든 브라우저 (느림, 5분+)
npx playwright test tests/e2e/admin
```

---

## ✅ 예상 결과

### 성공 시
```
Running 8 tests using 2 workers

✓ [chromium] › dashboard.spec.ts:10 › should redirect to login (2.5s)
✓ [chromium] › dashboard.spec.ts:17 › should show 403 for non-admin (8.3s)
✓ [chromium] › dashboard.spec.ts:37 › should display dashboard (6.1s)
...

8 passed (45s)
```

### 실패 시
테스트가 멈추거나 타임아웃 발생 → [문제 해결](#-문제-해결)

---

## 🆘 문제 해결

### 1. 테스트가 로그인에서 멈춤
**원인**: 테스트 사용자가 없거나 비밀번호가 틀림

**해결**:
1. Supabase Dashboard > Authentication > Users 확인
2. `test-admin@ideaonaction.local` 사용자 존재 확인
3. 비밀번호 재설정: Dashboard에서 "Send Magic Link" 클릭

### 2. 403 Forbidden (관리자 페이지 접근 불가)
**원인**: `profiles` 테이블에 role이 'admin'이 아님

**해결**:
```sql
-- SQL Editor에서 실행
UPDATE public.profiles
SET role = 'admin'
WHERE username = 'test-admin';

-- 확인
SELECT id, username, role FROM public.profiles WHERE username = 'test-admin';
```

### 3. 개발 서버가 포트 5173에서 실행됨
**원인**: Vite 포트 설정이 다름

**해결**:
```bash
# vite.config.ts 확인
# server.port 값 확인 후 playwright.config.ts에서 baseURL 수정
```

### 4. Supabase 연결 에러
**원인**: 환경 변수 미설정

**해결**:
```bash
# .env.local 파일 확인
VITE_SUPABASE_URL=https://zykjdneewbzyazfukzyg.supabase.co
VITE_SUPABASE_ANON_KEY=<YOUR_KEY>
```

---

## 📝 다음 단계

### 일반 사용자 테스트
일부 테스트는 일반 사용자도 필요합니다:

```sql
-- Supabase SQL Editor
-- 위에서 생성한 test-user@ideaonaction.local의 User ID 사용
INSERT INTO public.profiles (id, username, full_name, role)
VALUES (
  '<USER_ID>',
  'test-user',
  'Test User',
  'user'
);
```

### 전체 테스트 스위트 실행
```bash
# E2E 전체 (홈페이지, 로그인, 서비스, 관리자)
npx playwright test tests/e2e

# 유닛 테스트
npm run test:unit

# 모두 실행
npm test
```

### 테스트 리포트 확인
```bash
# HTML 리포트 생성 및 열기
npx playwright show-report
```

---

## 📚 참고 문서

- [테스트 사용자 설정 상세 가이드](./test-user-setup.md)
- [E2E 테스트 작성 가이드](./e2e-guide.md)
- [테스트 전략](./test-strategy.md)
- [Playwright 공식 문서](https://playwright.dev/)

---

**문제가 계속되면**: GitHub Issues 또는 CLAUDE.md 참고
