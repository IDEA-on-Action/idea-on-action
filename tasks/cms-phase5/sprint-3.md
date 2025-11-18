# Sprint 3: 버전 관리 시스템 (Phase 5-3)

**기간**: 2-3일
**목표**: 자동 저장, 버전 히스토리, 버전 비교 및 복원 시스템 구축
**총 태스크**: 16개
**예상 시간**: 28-32시간

---

## Day 1: Database 설정

### [TASK-039] content_versions 테이블 스키마 설계 (예상 시간: 1시간)

**설명**: 콘텐츠 버전 히스토리를 저장할 테이블 스키마 설계
**우선순위**: 높음
**의존성**: 없음
**담당**: Developer

**작업 내용**:
1. 테이블 스키마 설계 (plan/cms-phase5/architecture.md 참조)
2. 컬럼 정의 (10개):
   - id (UUID, PK)
   - content_type (TEXT: 'portfolio', 'lab', 'blog', 'roadmap')
   - content_id (UUID, FK)
   - version (INTEGER, auto-increment)
   - content (JSONB, 전체 데이터 스냅샷)
   - created_by (UUID, FK → users)
   - created_at (TIMESTAMPTZ)
   - change_summary (TEXT, optional)
   - is_published (BOOLEAN, default false)
   - metadata (JSONB, optional)
3. ERD 다이어그램 작성 (docs/guides/cms/version-control-erd.md)

**완료 기준**:
- [ ] 테이블 스키마 설계 완료
- [ ] 10개 컬럼 모두 정의
- [ ] ERD 다이어그램 작성
- [ ] 설계 문서 작성

**테스트**:
- [ ] 스키마 리뷰 (동료 검토)

**관련 파일**:
- `docs/guides/cms/version-control-schema.md` (신규)
- `docs/guides/cms/version-control-erd.md` (신규)

---

### [TASK-040] 마이그레이션 스크립트 작성 (예상 시간: 1.5시간)

**설명**: content_versions 테이블 생성 SQL 마이그레이션
**우선순위**: 높음
**의존성**: TASK-039
**담당**: Developer

**작업 내용**:
1. SQL 마이그레이션 파일 생성 (supabase/migrations/)
2. content_versions 테이블 CREATE TABLE
3. Foreign Key 제약 조건 추가 (content_id → 각 테이블)
4. Trigger 함수 생성 (auto-increment version)
5. 롤백 스크립트 작성

**완료 기준**:
- [ ] 마이그레이션 파일 생성
- [ ] content_versions 테이블 생성
- [ ] 4개 FK 제약 조건 추가
- [ ] Trigger 함수 동작 확인
- [ ] 롤백 스크립트 테스트

**테스트**:
- [ ] SQL 테스트: INSERT → version 자동 증가
- [ ] SQL 테스트: FK 제약 위반 시 에러
- [ ] 롤백 테스트: DROP TABLE 성공

**관련 파일**:
- `supabase/migrations/20251117100000_create_content_versions_table.sql` (신규)
- `supabase/migrations/20251117100000_rollback.sql` (신규)

---

### [TASK-041] RLS 정책 설정 (user별 접근 제어) (예상 시간: 1.5시간)

**설명**: content_versions 테이블 RLS 정책 생성
**우선순위**: 높음
**의존성**: TASK-040
**담당**: Developer

**작업 내용**:
1. RLS 정책 설계:
   - SELECT: authenticated 사용자 (자신이 생성한 버전 + published 버전)
   - INSERT: authenticated 사용자 (자신의 콘텐츠만)
   - UPDATE: admin 역할만 (is_published 변경)
   - DELETE: admin 역할만
2. SQL 마이그레이션 파일 작성
3. RLS 정책 테스트 쿼리 작성
4. 보안 문서 작성 (RLS 정책 가이드)

**완료 기준**:
- [ ] 4개 RLS 정책 작성
- [ ] SELECT 정책: user별 필터링 동작
- [ ] INSERT 정책: 자신의 콘텐츠만 허용
- [ ] UPDATE/DELETE: admin만 허용
- [ ] 보안 문서 작성

**테스트**:
- [ ] SQL 테스트: authenticated 사용자로 SELECT
- [ ] SQL 테스트: 다른 사용자 버전 접근 차단
- [ ] SQL 테스트: admin으로 UPDATE/DELETE

