# Media Library Storage Bucket 설정 가이드

**마지막 업데이트**: 2025-11-22
**버전**: 1.0.0
**관련 마이그레이션**: `20251122100001_create_media_storage_bucket.sql`

---

## 개요

CMS Phase 5의 Media Library 기능을 위한 Supabase Storage 버킷 설정 가이드입니다.

### 버킷 정보

| 항목 | 값 |
|------|-----|
| Bucket 이름 | `media-library` |
| Public 접근 | Yes (읽기 허용) |
| 허용 MIME 타입 | `image/*` |
| 최대 파일 크기 | 10MB |
| 용도 | CMS 미디어 자산 관리 |

---

## 설정 방법

### 방법 1: Supabase Dashboard (권장)

**장점**: UI를 통해 쉽게 설정 가능, 즉시 적용

#### 1단계: Storage 버킷 생성

1. **Supabase Dashboard 접속**
   - URL: https://supabase.com/dashboard/project/zykjdneewbzyazfukzyg

2. **Storage 메뉴 접근**
   - 왼쪽 사이드바 > Storage 클릭

3. **New Bucket 클릭**
   - Name: `media-library`
   - Public bucket: **체크** (필수)
   - **Create bucket** 클릭

#### 2단계: 버킷 설정 수정

1. **media-library 버킷 클릭**
2. **Settings 탭 클릭**
3. **다음 설정 적용**:

   | 설정 | 값 |
   |------|-----|
   | Public bucket | Enabled |
   | File size limit | 10 MB |
   | Allowed MIME types | image/jpeg, image/png, image/gif, image/svg+xml, image/webp, image/avif |

4. **Save** 클릭

#### 3단계: RLS 정책 적용

**SQL Editor에서 실행**:

```sql
-- 1. Public 읽기 정책
CREATE POLICY "Public can view media files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'media-library');

-- 2. 인증된 사용자 업로드 정책
CREATE POLICY "Authenticated users can upload media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'media-library'
);

-- 3. 관리자 수정 정책
CREATE POLICY "Admins can update media files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'media-library'
  AND EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  )
);

-- 4. 관리자 삭제 정책
CREATE POLICY "Admins can delete media files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'media-library'
  AND EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  )
);
```

---

### 방법 2: 마이그레이션 (자동화)

**장점**: 버전 관리 가능, CI/CD 파이프라인에서 자동 적용

#### 1단계: 마이그레이션 파일 확인

마이그레이션 파일 위치:
```
supabase/migrations/20251122100001_create_media_storage_bucket.sql
```

#### 2단계: 마이그레이션 적용

**로컬 환경**:
```bash
# Supabase CLI 사용
supabase db push
```

**프로덕션 환경**:
```bash
# Supabase CLI 사용
supabase db push --linked
```

#### 3단계: 버킷 수동 생성 (필수)

SQL 마이그레이션으로는 Storage 버킷을 직접 생성할 수 없습니다.
Dashboard에서 수동으로 버킷을 생성해야 합니다:

1. Supabase Dashboard > Storage > New Bucket
2. Name: `media-library`
3. Public bucket: 체크
4. Create bucket

---

### 방법 3: Supabase CLI

```bash
# 버킷 생성
supabase storage create media-library --public

# 버킷 목록 확인
supabase storage list
```

---

### 방법 4: Supabase Management API

```bash
# 버킷 생성 API 호출
curl -X POST 'https://zykjdneewbzyazfukzyg.supabase.co/storage/v1/bucket' \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "media-library",
    "name": "media-library",
    "public": true,
    "file_size_limit": 10485760,
    "allowed_mime_types": ["image/jpeg", "image/png", "image/gif", "image/svg+xml", "image/webp", "image/avif"]
  }'
```

---

## 검증 방법

### 1. 버킷 생성 확인

**Dashboard 확인**:
- Storage > `media-library` 버킷이 표시되는지 확인
- Public 아이콘(지구본)이 표시되는지 확인

