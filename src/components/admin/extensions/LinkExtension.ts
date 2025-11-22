/**
 * LinkExtension
 * CMS Phase 5: Rich Text Editor - Advanced Extensions
 *
 * Enhanced Tiptap link extension with improved UX,
 * popup editing, and security features
 */

import Link from '@tiptap/extension-link'
import { mergeAttributes } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * Link target options
 */
export type LinkTarget = '_blank' | '_self' | '_parent' | '_top'

/**
 * Link data structure
 */
export interface LinkAttributes {
  href: string
  target?: LinkTarget
  rel?: string
  class?: string
  title?: string
}

/**
 * Extension options
 */
export interface LinkExtensionOptions {
  /** Open links on click (in edit mode) */
  openOnClick: boolean
  /** Auto-detect and convert URLs */
  autolink: boolean
  /** Default protocol for URLs without one */
  defaultProtocol: 'http' | 'https'
  /** Open links in new tab by default */
  openInNewTab: boolean
  /** HTML attributes for links */
  HTMLAttributes: Record<string, unknown>
  /** Validate URLs before setting */
  validate: (url: string) => boolean
  /** List of allowed protocols */
  allowedProtocols: string[]
  /** Show link preview on hover */
  showLinkPreview: boolean
}

/**
 * URL validation patterns
 */
const URL_PATTERNS = {
  absolute: /^(https?:\/\/|mailto:|tel:|#)/i,
  relative: /^\/[^/]/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[\d\s\-().]+$/,
}

/**
 * Validate URL safety
 */
export function isValidUrl(url: string, allowedProtocols: string[] = ['https', 'http', 'mailto', 'tel']): boolean {
  if (!url || typeof url !== 'string') return false

  const trimmed = url.trim()

  // Check for javascript: protocol (XSS prevention)
  if (/^javascript:/i.test(trimmed)) {
    return false
  }

  // Check for data: protocol (potential security risk)
  if (/^data:/i.test(trimmed)) {
    return false
  }

  // Allow relative URLs
  if (URL_PATTERNS.relative.test(trimmed)) {
    return true
  }

  // Allow anchor links
  if (trimmed.startsWith('#')) {
    return true
  }

  // Check allowed protocols
  const protocolMatch = trimmed.match(/^(\w+):/i)
  if (protocolMatch) {
    const protocol = protocolMatch[1].toLowerCase()
    return allowedProtocols.includes(protocol)
  }

  // URL without protocol - will be prefixed with defaultProtocol
  return true
}

/**
 * Sanitize URL for safety
 */
export function sanitizeUrl(url: string, defaultProtocol: string = 'https'): string {
  if (!url) return ''

  const trimmed = url.trim()

  // Handle email addresses
  if (URL_PATTERNS.email.test(trimmed) && !trimmed.startsWith('mailto:')) {
    return `mailto:${trimmed}`
  }

  // Handle phone numbers
  if (URL_PATTERNS.phone.test(trimmed) && !trimmed.startsWith('tel:')) {
    const cleanPhone = trimmed.replace(/[\s\-().]/g, '')
    return `tel:${cleanPhone}`
  }

  // Handle relative URLs
  if (URL_PATTERNS.relative.test(trimmed) || trimmed.startsWith('#')) {
    return trimmed
  }

  // Add protocol if missing
  if (!URL_PATTERNS.absolute.test(trimmed)) {
    return `${defaultProtocol}://${trimmed}`
  }

  return trimmed
}

/**
 * Extract display text from URL
 */
export function getDisplayTextFromUrl(url: string): string {
  try {
    // Handle mailto links
    if (url.startsWith('mailto:')) {
      return url.replace('mailto:', '')
    }

    // Handle tel links
    if (url.startsWith('tel:')) {
      return url.replace('tel:', '')
    }

    // Handle regular URLs
    const urlObj = new URL(url)
    return urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '')
  } catch {
    return url
  }
}

/**
 * Link Extension
 *
 * Features:
 * - Enhanced URL validation
 * - Auto-prefixing protocols
 * - Security hardened (noopener noreferrer)
 * - Email and phone link support
 * - Link preview support (via plugin)
 * - Custom keyboard shortcuts
 */