**관련 파일**:
- `supabase/migrations/20251117100100_content_versions_rls.sql` (신규)
- `scripts/test-content-versions-rls.sql` (신규)
- `docs/guides/security/content-versions-rls.md` (신규)

---

### [TASK-042] 인덱스 생성 (content_type, content_id, version) (예상 시간: 1시간)

**설명**: 버전 조회 성능 최적화를 위한 인덱스 생성
**우선순위**: 중간
**의존성**: TASK-040
**담당**: Developer

**작업 내용**:
1. 복합 인덱스 설계:
   - idx_content_versions_lookup (content_type, content_id, version DESC)
   - idx_content_versions_user (created_by, created_at DESC)
   - idx_content_versions_published (is_published, created_at DESC)
2. SQL 마이그레이션 파일 작성
3. 인덱스 성능 테스트 (EXPLAIN ANALYZE)
4. 인덱스 문서 작성

**완료 기준**:
- [ ] 3개 인덱스 생성
- [ ] EXPLAIN ANALYZE로 성능 확인
- [ ] 쿼리 속도 10배 이상 개선
- [ ] 인덱스 문서 작성

**테스트**:
- [ ] SQL 테스트: 인덱스 사용 확인 (EXPLAIN)
- [ ] 성능 테스트: 1,000개 버전 조회 (100ms 이내)

**관련 파일**:
- `supabase/migrations/20251117100200_content_versions_indexes.sql` (신규)
- `docs/guides/database/content-versions-indexes.md` (신규)

---

### [TASK-043] Database 검증 스크립트 작성 (예상 시간: 1시간)

**설명**: 마이그레이션 적용 후 DB 상태 검증 스크립트
**우선순위**: 중간
**의존성**: TASK-040, TASK-041, TASK-042
**담당**: Developer

**작업 내용**:
1. verify-content-versions-schema.sql 작성
   - 테이블 존재 확인
   - 컬럼 타입 확인
   - FK 제약 조건 확인
   - RLS 정책 확인
   - 인덱스 확인
   - Trigger 함수 확인
2. Node.js 검증 스크립트 작성 (scripts/verify-content-versions.cjs)
3. 마이그레이션 가이드 업데이트

**완료 기준**:
- [ ] SQL 검증 쿼리 작성
- [ ] Node.js 검증 스크립트 작성
- [ ] 모든 객체 검증 통과
- [ ] 마이그레이션 가이드 업데이트

**테스트**:
- [ ] npm run verify:content-versions 성공
- [ ] 로컬 DB에서 검증 통과

**관련 파일**:
- `scripts/verify-content-versions-schema.sql` (신규)
- `scripts/verify-content-versions.cjs` (신규)
- `docs/guides/cms/content-versions-migration.md` (신규)

---

## Day 2: 자동 저장 구현

### [TASK-044] AutoSave 컴포넌트 기본 구조 (예상 시간: 1.5시간)

**설명**: 자동 저장 인디케이터 및 수동 저장 버튼 UI
**우선순위**: 높음
**의존성**: 없음
**담당**: Developer

**작업 내용**:
1. src/components/admin/AutoSave.tsx 생성
2. 저장 상태 인디케이터 (Saving..., Saved, Error)
3. Last saved 시간 표시 (timeago.js)
4. 수동 저장 버튼 (Ctrl+S)
5. shadcn/ui Badge, Button 컴포넌트 사용

**완료 기준**:
- [ ] AutoSave 컴포넌트 생성
- [ ] 3가지 상태 표시 (Saving, Saved, Error)
- [ ] Last saved 시간 동적 업데이트
- [ ] Ctrl+S 키보드 단축키 동작

**테스트**:
- [ ] Storybook 스토리 작성 (4개: Saving, Saved, Error, 초기)
- [ ] 접근성 테스트 (aria-live)

**관련 파일**:
- `src/components/admin/AutoSave.tsx` (신규)
- `src/components/admin/AutoSave.stories.tsx` (신규)

---

### [TASK-045] useAutoSave 훅 (30초 디바운싱) (예상 시간: 2.5시간)

**설명**: 자동 저장 로직을 담당하는 React Query 훅
**우선순위**: 높음
**의존성**: TASK-040
**담당**: Developer

