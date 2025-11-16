# Super Admin 업그레이드 가이드

> admin@ideaonaction.local 계정을 super_admin 역할로 업그레이드하는 가이드

## 📋 개요

**목적**: AdminUsers 페이지 접근을 위해 admin 계정의 역할을 'super_admin'으로 변경

**배경**:
- AdminUsers.tsx Line 297: `if (adminRole !== 'super_admin')` 체크
- 현재 admin 계정은 'admin' 역할로 설정됨
- AdminUsers 페이지는 super_admin만 접근 가능
- 영향받는 테스트: admin-users.spec.ts (18개 테스트)

**변경 내용**:
```sql
UPDATE admins SET role = 'super_admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@ideaonaction.local')
```

---

## 🚀 실행 방법

### 방법 1: Supabase Dashboard SQL Editor (권장 - 모든 환경)

> **장점**: Docker 필요 없음, 프로덕션 적용 간단, 빠른 실행
>
> **소요 시간**: 2-3분

#### Step 1: Supabase Dashboard 접속

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택: **idea-on-action** (`zykjdneewbzyazfukzyg`)
   - ![Dashboard 프로젝트 선택](프로젝트 목록에서 "idea-on-action" 클릭)

#### Step 2: SQL Editor 열기

1. 좌측 사이드바 메뉴 → **SQL Editor** 클릭
2. **"New query"** 버튼 클릭
   - 또는 **"+ New"** → **Query** 선택

#### Step 3: 마이그레이션 SQL 복사

마이그레이션 파일 내용 전체 복사:

```bash
# 터미널에서 파일 내용 확인
cat supabase/migrations/20251116000001_upgrade_admin_to_super_admin.sql
```

또는 텍스트 에디터에서 다음 파일 열기:
```
supabase/migrations/20251116000001_upgrade_admin_to_super_admin.sql
```

**복사할 내용 (전체 34줄)**:
```sql
-- 20251116000001_upgrade_admin_to_super_admin.sql
-- Admin 계정을 super_admin으로 업그레이드

UPDATE public.admins
SET
  role = 'super_admin',
  updated_at = NOW()
WHERE user_id = (
  SELECT id
  FROM auth.users
  WHERE email = 'admin@ideaonaction.local'
);

-- Verification: 업그레이드 결과 확인
SELECT
  u.email,
  a.role,
  a.created_at,
  a.updated_at
FROM auth.users u
JOIN public.admins a ON a.user_id = u.id
WHERE u.email = 'admin@ideaonaction.local';
```

#### Step 4: SQL 붙여넣기 & 실행

1. SQL Editor의 빈 쿼리 창에 복사한 SQL 붙여넣기
2. **"Run" 버튼** 클릭 (또는 **Ctrl+Enter** / **Cmd+Enter**)
   - ![Run 버튼](쿼리 창 우측 상단의 파란색 "Run" 버튼)

#### Step 5: 결과 확인

**예상 출력** (쿼리 완료 후 "Results" 탭):

```
┌──────────────────────────┬────────────┬─────────────────────┬─────────────────────┐
│ email                    │ role       │ created_at          │ updated_at          │
├──────────────────────────┼────────────┼─────────────────────┼─────────────────────┤
│ admin@ideaonaction.local │ super_admin│ 2025-11-15 17:03:00 │ 2025-11-16 00:00:00 │
└──────────────────────────┴────────────┴─────────────────────┴─────────────────────┘
```

**체크리스트**:
- [ ] 쿼리 실행 성공 (에러 없음)
- [ ] role이 **super_admin** 으로 변경됨
- [ ] updated_at이 현재 시간으로 업데이트됨
- [ ] 1개 행(row) 반환됨

---

### 방법 2: 로컬 개발 환경 (Docker + Supabase CLI)

> **장점**: 로컬 DB에 반영, 반복 테스트 가능
>
> **필전제**: Docker Desktop 실행 필요
>
> **소요 시간**: 5-10분

#### Step 1: Docker Desktop 실행

