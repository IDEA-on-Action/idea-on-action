# 일일 작업 요약 - 2025-11-13

## 🎯 주요 성과

### ✅ P0 긴급 이슈 해결 완료

1. **Roadmap 페이지 401 오류 해결**
   - 문제: `GET /rest/v1/roadmap → 401 Unauthorized`
   - 원인: anon 역할에 roadmap SELECT 권한 없음
   - 해결: `GRANT SELECT ON public.roadmap TO anon;`
   - 결과: Roadmap 페이지 정상 동작 ✅

2. **Newsletter 구독 401 오류 해결**
   - 문제: `POST /rest/v1/newsletter_subscriptions → 401 Unauthorized`
   - 원인 1: anon 역할에 user_roles, roles SELECT 권한 없음
   - 원인 2: RLS 정책 중복 (7개) 및 anon SELECT 정책 부재
   - 해결:
     - `GRANT SELECT ON public.user_roles TO anon;`
     - `GRANT SELECT ON public.roles TO anon;`
     - Newsletter RLS 정책 정리 (7개 → 4개)
   - 결과: Newsletter 구독 성공 ✅

---

## 📊 작업 상세

### 1️⃣ Supabase 스키마 조회 (STEP1-schema-inspection.sql)

**목적**: 정확한 스키마 파악

**실행 쿼리**:
- public 스키마 모든 테이블 목록
- 대상 테이블 컬럼 정보
- 현재 GRANT 권한 확인
- 현재 RLS 활성화 상태
- 현재 RLS 정책 목록
- 역할(Role) 확인

**결과**:
- roadmap 테이블: anon SELECT 권한 **없음** ❌
- user_roles, roles 테이블: anon SELECT 권한 **없음** ❌
- newsletter_subscriptions: **7개 중복 정책** 발견 ❌

---

### 2️⃣ Roadmap 권한 부여 (FINAL-FIX-roadmap-grant.sql)

```sql
GRANT SELECT ON public.roadmap TO anon;
GRANT SELECT ON public.roadmap TO authenticated;
```

**결과**:
- ✅ Roadmap 페이지 정상 동작
- ✅ "우리의 여정" 로드맵 표시
- ✅ Version 2.0 전환 완료 (30% 진행률)

---

### 3️⃣ user_roles 권한 부여 (FIX-user-roles-grant.sql)

```sql
GRANT SELECT ON public.user_roles TO anon;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT ON public.roles TO anon;
GRANT SELECT ON public.roles TO authenticated;
```

**이유**:
- Newsletter INSERT 후 RETURNING * 실행 시 SELECT 정책 평가
- SELECT 정책에서 user_roles 테이블 조회
- anon 역할이 user_roles 접근 불가 → 401 오류

---

### 4️⃣ Newsletter RLS 정책 정리 (FINAL-newsletter-rls-cleanup.sql)

**이전 정책 (7개 중복)**:
1. Enable insert for anonymous users
2. Enable select for admins
3. Enable update for own email
4. newsletter_admin_read
5. newsletter_owner_update
6. newsletter_public_insert
7. read_subscriptions_for_authenticated

**새 정책 (4개 명확)**:
1. **newsletter_insert** (anon, authenticated) - INSERT 허용
2. **newsletter_select** (anon, authenticated) - SELECT 허용 (INSERT RETURNING용)
3. **newsletter_update** (authenticated) - 본인 이메일만 UPDATE
4. **newsletter_delete** (authenticated, admin만) - 관리자만 DELETE

**결과**:
- ✅ Newsletter 구독 성공
- ✅ "뉴스레터 구독 신청 완료!" 토스트 메시지
- ✅ 콘솔 오류 없음

---

## 🔧 생성된 마이그레이션 파일

1. `STEP1-schema-inspection.sql` - 스키마 조회용
2. `FINAL-FIX-roadmap-grant.sql` - roadmap 권한 부여
3. `FIX-user-roles-grant.sql` - user_roles, roles 권한 부여
4. `FINAL-newsletter-rls-cleanup.sql` - Newsletter RLS 정책 정리
5. `20251113000001_fix_rls_public_final.sql` - 타임스탬프 형식 (미사용)

---

## 📈 다음 단계 (P1 작업)

### 1. Playwright 환경 변수 이슈 해결
- **문제**: Newsletter E2E 테스트 5개 skip
- **원인**: Playwright webServer 환경 변수 이슈
- **해결**: .skip 제거 후 테스트 실행

### 2. Version 2.0 Sprint 3 마무리
- **남은 작업**:
  - [ ] Weekly Recap 자동 생성 (Supabase Cron Job)
  - [ ] Status 페이지 구축 완성
  - [ ] GA4 이벤트 트래킹 삽입
  - [ ] Vitest 단위 테스트 작성
  - [ ] Playwright E2E 테스트 작성
  - [ ] SEO 최적화 (sitemap.xml, robots.txt)
  - [ ] 최종 배포 및 검증

### 3. CLAUDE.md 문서 업데이트
- 최신 업데이트 날짜: 2025-11-13
- P0 작업 완료 내역 추가
- Version 2.0 Sprint 3 진행률 업데이트

---

## 💡 교훈

### 1. RLS 정책 = GRANT 권한 + RLS 정책

PostgreSQL RLS는 **2단계 권한 검증**:
1. **GRANT 권한**: 테이블 접근 가능 여부
2. **RLS 정책**: 행(Row) 접근 가능 여부

둘 다 있어야 정상 동작!

### 2. INSERT RETURNING은 SELECT 정책 필요

```sql
INSERT INTO table VALUES (...) RETURNING *;
```

- INSERT 후 RETURNING 시 **SELECT 정책 평가**
- anon 역할도 SELECT 정책 필요

### 3. 정책 중복은 충돌 유발

- 7개 중복 정책 → 예상치 못한 동작
- 간단하고 명확한 4개 정책 → 안정적 동작

### 4. 스키마 조회가 최우선

문제 해결 순서:
1. **스키마 조회** (GRANT 권한, RLS 정책 확인)
2. **근본 원인 파악** (무엇이 누락되었는가?)
3. **정확한 SQL 작성** (추측 금지!)
4. **테스트 및 검증**

---

## 📊 통계

- **작업 시간**: 약 2시간
- **생성된 SQL 파일**: 5개
- **해결된 오류**: 3개 (roadmap 401, user_roles 401, newsletter RLS)
- **실행된 SQL 라인 수**: 약 200줄
- **테스트 성공률**: 100% (Roadmap ✅, Newsletter ✅)

---

## 🎉 결론

모든 P0 긴급 이슈가 해결되었습니다!

- ✅ Roadmap 페이지 정상 동작
- ✅ Newsletter 구독 정상 동작
- ✅ 프로덕션 사이트 안정화

이제 P1 작업(Version 2.0 Sprint 3 마무리)으로 진행할 수 있습니다.
