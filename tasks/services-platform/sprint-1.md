# Sprint 1: Phase 1 - 필수 페이지 (Day 1-10)

> **목표**: 토스페이먼츠 심사 통과를 위한 필수 페이지 구현
> **기간**: 7-10일
> **태스크**: 40개
> **E2E 테스트**: 18개

---

## Day 1: Database 설정 (5개 태스크)

### [TASK-001] services 테이블 확장 (1.5시간)

**설명**: 기존 services 테이블에 pricing_data, deliverables, process_steps, faq 컬럼 추가
**우선순위**: 높음
**의존성**: 없음
**담당**: Developer

**작업 내용**:
1. 마이그레이션 파일 생성 (20251117000000_extend_services_table.sql)
2. pricing_data JSONB 컬럼 추가 (패키지/플랜 정보)
3. deliverables JSONB 컬럼 추가 (결과물 목록)
4. process_steps JSONB 컬럼 추가 (프로세스 단계)
5. faq JSONB 컬럼 추가 (FAQ 목록)
6. 기존 데이터 마이그레이션 (mvp, fullstack, design, operations)

**완료 기준**:
- [ ] 마이그레이션 파일 작성 완료
- [ ] 로컬 DB에 마이그레이션 적용 성공
- [ ] 기존 4개 서비스 데이터 유지 확인
- [ ] 새 컬럼 null 허용 확인
- [ ] Supabase Studio에서 스키마 확인

**테스트**:
- [ ] SQL 쿼리 검증 (SELECT * FROM services)
- [ ] check-services-schema.sql 스크립트 실행

**관련 파일**:
- `supabase/migrations/20251117000000_extend_services_table.sql`
- `scripts/check-services-schema.sql`

---

### [TASK-002] service_packages 테이블 생성 (1시간)

**설명**: 일회성 프로젝트 패키지 정보 저장 테이블 생성
**우선순위**: 높음
**의존성**: TASK-001
**담당**: Developer

**작업 내용**:
1. service_packages 테이블 생성 (id, service_id, name, price, features, is_popular, display_order)
2. Foreign key 설정 (services.id)
3. RLS 정책 생성 (public SELECT, admin INSERT/UPDATE/DELETE)
4. Indexes 생성 (service_id, display_order)

**완료 기준**:
- [ ] 테이블 생성 완료
- [ ] Foreign key 제약조건 설정
- [ ] RLS 정책 적용
- [ ] Indexes 생성
- [ ] 테스트 데이터 1개 삽입 성공

**테스트**:
- [ ] INSERT 권한 테스트 (admin)
- [ ] SELECT 권한 테스트 (anonymous)

**관련 파일**:
- `supabase/migrations/20251117000100_create_service_packages.sql`

---

### [TASK-003] subscription_plans 테이블 생성 (1시간)

**설명**: 구독형 플랜 정보 저장 테이블 생성
**우선순위**: 높음
**의존성**: TASK-001
**담당**: Developer

**작업 내용**:
1. subscription_plans 테이블 생성 (id, service_id, name, monthly_price, annual_price, features, limits, is_popular, display_order)
2. Foreign key 설정 (services.id)
3. RLS 정책 생성 (public SELECT, admin INSERT/UPDATE/DELETE)
4. Indexes 생성 (service_id, display_order)

**완료 기준**:
- [ ] 테이블 생성 완료
- [ ] Foreign key 제약조건 설정
- [ ] RLS 정책 적용
- [ ] Indexes 생성
- [ ] 테스트 데이터 1개 삽입 성공

**테스트**:
- [ ] INSERT 권한 테스트 (admin)
- [ ] SELECT 권한 테스트 (anonymous)

**관련 파일**:
- `supabase/migrations/20251117000200_create_subscription_plans.sql`

---

### [TASK-004] RLS 정책 설정 (1시간)

**설명**: 서비스 관련 테이블 RLS 정책 설정 및 검증
**우선순위**: 높음
**의존성**: TASK-001, TASK-002, TASK-003
**담당**: Developer

**작업 내용**:
1. services 테이블 RLS 활성화 확인
2. service_packages RLS 정책 검증
3. subscription_plans RLS 정책 검증
4. Anonymous role SELECT 권한 테스트
5. Authenticated admin role CRUD 권한 테스트

**완료 기준**:
- [ ] RLS 활성화 확인 (3개 테이블)
- [ ] Anonymous SELECT 성공
- [ ] Admin INSERT/UPDATE/DELETE 성공
- [ ] Non-admin INSERT 거부 확인
- [ ] RLS 정책 문서화 (security.md)

**테스트**:
- [ ] Supabase Studio RLS Policies 확인
- [ ] 권한 테스트 스크립트 작성

**관련 파일**:
- `docs/guides/database/security.md`
- `scripts/test-rls-policies.sql`

---

### [TASK-005] 마이그레이션 스크립트 작성 및 검증 (1.5시간)

**설명**: 전체 마이그레이션 검증 및 롤백 스크립트 작성
**우선순위**: 높음
**의존성**: TASK-001, TASK-002, TASK-003, TASK-004
**담당**: Developer

**작업 내용**:
1. 마이그레이션 순서 검증 (타임스탬프 확인)
2. 롤백 스크립트 작성 (20251117000300_rollback_services_extension.sql)
3. 로컬 DB에서 supabase db reset 실행
4. 프로덕션 마이그레이션 가이드 작성
5. 마이그레이션 검증 체크리스트 작성

