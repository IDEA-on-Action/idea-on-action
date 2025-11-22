/**
 * CodeBlockExtension
 * CMS Phase 5: Rich Text Editor - Advanced Extensions
 *
 * Custom Tiptap code block extension with syntax highlighting,
 * language selection, line numbers, and copy button support
 */

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { mergeAttributes, Node } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { common, createLowlight } from 'lowlight'

// Additional language imports for extended highlighting
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'

// Create lowlight instance
const lowlight = createLowlight(common)

// Register additional languages
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('python', python)
lowlight.register('sql', sql)
lowlight.register('bash', bash)
lowlight.register('json', json)
lowlight.register('css', css)
lowlight.register('html', xml)

/**
 * Supported programming languages
 */
export const CODE_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash / Shell' },
  { value: 'json', label: 'JSON' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'plaintext', label: 'Plain Text' },
] as const

export type CodeLanguage = (typeof CODE_LANGUAGES)[number]['value']

/**
 * Code block extension options
 */
export interface CodeBlockExtensionOptions {
  /** Lowlight instance for syntax highlighting */
  lowlight: ReturnType<typeof createLowlight>
  /** Default language when none specified */
  defaultLanguage: string
  /** HTML attributes for code block */
  HTMLAttributes: Record<string, unknown>
  /** Show line numbers */
  showLineNumbers: boolean
  /** Show copy button */
  showCopyButton: boolean
  /** Maximum height before scrolling */
  maxHeight?: number
}

/**
 * Custom Code Block Extension
 *
 * Features:
 * - Syntax highlighting with lowlight
 * - Language selection dropdown
 * - Line numbers display
 * - Copy to clipboard button
 * - Auto-detect language (basic)
 */
export const CodeBlockExtension = CodeBlockLowlight.extend<CodeBlockExtensionOptions>({
  name: 'codeBlock',

  addOptions() {
    return {
      ...this.parent?.(),
      lowlight,
      defaultLanguage: 'plaintext',
      showLineNumbers: true,
      showCopyButton: true,
      maxHeight: 400,
      HTMLAttributes: {
        class: 'code-block-wrapper',
      },
    }
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      language: {
        default: this.options.defaultLanguage,
        parseHTML: (element) => {
          const codeEl = element.querySelector('code')
          const classAttr = codeEl?.getAttribute('class') || ''
          const match = classAttr.match(/language-(\w+)/)
          return match ? match[1] : this.options.defaultLanguage
        },
        renderHTML: (attributes) => {
          if (!attributes.language) return {}
          return {}
        },
      },
      lineNumbers: {
        default: true,
        parseHTML: (element) => element.getAttribute('data-line-numbers') === 'true',
        renderHTML: (attributes) => {
          return { 'data-line-numbers': String(attributes.lineNumbers) }
        },
      },
    }
  },

  renderHTML({ node, HTMLAttributes }) {
    const language = node.attrs.language || this.options.defaultLanguage
    const showLineNumbers = node.attrs.lineNumbers ?? this.options.showLineNumbers

    return [
      'pre',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-language': language,
        'data-line-numbers': String(showLineNumbers),
        class: [
          'code-block',
          'relative',
          'rounded-lg',
          'bg-muted',
          'p-4',
          'font-mono',
          'text-sm',
          'overflow-x-auto',
          showLineNumbers ? 'with-line-numbers' : '',
        ]
          .filter(Boolean)
          .join(' '),
        style: this.options.maxHeight
          ? `max-height: ${this.options.maxHeight}px; overflow-y: auto;`
          : undefined,
      }),
      [
        'code',
        {
          class: `language-${language} hljs`,
        },
        0,
      ],
    ]
  },

  addCommands() {
    return {
      ...this.parent?.(),
      /**
       * Set code block with language
       */
      setCodeBlock:
        (attributes?: { language?: string; lineNumbers?: boolean }) =>
        ({ commands }) => {
          return commands.setNode(this.name, {
            language: attributes?.language || this.options.defaultLanguage,
            lineNumbers: attributes?.lineNumbers ?? this.options.showLineNumbers,
          })
        },
      /**
       * Toggle code block
       */
      toggleCodeBlock:
        (attributes?: { language?: string }) =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', {
            language: attributes?.language || this.options.defaultLanguage,
          })
        },
      /**
       * Set code block language
       */
      setCodeBlockLanguage:
        (language: string) =>
        ({ tr, dispatch }) => {
          const { selection } = tr
          const node = tr.doc.nodeAt(selection.from)

          // Find code block node
          let codeBlockPos = selection.from
          let codeBlockNode = node

          // If we're inside the code block, find the parent
          if (node?.type.name !== this.name) {
            const $pos = tr.doc.resolve(selection.from)
            for (let d = $pos.depth; d > 0; d--) {
              const ancestor = $pos.node(d)
              if (ancestor.type.name === this.name) {
                codeBlockNode = ancestor
                codeBlockPos = $pos.before(d)
                break
              }
            }
          }

          if (codeBlockNode?.type.name !== this.name) {
            return false
          }

          if (dispatch) {
            tr.setNodeMarkup(codeBlockPos, undefined, {
              ...codeBlockNode.attrs,
              language,
            })
          }

          return true
        },
      /**
       * Toggle line numbers
       */
      toggleLineNumbers:
        () =>
        ({ tr, dispatch }) => {
          const { selection } = tr
          const node = tr.doc.nodeAt(selection.from)

          let codeBlockPos = selection.from
          let codeBlockNode = node

          if (node?.type.name !== this.name) {
            const $pos = tr.doc.resolve(selection.from)
            for (let d = $pos.depth; d > 0; d--) {
              const ancestor = $pos.node(d)
              if (ancestor.type.name === this.name) {
                codeBlockNode = ancestor
                codeBlockPos = $pos.before(d)
                break
              }
            }
          }

          if (codeBlockNode?.type.name !== this.name) {
            return false
          }

          if (dispatch) {
            tr.setNodeMarkup(codeBlockPos, undefined, {
              ...codeBlockNode.attrs,
              lineNumbers: !codeBlockNode.attrs.lineNumbers,
            })
          }

          return true
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      // Triple backtick to create code block
      '```': () => this.editor.commands.toggleCodeBlock(),
      // Tab for indentation inside code block
      Tab: ({ editor }) => {
        if (editor.isActive('codeBlock')) {
          editor.commands.insertContent('  ')
          return true
        }
        return false
      },
    }
  },

  addProseMirrorPlugins() {
    const parentPlugins = this.parent?.() || []

    // Add plugin for detecting language from content
    const languageDetectionPlugin = new Plugin({
      key: new PluginKey('codeBlockLanguageDetection'),
      props: {
        // Could add paste handling here for auto-detection
      },
    })

    return [...parentPlugins, languageDetectionPlugin]
  },
})

