# Sprint 1: 미디어 라이브러리 (Phase 5-1)

**기간**: 3-4일
**목표**: Supabase Storage 기반 미디어 라이브러리 시스템 구축
**총 태스크**: 19개
**예상 시간**: 32-36시간

---

## Day 1: Supabase Storage 설정

### [TASK-001] Supabase Storage bucket 생성 (예상 시간: 1시간)

**설명**: Supabase 대시보드에서 media-library bucket 생성 및 기본 설정
**우선순위**: 높음
**의존성**: 없음
**담당**: Developer

**작업 내용**:
1. Supabase 대시보드에서 Storage > New bucket 클릭
2. Bucket 이름: `media-library`, Public 설정
3. 파일 크기 제한: 50MB, 허용 MIME 타입 설정
4. Bucket 설정 문서화 (docs/guides/cms/media-library-storage.md)

**완료 기준**:
- [ ] `media-library` bucket 생성 완료
- [ ] Public 액세스 설정 확인
- [ ] 파일 업로드 테스트 (수동)
- [ ] 설정 문서 작성 완료

**테스트**:
- [ ] 수동 테스트: Supabase 대시보드에서 파일 업로드/삭제

**관련 파일**:
- `docs/guides/cms/media-library-storage.md` (신규)

---

### [TASK-002] RLS 정책 설정 (예상 시간: 1.5시간)

**설명**: media-library bucket에 대한 RLS 정책 생성 (읽기/쓰기/삭제)
**우선순위**: 높음
**의존성**: TASK-001
**담당**: Developer

**작업 내용**:
1. SQL 마이그레이션 파일 생성 (supabase/migrations/)
2. RLS 정책 작성:
   - SELECT: authenticated 사용자 (모든 파일)
   - INSERT: admin 역할만
   - UPDATE: admin 역할만
   - DELETE: admin 역할만 (soft delete)
3. 정책 테스트 쿼리 작성 (scripts/test-media-rls.sql)

**완료 기준**:
- [ ] RLS 정책 마이그레이션 파일 생성
- [ ] 4개 정책 (SELECT, INSERT, UPDATE, DELETE) 작성
- [ ] admin/non-admin 사용자 권한 검증
- [ ] 테스트 쿼리로 정책 확인

**테스트**:
- [ ] SQL 테스트: admin 사용자로 CRUD 가능
- [ ] SQL 테스트: non-admin 사용자는 SELECT만 가능

**관련 파일**:
- `supabase/migrations/20251117000000_media_library_rls.sql` (신규)
- `scripts/test-media-rls.sql` (신규)

---

### [TASK-003] media_library 테이블 생성 (예상 시간: 1시간)

**설명**: 미디어 메타데이터를 저장할 media_library 테이블 스키마 생성
**우선순위**: 높음
**의존성**: 없음
**담당**: Developer

**작업 내용**:
1. 테이블 스키마 설계 (plan/cms-phase5/architecture.md 참조)
2. SQL 마이그레이션 파일 작성
3. 인덱스 생성 (file_type, created_by, created_at)
4. CHECK constraint 추가 (file_size > 0, max 50MB)

**완료 기준**:
- [ ] media_library 테이블 생성
- [ ] 13개 컬럼 모두 정의 (id, file_name, file_path, file_type, file_size, width, height, alt_text, caption, uploaded_by, created_at, updated_at, metadata)
- [ ] 3개 인덱스 생성
- [ ] CHECK constraint 2개 추가

**테스트**:
- [ ] SQL 테스트: INSERT 성공
- [ ] SQL 테스트: 50MB 초과 파일 거부
- [ ] SQL 테스트: file_size < 0 거부

**관련 파일**:
- `supabase/migrations/20251117000100_create_media_library_table.sql` (신규)

---

### [TASK-004] Database 마이그레이션 스크립트 작성 (예상 시간: 1.5시간)

**설명**: 마이그레이션 적용/롤백 스크립트 및 검증 쿼리 작성
**우선순위**: 중간
**의존성**: TASK-002, TASK-003
**담당**: Developer

**작업 내용**:
1. apply-media-library-migration.sh 작성 (Supabase CLI)
2. rollback-media-library-migration.sh 작성
3. verify-media-library-schema.sql 작성 (테이블/인덱스/정책 확인)
4. README.md 작성 (마이그레이션 가이드)

