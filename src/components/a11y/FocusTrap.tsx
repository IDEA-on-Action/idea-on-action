import { useRef, useEffect, type ReactNode, type KeyboardEvent } from 'react';

interface FocusTrapProps {
  children: ReactNode;
  /**
   * Whether the focus trap is active
   * @default true
   */
  active?: boolean;
  /**
   * Whether to auto-focus the first focusable element
   * @default true
   */
  autoFocus?: boolean;
  /**
   * Whether to restore focus to the previously focused element on unmount
   * @default true
   */
  restoreFocus?: boolean;
  /**
   * Callback when Escape key is pressed
   */
  onEscapeKey?: () => void;
  /**
   * Additional class name for the container
   */
  className?: string;
}

// Focusable element selectors
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

/**
 * FocusTrap Component
 *
 * WCAG 2.1 Guideline 2.1.2 - No Keyboard Trap (Exception for modals)
 * WCAG 2.1 Guideline 2.4.3 - Focus Order
 *
 * Traps keyboard focus within a container, commonly used for:
 * - Modal dialogs
 * - Dropdown menus
 * - Side sheets/drawers
 *
 * Features:
 * - Tab cycles through focusable elements within the trap
 * - Shift+Tab cycles backwards
 * - Escape key handler for closing
 * - Auto-focus first element on mount
 * - Restore focus on unmount
 *
 * @example
 * ```tsx
 * <FocusTrap
 *   active={isOpen}
 *   onEscapeKey={() => setIsOpen(false)}
 *   restoreFocus
 * >
 *   <Dialog>...</Dialog>
 * </FocusTrap>
 * ```
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html
 * @see https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html
 */
export function FocusTrap({
  children,
  active = true,
  autoFocus = true,
  restoreFocus = true,
  onEscapeKey,
  className
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Get all focusable elements within the container
  const getFocusableElements = (): HTMLElement[] => {
    if (!containerRef.current) return [];
    const elements = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    return Array.from(elements).filter(
      el => !el.hasAttribute('disabled') && el.tabIndex !== -1
    );
  };

  // Save the previously focused element and auto-focus
  useEffect(() => {
    if (!active) return;

    // Save the currently focused element
    if (restoreFocus) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }

    // Auto-focus the first focusable element
    if (autoFocus) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        // Small delay to ensure the container is fully rendered
        requestAnimationFrame(() => {
          focusableElements[0].focus();
        });
      }
    }

    // Restore focus on unmount
    return () => {
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [active, autoFocus, restoreFocus]);

  // Handle keyboard navigation
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!active) return;

    // Handle Escape key
    if (event.key === 'Escape' && onEscapeKey) {
      event.preventDefault();
      event.stopPropagation();
      onEscapeKey();
      return;
    }

    // Handle Tab key
    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      // Shift + Tab on first element -> focus last element
      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      // Tab on last element -> focus first element
      else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  if (!active) {
    return <>{children}</>;
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={className}
      role="presentation"
    >
      {children}
    </div>
  );
}