**SQL 쿼리**:
```sql
SELECT * FROM storage.buckets WHERE id = 'media-library';
```

예상 결과:
```
id            | name          | public | file_size_limit | ...
--------------|---------------|--------|-----------------|----
media-library | media-library | true   | 10485760        | ...
```

### 2. RLS 정책 확인

```sql
SELECT
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%media%'
ORDER BY policyname;
```

예상 결과:
```
policyname                            | permissive | roles           | cmd
--------------------------------------|------------|-----------------|--------
Admins can delete media files         | PERMISSIVE | {authenticated} | DELETE
Admins can update media files         | PERMISSIVE | {authenticated} | UPDATE
Authenticated users can upload media  | PERMISSIVE | {authenticated} | INSERT
Public can view media files           | PERMISSIVE | {public}        | SELECT
```

### 3. 업로드 테스트

**관리자 계정으로 테스트**:

1. 관리자 계정으로 로그인
2. `/admin/media` 페이지 접속
3. 이미지 파일 업로드 (10MB 이하, JPG/PNG/GIF/SVG/WEBP)
4. 업로드 성공 메시지 확인
5. 미리보기 이미지 표시 확인

### 4. Public URL 접근 테스트

업로드된 파일의 Public URL 형식:
```
https://zykjdneewbzyazfukzyg.supabase.co/storage/v1/object/public/media-library/[파일경로]/[파일명]
```

브라우저에서 URL 직접 접근하여 이미지가 표시되는지 확인

---

## 파일 구조

Storage에 업로드된 파일은 다음 구조로 저장됩니다:

```
media-library/
├── images/
│   ├── 2025/
│   │   └── 11/
│   │       ├── uuid-1.jpg
│   │       ├── uuid-2.png
│   │       └── uuid-3.webp
│   └── thumbnails/
│       ├── uuid-1-thumb.jpg
│       └── uuid-2-thumb.png
└── uploads/
    └── [temp files]
```

---

## 보안 설정

### RLS 정책 요약

| 동작 | 권한 | 설명 |
|------|------|------|
| SELECT | Public | 모든 사용자가 파일 읽기/다운로드 가능 |
| INSERT | Authenticated | 로그인한 사용자만 업로드 가능 |
| UPDATE | Admin | 관리자만 메타데이터 수정 가능 |
| DELETE | Admin | 관리자만 파일 삭제 가능 |

### 허용 MIME 타입

| MIME Type | 확장자 | 설명 |
|-----------|--------|------|
| image/jpeg | .jpg, .jpeg | JPEG 이미지 |
| image/png | .png | PNG 이미지 |
| image/gif | .gif | GIF 이미지 (애니메이션 포함) |
| image/svg+xml | .svg | SVG 벡터 이미지 |
| image/webp | .webp | WebP 이미지 |
| image/avif | .avif | AVIF 이미지 |

### 파일 크기 제한

- 최대 파일 크기: **10MB** (10,485,760 bytes)
- 권장 파일 크기: **2MB 이하** (웹 성능 최적화)

---

## 문제 해결

### 문제: 업로드 실패 (403 Forbidden)

**원인 1**: RLS 정책 미설정
```sql
-- 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'objects';
```

**원인 2**: 사용자 인증 안 됨
- 로그인 상태 확인
- JWT 토큰 유효성 확인

**해결**:
```sql
-- RLS 정책 재생성
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media-library');
```

### 문제: 파일이 Public으로 접근되지 않음

**원인**: 버킷이 Private으로 설정됨

**해결**:
1. Dashboard > Storage > media-library > Settings
2. "Make public" 활성화
3. 또는:
```sql
UPDATE storage.buckets
SET public = true
WHERE id = 'media-library';
```

### 문제: MIME 타입 거부됨

**원인**: 허용되지 않은 파일 형식

