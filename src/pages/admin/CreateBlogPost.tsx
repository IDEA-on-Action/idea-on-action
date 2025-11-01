/**
 * Create Blog Post Page
 * Phase 11 Week 1: Blog System
 *
 * Admin page for creating new blog posts
 */

import { BlogPostForm } from '@/components/blog/BlogPostForm'

export default function CreateBlogPost() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Blog Post</h1>
        <p className="text-muted-foreground mt-1">
          Write and publish new content
        </p>
      </div>

      <BlogPostForm mode="create" />
    </div>
  )
}
