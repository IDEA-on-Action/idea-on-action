# Sprint 2: Phase 1 - 법적 문서 & SEO (Day 11-14)

> **목표**: 토스페이먼츠 심사를 위한 법적 문서 준비 및 SEO 최적화
> **기간**: 4일
> **태스크**: 15개
> **E2E 테스트**: 3개 (Sprint 1 포함 총 18개)

---

## Day 11: 법적 문서 확인 및 업데이트 (4개 태스크)

### [TASK-041] 이용약관 확인 및 토스페이먼츠 조항 추가 (2시간)

**설명**: 기존 이용약관에 토스페이먼츠 결제 관련 조항 추가
**우선순위**: 높음
**의존성**: TASK-040
**담당**: Developer

**작업 내용**:
1. 현재 이용약관 파일 확인 (src/pages/legal/TermsOfService.tsx)
2. 토스페이먼츠 결제 조항 추가
   - 결제 처리 위탁: 토스페이먼츠 주식회사
   - 결제 수단: 신용카드, 계좌이체, 간편결제
   - 결제 승인 절차
3. 구독 서비스 조항 추가
   - 자동 갱신 정책
   - 해지 절차
4. 일회성 프로젝트 조항 추가
   - 계약 체결 절차
   - 분할 결제 (착수금 30%, 중간금 40%, 잔금 30%)
5. 버전 업데이트 (v2.0, 2025-11-17)

**완료 기준**:
- [ ] 이용약관 파일 업데이트 완료
- [ ] 토스페이먼츠 조항 3개 추가
- [ ] 구독 서비스 조항 추가
- [ ] 일회성 프로젝트 조항 추가
- [ ] 버전 및 날짜 업데이트
- [ ] 법률 검토 (선택 사항)

**테스트**:
- [ ] 이용약관 페이지 렌더링 확인
- [ ] 신규 조항 가독성 검토

**관련 파일**:
- `src/pages/legal/TermsOfService.tsx`

---

### [TASK-042] 개인정보처리방침 확인 및 결제 정보 수집 항목 추가 (2시간)

**설명**: 개인정보처리방침에 결제 정보 수집 항목 추가
**우선순위**: 높음
**의존성**: TASK-041
**담당**: Developer

**작업 내용**:
1. 현재 개인정보처리방침 파일 확인 (src/pages/legal/PrivacyPolicy.tsx)
2. 결제 정보 수집 항목 추가
   - 수집 항목: 카드번호(일부), 결제 승인 정보, 거래 내역
   - 수집 목적: 결제 처리, 환불 처리, 부정 거래 방지
   - 보유 기간: 거래 완료 후 5년 (전자상거래법)
3. 토스페이먼츠 개인정보 처리 위탁 조항 추가
   - 수탁자: 토스페이먼츠 주식회사
   - 위탁 업무: 결제 처리, 본인 인증
4. 제3자 제공 조항 확인 (해당 시)
5. 버전 업데이트 (v2.0, 2025-11-17)

**완료 기준**:
- [ ] 개인정보처리방침 파일 업데이트 완료
- [ ] 결제 정보 수집 항목 추가
- [ ] 토스페이먼츠 위탁 조항 추가
- [ ] 보유 기간 명시
- [ ] 버전 및 날짜 업데이트
- [ ] 법률 검토 (선택 사항)

**테스트**:
- [ ] 개인정보처리방침 페이지 렌더링 확인
- [ ] 신규 조항 가독성 검토

**관련 파일**:
- `src/pages/legal/PrivacyPolicy.tsx`

---

### [TASK-043] 환불정책 확인 및 서비스별 환불 조건 명시 (1.5시간)

**설명**: 환불정책에 서비스별 환불 조건 상세 명시
**우선순위**: 높음
**의존성**: TASK-042
**담당**: Developer

