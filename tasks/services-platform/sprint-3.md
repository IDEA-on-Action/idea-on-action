# Sprint 3: Phase 2 - 확장 페이지 & Phase 3 - 최적화 (Day 15-24)

> **목표**: 추가 서비스 페이지 구현 및 성능/접근성 최적화
> **기간**: 10일
> **태스크**: 22개
> **E2E 테스트**: 35개 (Sprint 1-2 포함 총 53개)

---

## Phase 2: 확장 페이지 (Day 15-21, 14개 태스크)

### Day 15-16: 추가 개발 서비스 페이지 (6개 태스크)

### [TASK-059] FullstackService 페이지 레이아웃 (2.5시간)

**설명**: Fullstack 서비스 상세 페이지 (컴포넌트 재사용)
**우선순위**: 중간
**의존성**: TASK-058
**담당**: Developer

**작업 내용**:
1. src/pages/services/FullstackService.tsx 파일 생성
2. 기존 공통 컴포넌트 재사용
   - ServiceHero
   - ServiceFeatures (4개 기능)
   - ServiceProcess (5단계)
   - ServicePricing (3개 패키지)
   - ServiceDeliverables
   - ServiceFAQ (7개)
   - ServiceCTA
3. Fullstack 서비스 특화 콘텐츠
   - 기술 스택: React, Node.js, PostgreSQL
   - 전문 분야: SaaS, 웹 앱, API 개발

**완료 기준**:
- [ ] FullstackService.tsx 작성 완료
- [ ] 7개 섹션 배치
- [ ] Fullstack 특화 콘텐츠
- [ ] 반응형 디자인
- [ ] 다크 모드 지원

**테스트**:
- [ ] 페이지 렌더링 확인
- [ ] 컴포넌트 재사용 확인

**관련 파일**:
- `src/pages/services/FullstackService.tsx`

---

### [TASK-060] FullstackService 데이터 입력 (1시간)

**설명**: Fullstack 서비스 데이터 DB 입력
**우선순위**: 중간
**의존성**: TASK-059
**담당**: Developer

**작업 내용**:
1. supabase/seed/fullstack-service-data.sql 파일 생성
2. services 테이블 UPDATE (pricing_data, deliverables, process_steps, faq)
3. service_packages 3개 레코드 INSERT
   - Basic: ₩8,000,000 (프론트엔드 + 백엔드 기본)
   - Standard: ₩15,000,000 (+ Admin 패널 + API)
   - Premium: ₩25,000,000 (+ 고급 기능 + 클라우드 인프라)
4. 데이터 검증 쿼리 작성

**완료 기준**:
- [ ] SQL 파일 작성 완료
- [ ] 로컬 DB에 데이터 입력
- [ ] 3개 패키지 정의
- [ ] 검증 쿼리 실행

**테스트**:
- [ ] SELECT * FROM services WHERE slug = 'fullstack'
- [ ] SELECT * FROM service_packages WHERE service_id = 'fullstack-id'

**관련 파일**:
- `supabase/seed/fullstack-service-data.sql`

---

### [TASK-061] FullstackService E2E 테스트 (2시간)

**설명**: Fullstack 서비스 상세 페이지 E2E 테스트 6개
**우선순위**: 낮음
**의존성**: TASK-060
**담당**: Developer

**작업 내용**:
1. tests/e2e/services/fullstack-service.spec.ts 파일 생성
2. 테스트 1: 페이지 렌더링 (제목, 설명)
3. 테스트 2: 3개 패키지 표시
4. 테스트 3: 프로세스 5단계 표시
5. 테스트 4: FAQ 7개 표시
6. 테스트 5: CTA 버튼 클릭
7. 테스트 6: Lighthouse 점수 90+

**완료 기준**:
- [ ] 6개 테스트 작성 완료
- [ ] 모든 테스트 통과
- [ ] Lighthouse CI 통합
- [ ] 테스트 실행 시간 < 15초

**테스트**:
- [ ] npm run test:e2e -- fullstack-service.spec.ts

**관련 파일**:
- `tests/e2e/services/fullstack-service.spec.ts`

---

### [TASK-062] DesignService 페이지 레이아웃 (2.5시간)

