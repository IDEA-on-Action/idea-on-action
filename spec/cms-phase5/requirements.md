# CMS Phase 5 - Requirements Specification

**Version**: 2.1.0
**Date**: 2025-11-17
**Status**: Draft
**Stage**: Specify (SDD Stage 1)

---

## Table of Contents

1. [Overview](#overview)
2. [User Stories](#user-stories)
3. [User Journeys](#user-journeys)
4. [Functional Requirements](#functional-requirements)
5. [Non-Functional Requirements](#non-functional-requirements)
6. [User Value Proposition](#user-value-proposition)
7. [Dependencies](#dependencies)

---

## Overview

### Purpose

CMS Phase 5 introduces three optional but high-value features that transform the content management experience from basic CRUD operations to a professional-grade content creation platform. These features address three critical pain points identified during CMS Phase 1-4 implementation:

1. **Media Management**: Admins currently have no way to upload, organize, or reuse images across different content types
2. **Content Editing**: Plain textarea fields provide poor editing experience with no formatting options
3. **Change Tracking**: No visibility into what changed, when, or ability to undo mistakes

### Scope

**In Scope**:
- Media library with upload, search, and management capabilities
- Rich text editor with markdown support and image embedding
- Automated version control system for all content types
- Integration with existing CMS Phase 1-4 components

**Out of Scope**:
- Video/audio file management (future Phase 6)
- Collaborative editing (real-time multi-user)
- Advanced image editing (crop, filter, effects)
- External media integrations (Unsplash, Pexels)

### Success Vision

After Phase 5, admins should be able to:
- Upload and manage all site images in one centralized library
- Write and format content using familiar rich text tools
- Track all content changes and restore previous versions with confidence
- Complete content creation tasks 50% faster than current workflow

---

## User Stories

### Epic 1: Media Library Management

#### US-1.1: Upload Images
**As an** admin,
**I want to** upload one or multiple images at once,
**So that** I can build a library of reusable visual assets without leaving the admin panel.

**Value**: Eliminates the need to use external image hosting or manually manage URLs.

**Acceptance Criteria**:
- Upload single or multiple files (up to 10 at once)
- Support drag-and-drop from desktop
- Support copy-paste from clipboard
- Show upload progress for each file
- Display success/error messages per file
- Validate file type (only images: jpg, png, gif, webp, svg)
- Validate file size (max 10MB per file)

#### US-1.2: Browse and Search Media
**As an** admin,
**I want to** browse all uploaded images and search by filename or tags,
**So that** I can quickly find the right image when creating content.

**Value**: Saves time finding assets in a growing media library.

**Acceptance Criteria**:
- Display images in grid layout with thumbnails
- Show image metadata (filename, size, upload date)
- Search by filename (fuzzy matching)
- Filter by file type
- Sort by upload date, filename, or file size
- Pagination for large libraries (20 images per page)

#### US-1.3: Insert Images into Content
**As an** admin,
**I want to** click on a library image to insert it into my content,
**So that** I don't have to copy-paste URLs manually.

**Value**: Streamlines the content creation workflow.

**Acceptance Criteria**:
- Click image to copy URL to clipboard
- Preview image before inserting
- Insert image directly into rich text editor
- Support multiple selection for batch insertion
- Display image dimensions and file size

#### US-1.4: Manage Image Lifecycle
**As an** admin,
**I want to** rename, delete, or organize my images,
**So that** I can keep my media library clean and organized.

**Value**: Maintains library quality and prevents clutter.

**Acceptance Criteria**:
- Rename image filename
- Delete image (with confirmation dialog)
- Show usage count (how many content items use this image)
- Prevent deletion if image is in use (with override option)
- Bulk delete multiple images
- View full-size image in lightbox

---

### Epic 2: Rich Text Editing

#### US-2.1: Format Text Visually
**As an** admin,
**I want to** format text using toolbar buttons (bold, italic, headings),
**So that** I don't have to remember markdown syntax.

**Value**: Lowers the barrier to creating well-formatted content.

**Acceptance Criteria**:
- Toolbar with common formatting options:
  - Headings (H1-H6)
  - Bold, Italic, Strikethrough
  - Bulleted list, Numbered list
  - Blockquote
  - Code inline, Code block
  - Horizontal rule
- Keyboard shortcuts for all formatting options
- Visual feedback showing active formatting
- Undo/redo support

#### US-2.2: Switch Between Visual and Markdown
**As an** admin,
**I want to** toggle between visual editor and raw markdown,
**So that** I can use whichever mode I'm most comfortable with.

**Value**: Supports both beginner and power users.

**Acceptance Criteria**:
- Toggle button to switch modes
- Preserve content when switching modes
- Show markdown syntax in code view
- Real-time preview in visual mode
- No data loss during mode switching

#### US-2.3: Embed Images and Links
**As an** admin,
**I want to** insert images and links using visual dialogs,
**So that** I don't have to manually write markdown syntax.

**Value**: Simplifies complex content tasks.

**Acceptance Criteria**:
- Image insertion dialog with:
  - Browse from media library
  - Paste URL directly
  - Alt text field (accessibility)
  - Image preview
- Link insertion dialog with:
  - URL field
  - Link text field
  - Open in new tab checkbox
- Edit existing images/links by clicking them

#### US-2.4: Write Code Examples
**As an** admin,
**I want to** insert syntax-highlighted code blocks,
**So that** technical blog posts are easy to read.

**Value**: Improves readability of technical content.

**Acceptance Criteria**:
- Code block insertion with language selection
- Syntax highlighting for common languages:
  - JavaScript, TypeScript
  - Python, Java, Go
  - HTML, CSS, SQL
  - Markdown, JSON
- Copy button on code blocks
- Line numbers (optional)

---

### Epic 3: Version Control

#### US-3.1: Auto-Save Drafts
**As an** admin,
**I want to** have my changes automatically saved as I type,
**So that** I don't lose work if my browser crashes.

**Value**: Protects against accidental data loss.

**Acceptance Criteria**:
- Auto-save every 30 seconds after last change
- Visual indicator showing save status:
  - "Saving..." (in progress)
  - "Saved at [time]" (success)
  - "Save failed" (error with retry)
- Manual save button for immediate save
- Save on blur (when leaving the editor)

#### US-3.2: View Version History
**As an** admin,
**I want to** see a timeline of all changes to a content item,
**So that** I can understand what changed and when.

**Value**: Provides audit trail and context for changes.

**Acceptance Criteria**:
- Version history panel showing:
  - Version number
  - Timestamp
  - User who made the change
  - Brief description of change
- Sort by newest/oldest first
- Filter by date range
- Show current version prominently

#### US-3.3: Compare Versions
**As an** admin,
**I want to** see a side-by-side diff of two versions,
**So that** I can understand exactly what changed.

**Value**: Makes it easy to identify specific changes.

**Acceptance Criteria**:
- Select two versions to compare
- Highlight differences:
  - Green for additions
  - Red for deletions
  - Yellow for modifications
- Show diffs for:
  - Text content
  - Metadata (title, slug, status)
  - Relationships (tags, categories)
- Visual diff for rich text content

#### US-3.4: Restore Previous Versions
**As an** admin,
**I want to** restore a previous version with one click,
**So that** I can undo mistakes without manual retyping.

**Value**: Provides safety net for experimentation.

**Acceptance Criteria**:
- "Restore" button on each version
- Confirmation dialog before restoring
- Create new version when restoring (don't delete history)
- Show success message with link to restored version
- Option to preview before restoring

---

## User Journeys

### Journey 1: Publishing a Blog Post with Images

**Actor**: Admin (Content Creator)

**Context**: Admin wants to publish a new blog post about a recent project with screenshots.

**Steps**:

1. **Navigate to Blog Editor**
   - Click "Blog" in admin sidebar
   - Click "New Post" button
   - See rich text editor interface

2. **Write Content**
   - Type title: "How We Built Our New Portfolio Site"
   - Type introduction paragraph
   - Notice auto-save indicator: "Saved at 10:23 AM"

3. **Upload Screenshots**
   - Click "Add Image" in editor toolbar
   - See media library dialog
   - Drag 5 screenshots from desktop
   - See upload progress bars
   - See success messages: "5 images uploaded"

4. **Insert Images**
   - Select first screenshot from library
   - Click "Insert" button
   - See image embedded in editor
   - Repeat for other screenshots

5. **Format Content**
   - Select heading text, click "H2" button
   - Select code snippet, click "Code Block"
   - Select important text, click "Bold"
   - Preview in visual mode

6. **Save and Publish**
   - Click "Publish" button
   - See success message
   - View published post on public site

**Pain Points Addressed**:
- ✅ No need to upload images to external service first
- ✅ No need to copy-paste URLs manually
- ✅ No need to remember markdown syntax
- ✅ No fear of losing work due to auto-save

**Expected Duration**: 15 minutes (vs. 30 minutes with current workflow)

---

### Journey 2: Correcting a Mistake in Published Content

**Actor**: Admin (Content Manager)

**Context**: Admin notices a typo in a published service description and wants to fix it without losing the original.

**Steps**:

1. **Navigate to Service Editor**
   - Click "Services" in admin sidebar
   - Click on "MVP Development" service
   - See rich text editor with current content

2. **Make Changes**
   - Find typo: "collarboration" → "collaboration"
   - Fix typo in visual editor
   - See auto-save: "Saved at 2:45 PM"

3. **Review Version History**
   - Click "Version History" button
   - See timeline:
     - Version 5 (2:45 PM) - Current
     - Version 4 (Nov 14, 10:00 AM) - Last published
     - Version 3 (Nov 10, 3:30 PM) - Initial draft

4. **Compare Versions**
   - Select Version 4 and 5
   - Click "Compare"
   - See diff highlighting:
     - Red: "collarboration"
     - Green: "collaboration"

5. **Publish Correction**
   - Click "Publish"
   - See success message
   - Version 5 becomes published version

**Pain Points Addressed**:
- ✅ Clear audit trail of all changes
- ✅ Easy to compare what changed
- ✅ Confidence to make changes knowing history is preserved

**Expected Duration**: 5 minutes

---

### Journey 3: Reorganizing Media Library

**Actor**: Admin (Content Manager)

**Context**: After 3 months, the media library has 200+ images and admin wants to clean up unused assets.

**Steps**:

1. **Navigate to Media Library**
   - Click "Media" in admin sidebar
   - See grid of all uploaded images

2. **Sort by Usage**
   - Click "Sort by: Usage"
   - See images sorted by usage count
   - Identify 50 images with 0 usage

3. **Review Unused Images**
   - Click on unused image
   - See details:
     - Filename: "screenshot-old-design.png"
     - Uploaded: Aug 15, 2025
     - Used in: 0 content items

4. **Delete Unused Images**
   - Select 50 unused images (checkbox)
   - Click "Delete Selected" button
   - See confirmation dialog:
     - "Delete 50 images? This cannot be undone."
   - Click "Confirm"
   - See success message: "50 images deleted"

5. **Organize Remaining Images**
   - Rename images with descriptive names
   - Example: "img_001.jpg" → "team-photo-2025.jpg"

**Pain Points Addressed**:
- ✅ Easy to identify unused assets
- ✅ Safe deletion with usage tracking
- ✅ Organized library improves findability

**Expected Duration**: 20 minutes

---

## Functional Requirements

### FR-1: Media Library

#### FR-1.1: File Upload
- **REQ-1.1.1**: System shall accept image files (JPEG, PNG, GIF, WEBP, SVG)
- **REQ-1.1.2**: System shall reject files larger than 10MB
- **REQ-1.1.3**: System shall support drag-and-drop upload
- **REQ-1.1.4**: System shall support multi-file selection (up to 10 files)
- **REQ-1.1.5**: System shall display upload progress per file
- **REQ-1.1.6**: System shall generate unique filenames to prevent collisions
- **REQ-1.1.7**: System shall store original filename as metadata

#### FR-1.2: Image Storage
- **REQ-1.2.1**: System shall store images in Supabase Storage
- **REQ-1.2.2**: System shall generate public URLs for stored images
- **REQ-1.2.3**: System shall organize images in buckets by content type (blog, portfolio, services)
- **REQ-1.2.4**: System shall store metadata in `media_library` table:
  - id (UUID)
  - filename (text)
  - original_filename (text)
  - file_size (integer, bytes)
  - mime_type (text)
  - storage_path (text)
  - bucket_name (text)
  - uploaded_by (UUID, foreign key to users)
  - uploaded_at (timestamp)
  - width (integer, pixels)
  - height (integer, pixels)

#### FR-1.3: Image Management
- **REQ-1.3.1**: System shall display images in paginated grid (20 per page)
- **REQ-1.3.2**: System shall provide search by filename
- **REQ-1.3.3**: System shall provide filter by file type
- **REQ-1.3.4**: System shall provide sort options (date, name, size)
- **REQ-1.3.5**: System shall allow image deletion (with confirmation)
- **REQ-1.3.6**: System shall track image usage across content types
- **REQ-1.3.7**: System shall prevent deletion of images in use (with override)
- **REQ-1.3.8**: System shall support bulk operations (delete, download)

#### FR-1.4: Image Optimization
- **REQ-1.4.1**: System should generate thumbnails (200x200) on upload
- **REQ-1.4.2**: System should extract image dimensions (width, height)
- **REQ-1.4.3**: System should support responsive image URLs (Supabase transform)

---

### FR-2: Rich Text Editor

#### FR-2.1: Editor Interface
- **REQ-2.1.1**: System shall provide visual WYSIWYG editor interface
- **REQ-2.1.2**: System shall provide markdown source code view
- **REQ-2.1.3**: System shall allow toggling between visual and markdown modes
- **REQ-2.1.4**: System shall preserve content when switching modes
- **REQ-2.1.5**: System shall provide formatting toolbar with:
  - Headings (H1-H6)
  - Bold, Italic, Strikethrough
  - Bulleted list, Numbered list
  - Blockquote
  - Code inline, Code block
  - Link, Image
  - Horizontal rule

#### FR-2.2: Content Formatting
- **REQ-2.2.1**: System shall support GitHub Flavored Markdown (GFM)
- **REQ-2.2.2**: System shall render markdown to HTML for preview
- **REQ-2.2.3**: System shall sanitize HTML output to prevent XSS
- **REQ-2.2.4**: System shall support syntax highlighting for code blocks
- **REQ-2.2.5**: System shall preserve code formatting (indentation, whitespace)

#### FR-2.3: Media Integration
- **REQ-2.3.1**: System shall provide "Insert Image" button in toolbar
- **REQ-2.3.2**: System shall open media library dialog on image insert
- **REQ-2.3.3**: System shall insert selected image at cursor position
- **REQ-2.3.4**: System shall support image alt text for accessibility
- **REQ-2.3.5**: System shall allow editing image properties (alt, URL)

#### FR-2.4: Keyboard Shortcuts
- **REQ-2.4.1**: System shall support standard shortcuts:
  - Ctrl+B (Bold)
  - Ctrl+I (Italic)
  - Ctrl+K (Link)
  - Ctrl+Z (Undo)
  - Ctrl+Y (Redo)
  - Ctrl+Shift+M (Toggle mode)

---

### FR-3: Version Control

#### FR-3.1: Auto-Save
- **REQ-3.1.1**: System shall auto-save content every 30 seconds after last change
- **REQ-3.1.2**: System shall display save status indicator
- **REQ-3.1.3**: System shall save on editor blur (user navigates away)
- **REQ-3.1.4**: System shall provide manual "Save" button
- **REQ-3.1.5**: System shall handle save failures gracefully (retry, error message)

#### FR-3.2: Version Storage
- **REQ-3.2.1**: System shall store all versions in `content_versions` table:
  - id (UUID)
  - content_type (enum: blog, portfolio, service, etc.)
  - content_id (UUID, foreign key to content table)
  - version_number (integer, auto-increment per content)
  - content_snapshot (JSONB, full content state)
  - change_summary (text, optional)
  - created_by (UUID, foreign key to users)
  - created_at (timestamp)
- **REQ-3.2.2**: System shall create version on:
  - Publish action
  - Manual save
  - Auto-save (if significant changes)
- **REQ-3.2.3**: System shall limit auto-save versions (max 1 per 5 minutes)
- **REQ-3.2.4**: System shall retain all published versions indefinitely
- **REQ-3.2.5**: System shall prune draft versions older than 30 days

#### FR-3.3: Version History
- **REQ-3.3.1**: System shall display version history in sidebar panel
- **REQ-3.3.2**: System shall show for each version:
  - Version number
  - Timestamp
  - User who created it
  - Change summary (if available)
- **REQ-3.3.3**: System shall sort versions by newest first
- **REQ-3.3.4**: System shall paginate history (10 versions per page)
- **REQ-3.3.5**: System shall highlight current version

#### FR-3.4: Version Comparison
- **REQ-3.4.1**: System shall allow selecting two versions to compare
- **REQ-3.4.2**: System shall display side-by-side diff view
- **REQ-3.4.3**: System shall highlight differences:
  - Additions (green)
  - Deletions (red)
  - Modifications (yellow)
- **REQ-3.4.4**: System shall compare:
  - Text content (word-level diff)
  - Metadata fields (title, slug, status)
  - Relationships (tags, categories)

#### FR-3.5: Version Restoration
- **REQ-3.5.1**: System shall provide "Restore" button on each version
- **REQ-3.5.2**: System shall show confirmation dialog before restoring
- **REQ-3.5.3**: System shall create new version when restoring (preserve history)
- **REQ-3.5.4**: System shall display success message after restoration
- **REQ-3.5.5**: System shall allow preview of version before restoring

---

## Non-Functional Requirements

### NFR-1: Performance

#### NFR-1.1: Response Time
- **REQ-P1**: Image upload shall complete within 5 seconds for files up to 10MB
- **REQ-P2**: Media library grid shall load within 2 seconds
- **REQ-P3**: Editor shall initialize within 1 second
- **REQ-P4**: Auto-save shall complete within 1 second
- **REQ-P5**: Version history shall load within 2 seconds
- **REQ-P6**: Version comparison shall render within 3 seconds

#### NFR-1.2: Scalability
- **REQ-P7**: System shall support media library with 10,000+ images
- **REQ-P8**: System shall support 1,000+ versions per content item
- **REQ-P9**: System shall support concurrent editing by 10+ admins

#### NFR-1.3: Bundle Size
- **REQ-P10**: Rich text editor shall add < 50 kB to gzip bundle
- **REQ-P11**: Media library shall code-split to separate chunk
- **REQ-P12**: Version control shall lazy-load on demand

---

### NFR-2: Usability

#### NFR-2.1: Accessibility
- **REQ-U1**: Editor shall support keyboard-only navigation
- **REQ-U2**: Editor shall provide ARIA labels for all controls
- **REQ-U3**: Media library shall support screen readers
- **REQ-U4**: Color contrast shall meet WCAG 2.1 AA standard (4.5:1)
- **REQ-U5**: Focus indicators shall be visible and clear

#### NFR-2.2: User Experience
- **REQ-U6**: Editor shall provide visual feedback for all actions
- **REQ-U7**: Error messages shall be clear and actionable
- **REQ-U8**: Loading states shall be indicated with spinners/skeletons
- **REQ-U9**: Success messages shall auto-dismiss after 3 seconds
- **REQ-U10**: Confirmation dialogs shall clearly state consequences

---

### NFR-3: Security

#### NFR-3.1: Access Control
- **REQ-S1**: Only authenticated admins shall access media library
- **REQ-S2**: Only authenticated admins shall access version history
- **REQ-S3**: Supabase RLS policies shall enforce admin-only access
- **REQ-S4**: Image URLs shall be publicly accessible (no auth required)

#### NFR-3.2: Data Protection
- **REQ-S5**: File type validation shall occur on client and server
- **REQ-S6**: File size validation shall occur on client and server
- **REQ-S7**: Uploaded files shall be scanned for malware (future)
- **REQ-S8**: HTML output shall be sanitized to prevent XSS

#### NFR-3.3: Data Integrity
- **REQ-S9**: Version snapshots shall be immutable (no updates)
- **REQ-S10**: Image deletion shall be soft delete (mark as deleted)
- **REQ-S11**: Restoration shall create new version (no overwrite)

---

### NFR-4: Maintainability

#### NFR-4.1: Code Quality
- **REQ-M1**: All code shall pass TypeScript strict mode
- **REQ-M2**: All code shall pass ESLint with no warnings
- **REQ-M3**: All components shall have TypeScript types
- **REQ-M4**: All API functions shall have error handling

#### NFR-4.2: Testing
- **REQ-M5**: All features shall have E2E test coverage
- **REQ-M6**: Critical paths shall have unit test coverage
- **REQ-M7**: Test coverage shall be > 80% for new code

#### NFR-4.3: Documentation
- **REQ-M8**: All public APIs shall have JSDoc comments
- **REQ-M9**: All components shall have usage examples
- **REQ-M10**: All database schemas shall be documented

---

## User Value Proposition

### For Content Creators

**Before Phase 5**:
- Upload images to external service (Unsplash, Imgur)
- Copy-paste markdown syntax manually
- Fear of losing work due to browser crash
- No way to undo mistakes without manual retyping
- 30 minutes to publish a blog post with images

**After Phase 5**:
- Upload images directly in admin panel
- Insert images with one click
- Auto-save protects against data loss
- Restore previous versions with one click
- 15 minutes to publish a blog post with images

**Value Delivered**: **50% faster content creation**, **100% data safety**, **unlimited undo capability**

---

### For Content Managers

**Before Phase 5**:
- No visibility into content change history
- Difficult to identify who changed what
- Unused images clutter storage
- No audit trail for compliance

**After Phase 5**:
- Full version history with timestamps and authors
- Side-by-side diff to see exact changes
- Usage tracking identifies unused images
- Audit trail meets compliance requirements

**Value Delivered**: **Complete transparency**, **easy rollback**, **organized assets**

---

### For Developers

**Before Phase 5**:
- Build custom upload flows for each content type
- Manually implement auto-save logic
- No standardized way to handle images

**After Phase 5**:
- Reusable media library component
- Automatic version control for all content
- Centralized image management API

**Value Delivered**: **Faster feature development**, **consistent UX**, **less maintenance**

---

## Dependencies

### Internal Dependencies

- **CMS Phase 1-4**: All core CMS features must be complete
- **Admin Authentication**: Admin role and permissions system
- **Supabase Integration**: Storage and database configured

### External Dependencies

- **Supabase Storage**: For image hosting
- **Supabase Database**: For metadata and versions
- **Tiptap**: Rich text editor library
- **React Query**: For data fetching and caching

### Optional Enhancements

- **Image Optimization Service**: Automatic compression and resizing
- **CDN Integration**: Faster image delivery
- **Cloud Backup**: Off-site backup for media library
- **Advanced Search**: Full-text search with Algolia/Meilisearch

---

## Appendix

### Glossary

- **Media Library**: Centralized repository for uploaded images
- **Rich Text Editor**: WYSIWYG editor with visual formatting tools
- **Version Control**: System that tracks and stores all content changes
- **Auto-Save**: Automatic saving of content at regular intervals
- **Version History**: Timeline of all versions of a content item
- **Version Comparison**: Side-by-side view showing differences between versions
- **Version Restoration**: Reverting content to a previous version

### References

- **CMS Phase 1-4 Documentation**: See `docs/cms/` directory
- **Supabase Storage Docs**: https://supabase.com/docs/guides/storage
- **Tiptap Documentation**: https://tiptap.dev/docs
- **GitHub Flavored Markdown**: https://github.github.com/gfm/

---

**Next Steps**: Proceed to Stage 2 (Plan) - Architecture design and technical specifications
