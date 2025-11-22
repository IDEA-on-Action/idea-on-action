/**
 * MarkdownExtension
 * CMS Phase 5: Rich Text Editor - Advanced Extensions
 *
 * Custom Tiptap extension for markdown shortcuts and input rules
 */

import { Extension, InputRule } from '@tiptap/core'

/**
 * Markdown shortcut input rules
 */
const MARKDOWN_INPUT_RULES = {
  // Headings
  h1: /^#\s$/,
  h2: /^##\s$/,
  h3: /^###\s$/,
  h4: /^####\s$/,
  h5: /^#####\s$/,
  h6: /^######\s$/,

  // Lists
  bulletList: /^[-*+]\s$/,
  orderedList: /^\d+\.\s$/,

  // Blockquote
  blockquote: /^>\s$/,

  // Code block
  codeBlock: /^```(\w+)?\s$/,

  // Horizontal rule
  horizontalRule: /^(---|\*\*\*|___)\s$/,

  // Task list item (checkbox)
  taskList: /^\[[ x]\]\s$/,
}

/**
 * Extension options
 */
export interface MarkdownExtensionOptions {
  /** Enable heading shortcuts */
  enableHeadingShortcuts: boolean
  /** Enable list shortcuts */
  enableListShortcuts: boolean
  /** Enable blockquote shortcut */
  enableBlockquoteShortcut: boolean
  /** Enable code block shortcut */
  enableCodeBlockShortcut: boolean
  /** Enable horizontal rule shortcut */
  enableHorizontalRuleShortcut: boolean
  /** Maximum heading level */
  maxHeadingLevel: 1 | 2 | 3 | 4 | 5 | 6
}

/**
 * Markdown Extension
 *
 * Features:
 * - Markdown shortcuts for headings (# ## ###)
 * - Markdown shortcuts for lists (- * +, 1.)
 * - Blockquote shortcut (>)
 * - Code block shortcut (```)
 * - Horizontal rule shortcut (---, ***, ___)
 */
