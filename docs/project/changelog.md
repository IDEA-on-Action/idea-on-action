# Changelog

> VIBE WORKING 프로젝트 변경 로그

모든 주요 변경 사항이 이 파일에 문서화됩니다.

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)를 기반으로 하며,
버전 관리는 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

---

## [1.4.0] - 2025-10-17

### Added
- **Phase 8: 서비스 페이지 구현** 🎉
  - 서비스 목록 페이지 (`/services`)
  - 서비스 상세 페이지 (`/services/:id`)
  - ServiceCard 컴포넌트 (글래스모피즘, 호버 효과)
  - React Query 통합 (서버 상태 관리)
  - useServices 훅 (목록 조회, 필터링, 정렬)
  - useServiceDetail 훅 (상세 조회)
  - useServiceCategories 훅 (카테고리 목록)
  - useServiceCounts 훅 (카테고리별 개수)
  - 카테고리 필터링 UI (Tabs)
  - 정렬 기능 (최신순, 가격순, 인기순)
  - 이미지 갤러리 (Carousel 컴포넌트)
  - 메트릭 시각화 (사용자 수, 만족도, ROI)
  - SEO 최적화 (react-helmet-async)
  - 반응형 그리드 레이아웃 (1열→2열→3열)
  - 로딩 스켈레톤 UI
  - 빈 상태 처리
  - 에러 상태 처리

- **Supabase 데이터베이스 개선**
  - 스키마 분석 및 마이그레이션 (14→11 테이블)
  - `post_tags` 테이블 제거 (중복)
  - `services` 테이블 완전한 구조 (11개 컬럼)
  - `service_categories` 개선 (icon, is_active 추가)
  - RLS (Row Level Security) 정책 10개 설정
  - 인덱스 최적화 (category_id, status, created_at)
  - 샘플 서비스 3개 삽입 (AI 도구, 데이터 분석, 컨설팅)
  - Phase 9-10 테이블 검증 및 보강
  - 자동 updated_at 트리거

- **타입 정의**
  - `src/types/database.ts` - 전체 Supabase 스키마 타입
  - INSERT/UPDATE 헬퍼 타입
  - JOIN용 확장 타입 (ServiceWithCategory, OrderWithItems 등)

- **문서**
  - `docs/database/` - 데이터베이스 문서 (8개 파일)
  - `docs/database/migration-guide.md` - 마이그레이션 가이드
  - `docs/database/schema-analysis-report.md` - 스키마 분석
  - `docs/database/SCHEMA-IMPROVEMENT-SUMMARY.md` - 개선 요약
  - `docs/guides/phase-8-completion-summary.md` - Phase 8 완료 보고서
  - `scripts/extract-schema.js` - 스키마 자동 추출 스크립트

- **Dependencies**
  - `react-helmet-async` (v2.x) - SEO 메타 태그 관리

### Changed
- **Header 컴포넌트**
  - 로고 영역을 Link로 변경 (홈으로 이동)
  - "서비스" 메뉴 추가
  - "시작하기" 버튼이 /services로 이동
  - 홈페이지 여부에 따라 앵커/Link 동적 전환

- **App.tsx**
  - HelmetProvider 추가 (SEO)
  - `/services` 라우트 추가
  - `/services/:id` 동적 라우트 추가

- **빌드 크기**
  - CSS: 70.13 kB → 74.57 kB (+4.44 kB)
  - JS: 374.71 kB → 617.86 kB (+243.15 kB, gzip: +70.61 kB)
  - Total (gzip): 130.11 kB → 201.20 kB (+71.09 kB)

### Fixed
- Supabase 클라이언트 import 경로 수정 (`@/lib/supabase` → `@/integrations/supabase/client`)

---

## [1.3.0] - 2025-10-12

### Added
- **Phase 7: 디자인 시스템 적용** 🎉
  - 디자인 시스템 문서 (`docs/guides/design-system/README.md`)
  - Tailwind CSS 브랜드 색상 (Primary, Accent, Secondary)
  - CSS 변수 시스템 (Light/Dark 테마)
  - 다크 모드 훅 (`useTheme`)
  - 테마 토글 컴포넌트 (`ThemeToggle`)
  - 글래스모피즘 스타일 (`glass-card`)
  - 그라데이션 배경 (`gradient-bg`)
  - 호버 효과 (`hover-lift`)
  - Google Fonts 통합 (Inter, JetBrains Mono)
  - 8px 그리드 시스템
  - shadcn/ui 다크 모드 대응

### Changed
- Header에 ThemeToggle 추가
- Index 페이지에 그라데이션 배경 적용
- 모든 Card 컴포넌트에 glass-card 스타일 적용

---

## [1.2.0] - 2025-10-11

### Added
- **기본 UI 컴포넌트**
  - Header, Hero, Services, Features
  - About, Contact, Footer
  - shadcn/ui 통합 (18개 컴포넌트)

### Changed
- ESLint 에러 수정
- TypeScript 타입 에러 수정

### Removed
- 중복 파일 제거
- .gitignore 업데이트 (불필요한 파일 제외)

---

## [1.1.0] - 2025-10-10

### Added
- **OAuth 인증 시스템**
  - Google OAuth
  - GitHub OAuth
  - Kakao OAuth
  - Supabase Auth 통합

### Added
- **DevOps 인프라**
  - GitHub Actions 워크플로우 (7개)
  - Vercel 자동 배포
  - 브랜치 전략 (main/staging/develop)
  - 환경 변수 관리

---

## [1.0.0] - 2025-10-09

### Added
- **프로덕션 배포** 🎉
  - Vercel 배포 성공
  - 프로덕션 URL: https://www.ideaonaction.ai/
  - React 18 + TypeScript 프로젝트 구조
  - Vite 빌드 시스템

### Added
- **프로젝트 초기 설정**
  - GitHub 저장소 생성
  - Supabase 프로젝트 연결
  - 기본 로고 및 브랜딩

---

## Version Format

```
MAJOR.MINOR.PATCH

MAJOR: Phase 완료, Breaking Changes (2.0.0, 3.0.0...)
MINOR: 주요 기능 추가 (1.1.0, 1.2.0...)
PATCH: 버그 수정, 문서 업데이트 (1.0.1, 1.0.2...)
```

---

## Related Documents

- [Roadmap](./roadmap.md) - 프로젝트 로드맵
- [Versioning Guide](../versioning/README.md) - 버전 관리 가이드
- [CLAUDE.md](../../CLAUDE.md) - 프로젝트 메인 문서
