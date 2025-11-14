/**
 * Vercel Cron Job: Weekly Recap Generation
 *
 * 매주 일요일 15:00 UTC (월요일 00:00 KST)에 실행
 *
 * Vercel Dashboard > Settings > Cron Jobs에서 설정:
 * - Path: /api/cron/weekly-recap
 * - Schedule: 0 15 * * 0
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Vercel Cron Secret 검증 (보안)
  const authHeader = req.headers.authorization
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Supabase Edge Function 호출
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase credentials')
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/weekly-recap`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate Weekly Recap')
    }

    return res.status(200).json({
      success: true,
      message: 'Weekly Recap generated',
      data,
    })
  } catch (error) {
    console.error('Weekly Recap generation failed:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
