# 프로덕션 배포 로그 - 2025-11-15

**배포일**: 2025-11-15
**커밋**: 4113717
**브랜치**: main
**배포 방식**: GitHub Actions 자동 배포 (Vercel)

---

## 📦 배포 내용

### 1. Google OAuth 정보 업데이트
- **변경**: 새 Google Client ID/Secret으로 교체
- **Client ID**: `1073580175433-407gbhdutr4r57372q3efg5143tt4lor.apps.googleusercontent.com`
- **영향 범위**: Google 소셜 로그인 기능
- **테스트 필요**: ✅ `/login` 페이지 Google 로그인

### 2. 주문번호 Race Condition 수정
- **문제**: 동시 요청 시 주문번호 중복 생성 (409 Conflict)
- **해결**: 타임스탬프 + 랜덤 suffix 방식으로 변경
- **주문번호 형식**:
  - 기존: `ORD-YYYYMMDD-XXXX` (예: `ORD-20251115-0001`)
  - 변경: `ORD-YYYYMMDD-HHMMSS-XXX` (예: `ORD-20251115-143052-A3F`)
- **영향 범위**: Checkout 페이지 주문 생성 기능
- **테스트 필요**: ✅ `/checkout` 페이지 주문 생성

---

## 🔍 변경 파일

```
docs/guides/auth/oauth-setup.md
  - Google OAuth Client ID/Secret 문서 업데이트

supabase/migrations/fix-generate-order-number.sql
  - generate_order_number() 함수 수정 (타임스탬프 방식)

docs/hotfix/2025-11-15-order-number-fix.md
  - Hotfix 문서 작성
```

---

## ✅ 배포 전 체크리스트

- [x] 로컬 테스트 통과
  - [x] 주문번호 생성 3회 테스트 (모두 고유 값)
  - [x] Checkout 페이지 주문 생성 성공
- [x] Git 커밋 & 푸시
  - [x] 커밋 메시지 작성
  - [x] main 브랜치 푸시 완료
- [x] 환경 변수 확인
  - [x] Vercel: Google OAuth 정보 업데이트 완료
  - [x] Supabase: Google Provider 설정 완료
  - [x] Supabase: generate_order_number() 함수 수정 완료

---

## 🚀 배포 절차

### 1. GitHub 푸시
```bash
git push origin main
```
- ✅ 완료: 2025-11-15 (커밋 4113717)

### 2. Vercel 자동 배포
- **트리거**: main 브랜치 푸시 감지
- **워크플로우**: `.github/workflows/deploy-production.yml`
- **배포 대상**: Production (www.ideaonaction.ai)

**배포 상태 확인**:
```
https://vercel.com/ideaonaction/idea-on-action/deployments
```

### 3. 예상 배포 시간
- 빌드: ~2-3분
- 배포: ~1분
- **총 소요 시간**: ~3-4분

---

## 🧪 배포 후 테스트 계획

### 1. Google OAuth 로그인 테스트
```
URL: https://www.ideaonaction.ai/login

테스트 순서:
1. 시크릿 모드로 접속
2. "Google로 계속하기" 버튼 클릭
3. Google 계정 선택
4. 권한 동의
5. 홈페이지로 리다이렉트 확인

예상 결과:
✅ 로그인 성공
✅ 사용자 프로필 드롭다운 표시
✅ 에러 없음
```

### 2. Checkout 주문 생성 테스트
```
URL: https://www.ideaonaction.ai/checkout

전제 조건:
- 로그인 상태
- 장바구니에 상품 추가

테스트 순서:
1. Checkout 페이지 접속
2. 배송 정보 입력
3. 주문자 정보 입력
4. 약관 전체 동의
5. "주문하기" 버튼 클릭
6. 결제 페이지 이동 확인

예상 결과:
✅ 주문번호 생성 (ORD-20251115-HHMMSS-XXX 형식)
✅ 409 Conflict 에러 없음
✅ 결제 페이지 이동 성공
```

### 3. Sentry 에러 모니터링
```
URL: https://sentry.io/organizations/.../projects/idea-on-action/

확인 사항:
- 주문번호 중복 에러 소멸 확인
- 새로운 에러 발생 여부 확인
```

---

## 📊 배포 후 모니터링

### 1. 즉시 확인 (배포 후 10분)
- [ ] Google 로그인 기능 정상 동작
- [ ] Checkout 주문 생성 기능 정상 동작
- [ ] Sentry 에러 로그 확인
- [ ] Vercel 배포 로그 확인

### 2. 단기 모니터링 (배포 후 1시간)
- [ ] Google Analytics 이벤트 트래킹 정상
- [ ] 사용자 피드백 수집 (Discord, 이메일)
- [ ] 주문 데이터베이스 확인 (중복 주문번호 없는지)

### 3. 중기 모니터링 (배포 후 24시간)
- [ ] 주문 성공률 측정
- [ ] Google 로그인 성공률 측정
- [ ] 에러율 감소 확인 (Sentry)

---

## 🔄 롤백 계획 (필요 시)

### 롤백 트리거
- Google 로그인 실패율 50% 이상
- Checkout 주문 생성 실패율 30% 이상
- 새로운 Critical 에러 발생

### 롤백 절차
1. Vercel Dashboard → Deployments
2. 이전 배포 선택 (커밋 e911d3d)
3. "Promote to Production" 클릭
4. 롤백 완료 (~1분)

### 롤백 후 조치
1. Supabase 함수 원복 (이전 generate_order_number)
2. Google OAuth 정보 원복 (이전 Client ID/Secret)
3. 원인 분석 및 재수정

---

## 📝 배포 결과 (작성 대기)

### Vercel 배포 로그
```
[작성 예정: 배포 완료 후 추가]
- 빌드 시간: ?
- 번들 크기: ?
- 배포 URL: https://www.ideaonaction.ai/
```

### 테스트 결과
```
[작성 예정: 테스트 완료 후 추가]
- Google 로그인: ?
- Checkout 주문 생성: ?
- Sentry 에러: ?
```

---

## 🎯 후속 작업

### 즉시
- [ ] 프로덕션 Google 로그인 테스트
- [ ] 프로덕션 Checkout 테스트
- [ ] 배포 결과 문서 업데이트

### 단기 (1주)
- [ ] 사용자 피드백 수집
- [ ] Sentry 에러 로그 분석
- [ ] 주문번호 형식 사용자 반응 확인

### 중기 (1달)
- [ ] Google OAuth 사용 통계 확인
- [ ] 주문 성공률 통계 확인
- [ ] 필요 시 주문번호 형식 재조정 검토

---

**작성자**: Claude AI
**배포 담당**: 서민원
**배포일**: 2025-11-15
