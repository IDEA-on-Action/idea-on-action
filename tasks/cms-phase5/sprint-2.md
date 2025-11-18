# Sprint 2: 리치 텍스트 에디터 (Phase 5-2)

**기간**: 3-4일
**목표**: Tiptap 기반 WYSIWYG 에디터 구축 및 Admin 페이지 통합
**총 태스크**: 19개
**예상 시간**: 38-42시간

---

## Day 1: Tiptap 기본 설정

### [TASK-020] Tiptap 및 extensions 설치 (예상 시간: 1시간)

**설명**: Tiptap 및 필수 extensions 패키지 설치
**우선순위**: 높음
**의존성**: 없음
**담당**: Developer

**작업 내용**:
1. npm install @tiptap/react @tiptap/starter-kit
2. npm install @tiptap/extension-link @tiptap/extension-image
3. npm install @tiptap/extension-code-block-lowlight lowlight
4. npm install @tiptap/extension-placeholder
5. package.json 의존성 확인

**완료 기준**:
- [ ] Tiptap core 설치 완료
- [ ] 8개 extensions 설치 완료
- [ ] TypeScript 타입 정의 확인
- [ ] 빌드 성공

**테스트**:
- [ ] npm run build 성공
- [ ] TypeScript 컴파일 에러 없음

**관련 파일**:
- `package.json`

---

### [TASK-021] TiptapEditor 컴포넌트 기본 구조 (예상 시간: 2시간)

**설명**: Tiptap 에디터 컴포넌트 기본 구조 및 스타일링
**우선순위**: 높음
**의존성**: TASK-020
**담당**: Developer

**작업 내용**:
1. src/components/admin/TiptapEditor.tsx 생성
2. useEditor 훅 초기화 (StarterKit)
3. EditorContent 렌더링
4. Tailwind CSS 스타일링 (prose 클래스)
5. Props 타입 정의 (content, onChange, placeholder)

**완료 기준**:
- [ ] TiptapEditor 컴포넌트 생성
- [ ] 기본 텍스트 입력 동작
- [ ] prose 스타일 적용 (Tailwind Typography)
- [ ] TypeScript Props 타입 정의

**테스트**:
- [ ] Storybook 스토리 작성 (3개: 빈 상태, 기본 텍스트, 긴 텍스트)
- [ ] 접근성 테스트 (aria-label)

**관련 파일**:
- `src/components/admin/TiptapEditor.tsx` (신규)
- `src/components/admin/TiptapEditor.stories.tsx` (신규)

---

### [TASK-022] 기본 extensions 설정 (Bold, Italic, Link) (예상 시간: 2시간)

**설명**: StarterKit extensions 설정 및 커스터마이징
**우선순위**: 높음
**의존성**: TASK-021
**담당**: Developer

**작업 내용**:
1. StarterKit extensions 설정 (Heading, Paragraph, Bold, Italic, Strike, Code)
2. Link extension 추가 (autolink, openOnClick)
3. Placeholder extension 추가
4. 키보드 단축키 설정 (Ctrl+B, Ctrl+I, Ctrl+K)
5. extensions 설정 문서 작성

**완료 기준**:
- [ ] 6개 기본 extensions 동작
- [ ] Link extension 동작 (URL 입력 모달)
- [ ] Placeholder 표시
- [ ] 키보드 단축키 동작

**테스트**:
- [ ] E2E 테스트: Bold 클릭 → 텍스트 굵게
- [ ] E2E 테스트: Link 삽입 → URL 저장
- [ ] E2E 테스트: Ctrl+B → Bold 토글

**관련 파일**:
- `src/components/admin/TiptapEditor.tsx`
- `docs/guides/cms/tiptap-extensions.md` (신규)

---

### [TASK-023] EditorToolbar 컴포넌트 (예상 시간: 1.5시간)

**설명**: Tiptap 에디터 상단 툴바 UI
**우선순위**: 중간
**의존성**: TASK-022
**담당**: Developer

**작업 내용**:
1. src/components/admin/EditorToolbar.tsx 생성
2. 버튼 그룹 (Bold, Italic, Strike, Code)
3. Heading 레벨 선택 (H1, H2, H3)
4. Link 삽입 버튼
5. shadcn/ui Button, Separator 컴포넌트 사용
6. 활성 상태 표시 (editor.isActive('bold'))

