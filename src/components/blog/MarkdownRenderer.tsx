/**
 * MarkdownRenderer Component
 * Phase 11 Week 1: Blog System
 *
 * Renders Markdown content with GitHub Flavored Markdown support
 */

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        'prose prose-slate dark:prose-invert max-w-none',
        // Headings
        'prose-headings:font-bold prose-headings:tracking-tight',
        'prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-4',
        'prose-h2:text-3xl prose-h2:mt-6 prose-h2:mb-3',
        'prose-h3:text-2xl prose-h3:mt-5 prose-h3:mb-2',
        // Paragraphs
        'prose-p:leading-7 prose-p:mb-4',
        // Links
        'prose-a:text-primary prose-a:no-underline prose-a:font-medium',
        'hover:prose-a:underline',
        // Lists
        'prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6',
        'prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6',
        'prose-li:my-2',
        // Code blocks
        'prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto',
        'prose-code:text-accent-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded',
        'prose-code:before:content-none prose-code:after:content-none',
        // Blockquotes
        'prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic',
        // Tables
        'prose-table:w-full prose-table:border-collapse',
        'prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-2 prose-th:font-semibold',
        'prose-td:border prose-td:border-border prose-td:p-2',
        // Images
        'prose-img:rounded-lg prose-img:shadow-md',
        // HR
        'prose-hr:my-8 prose-hr:border-border',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // Custom heading IDs for anchor links
          h1: ({ children, ...props }) => {
            const id = String(children).toLowerCase().replace(/\s+/g, '-')
            return <h1 id={id} {...props}>{children}</h1>
          },
          h2: ({ children, ...props }) => {
            const id = String(children).toLowerCase().replace(/\s+/g, '-')
            return <h2 id={id} {...props}>{children}</h2>
          },
          h3: ({ children, ...props }) => {
            const id = String(children).toLowerCase().replace(/\s+/g, '-')
            return <h3 id={id} {...props}>{children}</h3>
          },
          // External links open in new tab
          a: ({ href, children, ...props }) => {
            const isExternal = href?.startsWith('http')
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
              </a>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
