# Services Platform 프로덕션 배포 계획

**배포 대상**: Supabase 프로덕션 DB (https://zykjdneewbzyazfukzyg.supabase.co)
**배포 일시**: 2025-11-18
**담당자**: Claude AI + User
**목적**: 토스페이먼츠 심사용 서비스 플랫폼 데이터 배포

---

## 📋 배포 전 체크리스트

### 1. 로컬 검증 완료 ✅

- [x] 로컬 DB 마이그레이션 성공 (`supabase db reset`)
- [x] 4개 서비스 데이터 조회 테스트 통과
- [x] RLS 정책 검증 (Anonymous SELECT, Admin CRUD)
- [x] 데이터 무결성 확인 (11개 패키지, 35개 결과물, 21단계, 36 FAQ)

### 2. 백업 생성 ⏳

**중요**: 프로덕션 DB 백업은 필수입니다!

```bash
# Supabase Dashboard에서 백업 생성
# 1. Supabase Studio → Project Settings → Database
# 2. "Create Backup" 버튼 클릭
# 3. 백업 이름: "pre-services-platform-deploy-2025-11-18"
# 4. 백업 완료 확인
```

**또는 pg_dump 사용**:
```bash
# 프로덕션 DB 백업 (로컬에 저장)
pg_dump "postgresql://postgres:[PASSWORD]@db.zykjdneewbzyazfukzyg.supabase.co:5432/postgres" > backup-2025-11-18.sql
```

### 3. 마이그레이션 파일 검토 ✅

**적용할 마이그레이션** (4개):
1. `20251118000000_extend_services_table.sql` - services 테이블 확장
2. `20251118000001_create_service_packages_table.sql` - 패키지 테이블 생성
3. `20251118000002_create_subscription_plans_table.sql` - 플랜 테이블 생성
4. `20251118000003_add_services_content_data.sql` - 콘텐츠 데이터 추가

**영향 범위**:
- 기존 데이터: **영향 없음** (NULL 허용 컬럼 추가)
- 새 테이블: 2개 생성
- RLS 정책: 14개 추가
- 서비스 데이터: 4개 UPDATE (pricing_data, deliverables, process_steps, faq)

### 4. 롤백 계획 준비 ✅

**롤백 스크립트**:
```sql
-- 긴급 롤백 (마이그레이션 취소)
BEGIN;

-- Step 1: 콘텐츠 데이터 제거
UPDATE public.services
SET pricing_data = NULL, deliverables = NULL, process_steps = NULL, faq = NULL
WHERE slug IN ('mvp-development', 'fullstack-development', 'design-system', 'operations-management');

-- Step 2: 새 테이블 삭제
DROP TABLE IF EXISTS public.subscription_plans CASCADE;
DROP TABLE IF EXISTS public.service_packages CASCADE;

-- Step 3: services 컬럼 제거
ALTER TABLE public.services
DROP COLUMN IF EXISTS pricing_data,
DROP COLUMN IF EXISTS deliverables,
DROP COLUMN IF EXISTS process_steps,
DROP COLUMN IF EXISTS faq;

COMMIT;
```

---

## 🚀 배포 절차

### Option A: Supabase CLI 사용 (권장)

```bash
# 1. Supabase 프로젝트 링크 확인
supabase link --project-ref zykjdneewbzyazfukzyg

# 2. 로컬 마이그레이션 상태 확인
supabase db diff

# 3. 마이그레이션 적용 (프로덕션)
supabase db push

# 4. 마이그레이션 성공 확인
# - Supabase Studio → Database → Schema → public
# - services 테이블 컬럼 확인
# - service_packages, subscription_plans 테이블 존재 확인
```

### Option B: Supabase Studio SQL Editor

```bash
# 1. Supabase Studio 접속
https://supabase.com/dashboard/project/zykjdneewbzyazfukzyg/editor

# 2. SQL Editor 열기

# 3. 마이그레이션 파일 내용 복사 & 붙여넣기
# - 20251118000000_extend_services_table.sql
# - 20251118000001_create_service_packages_table.sql
# - 20251118000002_create_subscription_plans_table.sql
# - 20251118000003_add_services_content_data.sql

# 4. "Run" 버튼 클릭 (파일마다 순차 실행)

# 5. 각 마이그레이션 NOTICE 메시지 확인
```

---

## ✅ 배포 후 검증

### 1. 스키마 검증

```sql
-- services 테이블 컬럼 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'services'
  AND column_name IN ('pricing_data', 'deliverables', 'process_steps', 'faq');

-- 결과 예상: 4개 컬럼 모두 JSONB, NULL 허용

-- service_packages 테이블 존재 확인
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'service_packages';

-- 결과 예상: 1

-- subscription_plans 테이블 존재 확인
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'subscription_plans';

-- 결과 예상: 1
```

### 2. RLS 정책 검증

```sql
-- RLS 정책 개수 확인
SELECT tablename, COUNT(*) AS policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('services', 'service_packages', 'subscription_plans')
GROUP BY tablename;

-- 결과 예상:
-- services: 6개 (기존 2개 + 신규 4개)
-- service_packages: 4개
-- subscription_plans: 4개
```

### 3. 데이터 검증

```sql
-- 4개 서비스 콘텐츠 데이터 확인
SELECT
  slug,
  title,
  CASE WHEN pricing_data IS NOT NULL THEN 'OK' ELSE 'MISSING' END AS pricing,
  CASE WHEN deliverables IS NOT NULL THEN 'OK' ELSE 'MISSING' END AS deliverables,
  CASE WHEN process_steps IS NOT NULL THEN 'OK' ELSE 'MISSING' END AS process,
  CASE WHEN faq IS NOT NULL THEN 'OK' ELSE 'MISSING' END AS faq
FROM public.services
WHERE slug IN ('mvp-development', 'fullstack-development', 'design-system', 'operations-management');

-- 결과 예상: 4개 서비스 모두 pricing, deliverables, process, faq = 'OK'
```

### 4. 프론트엔드 테스트

**로컬 테스트** (프로덕션 DB 연결):
```bash
# .env.local에 프로덕션 DB URL 설정 (임시)
VITE_SUPABASE_URL=https://zykjdneewbzyazfukzyg.supabase.co
VITE_SUPABASE_ANON_KEY=[PRODUCTION_ANON_KEY]

# 개발 서버 시작
npm run dev

# 테스트 URL:
# - http://localhost:5173/services/mvp-development
# - http://localhost:5173/services/fullstack-development
# - http://localhost:5173/services/design-system
# - http://localhost:5173/services/operations-management

# 확인 사항:
# - pricing_data가 화면에 표시되는지
# - deliverables가 화면에 표시되는지
# - process_steps가 화면에 표시되는지
# - faq가 화면에 표시되는지
```

**프로덕션 테스트**:
```bash
# 프로덕션 URL 직접 접속
https://www.ideaonaction.ai/services/mvp-development
https://www.ideaonaction.ai/services/fullstack-development
https://www.ideaonaction.ai/services/design-system
https://www.ideaonaction.ai/services/operations-management

# 확인 사항:
# - 4개 서비스 모두 정상 로딩
# - 콘텐츠 데이터 표시 확인
# - Console 에러 없음
```

---

## 🎯 성공 기준

### 필수 조건
- [  ] 백업 생성 완료
- [  ] 4개 마이그레이션 성공 (NOTICE 메시지 확인)
- [  ] 스키마 검증 통과 (21개 컬럼, 2개 테이블)
- [  ] RLS 정책 검증 통과 (14개 정책)
- [  ] 데이터 검증 통과 (4개 서비스 콘텐츠)
- [  ] 프론트엔드 테스트 통과 (4개 URL)

### 선택 조건
- [  ] 로컬 E2E 테스트 실행 (프로덕션 DB 연결)
- [  ] 성능 테스트 (Lighthouse 90+ 유지)
- [  ] SEO 테스트 (메타 태그 확인)

---

## ⚠️ 주의사항

1. **백업 필수**: 배포 전 반드시 백업 생성
2. **점진적 배포**: 마이그레이션을 하나씩 실행하고 검증
3. **롤백 준비**: 문제 발생 시 즉시 롤백 가능하도록 스크립트 준비
4. **모니터링**: 배포 후 24시간 동안 에러 로그 모니터링
5. **기존 서비스**: 기존 3개 샘플 서비스는 영향 없음 (NULL 컬럼 추가만)

---

## 📞 긴급 연락

**문제 발생 시**:
1. 즉시 롤백 스크립트 실행
2. Supabase Studio → Logs 확인
3. 백업에서 복원

**Supabase Support**:
- Dashboard: https://supabase.com/dashboard/project/zykjdneewbzyazfukzyg
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com

---

**작성일**: 2025-11-18
**작성자**: Claude AI
**승인자**: [User Name]
**상태**: ⏳ 승인 대기 중
