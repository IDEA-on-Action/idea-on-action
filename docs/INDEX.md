# IDEA on Action 문서 인덱스

**마지막 업데이트**: 2025-11-16
**프로젝트 버전**: 2.0.1
**총 문서 수**: 40+

---

## 📚 문서 카테고리

### 1. CMS 가이드 (docs/guides/cms/)

**Admin 사용자 가이드** (6개, ~56 KB)
- [admin-portfolio-guide.md](guides/cms/admin-portfolio-guide.md) - 프로젝트 관리 (11 KB)
- [admin-lab-guide.md](guides/cms/admin-lab-guide.md) - 바운티 관리 (11 KB)
- [admin-team-guide.md](guides/cms/admin-team-guide.md) - 팀원 관리 (8.8 KB)
- [admin-blog-categories-guide.md](guides/cms/admin-blog-categories-guide.md) - 카테고리 관리 (8.7 KB)
- [admin-tags-guide.md](guides/cms/admin-tags-guide.md) - 태그 관리 (7.9 KB)
- [admin-users-guide.md](guides/cms/admin-users-guide.md) - 관리자 계정 관리 (8.9 KB)

**통합 문서** (3개, ~38 KB)
- [admin-guide.md](guides/cms/admin-guide.md) - 종합 Admin 가이드 (16 KB)
- [architecture.md](guides/cms/architecture.md) - CMS 아키텍처 (14 KB)
- [migration-guide.md](guides/cms/migration-guide.md) - 마이그레이션 가이드 (8.2 KB)

### 2. API 문서 (docs/api/hooks/)

**React 훅 문서** (7개, ~98 KB)
- [useProjects.md](api/hooks/useProjects.md) - 7 hooks (11 KB)
- [useRoadmapItems.md](api/hooks/useRoadmapItems.md) - 8 hooks (12 KB)
- [usePortfolioItems.md](api/hooks/usePortfolioItems.md) - 9 hooks (15 KB)
- [useLabItems.md](api/hooks/useLabItems.md) - 9 hooks (14 KB)
- [useTeamMembers.md](api/hooks/useTeamMembers.md) - 7 hooks (14 KB)
- [useBlogCategories.md](api/hooks/useBlogCategories.md) - 7 hooks (16 KB)
- [useTags.md](api/hooks/useTags.md) - 8 hooks (16 KB)

**총**: 55 hooks, 200+ 코드 예시

### 3. 데이터베이스 가이드 (docs/guides/database/)

**마이그레이션 가이드** (8개)
- [service-categories-migration-guide.md](guides/database/service-categories-migration-guide.md) - service_categories 마이그레이션 (22 KB)
- [user-value-fields-migration.md](guides/database/user-value-fields-migration.md) - user_value_fields 마이그레이션
- [user-value-fields-summary.md](guides/database/user-value-fields-summary.md) - 요약
- [user-value-fields-quick-ref.md](guides/database/user-value-fields-quick-ref.md) - 빠른 참조
- [phase-9-migration-guide.md](guides/database/phase-9-migration-guide.md) - Phase 9 마이그레이션
- [fix-rls-policies-guide.md](guides/database/fix-rls-policies-guide.md) - RLS 정책 수정
- [rls-fix-instructions.md](guides/database/rls-fix-instructions.md) - RLS 수정 지침
- [apply-analytics-functions.md](guides/database/apply-analytics-functions.md) - Analytics 함수 적용

### 4. 배포 가이드 (docs/guides/deployment/)

**CMS Phase 4 배포** (2개)
- [cms-phase4-deployment-checklist.md](guides/deployment/cms-phase4-deployment-checklist.md) - 종합 체크리스트 (71개 항목)
- [cms-phase4-deployment-quick.md](guides/deployment/cms-phase4-deployment-quick.md) - 빠른 참조 (1페이지)