export const MarkdownExtension = Extension.create<MarkdownExtensionOptions>({
  name: 'markdown',

  addOptions() {
    return {
      enableHeadingShortcuts: true,
      enableListShortcuts: true,
      enableBlockquoteShortcut: true,
      enableCodeBlockShortcut: true,
      enableHorizontalRuleShortcut: true,
      maxHeadingLevel: 3,
    }
  },

  addInputRules() {
    const rules: InputRule[] = []

    // Heading input rules
    if (this.options.enableHeadingShortcuts) {
      const headingLevels = [1, 2, 3, 4, 5, 6].filter(
        (level) => level <= this.options.maxHeadingLevel
      )

      headingLevels.forEach((level) => {
        const pattern = new RegExp(`^${'#'.repeat(level)}\\s$`)
        rules.push(
          new InputRule({
            find: pattern,
            handler: ({ state, range }) => {
              const { tr } = state
              const start = range.from
              const end = range.to

              tr.delete(start, end)

              // Check if heading type exists
              const headingType = state.schema.nodes.heading
              if (headingType) {
                tr.setBlockType(start, start, headingType, { level })
              }
            },
          })
        )
      })
    }

    // Bullet list input rule
    if (this.options.enableListShortcuts) {
      rules.push(
        new InputRule({
          find: MARKDOWN_INPUT_RULES.bulletList,
          handler: ({ state, range, chain }) => {
            const { tr } = state
            const bulletListType = state.schema.nodes.bulletList
            const listItemType = state.schema.nodes.listItem

            if (bulletListType && listItemType) {
              tr.delete(range.from, range.to)
              chain().toggleBulletList().run()
            }
          },
        })
      )

      // Ordered list input rule
      rules.push(
        new InputRule({
          find: MARKDOWN_INPUT_RULES.orderedList,
          handler: ({ state, range, chain }) => {
            const { tr } = state
            const orderedListType = state.schema.nodes.orderedList

            if (orderedListType) {
              tr.delete(range.from, range.to)
              chain().toggleOrderedList().run()
            }
          },
        })
      )
    }

    // Blockquote input rule
    if (this.options.enableBlockquoteShortcut) {
      rules.push(
        new InputRule({
          find: MARKDOWN_INPUT_RULES.blockquote,
          handler: ({ state, range, chain }) => {
            const { tr } = state
            const blockquoteType = state.schema.nodes.blockquote

            if (blockquoteType) {
              tr.delete(range.from, range.to)
              chain().toggleBlockquote().run()
            }
          },
        })
      )
    }

    // Code block input rule
    if (this.options.enableCodeBlockShortcut) {
      rules.push(
        new InputRule({
          find: /^```(\w*)[\s\n]$/,
          handler: ({ state, range, match, chain }) => {
            const { tr } = state
            const codeBlockType = state.schema.nodes.codeBlock
            const language = match[1] || 'plaintext'

            if (codeBlockType) {
              tr.delete(range.from, range.to)
              chain()
                .setCodeBlock({ language })
                .run()
            }
          },
        })
      )
    }

    // Horizontal rule input rule
    if (this.options.enableHorizontalRuleShortcut) {
      rules.push(
        new InputRule({
          find: MARKDOWN_INPUT_RULES.horizontalRule,
          handler: ({ state, range, chain }) => {
            const { tr } = state
            const hrType = state.schema.nodes.horizontalRule

            if (hrType) {
              tr.delete(range.from, range.to)
              chain().setHorizontalRule().run()
            }
          },
        })
      )
    }

    return rules
  },

  addKeyboardShortcuts() {
    return {
      // Bold: Ctrl+B (handled by starter kit, but we ensure it works)
      'Mod-b': () => this.editor.commands.toggleBold(),

      // Italic: Ctrl+I
      'Mod-i': () => this.editor.commands.toggleItalic(),

      // Strikethrough: Ctrl+Shift+S
      'Mod-Shift-s': () => this.editor.commands.toggleStrike(),

      // Code: Ctrl+E or Ctrl+`
      'Mod-e': () => this.editor.commands.toggleCode(),
      'Mod-`': () => this.editor.commands.toggleCode(),

      // Link: Ctrl+K (opens link dialog via editor event)
      'Mod-k': () => {
        // Dispatch event for toolbar to open link dialog
        this.editor.commands.focus()
        // This will be handled by the toolbar component
        return true
      },

      // Heading 1: Ctrl+Alt+1
      'Mod-Alt-1': () => this.editor.commands.toggleHeading({ level: 1 }),

      // Heading 2: Ctrl+Alt+2
      'Mod-Alt-2': () => this.editor.commands.toggleHeading({ level: 2 }),

      // Heading 3: Ctrl+Alt+3
      'Mod-Alt-3': () => this.editor.commands.toggleHeading({ level: 3 }),

      // Bullet list: Ctrl+Shift+8
      'Mod-Shift-8': () => this.editor.commands.toggleBulletList(),

      // Ordered list: Ctrl+Shift+7
      'Mod-Shift-7': () => this.editor.commands.toggleOrderedList(),

      // Blockquote: Ctrl+Shift+B
      'Mod-Shift-b': () => this.editor.commands.toggleBlockquote(),

      // Code block: Ctrl+Alt+C
      'Mod-Alt-c': () => this.editor.commands.toggleCodeBlock(),

      // Clear formatting: Ctrl+\
      'Mod-\\': () => this.editor.commands.unsetAllMarks(),
    }
  },
})

/**
 * Convert HTML to Markdown (basic implementation)
 * For full conversion, use the markdown-utils in lib/editor
 */
export function htmlToBasicMarkdown(html: string): string {
  return html
    .replace(/<p>/gi, '')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<strong[^>]*>/gi, '**')
    .replace(/<\/strong>/gi, '**')
    .replace(/<em[^>]*>/gi, '*')
    .replace(/<\/em>/gi, '*')
    .replace(/<code[^>]*>/gi, '`')
    .replace(/<\/code>/gi, '`')
    .replace(/<h1[^>]*>/gi, '# ')
    .replace(/<\/h1>/gi, '\n')
    .replace(/<h2[^>]*>/gi, '## ')
    .replace(/<\/h2>/gi, '\n')
    .replace(/<h3[^>]*>/gi, '### ')
    .replace(/<\/h3>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Convert Markdown to HTML (basic implementation)
 * For full conversion, use the markdown-utils in lib/editor
 */
export function basicMarkdownToHtml(markdown: string): string {
  return markdown
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^[-*+] (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (match) => {
      if (
        match.startsWith('<h') ||
        match.startsWith('<li') ||
        match.startsWith('<p') ||
        match.startsWith('</p')
      ) {
        return match
      }
      return `<p>${match}</p>`
    })
}

export default MarkdownExtension
