import { NoticeForm } from '@/components/notices/NoticeForm'

export default function CreateNotice() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Notice</h1>
        <p className="text-muted-foreground mt-1">Publish a new announcement</p>
      </div>
      <NoticeForm mode="create" />
    </div>
  )
}
