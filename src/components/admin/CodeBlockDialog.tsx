/**
 * CodeBlockDialog Component
 * CMS Phase 5: Rich Text Editor - Advanced Extensions
 *
 * Dialog for inserting code blocks with language selection and preview
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import type { Editor } from '@tiptap/react'
import {
  Code2,
  Copy,
  Check,
  Hash,
  FileCode,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CODE_LANGUAGES,
  detectLanguage,
  type CodeLanguage,
} from './extensions/CodeBlockExtension'
import { cn } from '@/lib/utils'

/**
 * Props for CodeBlockDialog
 */
export interface CodeBlockDialogProps {
  /** Dialog open state */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Tiptap editor instance */
  editor: Editor | null
  /** Callback when code block is inserted */
  onInsert?: (code: string, language: CodeLanguage) => void
  /** Initial code (for editing existing blocks) */
  initialCode?: string
  /** Initial language */
  initialLanguage?: CodeLanguage
  /** Mode: 'insert' or 'edit' */
  mode?: 'insert' | 'edit'
}

/**
 * CodeBlockDialog Component
 *
 * Features:
 * - Language selection dropdown
 * - Code input textarea with syntax hints
 * - Auto-detect language from code
 * - Line numbers toggle
 * - Preview with syntax highlighting
 * - Copy to clipboard
 */
export function CodeBlockDialog({
  open,
  onOpenChange,
  editor,
  onInsert,
  initialCode = '',
  initialLanguage = 'javascript',
  mode = 'insert',
}: CodeBlockDialogProps) {
  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState<CodeLanguage>(initialLanguage)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [autoDetect, setAutoDetect] = useState(true)
  const [copied, setCopied] = useState(false)

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setCode(initialCode)
      setLanguage(initialLanguage)
      setShowLineNumbers(true)
      setCopied(false)
    }
  }, [open, initialCode, initialLanguage])

  // Auto-detect language when code changes
  useEffect(() => {
    if (autoDetect && code.trim()) {
      const detected = detectLanguage(code)
      if (detected !== language) {
        setLanguage(detected)
      }
    }
  }, [code, autoDetect, language])

  // Handle code change
  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value)
  }, [])

  // Handle language change
  const handleLanguageChange = useCallback((value: string) => {
    setLanguage(value as CodeLanguage)
    setAutoDetect(false) // Disable auto-detect when user manually selects
  }, [])

  // Handle tab key in textarea
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.target as HTMLTextAreaElement
      const start = target.selectionStart
      const end = target.selectionEnd

      // Insert 2 spaces for tab
      const newValue = code.substring(0, start) + '  ' + code.substring(end)
      setCode(newValue)

      // Move cursor after the inserted spaces
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2
      }, 0)
    }
  }, [code])

  // Copy code to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [code])

  // Handle insert/update
  const handleInsert = useCallback(() => {
    if (!editor) return

    if (mode === 'edit') {
      // Update existing code block
      editor.chain().focus().setCodeBlockLanguage(language).run()
    } else {
      // Insert new code block
      editor
        .chain()
        .focus()
        .setCodeBlock({ language, lineNumbers: showLineNumbers })
        .insertContent(code)
        .run()
    }

    // Call optional callback
    onInsert?.(code, language)

    // Close dialog
    onOpenChange(false)
  }, [editor, code, language, showLineNumbers, mode, onInsert, onOpenChange])

  // Count lines
  const lineCount = useMemo(() => {
    return code.split('\n').length
  }, [code])

  // Get language label
  const languageLabel = useMemo(() => {
    const lang = CODE_LANGUAGES.find((l) => l.value === language)
    return lang?.label || language
  }, [language])

  // Check if can insert
  const canInsert = mode === 'edit' || code.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            {mode === 'edit' ? 'Edit Code Block' : 'Insert Code Block'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Change the language or settings for this code block'
              : 'Enter your code and select the programming language'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto py-4">
          {/* Language Selection */}
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {CODE_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      <span className="flex items-center gap-2">
                        <FileCode className="h-4 w-4" />
                        {lang.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="auto-detect"
                  checked={autoDetect}
                  onCheckedChange={setAutoDetect}
                />
                <Label htmlFor="auto-detect" className="text-sm cursor-pointer">
                  Auto-detect
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="line-numbers"
                  checked={showLineNumbers}
                  onCheckedChange={setShowLineNumbers}
                />
                <Label htmlFor="line-numbers" className="text-sm cursor-pointer">
                  <Hash className="h-4 w-4 inline mr-1" />
                  Lines
                </Label>
              </div>
            </div>
          </div>

          {/* Code Input */}
          {mode === 'insert' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="code">Code</Label>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{lineCount} lines</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!code}
                    className="h-6 px-2"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="relative">
                {showLineNumbers && code && (
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-muted/50 border-r text-muted-foreground text-xs font-mono flex flex-col items-end pr-2 pt-3 pointer-events-none rounded-l-md">
                    {code.split('\n').map((_, i) => (
                      <div key={i} className="leading-6">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                )}
                <Textarea
                  id="code"
                  placeholder="// Enter your code here..."
                  value={code}
                  onChange={handleCodeChange}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    'font-mono text-sm min-h-[300px] resize-none',
                    showLineNumbers && code && 'pl-10'
                  )}
                  spellCheck={false}
                />
              </div>
            </div>
          )}

          {/* Preview */}
          {code && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div
                className={cn(
                  'relative rounded-lg bg-muted p-4 overflow-x-auto',
                  'font-mono text-sm'
                )}
              >
                {/* Language badge */}
                <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-0.5 rounded">
                  {languageLabel}
                </div>

                {/* Line numbers */}
                {showLineNumbers && (
                  <div className="absolute left-4 top-4 text-muted-foreground/50 select-none">
                    {code.split('\n').map((_, i) => (
                      <div key={i} className="leading-6 text-right pr-4">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                )}

                {/* Code content */}
                <pre
                  className={cn(
                    'whitespace-pre overflow-x-auto',
                    showLineNumbers && 'pl-8'
                  )}
                >
                  <code className={`language-${language}`}>
                    {code}
                  </code>
                </pre>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!canInsert}>
            {mode === 'edit' ? 'Update' : 'Insert Code'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CodeBlockDialog