```bash
# Windows (PowerShell)
# Docker Desktop 앱 실행 (시작 메뉴에서 검색)
# 또는 명령줄에서:
docker ps  # Docker 연결 확인
```

#### Step 2: Supabase 로컬 DB 초기화

```bash
# 프로젝트 디렉토리에서
cd d:\GitHub\idea-on-action

# Supabase 로컬 DB 초기화 (모든 마이그레이션 자동 적용)
npx supabase db reset
```

**예상 출력**:
```
✔ Stopping local database...
✔ Removed existing local database...
✔ Starting local database...
✔ Applying migrations...
✔ Database reset successful
```

**마이그레이션 자동 적용**:
- `supabase/migrations/20251116000001_upgrade_admin_to_super_admin.sql` 자동 실행됨
- admin@ideaonaction.local → super_admin 역할 자동 설정

#### Step 3: 결과 확인 (선택)

```bash
# verify 스크립트 실행
node scripts/verify-super-admin.js
```

**성공 시 출력**:
```
✅ SUCCESS: Admin 계정이 super_admin 역할을 가지고 있습니다

   AdminUsers 페이지 접근 가능 (/admin/users)
   admin-users.spec.ts 테스트 18개 통과 예상
```

---

### 방법 3: 프로덕션 환경 (Supabase Production Dashboard)

> **주의**: 프로덕션 환경 변경 - 신중하게 진행
>
> **필수**: 변경 전 백업 생성
>
> **소요 시간**: 3-5분

#### Step 1: 프로덕션 백업 생성

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. **idea-on-action** 프로젝트 선택
3. 좌측 메뉴 → **Settings** → **Backups**
4. **"Create backup"** 버튼 클릭
5. 백업 완료 대기 (1-5분)
   - 상태: "In Progress" → "Complete" 확인

#### Step 2: SQL Editor 접속

1. 좌측 메뉴 → **SQL Editor**
2. **"New query"** 클릭

#### Step 3: 마이그레이션 SQL 실행

1. 마이그레이션 파일 전체 복사 (위의 방법 1 참고)
2. SQL Editor에 붙여넣기
3. **"Run"** 버튼 클릭
4. 결과 확인 (role = 'super_admin')

#### Step 4: 롤백 시나리오 (필요 시)

**문제 발생 시 롤백**:

```bash
# Supabase Dashboard → Settings → Backups
# 생성한 백업에서 "Restore" 버튼 클릭
# 또는 수동 롤백:
```

**수동 롤백 SQL** (SQL Editor에서 실행):
```sql
-- admin 역할로 되돌리기
UPDATE public.admins
SET role = 'admin', updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users
  WHERE email = 'admin@ideaonaction.local'
);

-- 확인
SELECT email, role FROM auth.users u
JOIN public.admins a ON a.user_id = u.id
WHERE u.email = 'admin@ideaonaction.local';
```

---

## ✅ 검증 단계

### 방법 A: 검증 스크립트 (권장)

**전제 조건**:
- `.env.local`에 `SUPABASE_SERVICE_ROLE_KEY` 설정 필요

**실행**:
```bash
# 프로젝트 디렉토리에서
node scripts/verify-super-admin.js
```

**성공 출력 예시**:
```
🔍 Super Admin 계정 확인 중...

📡 URL: https://zykjdneewbzyazfukzyg.supabase.co

✅ Admin 계정 발견: admin@ideaonaction.local
   User ID: 12345678-1234-1234-1234-123456789abc
   Created: 2025-11-15, 5:03:00 PM

✅ admins 테이블 레코드 확인:
   Role: super_admin
   Created: 2025-11-15, 5:03:00 PM
   Updated: 2025-11-16, 12:00:00 AM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ SUCCESS: Admin 계정이 super_admin 역할을 가지고 있습니다

   AdminUsers 페이지 접근 가능 (/admin/users)
   admin-users.spec.ts 테스트 18개 통과 예상

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**실패 시 출력 예시**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ FAILURE: Admin 계정의 역할이 'admin'입니다

   Expected: super_admin
   Actual: admin

   다음 마이그레이션을 실행하세요:
   → supabase/migrations/20251116000001_upgrade_admin_to_super_admin.sql

   실행 방법:
   1. Supabase Dashboard → SQL Editor 열기
   2. 마이그레이션 파일 내용 복사 & 실행

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 방법 B: 수동 SQL 검증 (SQL Editor)

**Supabase Dashboard SQL Editor에서 실행**:

```sql
-- AdminUsers 페이지 접근 권한 확인
SELECT
  u.email,
  a.role,
  a.created_at,
  a.updated_at,
  CASE
    WHEN a.role = 'super_admin' THEN '✅ AdminUsers 페이지 접근 가능'
    ELSE '❌ AdminUsers 페이지 접근 불가'
  END as access_status