**설명**: Design 서비스 상세 페이지
**우선순위**: 중간
**의존성**: TASK-061
**담당**: Developer

**작업 내용**:
1. src/pages/services/DesignService.tsx 파일 생성
2. 기존 공통 컴포넌트 재사용
3. Design 서비스 특화 콘텐츠
   - 디자인 프로세스: 리서치 → 와이어프레임 → 프로토타입 → UI 디자인
   - 결과물: Figma 파일, 디자인 시스템, 아이콘 세트
4. ServiceTestimonials 컴포넌트 추가 (선택 사항)

**완료 기준**:
- [ ] DesignService.tsx 작성 완료
- [ ] 7-8개 섹션 배치
- [ ] Design 특화 콘텐츠
- [ ] 반응형 디자인
- [ ] 다크 모드 지원

**테스트**:
- [ ] 페이지 렌더링 확인
- [ ] 디자인 프로세스 시각화

**관련 파일**:
- `src/pages/services/DesignService.tsx`

---

### [TASK-063] DesignService 데이터 입력 (1시간)

**설명**: Design 서비스 데이터 DB 입력
**우선순위**: 중간
**의존성**: TASK-062
**담당**: Developer

**작업 내용**:
1. supabase/seed/design-service-data.sql 파일 생성
2. services 테이블 UPDATE
3. service_packages 3개 레코드 INSERT
   - Basic: ₩3,000,000 (웹 디자인 기본)
   - Standard: ₩5,000,000 (+ 모바일 디자인)
   - Premium: ₩8,000,000 (+ 브랜딩 + 디자인 시스템)
4. 데이터 검증 쿼리 작성

**완료 기준**:
- [ ] SQL 파일 작성 완료
- [ ] 로컬 DB에 데이터 입력
- [ ] 3개 패키지 정의
- [ ] 검증 쿼리 실행

**테스트**:
- [ ] SELECT * FROM services WHERE slug = 'design'

**관련 파일**:
- `supabase/seed/design-service-data.sql`

---

### [TASK-064] DesignService E2E 테스트 (2시간)

**설명**: Design 서비스 상세 페이지 E2E 테스트 6개
**우선순위**: 낮음
**의존성**: TASK-063
**담당**: Developer

**작업 내용**:
1. tests/e2e/services/design-service.spec.ts 파일 생성
2. 6개 테스트 작성 (렌더링, 패키지, 프로세스, FAQ, CTA, Lighthouse)

**완료 기준**:
- [ ] 6개 테스트 작성 완료
- [ ] 모든 테스트 통과
- [ ] Lighthouse 90+

**테스트**:
- [ ] npm run test:e2e -- design-service.spec.ts

**관련 파일**:
- `tests/e2e/services/design-service.spec.ts`

---

### Day 17-18: Operations 서비스 & COMPASS 플랫폼 (5개 태스크)

### [TASK-065] OperationsService 페이지 레이아웃 (2.5시간)

**설명**: Operations 서비스 상세 페이지
**우선순위**: 중간
**의존성**: TASK-064
**담당**: Developer

**작업 내용**:
1. src/pages/services/OperationsService.tsx 파일 생성
2. 기존 공통 컴포넌트 재사용
3. Operations 서비스 특화 콘텐츠
   - 운영 지원: DevOps, 모니터링, 유지보수
   - 기술 스택: AWS, Docker, Kubernetes, Sentry
   - 결과물: CI/CD 파이프라인, 모니터링 대시보드

**완료 기준**:
- [ ] OperationsService.tsx 작성 완료
- [ ] 7개 섹션 배치
- [ ] Operations 특화 콘텐츠
- [ ] 반응형 디자인
- [ ] 다크 모드 지원

**테스트**:
- [ ] 페이지 렌더링 확인

**관련 파일**:
- `src/pages/services/OperationsService.tsx`

---

### [TASK-066] OperationsService 데이터 입력 (1시간)

**설명**: Operations 서비스 데이터 DB 입력
**우선순위**: 중간
**의존성**: TASK-065
**담당**: Developer

**작업 내용**:
1. supabase/seed/operations-service-data.sql 파일 생성
2. services 테이블 UPDATE
3. service_packages 3개 레코드 INSERT
   - Basic: ₩2,000,000 (기본 DevOps 설정)
   - Standard: ₩4,000,000 (+ 모니터링 + 알림)
   - Premium: ₩7,000,000 (+ 24/7 지원 + 자동화)
