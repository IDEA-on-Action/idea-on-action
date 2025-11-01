# Phase 9-11 테스트 문서

> Phase 9 (전자상거래), Phase 10 (인증 강화), Phase 11 (CMS) 기능에 대한 테스트 문서

**작성일**: 2025-10-20
**버전**: 1.6.1
**상태**: ✅ 완료

---

## 📋 테스트 개요

### 테스트 범위
- **Phase 9**: 전자상거래 (장바구니, 주문, 결제)
- **Phase 10**: 인증 강화 (OAuth 확장, 프로필, 2FA, RBAC)
- **Phase 11**: CMS (블로그, 공지사항, SEO)

### 테스트 통계
```
E2E 테스트:     6개 파일, 80+ 테스트 케이스
Unit 테스트:    4개 파일, 48+ 테스트 케이스
Total:         128+ 테스트 케이스
```

---

## 🧪 E2E 테스트

### 1. 장바구니 테스트 (cart.spec.ts)

**파일**: `tests/e2e/cart.spec.ts`
**테스트 수**: 7개

#### 테스트 케이스
1. ✅ **서비스 장바구니 추가**
   - 서비스 목록 → 상세 페이지 → 장바구니 추가
   - Toast 알림 확인
   - 장바구니 뱃지 카운트 확인

2. ✅ **수량 증가/감소**
   - 수량 증가 버튼 클릭
   - 수량 표시 확인
   - 총 가격 업데이트 확인

3. ✅ **아이템 삭제**
   - 삭제 버튼 클릭
   - 빈 장바구니 메시지 확인

4. ✅ **장바구니 전체 삭제**
   - 여러 아이템 추가
   - 전체 삭제 버튼 클릭
   - 빈 장바구니 확인

5. ✅ **페이지 간 장바구니 유지**
   - 장바구니 추가 후 홈으로 이동
   - 뱃지 카운트 유지 확인

6. ✅ **결제 버튼 표시**
   - 장바구니에 아이템이 있을 때 결제 버튼 활성화

7. ✅ **결제 페이지 이동**
   - 결제 버튼 클릭 → `/checkout` 이동

#### 데이터 속성
```typescript
[data-testid="cart-button"]      // 장바구니 버튼
[data-testid="cart-drawer"]      // 장바구니 서랍
[data-testid="cart-item"]        // 장바구니 아이템
[data-testid="cart-summary"]     // 장바구니 요약
[data-testid="increase-quantity"] // 수량 증가 버튼
[data-testid="remove-item"]      // 아이템 삭제 버튼
```

---

### 2. 결제 프로세스 테스트 (checkout.spec.ts)

**파일**: `tests/e2e/checkout.spec.ts`
**테스트 수**: 10개

#### 테스트 케이스
1. ✅ **결제 폼 표시**
   - 배송지 입력 필드 확인
   - 필수 필드: 이름, 전화번호, 주소, 우편번호

2. ✅ **주문 요약 표시**
   - 주문 아이템 목록
   - 총 금액 계산

3. ✅ **필수 필드 검증**
   - 빈 폼 제출 시도
   - 검증 에러 메시지 확인

4. ✅ **결제 폼 제출**
   - 배송지 정보 입력
   - 폼 제출 → `/checkout/payment` 이동

5. ✅ **결제 수단 선택**
   - 카카오페이 버튼 표시
   - 토스페이먼츠 버튼 표시

6. ✅ **미인증 사용자 리다이렉트**
   - 로그아웃 상태에서 결제 페이지 접근
   - `/login`으로 리다이렉트

7. ✅ **빈 장바구니 처리**
   - 장바구니가 비어있을 때 결제 페이지 접근
   - 빈 장바구니 메시지 또는 리다이렉트

8. ✅ **배송지 수정**
   - 주소 필드 수정 가능

9. ✅ **배송비 표시**
   - 배송비 항목 확인 (해당 시)

10. ✅ **주문 아이템 표시**
    - 결제 페이지에서 주문 아이템 목록 확인

---

### 3. 블로그 테스트 (blog.spec.ts)

**파일**: `tests/e2e/blog.spec.ts`
**테스트 수**: 19개 (Public: 8개, Admin: 11개)

#### Public 테스트
1. ✅ **블로그 목록 페이지**
   - `/blog` 페이지 표시
   - 블로그 카드 목록

2. ✅ **카테고리 필터**
   - 카테고리 선택 → 필터링된 결과

3. ✅ **블로그 검색**
   - 검색어 입력 → 검색 결과

