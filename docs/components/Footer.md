# Footer Component

사이트 푸터 컴포넌트로, 브랜드 정보, 네비게이션 링크, 소셜 미디어 링크, 저작권 정보를 포함하는 컴포넌트입니다.

## 개요

Footer 컴포넌트는 웹사이트의 하단 푸터를 담당하는 컴포넌트입니다. 브랜드 로고, 회사 정보, 네비게이션 링크, 소셜 미디어 링크, 저작권 정보를 포함하며, 반응형 디자인과 접근성을 지원합니다.

## Props

```typescript
interface FooterProps {
  className?: string; // 추가 CSS 클래스
}
```

### Props 설명

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | 컴포넌트에 추가할 CSS 클래스 |

## 사용 예시

### 기본 사용법

```tsx
import Footer from '@/components/Footer';

function App() {
  return (
    <div>
      <Footer />
    </div>
  );
}
```

### 커스텀 스타일 적용

```tsx
import Footer from '@/components/Footer';

function App() {
  return (
    <div>
      <Footer className="custom-footer-styles" />
    </div>
  );
}
```

## 주요 기능

### 1. 브랜드 정보
- 회사 로고 및 이름
- 회사 태그라인
- 회사 설명
- 브랜드 슬로건

### 2. 네비게이션 링크
- **솔루션**: AI 컨설팅, 워크플로우 자동화, 데이터 분석
- **회사**: 회사소개, 기술, 문의
- **리소스**: GitHub, 웹사이트, 블로그

### 3. 소셜 미디어 링크
- GitHub 프로필
- LinkedIn 프로필
- 이메일 연락처

### 4. 저작권 정보
- 현재 연도 자동 업데이트
- 회사명 및 권리 표시
- 브랜드 슬로건

## 구조 및 레이아웃

### 데스크톱 레이아웃
```
┌─────────────────────────────────────────────────────────┐
│ [로고] IDEA on Action    │ 솔루션    │ 회사    │ 리소스  │
│ 생각과행동               │ • AI 컨설팅│ • 회사소개│ • GitHub │
│                         │ • 워크플로우│ • 기술   │ • 웹사이트│
│ [소셜 링크]             │ • 데이터분석│ • 문의   │ • 블로그 │
└─────────────────────────────────────────────────────────┘
│ © 2025 IDEA on Action (생각과행동). All rights reserved. │
│ KEEP AWAKE, LIVE PASSIONATE                            │
└─────────────────────────────────────────────────────────┘
```

### 모바일 레이아웃
```
┌─────────────────────────────────┐
│ [로고] IDEA on Action           │
│ 생각과행동                      │
│                                 │
│ [소셜 링크]                     │
│                                 │
│ 솔루션                          │
│ • AI 컨설팅                     │
│ • 워크플로우 자동화              │
│ • 데이터 분석                   │
│                                 │
│ 회사                            │
│ • 회사소개                      │
│ • 기술                          │
│ • 문의                          │
│                                 │
│ 리소스                          │
│ • GitHub                        │
│ • 웹사이트                      │
│ • 블로그                        │
└─────────────────────────────────┘
```

## 소셜 미디어 링크

### GitHub
```tsx
{
  icon: Github,
  href: "https://github.com/IDEA-on-Action",
  label: "GitHub 프로필 방문하기",
  isExternal: true
}
```

### LinkedIn
```tsx
{
  icon: Linkedin,
  href: "https://linkedin.com",
  label: "LinkedIn 프로필 방문하기",
  isExternal: true
}
```

### 이메일
```tsx
{
  icon: Mail,
  href: "mailto:sinclairseo@gmail.com",
  label: "이메일 보내기: sinclairseo@gmail.com",
  isExternal: false
}
```

## 스타일 커스터마이징

### CSS 변수 활용

```css
:root {
  --footer-bg: rgba(255, 255, 255, 0.1);
  --footer-border: rgba(0, 0, 0, 0.1);
  --footer-link-hover: #3b82f6;
  --footer-social-hover: #3b82f6;
}
```

### Tailwind 클래스 커스터마이징

```tsx
// 커스텀 클래스로 스타일 오버라이드
<Footer className="bg-custom-gradient border-custom-color" />
```

### 소셜 링크 스타일링

```css
.social-link {
  @apply w-10 h-10 rounded-lg bg-background border border-border;
  @apply flex items-center justify-center;
  @apply hover:border-primary transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-primary/20;
}
```

## 접근성 고려사항

### 1. 키보드 네비게이션
- 모든 링크가 키보드로 접근 가능
- Tab 순서가 논리적으로 구성
- 포커스 링 표시

### 2. 스크린 리더 지원
- 적절한 ARIA 라벨 제공
- 시맨틱 HTML 구조
- 링크 목적 명확화

### 3. 색상 대비
- WCAG 2.1 AA 기준 준수
- 다크모드 지원

## 성능 최적화

### 1. 이미지 최적화
- 로고 이미지에 width/height 속성 지정
- 적절한 alt 텍스트 제공

### 2. 링크 최적화
- 외부 링크에 rel="noopener noreferrer" 추가
- 내부 링크 최적화

### 3. 렌더링 최적화
- 불필요한 리렌더링 방지
- 상수 데이터 활용

## 테스트

### 단위 테스트

```bash
npm run test:unit Footer.test.tsx
```

### 접근성 테스트

```bash
npm run test:a11y Footer
```

## 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 관련 컴포넌트

- [Header](../Header.md) - 헤더 컴포넌트
- [Button](../ui/button.md) - 버튼 컴포넌트

## 변경 이력

### v1.5.0
- TypeScript 타입 정의 추가
- 접근성 개선 (ARIA 라벨, 키보드 네비게이션)
- 상수화를 통한 코드 개선
- 테스트 코드 작성

### v1.4.0
- 반응형 디자인 개선
- 소셜 링크 최적화
- 저작권 정보 자동 업데이트

## 개발 팁

### 1. 새로운 소셜 링크 추가
```tsx
const SOCIAL_LINKS = [
  // 기존 링크들...
  {
    icon: Twitter,
    href: "https://twitter.com/ideaonaction",
    label: "Twitter 프로필 방문하기",
    isExternal: true
  }
];
```

### 2. 새로운 푸터 섹션 추가
```tsx
const FOOTER_SECTIONS = [
  // 기존 섹션들...
  {
    title: "지원",
    links: [
      { label: "도움말", href: "/help" },
      { label: "FAQ", href: "/faq" },
      { label: "문의하기", href: "/contact" }
    ]
  }
];
```

### 3. 저작권 정보 커스터마이징
```tsx
const COPYRIGHT_INFO = {
  year: new Date().getFullYear(),
  company: "Your Company Name",
  rights: "All rights reserved.",
  additional: "Additional copyright text"
};
```

### 4. 소셜 링크 스타일 커스터마이징
```tsx
// 커스텀 소셜 링크 스타일
<a
  href={social.href}
  className="w-12 h-12 rounded-full bg-custom-color hover:bg-custom-hover"
>
  <Icon className="w-6 h-6" />
</a>
```
