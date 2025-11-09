# Giscus 설정 가이드

> GitHub Discussions 기반 댓글 시스템 Giscus 설정 방법

**작성일**: 2025-11-09
**대상**: Version 2.0 Sprint 2
**난이도**: 초급

---

## 📋 개요

Giscus는 GitHub Discussions를 활용한 무료 오픈소스 댓글 시스템입니다.
별도의 서버나 데이터베이스 없이 GitHub 저장소만으로 댓글 기능을 구현할 수 있습니다.

**장점**:
- ✅ 무료 & 오픈소스
- ✅ GitHub OAuth 인증 (스팸 방지)
- ✅ Markdown 지원
- ✅ 다크 모드 자동 전환
- ✅ 반응형 디자인
- ✅ SEO 친화적 (정적 HTML 댓글)

**적용 페이지**:
- `/community` - 커뮤니티 토론
- `/blog/:slug` - 블로그 댓글

---

## 🚀 설정 절차

### 1단계: GitHub Discussions 활성화

1. GitHub 저장소로 이동: https://github.com/IDEA-on-Action/idea-on-action
2. **Settings** 탭 클릭
3. **Features** 섹션에서 **Discussions** 체크박스 활성화
4. **Set up Discussions** 클릭

![GitHub Discussions 활성화](https://docs.github.com/assets/cb-25287/images/help/discussions/setup-discussions-button.png)

### 2단계: Giscus 앱 설치

1. https://github.com/apps/giscus 방문
2. **Install** 버튼 클릭
3. 저장소 선택:
   - **Only select repositories** 선택
   - `IDEA-on-Action/idea-on-action` 체크
4. **Install** 클릭하여 권한 승인

### 3단계: Discussions 카테고리 생성

1. 저장소 **Discussions** 탭으로 이동
2. 우측 상단 ⚙️ (설정) 아이콘 클릭
3. **Categories** 섹션에서 새 카테고리 생성:

**General 카테고리** (커뮤니티 토론용):
- Name: `General`
- Description: `커뮤니티 자유 토론`
- Discussion format: `Open-ended discussion`

**Blog Comments 카테고리** (블로그 댓글용):
- Name: `Blog Comments`
- Description: `블로그 포스트 댓글`
- Discussion format: `Open-ended discussion`

### 4단계: Giscus 설정값 받기

1. https://giscus.app/ko 방문
2. **저장소** 입력: `IDEA-on-Action/idea-on-action`
3. **Discussion 카테고리** 선택:
   - General (커뮤니티용)
   - Blog Comments (블로그용)
4. **페이지 ↔️ Discussions 매핑** 선택:
   - Community: `pathname`
   - BlogPost: `specific` (포스트별 개별 Discussion)

5. 아래로 스크롤하여 **생성된 설정값** 복사:
   - `data-repo-id`: YOUR_REPO_ID
   - `data-category-id`: YOUR_CATEGORY_ID (General용)
   - `data-category-id`: YOUR_BLOG_CATEGORY_ID (Blog Comments용)

![Giscus 설정 화면](https://giscus.app/og.png)

### 5단계: 코드에 설정값 적용

#### Community.tsx 업데이트

```typescript
// src/pages/Community.tsx
<GiscusComments
  repo="IDEA-on-Action/idea-on-action"
  repoId="YOUR_REPO_ID"  // ← 여기 수정
  category="General"
  categoryId="YOUR_GENERAL_CATEGORY_ID"  // ← 여기 수정
  mapping="pathname"
/>
```

#### BlogPost.tsx 업데이트

```typescript
// src/pages/BlogPost.tsx
<GiscusComments
  repo="IDEA-on-Action/idea-on-action"
  repoId="YOUR_REPO_ID"  // ← 여기 수정
  category="Blog Comments"
  categoryId="YOUR_BLOG_CATEGORY_ID"  // ← 여기 수정
  mapping="specific"
/>
```

### 6단계: 빌드 및 배포

```bash
# 빌드 확인
npm run build

# 배포 (Vercel)
git add .
git commit -m "feat: Giscus 설정 완료"
git push origin main
```

---

## 🔧 고급 설정

### 다크 모드 테마

GiscusComments 컴포넌트는 `useTheme()` 훅을 사용하여 자동으로 다크 모드를 전환합니다.

```typescript
// src/components/community/GiscusComments.tsx
const { resolvedTheme } = useTheme();

script.setAttribute('data-theme', resolvedTheme === 'dark' ? 'dark' : 'light');
```

### 언어 설정

기본값은 한국어(`ko`)입니다. 다른 언어로 변경하려면:

```typescript
<GiscusComments
  lang="en"  // 영어
  lang="ko"  // 한국어 (기본값)
/>
```

### 반응 (Reactions) 활성화

기본적으로 활성화되어 있습니다. 비활성화하려면:

```typescript
<GiscusComments
  reactionsEnabled={false}
/>
```

---

## 🐛 트러블슈팅

### 문제 1: "Giscus is not configured" 메시지

**원인**: `repoId` 또는 `categoryId`가 `CONFIGURE_REPO_ID` 플레이스홀더로 설정됨

**해결**:
1. https://giscus.app/ko 에서 실제 값 확인
2. Community.tsx, BlogPost.tsx에 값 입력
3. 빌드 후 재배포

### 문제 2: 댓글이 표시되지 않음

**원인**: GitHub Discussions가 활성화되지 않음

**해결**:
1. 저장소 Settings → Features → Discussions 활성화 확인
2. Giscus 앱이 설치되었는지 확인: https://github.com/apps/giscus
3. 브라우저 개발자 도구 콘솔에서 에러 확인

### 문제 3: 다크 모드가 자동 전환되지 않음

**원인**: `useTheme()` 훅이 동작하지 않음

**해결**:
1. `ThemeProvider`가 App.tsx에 설정되어 있는지 확인
2. LocalStorage에 `theme` 값 확인
3. GiscusComments 컴포넌트가 `useEffect` 의존성 배열에 `resolvedTheme` 포함 확인

---

## 📚 추가 리소스

- **Giscus 공식 문서**: https://giscus.app/ko
- **GitHub Discussions 가이드**: https://docs.github.com/en/discussions
- **Giscus GitHub 저장소**: https://github.com/giscus/giscus

---

## ✅ 체크리스트

설정 완료 확인:

- [ ] GitHub Discussions 활성화됨
- [ ] Giscus 앱 설치됨
- [ ] General 카테고리 생성됨
- [ ] Blog Comments 카테고리 생성됨
- [ ] repoId 값 확인 및 적용
- [ ] categoryId 값 확인 및 적용 (2개)
- [ ] Community.tsx 업데이트
- [ ] BlogPost.tsx 업데이트
- [ ] 빌드 성공 (0 errors)
- [ ] 프로덕션 배포 완료
- [ ] 실제 페이지에서 댓글 위젯 확인

---

**마지막 업데이트**: 2025-11-09
**작성자**: Claude (AI 어시스턴트)
**관련 문서**: [CLAUDE.md](../../CLAUDE.md), [Version 2.0 Roadmap](../project/roadmap.md)
