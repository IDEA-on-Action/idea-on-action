# VIBE WORKING 프로젝트 로드맵

> 2025-2026 장기 개발 계획 및 마일스톤

**작성일**: 2025-10-20
**버전**: 1.6.1
**관리자**: 서민원 (sinclairseo@gmail.com)

---

## 📊 전체 진행 현황

```
Phase 1-8    ████████████████████ 100% ✅ (완료 - 2025-10-17)
인증/관리자   ████████████████████ 100% ✅ (완료 - 2025-10-17)
테스트 인프라  ████████████████████ 100% ✅ (완료 - 2025-10-20)
Phase 9      ████████████████████ 100% ✅ (완료 - 2025-10-20)
Phase 10     ████████████████████ 100% ✅ (완료 - 2025-10-20)
Phase 11     ████████████████████ 100% ✅ (완료 - 2025-10-20)
Phase 12     ░░░░░░░░░░░░░░░░░░░░   0% 📋 (계획 중)
```

**총 진행률**: 92% (Phase 11/12 완료)
**최신 버전**: v1.6.1
**총 테스트**: 267+ 테스트 케이스 (E2E 157, Unit 82, Visual 28)

---

## 🎯 Phase별 상세 계획

### ✅ Phase 1-7: 완료된 단계 (2025 Q3-Q4)

#### Phase 1: 프로덕션 배포 (완료 - 2025-10-09)
- ✅ Vercel 배포 완료
- ✅ 프로덕션 URL: https://www.ideaonaction.ai/
- ✅ 환경 변수 설정 및 검증
- ✅ CI/CD 파이프라인 구축

#### Phase 2: Vite 프로젝트 구조 (완료 - 2025-10-09)
- ✅ React 18 + TypeScript 설정
- ✅ 컴포넌트 아키텍처 수립
- ✅ React Router 라우팅 시스템
- ✅ 프로덕션 빌드 최적화

#### Phase 3: DevOps 인프라 (완료 - 2025-10-09)
- ✅ GitHub Actions 워크플로우 (7개)
- ✅ Vercel 자동 배포
- ✅ 브랜치 전략 (main/staging/develop)
- ✅ 환경 변수 관리 체계

#### Phase 4: 인증 시스템 (완료 - 2025-10-09)
- ✅ OAuth 통합 (Google, GitHub, Kakao)
- ✅ Supabase Auth 연동
- ✅ 세션 관리 및 보안

#### Phase 5: 프로젝트 정리 (완료 - 2025-10-11)
- ✅ 중복 파일 제거
- ✅ ESLint/TypeScript 에러 수정
- ✅ .gitignore 최적화
- ✅ 빌드 검증 완료

#### Phase 6: 기본 UI 컴포넌트 (완료 - 2025-10-11)
- ✅ Header, Hero, Services, Features
- ✅ About, Contact, Footer
- ✅ shadcn/ui 통합 (18개 컴포넌트)
- ✅ 네비게이션 메뉴 시스템

#### Phase 7: 디자인 시스템 적용 (완료 - 2025-10-12) 🎉
- ✅ 디자인 시스템 문서 작성
- ✅ Tailwind CSS 확장 (브랜드 색상, 폰트, 그리드)
- ✅ CSS 변수 시스템 (Light/Dark 테마)
- ✅ 다크 모드 구현 (useTheme + ThemeToggle)
- ✅ 글래스모피즘 & 그라데이션 UI
- ✅ Google Fonts 적용 (Inter, JetBrains Mono)
- ✅ shadcn/ui 다크 모드 대응

**완료일**: 2025-10-12
**빌드 크기**: 130.11 kB (gzip)

---

### ✅ Phase 8: 서비스 페이지 구현 (완료 - 2025-10-17) 🎉

**우선순위**: ⭐ 최고
**실제 기간**: 1일
**시작일**: 2025-10-17
**완료일**: 2025-10-17
**목표**: 포트폴리오/서비스 소개 페이지 완성

#### 완료된 작업 항목

**1. 데이터 레이어 구축** ✅
- [x] Supabase 스키마 분석 및 개선 (14→11 테이블)
- [x] 데이터베이스 마이그레이션 실행
- [x] TypeScript 타입 정의 (`src/types/database.ts`)
  ```typescript
  interface Service {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    images: string[];
    metrics: ServiceMetrics;
  }
  ```
