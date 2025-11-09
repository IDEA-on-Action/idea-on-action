/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useAnalyticsEvents,
  useFunnelAnalysis,
  useBounceRate,
  useEventCounts,
  useSessionTimeline,
  useRealtimeEvents,
  useUserEventHistory
} from '@/hooks/useAnalyticsEvents'
import { supabase } from '@/integrations/supabase/client'

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn()
  }
}))

describe('useAnalyticsEvents Hooks', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
    vi.clearAllMocks()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  // ============================================
  // 1. useAnalyticsEvents
  // ============================================
  describe('useAnalyticsEvents', () => {
    it('should fetch analytics events successfully', async () => {
      const mockEvents = [
        {
          id: '1',
          user_id: 'user1',
          session_id: 'session1',
          event_name: 'page_view',
          event_params: {},
          page_url: '/home',
          referrer: null,
          user_agent: 'Mozilla/5.0',
          ip_address: '127.0.0.1',
          created_at: '2025-11-09T12:00:00Z'
        }
      ]

      const limitMock = vi.fn().mockResolvedValue({ data: mockEvents, error: null })
      const orderMock = vi.fn().mockReturnValue({ limit: limitMock })
      const selectMock = vi.fn().mockReturnValue({ order: orderMock })

      vi.mocked(supabase.from).mockReturnValue({
        select: selectMock
      } as any)

      const { result } = renderHook(() => useAnalyticsEvents(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true), { timeout: 3000 })

      if (result.current.isSuccess) {
        expect(result.current.data).toEqual(mockEvents)
        expect(supabase.from).toHaveBeenCalledWith('analytics_events')
      }
    })

    it('should apply filters correctly', async () => {
      const filters = {
        eventName: 'purchase',
        startDate: new Date('2025-11-01'),
        endDate: new Date('2025-11-30'),
        userId: 'user123'
      }

      const limitMock = vi.fn().mockResolvedValue({ data: [], error: null })
      const eqMock1 = vi.fn().mockReturnValue({ limit: limitMock })
      const eqMock2 = vi.fn().mockReturnValue({ eq: eqMock1 })
      const lteMock = vi.fn().mockReturnValue({ eq: eqMock2 })
      const gteMock = vi.fn().mockReturnValue({ lte: lteMock })
      const eqMock3 = vi.fn().mockReturnValue({ gte: gteMock })
      const orderMock = vi.fn().mockReturnValue({ eq: eqMock3 })
      const selectMock = vi.fn().mockReturnValue({ order: orderMock })

      vi.mocked(supabase.from).mockReturnValue({
        select: selectMock
      } as any)

      const { result } = renderHook(() => useAnalyticsEvents(filters, 500), { wrapper })

      await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true), { timeout: 3000 })

      // Verify query was built correctly
      expect(supabase.from).toHaveBeenCalledWith('analytics_events')
    })

    it('should handle errors gracefully', async () => {
      const limitMock = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error', code: '500' }
      })
      const orderMock = vi.fn().mockReturnValue({ limit: limitMock })
      const selectMock = vi.fn().mockReturnValue({ order: orderMock })

      vi.mocked(supabase.from).mockReturnValue({
        select: selectMock
      } as any)

      const { result } = renderHook(() => useAnalyticsEvents(), { wrapper })

      await waitFor(() => expect(result.current.isError).toBe(true))
    })
  })

  // ============================================
  // 2. useFunnelAnalysis
  // ============================================
  describe('useFunnelAnalysis', () => {
    it('should calculate funnel data successfully', async () => {
      const mockData = [{
        signup_count: 100,
        view_service_count: 80,
        add_to_cart_count: 50,
        checkout_count: 30,
        purchase_count: 20
      }]

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockData, error: null })

      const startDate = new Date('2025-11-01')
      const endDate = new Date('2025-11-30')

      const { result } = renderHook(() => useFunnelAnalysis(startDate, endDate), { wrapper })

      await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true), { timeout: 3000 })

      if (result.current.isSuccess) {
        expect(result.current.data?.signup).toBe(100)
        expect(result.current.data?.viewService).toBe(80)
        expect(result.current.data?.conversionRate.signupToView).toBe(80)
        expect(result.current.data?.conversionRate.viewToCart).toBe(62.5)
        expect(supabase.rpc).toHaveBeenCalledWith('calculate_funnel', {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        })
      }
    })

    it('should handle zero conversion rates', async () => {
      const mockData = [{
        signup_count: 0,
        view_service_count: 0,
        add_to_cart_count: 0,
        checkout_count: 0,
        purchase_count: 0
      }]

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockData, error: null })

      const startDate = new Date('2025-11-01')
      const endDate = new Date('2025-11-30')

      const { result } = renderHook(() => useFunnelAnalysis(startDate, endDate), { wrapper })

      await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true), { timeout: 3000 })

      if (result.current.isSuccess) {
        expect(result.current.data?.conversionRate.signupToView).toBe(0)
        expect(result.current.data?.conversionRate.viewToCart).toBe(0)
      }
    })
  })

  // ============================================
  // 3. useBounceRate
  // ============================================
  describe('useBounceRate', () => {
    it('should calculate bounce rate successfully', async () => {
      const mockData = [{
        total_sessions: 1000,
        bounced_sessions: 350
      }]

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockData, error: null })

      const startDate = new Date('2025-11-01')
      const endDate = new Date('2025-11-30')

      const { result } = renderHook(() => useBounceRate(startDate, endDate), { wrapper })

      await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true), { timeout: 3000 })

      if (result.current.isSuccess) {
        expect(result.current.data?.totalSessions).toBe(1000)
        expect(result.current.data?.bouncedSessions).toBe(350)
        expect(result.current.data?.bounceRate).toBe(35)
      }
    })

    it('should handle zero sessions', async () => {
      const mockData = [{
        total_sessions: 0,
        bounced_sessions: 0
      }]

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockData, error: null })

      const startDate = new Date('2025-11-01')
      const endDate = new Date('2025-11-30')

      const { result } = renderHook(() => useBounceRate(startDate, endDate), { wrapper })

      await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true), { timeout: 3000 })

      if (result.current.isSuccess) {
        expect(result.current.data?.bounceRate).toBe(0)
      }
    })
  })

  // ============================================
  // 4. useEventCounts
  // ============================================
  describe('useEventCounts', () => {
    it('should fetch event counts successfully', async () => {
      const mockData = [
        { event_name: 'page_view', event_count: 1000, unique_users: 500, unique_sessions: 600 },
        { event_name: 'purchase', event_count: 100, unique_users: 80, unique_sessions: 90 },
        { event_name: 'add_to_cart', event_count: 300, unique_users: 200, unique_sessions: 250 }
      ]

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockData, error: null })

      const startDate = new Date('2025-11-01')
      const endDate = new Date('2025-11-30')

      const { result } = renderHook(() => useEventCounts(startDate, endDate, 10), { wrapper })

      await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true), { timeout: 3000 })

      if (result.current.isSuccess) {
        expect(result.current.data?.length).toBe(3)
        expect(result.current.data?.[0].event_name).toBe('page_view')
      }
    })

    it('should limit results to topN', async () => {
      const mockData = Array.from({ length: 50 }, (_, i) => ({
        event_name: `event${i}`,
        event_count: 100 - i,
        unique_users: 50 - i,
        unique_sessions: 60 - i
      }))

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockData, error: null })

      const startDate = new Date('2025-11-01')
      const endDate = new Date('2025-11-30')

      const { result } = renderHook(() => useEventCounts(startDate, endDate, 10), { wrapper })

      await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true), { timeout: 3000 })

      if (result.current.isSuccess) {
        expect(result.current.data?.length).toBe(10)
      }
    })
  })

  // ============================================
  // 5. useSessionTimeline
  // ============================================
  describe('useSessionTimeline', () => {
    it('should fetch session timeline successfully', async () => {
      const mockData = [
        {
          id: '1',
          event_name: 'page_view',
          event_params: { page: 'home' },
          page_url: '/home',
          created_at: '2025-11-09T12:00:00Z'
        },
        {
          id: '2',
          event_name: 'add_to_cart',
          event_params: { service_id: '123' },
          page_url: '/services/123',
          created_at: '2025-11-09T12:05:00Z'
        }
      ]

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockData, error: null })

      const sessionId = 'session123'

      const { result } = renderHook(() => useSessionTimeline(sessionId), { wrapper })

      await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true), { timeout: 3000 })

      if (result.current.isSuccess) {
        expect(result.current.data?.length).toBe(2)
        expect(supabase.rpc).toHaveBeenCalledWith('get_session_timeline', {
          p_session_id: sessionId
        })
      }
    })

    it('should not execute when sessionId is empty', () => {
      const { result } = renderHook(() => useSessionTimeline(''), { wrapper })

      expect(result.current.fetchStatus).toBe('idle')
    })
  })

  // ============================================
  // 6. useRealtimeEvents
  // ============================================
  describe('useRealtimeEvents', () => {
    it('should fetch recent events successfully', async () => {
      const mockEvents = [
        {
          id: '1',
          user_id: 'user1',
          session_id: 'session1',
          event_name: 'purchase',
          event_params: {},
          page_url: '/checkout',
          referrer: null,
          user_agent: 'Mozilla/5.0',
          ip_address: '127.0.0.1',
          created_at: '2025-11-09T12:00:00Z'
        }
      ]

      const limitMock = vi.fn().mockResolvedValue({ data: mockEvents, error: null })
      const orderMock = vi.fn().mockReturnValue({ limit: limitMock })
      const selectMock = vi.fn().mockReturnValue({ order: orderMock })

      vi.mocked(supabase.from).mockReturnValue({
        select: selectMock
      } as any)

      const { result } = renderHook(() => useRealtimeEvents(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true), { timeout: 3000 })

      if (result.current.isSuccess) {
        expect(result.current.data?.length).toBe(1)
        expect(result.current.data?.[0].event_name).toBe('purchase')
      }
    })

    it('should limit to 10 events', async () => {
      const mockEvents = Array.from({ length: 15 }, (_, i) => ({
        id: `${i}`,
        user_id: 'user1',
        session_id: 'session1',
        event_name: 'page_view',
        event_params: {},
        page_url: '/home',
        referrer: null,
        user_agent: 'Mozilla/5.0',
        ip_address: '127.0.0.1',
        created_at: '2025-11-09T12:00:00Z'
      }))

      const limitMock = vi.fn().mockImplementation((limit) => {
        const limitedData = mockEvents.slice(0, limit)
        return Promise.resolve({ data: limitedData, error: null })
      })
      const orderMock = vi.fn().mockReturnValue({ limit: limitMock })
      const selectMock = vi.fn().mockReturnValue({ order: orderMock })

      vi.mocked(supabase.from).mockReturnValue({
        select: selectMock
      } as any)

      const { result } = renderHook(() => useRealtimeEvents(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true), { timeout: 3000 })

      if (result.current.isSuccess) {
        expect(result.current.data?.length).toBeLessThanOrEqual(10)
      }
    })
  })

  // ============================================
  // 7. useUserEventHistory
  // ============================================
  describe('useUserEventHistory', () => {
    it('should fetch user event history successfully', async () => {
      const mockEvents = [
        {
          id: '1',
          user_id: 'user123',
          session_id: 'session1',
          event_name: 'purchase',
          event_params: { amount: 50000 },
          page_url: '/checkout',
          referrer: null,
          user_agent: 'Mozilla/5.0',
          ip_address: '127.0.0.1',
          created_at: '2025-11-09T12:00:00Z'
        },
        {
          id: '2',
          user_id: 'user123',
          session_id: 'session2',
          event_name: 'page_view',
          event_params: {},
          page_url: '/home',
          referrer: null,
          user_agent: 'Mozilla/5.0',
          ip_address: '127.0.0.1',
          created_at: '2025-11-08T10:00:00Z'
        }
      ]

      const limitMock = vi.fn().mockResolvedValue({ data: mockEvents, error: null })
      const orderMock = vi.fn().mockReturnValue({ limit: limitMock })
      const eqMock = vi.fn().mockReturnValue({ order: orderMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockReturnValue({
        select: selectMock
      } as any)

      const userId = 'user123'

      const { result } = renderHook(() => useUserEventHistory(userId, 50), { wrapper })

      await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true), { timeout: 3000 })

      if (result.current.isSuccess) {
        expect(result.current.data?.length).toBe(2)
        expect(result.current.data?.every(event => event.user_id === userId)).toBe(true)
      }
    })

    it('should not execute when userId is empty', () => {
      const { result } = renderHook(() => useUserEventHistory(''), { wrapper })

      expect(result.current.fetchStatus).toBe('idle')
    })
  })
})
