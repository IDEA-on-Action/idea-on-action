/**
 * ImageExtension
 * CMS Phase 5: Rich Text Editor - Advanced Extensions
 *
 * Custom Tiptap image extension with resize, alignment, and drag-drop support
 */

import Image from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'

/**
 * Image alignment options
 */
export type ImageAlignment = 'left' | 'center' | 'right'

/**
 * Extended image attributes
 */
export interface CustomImageAttributes {
  src: string
  alt?: string
  title?: string
  width?: number | string
  height?: number | string
  alignment?: ImageAlignment
  'data-file-id'?: string // MediaGallery reference
}

/**
 * Image extension options
 */
export interface ImageExtensionOptions {
  /** Enable inline images */
  inline: boolean
  /** Allow base64 encoded images */
  allowBase64: boolean
  /** HTML attributes to add to all images */
  HTMLAttributes: Record<string, unknown>
  /** Max width for resized images */
  maxWidth?: number
  /** Min width for resized images */
  minWidth?: number
  /** Default alignment */
  defaultAlignment?: ImageAlignment
}

/**
 * Custom Image Extension
 *
 * Features:
 * - Image resizing
 * - Alignment options (left, center, right)
 * - Alt text editing
 * - MediaGallery integration via data-file-id
 * - Drag and drop upload support (via editor events)
 * - Clipboard paste support (via editor events)
 */
export const ImageExtension = Image.extend<ImageExtensionOptions>({
  name: 'image',

  addOptions() {
    return {
      ...this.parent?.(),
      inline: false,
      allowBase64: false,
      maxWidth: 800,
      minWidth: 100,
      defaultAlignment: 'center' as ImageAlignment,
      HTMLAttributes: {
        class: 'editor-image',
      },
    }
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute('width'),
        renderHTML: (attributes) => {
          if (!attributes.width) return {}
          return { width: attributes.width }
        },
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute('height'),
        renderHTML: (attributes) => {
          if (!attributes.height) return {}
          return { height: attributes.height }
        },
      },
      alignment: {
        default: 'center',
        parseHTML: (element) => {
          const style = element.getAttribute('style') || ''
          if (style.includes('float: left')) return 'left'
          if (style.includes('float: right')) return 'right'
          return 'center'
        },
        renderHTML: (attributes) => {
          const alignment = attributes.alignment || 'center'
          const styles: Record<ImageAlignment, string> = {
            left: 'float: left; margin-right: 1rem; margin-bottom: 0.5rem;',
            center: 'display: block; margin-left: auto; margin-right: auto;',
            right: 'float: right; margin-left: 1rem; margin-bottom: 0.5rem;',
          }
          return { style: styles[alignment as ImageAlignment] }
        },
      },
      'data-file-id': {
        default: null,
        parseHTML: (element) => element.getAttribute('data-file-id'),
        renderHTML: (attributes) => {
          if (!attributes['data-file-id']) return {}
          return { 'data-file-id': attributes['data-file-id'] }
        },
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    const { class: className, ...rest } = this.options.HTMLAttributes

    // Combine alignment styles with base classes
    const alignment = HTMLAttributes.alignment || this.options.defaultAlignment
    const alignmentClasses: Record<ImageAlignment, string> = {
      left: 'float-left mr-4 mb-2',
      center: 'mx-auto block',
      right: 'float-right ml-4 mb-2',
    }

    const combinedClass = [
      'rounded-lg max-w-full h-auto',
      className,
      alignmentClasses[alignment as ImageAlignment] || alignmentClasses.center,
    ]
      .filter(Boolean)
      .join(' ')

    return [
      'img',
      mergeAttributes(rest, HTMLAttributes, {
        class: combinedClass,
        loading: 'lazy',
        decoding: 'async',
      }),
    ]
  },

  addCommands() {
    return {
      ...this.parent?.(),
      /**
       * Set image with custom attributes
       */
      setImage:
        (options: CustomImageAttributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
      /**
       * Update image attributes
       */
      updateImage:
        (options: Partial<CustomImageAttributes>) =>
        ({ tr, dispatch }) => {
          const { selection } = tr
          const node = tr.doc.nodeAt(selection.from)

          if (node?.type.name !== this.name) {
            return false
          }

          if (dispatch) {
            const attrs = { ...node.attrs, ...options }
            tr.setNodeMarkup(selection.from, undefined, attrs)
          }

          return true
        },
      /**
       * Set image alignment
       */
      setImageAlignment:
        (alignment: ImageAlignment) =>
        ({ tr, dispatch }) => {
          const { selection } = tr
          const node = tr.doc.nodeAt(selection.from)

          if (node?.type.name !== this.name) {
            return false
          }

          if (dispatch) {
            const attrs = { ...node.attrs, alignment }
            tr.setNodeMarkup(selection.from, undefined, attrs)
          }

          return true
        },
      /**
       * Resize image
       */
      resizeImage:
        (width: number, height?: number) =>
        ({ tr, dispatch }) => {
          const { selection } = tr
          const node = tr.doc.nodeAt(selection.from)

          if (node?.type.name !== this.name) {
            return false
          }

          // Clamp width to min/max
          const clampedWidth = Math.max(
            this.options.minWidth || 100,
            Math.min(this.options.maxWidth || 800, width)
          )

          if (dispatch) {
            const attrs = {
              ...node.attrs,
              width: clampedWidth,
              height: height || null,
            }
            tr.setNodeMarkup(selection.from, undefined, attrs)
          }

          return true
        },
    }
  },
})

export default ImageExtension
