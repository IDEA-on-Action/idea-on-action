# Google Tag Manager 설정 가이드

이 가이드는 IDEA on Action 프로젝트에서 Google Tag Manager (GTM)와 Google Analytics 4 (GA4)를 설정하는 방법을 설명합니다.

## 목차

1. [개요](#개요)
2. [GTM 컨테이너에서 GA4 태그 설정](#gtm-컨테이너에서-ga4-태그-설정)
3. [dataLayer 이벤트 구조](#datalayer-이벤트-구조)
4. [테스트 및 검증](#테스트-및-검증)
5. [트러블슈팅](#트러블슈팅)

---

## 개요

### 현재 구현 상태

프로젝트에는 이미 GTM 코드가 포함되어 있습니다:

- **GTM 컨테이너 ID**: `GTM-MSSSRHKZ`
- **GTM 스크립트 위치**: `index.html`의 `<head>` 섹션 최상단
- **GTM noscript**: `index.html`의 `<body>` 태그 바로 뒤
- **이벤트 추적**: `src/lib/analytics.ts`에서 `dataLayer`를 통해 이벤트 전송

### 아키텍처

```
index.html (GTM 스크립트)
    ↓
GTM 컨테이너 (GTM-MSSSRHKZ)
    ↓
GA4 태그 (GTM에서 설정 필요)
    ↓
Google Analytics 4
```

애플리케이션은 `dataLayer.push()`를 통해 이벤트를 전송하며, GTM이 이를 GA4로 전달합니다.

---

## GTM 컨테이너에서 GA4 태그 설정

### 1단계: GTM 웹사이트 접속

1. [Google Tag Manager](https://tagmanager.google.com/)에 접속합니다.
2. GTM 컨테이너 `GTM-MSSSRHKZ`를 선택합니다.

### 2단계: GA4 구성 태그 생성

1. **태그 추가** 버튼을 클릭합니다.
2. **태그 구성**을 클릭하고 **Google Analytics: GA4 구성**을 선택합니다.
3. **측정 ID**에 GA4 Measurement ID를 입력합니다.
   - 형식: `G-XXXXXXXXXX`
   - GA4 속성에서 확인 가능: 관리 → 데이터 스트림 → 웹 스트림 → 측정 ID

### 3단계: 트리거 설정

1. **트리거 선택** 섹션에서 **트리거 만들기**를 클릭합니다.
2. **트리거 유형**에서 **페이지뷰**를 선택합니다.
3. **이 트리거 발생 위치**에서 **모든 페이지**를 선택합니다.
4. 트리거 이름을 입력합니다 (예: "All Pages - Page View").
5. **저장**을 클릭합니다.

### 4단계: 태그 설정 완료

1. 태그 이름을 입력합니다 (예: "GA4 Configuration").
2. **저장**을 클릭합니다.
3. **제출** 버튼을 클릭하여 변경사항을 게시합니다.
4. 버전 이름과 설명을 입력하고 **게시**를 클릭합니다.

### 5단계: 커스텀 이벤트 태그 설정 (선택사항)

애플리케이션에서 전송하는 커스텀 이벤트를 추적하려면 추가 태그를 설정합니다:

#### 예시: 장바구니 추가 이벤트

1. **태그 추가** → **태그 구성** → **Google Analytics: GA4 이벤트** 선택
2. **측정 ID**에 동일한 GA4 Measurement ID 입력
3. **이벤트 이름**: `add_to_cart`
4. **트리거 선택** → **트리거 만들기**
   - **트리거 유형**: 커스텀 이벤트
   - **이벤트 이름**: `add_to_cart`
5. 저장 및 게시

#### 주요 커스텀 이벤트 목록

애플리케이션에서 전송하는 주요 이벤트:

- `page_view` - 페이지 조회
- `add_to_cart` - 장바구니 추가
- `remove_from_cart` - 장바구니 제거
- `begin_checkout` - 체크아웃 시작
- `add_payment_info` - 결제 정보 추가
- `purchase` - 구매 완료
- `login` - 로그인
- `sign_up` - 회원가입
- `search` - 검색
- `view_service` - 서비스 조회
- `view_blog_post` - 블로그 게시물 조회
- `click_cta` - CTA 클릭
- `share` - 콘텐츠 공유
- `file_download` - 파일 다운로드
- `exception` - 에러 발생
- `update_profile` - 프로필 업데이트
- `enable_2fa` - 2FA 활성화
- `notification_interaction` - 알림 상호작용
- `chatbot_interaction` - 챗봇 상호작용
- `apply_filter` - 필터 적용

---

## dataLayer 이벤트 구조

애플리케이션은 `src/lib/analytics.ts`를 통해 `dataLayer`에 이벤트를 푸시합니다.

### 기본 함수

#### `trackPageView(path, title)`

페이지 조회 이벤트를 전송합니다.

```javascript
window.dataLayer.push({
  event: 'page_view',
  page_path: '/services',
  page_title: '서비스 - IDEA on Action'
});
```

#### `trackEvent(eventName, parameters)`

커스텀 이벤트를 전송합니다.

```javascript
window.dataLayer.push({
  event: 'add_to_cart',
  currency: 'KRW',
  value: 100000,
  items: [
    {
      item_id: 'service-1',
      item_name: 'AI 컨설팅',
      price: 100000,
      quantity: 1
    }
  ]
});
```

#### `trackConversion(conversionId, value, currency)`

전환 이벤트를 전송합니다.

```javascript
window.dataLayer.push({
  event: 'conversion',
  send_to: 'AW-XXXXXXXXX/YYYYYYYYYY',
  value: 100000,
  currency: 'KRW'
});
```

### analytics 객체 메서드

#### E-commerce 이벤트

**장바구니 추가**
```javascript
analytics.addToCart({
  id: 'service-1',
  name: 'AI 컨설팅',
  price: 100000,
  quantity: 1
});

// dataLayer에 전송되는 데이터:
{
  event: 'add_to_cart',
  currency: 'KRW',
  value: 100000,
  items: [
    {
      item_id: 'service-1',
      item_name: 'AI 컨설팅',
      price: 100000,
      quantity: 1
    }
  ]
}
```

**구매 완료**
```javascript
analytics.purchase('order-123', 200000, [
  { item_id: 'service-1', item_name: 'AI 컨설팅', price: 100000 },
  { item_id: 'service-2', item_name: '데이터 분석', price: 100000 }
]);

// dataLayer에 전송되는 데이터:
{
  event: 'purchase',
  transaction_id: 'order-123',
  value: 200000,
  currency: 'KRW',
  items: [...]
}
```

#### 사용자 이벤트

**로그인**
```javascript
analytics.login('google');

// dataLayer에 전송되는 데이터:
{
  event: 'login',
  method: 'google'
}
```

**회원가입**
```javascript
analytics.signUp('email');

// dataLayer에 전송되는 데이터:
{
  event: 'sign_up',
  method: 'email'
}
```

#### 콘텐츠 이벤트

**서비스 조회**
```javascript
analytics.viewService('service-1', 'AI 컨설팅', 'consulting');

// dataLayer에 전송되는 데이터:
{
  event: 'view_service',
  service_id: 'service-1',
  service_name: 'AI 컨설팅',
  service_category: 'consulting'
}
```

**블로그 게시물 조회**
```javascript
analytics.viewBlogPost('post-1', 'AI 트렌드 2025', 'tech');

// dataLayer에 전송되는 데이터:
{
  event: 'view_blog_post',
  post_id: 'post-1',
  post_title: 'AI 트렌드 2025',
  post_category: 'tech'
}
```

**검색**
```javascript
analytics.searchWithResults('AI', 'all', 15);

// dataLayer에 전송되는 데이터:
{
  event: 'search',
  search_term: 'AI',
  search_type: 'all',
  result_count: 15
}
```

#### 상호작용 이벤트

**CTA 클릭**
```javascript
analytics.clickCTA('header', '문의하기', '/contact');

// dataLayer에 전송되는 데이터:
{
  event: 'click_cta',
  cta_location: 'header',
  cta_label: '문의하기',
  cta_url: '/contact'
}
```

**콘텐츠 공유**
```javascript
analytics.shareContent('blog', 'post-1', 'kakao');

// dataLayer에 전송되는 데이터:
{
  event: 'share',
  content_type: 'blog',
  content_id: 'post-1',
  method: 'kakao'
}
```

#### 기타 이벤트

**에러 발생**
```javascript
analytics.error('Network request failed', '/checkout', 'network');

// dataLayer에 전송되는 데이터:
{
  event: 'exception',
  description: 'Network request failed',
  page: '/checkout',
  error_type: 'network',
  fatal: false
}
```

**2FA 활성화**
```javascript
analytics.enable2FA();

// dataLayer에 전송되는 데이터:
{
  event: 'enable_2fa',
  security_action: '2fa_enabled'
}
```

---

## 테스트 및 검증

### 0. 자동 검증 스크립트 (권장)

프로젝트에 포함된 검증 스크립트를 사용하여 설정을 자동으로 확인할 수 있습니다.

#### 정적 검증 (코드 검사)

터미널에서 다음 명령어를 실행합니다:

```bash
npm run verify:gtm
```

이 스크립트는 다음을 검증합니다:

1. **index.html 검증**
   - GTM 스크립트가 `<head>` 최상단에 있는지
   - GTM noscript가 `<body>` 바로 뒤에 있는지
   - GTM 컨테이너 ID (`GTM-MSSSRHKZ`)가 올바른지

2. **analytics.ts 검증**
   - 필수 함수들이 올바르게 구현되어 있는지
   - `analytics` 객체의 메서드들이 올바른지
   - `dataLayer` 사용이 올바른지

3. **App.tsx 검증**
   - `AnalyticsTracker` 컴포넌트가 사용되는지
   - `initGA4()` 호출이 없는지 (GTM 사용 시 불필요)

#### 브라우저 검증 (런타임 검사)

검증 스크립트 실행 후, 브라우저 콘솔에서 실행할 수 있는 검증 코드가 출력됩니다. 또는 다음 단계를 따르세요:

1. 개발 서버 실행: `npm run dev`
2. 브라우저에서 개발자 도구 (F12) 열기
3. Console 탭에서 검증 스크립트가 제공하는 JavaScript 코드 실행

또는 직접 다음 코드를 실행할 수 있습니다:

```javascript
// GTM 로드 확인
console.log('GTM 로드:', typeof window.google_tag_manager !== 'undefined');
console.log('GTM 컨테이너:', window.google_tag_manager?.['GTM-MSSSRHKZ']);
console.log('dataLayer:', window.dataLayer);
console.log('dataLayer 길이:', window.dataLayer?.length);
```

### 1. GTM Preview 모드

GTM Preview 모드를 사용하여 태그가 제대로 작동하는지 확인합니다.

1. GTM 웹사이트에서 **미리보기** 버튼을 클릭합니다.
2. 웹사이트 URL을 입력합니다 (예: `https://ideaonaction.ai`).
3. 새 창에서 웹사이트가 열리고 GTM 디버그 창이 표시됩니다.
4. 페이지를 탐색하며 다음을 확인합니다:
   - **태그** 탭에서 GA4 태그가 실행되는지 확인
   - **이벤트** 탭에서 dataLayer 이벤트가 감지되는지 확인
   - **데이터 레이어** 탭에서 전송된 데이터 확인

### 2. Google 태그 테스트 도구

Google의 공식 태그 테스트 도구를 사용합니다.

1. [Google 태그 테스트 도구](https://tagassistant.google.com/)에 접속합니다.
2. 웹사이트 URL을 입력합니다 (예: `https://ideaonaction.ai`).
3. **시작** 버튼을 클릭합니다.
4. 다음을 확인합니다:
   - GTM 컨테이너가 감지되는지
   - GA4 태그가 감지되는지
   - 이벤트가 전송되는지

### 3. 브라우저 개발자 도구

브라우저 개발자 도구에서 직접 확인합니다.

#### Chrome DevTools

1. **F12** 또는 **우클릭 → 검사**로 개발자 도구를 엽니다.
2. **Console** 탭에서 다음 명령어를 실행합니다:

```javascript
// dataLayer 확인
console.log(window.dataLayer);

// 최근 이벤트 확인
window.dataLayer.filter(item => item.event);
```

3. **Network** 탭에서 다음을 확인합니다:
   - `gtm.js` 파일이 로드되는지
   - `collect` 또는 `r/collect` 요청이 GA4로 전송되는지

#### dataLayer 모니터링

Console에서 dataLayer를 실시간으로 모니터링합니다:

```javascript
// dataLayer 변경 감지
const originalPush = window.dataLayer.push;
window.dataLayer.push = function(...args) {
  console.log('dataLayer.push:', args);
  return originalPush.apply(window.dataLayer, args);
};
```

### 4. GA4 실시간 보고서

GA4에서 실시간으로 이벤트를 확인합니다.

1. [Google Analytics](https://analytics.google.com/)에 접속합니다.
2. GA4 속성을 선택합니다.
3. **보고서** → **실시간**을 클릭합니다.
4. 웹사이트에서 이벤트를 트리거하고 실시간 보고서에서 확인합니다.

---

## 트러블슈팅

### 문제 1: GTM 태그가 감지되지 않음

**증상**: Google 태그 테스트 도구에서 GTM 컨테이너를 찾을 수 없습니다.

**해결 방법**:

1. **index.html 확인**
   - GTM 스크립트가 `<head>` 최상단에 있는지 확인
   - GTM 컨테이너 ID가 올바른지 확인 (`GTM-MSSSRHKZ`)
   - GTM noscript가 `<body>` 바로 뒤에 있는지 확인

2. **브라우저 캐시 삭제**
   - 브라우저 캐시를 삭제하고 페이지를 새로고침
   - 시크릿 모드에서 테스트

3. **네트워크 확인**
   - 개발자 도구 → Network 탭에서 `gtm.js` 파일이 로드되는지 확인
   - 차단 확장 프로그램이 있는지 확인 (AdBlock 등)

### 문제 2: 이벤트가 GA4로 전송되지 않음

**증상**: dataLayer에 이벤트는 푸시되지만 GA4에서 확인되지 않습니다.

**해결 방법**:

1. **GTM 태그 설정 확인**
   - GA4 구성 태그가 올바르게 설정되었는지 확인
   - Measurement ID가 올바른지 확인
   - 트리거가 올바르게 설정되었는지 확인

2. **이벤트 이름 확인**
   - GTM에서 이벤트 이름이 정확히 일치하는지 확인
   - 대소문자 구분 확인

3. **GTM Preview 모드 사용**
   - GTM Preview 모드에서 태그가 실행되는지 확인
   - 디버그 창에서 오류 메시지 확인

### 문제 3: dataLayer 오류

**증상**: Console에 dataLayer 관련 오류가 표시됩니다.

**해결 방법**:

1. **dataLayer 초기화 확인**
   ```javascript
   // Console에서 확인
   console.log(window.dataLayer);
   // 결과: [] 또는 [{...}, {...}]
   ```

2. **GTM 스크립트 로드 확인**
   ```javascript
   // Console에서 확인
   console.log(window.google_tag_manager);
   // 결과: {GTM-MSSSRHKZ: {...}}
   ```

2. **페이지 로드 순서 확인**
   - GTM 스크립트가 다른 스크립트보다 먼저 로드되는지 확인
   - `index.html`에서 GTM 스크립트가 최상단에 있는지 확인

### 문제 4: 이벤트가 중복으로 전송됨

**증상**: 같은 이벤트가 여러 번 전송됩니다.

**해결 방법**:

1. **React StrictMode 확인**
   - 개발 모드에서 React StrictMode가 이벤트를 두 번 트리거할 수 있음
   - 프로덕션 빌드에서 확인

2. **컴포넌트 리렌더링 확인**
   - `useEffect` 의존성 배열 확인
   - 이벤트 트리거 로직이 여러 번 실행되지 않는지 확인

3. **GTM 태그 중복 확인**
   - GTM에서 같은 이벤트에 대한 태그가 중복으로 설정되지 않았는지 확인

### 문제 5: 페이지뷰가 추적되지 않음

**증상**: 페이지를 이동해도 GA4에서 페이지뷰가 기록되지 않습니다.

**해결 방법**:

1. **AnalyticsTracker 컴포넌트 확인**
   - `src/App.tsx`에서 `AnalyticsTracker`가 포함되어 있는지 확인
   - React Router의 `useLocation`이 제대로 작동하는지 확인

2. **SPA 라우팅 확인**
   - Single Page Application이므로 페이지 전환 시 `trackPageView`가 호출되는지 확인
   - 브라우저 히스토리 API를 사용하는지 확인

3. **GTM History Change 트리거**
   - GTM에서 **History Change** 트리거를 추가하여 SPA 페이지 전환을 추적할 수 있습니다.

---

## 추가 리소스

- [Google Tag Manager 공식 문서](https://support.google.com/tagmanager)
- [Google Analytics 4 공식 문서](https://support.google.com/analytics/answer/10089681)
- [GTM dataLayer 가이드](https://developers.google.com/tag-manager/devguide)
- [GA4 이벤트 참조](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)

---

## 요약

1. ✅ GTM 코드는 이미 `index.html`에 포함되어 있습니다.
2. ✅ GTM 컨테이너에서 GA4 구성 태그를 생성합니다.
3. ✅ 애플리케이션은 `dataLayer.push()`를 통해 이벤트를 전송합니다.
4. ✅ GTM Preview 모드와 Google 태그 테스트 도구로 검증합니다.
5. ✅ GA4 실시간 보고서에서 이벤트를 확인합니다.

설정이 완료되면 모든 사용자 행동이 GA4로 자동으로 전송됩니다.

