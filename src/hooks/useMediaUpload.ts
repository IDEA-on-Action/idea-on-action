/**
 * Media Upload Hook
 *
 * Specialized hook for media file uploads with progress tracking.
 * Separate from useMediaLibrary for better reusability across different components.
 *
 * Features:
 * - Single and multiple file upload
 * - Progress tracking per file
 * - File validation (size, type)
 * - Auto thumbnail URL generation
 * - Optimistic progress updates
 * - Error handling per file
 *
 * @example
 * const {
 *   uploadMedia,
 *   uploadMultiple,
 *   isUploading,
 *   progress,
 *   error,
 *   reset
 * } = useMediaUpload();
 *
 * // Single file
 * await uploadMedia(file);
 *
 * // Multiple files
 * await uploadMultiple(files);
 */

import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  MEDIA_BUCKET,
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  validateMediaFile,
  generateUniqueFilename,
  getImageDimensions,
} from '@/lib/media-utils';
import { mediaQueryKeys } from '@/hooks/useMediaLibrary';
import type { MediaItem, MediaItemInsert } from '@/types/cms.types';

// =====================================================
// Types
// =====================================================

/**
 * Upload options for customizing upload behavior
 */
export interface UploadOptions {
  /** Custom folder path within storage (default: user_id/year/month) */
  folder?: string;
  /** Custom filename (default: auto-generated) */
  filename?: string;
  /** Whether to skip database record creation (default: false) */
  skipDatabaseInsert?: boolean;
  /** Alt text for the uploaded image */
  altText?: string;
}

/**
 * Status of individual file upload
 */
export type UploadStatus = 'pending' | 'uploading' | 'processing' | 'success' | 'error';

/**
 * Upload progress entry for each file
 */
export interface UploadProgressEntry {
  file: File;
  status: UploadStatus;
  progress: number;
  error?: string;
  result?: MediaItem;
}

/**
 * Upload result containing uploaded media item
 */
export interface UploadResult {
  success: boolean;
  data?: MediaItem;
  error?: string;
  url?: string;
}

// =====================================================
// Hook Implementation
// =====================================================

