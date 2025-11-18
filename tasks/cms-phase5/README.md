# CMS Phase 5: Tasks (작업 분해)

**Version**: 2.1.0
**Created**: 2025-11-17
**Status**: Ready for Implementation
**Methodology**: SDD (Spec-Driven Development) - Stage 3 (Tasks)

---

## 개요

CMS Phase 5의 구현 작업을 **1~3시간 단위**로 분해한 Sprint 문서 모음입니다. 각 태스크는 독립적으로 구현 가능하며, 명확한 완료 기준을 포함합니다.

---

## Sprint 문서

### [Sprint 1: 미디어 라이브러리](./sprint-1.md)
**기간**: 3-4일
**태스크**: 19개
**예상 시간**: 32-36시간
**E2E 테스트**: 20개

**핵심 기능**:
- Supabase Storage bucket 설정
- react-dropzone 업로드 UI
- 미디어 갤러리 (그리드 뷰, 검색, 필터링)
- 이미지 최적화 (sharp, WebP, thumbnail)

**주요 태스크**:
- TASK-001 ~ TASK-005: Database 설정 (5개)
- TASK-006 ~ TASK-010: Upload UI (5개)
- TASK-011 ~ TASK-015: Gallery UI (5개)
- TASK-016 ~ TASK-019: Optimization (4개)

---

### [Sprint 2: 리치 텍스트 에디터](./sprint-2.md)
**기간**: 3-4일
**태스크**: 19개
**예상 시간**: 38-42시간
**E2E 테스트**: 25개

**핵심 기능**:
- Tiptap WYSIWYG 에디터
- 기본 extensions (Bold, Italic, Link, Heading)
- 고급 extensions (Image, CodeBlock, Markdown)
- Admin 페이지 통합 (Portfolio, Lab, Blog)

**주요 태스크**:
- TASK-020 ~ TASK-024: Tiptap 기본 (5개)
- TASK-025 ~ TASK-029: 고급 기능 (5개)
- TASK-030 ~ TASK-034: Admin 통합 (5개)
- TASK-035 ~ TASK-038: 최적화 (4개)

---

### [Sprint 3: 버전 관리 시스템](./sprint-3.md)
**기간**: 2-3일
**태스크**: 16개 (선택 2개 포함)
**예상 시간**: 28-32시간
**E2E 테스트**: 15개

**핵심 기능**:
- content_versions 테이블 (버전 히스토리)
- 자동 저장 (30초 디바운싱)
- 버전 비교 (diff-match-patch)
- 버전 복원 (이전 버전으로 되돌리기)

**주요 태스크**:
- TASK-039 ~ TASK-043: Database 설정 (5개)
- TASK-044 ~ TASK-048: 자동 저장 (5개)
- TASK-049 ~ TASK-054: 버전 히스토리 (6개)
- TASK-055 ~ TASK-056: 선택적 작업 (2개)

---

## 전체 통계

| 항목 | Sprint 1 | Sprint 2 | Sprint 3 | **합계** |
|------|----------|----------|----------|----------|
| **태스크** | 19개 | 19개 | 16개 | **54개** |
| **예상 시간** | 32-36h | 38-42h | 28-32h | **98-110h** |
| **E2E 테스트** | 20개 | 25개 | 15개 | **60개** |
| **컴포넌트** | 6개 | 6개 | 3개 | **15개** |
| **React 훅** | 4개 | 5개 | 3개 | **12개** |
| **마이그레이션** | 3개 | 0개 | 4개 | **7개** |
| **문서** | 6개 | 8개 | 6개 | **20개** |

---

## 작업 진행 방법

### 1. Sprint 선택
- Sprint 1 → Sprint 2 → Sprint 3 순서 권장
- Sprint 2는 Sprint 1 (미디어 라이브러리) 완료 후 시작 권장
- Sprint 3는 독립적으로 시작 가능

### 2. 태스크 선택
- 각 Sprint 문서에서 하나의 태스크 선택
- 의존성 확인 (Dependencies 섹션)
- 예상 시간 확인 (1~3시간)

### 3. 새 대화 시작
- **중요**: 각 태스크마다 새 대화(세션) 시작
- 이전 대화의 컨텍스트 오염 방지
- 관련 명세/플랜/태스크 파일만 공유

### 4. 구현
- TDD (Test-Driven Development) 적용
- Red → Green → Refactor 사이클
- 완료 기준 체크리스트 확인

### 5. 테스트
- 단위 테스트 실행
- E2E 테스트 실행 (해당 시)
- 린트/타입 에러 확인

### 6. 커밋
- 작은 단위로 커밋
- 커밋 메시지에 태스크 ID 포함
- 예시: `[TASK-001] Supabase Storage bucket 생성`

---

## 태스크 템플릿

각 태스크는 다음 형식을 따릅니다:

```markdown
### [TASK-XXX] Task Title (예상 시간: 1-3시간)

**설명**: 태스크 설명
**우선순위**: 높음/중간/낮음
**의존성**: 선행 태스크 ID (있는 경우)
**담당**: Developer

**작업 내용**:
1. 구체적 작업 1
2. 구체적 작업 2
3. 구체적 작업 3

**완료 기준**:
- [ ] 기준 1
- [ ] 기준 2
- [ ] 기준 3

**테스트**:
- [ ] 단위 테스트 작성
- [ ] E2E 테스트 작성

**관련 파일**:
- `path/to/file1.tsx`
- `path/to/file2.ts`
```

---

## 의존성 그래프

### Sprint 1 Critical Path
```
TASK-001 (Bucket) → TASK-002 (RLS) → TASK-005 (Env)
                                    → TASK-008 (Upload Hook)
                                    → TASK-016 (Edge Function)
                                    → TASK-017 (Thumbnail)
```

### Sprint 2 Critical Path
```
TASK-020 (Install) → TASK-021 (TiptapEditor) → TASK-024 (useEditor Hook)
                                              → TASK-029 (MarkdownSync)
                                              → TASK-030~032 (Admin 통합)
```

### Sprint 3 Critical Path
```
TASK-039 (Schema) → TASK-040 (Migration) → TASK-045 (AutoSave Hook)
                                          → TASK-049 (VersionHistory)
                                          → TASK-053 (VersionRestore)
```

---

## 병렬 작업 가능 태스크

### Sprint 1
- **Day 1**: TASK-001, TASK-003 (병렬 가능)
- **Day 2**: TASK-006, TASK-009 (병렬 가능)
- **Day 3**: TASK-011, TASK-012 (병렬 가능)

### Sprint 2
- **Day 1**: TASK-020, TASK-023 (병렬 가능)
- **Day 2**: TASK-025, TASK-026 (병렬 가능)
- **Day 3**: TASK-030, TASK-031, TASK-032 (병렬 가능)

### Sprint 3
- **Day 1**: TASK-039, TASK-042 (병렬 가능)
- **Day 2**: TASK-044, TASK-046 (병렬 가능)
- **Day 3**: TASK-049, TASK-050 (병렬 가능)

---

## 품질 기준

### 코드 품질
- [ ] TypeScript strict mode (에러 0개)
- [ ] ESLint 경고 0개
- [ ] Prettier 포맷 적용
- [ ] 단위 테스트 커버리지 80% 이상

### 성능
- [ ] Lighthouse 성능 점수 90+ 유지
- [ ] 초기 번들 gzip 증가 10 kB 이내
- [ ] PWA precache 증가 500 kB 이내

### 접근성
- [ ] WCAG 2.1 AA 준수
- [ ] 키보드 탐색 가능
- [ ] ARIA 레이블 추가
- [ ] axe-core 테스트 통과

### 보안
- [ ] XSS 방지 (DOMPurify)
- [ ] CSRF 방지 (Supabase RLS)
- [ ] SQL Injection 방지 (Prepared Statements)
- [ ] 민감 데이터 암호화

---

## 문서 업데이트 체크리스트

각 Sprint 완료 후:

- [ ] `CLAUDE.md` - 최신 업데이트 섹션 추가
- [ ] `project-todo.md` - 완료 항목 체크
- [ ] `docs/project/changelog.md` - 변경 로그 추가
- [ ] `docs/project/roadmap.md` - 진행률 업데이트
- [ ] Sprint별 완료 보고서 작성 (docs/archive/)

---

## 관련 문서

### Spec (Stage 1)
- [spec/cms-phase5/requirements.md](../../spec/cms-phase5/requirements.md)
- [spec/cms-phase5/acceptance-criteria.md](../../spec/cms-phase5/acceptance-criteria.md)
- [spec/cms-phase5/constraints.md](../../spec/cms-phase5/constraints.md)

### Plan (Stage 2)
- [plan/cms-phase5/architecture.md](../../plan/cms-phase5/architecture.md)
- [plan/cms-phase5/tech-stack.md](../../plan/cms-phase5/tech-stack.md)
- [plan/cms-phase5/implementation-strategy.md](../../plan/cms-phase5/implementation-strategy.md)

### Constitution
- [constitution.md](../../constitution.md)

---

## 다음 단계

### Sprint 1 시작하기
```bash
# 1. Sprint 1 문서 읽기
cat tasks/cms-phase5/sprint-1.md

# 2. 첫 태스크 확인 (TASK-001)
# 3. 새 대화 시작
# 4. 태스크 구현
# 5. 테스트 및 커밋
```

### 진행률 추적
- [ ] Sprint 1: 미디어 라이브러리 (0/19 태스크)
- [ ] Sprint 2: 리치 텍스트 에디터 (0/19 태스크)
- [ ] Sprint 3: 버전 관리 시스템 (0/16 태스크)

---

**Ready to start implementing!**

각 Sprint 문서를 열어 태스크를 확인하고, SDD 프로세스에 따라 작업을 시작하세요.
