import { cn } from '@/lib/utils';

type AriaLive = 'polite' | 'assertive' | 'off';

interface LiveRegionProps {
  children: React.ReactNode;
  /**
   * The politeness level for the live region
   * - 'off': Updates are not announced
   * - 'polite': Updates announced after current speech finishes (default)
   * - 'assertive': Updates interrupt current speech
   * @default 'polite'
   */
  'aria-live'?: AriaLive;
  /**
   * Whether the entire region should be announced on change
   * @default true
   */
  'aria-atomic'?: boolean;
  /**
   * The role of the live region
   * - 'status': For advisory information (aria-live="polite")
   * - 'alert': For important, time-sensitive info (aria-live="assertive")
   * - 'log': For sequential info like chat logs
   * - 'timer': For time-related info
   * - 'marquee': For non-essential, frequently changing info
   */
  role?: 'status' | 'alert' | 'log' | 'timer' | 'marquee';
  /**
   * Whether the content should be visually hidden (screen reader only)
   * @default false
   */
  visuallyHidden?: boolean;
  className?: string;
}

/**
 * LiveRegion Component
 *
 * WCAG 2.1 Guideline 4.1.3 - Status Messages
 * Creates an ARIA live region that announces content changes to screen readers.
 *
 * Use cases:
 * - Loading indicators
 * - Search results count
 * - Form validation messages
 * - Progress updates
 * - Cart item count
 *
 * @example
 * ```tsx
 * // Status message (polite)
 * <LiveRegion role="status">
 *   {isLoading ? '로딩 중...' : `${results.length}개의 결과가 있습니다`}
 * </LiveRegion>
 *
 * // Alert message (assertive)
 * <LiveRegion role="alert" aria-live="assertive">
 *   {error && `오류: ${error.message}`}
 * </LiveRegion>
 *
 * // Screen reader only
 * <LiveRegion visuallyHidden role="status">
 *   {cartCount}개의 상품이 장바구니에 있습니다
 * </LiveRegion>
 * ```
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
 */
export function LiveRegion({
  children,
  'aria-live': ariaLive = 'polite',
  'aria-atomic': ariaAtomic = true,
  role = 'status',
  visuallyHidden = false,
  className
}: LiveRegionProps) {
  return (
    <div
      role={role}
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      className={cn(
        visuallyHidden && 'sr-only',
        className
      )}
    >
      {children}
    </div>
  );
}
