# Services Component

서비스 소개 섹션 컴포넌트로, 제공하는 서비스들을 카드 형태로 보여주는 컴포넌트입니다.

## 개요

Services 컴포넌트는 회사에서 제공하는 주요 서비스들을 시각적으로 표현하는 섹션입니다. 아이콘, 제목, 설명, 기능 목록이 포함된 카드 형태로 구성되어 있으며, 로딩 상태와 에러 상태를 지원합니다.

## Props

```typescript
interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  id: string;
}

interface ServicesProps {
  className?: string;     // 추가 CSS 클래스
  services?: Service[];   // 표시할 서비스 목록
  isLoading?: boolean;   // 로딩 상태
  error?: string | null; // 에러 메시지
}
```

### Props 설명

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | 컴포넌트에 추가할 CSS 클래스 |
| `services` | `Service[]` | `DEFAULT_SERVICES` | 표시할 서비스 목록 |
| `isLoading` | `boolean` | `false` | 로딩 상태 표시 여부 |
| `error` | `string \| null` | `null` | 에러 메시지 |

### Service 타입

| 속성 | Type | Description |
|------|------|-------------|
| `icon` | `LucideIcon` | 표시할 아이콘 컴포넌트 |
| `title` | `string` | 서비스 제목 |
| `description` | `string` | 서비스 설명 |
| `features` | `string[]` | 서비스 기능 목록 |
| `id` | `string` | 고유 식별자 |

## 사용 예시

### 기본 사용법

```tsx
import Services from '@/components/Services';

function App() {
  return (
    <div>
      <Services />
    </div>
  );
}
```

### 로딩 상태 표시

```tsx
import Services from '@/components/Services';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div>
      <Services isLoading={isLoading} />
    </div>
  );
}
```

### 에러 상태 처리

```tsx
import Services from '@/components/Services';

function App() {
  const [error, setError] = useState(null);
  
  return (
    <div>
      <Services error={error} />
    </div>
  );
}
```

### 커스텀 서비스 목록 사용

```tsx
import { Brain, Workflow, BarChart3 } from 'lucide-react';
import Services from '@/components/Services';

const customServices = [
  {
    id: 'custom-1',
    icon: Brain,
    title: 'AI 솔루션',
    description: '인공지능 기반 비즈니스 솔루션',
    features: ['머신러닝', '딥러닝', '자연어처리']
  }
];

function App() {
  return (
    <div>
      <Services services={customServices} />
    </div>
  );
}
```

## 주요 기능

### 1. 상태 관리
- **로딩 상태**: 스켈레톤 UI로 로딩 표시
- **에러 상태**: 에러 메시지와 함께 사용자에게 알림
- **정상 상태**: 서비스 카드들을 표시

### 2. 반응형 그리드 레이아웃
- 모바일: 1열
- 태블릿: 3열
- 데스크톱: 3열

### 3. 인터랙티브 효과
- 호버 시 카드 스케일링
- 포커스 링 표시
- 부드러운 전환 애니메이션

### 4. 접근성 (a11y)
- 시맨틱 HTML 구조
- 키보드 네비게이션 지원
- ARIA 라벨 제공
- 스크린 리더 호환성

## 상태별 렌더링

### 로딩 상태

```tsx
<Services isLoading={true} />
```

로딩 상태에서는 스켈레톤 UI가 표시됩니다:
- 제목과 설명 부분의 스켈레톤
- 3개의 서비스 카드 스켈레톤
- 펄스 애니메이션 효과

### 에러 상태

```tsx
<Services error="서비스를 불러올 수 없습니다." />
```

에러 상태에서는:
- 에러 메시지가 표시됩니다
- 사용자에게 문제 상황을 알립니다
- 재시도 옵션을 제공할 수 있습니다

### 정상 상태

```tsx
<Services services={services} />
```

정상 상태에서는:
- 서비스 카드들이 표시됩니다
- 각 카드에는 아이콘, 제목, 설명, 기능 목록이 포함됩니다
- 인터랙티브 효과가 활성화됩니다

## 스타일 커스터마이징

### CSS 변수 활용

```css
:root {
  --services-bg: rgba(255, 255, 255, 0.1);
  --services-border: rgba(59, 130, 246, 0.2);
  --services-hover-border: rgba(59, 130, 246, 0.4);
}
```

### Tailwind 클래스 커스터마이징

```tsx
// 커스텀 클래스로 스타일 오버라이드
<Services className="bg-custom-gradient border-custom-color" />
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

### 1. 조건부 렌더링
- 로딩/에러 상태에 따른 최적화된 렌더링
- 불필요한 DOM 요소 생성 방지

### 2. 애니메이션 최적화
- CSS transform과 opacity 사용
- GPU 가속 활용

## 테스트

### 단위 테스트

```bash
npm run test:unit Services.test.tsx
```

### 접근성 테스트

```bash
npm run test:a11y Services
```

## 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 관련 컴포넌트

- [Card](../ui/card.md) - 카드 UI 컴포넌트
- [ServiceCard](../services/ServiceCard.md) - 개별 서비스 카드

## 변경 이력

### v1.5.0
- 로딩/에러 상태 지원 추가
- TypeScript 타입 정의 추가
- 접근성 개선 (ARIA 라벨, 키보드 네비게이션)
- Props 인터페이스 확장
- 테스트 코드 작성

### v1.4.0
- 반응형 그리드 레이아웃 개선
- 호버 효과 최적화
- 애니메이션 성능 개선

## 개발 팁

### 1. 새로운 서비스 추가
```tsx
const newService = {
  id: 'unique-id',
  icon: YourIcon,
  title: '새로운 서비스',
  description: '서비스 설명',
  features: ['기능 1', '기능 2', '기능 3']
};
```

### 2. 로딩 상태 관리
```tsx
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  setIsLoading(true);
  fetchServices()
    .then(setServices)
    .catch(setError)
    .finally(() => setIsLoading(false));
}, []);
```

### 3. 에러 처리
```tsx
const [error, setError] = useState(null);

const handleRetry = () => {
  setError(null);
  // 재시도 로직
};
```
