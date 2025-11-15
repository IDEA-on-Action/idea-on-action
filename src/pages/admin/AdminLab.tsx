/**
 * AdminLab Page
 *
 * CMS Lab 관리 페이지
 * - Lab 목록 (테이블)
 * - 카테고리/상태 필터링
 * - 생성/수정/삭제 CRUD
 * - 공개/비공개 토글
 * - GitHub/Demo URL 관리
 */

import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  useLabItems,
  useCreateLabItem,
  useUpdateLabItem,
  useDeleteLabItem
} from '@/hooks/cms/useLabItems'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
import { Loader2, Plus, Pencil, Trash2, Search, ExternalLink, Github } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { LabItem, LabCategory, LabStatus } from '@/types/cms.types'

// Zod Schema for Lab Form
const labSchema = z.object({
  slug: z.string().min(1, 'Slug를 입력하세요').regex(/^[a-z0-9-]+$/, 'Slug는 소문자, 숫자, 하이픈만 가능합니다'),
  title: z.string().min(1, '제목을 입력하세요'),
  subtitle: z.string().optional(),
  description: z.string().min(1, '설명을 입력하세요'),
  content: z.string().optional(),
  category: z.enum(['experiment', 'idea', 'community', 'research']),
  status: z.enum(['exploring', 'developing', 'testing', 'completed', 'archived']),
  techStack: z.string().optional(), // JSON string array
  githubUrl: z.string().url('유효한 URL을 입력하세요').optional().or(z.literal('')),
  demoUrl: z.string().url('유효한 URL을 입력하세요').optional().or(z.literal('')),
  contributors: z.string().optional(), // JSON string array
  startDate: z.string().optional(),
  tags: z.string().optional(), // JSON string array
  published: z.boolean().default(false),
})

type LabFormData = z.infer<typeof labSchema>

// Extended LabItem type with published flag
interface LabItemWithPublished extends LabItem {
  published: boolean
}

