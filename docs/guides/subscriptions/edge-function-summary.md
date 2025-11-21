# Edge Function 구현 완료 요약

> **작성일**: 2025-11-22
> **작성자**: Claude & Sinclair Seo
> **목적**: 토스페이먼츠 자동 결제 처리 Edge Function 구현 완료 보고

---

## ✅ 완료 항목

### 1. Edge Function 개선
- **파일**: `supabase/functions/process-subscription-payments/index.ts`
- **주요 개선사항**:
  - ✅ 재시도 로직 추가 (Exponential Backoff, 최대 3회)
  - ✅ 3회 연속 실패 시 구독 정지 (suspended)
  - ✅ 활동 로그 통합 (activity_logs 테이블)
  - ✅ 결제 성공/실패 로깅 개선
  - ✅ `paid_at` 타임스탬프 추가

### 2. DB 마이그레이션
- **파일**: `supabase/migrations/20251122000003_add_subscription_payments_metadata.sql`
- **변경사항**:
  - ✅ `subscription_payments.metadata` 컬럼 추가 (JSONB)
  - ✅ GIN 인덱스 생성 (metadata 필드 쿼리 최적화)

### 3. 문서화
- **파일 1**: `docs/guides/subscriptions/edge-function-deployment.md` (300줄)
  - 배포 가이드 전체 (환경 변수, Cron 설정, 모니터링, 트러블슈팅)
- **파일 2**: `docs/guides/subscriptions/edge-function-summary.md` (이 파일)

### 4. 테스트 스크립트
- **파일 1**: `scripts/test-subscription-payment.sh` (Bash, Linux/macOS)
- **파일 2**: `scripts/test-subscription-payment.ps1` (PowerShell, Windows)
- **기능**:
  - 로컬/프로덕션 Edge Function 호출
  - 결과 JSON 파싱 및 표시
  - 다음 단계 안내

### 5. 빌드 에러 수정
- **파일**: `src/hooks/useNewsletterAdmin.ts`
- **문제**: 줄바꿈 문자열 리터럴 (`` 대신 `\n`)
- **해결**: Escape 문자열로 변경

---

## 📊 통계

### 코드 변경
- **수정된 파일**: 2개
  - `supabase/functions/process-subscription-payments/index.ts` (+80줄)
  - `src/hooks/useNewsletterAdmin.ts` (+2줄/-2줄)
- **신규 파일**: 5개
  - DB 마이그레이션 1개
  - 문서 2개
  - 테스트 스크립트 2개
- **총 라인**: +500줄 (코드 + 문서)

### Edge Function 주요 로직
- **재시도**: 네트워크 에러 및 5xx 에러 발생 시 최대 3회 재시도 (1초 → 2초 → 4초)
- **활동 로그**: 3가지 액션
  - `subscription_payment_success` - 결제 성공
  - `subscription_payment_failed` - 결제 실패
  - `subscription_suspended` - 구독 정지
- **구독 정지**: 3회 연속 실패 시 자동 정지 (사용자 알림 준비)

---

## 🚀 배포 단계

### Step 1: 로컬 테스트 (5분)
```bash
# 1. Supabase 로컬 서버 시작
supabase start

# 2. Edge Function 서빙
supabase functions serve process-subscription-payments

# 3. 테스트 스크립트 실행 (별도 터미널)
./scripts/test-subscription-payment.sh local
# 또는 Windows
.\scripts\test-subscription-payment.ps1 -Env local
```

### Step 2: DB 마이그레이션 적용 (1분)
```bash
# 로컬 DB
supabase db reset  # 모든 마이그레이션 재적용

# 프로덕션 DB
supabase db push   # 새 마이그레이션만 적용
```

### Step 3: 환경 변수 설정 (3분)
1. Supabase Dashboard → Project Settings → Edge Functions → Secrets
2. `TOSS_PAYMENTS_SECRET_KEY` 추가 (테스트 키 또는 프로덕션 키)
3. `CRON_SECRET` 추가 (선택, 무단 호출 방지용)

### Step 4: 프로덕션 배포 (2분)
```bash
# Edge Function 배포
supabase functions deploy process-subscription-payments

# 배포 확인
curl -i --location --request POST 'https://zykjdneewbzyazfukzyg.supabase.co/functions/v1/process-subscription-payments' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{}'
```

### Step 5: Cron Job 설정 (3분)
1. Supabase Dashboard → Database → Cron Jobs
2. New Cron Job 클릭
3. 다음 SQL 입력:
```sql
-- Schedule: 0 0 * * * (매일 00:00 UTC = 한국 시간 09:00)
SELECT net.http_post(
  'https://zykjdneewbzyazfukzyg.supabase.co/functions/v1/process-subscription-payments',
  '{}',
  '{"Authorization": "Bearer YOUR_ANON_KEY", "Content-Type": "application/json"}'::jsonb
);
```

### Step 6: 모니터링 설정 (선택, 10분)
- Supabase Dashboard → Functions → process-subscription-payments → Logs
- 활동 로그 쿼리 추가 (Admin Dashboard)
- Sentry 통합 (선택)