**완료 기준**:
- [ ] EditorToolbar 컴포넌트 생성
- [ ] 8개 버튼 동작 (Bold, Italic, Strike, Code, H1, H2, H3, Link)
- [ ] 활성 상태 시각적 피드백
- [ ] 반응형 레이아웃 (모바일, 데스크톱)

**테스트**:
- [ ] Storybook 스토리 작성 (3개: 기본, 활성 상태, 비활성)
- [ ] 접근성 테스트 (aria-pressed)

**관련 파일**:
- `src/components/admin/EditorToolbar.tsx` (신규)
- `src/components/admin/EditorToolbar.stories.tsx` (신규)

---

### [TASK-024] useEditor 훅 구현 (예상 시간: 2시간)

**설명**: Tiptap useEditor 훅 래퍼 (커스텀 훅)
**우선순위**: 높음
**의존성**: TASK-021
**담당**: Developer

**작업 내용**:
1. src/hooks/useTiptapEditor.ts 생성
2. useEditor 훅 래핑 (extensions, content, onUpdate)
3. Markdown 양방향 변환 로직 추가
4. 에디터 상태 관리 (focus, blur)
5. 에러 처리 (잘못된 HTML, XSS)

**완료 기준**:
- [ ] useTiptapEditor 훅 생성
- [ ] Markdown → HTML 변환
- [ ] HTML → Markdown 변환
- [ ] 에디터 상태 관리 (isFocused)
- [ ] XSS 방지 (DOMPurify)

**테스트**:
- [ ] 단위 테스트: Markdown 변환 (10개 케이스)
- [ ] 단위 테스트: HTML 변환 (10개 케이스)
- [ ] 단위 테스트: XSS 방지

**관련 파일**:
- `src/hooks/useTiptapEditor.ts` (신규)
- `src/hooks/__tests__/useTiptapEditor.test.ts` (신규)

---

## Day 2: 고급 기능 구현

### [TASK-025] ImageExtension 구현 (미디어 라이브러리 연동) (예상 시간: 3시간)

**설명**: 에디터에서 이미지 삽입 시 미디어 라이브러리 모달 열기
**우선순위**: 높음
**의존성**: Sprint 1 (TASK-011)
**담당**: Developer

**작업 내용**:
1. TiptapImageExtension.ts 생성 (@tiptap/extension-image 확장)
2. "Insert Image" 버튼 클릭 → MediaGallery 모달 열기
3. 이미지 선택 → editor.commands.setImage({ src, alt })
4. 이미지 리사이징 핸들 추가 (width, height)
5. 이미지 alt 텍스트 편집 (더블클릭)

**완료 기준**:
- [ ] ImageExtension 생성
- [ ] MediaGallery 모달 통합
- [ ] 이미지 삽입 동작
- [ ] 리사이징 핸들 동작
- [ ] Alt 텍스트 편집 동작

**테스트**:
- [ ] E2E 테스트: 이미지 삽입 → 에디터에 표시
- [ ] E2E 테스트: 이미지 리사이징
- [ ] E2E 테스트: Alt 텍스트 편집

**관련 파일**:
- `src/lib/tiptap/ImageExtension.ts` (신규)
- `src/components/admin/TiptapEditor.tsx`
- `tests/e2e/admin-tiptap-image.spec.ts` (신규)

---

### [TASK-026] CodeBlockExtension 구현 (lowlight) (예상 시간: 2.5시간)

**설명**: 코드 블록 syntax highlighting (lowlight + highlight.js)
**우선순위**: 중간
**의존성**: TASK-020
**담당**: Developer

**작업 내용**:
1. npm install @tiptap/extension-code-block-lowlight lowlight
2. npm install highlight.js @types/highlight.js
3. CodeBlockLowlight extension 설정
4. 지원 언어 등록 (javascript, typescript, python, sql, bash)
5. 코드 블록 언어 선택 UI (Select)
6. highlight.js 테마 적용 (github-dark)

**완료 기준**:
- [ ] CodeBlockLowlight extension 동작
- [ ] 5개 언어 syntax highlighting
- [ ] 언어 선택 UI 동작
- [ ] 다크 모드 테마 적용

**테스트**:
- [ ] E2E 테스트: 코드 블록 삽입
- [ ] E2E 테스트: 언어 선택 → highlighting 변경
- [ ] Visual 테스트: 5개 언어 스타일 확인