export const LinkExtension = Link.extend<LinkExtensionOptions>({
  name: 'link',

  addOptions() {
    return {
      ...this.parent?.(),
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      openInNewTab: true,
      showLinkPreview: true,
      allowedProtocols: ['https', 'http', 'mailto', 'tel'],
      validate: (url: string) => isValidUrl(url, ['https', 'http', 'mailto', 'tel']),
      HTMLAttributes: {
        class: 'text-primary underline cursor-pointer hover:text-primary/80 transition-colors',
      },
    }
  },

  addAttributes() {
    return {
      href: {
        default: null,
        parseHTML: (element) => element.getAttribute('href'),
        renderHTML: (attributes) => {
          if (!attributes.href) return {}
          const sanitized = sanitizeUrl(attributes.href, this.options.defaultProtocol)
          return { href: sanitized }
        },
      },
      target: {
        default: this.options.openInNewTab ? '_blank' : null,
        parseHTML: (element) => element.getAttribute('target'),
        renderHTML: (attributes) => {
          if (!attributes.target) return {}
          return { target: attributes.target }
        },
      },
      rel: {
        default: 'noopener noreferrer',
        parseHTML: (element) => element.getAttribute('rel'),
        renderHTML: (attributes) => {
          // Always add security attributes for external links
          if (attributes.target === '_blank') {
            return { rel: 'noopener noreferrer' }
          }
          return attributes.rel ? { rel: attributes.rel } : {}
        },
      },
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute('class'),
        renderHTML: (attributes) => {
          if (!attributes.class) return {}
          return { class: attributes.class }
        },
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute('title'),
        renderHTML: (attributes) => {
          if (!attributes.title) return {}
          return { title: attributes.title }
        },
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ]
  },

  addCommands() {
    return {
      ...this.parent?.(),
      /**
       * Set link with validation
       */
      setLink:
        (attributes: LinkAttributes) =>
        ({ chain }) => {
          const { href, target, title } = attributes

          // Validate URL
          if (!this.options.validate(href)) {
            console.warn('Invalid URL:', href)
            return false
          }

          const sanitized = sanitizeUrl(href, this.options.defaultProtocol)

          return chain()
            .setMark(this.name, {
              href: sanitized,
              target: target ?? (this.options.openInNewTab ? '_blank' : null),
              title,
            })
            .run()
        },
      /**
       * Update existing link
       */
      updateLink:
        (attributes: Partial<LinkAttributes>) =>
        ({ tr, dispatch }) => {
          const { selection } = tr

          if (dispatch) {
            const { from, to } = selection
            const linkMark = this.type

            tr.doc.nodesBetween(from, to, (node, pos) => {
              const existingMark = node.marks.find((m) => m.type === linkMark)
              if (existingMark) {
                const newAttrs = { ...existingMark.attrs, ...attributes }
                if (attributes.href) {
                  newAttrs.href = sanitizeUrl(attributes.href, this.options.defaultProtocol)
                }
                tr.removeMark(pos, pos + node.nodeSize, linkMark)
                tr.addMark(pos, pos + node.nodeSize, linkMark.create(newAttrs))
              }
            })
          }

          return true
        },
      /**
       * Toggle link (remove if exists, add if not)
       */
      toggleLink:
        (attributes: LinkAttributes) =>
        ({ chain }) => {
          const isActive = this.editor.isActive(this.name)

          if (isActive) {
            return chain().unsetLink().run()
          }

          return chain()
            .setLink(attributes)
            .run()
        },
      /**
       * Open link in current selection
       */
      openLink:
        () =>
        ({ editor }) => {
          const { href } = editor.getAttributes(this.name)
          if (href) {
            window.open(href, '_blank', 'noopener,noreferrer')
          }
          return true
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      // Ctrl+K to open link dialog (handled by toolbar)
      'Mod-k': () => {
        // This is a signal for the toolbar to open the link dialog
        // The actual dialog opening is handled in the toolbar component
        return true
      },
    }
  },

  addProseMirrorPlugins() {
    const parentPlugins = this.parent?.() || []

    // Link click handler plugin
    const clickPlugin = new Plugin({
      key: new PluginKey('linkClick'),
      props: {
        handleClick: (view, pos, event) => {
          if (!this.options.openOnClick) return false

          const { state } = view
          const $pos = state.doc.resolve(pos)

          // Check if clicked on a link
          const marks = $pos.marks()
          const linkMark = marks.find((m) => m.type.name === this.name)

          if (linkMark && event.target instanceof HTMLAnchorElement) {
            event.preventDefault()
            const href = linkMark.attrs.href

            if (href) {
              // Open in new tab for safety
              window.open(href, '_blank', 'noopener,noreferrer')
              return true
            }
          }

          return false
        },
        handleDOMEvents: {
          // Prevent default link behavior in edit mode
          click: (view, event) => {
            if (event.target instanceof HTMLAnchorElement) {
              event.preventDefault()
            }
            return false
          },
        },
      },
    })

    return [...parentPlugins, clickPlugin]
  },
})

/**
 * Check if selection has link mark
 */
export function hasLinkMark(editor: ReturnType<typeof Link.create>['editor']): boolean {
  return editor?.isActive('link') ?? false
}

/**
 * Get link attributes from current selection
 */
export function getLinkAttributes(
  editor: ReturnType<typeof Link.create>['editor']
): LinkAttributes | null {
  if (!hasLinkMark(editor)) return null
  return editor?.getAttributes('link') as LinkAttributes
}

export default LinkExtension