4. 데이터 검증 쿼리 작성

**완료 기준**:
- [ ] SQL 파일 작성 완료
- [ ] 로컬 DB에 데이터 입력
- [ ] 3개 패키지 정의
- [ ] 검증 쿼리 실행

**테스트**:
- [ ] SELECT * FROM services WHERE slug = 'operations'

**관련 파일**:
- `supabase/seed/operations-service-data.sql`

---

### [TASK-067] OperationsService E2E 테스트 (2시간)

**설명**: Operations 서비스 상세 페이지 E2E 테스트 6개
**우선순위**: 낮음
**의존성**: TASK-066
**담당**: Developer

**작업 내용**:
1. tests/e2e/services/operations-service.spec.ts 파일 생성
2. 6개 테스트 작성

**완료 기준**:
- [ ] 6개 테스트 작성 완료
- [ ] 모든 테스트 통과
- [ ] Lighthouse 90+

**테스트**:
- [ ] npm run test:e2e -- operations-service.spec.ts

**관련 파일**:
- `tests/e2e/services/operations-service.spec.ts`

---

### [TASK-068] COMPASSPlatform 페이지 레이아웃 (3시간)

**설명**: COMPASS 플랫폼 개요 페이지 (4개 서비스 소개)
**우선순위**: 낮음
**의존성**: TASK-067
**담당**: Developer

**작업 내용**:
1. src/pages/services/COMPASSPlatform.tsx 파일 생성
2. 플랫폼 히어로 섹션
   - COMPASS: Collaborative Operational Management Platform for Agile Strategic Solutions
3. 4개 서비스 소개 섹션
   - Navigator: 프로젝트 관리
   - Cartographer: 로드맵 관리
   - Captain: 팀 리더십 도구
   - Harbor: 리소스 관리
4. 통합 가격 정보 (플랫폼 전체 구독)
5. CTA: 개별 서비스 자세히 보기

**완료 기준**:
- [ ] COMPASSPlatform.tsx 작성 완료
- [ ] 5개 섹션 배치
- [ ] 4개 서비스 카드 디자인
- [ ] 반응형 디자인
- [ ] 다크 모드 지원

**테스트**:
- [ ] 페이지 렌더링 확인
- [ ] 4개 서비스 링크 확인

**관련 파일**:
- `src/pages/services/COMPASSPlatform.tsx`

---

### [TASK-069] COMPASS 4개 서비스 소개 섹션 (2시간)

**설명**: COMPASS 플랫폼 내 4개 서비스 상세 소개 섹션
**우선순위**: 낮음
**의존성**: TASK-068
**담당**: Developer

**작업 내용**:
1. ServiceShowcase 컴포넌트 생성 (선택 사항)
2. 각 서비스별 소개 콘텐츠
   - Navigator: 칸반 보드, 타임라인, 이슈 추적
   - Cartographer: 로드맵 시각화, 마일스톤 관리
   - Captain: 팀 성과 대시보드, 1:1 미팅
   - Harbor: 리소스 할당, 용량 관리
3. 서비스별 스크린샷 (목업)
4. "자세히 보기" 링크 (/services/navigator 등)

**완료 기준**:
- [ ] ServiceShowcase 컴포넌트 작성 (선택 사항)
- [ ] 4개 서비스 콘텐츠 작성
- [ ] 스크린샷 목업 4개
- [ ] 링크 동작 확인

**테스트**:
- [ ] 4개 서비스 섹션 렌더링 확인

**관련 파일**:
- `src/components/services/ServiceShowcase.tsx` (선택 사항)
- `src/pages/services/COMPASSPlatform.tsx` (업데이트)

---

### Day 19-21: COMPASS 상세 페이지 (5개 태스크)

### [TASK-070] Cartographer, Captain, Harbor 페이지 (6시간)

**설명**: COMPASS 플랫폼 3개 서비스 상세 페이지 (각 2시간)
**우선순위**: 낮음
**의존성**: TASK-069
**담당**: Developer