**완료 기준**:
- [ ] 마이그레이션 순서 정렬 확인
- [ ] 롤백 스크립트 작성 완료
- [ ] supabase db reset 성공
- [ ] 프로덕션 가이드 작성 (migration-guide.md)
- [ ] 체크리스트 21개 항목 완성

**테스트**:
- [ ] supabase db reset
- [ ] 롤백 스크립트 실행 테스트
- [ ] 데이터 무결성 검증

**관련 파일**:
- `supabase/migrations/20251117000300_rollback_services_extension.sql`
- `docs/guides/database/services-migration-guide.md`

---

## Day 2: 공통 컴포넌트 Part 1 (5개 태스크)

### [TASK-006] ServiceHero 컴포넌트 (2시간)

**설명**: 서비스 상세 페이지 히어로 섹션 컴포넌트
**우선순위**: 높음
**의존성**: TASK-005
**담당**: Developer

**작업 내용**:
1. ServiceHero.tsx 컴포넌트 생성
2. Props 인터페이스 정의 (title, description, category, cta)
3. 배경 그라디언트 디자인 (category별 색상)
4. CTA 버튼 2개 (문의하기, 자세히 보기)
5. 반응형 레이아웃 (모바일/태블릿/데스크톱)
6. 다크 모드 지원

**완료 기준**:
- [ ] 컴포넌트 작성 완료
- [ ] TypeScript 타입 정의
- [ ] 반응형 디자인 (3개 브레이크포인트)
- [ ] 다크 모드 스타일
- [ ] Accessibility (ARIA labels)
- [ ] Storybook 스토리 작성 (선택 사항)

**테스트**:
- [ ] 시각적 회귀 테스트 (모바일/데스크톱)
- [ ] 키보드 네비게이션 테스트

**관련 파일**:
- `src/components/services/ServiceHero.tsx`
- `src/components/services/ServiceHero.stories.tsx` (선택 사항)

---

### [TASK-007] ServiceFeatures 컴포넌트 (2시간)

**설명**: 서비스 주요 기능 소개 컴포넌트 (3-4개 기능)
**우선순위**: 높음
**의존성**: TASK-006
**담당**: Developer

**작업 내용**:
1. ServiceFeatures.tsx 컴포넌트 생성
2. Props 인터페이스 (features: { icon, title, description }[])
3. 그리드 레이아웃 (3-4 columns)
4. Lucide 아이콘 통합
5. Hover 애니메이션 (scale, shadow)
6. 반응형 그리드 (모바일 1열, 태블릿 2열, 데스크톱 3-4열)

**완료 기준**:
- [ ] 컴포넌트 작성 완료
- [ ] TypeScript 타입 정의
- [ ] 그리드 레이아웃 반응형
- [ ] 아이콘 크기/색상 일관성
- [ ] Hover 애니메이션
- [ ] 다크 모드 지원

**테스트**:
- [ ] 3개 기능 렌더링 테스트
- [ ] 4개 기능 렌더링 테스트
- [ ] Responsive breakpoints 테스트

**관련 파일**:
- `src/components/services/ServiceFeatures.tsx`

---

### [TASK-008] ServiceProcess 컴포넌트 (2.5시간)

**설명**: 서비스 프로세스 4-5단계 표시 컴포넌트
**우선순위**: 높음
**의존성**: TASK-007
**담당**: Developer

**작업 내용**:
1. ServiceProcess.tsx 컴포넌트 생성
2. Props 인터페이스 (steps: { number, title, description, duration }[])
3. Timeline 디자인 (세로 라인 연결)
4. 단계별 번호 원형 배지
5. 애니메이션 (스크롤 시 순차 표시)
6. 모바일 레이아웃 (세로 타임라인)

**완료 기준**:
- [ ] 컴포넌트 작성 완료
- [ ] Timeline 디자인 완성
- [ ] 단계별 애니메이션 (Intersection Observer)
- [ ] 반응형 레이아웃
- [ ] 다크 모드 지원
- [ ] 접근성 (순차 읽기)

**테스트**:
- [ ] 4단계 프로세스 렌더링
- [ ] 5단계 프로세스 렌더링
- [ ] 스크롤 애니메이션 동작 확인

**관련 파일**:
- `src/components/services/ServiceProcess.tsx`

---

### [TASK-009] ServiceDeliverables 컴포넌트 (1.5시간)

**설명**: 서비스 결과물 목록 컴포넌트
**우선순위**: 중간
**의존성**: TASK-008
**담당**: Developer

**작업 내용**:
1. ServiceDeliverables.tsx 컴포넌트 생성
2. Props 인터페이스 (deliverables: { icon, title, description }[])
3. 리스트 레이아웃 (체크 아이콘)
4. 2열 그리드 (데스크톱), 1열 (모바일)
5. 다크 모드 지원

**완료 기준**:
- [ ] 컴포넌트 작성 완료
- [ ] TypeScript 타입 정의
- [ ] 체크 아이콘 스타일
- [ ] 반응형 그리드
- [ ] 다크 모드 지원

**테스트**:
- [ ] 5개 결과물 렌더링
- [ ] 반응형 레이아웃 테스트

**관련 파일**:
- `src/components/services/ServiceDeliverables.tsx`

---

### [TASK-010] 공통 컴포넌트 Storybook 스토리 (1시간, 선택 사항)

**설명**: 생성된 공통 컴포넌트 Storybook 스토리 작성
**우선순위**: 낮음
**의존성**: TASK-006, TASK-007, TASK-008, TASK-009
**담당**: Developer

