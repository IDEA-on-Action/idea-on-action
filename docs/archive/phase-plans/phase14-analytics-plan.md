# Phase 14: 고급 분석 대시보드 상세 계획

> **작성일**: 2025-11-04
> **예상 기간**: 3주 (2025-11-11 ~ 2025-12-02)
> **버전**: v1.8.0 → v1.8.3
> **담당자**: Claude AI Assistant

---

## 📋 목차

- [개요](#개요)
- [전제 조건](#전제-조건)
- [Week 1: 사용자 행동 분석](#week-1-사용자-행동-분석)
- [Week 2: 매출 차트 & KPI](#week-2-매출-차트--kpi)
- [Week 3: 실시간 대시보드](#week-3-실시간-대시보드)
- [기술 스택](#기술-스택)
- [데이터베이스 설계](#데이터베이스-설계)
- [완료 기준](#완료-기준)
- [리스크 & 대응 방안](#리스크--대응-방안)
- [성공 지표 (KPI)](#성공-지표-kpi)

---

## 개요

Phase 14에서는 **데이터 기반 의사결정**을 위한 고급 분석 시스템을 구축합니다.

### 목표

1. **사용자 행동 분석** - 퍼널, 이탈률, 코호트 분석
2. **매출 분석** - 일간/주간/월간 차트, 서비스별 비교, LTV 계산
3. **실시간 대시보드** - WebSocket 기반 실시간 업데이트

### 주요 기능

- ✨ **Google Analytics 4 통합** (Phase 12 완료)
- 📊 **Recharts 시각화** (Phase 9 일부 완료)
- 🔄 **Supabase Realtime** (Phase 13 일부 완료)
- 📈 **KPI 카드** (매출, 전환율, LTV 등)
- 📉 **퍼널 분석** (회원가입 → 서비스 조회 → 장바구니 → 구매)
- 📊 **코호트 분석** (월별 사용자 유지율)
- 💾 **CSV 내보내기** (데이터 다운로드)

### 예상 결과물

- **17개 파일 생성**, 5개 수정
- **20+ 차트 컴포넌트**
- **30+ 테스트** (E2E 18, Unit 12)
- **번들 크기**: +30 kB gzip (Recharts 포함)

---

## 전제 조건

### 완료된 Phase

- ✅ **Phase 12**: Google Analytics 4 통합 (`src/lib/analytics.ts`)
- ✅ **Phase 9**: Recharts 기본 통합 (매출 차트 2개)
- ✅ **Phase 13**: Supabase Realtime 구독 패턴

### 필요한 데이터

**이미 존재하는 테이블**:
- `orders` - 주문 데이터 (금액, 날짜, 상태)
- `order_items` - 주문 항목 (서비스별 매출)
- `payments` - 결제 데이터 (게이트웨이, 성공/실패)
- `services` - 서비스 정보
- `profiles` - 사용자 프로필

**새로 추가할 테이블**:
- `analytics_events` - 사용자 이벤트 (페이지뷰, 클릭, 구매)
- `cohort_analysis` - 코호트 분석 캐시 (materialized view)

---

## Week 1: 사용자 행동 분석

**목표**: GA4 이벤트 수집 및 퍼널/이탈률 시각화
**완료일**: 2025-11-18 (예상)
**버전**: v1.8.1

### 1. GA4 이벤트 확장

**파일**: `src/lib/analytics.ts` (수정)

**현재 상태** (Phase 12):
```typescript
// 기존 이벤트: pageView, login
export const analytics = {
  pageView: (url: string) => { ... },
  login: (method: string) => { ... },
}
```

**추가할 이벤트** (15개):
```typescript
export const analytics = {
  // 기존
  pageView: (url: string) => void
  login: (method: string) => void

  // 새로 추가
  signup: (method: string) => void
  viewService: (serviceId: string, serviceName: string) => void
  addToCart: (serviceId: string, price: number) => void
  removeFromCart: (serviceId: string) => void
  beginCheckout: (totalAmount: number, itemCount: number) => void
  addPaymentInfo: (method: 'kakao' | 'toss') => void
  purchase: (orderId: string, totalAmount: number, items: any[]) => void
  viewBlogPost: (postId: string, title: string) => void
  search: (query: string, type: string, resultCount: number) => void
  clickCTA: (location: string, label: string) => void
  shareContent: (contentType: string, contentId: string, method: string) => void
  downloadFile: (fileName: string, fileType: string) => void
  error: (errorMessage: string, page: string) => void
  customEvent: (eventName: string, params: Record<string, any>) => void
}
```

**통합 위치**:
- `src/pages/ServiceDetail.tsx` - viewService, addToCart
- `src/components/cart/CartDrawer.tsx` - removeFromCart
- `src/pages/Checkout.tsx` - beginCheckout, addPaymentInfo
- `src/pages/PaymentSuccess.tsx` - purchase
- `src/pages/Search.tsx` - search
- `src/components/Header.tsx` - clickCTA

### 2. 데이터베이스: analytics_events

**마이그레이션**: `supabase/migrations/20251111000001_create_analytics_events.sql`

```sql
-- analytics_events 테이블
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users, -- NULL 허용 (비로그인 사용자)
  session_id TEXT NOT NULL, -- 브라우저 세션 ID
  event_name TEXT NOT NULL, -- 'page_view', 'add_to_cart', 'purchase' 등
  event_params JSONB DEFAULT '{}', -- 이벤트 파라미터
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_params ON analytics_events USING GIN(event_params);

-- RLS 정책
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- 1. 관리자만 조회
CREATE POLICY "Admins can view analytics events"
ON analytics_events FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 2. 서버에서만 삽입 (service_role 키)
CREATE POLICY "Service role can insert analytics events"
ON analytics_events FOR INSERT
WITH CHECK (auth.role() = 'service_role');
```

**세션 ID 생성**:
```typescript
// src/lib/session.ts
export function getSessionId(): string {
  const key = 'analytics_session_id'
  let sessionId = sessionStorage.getItem(key)

  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem(key, sessionId)
  }

  return sessionId
}
```

### 3. useAnalyticsEvents 훅

**파일**: `src/hooks/useAnalyticsEvents.ts`

```typescript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface AnalyticsEvent {
  id: string
  user_id: string | null
  session_id: string
  event_name: string
  event_params: Record<string, any>
  page_url: string
  created_at: string
}

interface EventFilters {
  eventName?: string
  startDate?: Date
  endDate?: Date
  userId?: string
}

export function useAnalyticsEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ['analytics-events', filters],
    queryFn: async () => {
      let query = supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters?.eventName) {
        query = query.eq('event_name', filters.eventName)
      }

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString())
      }

      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate.toISOString())
      }

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId)
      }

      const { data, error } = await query.limit(1000)

      if (error) throw error
      return data as AnalyticsEvent[]
    },
  })
}

// 퍼널 분석
export function useFunnelAnalysis(startDate: Date, endDate: Date) {
  return useQuery({
    queryKey: ['funnel-analysis', startDate, endDate],
    queryFn: async () => {
      // SQL 쿼리로 퍼널 계산
      const { data, error } = await supabase.rpc('calculate_funnel', {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      })

      if (error) throw error

      return {
        signup: data.signup_count,
        viewService: data.view_service_count,
        addToCart: data.add_to_cart_count,
        checkout: data.checkout_count,
        purchase: data.purchase_count,
        conversionRate: {
          signupToView: (data.view_service_count / data.signup_count) * 100,
          viewToCart: (data.add_to_cart_count / data.view_service_count) * 100,
          cartToCheckout: (data.checkout_count / data.add_to_cart_count) * 100,
          checkoutToPurchase: (data.purchase_count / data.checkout_count) * 100,
        },
      }
    },
  })
}

// 이탈률 분석
export function useBounceRate(startDate: Date, endDate: Date) {
  return useQuery({
    queryKey: ['bounce-rate', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('calculate_bounce_rate', {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      })

      if (error) throw error

      return {
        totalSessions: data.total_sessions,
        bouncedSessions: data.bounced_sessions,
        bounceRate: (data.bounced_sessions / data.total_sessions) * 100,
      }
    },
  })
}
```

**SQL 함수**: `supabase/migrations/20251111000002_analytics_functions.sql`

```sql
-- 퍼널 계산 함수
CREATE OR REPLACE FUNCTION calculate_funnel(
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ
)
RETURNS TABLE (
  signup_count BIGINT,
  view_service_count BIGINT,
  add_to_cart_count BIGINT,
  checkout_count BIGINT,
  purchase_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT CASE WHEN event_name = 'signup' THEN session_id END) AS signup_count,
    COUNT(DISTINCT CASE WHEN event_name = 'view_service' THEN session_id END) AS view_service_count,
    COUNT(DISTINCT CASE WHEN event_name = 'add_to_cart' THEN session_id END) AS add_to_cart_count,
    COUNT(DISTINCT CASE WHEN event_name = 'begin_checkout' THEN session_id END) AS checkout_count,
    COUNT(DISTINCT CASE WHEN event_name = 'purchase' THEN session_id END) AS purchase_count
  FROM analytics_events
  WHERE created_at BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;

-- 이탈률 계산 함수
CREATE OR REPLACE FUNCTION calculate_bounce_rate(
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ
)
RETURNS TABLE (
  total_sessions BIGINT,
  bounced_sessions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH session_events AS (
    SELECT
      session_id,
      COUNT(*) AS event_count
    FROM analytics_events
    WHERE created_at BETWEEN start_date AND end_date
    GROUP BY session_id
  )
  SELECT
    COUNT(*)::BIGINT AS total_sessions,
    COUNT(CASE WHEN event_count = 1 THEN 1 END)::BIGINT AS bounced_sessions
  FROM session_events;
END;
$$ LANGUAGE plpgsql;
```

### 4. Analytics 페이지

**파일**: `src/pages/admin/Analytics.tsx`

```tsx
import { useState } from 'react'
import { useFunnelAnalysis, useBounceRate } from '@/hooks/useAnalyticsEvents'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DateRangePicker } from '@/components/analytics/DateRangePicker'
import { FunnelChart } from '@/components/analytics/FunnelChart'
import { BounceRateCard } from '@/components/analytics/BounceRateCard'
import { EventTimeline } from '@/components/analytics/EventTimeline'

export default function Analytics() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30일 전
    end: new Date(),
  })

  const { data: funnelData, isLoading: funnelLoading } = useFunnelAnalysis(
    dateRange.start,
    dateRange.end
  )

  const { data: bounceData, isLoading: bounceLoading } = useBounceRate(
    dateRange.start,
    dateRange.end
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">분석 대시보드</h1>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="funnel">퍼널 분석</TabsTrigger>
          <TabsTrigger value="behavior">사용자 행동</TabsTrigger>
          <TabsTrigger value="events">이벤트 타임라인</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BounceRateCard
              bounceRate={bounceData?.bounceRate}
              totalSessions={bounceData?.totalSessions}
              loading={bounceLoading}
            />
            {/* 기타 KPI 카드 */}
          </div>
        </TabsContent>

        <TabsContent value="funnel">
          <FunnelChart data={funnelData} loading={funnelLoading} />
        </TabsContent>

        <TabsContent value="behavior">
          {/* 사용자 행동 차트 */}
        </TabsContent>

        <TabsContent value="events">
          <EventTimeline startDate={dateRange.start} endDate={dateRange.end} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

### 5. 차트 컴포넌트

**FunnelChart** (`src/components/analytics/FunnelChart.tsx`):
```tsx
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'

interface FunnelChartProps {
  data: {
    signup: number
    viewService: number
    addToCart: number
    checkout: number
    purchase: number
    conversionRate: {
      signupToView: number
      viewToCart: number
      cartToCheckout: number
      checkoutToPurchase: number
    }
  }
  loading: boolean
}

export function FunnelChart({ data, loading }: FunnelChartProps) {
  if (loading) return <Skeleton className="h-96" />

  const chartData = [
    { name: '회원가입', value: data.signup, fill: '#3b82f6' },
    { name: '서비스 조회', value: data.viewService, fill: '#8b5cf6' },
    { name: '장바구니 추가', value: data.addToCart, fill: '#f59e0b' },
    { name: '결제 시작', value: data.checkout, fill: '#10b981' },
    { name: '구매 완료', value: data.purchase, fill: '#ef4444' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>구매 퍼널</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* 전환율 표시 */}
        <div className="mt-4 space-y-2">
          <p className="text-sm">회원가입 → 서비스 조회: {data.conversionRate.signupToView.toFixed(1)}%</p>
          <p className="text-sm">서비스 조회 → 장바구니: {data.conversionRate.viewToCart.toFixed(1)}%</p>
          <p className="text-sm">장바구니 → 결제: {data.conversionRate.cartToCheckout.toFixed(1)}%</p>
          <p className="text-sm">결제 → 구매: {data.conversionRate.checkoutToPurchase.toFixed(1)}%</p>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Week 1 완료 기준

- [ ] GA4 이벤트 15개 추가
- [ ] analytics_events 테이블 생성
- [ ] SQL 함수 2개 (퍼널, 이탈률)
- [ ] useAnalyticsEvents 훅 (3개 함수)
- [ ] Analytics 페이지 (4개 탭)
- [ ] 차트 컴포넌트 5개 (Funnel, BounceRate, EventTimeline 등)
- [ ] E2E 테스트 8개
- [ ] 유닛 테스트 5개

---

## Week 2: 매출 차트 & KPI

**목표**: 매출 데이터 시각화 및 KPI 대시보드
**완료일**: 2025-11-25 (예상)
**버전**: v1.8.2

### 1. useRevenue 훅

**파일**: `src/hooks/useRevenue.ts`

```typescript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface RevenueData {
  date: string
  total: number
  count: number
}

export function useRevenueByDate(
  startDate: Date,
  endDate: Date,
  groupBy: 'day' | 'week' | 'month' = 'day'
) {
  return useQuery({
    queryKey: ['revenue-by-date', startDate, endDate, groupBy],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_revenue_by_date', {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        group_by: groupBy,
      })

      if (error) throw error
      return data as RevenueData[]
    },
  })
}

export function useRevenueByService(startDate: Date, endDate: Date) {
  return useQuery({
    queryKey: ['revenue-by-service', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_revenue_by_service', {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      })

      if (error) throw error
      return data as Array<{
        service_id: string
        service_name: string
        total_revenue: number
        order_count: number
      }>
    },
  })
}

export function useKPIs(startDate: Date, endDate: Date) {
  return useQuery({
    queryKey: ['kpis', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_kpis', {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      })

      if (error) throw error

      return {
        totalRevenue: data.total_revenue,
        orderCount: data.order_count,
        averageOrderValue: data.average_order_value,
        conversionRate: data.conversion_rate,
        newCustomers: data.new_customers,
        returningCustomers: data.returning_customers,
      }
    },
  })
}

export function useLTV(userId: string) {
  return useQuery({
    queryKey: ['ltv', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('user_id', userId)
        .eq('status', 'completed')

      if (error) throw error

      const totalSpent = data.reduce((sum, order) => sum + order.total_amount, 0)
      return { totalSpent, orderCount: data.length }
    },
  })
}
```

**SQL 함수**: `supabase/migrations/20251118000001_revenue_functions.sql`

```sql
-- 일/주/월별 매출 함수
CREATE OR REPLACE FUNCTION get_revenue_by_date(
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  group_by TEXT DEFAULT 'day'
)
RETURNS TABLE (
  date TEXT,
  total NUMERIC,
  count BIGINT
) AS $$
BEGIN
  IF group_by = 'day' THEN
    RETURN QUERY
    SELECT
      TO_CHAR(created_at, 'YYYY-MM-DD') AS date,
      SUM(total_amount)::NUMERIC AS total,
      COUNT(*)::BIGINT AS count
    FROM orders
    WHERE created_at BETWEEN start_date AND end_date
      AND status = 'completed'
    GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
    ORDER BY date;
  ELSIF group_by = 'week' THEN
    RETURN QUERY
    SELECT
      TO_CHAR(DATE_TRUNC('week', created_at), 'YYYY-"W"IW') AS date,
      SUM(total_amount)::NUMERIC AS total,
      COUNT(*)::BIGINT AS count
    FROM orders
    WHERE created_at BETWEEN start_date AND end_date
      AND status = 'completed'
    GROUP BY DATE_TRUNC('week', created_at)
    ORDER BY date;
  ELSIF group_by = 'month' THEN
    RETURN QUERY
    SELECT
      TO_CHAR(created_at, 'YYYY-MM') AS date,
      SUM(total_amount)::NUMERIC AS total,
      COUNT(*)::BIGINT AS count
    FROM orders
    WHERE created_at BETWEEN start_date AND end_date
      AND status = 'completed'
    GROUP BY TO_CHAR(created_at, 'YYYY-MM')
    ORDER BY date;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 서비스별 매출 함수
CREATE OR REPLACE FUNCTION get_revenue_by_service(
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ
)
RETURNS TABLE (
  service_id UUID,
  service_name TEXT,
  total_revenue NUMERIC,
  order_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    oi.service_id,
    s.title AS service_name,
    SUM(oi.price * oi.quantity)::NUMERIC AS total_revenue,
    COUNT(DISTINCT o.id)::BIGINT AS order_count
  FROM order_items oi
  JOIN orders o ON oi.order_id = o.id
  JOIN services s ON oi.service_id = s.id
  WHERE o.created_at BETWEEN start_date AND end_date
    AND o.status = 'completed'
  GROUP BY oi.service_id, s.title
  ORDER BY total_revenue DESC;
END;
$$ LANGUAGE plpgsql;

-- KPI 계산 함수
CREATE OR REPLACE FUNCTION get_kpis(
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ
)
RETURNS TABLE (
  total_revenue NUMERIC,
  order_count BIGINT,
  average_order_value NUMERIC,
  conversion_rate NUMERIC,
  new_customers BIGINT,
  returning_customers BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH order_stats AS (
    SELECT
      SUM(total_amount) AS revenue,
      COUNT(*) AS orders,
      COUNT(DISTINCT user_id) AS customers
    FROM orders
    WHERE created_at BETWEEN start_date AND end_date
      AND status = 'completed'
  ),
  visitor_stats AS (
    SELECT COUNT(DISTINCT session_id) AS sessions
    FROM analytics_events
    WHERE created_at BETWEEN start_date AND end_date
      AND event_name = 'page_view'
  ),
  customer_stats AS (
    SELECT
      COUNT(DISTINCT user_id) FILTER (WHERE order_num = 1) AS new_cust,
      COUNT(DISTINCT user_id) FILTER (WHERE order_num > 1) AS return_cust
    FROM (
      SELECT
        user_id,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) AS order_num
      FROM orders
      WHERE created_at BETWEEN start_date AND end_date
        AND status = 'completed'
    ) numbered_orders
  )
  SELECT
    os.revenue::NUMERIC,
    os.orders::BIGINT,
    (os.revenue / NULLIF(os.orders, 0))::NUMERIC AS avg_order_value,
    (os.orders::NUMERIC / NULLIF(vs.sessions, 0) * 100)::NUMERIC AS conv_rate,
    cs.new_cust::BIGINT,
    cs.return_cust::BIGINT
  FROM order_stats os, visitor_stats vs, customer_stats cs;
END;
$$ LANGUAGE plpgsql;
```

### 2. Revenue 페이지

**파일**: `src/pages/admin/Revenue.tsx`

```tsx
import { useState } from 'react'
import { useRevenueByDate, useRevenueByService, useKPIs } from '@/hooks/useRevenue'
import { RevenueChart } from '@/components/analytics/RevenueChart'
import { ServiceRevenueChart } from '@/components/analytics/ServiceRevenueChart'
import { KPICard } from '@/components/analytics/KPICard'
import { DateRangePicker } from '@/components/analytics/DateRangePicker'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export default function Revenue() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
  })
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day')

  const { data: revenueData, isLoading: revenueLoading } = useRevenueByDate(
    dateRange.start,
    dateRange.end,
    groupBy
  )

  const { data: serviceData, isLoading: serviceLoading } = useRevenueByService(
    dateRange.start,
    dateRange.end
  )

  const { data: kpis, isLoading: kpisLoading } = useKPIs(
    dateRange.start,
    dateRange.end
  )

  const handleExportCSV = () => {
    // CSV 내보내기 로직
    const csv = revenueData
      ?.map(row => `${row.date},${row.total},${row.count}`)
      .join('\n')
    const blob = new Blob([`Date,Revenue,Orders\n${csv}`], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `revenue_${dateRange.start.toISOString().split('T')[0]}_${dateRange.end.toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">매출 분석</h1>
        <div className="flex gap-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSV 내보내기
          </Button>
        </div>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <KPICard
          title="총 매출"
          value={kpis?.totalRevenue}
          format="currency"
          loading={kpisLoading}
        />
        <KPICard
          title="주문 수"
          value={kpis?.orderCount}
          format="number"
          loading={kpisLoading}
        />
        <KPICard
          title="평균 주문액"
          value={kpis?.averageOrderValue}
          format="currency"
          loading={kpisLoading}
        />
        <KPICard
          title="전환율"
          value={kpis?.conversionRate}
          format="percentage"
          loading={kpisLoading}
        />
        <KPICard
          title="신규 고객"
          value={kpis?.newCustomers}
          format="number"
          loading={kpisLoading}
        />
        <KPICard
          title="재구매 고객"
          value={kpis?.returningCustomers}
          format="number"
          loading={kpisLoading}
        />
      </div>

      {/* 기간 선택 */}
      <Tabs value={groupBy} onValueChange={v => setGroupBy(v as any)} className="mb-4">
        <TabsList>
          <TabsTrigger value="day">일간</TabsTrigger>
          <TabsTrigger value="week">주간</TabsTrigger>
          <TabsTrigger value="month">월간</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 매출 차트 */}
      <RevenueChart data={revenueData} groupBy={groupBy} loading={revenueLoading} />

      {/* 서비스별 매출 */}
      <ServiceRevenueChart data={serviceData} loading={serviceLoading} className="mt-6" />
    </div>
  )
}
```

### 3. 차트 컴포넌트

**RevenueChart** (`src/components/analytics/RevenueChart.tsx`):
```tsx
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function RevenueChart({ data, groupBy, loading }) {
  if (loading) return <Skeleton className="h-96" />

  return (
    <Card>
      <CardHeader>
        <CardTitle>{groupBy === 'day' ? '일별' : groupBy === 'week' ? '주별' : '월별'} 매출</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value) => `₩${value.toLocaleString()}`}
              labelFormatter={(label) => `날짜: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
```

**ServiceRevenueChart** (`src/components/analytics/ServiceRevenueChart.tsx`):
```tsx
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444']

export function ServiceRevenueChart({ data, loading }) {
  if (loading) return <Skeleton className="h-96" />

  return (
    <Card>
      <CardHeader>
        <CardTitle>서비스별 매출 비중</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total_revenue"
              nameKey="service_name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {data?.map((entry, index) => (
                <Cell key={entry.service_id} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₩${value.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
```

### Week 2 완료 기준

- [ ] useRevenue 훅 (4개 함수)
- [ ] SQL 함수 3개 (매출/서비스/KPI)
- [ ] Revenue 페이지
- [ ] 차트 컴포넌트 3개 (Revenue, ServiceRevenue, KPICard)
- [ ] CSV 내보내기 기능
- [ ] E2E 테스트 6개
- [ ] 유닛 테스트 4개

---

## Week 3: 실시간 대시보드

**목표**: Supabase Realtime 기반 실시간 업데이트
**완료일**: 2025-12-02 (예상)
**버전**: v1.8.3

### 1. useRealtimeDashboard 훅

**파일**: `src/hooks/useRealtimeDashboard.ts`

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'

export function useRealtimeDashboard() {
  const [liveOrders, setLiveOrders] = useState<any[]>([])
  const queryClient = useQueryClient()

  useEffect(() => {
    // orders 테이블 구독
    const ordersChannel = supabase
      .channel('realtime-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLiveOrders(prev => [payload.new, ...prev].slice(0, 10))

            // KPI 쿼리 무효화 (자동 새로고침)
            queryClient.invalidateQueries(['kpis'])
            queryClient.invalidateQueries(['revenue-by-date'])
          }
        }
      )
      .subscribe()

    // payments 테이블 구독
    const paymentsChannel = supabase
      .channel('realtime-payments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments',
        },
        () => {
          queryClient.invalidateQueries(['kpis'])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(ordersChannel)
      supabase.removeChannel(paymentsChannel)
    }
  }, [queryClient])

  return { liveOrders }
}

export function useAutoRefresh(interval = 30000) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const timer = setInterval(() => {
      queryClient.invalidateQueries(['kpis'])
      queryClient.invalidateQueries(['revenue-by-date'])
    }, interval)

    return () => clearInterval(timer)
  }, [interval, queryClient])
}
```

### 2. RealtimeDashboard 페이지

**파일**: `src/pages/admin/RealtimeDashboard.tsx`

```tsx
import { useRealtimeDashboard, useAutoRefresh } from '@/hooks/useRealtimeDashboard'
import { useKPIs } from '@/hooks/useRevenue'
import { LiveActivityFeed } from '@/components/analytics/LiveActivityFeed'
import { KPICard } from '@/components/analytics/KPICard'
import { Badge } from '@/components/ui/badge'
import { Activity } from 'lucide-react'

export default function RealtimeDashboard() {
  const { liveOrders } = useRealtimeDashboard()
  useAutoRefresh(30000) // 30초마다 자동 새로고침

  const { data: kpis, isLoading } = useKPIs(
    new Date(Date.now() - 24 * 60 * 60 * 1000), // 최근 24시간
    new Date()
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-green-500 animate-pulse" />
          <h1 className="text-3xl font-bold">실시간 대시보드</h1>
          <Badge variant="success">LIVE</Badge>
        </div>
        <p className="text-sm text-muted-foreground">자동 새로고침: 30초</p>
      </div>

      {/* 실시간 KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="오늘 매출"
          value={kpis?.totalRevenue}
          format="currency"
          loading={isLoading}
          realtime
        />
        <KPICard
          title="오늘 주문"
          value={kpis?.orderCount}
          format="number"
          loading={isLoading}
          realtime
        />
        <KPICard
          title="평균 주문액"
          value={kpis?.averageOrderValue}
          format="currency"
          loading={isLoading}
          realtime
        />
        <KPICard
          title="전환율"
          value={kpis?.conversionRate}
          format="percentage"
          loading={isLoading}
          realtime
        />
      </div>

      {/* 실시간 활동 피드 */}
      <LiveActivityFeed orders={liveOrders} />
    </div>
  )
}
```

### 3. LiveActivityFeed 컴포넌트

**파일**: `src/components/analytics/LiveActivityFeed.tsx`

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ShoppingCart, CreditCard, Package } from 'lucide-react'

export function LiveActivityFeed({ orders }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>실시간 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              최근 활동이 없습니다.
            </p>
          )}

          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-accent animate-in slide-in-from-top"
            >
              <div className="p-2 rounded-full bg-primary/10">
                {order.status === 'pending' && <ShoppingCart className="h-5 w-5 text-orange-500" />}
                {order.status === 'processing' && <CreditCard className="h-5 w-5 text-blue-500" />}
                {order.status === 'completed' && <Package className="h-5 w-5 text-green-500" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold">새 주문 #{order.order_number}</p>
                <p className="text-sm text-muted-foreground">
                  ₩{order.total_amount.toLocaleString()} · {order.items_count}개 항목
                </p>
              </div>
              <div className="text-right">
                <Badge>{order.status}</Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(order.created_at), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

### Week 3 완료 기준

- [ ] useRealtimeDashboard 훅
- [ ] useAutoRefresh 훅
- [ ] RealtimeDashboard 페이지
- [ ] LiveActivityFeed 컴포넌트
- [ ] 실시간 KPI 업데이트 검증
- [ ] E2E 테스트 4개
- [ ] 유닛 테스트 3개

---

## 기술 스택

### 새로 추가되는 라이브러리

```json
{
  "dependencies": {
    "recharts": "^2.10.0",
    "date-fns": "^3.0.0"
  }
}
```

**recharts**: 차트 라이브러리 (이미 Phase 9에서 설치됨)
**date-fns**: 날짜 유틸리티 (formatDistanceToNow, format 등)

### 이미 사용 중인 라이브러리

- **React Query** - 서버 상태 관리 (Phase 8)
- **Supabase** - Realtime 구독 (Phase 13)
- **Google Analytics 4** - 이벤트 추적 (Phase 12)

---

## 데이터베이스 설계

### 새 테이블

**analytics_events** (5 GB 예상):
- id (UUID, PK)
- user_id (UUID, FK, NULL 허용)
- session_id (TEXT, 필수)
- event_name (TEXT, 필수)
- event_params (JSONB)
- page_url, referrer, user_agent, ip_address
- created_at (TIMESTAMPTZ)

**인덱스 전략**:
- event_name (B-tree) - 퍼널 분석
- created_at (B-tree DESC) - 시계열 쿼리
- user_id (B-tree) - 사용자별 분석
- event_params (GIN) - JSONB 검색

### SQL 함수 (5개)

1. `calculate_funnel()` - 퍼널 분석
2. `calculate_bounce_rate()` - 이탈률 계산
3. `get_revenue_by_date()` - 일/주/월별 매출
4. `get_revenue_by_service()` - 서비스별 매출
5. `get_kpis()` - 전체 KPI 계산

---

## 완료 기준

### Phase 14 전체

- [ ] **17개 파일 생성**, 5개 수정
- [ ] **20+ 차트 컴포넌트** (Funnel, Revenue, Service, KPI, Live 등)
- [ ] **18개 E2E 테스트** (Analytics 8, Revenue 6, Realtime 4)
- [ ] **12개 유닛 테스트** (useAnalytics 5, useRevenue 4, useRealtime 3)
- [ ] **SQL 함수 5개** 작성 및 검증
- [ ] **번들 크기**: +30 kB gzip (Recharts, date-fns 포함)
- [ ] **빌드 성공** (에러 0개)
- [ ] **실시간 업데이트 검증** (Supabase Realtime)

### 기능 검증

- [ ] GA4 이벤트 15개 정상 전송
- [ ] 퍼널 차트 렌더링 및 전환율 계산
- [ ] 매출 차트 일/주/월 전환
- [ ] CSV 내보내기 성공
- [ ] 실시간 주문 알림 (3초 이내)
- [ ] KPI 자동 새로고침 (30초)

---

## 리스크 & 대응 방안

### 리스크 1: 대용량 데이터 쿼리 성능 저하

**발생 시기**: analytics_events 100만+ 레코드
**영향도**: 높음 (페이지 로딩 느림)

**대응 방안**:
1. **Materialized View 사용**
   - 일간/주간/월간 매출을 미리 계산 (Cron Job)
   - `refresh materialized view` 매일 새벽 3시 실행
2. **파티셔닝**
   - analytics_events를 월별로 파티셔닝
   - 90일 이전 데이터는 별도 아카이브 테이블로 이동
3. **인덱스 최적화**
   - BRIN 인덱스 사용 (시계열 데이터)
   - JSONB 인덱스 최소화

### 리스크 2: GA4 이벤트 누락

**발생 시기**: 네트워크 오류, 광고 차단기
**영향도**: 중간 (분석 정확도 하락)

**대응 방안**:
1. **Dual Tracking**
   - GA4 + Supabase analytics_events 동시 저장
   - 클라이언트 에러 시 Supabase만 사용
2. **재시도 로직**
   - GA4 전송 실패 시 3회 재시도
   - LocalStorage 큐에 저장 후 다음 세션에 전송

### 리스크 3: Realtime 연결 끊김

**발생 시기**: 네트워크 불안정, 브라우저 슬립 모드
**영향도**: 낮음 (자동 재연결)

**대응 방안**:
1. **Supabase Realtime 자동 재연결** (내장 기능)
2. **Fallback: Polling**
   - Realtime 실패 시 30초마다 polling
   - 재연결 성공 시 polling 중단

---

## 성공 지표 (KPI)

### Phase 14 목표

**사용성**:
- [ ] 분석 대시보드 로딩 시간 < 2초
- [ ] 차트 렌더링 시간 < 500ms
- [ ] 실시간 업데이트 지연 < 3초

**정확성**:
- [ ] GA4 vs Supabase 이벤트 일치율 > 95%
- [ ] 퍼널 전환율 계산 오차 < 1%
- [ ] 매출 데이터 오차 0% (금전적 정확성)

**성능**:
- [ ] 30일 매출 쿼리 < 1초
- [ ] 100만 이벤트 쿼리 < 3초 (인덱스 최적화)
- [ ] Realtime 메모리 사용 < 50MB

---

## 다음 단계 (Phase 15)

Phase 14 완료 후 다음 작업:

1. **APM (Application Performance Monitoring)**
   - Sentry Performance 고급 설정
   - Database 쿼리 추적
   - API 응답 시간 모니터링

2. **로그 수집 시스템**
   - Supabase Edge Functions 로그
   - 클라이언트 에러 로그
   - 로그 대시보드 (Grafana)

3. **성능 최적화**
   - Lighthouse 점수 개선 (95+ 목표)
   - 이미지 최적화 (WebP, AVIF)
   - Code Splitting 추가 최적화

---

**작성자**: Claude AI Assistant
**검토 필요**: 서민원 대표
**관련 문서**:
- [CLAUDE.md](../../CLAUDE.md)
- [docs/project/roadmap.md](./roadmap.md)
- [project-todo.md](../../project-todo.md)
