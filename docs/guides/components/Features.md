# Features Component

기능 소개 섹션 컴포넌트로, 서비스의 주요 특징들을 카드 형태로 보여주는 컴포넌트입니다.

## 개요

Features 컴포넌트는 서비스의 핵심 기능들을 시각적으로 표현하는 섹션입니다. 아이콘, 제목, 설명이 포함된 카드 형태로 구성되어 있으며, 반응형 그리드 레이아웃을 사용합니다.

## Props

```typescript
interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  id: string;
}

interface FeaturesProps {
  className?: string;     // 추가 CSS 클래스
  features?: Feature[];   // 표시할 기능 목록
}
```

### Props 설명

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | 컴포넌트에 추가할 CSS 클래스 |
| `features` | `Feature[]` | `DEFAULT_FEATURES` | 표시할 기능 목록 |

### Feature 타입

| 속성 | Type | Description |
|------|------|-------------|
| `icon` | `LucideIcon` | 표시할 아이콘 컴포넌트 |
| `title` | `string` | 기능 제목 |
| `description` | `string` | 기능 설명 |
| `id` | `string` | 고유 식별자 |

## 사용 예시

### 기본 사용법

```tsx
import Features from '@/components/Features';

function App() {
  return (
    <div>
      <Features />
    </div>
  );
}
```

### 커스텀 기능 목록 사용

```tsx
import { Zap, Shield, Rocket } from 'lucide-react';
import Features from '@/components/Features';

const customFeatures = [
  {
    id: 'custom-1',
    icon: Zap,
    title: '빠른 처리',
    description: '고성능 처리 엔진으로 빠른 결과 제공'
  },
  {
    id: 'custom-2',
    icon: Shield,
    title: '보안 강화',
    description: '엔터프라이즈급 보안 시스템'
  }
];

function App() {
  return (
    <div>
      <Features features={customFeatures} />
    </div>
  );
}
```

### 커스텀 스타일 적용

```tsx
import Features from '@/components/Features';

function App() {
  return (
    <div>
      <Features className="custom-features-styles" />
    </div>
  );
}
```

## 주요 기능

### 1. 반응형 그리드 레이아웃
- 모바일: 1열
- 태블릿: 2열
- 데스크톱: 4열

### 2. 인터랙티브 효과
- 호버 시 카드 스케일링
- 포커스 링 표시
- 부드러운 전환 애니메이션

### 3. 접근성 (a11y)
- 시맨틱 HTML 구조
- 키보드 네비게이션 지원
- ARIA 라벨 제공
- 스크린 리더 호환성

### 4. 애니메이션
- 순차적 페이드인 효과
- 호버 애니메이션
- 아이콘 스케일링

## 스타일 커스터마이징

### CSS 변수 활용

```css
:root {
  --features-bg: rgba(255, 255, 255, 0.1);
  --features-border: rgba(0, 0, 0, 0.1);
  --features-hover-border: rgba(59, 130, 246, 0.4);
}
```

### Tailwind 클래스 커스터마이징

```tsx
// 커스텀 클래스로 스타일 오버라이드
<Features className="bg-custom-gradient border-custom-color" />
```

### 개별 카드 스타일링

```css
.feature-card {
  @apply p-6 rounded-2xl bg-background/50 backdrop-blur-sm;
  @apply border border-border hover:border-primary/40;
  @apply transition-all group cursor-pointer;
}
```

## 접근성 고려사항

### 1. 키보드 네비게이션
- 모든 카드가 키보드로 접근 가능
- Tab 순서가 논리적으로 구성
- Enter/Space 키로 상호작용 가능

### 2. 스크린 리더 지원
- 적절한 헤딩 구조 (h2)
- 의미있는 ARIA 라벨
- 아이콘에 aria-hidden 속성

### 3. 색상 대비
- WCAG 2.1 AA 기준 준수
- 다크모드 지원

## 성능 최적화

### 1. 렌더링 최적화
- React.memo 사용 고려
- 불필요한 리렌더링 방지

### 2. 애니메이션 최적화
- CSS transform과 opacity 사용
- GPU 가속 활용

## 테스트

### 단위 테스트

```bash
npm run test:unit Features.test.tsx
```

### 접근성 테스트

```bash
npm run test:a11y Features
```

## 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 관련 컴포넌트

- [Card](../ui/card.md) - 카드 UI 컴포넌트
- [Button](../ui/button.md) - 버튼 컴포넌트

## 변경 이력

### v1.5.0
- TypeScript 타입 정의 추가
- 접근성 개선 (ARIA 라벨, 키보드 네비게이션)
- Props 인터페이스 확장
- 테스트 코드 작성

### v1.4.0
- 반응형 그리드 레이아웃 개선
- 호버 효과 최적화
- 애니메이션 성능 개선

## 개발 팁

### 1. 새로운 기능 추가
```tsx
const newFeature = {
  id: 'unique-id',
  icon: YourIcon,
  title: '새로운 기능',
  description: '기능 설명'
};
```

### 2. 아이콘 커스터마이징
```tsx
import { CustomIcon } from 'lucide-react';

const feature = {
  icon: CustomIcon,
  // ... other properties
};
```

### 3. 애니메이션 지연 조정
```tsx
// 각 카드의 애니메이션 지연 시간 조정
style={{ animationDelay: `${index * 0.2}s` }}
```