4. ✅ **블로그 상세 페이지**
   - 카드 클릭 → `/blog/:slug`
   - 제목, 내용, 메타데이터 확인

5. ✅ **Featured 이미지**
   - 상세 페이지에서 이미지 표시

6. ✅ **태그 표시**
   - 블로그 포스트 태그 목록

7. ✅ **공유 버튼**
   - 공유 버튼 표시 및 활성화

8. ✅ **읽기 시간 표시**
   - 예상 읽기 시간 (분)

#### Admin 테스트
1. ✅ **관리자 블로그 페이지**
   - `/admin/blog` 접근
   - 새 글 작성 버튼
   - 블로그 테이블

2. ✅ **블로그 포스트 생성**
   - 제목, 내용 (Markdown) 입력
   - 카테고리, 상태 선택
   - 폼 제출

3. ✅ **Markdown 미리보기**
   - 미리보기 탭 클릭
   - 렌더링된 HTML 확인

4. ✅ **자동 Slug 생성**
   - 제목 입력 → Slug 자동 생성
   - `hello-world-test` 형식

5. ✅ **블로그 포스트 수정**
   - 수정 버튼 클릭 → `/admin/blog/:id/edit`
   - 기존 데이터 로드 → 수정 → 저장

6. ✅ **블로그 포스트 삭제**
   - 삭제 버튼 → 확인 → 삭제 완료

7. ✅ **상태별 필터**
   - Published, Draft, Archived 필터

8. ✅ **Featured 이미지 업로드**
   - 이미지 파일 업로드
   - 미리보기 표시

9. ✅ **태그 추가**
   - 태그 입력 → Enter
   - 태그 칩 표시

10. ✅ **필수 필드 검증**
    - 빈 폼 제출 → 검증 에러

11. ✅ **블로그 테이블 필터**
    - 상태, 카테고리별 필터링

---

### 4. 공지사항 테스트 (notices.spec.ts)

**파일**: `tests/e2e/notices.spec.ts`
**테스트 수**: 17개 (Public: 7개, Admin: 10개)

#### Public 테스트
1. ✅ **공지사항 페이지**
   - `/notices` 페이지 표시
   - 공지사항 카드 목록

2. ✅ **고정 공지사항 우선 표시**
   - 고정 뱃지 확인

3. ✅ **타입별 필터**
   - Info, Warning, Urgent, Maintenance

4. ✅ **공지사항 상세 모달**
   - 카드 클릭 → 모달 표시
   - 제목, 내용 확인

5. ✅ **모달 닫기**
   - 닫기 버튼 → 모달 닫힘

6. ✅ **타입별 아이콘**
   - 공지사항 타입에 따른 아이콘 표시

7. ✅ **만료된 공지사항 숨김**
   - Public 뷰에서 만료된 공지 미표시

#### Admin 테스트
1. ✅ **관리자 공지사항 페이지**
   - `/admin/notices` 접근
   - 새 공지 작성 버튼
   - 공지사항 테이블

2. ✅ **공지사항 생성**
   - 제목, 내용 입력
   - 타입 선택 (Info, Warning, Urgent, Maintenance)
   - 고정 체크박스

3. ✅ **만료일 설정**
   - 만료일 필드 입력
   - 미래 날짜 설정

4. ✅ **공지사항 수정**
   - 수정 버튼 → 기존 데이터 로드 → 수정

5. ✅ **공지사항 삭제**
   - 삭제 버튼 → 확인 → 삭제 완료

6. ✅ **타입별 필터 (Admin)**
   - 관리자 페이지에서 타입별 필터링

7. ✅ **고정 상태 토글**
   - 고정 체크박스 토글 → 저장

8. ✅ **모든 타입 표시**
   - 타입 선택 드롭다운에서 4가지 타입 확인

9. ✅ **필수 필드 검증**
   - 빈 폼 제출 → 검증 에러

10. ✅ **만료 표시자 (Admin)**
    - 관리자 목록에서 만료 뱃지 표시

---

### 5. 프로필 & 2FA 테스트 (profile.spec.ts)

**파일**: `tests/e2e/profile.spec.ts`
**테스트 수**: 19개 (Profile: 10개, 2FA: 9개)

#### Profile 테스트
1. ✅ **프로필 페이지 접근**
   - `/profile` 페이지 표시
   - 프로필 정보 섹션

2. ✅ **사용자 정보 표시**
   - 이메일, 가입일 확인

3. ✅ **프로필 이름 업데이트**
   - 이름 입력 → 저장 → 성공 메시지