**작업 내용**:
1. 현재 환불정책 파일 확인 (src/pages/legal/RefundPolicy.tsx)
2. 일회성 프로젝트 환불 조건 추가
   - 착수금 납부 후: 10% 수수료 공제 후 환불
   - 개발 착수 후: 진행률에 따라 차감 환불
   - 완료 후: 환불 불가 (하자 보수 30일)
3. 구독 서비스 환불 조건 추가
   - 7일 이내: 전액 환불
   - 7일 이후: 사용 일수 차감 후 환불
   - 연간 구독: 남은 기간 비례 환불
4. 환불 처리 기간 명시 (영업일 기준 7-10일)
5. 버전 업데이트 (v2.0, 2025-11-17)

**완료 기준**:
- [ ] 환불정책 파일 업데이트 완료
- [ ] 일회성 프로젝트 환불 조건 추가
- [ ] 구독 서비스 환불 조건 추가
- [ ] 환불 처리 기간 명시
- [ ] 버전 및 날짜 업데이트

**테스트**:
- [ ] 환불정책 페이지 렌더링 확인
- [ ] 환불 조건 명확성 검토

**관련 파일**:
- `src/pages/legal/RefundPolicy.tsx`

---

### [TASK-044] Footer 사업자 정보 업데이트 (1시간)

**설명**: Footer에 사업자등록번호, 통신판매업신고번호 추가
**우선순위**: 높음
**의존성**: TASK-043
**담당**: Developer

**작업 내용**:
1. Footer 컴포넌트 확인 (src/components/layout/Footer.tsx)
2. 사업자 정보 섹션 추가
   - 상호: 생각과행동 (IdeaonAction)
   - 대표자: 서민원
   - 사업자등록번호: [등록 후 입력]
   - 통신판매업신고번호: [신고 후 입력]
   - 주소: [사업장 주소]
   - 전화: 010-4904-2671
   - 이메일: sinclairseo@gmail.com
3. 법적 링크 추가 (이용약관, 개인정보처리방침, 환불정책)
4. 반응형 레이아웃 (모바일/데스크톱)

**완료 기준**:
- [ ] Footer 컴포넌트 업데이트 완료
- [ ] 사업자 정보 7개 항목 표시
- [ ] 법적 링크 3개 추가
- [ ] 반응형 디자인
- [ ] 다크 모드 지원

**테스트**:
- [ ] Footer 렌더링 확인
- [ ] 법적 링크 클릭 동작

**관련 파일**:
- `src/components/layout/Footer.tsx`

---

## Day 12: SEO 설정 Part 1 (5개 태스크)

### [TASK-045] react-helmet-async 설치 및 설정 (1시간)

**설명**: react-helmet-async 라이브러리 설치 및 프로젝트 설정
**우선순위**: 높음
**의존성**: TASK-044
**담당**: Developer

**작업 내용**:
1. react-helmet-async 설치 (`npm install react-helmet-async`)
2. main.tsx에 HelmetProvider 추가
3. SEOHead 컴포넌트 기본 구조 생성
4. 기본 메타 태그 설정 (charset, viewport, theme-color)

**완료 기준**:
- [ ] react-helmet-async 설치 완료
- [ ] HelmetProvider 적용
- [ ] SEOHead 컴포넌트 생성
- [ ] 기본 메타 태그 적용
- [ ] TypeScript 타입 에러 0개

**테스트**:
- [ ] npm run build 성공
- [ ] 개발 서버에서 메타 태그 확인

**관련 파일**:
- `package.json`
- `src/main.tsx`
- `src/components/seo/SEOHead.tsx`

---

### [TASK-046] SEOHead 컴포넌트 생성 (2시간)

**설명**: Meta tags 관리 중앙화 컴포넌트
**우선순위**: 높음
**의존성**: TASK-045
**담당**: Developer

**작업 내용**:
1. SEOHead.tsx 컴포넌트 완성
2. Props 인터페이스 정의
   - title: string
   - description: string
   - keywords: string[]
   - image?: string
   - url?: string
   - type?: 'website' | 'article' | 'product'