**작업 내용**:
1. src/hooks/useAutoSave.ts 생성
2. useMutation 훅으로 버전 저장 로직
3. 디바운싱 (30초, useDebounce 통합)
4. content_versions 테이블에 INSERT
5. 에러 처리 (네트워크 에러, 권한 에러)
6. React Query 낙관적 업데이트

**완료 기준**:
- [ ] useAutoSave 훅 생성
- [ ] 30초 디바운싱 동작
- [ ] content_versions INSERT 성공
- [ ] 에러 처리 2가지 (네트워크, 권한)
- [ ] 낙관적 업데이트 동작

**테스트**:
- [ ] 단위 테스트: 디바운싱 동작 확인
- [ ] 단위 테스트: INSERT 성공
- [ ] 단위 테스트: 네트워크 에러 처리

**관련 파일**:
- `src/hooks/useAutoSave.ts` (신규)
- `src/hooks/__tests__/useAutoSave.test.ts` (신규)

---

### [TASK-046] useDebounce 훅 통합 (예상 시간: 1시간)

**설명**: 기존 useDebounce 훅을 useAutoSave에 통합
**우선순위**: 중간
**의존성**: TASK-045
**담당**: Developer

**작업 내용**:
1. src/hooks/useDebounce.ts 확인 (기존 훅)
2. useAutoSave 훅에 통합
3. delay 파라미터 설정 (30초)
4. 사용자 입력 중 저장 방지 로직
5. 에디터 blur 시 즉시 저장 로직

**완료 기준**:
- [ ] useDebounce 훅 통합
- [ ] 30초 디바운싱 동작
- [ ] 입력 중 저장 방지
- [ ] blur 시 즉시 저장

**테스트**:
- [ ] 단위 테스트: 30초 경과 후 저장
- [ ] 단위 테스트: 입력 중 저장 취소
- [ ] E2E 테스트: blur → 즉시 저장

**관련 파일**:
- `src/hooks/useAutoSave.ts`
- `src/hooks/useDebounce.ts`

---

### [TASK-047] React Query 낙관적 업데이트 (예상 시간: 2시간)

**설명**: 자동 저장 시 UI 즉시 업데이트 (낙관적 업데이트)
**우선순위**: 중간
**의존성**: TASK-045
**담당**: Developer

**작업 내용**:
1. useAutoSave 훅에 onMutate 콜백 추가
2. 캐시 업데이트 (queryClient.setQueryData)
3. 롤백 로직 (onError 시 이전 상태 복원)
4. 성공 시 캐시 무효화 (onSuccess)
5. 낙관적 업데이트 문서 작성

**완료 기준**:
- [ ] onMutate 콜백 구현
- [ ] 캐시 즉시 업데이트
- [ ] 롤백 로직 동작
- [ ] 성공 시 캐시 무효화
- [ ] 문서 작성

**테스트**:
- [ ] 단위 테스트: 낙관적 업데이트 성공
- [ ] 단위 테스트: 에러 시 롤백
- [ ] E2E 테스트: 저장 → UI 즉시 변경

**관련 파일**:
- `src/hooks/useAutoSave.ts`
- `docs/guides/cms/optimistic-updates.md` (신규)

---

### [TASK-048] 저장 인디케이터 UI (Last saved: ...) (예상 시간: 1.5시간)

**설명**: 마지막 저장 시간을 표시하는 UI 컴포넌트
**우선순위**: 낮음
**의존성**: TASK-044
**담당**: Developer

**작업 내용**:
1. npm install timeago.js
2. AutoSave 컴포넌트에 Last saved 시간 표시
3. 시간 포맷 (방금 전, 1분 전, 30초 전)
4. 실시간 업데이트 (1초마다)
5. 저장 실패 시 에러 메시지 표시

**완료 기준**:
- [ ] timeago.js 설치 및 설정
- [ ] Last saved 시간 표시
- [ ] 실시간 업데이트 (1초마다)
- [ ] 에러 메시지 표시

**테스트**:
- [ ] Storybook 스토리 작성 (3개: 방금 전, 1분 전, 에러)
- [ ] E2E 테스트: 저장 → Last saved 업데이트

**관련 파일**:
- `src/components/admin/AutoSave.tsx`
- `package.json`

---

## Day 3: 버전 히스토리 구현

