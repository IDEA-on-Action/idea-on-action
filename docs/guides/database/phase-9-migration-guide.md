# Phase 9 Database Migration Guide

> 전자상거래 기능을 위한 데이터베이스 마이그레이션 가이드

**마이그레이션 파일**: `docs/database/migrations/002-phase-9-ecommerce-schema.sql`
**생성일**: 2025-10-18
**Phase**: 9 (장바구니, 주문, 결제)

---

## ⚠️ 주의사항

**반드시 실행 전에 백업하세요!**

1. Supabase Dashboard → Database → Backups
2. "Create backup" 클릭
3. 백업 완료 확인 후 마이그레이션 진행

---

## 📋 마이그레이션 개요

### 생성되는 테이블

1. **carts** - 장바구니 (메타데이터)
2. **cart_items** - 장바구니 항목 (각 서비스)
3. **orders** - 주문 헤더
4. **order_items** - 주문 항목 (각 서비스)
5. **payments** - 결제 정보

### 주요 변경사항

**기존 스키마 (Migration 001)**:
```sql
carts (
  id, user_id, service_id, quantity  -- 서비스 직접 참조
)
```

**새로운 스키마 (Migration 002)**:
```sql
carts (
  id, user_id  -- 메타데이터만
)

cart_items (
  id, cart_id, service_id, quantity, price  -- 다대다 관계
)
```

**장점**:
- 장바구니에 여러 서비스 담기 가능
- 가격 스냅샷 (price 필드) - 가격 변동 추적
- 더 나은 정규화

---

## 🚀 마이그레이션 실행 방법

### 1. Supabase Dashboard 접속

```
https://supabase.com/dashboard/project/zykjdneewbzyazfukzyg
```

### 2. SQL Editor 열기

- 왼쪽 메뉴 → SQL Editor
- "New query" 클릭

### 3. 마이그레이션 파일 복사

```bash
# 로컬에서 파일 열기
code docs/database/migrations/002-phase-9-ecommerce-schema.sql

# 또는 cat으로 출력
cat docs/database/migrations/002-phase-9-ecommerce-schema.sql
```

### 4. SQL Editor에 붙여넣기

- 전체 내용 복사 (450+ 줄)
- SQL Editor에 붙여넣기

### 5. 실행

- "RUN" 버튼 클릭 (또는 Ctrl + Enter)
- 결과 확인

**예상 결과**:
```
=== Phase 9 E-commerce Schema 생성 완료 ===
carts: 0 rows
cart_items: 0 rows
orders: 0 rows
order_items: 0 rows
payments: 0 rows
```

---

## ✅ 검증 방법

### 1. 테이블 생성 확인

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('carts', 'cart_items', 'orders', 'order_items', 'payments');
```

**예상 결과**: 5개 테이블

### 2. RLS 정책 확인

```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('carts', 'cart_items', 'orders', 'order_items', 'payments')
ORDER BY tablename, policyname;
```

**예상 결과**: 15개 정책
- carts: 4개
- cart_items: 4개
- orders: 4개
- order_items: 2개
- payments: 2개

### 3. 헬퍼 함수 확인

```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('generate_order_number', 'calculate_order_total');
```

**예상 결과**: 2개 함수

### 4. 주문번호 생성 테스트

```sql
SELECT generate_order_number();
```

**예상 결과**: `ORD-20251018-XXXX` (XXXX는 랜덤 4자리)

---

## 🧪 테스트 데이터 삽입

### 1. 테스트 장바구니 생성

```sql
-- 1. 장바구니 생성 (자신의 user_id 사용)
INSERT INTO carts (user_id)
VALUES (auth.uid())
RETURNING *;

-- 2. 장바구니 항목 추가
INSERT INTO cart_items (cart_id, service_id, quantity, price)
SELECT
  (SELECT id FROM carts WHERE user_id = auth.uid()),
  id,
  1,
  price
FROM services
LIMIT 2
RETURNING *;
```

### 2. 장바구니 조회

```sql
SELECT
  ci.id,
  ci.quantity,
  ci.price,
  s.title,
  s.price as current_price
FROM cart_items ci
JOIN carts c ON c.id = ci.cart_id
JOIN services s ON s.id = ci.service_id
WHERE c.user_id = auth.uid();
```

### 3. 주문 생성 (테스트)

```sql
INSERT INTO orders (
  user_id,
  order_number,
  subtotal,
  total_amount,
  status
)
VALUES (
  auth.uid(),
  generate_order_number(),
  100000.00,
  100000.00,
  'pending'
)
RETURNING *;
```

### 4. 테스트 데이터 정리

```sql
-- 테스트 주문 삭제
DELETE FROM orders WHERE user_id = auth.uid();

