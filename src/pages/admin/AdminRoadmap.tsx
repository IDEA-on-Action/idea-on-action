/**
 * AdminRoadmap Page
 *
 * CMS 로드맵 관리 페이지
 * - 로드맵 목록 (테이블)
 * - 카테고리/상태 필터링
 * - 생성/수정/삭제 CRUD
 * - 공개/비공개 토글
 * - 진행률 표시
 */

import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useRoadmap, useCreateRoadmap, useUpdateRoadmap, useDeleteRoadmap } from '@/hooks/useRoadmap'
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
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
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
import type { Roadmap } from '@/types/v2'

// Zod Schema for Roadmap Form
const roadmapSchema = z.object({
  quarter: z.string().min(1, '분기를 입력하세요 (예: 2025-Q1)'),
  theme: z.string().min(1, '테마를 입력하세요'),
  description: z.string().optional(),
  progress: z.number().min(0).max(100),
  owner: z.string().optional(),
  related_projects: z.string().optional(), // JSON string
  milestones: z.string().optional(), // JSON string
  risk_level: z.enum(['low', 'medium', 'high']).optional(),
  kpis: z.string().optional(), // JSON string
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  published: z.boolean().default(false),
})

type RoadmapFormData = z.infer<typeof roadmapSchema>

// Extended Roadmap type with published flag
interface RoadmapWithPublished extends Roadmap {
  published?: boolean
}