- [x] React Query 훅 작성 (`src/hooks/useServices.ts`)
  - `useServices(filters?)` - 서비스 목록 조회 ✅
  - `useServiceDetail(id)` - 서비스 상세 조회 ✅
  - `useServiceCategories()` - 카테고리 조회 ✅
  - `useServiceCounts()` - 카테고리별 서비스 개수 ✅
- [x] RLS 정책 10개 설정 ✅
- [x] 샘플 서비스 3개 삽입 ✅

**2. 서비스 목록 페이지 (`/services`)** ✅
- [x] React Router 라우트 추가
- [x] 페이지 컴포넌트 생성 (`src/pages/Services.tsx`)
- [x] 그리드 레이아웃 (CSS Grid, 반응형)
  - Mobile: 1열 ✅
  - Tablet: 2열 ✅
  - Desktop: 3열 ✅
- [x] 카테고리 필터링 UI (Tabs)
- [x] 정렬 기능 (최신순, 인기순, 가격순)
- [x] 로딩 스켈레톤 UI (shadcn/ui Skeleton)
- [x] 에러 상태 처리 (Alert)
- [x] 빈 상태 처리

**3. 서비스 상세 페이지 (`/services/:id`)** ✅
- [x] 동적 라우팅 설정 (`/services/:id`)
- [x] 페이지 컴포넌트 생성 (`src/pages/ServiceDetail.tsx`)
- [x] 상세 정보 섹션 (제목, 설명, 가격, 카테고리)
- [x] 이미지 갤러리 컴포넌트 (Carousel)
- [x] 메트릭 시각화 (사용자 수, 만족도, ROI)
- [x] CTA 버튼
  - "문의하기" → Contact 페이지 ✅
  - "구매하기" → 준비 (Phase 9)
- [x] SEO 최적화 (react-helmet-async)

**4. 관리자 기능 (선택 사항)** → Phase 10으로 이동
- [ ] 서비스 CRUD 대시보드 (`/admin/services`)
- [ ] 이미지 업로드 (Supabase Storage)
- [ ] 갤러리 관리

#### 사용된 기술 스택

**라우팅**
- React Router v6 ✅
- 동적 라우팅 (`useParams`) ✅

**데이터 페칭**
- React Query v5 (서버 상태 관리) ✅
- Supabase Client (PostgreSQL) ✅

**UI 컴포넌트**
- Card, Badge, Tabs, Select ✅
- Skeleton (로딩 상태) ✅
- Alert (에러 상태) ✅
- Carousel (이미지 갤러리) ✅

**SEO**
- react-helmet-async ✅

**반응형 디자인**
- Tailwind CSS Breakpoints ✅
  - md: 768px (Tablet)
  - lg: 1024px (Desktop)

#### 완료 기준 (DoD) - 모두 달성 ✅
- [x] `/services` 접근 가능 (404 없음)
- [x] 최소 3개 샘플 서비스 표시
- [x] 다크 모드 완벽 지원
- [x] 모바일/태블릿/데스크탑 반응형
- [x] 빌드 에러 0개

#### 성과
- ✅ 1일 만에 완료 (예상: 1-2주)
- ✅ 빌드 크기: 201.20 kB (gzip)
- ✅ 샘플 데이터로 즉시 테스트 가능
- ✅ 완전한 타입 안정성 (TypeScript)

**완료 문서**: [docs/guides/phase-8-completion-summary.md](../guides/phase-8-completion-summary.md)

---

### ✅ Phase 8.5: 테스트 인프라 구축 (완료 - 2025-10-20) 🧪

**우선순위**: ⭐ 최고
**실제 기간**: 9일
**시작일**: 2025-10-11
**완료일**: 2025-10-20 (100% 완료)
**목표**: 자동화된 테스트 시스템 구축 및 CI/CD 통합

#### 완료된 작업 항목

**1. 테스트 도구 설정** ✅
- [x] Playwright E2E 테스트 환경 (5 브라우저)
- [x] Vitest 유닛 테스트 환경 (@vitejs/plugin-react-swc, jsdom)
- [x] Lighthouse CI (성능 테스트 자동화)
- [x] Axe-core 접근성 테스트 통합
- [x] jest-axe matchers 설정

