/**
 * Phase 14: 날짜 범위 선택 컴포넌트
 * 분석 대시보드용 날짜 필터
 */

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface DateRange {
  start: Date
  end: Date
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  // 프리셋 날짜 범위
  const presets = [
    {
      label: '오늘',
      getValue: () => ({
        start: new Date(new Date().setHours(0, 0, 0, 0)),
        end: new Date(),
      }),
    },
    {
      label: '어제',
      getValue: () => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        return {
          start: new Date(yesterday.setHours(0, 0, 0, 0)),
          end: new Date(yesterday.setHours(23, 59, 59, 999)),
        }
      },
    },
    {
      label: '최근 7일',
      getValue: () => ({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(),
      }),
    },
    {
      label: '최근 30일',
      getValue: () => ({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      }),
    },
    {
      label: '최근 90일',
      getValue: () => ({
        start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        end: new Date(),
      }),
    },
    {
      label: '이번 달',
      getValue: () => {
        const now = new Date()
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: new Date(),
        }
      },
    },
    {
      label: '지난 달',
      getValue: () => {
        const now = new Date()
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
        return {
          start: lastMonth,
          end: lastDayOfLastMonth,
        }
      },
    },
  ]

  const handlePresetClick = (preset: typeof presets[0]) => {
    const newRange = preset.getValue()
    onChange(newRange)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {value?.start && value?.end ? (
            <>
              {format(value.start, 'yyyy년 M월 d일', { locale: ko })} -{' '}
              {format(value.end, 'yyyy년 M월 d일', { locale: ko })}
            </>
          ) : (
            <span>날짜 범위 선택</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex">
          {/* 프리셋 목록 */}
          <div className="border-r p-3 space-y-1">
            <p className="text-sm font-semibold mb-2">빠른 선택</p>
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => handlePresetClick(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* 커스텀 날짜 선택 */}
          <div className="p-3 space-y-3">
            <div>
              <p className="text-sm font-semibold mb-2">시작일</p>
              <CalendarComponent
                mode="single"
                selected={value.start}
                onSelect={(date) => date && onChange({ ...value, start: date })}
                locale={ko}
              />
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">종료일</p>
              <CalendarComponent
                mode="single"
                selected={value.end}
                onSelect={(date) => date && onChange({ ...value, end: date })}
                locale={ko}
                disabled={(date) => date < value.start}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