export default function AdminLab() {
  const { toast } = useToast()
  const { data: labItems, isLoading } = useLabItems()
  const createMutation = useCreateLabItem()
  const updateMutation = useUpdateLabItem()
  const deleteMutation = useDeleteLabItem()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [editItem, setEditItem] = useState<LabItemWithPublished | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<LabFormData>({
    resolver: zodResolver(labSchema),
    defaultValues: {
      slug: '',
      title: '',
      subtitle: '',
      description: '',
      content: '',
      category: 'experiment',
      status: 'exploring',
      techStack: '[]',
      githubUrl: '',
      demoUrl: '',
      contributors: '[]',
      startDate: '',
      tags: '[]',
      published: false,
    },
  })

  // Filter lab items
  const filteredItems = labItems?.filter((item) => {
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Open dialog for creating new item
  const handleCreate = () => {
    setEditItem(null)
    form.reset({
      slug: '',
      title: '',
      subtitle: '',
      description: '',
      content: '',
      category: 'experiment',
      status: 'exploring',
      techStack: '[]',
      githubUrl: '',
      demoUrl: '',
      contributors: '[]',
      startDate: '',
      tags: '[]',
      published: false,
    })
    setIsDialogOpen(true)
  }

  // Open dialog for editing item
  const handleEdit = (item: LabItemWithPublished) => {
    setEditItem(item)
    form.reset({
      slug: item.slug,
      title: item.title,
      subtitle: item.subtitle || '',
      description: item.description,
      content: item.content || '',
      category: item.category,
      status: item.status,
      techStack: JSON.stringify(item.techStack || []),
      githubUrl: item.githubUrl || '',
      demoUrl: item.demoUrl || '',
      contributors: JSON.stringify(item.contributors || []),
      startDate: item.startDate || '',
      tags: JSON.stringify(item.tags || []),
      published: item.published,
    })
    setIsDialogOpen(true)
  }

  // Submit form (create or update)
  const handleSubmit = async (data: LabFormData) => {
    try {
      const payload = {
        slug: data.slug,
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description,
        content: data.content || null,
        category: data.category,
        status: data.status,
        techStack: data.techStack ? JSON.parse(data.techStack) : [],
        githubUrl: data.githubUrl || null,
        demoUrl: data.demoUrl || null,
        contributors: data.contributors ? JSON.parse(data.contributors) : [],
        startDate: data.startDate || null,
        tags: data.tags ? JSON.parse(data.tags) : [],
        published: data.published,
        createdBy: null, // Will be set by RLS policy
      }

      if (editItem) {
        await updateMutation.mutateAsync({ id: editItem.id, updates: payload })
        toast({
          title: 'Lab 항목 수정 완료',
          description: 'Lab 항목이 수정되었습니다.',
        })
      } else {
        await createMutation.mutateAsync(payload)
        toast({
          title: 'Lab 항목 생성 완료',
          description: '새 Lab 항목이 생성되었습니다.',
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      toast({
        title: editItem ? 'Lab 항목 수정 실패' : 'Lab 항목 생성 실패',
        description: message,
        variant: 'destructive',
      })
    }
  }

  // Delete lab item
  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await deleteMutation.mutateAsync(deleteId)
      toast({
        title: 'Lab 항목 삭제 완료',
        description: 'Lab 항목이 삭제되었습니다.',
      })
      setDeleteId(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      toast({
        title: 'Lab 항목 삭제 실패',
        description: message,
        variant: 'destructive',
      })
    }
  }

  // Toggle published status
  const handleTogglePublished = async (item: LabItemWithPublished) => {
    try {
      await updateMutation.mutateAsync({
        id: item.id,
        updates: { published: !item.published },
      })
      toast({
        title: '공개 상태 변경',
        description: item.published ? '비공개로 변경되었습니다.' : '공개로 변경되었습니다.',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      toast({
        title: '상태 변경 실패',
        description: message,
        variant: 'destructive',
      })
    }
  }

  // Get category badge
  const getCategoryBadge = (category: LabCategory) => {
    const variants: Record<LabCategory, string> = {
      experiment: 'bg-purple-500',
      idea: 'bg-blue-500',
      community: 'bg-green-500',
      research: 'bg-orange-500',
    }
    const labels: Record<LabCategory, string> = {
      experiment: '실험',
      idea: '아이디어',
      community: '커뮤니티',
      research: '연구',
    }
    return <Badge variant="default" className={variants[category]}>{labels[category]}</Badge>
  }

  // Get status badge
  const getStatusBadge = (status: LabStatus) => {
    const variants: Record<LabStatus, string> = {
      exploring: 'bg-gray-500',
      developing: 'bg-blue-500',
      testing: 'bg-yellow-500',
      completed: 'bg-green-500',
      archived: 'bg-red-500',
    }
    const labels: Record<LabStatus, string> = {
      exploring: '탐색 중',
      developing: '개발 중',
      testing: '테스트 중',
      completed: '완료',
      archived: '보관됨',
    }
    return <Badge variant="default" className={variants[status]}>{labels[status]}</Badge>
  }

  return (
    <>
      <Helmet>
        <title>Lab 관리 | IDEA on Action</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lab 관리</h1>
            <p className="text-muted-foreground">실험 및 연구 항목을 관리합니다</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            새 Lab 항목
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="제목 또는 설명 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 카테고리</SelectItem>
              <SelectItem value="experiment">실험</SelectItem>
              <SelectItem value="idea">아이디어</SelectItem>
              <SelectItem value="community">커뮤니티</SelectItem>
              <SelectItem value="research">연구</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="exploring">탐색 중</SelectItem>
              <SelectItem value="developing">개발 중</SelectItem>
              <SelectItem value="testing">테스트 중</SelectItem>
              <SelectItem value="completed">완료</SelectItem>
              <SelectItem value="archived">보관됨</SelectItem>
            </SelectContent>
          </Select>
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
                  <TableHead>제목</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>GitHub</TableHead>
                  <TableHead>공개</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{item.title}</div>
                        {item.subtitle && (
                          <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(item.category)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      {item.githubUrl ? (
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <Github className="h-4 w-4" />
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={item.published || false}
                        onCheckedChange={() => handleTogglePublished(item as LabItemWithPublished)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item as LabItemWithPublished)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(item.id)}
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
              <p className="text-muted-foreground">등록된 Lab 항목이 없습니다</p>
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                첫 Lab 항목 만들기
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Lab 항목 수정' : '새 Lab 항목'}</DialogTitle>
            <DialogDescription>
              Lab 정보를 입력하세요. 배열 필드는 유효한 JSON 형식이어야 합니다.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (필수)</FormLabel>
                    <FormControl>
                      <Input placeholder="ai-chatbot-experiment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>제목 (필수)</FormLabel>
                    <FormControl>
                      <Input placeholder="AI 챗봇 실험" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subtitle */}
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>부제목</FormLabel>
                    <FormControl>
                      <Input placeholder="OpenAI GPT-4를 활용한 대화형 인터페이스" {...field} />
                    </FormControl>
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
                    <FormLabel>설명 (필수)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Lab 항목 설명" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content (Markdown) */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>본문 (Markdown)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Markdown 형식으로 작성..."
                        className="min-h-[120px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>카테고리</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="experiment">실험</SelectItem>
                          <SelectItem value="idea">아이디어</SelectItem>
                          <SelectItem value="community">커뮤니티</SelectItem>
                          <SelectItem value="research">연구</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>상태</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="exploring">탐색 중</SelectItem>
                          <SelectItem value="developing">개발 중</SelectItem>
                          <SelectItem value="testing">테스트 중</SelectItem>
                          <SelectItem value="completed">완료</SelectItem>
                          <SelectItem value="archived">보관됨</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* GitHub & Demo URLs */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://github.com/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="demoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Demo URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://demo.example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>시작일</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tech Stack (JSON) */}
              <FormField
                control={form.control}
                name="techStack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>기술 스택 (JSON 배열)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='["React", "TypeScript", "OpenAI"]'
                        className="min-h-[60px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contributors (JSON) */}
              <FormField
                control={form.control}
                name="contributors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>기여자 (JSON 배열)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='["서민원", "홍길동"]'
                        className="min-h-[60px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags (JSON) */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>태그 (JSON 배열)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='["AI", "Chatbot", "Experiment"]'
                        className="min-h-[60px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Published */}
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>공개 여부</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        공개 시 사용자에게 표시됩니다
                      </div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
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
            <AlertDialogTitle>Lab 항목 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 Lab 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