4. ✅ **아바타 업로드**
   - 이미지 파일 업로드 → 미리보기

5. ✅ **연결된 계정 표시**
   - OAuth 연결 계정 섹션

6. ✅ **OAuth 제공자 버튼**
   - Google, GitHub, Kakao, Microsoft, Apple 버튼

7. ✅ **새 OAuth 계정 연결**
   - 연결 버튼 클릭 가능

8. ✅ **2FA 섹션 표시**
   - 2단계 인증 섹션

9. ✅ **2FA 설정 페이지 이동**
   - 2FA 설정 버튼 → `/2fa/setup`

10. ✅ **이메일 알림 설정**
    - 이메일 알림 체크박스 토글 → 저장

#### 2FA 테스트
1. ✅ **2FA 설정 페이지**
   - `/2fa/setup` 페이지 표시
   - QR 코드 표시

2. ✅ **Secret Key 표시**
   - 수동 입력용 Secret Key

3. ✅ **TOTP 코드 검증**
   - 6자리 코드 입력 → 검증

4. ✅ **백업 코드 표시**
   - 2FA 활성화 후 백업 코드 목록

5. ✅ **로그인 시 2FA 요구**
   - 2FA 활성화 계정 로그인 → `/2fa/verify`

6. ✅ **백업 코드 사용**
   - 백업 코드 입력 모드 전환

7. ✅ **2FA 비활성화**
   - 비활성화 버튼 → 확인 → 성공 메시지

8. ✅ **실패 시도 경고**
   - 잘못된 코드 3회 입력 → 경고 메시지

9. ✅ **백업 코드 재생성**
   - 재생성 버튼 → 확인 → 새 코드 표시

---

### 6. RBAC & 감사 로그 테스트 (rbac.spec.ts)

**파일**: `tests/e2e/rbac.spec.ts`
**테스트 수**: 25개 (Admin: 8개, Audit: 10개, Permissions: 7개)

#### Admin 테스트
1. ✅ **역할 관리 페이지**
   - `/admin/roles` 접근
   - 역할 카드 표시

2. ✅ **기본 역할 표시**
   - Super Admin, Admin, Editor, Viewer

3. ✅ **역할 권한 표시**
   - 역할 카드 클릭 → 권한 목록 확장

4. ✅ **사용자에게 역할 할당**
   - 사용자 선택 → 역할 선택 → 할당

5. ✅ **역할 회수**
   - 회수 버튼 → 확인 → 성공 메시지

6. ✅ **역할별 사용자 표시**
   - 현재 역할 테이블

7. ✅ **역할별 필터**
   - 역할 필터 → 필터링된 사용자 목록

8. ✅ **권한 개수 표시**
   - 역할별 권한 개수 뱃지

#### Audit Logs 테스트
1. ✅ **감사 로그 페이지**
   - `/admin/audit-logs` 접근
   - 로그 테이블 표시

2. ✅ **로그 엔트리 표시**
   - 로그 행 목록

3. ✅ **액션별 필터**
   - Create, Read, Update, Delete

4. ✅ **사용자별 필터**
   - 사용자 선택 → 필터링

5. ✅ **리소스별 필터**
   - Service, Blog Post, Notice 등

6. ✅ **로그 메타데이터 표시**
   - 액션, 리소스, 타임스탬프

7. ✅ **액션 뱃지 색상**
   - 액션별 색상 코드

8. ✅ **사용자 표시**
   - 액션 수행 사용자

9. ✅ **페이지네이션**
   - 다음/이전 버튼

10. ✅ **로그 내보내기**
    - 내보내기 버튼 활성화

#### Permissions 테스트
1. ✅ **비관리자 Admin 라우트 차단**
   - 일반 사용자 → `/admin/roles` → `/forbidden`

2. ✅ **비관리자 서비스 관리 차단**
   - `/admin/services` → `/forbidden`

3. ✅ **비관리자 블로그 관리 차단**
   - `/admin/blog` → `/forbidden`

4. ✅ **비관리자 공지사항 관리 차단**
   - `/admin/notices` → `/forbidden`

5. ✅ **비관리자 감사 로그 차단**
   - `/admin/audit-logs` → `/forbidden`

6. ✅ **관리자 모든 라우트 접근**
   - 관리자 → 모든 Admin 라우트 접근 가능

7. ✅ **서비스 생성 시 로그 기록**
   - 서비스 생성 → 감사 로그 확인

---

## 🔬 Unit 테스트

