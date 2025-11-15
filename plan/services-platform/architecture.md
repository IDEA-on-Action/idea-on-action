# 서비스 플랫폼 아키텍처

**작성일**: 2025-11-15
**버전**: 1.0

---

## 1. 페이지 구조 설계

### 1.1 전체 페이지 맵

```
/services (서비스 메인)
├── /services/development (개발 서비스)
│   ├── /services/development/mvp
│   ├── /services/development/fullstack
│   ├── /services/development/design
│   └── /services/development/operations
├── /services/compass (COMPASS 플랫폼)
│   ├── /services/compass/navigator
│   ├── /services/compass/cartographer (2026 Q1 출시 예정)
│   ├── /services/compass/captain (2026 Q1 출시 예정)
│   └── /services/compass/harbor (2026 Q1 출시 예정)
├── /pricing (가격 안내)
├── /terms (이용약관)
├── /privacy (개인정보 처리방침)
└── /refund (환불 정책)
```

### 1.2 라우팅 구조 (React Router)

```typescript
// src/App.tsx
<Routes>
  <Route path="/services" element={<ServicesPage />} />

  {/* Development Services */}
  <Route path="/services/development/mvp" element={<MVPServicePage />} />
  <Route path="/services/development/fullstack" element={<FullstackServicePage />} />
  <Route path="/services/development/design" element={<DesignServicePage />} />
  <Route path="/services/development/operations" element={<OperationsServicePage />} />

  {/* COMPASS Platform */}
  <Route path="/services/compass/navigator" element={<NavigatorPage />} />
  <Route path="/services/compass/cartographer" element={<CartographerPage />} />
  <Route path="/services/compass/captain" element={<CaptainPage />} />
  <Route path="/services/compass/harbor" element={<HarborPage />} />

  {/* Pricing & Legal */}
  <Route path="/pricing" element={<PricingPage />} />
  <Route path="/terms" element={<TermsPage />} />
  <Route path="/privacy" element={<PrivacyPage />} />
  <Route path="/refund" element={<RefundPolicyPage />} />
</Routes>
```

---

## 2. 컴포넌트 아키텍처

### 2.1 페이지 컴포넌트 (Pages)

#### ServicesPage (`/services`)
```typescript
// src/pages/services/ServicesPage.tsx
export default function ServicesPage() {
  return (
    <PageLayout>
      <HeroSection
        title="아이디어를 현실로 만드는 파트너"
        subtitle="IDEA on Action은 프로젝트 기획부터 개발, 운영까지 전체 라이프사이클을 지원하는 소프트웨어 개발 전문 기업입니다."
        cta={[
          { label: "개발 서비스 보기", href: "#development" },
          { label: "플랫폼 서비스 보기", href: "#compass" }
        ]}
      />

      <DevelopmentServicesSection />
      <CompassPlatformSection />
      <TrustFactorsSection />
    </PageLayout>
  );
}
```

#### MVPServicePage (`/services/development/mvp`)
```typescript
// src/pages/services/development/MVPServicePage.tsx
export default function MVPServicePage() {
  return (
    <PageLayout>
      <ServiceHero
        title="MVP 개발 서비스"
        subtitle="아이디어 실현 패키지"
      />

      <ServiceOverviewSection />
      <DeliveryPhaseSection phases={4} />
      <TechStackSection stack={techStack} />
      <PricingPackagesSection packages={3} />
      <PaymentMethodSection />
      <ProcessSection steps={7} />
      <DeliverablesSection />
      <RefundPolicySection />
      <FAQSection questions={faqData} />

      <CTASection
        primary={{ label: "상담 신청하기", href: "/work-with-us" }}
        secondary={{ label: "견적 문의하기", href: "/work-with-us?type=quote" }}
      />
    </PageLayout>
  );
}
```

#### NavigatorPage (`/services/compass/navigator`)
```typescript
// src/pages/services/compass/NavigatorPage.tsx
export default function NavigatorPage() {
  return (
    <PageLayout>
      <ServiceHero
        title="COMPASS Navigator"
        subtitle="사업 기회 탐색 플랫폼"
      />

      <ServiceIntroSection />
      <KeyFeaturesSection features={4} />
      <PlanComparisonTable plans={3} />
      <PricingSection />
      <PaymentMethodSection />
      <RefundPolicySection />
      <BetaTesterSection />

      <CTASection
        primary={{ label: "무료 체험 시작하기", href: "/signup?plan=trial" }}
        secondary={{ label: "플랜 비교 자세히 보기", href: "#plans" }}
      />
    </PageLayout>
  );
}
```

### 2.2 공통 섹션 컴포넌트 (Sections)