**작업 내용**:
1. src/pages/services/CartographerService.tsx 생성
   - 로드맵 관리 도구
   - 마일스톤, 목표, KPI 관리
   - 플랜: Starter ₩39K/월, Pro ₩129K/월, Enterprise ₩349K/월
2. src/pages/services/CaptainService.tsx 생성
   - 팀 리더십 도구
   - 성과 대시보드, 1:1 미팅, 피드백
   - 플랜: Starter ₩49K/월, Pro ₩149K/월, Enterprise ₩399K/월
3. src/pages/services/HarborService.tsx 생성
   - 리소스 관리 도구
   - 용량 계획, 할당, 보고서
   - 플랜: Starter ₩59K/월, Pro ₩179K/월, Enterprise ₩499K/월
4. 기존 공통 컴포넌트 재사용
5. 각 서비스별 특화 기능 강조

**완료 기준**:
- [ ] 3개 페이지 작성 완료
- [ ] 각 페이지 7개 섹션
- [ ] 반응형 디자인
- [ ] 다크 모드 지원

**테스트**:
- [ ] 3개 페이지 렌더링 확인

**관련 파일**:
- `src/pages/services/CartographerService.tsx`
- `src/pages/services/CaptainService.tsx`
- `src/pages/services/HarborService.tsx`

---

### [TASK-071] COMPASS 서비스 데이터 입력 (1.5시간)

**설명**: COMPASS 플랫폼 4개 서비스 데이터 DB 입력
**우선순위**: 낮음
**의존성**: TASK-070
**담당**: Developer

**작업 내용**:
1. supabase/seed/compass-services-data.sql 파일 생성
2. services 테이블 INSERT (4개: navigator, cartographer, captain, harbor)
3. subscription_plans 12개 레코드 INSERT (각 3개 플랜)
4. 데이터 검증 쿼리 작성

**완료 기준**:
- [ ] SQL 파일 작성 완료
- [ ] 4개 서비스 데이터 입력
- [ ] 12개 플랜 정의
- [ ] 검증 쿼리 실행

**테스트**:
- [ ] SELECT * FROM services WHERE category = 'platform'
- [ ] SELECT COUNT(*) FROM subscription_plans

**관련 파일**:
- `supabase/seed/compass-services-data.sql`

---

### [TASK-072] COMPASS E2E 테스트 (3시간)

**설명**: COMPASS 플랫폼 및 상세 페이지 E2E 테스트 12개
**우선순위**: 낮음
**의존성**: TASK-071
**담당**: Developer

**작업 내용**:
1. tests/e2e/services/compass-platform.spec.ts 생성
   - 테스트 3개: 렌더링, 4개 서비스 카드, 링크
2. tests/e2e/services/cartographer-service.spec.ts 생성
   - 테스트 3개: 렌더링, 플랜, Lighthouse
3. tests/e2e/services/captain-service.spec.ts 생성
   - 테스트 3개
4. tests/e2e/services/harbor-service.spec.ts 생성
   - 테스트 3개

**완료 기준**:
- [ ] 4개 테스트 파일 작성
- [ ] 12개 테스트 통과
- [ ] Lighthouse 90+ (4개 페이지)

**테스트**:
- [ ] npm run test:e2e -- compass*.spec.ts

**관련 파일**:
- `tests/e2e/services/compass-*.spec.ts` (4개 파일)

---

### [TASK-073] 확장 페이지 SEO (2.5시간)

**설명**: 확장 페이지 Meta tags 및 JSON-LD 추가
**우선순위**: 중간
**의존성**: TASK-072
**담당**: Developer

**작업 내용**:
1. 6개 페이지 SEOHead 컴포넌트 추가
   - Fullstack, Design, Operations
   - COMPASS Platform, Cartographer, Captain, Harbor
2. Meta tags 정의 (title, description, keywords)
3. OG tags 정의
4. Service JSON-LD 스키마 추가 (6개)
5. Product JSON-LD 스키마 추가 (플랜)

**완료 기준**:
- [ ] 6개 페이지 SEOHead 추가
- [ ] Meta tags 정의
- [ ] OG tags 정의
- [ ] JSON-LD 스키마 추가
- [ ] Google Rich Results Test 통과

**테스트**:
- [ ] Google Rich Results Test (6개 페이지)

