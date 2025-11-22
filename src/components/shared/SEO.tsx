/**
 * SEO Component
 *
 * 통합 SEO 컴포넌트 (TASK-045~055)
 * - Meta 태그 (title, description, keywords)
 * - Open Graph 태그 (Facebook, Twitter)
 * - JSON-LD 구조화 데이터 (Service, Organization, BreadcrumbList)
 *
 * 토스페이먼츠 심사를 위한 전문성 표현:
 * - 서비스/제품 정보의 구조화 데이터 제공
 * - 사업자 정보 (Organization) 스키마 포함
 *
 * Created: 2025-11-22 (Services Platform Sprint 2)
 */

import { Helmet } from 'react-helmet-async'

// 기본 사이트 정보
const SITE_CONFIG = {
  name: 'IDEA on Action',
  url: 'https://www.ideaonaction.ai',
  logo: 'https://www.ideaonaction.ai/og-image.png',
  description: 'AI 기반 프로덕트 스튜디오 - 아이디어를 실현하는 기술 파트너',
  locale: 'ko_KR',
  twitterHandle: '@ideaonaction',
  // 사업자 정보 (토스페이먼츠 심사용)
  organization: {
    name: '생각과행동',
    legalName: '생각과행동',
    email: 'sinclairseo@gmail.com',
    phone: '010-4904-2671',
    address: {
      streetAddress: '대한민국',
      addressLocality: '서울',
      postalCode: '00000',
      addressCountry: 'KR'
    }
  }
}

export interface SEOProps {
  // 기본 메타
  title: string
  description: string
  keywords?: string[]
  canonical?: string

  // Open Graph
  ogType?: 'website' | 'article' | 'product' | 'service'
  ogImage?: string
  ogImageAlt?: string

  // Twitter
  twitterCard?: 'summary' | 'summary_large_image'

  // 구조화 데이터 (JSON-LD)
  jsonLd?: {
    type: 'Service' | 'Product' | 'Organization' | 'WebPage' | 'BreadcrumbList'
    data: Record<string, unknown>
  }[]

  // 서비스 상세용 (자동 JSON-LD 생성)
  service?: {
    name: string
    description: string
    price?: number
    priceCurrency?: string
    category?: string
    image?: string
    provider?: string
  }

  // 브레드크럼
  breadcrumbs?: {
    name: string
    url: string
  }[]

  // 추가 메타
  noIndex?: boolean
  noFollow?: boolean
}

/**
 * JSON-LD 스키마 생성 함수들
 */

// Organization 스키마
function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.organization.name,
    legalName: SITE_CONFIG.organization.legalName,
    url: SITE_CONFIG.url,
    logo: SITE_CONFIG.logo,
    email: SITE_CONFIG.organization.email,
    telephone: SITE_CONFIG.organization.phone,
    address: {
      '@type': 'PostalAddress',
      ...SITE_CONFIG.organization.address
    },
    sameAs: [
      'https://github.com/IDEA-on-Action'
    ]
  }
}

// Service 스키마
function generateServiceSchema(service: SEOProps['service']) {
  if (!service) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: service.provider || SITE_CONFIG.organization.name,
      url: SITE_CONFIG.url
    },
    ...(service.category && { category: service.category }),
    ...(service.image && { image: service.image }),
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        price: service.price,
        priceCurrency: service.priceCurrency || 'KRW',
        availability: 'https://schema.org/InStock'
      }
    })
  }
}

// BreadcrumbList 스키마
function generateBreadcrumbSchema(breadcrumbs: SEOProps['breadcrumbs']) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_CONFIG.url}${item.url}`
    }))
  }
}

// WebPage 스키마
function generateWebPageSchema(props: Pick<SEOProps, 'title' | 'description' | 'canonical'>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: props.title,
    description: props.description,
    url: props.canonical || SITE_CONFIG.url,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url
    }
  }
}

export function SEO({
  title,
  description,
  keywords = [],
  canonical,
  ogType = 'website',
  ogImage = SITE_CONFIG.logo,
  ogImageAlt = SITE_CONFIG.name,
  twitterCard = 'summary_large_image',
  jsonLd = [],
  service,
  breadcrumbs,
  noIndex = false,
  noFollow = false
}: SEOProps) {
  // 전체 타이틀 구성
  const fullTitle = `${title} | ${SITE_CONFIG.name}`
  const fullCanonical = canonical
    ? canonical.startsWith('http') ? canonical : `${SITE_CONFIG.url}${canonical}`
    : undefined
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_CONFIG.url}${ogImage}`

  // 자동 JSON-LD 스키마 생성
  const schemas: object[] = []

  // Organization 스키마 (모든 페이지에 포함)
  schemas.push(generateOrganizationSchema())

  // WebPage 스키마
  schemas.push(generateWebPageSchema({ title, description, canonical: fullCanonical }))

  // Service 스키마 (서비스 페이지인 경우)
  if (service) {
    const serviceSchema = generateServiceSchema(service)
    if (serviceSchema) schemas.push(serviceSchema)
  }

  // Breadcrumb 스키마
  if (breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs)
    if (breadcrumbSchema) schemas.push(breadcrumbSchema)
  }

  // 커스텀 JSON-LD 추가
  jsonLd.forEach(item => {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': item.type,
      ...item.data
    })
  })

  // robots 지시어
  const robotsDirectives: string[] = []
  if (noIndex) robotsDirectives.push('noindex')
  else robotsDirectives.push('index')
  if (noFollow) robotsDirectives.push('nofollow')
  else robotsDirectives.push('follow')

  return (
    <Helmet>
      {/* 기본 메타 태그 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <meta name="robots" content={robotsDirectives.join(', ')} />
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* Open Graph 태그 */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:locale" content={SITE_CONFIG.locale} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}

      {/* Twitter Card 태그 */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {/* JSON-LD 구조화 데이터 */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  )
}

export default SEO