**해결**:
1. Dashboard > Storage > media-library > Settings
2. Allowed MIME types에 필요한 타입 추가
3. 또는 파일을 허용된 형식으로 변환

### 문제: 파일 크기 초과 (413 Payload Too Large)

**원인**: 10MB 초과 파일 업로드

**해결**:
- 클라이언트에서 파일 크기 검증 추가
- 이미지 압축 도구 사용 (TinyPNG, ImageOptim 등)
- 또는 버킷 설정에서 크기 제한 증가

### 문제: CORS 에러

**원인**: 도메인 허용 목록 미설정

**해결**:
1. Dashboard > Settings > API
2. "Site URL" 확인: `https://www.ideaonaction.ai`
3. "Additional URLs" 추가: `http://localhost:5173` (개발용)

---

## 코드 통합

### useMediaLibrary Hook 사용 예시

```typescript
import { useMediaLibrary } from '@/hooks/cms/useMediaLibrary';

function MediaUploader() {
  const { uploadMedia, isUploading, error } = useMediaLibrary();

  const handleUpload = async (file: File) => {
    const result = await uploadMedia(file, {
      altText: 'Image description',
    });

    if (result) {
      console.log('Uploaded:', result.publicUrl);
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      disabled={isUploading}
    />
  );
}
```

### Direct Supabase Client 사용

```typescript
import { supabase } from '@/integrations/supabase/client';

async function uploadToMediaLibrary(file: File) {
  // 1. 파일명 생성
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const filePath = `images/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${fileName}`;

  // 2. 업로드
  const { data, error } = await supabase.storage
    .from('media-library')
    .upload(filePath, file, {
      contentType: file.type,
      cacheControl: '3600',
    });

  if (error) throw error;

  // 3. Public URL 가져오기
  const { data: { publicUrl } } = supabase.storage
    .from('media-library')
    .getPublicUrl(data.path);

  return { path: data.path, publicUrl };
}
```

---

## 용량 관리

### 현재 플랜 한도 (Supabase Free Tier)

| 항목 | 한도 |
|------|------|
| Storage | 1GB |
| Bandwidth | 2GB/월 |

### 용량 모니터링

```sql
-- 버킷별 사용량 확인
SELECT
  bucket_id,
  COUNT(*) as file_count,
  pg_size_pretty(SUM((metadata->>'size')::bigint)) as total_size
FROM storage.objects
WHERE bucket_id = 'media-library'
GROUP BY bucket_id;
```

### 정리 작업

```sql
-- 30일 이상 된 미사용 파일 찾기
SELECT
  o.name,
  o.created_at,
  pg_size_pretty((o.metadata->>'size')::bigint) as size
FROM storage.objects o
WHERE o.bucket_id = 'media-library'
  AND o.created_at < NOW() - INTERVAL '30 days'
  AND NOT EXISTS (
    SELECT 1 FROM public.media_library m
    WHERE m.storage_path LIKE '%' || o.name
  )
ORDER BY o.created_at;
```

---

## 관련 문서

- [Media Library Table Migration](../../../supabase/migrations/20251122100000_create_media_library_table.sql)
- [Storage Bucket RLS Migration](../../../supabase/migrations/20251122100001_create_media_storage_bucket.sql)
- [기존 Services Storage 가이드](./setup.md)
- [Supabase Storage 공식 문서](https://supabase.com/docs/guides/storage)
- [RLS 정책 가이드](https://supabase.com/docs/guides/storage/security/access-control)

---

## 체크리스트

### 설정 완료 체크리스트

- [ ] `media-library` 버킷 생성
- [ ] Public 접근 활성화
- [ ] 파일 크기 제한 설정 (10MB)
- [ ] MIME 타입 제한 설정 (image/*)
- [ ] RLS 정책 적용 (SELECT, INSERT, UPDATE, DELETE)
- [ ] 업로드 테스트 완료
- [ ] Public URL 접근 테스트 완료
- [ ] 삭제 권한 테스트 완료

---

**End of Guide**
