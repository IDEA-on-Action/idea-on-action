/**
 * ChatWidget Component
 *
 * 플로팅 채팅 버튼
 * - 우하단 고정
 * - 클릭 시 ChatWindow 토글
 * - 펄스 애니메이션
 */

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ChatWindow } from './ChatWindow'

export function ChatWidget() {
  const { t } = useTranslation('common')
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 채팅 창 */}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}

      {/* 플로팅 버튼 */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="fixed bottom-4 right-4 z-40 h-14 w-14 rounded-full bg-gradient-primary hover:opacity-90 shadow-xl transition-all duration-300 hover:scale-110"
        aria-label={
          isOpen
            ? t('chat.close') || '채팅 닫기'
            : t('chat.open') || '채팅 열기'
        }
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6 text-white" />
            {/* 펄스 애니메이션 */}
            <span className="absolute inset-0 rounded-full bg-gradient-primary animate-ping opacity-75" />
          </>
        )}
      </Button>
    </>
  )
}
