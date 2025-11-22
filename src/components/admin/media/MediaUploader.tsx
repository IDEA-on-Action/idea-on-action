/**
 * MediaUploader Component
 *
 * Drag & drop file upload component with validation and progress tracking.
 * Uses react-dropzone for drag-and-drop functionality.
 */

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatFileSize } from '@/lib/cms-utils';

// =====================================================
// Types
// =====================================================

export interface MediaUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  isUploading?: boolean;
  uploadProgress?: Record<string, number>;
  maxFileSize?: number; // bytes
  allowedMimeTypes?: string[];
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

interface QueuedFile {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
}

// =====================================================
// Component
// =====================================================

export function MediaUploader({
  onUpload,
  isUploading = false,
  uploadProgress = {},
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  multiple = true,
  disabled = false,
  className,
}: MediaUploaderProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [queuedFiles, setQueuedFiles] = React.useState<QueuedFile[]>([]);

  // ===================================================================
  // File Drop Handler
  // ===================================================================

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: { file: File; errors: { message: string }[] }[]) => {
      setError(null);

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const messages = rejectedFiles.map(({ file, errors }) =>
          `${file.name}: ${errors.map(e => e.message).join(', ')}`
        );
        setError(messages.join('\n'));
        return;
      }

      if (acceptedFiles.length === 0) return;

      // Add files to queue with preview
      const newQueuedFiles: QueuedFile[] = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        status: 'pending' as const,
        progress: 0,
      }));

      setQueuedFiles(prev => [...prev, ...newQueuedFiles]);

      // Upload files
      try {
        await onUpload(acceptedFiles);

        // Mark all as completed
        setQueuedFiles(prev =>
          prev.map(qf =>
            acceptedFiles.some(f => f.name === qf.file.name)
              ? { ...qf, status: 'completed' as const, progress: 100 }
              : qf
          )
        );

        // Clear queue after a delay
        setTimeout(() => {
          setQueuedFiles(prev => {
            // Cleanup preview URLs
            prev.forEach(qf => {
              if (acceptedFiles.some(f => f.name === qf.file.name)) {
                URL.revokeObjectURL(qf.preview);
              }
            });
            return prev.filter(qf => !acceptedFiles.some(f => f.name === qf.file.name));
          });
        }, 2000);
      } catch (err) {
        // Mark as error
        setQueuedFiles(prev =>
          prev.map(qf =>
            acceptedFiles.some(f => f.name === qf.file.name)
              ? { ...qf, status: 'error' as const, error: (err as Error).message }
              : qf
          )
        );
      }
    },
    [onUpload]
  );

  // ===================================================================
  // Remove File from Queue
  // ===================================================================

  const removeFile = useCallback((fileName: string) => {
    setQueuedFiles(prev => {
      const file = prev.find(qf => qf.file.name === fileName);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(qf => qf.file.name !== fileName);
    });
  }, []);

  // ===================================================================
  // Dropzone Configuration
  // ===================================================================

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: allowedMimeTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxFileSize,
    multiple,
    disabled: disabled || isUploading,
  });

  // ===================================================================
  // Render
  // ===================================================================

  return (
    <div className={cn('space-y-4', className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
          'hover:border-primary hover:bg-primary/5',
          isDragActive && !isDragReject && 'border-primary bg-primary/10',
          isDragReject && 'border-destructive bg-destructive/10',
          (disabled || isUploading) && 'opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent'
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-3">
          {isUploading ? (
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          ) : (
            <Upload className="h-10 w-10 text-muted-foreground" />
          )}

          <div className="text-sm">
            {isDragActive ? (
              isDragReject ? (
                <p className="text-destructive font-medium">Some files are not allowed</p>
              ) : (
                <p className="text-primary font-medium">Drop files here...</p>
              )
            ) : isUploading ? (
              <p className="text-muted-foreground">Uploading...</p>
            ) : (
              <>
                <p>
                  <span className="font-medium text-primary">Click to upload</span>
                  {' '}or drag and drop
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Images up to {formatFileSize(maxFileSize)}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="whitespace-pre-wrap">{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Queue */}
      {queuedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Upload Queue ({queuedFiles.length})
          </h4>
          <div className="space-y-2">
            {queuedFiles.map((qf) => {
              const progress = uploadProgress[qf.file.name] ?? qf.progress;
              return (
                <div
                  key={qf.file.name}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                >
                  {/* Preview */}
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <img
                      src={qf.preview}
                      alt={qf.file.name}
                      className="h-full w-full object-cover rounded"
                    />
                    {qf.status === 'completed' && (
                      <div className="absolute inset-0 bg-green-500/50 rounded flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{qf.file.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(qf.file.size)}
                    </div>
                    {qf.status === 'error' ? (
                      <div className="text-xs text-destructive mt-1">{qf.error}</div>
                    ) : qf.status !== 'completed' ? (
                      <Progress value={progress} className="mt-1 h-1" />
                    ) : null}
                  </div>

                  {/* Remove Button */}
                  {(qf.status === 'pending' || qf.status === 'error') && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => removeFile(qf.file.name)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaUploader;