3. Helmet 태그 작성
   - <title>
   - <meta name="description">
   - <meta name="keywords">
   - <link rel="canonical">
4. 기본값 설정 (사이트 전체 기본 메타)

**완료 기준**:
- [ ] SEOHead 컴포넌트 완성
- [ ] Props 타입 정의
- [ ] 기본값 설정
- [ ] 재사용 가능한 구조
- [ ] TypeScript 타입 안전성

**테스트**:
- [ ] 컴포넌트 렌더링 확인
- [ ] HTML head 태그 확인

**관련 파일**:
- `src/components/seo/SEOHead.tsx`

---

### [TASK-047] 각 페이지별 Meta tags 정의 (2시간)

**설명**: 9개 페이지 (홈, 서비스 목록, 7개 서비스 상세, 가격) Meta tags 정의
**우선순위**: 높음
**의존성**: TASK-046
**담당**: Developer

**작업 내용**:
1. 페이지별 Meta tags 정의
   - Index: "IDEA on Action - 아이디어 실험실 & 프로덕트 스튜디오"
   - Services: "서비스 | IDEA on Action - 개발부터 플랫폼까지"
   - MVPService: "MVP 개발 서비스 | 4주 만에 아이디어를 현실로"
   - NavigatorService: "Navigator 프로젝트 관리 플랫폼 | 팀 협업 도구"
   - Fullstack, Design, Operations, COMPASS, Cartographer, Captain, Harbor
   - Pricing: "가격 안내 | IDEA on Action 서비스 비교"
2. 각 페이지에 SEOHead 컴포넌트 추가
3. description 150-160자 작성
4. keywords 5-10개 선정

**완료 기준**:
- [ ] 9개 페이지 Meta tags 정의
- [ ] SEOHead 컴포넌트 적용
- [ ] description 길이 최적화
- [ ] keywords 관련성 확인
- [ ] 중복 title 없음

**테스트**:
- [ ] 각 페이지 HTML head 확인
- [ ] Google Search Console 프리뷰 (선택 사항)

**관련 파일**:
- `src/pages/Index.tsx`
- `src/pages/Services.tsx`
- `src/pages/services/*.tsx` (7개)
- `src/pages/Pricing.tsx`

---

### [TASK-048] Open Graph tags 정의 (1.5시간)

**설명**: 소셜 미디어 공유용 Open Graph tags 정의
**우선순위**: 중간
**의존성**: TASK-047
**담당**: Developer

**작업 내용**:
1. SEOHead 컴포넌트에 OG tags 추가
   - og:title
   - og:description
   - og:image (1200x630px)
   - og:url
   - og:type
   - og:site_name
2. Twitter Card tags 추가
   - twitter:card
   - twitter:title
   - twitter:description
   - twitter:image
3. 각 페이지별 OG 이미지 생성 (Canva/Figma)

**완료 기준**:
- [ ] OG tags 6개 추가
- [ ] Twitter Card tags 4개 추가
- [ ] OG 이미지 3개 생성 (홈, 서비스, 가격)
- [ ] 이미지 크기 최적화 (< 300KB)
- [ ] 소셜 미디어 공유 테스트

**테스트**:
- [ ] Facebook Sharing Debugger 테스트
- [ ] Twitter Card Validator 테스트

**관련 파일**:
- `src/components/seo/SEOHead.tsx`
- `public/og-images/` (3개 이미지)

---

### [TASK-049] schema-dts 설치 및 TypeScript 타입 설정 (1시간)

**설명**: JSON-LD 스키마 TypeScript 타입 라이브러리 설정
**우선순위**: 중간
**의존성**: TASK-048
**담당**: Developer

**작업 내용**:
1. schema-dts 설치 (`npm install schema-dts`)
2. JsonLd 컴포넌트 생성 (src/components/seo/JsonLd.tsx)
3. Props 인터페이스 (schema: WithContext<Thing>)
4. JSON.stringify 포맷팅 (prettyPrint: false)