---

## 🔍 검증 체크리스트

### 기능 검증
- [ ] Edge Function 로컬 실행 성공
- [ ] 테스트 구독 결제 성공 확인
- [ ] `subscription_payments` 테이블에 레코드 생성 확인
- [ ] `subscriptions.next_billing_date` 업데이트 확인
- [ ] `activity_logs` 테이블에 로그 생성 확인
- [ ] 결제 실패 시 재시도 로직 동작 확인
- [ ] 3회 연속 실패 시 구독 정지 확인
- [ ] Cron Job 매일 00:00 UTC 실행 확인

### 보안 검증
- [ ] `TOSS_PAYMENTS_SECRET_KEY` 환경 변수에만 저장 (git에 없음)
- [ ] Edge Function은 service_role 키로만 DB 접근
- [ ] Cron Job은 ANON_KEY로 호출 (CRON_SECRET으로 추가 보호 가능)
- [ ] 활동 로그에 민감 정보(카드번호) 미포함

### 성능 검증
- [ ] Edge Function 실행 시간 < 30초 (구독 100개 기준)
- [ ] 재시도 시 Exponential Backoff 적용 (1s → 2s → 4s)
- [ ] 대량 결제 시 타임아웃 없음

---

## 📝 다음 단계 (선택 사항)

### 1. 이메일 알림 구현
- **목적**: 결제 실패/구독 정지 시 사용자에게 이메일 발송
- **예상 시간**: 1-2시간
- **파일**: `supabase/functions/send-payment-failure-email/index.ts`
- **참고**: [send-work-inquiry-email](d:/GitHub/idea-on-action/supabase/functions/send-work-inquiry-email/index.ts)

### 2. Sentry 통합
- **목적**: Edge Function 에러를 Sentry로 전송하여 실시간 모니터링
- **예상 시간**: 30분
- **패키지**: `@sentry/deno`

### 3. Admin 대시보드 통계
- **목적**: 구독 결제 통계 표시 (성공률, 실패율, 총 매출)
- **예상 시간**: 2-3시간
- **파일**: `src/pages/admin/AdminSubscriptions.tsx`

### 4. 결제 실패 알림 (Discord/Slack)
- **목적**: 구독 정지 시 관리자에게 즉시 알림
- **예상 시간**: 30분
- **방법**: Webhook 호출

---

## 🐛 알려진 제한사항

1. **이메일 알림 미구현**
   - 결제 실패 시 사용자에게 자동 이메일 발송 안 됨
   - 구독 정지 시 알림 안 됨
   - **해결**: `send-payment-failure-email` Edge Function 구현 필요

2. **재시도 간격 고정**
   - 현재: 1초 → 2초 → 4초 (Exponential Backoff)
   - **개선**: 토스페이먼츠 API Rate Limit에 맞춰 조정 가능

3. **대량 결제 처리 시간**
   - 구독 100개 기준 약 10-20초 소요
   - Edge Function 타임아웃: 60초
   - **제한**: 한 번에 300개 이상 구독 처리 시 타임아웃 가능
   - **해결**: 배치 처리 또는 큐 시스템 도입

4. **결제 멱등성**
   - 현재: `order_id`에 타임스탬프 포함 (`sub_{id}_{timestamp}`)
   - **주의**: 같은 구독을 여러 번 처리하면 중복 결제 가능
   - **해결**: 하루에 한 번만 실행하도록 Cron 설정 (00:00 UTC)

---

## 📚 참고 문서

- [Edge Function 배포 가이드](./edge-function-deployment.md) - 전체 배포 프로세스
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase Cron Jobs](https://supabase.com/docs/guides/database/extensions/pg_cron)
- [토스페이먼츠 API](https://docs.tosspayments.com/reference)
- [토스페이먼츠 빌링키 결제](https://docs.tosspayments.com/guides/billing)

---

## 💬 질문 및 피드백

### Q1: Cron Job이 실행되지 않습니다.
**A**: Cron Job 상태 확인:
```sql
SELECT * FROM cron.job WHERE jobname = 'process-subscription-payments-daily';
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

### Q2: 결제가 실패했는데 재시도가 안 됩니다.
**A**: 재시도는 네트워크 에러 및 5xx 에러에만 적용됩니다. 카드 잔액 부족 등 4xx 에러는 즉시 실패 처리됩니다.

### Q3: 구독이 3회 실패 후 정지되었는데 자동으로 복구되나요?
**A**: 아니요. 사용자가 직접 결제 수단을 변경하고 관리자가 수동으로 `status`를 `active`로 변경해야 합니다.

### Q4: 로컬 테스트 시 토스페이먼츠 API를 실제로 호출하나요?
**A**: 예. 테스트 키를 사용하면 실제 결제는 일어나지 않지만 API는 호출됩니다.

---

**마지막 업데이트**: 2025-11-22
**작성자**: Claude & Sinclair Seo