export function useMediaUpload() {
  const queryClient = useQueryClient();

  // State
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, UploadProgressEntry>>({});
  const [error, setError] = useState<string | null>(null);

  // ===================================================================
  // Progress Helpers
  // ===================================================================

  /**
   * Update progress for a specific file
   */
  const updateProgress = useCallback((
    fileId: string,
    update: Partial<UploadProgressEntry>
  ) => {
    setProgress(prev => ({
      ...prev,
      [fileId]: {
        ...prev[fileId],
        ...update,
      },
    }));
  }, []);

  /**
   * Generate file ID for tracking
   */
  const getFileId = (file: File): string => {
    return `${file.name}-${file.size}-${file.lastModified}`;
  };

  // ===================================================================
  // Storage Path Generator
  // ===================================================================

  /**
   * Generate storage path for the file
   */
  const generateStoragePath = useCallback(async (
    file: File,
    options?: UploadOptions
  ): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('사용자 인증이 필요합니다.');
    }

    const uniqueFilename = options?.filename || generateUniqueFilename(file.name);
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');

    const folder = options?.folder || `${user.id}/${year}/${month}`;

    return `${folder}/${uniqueFilename}`;
  }, []);

  // ===================================================================
  // Single File Upload
  // ===================================================================

  /**
   * Upload a single media file to Supabase Storage
   */
  const uploadMedia = useCallback(async (
    file: File,
    options?: UploadOptions
  ): Promise<UploadResult> => {
    const fileId = getFileId(file);

    // Initialize progress
    setProgress(prev => ({
      ...prev,
      [fileId]: {
        file,
        status: 'pending',
        progress: 0,
      },
    }));
    setError(null);

    try {
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('사용자 인증이 필요합니다.');
      }

      // Validate file
      const validation = validateMediaFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Update status to uploading
      updateProgress(fileId, { status: 'uploading', progress: 10 });

      // Generate storage path
      const storagePath = await generateStoragePath(file, options);

      // Update progress
      updateProgress(fileId, { progress: 30 });

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(storagePath, file, {
          cacheControl: '31536000', // 1 year
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`업로드 실패: ${uploadError.message}`);
      }

      // Update progress
      updateProgress(fileId, { status: 'processing', progress: 60 });

      // Get image dimensions
      const dimensions = await getImageDimensions(file);

      // Update progress
      updateProgress(fileId, { progress: 80 });

      // Skip database insert if requested
      if (options?.skipDatabaseInsert) {
        const { data: urlData } = supabase.storage
          .from(MEDIA_BUCKET)
          .getPublicUrl(storagePath);

        updateProgress(fileId, {
          status: 'success',
          progress: 100,
        });

        return {
          success: true,
          url: urlData.publicUrl,
        };
      }

      // Insert metadata into database
      const insertData: MediaItemInsert = {
        filename: storagePath.split('/').pop() || file.name,
        original_filename: file.name,
        file_size: file.size,
        mime_type: file.type,
        storage_path: storagePath,
        uploaded_by: user.id,
        width: dimensions?.width || null,
        height: dimensions?.height || null,
        alt_text: options?.altText || null,
      };

      const { data: mediaItem, error: insertError } = await supabase
        .from('media_library')
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        // Cleanup uploaded file on database error
        await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);
        throw new Error(`데이터베이스 저장 실패: ${insertError.message}`);
      }

      // Update progress to complete
      updateProgress(fileId, {
        status: 'success',
        progress: 100,
        result: mediaItem as MediaItem,
      });

      // Invalidate media library queries
      queryClient.invalidateQueries({ queryKey: mediaQueryKeys.lists() });

      return {
        success: true,
        data: mediaItem as MediaItem,
      };
    } catch (err) {
      const errorMessage = (err as Error).message;

      updateProgress(fileId, {
        status: 'error',
        progress: 0,
        error: errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [queryClient, updateProgress, generateStoragePath]);

  // ===================================================================
  // Multiple Files Upload
  // ===================================================================

  /**
   * Upload multiple files sequentially
   */
  const uploadMultiple = useCallback(async (
    files: File[],
    options?: UploadOptions
  ): Promise<UploadResult[]> => {
    setIsUploading(true);
    setError(null);
    setProgress({});

    const results: UploadResult[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Upload files sequentially to avoid overwhelming the server
    for (const file of files) {
      const result = await uploadMedia(file, options);
      results.push(result);

      if (result.success) {
        successCount++;
      } else {
        errorCount++;
      }
    }

    setIsUploading(false);

    // Show summary toast
    if (successCount > 0 && errorCount === 0) {
      toast.success(`${successCount}개 파일이 업로드되었습니다.`);
    } else if (successCount > 0 && errorCount > 0) {
      toast.warning(`${successCount}개 성공, ${errorCount}개 실패`);
    } else if (errorCount > 0) {
      toast.error(`${errorCount}개 파일 업로드 실패`);
    }

    return results;
  }, [uploadMedia]);

  // ===================================================================
  // Utility Functions
  // ===================================================================

  /**
   * Reset upload state
   */
  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress({});
    setError(null);
  }, []);

  /**
   * Remove a specific file from progress tracking
   */
  const removeFromProgress = useCallback((fileId: string) => {
    setProgress(prev => {
      const next = { ...prev };
      delete next[fileId];
      return next;
    });
  }, []);

  /**
   * Get progress as array (useful for iteration)
   */
  const progressArray = Object.values(progress);

  /**
   * Get overall progress percentage
   */
  const overallProgress = progressArray.length > 0
    ? progressArray.reduce((sum, p) => sum + p.progress, 0) / progressArray.length
    : 0;

  // ===================================================================
  // Return API
  // ===================================================================

  return {
    // Methods
    uploadMedia,
    uploadMultiple,
    reset,
    removeFromProgress,

    // State
    isUploading,
    progress,
    progressArray,
    overallProgress,
    error,

    // Constants (for validation UI)
    allowedMimeTypes: ALLOWED_IMAGE_TYPES,
    maxFileSize: MAX_FILE_SIZE,
  };
}

export default useMediaUpload;