### 1. useBlogPosts 테스트 (useBlogPosts.test.tsx)

**파일**: `tests/unit/useBlogPosts.test.tsx`
**테스트 수**: 12개

#### 테스트 케이스
1. ✅ **블로그 포스트 조회 성공**
   - Supabase query mock
   - 데이터 반환 확인

2. ✅ **상태별 필터링**
   - `status: 'published'` 옵션
   - `eq('status', 'published')` 호출 확인

3. ✅ **조회 에러 처리**
   - Error mock → `isError: true`

4. ✅ **카테고리별 필터링**
   - `categoryId` 옵션 → `eq('category_id', 'cat1')`

5. ✅ **정렬 (생성일 기준)**
   - `sortBy: 'created_at', sortOrder: 'desc'`
   - `order('created_at', { ascending: false })`

6. ✅ **포스트 생성 성공**
   - `useCreatePost` mutation
   - `insert()` 호출 확인

7. ✅ **포스트 생성 에러**
   - Error mock → `isError: true`

8. ✅ **포스트 업데이트 성공**
   - `useUpdatePost` mutation
   - `update()`, `eq('id', '1')` 호출

9. ✅ **포스트 삭제 성공**
   - `useDeletePost` mutation
   - `delete()`, `eq('id', '1')` 호출

10. ✅ **포스트 삭제 에러**
    - Error mock → `isError: true`

---

### 2. useNotices 테스트 (useNotices.test.tsx)

**파일**: `tests/unit/useNotices.test.tsx`
**테스트 수**: 12개

#### 테스트 케이스
1. ✅ **공지사항 조회 성공**
   - Supabase query mock
   - 데이터 반환 확인

2. ✅ **타입별 필터링**
   - `type: 'urgent'` 옵션
   - `eq('type', 'urgent')` 호출

3. ✅ **조회 에러 처리**
   - Error mock → `isError: true`

4. ✅ **고정 공지사항 우선 정렬**
   - `order('is_pinned', { ascending: false })`

5. ✅ **만료 공지사항 제외**
   - `includeExpired: false` 옵션
   - `is('expires_at', null)` 호출

6. ✅ **공지사항 생성 성공**
   - `useCreateNotice` mutation
   - `insert()` 호출

7. ✅ **공지사항 생성 에러**
   - Error mock → `isError: true`

8. ✅ **공지사항 업데이트 성공**
   - `useUpdateNotice` mutation
   - `update()`, `eq('id', '1')` 호출

9. ✅ **고정 상태 토글**
   - `is_pinned: true` 업데이트
   - `update()` 호출 확인

10. ✅ **공지사항 삭제 성공**
    - `useDeleteNotice` mutation
    - `delete()`, `eq('id', '1')` 호출

11. ✅ **공지사항 삭제 에러**
    - Error mock → `isError: true`

---

### 3. useRBAC 테스트 (useRBAC.test.tsx)

**파일**: `tests/unit/useRBAC.test.tsx`
**테스트 수**: 12개

#### 테스트 케이스
1. ✅ **역할 목록 조회 성공**
   - `useRoles` hook
   - Super Admin, Admin 등 반환

2. ✅ **역할 조회 에러**
   - Error mock → `isError: true`

3. ✅ **사용자 권한 조회 성공**
   - `useUserPermissions('user1')`
   - `rpc('get_user_permissions')` 호출

4. ✅ **사용자 ID 없을 때 빈 배열**
   - `useUserPermissions(undefined)` → `[]`

5. ✅ **권한 조회 에러**
   - Error mock → `isError: true`

6. ✅ **권한 보유 확인 (true)**
   - `useHasPermission('service:create')` → `true`

7. ✅ **권한 미보유 확인 (false)**
   - `useHasPermission('service:delete')` → `false`

8. ✅ **권한 없을 때 false**
   - 빈 권한 목록 → `false`

9. ✅ **역할 할당 성공**
   - `useAssignRole` mutation
   - `insert()` 호출

10. ✅ **역할 할당 에러**
    - Error mock → `isError: true`

11. ✅ **역할 회수 성공**
    - `useRevokeRole` mutation
    - `delete()`, `eq('user_id', 'user1')` 호출

12. ✅ **역할 회수 에러**
    - Error mock → `isError: true`

---

### 4. useAuditLogs 테스트 (useAuditLogs.test.tsx)

**파일**: `tests/unit/useAuditLogs.test.tsx`
**테스트 수**: 12개

#### 테스트 케이스
1. ✅ **감사 로그 조회 성공**
   - `useAuditLogs` hook
   - 로그 데이터 반환

