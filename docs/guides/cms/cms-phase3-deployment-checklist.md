# CMS Phase 3 배포 체크리스트

## 개요

CMS Phase 3 (문서화 & 배포 준비) 완료 후 프로덕션 환경에 안전하게 배포하기 위한 전체 체크리스트입니다. Pre-deployment, Deployment, Post-deployment의 3단계로 구성되어 있으며, 각 단계마다 필수 확인 사항과 롤백 시나리오를 포함합니다.

**버전**: 2.0.1
**작성일**: 2025-11-16
**소요 시간**: 약 2-3시간 (전체 프로세스)

---

## Pre-deployment (배포 전 준비)

### 1. 환경 확인 (5분)

- [ ] **Docker Desktop 실행 중** - Supabase 로컬 DB 필요
- [ ] **Node.js 버전 확인** - `node -v` (v18.x 이상)
- [ ] **npm 의존성 최신화** - `npm install` 실행
- [ ] **Git 상태 Clean** - `git status` (uncommitted changes 없음)
- [ ] **현재 브랜치 확인** - `main` 브랜치에서 작업

### 2. 문서 검증 (10분)

- [ ] **Admin 가이드 6개 존재**
  - `docs/guides/cms/admin-portfolio-guide.md`
  - `docs/guides/cms/admin-lab-guide.md`
  - `docs/guides/cms/admin-team-guide.md`
  - `docs/guides/cms/admin-blog-categories-guide.md`
  - `docs/guides/cms/admin-tags-guide.md`
  - `docs/guides/cms/admin-users-guide.md`

- [ ] **API 문서 7개 존재**
  - `docs/guides/cms/api/use-projects.md`
  - `docs/guides/cms/api/use-roadmap-items.md`
  - `docs/guides/cms/api/use-portfolio-items.md`
  - `docs/guides/cms/api/use-lab-items.md`
  - `docs/guides/cms/api/use-team-members.md`
  - `docs/guides/cms/api/use-blog-categories.md`
  - `docs/guides/cms/api/use-tags.md`

- [ ] **배포 체크리스트 존재**
  - 현재 읽고 있는 이 파일!

### 3. 데이터베이스 백업 (15분)

- [ ] **로컬 DB 백업**
  ```bash
  # Supabase CLI 백업
  supabase db dump -f backup/cms-phase3-pre-deploy-$(date +%Y%m%d%H%M%S).sql
  ```

- [ ] **프로덕션 DB 백업** (Supabase Dashboard)
  1. https://supabase.com/dashboard 접속
  2. 프로젝트 선택 (`zykjdneewbzyazfukzyg`)
  3. Database → Backups → Manual Backup 클릭
  4. 백업 이름: `cms-phase3-pre-deploy-YYYYMMDD`
  5. 백업 완료 확인 (5-10분 소요)

- [ ] **백업 파일 확인**
  - 로컬: `backup/*.sql` 파일 존재
  - 프로덕션: Backups 페이지에서 백업 목록 확인

### 4. 로컬 DB 마이그레이션 테스트 (10분)

- [ ] **Newsletter 보안 마이그레이션 확인**
  ```bash
  # 마이그레이션 파일 존재 확인
  ls supabase/migrations/20251121000000_fix_newsletter_security_issues.sql
  ```

- [ ] **로컬 DB 리셋 및 마이그레이션 적용**
  ```bash
  supabase db reset
  # 출력: All migrations applied successfully
  ```

- [ ] **마이그레이션 상태 확인**
  ```bash
  supabase migration list
  # 20251121000000_fix_newsletter_security_issues.sql: applied
  ```

- [ ] **RLS 정책 검증**
  ```sql
  -- scripts/validation/check-newsletter-security.sql 실행
  -- Expected: All checks pass
  ```

### 5. 빌드 검증 (10분)

- [ ] **TypeScript 타입 체크**
  ```bash
  npx tsc --noEmit
  # Expected: 0 errors
  ```

- [ ] **ESLint 검사**
  ```bash
  npm run lint
  # Expected: 0-2 warnings (허용 가능)
  ```

- [ ] **프로덕션 빌드**
  ```bash
  npm run build
  # Expected: Build successful
  ```

- [ ] **빌드 결과 확인**
  - `dist/` 폴더 생성됨
  - `dist/index.html` 파일 존재
  - 빌드 시간: 20-30초 이내
  - 번들 크기: 메인 번들 gzip < 70 kB

- [ ] **PWA 캐시 검증**
  ```bash
  # dist/.vite/manifest.json 확인
  cat dist/.vite/manifest.json | grep "precache"
  # Expected: 26-30 entries
  ```

### 6. E2E 테스트 검증 (30분)

