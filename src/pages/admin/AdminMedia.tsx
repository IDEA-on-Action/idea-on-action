/**
 * AdminMedia Page
 *
 * CMS Phase 5 - Media Library Admin Page
 * Provides full media management functionality for administrators.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Image, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MediaLibrary } from '@/components/admin/media';

// =====================================================
// Component
// =====================================================

export default function AdminMedia() {
  return (
    <>
      <Helmet>
        <title>Media Library - Admin | IDEA on Action</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Image className="h-8 w-8" />
              Media Library
            </h1>
            <p className="text-muted-foreground mt-1">
              Upload, organize, and manage your media files
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <HelpCircle className="h-5 w-5" />
                <span className="sr-only">Help</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[300px]">
              <p className="text-sm">
                Upload images up to 10MB. Supported formats: JPEG, PNG, GIF, WebP, SVG.
                Click on an image to preview or edit its details.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Media Library Card */}
        <Card>
          <CardHeader>
            <CardTitle>All Media</CardTitle>
            <CardDescription>
              Drag and drop files to upload, or click the Upload button.
              Use the search and filters to find specific files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MediaLibrary
              mode="manage"
              columns={4}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
