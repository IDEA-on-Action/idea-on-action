# Supabase 설정

프로젝트의 Supabase 백엔드 설정 및 마이그레이션 파일들입니다.

## 📁 폴더 구조

```
supabase/
├── .branches/          # Supabase CLI 브랜치 관리
├── .temp/              # Supabase CLI 임시 파일 (gitignored)
├── functions/          # Supabase Edge Functions
├── migrations/         # 데이터베이스 마이그레이션 파일
├── config.toml         # Supabase 로컬 개발 설정
├── reset-database.sql  # 데이터베이스 초기화 스크립트
└── README.md
```

## 🗄️ 마이그레이션 파일

마이그레이션 파일은 타임스탬프 순서로 실행됩니다.

### 기본 인프라 (20250109)
- `20250109000000_create_admin_functions.sql` - 관리자 권한 함수
- `20250109000001_create_projects.sql` - 프로젝트 테이블
- `20250109000002_create_roadmap.sql` - 로드맵 테이블
- `20250109000003_create_logs.sql` - 로그 테이블
- `20250109000004_create_bounties.sql` - 바운티 테이블
- `20250109000005_create_proposals.sql` - 제안 테이블
- `20250109000006_extend_user_profiles.sql` - 사용자 프로필 확장
- `20250109000007_seed_initial_data.sql` - 초기 데이터
- `20250109000008_create_newsletter.sql` - 뉴스레터 테이블

### 서비스 플랫폼 (20251020)
- `20251020000000_create_services_tables.sql` - 서비스, 패키지, 플랜 테이블
- `20251020000001_create_user_management_tables.sql` - 사용자 관리
- `20251020000002_create_rbac_and_audit.sql` - 권한 관리 및 감사
- `20251020000003_create_cart_tables.sql` - 장바구니 테이블
- `20251020000004_create_order_tables.sql` - 주문 테이블
- `20251020000005_create_payment_tables.sql` - 결제 테이블
- `20251020000006_create_blog_tables.sql` - 블로그 테이블
- `20251020000007_create_notices_table.sql` - 공지사항 테이블

### 최신 마이그레이션 (20251118)
- `20251118000000_extend_services_table.sql` - 서비스 테이블 확장
- `20251118000001_create_service_packages_table.sql` - 서비스 패키지 테이블
- `20251118000002_create_subscription_plans_table.sql` - 정기구독 플랜 테이블
- `20251118000003_add_services_content_data.sql` - 서비스 콘텐츠 데이터

## 🚀 사용 방법

### 로컬 개발 환경 시작

```bash
# Supabase 로컬 개발 서버 시작
supabase start

# 상태 확인
supabase status
```

### 마이그레이션 실행

```bash
# 로컬 DB 초기화 및 모든 마이그레이션 적용
supabase db reset

# 새 마이그레이션 파일 생성
supabase migration new migration_name

# 특정 마이그레이션 실행
supabase db execute -f supabase/migrations/파일명.sql
```

### 프로덕션 배포

```bash
# 프로덕션 DB 연결 확인
supabase link --project-ref zykjdneewbzyazfukzyg

# 마이그레이션 적용
supabase db push

# 또는 특정 마이그레이션만
supabase db execute -f supabase/migrations/파일명.sql --db-url "postgresql://..."
```

### 데이터베이스 백업 및 복원

```bash
# 백업 생성
supabase db dump -f scripts/sql/backups/backup-$(date +%Y-%m-%d).sql

# 복원
supabase db restore scripts/sql/backups/backup-2025-11-18.sql
```

## 🔧 Edge Functions

```bash
# 새 함수 생성
supabase functions new function-name

# 로컬 테스트
supabase functions serve

# 배포
supabase functions deploy function-name
```

## 📚 관련 문서

- [마이그레이션 가이드](../docs/guides/database/migrations/MIGRATION_GUIDE.md)
- [마이그레이션 실행 가이드](../docs/guides/database/migrations/MIGRATION_EXECUTION_GUIDE.md)
- [주간 배포 요약](../docs/guides/database/migrations/WEEKLY_RECAP_DEPLOYMENT.md)
- [SQL 스크립트](../scripts/sql/README.md)

## ⚠️ 주의사항

### 마이그레이션 작성 시

1. **타임스탬프 형식 준수**: `YYYYMMDDHHMMSS_description.sql`
2. **멱등성 보장**: `CREATE TABLE IF NOT EXISTS` 사용
3. **트랜잭션 사용**: `BEGIN;` ... `COMMIT;`
4. **롤백 계획 수립**: 각 마이그레이션마다 롤백 스크립트 준비
5. **로컬 테스트 필수**: 프로덕션 적용 전 `supabase db reset` 실행

### 프로덕션 배포 전

1. ✅ 로컬 DB에서 테스트
2. ✅ 백업 생성
3. ✅ 의존성 확인 (다른 마이그레이션과 충돌 여부)
4. ✅ RLS 정책 검증
5. ✅ 성능 영향 분석 (인덱스, 외래키)

### 일반 규칙

- ❌ **절대 기존 마이그레이션 파일 수정 금지** (새 마이그레이션 생성)
- ❌ **프로덕션 DB에 직접 SQL 실행 금지** (마이그레이션 파일 사용)
- ❌ **민감 정보 하드코딩 금지** (환경 변수 사용)
- ✅ **항상 백업 먼저**
- ✅ **롤백 계획 수립**
- ✅ **테스트 → 백업 → 배포 → 검증 순서 준수**

## 🔗 유용한 링크

- [Supabase CLI 문서](https://supabase.com/docs/guides/cli)
- [Supabase 마이그레이션 가이드](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