**관련 파일**:
- `src/pages/services/*.tsx` (6개 업데이트)

---

### [TASK-074] 확장 페이지 Lighthouse 검증 (1.5시간)

**설명**: 확장 페이지 Lighthouse 점수 90+ 검증
**우선순위**: 중간
**의존성**: TASK-073
**담당**: Developer

**작업 내용**:
1. 6개 페이지 Lighthouse 실행
2. Performance 90+ 달성
   - 이미지 최적화 (WebP, Lazy loading)
   - 폰트 로딩 최적화
   - JavaScript 최소화
3. SEO 95+ 달성
4. 개선 사항 문서화

**완료 기준**:
- [ ] 6개 페이지 Lighthouse 실행
- [ ] 모든 페이지 Performance 90+
- [ ] 모든 페이지 SEO 95+
- [ ] 개선 사항 문서화

**테스트**:
- [ ] npm run lighthouse -- fullstack design operations compass

**관련 파일**:
- `docs/lighthouse-report-phase2-2025-11-17.md`

---

## Phase 3: 최적화 & 결제 연동 (Day 22-24, 8개 태스크)

### Day 22: 성능 최적화 (4개 태스크)

### [TASK-075] Core Web Vitals 개선 (2.5시간)

**설명**: Core Web Vitals 목표 달성 (LCP < 2.5s, FID < 100ms, CLS < 0.1)
**우선순위**: 높음
**의존성**: TASK-074
**담당**: Developer

**작업 내용**:
1. LCP (Largest Contentful Paint) 개선
   - 히어로 이미지 최적화 (WebP, srcset)
   - 폰트 preload
   - Critical CSS 인라인
2. FID (First Input Delay) 개선
   - JavaScript 코드 스플리팅
   - 이벤트 핸들러 최적화
3. CLS (Cumulative Layout Shift) 개선
   - 이미지 크기 명시 (width, height)
   - 폰트 로딩 최적화 (font-display: swap)
   - Skeleton UI 추가
4. Web Vitals 측정 도구 통합 (web-vitals 라이브러리)

**완료 기준**:
- [ ] LCP < 2.5s (9개 페이지)
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Web Vitals 측정 코드 추가
- [ ] 개선 전후 비교 문서

**테스트**:
- [ ] Lighthouse Lab Data 확인
- [ ] Chrome DevTools Performance 패널

**관련 파일**:
- `src/lib/analytics/web-vitals.ts`
- `docs/performance/core-web-vitals-2025-11-17.md`

---

### [TASK-076] 이미지 최적화 (2시간)

**설명**: 이미지 WebP 변환 및 Lazy loading 적용
**우선순위**: 중간
**의존성**: TASK-075
**담당**: Developer

**작업 내용**:
1. 모든 PNG/JPG 이미지를 WebP로 변환
2. srcset 속성 추가 (1x, 2x, 3x)
3. loading="lazy" 속성 추가 (히어로 제외)
4. picture 요소 사용 (WebP 미지원 브라우저 대응)
5. 이미지 압축 (TinyPNG, Squoosh)
6. vite-imagetools 플러그인 설정 (선택 사항)

**완료 기준**:
- [ ] 모든 이미지 WebP 변환
- [ ] srcset 속성 추가
- [ ] loading="lazy" 적용
- [ ] 이미지 크기 50% 감소
- [ ] picture 요소 fallback

**테스트**:
- [ ] 이미지 로딩 속도 측정
- [ ] WebP 미지원 브라우저 테스트 (선택 사항)

**관련 파일**:
- `public/images/` (이미지 파일)
- `vite.config.ts` (vite-imagetools 설정)

---

### [TASK-077] Code splitting (1.5시간)

**설명**: React.lazy 및 동적 import로 코드 스플리팅
**우선순위**: 중간
**의존성**: TASK-076
**담당**: Developer

**작업 내용**:
1. 서비스 페이지 React.lazy 적용
   - MVPService, NavigatorService, FullstackService 등 (8개)
2. Suspense fallback UI 추가 (Skeleton)
3. 라우터 설정 업데이트 (lazy import)
4. 번들 크기 분석 (rollup-plugin-visualizer)
5. 청크 사이즈 최적화