### [TASK-049] VersionHistory 컴포넌트 (목록) (예상 시간: 2시간)

**설명**: 버전 히스토리 목록을 표시하는 사이드바 컴포넌트
**우선순위**: 높음
**의존성**: TASK-040
**담당**: Developer

**작업 내용**:
1. src/components/admin/VersionHistory.tsx 생성
2. 버전 목록 UI (타임라인 형태)
3. 각 버전 정보 표시 (version, created_at, created_by, change_summary)
4. 현재 버전 하이라이트
5. 버전 클릭 → 상세 보기 (VersionCompare)
6. shadcn/ui ScrollArea, Card 컴포넌트 사용

**완료 기준**:
- [ ] VersionHistory 컴포넌트 생성
- [ ] 타임라인 UI 동작
- [ ] 버전 정보 표시
- [ ] 현재 버전 하이라이트
- [ ] 버전 클릭 이벤트 처리

**테스트**:
- [ ] Storybook 스토리 작성 (3개: 1개 버전, 10개 버전, 빈 상태)
- [ ] 접근성 테스트 (키보드 탐색)

**관련 파일**:
- `src/components/admin/VersionHistory.tsx` (신규)
- `src/components/admin/VersionHistory.stories.tsx` (신규)

---

### [TASK-050] useVersionHistory 훅 (예상 시간: 2시간)

**설명**: content_versions 테이블에서 버전 목록을 가져오는 React Query 훅
**우선순위**: 높음
**의존성**: TASK-040
**담당**: Developer

**작업 내용**:
1. src/hooks/useVersionHistory.ts 생성
2. useQuery 훅으로 버전 목록 조회
3. 필터링 (content_type, content_id)
4. 정렬 (version DESC)
5. 페이지네이션 (20개씩)
6. React Query 캐시 무효화 로직

**완료 기준**:
- [ ] useVersionHistory 훅 생성
- [ ] 버전 목록 조회 성공
- [ ] 필터링 동작 (content_type, content_id)
- [ ] 정렬 동작 (version DESC)
- [ ] 페이지네이션 동작

**테스트**:
- [ ] 단위 테스트: 목록 조회 성공
- [ ] 단위 테스트: 필터링 동작
- [ ] 단위 테스트: 정렬 동작

**관련 파일**:
- `src/hooks/useVersionHistory.ts` (신규)
- `src/hooks/__tests__/useVersionHistory.test.ts` (신규)

---

### [TASK-051] VersionCompare 컴포넌트 (diff-match-patch) (예상 시간: 3시간)

**설명**: 두 버전 간 차이를 시각적으로 표시하는 컴포넌트
**우선순위**: 높음
**의존성**: TASK-049
**담당**: Developer

**작업 내용**:
1. npm install diff-match-patch @types/diff-match-patch
2. src/components/admin/VersionCompare.tsx 생성
3. diff-match-patch 라이브러리 통합
4. 텍스트 diff UI (추가: 녹색, 삭제: 빨간색)
5. 좌우 분할 뷰 (Before, After)
6. 인라인 뷰 (통합 diff)
7. 뷰 전환 버튼 (Split, Unified)

**완료 기준**:
- [ ] diff-match-patch 설치
- [ ] VersionCompare 컴포넌트 생성
- [ ] 텍스트 diff 표시 (색상 구분)
- [ ] 좌우 분할 뷰 동작
- [ ] 인라인 뷰 동작
- [ ] 뷰 전환 버튼 동작

**테스트**:
- [ ] Storybook 스토리 작성 (3개: Split, Unified, 변경 없음)
- [ ] 단위 테스트: diff 계산 (10개 케이스)
- [ ] E2E 테스트: 버전 비교 → diff 표시

**관련 파일**:
- `src/components/admin/VersionCompare.tsx` (신규)
- `src/components/admin/VersionCompare.stories.tsx` (신규)
- `package.json`

---

### [TASK-052] VersionRestore 컴포넌트 (확인 다이얼로그) (예상 시간: 2시간)

**설명**: 이전 버전으로 복원하는 확인 다이얼로그
**우선순위**: 중간
**의존성**: TASK-049
**담당**: Developer

