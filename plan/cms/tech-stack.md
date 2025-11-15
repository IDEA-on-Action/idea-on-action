# CMS 관리자 모드 기술 스택

**작성일**: 2025-11-15
**버전**: 1.0
**담당자**: Sinclair Seo

---

## 1. 프론트엔드 스택

### 1.1 Core
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **React** | 18+ | UI 프레임워크 | 기존 프로젝트 스택, Hooks, Suspense |
| **TypeScript** | 5+ | 타입 시스템 | 타입 안전성, IntelliSense |
| **Vite** | 5+ | 번들러 | 빠른 HMR, 작은 번들 크기 |
| **React Router** | 6+ | 라우팅 | 기존 프로젝트 스택, Lazy Loading |

### 1.2 UI & Styling
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **Tailwind CSS** | 3.4+ | CSS 프레임워크 | 기존 디자인 시스템 재사용 |
| **shadcn/ui** | Latest | UI 컴포넌트 | 기존 컴포넌트 라이브러리 재사용 |
| **Radix UI** | Latest | Headless UI | shadcn/ui 기반 컴포넌트 |
| **Lucide Icons** | Latest | 아이콘 | shadcn/ui 기본 아이콘 |

### 1.3 상태 관리
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **React Query** | 5+ | 서버 상태 관리 | 기존 프로젝트 스택, 캐싱, 낙관적 업데이트 |
| **Zustand** | 4+ | 클라이언트 상태 관리 | 경량, 간단한 API |

### 1.4 폼 관리
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **React Hook Form** | 7+ | 폼 관리 | 기존 프로젝트 스택, 성능 우수 |
| **Zod** | 3+ | 스키마 검증 | TypeScript 네이티브, 기존 프로젝트 스택 |

### 1.5 리치 텍스트 에디터
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **Tiptap** | 2+ | WYSIWYG 에디터 | React 친화적, 확장 가능, Markdown 지원 |
| **@tiptap/starter-kit** | Latest | 기본 Extension | Heading, Bold, Italic, Link 등 |
| **@tiptap/extension-code-block-lowlight** | Latest | 코드 블록 | 문법 하이라이팅 |
| **lowlight** | Latest | 문법 하이라이팅 | highlight.js 기반 |

**대안 고려**:
- **Lexical** (Facebook 제작, 최신 기술, 러닝 커브 높음)
- **Slate** (완전한 커스터마이징, 복잡도 높음)

---

## 2. 백엔드 스택

### 2.1 Database
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **Supabase** | Latest | BaaS | 기존 인프라, PostgreSQL, Auth, Storage 통합 |
| **PostgreSQL** | 15+ | 관계형 DB | Supabase 기본 DB |

### 2.2 인증
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **Supabase Auth** | Latest | 인증/인가 | 기존 프로젝트 스택, RLS 통합 |

### 2.3 스토리지
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **Supabase Storage** | Latest | 파일 스토리지 | 기존 프로젝트 스택, RLS 통합 |

---

## 3. 개발 도구

### 3.1 코드 품질
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **ESLint** | 9+ | Linter | 기존 프로젝트 스택, 코드 일관성 |
| **Prettier** | 3+ | 포맷터 | 기존 프로젝트 스택, 자동 포맷 |
| **TypeScript ESLint** | Latest | TS Linter | TypeScript 전용 규칙 |

### 3.2 테스트
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **Vitest** | 3+ | 유닛 테스트 | 기존 프로젝트 스택, Vite 네이티브 |
| **Playwright** | 1.48+ | E2E 테스트 | 기존 프로젝트 스택, 크로스 브라우저 |
| **@testing-library/react** | 16+ | 컴포넌트 테스트 | React 공식 추천 |
| **jest-axe** | 10+ | 접근성 테스트 | 기존 프로젝트 스택, WCAG 검증 |

### 3.3 버전 관리
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **Git** | Latest | 버전 관리 | 표준 |
| **GitHub** | - | 호스팅 | 기존 저장소 |
| **Husky** | 9+ | Git Hooks | Pre-commit, Pre-push 자동화 |
| **Conventional Commits** | - | 커밋 규칙 | 변경 로그 자동 생성 |

---

## 4. CI/CD & 배포

### 4.1 호스팅
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **Vercel** | Latest | 프론트엔드 호스팅 | 기존 인프라, 자동 배포 |

### 4.2 CI/CD
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **GitHub Actions** | - | CI/CD 파이프라인 | 기존 프로젝트 스택, 무료 |
| **Lighthouse CI** | Latest | 성능 테스트 | 기존 프로젝트 스택, Performance 측정 |

---

## 5. 모니터링 & 분석

### 5.1 에러 추적
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **Sentry** | Latest | 에러 추적 | 기존 프로젝트 스택, Session Replay |

### 5.2 분석
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **Google Analytics 4** | Latest | 사용자 분석 | 기존 프로젝트 스택, 무료 |
| **Vercel Analytics** | Latest | 성능 분석 | Vercel 내장, Real User Monitoring |

---

## 6. 유틸리티 라이브러리

### 6.1 날짜/시간
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **date-fns** | 3+ | 날짜 포맷 | 경량, Tree-shakable |

