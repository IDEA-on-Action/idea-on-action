# Phase 5-3: 프로덕션 모니터링 설정 가이드

**작성일**: 2025-11-15
**버전**: 2.0.0
**프로덕션**: https://www.ideaonaction.ai

---

## 📋 개요

Phase 5-2 성능 개선이 완료되었으므로, 이제 프로덕션 환경에서 실제 사용자 데이터를 수집하고 모니터링하는 단계입니다.

**목표**:
- Google Search Console에서 SEO 성과 추적
- GA4에서 사용자 행동 분석
- Sentry에서 에러 모니터링
- Vercel Analytics에서 Core Web Vitals 확인

---

## 1️⃣ Google Search Console 설정

### 목적
- sitemap.xml 제출로 검색 엔진 크롤링 가이드
- 15개 URL 색인 생성 요청
- 검색 성과 추적 (노출, 클릭, CTR, 평균 순위)

### 단계별 가이드

#### 1-1. Search Console 접속 및 속성 추가

1. **URL**: https://search.google.com/search-console
2. **Google 계정 로그인** (프로젝트 소유자 계정)
3. **속성 추가** 클릭
4. **도메인 선택**: `www.ideaonaction.ai`
5. **소유권 확인**:
   - Vercel DNS 설정에서 TXT 레코드 추가
   - 또는 HTML 태그를 index.html에 추가

**소유권 확인 예시 (HTML 태그)**:
```html
<!-- Google Search Console 소유권 확인 -->
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

#### 1-2. Sitemap 제출

1. **왼쪽 메뉴**: "색인 생성" → "Sitemaps"
2. **새 사이트맵 추가**: `https://www.ideaonaction.ai/sitemap.xml`
3. **제출** 클릭
4. **상태 확인**: "성공" (보통 몇 분 내 처리)

**Sitemap 내용 (15개 URL)**:
- 정적 페이지 12개: /, /about, /roadmap, /portfolio, /now, /lab, /community, /work-with-us, /status, /services, /blog, /notices
- 동적 페이지 3개: /portfolio/p001, /portfolio/p002, /portfolio/p003

#### 1-3. URL 색인 생성 요청

**중요 페이지 우선 색인 요청** (최대 10개/일):

1. **Home**: https://www.ideaonaction.ai/
2. **About**: https://www.ideaonaction.ai/about
3. **Services**: https://www.ideaonaction.ai/services
4. **Portfolio**: https://www.ideaonaction.ai/portfolio
5. **Blog**: https://www.ideaonaction.ai/blog

**방법**:
1. 상단 검색창에 URL 입력
2. "색인 생성 요청" 클릭
3. 1-2분 대기 후 "색인 생성 요청됨" 확인

#### 1-4. 7일 후 확인 사항

**Coverage (색인 범위) 리포트**:
- 유효한 페이지: 15개 (목표)
- 제외된 페이지: 0개
- 오류: 0개

**Performance (성능) 리포트**:
- 총 노출 수: 추적
- 총 클릭 수: 추적
- 평균 CTR: 2-5% (목표)
- 평균 게재순위: 10위 이내 (목표)

**Mobile Usability (모바일 사용성)**:
- 모바일 친화적: 15개 페이지 (목표)
- 오류: 0개

**Core Web Vitals**:
- 양호한 URL: 80% 이상 (목표)
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

---

## 2️⃣ Google Analytics 4 (GA4) 이벤트 트래킹

### 목적
- Sprint 3에서 구현한 21개 이벤트 데이터 수집
- 사용자 여정 분석
- 전환율 추적

### 확인 사항

#### 2-1. GA4 대시보드 접속

1. **URL**: https://analytics.google.com
2. **속성 선택**: "IDEA on Action"
3. **측정 ID 확인**: `G-XXXXXXXXXX` (환경 변수와 일치 확인)

#### 2-2. 실시간 이벤트 확인

1. **왼쪽 메뉴**: "보고서" → "실시간"
2. **이벤트 섹션**: 최근 30분 이벤트 확인
3. **테스트 방법**:
   - 프로덕션 사이트 방문 (incognito 모드 권장)
   - 주요 액션 수행 (페이지 조회, CTA 클릭, Newsletter 구독)
   - 실시간 보고서에서 이벤트 발생 확인 (15초 이내)

