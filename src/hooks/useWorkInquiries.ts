/**
 * Work Inquiries Hook
 *
 * Work with Us 문의 관리
 * - 문의 제출
 * - 이메일 발송
 * - Supabase 저장
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export interface WorkInquiry {
  id?: string
  name: string
  email: string
  company?: string
  package: string
  budget?: string
  brief: string
  status?: 'pending' | 'contacted' | 'in_progress' | 'completed' | 'rejected'
  admin_notes?: string
  created_at?: string
}

/**
 * Work with Us 문의 제출
 */
export function useSubmitWorkInquiry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: WorkInquiry) => {
      // 1. 이메일 유효성 검사
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        throw new Error('유효한 이메일 주소를 입력해주세요.')
      }

      // 2. Supabase에 저장 (동기)
      const { data: inquiry, error: dbError } = await supabase
        .from('work_with_us_inquiries')
        .insert({
          name: data.name,
          email: data.email,
          company: data.company || null,
          package: data.package,
          budget: data.budget || null,
          brief: data.brief,
          status: 'pending',
        })
        .select()
        .single()

      if (dbError) {
        console.error('Supabase insert error:', dbError)
        throw new Error('문의 접수에 실패했습니다. 잠시 후 다시 시도해주세요.')
      }

      // 3. 이메일 발송 (비동기, 논블로킹) - Supabase Edge Function 호출
      // 이메일 발송 실패해도 사용자 경험 차단하지 않음
      supabase.functions
        .invoke('send-work-inquiry-email', {
          body: {
            name: data.name,
            email: data.email,
            company: data.company,
            package: data.package,
            budget: data.budget,
            brief: data.brief,
          },
        })
        .catch((error) => {
          console.error('Email send failed (non-blocking):', error)
          // 이메일 발송 실패는 로그만 남기고 사용자에게는 알리지 않음
        })

      return inquiry as WorkInquiry
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-inquiries'] })
      toast.success('문의가 접수되었습니다', {
        description: '빠른 시일 내에 연락드리겠습니다. 감사합니다!',
      })
    },
    onError: (error: Error) => {
      toast.error('문의 접수 실패', {
        description: error.message,
      })
    },
  })
}

/**
 * Work with Us 문의 목록 조회 (관리자용)
 */
export function useWorkInquiries(status?: string) {
  return useQuery({
    queryKey: ['work-inquiries', status],
    queryFn: async () => {
      let query = supabase
        .from('work_with_us_inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) throw error

      return data as WorkInquiry[]
    },
    staleTime: 2 * 60 * 1000, // 2분
  })
}

/**
 * Work with Us 문의 단일 조회 (관리자용)
 */
export function useWorkInquiry(id: string) {
  return useQuery({
    queryKey: ['work-inquiry', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_with_us_inquiries')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return data as WorkInquiry
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5분
  })
}

/**
 * Work with Us 문의 상태 업데이트 (관리자용)
 */
export function useUpdateWorkInquiryStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
      adminNotes,
    }: {
      id: string
      status: WorkInquiry['status']
      adminNotes?: string
    }) => {
      const updateData: Partial<WorkInquiry> = {
        status,
      }

      if (adminNotes !== undefined) {
        updateData.admin_notes = adminNotes
      }

      const { data, error } = await supabase
        .from('work_with_us_inquiries')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return data as WorkInquiry
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-inquiries'] })
      toast.success('문의 상태가 업데이트되었습니다')
    },
    onError: () => {
      toast.error('상태 업데이트 실패', {
        description: '잠시 후 다시 시도해주세요.',
      })
    },
  })
}

/**
 * Work with Us 문의 삭제 (관리자용)
 */
export function useDeleteWorkInquiry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('work_with_us_inquiries')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-inquiries'] })
      toast.success('문의가 삭제되었습니다')
    },
    onError: () => {
      toast.error('삭제 실패', {
        description: '잠시 후 다시 시도해주세요.',
      })
    },
  })
}

/**
 * Work with Us 통계 조회 (관리자용)
 */
export function useWorkInquiriesStats() {
  return useQuery({
    queryKey: ['work-inquiries-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_with_us_inquiries')
        .select('status, package')

      if (error) throw error

      // 상태별 카운트
      const statusStats = {
        total: data.length,
        pending: data.filter((i) => i.status === 'pending').length,
        contacted: data.filter((i) => i.status === 'contacted').length,
        in_progress: data.filter((i) => i.status === 'in_progress').length,
        completed: data.filter((i) => i.status === 'completed').length,
        rejected: data.filter((i) => i.status === 'rejected').length,
      }

      // 패키지별 카운트
      const packageStats = {
        MVP: data.filter((i) => i.package === 'MVP').length,
        Growth: data.filter((i) => i.package === 'Growth').length,
        Custom: data.filter((i) => i.package === 'Custom').length,
      }

      return {
        statusStats,
        packageStats,
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
  })
}