#### DevelopmentServicesSection
```typescript
// src/components/services/DevelopmentServicesSection.tsx
export default function DevelopmentServicesSection() {
  const services = [
    {
      id: "mvp",
      title: "MVP 개발",
      description: "아이디어 실현 패키지",
      price: "₩5,000,000~",
      duration: "4-8주 소요",
      href: "/services/development/mvp"
    },
    // ... 나머지 3개
  ];

  return (
    <Section id="development" title="🛠️ 소프트웨어 개발 서비스">
      <p className="text-muted-foreground mb-8">
        맞춤형 웹/앱 애플리케이션 개발부터 시스템 운영까지
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </Section>
  );
}
```

#### CompassPlatformSection
```typescript
// src/components/services/CompassPlatformSection.tsx
export default function CompassPlatformSection() {
  const roadmap = [
    { quarter: "2025 Q4", name: "Navigator", status: "현재" },
    { quarter: "2026 Q1", name: "Cartographer", status: "예정" },
    { quarter: "2026 Q1", name: "Captain", status: "예정" },
    { quarter: "2026 Q1", name: "Harbor", status: "예정" }
  ];

  return (
    <Section id="compass" title="🧭 COMPASS 플랫폼 서비스">
      <p className="text-muted-foreground mb-8">
        프로젝트 수주부터 운영까지 통합 관리 SaaS
      </p>

      <RoadmapTimeline items={roadmap} />

      <Card className="mt-8">
        <CardHeader>
          <Badge>현재 이용 가능</Badge>
          <CardTitle>COMPASS Navigator</CardTitle>
          <CardDescription>프로젝트 수주 기회 탐색 플랫폼</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">₩29,000~/월</span>
            <Button asChild>
              <Link to="/services/compass/navigator">자세히 보기</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}
```

#### PlanComparisonTable
```typescript
// src/components/services/PlanComparisonTable.tsx
interface Plan {
  name: string;
  price: string;
  features: { [key: string]: string | boolean };
}

export default function PlanComparisonTable({ plans }: { plans: Plan[] }) {
  const featureLabels = {
    price: "월 이용료",
    platforms: "플랫폼 통합",
    monthlyAnalysis: "월 분석 건수",
    aiAnalysis: "AI 분석",
    customFilter: "커스텀 필터",
    notifications: "실시간 알림",
    history: "히스토리",
    team: "팀 기능",
    support: "기술 지원",
    api: "API 연동"
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th>기능</th>
            {plans.map((plan) => (
              <th key={plan.name}>{plan.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(featureLabels).map(([key, label]) => (
            <tr key={key}>
              <td>{label}</td>
              {plans.map((plan) => (
                <td key={plan.name}>
                  {typeof plan.features[key] === 'boolean' ? (
                    plan.features[key] ? <Check /> : <X />
                  ) : (
                    plan.features[key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 2.3 재사용 가능 UI 컴포넌트

#### ServiceCard
```typescript
// src/components/services/ServiceCard.tsx
interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  duration: string;
  href: string;
}

