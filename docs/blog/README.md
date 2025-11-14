# WordPress 블로그 포스트 가이드

이 디렉토리는 WordPress에 올릴 블로그 포스트와 스크린샷을 관리합니다.

## 📄 블로그 포스트

### 작성된 포스트

#### [payment-system-launch.md](./payment-system-launch.md)
- **제목**: "커뮤니티형 프로덕트 스튜디오에 결제 시스템을 붙였습니다"
- **주제**: React + TypeScript + Supabase 전자상거래 시스템 구축기
- **길이**: ~8,000단어
- **이미지**: 6개 (스크린샷)
- **태그**: #React #TypeScript #Supabase #전자상거래 #결제시스템

## 📸 스크린샷 생성

### 자동 캡처 스크립트

Playwright를 사용하여 결제 프로세스 화면을 자동으로 캡처합니다.

#### 사전 준비

1. **개발 서버 실행**
   ```bash
   npm run dev
   ```

2. **테스트 계정 확인**
   - 이메일: `admin@ideaonaction.local`
   - 비밀번호: `demian00`

3. **샘플 데이터 확인**
   - Supabase에 서비스 데이터가 최소 1개 이상 있어야 합니다.

#### 스크린샷 캡처 실행

```bash
npm run generate:screenshots
```

또는 환경 변수로 URL 변경:

```bash
# 프로덕션 사이트
BASE_URL=https://www.ideaonaction.ai npm run generate:screenshots

# 커스텀 테스트 계정
TEST_EMAIL=test@example.com TEST_PASSWORD=password123 npm run generate:screenshots
```

#### 캡처되는 화면 (6개)

1. **01-services-page.png** - 서비스 목록 페이지
2. **02-cart-drawer.png** - 장바구니 Drawer (슬라이드 패널)
3. **03-checkout-page.png** - 체크아웃 페이지 (폼 + 주문 요약)
4. **04-payment-method.png** - 결제 수단 선택
5. **05-orders-page.png** - 주문 내역 페이지
6. **06-order-detail.png** - 주문 상세 페이지 (선택사항)

#### 저장 경로

```
public/blog-screenshots/payment-process/
├── 01-services-page.png
├── 02-cart-drawer.png
├── 03-checkout-page.png
├── 04-payment-method.png
├── 05-orders-page.png
└── 06-order-detail.png
```

### 수동 캡처

자동 스크립트가 실패하는 경우 수동으로 캡처할 수 있습니다:

1. 개발 서버 실행: `npm run dev`
2. 브라우저에서 http://localhost:5173 접속
3. 로그인 (admin@ideaonaction.local / demian00)
4. 각 페이지 방문 후 스크린샷 캡처:
   - 전체 페이지 스크린샷 (F12 → Ctrl+Shift+P → "Capture full size screenshot")
   - 해상도: 1920x1080 (Desktop)

## 🚀 WordPress 업로드

### 1. 마크다운 → WordPress 변환

WordPress는 HTML을 사용하므로 마크다운을 변환해야 합니다.

#### 옵션 1: WordPress 마크다운 플러그인 사용
- [Jetpack Markdown](https://wordpress.org/plugins/jetpack/) 설치
- 마크다운 파일 내용을 복사 → 붙여넣기

#### 옵션 2: 온라인 변환기
- [Markdown to HTML Converter](https://markdowntohtml.com/)
- 마크다운 입력 → HTML 출력 → WordPress 편집기에 붙여넣기

### 2. 이미지 업로드

1. WordPress 미디어 라이브러리에 스크린샷 6개 업로드
2. 각 이미지의 URL 복사
3. 마크다운의 이미지 경로를 WordPress URL로 변경

**변경 전:**
```markdown
![서비스 목록 페이지](../../public/blog-screenshots/payment-process/01-services-page.png)
```

**변경 후:**
```markdown
![서비스 목록 페이지](https://yourdomain.com/wp-content/uploads/2025/01/01-services-page.png)
```

### 3. SEO 최적화

#### 메타 정보
- **제목**: "커뮤니티형 프로덕트 스튜디오에 결제 시스템을 붙였습니다"
- **슬러그**: `payment-system-implementation`
- **카테고리**: Engineering, Product
- **태그**: React, TypeScript, Supabase, 전자상거래, 결제시스템, KakaoPay, TossPayments

#### Open Graph 태그
```html
<meta property="og:title" content="커뮤니티형 프로덕트 스튜디오에 결제 시스템을 붙였습니다" />
<meta property="og:description" content="React + TypeScript + Supabase로 구현한 엔드투엔드 전자상거래 시스템" />
<meta property="og:image" content="https://yourdomain.com/wp-content/uploads/2025/01/01-services-page.png" />
<meta property="og:type" content="article" />
```

#### 발췌 (Excerpt)
```
IDEA on Action 웹사이트에 풀스택 전자상거래 시스템을 구현했습니다.
장바구니부터 결제 완료까지 6단계 프로세스와 Kakao Pay, Toss Payments 통합 과정을 소개합니다.
```

### 4. 포스트 설정

- **공개 상태**: 게시
- **댓글 허용**: 예
- **작성자**: 서민원 (Sinclair Seo)
- **게시일**: 2025-01-14

## 📊 분석

### Google Analytics 이벤트

포스트에 다음 이벤트 트래킹 추가:

```javascript
// 포스트 조회
gtag('event', 'view_blog_post', {
  post_title: 'payment-system-launch',
  category: 'Engineering',
});

// 데모 링크 클릭
gtag('event', 'click_demo_link', {
  link_url: 'https://www.ideaonaction.ai/services',
  link_text: 'Live Demo',
});

// GitHub 링크 클릭
gtag('event', 'click_github_link', {
  link_url: 'https://github.com/IDEA-on-Action/idea-on-action',
  link_text: 'GitHub',
});
```

## 🔗 관련 링크

- **Live Demo**: https://www.ideaonaction.ai/services
- **GitHub**: https://github.com/IDEA-on-Action/idea-on-action
- **Contact**: sinclairseo@gmail.com

## 📝 체크리스트

포스트 업로드 전 확인:

- [ ] 스크린샷 6개 캡처 완료
- [ ] 마크다운 → HTML 변환
- [ ] 이미지 경로 WordPress URL로 변경
- [ ] SEO 메타 정보 입력
- [ ] 태그 10개 추가
- [ ] 카테고리 설정
- [ ] Open Graph 이미지 설정
- [ ] 데모 링크 작동 확인
- [ ] GitHub 링크 작동 확인
- [ ] 모바일 미리보기 확인
- [ ] 오타 검사
- [ ] 게시 버튼 클릭!

---

**Happy Blogging!** 🚀
