# 테스트 전략 문서

> VIBE WORKING 프로젝트의 전체 테스트 전략 및 실행 계획

**작성일**: 2025-10-20
**버전**: 1.6.1
**상태**: ✅ 활성

---

## 📋 개요

### 테스트 피라미드
```
        ┌─────────────┐
        │  E2E Tests  │  20% (사용자 플로우)
        │    (80+)    │
        ├─────────────┤
        │ Integration │  30% (API, DB 연동)
        │   Tests     │
        ├─────────────┤
        │ Unit Tests  │  50% (비즈니스 로직)
        │   (50+)     │
        └─────────────┘
```

### 테스트 도구 스택
- **E2E**: Playwright (크로스 브라우저)
- **Unit/Integration**: Vitest (Vite 네이티브)
- **Component**: React Testing Library
- **Performance**: Lighthouse CI
- **Accessibility**: Axe-core
- **Visual Regression**: Playwright Screenshots

---

## 🎯 테스트 목표

### 품질 목표
- **코드 커버리지**: 80%+ (전체)
- **E2E 통과율**: 95%+
- **Unit 테스트 통과율**: 100%
- **성능 점수**: 90+ (Lighthouse)
- **접근성 점수**: 95+ (Axe)

### 비기능 요구사항
- **실행 시간**: E2E 10분 이내, Unit 2분 이내
- **안정성**: Flaky 테스트 0%
- **유지보수성**: 주석 포함, 명확한 테스트 이름

---

## 🧪 테스트 레벨별 전략

### 1. Unit 테스트 (50%)

#### 대상
- **Hooks**: useAuth, useServices, useBlogPosts, useRBAC 등
- **Utilities**: 헬퍼 함수, 포매터, 검증 로직
- **Types**: TypeScript 타입 가드

#### 도구
- **Vitest**: 빠른 실행, Vite 통합
- **React Testing Library**: 컴포넌트 테스트
- **@testing-library/user-event**: 사용자 이벤트 시뮬레이션

#### 예시
```typescript
// useBlogPosts.test.tsx
describe('useBlogPosts', () => {
  it('should fetch blog posts successfully', async () => {
    const mockPosts = [{ id: '1', title: 'Test' }]
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: mockPosts, error: null })
    })

    const { result } = renderHook(() => useBlogPosts())
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockPosts)
  })
})
```

#### 커버리지 목표
- **Hooks**: 90%+
- **Utilities**: 95%+
- **Components**: 80%+

---

### 2. Integration 테스트 (30%)

#### 대상
- **API 연동**: Supabase 쿼리, RPC 호출
- **Storage**: 이미지 업로드/삭제
- **Auth Flow**: 로그인, 로그아웃, 세션 관리

#### 도구
- **Vitest**: 통합 테스트 실행
- **Supabase Test Client**: 테스트 DB 연결

#### 예시
```typescript
// service-api.test.ts
describe('Service API Integration', () => {
  it('should create and fetch service', async () => {
    const newService = await createService({
      title: 'Test Service',
      price: 100000
    })

    expect(newService.id).toBeTruthy()

    const fetched = await getService(newService.id)
    expect(fetched.title).toBe('Test Service')
  })
})
```

---

### 3. E2E 테스트 (20%)

#### 대상
- **Critical Path**: 장바구니 → 결제 → 주문
- **Admin CRUD**: 서비스, 블로그, 공지사항 관리
- **Authentication**: 로그인, 2FA, OAuth
- **User Flows**: 서비스 검색, 블로그 읽기

#### 도구
- **Playwright**: 크로스 브라우저 (Chromium, Firefox, WebKit)
- **Fixtures**: 테스트 데이터, 인증 헬퍼

#### 예시
```typescript
// cart.spec.ts
test('should add service to cart', async ({ page }) => {
  await loginAsRegularUser(page)
  await page.goto('/services')
  await page.locator('[data-testid="service-card"]').first().click()
  await page.locator('button:has-text("장바구니 추가")').click()

  await expect(page.locator('text=장바구니에 추가되었습니다')).toBeVisible()
  await expect(page.locator('[data-testid="cart-button"]')).toContainText('1')
})
```

