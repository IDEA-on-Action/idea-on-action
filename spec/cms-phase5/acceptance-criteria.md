# CMS Phase 5 - Acceptance Criteria

**Version**: 2.1.0
**Date**: 2025-11-17
**Status**: Draft
**Stage**: Specify (SDD Stage 1)

---

## Table of Contents

1. [Overview](#overview)
2. [Success Criteria](#success-criteria)
3. [Verification Methods](#verification-methods)
4. [Test Scenarios](#test-scenarios)
5. [Performance Benchmarks](#performance-benchmarks)
6. [Accessibility Requirements](#accessibility-requirements)
7. [User Acceptance Testing](#user-acceptance-testing)

---

## Overview

### Purpose

This document defines the measurable criteria that must be met for CMS Phase 5 to be considered complete and ready for production deployment. Each criterion is specific, measurable, and testable.

### Acceptance Philosophy

- ✅ **Testable**: Every criterion has a clear pass/fail test
- ✅ **Measurable**: Quantitative metrics where possible
- ✅ **User-Focused**: Criteria reflect user value, not technical details
- ✅ **Complete**: All requirements from `requirements.md` are covered

---

## Success Criteria

### Feature 1: Media Library

#### AC-1.1: Image Upload Success
**Given** an admin is on the media library page,
**When** they upload a valid image file (< 10MB, JPEG/PNG/GIF/WEBP/SVG),
**Then**:
- ✅ File upload completes within 5 seconds
- ✅ Image appears in media library grid
- ✅ Thumbnail is generated and displayed
- ✅ Metadata is stored (filename, size, dimensions)
- ✅ Public URL is accessible

**Measurement**: 100% success rate for valid uploads in E2E tests

---

#### AC-1.2: Multi-File Upload Success
**Given** an admin selects 10 image files,
**When** they upload all files simultaneously,
**Then**:
- ✅ All 10 files upload successfully
- ✅ Progress indicator shows status for each file
- ✅ Upload completes within 30 seconds total
- ✅ Success message confirms "10 images uploaded"
- ✅ All images appear in library grid

**Measurement**: 100% success rate for batch uploads in E2E tests

---

#### AC-1.3: Invalid File Rejection
**Given** an admin attempts to upload an invalid file,
**When** the file is:
- Too large (> 10MB), OR
- Wrong type (PDF, DOC, MP4),
**Then**:
- ❌ Upload is rejected immediately
- ⚠️ Clear error message is displayed
- ✅ No file is stored in Supabase Storage
- ✅ User can retry with valid file

**Measurement**: 100% rejection rate for invalid files in E2E tests

---

#### AC-1.4: Image Search Functionality
**Given** the media library has 100+ images,
**When** an admin searches for "logo",
**Then**:
- ✅ Search results appear within 1 second
- ✅ Only images matching "logo" in filename are shown
- ✅ Search is case-insensitive
- ✅ Fuzzy matching works ("lgo" finds "logo")
- ✅ Empty state shown if no results

**Measurement**: < 1 second response time for search queries

---

#### AC-1.5: Image Deletion Protection
**Given** an image is used in 3 published blog posts,
**When** an admin attempts to delete the image,
**Then**:
- ⚠️ Warning dialog appears: "This image is used in 3 blog posts"
- ✅ Admin can cancel deletion
- ✅ Admin can force delete (with confirmation)
- ✅ If forced, image URLs in posts become broken (expected)

**Measurement**: 100% of in-use images trigger warning dialog

---

#### AC-1.6: Bulk Operations
**Given** an admin selects 20 images using checkboxes,
**When** they click "Delete Selected",
**Then**:
- ✅ Confirmation dialog shows count: "Delete 20 images?"
- ✅ All 20 images are deleted within 5 seconds
- ✅ Success message confirms deletion
- ✅ Library grid updates immediately

**Measurement**: < 5 seconds for bulk delete of 20 images

---

### Feature 2: Rich Text Editor

#### AC-2.1: Visual Formatting
**Given** an admin is editing blog post content,
**When** they select text and click "Bold" button,
**Then**:
- ✅ Selected text becomes bold visually
- ✅ Markdown output contains `**text**`
- ✅ Toggle button (click again) removes bold
- ✅ Keyboard shortcut Ctrl+B works identically

**Measurement**: 100% success rate for all formatting options

---

#### AC-2.2: Mode Switching Preservation
**Given** an admin has written content in visual mode,
**When** they switch to markdown mode and back,
**Then**:
- ✅ All content is preserved (no data loss)
- ✅ Formatting is preserved (bold, headings, lists)
- ✅ Images are preserved (URLs intact)
- ✅ Links are preserved (URLs and text)

**Measurement**: 0% data loss across 100 mode switches in E2E tests

---

#### AC-2.3: Image Insertion from Library
**Given** an admin clicks "Insert Image" button,
**When** they select an image from media library,
**Then**:
- ✅ Media library dialog opens within 500ms
- ✅ Selected image is inserted at cursor position
- ✅ Image markdown is correct: `![alt text](url)`
- ✅ Image preview renders in visual mode
- ✅ Dialog closes automatically after insertion

**Measurement**: < 500ms dialog open time

---

#### AC-2.4: Code Block Syntax Highlighting
**Given** an admin inserts a code block,
**When** they select language "JavaScript" and paste code,
**Then**:
- ✅ Code is syntax-highlighted in visual mode
- ✅ Line numbers are displayed (if enabled)
- ✅ Copy button appears on hover
- ✅ Markdown output contains language tag: ` ```javascript `
- ✅ Code formatting is preserved (indentation, whitespace)

**Measurement**: 100% syntax highlighting accuracy for top 10 languages

---

#### AC-2.5: Link Insertion
**Given** an admin selects text and clicks "Link" button,
**When** they enter URL "https://example.com",
**Then**:
- ✅ Link dialog opens with URL and text fields
- ✅ URL validation highlights invalid URLs
- ✅ "Open in new tab" checkbox adds `target="_blank"`
- ✅ Markdown output is correct: `[text](url)`
- ✅ Link is clickable in preview mode

**Measurement**: 100% success rate for link creation

---

### Feature 3: Version Control

#### AC-3.1: Auto-Save Activation
**Given** an admin is editing content,
**When** they make changes and wait 30 seconds,
**Then**:
- ✅ Auto-save triggers automatically
- ✅ Save indicator shows "Saving..."
- ✅ Save completes within 1 second
- ✅ Save indicator shows "Saved at [time]"
- ✅ Version is created in database

**Measurement**: 100% auto-save success rate within 30±2 seconds

---

#### AC-3.2: Manual Save
**Given** an admin has unsaved changes,
**When** they click "Save" button,
**Then**:
- ✅ Save completes within 1 second
- ✅ Success message appears
- ✅ Version is created immediately
- ✅ Auto-save timer resets

**Measurement**: < 1 second save response time

---

#### AC-3.3: Save Failure Recovery
**Given** auto-save fails due to network error,
**When** the network is restored,
**Then**:
- ⚠️ Error indicator shows "Save failed"
- ✅ Retry button is available
- ✅ Clicking retry triggers save
- ✅ Local draft is preserved until successful save

**Measurement**: 0% data loss during network failures in E2E tests

---

#### AC-3.4: Version History Display
**Given** a blog post has 15 versions,
**When** an admin opens version history panel,
**Then**:
- ✅ Panel loads within 2 seconds
- ✅ All 15 versions are listed (paginated if > 10)
- ✅ Each version shows:
  - Version number (15, 14, 13...)
  - Timestamp (Nov 16, 2:30 PM)
  - Author name (John Doe)
- ✅ Current version is highlighted
- ✅ Versions are sorted newest first

**Measurement**: < 2 seconds load time for history panel

---

#### AC-3.5: Version Comparison Accuracy
**Given** an admin selects Version 10 and Version 12,
**When** they click "Compare",
**Then**:
- ✅ Comparison view loads within 3 seconds
- ✅ Side-by-side diff is displayed
- ✅ Additions are highlighted green
- ✅ Deletions are highlighted red
- ✅ Modifications are highlighted yellow
- ✅ Diff is word-level accurate (not line-level)

**Measurement**: < 3 seconds comparison render time

---

#### AC-3.6: Version Restoration Success
**Given** an admin views Version 8,
**When** they click "Restore" and confirm,
**Then**:
- ✅ Confirmation dialog explains consequences
- ✅ Restoration completes within 5 seconds
- ✅ New version (Version 16) is created
- ✅ Version 16 content matches Version 8 exactly
- ✅ Version history shows Version 16 as "Restored from Version 8"
- ✅ Success message appears

**Measurement**: < 5 seconds restoration time

---

#### AC-3.7: Version Pruning
**Given** a content item has 50 draft versions older than 30 days,
**When** the pruning job runs,
**Then**:
- ✅ All draft versions > 30 days are deleted
- ✅ Published versions are retained (all)
- ✅ Current draft version is retained
- ✅ Version numbers remain consistent (no renumbering)

**Measurement**: 100% accuracy in pruning logic

---

## Verification Methods

### Method 1: Automated E2E Tests

**Tool**: Playwright
**Coverage**: All critical user paths
**Frequency**: On every commit (CI/CD)

**Test Suites**:
1. **Media Library Tests** (30 tests)
   - Upload single file
   - Upload multiple files
   - Search and filter
   - Delete with confirmation
   - Bulk operations
   - Error handling

2. **Rich Text Editor Tests** (40 tests)
   - All formatting options
   - Mode switching
   - Image insertion
   - Link insertion
   - Code blocks
   - Keyboard shortcuts

3. **Version Control Tests** (30 tests)
   - Auto-save
   - Manual save
   - Version history
   - Version comparison
   - Version restoration
   - Save failure recovery

**Total E2E Tests**: 100+ tests

---

### Method 2: Performance Benchmarks

**Tool**: Lighthouse, Chrome DevTools
**Metrics**:
- Page load time
- Time to interactive
- Bundle size impact
- Network requests

**Benchmarks**:
- **Media library load**: < 2 seconds (with 100 images)
- **Editor initialization**: < 1 second
- **Auto-save latency**: < 1 second
- **Version history load**: < 2 seconds
- **Comparison render**: < 3 seconds

**Pass Criteria**: 95% of measurements meet or exceed benchmarks

---

### Method 3: Accessibility Audit

**Tool**: axe-core, Lighthouse Accessibility
**Standards**: WCAG 2.1 AA

**Checks**:
- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ Screen reader compatibility (ARIA labels)
- ✅ Color contrast (4.5:1 minimum)
- ✅ Focus indicators (visible outlines)
- ✅ Form labels (all inputs labeled)

**Pass Criteria**: 0 critical or serious accessibility violations

---

### Method 4: Manual Testing

**Testers**: 2-3 admin users
**Scenarios**: Real-world content creation tasks

**Test Cases**:
1. Publish blog post with 5 images (15 min)
2. Update service description and restore old version (10 min)
3. Organize media library and delete unused images (20 min)

**Pass Criteria**: 100% task completion rate, 90%+ user satisfaction

---

## Test Scenarios

### Scenario 1: First-Time Blog Post Creation

**Objective**: Verify complete workflow for new content creator

**Steps**:
1. Admin logs in for first time
2. Navigates to Blog → New Post
3. Uploads 3 images (drag-and-drop)
4. Writes title and introduction
5. Formats text (headings, bold, lists)
6. Inserts images from library
7. Adds code block with syntax highlighting
8. Previews post in visual mode
9. Clicks "Publish"

**Expected Results**:
- ✅ All uploads succeed
- ✅ Editor is intuitive (no help needed)
- ✅ Auto-save protects work
- ✅ Post publishes successfully
- ✅ Post displays correctly on public site

**Time Limit**: 15 minutes
**Success Rate**: 90%+ (9/10 admins complete without help)

---

### Scenario 2: Fixing Published Content

**Objective**: Verify version control for error correction

**Steps**:
1. Admin finds typo in published service description
2. Opens editor and makes correction
3. Reviews version history
4. Compares current version to previous
5. Publishes correction

**Expected Results**:
- ✅ Change is auto-saved
- ✅ Version history shows both versions
- ✅ Comparison highlights exact change
- ✅ Publish succeeds
- ✅ Old version is still accessible

**Time Limit**: 5 minutes
**Success Rate**: 100% (10/10 admins complete)

---

### Scenario 3: Media Library Cleanup

**Objective**: Verify media management at scale

**Steps**:
1. Admin opens media library (200 images)
2. Sorts by usage count
3. Identifies 20 unused images
4. Selects and bulk deletes
5. Renames 5 frequently used images
6. Searches for specific image

**Expected Results**:
- ✅ Library loads within 2 seconds
- ✅ Sorting works correctly
- ✅ Bulk delete completes within 5 seconds
- ✅ Search returns results within 1 second
- ✅ Rename persists correctly

**Time Limit**: 20 minutes
**Success Rate**: 90%+ (9/10 admins complete)

---

### Scenario 4: Network Interruption Recovery

**Objective**: Verify data safety during connection loss

**Steps**:
1. Admin starts editing blog post
2. Makes significant changes (500 words)
3. Network disconnects (simulate)
4. Admin continues editing
5. Network reconnects
6. Auto-save resumes

**Expected Results**:
- ✅ All changes are preserved locally
- ✅ Save indicator shows "Save failed"
- ✅ Auto-save resumes when network returns
- ✅ Version is created successfully
- ✅ 0% data loss

**Success Rate**: 100% (no data loss allowed)

---

### Scenario 5: Concurrent Editing

**Objective**: Verify version control with multiple editors

**Steps**:
1. Admin A opens blog post and makes changes
2. Admin B opens same blog post and makes changes
3. Admin A saves and publishes
4. Admin B saves and publishes

**Expected Results**:
- ✅ Both changes are saved as separate versions
- ✅ Version history shows both authors
- ✅ No data loss or overwrite
- ⚠️ (Optional) Conflict warning if edits overlap

**Success Rate**: 100% (no data loss)

---

## Performance Benchmarks

### Benchmark 1: Bundle Size Impact

**Baseline** (before Phase 5): 338 kB gzip
**Target** (after Phase 5): < 390 kB gzip (< +50 kB)

**Measurement**:
```bash
npm run build
# Check dist/assets/*.js file sizes
```

**Components**:
- Tiptap editor: ~30 kB gzip
- Media library: ~15 kB gzip (code-split)
- Version control: ~5 kB gzip (lazy-loaded)

**Pass Criteria**: Total bundle increase < 50 kB gzip

---

### Benchmark 2: Page Load Time

**Metric**: Time to Interactive (TTI)
**Target**: < 3 seconds on 4G network

**Test Pages**:
- Blog editor: < 2.5 seconds
- Media library: < 2.0 seconds
- Version history: < 2.0 seconds

**Measurement**: Lighthouse Performance score > 90

---

### Benchmark 3: Database Query Performance

**Queries**:
- Fetch 100 images: < 500ms
- Fetch 50 versions: < 500ms
- Search 10,000 images: < 1 second
- Compare 2 versions: < 200ms

**Measurement**: PostgreSQL EXPLAIN ANALYZE

**Pass Criteria**: All queries meet target latency

---

### Benchmark 4: Upload Performance

**File Sizes**:
- 1 MB image: < 2 seconds
- 5 MB image: < 5 seconds
- 10 MB image: < 10 seconds

**Network**: Simulated 4G (4 Mbps)

**Pass Criteria**: 95% of uploads meet target time

---

## Accessibility Requirements

### Requirement 1: Keyboard Navigation

**Test**: Admin completes all tasks using only keyboard

**Tasks**:
- Upload image (Tab to browse button, Enter to open)
- Format text (Ctrl+B for bold, Ctrl+I for italic)
- Insert image (Tab to button, Enter to open dialog)
- Navigate version history (Arrow keys to scroll)

**Pass Criteria**: 100% task completion rate

---

### Requirement 2: Screen Reader Compatibility

**Test**: Admin using NVDA/JAWS completes tasks

**Checks**:
- ✅ All images have alt text
- ✅ All buttons have aria-labels
- ✅ All form fields have labels
- ✅ All dialogs announce purpose
- ✅ Save status is announced

**Pass Criteria**: 0 critical accessibility violations (axe-core)

---

### Requirement 3: Color Contrast

**Test**: All text meets WCAG 2.1 AA standard (4.5:1)

**Elements**:
- Editor toolbar buttons
- Version history text
- Success/error messages
- Placeholder text

**Tool**: Chrome DevTools Contrast Checker

**Pass Criteria**: 100% compliance

---

### Requirement 4: Focus Indicators

**Test**: All interactive elements have visible focus

**Elements**:
- Buttons
- Links
- Form inputs
- Checkboxes
- Dropdown menus

**Visual**: 2px outline with high contrast color

**Pass Criteria**: All elements have visible focus indicator

---

## User Acceptance Testing

### UAT Phase 1: Alpha Testing

**Participants**: 3 internal admin users
**Duration**: 3 days
**Environment**: Staging server

**Tasks**:
1. Create 5 blog posts with images
2. Update 3 existing service descriptions
3. Organize media library (upload, delete, rename)
4. Test version restoration (intentional mistakes)

**Success Criteria**:
- 90%+ task completion rate
- < 5 critical bugs found
- 80%+ user satisfaction (survey)

---

### UAT Phase 2: Beta Testing

**Participants**: 5 external admin users (if applicable)
**Duration**: 7 days
**Environment**: Staging server

**Tasks**: Real-world content creation

**Feedback Collection**:
- Daily survey (ease of use, bugs found)
- Exit interview (overall satisfaction)
- Analytics (feature usage, time on task)

**Success Criteria**:
- 95%+ task completion rate
- < 3 critical bugs found
- 85%+ user satisfaction

---

### UAT Phase 3: Production Smoke Test

**Participants**: 1-2 admin users
**Duration**: 1 day
**Environment**: Production server

**Tasks**:
1. Upload 1 image
2. Create 1 draft blog post
3. View version history
4. Test auto-save

**Success Criteria**:
- 100% task completion rate
- 0 critical bugs
- All features work as expected

---

## Appendix

### Test Data Requirements

**Media Library**:
- 200 sample images (various sizes, types)
- 20 invalid files (PDF, MP4, oversized)

**Content**:
- 10 blog posts with version history
- 5 service descriptions
- 3 portfolio items

**Versions**:
- 50 versions across all content types
- Mix of draft and published versions
- Versions spanning 60 days (for pruning test)

---

### Tools and Infrastructure

**E2E Testing**:
- Playwright (latest version)
- GitHub Actions (CI/CD)

**Performance Testing**:
- Lighthouse CI
- WebPageTest
- Chrome DevTools

**Accessibility Testing**:
- axe-core
- NVDA screen reader
- Chrome Accessibility Inspector

**Database**:
- Supabase local development
- PostgreSQL EXPLAIN ANALYZE

---

### Sign-Off Checklist

- [ ] All success criteria met (100%)
- [ ] All E2E tests passing (100+ tests)
- [ ] Performance benchmarks achieved (95%+)
- [ ] Accessibility audit passed (0 critical issues)
- [ ] UAT completed with 85%+ satisfaction
- [ ] Code review approved
- [ ] Documentation complete
- [ ] Deployment checklist ready

---

**Next Steps**: Proceed to implementation (Stage 4) once planning (Stage 2) and task breakdown (Stage 3) are complete