**작업 내용**:
1. ServiceHero.stories.tsx 작성
2. ServiceFeatures.stories.tsx 작성
3. ServiceProcess.stories.tsx 작성
4. ServiceDeliverables.stories.tsx 작성
5. 각 컴포넌트 3개 변형 (Default, Dark Mode, Mobile)

**완료 기준**:
- [ ] 4개 스토리 파일 작성
- [ ] 각 3개 변형 (12개 스토리)
- [ ] Storybook 빌드 성공
- [ ] 시각적 검토 완료

**테스트**:
- [ ] npm run storybook 실행
- [ ] 모든 스토리 렌더링 확인

**관련 파일**:
- `src/components/services/*.stories.tsx` (4개 파일)

---

## Day 3: 공통 컴포넌트 Part 2 (5개 태스크)

### [TASK-011] ServicePricing 컴포넌트 (2.5시간)

**설명**: 패키지/플랜 가격 표시 컴포넌트
**우선순위**: 높음
**의존성**: TASK-009
**담당**: Developer

**작업 내용**:
1. ServicePricing.tsx 컴포넌트 생성
2. Props 인터페이스 (type: 'package' | 'subscription', items: PackageOrPlan[])
3. PricingCard 컴포넌트 (가격, 기능, CTA)
4. Popular 배지 (is_popular: true)
5. 패키지 가격 형식 (₩5,000,000)
6. 플랜 가격 형식 (₩29,000/월)
7. 연간 할인 표시 (플랜)
8. 반응형 그리드 (1-3 columns)

**완료 기준**:
- [ ] 컴포넌트 작성 완료
- [ ] 패키지/플랜 타입 분기 처리
- [ ] 가격 포맷팅 (천 단위 쉼표)
- [ ] Popular 배지 스타일
- [ ] 반응형 그리드
- [ ] 다크 모드 지원

**테스트**:
- [ ] 패키지 3개 렌더링 (MVP)
- [ ] 플랜 3개 렌더링 (Navigator)
- [ ] 가격 포맷팅 정확성 검증

**관련 파일**:
- `src/components/services/ServicePricing.tsx`
- `src/lib/format-price.ts` (유틸리티)

---

### [TASK-012] ServiceFAQ 컴포넌트 (2시간)

**설명**: 자주 묻는 질문 Accordion 컴포넌트
**우선순위**: 높음
**의존성**: TASK-011
**담당**: Developer

**작업 내용**:
1. ServiceFAQ.tsx 컴포넌트 생성
2. Props 인터페이스 (faqs: { question, answer }[])
3. Radix UI Accordion 통합
4. 질문 클릭 시 답변 확장/축소
5. 아이콘 회전 애니메이션 (ChevronDown)
6. 다크 모드 지원

**완료 기준**:
- [ ] 컴포넌트 작성 완료
- [ ] Accordion 동작 정상
- [ ] 아이콘 애니메이션
- [ ] 키보드 네비게이션 (화살표 키)
- [ ] ARIA 속성 설정
- [ ] 다크 모드 지원

**테스트**:
- [ ] 7개 FAQ 렌더링
- [ ] 확장/축소 동작 테스트
- [ ] 키보드 접근성 테스트

**관련 파일**:
- `src/components/services/ServiceFAQ.tsx`

---

### [TASK-013] ServiceCTA 컴포넌트 (1.5시간)

**설명**: 문의하기, 결제하기 CTA 섹션 컴포넌트
**우선순위**: 높음
**의존성**: TASK-012
**담당**: Developer

**작업 내용**:
1. ServiceCTA.tsx 컴포넌트 생성
2. Props 인터페이스 (title, description, primaryCTA, secondaryCTA)
3. 2개 버튼 레이아웃 (Primary: 문의하기, Secondary: 결제하기)
4. 배경 그라디언트 디자인
5. 반응형 버튼 (모바일 세로 배치)

**완료 기준**:
- [ ] 컴포넌트 작성 완료
- [ ] 2개 버튼 스타일
- [ ] 반응형 레이아웃
- [ ] 다크 모드 지원
- [ ] 링크 동작 확인 (/work-with-us, /payment)

**테스트**:
- [ ] 버튼 클릭 네비게이션
- [ ] 모바일 레이아웃 테스트

**관련 파일**:
- `src/components/services/ServiceCTA.tsx`

---

### [TASK-014] ServiceTestimonials 컴포넌트 (2시간, 선택 사항)

**설명**: 고객 후기 컴포넌트 (선택 사항)
**우선순위**: 낮음
**의존성**: TASK-013
**담당**: Developer

**작업 내용**:
1. ServiceTestimonials.tsx 컴포넌트 생성
2. Props 인터페이스 (testimonials: { name, role, company, content, avatar }[])
3. 카드 레이아웃 (2-3개 후기)
4. 별점 표시 (5점 만점)
5. 아바타 이미지 또는 이니셜
6. 반응형 그리드

**완료 기준**:
- [ ] 컴포넌트 작성 완료
- [ ] 후기 카드 디자인
- [ ] 별점 컴포넌트
- [ ] 반응형 그리드
- [ ] 다크 모드 지원

**테스트**:
- [ ] 3개 후기 렌더링
- [ ] 별점 표시 정확성

**관련 파일**:
- `src/components/services/ServiceTestimonials.tsx`

---

### [TASK-015] 공통 컴포넌트 TypeScript 타입 정의 (1시간)