FROM auth.users u
LEFT JOIN public.admins a ON a.user_id = u.id
WHERE u.email = 'admin@ideaonaction.local';
```

**예상 결과**:
```
email                    | role       | access_status
-------------------------|------------|----------------------------------
admin@ideaonaction.local | super_admin| ✅ AdminUsers 페이지 접근 가능
```

### 방법 C: E2E 테스트 실행

**AdminUsers 페이지 관련 E2E 테스트 (18개)**:

```bash
# 전체 테스트 실행
npx playwright test tests/e2e/admin/admin-users.spec.ts

# 또는 UI 모드로 실행 (권장)
npx playwright test tests/e2e/admin/admin-users.spec.ts --ui
```

**예상 결과**:
```
✅ admin-users.spec.ts: 18 passed (1.5s)

테스트 항목:
  ✅ 사용자 목록 조회
  ✅ 검색 기능 (이메일, 이름)
  ✅ 필터링 (역할별)
  ✅ 역할 변경 (admin ↔ super_admin)
  ✅ 사용자 삭제 (계정 삭제)
  ✅ 페이지네이션
  ... (18개 테스트 모두 통과)
```

---

## 📊 예상 효과

### Before (admin 역할)
```typescript
// AdminUsers.tsx Line 297
if (adminRole !== 'super_admin') {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>접근 권한 없음</AlertTitle>
          <AlertDescription>
            이 페이지는 슈퍼 관리자만 접근할 수 있습니다.
          </AlertDescription>
        </Alert>
      </main>
      <Footer />
    </div>
  );
}
```
- **AdminUsers 페이지**: 403 Forbidden (접근 불가)
- **admin-users.spec.ts**: 18개 테스트 모두 실패

### After (super_admin 역할)
- **AdminUsers 페이지**: ✅ 정상 접근 가능 (/admin/users)
- **admin-users.spec.ts**: ✅ 18개 테스트 통과 예상
- **기능**:
  - 사용자 목록 조회 (페이지네이션, 검색, 필터)
  - 사용자 역할 변경 (admin ↔ super_admin)
  - 사용자 삭제 (계정 삭제)
  - 사용자 활동 로그 조회

---

## 🔒 보안 고려사항

### super_admin 권한
- **최소 권한 원칙**: super_admin 역할은 최소한의 인원에게만 부여
- **감사 로그**: admin_audit_logs 테이블에 모든 관리 작업 기록
- **정기 검토**: 분기별 super_admin 계정 점검 권장

### RLS 정책
```sql
-- admins 테이블 RLS 정책
CREATE POLICY "Super admins can view all admin records"
  ON admins FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can update admin records"
  ON admins FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );
```

---

## 🧪 테스트

### 수동 테스트
1. **로그인**: admin@ideaonaction.local / demian00
2. **AdminUsers 접근**: http://localhost:5173/admin/users
3. **기능 테스트**:
   - [ ] 사용자 목록 조회
   - [ ] 검색 기능 (이메일, 이름)
   - [ ] 필터링 (역할별)
   - [ ] 역할 변경 (admin → super_admin)
   - [ ] 사용자 삭제

### E2E 테스트
```bash
# admin-users.spec.ts 실행
npx playwright test tests/e2e/admin/admin-users.spec.ts