**2. E2E 테스트 작성** ✅
- **Phase 1-8 기존 테스트 (60개)**
  - [x] homepage.spec.ts (12개)
  - [x] login.spec.ts (7개)
  - [x] services.spec.ts (11개)
  - [x] admin/dashboard.spec.ts (7개)
  - [x] admin/service-crud.spec.ts (15개)
  - [x] admin/image-upload.spec.ts (12개)
- **Phase 9-11 신규 테스트 (97개)** 🎉
  - [x] cart.spec.ts (7개) - 장바구니
  - [x] checkout.spec.ts (10개) - 결제 프로세스
  - [x] blog.spec.ts (19개) - 블로그 시스템
  - [x] notices.spec.ts (17개) - 공지사항
  - [x] profile.spec.ts (19개) - 프로필 & 2FA
  - [x] rbac.spec.ts (25개) - RBAC & 감사 로그
- **총 157개 E2E 테스트**

**3. 시각적 회귀 테스트** ✅
- [x] dark-mode.spec.ts (8개)
- [x] responsive.spec.ts (20개)
- **총 28개 시각적 테스트**

**4. 유닛 테스트** ✅
- **Phase 1-8 기존 테스트 (34개)**
  - [x] useAuth.test.ts (8개)
  - [x] useServices.test.tsx (7개)
  - [x] useIsAdmin.test.tsx (5개)
  - [x] ServiceForm.test.tsx (8개)
  - [x] ServiceCard.test.tsx (9개)
- **Phase 9-11 신규 테스트 (48개)** 🎉
  - [x] useBlogPosts.test.tsx (12개)
  - [x] useNotices.test.tsx (12개)
  - [x] useRBAC.test.tsx (12개)
  - [x] useAuditLogs.test.tsx (12개)
- **총 82개 유닛 테스트 (100% 통과)**

**5. CI/CD 통합** ✅
- [x] .github/workflows/test-e2e.yml (Playwright 자동화)
- [x] .github/workflows/test-unit.yml (Vitest + 커버리지)
- [x] .github/workflows/lighthouse.yml (성능 테스트)
- [x] Branch protection rules 가이드
- [x] CI/CD 통합 문서

**6. 테스트 인프라** ✅
- [x] 인증 헬퍼 함수 (loginAsAdmin, loginAsRegularUser)
- [x] 테스트 픽스처 (users, services, images)
- [x] Playwright 설정 (포트 8080-8083, webServer)
- [x] 테스트 가이드 문서 5개

**7. 접근성 개선** ✅
- [x] Footer ARIA role 수정 (role="list" → nav)
- [x] ServiceForm aria-label 추가
- [x] jest-axe integration

#### 성과
- ✅ 전체 테스트 커버리지: **267+ 테스트 작성** (122 → 267)
- ✅ E2E 테스트: **157개** (60 → 157, +97개)
- ✅ 유닛 테스트: **82개, 100% 통과** (34 → 82, +48개)
- ✅ 시각적 테스트: **28개**
- ✅ CI/CD 파이프라인: 3개 워크플로우 자동화
- ✅ Lint & Type Check: **100% 통과**
- ✅ Build: **100% 통과**
- ✅ 테스트 문서: **7개** (testing-strategy, phase9-11-tests 포함)

#### 백로그 (낮은 우선순위)
- [ ] 15개 실패 테스트 수정
  - Header mobile menu tests (4개)
  - Icon rendering tests (3개)
  - Loading state tests (3개)
  - Features/Services 섹션 제목 (2개)
  - ServiceForm submit test (1개)
  - Footer list/icon tests (2개)
- [ ] Lighthouse 접근성 100%
  - button-name (Services 페이지)
  - color-contrast (Login 페이지)

#### 기술 스택
- **Playwright** 1.48+ (E2E)
- **Vitest** 3.2+ (Unit)
- **Lighthouse CI** 0.15+ (Performance)
- **jest-axe** 10.0+ (Accessibility)
- **@testing-library/react** 16.1+ (Component)

#### 완료 문서
- [테스트 가이드](../guides/testing/)
- [CI/CD 통합](../guides/testing/ci-cd-integration.md)
- [Lighthouse CI](../guides/testing/lighthouse-ci.md)
- [브랜치 보호](../devops/branch-protection-guide.md)

---

### 🚀 Phase 9: 전자상거래 기능 (진행 중 - 2025 Q4-Q1)

