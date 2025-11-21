# Edge Function 배포 가이드 - 구독 자동 결제 처리

> **작성일**: 2025-11-22
> **작성자**: Claude & Sinclair Seo
> **목적**: Supabase Edge Function을 통한 토스페이먼츠 자동 결제 처리 시스템 구축

---

## 📋 목차

1. [개요](#개요)
2. [필수 조건](#필수-조건)
3. [환경 변수 설정](#환경-변수-설정)
4. [DB 마이그레이션 적용](#db-마이그레이션-적용)
5. [로컬 테스트](#로컬-테스트)
6. [프로덕션 배포](#프로덕션-배포)
7. [Cron 설정](#cron-설정)
8. [모니터링](#모니터링)
9. [트러블슈팅](#트러블슈팅)

---

## 개요

### 기능
- **자동 결제 처리**: 매일 00:00 UTC에 next_billing_date가 오늘 이하인 구독 자동 결제
- **재시도 로직**: 네트워크 에러 및 5xx 에러 발생 시 최대 3회 재시도 (Exponential Backoff)
- **구독 정지**: 3회 연속 결제 실패 시 구독 상태를 `suspended`로 변경
- **활동 로그**: 모든 결제 성공/실패를 activity_logs 테이블에 기록
- **만료 처리**: cancel_at_period_end가 true인 구독을 current_period_end 이후 자동 만료

### 파일 구조
```
supabase/
├── functions/
│   ├── process-subscription-payments/
│   │   └── index.ts              # Edge Function (280줄)
│   └── _shared/
│       └── cors.ts                # CORS 헤더
└── migrations/
    └── 20251122000003_add_subscription_payments_metadata.sql
```

---

## 필수 조건

### 1. Supabase CLI 설치
```bash
npm install -g supabase

# 버전 확인
supabase --version  # v1.123.4 이상 권장
```

### 2. Supabase 프로젝트 연결
```bash
# 로컬 개발 환경
supabase login
supabase link --project-ref zykjdneewbzyazfukzyg

# 프로젝트 정보 확인
supabase status
```

### 3. 토스페이먼츠 API 키 준비
- **시크릿 키**: 토스페이먼츠 개발자센터 → API 키 관리 → 시크릿 키 복사
- **테스트 키**: 실제 결제 전 샌드박스 환경에서 테스트

---

## 환경 변수 설정

### 1. Supabase 대시보드 설정
1. Supabase Dashboard → Project Settings → Edge Functions
2. Secrets 탭 클릭
3. 다음 환경 변수 추가:

```bash
# 토스페이먼츠 시크릿 키 (필수)
TOSS_PAYMENTS_SECRET_KEY=test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6  # 테스트 키
# 또는
TOSS_PAYMENTS_SECRET_KEY=live_gsk_...  # 프로덕션 키

# Supabase 서비스 역할 키 (자동 설정됨)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase URL (자동 설정됨)
SUPABASE_URL=https://zykjdneewbzyazfukzyg.supabase.co

# Cron Secret (선택, 보안 강화용)
CRON_SECRET=your-random-secret-key-here
```

### 2. 로컬 개발 환경 (.env.local)
```bash
# supabase/functions/.env 파일 생성
TOSS_PAYMENTS_SECRET_KEY=test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
CRON_SECRET=local-test-secret
```

---

## DB 마이그레이션 적용

### 1. metadata 컬럼 추가
```bash
# 로컬 DB 적용
supabase db reset  # 모든 마이그레이션 재적용

# 또는 개별 마이그레이션
supabase migration up

# 프로덕션 DB 적용
supabase db push
```

### 2. 마이그레이션 확인
```sql
-- Supabase SQL Editor에서 실행
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'subscription_payments'
  AND column_name = 'metadata';

-- Expected output:
-- column_name | data_type
-- metadata    | jsonb
```

---

## 로컬 테스트

### 1. Edge Function 로컬 실행
```bash
# 개발 서버 시작
supabase start

# Edge Function 서빙 (별도 터미널)
supabase functions serve process-subscription-payments

# 출력 예시:
# Serving supabase/functions/process-subscription-payments on http://localhost:54321/functions/v1/process-subscription-payments
```

### 2. 테스트 데이터 생성
```sql
-- Supabase SQL Editor (로컬)에서 실행
-- 1. 테스트 빌링키 생성
INSERT INTO public.billing_keys (user_id, billing_key, customer_key, is_active)
VALUES (
  'YOUR_USER_ID',
  'bln_test_1234567890',
  'customer_test_123',
  true
);

-- 2. 오늘 결제할 구독 생성 (next_billing_date = 오늘)
INSERT INTO public.subscriptions (
  user_id,
  service_id,
  plan_id,
  billing_key_id,
  status,
  current_period_start,
  current_period_end,
  next_billing_date,
  cancel_at_period_end
)
VALUES (
  'YOUR_USER_ID',
  'SERVICE_ID',
  'PLAN_ID',
  'BILLING_KEY_ID',
  'active',
  NOW(),
  NOW() + INTERVAL '1 month',
  CURRENT_DATE,  -- 오늘 결제
  false
);
```

### 3. Edge Function 수동 호출
```bash
# cURL로 호출
curl -i --location --request POST 'http://localhost:54321/functions/v1/process-subscription-payments' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{}'

# 출력 예시:
# {
#   "message": "Subscription processing completed",
#   "processed": 1,
#   "results": [
#     { "id": "sub_id_123", "status": "success", "orderId": "sub_123_1700000000" }
#   ]
# }
```

### 4. 로그 확인
```bash
# Supabase Functions 로그
supabase functions logs process-subscription-payments

# 출력 예시:
# ✅ Payment successful for abc-123: ₩50,000
# Found 1 subscriptions due for payment
```

---

## 프로덕션 배포

### 1. Edge Function 배포
```bash
# 배포 전 린트 체크 (선택)
deno lint supabase/functions/process-subscription-payments/index.ts

# 프로덕션 배포
supabase functions deploy process-subscription-payments

# 출력 예시:
# Deploying function process-subscription-payments...
# Function deployed successfully!
# URL: https://zykjdneewbzyazfukzyg.supabase.co/functions/v1/process-subscription-payments
```

### 2. 배포 검증
```bash
# 프로덕션 Edge Function 호출 (수동 테스트)
curl -i --location --request POST 'https://zykjdneewbzyazfukzyg.supabase.co/functions/v1/process-subscription-payments' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{}'

# 예상 응답:
# HTTP/2 200
# { "message": "Subscription processing completed", "processed": 0, "results": [] }
```

---

## Cron 설정

### 방법 1: Supabase Dashboard (권장)

1. **Supabase Dashboard 접속**
   - Database → Cron Jobs

2. **New Cron Job 클릭**

3. **설정 입력**
   ```sql
   -- Job Name: process-subscription-payments-daily
   -- Schedule: 0 0 * * * (매일 00:00 UTC)
   -- SQL Command:
   SELECT net.http_post(
     'https://zykjdneewbzyazfukzyg.supabase.co/functions/v1/process-subscription-payments',
     '{}',
     '{"Authorization": "Bearer YOUR_ANON_KEY", "Content-Type": "application/json"}'::jsonb
   );
   ```

4. **저장 및 활성화**

### 방법 2: SQL 직접 실행

```sql
-- pg_cron 확장 활성화 (Supabase에서 자동 활성화됨)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Cron Job 생성
SELECT cron.schedule(
  'process-subscription-payments-daily',  -- Job 이름
  '0 0 * * *',  -- 매일 00:00 UTC (한국 시간 09:00)
  $$
    SELECT net.http_post(
      'https://zykjdneewbzyazfukzyg.supabase.co/functions/v1/process-subscription-payments',
      '{}',
      '{"Authorization": "Bearer YOUR_ANON_KEY", "Content-Type": "application/json"}'::jsonb
    );
  $$
);

-- Cron Job 확인
SELECT * FROM cron.job WHERE jobname = 'process-subscription-payments-daily';

-- Cron Job 삭제 (필요 시)
SELECT cron.unschedule('process-subscription-payments-daily');
```

### 주의사항
- **UTC vs KST**: Cron은 UTC 기준으로 동작합니다. 한국 시간 09:00에 실행하려면 `0 0 * * *` (00:00 UTC) 설정
- **타임존 변경**: `0 9 * * *`로 설정하면 한국 시간 18:00 (UTC 09:00)에 실행됩니다.

---

## 모니터링

### 1. Edge Function 로그 확인
```bash
# Supabase CLI
supabase functions logs process-subscription-payments --tail

# Supabase Dashboard
# Functions → process-subscription-payments → Logs 탭
```

### 2. 결제 히스토리 조회
```sql
-- 오늘 처리된 결제 내역
SELECT
  sp.id,
  sp.subscription_id,
  sp.amount,
  sp.status,
  sp.error_message,
  sp.created_at,
  s.user_id,
  sp_plan.plan_name
FROM public.subscription_payments sp
JOIN public.subscriptions s ON sp.subscription_id = s.id
JOIN public.subscription_plans sp_plan ON s.plan_id = sp_plan.id
WHERE sp.created_at::date = CURRENT_DATE
ORDER BY sp.created_at DESC;
```

### 3. 구독 상태 모니터링
```sql
-- 정지된 구독 확인 (3회 연속 실패)
SELECT
  s.id,
  s.user_id,
  s.status,
  s.next_billing_date,
  COUNT(sp.id) FILTER (WHERE sp.status = 'failed') AS failed_count
FROM public.subscriptions s
LEFT JOIN public.subscription_payments sp ON s.id = sp.subscription_id
WHERE s.status = 'suspended'
GROUP BY s.id
ORDER BY s.updated_at DESC;
```

### 4. 활동 로그 조회
```sql
-- 구독 결제 활동 로그
SELECT
  al.action,
  al.created_at,
  al.metadata->>'amount' AS amount,
  al.metadata->>'plan_name' AS plan_name,
  al.metadata->>'error_message' AS error_message
FROM public.activity_logs al
WHERE al.entity_type = 'subscription'
  AND al.action IN ('subscription_payment_success', 'subscription_payment_failed', 'subscription_suspended')
ORDER BY al.created_at DESC
LIMIT 50;
```

---

## 트러블슈팅

### 문제 1: "TOSS_PAYMENTS_SECRET_KEY is not set" 에러

**증상**:
```
Error: TOSS_PAYMENTS_SECRET_KEY is not set
```

**해결**:
1. Supabase Dashboard → Project Settings → Edge Functions → Secrets
2. `TOSS_PAYMENTS_SECRET_KEY` 환경 변수 추가
3. Edge Function 재배포: `supabase functions deploy process-subscription-payments`

---

### 문제 2: 결제 처리 안 됨 (Cron Job 실행 안 됨)

**증상**:
- 매일 00:00 UTC에 자동 결제가 실행되지 않음

**확인**:
```sql
-- Cron Job 상태 확인
SELECT * FROM cron.job WHERE jobname = 'process-subscription-payments-daily';

-- Cron Job 실행 히스토리
SELECT * FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'process-subscription-payments-daily')
ORDER BY start_time DESC
LIMIT 10;
```

**해결**:
1. Cron Job이 없으면 생성 (위 "Cron 설정" 참조)
2. Authorization 헤더 확인 (ANON_KEY 올바른지)
3. Edge Function URL 확인 (프로젝트 ID 일치)

---

### 문제 3: "metadata column does not exist" 에러

**증상**:
```
column "metadata" of relation "subscription_payments" does not exist
```

**해결**:
```bash
# 마이그레이션 적용
supabase migration up

# 또는 직접 SQL 실행
ALTER TABLE public.subscription_payments
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
```

---

### 문제 4: 3회 재시도 후에도 계속 실패

**증상**:
- 네트워크 에러로 인해 3회 재시도 후에도 결제 실패

**확인**:
```sql
-- 최근 실패한 결제 조회
SELECT * FROM public.subscription_payments
WHERE status = 'failed'
ORDER BY created_at DESC
LIMIT 10;
```

**해결**:
1. 토스페이먼츠 API 상태 확인: https://status.tosspayments.com/
2. 빌링키 유효성 확인 (카드 만료, 정지 여부)
3. 사용자에게 이메일 알림 발송 (수동 결제 요청)
4. 구독 상태가 `suspended`로 변경되었는지 확인

---

### 문제 5: 로컬 테스트 시 타임아웃

**증상**:
```
Error: request timeout
```

**해결**:
```bash
# Supabase 로컬 서버 재시작
supabase stop
supabase start

# Edge Function 재시작
supabase functions serve process-subscription-payments
```

---

## 보안 체크리스트

- [ ] `TOSS_PAYMENTS_SECRET_KEY`를 절대 git에 커밋하지 않음
- [ ] `CRON_SECRET`를 설정하여 무단 호출 방지
- [ ] Edge Function은 service_role 키로만 DB 접근
- [ ] 활동 로그에 민감 정보(카드번호 등) 포함하지 않음
- [ ] 프로덕션 배포 전 테스트 키로 충분히 검증

---

## 다음 단계

1. **이메일 알림 구현** (선택)
   - 결제 실패 시 사용자에게 이메일 발송
   - 구독 정지 시 알림
   - 파일: `supabase/functions/send-payment-failure-email/index.ts`

2. **Sentry 통합** (선택)
   - Edge Function 에러를 Sentry로 전송
   - 실시간 모니터링 및 알림

3. **대시보드 통계** (선택)
   - Admin 대시보드에 구독 결제 통계 추가
   - 성공률, 실패율, 총 매출 표시

---

## 참고 자료

- [Supabase Edge Functions 문서](https://supabase.com/docs/guides/functions)
- [Supabase Cron Jobs 가이드](https://supabase.com/docs/guides/database/extensions/pg_cron)
- [토스페이먼츠 API 문서](https://docs.tosspayments.com/reference)
- [토스페이먼츠 빌링키 결제 가이드](https://docs.tosspayments.com/guides/billing)

---

**마지막 업데이트**: 2025-11-22
**작성자**: Claude & Sinclair Seo
