# Version 2.0 기술 스택 (Tech Stack)

> 기술 선택 이유 및 버전 명세

**작성일**: 2025-11-13
**버전**: 2.0.0
**상태**: 📋 Draft

---

## 🎯 기술 스택 개요

```
Frontend (Client)
├── React 18.3.1 (UI 프레임워크)
├── TypeScript 5.6.2 (타입 안전성)
├── Vite 5.4.19 (빌드 도구)
└── Tailwind CSS 3.4.16 (스타일링)

Backend (Supabase)
├── PostgreSQL 15+ (데이터베이스)
├── Supabase Auth (인증)
├── Supabase Storage (파일 저장)
└── Supabase Edge Functions (서버리스)

Deployment & Hosting
├── Vercel (호스팅 & CD)
├── GitHub Actions (CI)
└── Sentry (에러 추적)

External Services
├── Giscus (댓글)
├── Resend (이메일)
└── Google Analytics 4 (분석)
```

---

## 🛠️ Core Stack (변경 불가)

### React 18.3.1
**선택 이유**:
- **Concurrent Features**: Automatic Batching, Transitions, Suspense
- **성능**: Virtual DOM 최적화, 효율적인 렌더링
- **생태계**: 풍부한 라이브러리, 커뮤니티 지원
- **팀 역량**: 기존 Phase 1-14에서 사용한 경험

**주요 기능**:
- Concurrent Mode (useTransition, useDeferredValue)
- Automatic Batching (성능 향상)
- Server Components (추후 확장 가능)

---

### TypeScript 5.6.2
**선택 이유**:
- **타입 안전성**: 컴파일 타임 에러 검출
- **코드 품질**: 리팩토링 용이, IDE 지원 강화
- **팀 협업**: 명시적 타입으로 의도 전달
- **Strict Mode**: 높은 코드 품질 유지