**우선순위**: 높음
**예상 기간**: 2-3주
**전제 조건**: Phase 8 완료

#### 작업 항목

**1. 장바구니 시스템**
- [ ] 장바구니 UI
  - 헤더 아이콘 + Badge (항목 수)
  - 사이드바 Drawer (Sheet 컴포넌트)
- [ ] 로컬 스토리지 + Supabase 동기화
  - 비로그인: localStorage
  - 로그인: Supabase `carts` 테이블
- [ ] 수량 조절 로직 (증가/감소/삭제)
- [ ] 총액 계산 (세금 10%, 할인 코드 지원)

**2. 주문 관리**
- [ ] 주문 폼 (React Hook Form + Zod)
  - 배송지 (주소 API 연동)
  - 연락처 (전화번호 형식 검증)
  - 배송 메모
- [ ] 주문 내역 페이지 (`/orders`)
  - 주문 목록 테이블
  - 상세 보기 (Dialog)
- [ ] 주문 상태 추적
  - 진행중 → 완료 → 배송중 → 배송완료
  - 취소/환불 처리

**3. 결제 게이트웨이**
- [ ] 카카오페이 SDK 연동
  - 결제 준비 API
  - 결제 승인 API
  - 웹훅 처리 (`/api/payments/kakao/webhook`)
- [ ] 토스페이먼츠 연동
  - 결제 위젯 통합
  - 가상계좌, 카드, 간편결제 지원
- [ ] 결제 실패/취소 처리
  - 에러 로깅 (Sentry)
  - 사용자 알림 (Toast)

**4. 관리자 대시보드**
- [ ] 주문 관리 페이지 (`/admin/orders`)
  - 주문 목록 (DataTable)
  - 주문 상태 변경
  - 환불 처리
- [ ] 매출 통계 대시보드
  - 일별/월별 매출 차트 (Recharts)
  - 베스트셀러 분석
- [ ] 사용자 관리
  - 사용자 목록
  - 권한 관리 (RBAC)

#### 기술 스택

**결제**
- 카카오페이 REST API
- 토스페이먼츠 JavaScript SDK
- 웹훅 검증 (Signature)

**상태 관리**
- Zustand or Jotai (전역 장바구니 상태)
- React Query (서버 상태)

**폼 검증**
- React Hook Form
- Zod (스키마 검증)

**차트**
- Recharts (매출 통계)

#### 완료 기준
- [ ] 장바구니 추가/삭제/수정 가능
- [ ] 카카오페이 결제 성공
- [ ] 토스페이먼츠 결제 성공
- [ ] 주문 내역 조회 가능
- [ ] 관리자 대시보드 접근 가능 (RBAC)

#### 예상 리스크 및 대응 방안

**리스크 1: 결제 테스트 환경 부족**
- **대응**: 카카오페이/토스 Sandbox 환경 구축

**리스크 2: 웹훅 보안 취약점**
- **대응**: HMAC Signature 검증, IP 화이트리스트

**리스크 3: 재고 관리 복잡도**
- **대응**: Phase 9에서는 재고 미지원, Phase 11에서 추가

---

### 📋 Phase 10: SSO & 인증 강화 (2025 Q1)

**우선순위**: 중간
**예상 기간**: 1주

#### 작업 항목
- [ ] SSO 통합 UI 개선
  - 소셜 로그인 버튼 디자인
  - 로그인 플로우 최적화
- [ ] 프로필 관리 페이지 (`/profile`)
  - 프로필 이미지 업로드
  - 개인정보 수정
  - 비밀번호 변경
- [ ] RBAC (역할 기반 접근 제어)
  - 역할: Admin, User, Guest
  - 권한: Create, Read, Update, Delete
- [ ] 이메일 인증 플로우
  - 회원가입 시 이메일 인증
  - 비밀번호 재설정 이메일

#### 기술 스택
- Supabase Auth (OAuth + Email)
- React Context (AuthContext)
- Middleware (권한 검사)

#### 완료 기준
- [ ] 소셜 로그인 3종 지원 (Google, GitHub, Kakao)
- [ ] 프로필 페이지 CRUD 가능
- [ ] 관리자 페이지 접근 제어 (Admin만)

---

### 📋 Phase 11: 콘텐츠 관리 (2025 Q2)

