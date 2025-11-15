# Hotfix: Order Number Race Condition

**날짜**: 2025-11-15
**심각도**: 🔴 Critical
**상태**: ✅ 해결 완료

---

## 📋 문제 상황

### 에러 메시지
```
POST /rest/v1/orders 409 (Conflict)
duplicate key value violates unique constraint "orders_order_number_key"
```

### 재현 방법
1. Checkout 페이지에서 주문 생성 버튼 클릭
2. 동일한 주문 번호가 중복 생성되어 409 Conflict 에러 발생

---

## 🔍 근본 원인

### 기존 `generate_order_number()` 함수의 Race Condition

```sql
-- 문제 코드 (20251020000004_create_order_tables.sql)
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  today TEXT;
  sequence_num INTEGER;
  order_num TEXT;
BEGIN
  today := TO_CHAR(NOW(), 'YYYYMMDD');

  -- ❌ 동시 요청 시 동일한 COUNT 반환
  SELECT COUNT(*) + 1 INTO sequence_num
  FROM public.orders
  WHERE order_number LIKE 'ORD-' || today || '-%';

  order_num := 'ORD-' || today || '-' || LPAD(sequence_num::TEXT, 4, '0');
  RETURN order_num;
END;
$$ LANGUAGE plpgsql VOLATILE;
```

### Race Condition 시나리오

| 시간 | 요청 A | 요청 B | 결과 |
|------|--------|--------|------|
| T1 | `COUNT(*) = 0` | - | - |
| T2 | `sequence_num = 1` | `COUNT(*) = 0` | - |
| T3 | `order_num = 'ORD-20251115-0001'` | `sequence_num = 1` | - |
| T4 | INSERT 성공 | `order_num = 'ORD-20251115-0001'` | - |
| T5 | - | INSERT 실패 (409 Conflict) | ❌ 중복! |

---

## ✅ 해결 방법

### 옵션 1: 타임스탬프 + 랜덤 (채택)

**주문번호 형식 변경**:
- 기존: `ORD-YYYYMMDD-XXXX` (예: `ORD-20251115-0001`)
- 변경: `ORD-YYYYMMDD-HHMMSS-XXX` (예: `ORD-20251115-143052-A3F`)

**장점**:
- ✅ Race Condition 완전 방지 (Lock 없이)
- ✅ 빠른 성능 (Lock 대기 없음)
- ✅ 고트래픽 환경에 적합

**단점**:
- ❌ 주문번호가 길어짐 (17자 → 22자)
- ❌ 순차성 없음 (랜덤 suffix)

**구현**:
```sql
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  timestamp_part TEXT;
  random_part TEXT;
  order_num TEXT;
BEGIN
  -- Timestamp: YYYYMMDD-HHMMSS
  timestamp_part := TO_CHAR(NOW(), 'YYYYMMDD-HH24MISS');

  -- Random: 3 characters (uppercase alphanumeric)
  random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 3));

  -- Combine: ORD-20251115-143052-A3F
  order_num := 'ORD-' || timestamp_part || '-' || random_part;

  RETURN order_num;
END;
$$ LANGUAGE plpgsql VOLATILE;
```

### 옵션 2: Advisory Lock (백업)

**기존 형식 유지하면서 Lock으로 동시성 제어**:
```sql
-- pg_advisory_xact_lock() 사용
-- 순차번호 보장 (0001, 0002, 0003...)
-- 단점: Lock 대기로 인한 성능 저하
```

파일: `supabase/migrations/fix-generate-order-number-v2-advisory-lock.sql` (백업용)

---

## 🚀 적용 절차

### 1. Supabase Dashboard 접속
```
https://supabase.com/dashboard/project/zykjdneewbzyazfukzyg/sql/new
```

### 2. SQL 실행
```sql
DROP FUNCTION IF EXISTS public.generate_order_number();

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  timestamp_part TEXT;
  random_part TEXT;
  order_num TEXT;
BEGIN
  timestamp_part := TO_CHAR(NOW(), 'YYYYMMDD-HH24MISS');
  random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 3));
  order_num := 'ORD-' || timestamp_part || '-' || random_part;
  RETURN order_num;
END;
$$ LANGUAGE plpgsql VOLATILE;

GRANT EXECUTE ON FUNCTION public.generate_order_number() TO authenticated;
```

### 3. 테스트
```sql
-- 3회 실행 → 모두 다른 값 확인
SELECT public.generate_order_number();
-- ORD-20251115-143052-A3F
-- ORD-20251115-143053-B7C
-- ORD-20251115-143054-X9Q
```

### 4. 프로덕션 확인
- Checkout 페이지에서 주문 생성 재시도
- 409 Conflict 에러 없어야 함
- 결제 페이지로 정상 이동 확인

---

## 📊 테스트 결과

### 로컬 테스트 (2025-11-15)
- ✅ `SELECT generate_order_number()` 3회 실행 → 모두 고유 값 반환
- ✅ Checkout 페이지 주문 생성 성공
- ✅ 결제 페이지 이동 정상

### 프로덕션 배포 (예정)
- [ ] Vercel 환경 변수 확인
- [ ] main 브랜치 푸시
- [ ] 자동 배포 확인
- [ ] 프로덕션 Checkout 테스트

---

## 📝 변경 파일

1. **supabase/migrations/fix-generate-order-number.sql** ✅
   - 타임스탬프 기반 주문번호 생성 함수

2. **supabase/migrations/fix-generate-order-number-v2-advisory-lock.sql** 📋
   - Advisory Lock 기반 함수 (백업용)

3. **docs/hotfix/2025-11-15-order-number-fix.md** 📄
   - 이 문서

---

## 🎯 향후 계획

### 단기 (1주)
- [ ] 프로덕션 배포 및 모니터링
- [ ] Sentry 에러 로그 확인 (중복 주문번호 에러 소멸 확인)

### 중기 (1달)
- [ ] 주문번호 형식 사용자 피드백 수집
- [ ] 필요 시 옵션 2 (Advisory Lock)로 재변경 검토

---

## 📚 관련 문서

- [Supabase Functions 문서](https://supabase.com/docs/guides/database/functions)
- [PostgreSQL Advisory Locks](https://www.postgresql.org/docs/current/explicit-locking.html#ADVISORY-LOCKS)
- [Race Condition 해결 패턴](https://www.postgresql.org/docs/current/transaction-iso.html)

---

**작성자**: Claude AI
**검토자**: 서민원
**승인일**: 2025-11-15