**설명**: 서비스 관련 TypeScript 타입 통합 정의
**우선순위**: 높음
**의존성**: TASK-011, TASK-012, TASK-013
**담당**: Developer

**작업 내용**:
1. src/types/services.ts 파일 생성
2. ServiceBase 인터페이스 (공통 필드)
3. ServicePackage 인터페이스
4. SubscriptionPlan 인터페이스
5. ServiceFeature, ProcessStep, Deliverable, FAQ 인터페이스
6. 기존 컴포넌트에 타입 적용

**완료 기준**:
- [ ] services.ts 파일 생성
- [ ] 6개 인터페이스 정의
- [ ] 기존 컴포넌트 타입 적용
- [ ] TypeScript 에러 0개
- [ ] JSDoc 주석 추가

**테스트**:
- [ ] npm run type-check 통과
- [ ] 타입 추론 확인 (VS Code)

**관련 파일**:
- `src/types/services.ts`
- `src/components/services/*.tsx` (타입 적용)

---

## Day 4-5: 서비스 목록 페이지 (6개 태스크)

### [TASK-016] ServicesPage 레이아웃 (2.5시간)

**설명**: 서비스 목록 페이지 전체 레이아웃
**우선순위**: 높음
**의존성**: TASK-015
**담당**: Developer

**작업 내용**:
1. src/pages/Services.tsx 파일 생성
2. 페이지 히어로 섹션 (타이틀, 설명)
3. 필터 UI (개발/플랫폼 탭)
4. 검색창 (제목, 설명 검색)
5. 서비스 그리드 (3-4 columns)
6. 로딩 상태 (Skeleton)
7. 빈 상태 (검색 결과 없음)

**완료 기준**:
- [ ] Services.tsx 작성 완료
- [ ] 히어로 섹션 디자인
- [ ] 필터/검색 UI
- [ ] 그리드 레이아웃 반응형
- [ ] 로딩/빈 상태 처리
- [ ] 다크 모드 지원

**테스트**:
- [ ] 페이지 렌더링 확인
- [ ] 반응형 레이아웃 테스트

**관련 파일**:
- `src/pages/Services.tsx`

---

### [TASK-017] ServiceCard 컴포넌트 (2시간)

**설명**: 서비스 카드 컴포넌트 (목록 페이지용)
**우선순위**: 높음
**의존성**: TASK-016
**담당**: Developer

**작업 내용**:
1. ServiceCard.tsx 컴포넌트 생성
2. Props 인터페이스 (id, title, description, category, icon, price_range)
3. 카드 레이아웃 (아이콘, 제목, 설명, 가격 범위)
4. Hover 애니메이션 (shadow, scale)
5. Link 컴포넌트 통합 (/services/:id)
6. 카테고리 배지 (개발/플랫폼)

**완료 기준**:
- [ ] 컴포넌트 작성 완료
- [ ] 카드 디자인 완성
- [ ] Hover 애니메이션
- [ ] 링크 동작 확인
- [ ] 다크 모드 지원

**테스트**:
- [ ] 8개 서비스 카드 렌더링
- [ ] 카드 클릭 네비게이션

**관련 파일**:
- `src/components/services/ServiceCard.tsx`

---

### [TASK-018] 서비스 필터링 로직 (1.5시간)

**설명**: 카테고리별 서비스 필터링 기능
**우선순위**: 중간
**의존성**: TASK-017
**담당**: Developer

**작업 내용**:
1. 필터 상태 관리 (useState)
2. 카테고리 탭 UI (전체/개발/플랫폼)
3. 서비스 필터링 로직 (category 매칭)
4. URL 쿼리 파라미터 동기화 (?category=development)
5. 필터 초기화 버튼

**완료 기준**:
- [ ] 필터 로직 작성 완료
- [ ] 탭 UI 동작
- [ ] URL 쿼리 동기화
- [ ] 필터 초기화 버튼
- [ ] 필터링 결과 카운트 표시

**테스트**:
- [ ] 카테고리 필터링 동작
- [ ] URL 쿼리 파라미터 테스트
- [ ] 필터 초기화 테스트

**관련 파일**:
- `src/pages/Services.tsx` (필터 로직 추가)

---

### [TASK-019] 서비스 검색 기능 (2시간)

**설명**: 제목, 설명 기반 서비스 검색
**우선순위**: 중간
**의존성**: TASK-018
**담당**: Developer

**작업 내용**:
1. 검색 입력 상태 관리 (useState)
2. 검색 로직 (title, description 포함 여부)
3. Debounce 적용 (300ms)
4. 검색창 UI (돋보기 아이콘, 클리어 버튼)
5. 검색 결과 하이라이트 (선택 사항)

**완료 기준**:
- [ ] 검색 로직 작성 완료
- [ ] Debounce 적용
- [ ] 검색창 UI 디자인
- [ ] 클리어 버튼 동작
- [ ] 검색 결과 카운트 표시

**테스트**:
- [ ] 검색 동작 확인
- [ ] Debounce 동작 확인
- [ ] 빈 검색 결과 처리

**관련 파일**:
- `src/pages/Services.tsx` (검색 로직 추가)
- `src/lib/use-debounce.ts` (훅)

---

### [TASK-020] useServices 훅 (2시간)

**설명**: 서비스 목록 조회 React Query 훅
**우선순위**: 높음
**의존성**: TASK-019
**담당**: Developer