**완료 기준**:
- [ ] schema-dts 설치 완료
- [ ] JsonLd 컴포넌트 생성
- [ ] TypeScript 타입 안전성 확보
- [ ] 재사용 가능한 구조

**테스트**:
- [ ] npm run build 성공
- [ ] 타입 추론 확인

**관련 파일**:
- `package.json`
- `src/components/seo/JsonLd.tsx`

---

## Day 13: SEO 설정 Part 2 (6개 태스크)

### [TASK-050] JSON-LD Organization 스키마 생성 (1.5시간)

**설명**: 회사 정보 JSON-LD 스키마 작성
**우선순위**: 높음
**의존성**: TASK-049
**담당**: Developer

**작업 내용**:
1. Organization 스키마 데이터 정의
   - @type: Organization
   - name: IDEA on Action
   - alternateName: 생각과행동
   - url: https://www.ideaonaction.ai
   - logo: 로고 URL
   - contactPoint: 전화, 이메일
   - address: 사업장 주소
   - sameAs: 소셜 미디어 링크 (GitHub, LinkedIn 등)
2. Index 페이지에 적용
3. Google Rich Results Test 검증

**완료 기준**:
- [ ] Organization 스키마 작성 완료
- [ ] Index 페이지에 적용
- [ ] Google Rich Results Test 통과
- [ ] 필수 필드 모두 포함
- [ ] 경고 0개

**테스트**:
- [ ] Google Rich Results Test
- [ ] Schema.org Validator

**관련 파일**:
- `src/pages/Index.tsx`
- `src/lib/seo/organization-schema.ts`

---

### [TASK-051] JSON-LD Service 스키마 생성 (2.5시간)

**설명**: 8개 서비스 JSON-LD 스키마 작성
**우선순위**: 높음
**의존성**: TASK-050
**담당**: Developer

**작업 내용**:
1. Service 스키마 함수 생성 (generateServiceSchema)
2. 각 서비스별 스키마 데이터 정의
   - @type: Service
   - name: 서비스명
   - description: 설명
   - provider: Organization (TASK-050 재사용)
   - areaServed: KR
   - availableChannel: 온라인
3. 8개 서비스 페이지에 적용
4. Google Rich Results Test 검증

**완료 기준**:
- [ ] Service 스키마 함수 작성
- [ ] 8개 서비스 스키마 데이터 정의
- [ ] 8개 페이지에 적용
- [ ] Google Rich Results Test 통과
- [ ] 경고 0개

**테스트**:
- [ ] Google Rich Results Test (8개 페이지)
- [ ] Schema.org Validator

**관련 파일**:
- `src/lib/seo/service-schema.ts`
- `src/pages/services/*.tsx` (8개)

---

### [TASK-052] JSON-LD Product 스키마 생성 (2시간)

**설명**: 패키지/플랜 Product 스키마 작성
**우선순위**: 중간
**의존성**: TASK-051
**담당**: Developer

**작업 내용**:
1. Product 스키마 함수 생성 (generateProductSchema)
2. 패키지/플랜별 스키마 데이터 정의
   - @type: Product
   - name: 패키지/플랜명
   - description: 설명
   - offers: 가격, 통화, 가용성
   - aggregateRating: 평점 (선택 사항)
3. MVPService, NavigatorService 페이지에 적용
4. Google Rich Results Test 검증

**완료 기준**:
- [ ] Product 스키마 함수 작성
- [ ] 6개 Product 스키마 데이터 정의 (MVP 3 + Navigator 3)
- [ ] 2개 페이지에 적용
- [ ] Google Rich Results Test 통과
- [ ] 경고 0개

**테스트**:
- [ ] Google Rich Results Test (2개 페이지)
- [ ] Schema.org Validator

**관련 파일**:
- `src/lib/seo/product-schema.ts`
- `src/pages/services/MVPService.tsx`
- `src/pages/services/NavigatorService.tsx`

---

### [TASK-053] vite-plugin-sitemap 설치 및 설정 (1시간)

