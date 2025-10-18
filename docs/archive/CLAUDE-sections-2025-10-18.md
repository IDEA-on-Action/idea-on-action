# CLAUDE.md 아카이브 섹션

> 2025-10-18 아카이빙
> CLAUDE.md 슬림화를 위해 이동된 상세 섹션들

---

## 🔢 버전 관리 (상세)

### Semantic Versioning

**형식**: `Major.Minor.Patch`

**현재 버전**: 1.5.0

### 버전 업 기준
- **Major (x.0.0)**: Phase 완료, Breaking Changes (v2.0.0, v3.0.0...)
- **Minor (0.x.0)**: 주요 기능 추가 (v1.4.0, v1.5.0...)
- **Patch (0.0.x)**: 버그 수정, 문서 업데이트 (v1.3.1, v1.3.2...)

### 릴리스 프로세스

**로컬 실행**:
```bash
npm run release:patch   # 1.3.0 → 1.3.1
npm run release:minor   # 1.3.0 → 1.4.0
npm run release:major   # 1.3.0 → 2.0.0
npm run release:dry     # 미리보기 (Dry run)
```

**GitHub Actions** (수동 트리거):
1. GitHub 저장소 → Actions 탭
2. "Release" 워크플로우 선택
3. "Run workflow" 클릭
4. 버전 타입 선택 (major/minor/patch)
5. 자동으로 CHANGELOG.md 생성 및 GitHub Release 생성

### Conventional Commits

커밋 메시지 형식:
```
<type>(<scope>): <subject>

예시:
feat(services): add service list page
fix(cart): resolve quantity update bug
docs(readme): update installation guide
```

**Type 종류**:
- `feat`: 새로운 기능 (Minor)
- `fix`: 버그 수정 (Patch)
- `docs`: 문서 변경 (Patch)
- `refactor`: 리팩토링 (Patch)
- `chore`: 기타 작업 (버전 영향 없음)

**상세 가이드**: [docs/versioning/README.md](../versioning/README.md)

### 버전-로드맵 매핑

- **v1.4.0-v2.0.0**: Phase 8 (서비스 페이지)
- **v2.1.0-v3.0.0**: Phase 9 (전자상거래)
- **v4.0.0**: Phase 10 (SSO 강화)
- **v5.0.0**: Phase 11 (콘텐츠 관리)
- **v6.0.0**: Phase 12 (고도화)

**전체 매핑**: [docs/versioning/version-roadmap-mapping.md](../versioning/version-roadmap-mapping.md)

---

## 📁 프로젝트 구조 (전체)