**일반 배포 가이드** (7개)
- [deployment-guide.md](guides/deployment/deployment-guide.md) - Vercel 배포 가이드
- [deployment-checklist.md](guides/deployment/deployment-checklist.md) - 배포 체크리스트
- [branch-strategy.md](guides/deployment/branch-strategy.md) - 브랜치 전략
- [branch-protection-guide.md](guides/deployment/branch-protection-guide.md) - 브랜치 보호 설정
- [github-setup.md](guides/deployment/github-setup.md) - GitHub 설정
- [vercel-deployment-sprint3.md](guides/deployment/vercel-deployment-sprint3.md) - Sprint 3 배포
- [github-actions-optimization.md](guides/deployment/github-actions-optimization.md) - GitHub Actions 최적화

### 5. 테스트 가이드 (docs/guides/testing/)

**E2E 테스트** (2개, ~22 KB)
- [e2e-test-guide.md](guides/testing/e2e-test-guide.md) - E2E 테스트 실행 가이드 (18 KB)
- [e2e-quick-reference.md](guides/testing/e2e-quick-reference.md) - 빠른 참조 (3.6 KB)

**일반 테스트** (4개)
- [test-user-setup.md](guides/testing/test-user-setup.md) - 테스트 사용자 설정
- [quick-start.md](guides/testing/quick-start.md) - 빠른 시작
- [lighthouse-ci.md](guides/testing/lighthouse-ci.md) - Lighthouse CI
- [ci-cd-integration.md](guides/testing/ci-cd-integration.md) - CI/CD 통합

### 6. 프로젝트 문서 (docs/project/)

- [changelog.md](project/changelog.md) - 변경 로그 (72 KB)
- [roadmap.md](project/roadmap.md) - 로드맵

### 7. 아카이브 (docs/archive/)

**최신 아카이브** (2025-11-16)
- [2025-11-16/](archive/2025-11-16/) - CMS Phase 4 검증 보고서
  - service-categories-migration-validation-report.md
  - cms-phase4-completion-summary.md
  - e2e-failure-analysis-2025-11-16.md
  - db-migration-dependency-resolution.md
  - super-admin-system-setup.md
- [completed-todos-v1.8.0-v2.0.0.md](archive/completed-todos-v1.8.0-v2.0.0.md)

---

## 🚀 빠른 시작

### 개발자
- [CLAUDE.md](../CLAUDE.md) - 프로젝트 개발 문서
- [project-todo.md](../project-todo.md) - 할 일 목록
- [E2E 테스트 가이드](guides/testing/e2e-test-guide.md)

### 관리자
- [Admin 종합 가이드](guides/cms/admin-guide.md)
- [Portfolio 관리](guides/cms/admin-portfolio-guide.md)
- [Lab 관리](guides/cms/admin-lab-guide.md)
- [Team 관리](guides/cms/admin-team-guide.md)

### DevOps
- [배포 체크리스트](guides/deployment/cms-phase4-deployment-checklist.md)
- [배포 빠른 참조](guides/deployment/cms-phase4-deployment-quick.md)
- [마이그레이션 가이드](guides/database/service-categories-migration-guide.md)

---

## 📊 문서 통계

| 카테고리 | 파일 수 | 크기 |
|---------|---------|------|
| CMS 가이드 | 9 | ~94 KB |
| API 문서 | 7 | ~98 KB |
| 배포 가이드 | 9 | ~45 KB |
| 테스트 가이드 | 6 | ~30 KB |
| 데이터베이스 | 8 | ~50 KB |
| 프로젝트 | 2 | ~80 KB |
| **합계** | **41+** | **~400 KB** |

---

## 📁 전체 문서 구조

