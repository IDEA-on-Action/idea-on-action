# Hero Component

메인 히어로 섹션 컴포넌트로, 웹사이트의 첫인상을 담당하는 핵심 컴포넌트입니다.

## 개요

Hero 컴포넌트는 웹사이트의 메인 랜딩 섹션으로, 브랜드 로고, 메인 메시지, CTA 버튼을 포함합니다. 반응형 디자인과 애니메이션 효과를 통해 사용자의 시선을 끌고 주요 액션을 유도합니다.

## Props

```typescript
interface HeroProps {
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
import Hero from '@/components/Hero';

function App() {
  return (
    <div>
      <Hero />
    </div>
  );
}
```

### 커스텀 스타일 적용

```tsx
import Hero from '@/components/Hero';

function App() {
  return (
    <div>
      <Hero className="custom-hero-styles" />
    </div>
  );
}
```

## 주요 기능

### 1. 반응형 디자인
- 모바일과 데스크톱에서 최적화된 레이아웃
- 텍스트 크기와 간격이 화면 크기에 따라 조정

### 2. 애니메이션 효과
- 부드러운 페이드인 애니메이션
- 배경의 떠다니는 요소들
- 호버 시 버튼 애니메이션

### 3. 접근성 (a11y)
- 시맨틱 HTML 구조
- 적절한 ARIA 라벨
- 키보드 네비게이션 지원
- 스크린 리더 호환성

## 스타일 커스터마이징

### CSS 변수 활용

```css
:root {
  --hero-bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --hero-text-primary: #1a1a1a;
  --hero-text-secondary: #666666;
}
```

### Tailwind 클래스 커스터마이징

```tsx
// 커스텀 클래스로 스타일 오버라이드
<Hero className="bg-custom-gradient text-custom-color" />
```

## 접근성 고려사항

### 1. 키보드 네비게이션
- 모든 버튼이 키보드로 접근 가능
- Tab 순서가 논리적으로 구성

### 2. 스크린 리더 지원
- 적절한 헤딩 구조 (h1)
- 의미있는 alt 텍스트
- ARIA 라벨 제공

### 3. 색상 대비
- WCAG 2.1 AA 기준 준수
- 다크모드 지원

## 성능 최적화

### 1. 이미지 최적화
- 로고 이미지에 width/height 속성 지정
- 적절한 alt 텍스트 제공

### 2. 애니메이션 최적화
- CSS transform과 opacity 사용
- GPU 가속 활용

## 테스트

### 단위 테스트

```bash
npm run test:unit Hero.test.tsx
```

### 접근성 테스트

```bash
npm run test:a11y Hero
```

## 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 관련 컴포넌트

- [Button](../ui/button.md) - CTA 버튼
- [ThemeToggle](../shared/ThemeToggle.md) - 테마 토글

## 변경 이력

### v1.5.0
- 접근성 개선 (ARIA 라벨 추가)
- 상수화를 통한 코드 개선
- TypeScript 타입 정의 추가
- 테스트 코드 작성

### v1.4.0
- 반응형 디자인 개선
- 애니메이션 최적화
- 다크모드 지원 강화
