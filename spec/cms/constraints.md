# CMS 관리자 모드 제약사항

**작성일**: 2025-11-15
**버전**: 1.0
**담당자**: Sinclair Seo

---

## 1. 기술적 제약사항

### 1.1 프론트엔드 스택 제약
**제약**: 기존 프로젝트 스택 유지 필수
- **React 18+**: 클래스 컴포넌트 사용 금지 (함수형 컴포넌트 + Hooks만)
- **TypeScript**: strict 모드 유지
- **Vite**: 번들러 변경 불가
- **Tailwind CSS**: 기존 디자인 시스템 재사용
- **shadcn/ui**: 기존 컴포넌트 라이브러리 우선 사용

**이유**: 코드 일관성 유지, 학습 곡선 최소화, 빌드 시간 단축

### 1.2 백엔드 스택 제약
**제약**: Supabase 우선 사용
- **데이터베이스**: PostgreSQL (Supabase)
- **인증**: Supabase Auth (커스텀 JWT 금지)
- **스토리지**: Supabase Storage (S3/Cloudflare R2 금지)
- **RLS**: Row Level Security 정책 필수

**이유**: 기존 인프라 재사용, 운영 비용 최소화, 보안 강화

### 1.3 상태 관리 제약
**제약**: React Query 우선 사용
- **서버 상태**: React Query (useQuery, useMutation)
- **클라이언트 상태**: Zustand (Context API 지양)
- **폼 상태**: React Hook Form + Zod

**이유**: 기존 패턴 유지, 캐싱 전략 일관성

---

## 2. 성능 제약사항

### 2.1 페이지 로딩 시간
**제약**: 초기 로딩 < 2초 (Lighthouse 기준)
- **Bundle 크기**: 관리자 페이지 전체 < 500KB (gzip)
- **Lazy Loading**: 관리자 페이지는 모두 React.lazy() 적용
- **Code Splitting**: 페이지별 청크 분리 필수

**측정 방법**: Lighthouse CI (Performance 90+ 목표)

### 2.2 이미지 최적화
**제약**: 이미지 파일 크기 제한
- **업로드 제한**: 5MB/파일
- **썸네일 생성**: 자동 리사이징 (400x300px)
- **포맷**: WebP 우선, JPEG/PNG fallback
- **Lazy Loading**: 이미지 목록 페이지

**도구**: sharp (서버 사이드) 또는 Supabase Image Transformation

### 2.3 데이터베이스 쿼리
**제약**: 쿼리 최적화 필수
- **N+1 문제 방지**: JOIN 또는 Supabase RPC 사용
- **인덱스 필수**: 검색/필터 대상 컬럼
- **페이지네이션**: 20개/페이지 (offset 또는 cursor 기반)

**측정 방법**: Supabase Logs (쿼리 실행 시간 < 100ms)

---

## 3. 보안 제약사항

### 3.1 인증 및 권한
**제약**: 보안 정책 엄격 적용
- **HTTPS 전용**: HTTP 리다이렉트 필수
- **CSRF 방지**: Supabase Auth 토큰 검증
- **XSS 방지**: HTML 새니타이징 필수 (DOMPurify)
- **RLS 정책**: 모든 테이블에 적용 (Public 제외)

**검증 방법**: OWASP ZAP 스캔, Supabase Security Advisor

### 3.2 파일 업로드 보안
**제약**: 업로드 파일 검증 필수
- **MIME 타입 검증**: 서버 사이드 확인 (클라이언트 우회 방지)
- **확장자 검증**: 화이트리스트 방식 (JPG, PNG, WebP, SVG, PDF만)
- **파일 크기 제한**: 5MB (Supabase Storage Bucket 설정)
- **파일명 새니타이징**: UUID 기반 파일명 생성

**예시**:
```typescript
// ❌ 위험한 방법
const fileName = file.name // "malicious<script>.png"

// ✅ 안전한 방법
const fileName = `${uuid()}.${getExtension(file.name)}` // "abc-123.png"
```