/**
 * Detect language from code content (basic heuristics)
 */
export function detectLanguage(code: string): CodeLanguage {
  const trimmed = code.trim()

  // TypeScript/JavaScript
  if (
    /^(import|export|const|let|var|function|class|interface|type)\s/.test(trimmed) ||
    /=>\s*\{/.test(trimmed)
  ) {
    return trimmed.includes('interface ') || trimmed.includes('type ') || trimmed.includes(': ')
      ? 'typescript'
      : 'javascript'
  }

  // Python
  if (
    /^(def|class|import|from|if __name__|print\(|async def)\s/.test(trimmed) ||
    /:\s*$/.test(trimmed.split('\n')[0])
  ) {
    return 'python'
  }

  // SQL
  if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH)\s/i.test(trimmed)) {
    return 'sql'
  }

  // Bash
  if (/^(#!\/bin\/(ba)?sh|npm|yarn|pnpm|git|cd|ls|mkdir|echo)\s/.test(trimmed)) {
    return 'bash'
  }

  // JSON
  if (/^\s*[[{]/.test(trimmed) && /[}\]]\s*$/.test(trimmed)) {
    try {
      JSON.parse(trimmed)
      return 'json'
    } catch {
      // Not valid JSON
    }
  }

  // HTML
  if (/^<(!DOCTYPE|html|head|body|div|span|p|a|img|script|style)/i.test(trimmed)) {
    return 'html'
  }

  // CSS
  if (
    /^(@import|@media|@keyframes|[.#]?\w+\s*\{)/i.test(trimmed) ||
    /:\s*(#[0-9a-f]+|rgba?\(|\d+px)/i.test(trimmed)
  ) {
    return 'css'
  }

  return 'plaintext'
}

/**
 * Get code content from node for copying
 */
export function getCodeContent(node: Node): string {
  return node.textContent || ''
}

/**
 * Copy code to clipboard
 */
export async function copyCodeToClipboard(code: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(code)
    return true
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = code
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  }
}

export { lowlight }
export default CodeBlockExtension