**작업 내용**:
1. src/hooks/useServices.ts 파일 생성
2. useQuery 설정 (queryKey: ['services'], queryFn)
3. Supabase 쿼리 (SELECT * FROM services)
4. 에러 처리 (toast 알림)
5. 캐싱 전략 (staleTime: 5분)
6. 타입 정의 (Service[])

**완료 기준**:
- [ ] useServices 훅 작성 완료
- [ ] React Query 설정
- [ ] Supabase 쿼리 동작
- [ ] 에러 처리
- [ ] TypeScript 타입 정의

**테스트**:
- [ ] 서비스 목록 조회 성공
- [ ] 캐싱 동작 확인
- [ ] 에러 처리 확인

**관련 파일**:
- `src/hooks/useServices.ts`

---

### [TASK-021] ServicesPage E2E 테스트 (1.5시간)

**설명**: 서비스 목록 페이지 E2E 테스트 3개
**우선순위**: 중간
**의존성**: TASK-020
**담당**: Developer

**작업 내용**:
1. tests/e2e/services/services-list.spec.ts 파일 생성
2. 테스트 1: 서비스 목록 렌더링 (8개 서비스)
3. 테스트 2: 카테고리 필터링 (개발/플랫폼)
4. 테스트 3: 검색 기능 ("MVP" 검색)

**완료 기준**:
- [ ] 3개 테스트 작성 완료
- [ ] 모든 테스트 통과
- [ ] Playwright 레포트 생성
- [ ] 테스트 실행 시간 < 10초

**테스트**:
- [ ] npm run test:e2e -- services-list.spec.ts

**관련 파일**:
- `tests/e2e/services/services-list.spec.ts`

---

## Day 6-7: MVP Service 상세 페이지 (6개 태스크)

### [TASK-022] MVPService 페이지 레이아웃 (2시간)

**설명**: MVP 서비스 상세 페이지 컴포넌트 조합
**우선순위**: 높음
**의존성**: TASK-021
**담당**: Developer

**작업 내용**:
1. src/pages/services/MVPService.tsx 파일 생성
2. ServiceHero 컴포넌트 배치
3. ServiceFeatures 컴포넌트 배치
4. ServiceProcess 컴포넌트 배치
5. ServicePricing 컴포넌트 배치 (3개 패키지)
6. ServiceDeliverables 컴포넌트 배치
7. ServiceFAQ 컴포넌트 배치
8. ServiceCTA 컴포넌트 배치

**완료 기준**:
- [ ] MVPService.tsx 작성 완료
- [ ] 8개 섹션 배치
- [ ] 섹션 간 간격 일관성
- [ ] 스크롤 애니메이션 (선택 사항)
- [ ] 다크 모드 지원

**테스트**:
- [ ] 페이지 렌더링 확인
- [ ] 모든 섹션 표시 확인

**관련 파일**:
- `src/pages/services/MVPService.tsx`

---

### [TASK-023] MVP 서비스 데이터 입력 (1시간)

**설명**: MVP 서비스 데이터 DB 입력
**우선순위**: 높음
**의존성**: TASK-022
**담당**: Developer

**작업 내용**:
1. supabase/seed/mvp-service-data.sql 파일 생성
2. services 테이블 UPDATE (pricing_data, deliverables, process_steps, faq)
3. service_packages 3개 레코드 INSERT (Basic, Standard, Premium)
4. 데이터 검증 쿼리 작성

**완료 기준**:
- [ ] SQL 파일 작성 완료
- [ ] 로컬 DB에 데이터 입력
- [ ] Supabase Studio에서 확인
- [ ] 검증 쿼리 실행

**테스트**:
- [ ] SELECT * FROM services WHERE slug = 'mvp'
- [ ] SELECT * FROM service_packages WHERE service_id = 'mvp-id'

**관련 파일**:
- `supabase/seed/mvp-service-data.sql`

---

### [TASK-024] MVP 3개 패키지 정의 (1.5시간)

**설명**: MVP 서비스 패키지 상세 정의
**우선순위**: 높음
**의존성**: TASK-023
**담당**: Developer

**작업 내용**:
1. Basic 패키지 정의 (₩5,000,000)
   - 핵심 기능 5개
   - 개발 기간: 4주
   - 결과물: 웹/모바일 MVP
2. Standard 패키지 정의 (₩8,000,000)
   - 핵심 + 확장 기능 8개
   - 개발 기간: 6주
   - 결과물: MVP + Admin 패널
3. Premium 패키지 정의 (₩12,000,000)
   - 전체 기능 12개
   - 개발 기간: 8주
   - 결과물: MVP + Admin + 분석 대시보드

**완료 기준**:
- [ ] 3개 패키지 features 정의
- [ ] 가격 책정 근거 문서화
- [ ] service_packages 테이블에 데이터 입력
- [ ] is_popular 플래그 (Standard)

**테스트**:
- [ ] 패키지 데이터 검증 쿼리

**관련 파일**:
- `supabase/seed/mvp-service-data.sql` (업데이트)
- `docs/services/mvp-pricing-rationale.md`

---

### [TASK-025] MVP 프로세스 4단계 정의 (1시간)

**설명**: MVP 개발 프로세스 4단계 상세 정의
**우선순위**: 중간
**의존성**: TASK-024
**담당**: Developer

**작업 내용**:
1. 1단계: 아이디어 검증 (1주)
   - 사용자 인터뷰 5명
   - 시장 조사
   - MVP 스펙 정의
2. 2단계: 디자인 & 프로토타입 (1주)
   - Figma 디자인
   - 프로토타입 테스트