**완료 기준**:
- [ ] apply 스크립트 작성 및 테스트
- [ ] rollback 스크립트 작성 및 테스트
- [ ] verify 쿼리로 모든 객체 확인
- [ ] 마이그레이션 가이드 문서 작성

**테스트**:
- [ ] 로컬 DB에서 apply → verify → rollback → verify
- [ ] 프로덕션 dry-run 테스트

**관련 파일**:
- `scripts/apply-media-library-migration.sh` (신규)
- `scripts/rollback-media-library-migration.sh` (신규)
- `scripts/verify-media-library-schema.sql` (신규)
- `docs/guides/cms/media-library-migration.md` (신규)

---

### [TASK-005] 환경 변수 설정 및 검증 (예상 시간: 1시간)

**설명**: Supabase Storage URL 환경 변수 추가 및 검증 스크립트 작성
**우선순위**: 중간
**의존성**: TASK-001
**담당**: Developer

**작업 내용**:
1. .env.example에 VITE_SUPABASE_STORAGE_URL 추가
2. .env.local에 실제 값 설정
3. verify-env.js 스크립트 작성 (환경 변수 검증)
4. vite.config.ts에서 환경 변수 타입 선언

**완료 기준**:
- [ ] .env.example 업데이트
- [ ] .env.local 설정 완료
- [ ] verify-env.js 실행 성공
- [ ] TypeScript 타입 선언 추가

**테스트**:
- [ ] npm run verify:env 성공
- [ ] 빌드 시 환경 변수 주입 확인

**관련 파일**:
- `.env.example`
- `scripts/verify-env.js` (신규)
- `vite.config.ts`

---

## Day 2: 업로드 UI 구현

### [TASK-006] react-dropzone 설치 및 설정 (예상 시간: 1시간)

**설명**: react-dropzone 라이브러리 설치 및 기본 설정
**우선순위**: 높음
**의존성**: 없음
**담당**: Developer

**작업 내용**:
1. npm install react-dropzone @types/react-dropzone
2. DropzoneConfig 타입 정의 (src/types/cms.types.ts)
3. 기본 설정 상수 작성 (src/lib/constants/media.ts)
4. 설정 문서 작성 (docs/guides/cms/dropzone-config.md)