- [ ] **개발 서버 실행**
  ```bash
  npm run dev
  # localhost:8080에서 실행 확인
  ```

- [ ] **E2E 테스트 실행** (별도 터미널)
  ```bash
  npx playwright test
  # Expected: 177/177 tests passed (100%)
  ```

- [ ] **Admin 페이지 테스트 확인**
  - `admin-portfolio.spec.ts`: 15개 테스트 통과
  - `admin-lab.spec.ts`: 11개 테스트 통과
  - `admin-team.spec.ts`: 10개 테스트 통과
  - `admin-blog-categories.spec.ts`: 24개 테스트 통과
  - `admin-tags.spec.ts`: 24개 테스트 통과
  - `admin-users.spec.ts`: 18개 테스트 통과

- [ ] **실패한 테스트 분석** (있을 경우)
  - `playwright show-report` 실행
  - 실패 원인 파악 및 수정
  - 재실행하여 통과 확인

---

## Deployment (배포)

### 7. 프로덕션 DB 마이그레이션 (15분)

- [ ] **Supabase Dashboard 접속**
  1. https://supabase.com/dashboard/project/zykjdneewbzyazfukzyg
  2. SQL Editor로 이동

- [ ] **Newsletter 보안 마이그레이션 적용**
  1. `supabase/migrations/20251121000000_fix_newsletter_security_issues.sql` 열기
  2. SQL 전체 복사
  3. SQL Editor에 붙여넣기
  4. Run 버튼 클릭
  5. 성공 메시지 확인: "Success. Rows returned: 0"

- [ ] **RLS 정책 검증** (SQL Editor)
  ```sql
  -- 1. newsletter_subscribers 뷰 확인
  SELECT * FROM newsletter_subscribers LIMIT 1;
  -- Expected: auth.users 노출 없음

  -- 2. RLS 정책 확인
  SELECT tablename, policyname
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'newsletter_subscribers';
  -- Expected: select_public, update_public 정책 존재
  ```

- [ ] **마이그레이션 로그 기록**
  - 마이그레이션 시간: ___________
  - 적용 결과: ✅ 성공 / ❌ 실패
  - 에러 메시지 (있을 경우): ___________

### 8. 환경 변수 확인 (5분)

- [ ] **Vercel 환경 변수 확인**
  1. https://vercel.com/idea-on-action/idea-on-action/settings/environment-variables
  2. Production 탭 선택
  3. 필수 환경 변수 존재 확인:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_GA_MEASUREMENT_ID`
     - `VITE_SENTRY_DSN`

- [ ] **환경 변수 값 검증**
  - Supabase URL: `https://zykjdneewbzyazfukzyg.supabase.co`
  - Anon Key: 최신 키 사용 중
  - GA ID: `G-*` 형식
  - Sentry DSN: `https://*@sentry.io/*` 형식

### 9. Git 커밋 및 푸시 (5분)

- [ ] **변경사항 스테이징**
  ```bash
  git add docs/guides/cms/api/*.md
  git add docs/guides/cms/admin-*.md
  git add docs/guides/cms/cms-phase3-deployment-checklist.md
  ```

- [ ] **커밋 메시지 작성**
  ```bash
  git commit -m "docs(cms): add Phase 3 API docs and deployment checklist

  - Add 4 API documentation files (useLabItems, useTeamMembers, useBlogCategories, useTags)
  - Add CMS Phase 3 deployment checklist (71 items)
  - Total: 5 files, ~20,000 words

  Phase 3 documentation complete, ready for production deployment"
  ```

- [ ] **원격 푸시**
  ```bash
  git push origin main
  ```

- [ ] **푸시 성공 확인**
  - GitHub Actions 워크플로우 트리거됨
  - https://github.com/IDEA-on-Action/idea-on-action/actions

### 10. Vercel 배포 (10분)

- [ ] **Vercel 자동 배포 확인**
  1. https://vercel.com/idea-on-action/idea-on-action/deployments
  2. 최신 배포 상태: Building → Deploying → Ready
  3. 배포 시간: 2-3분 소요

- [ ] **배포 로그 확인**
  - Build Command: `npm run build` 성공
  - Output Directory: `dist` 생성됨
  - TypeScript: 0 errors
  - ESLint: 0-2 warnings
  - Build Time: 20-30초

- [ ] **배포 URL 확인**
  - Production: https://www.ideaonaction.ai
  - Preview: https://idea-on-action-*.vercel.app

- [ ] **배포 성공 확인**
  - Status: ✅ Ready
  - Lighthouse Score: 90+ (Performance, Accessibility, Best Practices, SEO)

---

## Post-deployment (배포 후 검증)