```
docs/
├── INDEX.md (이 파일)          # 📍 전체 문서 인덱스
├── README.md                   # 📚 문서 가이드
├── api/                        # 🔌 API 문서
│   └── hooks/                  # React 훅 (7개, ~98 KB)
├── guides/                     # 📖 실무 가이드
│   ├── analytics/              # 📊 분석 도구
│   ├── auth/                   # 🔐 인증 시스템
│   ├── cms/                    # 💼 CMS 관리 (9개, ~94 KB)
│   ├── components/             # 🧩 컴포넌트 가이드
│   ├── database/               # 🗄️ 데이터베이스 (8개, ~50 KB)
│   ├── deployment/             # 🚀 배포 가이드 (9개, ~45 KB)
│   ├── design-system/          # 🎨 디자인 시스템
│   ├── external-services/      # 🌐 외부 서비스
│   ├── storage/                # 💾 파일 저장소
│   ├── testing/                # 🧪 테스트 가이드 (6개, ~30 KB)
│   └── versioning/             # 📦 버전 관리
├── reports/                    # 📈 분석 보고서
│   ├── performance/            # ⚡ 성능 분석
│   └── refactoring/            # 🔧 리팩토링 보고서
├── archive/                    # 📦 히스토리 보관
│   ├── 2025-11-16/             # 최신 아카이브
│   ├── daily-summaries/        # 일일 작업 요약
│   ├── hotfixes/               # 긴급 수정 기록
│   ├── deployments/            # 배포 기록
│   ├── blog/                   # 블로그 초안
│   ├── analysis-reports/       # 과거 분석 보고서
│   ├── phase-plans/            # Phase 계획 문서
│   ├── v1.5.0-summaries/       # v1.5.0 요약
│   └── v2.0-planning/          # v2.0 기획
└── project/                    # 📋 프로젝트 관리
    ├── roadmap.md              # 로드맵
    └── changelog.md            # 변경 로그 (72 KB)
```

---

## 🔍 문서 검색 팁

### 역할별 추천 문서

**프론트엔드 개발자**
1. [디자인 시스템](guides/design-system/README.md)
2. [컴포넌트 가이드](guides/components/)
3. [API 훅 문서](api/hooks/)

**백엔드 개발자**
1. [데이터베이스 가이드](guides/database/)
2. [외부 서비스 연동](guides/external-services/)
3. [인증 시스템](guides/auth/)

**DevOps/SRE**
1. [배포 체크리스트](guides/deployment/cms-phase4-deployment-checklist.md)
2. [CI/CD 통합](guides/testing/ci-cd-integration.md)
3. [브랜치 전략](guides/deployment/branch-strategy.md)

**QA/테스터**
1. [E2E 테스트 가이드](guides/testing/e2e-test-guide.md)
2. [E2E 빠른 참조](guides/testing/e2e-quick-reference.md)
3. [Lighthouse CI](guides/testing/lighthouse-ci.md)

**콘텐츠 관리자**
1. [Admin 종합 가이드](guides/cms/admin-guide.md)
2. [Portfolio 관리](guides/cms/admin-portfolio-guide.md)
3. [Lab 관리](guides/cms/admin-lab-guide.md)
4. [Team 관리](guides/cms/admin-team-guide.md)

---

## 📝 문서 업데이트 기록

### 2025-11-16
- ✅ CMS Phase 4 문서화 완료 (17개 파일, 186.6 KB)
- ✅ Admin 사용자 가이드 6개 작성
- ✅ API 문서 7개 작성 (55개 훅)
- ✅ DB 마이그레이션 가이드 작성
- ✅ E2E 테스트 가이드 작성 (215개 테스트)
- ✅ 배포 체크리스트 작성 (71개 항목)

### 문서 작성 원칙
1. **명확성**: 단계별 가이드, 스크린샷 포함
2. **완전성**: 실행 가능한 코드 예시, 트러블슈팅
3. **일관성**: Markdown 스타일 가이드 준수
4. **접근성**: 초보자도 이해할 수 있는 설명

---

## 🔗 외부 링크

### 프로젝트 문서
- [CLAUDE.md](../CLAUDE.md) - 프로젝트 개발 문서
- [project-todo.md](../project-todo.md) - 할 일 목록
- [README.md](../README.md) - GitHub README

### 기술 스택 문서
- [Vite 문서](https://vitejs.dev/)
- [React 문서](https://react.dev/)
- [Supabase 문서](https://supabase.com/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com/)
- [Playwright 문서](https://playwright.dev/)

---

**Last Updated**: 2025-11-16
**Version**: v2.0.1
**Total Documents**: 41+
**Total Size**: ~400 KB