**관련 파일**:
- `src/components/admin/TiptapEditor.tsx`
- `src/lib/tiptap/CodeBlockExtension.ts` (신규)
- `tests/e2e/admin-tiptap-code.spec.ts` (신규)

---

### [TASK-027] MarkdownExtension 구현 (양방향 변환) (예상 시간: 3시간)

**설명**: Markdown ↔ HTML 양방향 변환 extension
**우선순위**: 높음
**의존성**: TASK-024
**담당**: Developer

**작업 내용**:
1. npm install remark remark-parse remark-html remark-gfm
2. npm install turndown (HTML → Markdown)
3. MarkdownExtension.ts 생성
4. Markdown 입력 → HTML 변환 (remark)
5. HTML 출력 → Markdown 변환 (turndown)
6. GFM 지원 (테이블, 체크리스트, 취소선)

**완료 기준**:
- [ ] MarkdownExtension 생성
- [ ] Markdown → HTML 변환 동작
- [ ] HTML → Markdown 변환 동작
- [ ] GFM 문법 지원 (테이블, 체크리스트)

**테스트**:
- [ ] 단위 테스트: Markdown 변환 (20개 케이스)
- [ ] 단위 테스트: HTML 변환 (20개 케이스)
- [ ] E2E 테스트: Markdown 입력 → 렌더링 확인

**관련 파일**:
- `src/lib/tiptap/MarkdownExtension.ts` (신규)
- `src/lib/tiptap/__tests__/MarkdownExtension.test.ts` (신규)
- `tests/e2e/admin-tiptap-markdown.spec.ts` (신규)

---

### [TASK-028] EditorMenuBar 컴포넌트 (예상 시간: 2시간)

**설명**: 고급 편집 기능 메뉴 (테이블, 리스트, 인용)
**우선순위**: 중간
**의존성**: TASK-023
**담당**: Developer

**작업 내용**:
1. src/components/admin/EditorMenuBar.tsx 생성
2. Table 삽입 버튼 (행/열 선택 모달)
3. List 버튼 (Bullet, Ordered, Checklist)
4. Blockquote 버튼
5. Horizontal Rule 버튼
6. shadcn/ui Popover 컴포넌트 사용 (메뉴)

**완료 기준**:
- [ ] EditorMenuBar 컴포넌트 생성
- [ ] 5개 버튼 동작 (Table, List, Blockquote, HR)
- [ ] Table 삽입 모달 동작
- [ ] Popover 메뉴 동작

**테스트**:
- [ ] Storybook 스토리 작성 (3개: 기본, Popover 열림, 비활성)
- [ ] E2E 테스트: Table 삽입 → 에디터에 표시

**관련 파일**:
- `src/components/admin/EditorMenuBar.tsx` (신규)
- `src/components/admin/EditorMenuBar.stories.tsx` (신규)

---

### [TASK-029] useMarkdownSync 훅 구현 (예상 시간: 2시간)

**설명**: Tiptap HTML ↔ 기존 Markdown 동기화 훅
**우선순위**: 높음
**의존성**: TASK-027
**담당**: Developer

**작업 내용**:
1. src/hooks/useMarkdownSync.ts 생성
2. 에디터 변경 시 Markdown 문자열 업데이트
3. 외부 Markdown 변경 시 에디터 내용 업데이트
4. 디바운싱 (500ms)
5. React Hook Form 통합 (setValue, watch)

**완료 기준**:
- [ ] useMarkdownSync 훅 생성
- [ ] Tiptap → Markdown 동기화
- [ ] Markdown → Tiptap 동기화
- [ ] 디바운싱 동작
- [ ] React Hook Form 통합

**테스트**:
- [ ] 단위 테스트: 양방향 동기화 (10개 케이스)
- [ ] 단위 테스트: 디바운싱
- [ ] E2E 테스트: 에디터 변경 → 폼 업데이트

**관련 파일**:
- `src/hooks/useMarkdownSync.ts` (신규)
- `src/hooks/__tests__/useMarkdownSync.test.ts` (신규)

---

## Day 3: Admin 페이지 통합

### [TASK-030] AdminPortfolio 에디터 적용 (예상 시간: 2시간)

**설명**: Portfolio 페이지 description 필드를 Tiptap 에디터로 교체
**우선순위**: 높음
**의존성**: TASK-024, TASK-029
**담당**: Developer