3. 3단계: 개발 & 테스트 (2-4주)
   - Agile 스프린트
   - 주간 데모
4. 4단계: 배포 & 피드백 (1주)
   - 베타 테스트
   - 피드백 수집

**완료 기준**:
- [ ] 4단계 상세 정의
- [ ] process_steps JSON 데이터 작성
- [ ] services 테이블 업데이트

**테스트**:
- [ ] process_steps 데이터 검증

**관련 파일**:
- `supabase/seed/mvp-service-data.sql` (업데이트)

---

### [TASK-026] MVP FAQ 7개 작성 (1시간)

**설명**: MVP 서비스 자주 묻는 질문 7개 작성
**우선순위**: 중간
**의존성**: TASK-025
**담당**: Developer

**작업 내용**:
1. FAQ 1: MVP란 무엇인가요?
2. FAQ 2: 개발 기간은 얼마나 걸리나요?
3. FAQ 3: 어떤 기술 스택을 사용하나요?
4. FAQ 4: 배포는 포함되나요?
5. FAQ 5: 유지보수는 어떻게 하나요?
6. FAQ 6: 소스 코드 소유권은 누구에게 있나요?
7. FAQ 7: 추가 기능 개발 비용은 얼마인가요?

**완료 기준**:
- [ ] 7개 FAQ 작성 완료
- [ ] faq JSON 데이터 작성
- [ ] services 테이블 업데이트
- [ ] 답변 길이 100-200자

**테스트**:
- [ ] faq 데이터 검증

**관련 파일**:
- `supabase/seed/mvp-service-data.sql` (업데이트)

---

### [TASK-027] useMVPService 훅 (1.5시간)

**설명**: MVP 서비스 상세 조회 React Query 훅
**우선순위**: 높음
**의존성**: TASK-026
**담당**: Developer

**작업 내용**:
1. src/hooks/useMVPService.ts 파일 생성
2. useQuery 설정 (queryKey: ['services', 'mvp'])
3. Supabase 쿼리 (SELECT * FROM services WHERE slug = 'mvp')
4. service_packages 조인 쿼리
5. 에러 처리 (404 처리)
6. 타입 정의

**완료 기준**:
- [ ] useMVPService 훅 작성 완료
- [ ] Supabase 조인 쿼리 동작
- [ ] 404 에러 처리
- [ ] TypeScript 타입 정의
- [ ] 캐싱 전략 (staleTime: 10분)

**테스트**:
- [ ] MVP 서비스 조회 성공
- [ ] 패키지 데이터 포함 확인
- [ ] 404 에러 처리 확인

**관련 파일**:
- `src/hooks/useMVPService.ts`

---

### [TASK-028] MVPService E2E 테스트 (2시간)

**설명**: MVP 서비스 상세 페이지 E2E 테스트 6개
**우선순위**: 중간
**의존성**: TASK-027
**담당**: Developer

**작업 내용**:
1. tests/e2e/services/mvp-service.spec.ts 파일 생성
2. 테스트 1: 페이지 렌더링 (제목, 설명)
3. 테스트 2: 3개 패키지 표시
4. 테스트 3: 프로세스 4단계 표시
5. 테스트 4: FAQ 7개 표시
6. 테스트 5: CTA 버튼 클릭
7. 테스트 6: Lighthouse 점수 90+

**완료 기준**:
- [ ] 6개 테스트 작성 완료
- [ ] 모든 테스트 통과
- [ ] Lighthouse CI 통합
- [ ] 테스트 실행 시간 < 15초

**테스트**:
- [ ] npm run test:e2e -- mvp-service.spec.ts

**관련 파일**:
- `tests/e2e/services/mvp-service.spec.ts`

---

## Day 8-9: Navigator Service 상세 페이지 (6개 태스크)

### [TASK-029] NavigatorService 페이지 레이아웃 (2시간)

**설명**: Navigator 서비스 상세 페이지 컴포넌트 조합
**우선순위**: 높음
**의존성**: TASK-028
**담당**: Developer

**작업 내용**:
1. src/pages/services/NavigatorService.tsx 파일 생성
2. ServiceHero 컴포넌트 배치
3. ServiceFeatures 컴포넌트 배치
4. ServicePricing 컴포넌트 배치 (3개 플랜)
5. ServiceFAQ 컴포넌트 배치
6. ServiceCTA 컴포넌트 배치 (구독하기 버튼)

**완료 기준**:
- [ ] NavigatorService.tsx 작성 완료
- [ ] 6개 섹션 배치
- [ ] 구독형 가격 표시 (월/연)
- [ ] 다크 모드 지원

**테스트**:
- [ ] 페이지 렌더링 확인
- [ ] 플랜 가격 형식 확인

**관련 파일**:
- `src/pages/services/NavigatorService.tsx`

---

### [TASK-030] Navigator 서비스 데이터 입력 (1시간)

**설명**: Navigator 서비스 데이터 DB 입력
**우선순위**: 높음
**의존성**: TASK-029
**담당**: Developer

**작업 내용**:
1. supabase/seed/navigator-service-data.sql 파일 생성
2. services 테이블 INSERT (slug: 'navigator')
3. subscription_plans 3개 레코드 INSERT (Starter, Pro, Enterprise)
4. 데이터 검증 쿼리 작성

**완료 기준**:
- [ ] SQL 파일 작성 완료
- [ ] 로컬 DB에 데이터 입력
- [ ] Supabase Studio에서 확인
- [ ] 검증 쿼리 실행