#### 실행 환경
- **Browsers**: Chromium, Firefox, WebKit
- **Viewports**: Mobile (375px), Tablet (768px), Desktop (1920px)
- **Screenshots**: 실패 시 자동 캡처
- **Videos**: 헤드리스 모드에서 녹화

---

## 📊 Phase별 테스트 현황

### Phase 1-8 (완료)
- **E2E**: 60개 (homepage, login, services, admin)
- **Unit**: 34개 (useAuth, useServices, useIsAdmin, ServiceForm, ServiceCard)
- **Visual**: 28개 (dark-mode, responsive)
- **통과율**: 90%+

### Phase 9 (전자상거래) ✅ 완료
- **E2E**: 17개 (cart, checkout)
- **Unit**: 0개 (useCart는 Zustand 기반, 테스트 불필요)
- **통과율**: 예상 95%+

### Phase 10 (인증 강화) ✅ 완료
- **E2E**: 19개 (profile, 2FA)
- **Unit**: 0개 (useProfile, use2FA는 Supabase 직접 호출)
- **통과율**: 예상 90%+

### Phase 11 (CMS) ✅ 완료
- **E2E**: 36개 (blog, notices)
- **Unit**: 24개 (useBlogPosts, useNotices)
- **통과율**: 예상 95%+

### Phase 10 Week 3 (RBAC) ✅ 완료
- **E2E**: 25개 (rbac, audit logs)
- **Unit**: 24개 (useRBAC, useAuditLogs)
- **통과율**: 예상 95%+

### 총 테스트 수
```
E2E:   157+ 테스트 (6개 파일 추가)
Unit:   82+ 테스트 (4개 파일 추가)
Total: 239+ 테스트
```

---

## 🚀 CI/CD 통합

### GitHub Actions 워크플로우

#### 1. E2E 테스트 (.github/workflows/test-e2e.yml)
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

#### 2. Unit 테스트 (.github/workflows/test-unit.yml)
```yaml
name: Unit Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v4
```

#### 3. Lighthouse CI (.github/workflows/lighthouse.yml)
```yaml
name: Lighthouse CI
on: [push, pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - run: npm run lighthouse
```

### 브랜치 보호 규칙
- **main**: 모든 테스트 통과 필수
- **staging**: E2E + Unit 테스트 통과 필수
- **develop**: Unit 테스트 통과 필수

---

## 🎨 시각적 회귀 테스트

### 목표
- **Dark Mode**: 모든 페이지에서 다크 모드 전환 검증
- **Responsive**: Mobile/Tablet/Desktop 레이아웃 검증
- **Screenshot Diff**: 시각적 변경 감지

### 테스트 파일
1. **dark-mode.spec.ts** (8개 테스트)
   - 테마 토글
   - 다크 모드 유지
   - 컴포넌트 스타일 적용
   - 스크린샷 비교

2. **responsive.spec.ts** (20개 테스트)
   - Mobile: 1열 레이아웃
   - Tablet: 2열 레이아웃
   - Desktop: 3열 레이아웃
   - 반응형 네비게이션

### 개선 계획
- **셀렉터 개선**: 더 구체적인 data-testid 사용
- **대기 시간 최적화**: `waitForLoadState` 활용
- **스냅샷 업데이트**: Baseline 스크린샷 재생성

---

## 🔒 보안 & 권한 테스트

### RBAC 테스트
- **역할**: Super Admin, Admin, Editor, Viewer
- **권한**: service:*, blog:*, notice:*, user:*, order:*, system:*
- **검증**: 비관리자 Admin 라우트 차단

### 2FA 테스트
- **TOTP**: QR 코드, Secret Key 검증
- **백업 코드**: 생성, 사용, 재생성
- **브루트 포스 방지**: 5회 실패 → 30분 잠금