export default function ServiceCard({
  title,
  description,
  price,
  duration,
  href
}: ServiceCardProps) {
  return (
    <Card className="hover-lift">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">{price}</div>
          <div className="text-sm text-muted-foreground">{duration}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to={href}>자세히 보기 →</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
```

#### PricingPackage
```typescript
// src/components/services/PricingPackage.tsx
interface Package {
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export default function PricingPackage({
  name,
  price,
  features,
  recommended = false
}: Package) {
  return (
    <Card className={cn("relative", recommended && "border-primary")}>
      {recommended && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          추천
        </Badge>
      )}
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <div className="text-3xl font-bold">{price}</div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/work-with-us">상담 신청하기</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
```

#### RoadmapTimeline
```typescript
// src/components/services/RoadmapTimeline.tsx
interface TimelineItem {
  quarter: string;
  name: string;
  status: "현재" | "예정";
}

export default function RoadmapTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-border" />

      <div className="grid grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div key={index} className="relative text-center">
            {/* Timeline node */}
            <div className={cn(
              "w-4 h-4 rounded-full mx-auto mb-4 relative z-10",
              item.status === "현재" ? "bg-primary" : "bg-muted"
            )} />

            <div className="text-sm font-medium">{item.quarter}</div>
            <div className="text-xs text-muted-foreground">{item.name}</div>
            <Badge variant={item.status === "현재" ? "default" : "outline"} className="mt-2">
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 3. 데이터 모델

### 3.1 정적 데이터 (TypeScript 타입)

```typescript
// src/types/services.ts

export interface Service {
  id: string;
  category: "development" | "compass";
  name: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  techStack?: TechStack;
  pricing: Pricing;
  deliverables?: string[];
  faq?: FAQ[];
}

export interface TechStack {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  deployment?: string[];
}

export interface Pricing {
  type: "package" | "hourly" | "monthly" | "project";
  packages?: Package[];
  hourly?: HourlyRate[];
  monthly?: MonthlyPlan[];
}

export interface Package {
  name: string;
  price: number;
  currency: "KRW" | "USD";
  features: string[];
  duration?: string;
  support?: string;
}

export interface MonthlyPlan {
  name: "Basic" | "Pro" | "Enterprise";
  price: number;
  currency: "KRW" | "USD";
  features: Record<string, string | boolean>;
  annualDiscount?: number; // percentage
}

export interface FAQ {
  question: string;
  answer: string;
}
```

### 3.2 서비스 데이터 (JSON)

```typescript
// src/data/services/mvp-development.ts
import { Service } from "@/types/services";

export const mvpDevelopmentService: Service = {
  id: "mvp-development",
  category: "development",
  name: "MVP 개발",
  slug: "mvp",
  title: "MVP 개발 서비스",
  subtitle: "아이디어 실현 패키지",
  description: "비즈니스 아이디어를 빠르게 검증할 수 있는 최소 기능 제품(MVP)을 개발합니다. 핵심 기능에 집중하여 4-8주 내에 시장 테스트 가능한 제품을 제공합니다.",
  features: [
    "비즈니스 요구사항 분석 및 문서화",
    "React/TypeScript 기반 프론트엔드 개발",
    "Supabase/Node.js 백엔드 API 구축",
    "프로덕션 배포 및 기본 사용자 가이드"
  ],
  techStack: {
    frontend: ["React", "TypeScript", "Vite", "TailwindCSS"],
    backend: ["Supabase", "Node.js + Express"],
    database: ["PostgreSQL (Supabase)"],
    deployment: ["Vercel", "AWS", "Google Cloud"]
  },
  pricing: {
    type: "package",
    packages: [
      {
        name: "기본 패키지",
        price: 5000000,
        currency: "KRW",
        features: [
          "핵심 기능 3-5개",
          "반응형 웹 (데스크톱 + 모바일)",
          "기본 사용자 인증",
          "1개월 무상 기술 지원"
        ],
        duration: "4-6주"
      },
      {
        name: "스탠다드 패키지",
        price: 8000000,
        currency: "KRW",
        features: [
          "핵심 기능 5-8개",
          "고급 UI/UX 디자인",
          "소셜 로그인 통합",
          "결제 시스템 연동 (PG사 1개)",
          "2개월 무상 기술 지원"
        ],
        duration: "6-8주"
      },
      {
        name: "프리미엄 패키지",
        price: 12000000,
        currency: "KRW",
        features: [
          "핵심 기능 8-12개",
          "맞춤형 디자인 시스템",
          "고급 인증/권한 관리",
          "다중 결제 수단 지원",
          "관리자 대시보드",
          "3개월 무상 기술 지원"
        ],
        duration: "8-10주"
      }
    ]
  },
  deliverables: [
    "소스 코드 (GitHub 리포지토리)",
    "배포된 애플리케이션",
    "기술 문서 (API 명세서, 아키텍처 문서)",
    "사용자 가이드",
    "관리자 매뉴얼"
  ],
  faq: [
    {
      question: "개발 기간을 단축할 수 있나요?",
      answer: "기능 범위 조정을 통해 가능합니다. 상담 시 논의해주세요."
    },
    {
      question: "추가 기능 개발이 필요하면 어떻게 하나요?",
      answer: "별도 견적을 통해 추가 개발이 가능합니다."
    },
    {
      question: "소스 코드 소유권은 누구에게 있나요?",
      answer: "최종 결제 완료 후 클라이언트에게 모든 권한이 이전됩니다."
    },
    {
      question: "유지보수는 어떻게 하나요?",
      answer: "무상 지원 기간 종료 후 별도 운영 관리 서비스를 이용하실 수 있습니다."
    }
  ]
};
```

```typescript
// src/data/services/compass-navigator.ts
export const compassNavigatorService: Service = {
  id: "compass-navigator",
  category: "compass",
  name: "COMPASS Navigator",
  slug: "navigator",
  title: "COMPASS Navigator",
  subtitle: "사업 기회 탐색 플랫폼",
  description: "프리랜서와 에이전시를 위한 지능형 프로젝트 수주 기회 탐색 플랫폼입니다. 여러 플랫폼에 흩어진 프로젝트 정보를 한 곳에서 확인하고, AI 기반 분석을 통해 가장 적합한 기회를 찾으세요.",
  features: [
    "위시켓, 크몽, 원티드긱스, 나라장터 등 주요 플랫폼 통합 수집",
    "AI 기반 프로젝트 난이도 평가 및 경쟁률 예측",
    "JavaScript 기반 맞춤형 필터 및 가중치 설정",
    "Slack, 이메일, SMS 실시간 알림"
  ],
  pricing: {
    type: "monthly",
    monthly: [
      {
        name: "Basic",
        price: 29000,
        currency: "KRW",
        features: {
          platforms: "4개",
          monthlyAnalysis: "50건",
          aiAnalysis: false,
          customFilter: "기본",
          notifications: "이메일",
          history: "1개월",
          team: false,
          support: "이메일",
          api: false
        },
        annualDiscount: 20
      },
      {
        name: "Pro",
        price: 99000,
        currency: "KRW",
        features: {
          platforms: "6개+",
          monthlyAnalysis: "300건",
          aiAnalysis: true,
          customFilter: "JavaScript",
          notifications: "전체 채널",
          history: "6개월",
          team: false,
          support: "이메일 + 채팅",
          api: false
        },
        annualDiscount: 20
      },
      {
        name: "Enterprise",
        price: 299000,
        currency: "KRW",
        features: {
          platforms: "전체 + 커스텀",
          monthlyAnalysis: "무제한",
          aiAnalysis: "✓ 고급",
          customFilter: "JavaScript + API",
          notifications: "전체 + 우선 알림",
          history: "무제한",
          team: "10명까지",
          support: "전담 지원 (월 2시간)",
          api: true
        },
        annualDiscount: 20
      }
    ]
  }
};
```

---

## 4. SEO & 메타데이터

### 4.1 페이지별 메타 태그

```typescript
// src/lib/seo.ts
import { Helmet } from "react-helmet-async";

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  url?: string;
}

export function SEO({ title, description, image, type = "website", url }: SEOProps) {
  const siteUrl = "https://www.ideaonaction.ai";
  const defaultImage = `${siteUrl}/og-image.png`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title} | IDEA on Action</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url || siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url || siteUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
}
```

### 4.2 구조화 데이터 (JSON-LD)

```typescript
// src/lib/json-ld.ts
export function generateServiceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": "IDEA on Action",
      "legalName": "생각과 행동",
      "url": "https://www.ideaonaction.ai",
      "logo": "https://www.ideaonaction.ai/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+82-10-4904-2671",
        "contactType": "customer service",
        "email": "sinclairseo@gmail.com"
      }
    },
    "offers": service.pricing.packages?.map((pkg) => ({
      "@type": "Offer",
      "name": pkg.name,
      "price": pkg.price,
      "priceCurrency": pkg.currency,
      "description": pkg.features.join(", ")
    }))
  };
}
```

---

## 5. 레이아웃 & 스타일

### 5.1 페이지 레이아웃 컴포넌트

```typescript
// src/components/layout/PageLayout.tsx
export default function PageLayout({
  children,
  maxWidth = "7xl",
  className
}: {
  children: React.ReactNode;
  maxWidth?: "5xl" | "7xl" | "full";
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen", className)}>
      <Header />
      <main className={cn("container mx-auto px-4 py-16", `max-w-${maxWidth}`)}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

### 5.2 섹션 레이아웃

```typescript
// src/components/layout/Section.tsx
export default function Section({
  id,
  title,
  subtitle,
  children,
  className
}: {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("py-16", className)}>
      {title && (
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground text-lg">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
```

---

## 6. Footer 업데이트

### 6.1 사업자 정보 추가

```typescript
// src/components/shared/Footer.tsx (일부)
<div className="border-t border-border/40 pt-8">
  <div className="text-sm text-muted-foreground space-y-1">
    <p>
      <strong>사업자 정보</strong>
    </p>
    <p>
      상호: IDEA on Action (생각과 행동) | 사업자등록번호: 537-05-01511
    </p>
    <p>
      대표: 서민원 | 통신판매업신고: 2025-경기시흥-2094
    </p>
    <p>
      주소: 경기도 시흥시 대은로104번길 11 (은행동, 우남아파트) 103동 601호
    </p>
    <p>
      이메일: sinclairseo@gmail.com | 전화: 010-4904-2671
    </p>
  </div>

  <div className="mt-4 flex gap-4">
    <Link to="/terms" className="text-sm hover:underline">
      이용약관
    </Link>
    <Link to="/privacy" className="text-sm hover:underline">
      개인정보 처리방침
    </Link>
    <Link to="/refund" className="text-sm hover:underline">
      환불 정책
    </Link>
  </div>

  <p className="mt-4 text-xs text-muted-foreground">
    © 2025 IDEA on Action. All rights reserved.
  </p>
</div>
```

---

**다음 단계**: [plan/services-platform/implementation-strategy.md](implementation-strategy.md)