**테스트**:
- [ ] SELECT * FROM services WHERE slug = 'navigator'
- [ ] SELECT * FROM subscription_plans WHERE service_id = 'navigator-id'

**관련 파일**:
- `supabase/seed/navigator-service-data.sql`

---

### [TASK-031] Navigator 3개 플랜 정의 (1.5시간)

**설명**: Navigator 구독 플랜 상세 정의
**우선순위**: 높음
**의존성**: TASK-030
**담당**: Developer

**작업 내용**:
1. Starter 플랜 정의 (₩29,000/월)
   - 프로젝트 1개
   - 팀원 3명
   - 기본 대시보드
2. Pro 플랜 정의 (₩99,000/월)
   - 프로젝트 5개
   - 팀원 10명
   - 고급 대시보드 + API 접근
3. Enterprise 플랜 정의 (₩299,000/월)
   - 무제한 프로젝트
   - 무제한 팀원
   - 전체 기능 + 우선 지원

**완료 기준**:
- [ ] 3개 플랜 features/limits 정의
- [ ] 가격 책정 근거 문서화
- [ ] subscription_plans 테이블에 데이터 입력
- [ ] is_popular 플래그 (Pro)

**테스트**:
- [ ] 플랜 데이터 검증 쿼리

**관련 파일**:
- `supabase/seed/navigator-service-data.sql` (업데이트)
- `docs/services/navigator-pricing-rationale.md`

---

### [TASK-032] Navigator 기능 및 제한 정의 (1.5시간)

**설명**: Navigator 플랜별 기능 및 제한 상세 정의
**우선순위**: 중간
**의존성**: TASK-031
**담당**: Developer

**작업 내용**:
1. 공통 기능 정의 (모든 플랜)
   - 로드맵 관리
   - 칸반 보드
   - 실시간 협업
2. 플랜별 제한 정의
   - Starter: 스토리지 1GB, 통합 2개
   - Pro: 스토리지 10GB, 통합 10개
   - Enterprise: 무제한
3. features, limits JSON 데이터 작성

**완료 기준**:
- [ ] 기능 및 제한 매트릭스 작성
- [ ] JSON 데이터 작성
- [ ] subscription_plans 테이블 업데이트

**테스트**:
- [ ] features/limits 데이터 검증

**관련 파일**:
- `supabase/seed/navigator-service-data.sql` (업데이트)

---

### [TASK-033] Navigator FAQ 7개 작성 (1시간)

**설명**: Navigator 서비스 자주 묻는 질문 7개 작성
**우선순위**: 중간
**의존성**: TASK-032
**담당**: Developer

**작업 내용**:
1. FAQ 1: Navigator는 무엇인가요?
2. FAQ 2: 어떤 플랜을 선택해야 하나요?
3. FAQ 3: 플랜 변경이 가능한가요?
4. FAQ 4: 환불 정책은 어떻게 되나요?
5. FAQ 5: 데이터는 안전한가요?
6. FAQ 6: 팀원 초대는 어떻게 하나요?
7. FAQ 7: 무료 체험이 있나요?

**완료 기준**:
- [ ] 7개 FAQ 작성 완료
- [ ] faq JSON 데이터 작성
- [ ] services 테이블 업데이트
- [ ] 답변 길이 100-200자

**테스트**:
- [ ] faq 데이터 검증

**관련 파일**:
- `supabase/seed/navigator-service-data.sql` (업데이트)

---

### [TASK-034] useNavigatorService 훅 (1.5시간)

**설명**: Navigator 서비스 상세 조회 React Query 훅
**우선순위**: 높음
**의존성**: TASK-033
**담당**: Developer

**작업 내용**:
1. src/hooks/useNavigatorService.ts 파일 생성
2. useQuery 설정 (queryKey: ['services', 'navigator'])
3. Supabase 쿼리 (SELECT * FROM services WHERE slug = 'navigator')
4. subscription_plans 조인 쿼리
5. 에러 처리 (404 처리)
6. 타입 정의

**완료 기준**:
- [ ] useNavigatorService 훅 작성 완료
- [ ] Supabase 조인 쿼리 동작
- [ ] 404 에러 처리
- [ ] TypeScript 타입 정의
- [ ] 캐싱 전략 (staleTime: 10분)

**테스트**:
- [ ] Navigator 서비스 조회 성공
- [ ] 플랜 데이터 포함 확인
- [ ] 404 에러 처리 확인

**관련 파일**:
- `src/hooks/useNavigatorService.ts`

---

### [TASK-035] NavigatorService E2E 테스트 (2시간)

**설명**: Navigator 서비스 상세 페이지 E2E 테스트 6개
**우선순위**: 중간
**의존성**: TASK-034
**담당**: Developer

**작업 내용**:
1. tests/e2e/services/navigator-service.spec.ts 파일 생성
2. 테스트 1: 페이지 렌더링 (제목, 설명)
3. 테스트 2: 3개 플랜 표시
4. 테스트 3: 월간/연간 가격 토글
5. 테스트 4: FAQ 7개 표시
6. 테스트 5: CTA 버튼 클릭 (구독하기)
7. 테스트 6: Lighthouse 점수 90+

**완료 기준**:
- [ ] 6개 테스트 작성 완료
- [ ] 모든 테스트 통과
- [ ] Lighthouse CI 통합
- [ ] 테스트 실행 시간 < 15초

**테스트**:
- [ ] npm run test:e2e -- navigator-service.spec.ts

**관련 파일**:
- `tests/e2e/services/navigator-service.spec.ts`

