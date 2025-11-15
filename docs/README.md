# 📚 IDEA on Action 문서 가이드

> 프로젝트 문서 전체 인덱스 및 탐색 가이드

**업데이트**: 2025-11-16 (문서 구조 통합 정리)

---

## 📂 문서 구조 (2025-11-16 통합 완료)

```
docs/
├── README.md (이 파일)       # 문서 인덱스
├── guides/                   # 실무 가이드 ⭐ 통합
│   ├── analytics/            # 분석 도구 (GA4, Sentry)
│   ├── auth/                 # 인증 시스템 (OAuth, 2FA)
│   ├── cms/                  # CMS 관리자 모드
│   ├── components/           # 컴포넌트 가이드 (신규)
│   ├── database/             # 데이터베이스 스키마
│   ├── deployment/           # 배포 가이드 (DevOps 통합)
│   ├── design-system/        # 디자인 시스템
│   ├── external-services/    # 외부 서비스 연동
│   ├── storage/              # 파일 저장소
│   ├── testing/              # 테스트 가이드
│   └── versioning/           # 버전 관리 (신규)
├── reports/                  # 분석 보고서 ⭐ 신규
│   ├── performance/          # 성능 분석
│   └── refactoring/          # 리팩토링 보고서
├── archive/                  # 히스토리 보관 ⭐ 확장
│   ├── daily-summaries/      # 일일 작업 요약
│   ├── hotfixes/             # 긴급 수정 기록
│   ├── deployments/          # 배포 기록
│   ├── blog/                 # 블로그 초안
│   ├── analysis-reports/     # 과거 분석 보고서
│   ├── phase-plans/          # Phase 계획 문서
│   ├── v1.5.0-summaries/     # v1.5.0 요약
│   └── v2.0-planning/        # v2.0 기획
├── project/                  # 프로젝트 관리
│   ├── roadmap.md            # 로드맵
│   └── changelog.md          # 변경 로그
├── database/                 # 데이터베이스 (유지)
│   └── migrations/           # 마이그레이션 파일
├── testing/                  # 테스트 전략 (유지)
└── payments/                 # 결제 시스템 (유지)
```

### 2025-11-16 통합 변경 사항

