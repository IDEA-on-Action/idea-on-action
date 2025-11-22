/**
 * Editor Extensions Index
 * CMS Phase 5: Rich Text Editor - Advanced Extensions
 *
 * Export all custom Tiptap extensions for easy imports
 */

// Image Extension
export { ImageExtension } from './ImageExtension'
export type {
  ImageAlignment,
  CustomImageAttributes,
  ImageExtensionOptions,
} from './ImageExtension'

// Code Block Extension
export {
  CodeBlockExtension,
  CODE_LANGUAGES,
  detectLanguage,
  getCodeContent,
  copyCodeToClipboard,
  lowlight,
} from './CodeBlockExtension'
export type {
  CodeLanguage,
  CodeBlockExtensionOptions,
} from './CodeBlockExtension'

// Markdown Extension
export { MarkdownExtension, htmlToBasicMarkdown, basicMarkdownToHtml } from './MarkdownExtension'
export type { MarkdownExtensionOptions } from './MarkdownExtension'

// Link Extension
export {
  LinkExtension,
  isValidUrl,
  sanitizeUrl,
  getDisplayTextFromUrl,
  hasLinkMark,
  getLinkAttributes,
} from './LinkExtension'
export type {
  LinkTarget,
  LinkAttributes,
  LinkExtensionOptions,
} from './LinkExtension'