**작업 내용**:
1. src/components/admin/VersionRestore.tsx 생성
2. shadcn/ui AlertDialog 컴포넌트 사용
3. 복원 확인 메시지 (버전 번호, 생성 날짜)
4. 복원 버튼 (Restore, Cancel)
5. 복원 후 새 버전 생성 로직
6. 성공 알림 (Toast)

**완료 기준**:
- [ ] VersionRestore 컴포넌트 생성
- [ ] AlertDialog 열기/닫기 동작
- [ ] 복원 확인 메시지 표시
- [ ] 복원 버튼 클릭 → 새 버전 생성
- [ ] 성공 Toast 표시

**테스트**:
- [ ] Storybook 스토리 작성 (2개: 기본, 열림)
- [ ] E2E 테스트: 복원 버튼 클릭 → 다이얼로그 열림
- [ ] E2E 테스트: Restore 클릭 → 새 버전 생성

**관련 파일**:
- `src/components/admin/VersionRestore.tsx` (신규)
- `src/components/admin/VersionRestore.stories.tsx` (신규)

---

### [TASK-053] useVersionRestore 훅 (예상 시간: 1.5시간)

**설명**: 이전 버전으로 복원하는 React Query 훅
**우선순위**: 중간
**의존성**: TASK-052
**담당**: Developer

**작업 내용**:
1. src/hooks/useVersionRestore.ts 생성
2. useMutation 훅으로 복원 로직
3. content_versions 테이블에서 이전 버전 조회
4. 조회한 데이터로 새 버전 생성 (version 자동 증가)
5. 원본 콘텐츠 테이블 업데이트 (projects, lab, blog 등)
6. React Query 캐시 무효화

**완료 기준**:
- [ ] useVersionRestore 훅 생성
- [ ] 이전 버전 조회 성공
- [ ] 새 버전 생성 성공
- [ ] 원본 테이블 업데이트 성공
- [ ] 캐시 무효화 동작

**테스트**:
- [ ] 단위 테스트: 복원 성공
- [ ] 단위 테스트: 권한 없음 에러
- [ ] E2E 테스트: 복원 → 새 버전 생성 확인

**관련 파일**:
- `src/hooks/useVersionRestore.ts` (신규)
- `src/hooks/__tests__/useVersionRestore.test.ts` (신규)

---

### [TASK-054] E2E 테스트 작성 (15개) (예상 시간: 2.5시간)

**설명**: 버전 관리 전체 플로우 E2E 테스트
**우선순위**: 높음
**의존성**: TASK-039 ~ TASK-053
**담당**: Developer

**작업 내용**:
1. tests/e2e/admin-version-control.spec.ts 생성
2. 15개 테스트 케이스 작성:
   - 자동 저장 (30초 디바운싱)
   - 수동 저장 (Ctrl+S)
   - Last saved 시간 업데이트
   - 버전 목록 표시
   - 버전 클릭 → 상세 보기
   - 버전 비교 (diff 표시)
   - 좌우 분할 뷰
   - 인라인 뷰
   - 버전 복원 (다이얼로그)
   - 복원 후 새 버전 생성
   - 복원 후 원본 업데이트
   - 페이지네이션 (20개씩)
   - 권한 체크 (admin만 복원 가능)
   - 에러 처리 (네트워크 에러)
   - 낙관적 업데이트 동작
3. 테스트 헬퍼 함수 작성 (saveVersion, restoreVersion)
4. 테스트 픽스처 준비 (샘플 버전 데이터 5개)

**완료 기준**:
- [ ] 15개 E2E 테스트 작성
- [ ] 모든 테스트 통과
- [ ] 테스트 커버리지 80% 이상
- [ ] 테스트 헬퍼 함수 작성

**테스트**:
- [ ] npm run test:e2e -- admin-version-control.spec.ts

**관련 파일**:
- `tests/e2e/admin-version-control.spec.ts` (신규)
- `tests/e2e/helpers/version-control.ts` (신규)
- `tests/fixtures/sample-version-1.json` (신규)
- `tests/fixtures/sample-version-2.json` (신규)
- `tests/fixtures/sample-version-3.json` (신규)

---

## 추가 작업 (선택적)

### [TASK-055] 버전 퍼블리싱 시스템 (예상 시간: 2시간)

**설명**: 특정 버전을 published 상태로 표시하는 기능
**우선순위**: 낮음
**의존성**: TASK-040
**담당**: Developer