### 3.3 SQL Injection 방지
**제약**: Raw SQL 사용 금지
- **Supabase Client 사용**: `.select()`, `.insert()` 메서드만
- **RPC 함수**: Parameterized Query 필수
- **사용자 입력 검증**: Zod 스키마 검증

---

## 4. UI/UX 제약사항

### 4.1 접근성 (Accessibility)
**제약**: WCAG 2.1 AA 준수 필수
- **키보드 네비게이션**: 모든 UI 요소 Tab/Enter/Space로 조작 가능
- **ARIA 속성**: role, aria-label, aria-describedby 적용
- **색상 대비**: 최소 4.5:1 (텍스트/배경)
- **포커스 표시**: 포커스 링 또는 아웃라인 필수

**검증 방법**: Axe DevTools, Lighthouse Accessibility

### 4.2 반응형 디자인
**제약**: 3단계 브레이크포인트 지원
- **모바일**: 320px ~ 767px (1열 레이아웃)
- **태블릿**: 768px ~ 1023px (2열 레이아웃)
- **데스크탑**: 1024px+ (사이드바 + 메인)

**테스트 기기**: iPhone SE, iPad, Desktop (1920x1080)

### 4.3 다크 모드
**제약**: 다크 모드 지원 필수
- **테마 전환**: 기존 useTheme() 훅 재사용
- **색상 변수**: CSS 변수 기반 (--primary, --background 등)
- **이미지 대응**: 다크 모드에서 밝은 이미지 조절 (filter: brightness(0.8))

---

## 5. 데이터 제약사항

### 5.1 필드 길이 제한
| 필드 | 최대 길이 | 비고 |
|------|-----------|------|
| 제목 | 200자 | VARCHAR(200) |
| Slug | 200자 | VARCHAR(200), 소문자+숫자+하이픈만 |
| 요약 | 500자 | TEXT |
| 본문 | 50,000자 | TEXT |
| 태그 | 20개 | TEXT[] |
| 기술 스택 | 20개 | TEXT[] |
| 이미지 배열 | 10개 | TEXT[] |

**제약 이유**: 데이터베이스 성능, UI 표시 제한

### 5.2 Slug 규칙
**제약**: URL-friendly 문자만 허용
- **허용 문자**: 소문자 영문(a-z), 숫자(0-9), 하이픈(-)
- **변환 규칙**: 공백 → 하이픈, 특수문자 제거, 소문자 변환
- **중복 방지**: 동일 Slug 존재 시 숫자 suffix 추가 (예: `abc-project-2`)

**예시**:
```typescript
"ABC Project!" → "abc-project"
"Hello World" → "hello-world"
"Test@123" → "test-123"
```

### 5.3 태그 정규화
**제약**: 태그 중복 방지 및 정규화
- **대소문자 통일**: 소문자 변환
- **공백 제거**: 트림 처리
- **중복 제거**: Set 자료구조 활용
- **최대 개수**: 20개

---

## 6. 외부 서비스 제약사항

### 6.1 Supabase 제약
**제약**: 무료 티어 한도
- **데이터베이스**: 500MB (초과 시 유료 플랜)
- **스토리지**: 1GB (초과 시 유료 플랜)
- **대역폭**: 5GB/월 (초과 시 요금 부과)
- **동시 연결**: 60개

**대응 방안**: 모니터링 대시보드 구축, 알림 설정

### 6.2 Vercel 제약
**제약**: 무료 티어 한도
- **빌드 시간**: 6,000분/월
- **대역폭**: 100GB/월
- **함수 실행**: 100GB-Hours/월

**대응 방안**: 캐싱 전략 최적화, CDN 활용

---

## 7. 브라우저 지원 제약사항

### 7.1 지원 브라우저
**제약**: Modern Browsers Only
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

**비지원 브라우저**: IE11 (End of Life)