### Audit Logs
- **액션 기록**: Create, Read, Update, Delete
- **리소스 추적**: Service, Blog Post, Notice, User, Role
- **필터링**: 사용자, 액션, 리소스별

---

## 📈 성능 테스트

### Lighthouse CI 임계값
```javascript
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "categories:seo": ["warn", { "minScore": 0.9 }]
      }
    }
  }
}
```

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

---

## 🛠️ 테스트 데이터 관리

### Fixtures
```typescript
// tests/fixtures/users.ts
export const testUsers = {
  admin: {
    email: 'admin@ideaonaction.local',
    password: 'demian00',
    role: 'admin'
  },
  regularUser: {
    email: 'user@test.com',
    password: 'password123',
    role: 'viewer'
  }
}

// tests/fixtures/services.ts
export const testServices = [
  {
    id: 'service-1',
    title: 'AI 컨설팅',
    price: 500000,
    category: '컨설팅'
  }
]
```

### Auth Helpers
```typescript
// tests/fixtures/auth-helpers.ts
export async function loginAsAdmin(page: Page) {
  await page.goto('/login')
  await page.fill('input[name="email"]', testUsers.admin.email)
  await page.fill('input[name="password"]', testUsers.admin.password)
  await page.click('button[type="submit"]')
  await page.waitForURL('/admin')
}
```

---

## 📝 테스트 작성 가이드라인

### Naming Convention
```typescript
// ✅ Good
describe('useAuth', () => {
  it('should return user when authenticated', () => {})
  it('should redirect to login when not authenticated', () => {})
})

// ❌ Bad
describe('auth', () => {
  it('test1', () => {})
  it('works', () => {})
})
```

### AAA 패턴 (Arrange-Act-Assert)
```typescript
test('should add item to cart', async ({ page }) => {
  // Arrange: 초기 설정
  await loginAsRegularUser(page)
  await page.goto('/services')

  // Act: 동작 실행
  await page.locator('[data-testid="service-card"]').first().click()
  await page.locator('button:has-text("장바구니 추가")').click()

  // Assert: 검증
  await expect(page.locator('[data-testid="cart-button"]')).toContainText('1')
})
```

### Data Attributes
```typescript
// 컴포넌트에 data-testid 추가
<button data-testid="add-to-cart">장바구니 추가</button>

// 테스트에서 사용
await page.locator('[data-testid="add-to-cart"]').click()
```

---

## 🐛 디버깅 & 트러블슈팅

### E2E 테스트 디버그
```bash
# UI 모드로 실행 (단계별 확인)
npm run test:e2e:ui

# 디버그 모드 (중단점 사용)
npm run test:e2e:debug

# 특정 브라우저만 실행
npx playwright test --project=chromium

# 헤드 모드 실행 (브라우저 보이기)
npx playwright test --headed
```

### Unit 테스트 디버그
```bash
# Watch 모드 (파일 변경 시 자동 실행)
npm run test:unit:watch

# UI 모드 (Vitest UI)
npm run test:unit:ui

# 특정 파일만 실행
npx vitest run tests/unit/useBlogPosts.test.tsx
```

### 일반적인 문제
1. **Timeout 에러**
   - `waitForTimeout()` → `waitForLoadState('networkidle')`
   - Timeout 값 증가: `test.setTimeout(60000)`

2. **Flaky 테스트**
   - `waitFor()` 사용으로 안정화
   - `toHaveCount()` 대신 `toBeVisible()` 사용

3. **Mock 데이터 불일치**
   - `vi.clearAllMocks()` beforeEach에서 호출
   - Mock 함수 반환값 확인

---

## 📚 참고 문서
- [Phase 9-11 테스트 문서](./phase9-11-tests.md)
- [Playwright 공식 문서](https://playwright.dev/)
- [Vitest 공식 문서](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**작성자**: Claude AI
**최종 업데이트**: 2025-10-20
