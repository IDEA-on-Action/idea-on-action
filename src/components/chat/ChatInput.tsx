/**
 * ChatInput Component
 *
 * 채팅 입력 폼
 * - textarea (자동 높이 조절)
 * - 전송 버튼
 * - Enter 키 전송 (Shift+Enter는 줄바꿈)
 */

import { useState, useRef, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useTranslation } from 'react-i18next'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const { t } = useTranslation('common')
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (!input.trim() || disabled) return

    onSend(input.trim())
    setInput('')

    // textarea 높이 초기화
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter 키로 전송 (Shift+Enter는 줄바꿈)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-border p-4">
      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chat.placeholder') || '메시지를 입력하세요...'}
          className="min-h-[60px] max-h-[120px] resize-none"
          disabled={disabled}
          rows={2}
        />
        <Button
          onClick={handleSubmit}
          disabled={!input.trim() || disabled}
          size="icon"
          className="bg-gradient-primary hover:opacity-90 self-end"
          aria-label={t('chat.send') || '전송'}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {t('chat.hint') || 'Enter로 전송, Shift+Enter로 줄바꿈'}
      </p>
    </div>
  )
}