**작업 내용**:
1. content_versions.is_published 컬럼 활용
2. VersionHistory에 Publish 버튼 추가
3. useVersionPublish 훅 구현
4. Published 버전 Badge 표시
5. Frontend에서 published 버전만 표시

**완료 기준**:
- [ ] Publish 버튼 동작
- [ ] is_published 업데이트 성공
- [ ] Published Badge 표시
- [ ] Frontend 필터링 동작

**테스트**:
- [ ] E2E 테스트: Publish 클릭 → 상태 변경
- [ ] E2E 테스트: Published 버전만 표시

**관련 파일**:
- `src/components/admin/VersionHistory.tsx`
- `src/hooks/useVersionPublish.ts` (신규)

---

### [TASK-056] 버전 변경 요약 (AI 생성) (예상 시간: 3시간)

**설명**: 버전 저장 시 AI로 change_summary 자동 생성
**우선순위**: 낮음
**의존성**: TASK-045
**담당**: Developer

**작업 내용**:
1. OpenAI API 통합 (GPT-4o-mini)
2. Diff 텍스트를 AI에게 전송
3. AI 응답 → change_summary 저장
4. 요약 예시: "헤딩 레벨 변경 (H2 → H1), 이미지 3개 추가"
5. 에러 처리 (API 실패 시 수동 입력)

**완료 기준**:
- [ ] OpenAI API 통합
- [ ] Diff → AI 요청 → 응답
- [ ] change_summary 저장
- [ ] 에러 시 수동 입력 fallback

**테스트**:
- [ ] 단위 테스트: AI 요약 생성
- [ ] E2E 테스트: 저장 → 요약 자동 생성

**관련 파일**:
- `src/hooks/useAutoSave.ts`
- `src/lib/ai/summarize-changes.ts` (신규)

---

## Sprint 3 체크리스트

### Database
- [ ] TASK-039: content_versions 스키마 설계
- [ ] TASK-040: 마이그레이션 스크립트
- [ ] TASK-041: RLS 정책 설정
- [ ] TASK-042: 인덱스 생성
- [ ] TASK-043: 검증 스크립트

### 자동 저장
- [ ] TASK-044: AutoSave 컴포넌트
- [ ] TASK-045: useAutoSave 훅
- [ ] TASK-046: useDebounce 통합
- [ ] TASK-047: 낙관적 업데이트
- [ ] TASK-048: Last saved UI

### 버전 히스토리
- [ ] TASK-049: VersionHistory 컴포넌트
- [ ] TASK-050: useVersionHistory 훅
- [ ] TASK-051: VersionCompare 컴포넌트
- [ ] TASK-052: VersionRestore 컴포넌트
- [ ] TASK-053: useVersionRestore 훅
- [ ] TASK-054: E2E 테스트 (15개)

### 선택적 작업
- [ ] TASK-055: 버전 퍼블리싱 시스템 (선택)
- [ ] TASK-056: AI 변경 요약 (선택)

---

## CMS Phase 5 전체 요약

### Sprint 1: 미디어 라이브러리 (3-4일)
- 총 태스크: 19개
- 예상 시간: 32-36시간
- E2E 테스트: 20개

### Sprint 2: 리치 텍스트 에디터 (3-4일)
- 총 태스크: 19개
- 예상 시간: 38-42시간
- E2E 테스트: 25개

### Sprint 3: 버전 관리 (2-3일)
- 총 태스크: 16개 (선택 2개 제외)
- 예상 시간: 28-32시간
- E2E 테스트: 15개

### 전체 통계
- **총 태스크**: 54개 (선택 2개 포함 시 56개)
- **총 예상 시간**: 98-110시간 (7-10일)
- **총 E2E 테스트**: 60개
- **신규 컴포넌트**: 15개
- **신규 훅**: 12개
- **신규 마이그레이션**: 7개
- **문서**: 20개

---

## 다음 단계 (CMS Phase 6, 선택적)
- 콘텐츠 승인 워크플로우 (Draft → Review → Approved → Published)
- 멀티 언어 지원 (i18n 콘텐츠 관리)
- SEO 최적화 도구 (메타 태그, Open Graph, Schema.org)
- 콘텐츠 분석 대시보드 (조회수, 체류 시간, 참여율)