---

## Day 10: 가격 페이지 (5개 태스크)

### [TASK-036] PricingPage 레이아웃 (2.5시간)

**설명**: 전체 서비스 가격 비교 페이지
**우선순위**: 높음
**의존성**: TASK-035
**담당**: Developer

**작업 내용**:
1. src/pages/Pricing.tsx 파일 생성
2. 페이지 히어로 섹션 (타이틀, 설명)
3. 탭 UI (개발 서비스 / 플랫폼 서비스)
4. 가격 비교 테이블
5. 반응형 레이아웃 (모바일 카드, 데스크톱 테이블)

**완료 기준**:
- [ ] Pricing.tsx 작성 완료
- [ ] 탭 UI 동작
- [ ] 비교 테이블 레이아웃
- [ ] 반응형 디자인
- [ ] 다크 모드 지원

**테스트**:
- [ ] 페이지 렌더링 확인
- [ ] 탭 전환 동작 확인

**관련 파일**:
- `src/pages/Pricing.tsx`

---

### [TASK-037] PricingCard 컴포넌트 (2시간)

**설명**: 가격 카드 컴포넌트 (모바일용)
**우선순위**: 중간
**의존성**: TASK-036
**담당**: Developer

**작업 내용**:
1. PricingCard.tsx 컴포넌트 생성
2. Props 인터페이스 (service, package/plan, features)
3. 카드 레이아웃 (제목, 가격, 기능 목록, CTA)
4. Popular 배지
5. Hover 애니메이션

**완료 기준**:
- [ ] 컴포넌트 작성 완료
- [ ] 카드 디자인 완성
- [ ] Popular 배지 스타일
- [ ] Hover 애니메이션
- [ ] 다크 모드 지원

**테스트**:
- [ ] 패키지 카드 렌더링
- [ ] 플랜 카드 렌더링

**관련 파일**:
- `src/components/pricing/PricingCard.tsx`

---

### [TASK-038] PricingComparison 컴포넌트 (3시간)

**설명**: 8개 서비스 가격 비교 테이블 컴포넌트
**우선순위**: 높음
**의존성**: TASK-037
**담당**: Developer

**작업 내용**:
1. PricingComparison.tsx 컴포넌트 생성
2. Props 인터페이스 (services, category)
3. 테이블 레이아웃 (서비스명, 가격 범위, 주요 기능, CTA)
4. 정렬 기능 (가격순, 이름순)
5. 체크마크/X 아이콘 (기능 포함 여부)
6. 반응형 테이블 (가로 스크롤)

**완료 기준**:
- [ ] 컴포넌트 작성 완료
- [ ] 테이블 레이아웃 완성
- [ ] 정렬 기능 동작
- [ ] 반응형 디자인
- [ ] 다크 모드 지원

**테스트**:
- [ ] 8개 서비스 렌더링
- [ ] 정렬 기능 테스트

**관련 파일**:
- `src/components/pricing/PricingComparison.tsx`

---

### [TASK-039] PaymentInfo 컴포넌트 (1.5시간)

**설명**: 결제 정보 안내 컴포넌트 (착수금 30%, 중간금 40%, 잔금 30%)
**우선순위**: 중간
**의존성**: TASK-038
**담당**: Developer

**작업 내용**:
1. PaymentInfo.tsx 컴포넌트 생성
2. 3단계 결제 안내 (착수금, 중간금, 잔금)
3. 결제 방법 안내 (토스페이먼츠, 계좌이체)
4. 환불 정책 링크
5. 인포 박스 디자인

**완료 기준**:
- [ ] 컴포넌트 작성 완료
- [ ] 3단계 결제 안내 표시
- [ ] 결제 방법 안내
- [ ] 환불 정책 링크
- [ ] 다크 모드 지원

**테스트**:
- [ ] 결제 정보 렌더링 확인

**관련 파일**:
- `src/components/pricing/PaymentInfo.tsx`

---

### [TASK-040] PricingPage E2E 테스트 (1.5시간)

**설명**: 가격 페이지 E2E 테스트 3개
**우선순위**: 중간
**의존성**: TASK-039
**담당**: Developer

**작업 내용**:
1. tests/e2e/pricing/pricing-page.spec.ts 파일 생성
2. 테스트 1: 페이지 렌더링 (8개 서비스)
3. 테스트 2: 탭 전환 (개발/플랫폼)
4. 테스트 3: Lighthouse 점수 90+

**완료 기준**:
- [ ] 3개 테스트 작성 완료
- [ ] 모든 테스트 통과
- [ ] Lighthouse CI 통합
- [ ] 테스트 실행 시간 < 10초

**테스트**:
- [ ] npm run test:e2e -- pricing-page.spec.ts

**관련 파일**:
- `tests/e2e/pricing/pricing-page.spec.ts`

---

## Sprint 1 Summary

**총 태스크**: 40개
**총 예상 시간**: 63.5시간
**E2E 테스트**: 18개
**완료 기준**: Phase 1 (토스페이먼츠 심사 준비) 완료

**주요 산출물**:
- Database: 3개 마이그레이션 파일
- 공통 컴포넌트: 10개
- 페이지: 4개 (Services, MVPService, NavigatorService, Pricing)
- React 훅: 3개
- E2E 테스트: 4개 파일 (18개 테스트)
- 문서: 3개 (마이그레이션 가이드, 가격 책정 근거)

**다음 단계**: Sprint 2 (법적 문서 & SEO)