-- 테스트 장바구니 삭제
DELETE FROM carts WHERE user_id = auth.uid();
```

---

## 🔄 롤백 방법

**주의**: 이 작업은 모든 장바구니/주문 데이터를 삭제합니다!

```sql
-- 테이블 삭제 (CASCADE로 연관 데이터 모두 삭제)
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- 헬퍼 함수 삭제
DROP FUNCTION IF EXISTS generate_order_number();
DROP FUNCTION IF EXISTS calculate_order_total(uuid);
```

---

## 📊 스키마 상세

### carts 테이블

```sql
CREATE TABLE carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,

  CONSTRAINT unique_user_cart UNIQUE(user_id)
);
```

**특징**:
- 사용자당 하나의 장바구니 (unique_user_cart)
- 메타데이터만 저장 (서비스는 cart_items에)
- 사용자 삭제 시 장바구니 자동 삭제 (CASCADE)

### cart_items 테이블

```sql
CREATE TABLE cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  quantity integer DEFAULT 1 NOT NULL CHECK (quantity > 0 AND quantity <= 99),
  price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,

  CONSTRAINT unique_cart_service UNIQUE(cart_id, service_id)
);
```

**특징**:
- 장바구니당 동일 서비스 중복 불가 (unique_cart_service)
- 수량 제한 1-99
- 가격 스냅샷 (price) - 담을 당시 가격 기록
- 장바구니 삭제 시 항목 자동 삭제 (CASCADE)

### orders 테이블

```sql
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  -- 주문 금액
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  tax_amount numeric(10,2) DEFAULT 0,
  discount_amount numeric(10,2) DEFAULT 0,
  shipping_fee numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) NOT NULL DEFAULT 0,

  -- 주문 상태
  status text DEFAULT 'pending' NOT NULL
    CHECK (status IN ('pending', 'confirmed', 'processing',
                      'shipped', 'delivered', 'cancelled', 'refunded')),

  -- 배송 정보
  shipping_address jsonb,
  shipping_name text,
  shipping_phone text,
  shipping_note text,

  -- 메타데이터
  order_number text UNIQUE NOT NULL,

  -- 타임스탬프
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  confirmed_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz
);
```

**특징**:
- 사용자 삭제 후에도 주문 기록 보존 (SET NULL)
- 주문 상태 7단계 (pending → confirmed → processing → shipped → delivered / cancelled / refunded)
- 금액 투명성 (subtotal, tax, discount, shipping 분리)
- JSONB 배송지 (유연한 구조)
- 타임스탬프 추적 (확인/배송/완료/취소 시각)

### order_items 테이블

```sql
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,

  -- 스냅샷
  service_title text NOT NULL,
  service_description text,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,

  service_snapshot jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);
```

**특징**:
- 서비스 삭제 후에도 주문 기록 보존 (SET NULL)
- 서비스 정보 스냅샷 (title, description, snapshot)
- 주문 당시 가격 기록 (unit_price)

### payments 테이블

```sql
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL NOT NULL,

  amount numeric(10,2) NOT NULL DEFAULT 0,
  status text DEFAULT 'pending' NOT NULL
    CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),

  provider text CHECK (provider IN ('kakao', 'toss', 'stripe', 'paypal')),
  provider_transaction_id text,
  payment_method text,

  card_info jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  failure_reason text,

  created_at timestamptz DEFAULT now() NOT NULL,
  paid_at timestamptz,
  failed_at timestamptz,
  refunded_at timestamptz,

  CONSTRAINT unique_provider_tx UNIQUE NULLS NOT DISTINCT (provider, provider_transaction_id)
);
```

**특징**:
- 다중 게이트웨이 지원 (Kakao, Toss, Stripe, PayPal)
- 거래 ID 중복 방지 (unique_provider_tx)
- 마스킹된 카드 정보 (card_info JSONB)
- 실패 사유 추적 (failure_reason)
- 메타데이터 저장 (디버깅/감사용)

---

## 🔐 RLS 정책

### carts 정책

- ✅ Users can view their own cart
- ✅ Users can create their own cart
- ✅ Users can update their own cart
- ✅ Users can delete their own cart

### cart_items 정책

- ✅ Users can view their own cart items
- ✅ Users can insert items to their own cart
- ✅ Users can update items in their own cart
- ✅ Users can delete items from their own cart

### orders 정책

- ✅ Users can view their own orders
- ✅ Users can create their own orders
- ✅ Users can update their own pending orders
- ✅ **Admins can view all orders**
- ✅ **Admins can update all orders**

### order_items 정책

- ✅ Users can view their own order items
- ✅ **Admins can view all order items**

### payments 정책

- ✅ Users can view their own payments
- ✅ **Admins can view all payments**

---

## 📝 다음 단계

1. ✅ 마이그레이션 완료
2. ✅ TypeScript 타입 업데이트 (`src/types/database.ts`)
3. 🔜 상태 관리 라이브러리 선택 (Zustand/Jotai)
4. 🔜 useCart 훅 구현
5. 🔜 장바구니 UI 컴포넌트

---

## 🔗 관련 문서

- [002-phase-9-ecommerce-schema.sql](../../database/migrations/002-phase-9-ecommerce-schema.sql)
- [database.ts](../../../src/types/database.ts)
- [Phase 9 Progress](../../project/phase-9-progress.md)

---

**작성일**: 2025-10-18
**작성자**: Claude
**버전**: 1.0.0