### 11. 기능 테스트 - Admin 페이지 (15분)

- [ ] **Admin 로그인**
  1. https://www.ideaonaction.ai/admin 접속
  2. 관리자 계정 로그인: `admin@ideaonaction.local`
  3. 대시보드 정상 표시 확인

- [ ] **Admin Portfolio 페이지**
  - `/admin/portfolio` 접속
  - 프로젝트 목록 표시 확인
  - 새 프로젝트 생성 테스트
  - 수정/삭제 기능 작동 확인

- [ ] **Admin Lab 페이지**
  - `/admin/lab` 접속
  - 바운티 목록 표시 확인
  - 새 바운티 생성 테스트
  - 상태 변경 기능 작동 확인

- [ ] **Admin Team 페이지**
  - `/admin/team` 접속
  - 팀원 목록 표시 확인
  - 새 팀원 추가 테스트
  - Active/Inactive 토글 작동 확인

- [ ] **Admin Blog Categories 페이지**
  - `/admin/blog/categories` 접속
  - 카테고리 목록 표시 확인
  - 새 카테고리 생성 테스트 (색상, 아이콘 선택)
  - 수정/삭제 기능 작동 확인

- [ ] **Admin Tags 페이지**
  - `/admin/tags` 접속
  - 태그 목록 표시 확인 (사용 횟수 순 정렬)
  - 새 태그 생성 테스트
  - 인기 태그 표시 확인

- [ ] **Admin Users 페이지**
  - `/admin/users` 접속 (super_admin만 접근 가능)
  - 관리자 목록 표시 확인
  - Role 변경 기능 작동 확인 (editor ↔ admin)

### 12. 기능 테스트 - Newsletter (10분)

- [ ] **Newsletter 구독 기능**
  1. 홈페이지 Footer에서 Newsletter 섹션 확인
  2. 이메일 입력: `test+newsletter@example.com`
  3. 구독 버튼 클릭
  4. 성공 메시지 확인: "뉴스레터 구독이 완료되었습니다!"

- [ ] **Newsletter 보안 검증**
  ```sql
  -- Supabase SQL Editor에서 실행
  SELECT * FROM newsletter_subscribers WHERE newsletter_email LIKE 'test%';
  -- Expected: test+newsletter@example.com 존재
  -- Expected: auth.users 데이터 노출 없음
  ```

- [ ] **Newsletter 구독 취소 기능**
  1. Newsletter 이메일에서 "구독 취소" 링크 클릭 (또는 Footer에서 재시도)
  2. 구독 취소 버튼 클릭
  3. 성공 메시지 확인: "구독이 취소되었습니다."

### 13. 성능 테스트 (10분)

- [ ] **Lighthouse 점수 확인**
  1. Chrome DevTools → Lighthouse 실행
  2. 모드: Production, Desktop
  3. 목표 점수:
     - Performance: 90+
     - Accessibility: 90+
     - Best Practices: 90+
     - SEO: 90+

- [ ] **Core Web Vitals 확인**
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

- [ ] **번들 크기 확인**
  - 메인 번들 gzip: < 70 kB
  - 전체 페이지 로딩: < 3 MB
  - PWA 캐시: 26-30 entries

- [ ] **페이지 로딩 시간**
  - 홈페이지: < 2초
  - Admin 페이지: < 3초
  - 블로그 포스트: < 2초

### 14. 에러 모니터링 (10분)

- [ ] **Sentry 대시보드 확인**
  1. https://sentry.io 접속
  2. idea-on-action 프로젝트 선택
  3. Issues 탭 확인
  4. 최근 1시간 에러: 0건 (목표)

- [ ] **Sentry 알림 설정 확인**
  - Email 알림: 활성화
  - Slack 알림: 활성화 (선택 사항)
  - 알림 임계값: Error 이상

- [ ] **에러 발생 시 조치**
  - 에러 내용 확인 (스택 트레이스)
  - 재현 가능 여부 확인
  - 즉시 수정 가능하면 핫픽스 배포
  - 수정 불가능하면 롤백 고려

### 15. Google Analytics 확인 (5분)

- [ ] **GA4 실시간 데이터 확인**
  1. https://analytics.google.com 접속
  2. 실시간 보고서 선택
  3. 현재 활성 사용자: 1명 이상 (본인)
  4. 페이지뷰 이벤트 발생 확인

- [ ] **이벤트 추적 확인**
  - `page_view` 이벤트 발생
  - `admin_login` 이벤트 발생 (Admin 로그인 시)
  - `newsletter_subscribe` 이벤트 발생 (Newsletter 구독 시)

---

## Rollback 절차 (문제 발생 시)

