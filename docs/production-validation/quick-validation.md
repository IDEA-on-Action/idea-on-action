# Services Platform Day 3 - 빠른 검증 가이드 (5분)

**목적**: 프로덕션 배포 후 5분 내 핵심 기능 검증

---

## 🚀 5분 검증 체크리스트

### 1분: 페이지 로딩 확인
```
1. https://www.ideaonaction.ai/services 접속
   ✅ 페이지 로드 < 3초
   ✅ 4개 서비스 카드 보임

2. https://www.ideaonaction.ai/services/mvp 접속
   ✅ ServiceDetail 페이지 로드 < 3초
   ✅ 제목, 설명, 이미지 표시됨
```

### 1분: 주요 기능 테스트
```
1. ServiceDetail 페이지에서 패키지 선택
   ✅ "장바구니 추가" 버튼 클릭
   ✅ Toast 알림 표시됨
   ✅ "장바구니 보기" 액션 버튼 있음

2. 장바구니 드로어 열기
   ✅ serviceItems 섹션 표시됨
   ✅ 추가한 패키지 보임
   ✅ 가격 표시됨
```

### 1분: 반응형 디자인 확인
```
1. 모바일 크기로 변경 (F12 → Toggle device toolbar)
   ✅ 1열 그리드 표시됨
   ✅ 텍스트 읽을 수 있음
   ✅ 버튼 누르기 쉬움 (48px+)

2. 태블릿 크기로 변경
   ✅ 2열 그리드 표시됨
   ✅ 레이아웃 정상
```

### 1분: Markdown 렌더링 확인
```
1. ServiceCard 설명 텍스트 확인
   ✅ **bold** 포맷 표시됨
   ✅ *italic* 포맷 표시됨
   ✅ 링크 클릭 가능

2. ServiceDetail description 확인
   ✅ Markdown 포맷 정상 렌더링
   ✅ 코드 블록 표시됨 (필요시)
```

### 1분: 에러 확인
```
1. 브라우저 개발자 도구 열기 (F12)
2. Console 탭 확인
   ✅ 붉은색 에러 없음
   ✅ 경고는 1-2개 이상 없음

3. Network 탭 확인
   ✅ 404 에러 없음
   ✅ 빨간색 실패 없음
```

---

## 🎯 검증 결과

모든 체크가 ✅일 경우: **배포 성공** 🎉

일부 체크가 ❌일 경우: **문제 조사 필요**

---

## 🔍 상세 검증 항목

### URL별 검증

#### /services (서비스 목록)
```
✅ 페이지 제목: "우리의 서비스"
✅ 4개 서비스 카드 표시:
   1. MVP 개발
   2. 풀스택 개발
   3. 디자인 시스템
   4. 운영 관리
✅ 카테고리 필터 (Tabs)
✅ 정렬 드롭다운
```

#### /services/mvp (MVP 서비스 상세)
```
✅ 페이지 제목: "MVP 개발"
✅ Hero 섹션:
   - 제목, 설명, 이미지
✅ PackageSelector:
   - "일회성" 탭 (active)
   - 3개 패키지 카드 표시
✅ 각 패키지:
   - 이름 (Standard, Pro, Enterprise)
   - 가격 (₩ 표시)
   - "장바구니 추가" 버튼
```

#### /services/fullstack (풀스택 서비스)
```
✅ PackageSelector:
   - "일회성" 탭
   - "정기 구독" 탭
✅ 정기 구독 플랜:
   - 월간, 분기, 연간 옵션
   - 가격 표시
```

#### /services/design (디자인 서비스)
```
✅ 2개 패키지 표시
✅ 가격 정상 렌더링
```

#### /services/operations (운영 관리)
```
✅ 3개 플랜 표시
✅ 가격 정상 렌더링
```

---

## 📊 성능 지표

### Lighthouse (Chrome DevTools)
```
Performance: 90+
Accessibility: 90+
Best Practices: 90+
SEO: 90+
```

### 로드 시간
```
FCP (First Contentful Paint): < 1.5초
LCP (Largest Contentful Paint): < 2.5초
CLS (Cumulative Layout Shift): < 0.1
TTI (Time to Interactive): < 3초
```

---

## 🐛 문제 시 즉시 조치

### 페이지 로드 실패
```
해결:
1. 브라우저 캐시 클리어
2. Vercel 대시보드에서 "Redeploy" 클릭
3. 5분 대기 후 재시도
```

### 데이터 표시 안 됨
```
해결:
1. 네트워크 탭에서 /services API 요청 확인
2. Supabase 대시보드에서 데이터 확인
3. Sentry 에러 로그 확인
```

### Markdown 렌더링 안 됨
```
해결:
1. 브라우저 개발자 도구에서 에러 확인
2. remarkGfm 플러그인 로드 확인
3. 필요시 rollout 실행
```

### 장바구니 버튼 작동 안 함
```
해결:
1. CartStore 초기화 확인
2. 브라우저 localStorage 확인
3. Sentry 에러 로그 확인
```

---

## 📱 브라우저별 테스트

| 브라우저 | 상태 | 체크사항 |
|---------|------|---------|
| Chrome | ✅ | 메인 테스트 환경 |
| Safari | ⚠️ | iOS, macOS 테스트 |
| Firefox | ✅ | 호환성 확인 |
| Edge | ✅ | Windows 테스트 |

---

## 🎉 배포 완료

모든 검증 체크가 ✅일 경우:

```
✅ 배포 성공!
✅ 모든 서비스 페이지 정상 작동
✅ 사용자 접근 가능
✅ 프로덕션 배포 완료
```

---

**검증 시간**: 약 5분
**검증 담당**: [담당자 이름]
**검증 완료**: 2025-11-21 [시간]