export default function AdminRoadmap() {
  const { toast } = useToast()
  const { data: roadmapItems, isLoading } = useRoadmap()
  const createMutation = useCreateRoadmap()
  const updateMutation = useUpdateRoadmap()
  const deleteMutation = useDeleteRoadmap()

  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState<string>('all')
  const [editItem, setEditItem] = useState<RoadmapWithPublished | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<RoadmapFormData>({
    resolver: zodResolver(roadmapSchema),
    defaultValues: {
      quarter: '',
      theme: '',
      description: '',
      progress: 0,
      owner: '',
      related_projects: '[]',
      milestones: '[]',
      risk_level: 'low',
      kpis: '{}',
      start_date: '',
      end_date: '',
      published: false,
    },
  })

  // Filter roadmap items
  const filteredItems = roadmapItems?.filter((item) => {
    const matchesSearch =
      !search ||
      item.quarter.toLowerCase().includes(search.toLowerCase()) ||
      item.theme.toLowerCase().includes(search.toLowerCase())
    const matchesRisk = riskFilter === 'all' || item.risk_level === riskFilter
    return matchesSearch && matchesRisk
  })

  // Open dialog for creating new item
  const handleCreate = () => {
    setEditItem(null)
    form.reset({
      quarter: '',
      theme: '',
      description: '',
      progress: 0,
      owner: '',
      related_projects: '[]',
      milestones: '[]',
      risk_level: 'low',
      kpis: '{}',
      start_date: '',
      end_date: '',
      published: false,
    })
    setIsDialogOpen(true)
  }

  // Open dialog for editing item
  const handleEdit = (item: RoadmapWithPublished) => {
    setEditItem(item)
    form.reset({
      quarter: item.quarter,
      theme: item.theme,
      description: item.description || '',
      progress: item.progress,
      owner: item.owner || '',
      related_projects: JSON.stringify(item.related_projects || []),
      milestones: JSON.stringify(item.milestones || []),
      risk_level: item.risk_level || 'low',
      kpis: JSON.stringify(item.kpis || {}),
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      published: item.published || false,
    })
    setIsDialogOpen(true)
  }

  // Submit form (create or update)
  const handleSubmit = async (data: RoadmapFormData) => {
    try {
      const payload = {
        quarter: data.quarter,
        theme: data.theme,
        description: data.description,
        progress: data.progress,
        owner: data.owner,
        related_projects: data.related_projects ? JSON.parse(data.related_projects) : [],
        milestones: data.milestones ? JSON.parse(data.milestones) : [],
        risk_level: data.risk_level,
        kpis: data.kpis ? JSON.parse(data.kpis) : {},
        start_date: data.start_date,
        end_date: data.end_date,
        published: data.published,
      }

      if (editItem) {
        await updateMutation.mutateAsync({ id: editItem.id, updates: payload })
        toast({
          title: '로드맵 수정 완료',
          description: '로드맵이 수정되었습니다.',
        })
      } else {
        await createMutation.mutateAsync(payload as Omit<Roadmap, 'id' | 'created_at' | 'updated_at'>)
        toast({
          title: '로드맵 생성 완료',
          description: '새 로드맵이 생성되었습니다.',
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      toast({
        title: editItem ? '로드맵 수정 실패' : '로드맵 생성 실패',
        description: message,
        variant: 'destructive',
      })
    }
  }

  // Delete roadmap item
  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await deleteMutation.mutateAsync(deleteId)
      toast({
        title: '로드맵 삭제 완료',
        description: '로드맵이 삭제되었습니다.',
      })
      setDeleteId(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      toast({
        title: '로드맵 삭제 실패',
        description: message,
        variant: 'destructive',
      })
    }
  }

  // Toggle published status
  const handleTogglePublished = async (item: RoadmapWithPublished) => {
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

  // Format date
  const formatDate = (date: string) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Get risk badge
  const getRiskBadge = (risk?: string) => {
    switch (risk) {
      case 'low':
        return <Badge variant="default" className="bg-green-500">낮음</Badge>
      case 'medium':
        return <Badge variant="default" className="bg-yellow-500">보통</Badge>
      case 'high':
        return <Badge variant="destructive">높음</Badge>
      default:
        return <Badge variant="outline">-</Badge>
    }
  }

  return (
    <>
      <Helmet>
        <title>로드맵 관리 | IDEA on Action</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">로드맵 관리</h1>
            <p className="text-muted-foreground">프로젝트 로드맵을 관리합니다</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            새 로드맵 항목
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="분기 또는 테마 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 리스크</SelectItem>
              <SelectItem value="low">낮음</SelectItem>
              <SelectItem value="medium">보통</SelectItem>
              <SelectItem value="high">높음</SelectItem>
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
                  <TableHead>분기</TableHead>
                  <TableHead>테마</TableHead>
                  <TableHead>리스크</TableHead>
                  <TableHead>진행률</TableHead>
                  <TableHead>담당자</TableHead>
                  <TableHead>공개</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.quarter}</TableCell>
                    <TableCell>{item.theme}</TableCell>
                    <TableCell>{getRiskBadge(item.risk_level)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={item.progress} className="w-20" />
                        <span className="text-sm text-muted-foreground">{item.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.owner || '-'}</TableCell>
                    <TableCell>
                      <Switch
                        checked={item.published || false}
                        onCheckedChange={() => handleTogglePublished(item as RoadmapWithPublished)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item as RoadmapWithPublished)}
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
              <p className="text-muted-foreground">등록된 로드맵이 없습니다</p>
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                첫 로드맵 항목 만들기
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? '로드맵 수정' : '새 로드맵 항목'}</DialogTitle>
            <DialogDescription>
              로드맵 정보를 입력하세요. JSON 필드는 유효한 JSON 형식이어야 합니다.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Quarter */}
              <FormField
                control={form.control}
                name="quarter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>분기 (필수)</FormLabel>
                    <FormControl>
                      <Input placeholder="2025-Q1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Theme */}
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>테마 (필수)</FormLabel>
                    <FormControl>
                      <Input placeholder="Community & Open Metrics" {...field} />
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
                    <FormLabel>설명</FormLabel>
                    <FormControl>
                      <Textarea placeholder="로드맵 설명" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Progress */}
              <FormField
                control={form.control}
                name="progress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>진행률: {field.value}%</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Risk Level */}
              <FormField
                control={form.control}
                name="risk_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>리스크 레벨</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">낮음</SelectItem>
                        <SelectItem value="medium">보통</SelectItem>
                        <SelectItem value="high">높음</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Owner */}
              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>담당자</FormLabel>
                    <FormControl>
                      <Input placeholder="서민원" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
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
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>종료일</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Related Projects (JSON) */}
              <FormField
                control={form.control}
                name="related_projects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>관련 프로젝트 (JSON 배열)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='["p001", "p002"]'
                        className="min-h-[60px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Milestones (JSON) */}
              <FormField
                control={form.control}
                name="milestones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>마일스톤 (JSON 배열)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='[{"id": "m1", "title": "Phase 1", "status": "completed"}]'
                        className="min-h-[80px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* KPIs (JSON) */}
              <FormField
                control={form.control}
                name="kpis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KPI (JSON 객체)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{"projects": {"target": 5, "current": 3}}'
                        className="min-h-[80px] font-mono text-sm"
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
            <AlertDialogTitle>로드맵 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 로드맵 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
