# Giscus 설정 가이드
## GitHub Discussions 기반 댓글 시스템

**작성일**: 2025-11-14
**목적**: Sprint 2에서 Community/Blog 페이지에 댓글 기능 추가
**소요 시간**: 15분

---

## 📋 개요

### Giscus란?
- GitHub Discussions를 백엔드로 사용하는 댓글 위젯
- GitHub 계정으로 로그인 (OAuth)
- React 컴포넌트 지원 (`@giscus/react`)
- 완전 무료, 오픈소스

### 왜 Giscus인가?
- ✅ 자체 댓글 시스템 구축 대비 **3일 절약**
- ✅ GitHub 계정 기반 (추가 회원가입 불필요)
- ✅ 스팸 방지 (GitHub 인증 필수)
- ✅ Markdown 지원
- ✅ 다크 모드 지원

### 제한사항
- GitHub 계정이 없는 사용자는 댓글 작성 불가 (읽기만 가능)
- 댓글 데이터는 GitHub에 저장 (자체 DB 아님)

---

## 🚀 설정 단계

### Step 1: GitHub Discussions 활성화

**1.1. 리포지토리 설정 확인**

GitHub 리포지토리로 이동:
```
https://github.com/IDEA-on-Action/idea-on-action
```

**1.2. Discussions 활성화**

1. 리포지토리 → **Settings** 탭
2. **Features** 섹션
3. **Discussions** 체크박스 활성화
4. **Set up discussions** 클릭

**1.3. 카테고리 생성**

Discussions 페이지 → **Categories** 관리:
- **Community**: 일반 토론 (Announcement 형식)
- **Blog Comments**: 블로그 댓글 (Q&A 형식)

---

### Step 2: Giscus App 설치

**2.1. Giscus App 페이지 이동**

```
https://github.com/apps/giscus
```

**2.2. Install 클릭**

1. "Install" 버튼 클릭
2. 설치할 리포지토리 선택:
   - **Only select repositories** 선택
   - `IDEA-on-Action/idea-on-action` 선택
3. **Install** 클릭

**2.3. 권한 확인**

Giscus App이 요청하는 권한:
- ✅ Read access to Discussions
- ✅ Write access to Discussions (댓글 작성)

---

### Step 3: Giscus 설정 생성

**3.1. Giscus 설정 페이지 이동**

```
https://giscus.app/
```

**3.2. 리포지토리 입력**

**Repository** 필드:
```
IDEA-on-Action/idea-on-action
```

**Public 체크**: 리포지토리가 public이어야 함

**3.3. Discussion 매핑 설정**

**Page ↔️ Discussions Mapping**:
- **pathname**: URL 경로 기반 매핑 (권장)
  - 예: `/community` → "Community" Discussion
  - 예: `/blog/post-1` → "Blog Comments: post-1" Discussion

**3.4. Discussion 카테고리**

**Discussion Category**:
- Community 페이지: **Community** 카테고리
- Blog 페이지: **Blog Comments** 카테고리

**3.5. Features 선택**

체크박스:
- ✅ **Enable Reactions**: 댓글에 이모지 반응
- ✅ **Emit Discussion Metadata**: 댓글 수 메타데이터
- ✅ **Input Position**: 댓글 입력창 위치 (상단 권장)

**3.6. 테마 선택**

**Theme**:
- `light`: 라이트 모드 (기본)
- `dark`: 다크 모드
- `preferred_color_scheme`: 시스템 테마 따라가기 (권장)

**3.7. 생성된 코드 복사**

아래와 같은 코드가 생성됩니다:

```tsx
import Giscus from '@giscus/react';

export default function MyApp() {
  return (
    <Giscus
      id="comments"
      repo="IDEA-on-Action/idea-on-action"
      repoId="YOUR_REPO_ID"
      category="Community"
      categoryId="YOUR_CATEGORY_ID"
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="1"
      inputPosition="top"
      theme="preferred_color_scheme"
      lang="ko"
      loading="lazy"
    />
  );
}
```

**중요**: `repoId`와 `categoryId`를 복사해두세요!

---

### Step 4: 환경변수 설정

**4.1. .env.local 파일 수정**

프로젝트 루트 디렉토리:
```bash
# .env.local (기존 파일에 추가)

# Giscus
VITE_GISCUS_REPO="IDEA-on-Action/idea-on-action"
VITE_GISCUS_REPO_ID="YOUR_REPO_ID"
VITE_GISCUS_CATEGORY_COMMUNITY="Community"
VITE_GISCUS_CATEGORY_COMMUNITY_ID="YOUR_CATEGORY_ID"
VITE_GISCUS_CATEGORY_BLOG="Blog Comments"
VITE_GISCUS_CATEGORY_BLOG_ID="YOUR_BLOG_CATEGORY_ID"
```

**4.2. Vercel 환경변수 추가**

Vercel 대시보드:
1. Project → **Settings** → **Environment Variables**
2. 위 환경변수들을 모두 추가
3. **Production**, **Preview**, **Development** 모두 체크

---

### Step 5: React 컴포넌트 생성

**5.1. Giscus 패키지 설치**

```bash
npm install @giscus/react
```

**5.2. GiscusComments 컴포넌트 생성**

파일: `src/components/community/GiscusComments.tsx`