# 예상 결과: 18개 테스트 통과
```

---

## 🚨 문제 해결 (Troubleshooting)

### 문제 1: "Cannot find admin@ideaonaction.local" 에러

**증상**:
```
❌ admin@ideaonaction.local 계정을 찾을 수 없습니다
```

**원인**:
- admin 계정이 아직 생성되지 않음
- 계정 이메일 오타

**해결 방법**:

1. admin 계정 존재 확인 (SQL Editor):
```sql
SELECT id, email, created_at FROM auth.users WHERE email LIKE '%admin%';
```

2. admin 계정이 없으면 수동 생성:
   - Supabase Dashboard → Authentication → Users
   - "Add user" 클릭
   - Email: `admin@ideaonaction.local`
   - Password: `demian00`
   - "Email Confirmed" 체크
   - "Create user" 클릭

3. 생성 후 다시 마이그레이션 실행

---

### 문제 2: "admins 테이블에 해당 user_id가 없습니다" 에러

**증상**:
```
❌ admins 테이블에 해당 user_id가 없습니다
```

**원인**:
- admin 계정은 있지만 admins 테이블에 레코드 없음
- 초기 설정 불완전

**해결 방법**:

```sql
-- 1. admin 계정 ID 조회
SELECT id FROM auth.users WHERE email = 'admin@ideaonaction.local';

-- 2. admins 테이블에 레코드 추가 (위에서 얻은 ID 사용)
INSERT INTO public.admins (user_id, role)
VALUES ('ADMIN_USER_ID_HERE', 'admin');

-- 3. 마이그레이션 다시 실행
UPDATE public.admins
SET role = 'super_admin', updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@ideaonaction.local'
);
```

---

### 문제 3: Docker Desktop 실행 안 됨

**증상**:
```
error during connect: This error may indicate that the docker daemon is not running.
```

**원인**:
- Docker Desktop이 실행되지 않음

**해결 방법**:

**Windows**:
```powershell
# 옵션 1: Docker Desktop 앱 실행 (시작 메뉴)
Start-Process "Docker Desktop"

# 옵션 2: 명령줄에서 확인
docker ps  # 약 30초 대기 후 실행 가능

# 옵션 3: Docker 버전 확인
docker --version
```

**Mac**:
```bash
# Docker Desktop 앱 실행 (응용 프로그램 → Docker)
open /Applications/Docker.app

# 또는 터미널에서
docker ps
```

---

### 문제 4: "SUPABASE_SERVICE_ROLE_KEY를 찾을 수 없습니다" 에러

**증상**:
```
❌ SUPABASE_SERVICE_ROLE_KEY 환경 변수를 찾을 수 없습니다
```

**원인**:
- `.env.local` 파일 미설정
- Service Role Key 누락

**해결 방법**:

1. Supabase Dashboard 접속
2. Project Settings → API
3. **Service Role Key** 복사 (⚠️ 공개 금지)
4. `.env.local` 파일에 추가:
```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

5. 터미널에서 verify 스크립트 다시 실행:
```bash
node scripts/verify-super-admin.js
```

---

### 문제 5: E2E 테스트 타임아웃 또는 실패

**증상**:
```
Timeout waiting for navigation after clicking "Run tests"
Error: Navigation timeout exceeded
```

**원인**:
- 로컬 개발 서버 미실행
- 네트워크 지연

**해결 방법**:

```bash
# 1. 개발 서버 시작
npm run dev  # http://localhost:5173

# 2. 테스트 실행 (별도 터미널)
npx playwright test tests/e2e/admin/admin-users.spec.ts

# 3. 또는 UI 모드로 실행 (권장)
npx playwright test tests/e2e/admin/admin-users.spec.ts --ui

# 4. 디버그 모드
npx playwright test tests/e2e/admin/admin-users.spec.ts --debug
```

---

### 문제 6: SQL 실행 후 "No rows returned"

**증상**:
```
Query successful
No rows returned
```

**원인**:
- admin@ideaonaction.local 계정 없음
- 오타 또는 이메일 대소문자 불일치

**해결 방법**:

```sql
-- 1. 정확한 이메일 확인
SELECT DISTINCT email FROM auth.users WHERE email LIKE '%admin%';

-- 2. 정확한 이메일로 다시 실행
UPDATE public.admins
SET role = 'super_admin', updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users
  WHERE email = 'admin@ideaonaction.local'  -- 이메일 정확히 확인
);

-- 3. 확인
SELECT * FROM public.admins WHERE role = 'super_admin';
```

---

### 문제 7: RLS 정책 위반 에러

**증상**:
```
Error: new row violates row-level security policy "admins_update_policy"
```

**원인**:
- RLS 정책에 의해 접근 거부
- 권한 부족 (super_admin이 아님)

**해결 방법**:

1. **로컬 Supabase**:
```bash
# RLS 정책 임시 비활성화 (개발 환경만)
npx supabase db reset
```

2. **프로덕션 Supabase**:
- Database → RLS Policies 확인
- admins 테이블 정책 검토
- 필요시 Policy 편집

---

### 빠른 진단 체크리스트

실행 전 다음을 확인하세요:

```bash
# 1. 프로젝트 디렉토리 확인
ls supabase/migrations/20251116000001_upgrade_admin_to_super_admin.sql

# 2. 마이그레이션 파일 내용 확인
cat supabase/migrations/20251116000001_upgrade_admin_to_super_admin.sql

# 3. 환경 변수 확인
cat .env.local | grep SUPABASE

# 4. Node.js 버전 확인
node --version  # v16+ 필요

# 5. npm 패키지 설치 확인
npm list supabase  # @supabase/supabase-js 설치 확인
```

---

## 📂 관련 파일

| 파일 | 역할 |
|------|------|
| `supabase/migrations/20251116000001_upgrade_admin_to_super_admin.sql` | 마이그레이션 SQL |
| `scripts/verify-super-admin.js` | 검증 스크립트 (Node.js) |
| `src/pages/admin/AdminUsers.tsx` | AdminUsers 페이지 컴포넌트 (Line 297) |
| `tests/e2e/admin/admin-users.spec.ts` | E2E 테스트 (18개) |
| `docs/database/super-admin-upgrade-guide.md` | 이 가이드 문서 |

---

## ❓ FAQ

### Q1. super_admin과 admin의 차이는?
- **admin**: 기본 관리자 (서비스, 주문, 블로그 관리)
- **super_admin**: 슈퍼 관리자 (사용자 관리, 역할 변경, 계정 삭제 권한 추가)

### Q2. 여러 계정을 super_admin으로 만들어도 되나요?
- 가능하지만, 보안을 위해 최소 1-2명만 권장
- 감사 로그로 모든 작업 추적 가능

### Q3. 실행 후 롤백하려면?
```sql
-- 역할 되돌리기
UPDATE public.admins
SET role = 'admin', updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@ideaonaction.local');
```

### Q4. 로컬 개발 환경에서도 실행해야 하나요?
- 네, 로컬과 프로덕션 모두 실행 필요
- 로컬: Supabase CLI (`supabase db reset`)
- 프로덕션: Supabase Dashboard SQL Editor

---

## 📝 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|-----------|
| 2025-11-16 | 2.0 | 3가지 실행 방법 추가 (Dashboard, Docker, 프로덕션) + 7가지 문제 해결 가이드 |
| 2025-11-16 | 1.0 | 최초 작성 (admin → super_admin 업그레이드) |

---

## 🎯 빠른 시작 (Quick Start)

**가장 빠른 방법 (Docker 없이, 2-3분)**:

```bash
# 1단계: Supabase Dashboard 접속
# https://supabase.com/dashboard

# 2단계: SQL Editor에서 다음 SQL 실행
# (supabase/migrations/20251116000001_upgrade_admin_to_super_admin.sql 전체 복사)

# 3단계: 검증
node scripts/verify-super-admin.js
```

---

**작성자**: Claude (AI Assistant)
**검토자**: Development Team
**최종 업데이트**: 2025-11-16 23:59 (Docker 없이 실행 가능한 가이드 추가)
