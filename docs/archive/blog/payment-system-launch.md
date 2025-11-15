# 토스페이먼츠로 결제 기능을 붙였습니다 (심의 진행 중)

> React + TypeScript + Supabase + Toss Payments

---

## 🚀 들어가며

IDEA on Action 웹사이트에 **토스페이먼츠** 결제 시스템을 구현했습니다.

현재 **토스페이먼츠 정식 계약 심의 중**이며, 승인 후 프로덕션 환경에 배포할 예정입니다.

---

## 💳 결제 프로세스

간단한 4단계로 구성했습니다:

```
🛒 장바구니 → 📝 주문 정보 → 💳 토스페이먼츠 → ✅ 완료
```

---

## 🔧 토스페이먼츠 구현

### 1. SDK 연동

**JavaScript SDK** 방식으로 구현했습니다.

```typescript
// 1단계: SDK 로드
import { loadTossPayments } from '@tosspayments/payment-sdk';

const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
```

### 2. 결제 요청

```typescript
// 2단계: 결제 창 열기
async function initiateTossPay(orderId: string, amount: number, orderName: string) {
  await tossPayments.requestPayment('카드', {
    amount,
    orderId: orderNumber,
    orderName,
    successUrl: `${origin}/checkout/success?order_id=${orderId}`,
    failUrl: `${origin}/checkout/fail?order_id=${orderId}`,
  });
}
```

### 3. 결제 승인

```typescript
// 3단계: 서버사이드 결제 승인
async function confirmTossPay(orderId: string, paymentKey: string, amount: number) {
  const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(TOSS_SECRET_KEY + ':')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount,
    }),
  });

  const result = await response.json();

  // DB 저장
  await supabase.from('payments').insert({
    order_id: orderId,
    provider: 'toss',
    provider_transaction_id: result.paymentKey,
    amount: result.totalAmount,
    status: 'completed',
  });

  return result;
}
```

---

## 🛡️ 보안 설계

### 1. 금액 검증 (서버사이드)

클라이언트에서 금액 조작을 방지하기 위해 **서버사이드 검증**을 추가했습니다.

```typescript
// 결제 승인 전 금액 검증
const { data: order } = await supabase
  .from('orders')
  .select('total_amount')
  .eq('id', orderId)
  .single();

if (order.total_amount !== amount) {
  throw new Error('금액이 일치하지 않습니다');
}
```

### 2. Supabase RLS

데이터베이스 레벨에서 접근 제어:

```sql
-- 사용자는 본인 주문만 조회 가능
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);
```

---

## 📊 기술 스택

### Frontend
- React 18 + TypeScript
- Vite (빌드 도구)
- React Query (서버 상태)
- Zustand (클라이언트 상태)
- shadcn/ui (UI)

### Backend
- Supabase PostgreSQL
- Row Level Security (RLS)

### Payments
- **Toss Payments** (JavaScript SDK)

---

## 📝 심의 진행 상황

### 현재 상태
- ✅ 테스트 환경 구현 완료
- 🔄 **토스페이먼츠 정식 계약 심의 중**
- ⏳ 승인 후 프로덕션 배포 예정

### 심의 요구사항
토스페이먼츠 정식 계약을 위해 다음 항목을 준비했습니다:

1. **사업자 정보**
   - 사업자등록번호: 537-05-01511
   - 통신판매업 신고번호: 2025-경기시흥-2094
   - 대표자: 서민원

2. **법적 문서** (4개)
   - 이용약관 (/terms)
   - 개인정보처리방침 (/privacy)
   - 환불정책 (/refund-policy)
   - 전자금융거래약관 (/electronic-finance-terms)

3. **보안 준수**
   - HTTPS 강제 (프로덕션)
   - 결제 금액 서버사이드 검증
   - Secret Key 환경변수 관리

### 다음 단계
- [ ] 토스페이먼츠 심의 완료
- [ ] 프로덕션 API 키 발급
- [ ] 환경 변수 업데이트
- [ ] 프로덕션 배포
- [ ] 실결제 테스트

---

## 🎓 배운 점

### 1. SDK 통합의 간편함

토스페이먼츠 JavaScript SDK는 **3단계**로 간단하게 통합할 수 있었습니다:

1. SDK 로드
2. 결제 요청 (`requestPayment`)
3. 결제 승인 (`confirm`)

REST API 방식보다 훨씬 간편했습니다.

### 2. 보안의 중요성

결제 시스템은 **사용자 자산**을 다루므로:
- ✅ 서버사이드 금액 검증 필수
- ✅ Secret Key 노출 금지
- ✅ HTTPS 강제

### 3. 법적 준비의 필요성

전자상거래법, 전자금융거래법 준수를 위해:
- ✅ 사업자 정보 표시 의무
- ✅ 법적 문서 4개 필수 (이용약관, 개인정보처리방침, 환불정책, 전자금융거래약관)
- ✅ 법률 전문가 검토 권장

---

## 📈 성과

- ✅ **토스페이먼츠 테스트 환경 구축 완료**
- ✅ **정식 계약 심의 진행 중**
- ✅ **법적 문서 4개 준비 완료**
- ✅ **보안 설계 완료** (서버사이드 검증, RLS)
- ✅ **타입 안전** (TypeScript strict mode)

---

## 🔮 향후 계획

### 단기 (심의 완료 후)
- [ ] 토스페이먼츠 프로덕션 배포
- [ ] 실결제 테스트
- [ ] 정기 결제 (구독) 추가

### 중기 (3개월)
- [ ] 카카오페이 추가 (멀티 게이트웨이)
- [ ] 포인트 시스템
- [ ] 쿠폰 시스템

### 장기 (6개월)
- [ ] 해외 결제 (Stripe)
- [ ] AI 추천 시스템

---

## 💬 마치며

토스페이먼츠 결제 시스템 구현은 **간편한 SDK**와 **명확한 문서**로 생각보다 쉽게 진행되었습니다.

현재 **정식 계약 심의 중**이며, 승인 후 프로덕션 환경에 배포하여 실제 결제를 처리할 예정입니다.

법적 준비사항(사업자 정보, 법적 문서 4개)도 완료했으니, 심의 통과 후 바로 서비스를 시작할 수 있을 것 같습니다.

---

## 🔗 링크

- 🌐 **Live Demo**: [https://www.ideaonaction.ai/services](https://www.ideaonaction.ai/services) (테스트 모드)
- 💻 **GitHub**: [https://github.com/IDEA-on-Action/idea-on-action](https://github.com/IDEA-on-Action/idea-on-action)
- 📧 **Contact**: sinclairseo@gmail.com

---

**읽어주셔서 감사합니다!** 🙏

토스페이먼츠 심의 결과는 추후 업데이트하겠습니다.

---

**Tags**: #TossPayments #결제시스템 #React #TypeScript #Supabase #전자상거래

**Author**: 서민원 (Sinclair Seo)
**Published**: 2025-01-14
**Category**: Engineering
**Status**: 심의 진행 중