**우선순위**: 중간
**예상 기간**: 2주

#### 작업 항목
- [ ] 블로그 시스템 (`/blog`)
  - 블로그 목록 페이지
  - 블로그 상세 페이지 (마크다운 렌더링)
  - 태그/카테고리 필터링
- [ ] 마크다운 에디터 (관리자용)
  - react-markdown-editor-lite
  - 이미지 업로드 (Drag & Drop)
  - 미리보기
- [ ] SEO 최적화
  - 메타 태그 (react-helmet-async)
  - sitemap.xml 자동 생성
  - robots.txt
- [ ] RSS 피드
  - /rss.xml 생성
  - 자동 업데이트

#### 기술 스택
- react-markdown (렌더링)
- react-markdown-editor-lite (에디터)
- react-helmet-async (메타 태그)
- sitemap 라이브러리

#### 완료 기준
- [ ] 블로그 게시/수정/삭제 가능
- [ ] SEO 점수 90+ (Lighthouse)
- [ ] RSS 피드 생성 확인

---

### ✅ Phase 9: 전자상거래 시스템 (완료 - 2025-10-20) 💳

**우선순위**: ⭐ 최고
**실제 기간**: 3일
**시작일**: 2025-10-18
**완료일**: 2025-10-20
**목표**: 장바구니, 주문, 결제 기능 구현

#### 완료된 작업 항목

**Week 1: 장바구니 시스템** ✅
- [x] Zustand 상태 관리 (`src/stores/cartStore.ts`)
- [x] useCart 훅 (5개 함수)
- [x] Cart UI 컴포넌트 (CartButton, CartDrawer, CartItem, CartSummary)
- [x] Header 통합 (장바구니 버튼 + 배지)
- [x] 데이터베이스: carts, cart_items 테이블

**Week 2: 주문 관리** ✅
- [x] useOrders 훅 (6개 함수)
- [x] Checkout, Orders, OrderDetail 페이지
- [x] 7단계 주문 상태 시스템
- [x] 데이터베이스: orders, order_items 테이블

**Week 3: 결제 게이트웨이** ✅
- [x] Kakao Pay REST API 통합
- [x] Toss Payments SDK 통합
- [x] usePayment 훅 (3개 함수)
- [x] Payment, PaymentSuccess, PaymentFail 페이지
- [x] 관리자 주문 관리 페이지
- [x] 데이터베이스: payments 테이블

#### 성과
- ✅ 전자상거래 핵심 기능 완료
- ✅ 2개 결제 게이트웨이 통합
- ✅ Recharts 대시보드 통계
- ✅ RLS 정책 15개 설정

---

### ✅ Phase 10: 인증 강화 & RBAC (완료 - 2025-10-20) 🔐

**우선순위**: ⭐ 최고
**실제 기간**: 2일
**시작일**: 2025-10-19
**완료일**: 2025-10-20
**목표**: OAuth 확장, 2FA, RBAC 시스템 구현

#### 완료된 작업 항목

**Week 1: OAuth 확장 & 프로필** ✅
- [x] Microsoft (Azure AD) OAuth
- [x] Apple OAuth
- [x] useProfile 훅 (5개 함수)
- [x] Profile 페이지 (연결된 계정 관리)
- [x] 데이터베이스: user_profiles, connected_accounts 테이블

**Week 2: 2FA & 보안** ✅
- [x] TOTP 라이브러리 (otpauth, qrcode)
- [x] use2FA 훅 (7개 함수)
- [x] TwoFactorSetup, TwoFactorVerify 페이지
- [x] 백업 코드 시스템
- [x] 브루트 포스 방지 (5회 실패 → 30분 잠금)
- [x] 데이터베이스: two_factor_auth, login_attempts, account_locks 테이블

**Week 3: RBAC & 감사 로그** ✅
- [x] 역할 기반 접근 제어 (4개 역할, 25개 권한)
- [x] useRBAC 훅 (7개 함수)
- [x] useAuditLogs 훅 (2개 함수)
- [x] AdminRoles, AuditLogs 페이지
- [x] 데이터베이스: roles, permissions, user_roles, audit_logs 테이블

#### 성과
- ✅ 5개 OAuth 제공자 (Google, GitHub, Kakao, Microsoft, Apple)
- ✅ 2FA 보안 강화
- ✅ RBAC 권한 시스템
- ✅ 감사 로그 추적

