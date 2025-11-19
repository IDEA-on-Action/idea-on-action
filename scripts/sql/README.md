# SQL Scripts

이 디렉토리는 프로덕션 DB 관리용 SQL 스크립트를 보관합니다.

## 파일 목록

### 백업 파일
- `backup-production-2025-11-18.sql` - 프로덕션 DB 백업 (2025-11-18)

### 마이그레이션 파일
- `production-migration-combined.sql` - 프로덕션 DB 마이그레이션 통합 스크립트

### 데이터 추가 스크립트
- `insert-compass-navigator-plans.sql` - COMPASS Navigator 정기구독 플랜 추가
- `insert-service-packages-plans.sql` - 서비스 패키지 및 플랜 추가
- `insert-service-packages-plans-fixed.sql` - 서비스 패키지 및 플랜 추가 (수정 버전)

### 데이터 정리 스크립트
- `delete-old-packages-plans.sql` - 기존 패키지 및 플랜 삭제

### 스키마 수정 스크립트
- `fix-blog-rls-production.sql` - 블로그 RLS 정책 수정
- `fix-service-tables-permissions.sql` - 서비스 테이블 권한 수정
- `update-services-slug.sql` - 서비스 slug 업데이트

## 사용 방법

### Supabase CLI 사용
```bash
# 로컬 DB에 적용
supabase db execute -f scripts/sql/파일명.sql

# 프로덕션 DB에 적용 (주의!)
supabase db execute -f scripts/sql/파일명.sql --db-url "postgresql://..."
```

### psql 사용
```bash
psql -h db.zykjdneewbzyazfukzyg.supabase.co -U postgres -d postgres -f scripts/sql/파일명.sql
```

## 주의사항

⚠️ **프로덕션 DB에 적용 전 반드시 백업을 생성하세요!**

1. 로컬 DB에서 먼저 테스트
2. 백업 생성
3. 프로덕션 적용
4. 검증

## 백업 생성 방법

```bash
# Supabase CLI
supabase db dump -f scripts/sql/backup-production-$(date +%Y-%m-%d).sql

# psql
pg_dump -h db.zykjdneewbzyazfukzyg.supabase.co -U postgres -d postgres > scripts/sql/backup-production-$(date +%Y-%m-%d).sql
```