**완료 기준**:
- [ ] 8개 서비스 페이지 lazy import
- [ ] Suspense fallback UI 추가
- [ ] 초기 번들 크기 30% 감소
- [ ] 청크 사이즈 < 200KB
- [ ] 번들 분석 리포트 생성

**테스트**:
- [ ] npm run build
- [ ] 번들 크기 비교 (before/after)

**관련 파일**:
- `src/App.tsx` (라우터 설정)
- `vite.config.ts` (rollup-plugin-visualizer)

---

### [TASK-078] React Query 캐싱 전략 최적화 (1시간)

**설명**: React Query staleTime, cacheTime 최적화
**우선순위**: 낮음
**의존성**: TASK-077
**담당**: Developer

**작업 내용**:
1. 서비스 데이터 캐싱 전략 재검토
   - staleTime: 10분 (서비스 정보는 자주 변경되지 않음)
   - cacheTime: 30분
   - refetchOnWindowFocus: false
2. Prefetching 전략 추가
   - 서비스 목록 페이지에서 상세 페이지 prefetch
3. Optimistic Updates 적용 (선택 사항)

**완료 기준**:
- [ ] 캐싱 전략 업데이트
- [ ] Prefetching 적용
- [ ] 네트워크 요청 50% 감소
- [ ] 캐싱 문서화

**테스트**:
- [ ] React Query DevTools 확인
- [ ] Network 탭 요청 수 확인

**관련 파일**:
- `src/hooks/useServices.ts`
- `src/hooks/use*.ts` (3개 훅)

---

### Day 23: 접근성 개선 (4개 태스크)

### [TASK-079] WCAG 2.1 AA 색상 대비 개선 (1.5시간)

**설명**: 색상 대비 4.5:1 달성
**우선순위**: 높음
**의존성**: TASK-078
**담당**: Developer

**작업 내용**:
1. 색상 대비 분석 (Chrome DevTools Accessibility)
2. 텍스트 색상 조정
   - 본문: 4.5:1 이상
   - 대형 텍스트 (18pt+): 3:1 이상
3. 링크 색상 구분 (underline 또는 대비)
4. 버튼 포커스 상태 강조
5. 다크 모드 색상 대비 확인

**완료 기준**:
- [ ] 모든 텍스트 대비 4.5:1 이상
- [ ] 링크 색상 구분 명확
- [ ] 버튼 포커스 상태 시각화
- [ ] 다크 모드 대비 확인
- [ ] axe DevTools 0 errors

**테스트**:
- [ ] Chrome DevTools Accessibility 패널
- [ ] axe DevTools 확장 프로그램

**관련 파일**:
- `src/index.css` (색상 변수)
- `tailwind.config.js` (테마 색상)

---

### [TASK-080] 키보드 네비게이션 개선 (2시간)

**설명**: Tab, Enter, Escape 키 지원
**우선순위**: 높음
**의존성**: TASK-079
**담당**: Developer

**작업 내용**:
1. 포커스 순서 확인 (Tab 키)
2. Enter 키로 버튼/링크 활성화
3. Escape 키로 모달/드롭다운 닫기
4. Skip to main content 링크 추가
5. 포커스 트랩 (모달, 드롭다운)
6. 포커스 링 스타일 개선 (focus-visible)

**완료 기준**:
- [ ] 포커스 순서 논리적
- [ ] Enter/Escape 키 동작
- [ ] Skip to main content 링크
- [ ] 포커스 트랩 적용
- [ ] 포커스 링 시각화
- [ ] 키보드만으로 전체 네비게이션 가능

**테스트**:
- [ ] 키보드만으로 페이지 탐색
- [ ] Tab 순서 확인

**관련 파일**:
- `src/components/layout/Header.tsx`
- `src/components/ui/*.tsx` (모달, 드롭다운)

---

### [TASK-081] ARIA 레이블 및 대체 텍스트 추가 (2시간)

**설명**: ARIA 레이블, alt 텍스트 추가
**우선순위**: 높음
**의존성**: TASK-080
**담당**: Developer

**작업 내용**:
1. 모든 이미지에 alt 텍스트 추가
   - 의미 있는 이미지: 설명 텍스트
   - 장식용 이미지: alt="" (빈 문자열)
