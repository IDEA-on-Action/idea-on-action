# SQL Scripts

프로덕션 DB 관리용 SQL 스크립트 모음입니다.

## 📁 폴더 구조

```
scripts/sql/
├── backups/        # 데이터베이스 백업 파일
├── migrations/     # 프로덕션 마이그레이션 스크립트
├── data/           # 데이터 추가/삭제 스크립트
├── fixes/          # 스키마/권한 수정 스크립트
└── README.md
```

## 📋 파일 목록

### backups/ - 백업 파일
- `backup-production-2025-11-18.sql` - 프로덕션 DB 전체 백업 (2025-11-18, 151KB)

### migrations/ - 마이그레이션
- `production-migration-combined.sql` - 프로덕션 DB 마이그레이션 통합 스크립트 (48KB)

### data/ - 데이터 스크립트
- `insert-compass-navigator-plans.sql` - COMPASS Navigator 정기구독 플랜 추가 (3개 플랜)
- `insert-service-packages-plans.sql` - 4개 서비스 패키지 및 플랜 추가
- `delete-old-packages-plans.sql` - 기존 패키지 및 플랜 삭제

### fixes/ - 스키마/권한 수정 (~30개 파일)
- `EXECUTE-ALL-FIXES.sql` - 모든 수정 사항 일괄 실행 스크립트
- `fix-blog-rls-production.sql` - 블로그 RLS 정책 수정
- `fix-service-tables-permissions.sql` - 서비스 테이블 권한 수정
- `fix-newsletter-permissions.sql` - 뉴스레터 권한 수정
- `fix-carts-notifications-rls.sql` - 장바구니/알림 RLS 수정
- `fix-generate-order-number-v2-advisory-lock.sql` - 주문 번호 생성 함수 수정
- `update-services-slug.sql` - 서비스 slug 업데이트
- `rollback-*.sql` - 롤백 스크립트
- 기타 RLS 정책, 권한, 스키마 수정 스크립트

## 🚀 사용 방법

### Supabase CLI 사용 (권장)

```bash
# 로컬 DB에 적용
supabase db execute -f scripts/sql/data/insert-compass-navigator-plans.sql

# 프로덕션 DB에 적용 (⚠️ 주의!)
supabase db execute -f scripts/sql/data/insert-compass-navigator-plans.sql --db-url "postgresql://..."
```

### psql 사용

```bash
# 로컬 DB
psql -h localhost -p 54322 -U postgres -d postgres -f scripts/sql/data/insert-compass-navigator-plans.sql

# 프로덕션 DB (⚠️ 주의!)
psql -h db.zykjdneewbzyazfukzyg.supabase.co -U postgres -d postgres -f scripts/sql/data/insert-compass-navigator-plans.sql
```

### Node.js 스크립트로 검증

```bash
# COMPASS Navigator 서비스 확인
node scripts/check-compass-service.cjs

# 모든 서비스 데이터 확인
node scripts/check-all-services-data.sql
```

## ⚠️ 주의사항

### 프로덕션 DB 적용 전 체크리스트

1. **백업 생성** (필수)
   ```bash
   supabase db dump -f scripts/sql/backups/backup-production-$(date +%Y-%m-%d).sql
   ```

2. **로컬 DB에서 테스트** (필수)
   ```bash
   supabase db reset
   supabase db execute -f scripts/sql/data/insert-compass-navigator-plans.sql
   ```

3. **검증 스크립트 실행** (권장)
   ```bash
   node scripts/check-compass-service.cjs
   ```

4. **프로덕션 적용** (신중하게)
   ```bash
   supabase db execute -f scripts/sql/data/insert-compass-navigator-plans.sql --db-url "postgresql://..."
   ```

5. **프로덕션 검증** (필수)
   - 브라우저로 https://www.ideaonaction.ai/services 접속
   - 서비스 페이지 정상 표시 확인
   - 장바구니 기능 테스트

### 롤백 방법

```bash
# 백업 파일로 복원
supabase db restore backups/backup-production-2025-11-18.sql
```

## 📝 백업 생성 방법

### Supabase CLI (권장)

```bash
# 전체 백업
supabase db dump -f scripts/sql/backups/backup-production-$(date +%Y-%m-%d).sql

# 특정 테이블만 백업
supabase db dump --table=services -f scripts/sql/backups/backup-services-$(date +%Y-%m-%d).sql
```

### psql

```bash
# 전체 백업
pg_dump -h db.zykjdneewbzyazfukzyg.supabase.co -U postgres -d postgres \
  > scripts/sql/backups/backup-production-$(date +%Y-%m-%d).sql

# 특정 테이블만 백업
pg_dump -h db.zykjdneewbzyazfukzyg.supabase.co -U postgres -d postgres -t services \
  > scripts/sql/backups/backup-services-$(date +%Y-%m-%d).sql
```

## 🔗 관련 문서

- [Supabase 데이터베이스 가이드](../../docs/guides/database/)
- [마이그레이션 가이드](../../supabase/MIGRATION_GUIDE.md)
- [프로젝트 TODO](../../project-todo.md)