**통합된 폴더** (9개 → 3개):
- \`devops/\` → \`guides/deployment/\` (5개 파일)
- \`components/\` → \`guides/components/\` (6개 파일)
- \`versioning/\` → \`guides/versioning/\` (2개 파일)
- \`performance/\` → \`reports/performance/\` (2개 파일)
- \`refactoring/\` → \`reports/refactoring/\` (6개 파일)
- \`summary/\` → \`archive/daily-summaries/\` (4개 파일)
- \`hotfix/\` → \`archive/hotfixes/\` (1개 파일)
- \`deployment/\` → \`archive/deployments/\` (4개 파일)
- \`blog/\` → \`archive/blog/\` (2개 파일)

**새로 생성된 폴더**:
- \`reports/\` - 성능/리팩토링 보고서
- \`guides/components/\` - 컴포넌트 사용 가이드
- \`guides/versioning/\` - 버전 관리 가이드
- \`archive/daily-summaries/\` - 일일 요약
- \`archive/hotfixes/\` - 긴급 수정
- \`archive/deployments/\` - 배포 기록
- \`archive/blog/\` - 블로그 초안

**통합 목적**:
- 일관성 있는 문서 구조 (guides, reports, archive)
- 유사한 문서를 한 곳에 모아 검색성 향상
- 16개 폴더 → 8개 폴더로 단순화

---

## 🎯 빠른 탐색

### 처음 시작하시나요?
1. **[CLAUDE.md](../CLAUDE.md)** - 프로젝트 전체 개요 (필독!)
2. **[guides/setup/](guides/setup/)** - 초기 개발 환경 설정
3. **[guides/deployment/](guides/deployment/)** - 배포 방법

### 개발 중이신가요?
- **[guides/design-system/](guides/design-system/)** - 디자인 시스템 가이드
- **[guides/components/](guides/components/)** - 컴포넌트 사용 가이드 ⭐ 신규
- **[project-todo.md](../project-todo.md)** - 작업 목록
- **[project/changelog.md](project/changelog.md)** - 변경 로그

### 운영 관련
- **[guides/deployment/](guides/deployment/)** - Vercel 배포 (DevOps 통합) ⭐
- **[reports/](reports/)** - 성능/리팩토링 보고서 ⭐ 신규
- **[archive/deployments/](archive/deployments/)** - 과거 배포 기록

---

## 📖 실무 가이드 (guides/)

### 📚 전체 가이드 인덱스
**[guides/README.md](guides/README.md)** 참조

주요 가이드:
- **analytics/** - GA4, Sentry 설정
- **auth/** - OAuth, 2FA 설정
- **cms/** - CMS 관리자 모드 사용법
- **components/** - Header, Footer, Hero 등 컴포넌트 ⭐ 신규
- **database/** - Supabase 스키마 및 마이그레이션
- **deployment/** - Vercel 배포 및 CI/CD ⭐ DevOps 통합
- **design-system/** - 디자인 시스템 가이드
- **external-services/** - 결제, 이메일, 스토리지 연동
- **storage/** - 파일 저장소 관리
- **testing/** - Playwright, Vitest 테스트
- **versioning/** - 버전 관리 및 릴리스 ⭐ 신규

---

## 📊 분석 보고서 (reports/)

### 📚 전체 보고서 인덱스
**[reports/README.md](reports/README.md)** 참조

### 성능 분석 (performance/)
프론트엔드 성능 관련 분석 보고서

**최신 보고서**:
- \`admin-chunk-separation-report.md\` - Admin 코드 분리 (번들 38% 감소)

### 리팩토링 (refactoring/)
코드 리팩토링 관련 보고서

**최신 보고서**:
- \`final-summary-phase1-5-2025-11-16.md\` - Phase 1-5 전체 요약
- \`phase5-selective-optimization-2025-11-16.md\` - 선택적 최적화
- \`phase4-dependencies-cleanup-2025-11-16.md\` - Dependencies 정리
- \`phase3-parallel-summary-2025-11-16.md\` - Vite Bundle 최적화

---

## 📦 히스토리 보관 (archive/)

### 📚 전체 아카이브 인덱스
**[archive/README.md](archive/README.md)** 참조

과거 개발 히스토리, 일일 요약, 배포 기록 보관

**최근 아카이브**:
- \`2025-11-15-work-summary.md\` - 11월 15일 작업 요약
- \`2025-11-15-order-number-fix.md\` - 주문번호 Race Condition 해결
- \`2025-11-15-production-deployment.md\` - 프로덕션 배포 기록

---

## 📊 프로젝트 관리 (project/)

### 로드맵
**파일**: \`project/roadmap.md\`

**최신 상태**: Phase 1-14 완료 ✅, Version 2.0 진행 중 🚀

### 변경 로그
**파일**: \`project/changelog.md\`

**최신 버전**: 2.0.0 (2025-11-16)

---

## 🔗 외부 링크

### 주요 문서
- **[CLAUDE.md](../CLAUDE.md)** - 프로젝트 메인 문서
- **[project-todo.md](../project-todo.md)** - TODO 목록
- **[README.md](../README.md)** - GitHub README

### 외부 참고 자료
- [Vite 문서](https://vitejs.dev/)
- [React 문서](https://react.dev/)
- [Supabase 문서](https://supabase.com/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com/)

---

## 📝 문서 작성 가이드

### 문서 추가 시
1. 적절한 디렉토리 선택 (guides/, reports/, archive/)
2. Markdown 형식 (.md) 사용
3. 관련 폴더의 README.md에 링크 추가

### 문서 분류 기준
- **guides/** - 설정/사용 가이드 (How-to)
- **reports/** - 분석/보고서 (What happened)
- **archive/** - 과거 기록 (History)

---

**Last Updated**: 2025-11-16  
**Project Version**: 2.0.0  
**구조 정리**: 16개 폴더 → 8개 폴더 (통합 완료)