2. 버튼/링크에 aria-label 추가 (아이콘만 있는 경우)
3. 폼 필드에 aria-describedby 추가 (에러 메시지)
4. 랜드마크 역할 추가 (header, nav, main, footer)
5. aria-live 영역 추가 (알림, 에러)

**완료 기준**:
- [ ] 모든 이미지 alt 텍스트
- [ ] 버튼/링크 aria-label
- [ ] 폼 필드 aria-describedby
- [ ] 랜드마크 역할 추가
- [ ] aria-live 영역 추가
- [ ] 스크린 리더 테스트 (NVDA/JAWS, 선택 사항)

**테스트**:
- [ ] axe DevTools 0 errors
- [ ] Lighthouse Accessibility 100

**관련 파일**:
- `src/components/**/*.tsx` (전체 컴포넌트)

---

### [TASK-082] axe-core 접근성 테스트 통과 (1시간)

**설명**: axe-core 자동 접근성 테스트 통과
**우선순위**: 중간
**의존성**: TASK-081
**담당**: Developer

**작업 내용**:
1. @axe-core/playwright 설치
2. E2E 테스트에 axe 접근성 검사 추가
3. 9개 페이지 axe 테스트 실행
4. 발견된 이슈 수정
5. 접근성 테스트 CI 통합

**완료 기준**:
- [ ] @axe-core/playwright 설치
- [ ] 9개 페이지 axe 테스트
- [ ] 모든 페이지 0 violations
- [ ] CI 통합 (GitHub Actions)
- [ ] 접근성 레포트 생성

**테스트**:
- [ ] npm run test:a11y (스크립트 추가)

**관련 파일**:
- `tests/e2e/accessibility/*.spec.ts` (9개 파일)
- `.github/workflows/accessibility.yml` (선택 사항)

---

### Day 24: 토스페이먼츠 결제 연동 준비 (4개 태스크)

### [TASK-083] @tosspayments/payment-widget-sdk 설치 (1시간)

**설명**: 토스페이먼츠 SDK 설치 및 기본 설정
**우선순위**: 낮음 (Phase 4 대비)
**의존성**: TASK-082
**담당**: Developer

**작업 내용**:
1. @tosspayments/payment-widget-sdk 설치
2. 환경 변수 설정 (.env.local)
   - VITE_TOSS_CLIENT_KEY=[테스트 키]
   - VITE_TOSS_SECRET_KEY=[테스트 시크릿]
3. SDK 초기화 코드 작성
4. TypeScript 타입 정의 확인

**완료 기준**:
- [ ] SDK 설치 완료
- [ ] 환경 변수 설정
- [ ] SDK 초기화 코드
- [ ] TypeScript 타입 확인
- [ ] npm run build 성공

**테스트**:
- [ ] SDK import 확인
- [ ] 타입 에러 0개

**관련 파일**:
- `package.json`
- `.env.local`
- `src/lib/toss-payments/client.ts`

---

### [TASK-084] payments 테이블 생성 (1.5시간)

**설명**: 결제 정보 저장 테이블 마이그레이션
**우선순위**: 낮음 (Phase 4 대비)
**의존성**: TASK-083
**담당**: Developer

**작업 내용**:
1. payments 테이블 생성 마이그레이션
   - id (UUID)
   - user_id (UUID, FK)
   - service_id (UUID, FK)
   - package_id / plan_id (UUID, FK)
   - amount (INTEGER)
   - status (TEXT: pending, approved, failed, refunded)
   - payment_method (TEXT: card, transfer, toss)
   - toss_payment_key (TEXT, 토스 결제 키)
   - toss_order_id (TEXT, 주문 ID)
   - created_at, updated_at
2. RLS 정책 생성 (user_id 기반)
3. Indexes 생성 (user_id, status)

**완료 기준**:
- [ ] 마이그레이션 파일 작성
- [ ] 로컬 DB에 적용
- [ ] RLS 정책 설정
- [ ] Indexes 생성
- [ ] 테스트 데이터 1개 삽입

**테스트**:
- [ ] SELECT * FROM payments
- [ ] RLS 정책 테스트

**관련 파일**:
- `supabase/migrations/20251117200000_create_payments_table.sql`

---

### [TASK-085] Payment 컴포넌트 기본 구조 (2시간)