**작업 내용**:
1. src/pages/admin/AdminPortfolio.tsx 수정
2. textarea → TiptapEditor 컴포넌트 교체
3. useMarkdownSync 훅 통합 (React Hook Form)
4. 기존 Markdown 데이터 마이그레이션 확인
5. 저장 후 미리보기 확인

**완료 기준**:
- [ ] AdminPortfolio 에디터 교체 완료
- [ ] 기존 Markdown 데이터 호환
- [ ] 저장 후 description 렌더링 확인
- [ ] TypeScript 에러 없음

**테스트**:
- [ ] E2E 테스트: 에디터 입력 → 저장 → 조회
- [ ] E2E 테스트: 기존 데이터 편집 → 저장

**관련 파일**:
- `src/pages/admin/AdminPortfolio.tsx`
- `tests/e2e/admin-portfolio.spec.ts`

---

### [TASK-031] AdminLab 에디터 적용 (예상 시간: 2시간)

**설명**: Lab (Bounty) 페이지 description 필드를 Tiptap 에디터로 교체
**우선순위**: 높음
**의존성**: TASK-024, TASK-029
**담당**: Developer

**작업 내용**:
1. src/pages/admin/AdminLab.tsx 수정
2. textarea → TiptapEditor 컴포넌트 교체
3. useMarkdownSync 훅 통합 (React Hook Form)
4. 기존 Markdown 데이터 마이그레이션 확인
5. 저장 후 미리보기 확인

**완료 기준**:
- [ ] AdminLab 에디터 교체 완료
- [ ] 기존 Markdown 데이터 호환
- [ ] 저장 후 description 렌더링 확인
- [ ] TypeScript 에러 없음

**테스트**:
- [ ] E2E 테스트: 에디터 입력 → 저장 → 조회
- [ ] E2E 테스트: 기존 데이터 편집 → 저장

**관련 파일**:
- `src/pages/admin/AdminLab.tsx`
- `tests/e2e/admin-lab.spec.ts`

---

### [TASK-032] AdminBlog 에디터 적용 (예상 시간: 2시간)

**설명**: Blog 페이지 content 필드를 Tiptap 에디터로 교체
**우선순위**: 높음
**의존성**: TASK-024, TASK-029
**담당**: Developer

**작업 내용**:
1. src/pages/admin/AdminBlog.tsx 생성 (신규 페이지)
2. Blog 포스트 CRUD UI 구현
3. content 필드에 TiptapEditor 적용
4. useMarkdownSync 훅 통합 (React Hook Form)
5. 저장 후 미리보기 확인

**완료 기준**:
- [ ] AdminBlog 페이지 생성
- [ ] CRUD 기능 동작 (Create, Read, Update, Delete)
- [ ] TiptapEditor 통합
- [ ] 저장 후 content 렌더링 확인

**테스트**:
- [ ] E2E 테스트: 포스트 생성 → 에디터 입력 → 저장
- [ ] E2E 테스트: 포스트 편집 → 저장
- [ ] E2E 테스트: 포스트 삭제

**관련 파일**:
- `src/pages/admin/AdminBlog.tsx` (신규)
- `tests/e2e/admin-blog.spec.ts` (신규)

---

### [TASK-033] 기존 textarea → Tiptap 마이그레이션 (예상 시간: 2시간)

**설명**: 모든 Admin 페이지 textarea를 Tiptap으로 일괄 교체
**우선순위**: 중간
**의존성**: TASK-030, TASK-031, TASK-032
**담당**: Developer

**작업 내용**:
1. AdminTeam, AdminServices, AdminRoadmap 페이지 확인
2. description 필드 textarea → TiptapEditor 교체
3. useMarkdownSync 훅 통합
4. 기존 데이터 호환성 확인 (Markdown)
5. 마이그레이션 체크리스트 문서 작성

**완료 기준**:
- [ ] 5개 Admin 페이지 에디터 교체 완료
- [ ] 기존 Markdown 데이터 호환 확인
- [ ] TypeScript 에러 없음
- [ ] 마이그레이션 문서 작성

**테스트**:
- [ ] E2E 테스트: 각 페이지 에디터 동작 확인
- [ ] 수동 테스트: 기존 데이터 편집 → 저장