```tsx
import { useEffect, useRef } from 'react';
import Giscus from '@giscus/react';
import { useTheme } from '@/hooks/useTheme';

interface GiscusCommentsProps {
  category: 'Community' | 'Blog Comments';
  term?: string; // Discussion 제목 (optional)
}

export function GiscusComments({ category, term }: GiscusCommentsProps) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // 카테고리별 ID 매핑
  const categoryId = category === 'Community'
    ? import.meta.env.VITE_GISCUS_CATEGORY_COMMUNITY_ID
    : import.meta.env.VITE_GISCUS_CATEGORY_BLOG_ID;

  return (
    <div ref={containerRef} className="w-full">
      <Giscus
        id="comments"
        repo={import.meta.env.VITE_GISCUS_REPO}
        repoId={import.meta.env.VITE_GISCUS_REPO_ID}
        category={category}
        categoryId={categoryId}
        mapping={term ? 'specific' : 'pathname'}
        term={term}
        reactionsEnabled="1"
        emitMetadata="1"
        inputPosition="top"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang="ko"
        loading="lazy"
      />
    </div>
  );
}
```

**5.3. Community 페이지 통합**

파일: `src/pages/Community.tsx`

```tsx
import { GiscusComments } from '@/components/community/GiscusComments';

export default function Community() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Community</h1>

      {/* 설명 섹션 */}
      <p className="text-muted-foreground mb-8">
        프로젝트에 대한 의견을 자유롭게 나눠주세요!
      </p>

      {/* Giscus 댓글 */}
      <GiscusComments category="Community" />
    </div>
  );
}
```

**5.4. Blog 포스트 통합**

파일: `src/pages/BlogPost.tsx`

```tsx
import { GiscusComments } from '@/components/community/GiscusComments';

export default function BlogPost() {
  const { slug } = useParams(); // 예: "weekly-recap-1"

  return (
    <article className="container mx-auto px-4 py-12">
      {/* 블로그 포스트 내용 */}
      <h1>Weekly Recap #1</h1>
      <p>...</p>

      {/* 댓글 섹션 */}
      <section className="mt-16 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">💬 Comments</h2>
        <GiscusComments
          category="Blog Comments"
          term={`blog-${slug}`}
        />
      </section>
    </article>
  );
}
```

---

## ✅ 검증

### 로컬 테스트

**1. 개발 서버 실행**

```bash
npm run dev
```

**2. Community 페이지 접속**

```
http://localhost:5173/community
```

**3. 확인 사항**

- [ ] Giscus 위젯이 로드됨
- [ ] 테마가 올바름 (라이트/다크 자동 전환)
- [ ] "GitHub으로 로그인" 버튼 표시
- [ ] 로그인 후 댓글 작성 가능
- [ ] 댓글이 GitHub Discussions에 저장됨

**4. GitHub Discussions 확인**

```
https://github.com/IDEA-on-Action/idea-on-action/discussions
```

- 새 Discussion이 생성되었는지 확인
- 카테고리가 올바른지 확인 (Community 또는 Blog Comments)

---

## 🐛 문제 해결

### Q1: "리포지토리가 public이 아닙니다" 에러

**원인**: 리포지토리가 private
**해결**: Settings → General → Danger Zone → "Change visibility" → Public으로 변경

---

### Q2: "Discussions를 찾을 수 없습니다" 에러

**원인**: Discussions가 활성화되지 않음
**해결**: Settings → Features → Discussions 체크박스 활성화

---

### Q3: "카테고리 ID가 잘못되었습니다" 에러

**원인**: 환경변수의 `categoryId`가 틀림
**해결**: Giscus 설정 페이지에서 다시 코드 생성 → `categoryId` 복사

---

### Q4: 댓글 위젯이 로드되지 않음

**원인**: Giscus App이 설치되지 않음
**해결**: https://github.com/apps/giscus 에서 App 설치

---

### Q5: 다크 모드 테마가 적용되지 않음

**원인**: `theme` prop이 동적으로 변경되지 않음
**해결**: `resolvedTheme` 변경 시 Giscus를 리렌더링하도록 `key` 추가

```tsx
<Giscus
  key={resolvedTheme} // 테마 변경 시 리렌더링
  theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
  {...otherProps}
/>
```

---

## 📊 완료 체크리스트

Sprint 2 구현 전에 다음 항목을 **모두** 완료해야 합니다:

### GitHub 설정
- [ ] GitHub Discussions 활성화 (`IDEA-on-Action/idea-on-action`)
- [ ] 카테고리 2개 생성 (Community, Blog Comments)
- [ ] Giscus App 설치
- [ ] 리포지토리 public 설정 확인

### 환경변수
- [ ] `.env.local`에 Giscus 환경변수 추가
- [ ] Vercel 환경변수에 Giscus 설정 추가

### 코드 준비
- [ ] `@giscus/react` 패키지 설치
- [ ] `GiscusComments.tsx` 컴포넌트 생성 (선택사항, 구현 시 생성)

### 검증
- [ ] 로컬에서 댓글 위젯 로드 확인
- [ ] 테스트 댓글 작성 → GitHub Discussions 확인
- [ ] 다크 모드 테마 전환 확인

---

## 📝 참고 자료

- **Giscus 공식 사이트**: https://giscus.app/
- **Giscus GitHub**: https://github.com/giscus/giscus
- **React 컴포넌트 문서**: https://github.com/giscus/giscus-component
- **GitHub Discussions 가이드**: https://docs.github.com/en/discussions

---

**문서 변경 이력**:
- 2025-11-14: 초안 작성 (v1.0)