### 시나리오 1: Newsletter RLS 정책 오류

**증상**: Newsletter 구독/취소 실패, "permission denied" 에러

**원인**: RLS 정책 적용 실패 또는 잘못된 권한 설정

**해결**:
1. **즉시 롤백 (5분)**
   ```sql
   -- Supabase SQL Editor에서 실행
   -- RLS 정책 삭제
   DROP POLICY IF EXISTS select_public ON newsletter_subscribers;
   DROP POLICY IF EXISTS update_public ON newsletter_subscribers;

   -- 기존 정책 재생성 (백업된 SQL 사용)
   -- 또는 수동으로 anon/authenticated 권한 부여
   GRANT SELECT ON newsletter_subscribers TO anon, authenticated;
   ```

2. **검증**
   - Newsletter 구독 테스트
   - 구독 취소 테스트
   - 에러 로그 확인

### 시나리오 2: Admin 페이지 접근 불가

**증상**: Admin 페이지 접속 시 "Access Denied" 또는 404 에러

**원인**: 인증 시스템 오류, RLS 정책 문제, 또는 라우팅 문제

**해결**:
1. **브라우저 캐시 클리어** (2분)
   - Chrome DevTools → Application → Clear Storage
   - 페이지 새로고침 (Ctrl+Shift+R)

2. **로컬에서 재현** (10분)
   ```bash
   # 로컬 개발 서버 실행
   npm run dev

   # Admin 페이지 접속 테스트
   # http://localhost:8080/admin
   ```

3. **Vercel 이전 버전 복원** (5분)
   - Vercel Dashboard → Deployments
   - 이전 성공 버전 선택
   - "Promote to Production" 클릭

### 시나리오 3: E2E 테스트 대량 실패

**증상**: 배포 후 177개 테스트 중 50개 이상 실패

**원인**: DB 마이그레이션 불완전, 환경 변수 누락, 또는 API 변경

**해결**:
1. **검증 스크립트 실행** (5분)
   ```bash
   # 로컬 DB 상태 확인
   node scripts/validation/check-all-services-data.cjs

   # 프로덕션 DB 상태 확인 (Supabase SQL Editor)
   # scripts/validation/check-services-schema.sql 실행
   ```

2. **DB 백업 복원** (15분)
   - Supabase Dashboard → Backups
   - `cms-phase3-pre-deploy` 백업 선택
   - Restore 버튼 클릭
   - 복원 완료 대기 (10분)

3. **Vercel 롤백** (5분)
   - 이전 버전으로 복원 (시나리오 2 참조)

---

## 24시간 모니터링 체크포인트

### 1시간 후 (배포 직후)

- [ ] **Sentry 에러 확인**: 0-2건 (허용 가능)
- [ ] **GA4 실시간 데이터**: 페이지뷰 정상 수집
- [ ] **Newsletter 기능**: 구독/취소 정상 작동
- [ ] **Admin 페이지**: 모든 CRUD 작업 정상

### 8시간 후 (다음 업무 시간)

- [ ] **Sentry 에러 누적**: < 10건
- [ ] **GA4 사용자 활동**: 정상 범위 (이전 대비 ±20%)
- [ ] **Vercel 로그**: 500 에러 없음
- [ ] **Lighthouse 점수**: 90+ 유지

### 24시간 후 (완전 안정화)

- [ ] **Sentry 에러 분석**: 패턴 파악, 수정 계획 수립
- [ ] **GA4 전환율**: Newsletter 구독 전환율 확인
- [ ] **성능 추세**: Core Web Vitals 안정적
- [ ] **사용자 피드백**: 버그 리포트 없음

**최종 확인**:
- [ ] CLAUDE.md 업데이트 (배포 완료 기록)
- [ ] Changelog.md 업데이트 (버전 2.0.1 기록)
- [ ] 팀 공유 (슬랙/이메일)

---

## 문제 발생 시 연락처

**개발자**: 서민원
**이메일**: sinclairseo@gmail.com
**전화**: 010-4904-2671

**Supabase 지원**: https://supabase.com/dashboard/support
**Vercel 지원**: https://vercel.com/support
**Sentry 지원**: https://sentry.io/support

---

## 체크리스트 요약

**Pre-deployment**: 16개 항목
**Deployment**: 20개 항목
**Post-deployment**: 35개 항목
**Rollback**: 3개 시나리오
**Monitoring**: 3개 체크포인트

**총 소요 시간**: 약 2-3시간
**권장 배포 시간**: 평일 오전 10-11시 (모니터링 시간 확보)

---

**마지막 업데이트**: 2025-11-16
**작성자**: Claude (AI Assistant)
**검토자**: 서민원