```
IdeaonAction-Homepage/
├── src/                          # 소스 코드 ⭐
│   ├── components/               # React 컴포넌트
│   │   ├── ui/                   # shadcn/ui 컴포넌트 (18개)
│   │   │   ├── accordion.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx         # ✨ 다크 모드 적용
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── badge.tsx
│   │   ├── shared/               # 공용 컴포넌트 ⭐
│   │   │   └── ThemeToggle.tsx  # 테마 토글 버튼
│   │   ├── Header.tsx            # ✨ 글래스모피즘 + ThemeToggle
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── Features.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── pages/                    # 페이지 컴포넌트
│   │   ├── Index.tsx             # ✨ 그라데이션 배경 적용
│   │   ├── NotFound.tsx
│   │   ├── ServiceList.tsx       # 서비스 목록
│   │   ├── ServiceDetail.tsx     # 서비스 상세
│   │   ├── Login.tsx             # 로그인
│   │   ├── Forbidden.tsx         # 403 에러
│   │   └── admin/                # 관리자 페이지
│   │       ├── Dashboard.tsx
│   │       ├── AdminServices.tsx
│   │       ├── CreateService.tsx
│   │       └── EditService.tsx
│   ├── hooks/                    # 커스텀 훅 ⭐
│   │   ├── useTheme.ts           # 다크 모드 훅
│   │   ├── useAuth.ts            # 인증 상태 관리
│   │   ├── useIsAdmin.ts         # 관리자 권한 확인
│   │   ├── useServices.ts        # 서비스 데이터 조회
│   │   └── useServiceDetail.ts   # 서비스 상세 조회
│   ├── lib/                      # 유틸리티
│   │   ├── utils.ts
│   │   └── supabase.ts
│   ├── types/                    # TypeScript 타입
│   │   └── database.ts           # Supabase 스키마 타입
│   ├── assets/                   # 정적 자산
│   │   ├── logo-symbol.png
│   │   └── logo-full.png
│   ├── App.tsx                   # 앱 진입점
│   ├── main.tsx                  # React 렌더링
│   └── index.css                 # ✨ 디자인 시스템 CSS 변수
│
├── docs/                         # 프로젝트 문서 ⭐
│   ├── README.md                 # 문서 인덱스
│   ├── guides/                   # 실무 가이드
│   │   ├── design-system/        # 디자인 시스템
│   │   │   ├── README.md         # 디자인 가이드
│   │   │   └── reference.md      # 참고 자료
│   │   ├── testing/              # 테스트 가이드
│   │   │   ├── test-user-setup.md
│   │   │   └── quick-start.md
│   │   ├── deployment/           # 배포 가이드
│   │   │   ├── vercel.md
│   │   │   └── github-actions.md
│   │   ├── setup/                # 초기 설정
│   │   │   ├── github-secrets.md
│   │   │   └── oauth-callback.md
│   │   ├── database/             # DB 스키마 & 마이그레이션
│   │   │   ├── schema.md
│   │   │   ├── migration-guide.md
│   │   │   └── rls-policies.md
│   │   ├── auth/                 # 인증 가이드
│   │   │   ├── oauth-setup.md
│   │   │   └── admin-setup.md
│   │   └── storage/              # 스토리지 가이드
│   │       └── setup.md
│   ├── project/                  # 프로젝트 관리
│   │   ├── roadmap.md
│   │   ├── changelog.md
│   │   └── phase-9-plan.md
│   ├── versioning/               # 버전 관리
│   │   ├── README.md
│   │   └── version-roadmap-mapping.md
│   ├── components/               # 컴포넌트 문서
│   │   ├── README.md
│   │   ├── Features.md
│   │   ├── Footer.md
│   │   ├── Header.md
│   │   ├── Hero.md
│   │   └── Services.md
│   ├── devops/                   # DevOps 가이드
│   │   ├── branch-strategy.md
│   │   ├── deployment-guide.md
│   │   ├── github-setup.md
│   │   └── deployment-checklist.md
│   └── archive/                  # 히스토리 보관
│       ├── CLAUDE-full-2025-10-09.md
│       ├── project-todo-full-2025-10-09.md
│       ├── CLAUDE-sections-2025-10-18.md
│       └── completed-phases-2025-10-18.md
│
├── tests/                        # 테스트 파일
│   ├── e2e/                      # E2E 테스트
│   │   ├── admin/                # 관리자 테스트 (35개)
│   │   │   ├── dashboard.spec.ts    # 7개 (100% 통과)
│   │   │   ├── service-crud.spec.ts # 15개
│   │   │   └── image-upload.spec.ts # 12개
│   │   ├── public/               # 공개 페이지 테스트
│   │   │   ├── homepage.spec.ts     # 12개 (91.7% 통과)
│   │   │   ├── login.spec.ts        # 7개
│   │   │   └── services.spec.ts     # 11개
│   │   ├── visual/               # 시각적 회귀 테스트 (28개)
│   │   │   ├── dark-mode.spec.ts    # 8개 (87.5% 통과)
│   │   │   └── responsive.spec.ts   # 20개 (65% 통과)
│   │   └── helpers/              # 테스트 헬퍼
│   │       └── auth.ts
│   ├── fixtures/                 # 테스트 픽스처
│   │   ├── users.ts
│   │   ├── services.ts
│   │   └── images.ts
│   └── unit/                     # 유닛 테스트 (15개, 100% 통과)
│       ├── hooks/
│       │   ├── useAuth.test.ts
│       │   └── useServices.test.tsx
│       └── components/
│           ├── Features.test.tsx
│           ├── Footer.test.tsx
│           ├── Header.test.tsx
│           ├── Hero.test.tsx
│           └── Services.test.tsx
│
├── scripts/                      # 개발 스크립트
│   ├── extract-schema.js         # Supabase 스키마 추출
│   ├── run-sub-agent.bat         # Sub-agent 실행 (Windows)
│   ├── run-sub-agent.ps1         # Sub-agent 실행 (PowerShell)
│   ├── sub-agent-runner.js       # Sub-agent 러너
│   ├── sub-agent-templates.js    # Sub-agent 템플릿
│   └── doc-maintenance-agent.js  # 문서 현행화 에이전트
│
├── public/                       # 공개 정적 파일
│   ├── logo-symbol.png
│   ├── logo-full.png
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   └── site.webmanifest
│
├── dist/                         # 빌드 결과물 (gitignore)
│
├── .github/                      # GitHub 설정
│   └── workflows/                # GitHub Actions
│       ├── deploy.yml
│       ├── test.yml
│       └── release.yml
│
├── package.json                  # 의존성 관리
├── tsconfig.json                 # TypeScript 설정
├── tailwind.config.ts            # Tailwind CSS 설정
├── vite.config.ts                # Vite 설정
├── vitest.config.ts              # Vitest 설정
├── playwright.config.ts          # Playwright 설정
├── repomix.config.json           # Repomix 설정
├── index.html                    # HTML 진입점
├── .gitignore                    # Git ignore
├── .env.local                    # 환경 변수 (gitignore)
├── CLAUDE.md                     # 프로젝트 메인 문서
├── project-todo.md               # TODO 목록
└── README.md                     # GitHub README
```

---

## 참고

이 문서는 CLAUDE.md의 상세 섹션들을 보관한 아카이브입니다.
최신 정보는 [CLAUDE.md](../../CLAUDE.md)를 참고하세요.
