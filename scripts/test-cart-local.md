# 로컬 환경에서 장바구니 기능 테스트 가이드

## 1. 로컬 서버 실행

```bash
npm run dev
```

서버가 `http://localhost:8080`에서 실행됩니다.

## 2. 테스트 계정으로 로그인

1. 브라우저에서 http://localhost:8080/login 접속
2. 이메일/비밀번호 입력:
   - 이메일: `admin@ideaonaction.local`
   - 비밀번호: `demian00`
3. "로그인" 버튼 클릭

## 3. 서비스 페이지 접속

- MVP 개발: http://localhost:8080/services/development/mvp
- 풀스택 개발: http://localhost:8080/services/development/fullstack
- 디자인 시스템: http://localhost:8080/services/development/design
- 운영 관리: http://localhost:8080/services/development/operations

## 4. 장바구니 담기 테스트

### MVP 개발 페이지
1. "가격 정책" 섹션으로 스크롤
2. 3개 패키지 중 하나 선택:
   - 기본 패키지: ₩5,000,000
   - 스탠다드 패키지: ₩8,000,000 (추천)
   - 프리미엄 패키지: ₩12,000,000
3. "장바구니 담기" 버튼 클릭
4. 토스트 메시지 확인: "장바구니에 추가되었습니다"

### 풀스택 개발 페이지
1. "가격 정책" 섹션으로 스크롤
2. "월 단위 계약" 테이블에서 플랜 선택:
   - 1인 팀: ₩3,000,000/월
   - 2인 팀: ₩5,500,000/월 (추천)
   - 3인 팀: ₩8,000,000/월
3. 하단 "선택" 행에서 "장바구니 담기" 버튼 클릭
4. 토스트 메시지 확인

## 5. 장바구니 확인

1. 헤더 우측 상단의 장바구니 아이콘 클릭
2. 장바구니 드로어가 열리고 추가한 항목 확인
3. 수량 변경, 삭제, 결제하기 테스트

## 6. 결제 프로세스 테스트

1. 장바구니에서 "결제하기" 버튼 클릭
2. Checkout 페이지로 이동
3. 결제 방법 선택:
   - Toss Payments (권장)
   - Kakao Pay
4. "₩XX,XXX,XXX원 결제하기" 버튼 클릭
5. 테스트 결제창 확인

## 주의사항

### OAuth 로그인 (Google, GitHub, Kakao) 사용 시
- 로컬 환경에서는 OAuth 로그인이 **프로덕션 URL로 리다이렉트**됩니다
- Supabase Dashboard에서 Redirect URL을 `http://localhost:8080/auth/callback`으로 추가해야 정상 작동합니다
- **개발 중에는 이메일/비밀번호 로그인을 권장합니다**

### 비로그인 상태에서 테스트
1. 로그아웃 (헤더 우측 프로필 → "로그아웃")
2. 서비스 페이지 접속
3. "장바구니 담기" 클릭
4. 로그인 페이지로 자동 리다이렉트되는지 확인

## 예상 결과

### 성공 케이스
- ✅ 토스트 메시지: "장바구니에 추가되었습니다"
- ✅ 헤더 장바구니 아이콘에 배지 표시 (예: 1, 2, 3)
- ✅ 장바구니 드로어에서 추가한 항목 확인 가능

### 실패 케이스
- ❌ 401 Unauthorized: 로그인 필요 → 로그인 페이지로 리다이렉트
- ❌ 403 Forbidden: RLS 정책 오류 → Supabase 설정 확인 필요
- ❌ 500 Server Error: 데이터베이스 연결 오류 → 환경 변수 확인

## 트러블슈팅

### 1. 장바구니에 추가되지 않음
```bash
# 브라우저 개발자 도구 (F12) → Console 탭에서 에러 확인
# Network 탭에서 POST /rest/v1/carts 또는 POST /rest/v1/cart_items 요청 확인
```

### 2. 로그인 후 프로덕션으로 이동
```bash
# .env.local 파일에서 Supabase URL 확인
cat .env.local | grep VITE_SUPABASE_URL

# Supabase Dashboard → Authentication → URL Configuration
# Site URL: http://localhost:8080
# Redirect URLs: http://localhost:8080/auth/callback
```

### 3. RLS 정책 오류 (403 Forbidden)
```sql
-- Supabase SQL Editor에서 실행
SELECT * FROM carts WHERE user_id = auth.uid();
SELECT * FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid());
```

## 추가 테스트 항목

### 장바구니 수량 변경
1. 장바구니 드로어 열기
2. 수량 증가/감소 버튼 클릭
3. 총 금액 자동 업데이트 확인

### 장바구니 항목 삭제
1. 장바구니 드로어에서 "삭제" 버튼 클릭
2. 항목이 즉시 사라지는지 확인
3. 빈 장바구니 상태에서 "장바구니가 비어있습니다" 메시지 확인

### 여러 서비스 추가
1. MVP 개발 패키지 1개 추가
2. 풀스택 개발 플랜 1개 추가
3. 디자인 시스템 패키지 1개 추가
4. 장바구니에서 3개 항목 모두 표시되는지 확인
5. 총 금액이 정확히 합산되는지 확인
