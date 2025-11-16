# CMS Phase 4 프로덕션 배포 체크리스트

**배포 대상**: IDEA on Action (https://www.ideaonaction.ai)
**배포 일시**: 2025-11-16
**Phase**: CMS Phase 4 - 문서화 & 배포 준비
**마이그레이션**: 20251116115700_fix_service_categories_complete.sql

---

## 📋 배포 전 준비 (Pre-Deployment)

### 1. 환경 확인
- [ ] Docker Desktop 실행 중
- [ ] Supabase CLI 설치 확인 (`supabase --version`)
- [ ] Node.js 버전 확인 (`node --version`: v18+)
- [ ] Git 상태 확인 (`git status`: clean)
- [ ] 프로덕션 URL 접속 확인 (https://www.ideaonaction.ai)

### 2. 백업
- [ ] **Supabase 프로덕션 DB 스냅샷 생성** (필수)
  - Dashboard → Settings → Database → Backups → Create Snapshot
  - 스냅샷 이름: `pre-cms-phase4-2025-11-16`
- [ ] 현재 RLS 정책 백업 (SQL 저장)
  ```sql
  -- Supabase Dashboard → SQL Editor에서 실행
  SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
  FROM pg_policies
  WHERE tablename = 'service_categories';
  -- 결과를 backups/rls-policies-before-phase4.sql 저장
  ```
- [ ] service_categories 테이블 데이터 백업
  ```sql
  SELECT * FROM service_categories ORDER BY created_at;
  -- 결과를 backups/service-categories-data-before-phase4.sql 저장
  ```

### 3. 로컬 환경 검증
- [ ] 로컬 DB 마이그레이션 성공 (`supabase db reset`)
  ```bash
  cd d:\GitHub\idea-on-action
  supabase db reset
  # 출력: "Applying migration 20251116115700_fix_service_categories_complete.sql..."
  # 예상 결과: 모든 마이그레이션 성공
  ```
- [ ] RLS 정책 확인 (`scripts/check-service-categories-schema.sql`)
  ```bash
  supabase db query < scripts/check-service-categories-schema.sql
  # 예상 출력:
  # - display_order 컬럼 존재
  # - 2개 RLS 정책 존재 (service_categories_anon_select, service_categories_authenticated_select)
  ```
- [ ] 로컬 빌드 성공 (`npm run build`: 0 errors)
  ```bash
  npm run build
  # 예상 출력: "dist/index.html ... kB / gzip: ... kB"
  ```
- [ ] TypeScript 타입 체크 (`npx tsc --noEmit`: 0 errors)
  ```bash
  npx tsc --noEmit
  # 예상 출력: (에러 없음)
  ```
- [ ] Lint 검사 (`npm run lint`: 0 critical errors)
  ```bash
  npm run lint
  # 예상 출력: "0 errors, X warnings" (경고만 있어도 OK)
  ```

### 4. 문서 검토
- [ ] 마이그레이션 가이드 숙지 (`docs/guides/database/service-categories-migration-guide.md`)
- [ ] 롤백 절차 숙지 (3가지 시나리오)
- [ ] 트러블슈팅 가이드 확인

---

## 🚀 배포 실행 (Deployment)

### Phase 1: 빌드 검증 (Local)

```bash
# 1. 최신 코드 pull
git pull origin main

# 2. 의존성 설치
npm install

# 3. 빌드 실행
npm run build

# 4. 빌드 산출물 확인
ls -lh dist/
# Windows PowerShell: Get-ChildItem dist\ | Format-Table -AutoSize

# 5. 로컬 미리보기
npm run preview
# http://localhost:4173 접속 테스트
```

**체크리스트**:
- [ ] 빌드 성공 (0 errors, 0 warnings)
- [ ] 번들 크기 확인 (index.js ~338 kB gzip)
- [ ] PWA precache 확인 (~2,167 KiB)
- [ ] 로컬 미리보기 정상 동작
  - [ ] /services 페이지 로드
  - [ ] 서비스 카드 표시
  - [ ] 카테고리 필터링 동작

---

### Phase 2: Supabase 마이그레이션 적용

#### Option A: Supabase CLI (권장)

```bash
# 1. 프로젝트 연결 확인
supabase status
# 예상 출력: "Project ID: zykjdneewbzyazfukzyg"

# 2. 마이그레이션 파일 확인
ls supabase/migrations/20251116115700_fix_service_categories_complete.sql
# Windows PowerShell: Test-Path supabase\migrations\20251116115700_fix_service_categories_complete.sql

# 3. 프로덕션 적용
supabase db push
# 예상 출력: "Applying migration 20251116115700_fix_service_categories_complete.sql... Done"

# 4. 적용 결과 확인
# (에러 없이 완료되어야 함)
```

**체크리스트**:
- [ ] 마이그레이션 성공 (no errors)
- [ ] RLS 정책 2개 생성 확인
- [ ] display_order 컬럼 존재 확인

#### Option B: Supabase Dashboard (대안)

1. **SQL Editor 접속**
   - https://supabase.com/dashboard/project/zykjdneewbzyazfukzyg/sql

2. **마이그레이션 SQL 복사**
   - `supabase/migrations/20251116115700_fix_service_categories_complete.sql` 내용 복사

3. **SQL 실행**
   - Editor에 붙여넣기 → Run
   - 예상 출력: "Success. No rows returned"

4. **검증 쿼리 실행**
   - `scripts/check-service-categories-schema.sql` 실행
   - 예상 출력:
     - display_order 컬럼: integer, nullable
     - RLS 정책 2개: service_categories_anon_select, service_categories_authenticated_select

**체크리스트**:
- [ ] SQL 실행 성공
- [ ] 검증 쿼리 결과 확인

---

### Phase 3: 검증 (Verification)

#### 3.1 Database 검증

```bash
# 1. 프로덕션 서비스 데이터 확인
node scripts/check-production-services.cjs

# 예상 출력:
# ====================================
# Production Services Data Check
# ====================================
#
# Total services: 4
# Services with main image: 4 (100.0%)
# Total gallery images: 8
# Average gallery images per service: 2.0
# Total features: 16
# Average features per service: 4.0
#
# Services Summary:
# 1. MVP 개발 서비스 (mvp)
#    - Main Image: ✓
#    - Gallery Images: 2
#    - Features: 4
# 2. Full-Stack 개발 서비스 (fullstack)
#    - Main Image: ✓
#    - Gallery Images: 2
#    - Features: 4
# ...
```

**체크리스트**:
- [ ] 4개 서비스 정상 조회
- [ ] 이미지 URL 존재 (4/4)
- [ ] Features 데이터 존재 (16개)

#### 3.2 RLS 정책 검증

Supabase Dashboard → Database → Policies → service_categories

**체크리스트**:
- [ ] `service_categories_anon_select` 정책 존재
  - Command: SELECT
  - Role: anon
  - USING: true
- [ ] `service_categories_authenticated_select` 정책 존재
  - Command: SELECT
  - Role: authenticated
  - USING: true
- [ ] 기존 정책 삭제 확인
  - "Active categories are viewable by everyone" (삭제됨)
  - "Authenticated users can view all categories" (삭제됨)

#### 3.3 애플리케이션 레벨 검증

**브라우저 테스트**:

1. **익명 사용자 테스트** (시크릿 모드)
   - [ ] https://www.ideaonaction.ai/services 접속
   - [ ] 서비스 목록 정상 표시 (4개)
   - [ ] 서비스 카테고리 필터링 동작
   - [ ] 서비스 상세 페이지 접속 (/services/mvp)
   - [ ] 이미지 로딩 확인
   - [ ] Features 섹션 표시 확인

2. **인증 사용자 테스트**
   - [ ] 로그인 후 /services 접속
   - [ ] 동일하게 정상 동작

3. **관리자 테스트**
   - [ ] Admin 로그인 (admin@ideaonaction.local)
   - [ ] /admin/services 접속
   - [ ] CRUD 작업 테스트
     - [ ] 새 서비스 생성
     - [ ] 기존 서비스 수정
     - [ ] 서비스 삭제
     - [ ] 카테고리 할당

**DevTools Console 확인**:
- [ ] Network 탭: 403 Forbidden 에러 없음
- [ ] Console 탭: RLS 정책 에러 없음
- [ ] Application 탭: Service Worker 정상 등록

---

### Phase 4: Vercel 배포

#### 4.1 자동 배포 확인

```bash
# Git 푸시 시 자동 배포
git push origin main
```

Vercel Dashboard → Deployments → 최신 배포 확인
- URL: https://vercel.com/idea-on-action/idea-on-action

**체크리스트**:
- [ ] 배포 상태: Success (✓)
- [ ] 빌드 로그: 0 errors
- [ ] 배포 시간: ~3-5분
- [ ] 배포 URL 접속 확인

#### 4.2 환경 변수 확인

Vercel Dashboard → Settings → Environment Variables

**필수 변수**:
- [ ] `VITE_SUPABASE_URL` = `https://zykjdneewbzyazfukzyg.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = `[키 확인]`
- [ ] `VITE_SENTRY_DSN` = `[키 확인]`
- [ ] `VITE_GA4_MEASUREMENT_ID` = `G-[ID]`
- [ ] `VITE_CHAT_WIDGET_TOKEN` = `[키 확인]`
- [ ] `VITE_TOSS_CLIENT_KEY` = `[키 확인]`

#### 4.3 도메인 확인

- [ ] https://www.ideaonaction.ai 정상 접속
- [ ] SSL 인증서 유효 (자물쇠 아이콘)
- [ ] CDN 캐시 정상 동작
- [ ] 리다이렉트 정상 (http → https)

---

## ✅ 배포 후 검증 (Post-Deployment)

### 1. 기능 테스트 (Smoke Test)

**서비스 페이지**:
- [ ] /services 목록 조회
  - 4개 서비스 표시
  - 이미지 로딩
  - Markdown 렌더링 (볼드, 이탤릭)
- [ ] 카테고리 필터링
  - "All" 버튼: 4개 표시
  - "Development" 버튼: 2개 표시 (MVP, Full-Stack)
  - "Design" 버튼: 1개 표시
  - "Operations" 버튼: 1개 표시
- [ ] 서비스 상세 페이지 (/services/mvp, /services/fullstack)
  - Hero 이미지 로딩
  - Description Markdown 렌더링
  - Features 섹션 표시 (4개)
  - Gallery 이미지 로딩 (2개)
- [ ] 이미지 로딩
  - Unsplash 이미지 정상 로드
  - Lazy loading 동작
- [ ] Features 표시
  - 아이콘 + 제목 + 설명
  - Markdown 렌더링

**Admin 페이지**:
- [ ] /admin/dashboard 접속
  - 통계 카드 표시
  - 차트 렌더링
- [ ] /admin/portfolio CRUD
  - 목록 조회
  - 생성 폼
  - 수정 폼
  - 삭제 다이얼로그
- [ ] /admin/lab CRUD
- [ ] /admin/team CRUD
- [ ] /admin/blog/categories CRUD
- [ ] /admin/tags CRUD
- [ ] /admin/users 접속 (super_admin 전용)
  - 권한 체크 정상 동작
  - 403 에러 없음

### 2. 성능 테스트

**Lighthouse 점수** (https://pagespeed.web.dev/):
- [ ] Performance: 90+ (목표: 95+)
- [ ] Accessibility: 90+ (목표: 100)
- [ ] Best Practices: 90+ (목표: 95+)
- [ ] SEO: 90+ (목표: 100)

**측정 방법**:
1. Chrome DevTools → Lighthouse 탭
2. Mode: Navigation
3. Device: Desktop + Mobile 각각 측정
4. 스크린샷 저장

**Core Web Vitals**:
- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] FID (First Input Delay): < 100ms (또는 INP < 200ms)
- [ ] CLS (Cumulative Layout Shift): < 0.1

**번들 크기 확인**:
- [ ] index.js gzip: ~338 kB (±10%)
- [ ] PWA precache: ~2,167 KiB (±10%)
- [ ] Total precache entries: ~34개

### 3. 에러 모니터링

**Sentry Dashboard**:
- URL: https://sentry.io/organizations/idea-on-action/projects/
- [ ] 새로운 에러 없음 (지난 1시간)
- [ ] 기존 에러율 증가 없음 (baseline 대비)
- [ ] Issue 우선순위 확인 (P0/P1 없음)

**Supabase Logs**:
- Dashboard → Logs → Query Performance
- [ ] RLS 정책 위반 로그 없음
- [ ] 비정상적인 쿼리 없음
- [ ] 느린 쿼리 없음 (< 1초)

**Browser Console**:
- [ ] JavaScript 에러 없음
- [ ] Network 에러 없음 (403, 500)
- [ ] CSP 위반 없음

### 4. 사용자 테스트

**실제 사용자 플로우**:
1. **홈페이지 → Services**
   - [ ] 홈페이지 접속
   - [ ] 네비게이션 "Services" 클릭
   - [ ] 서비스 목록 페이지 로드

2. **서비스 카테고리 필터링**
   - [ ] "Development" 버튼 클릭
   - [ ] 필터링된 서비스 표시 (2개)
   - [ ] 다른 카테고리 클릭 시 즉시 반영

3. **서비스 상세 보기**
   - [ ] 서비스 카드 클릭
   - [ ] 상세 페이지 로드 (< 1초)
   - [ ] 이미지, 설명, Features 모두 표시

4. **문의하기**
   - [ ] "문의하기" 버튼 클릭
   - [ ] 문의 폼 표시
   - [ ] 폼 제출 동작

---

## 🔄 롤백 절차 (Rollback)

### 즉시 롤백 필요 시 (Critical Error)

#### Scenario 1: RLS 정책 에러 (403 Forbidden)

**증상**:
- 사용자가 /services 접속 시 403 Forbidden
- Browser Console: "new row violates row-level security policy"

**롤백 방법**:

```sql
-- Supabase Dashboard → SQL Editor에서 실행

-- 1. 신규 정책 삭제
DROP POLICY IF EXISTS "service_categories_anon_select" ON service_categories;
DROP POLICY IF EXISTS "service_categories_authenticated_select" ON service_categories;

-- 2. 기존 정책 재생성
CREATE POLICY "Active categories are viewable by everyone"
  ON public.service_categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all categories"
  ON public.service_categories FOR SELECT
  TO authenticated
  USING (true);

-- 3. 검증
SELECT * FROM service_categories LIMIT 1;
```

**확인**:
- [ ] SQL 실행 성공
- [ ] /services 페이지 정상 로드
- [ ] 403 에러 사라짐

#### Scenario 2: display_order 컬럼 에러

**증상**:
- Admin CRUD 시 "column display_order does not exist"
- 서비스 정렬 오류

**롤백 방법**:

```sql
-- Supabase Dashboard → SQL Editor에서 실행

-- 1. display_order 컬럼 삭제
ALTER TABLE service_categories DROP COLUMN IF EXISTS display_order;

-- 2. Admin 페이지 확인
-- (display_order 없이도 CRUD 동작해야 함)
```

**확인**:
- [ ] SQL 실행 성공
- [ ] Admin CRUD 정상 동작
- [ ] 서비스 정렬은 created_at 기준으로 fallback

#### Scenario 3: 전체 마이그레이션 롤백

**증상**:
- 서비스 데이터 손실
- 치명적 DB 에러

**롤백 방법 A: Supabase DB 스냅샷 복원**

1. Supabase Dashboard → Settings → Database → Backups
2. `pre-cms-phase4-2025-11-16` 스냅샷 선택
3. "Restore" 클릭
4. 복원 완료 대기 (~5-10분)
5. 복원 완료 후 확인:
   - [ ] 서비스 데이터 4개 존재
   - [ ] RLS 정책 2개 존재 (기존)
   - [ ] display_order 컬럼 없음

**롤백 방법 B: 수동 백업 SQL 실행**

```bash
# 1. 백업 SQL 복원
supabase db query < backups/service-categories-data-before-phase4.sql

# 2. RLS 정책 복원
supabase db query < backups/rls-policies-before-phase4.sql

# 3. 검증
node scripts/check-production-services.cjs
```

**확인**:
- [ ] 서비스 데이터 복원
- [ ] RLS 정책 복원
- [ ] /services 페이지 정상 동작

#### Vercel 배포 롤백

**증상**:
- 프론트엔드 빌드 에러
- JavaScript 런타임 에러

**롤백 방법**:

1. Vercel Dashboard → Deployments
2. 이전 성공 배포 선택 (예: 2025-11-15 배포)
3. "Promote to Production" 클릭
4. 1-2분 대기
5. https://www.ideaonaction.ai 접속 확인

**확인**:
- [ ] 배포 상태: Success
- [ ] 프론트엔드 정상 동작
- [ ] JavaScript 에러 없음

---

## 📊 배포 후 모니터링 (24시간)

### 1시간 후 체크
- [ ] **에러율 확인** (Sentry)
  - 신규 에러: 0건 예상
  - 에러율: < 0.1%
- [ ] **RLS 정책 로그 확인** (Supabase)
  - Query Performance: 정상
  - 403 에러: 0건
- [ ] **사용자 피드백 확인**
  - 슬랙/이메일 체크
  - 버그 리포트 없음

### 6시간 후 체크
- [ ] **Lighthouse 점수 재측정**
  - Performance: 90+ 유지
  - 기준선 대비 ±5% 이내
- [ ] **Core Web Vitals 확인**
  - LCP: < 2.5s
  - FID/INP: < 200ms
  - CLS: < 0.1
- [ ] **서버 응답 시간 확인** (Vercel Analytics)
  - p50: < 100ms
  - p95: < 500ms
  - p99: < 1s

### 24시간 후 체크
- [ ] **누적 에러 리포트** (Sentry)
  - 총 에러 수: < 10건
  - 신규 Issue: 0건
  - 미해결 P0/P1: 0건
- [ ] **사용자 행동 분석** (GA4)
  - /services 페이지뷰 증가율
  - 평균 세션 시간 유지
  - 이탈률 변화 없음 (±5%)
- [ ] **성능 저하 여부 확인**
  - Lighthouse 점수 유지
  - 빌드 시간 증가 없음
  - 번들 크기 증가 < 5%

---

## 📝 배포 완료 보고

### 배포 결과 기록

**배포 일시**: 2025-11-16 [시간]
**배포자**: [이름]
**배포 상태**: ✅ 성공 / ⚠️ 부분 성공 / ❌ 실패

**체크리스트 완료율**:
- 배포 전 준비: __/16 (___%)
- 배포 실행: __/20 (___%)
- 배포 후 검증: __/35 (___%)
- **총 완료율**: __/71 (___%)

**주요 지표**:
- 빌드 시간: ___초
- 초기 번들 크기 (gzip): ___ kB
- PWA precache: ___ KiB
- Lighthouse 점수: Performance ___, Accessibility ___, Best Practices ___, SEO ___
- 배포 소요 시간: ___분

**발견된 이슈**:
- 없음 / [이슈 설명]

**후속 조치**:
- 없음 / [조치 계획]

**배포 완료 커밋**:
```
git commit -m "deploy: CMS Phase 4 to production - service_categories RLS fix

- Applied migration: 20251116115700_fix_service_categories_complete.sql
- Fixed RLS policies for anonymous users
- Added display_order column for custom sorting
- Verified 4 services with images and features

Checklist: 71/71 (100%)
Lighthouse: P ___, A ___, BP ___, SEO ___
"
```

---

## 📚 관련 문서

### 프로젝트 문서
- **마이그레이션 가이드**: `docs/guides/database/service-categories-migration-guide.md`
- **CMS 가이드**: `docs/guides/cms/`
- **Admin 가이드**: `docs/guides/cms/admin-guide.md`
- **검증 보고서**: `docs/archive/2025-11-16/cms-phase4-validation-report-2025-11-16.md`
- **Changelog**: `docs/project/changelog.md`

### 외부 문서
- **Supabase RLS**: https://supabase.com/docs/guides/auth/row-level-security
- **Vercel Deployment**: https://vercel.com/docs/deployments/overview
- **Vite Build**: https://vitejs.dev/guide/build.html

---

## 🆘 긴급 연락처

**프로젝트 담당자**:
- 이름: 서민원
- 이메일: sinclairseo@gmail.com
- 전화: 010-4904-2671

**Supabase Support**:
- Dashboard: https://supabase.com/dashboard/support
- Discord: https://discord.supabase.com/

**Vercel Support**:
- Support: https://vercel.com/help
- Status: https://www.vercel-status.com/

---

**체크리스트 버전**: 1.0
**최종 업데이트**: 2025-11-16
**다음 리뷰**: 2025-11-17 (배포 후 24시간)