**설명**: 결제 UI 컴포넌트 기본 구조 (Phase 4 대비)
**우선순위**: 낮음
**의존성**: TASK-084
**담당**: Developer

**작업 내용**:
1. src/components/payment/PaymentWidget.tsx 생성
2. Props 인터페이스 (amount, orderName, customerName)
3. SDK loadTossPayments() 호출
4. PaymentWidget UI 렌더링
5. 결제 버튼 핸들러 (requestPayment)
6. 성공/실패 콜백 처리 (선택 사항)

**완료 기준**:
- [ ] PaymentWidget 컴포넌트 생성
- [ ] SDK 통합
- [ ] Props 타입 정의
- [ ] 기본 UI 렌더링
- [ ] TypeScript 에러 0개
- [ ] 주석으로 Phase 4 TODO 표시

**테스트**:
- [ ] 컴포넌트 렌더링 확인 (실제 결제 X)

**관련 파일**:
- `src/components/payment/PaymentWidget.tsx`

---

### [TASK-086] 결제 플로우 설계 문서 작성 (1시간)

**설명**: Phase 4 결제 연동을 위한 설계 문서
**우선순위**: 낮음
**의존성**: TASK-085
**담당**: Developer

**작업 내용**:
1. docs/payment/payment-flow-design.md 파일 생성
2. 결제 플로우 다이어그램
   - 1단계: 패키지/플랜 선택
   - 2단계: 결제 정보 입력
   - 3단계: 결제 승인 (토스페이먼츠)
   - 4단계: 결제 완료 (DB 저장, 이메일 발송)
3. 환불 플로우
4. 구독 갱신 플로우 (자동 결제)
5. 에러 처리 시나리오 5가지
6. Phase 4 작업 목록 (20-25개 태스크 예상)

**완료 기준**:
- [ ] 설계 문서 작성 완료
- [ ] 플로우 다이어그램 3개
- [ ] 에러 처리 시나리오 5개
- [ ] Phase 4 작업 목록 초안
- [ ] 문서 리뷰 완료

**테스트**:
- [ ] 문서 가독성 검토
- [ ] 플로우 논리성 검토

**관련 파일**:
- `docs/payment/payment-flow-design.md`

---

## Sprint 3 Summary

**총 태스크**: 22개
**총 예상 시간**: 45시간
**E2E 테스트**: 35개 (Sprint 1-2 포함 총 53개)
**완료 기준**: Phase 2 & Phase 3 완료

**Phase 2 산출물** (14개 태스크):
- 서비스 페이지: 6개 추가 (Fullstack, Design, Operations, COMPASS, Cartographer, Captain, Harbor)
- 데이터: 7개 서비스 DB 입력
- E2E 테스트: 6개 파일 (30개 테스트)
- SEO: Meta tags, JSON-LD (6개 페이지)

**Phase 3 산출물** (8개 태스크):
- 성능 최적화: Core Web Vitals, 이미지, Code splitting, React Query
- 접근성 개선: WCAG 2.1 AA, 키보드, ARIA, axe-core
- 결제 준비: SDK 설치, payments 테이블, 설계 문서

**전체 프로젝트 최종 통계**:
- 총 태스크: 77개 (Sprint 1: 40 + Sprint 2: 15 + Sprint 3: 22)
- 총 예상 시간: 153.5시간 (약 19-20일, 3주)
- 페이지: 15개 (홈, 서비스 목록, 8개 서비스 상세, COMPASS 플랫폼, 3개 COMPASS 서비스, 가격)
- 컴포넌트: 10개 공통 + 2개 추가 (ServiceShowcase, PaymentWidget)
- React 훅: 3개
- E2E 테스트: 53개 (11개 파일)
- 문서: 12개

**Phase 4 (선택 사항) 작업 예상**:
- 결제 연동 (20-25개 태스크, 5-7일)
- 사용자 대시보드 (구독 관리, 결제 내역)
- 이메일 알림 (결제 완료, 구독 갱신)
- 어드민 결제 관리

**다음 단계**:
1. Sprint 1-3 전체 검토
2. 토스페이먼츠 심사 제출 (Phase 1-2 완료 기준)
3. Phase 4 결제 연동 (선택 사항)