**관련 파일**:
- `src/pages/admin/AdminTeam.tsx`
- `src/pages/admin/AdminServices.tsx`
- `src/pages/admin/AdminRoadmap.tsx`
- `docs/guides/cms/tiptap-migration-checklist.md` (신규)

---

### [TASK-034] Markdown fallback 유지 로직 (예상 시간: 1.5시간)

**설명**: Tiptap 에러 시 기존 Markdown 렌더링 fallback
**우선순위**: 중간
**의존성**: TASK-033
**담당**: Developer

**작업 내용**:
1. TiptapEditor 컴포넌트에 에러 바운더리 추가
2. 에러 발생 시 MarkdownRenderer 컴포넌트로 fallback
3. 에러 로그 전송 (Sentry)
4. 사용자 알림 (Toast: "에디터 로딩 실패, Markdown으로 표시됩니다")
5. 에러 복구 버튼 (재로드)

**완료 기준**:
- [ ] 에러 바운더리 추가
- [ ] Markdown fallback 동작
- [ ] Sentry 에러 로그 전송
- [ ] 사용자 알림 표시
- [ ] 재로드 버튼 동작

**테스트**:
- [ ] 단위 테스트: 에러 발생 → fallback
- [ ] E2E 테스트: 에디터 로딩 실패 → Markdown 표시

**관련 파일**:
- `src/components/admin/TiptapEditor.tsx`
- `src/components/ErrorBoundary.tsx`

---

## Day 4: 최적화 및 테스트

### [TASK-035] Code splitting 및 lazy loading (예상 시간: 2시간)

**설명**: Tiptap 에디터 동적 import로 초기 번들 감소
**우선순위**: 높음
**의존성**: TASK-021
**담당**: Developer

**작업 내용**:
1. React.lazy로 TiptapEditor 동적 import
2. vite.config.ts manualChunks 설정 (tiptap 청크)
3. Suspense fallback UI (Skeleton)
4. 번들 크기 분석 (vite-bundle-visualizer)
5. 로딩 성능 측정 (Lighthouse)

**완료 기준**:
- [ ] TiptapEditor 동적 import 적용
- [ ] tiptap 청크 분리 (vendor-tiptap.js)
- [ ] Suspense fallback UI 동작
- [ ] 초기 번들 gzip 10-15 kB 감소
- [ ] Lighthouse 성능 점수 유지 (90+)

**테스트**:
- [ ] 번들 크기 분석: npm run build
- [ ] Lighthouse 테스트: 성능 점수 90+
- [ ] E2E 테스트: Suspense fallback → 에디터 로드

**관련 파일**:
- `src/pages/admin/AdminPortfolio.tsx`
- `vite.config.ts`

---

### [TASK-036] DOMPurify XSS 방지 적용 (예상 시간: 1.5시간)

**설명**: 에디터 입력 HTML sanitization으로 XSS 공격 방지
**우선순위**: 높음
**의존성**: TASK-024
**담당**: Developer

**작업 내용**:
1. npm install dompurify @types/dompurify
2. useTiptapEditor 훅에 DOMPurify 적용
3. HTML 출력 전 sanitize (허용 태그 화이트리스트)
4. XSS 테스트 케이스 작성 (script, iframe, onerror)
5. 보안 문서 작성 (XSS 방지 가이드)

**완료 기준**:
- [ ] DOMPurify 설치 및 설정
- [ ] HTML sanitize 로직 적용
- [ ] XSS 테스트 케이스 통과 (5개)
- [ ] 보안 문서 작성

**테스트**:
- [ ] 단위 테스트: XSS 공격 시도 → sanitize
- [ ] 단위 테스트: 허용 태그 유지
- [ ] 단위 테스트: script 태그 제거

**관련 파일**:
- `src/hooks/useTiptapEditor.ts`
- `src/hooks/__tests__/useTiptapEditor.test.ts`
- `docs/guides/security/xss-prevention.md` (신규)

---

### [TASK-037] 접근성 개선 (ARIA 레이블) (예상 시간: 2시간)

**설명**: Tiptap 에디터 및 툴바 접근성 개선
**우선순위**: 중간
**의존성**: TASK-023
**담당**: Developer

**작업 내용**:
1. EditorToolbar 버튼에 aria-label 추가
2. TiptapEditor에 role="textbox" 추가
3. 키보드 탐색 개선 (Tab, Shift+Tab)
4. 포커스 인디케이터 스타일링
5. 접근성 테스트 (axe-core)