**구현된 Sprint 3 이벤트 (6개)**:
- `view_home` - Home 페이지 조회
- `view_portfolio` - Portfolio 페이지 조회
- `view_roadmap` - Roadmap 페이지 조회
- `subscribe_newsletter` - Newsletter 구독
- `join_community` - 커뮤니티 참여 (Lab/Community 페이지)
- `click_cta` - CTA 버튼 클릭 (Status, Index 페이지)

**전체 이벤트 (21개)**:
- 전자상거래: `add_to_cart`, `begin_checkout`, `purchase`, `remove_from_cart`, `add_payment_info`
- 인증: `login`, `sign_up`, `update_profile`, `enable_2fa`
- 콘텐츠: `view_service`, `view_blog_post`, `view_item`, `search`, `share`, `file_download`
- 기타: `error`, `notification_interaction`, `chatbot_interaction`, `apply_filter`

#### 2-3. 전환 목표 설정

1. **왼쪽 메뉴**: "구성" → "이벤트"
2. **전환으로 표시** 토글 활성화:
   - `subscribe_newsletter` (Newsletter 구독)
   - `purchase` (결제 완료)
   - `sign_up` (회원가입)

3. **왼쪽 메뉴**: "구성" → "전환"
4. **전환 이벤트 확인**: 3개 표시

#### 2-4. 주간 리포트 확인

**7일 후 확인 사항**:
- 총 사용자 수: 추적
- 활성 사용자 수: 추적
- 이벤트 수: 추적
- 전환율: 추적

**주요 지표**:
- Newsletter 구독 전환율: 2-5% (목표)
- 평균 세션 시간: 2-3분 (목표)
- 이탈률: 40% 이하 (목표)

---

## 3️⃣ Sentry 에러 모니터링

### 목적
- 프로덕션 런타임 에러 추적
- 사용자 영향도 분석
- 에러 알림 설정

### 확인 사항

#### 3-1. Sentry 대시보드 접속

1. **URL**: https://sentry.io
2. **프로젝트 선택**: "idea-on-action"
3. **환경 확인**: "production"

#### 3-2. 에러 로그 확인 (24시간)

**Issues 페이지**:
- 새 이슈: 0개 (목표)
- 재발 이슈: 추적
- 해결된 이슈: 추적

**사용자 영향도**:
- 영향받은 사용자: 0명 (목표)
- 에러율: 0.1% 이하 (목표)

#### 3-3. Alert 설정 확인

**기본 Alert 규칙**:
1. **새 이슈 발생**: 즉시 알림 (Slack/Email)
2. **에러율 증가**: 1시간 동안 10% 이상 증가 시 알림
3. **사용자 영향**: 100명 이상 영향받은 경우 알림

