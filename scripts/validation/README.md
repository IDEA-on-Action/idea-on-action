# 검증 스크립트 (Validation Scripts)

이 폴더는 데이터베이스 스키마 및 데이터 검증을 위한 SQL 스크립트를 포함합니다.

## 스크립트 목록

### check-all-services-data.sql
- **목적**: 모든 서비스 데이터 확인
- **사용법**:
  ```bash
  # Supabase CLI로 실행
  supabase db reset --db-url "your-db-url"
  psql -h localhost -p 54322 -U postgres -d postgres -f scripts/validation/check-all-services-data.sql

  # 또는 Supabase Studio SQL Editor에서 직접 실행
  ```
- **출력**: services 테이블의 모든 레코드 (id, slug, title, category)

### temp-check-schema.sql
- **목적**: service_categories 테이블 스키마 및 RLS 정책 확인
- **사용법**:
  ```bash
  psql -h localhost -p 54322 -U postgres -d postgres -f scripts/validation/temp-check-schema.sql
  ```
- **출력**:
  - service_categories 테이블 컬럼 정보
  - RLS 정책 목록
  - 제약 조건 정보

## 사용 시나리오

### 1. 마이그레이션 후 검증
```bash
# 1. 마이그레이션 적용
supabase db reset

# 2. 스키마 확인
psql -h localhost -p 54322 -U postgres -d postgres -f scripts/validation/temp-check-schema.sql

# 3. 데이터 확인
psql -h localhost -p 54322 -U postgres -d postgres -f scripts/validation/check-all-services-data.sql
```

### 2. 프로덕션 배포 전 검증
```bash
# 로컬 환경에서 마이그레이션 테스트
supabase db reset
npm run test:e2e

# 검증 스크립트 실행
psql -h localhost -p 54322 -U postgres -d postgres -f scripts/validation/check-all-services-data.sql
```

### 3. 디버깅
```bash
# 서비스 데이터 확인
psql -h localhost -p 54322 -U postgres -d postgres -f scripts/validation/check-all-services-data.sql

# 스키마 및 RLS 정책 확인
psql -h localhost -p 54322 -U postgres -d postgres -f scripts/validation/temp-check-schema.sql
```

## 관련 문서

- **마이그레이션 가이드**: docs/guides/cms/migration-guide.md
- **데이터베이스 가이드**: docs/guides/database/
- **검증 보고서**: docs/archive/2025-11-16/cms-phase4-validation-report-2025-11-16.md

## 주의사항

⚠️ **프로덕션 환경에서 직접 실행하지 마세요!**

- 이 스크립트들은 **읽기 전용 검증**용입니다.
- 프로덕션 환경에서는 Supabase Studio의 SQL Editor에서 신중히 실행하세요.
- 데이터 변경이 필요한 경우 마이그레이션 파일을 사용하세요.

---

**폴더 생성일**: 2025-11-16
**관련 Phase**: CMS Phase 4 - 문서화 & 배포 준비