**완료 기준**:
- [ ] react-dropzone 설치 완료
- [ ] TypeScript 타입 정의
- [ ] 기본 설정 (maxSize: 50MB, accept: image/*, video/*, application/pdf)
- [ ] 문서 작성 완료

**테스트**:
- [ ] TypeScript 컴파일 에러 없음
- [ ] 빌드 성공

**관련 파일**:
- `package.json`
- `src/types/cms.types.ts`
- `src/lib/constants/media.ts` (신규)
- `docs/guides/cms/dropzone-config.md` (신규)

---

### [TASK-007] MediaUploader 컴포넌트 기본 구조 (예상 시간: 2시간)

**설명**: Drag & Drop 파일 업로드 UI 컴포넌트 기본 구조 작성
**우선순위**: 높음
**의존성**: TASK-006
**담당**: Developer

**작업 내용**:
1. src/components/admin/MediaUploader.tsx 생성
2. react-dropzone useDropzone 훅 통합
3. 드래그 상태 UI (border, background 변경)
4. 파일 미리보기 목록 UI (thumbnail, 파일명, 크기)
5. shadcn/ui Card, Button 컴포넌트 사용

**완료 기준**:
- [ ] MediaUploader 컴포넌트 생성
- [ ] Drag & Drop 영역 UI 완성
- [ ] 파일 선택 후 미리보기 목록 표시
- [ ] TypeScript 타입 에러 없음

**테스트**:
- [ ] Storybook 스토리 작성 (3개: 기본, 드래그 중, 파일 선택 후)
- [ ] 접근성 테스트 (키보드 탐색)

**관련 파일**:
- `src/components/admin/MediaUploader.tsx` (신규)
- `src/components/admin/MediaUploader.stories.tsx` (신규)

---

### [TASK-008] useMediaUpload 훅 구현 (예상 시간: 2.5시간)

**설명**: Supabase Storage 파일 업로드 로직을 담당하는 React Query 훅
**우선순위**: 높음
**의존성**: TASK-005
**담당**: Developer

**작업 내용**:
1. src/hooks/useMediaUpload.ts 생성
2. useMutation 훅으로 업로드 로직 구현
3. Supabase Storage upload API 통합
4. 진행률 추적 로직 (onUploadProgress)
5. 에러 처리 (파일 크기, MIME 타입, 네트워크 에러)
6. 성공 시 media_library 테이블에 메타데이터 INSERT

**완료 기준**:
- [ ] useMediaUpload 훅 생성
- [ ] 파일 업로드 성공 (Supabase Storage)
- [ ] 메타데이터 INSERT 성공 (media_library 테이블)
- [ ] 진행률 0% → 100% 추적
- [ ] 에러 처리 3가지 (크기, 타입, 네트워크)

**테스트**:
- [ ] 단위 테스트: 업로드 성공 케이스
- [ ] 단위 테스트: 파일 크기 초과 에러
- [ ] 단위 테스트: 잘못된 MIME 타입 에러

**관련 파일**:
- `src/hooks/useMediaUpload.ts` (신규)
- `src/hooks/__tests__/useMediaUpload.test.ts` (신규)

---

### [TASK-009] 파일 타입 검증 로직 (예상 시간: 1.5시간)

**설명**: MIME 타입 및 파일 확장자 검증 유틸리티 함수
**우선순위**: 중간
**의존성**: TASK-006
**담당**: Developer

**작업 내용**:
1. src/lib/validators/file.ts 생성
2. validateFileType 함수 작성 (MIME 타입 체크)
3. validateFileSize 함수 작성 (50MB 제한)
4. getFileCategory 함수 작성 (image/video/document 분류)
5. sanitizeFileName 함수 작성 (특수문자 제거, kebab-case)

**완료 기준**:
- [ ] 4개 함수 작성 완료
- [ ] MIME 타입 화이트리스트 정의
- [ ] 파일 크기 제한 검증
- [ ] 파일명 sanitize 로직

**테스트**:
- [ ] 단위 테스트: validateFileType (10개 케이스)
- [ ] 단위 테스트: validateFileSize (3개 케이스)
- [ ] 단위 테스트: getFileCategory (6개 케이스)
- [ ] 단위 테스트: sanitizeFileName (5개 케이스)

**관련 파일**:
- `src/lib/validators/file.ts` (신규)
- `src/lib/validators/__tests__/file.test.ts` (신규)

---

### [TASK-010] 업로드 진행률 UI (예상 시간: 1.5시간)

**설명**: 파일 업로드 진행률을 표시하는 Progress 컴포넌트
**우선순위**: 중간
**의존성**: TASK-008
**담당**: Developer

**작업 내용**:
1. src/components/admin/UploadProgress.tsx 생성
2. shadcn/ui Progress 컴포넌트 사용
3. 진행률 퍼센트 표시 (0~100%)
4. 파일명, 파일 크기 표시
5. 취소 버튼 추가 (AbortController)

**완료 기준**:
- [ ] UploadProgress 컴포넌트 생성
- [ ] Progress bar 애니메이션 동작
- [ ] 파일 정보 표시
- [ ] 취소 버튼 클릭 시 업로드 중단

**테스트**:
- [ ] Storybook 스토리 작성 (4개: 0%, 50%, 100%, 에러)
- [ ] 접근성 테스트 (aria-valuenow)

**관련 파일**:
- `src/components/admin/UploadProgress.tsx` (신규)
- `src/components/admin/UploadProgress.stories.tsx` (신규)

---

## Day 3: 갤러리 UI 구현

### [TASK-011] MediaGallery 컴포넌트 (그리드 뷰) (예상 시간: 2시간)

**설명**: 업로드된 미디어 파일을 그리드 형태로 표시하는 갤러리
**우선순위**: 높음
**의존성**: TASK-003
**담당**: Developer

**작업 내용**:
1. src/components/admin/MediaGallery.tsx 생성
2. CSS Grid 레이아웃 (3-4 columns, responsive)
3. MediaCard 컴포넌트 (thumbnail, 파일명, 크기, 업로드 날짜)
4. 이미지 lazy loading (Intersection Observer)
5. 선택 모드 (체크박스, 다중 선택)

**완료 기준**:
- [ ] MediaGallery 컴포넌트 생성
- [ ] Grid 레이아웃 반응형 동작
- [ ] MediaCard 컴포넌트 생성
- [ ] Lazy loading 적용
- [ ] 다중 선택 기능 구현

**테스트**:
- [ ] Storybook 스토리 작성 (3개: 빈 상태, 10개 항목, 선택 모드)
- [ ] 반응형 테스트 (mobile, tablet, desktop)

**관련 파일**:
- `src/components/admin/MediaGallery.tsx` (신규)
- `src/components/admin/MediaCard.tsx` (신규)
- `src/components/admin/MediaGallery.stories.tsx` (신규)

---

### [TASK-012] useMediaList 훅 (React Query) (예상 시간: 2시간)

**설명**: media_library 테이블에서 미디어 목록을 가져오는 React Query 훅
**우선순위**: 높음
**의존성**: TASK-003
**담당**: Developer

**작업 내용**:
1. src/hooks/useMediaList.ts 생성
2. useQuery 훅으로 목록 조회
3. 페이지네이션 (20개씩)
4. 필터링 (파일 타입별)
5. 정렬 (업로드 날짜, 파일명, 파일 크기)
6. React Query 캐시 무효화 로직

**완료 기준**:
- [ ] useMediaList 훅 생성
- [ ] 페이지네이션 동작 (page, limit)
- [ ] 필터링 동작 (file_type)
- [ ] 정렬 동작 (created_at DESC)
- [ ] 캐시 무효화 (업로드/삭제 후)

**테스트**:
- [ ] 단위 테스트: 목록 조회 성공
- [ ] 단위 테스트: 페이지네이션
- [ ] 단위 테스트: 필터링 (image, video, document)

**관련 파일**:
- `src/hooks/useMediaList.ts` (신규)
- `src/hooks/__tests__/useMediaList.test.ts` (신규)

---

### [TASK-013] MediaPreview 모달 컴포넌트 (예상 시간: 2시간)

**설명**: 미디어 파일 상세보기 및 메타데이터 편집 모달
**우선순위**: 중간
**의존성**: TASK-011
**담당**: Developer

**작업 내용**:
1. src/components/admin/MediaPreview.tsx 생성
2. shadcn/ui Dialog 컴포넌트 사용
3. 이미지 확대/축소 (react-zoom-pan-pinch)
4. 메타데이터 편집 폼 (alt_text, caption)
5. 파일 정보 표시 (크기, 타입, 업로드 날짜, URL)
6. 복사 버튼 (파일 URL 클립보드 복사)

**완료 기준**:
- [ ] MediaPreview 컴포넌트 생성
- [ ] Dialog 열기/닫기 동작
- [ ] 이미지 확대/축소 기능
- [ ] 메타데이터 편집 저장
- [ ] URL 복사 기능

**테스트**:
- [ ] Storybook 스토리 작성 (3개: 이미지, 비디오, PDF)
- [ ] E2E 테스트: 모달 열기 → 편집 → 저장

**관련 파일**:
- `src/components/admin/MediaPreview.tsx` (신규)
- `src/components/admin/MediaPreview.stories.tsx` (신규)
- `tests/e2e/admin-media-preview.spec.ts` (신규)

---

### [TASK-014] useMediaDelete 훅 구현 (예상 시간: 1.5시간)

**설명**: 미디어 파일 삭제 (Soft delete) React Query 훅
**우선순위**: 중간
**의존성**: TASK-003
**담당**: Developer

**작업 내용**:
1. src/hooks/useMediaDelete.ts 생성
2. useMutation 훅으로 soft delete 구현
3. media_library 테이블에 deleted_at 컬럼 추가 (마이그레이션)
4. Supabase Storage 파일은 유지 (복원 가능)
5. React Query 캐시 무효화

**완료 기준**:
- [ ] useMediaDelete 훅 생성
- [ ] Soft delete 동작 (deleted_at 업데이트)
- [ ] Storage 파일은 삭제하지 않음
- [ ] 캐시 무효화 동작

**테스트**:
- [ ] 단위 테스트: 삭제 성공
- [ ] 단위 테스트: 권한 없음 에러
- [ ] E2E 테스트: 삭제 후 목록에서 사라짐

**관련 파일**:
- `src/hooks/useMediaDelete.ts` (신규)
- `src/hooks/__tests__/useMediaDelete.test.ts` (신규)
- `supabase/migrations/20251117000200_add_media_deleted_at.sql` (신규)

---

### [TASK-015] MediaSearch 컴포넌트 (검색 및 필터링) (예상 시간: 2.5시간)

**설명**: 파일명, 파일 타입, 업로드 날짜로 미디어 검색 및 필터링
**우선순위**: 중간
**의존성**: TASK-012
**담당**: Developer

**작업 내용**:
1. src/components/admin/MediaSearch.tsx 생성
2. 검색 입력 (file_name ILIKE)
3. 파일 타입 필터 (Select: All, Image, Video, Document)
4. 날짜 범위 필터 (DateRangePicker)
5. 정렬 옵션 (Select: 최신순, 이름순, 크기순)
6. URL 쿼리 파라미터 동기화 (react-router-dom)

**완료 기준**:
- [ ] MediaSearch 컴포넌트 생성
- [ ] 검색 입력 디바운싱 (500ms)
- [ ] 파일 타입 필터 동작
- [ ] 날짜 범위 필터 동작
- [ ] URL 쿼리 파라미터 동기화

**테스트**:
- [ ] 단위 테스트: 검색 디바운싱
- [ ] E2E 테스트: 검색 → 결과 업데이트
- [ ] E2E 테스트: 필터 → 결과 업데이트

**관련 파일**:
- `src/components/admin/MediaSearch.tsx` (신규)
- `src/components/admin/MediaSearch.stories.tsx` (신규)
- `tests/e2e/admin-media-search.spec.ts` (신규)

---

## Day 4: 이미지 최적화

### [TASK-016] Supabase Edge Function 생성 (sharp 통합) (예상 시간: 3시간)

**설명**: 이미지 리사이징 및 포맷 변환을 위한 Edge Function
**우선순위**: 높음
**의존성**: TASK-001
**담당**: Developer

**작업 내용**:
1. supabase/functions/optimize-image/index.ts 생성
2. sharp 라이브러리 통합 (Deno 환경)
3. 이미지 리사이징 로직 (width, height, fit)
4. WebP 변환 로직 (quality: 80)
5. Thumbnail 생성 (200x200, 400x400)
6. Edge Function 배포 스크립트 (deploy-edge-functions.sh)

**완료 기준**:
- [ ] optimize-image Edge Function 생성
- [ ] sharp 라이브러리 동작 확인
- [ ] 리사이징 테스트 (3가지 크기)
- [ ] WebP 변환 테스트
- [ ] 배포 스크립트 작성

**테스트**:
- [ ] 로컬 테스트: supabase functions serve
- [ ] 단위 테스트: 리사이징 결과 확인
- [ ] 단위 테스트: WebP 변환 결과 확인

**관련 파일**:
- `supabase/functions/optimize-image/index.ts` (신규)
- `scripts/deploy-edge-functions.sh` (신규)
- `docs/guides/cms/edge-function-optimization.md` (신규)

---

### [TASK-017] Thumbnail 자동 생성 로직 (예상 시간: 2시간)

**설명**: 파일 업로드 시 thumbnail 자동 생성 및 저장
**우선순위**: 중간
**의존성**: TASK-016
**담당**: Developer

**작업 내용**:
1. useMediaUpload 훅에 thumbnail 생성 로직 추가
2. Edge Function 호출 (optimize-image)
3. Thumbnail Storage 경로 (thumbnails/{file_id}/200x200.webp)
4. media_library 테이블에 thumbnail_url 컬럼 추가
5. 에러 처리 (Edge Function 실패 시 원본 사용)

**완료 기준**:
- [ ] Thumbnail 자동 생성 동작
- [ ] thumbnail_url 컬럼에 저장
- [ ] 에러 시 원본 이미지 사용
- [ ] MediaCard에서 thumbnail 표시

**테스트**:
- [ ] E2E 테스트: 파일 업로드 → thumbnail 생성 확인
- [ ] E2E 테스트: Edge Function 실패 → 원본 사용

**관련 파일**:
- `src/hooks/useMediaUpload.ts`
- `supabase/migrations/20251117000300_add_thumbnail_url.sql` (신규)

---

### [TASK-018] WebP 변환 구현 (예상 시간: 1.5시간)

**설명**: 업로드된 이미지를 WebP 포맷으로 자동 변환
**우선순위**: 낮음
**의존성**: TASK-016
**담당**: Developer

**작업 내용**:
1. Edge Function에 WebP 변환 옵션 추가
2. 원본 파일 유지 (원본 + WebP 모두 저장)
3. media_library 테이블에 webp_url 컬럼 추가
4. MediaPreview에서 WebP 우선 표시 (fallback: 원본)

**완료 기준**:
- [ ] WebP 변환 동작
- [ ] webp_url 컬럼에 저장
- [ ] 원본 파일 유지
- [ ] Picture 태그로 WebP 우선 로드

**테스트**:
- [ ] E2E 테스트: PNG 업로드 → WebP 생성 확인
- [ ] E2E 테스트: WebP 미지원 브라우저 → 원본 표시

**관련 파일**:
- `supabase/functions/optimize-image/index.ts`
- `src/components/admin/MediaPreview.tsx`
- `supabase/migrations/20251117000400_add_webp_url.sql` (신규)

---

### [TASK-019] E2E 테스트 작성 (20개) (예상 시간: 2.5시간)

**설명**: 미디어 라이브러리 전체 플로우 E2E 테스트
**우선순위**: 높음
**의존성**: TASK-001 ~ TASK-018
**담당**: Developer

**작업 내용**:
1. tests/e2e/admin-media-library.spec.ts 생성
2. 20개 테스트 케이스 작성:
   - 파일 업로드 (드래그 & 드롭, 파일 선택)
   - 업로드 진행률 표시
   - 갤러리 목록 표시
   - 검색 및 필터링 (파일 타입, 날짜)
   - 미디어 미리보기 (모달)
   - 메타데이터 편집 (alt_text, caption)
   - 파일 삭제 (soft delete)
   - Thumbnail 자동 생성
   - WebP 변환
   - 권한 체크 (admin만 업로드/삭제)
3. 테스트 헬퍼 함수 작성 (uploadFile, deleteFile)
4. 테스트 픽스처 준비 (샘플 이미지 3개)

**완료 기준**:
- [ ] 20개 E2E 테스트 작성
- [ ] 모든 테스트 통과
- [ ] 테스트 커버리지 80% 이상
- [ ] 테스트 헬퍼 함수 작성

**테스트**:
- [ ] npm run test:e2e -- admin-media-library.spec.ts

**관련 파일**:
- `tests/e2e/admin-media-library.spec.ts` (신규)
- `tests/e2e/helpers/media.ts` (신규)
- `tests/fixtures/sample-image-1.jpg` (신규)
- `tests/fixtures/sample-image-2.png` (신규)
- `tests/fixtures/sample-video-1.mp4` (신규)

---

## Sprint 1 체크리스트

### Database
- [ ] TASK-001: Supabase Storage bucket 생성
- [ ] TASK-002: RLS 정책 설정
- [ ] TASK-003: media_library 테이블 생성
- [ ] TASK-004: 마이그레이션 스크립트 작성
- [ ] TASK-005: 환경 변수 설정

### Upload UI
- [ ] TASK-006: react-dropzone 설치
- [ ] TASK-007: MediaUploader 컴포넌트
- [ ] TASK-008: useMediaUpload 훅
- [ ] TASK-009: 파일 타입 검증 로직
- [ ] TASK-010: 업로드 진행률 UI

### Gallery UI
- [ ] TASK-011: MediaGallery 컴포넌트
- [ ] TASK-012: useMediaList 훅
- [ ] TASK-013: MediaPreview 모달
- [ ] TASK-014: useMediaDelete 훅
- [ ] TASK-015: MediaSearch 컴포넌트

### Optimization
- [ ] TASK-016: Edge Function (sharp)
- [ ] TASK-017: Thumbnail 자동 생성
- [ ] TASK-018: WebP 변환
- [ ] TASK-019: E2E 테스트 (20개)

---

## 다음 단계
- Sprint 2: 리치 텍스트 에디터 (Tiptap)
- Sprint 3: 버전 관리 시스템