**완료 기준**:
- [ ] 모든 버튼 aria-label 추가
- [ ] role, aria-* 속성 추가
- [ ] 키보드 탐색 동작
- [ ] axe-core 테스트 통과 (0개 위반)

**테스트**:
- [ ] 접근성 테스트: axe-core 0개 위반
- [ ] 수동 테스트: 키보드만으로 에디터 사용
- [ ] 스크린 리더 테스트 (NVDA)

**관련 파일**:
- `src/components/admin/TiptapEditor.tsx`
- `src/components/admin/EditorToolbar.tsx`
- `tests/accessibility/tiptap-editor.spec.ts` (신규)

---

### [TASK-038] E2E 테스트 작성 (25개) (예상 시간: 3시간)

**설명**: Tiptap 에디터 전체 플로우 E2E 테스트
**우선순위**: 높음
**의존성**: TASK-020 ~ TASK-037
**담당**: Developer

**작업 내용**:
1. tests/e2e/admin-tiptap-editor.spec.ts 생성
2. 25개 테스트 케이스 작성:
   - 기본 텍스트 입력
   - Bold, Italic, Strike 포맷
   - Heading 레벨 변경 (H1, H2, H3)
   - Link 삽입/편집/삭제
   - 이미지 삽입 (미디어 라이브러리)
   - 코드 블록 삽입 및 언어 선택
   - Markdown 입력 → HTML 렌더링
   - HTML → Markdown 변환
   - 테이블 삽입/편집
   - 리스트 (Bullet, Ordered, Checklist)
   - Blockquote 삽입
   - Horizontal Rule 삽입
   - Undo/Redo 동작
   - 키보드 단축키 (Ctrl+B, Ctrl+I, Ctrl+K)
   - 접근성 (키보드 탐색)
   - XSS 방지 (script 태그 제거)
   - 에러 처리 (Markdown fallback)
   - Code splitting (lazy loading)
   - AdminPortfolio 통합
   - AdminLab 통합
   - AdminBlog 통합
3. 테스트 헬퍼 함수 작성 (typeInEditor, formatText)
4. 테스트 픽스처 준비 (샘플 Markdown 5개)

**완료 기준**:
- [ ] 25개 E2E 테스트 작성
- [ ] 모든 테스트 통과
- [ ] 테스트 커버리지 85% 이상
- [ ] 테스트 헬퍼 함수 작성

**테스트**:
- [ ] npm run test:e2e -- admin-tiptap-editor.spec.ts

**관련 파일**:
- `tests/e2e/admin-tiptap-editor.spec.ts` (신규)
- `tests/e2e/helpers/tiptap.ts` (신규)
- `tests/fixtures/sample-markdown-1.md` (신규)
- `tests/fixtures/sample-markdown-2.md` (신규)
- `tests/fixtures/sample-markdown-3.md` (신규)

---

## Sprint 2 체크리스트

### Tiptap 기본
- [ ] TASK-020: Tiptap 설치
- [ ] TASK-021: TiptapEditor 컴포넌트
- [ ] TASK-022: 기본 extensions 설정
- [ ] TASK-023: EditorToolbar 컴포넌트
- [ ] TASK-024: useEditor 훅

### 고급 기능
- [ ] TASK-025: ImageExtension (미디어 라이브러리)
- [ ] TASK-026: CodeBlockExtension (lowlight)
- [ ] TASK-027: MarkdownExtension (양방향 변환)
- [ ] TASK-028: EditorMenuBar 컴포넌트
- [ ] TASK-029: useMarkdownSync 훅

### Admin 통합
- [ ] TASK-030: AdminPortfolio 에디터 적용
- [ ] TASK-031: AdminLab 에디터 적용
- [ ] TASK-032: AdminBlog 에디터 적용
- [ ] TASK-033: 기존 textarea 마이그레이션
- [ ] TASK-034: Markdown fallback 로직

### 최적화
- [ ] TASK-035: Code splitting
- [ ] TASK-036: XSS 방지 (DOMPurify)
- [ ] TASK-037: 접근성 개선
- [ ] TASK-038: E2E 테스트 (25개)

---

## 다음 단계
- Sprint 3: 버전 관리 시스템 (자동 저장, 버전 히스토리)