### 7.2 필수 브라우저 API
- **Web API**: Fetch, LocalStorage, IndexedDB
- **CSS**: Grid, Flexbox, CSS Variables
- **JavaScript**: ES2020+ (Optional Chaining, Nullish Coalescing)

---

## 8. 개발 제약사항

### 8.1 코드 스타일
**제약**: ESLint/Prettier 설정 준수
- **ESLint**: react-hooks, typescript-eslint 규칙
- **Prettier**: 기존 설정 유지 (2 spaces, single quotes)
- **Commit**: Conventional Commits (feat:, fix:, docs: 등)

**검증 방법**: Pre-commit hook (husky + lint-staged)

### 8.2 테스트 커버리지
**제약**: 최소 커버리지 목표
- **유닛 테스트**: 70%+ (훅, 유틸리티)
- **E2E 테스트**: 20+개 (핵심 플로우)
- **접근성 테스트**: Axe 통과

**도구**: Vitest, Playwright, jest-axe

### 8.3 문서화
**제약**: 코드 문서화 필수
- **JSDoc**: 모든 exported 함수/컴포넌트
- **README**: 각 디렉토리에 README.md (선택)
- **Storybook**: 공통 컴포넌트 (선택)

---

## 9. 일정 제약사항

### 9.1 Phase별 기한
- **Phase 1**: 2주 (기반 구축)
- **Phase 2**: 3주 (핵심 기능)
- **Phase 3**: 2주 (고급 기능)
- **Phase 4**: 1주 (최적화 및 테스트)
- **Total**: 8주

**제약 이유**: 프로젝트 우선순위, 리소스 제한

### 9.2 우선순위 조정
**제약**: MVP 기능 우선
- **Must Have**: 로드맵, 포트폴리오, 블로그 CRUD
- **Should Have**: 미디어 라이브러리, 팀원 관리
- **Could Have**: 실시간 기능, 협업 기능
- **Won't Have**: 버전 히스토리, 다중 언어 CMS

---

## 10. 운영 제약사항

### 10.1 백업 전략
**제약**: 데이터 백업 필수
- **데이터베이스**: 일 1회 자동 백업 (Supabase)
- **스토리지**: 주 1회 백업 (Supabase → S3)
- **복구 테스트**: 월 1회

### 10.2 모니터링
**제약**: 에러 추적 필수
- **Sentry**: 프론트엔드 에러 추적
- **Supabase Logs**: 백엔드 에러 추적
- **Uptime Monitoring**: Vercel Analytics

---

## 11. 법적 제약사항

### 11.1 개인정보 보호
**제약**: 개인정보보호법 준수
- **개인정보 수집**: 최소한으로 제한 (이름, 이메일만)
- **개인정보 처리방침**: 관리자 페이지에 명시
- **동의 절차**: 관리자 계정 생성 시 동의 필수

### 11.2 저작권
**제약**: 오픈소스 라이선스 준수
- **MIT License**: React, Vite 등
- **Apache 2.0**: Supabase
- **상용 라이선스**: 필요 시 구매

---

## 12. 변경 불가 제약사항

### 12.1 기존 공개 페이지 영향 최소화
**제약**: 공개 페이지 구조 변경 금지
- **URL 구조**: 기존 라우팅 유지 (/roadmap, /portfolio, /lab, /blog)
- **API 호환성**: 기존 훅 시그니처 유지 (useProjects, useRoadmap 등)
- **디자인 일관성**: 기존 디자인 시스템 재사용

**제약 이유**: SEO 유지, 사용자 혼란 방지

### 12.2 관리자 페이지 네임스페이스
**제약**: /admin/* 경로만 사용
- **공개 페이지**: /roadmap, /portfolio, /lab, /blog
- **관리자 페이지**: /admin/roadmap, /admin/portfolio 등
- **충돌 방지**: /admin 경로는 ProtectedRoute로 보호

---

**작성자**: Sinclair Seo (with Claude)
**다음 단계**: [plan/cms/architecture.md](../../plan/cms/architecture.md)
