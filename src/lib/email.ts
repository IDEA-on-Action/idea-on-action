/**
 * Email Service using Resend
 *
 * 이메일 전송 라이브러리
 * - Resend API 통합
 * - 이메일 템플릿 렌더링
 * - 타입 안전 이메일 전송
 */

import { Resend } from 'resend'
import type { ReactElement } from 'react'

// Resend 클라이언트 초기화
export const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY)

// 발신자 이메일
export const FROM_EMAIL = import.meta.env.VITE_RESEND_FROM_EMAIL || 'noreply@ideaonaction.ai'

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  react: ReactElement
}

export interface SendEmailResult {
  success: boolean
  data?: any
  error?: any
}

/**
 * 이메일 전송
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<SendEmailResult> {
  try {
    // API 키 체크
    if (!import.meta.env.VITE_RESEND_API_KEY) {
      console.warn('VITE_RESEND_API_KEY is not set')
      return {
        success: false,
        error: 'Email API key is not configured',
      }
    }

    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      react: options.react,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

/**
 * 주문 확인 이메일 전송
 */
export async function sendOrderConfirmationEmail(order: {
  id: string
  user_email: string
  total_amount: number
  items: Array<{ title: string; quantity: number; price: number }>
}): Promise<SendEmailResult> {
  // 이메일 템플릿은 나중에 구현 (현재는 간단한 텍스트)
  return sendEmail({
    to: order.user_email,
    subject: `주문 확인 - ${order.id}`,
    react: {
      type: 'div',
      props: {
        children: `주문이 완료되었습니다. 주문번호: ${order.id}`,
      },
    } as any,
  })
}

/**
 * 비밀번호 재설정 이메일 전송
 */
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
): Promise<SendEmailResult> {
  return sendEmail({
    to: email,
    subject: '비밀번호 재설정',
    react: {
      type: 'div',
      props: {
        children: `비밀번호 재설정 링크: ${resetLink}`,
      },
    } as any,
  })
}

/**
 * 공지사항 이메일 전송
 */
export async function sendAnnouncementEmail(
  users: string[],
  announcement: {
    title: string
    content: string
  }
): Promise<SendEmailResult> {
  return sendEmail({
    to: users,
    subject: announcement.title,
    react: {
      type: 'div',
      props: {
        children: announcement.content,
      },
    } as any,
  })
}
