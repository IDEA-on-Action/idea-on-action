/**
 * AdminTags Page
 *
 * CMS 태그 관리 페이지
 * - 태그 목록 (테이블)
 * - 검색/필터링
 * - 생성/수정/삭제 CRUD
 * - 사용 횟수 표시
 */

import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from '@/hooks/cms/useTags'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Loader2, Plus, Pencil, Trash2, Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Tag } from '@/types/cms.types'

// Zod Schema for Tag Form
const tagSchema = z.object({
  name: z.string().min(1, '태그명을 입력하세요'),
  slug: z
    .string()
    .min(1, 'Slug를 입력하세요')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug는 kebab-case 형식이어야 합니다 (예: react-query)'),
})

type TagFormData = z.infer<typeof tagSchema>

export default function AdminTags() {
  const { toast } = useToast()
  const { data: tags, isLoading } = useTags()
  const createMutation = useCreateTag()
  const updateMutation = useUpdateTag()
  const deleteMutation = useDeleteTag()

  const [search, setSearch] = useState('')
  const [editItem, setEditItem] = useState<Tag | null>(null)
  const [deleteItem, setDeleteItem] = useState<Tag | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  })

  // Filter tags
  const filteredTags = tags?.filter((tag) => {
    const matchesSearch =
      !search ||
      tag.name.toLowerCase().includes(search.toLowerCase()) ||
      tag.slug.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  // Open dialog for creating new tag
  const handleCreate = () => {
    setEditItem(null)
    form.reset({
      name: '',
      slug: '',
    })
    setIsDialogOpen(true)
  }

  // Open dialog for editing tag
  const handleEdit = (tag: Tag) => {
    setEditItem(tag)
    form.reset({
      name: tag.name,
      slug: tag.slug,
    })
    setIsDialogOpen(true)
  }

  // Submit form (create or update)
  const handleSubmit = async (data: TagFormData) => {
    try {
      const payload = {
        name: data.name,
        slug: data.slug,
        usageCount: 0, // Initialize to 0 for new tags
      }

      if (editItem) {
        await updateMutation.mutateAsync({ id: editItem.id, updates: payload })
        toast({
          title: '태그 수정 완료',
          description: '태그가 수정되었습니다.',
        })
      } else {
        await createMutation.mutateAsync(payload)
        toast({
          title: '태그 생성 완료',
          description: '새 태그가 생성되었습니다.',
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      toast({
        title: editItem ? '태그 수정 실패' : '태그 생성 실패',
        description: message,
        variant: 'destructive',
      })
    }
  }

  // Delete tag
  const handleDelete = async () => {
    if (!deleteItem) return

    try {
      await deleteMutation.mutateAsync(deleteItem.id)
      toast({
        title: '태그 삭제 완료',
        description: '태그가 삭제되었습니다.',
      })
      setDeleteItem(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      toast({
        title: '태그 삭제 실패',
        description: message,
        variant: 'destructive',
      })
    }
  }

  // Get usage count badge
  const getUsageBadge = (count: number) => {
    if (count === 0) {
      return <Badge variant="outline">미사용</Badge>
    } else if (count < 5) {
      return <Badge variant="secondary">{count}</Badge>
    } else if (count < 20) {
      return <Badge variant="default">{count}</Badge>
    } else {
      return <Badge className="bg-green-500">{count}</Badge>
    }
  }

  return (
    <>
      <Helmet>
        <title>태그 관리 | IDEA on Action</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">태그 관리</h1>
            <p className="text-muted-foreground">콘텐츠 태그를 관리합니다</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            새 태그
          </Button>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="태그명 또는 slug 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTags && filteredTags.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>태그명</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>사용 횟수</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-medium">{tag.name}</TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-muted rounded text-sm">{tag.slug}</code>
                    </TableCell>
                    <TableCell>{getUsageBadge(tag.usageCount)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(tag)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteItem(tag)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-muted-foreground">등록된 태그가 없습니다</p>
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                첫 태그 만들기
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editItem ? '태그 수정' : '새 태그'}</DialogTitle>
            <DialogDescription>
              태그 정보를 입력하세요. Slug는 kebab-case 형식이어야 합니다.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>태그명 (필수)</FormLabel>
                    <FormControl>
                      <Input placeholder="React Query" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (필수)</FormLabel>
                    <FormControl>
                      <Input placeholder="react-query" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Usage Count (read-only) */}
              {editItem && (
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">사용 횟수</p>
                      <p className="text-sm text-muted-foreground">
                        현재 {editItem.usageCount}개의 항목에서 사용 중
                      </p>
                    </div>
                    {getUsageBadge(editItem.usageCount)}
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  취소
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    '저장'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>태그 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteItem && deleteItem.usageCount > 0 ? (
                <>
                  이 태그는 현재 <strong>{deleteItem.usageCount}개의 항목</strong>에서 사용 중입니다.
                  삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                </>
              ) : (
                '정말로 이 태그를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
