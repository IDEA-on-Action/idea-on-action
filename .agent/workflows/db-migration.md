---
description: 안전하고 효율적인 DB 마이그레이션 워크플로우 (Tier 1)
---

# Safe DB Migration Workflow

> **목표**: 데이터 손실 리스크 없이 DB 스키마를 변경하고 검증합니다.
> **전략**: SQL 작성 -> 검증 스크립트 -> 실행 -> 롤백 계획을 체계적으로 수행합니다.

## 1. Schema Design (Specify)
- [ ] 변경할 테이블 구조와 관계를 정의합니다.
- [ ] RLS(Row Level Security) 정책을 설계합니다. (필수)
- [ ] 인덱스 전략을 수립합니다.

## 2. Migration File Creation
- [ ] `supabase/migrations/YYYYMMDDHHMMSS_description.sql` 파일을 생성합니다.
- [ ] `UP` 쿼리(생성)와 주석을 작성합니다.
- [ ] **Idempotency**: `IF NOT EXISTS` 등을 사용하여 재실행 가능하게 만듭니다.

## 3. Validation Script Creation (Batch Processing)
- [ ] 마이그레이션이 올바르게 적용되었는지 확인하는 검증 스크립트(`scripts/validation/check-[feature].sql` 또는 `.js`)를 작성합니다.
- [ ] RLS 정책이 의도대로 작동하는지 테스트하는 로직을 포함합니다.

## 4. Execution & Verification
// turbo
- [ ] 로컬 DB에 마이그레이션을 적용합니다 (`supabase db reset` 또는 `db push`).
- [ ] 검증 스크립트를 실행하여 성공 여부를 확인합니다.

## 5. Documentation
- [ ] `docs/guides/database/`에 변경 사항을 문서화합니다.
- [ ] `CLAUDE.md`에 마이그레이션 내역을 기록합니다.
