/**
 * NoticeForm Component - Phase 11 Week 2
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useCreateNotice, useUpdateNotice } from '@/hooks/useNotices'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import type { NoticeWithAuthor } from '@/types/notice'

const noticeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['info', 'warning', 'urgent', 'maintenance']),
  status: z.enum(['draft', 'published', 'archived']),
  is_pinned: z.boolean(),
  expires_at: z.string().optional(),
})

type NoticeFormData = z.infer<typeof noticeSchema>

interface NoticeFormProps {
  notice?: NoticeWithAuthor
  mode: 'create' | 'edit'
}

export function NoticeForm({ notice, mode }: NoticeFormProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const createMutation = useCreateNotice()
  const updateMutation = useUpdateNotice()

  const form = useForm<NoticeFormData>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      title: notice?.title || '',
      content: notice?.content || '',
      type: notice?.type || 'info',
      status: notice?.status || 'draft',
      is_pinned: notice?.is_pinned || false,
      expires_at: notice?.expires_at || '',
    },
  })

  const onSubmit = async (data: NoticeFormData) => {
    try {
      const submitData = {
        ...data,
        author_id: user?.id || '',
        published_at: data.status === 'published' ? new Date().toISOString() : null,
        expires_at: data.expires_at || null,
      }

      if (mode === 'create') {
        await createMutation.mutateAsync(submitData)
      } else if (notice) {
        await updateMutation.mutateAsync({ id: notice.id, data: submitData })
      }

      toast({ title: 'Success', description: `Notice ${mode}d successfully` })
      navigate('/admin/notices')
    } catch (error) {
      toast({ title: 'Error', description: `Failed to ${mode} notice`, variant: 'destructive' })
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Title *</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="content" render={({ field }) => (
          <FormItem>
            <FormLabel>Content * (Markdown)</FormLabel>
            <FormControl><Textarea rows={10} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField control={form.control} name="type" render={({ field }) => (
            <FormItem>
              <FormLabel>Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="status" render={({ field }) => (
            <FormItem>
              <FormLabel>Status *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="expires_at" render={({ field }) => (
            <FormItem>
              <FormLabel>Expires At</FormLabel>
              <FormControl><Input type="datetime-local" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="is_pinned" render={({ field }) => (
          <FormItem className="flex items-center space-x-2 space-y-0">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel className="font-normal cursor-pointer">Pin this notice to the top</FormLabel>
          </FormItem>
        )} />

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {mode === 'create' ? 'Create Notice' : 'Update Notice'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/notices')} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