**설명**: Vite Sitemap 플러그인 설치 및 기본 설정
**우선순위**: 높음
**의존성**: TASK-052
**담당**: Developer

**작업 내용**:
1. vite-plugin-sitemap 설치 (`npm install vite-plugin-sitemap`)
2. vite.config.ts에 플러그인 추가
3. 기본 설정
   - hostname: https://www.ideaonaction.ai
   - exclude: /admin/*, /login, /signup
   - changefreq: weekly
   - priority: 0.5 (기본)

**완료 기준**:
- [ ] vite-plugin-sitemap 설치 완료
- [ ] vite.config.ts 설정 완료
- [ ] exclude 경로 설정
- [ ] npm run build 성공
- [ ] TypeScript 에러 0개

**테스트**:
- [ ] npm run build 후 dist/sitemap.xml 생성 확인

**관련 파일**:
- `package.json`
- `vite.config.ts`

---

### [TASK-054] Sitemap.xml 생성 (1.5시간)

**설명**: 동적 경로 포함 Sitemap.xml 생성
**우선순위**: 높음
**의존성**: TASK-053
**담당**: Developer

**작업 내용**:
1. 정적 경로 추가 (/, /services, /pricing, /about, /roadmap 등)
2. 동적 경로 추가
   - /services/:slug (8개 서비스)
   - /blog/:slug (선택 사항)
3. 우선순위 설정
   - 홈: 1.0
   - 서비스 목록, 가격: 0.9
   - 서비스 상세: 0.8
   - 기타: 0.5
4. lastmod 날짜 설정 (빌드 시점)

**완료 기준**:
- [ ] Sitemap.xml 생성 완료
- [ ] 정적 경로 10개 추가
- [ ] 동적 경로 8개 추가
- [ ] 우선순위 설정
- [ ] lastmod 날짜 포함
- [ ] XML 유효성 검증

**테스트**:
- [ ] npm run build 후 sitemap.xml 확인
- [ ] Google Search Console Sitemap 제출 (선택 사항)

**관련 파일**:
- `vite.config.ts`
- `dist/sitemap.xml` (빌드 후)

---

### [TASK-055] Robots.txt 생성 (1시간)

**설명**: Robots.txt 파일 생성 및 Sitemap 링크 추가
**우선순위**: 중간
**의존성**: TASK-054
**담당**: Developer

**작업 내용**:
1. public/robots.txt 파일 생성
2. User-agent 설정
   - User-agent: *
   - Allow: /
   - Disallow: /admin/
   - Disallow: /login
   - Disallow: /signup
3. Sitemap 링크 추가
   - Sitemap: https://www.ideaonaction.ai/sitemap.xml
4. Crawl-delay 설정 (선택 사항)

**완료 기준**:
- [ ] robots.txt 파일 생성 완료
- [ ] User-agent 설정
- [ ] Disallow 경로 3개 추가
- [ ] Sitemap 링크 추가
- [ ] 구문 유효성 검증

**테스트**:
- [ ] http://localhost:5173/robots.txt 접근 확인
- [ ] Google Search Console robots.txt 테스터 (선택 사항)

**관련 파일**:
- `public/robots.txt`

---

## Day 14: E2E 테스트 및 검증 (3개 태스크)

### [TASK-056] 전체 E2E 테스트 실행 (1.5시간)

**설명**: Sprint 1에서 작성한 18개 E2E 테스트 전체 실행
**우선순위**: 높음
**의존성**: TASK-055
**담당**: Developer

**작업 내용**:
1. E2E 테스트 환경 확인 (Playwright 설정)
2. 전체 테스트 실행 (`npm run test:e2e`)
3. 실패 테스트 디버깅
4. 테스트 레포트 생성
5. 테스트 커버리지 확인

**완료 기준**:
- [ ] 18개 테스트 모두 통과
- [ ] 테스트 실행 시간 < 60초
- [ ] Playwright 레포트 생성
- [ ] 스크린샷 정상 생성
- [ ] 실패 테스트 0개

**테스트**:
- [ ] npm run test:e2e
- [ ] npm run test:e2e:report

**관련 파일**:
- `tests/e2e/services/*.spec.ts` (4개 파일)
- `tests/e2e/pricing/*.spec.ts` (1개 파일)

---

### [TASK-057] Lighthouse 검증 (2시간)

**설명**: 모든 페이지 Lighthouse 점수 90+ 검증
**우선순위**: 높음
**의존성**: TASK-056
**담당**: Developer

**작업 내용**:
1. Lighthouse CI 설정 (lighthouserc.json)
2. 9개 페이지 Lighthouse 실행
   - Index, Services, Pricing
   - MVPService, NavigatorService
   - Fullstack, Design, Operations, Navigator (선택 사항)
3. 점수 개선
   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 95+
4. 개선 사항 문서화

**완료 기준**:
- [ ] Lighthouse CI 설정 완료
- [ ] 9개 페이지 점수 측정
- [ ] 모든 페이지 Performance 90+
- [ ] 모든 페이지 SEO 95+
- [ ] 개선 사항 문서화

**테스트**:
- [ ] npm run lighthouse (스크립트 추가)
- [ ] Lighthouse 레포트 확인

**관련 파일**:
- `lighthouserc.json`
- `docs/lighthouse-report-2025-11-17.md`

---

### [TASK-058] 토스페이먼츠 심사 체크리스트 검증 (1시간)

**설명**: 토스페이먼츠 심사 기준 충족 여부 최종 검증
**우선순위**: 높음
**의존성**: TASK-057
**담당**: Developer

**작업 내용**:
1. 체크리스트 작성 (docs/toss-payments-checklist.md)
2. 필수 항목 검증
   - [ ] 서비스 명확성: 8개 서비스 설명 완료
   - [ ] 가격 투명성: 모든 패키지/플랜 가격 명시
   - [ ] 법적 문서: 이용약관, 개인정보처리방침, 환불정책
   - [ ] 연락처 정보: Footer에 사업자 정보 표시
   - [ ] Lighthouse 90+ 점수
   - [ ] SEO 최적화: Meta tags, OG tags, JSON-LD
   - [ ] 반응형 디자인: 모바일/태블릿/데스크톱
   - [ ] 접근성: WCAG 2.1 AA (기본)
3. 스크린샷 준비 (심사 제출용)
4. 검증 결과 문서화

**완료 기준**:
- [ ] 체크리스트 8개 항목 모두 체크
- [ ] 스크린샷 9개 준비
- [ ] 검증 결과 문서 작성
- [ ] Phase 1 완료 승인

**테스트**:
- [ ] 체크리스트 항목 재확인
- [ ] 스크린샷 품질 검토

**관련 파일**:
- `docs/toss-payments-checklist.md`
- `docs/toss-payments-screenshots/` (9개 이미지)

---

## Sprint 2 Summary

**총 태스크**: 15개
**총 예상 시간**: 22.5시간
**E2E 테스트**: 18개 (Sprint 1 포함)
**완료 기준**: Phase 1 (토스페이먼츠 심사 준비) 100% 완료

**주요 산출물**:
- 법적 문서: 3개 업데이트 (이용약관, 개인정보처리방침, 환불정책)
- Footer: 사업자 정보 추가
- SEO: Meta tags, OG tags, JSON-LD (9개 페이지)
- Sitemap.xml, Robots.txt
- Lighthouse 레포트
- 토스페이먼츠 심사 체크리스트

**Phase 1 최종 통계**:
- 총 태스크: 55개 (Sprint 1: 40 + Sprint 2: 15)
- 총 예상 시간: 86시간 (약 10-11일)
- 페이지: 9개
- 컴포넌트: 10개
- React 훅: 3개
- E2E 테스트: 18개
- 문서: 7개

**다음 단계**: Sprint 3 (Phase 2 확장 페이지 + Phase 3 최적화)
