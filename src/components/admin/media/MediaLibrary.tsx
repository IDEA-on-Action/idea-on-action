/**
 * MediaLibrary Component
 *
 * Main container component for the media library.
 * Combines uploader, search, grid, and modal components.
 * Supports both standalone and modal selection modes.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  Search,
  Grid,
  LayoutList,
  Trash2,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDebounce } from '@/hooks/useDebounce';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { MediaUploader } from './MediaUploader';
import { MediaGrid } from './MediaGrid';
import { MediaModal } from './MediaModal';
import { toast } from 'sonner';
import type { MediaItem, MediaSearchParams } from '@/types/cms.types';

// =====================================================
// Types
// =====================================================

export interface MediaLibraryProps {
  /**
   * Mode: 'manage' for full library management, 'select' for picking images
   */
  mode?: 'manage' | 'select';

  /**
   * Called when an image is selected (in 'select' mode)
   */
  onSelect?: (item: MediaItem) => void;

  /**
   * Allow multiple selection
   */
  allowMultiple?: boolean;

  /**
   * Number of columns in grid
   */
  columns?: 2 | 3 | 4 | 5 | 6;

  /**
   * Additional class names
   */
  className?: string;
}

// =====================================================
// Component
// =====================================================

export function MediaLibrary({
  mode = 'manage',
  onSelect,
  allowMultiple = false,
  columns = 4,
  className,
}: MediaLibraryProps) {
  // ===================================================================
  // State
  // ===================================================================

  const [searchQuery, setSearchQuery] = useState('');
  const [mimeTypeFilter, setMimeTypeFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'created_at' | 'filename' | 'file_size'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 300);

  // ===================================================================
  // Build Search Params
  // ===================================================================

  const searchParams: MediaSearchParams = useMemo(() => ({
    search: debouncedSearch || undefined,
    mime_type: mimeTypeFilter || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
    page,
    per_page: 20,
  }), [debouncedSearch, mimeTypeFilter, sortBy, sortOrder, page]);

  // ===================================================================
  // Media Library Hook
  // ===================================================================

  const {
    mediaItems,
    totalCount,
    currentPage,
    totalPages,
    isLoading,
    isUploading,
    uploadProgress,
    isUpdating,
    isDeleting,
    refetch,
    uploadMedia,
    updateMedia,
    deleteMedia,
    getPublicUrl,
    allowedMimeTypes,
    maxFileSize,
  } = useMediaLibrary({ params: searchParams });

  // ===================================================================
  // Handlers
  // ===================================================================

  // Handle selection toggle
  const handleSelect = useCallback((id: string, selected: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (selected) {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, [allowMultiple]);

  // Handle item click (preview)
  const handleItemClick = useCallback((item: MediaItem) => {
    if (mode === 'select' && onSelect) {
      onSelect(item);
    } else {
      setPreviewItem(item);
    }
  }, [mode, onSelect]);

  // Handle edit
  const handleEdit = useCallback((item: MediaItem) => {
    setPreviewItem(item);
  }, []);

  // Handle delete single
  const handleDeleteSingle = useCallback((item: MediaItem) => {
    setSelectedIds(new Set([item.id]));
    setDeleteDialogOpen(true);
  }, []);

  // Handle delete selected
  const handleDeleteSelected = useCallback(() => {
    if (selectedIds.size > 0) {
      setDeleteDialogOpen(true);
    }
  }, [selectedIds]);

  // Confirm delete
  const confirmDelete = useCallback(() => {
    const ids = Array.from(selectedIds);
    deleteMedia(ids);
    setSelectedIds(new Set());
    setDeleteDialogOpen(false);
  }, [selectedIds, deleteMedia]);

  // Handle copy URL
  const handleCopyUrl = useCallback((url: string) => {
    toast.success('URL copied to clipboard');
  }, []);

  // Handle update
  const handleUpdate = useCallback((id: string, values: { alt_text?: string; filename?: string }) => {
    updateMedia({ id, values });
  }, [updateMedia]);

  // Handle upload
  const handleUpload = useCallback(async (files: File[]) => {
    await uploadMedia(files);
    setShowUploader(false);
  }, [uploadMedia]);

  // Select all / deselect all
  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === mediaItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(mediaItems.map(item => item.id)));
    }
  }, [selectedIds.size, mediaItems]);

  // ===================================================================
  // Render
  // ===================================================================

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select
            value={mimeTypeFilter}
            onValueChange={(value) => {
              setMimeTypeFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              <SelectItem value="image/jpeg">JPEG</SelectItem>
              <SelectItem value="image/png">PNG</SelectItem>
              <SelectItem value="image/gif">GIF</SelectItem>
              <SelectItem value="image/webp">WebP</SelectItem>
              <SelectItem value="image/svg">SVG</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={(value) => {
              const [by, order] = value.split('-') as ['created_at' | 'filename' | 'file_size', 'asc' | 'desc'];
              setSortBy(by);
              setSortOrder(order);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">Newest first</SelectItem>
              <SelectItem value="created_at-asc">Oldest first</SelectItem>
              <SelectItem value="filename-asc">Name (A-Z)</SelectItem>
              <SelectItem value="filename-desc">Name (Z-A)</SelectItem>
              <SelectItem value="file_size-desc">Largest first</SelectItem>
              <SelectItem value="file_size-asc">Smallest first</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? 'file' : 'files'}
            {selectedIds.size > 0 && ` (${selectedIds.size} selected)`}
          </span>

          {mode === 'manage' && selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedIds.size === mediaItems.length ? 'Deselect all' : 'Select all'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete ({selectedIds.size})
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowUploader(!showUploader)}
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Uploader (Collapsible) */}
      {showUploader && (
        <MediaUploader
          onUpload={handleUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          maxFileSize={maxFileSize}
          allowedMimeTypes={allowedMimeTypes}
          multiple
          className="border rounded-lg p-4 bg-muted/30"
        />
      )}

      {/* Media Grid */}
      <MediaGrid
        items={mediaItems}
        selectedIds={selectedIds}
        selectable={mode === 'manage' || allowMultiple}
        isLoading={isLoading}
        onSelect={handleSelect}
        onItemClick={handleItemClick}
        onEdit={mode === 'manage' ? handleEdit : undefined}
        onDelete={mode === 'manage' ? handleDeleteSingle : undefined}
        onCopyUrl={handleCopyUrl}
        columns={columns}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages || isLoading}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Preview Modal */}
      <MediaModal
        item={previewItem}
        open={!!previewItem}
        onOpenChange={(open) => !open && setPreviewItem(null)}
        onUpdate={mode === 'manage' ? handleUpdate : undefined}
        isUpdating={isUpdating}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.size} {selectedIds.size === 1 ? 'file' : 'files'}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default MediaLibrary;
