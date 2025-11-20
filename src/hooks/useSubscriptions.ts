
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { 
  SubscriptionWithPlan, 
  SubscriptionPaymentWithDetails,
  CancelSubscriptionRequest,
  UpgradeSubscriptionRequest
} from '@/types/subscription.types'
import { toast } from 'sonner'

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  mySubscriptions: () => [...subscriptionKeys.all, 'my'] as const,
  details: (id: string) => [...subscriptionKeys.all, 'detail', id] as const,
  payments: (id: string) => [...subscriptionKeys.all, 'payments', id] as const,
}

/**
 * 내 구독 목록 조회 훅
 */
export function useMySubscriptions() {
  return useQuery({
    queryKey: subscriptionKeys.mySubscriptions(),
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('로그인이 필요합니다.')

      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          service:services (
            id,
            title,
            slug,
            image_url
          ),
          plan:subscription_plans (
            id,
            plan_name,
            billing_cycle,
            price,
            features
          ),
          billing_key:billing_keys (
            *
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // 타입 캐스팅 (Supabase 조인 쿼리 결과 매핑)
      return data as unknown as SubscriptionWithPlan[]
    }
  })
}

/**
 * 구독 취소 훅
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ subscription_id, cancel_at_period_end, reason }: CancelSubscriptionRequest) => {
      // 1. 구독 상태 업데이트
      const status = cancel_at_period_end ? 'active' : 'cancelled'
      const updateData: any = {
        cancel_at_period_end,
        metadata: reason ? { cancel_reason: reason } : undefined
      }

      // 즉시 취소인 경우 status도 변경
      if (!cancel_at_period_end) {
        updateData.status = 'cancelled'
        updateData.cancelled_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('id', subscription_id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast.success('구독이 성공적으로 취소되었습니다.')
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all })
    },
    onError: (error) => {
      console.error('Error cancelling subscription:', error)
      toast.error('구독 취소 중 오류가 발생했습니다.')
    }
  })
}

/**
 * 구독 업그레이드/다운그레이드 훅
 */
export function useUpgradeSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ subscription_id, new_plan_id }: UpgradeSubscriptionRequest) => {
      // 실제 결제 로직은 Edge Function에서 처리해야 하지만, 
      // 여기서는 DB 업데이트만 시뮬레이션 (실제 구현 시에는 Edge Function 호출 필요)
      
      // 1. 새 플랜 정보 가져오기
      const { data: plan, error: planError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', new_plan_id)
        .single()
        
      if (planError) throw planError

      // 2. 구독 정보 업데이트
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          plan_id: new_plan_id,
          // 즉시 변경의 경우 필요한 날짜 계산 로직이 추가되어야 함
          updated_at: new Date().toISOString()
        })
        .eq('id', subscription_id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast.success('구독 플랜이 변경되었습니다.')
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all })
    },
    onError: (error) => {
      console.error('Error upgrading subscription:', error)
      toast.error('구독 변경 중 오류가 발생했습니다.')
    }
  })
}

/**
 * 구독 결제 내역 조회 훅
 */
export function useSubscriptionPayments(subscriptionId: string) {
  return useQuery({
    queryKey: subscriptionKeys.payments(subscriptionId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_payments')
        .select(`
          *,
          subscription:subscriptions (
            id,
            service:services (title),
            plan:subscription_plans (plan_name)
          )
        `)
        .eq('subscription_id', subscriptionId)
        .order('created_at', { ascending: false })

      if (error) throw error

      // 데이터 매핑
      return data.map(payment => ({
        ...payment,
        subscription: {
          id: payment.subscription.id,
          service_title: payment.subscription.service?.title || 'Unknown Service',
          plan_name: payment.subscription.plan?.plan_name || 'Unknown Plan'
        }
      })) as SubscriptionPaymentWithDetails[]
    },
    enabled: !!subscriptionId
  })
}