**설정 (tsconfig.json)**:
```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

### Vite 5.4.19
**선택 이유**:
- **빠른 개발 서버**: ES Module 기반, HMR 즉시 반영
- **빌드 속도**: Rollup 기반, 효율적인 번들링
- **TypeScript 네이티브 지원**: esbuild 기반
- **플러그인 생태계**: PWA, i18n, Sentry 등

**주요 설정**:
- Code Splitting (manualChunks)
- Tree Shaking (자동)
- Asset Optimization (이미지, 폰트)

---

### Tailwind CSS 3.4.16
**선택 이유**:
- **Utility-First**: 빠른 프로토타이핑, 일관된 디자인
- **다크 모드**: 기본 지원 (class 전략)
- **반응형**: 모바일 퍼스트, breakpoints
- **성능**: PurgeCSS로 미사용 클래스 제거

**커스터마이징**:
- 브랜드 색상 (Primary, Accent, Secondary)
- 폰트 (Inter, JetBrains Mono)
- 8px 그리드 시스템

---

## 🔧 UI & Design

### shadcn/ui
**선택 이유**:
- **Copy-Paste 방식**: 의존성 없이 소스 코드 직접 제어
- **Radix UI 기반**: 접근성, 키보드 네비게이션
- **Tailwind CSS 통합**: 일관된 스타일링
- **커스터마이징**: 자유로운 수정 가능

**사용 컴포넌트** (18개):
- Button, Card, Dialog, Dropdown, Tabs
- Form, Input, Textarea, Select, Checkbox
- Alert, Badge, Toast, Avatar, Separator

---

### Lucide Icons
**선택 이유**:
- **React 컴포넌트**: Tree Shaking 지원
- **일관된 디자인**: 동일한 디자인 언어
- **크기**: 작고 가벼운 번들

---

### Google Fonts (Inter, JetBrains Mono)
**선택 이유**:
- **Inter**: 가독성 높은 본문 폰트, Variable Font 지원
- **JetBrains Mono**: 코드 블록용, Ligature 지원
- **무료**: 상업적 사용 가능

---

## 🗄️ Backend & Database

### Supabase (PostgreSQL 15+)
**선택 이유**:
- **Backend-as-a-Service**: 빠른 개발, 인프라 관리 불필요
- **PostgreSQL**: 강력한 관계형 DB, JSON 지원
- **RLS (Row Level Security)**: 테이블 수준 권한 제어
- **Realtime**: WebSocket 기반 실시간 구독 (추후 활용)

**주요 기능**:
- Auth: OAuth (Google, GitHub, Kakao), JWT
- Storage: 이미지, 파일 저장 (CDN 자동)
- Edge Functions: Deno 기반 서버리스
- Realtime: 실시간 데이터 구독

---

### Supabase Auth
**선택 이유**:
- **OAuth 통합**: Google, GitHub, Kakao 기본 지원
- **JWT 토큰**: 자동 발급, 갱신
- **RLS 통합**: `auth.uid()`, `auth.jwt()` 함수
- **보안**: PKCE, SameSite 쿠키

---

### Supabase Storage
**선택 이유**:
- **S3 호환**: AWS S3와 유사한 API
- **CDN 자동**: 이미지 최적화, 캐싱
- **Public/Private**: 버킷 단위 권한 설정
- **파일 변환**: 이미지 리사이즈 (추후 활용)

---

### Supabase Edge Functions
**선택 이유**:
- **Deno 런타임**: 빠른 실행, TypeScript 네이티브
- **서버리스**: 자동 스케일링, 비용 효율
- **Cron Jobs**: 주기적 작업 (Weekly Recap)
- **Webhook**: 외부 API 호출 (Slack, Resend)

---

## 📦 State Management

### React Query (TanStack Query 5.x)
**선택 이유**:
- **서버 상태 관리**: 캐싱, 자동 재조회, 낙관적 업데이트
- **성능**: staleTime, cacheTime 설정으로 최적화
- **DevTools**: 디버깅 용이
- **타입 안전**: TypeScript 완벽 지원

**설정**:
```typescript
{
  staleTime: 5 * 60 * 1000, // 5분
  cacheTime: 10 * 60 * 1000, // 10분
  retry: 1,
  refetchOnWindowFocus: false
}
```

---

### Zustand (클라이언트 상태)
**선택 이유**:
- **간단한 API**: Redux보다 간결
- **성능**: Proxy 기반, 리렌더링 최소화
- **DevTools**: Redux DevTools 통합
- **용도**: 장바구니, UI 상태 (다크 모드 등)

---

### React Hook Form 7.x
**선택 이유**:
- **성능**: Uncontrolled Components, 리렌더링 최소화
- **검증**: Zod 통합으로 타입 안전한 검증
- **에러 처리**: 필드별 에러 메시지
- **UX**: 실시간 검증, 커스텀 에러 표시

---

## 🌍 Routing & i18n

### React Router DOM 6.x
**선택 이유**:
- **클라이언트 사이드 라우팅**: SPA 표준
- **코드 스플리팅**: React.lazy 통합
- **Nested Routes**: 레이아웃 재사용
- **Protected Routes**: 인증 라우트 구현

---

### i18next + react-i18next
**선택 이유**:
- **표준**: 가장 널리 사용되는 i18n 프레임워크
- **React 통합**: useTranslation 훅
- **네임스페이스**: 모듈별 번역 파일 분리
- **지연 로딩**: 언어별 번들 분리

**지원 언어**:
- 한국어 (ko): 기본
- 영어 (en): 2차 지원

---

## 📊 Monitoring & Analytics

### Sentry
**선택 이유**:
- **에러 추적**: 프로덕션 에러 자동 수집
- **Replay**: 사용자 세션 재생 (80% 재현율)
- **Release 추적**: 버전별 에러 분류
- **Slack 알림**: Critical 에러 즉시 알림

---

### Google Analytics 4
**선택 이유**:
- **무료**: 무제한 이벤트 추적
- **이벤트 기반**: 페이지뷰, 사용자 행동 추적
- **커스텀 이벤트**: CTA 클릭, 폼 제출 등
- **보고서**: Funnel, Cohort 분석

---

### Vercel Analytics
**선택 이유**:
- **Core Web Vitals**: FCP, TTI, CLS 자동 측정
- **Real User Monitoring (RUM)**: 실제 사용자 데이터
- **무료**: Vercel 호스팅 시 기본 제공

---

## 🚀 Deployment & CI/CD

### Vercel
**선택 이유**:
- **Zero-Config**: Vite 자동 감지, 빌드 설정 불필요
- **Edge Network**: 전 세계 CDN, 빠른 로딩
- **Preview Deployment**: PR마다 자동 배포 URL
- **환경 변수**: Secrets 관리, 브랜치별 설정

---

### GitHub Actions
**선택 이유**:
- **CI/CD**: Lint, Type Check, Test, Build 자동화
- **무료**: Public 저장소 무제한
- **Marketplace**: Playwright, Lighthouse 액션 활용
- **Branch Protection**: main 브랜치 보호

**워크플로우**:
- `test-e2e.yml`: Playwright E2E 테스트
- `test-unit.yml`: Vitest 유닛 테스트
- `lighthouse.yml`: Lighthouse CI

---

## 📧 External Services

### Giscus (GitHub Discussions)
**선택 이유**:
- **무료**: GitHub 계정만 있으면 사용
- **GitHub 통합**: Discussions 기반
- **Markdown 지원**: 코드 블록, 이미지
- **React 컴포넌트**: giscus-component 라이브러리

---

### Resend (Email Service)
**선택 이유**:
- **개발자 친화적**: 간단한 API, TypeScript SDK
- **무료 플랜**: 100 이메일/일
- **도메인 인증**: SPF, DKIM 자동 설정
- **템플릿**: React Email 통합

**용도**:
- Newsletter 구독 확인 이메일
- Weekly Recap 자동 발송
- Work with Us 제출 확인 이메일

---

## 🧪 Testing

### Playwright
**선택 이유**:
- **E2E 테스트**: 실제 브라우저 자동화
- **크로스 브라우저**: Chromium, Firefox, WebKit
- **스크린샷/비디오**: 시각적 회귀 테스트
- **CI 통합**: GitHub Actions 액션 제공

---

### Vitest
**선택 이유**:
- **Vite 네이티브**: Vite 설정 재사용, 빠른 실행
- **Jest 호환**: API 호환, 마이그레이션 용이
- **React Testing Library**: 컴포넌트 테스트
- **Coverage**: c8 기반 커버리지 리포트

---

### Axe-core (접근성 테스트)
**선택 이유**:
- **WCAG 2.1 AA**: 접근성 규칙 자동 검증
- **Playwright 통합**: E2E 테스트에 포함
- **자동화**: CI에서 자동 검증

---

## 📦 Build & Optimization

### Vite manualChunks 전략
```typescript
manualChunks: {
  'vendor-react': ['react', 'react-dom', '@tanstack/react-query'],
  'vendor-supabase': ['@supabase/supabase-js'],
  'vendor-ui': ['@radix-ui/*', 'lucide-react'],
  'vendor-forms': ['react-hook-form', 'zod'],
  'vendor-markdown': ['react-markdown', 'remark-gfm'],
  'vendor-charts': ['recharts', 'd3'],
  'vendor-sentry': ['@sentry/react'],
  'pages-admin': ['src/pages/admin/**'],
  'pages-ecommerce': ['src/pages/Checkout.tsx', 'src/pages/Cart.tsx'],
  'pages-cms': ['src/pages/Blog.tsx', 'src/pages/BlogPost.tsx']
}
```

**이점**:
- 초기 로딩 속도 향상 (62.5% 번들 감소)
- 병렬 다운로드 최적화
- 캐싱 효율 증대

---

### PWA (Progressive Web App)
**선택 이유**:
- **오프라인 지원**: Service Worker 캐싱
- **설치 가능**: 홈 화면 추가
- **푸시 알림**: 추후 확장 가능
- **vite-plugin-pwa**: Vite 플러그인 활용

**Workbox 전략**:
- CacheFirst: 정적 리소스 (JS, CSS, 이미지)
- NetworkFirst: API 요청

---

## 📚 개발 도구

### ESLint + TypeScript ESLint
- **린트 규칙**: Airbnb, React, TypeScript
- **자동 수정**: --fix 옵션
- **CI 통합**: PR 시 자동 검사

### Prettier
- **코드 포맷팅**: 일관된 코드 스타일
- **ESLint 통합**: eslint-config-prettier
- **자동 저장**: VS Code 설정

### Husky + lint-staged
- **Pre-commit Hook**: 커밋 전 린트 검사
- **Stage된 파일만**: 빠른 검사
- **커밋 메시지**: Conventional Commits 강제

---

## 🔄 버전 관리 전략

### 의존성 업데이트
- **Major 업데이트**: 릴리스 노트 확인 후 신중히 적용
- **Minor/Patch**: 월 1회 정기 업데이트
- **보안 패치**: 즉시 적용

### 패키지 매니저
- **npm**: 기본 패키지 매니저
- **package-lock.json**: 정확한 버전 고정
- **npm audit**: 보안 취약점 검사

---

## 📋 주요 의존성 목록

### Production Dependencies
```json
{
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "react-router-dom": "6.29.0",
  "@supabase/supabase-js": "2.49.2",
  "@tanstack/react-query": "5.62.14",
  "zustand": "5.0.2",
  "react-hook-form": "7.54.2",
  "zod": "3.24.1",
  "i18next": "23.16.8",
  "react-i18next": "15.1.3",
  "react-markdown": "9.0.2",
  "remark-gfm": "4.0.0",
  "@sentry/react": "8.45.1",
  "lucide-react": "0.469.0"
}
```

### Dev Dependencies
```json
{
  "vite": "5.4.19",
  "typescript": "5.6.2",
  "@vitejs/plugin-react": "4.3.4",
  "tailwindcss": "3.4.16",
  "eslint": "9.18.0",
  "prettier": "3.4.2",
  "@playwright/test": "1.49.1",
  "vitest": "2.1.8",
  "@testing-library/react": "16.1.0"
}
```

---

**Last Updated**: 2025-11-13
**Version**: 2.0.0
**Status**: 📋 Draft
**Next Review**: Sprint 완료 시
