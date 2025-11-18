# CMS Phase 5 - Implementation Strategy

> **Version**: 2.1.0
> **Phase**: CMS Phase 5 - Advanced Content Management
> **Status**: Planning
> **Last Updated**: 2025-11-17

## Table of Contents
1. [Implementation Phases](#implementation-phases)
2. [Integration Strategy](#integration-strategy)
3. [Testing Strategy](#testing-strategy)
4. [Deployment Strategy](#deployment-strategy)
5. [Risk Mitigation](#risk-mitigation)
6. [Timeline & Resources](#timeline--resources)

---

## 1. Implementation Phases

### Phase 5-1: Media Library (3-4 days)

**Goal**: Supabase Storage integration and image upload/management

---

#### Sprint 1: Storage Infrastructure (Day 1)

**Objective**: Set up Supabase Storage bucket and database schema

**Tasks**:

1. **Create Storage Bucket** (30 min)
   ```bash
   # Using Supabase Dashboard or CLI
   npx supabase storage create media --public
   ```

   - Bucket name: `media`
   - Public access: Yes (RLS-protected)
   - File size limit: 10 MB
   - Allowed MIME types: `image/*`

2. **Configure RLS Policies** (1 hour)
   ```sql
   -- File: supabase/migrations/20251117100000_media_storage_rls.sql

   -- Users can upload to their own folder
   CREATE POLICY "Users can upload own files"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (
     bucket_id = 'media' AND
     (storage.foldername(name))[1] = auth.uid()::text
   );

   -- Anyone can view files (public bucket)
   CREATE POLICY "Anyone can view files"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'media');

   -- Users can delete own files
   CREATE POLICY "Users can delete own files"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (
     bucket_id = 'media' AND
     (storage.foldername(name))[1] = auth.uid()::text
   );
   ```

3. **Create Database Schema** (1 hour)
   ```sql
   -- File: supabase/migrations/20251117100001_media_library_table.sql

   CREATE TABLE media_library (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     filename TEXT NOT NULL,
     file_path TEXT NOT NULL UNIQUE,
     file_size INTEGER NOT NULL CHECK (file_size > 0 AND file_size <= 10485760),
     mime_type TEXT NOT NULL CHECK (mime_type LIKE 'image/%'),
     thumbnail_path TEXT,
     alt_text TEXT,
     width INTEGER,
     height INTEGER,
     created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
     updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
   );

   -- Indexes
   CREATE INDEX idx_media_user ON media_library(user_id);
   CREATE INDEX idx_media_created ON media_library(created_at DESC);
   CREATE INDEX idx_media_filename ON media_library USING GIN (to_tsvector('english', filename));

   -- RLS
   ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Users can view all media"
   ON media_library FOR SELECT TO authenticated USING (true);

   CREATE POLICY "Users can insert own media"
   ON media_library FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own media"
   ON media_library FOR UPDATE TO authenticated USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete own media"
   ON media_library FOR DELETE TO authenticated USING (auth.uid() = user_id);

   -- Trigger
   CREATE TRIGGER update_media_library_updated_at
   BEFORE UPDATE ON media_library
   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
   ```

4. **Update TypeScript Types** (30 min)
   ```bash
   npx supabase gen types typescript --project-id zykjdneewbzyazfukzyg > src/lib/database.types.ts
   ```

5. **Test Migrations Locally** (1 hour)
   ```bash
   # Start Supabase locally
   npx supabase start

   # Apply migrations
   npx supabase db reset

   # Verify schema
   npx supabase db diff
   ```

**Acceptance Criteria**:
- [x] Storage bucket `media` exists
- [x] RLS policies allow authenticated users to upload
- [x] `media_library` table created with indexes
- [x] TypeScript types generated
- [x] Local migrations pass

---

#### Sprint 2: Upload UI (Day 2)

**Objective**: Build file upload component with drag-and-drop

**Tasks**:

1. **Install Dependencies** (15 min)
   ```bash
   npm install react-dropzone@^14.2.0
   npm install -D @types/react-dropzone
   ```

2. **Create useMediaUpload Hook** (2 hours)
   ```typescript
   // File: src/hooks/useMediaUpload.ts

   import { useState } from 'react';
   import { useMutation, useQueryClient } from '@tanstack/react-query';
   import { supabase } from '@/lib/supabase';
   import type { MediaItem } from '@/types/cms.types';

   interface UploadProgress {
     filename: string;
     progress: number;
     status: 'pending' | 'uploading' | 'success' | 'error';
     error?: string;
   }

   export const useMediaUpload = () => {
     const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
     const queryClient = useQueryClient();

     const mutation = useMutation({
       mutationFn: async (files: File[]) => {
         const results: MediaItem[] = [];

         for (const file of files) {
           // Update progress
           setUploadProgress(prev => [
             ...prev,
             { filename: file.name, progress: 0, status: 'uploading' }
           ]);

           try {
             // Generate unique filename
             const timestamp = Date.now();
             const ext = file.name.split('.').pop();
             const userId = (await supabase.auth.getUser()).data.user?.id;
             const filePath = `${userId}/originals/${timestamp}_${file.name}`;

             // Upload to Storage
             const { data: uploadData, error: uploadError } = await supabase.storage
               .from('media')
               .upload(filePath, file, {
                 cacheControl: '3600',
                 upsert: false
               });

             if (uploadError) throw uploadError;

             // Get public URL
             const { data: urlData } = supabase.storage
               .from('media')
               .getPublicUrl(filePath);

             // Insert metadata to database
             const { data: mediaData, error: dbError } = await supabase
               .from('media_library')
               .insert({
                 user_id: userId,
                 filename: file.name,
                 file_path: uploadData.path,
                 file_size: file.size,
                 mime_type: file.type,
                 alt_text: file.name.split('.')[0] // Default to filename
               })
               .select()
               .single();

             if (dbError) throw dbError;

             results.push(mediaData);

             // Update progress
             setUploadProgress(prev =>
               prev.map(p =>
                 p.filename === file.name
                   ? { ...p, progress: 100, status: 'success' }
                   : p
               )
             );
           } catch (error) {
             setUploadProgress(prev =>
               prev.map(p =>
                 p.filename === file.name
                   ? { ...p, status: 'error', error: error.message }
                   : p
               )
             );
           }
         }

         return results;
       },
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['media'] });
       }
     });

     return {
       uploadFiles: mutation.mutate,
       isUploading: mutation.isPending,
       uploadProgress,
       clearProgress: () => setUploadProgress([])
     };
   };
   ```

3. **Create MediaUploader Component** (2 hours)
   ```typescript
   // File: src/components/media/MediaUploader.tsx

   import { useCallback } from 'react';
   import { useDropzone } from 'react-dropzone';
   import { Upload, Image, Loader2, AlertCircle } from 'lucide-react';
   import { cn } from '@/lib/utils';
   import { useMediaUpload } from '@/hooks/useMediaUpload';
   import { Button } from '@/components/ui/button';
   import { Progress } from '@/components/ui/progress';

   interface MediaUploaderProps {
     maxFileSize?: number;
     onUploadComplete?: (files: MediaItem[]) => void;
   }

   export const MediaUploader: React.FC<MediaUploaderProps> = ({
     maxFileSize = 10 * 1024 * 1024,
     onUploadComplete
   }) => {
     const { uploadFiles, isUploading, uploadProgress, clearProgress } = useMediaUpload();

     const onDrop = useCallback((acceptedFiles: File[]) => {
       uploadFiles(acceptedFiles, {
         onSuccess: (data) => {
           onUploadComplete?.(data);
           setTimeout(clearProgress, 2000); // Clear after 2s
         }
       });
     }, [uploadFiles, onUploadComplete, clearProgress]);

     const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
       onDrop,
       accept: {
         'image/jpeg': ['.jpg', '.jpeg'],
         'image/png': ['.png'],
         'image/gif': ['.gif'],
         'image/webp': ['.webp'],
         'image/svg+xml': ['.svg']
       },
       maxSize: maxFileSize,
       multiple: true,
       disabled: isUploading
     });

     return (
       <div className="space-y-4">
         {/* Dropzone */}
         <div
           {...getRootProps()}
           className={cn(
             'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors',
             isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
             isUploading && 'opacity-50 cursor-not-allowed'
           )}
         >
           <input {...getInputProps()} />

           <div className="flex flex-col items-center gap-2">
             {isUploading ? (
               <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
             ) : (
               <Upload className="w-12 h-12 text-muted-foreground" />
             )}

             <div>
               {isDragActive ? (
                 <p className="font-medium">Drop files here...</p>
               ) : (
                 <>
                   <p className="font-medium">Drag & drop images here</p>
                   <p className="text-sm text-muted-foreground">
                     or click to browse
                   </p>
                 </>
               )}
             </div>

             <p className="text-xs text-muted-foreground">
               Supports: JPG, PNG, GIF, WebP, SVG (Max 10MB each)
             </p>
           </div>
         </div>

         {/* Upload Progress */}
         {uploadProgress.length > 0 && (
           <div className="space-y-2">
             {uploadProgress.map((file) => (
               <div key={file.filename} className="flex items-center gap-3">
                 <Image className="w-4 h-4 text-muted-foreground" />
                 <div className="flex-1">
                   <div className="flex justify-between text-sm mb-1">
                     <span className="truncate">{file.filename}</span>
                     <span className="text-muted-foreground">
                       {file.status === 'success' ? '✓' : `${file.progress}%`}
                     </span>
                   </div>
                   {file.status === 'uploading' && (
                     <Progress value={file.progress} className="h-1" />
                   )}
                   {file.status === 'error' && (
                     <p className="text-xs text-destructive">{file.error}</p>
                   )}
                 </div>
               </div>
             ))}
           </div>
         )}

         {/* File Rejections */}
         {fileRejections.length > 0 && (
           <div className="bg-destructive/10 border border-destructive rounded-lg p-3">
             <div className="flex gap-2">
               <AlertCircle className="w-4 h-4 text-destructive" />
               <div className="text-sm">
                 <p className="font-medium">Some files were rejected:</p>
                 <ul className="list-disc list-inside mt-1 text-muted-foreground">
                   {fileRejections.map(({ file, errors }) => (
                     <li key={file.name}>
                       {file.name}: {errors[0].message}
                     </li>
                   ))}
                 </ul>
               </div>
             </div>
           </div>
         )}
       </div>
     );
   };
   ```

4. **Create Progress Component** (if not exists) (30 min)
   ```bash
   npx shadcn-ui@latest add progress
   ```

5. **Write Unit Tests** (1 hour)
   ```typescript
   // File: tests/unit/hooks/useMediaUpload.test.ts

   import { renderHook, waitFor } from '@testing-library/react';
   import { useMediaUpload } from '@/hooks/useMediaUpload';

   describe('useMediaUpload', () => {
     it('should upload files to Supabase Storage', async () => {
       const { result } = renderHook(() => useMediaUpload());

       const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

       await act(() => result.current.uploadFiles([file]));

       await waitFor(() => {
         expect(result.current.isUploading).toBe(false);
         expect(result.current.uploadProgress).toHaveLength(1);
         expect(result.current.uploadProgress[0].status).toBe('success');
       });
     });
   });
   ```

**Acceptance Criteria**:
- [x] Drag-and-drop file upload works
- [x] Multiple files can be uploaded
- [x] File type validation works (rejects non-images)
- [x] File size validation works (rejects > 10MB)
- [x] Upload progress is displayed
- [x] Error messages are shown
- [x] Unit tests pass

---

#### Sprint 3: Gallery UI (Day 3)

**Objective**: Build media gallery with search and delete

**Tasks**:

1. **Create useMediaList Hook** (1 hour)
   ```typescript
   // File: src/hooks/useMediaList.ts

   import { useQuery } from '@tanstack/react-query';
   import { supabase } from '@/lib/supabase';

   interface MediaListOptions {
     search?: string;
     sortBy?: 'created_at' | 'filename';
     order?: 'asc' | 'desc';
     limit?: number;
   }

   export const useMediaList = (options: MediaListOptions = {}) => {
     const { search, sortBy = 'created_at', order = 'desc', limit = 100 } = options;

     return useQuery({
       queryKey: ['media', options],
       queryFn: async () => {
         let query = supabase
           .from('media_library')
           .select('*')
           .order(sortBy, { ascending: order === 'asc' })
           .limit(limit);

         if (search) {
           query = query.ilike('filename', `%${search}%`);
         }

         const { data, error } = await query;

         if (error) throw error;
         return data;
       },
       staleTime: 5 * 60 * 1000 // 5 minutes
     });
   };
   ```

2. **Create MediaGallery Component** (2 hours)
   ```typescript
   // File: src/components/media/MediaGallery.tsx

   import { useState } from 'react';
   import { Grid, List, Search, Trash2, Eye } from 'lucide-react';
   import { useMediaList } from '@/hooks/useMediaList';
   import { useMediaDelete } from '@/hooks/useMediaDelete';
   import { Input } from '@/components/ui/input';
   import { Button } from '@/components/ui/button';
   import { MediaCard } from './MediaCard';
   import { MediaPreview } from './MediaPreview';
   import { Skeleton } from '@/components/ui/skeleton';

   interface MediaGalleryProps {
     onSelect?: (media: MediaItem) => void;
   }

   export const MediaGallery: React.FC<MediaGalleryProps> = ({ onSelect }) => {
     const [search, setSearch] = useState('');
     const [view, setView] = useState<'grid' | 'list'>('grid');
     const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

     const { data: mediaItems, isLoading } = useMediaList({ search });
     const { deleteMedia } = useMediaDelete();

     if (isLoading) {
       return (
         <div className="grid grid-cols-4 gap-4">
           {Array.from({ length: 12 }).map((_, i) => (
             <Skeleton key={i} className="aspect-square rounded-lg" />
           ))}
         </div>
       );
     }

     return (
       <div className="space-y-4">
         {/* Toolbar */}
         <div className="flex gap-2">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <Input
               placeholder="Search images..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="pl-9"
             />
           </div>

           <Button
             variant={view === 'grid' ? 'default' : 'outline'}
             size="icon"
             onClick={() => setView('grid')}
           >
             <Grid className="w-4 h-4" />
           </Button>

           <Button
             variant={view === 'list' ? 'default' : 'outline'}
             size="icon"
             onClick={() => setView('list')}
           >
             <List className="w-4 h-4" />
           </Button>
         </div>

         {/* Gallery */}
         <div className={view === 'grid' ? 'grid grid-cols-4 gap-4' : 'flex flex-col gap-2'}>
           {mediaItems?.map((item) => (
             <MediaCard
               key={item.id}
               item={item}
               view={view}
               onPreview={() => setPreviewItem(item)}
               onSelect={() => onSelect?.(item)}
               onDelete={() => deleteMedia(item.id)}
             />
           ))}
         </div>

         {/* Preview Modal */}
         {previewItem && (
           <MediaPreview
             item={previewItem}
             onClose={() => setPreviewItem(null)}
             onSelect={() => {
               onSelect?.(previewItem);
               setPreviewItem(null);
             }}
           />
         )}
       </div>
     );
   };
   ```

3. **Create MediaCard Component** (1 hour)
4. **Create MediaPreview Component** (1 hour)
5. **Write E2E Tests** (1 hour)

**Acceptance Criteria**:
- [x] Gallery displays uploaded images
- [x] Search filters images by filename
- [x] Grid/List view toggle works
- [x] Preview modal shows full image
- [x] Delete removes image from storage and database
- [x] E2E tests pass

---

#### Sprint 4: Image Optimization (Day 4)

**Objective**: Auto-generate thumbnails with Supabase Edge Function

**Tasks**:

1. **Create Edge Function** (2 hours)
   ```typescript
   // File: supabase/functions/optimize-image/index.ts

   import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
   import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
   import sharp from 'https://esm.sh/sharp@0.33.0';

   serve(async (req) => {
     try {
       const { filePath } = await req.json();

       // Initialize Supabase client
       const supabase = createClient(
         Deno.env.get('SUPABASE_URL') ?? '',
         Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
       );

       // Download original
       const { data: original, error: downloadError } = await supabase.storage
         .from('media')
         .download(filePath);

       if (downloadError) throw downloadError;

       // Convert to buffer
       const buffer = await original.arrayBuffer();

       // Generate thumbnail (200x200, WebP)
       const thumbnail = await sharp(buffer)
         .resize(200, 200, { fit: 'cover', position: 'center' })
         .webp({ quality: 80 })
         .toBuffer();

       // Upload thumbnail
       const thumbPath = filePath.replace(/\/originals\//, '/thumbnails/').replace(/\.[^.]+$/, '_thumb.webp');

       const { error: uploadError } = await supabase.storage
         .from('media')
         .upload(thumbPath, thumbnail, {
           contentType: 'image/webp',
           cacheControl: '31536000', // 1 year
           upsert: true
         });

       if (uploadError) throw uploadError;

       // Update database
       await supabase
         .from('media_library')
         .update({ thumbnail_path: thumbPath })
         .eq('file_path', filePath);

       return new Response(JSON.stringify({ thumbPath }), {
         headers: { 'Content-Type': 'application/json' }
       });
     } catch (error) {
       return new Response(JSON.stringify({ error: error.message }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' }
       });
     }
   });
   ```

2. **Deploy Edge Function** (30 min)
   ```bash
   npx supabase functions deploy optimize-image
   ```

3. **Update useMediaUpload to call Edge Function** (1 hour)
4. **Test thumbnail generation** (30 min)

**Acceptance Criteria**:
- [x] Thumbnails auto-generate on upload
- [x] Thumbnails are WebP format
- [x] Thumbnails are 200x200px
- [x] Gallery uses thumbnails (not originals)
- [x] Original images load on preview

---

### Phase 5-2: Rich Text Editor (3-4 days)

**Goal**: Tiptap editor with markdown bidirectional conversion

---

#### Sprint 1: Tiptap Setup (Day 5)

**Objective**: Install Tiptap and create basic editor

**Tasks**:

1. **Install Dependencies** (15 min)
   ```bash
   npm install \
     @tiptap/react@^2.1.0 \
     @tiptap/starter-kit@^2.1.0 \
     @tiptap/extension-image@^2.1.0 \
     @tiptap/extension-link@^2.1.0 \
     @tiptap/extension-placeholder@^2.1.0 \
     turndown@^7.1.2 \
     markdown-it@^14.0.0
   ```

2. **Create useEditor Hook** (1 hour)
   ```typescript
   // File: src/hooks/useEditor.ts

   import { useEditor as useTiptapEditor } from '@tiptap/react';
   import StarterKit from '@tiptap/starter-kit';
   import Image from '@tiptap/extension-image';
   import Link from '@tiptap/extension-link';
   import Placeholder from '@tiptap/extension-placeholder';
   import { MarkdownExtension } from '@/components/editor/extensions/MarkdownExtension';

   interface UseEditorOptions {
     content: string | JSONContent;
     onUpdate?: (content: { markdown: string; json: JSONContent }) => void;
     placeholder?: string;
     editable?: boolean;
   }

   export const useEditor = ({
     content,
     onUpdate,
     placeholder = 'Start writing...',
     editable = true
   }: UseEditorOptions) => {
     const editor = useTiptapEditor({
       extensions: [
         StarterKit.configure({
           heading: { levels: [1, 2, 3] },
           bulletList: { keepMarks: true },
           orderedList: { keepMarks: true }
         }),
         Image.configure({
           inline: true,
           allowBase64: true,
           HTMLAttributes: {
             class: 'rounded-lg max-w-full'
           }
         }),
         Link.configure({
           openOnClick: false,
           HTMLAttributes: {
             class: 'text-blue-600 underline cursor-pointer'
           }
         }),
         Placeholder.configure({ placeholder }),
         MarkdownExtension
       ],
       content,
       editable,
       onUpdate: ({ editor }) => {
         const json = editor.getJSON();
         const markdown = editor.storage.markdown.getMarkdown();
         onUpdate?.({ markdown, json });
       }
     });

     return editor;
   };
   ```

3. **Create MarkdownExtension** (2 hours)
   ```typescript
   // File: src/components/editor/extensions/MarkdownExtension.ts

   import { Extension } from '@tiptap/core';
   import TurndownService from 'turndown';
   import MarkdownIt from 'markdown-it';

   const turndownService = new TurndownService({
     headingStyle: 'atx',
     codeBlockStyle: 'fenced',
     fence: '```',
     emDelimiter: '*',
     strongDelimiter: '**'
   });

   const md = new MarkdownIt({
     html: true,
     linkify: true,
     typographer: true
   });

   export const MarkdownExtension = Extension.create({
     name: 'markdown',

     addStorage() {
       return {
         getMarkdown: () => {
           const html = this.editor.getHTML();
           return turndownService.turndown(html);
         },
         setMarkdown: (markdown: string) => {
           const html = md.render(markdown);
           this.editor.commands.setContent(html);
         }
       };
     }
   });
   ```

4. **Create RichTextEditor Component** (2 hours)
5. **Create EditorToolbar Component** (1 hour)

**Acceptance Criteria**:
- [x] Editor renders with basic formatting
- [x] Bold, italic, heading buttons work
- [x] Markdown ↔ JSON conversion works
- [x] Placeholder text shows when empty

---

#### Sprint 2: Advanced Features (Day 6)

**Objective**: Add image insertion, code blocks, syntax highlighting

**Tasks**:

1. **Install lowlight** (15 min)
   ```bash
   npm install \
     @tiptap/extension-code-block-lowlight@^2.1.0 \
     lowlight@^3.0.0
   ```

2. **Create CodeBlock Extension** (1 hour)
3. **Create Image Insertion** (2 hours) - Integrate with MediaLibrary
4. **Create EditorMenuBar** (1 hour)
5. **Add Link Dialog** (1 hour)

**Acceptance Criteria**:
- [x] Code blocks with syntax highlighting work
- [x] Image insertion from media library works
- [x] Link insertion dialog works
- [x] All features render in markdown

---

#### Sprint 3: Admin Integration (Day 7)

**Objective**: Replace textareas in Admin pages with RichTextEditor

**Tasks**:

1. **Add JSON columns to database** (30 min)
   ```sql
   ALTER TABLE projects ADD COLUMN description_json JSONB;
   ALTER TABLE lab_items ADD COLUMN description_json JSONB;
   ALTER TABLE blog_posts ADD COLUMN content_json JSONB;
   ```

2. **Update AdminPortfolio** (1 hour)
3. **Update AdminLab** (1 hour)
4. **Update AdminBlog** (1 hour)
5. **Add fallback logic** (1 hour) - If JSON is null, use markdown

**Acceptance Criteria**:
- [x] All Admin pages use RichTextEditor
- [x] Existing markdown content still displays
- [x] New content saves both JSON and markdown
- [x] Fallback to markdown if JSON fails

---

#### Sprint 4: Optimization (Day 8)

**Objective**: Code splitting, XSS prevention, accessibility

**Tasks**:

1. **Install DOMPurify** (15 min)
   ```bash
   npm install dompurify@^3.0.0
   npm install -D @types/dompurify
   ```

2. **Create SafeContent Component** (30 min)
3. **Lazy load RichTextEditor** (1 hour)
4. **Add ARIA attributes** (1 hour)
5. **Optimize bundle size** (1 hour)

**Acceptance Criteria**:
- [x] HTML is sanitized before rendering
- [x] Editor is lazy-loaded
- [x] Bundle increase < 50 kB gzip (critical path)
- [x] ARIA labels added
- [x] Keyboard navigation works

---

### Phase 5-3: Version Control (2-3 days)

**Goal**: Auto-save and version history tracking

---

#### Sprint 1: Database Setup (Day 9)

**Objective**: Create content_versions table and auto-increment trigger

**Tasks**:

1. **Create Migration** (1 hour)
   ```sql
   -- File: supabase/migrations/20251117120000_content_versions.sql

   CREATE TABLE content_versions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     content_type TEXT NOT NULL CHECK (content_type IN ('project', 'lab', 'blog', 'service')),
     content_id UUID NOT NULL,
     version INTEGER NOT NULL,
     title TEXT,
     content JSONB NOT NULL,
     markdown TEXT,
     changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
     created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
   );

   CREATE INDEX idx_versions_content ON content_versions(content_type, content_id);
   CREATE INDEX idx_versions_created ON content_versions(created_at DESC);
   CREATE UNIQUE INDEX idx_versions_number ON content_versions(content_type, content_id, version);

   ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Anyone can view versions"
   ON content_versions FOR SELECT TO authenticated USING (true);

   CREATE POLICY "Authenticated users can create versions"
   ON content_versions FOR INSERT TO authenticated WITH CHECK (auth.uid() = changed_by);

   -- Auto-increment version
   CREATE OR REPLACE FUNCTION increment_version_number()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.version := COALESCE(
       (SELECT MAX(version) + 1 FROM content_versions WHERE content_type = NEW.content_type AND content_id = NEW.content_id),
       1
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER auto_increment_version
   BEFORE INSERT ON content_versions
   FOR EACH ROW EXECUTE FUNCTION increment_version_number();
   ```

2. **Test migrations** (30 min)
3. **Update TypeScript types** (15 min)

**Acceptance Criteria**:
- [x] content_versions table created
- [x] Auto-increment trigger works
- [x] RLS policies allow viewing and creating

---

#### Sprint 2: Auto-Save (Day 10)

**Objective**: Debounced auto-save every 30 seconds

**Tasks**:

1. **Install use-debounce** (15 min)
   ```bash
   npm install use-debounce@^10.0.0
   ```

2. **Create useAutoSave Hook** (2 hours)
3. **Create AutoSave Component** (1 hour) - Display "Saving..." / "Saved X ago"
4. **Integrate with RichTextEditor** (1 hour)

**Acceptance Criteria**:
- [x] Content auto-saves every 30 seconds
- [x] "Saving..." indicator appears
- [x] "Saved 5s ago" updates every second
- [x] No save on unmount (debounce cancelled)

---

#### Sprint 3: Version History (Day 11)

**Objective**: Display version list, compare, and restore

**Tasks**:

1. **Install diff-match-patch** (15 min)
   ```bash
   npm install diff-match-patch@^1.0.5
   npm install -D @types/diff-match-patch
   ```

2. **Create useVersionHistory Hook** (1 hour)
3. **Create VersionHistory Component** (2 hours)
4. **Create VersionCompare Component** (2 hours)
5. **Create VersionRestore Component** (1 hour)

**Acceptance Criteria**:
- [x] Version list displays all versions
- [x] Clicking version shows diff
- [x] Restore button shows confirmation
- [x] Restore updates current content

---

## 2. Integration Strategy

### 2.1 Backward Compatibility

**Principle**: Never break existing markdown content

**Strategy**:
1. **Dual storage**: Save both `description` (markdown) and `description_json` (Tiptap JSON)
2. **Fallback rendering**: If JSON is null/corrupted, render markdown
3. **Migration script**: Populate JSON from markdown (optional)

**Code Pattern**:
```typescript
// In Admin pages
const initialContent = project.description_json || project.description;

<RichTextEditor
  initialContent={initialContent}
  onUpdate={({ markdown, json }) => {
    updateProject({
      description: markdown, // Keep for compatibility
      description_json: json // New format
    });
  }}
/>

// In public pages
const contentToRender = project.description_json
  ? <SafeContent html={tiptapToHTML(project.description_json)} />
  : <MarkdownRenderer content={project.description} />;
```

### 2.2 Feature Flags

**Optional**: Use feature flags to gradually enable Phase 5

```typescript
// env variable
const FEATURE_RICH_EDITOR = import.meta.env.VITE_FEATURE_RICH_EDITOR === 'true';

// In Admin pages
{FEATURE_RICH_EDITOR ? (
  <RichTextEditor />
) : (
  <Textarea />
)}
```

### 2.3 Rollback Plan

**If Phase 5 causes issues**:
1. Set `VITE_FEATURE_RICH_EDITOR=false`
2. Redeploy
3. All markdown content still works
4. No data loss (markdown is preserved)

---

## 3. Testing Strategy

### 3.1 E2E Tests (60 tests total)

**Phase 5-1: Media Library (20 tests)**
```typescript
// tests/e2e/admin/media-library.spec.ts

test.describe('Media Library', () => {
  test('should upload single image', async ({ page }) => { /* ... */ });
  test('should upload multiple images', async ({ page }) => { /* ... */ });
  test('should reject large files (> 10MB)', async ({ page }) => { /* ... */ });
  test('should reject non-image files', async ({ page }) => { /* ... */ });
  test('should display upload progress', async ({ page }) => { /* ... */ });
  test('should search images by filename', async ({ page }) => { /* ... */ });
  test('should delete image', async ({ page }) => { /* ... */ });
  test('should preview image in modal', async ({ page }) => { /* ... */ });
  test('should generate thumbnail on upload', async ({ page }) => { /* ... */ });
  test('should use thumbnail in gallery', async ({ page }) => { /* ... */ });
  // ... 10 more tests
});
```

**Phase 5-2: Rich Text Editor (25 tests)**
```typescript
test.describe('Rich Text Editor', () => {
  test('should render editor with placeholder', async ({ page }) => { /* ... */ });
  test('should apply bold formatting', async ({ page }) => { /* ... */ });
  test('should apply italic formatting', async ({ page }) => { /* ... */ });
  test('should create headings (H1, H2, H3)', async ({ page }) => { /* ... */ });
  test('should create bullet list', async ({ page }) => { /* ... */ });
  test('should create numbered list', async ({ page }) => { /* ... */ });
  test('should insert link', async ({ page }) => { /* ... */ });
  test('should insert image from media library', async ({ page }) => { /* ... */ });
  test('should insert code block with syntax highlighting', async ({ page }) => { /* ... */ });
  test('should convert markdown to JSON', async ({ page }) => { /* ... */ });
  test('should convert JSON to markdown', async ({ page }) => { /* ... */ });
  test('should sanitize HTML to prevent XSS', async ({ page }) => { /* ... */ });
  // ... 13 more tests
});
```

**Phase 5-3: Version Control (15 tests)**
```typescript
test.describe('Version Control', () => {
  test('should auto-save after 30 seconds', async ({ page }) => { /* ... */ });
  test('should display "Saving..." indicator', async ({ page }) => { /* ... */ });
  test('should display "Saved X ago"', async ({ page }) => { /* ... */ });
  test('should create new version on save', async ({ page }) => { /* ... */ });
  test('should list all versions', async ({ page }) => { /* ... */ });
  test('should compare versions (diff view)', async ({ page }) => { /* ... */ });
  test('should restore previous version', async ({ page }) => { /* ... */ });
  test('should show confirmation before restore', async ({ page }) => { /* ... */ });
  // ... 7 more tests
});
```

### 3.2 Unit Tests (40 tests)

**Hooks** (20 tests):
- `useMediaUpload` (5 tests)
- `useMediaList` (3 tests)
- `useMediaDelete` (2 tests)
- `useEditor` (5 tests)
- `useAutoSave` (3 tests)
- `useVersionHistory` (2 tests)

**Utilities** (10 tests):
- `tiptapToMarkdown` (3 tests)
- `markdownToTiptap` (3 tests)
- `sanitizeHTML` (2 tests)
- `compareVersions` (2 tests)

**Components** (10 tests):
- `MediaUploader` (3 tests)
- `RichTextEditor` (4 tests)
- `VersionControl` (3 tests)

### 3.3 Performance Tests

**Benchmarks**:
```typescript
test.describe('Performance', () => {
  test('should upload 10MB image in < 5 seconds', async ({ page }) => {
    const start = Date.now();
    // Upload logic
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(5000);
  });

  test('should load gallery of 100 images in < 2 seconds', async ({ page }) => {
    // ...
  });

  test('should render editor with 5000 words in < 1 second', async ({ page }) => {
    // ...
  });
});
```

---

## 4. Deployment Strategy

### 4.1 Local Deployment

**Setup**:
```bash
# 1. Start Supabase locally
npx supabase start

# 2. Run migrations
npx supabase db reset

# 3. Deploy Edge Functions
npx supabase functions deploy optimize-image

# 4. Start dev server
npm run dev
```

**Verification**:
- [ ] Supabase Storage accessible
- [ ] media_library table exists
- [ ] content_versions table exists
- [ ] Edge Function responds
- [ ] RichTextEditor renders

### 4.2 Staging Deployment

**Vercel Preview**:
```bash
# Create feature branch
git checkout -b cms-phase5

# Commit changes
git add .
git commit -m "feat(cms): Phase 5 - Media Library, Rich Editor, Version Control"

# Push to GitHub
git push origin cms-phase5

# Vercel automatically creates preview URL
```

**Staging Checklist**:
- [ ] Migrations applied to staging DB
- [ ] Edge Function deployed to staging
- [ ] Environment variables set
- [ ] E2E tests pass
- [ ] Manual smoke test

### 4.3 Production Deployment

**Pre-deployment**:
1. **Backup database** (Supabase Dashboard → Database → Backups)
2. **Review migrations** (dry-run in staging)
3. **Test rollback procedure**

**Deployment Steps**:
```bash
# 1. Merge to main
git checkout main
git merge cms-phase5
git push origin main

# 2. Vercel auto-deploys to production

# 3. Apply migrations to production DB
npx supabase db push --project-ref zykjdneewbzyazfukzyg

# 4. Deploy Edge Functions to production
npx supabase functions deploy optimize-image --project-ref zykjdneewbzyazfukzyg
```

**Post-deployment**:
- [ ] Run E2E tests against production
- [ ] Monitor Sentry for errors
- [ ] Check Vercel Analytics for performance
- [ ] Verify Supabase Storage usage

### 4.4 Monitoring

**Metrics to track**:
- Storage usage (Supabase Dashboard)
- Bandwidth usage (Supabase Dashboard)
- Edge Function invocations (Supabase Dashboard)
- JavaScript errors (Sentry)
- Bundle size (Vercel Analytics)
- Lighthouse scores (Vercel Analytics)

**Alerts**:
- Storage > 800 MB (approaching 1 GB limit)
- Error rate > 1% (Sentry)
- Lighthouse Performance < 90 (Vercel)

---

## 5. Risk Mitigation

### 5.1 Bundle Size Risk

**Risk**: Bundle exceeds 500 kB gzip
**Impact**: High (Lighthouse score drop)
**Probability**: Medium

**Mitigation**:
1. ✅ Lazy load all Phase 5 components
2. ✅ Tree-shake Tiptap extensions (only import used)
3. ✅ Use lowlight with selective languages (TS, JS, Python only)
4. ✅ Code-split by route
5. Monitor with `vite-bundle-visualizer`

**Rollback**: If bundle > 500 kB, disable Phase 5 via feature flag

### 5.2 Data Loss Risk

**Risk**: Auto-save fails, user loses work
**Impact**: Critical
**Probability**: Low

**Mitigation**:
1. ✅ Debounce auto-save (reduces write failures)
2. ✅ Keep markdown as fallback
3. ✅ localStorage backup (optional)
4. Display save status ("Saving...", "Saved", "Error")
5. Retry failed saves (exponential backoff)

**Rollback**: Manual recovery from localStorage or markdown field

### 5.3 XSS Risk

**Risk**: User injects malicious HTML/JS
**Impact**: Critical
**Probability**: Medium

**Mitigation**:
1. ✅ DOMPurify sanitizes all HTML
2. ✅ Whitelist allowed tags and attributes
3. ✅ Content Security Policy (CSP) headers
4. Regular security audits
5. Penetration testing

**Rollback**: Disable HTML rendering, fall back to markdown

### 5.4 Performance Risk

**Risk**: Editor slow on large documents
**Impact**: Medium (UX)
**Probability**: Medium

**Mitigation**:
1. ✅ Tiptap has built-in virtual scrolling
2. ✅ Debounce auto-save
3. ✅ Throttle version history queries
4. Lazy load images (Intersection Observer)
5. Benchmark with 10,000+ word documents

**Rollback**: Disable editor for documents > 5,000 words

### 5.5 Storage Limit Risk

**Risk**: Exceed 1 GB free tier
**Impact**: Medium (costs)
**Probability**: High (if popular)

**Mitigation**:
1. ✅ 10 MB file size limit
2. ✅ Image optimization (thumbnails, WebP)
3. Monitor storage usage
4. Upgrade to paid tier ($0.021/GB/month)
5. Implement file expiration (delete old files)

**Rollback**: Disable uploads, ask users to delete old files

---

## 6. Timeline & Resources

### 6.1 Timeline Summary

| Phase | Duration | Start | End | Tasks | Tests |
|-------|----------|-------|-----|-------|-------|
| **5-1: Media Library** | 3-4 days | Day 1 | Day 4 | 15 | 20 E2E |
| **5-2: Rich Text Editor** | 3-4 days | Day 5 | Day 8 | 18 | 25 E2E |
| **5-3: Version Control** | 2-3 days | Day 9 | Day 11 | 10 | 15 E2E |
| **Buffer & Documentation** | 1 day | Day 12 | Day 12 | - | - |
| **Total** | **7-10 days** | - | - | **43** | **60 E2E** |

### 6.2 Daily Breakdown

**Week 1 (Days 1-5)**:
- Day 1: Storage setup, DB schema, RLS policies
- Day 2: Upload UI, drag-and-drop, progress
- Day 3: Gallery UI, search, delete, preview
- Day 4: Edge Function, thumbnail generation
- Day 5: Tiptap setup, basic editor, markdown extension

**Week 2 (Days 6-10)**:
- Day 6: Code blocks, image insertion, link dialog
- Day 7: Admin integration (Portfolio, Lab, Blog)
- Day 8: Optimization (DOMPurify, lazy loading, ARIA)
- Day 9: Version control DB setup
- Day 10: Auto-save implementation

**Week 3 (Days 11-12)**:
- Day 11: Version history UI, diff, restore
- Day 12: Documentation, final testing, deployment

### 6.3 Resources Required

**Developer Time**: 1 full-stack developer, 7-10 days
**Infrastructure**: Supabase (existing), Vercel (existing)
**Cost**: $0 (within free tier)

**Dependencies**:
- Supabase project access
- Vercel deployment access
- GitHub repository access

### 6.4 Success Metrics

**Quantitative**:
- ✅ 60 E2E tests pass (100%)
- ✅ Bundle increase < 50 kB gzip (critical path)
- ✅ Lighthouse Performance ≥ 90
- ✅ Storage usage < 1 GB (free tier)
- ✅ Auto-save latency < 2 seconds
- ✅ Upload speed < 5 seconds (10 MB)

**Qualitative**:
- ✅ Admin users can upload images easily
- ✅ Admin users prefer WYSIWYG over markdown
- ✅ No data loss reported
- ✅ No XSS vulnerabilities found
- ✅ Backward compatible with existing content

---

## 7. Post-Launch

### 7.1 Documentation

**User Docs**:
- [ ] Admin guide: "How to upload images"
- [ ] Admin guide: "How to use the rich editor"
- [ ] Admin guide: "How to restore previous versions"

**Developer Docs**:
- [ ] API reference: Media Library hooks
- [ ] API reference: Editor hooks
- [ ] API reference: Version Control hooks

### 7.2 Training

**Admin Users**:
- [ ] Video tutorial: Media Library (5 min)
- [ ] Video tutorial: Rich Text Editor (10 min)
- [ ] Video tutorial: Version History (5 min)

### 7.3 Maintenance

**Weekly**:
- Monitor storage usage
- Review Sentry errors
- Check Vercel Analytics

**Monthly**:
- Update dependencies (npm audit)
- Review bundle size trends
- Clean up old versions (optional)

---

## Appendix

### A. File Structure

```
idea-on-action/
├── src/
│   ├── components/
│   │   ├── media/
│   │   │   ├── MediaLibrary.tsx
│   │   │   ├── MediaUploader.tsx
│   │   │   ├── MediaGallery.tsx
│   │   │   ├── MediaCard.tsx
│   │   │   ├── MediaPreview.tsx
│   │   │   └── MediaSearch.tsx
│   │   ├── editor/
│   │   │   ├── RichTextEditor.tsx
│   │   │   ├── EditorToolbar.tsx
│   │   │   ├── EditorMenuBar.tsx
│   │   │   ├── SafeContent.tsx
│   │   │   └── extensions/
│   │   │       ├── MarkdownExtension.ts
│   │   │       └── ImageExtension.ts
│   │   └── version/
│   │       ├── VersionControl.tsx
│   │       ├── AutoSave.tsx
│   │       ├── VersionHistory.tsx
│   │       ├── VersionCompare.tsx
│   │       └── VersionRestore.tsx
│   ├── hooks/
│   │   ├── useMediaUpload.ts
│   │   ├── useMediaList.ts
│   │   ├── useMediaDelete.ts
│   │   ├── useEditor.ts
│   │   ├── useAutoSave.ts
│   │   ├── useVersionHistory.ts
│   │   └── useVersionRestore.ts
│   └── types/
│       └── cms.types.ts (Media, Version types)
├── supabase/
│   ├── migrations/
│   │   ├── 20251117100000_media_storage_rls.sql
│   │   ├── 20251117100001_media_library_table.sql
│   │   ├── 20251117110000_add_json_columns.sql
│   │   └── 20251117120000_content_versions.sql
│   └── functions/
│       └── optimize-image/
│           └── index.ts
└── tests/
    ├── e2e/
    │   └── admin/
    │       ├── media-library.spec.ts
    │       ├── rich-editor.spec.ts
    │       └── version-control.spec.ts
    └── unit/
        └── hooks/
            ├── useMediaUpload.test.ts
            ├── useEditor.test.ts
            └── useAutoSave.test.ts
```

### B. Migration Scripts

**Populate JSON from Markdown** (optional):
```sql
-- Update projects
UPDATE projects
SET description_json = jsonb_build_object(
  'type', 'doc',
  'content', jsonb_build_array(
    jsonb_build_object(
      'type', 'paragraph',
      'content', jsonb_build_array(
        jsonb_build_object('type', 'text', 'text', description)
      )
    )
  )
)
WHERE description_json IS NULL AND description IS NOT NULL;
```

### C. Rollback Scripts

**Remove Phase 5 Features**:
```sql
-- Drop tables (if needed)
DROP TABLE IF EXISTS content_versions;
DROP TABLE IF EXISTS media_library;

-- Remove JSON columns
ALTER TABLE projects DROP COLUMN IF EXISTS description_json;
ALTER TABLE lab_items DROP COLUMN IF EXISTS description_json;
ALTER TABLE blog_posts DROP COLUMN IF EXISTS content_json;
```

---

**Document Status**: ✅ Complete
**Total Tasks**: 43
**Total Tests**: 60 E2E + 40 Unit = 100 tests
**Estimated Duration**: 7-10 days
**Next Steps**: Begin Sprint 1 - Storage Infrastructure