2. ✅ **액션별 필터링**
   - `action: 'create'` 옵션
   - `eq('action', 'create')` 호출

3. ✅ **사용자별 필터링**
   - `userId: 'user1'` 옵션
   - `eq('user_id', 'user1')` 호출

4. ✅ **리소스 타입별 필터링**
   - `resourceType: 'service'` 옵션
   - `eq('resource_type', 'service')` 호출

5. ✅ **결과 제한**
   - `limit: 50` 옵션
   - `limit(50)` 호출

6. ✅ **로그 조회 에러**
   - Error mock → `isError: true`

7. ✅ **액션 로그 기록 성공**
   - `useLogAction` mutation
   - `rpc('log_action')` 호출

8. ✅ **Details 없이 로그**
   - `details: undefined`
   - `rpc('log_action')` 호출

9. ✅ **로그 기록 에러**
   - Error mock → `isError: true`

10. ✅ **다양한 액션 타입 로그**
    - `create`, `read`, `update`, `delete`
    - 각 액션별 `rpc('log_action')` 호출

11. ✅ **다양한 리소스 타입 로그**
    - `service`, `blog_post`, `notice`, `user`, `role`
    - 각 리소스별 `rpc('log_action')` 호출

---

## 🎯 테스트 실행 가이드

### E2E 테스트 실행
```bash
# 전체 E2E 테스트
npm run test:e2e

# 특정 파일만 실행
npx playwright test tests/e2e/cart.spec.ts
npx playwright test tests/e2e/blog.spec.ts

# UI 모드로 실행
npm run test:e2e:ui

# 디버그 모드
npm run test:e2e:debug
```

### Unit 테스트 실행
```bash
# 전체 유닛 테스트
npm run test:unit

# Watch 모드
npm run test:unit:watch

# 커버리지
npm run test:coverage

# UI 모드
npm run test:unit:ui
```

### 특정 테스트만 실행
```bash
# Vitest
npx vitest run tests/unit/useBlogPosts.test.tsx

# Playwright
npx playwright test tests/e2e/cart.spec.ts --headed
```

---

## 📊 테스트 커버리지 목표

### Phase 9-11 커버리지
- **E2E 테스트**: 80%+ (주요 사용자 플로우)
- **Unit 테스트**: 90%+ (비즈니스 로직, 훅)
- **통합 테스트**: 70%+ (API 호출, 데이터베이스 연동)

### 우선순위
1. **Critical Path**: 장바구니 → 결제 → 주문 (100%)
2. **Admin CRUD**: 블로그, 공지사항, RBAC (90%)
3. **Authentication**: 2FA, OAuth 연결 (85%)
4. **SEO & Content**: 블로그 검색, 공지사항 필터 (75%)

---

## 🐛 알려진 이슈 & 제한사항

### E2E 테스트
1. **결제 테스트**
   - Kakao Pay, Toss Payments는 실제 결제 API 호출 불가
   - Mock 데이터 사용 권장

2. **2FA 테스트**
   - TOTP 코드 검증은 실제 Authenticator 앱 없이 불가
   - Secret Key 기반 코드 생성 필요

3. **OAuth 테스트**
   - Microsoft, Apple OAuth는 실제 로그인 불가
   - Mock 또는 테스트 계정 필요

### Unit 테스트
1. **Supabase RPC Mock**
   - RPC 함수 (`get_user_permissions`, `log_action`) Mock 필요
   - 실제 DB 연동 불가

2. **Image Upload**
   - 파일 업로드는 Mock 데이터 사용
   - Supabase Storage 실제 업로드 불가

---

## 📈 다음 단계

### 추가 테스트 계획
1. **시각적 회귀 테스트 개선**
   - Responsive 테스트 셀렉터 수정
   - Dark 모드 테스트 안정화

2. **성능 테스트**
   - Lighthouse CI 임계값 설정
   - Core Web Vitals 측정

3. **접근성 테스트**
   - Axe-core 통합
   - WCAG 2.1 AA 준수 확인

4. **Load Testing**
   - 동시 사용자 시뮬레이션
   - API 응답 시간 측정

---

## 🔗 관련 문서
- [테스트 전략 문서](./testing-strategy.md)
- [Playwright 설정 가이드](./playwright-setup.md)
- [Vitest 설정 가이드](./vitest-setup.md)
- [CI/CD 통합 가이드](../devops/ci-cd-integration.md)

---

**작성자**: Claude AI
**최종 업데이트**: 2025-10-20