### 6.2 보안
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **DOMPurify** | 3+ | HTML 새니타이징 | XSS 방지, 표준 라이브러리 |

### 6.3 파일 처리
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **uuid** | 10+ | UUID 생성 | 고유 파일명 생성 |

### 6.4 알림
| 기술 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **sonner** | Latest | 토스트 알림 | shadcn/ui 기본 Toast 라이브러리 |

---

## 7. 개발 환경

### 7.1 IDE
| 도구 | 버전 | 용도 | 추천 확장 |
|------|------|------|----------|
| **VS Code** | Latest | 코드 에디터 | ESLint, Prettier, Tailwind CSS IntelliSense |

### 7.2 브라우저
| 브라우저 | 버전 | 용도 | 비고 |
|----------|------|------|------|
| **Chrome** | Latest | 개발/테스트 | DevTools |
| **Firefox** | Latest | 크로스 브라우저 테스트 | |
| **Safari** | Latest | 크로스 브라우저 테스트 | |

---

## 8. 패키지 관리

### 8.1 패키지 매니저
| 도구 | 버전 | 용도 | 선택 이유 |
|------|------|------|-----------|
| **npm** | 10+ | 패키지 관리 | Node.js 기본 |

### 8.2 주요 Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "@tanstack/react-query": "^5.62.3",
    "@supabase/supabase-js": "^2.47.10",
    "zustand": "^4.5.5",
    "react-hook-form": "^7.54.0",
    "zod": "^3.23.8",
    "@tiptap/react": "^2.10.3",
    "@tiptap/starter-kit": "^2.10.3",
    "tailwindcss": "^3.4.17",
    "lucide-react": "^0.462.0",
    "date-fns": "^3.6.0",
    "dompurify": "^3.2.2",
    "uuid": "^10.0.0",
    "sonner": "^1.7.1"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "vite": "^5.4.11",
    "eslint": "^9.15.0",
    "prettier": "^3.3.3",
    "vitest": "^3.2.1",
    "@playwright/test": "^1.48.2",
    "@testing-library/react": "^16.1.0",
    "jest-axe": "^10.0.0"
  }
}
```

---

## 9. 아키텍처 패턴

### 9.1 디렉토리 구조 패턴
- **Feature-based**: `/admin/pages/roadmap/`, `/admin/pages/portfolio/`
- **Layer-based**: `/components/`, `/hooks/`, `/services/`, `/stores/`

### 9.2 컴포넌트 패턴
- **Compound Components**: Sidebar, Table
- **Render Props**: Table 행 렌더링
- **Custom Hooks**: useCRUD, usePermissions, useFileUpload

### 9.3 상태 관리 패턴
- **서버 상태**: React Query (useQuery, useMutation)
- **클라이언트 상태**: Zustand (UI 상태, 사이드바 토글 등)
- **폼 상태**: React Hook Form (분리된 폼 상태)

---

## 10. 성능 목표

### 10.1 Lighthouse 점수 목표
| 항목 | 목표 | 현재 | 측정 방법 |
|------|------|------|----------|
| **Performance** | 90+ | - | Lighthouse CI |
| **Accessibility** | 95+ | - | Lighthouse CI |
| **Best Practices** | 95+ | - | Lighthouse CI |
| **SEO** | 90+ | - | Lighthouse CI |

### 10.2 Core Web Vitals 목표
| 지표 | 목표 | 설명 |
|------|------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 주요 콘텐츠 로딩 시간 |
| **FID** (First Input Delay) | < 100ms | 사용자 입력 반응 시간 |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 레이아웃 이동 |

### 10.3 번들 크기 목표
| 청크 | 목표 크기 (gzip) | 비고 |
|------|------------------|------|
| **Main** | < 100 KB | React, React Router |
| **Admin** | < 300 KB | 관리자 페이지 전체 |
| **Vendor** | < 200 KB | 외부 라이브러리 |

---

## 11. 보안 도구

### 11.1 의존성 검사
| 도구 | 용도 | 주기 |
|------|------|------|
| **npm audit** | 의존성 취약점 검사 | 주 1회 |
| **Dependabot** | 의존성 자동 업데이트 | GitHub 자동 |

### 11.2 코드 스캔
| 도구 | 용도 | 주기 |
|------|------|------|
| **CodeQL** | 코드 보안 스캔 | PR마다 |
| **Supabase Security Advisor** | RLS 정책 검사 | 수동 |

---

## 12. 문서화 도구

### 12.1 문서 생성
| 도구 | 용도 | 비고 |
|------|------|------|
| **Markdown** | 명세서, 가이드 | GitHub 렌더링 |
| **Mermaid** | 다이어그램 | ERD, 플로우차트 |

### 12.2 API 문서 (선택)
| 도구 | 용도 | 비고 |
|------|------|------|
| **Storybook** | 컴포넌트 문서화 | 선택 사항 |
| **TypeDoc** | TypeScript API 문서 | 선택 사항 |

---

**작성자**: Sinclair Seo (with Claude)
**다음 문서**: [implementation-strategy.md](./implementation-strategy.md)