---

### ✅ Phase 11: 콘텐츠 관리 시스템 (완료 - 2025-10-20) 📝

**우선순위**: ⭐ 높음
**실제 기간**: 1일
**시작일**: 2025-10-20
**완료일**: 2025-10-20
**목표**: 블로그, 공지사항, SEO 최적화

#### 완료된 작업 항목

**Week 1: 블로그 시스템** ✅
- [x] Markdown 에디터 (react-markdown, remark-gfm)
- [x] useBlogPosts 훅 (9개 함수)
- [x] Blog, BlogPost, AdminBlog 페이지
- [x] 카테고리, 태그 시스템
- [x] 조회수, 좋아요 기능
- [x] 컴포넌트: BlogCard, BlogPostForm, MarkdownRenderer
- [x] 데이터베이스: blog_posts, blog_categories 테이블

**Week 2: 공지사항 & SEO** ✅
- [x] useNotices 훅 (6개 함수)
- [x] Notices, AdminNotices 페이지
- [x] 중요도 시스템 (low, medium, high, urgent)
- [x] 컴포넌트: NoticeCard, NoticeForm
- [x] SEO 스크립트: generate-sitemap.ts, generate-rss.ts
- [x] robots.txt 설정
- [x] 데이터베이스: notices 테이블

#### 성과
- ✅ Markdown 기반 블로그 시스템
- ✅ SEO 최적화 (sitemap, robots.txt, RSS)
- ✅ 공지사항 관리 시스템
- ✅ NPM 스크립트 2개 추가

---

### 📋 Phase 12: 고도화 & 확장 (2025 Q2-Q3)

**우선순위**: 중간

#### 작업 항목
- [ ] 다국어 지원 (i18n)
  - 한국어, 영어 지원
  - react-i18next
  - 언어 전환 UI
- [ ] AI 챗봇 통합
  - OpenAI API 연동
  - 채팅 UI (shadcn/ui Dialog)
  - 고객 지원 자동화
- [ ] 성능 모니터링
  - Sentry (에러 추적)
  - LogRocket (세션 리플레이)
  - Google Analytics 4
- [ ] A/B 테스팅
  - Optimizely or Google Optimize
  - 실험 설정 UI
- [ ] PWA 지원
  - Service Worker
  - 오프라인 모드
  - 푸시 알림
  - 앱 아이콘 (192x192, 512x512)

#### 기술 스택
- react-i18next (다국어)
- OpenAI API (챗봇)
- Sentry (모니터링)
- Workbox (PWA)

#### 완료 기준
- [ ] 한/영 언어 전환 가능
- [ ] AI 챗봇 응답 성공
- [ ] PWA 설치 가능 (모바일)

---

## 📈 성공 지표 (KPI)

### Phase 8 목표
- 서비스 페이지 방문자 수: 1,000명/월
- 서비스 상세 페이지 전환율: 20%
- 페이지 로딩 속도: < 2초

### Phase 9 목표
- 장바구니 추가율: 30%
- 결제 완료율: 70%
- 주문 건수: 100건/월

### Phase 10-12 목표
- 블로그 트래픽: 5,000명/월
- SEO 순위: 주요 키워드 Top 10
- PWA 설치 수: 500명

---

## 🔄 업데이트 주기

- **주간**: project-todo.md 진행률 업데이트
- **2주**: Phase별 진행률 검토
- **월간**: KPI 분석 및 로드맵 조정
- **분기**: 다음 Phase 상세 계획 수립

---

## 📝 변경 이력

### 2025-10-20
- Phase 9-11 완료 기록 (전자상거래, 인증 강화, CMS)
- 테스트 인프라 통계 업데이트 (267+ 테스트)
- 전체 진행률 업데이트 (92%, Phase 11/12 완료)
- 버전 v1.6.1 반영

### 2025-10-17
- Phase 8-12 상세 로드맵 작성
- 기술 스택 및 리스크 분석 추가
- KPI 정의

### 2025-10-12
- Phase 7 완료 기록

---

**관련 문서**:
- [CLAUDE.md](../../CLAUDE.md) - 프로젝트 메인 문서
- [project-todo.md](../../project-todo.md) - TODO 목록
- [changelog.md](./changelog.md) - 변경 로그
