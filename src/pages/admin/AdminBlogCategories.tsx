/**
 * AdminBlogCategories Page
 *
 * CMS 블로그 카테고리 관리 페이지
 * - 카테고리 목록 (테이블)
 * - 검색/필터링
 * - 생성/수정/삭제 CRUD
 * - 색상 미리보기
 * - 포스트 개수 표시
 */

import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  useBlogCategories,
  useCreateBlogCategory,
  useUpdateBlogCategory,
  useDeleteBlogCategory,
} from '@/hooks/cms/useBlogCategories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import type { BlogCategory } from '@/types/cms.types'

// Zod Schema for Blog Category Form
const categorySchema = z.object({
  name: z.string().min(1, '카테고리 이름을 입력하세요'),
  slug: z
    .string()
    .min(1, 'slug를 입력하세요')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'kebab-case 형식이어야 합니다 (예: tech, my-category)'),
  description: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, '올바른 hex 색상 코드를 입력하세요 (예: #3b82f6)')
    .default('#3b82f6'),
  icon: z.string().default('folder'),
})

type CategoryFormData = z.infer<typeof categorySchema>

export default function AdminBlogCategories() {
  const { toast } = useToast()
  const { data: categories, isLoading } = useBlogCategories()
  const createMutation = useCreateBlogCategory()
  const updateMutation = useUpdateBlogCategory()
  const deleteMutation = useDeleteBlogCategory()

  const [search, setSearch] = useState('')
  const [editItem, setEditItem] = useState<BlogCategory | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      color: '#3b82f6',
      icon: 'folder',
    },
  })

  // Filter categories
  const filteredItems = categories?.filter((item) => {
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
    return matchesSearch
  })

  // Open dialog for creating new item
  const handleCreate = () => {
    setEditItem(null)
    form.reset({
      name: '',
      slug: '',
      description: '',
      color: '#3b82f6',
      icon: 'folder',
    })
    setIsDialogOpen(true)
  }

  // Open dialog for editing item
  const handleEdit = (item: BlogCategory) => {
    setEditItem(item)
    form.reset({
      name: item.name,
      slug: item.slug,
      description: item.description || '',
      color: item.color,
      icon: item.icon,
    })
    setIsDialogOpen(true)
  }

  // Submit form (create or update)
  const handleSubmit = async (data: CategoryFormData) => {
    try {
      const payload = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        color: data.color,
        icon: data.icon,
      }

      if (editItem) {
        await updateMutation.mutateAsync({ id: editItem.id, updates: payload })
        toast({
          title: '카테고리 수정 완료',
          description: '카테고리가 수정되었습니다.',
        })
      } else {
        await createMutation.mutateAsync(payload)
        toast({
          title: '카테고리 생성 완료',
          description: '새 카테고리가 생성되었습니다.',
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      toast({
        title: editItem ? '카테고리 수정 실패' : '카테고리 생성 실패',
        description: message,
        variant: 'destructive',
      })
    }
  }

  // Delete category
  const handleDelete = async () => {
    if (!deleteId) return

    // Check if category has posts
    const category = categories?.find((c) => c.id === deleteId)
    if (category && category.postCount > 0) {
      toast({
        title: '삭제 불가',
        description: `이 카테고리에는 ${category.postCount}개의 포스트가 있습니다. 먼저 포스트를 삭제하거나 다른 카테고리로 이동하세요.`,
        variant: 'destructive',
      })
      setDeleteId(null)
      return
    }

    try {
      await deleteMutation.mutateAsync(deleteId)
      toast({
        title: '카테고리 삭제 완료',
        description: '카테고리가 삭제되었습니다.',
      })
      setDeleteId(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      toast({
        title: '카테고리 삭제 실패',
        description: message,
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <Helmet>
        <title>블로그 카테고리 관리 | IDEA on Action</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">블로그 카테고리 관리</h1>
            <p className="text-muted-foreground">블로그 포스트 카테고리를 관리합니다</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            새 카테고리
          </Button>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="이름, slug, 설명 검색..."
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
          ) : filteredItems && filteredItems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>색상</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>아이콘</TableHead>
                  <TableHead>포스트 수</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-border"
                          style={{ backgroundColor: item.color }}
                        />
                        <code className="text-xs text-muted-foreground">{item.color}</code>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{item.slug}</code>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm text-muted-foreground">{item.icon}</code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.postCount}개</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
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
              <p className="text-muted-foreground">등록된 카테고리가 없습니다</p>
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                첫 카테고리 만들기
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? '카테고리 수정' : '새 카테고리'}</DialogTitle>
            <DialogDescription>
              카테고리 정보를 입력하세요. slug는 kebab-case 형식이어야 합니다.
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
                    <FormLabel>이름 (필수)</FormLabel>
                    <FormControl>
                      <Input placeholder="기술" {...field} />
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
                      <Input placeholder="tech" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      kebab-case 형식 (소문자, 숫자, 하이픈만 사용)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설명</FormLabel>
                    <FormControl>
                      <Textarea placeholder="카테고리 설명" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Color */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>색상 (Hex 코드)</FormLabel>
                    <div className="flex items-center gap-4">
                      <FormControl>
                        <Input placeholder="#3b82f6" {...field} className="flex-1" />
                      </FormControl>
                      <div
                        className="w-12 h-12 rounded border border-border"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      예: #3b82f6 (파랑), #f59e0b (주황), #8b5cf6 (보라)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Icon */}
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>아이콘</FormLabel>
                    <FormControl>
                      <Input placeholder="folder" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Lucide 아이콘 이름 (예: folder, code, palette, briefcase)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>카테고리 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 카테고리를 삭제하시겠습니까?
              {(categories?.find((c) => c.id === deleteId)?.postCount || 0) > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  경고: 이 카테고리에는{' '}
                  {categories?.find((c) => c.id === deleteId)?.postCount}개의 포스트가
                  있습니다.
                </span>
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