**Slack 연동** (선택):
1. Sentry Settings → Integrations → Slack
2. 워크스페이스 연결
3. 알림 채널 설정 (#errors, #monitoring)

#### 3-4. Source Maps 확인

**Production Build Source Maps**:
- Vite 빌드 시 Source Maps 생성 확인
- Sentry에 Source Maps 업로드 확인 (선택)
- 에러 스택 트레이스 가독성 확인

---

## 4️⃣ Vercel Analytics (Core Web Vitals)

### 목적
- 실제 사용자 환경에서 Core Web Vitals 측정
- Lighthouse 로컬 측정과 비교
- 성능 개선 효과 확인

### 확인 사항

#### 4-1. Vercel Analytics 대시보드

1. **URL**: https://vercel.com/idea-on-action/idea-on-action/analytics
2. **탭**: "Web Vitals"
3. **기간 선택**: "Last 7 days"

#### 4-2. Core Web Vitals 확인

**LCP (Largest Contentful Paint)**:
- 양호: < 2.5s (목표 80% 이상)
- 개선 필요: 2.5s - 4s
- 불량: > 4s

**FID (First Input Delay)**:
- 양호: < 100ms (목표 95% 이상)
- 개선 필요: 100ms - 300ms
- 불량: > 300ms

**CLS (Cumulative Layout Shift)**:
- 양호: < 0.1 (목표 90% 이상)
- 개선 필요: 0.1 - 0.25
- 불량: > 0.25

#### 4-3. Phase 5-2 개선 효과 비교

**Before (Phase 5-1, 로컬 Lighthouse)**:
- Performance (Home): 47%
- LCP: 측정 필요
- CLS: 측정 필요

**After (Phase 5-2, 프로덕션 예상)**:
- Performance (Home): 65-75% (예상)
- LCP: 2.0s 이하 (예상)
- CLS: 0.05 이하 (예상)

**실제 측정값 (7일 후)**:
- [ ] Performance: ____%
- [ ] LCP: ____s
- [ ] CLS: ____

#### 4-4. 페이지별 성능 비교

**주요 페이지 Top 5**:
1. Home (/)
2. Services (/services)
3. Portfolio (/portfolio)
4. Blog (/blog)
5. About (/about)

**각 페이지별 확인**:
- LCP 중앙값
- FID 중앙값
- CLS 중앙값
- 페이지 로드 시간

---

## 5️⃣ Lighthouse CI 프로덕션 재측정

### 목적
- Phase 5-2 개선 효과 검증
- 로컬 측정 vs 프로덕션 측정 비교
- Vercel CDN 최적화 효과 확인

### 실행 방법

#### 5-1. 로컬에서 프로덕션 URL 측정

```bash
# Lighthouse CLI 설치 (없는 경우)
npm install -g lighthouse

# Home 페이지 측정
lighthouse https://www.ideaonaction.ai/ \
  --output=html \
  --output-path=./lighthouse-prod-home.html \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless"

# Services 페이지 측정
lighthouse https://www.ideaonaction.ai/services \
  --output=html \
  --output-path=./lighthouse-prod-services.html \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless"

# Login 페이지 측정
lighthouse https://www.ideaonaction.ai/login \
  --output=html \
  --output-path=./lighthouse-prod-login.html \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless"
```

#### 5-2. 결과 비교

**로컬 빌드 (Phase 5-1)**:
| 페이지 | Performance | Accessibility | Best Practices | SEO |
|--------|-------------|---------------|----------------|-----|
| Home | 47% | 95+ | 90+ | 90+ |
| Services | 53% | 84% | 90+ | 90+ |
| Login | 56% | 95+ | 90+ | 66% |

**프로덕션 (Phase 5-2 개선 후, 예상)**:
| 페이지 | Performance | Accessibility | Best Practices | SEO |
|--------|-------------|---------------|----------------|-----|
| Home | 65-75% | 95+ | 90+ | 90+ |
| Services | 70-80% | 85+ | 90+ | 90+ |
| Login | 75-85% | 95+ | 90+ | 85+ |

**프로덕션 (실제 측정, 7일 후)**:
| 페이지 | Performance | Accessibility | Best Practices | SEO |
|--------|-------------|---------------|----------------|-----|
| Home | ____% | ____% | ____% | ____% |
| Services | ____% | ____% | ____% | ____% |
| Login | ____% | ____% | ____% | ____% |

#### 5-3. 개선 확인 사항

**Phase 5-2 개선 작업 효과**:
- [x] Login SEO 메타태그 → SEO 66% → 85%+ (예상)
- [x] 이미지 width/height → CLS 개선
- [x] 폰트 preload → LCP 개선
- [x] Services 접근성 → Accessibility 84% → 85%+ (예상)

**추가 개선 (Vercel CDN)**:
- Brotli 압축 (gzip 대비 15-20% 추가 압축)
- Edge Network 캐싱 (전 세계 70+ 지역)
- Image Optimization (자동 WebP 변환, 반응형 이미지)
- HTTP/3 (QUIC 프로토콜)

---

## 6️⃣ Phase 5 완료 체크리스트

### 배포 성공 ✅
- [x] 프로덕션 사이트 정상 동작 (https://www.ideaonaction.ai/)
- [x] sitemap.xml 접근 가능 (https://www.ideaonaction.ai/sitemap.xml)
- [x] robots.txt 접근 가능 (https://www.ideaonaction.ai/robots.txt)
- [x] Git tag v2.0.0 생성
- [x] GitHub Release 생성

### SEO 설정 (수동 작업 필요)
- [ ] Google Search Console 설정
- [ ] Sitemap 제출 (https://www.ideaonaction.ai/sitemap.xml)
- [ ] 색인 생성 요청 (15개 URL)
- [ ] 7일 후 Coverage 리포트 확인

### 모니터링 (수동 작업 필요)
- [x] 단위 테스트 실행 (302/305 통과, 99.0%)
- [x] E2E 테스트 실행 (일부 통과)
- [x] Lighthouse CI 실행 (로컬)
- [ ] Lighthouse 프로덕션 재측정
- [ ] GA4 이벤트 트래킹 확인
- [ ] Sentry 에러 로그 확인 (24시간)
- [ ] Vercel Analytics Core Web Vitals 확인 (7일)

### 성능 개선 ✅
- [x] Login SEO 메타태그 (커밋 305a97d)
- [x] 이미지 width/height 속성 (커밋 fc8d7e2)
- [x] 폰트 preload 최적화 (커밋 19c26ef)
- [x] Services 접근성 개선 (커밋 63fdf21)

### 문서화 ✅
- [x] README.md 업데이트
- [x] CLAUDE.md 업데이트
- [x] changelog.md 업데이트
- [x] project-todo.md 정리
- [x] phase5-monitoring-report.md 작성
- [x] GitHub Release 생성

---

## 7️⃣ 다음 단계

### 단기 (1주일)
1. **Google Search Console 설정** (우선순위: 최고)
   - 속성 추가 및 소유권 확인
   - Sitemap 제출
   - 주요 5개 URL 색인 생성 요청

2. **GA4 이벤트 확인** (우선순위: 높음)
   - 실시간 이벤트 발생 확인
   - 전환 목표 설정

3. **Sentry 에러 모니터링** (우선순위: 높음)
   - 24시간 에러 로그 확인
   - Alert 설정 확인

4. **Vercel Analytics 확인** (우선순위: 중간)
   - Core Web Vitals 초기 데이터 수집

### 중기 (1주일 후)
1. **Lighthouse 프로덕션 재측정**
   - Phase 5-2 개선 효과 검증
   - 로컬 vs 프로덕션 비교

2. **Google Search Console 리포트 확인**
   - Coverage 리포트 (색인 생성률)
   - Performance 리포트 (노출, 클릭, CTR)
   - Mobile Usability (모바일 친화성)

3. **GA4 주간 리포트 분석**
   - 사용자 행동 패턴
   - 전환율 분석
   - 인기 페이지 Top 10

4. **Vercel Analytics 주간 리포트**
   - Core Web Vitals 트렌드
   - 페이지별 성능 비교

### 장기 (Version 2.1)
1. **성능 추가 최적화** (선택)
   - Critical CSS 인라인화
   - JavaScript 번들 크기 최적화
   - Code splitting 개선

2. **새 기능 추가** (선택)
   - Proposals 기능 구현
   - Portfolio 프로젝트 추가
   - Blog 포스트 작성
   - Bounty 시스템 활성화

---

## 📞 문제 발생 시

### Google Search Console 이슈
- **색인 생성 안 됨**: robots.txt 확인, sitemap.xml 구문 검증
- **크롤링 오류**: server.log 확인, 404/500 에러 해결
- **모바일 사용성 오류**: 반응형 디자인 검증

### GA4 이벤트 누락
- **이벤트 발생 안 함**: gtag.js 로드 확인, 측정 ID 확인
- **실시간 데이터 안 보임**: Ad Blocker 비활성화, incognito 모드 사용
- **전환 추적 안 됨**: 전환 이벤트 설정 확인

### Sentry 에러
- **에러 급증**: 최근 배포 롤백, 에러 스택 트레이스 분석
- **Alert 누락**: Alert 규칙 설정 확인, Slack 연동 확인

### Vercel Analytics 데이터 누락
- **Core Web Vitals 안 보임**: 7일 대기 (최소 데이터 수집 기간)
- **페이지 누락**: Analytics 설정 확인, 트래픽 부족

---

**작성일**: 2025-11-15
**작성자**: Claude Code
**다음 리뷰**: 2025-11-22 (1주일 후)
