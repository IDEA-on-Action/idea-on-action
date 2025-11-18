# CMS Phase 5 - Constraints

**Version**: 2.1.0
**Date**: 2025-11-17
**Status**: Draft
**Stage**: Specify (SDD Stage 1)

---

## Table of Contents

1. [Overview](#overview)
2. [Technical Constraints](#technical-constraints)
3. [Business Constraints](#business-constraints)
4. [Security Constraints](#security-constraints)
5. [Performance Constraints](#performance-constraints)
6. [Operational Constraints](#operational-constraints)
7. [Compatibility Constraints](#compatibility-constraints)
8. [Legal and Compliance](#legal-and-compliance)

---

## Overview

### Purpose

This document defines all constraints that limit design and implementation decisions for CMS Phase 5. Constraints are **non-negotiable boundaries** that must be respected, unlike requirements which define what we want to achieve.

### Constraint Categories

1. **Technical**: Technology stack, infrastructure, architecture
2. **Business**: Budget, timeline, resources
3. **Security**: Access control, data protection, compliance
4. **Performance**: Speed, scalability, resource usage
5. **Operational**: Deployment, maintenance, monitoring
6. **Compatibility**: Browser support, device support, backward compatibility
7. **Legal**: Licensing, privacy, regulations

---

## Technical Constraints

### TC-1: Technology Stack

#### TC-1.1: Frontend Framework
- **Constraint**: Must use React 18.x (no upgrade to React 19)
- **Reason**: Project is standardized on React 18, migration is out of scope
- **Impact**: Cannot use React 19-specific features (Compiler, Actions)

#### TC-1.2: Build Tool
- **Constraint**: Must use Vite 5.4.19 (current version)
- **Reason**: Vite configuration is optimized, upgrade is out of scope
- **Impact**: Bundle optimization must work within Vite 5 capabilities

#### TC-1.3: TypeScript Version
- **Constraint**: Must use TypeScript 5.x with strict mode enabled
- **Reason**: Project requires strict type safety
- **Impact**: All code must pass strict type checking (no `any` types)

#### TC-1.4: UI Component Library
- **Constraint**: Must use shadcn/ui and Radix UI (existing components)
- **Reason**: Design system is already established
- **Impact**: Cannot introduce new component libraries (MUI, Ant Design, etc.)

#### TC-1.5: Rich Text Editor
- **Constraint**: Must use open-source library with MIT or permissive license
- **Options**: Tiptap (MIT), Lexical (MIT), Slate (MIT)
- **Reason**: Budget constraint (no paid licenses)
- **Impact**: Cannot use proprietary editors (TinyMCE, CKEditor Pro)

---

### TC-2: Backend Infrastructure

#### TC-2.1: Database
- **Constraint**: Must use Supabase PostgreSQL (existing instance)
- **Reason**: All data is already in Supabase
- **Impact**: Cannot use separate database for media or versions

#### TC-2.2: Storage
- **Constraint**: Must use Supabase Storage (Free tier: 1GB)
- **Reason**: Budget constraint (no AWS S3, Cloudflare R2)
- **Impact**: Must manage storage quota carefully, implement cleanup

#### TC-2.3: Storage Quota
- **Constraint**: Maximum 1GB total storage (Supabase Free tier)
- **Mitigation**: Upgrade to Pro tier ($25/month) for 100GB if needed
- **Impact**: Must implement:
  - Image optimization (compression, resizing)
  - Storage usage monitoring
  - Automatic cleanup of unused images

#### TC-2.4: API Rate Limits
- **Constraint**: Supabase Free tier rate limits
  - Database: 500 requests/second
  - Storage: 200 requests/second
- **Impact**: Must implement client-side caching and request batching

---

### TC-3: Architecture

#### TC-3.1: Client-Side Rendering
- **Constraint**: Must remain client-side rendered (Vite SPA)
- **Reason**: Project is not migrating to SSR/SSG (Next.js, Remix)
- **Impact**: Cannot use server-side image optimization or ISR

#### TC-3.2: State Management
- **Constraint**: Must use React Query for server state (existing pattern)
- **Reason**: Consistency with CMS Phase 1-4
- **Impact**: All data fetching must use React Query hooks

#### TC-3.3: Routing
- **Constraint**: Must use React Router DOM (existing setup)
- **Reason**: All routes are already defined
- **Impact**: New admin pages must follow existing routing patterns

#### TC-3.4: Bundle Architecture
- **Constraint**: Must maintain code-splitting for admin pages
- **Reason**: Public pages must not load admin code
- **Impact**: Media library and editor must be lazy-loaded

---

## Business Constraints

### BC-1: Budget

#### BC-1.1: Development Budget
- **Constraint**: $0 budget for new paid tools or services
- **Reason**: Personal project with no revenue yet
- **Impact**: Must use free/open-source solutions only

#### BC-1.2: Infrastructure Budget
- **Constraint**: Current Supabase Free tier ($0/month)
- **Upgrade Option**: Pro tier ($25/month) if storage exceeds 1GB
- **Impact**: Must optimize storage usage to delay upgrade

#### BC-1.3: Third-Party Services
- **Constraint**: No paid APIs (image optimization, CDN, etc.)
- **Reason**: Budget constraint
- **Impact**: Must implement optimizations client-side or server-side (Supabase Edge Functions)

---

### BC-2: Timeline

#### BC-2.1: Development Duration
- **Constraint**: 7-10 working days for full implementation
- **Reason**: Project timeline for Version 2.1.0
- **Impact**: Must prioritize MVP features, defer nice-to-haves

#### BC-2.2: Phased Delivery
- **Constraint**: Must deliver features incrementally (not all-at-once)
- **Phases**:
  - Week 1: Media library (3 days)
  - Week 2: Rich text editor (3 days)
  - Week 3: Version control (3 days)
- **Impact**: Each phase must be independently testable and deployable

---

### BC-3: Resources

#### BC-3.1: Developer Capacity
- **Constraint**: 1 developer (solo project)
- **Impact**: Must automate testing, leverage AI assistance, minimize manual work

#### BC-3.2: Testing Resources
- **Constraint**: No dedicated QA team
- **Impact**: Must rely on automated E2E tests and self-testing

#### BC-3.3: Design Resources
- **Constraint**: No dedicated designer
- **Impact**: Must use existing design system (shadcn/ui), follow established patterns

---

## Security Constraints

### SC-1: Access Control

#### SC-1.1: Authentication
- **Constraint**: Must use existing Supabase Auth (no custom auth)
- **Reason**: Auth system is already established
- **Impact**: Cannot implement custom authentication flows

#### SC-1.2: Authorization
- **Constraint**: Must use Supabase Row Level Security (RLS) policies
- **Reason**: All data access is controlled by RLS
- **Impact**: All new tables must have RLS policies

#### SC-1.3: Admin-Only Access
- **Constraint**: Media library and version history must be admin-only
- **Reason**: Security requirement
- **Impact**: Must verify admin role in both client and RLS policies

#### SC-1.4: Public Image URLs
- **Constraint**: Uploaded images must be publicly accessible (no auth)
- **Reason**: Images are embedded in public blog posts
- **Impact**: Cannot use private storage buckets

---

### SC-2: Data Protection

#### SC-2.1: XSS Prevention
- **Constraint**: Must sanitize all HTML output from rich text editor
- **Reason**: Security vulnerability if user-generated HTML is unsanitized
- **Impact**: Must use DOMPurify or similar sanitization library

#### SC-2.2: File Upload Validation
- **Constraint**: Must validate file type and size on both client and server
- **Reason**: Client-side validation alone is insufficient
- **Impact**: Must implement Supabase Edge Function for server-side validation

#### SC-2.3: SQL Injection Prevention
- **Constraint**: Must use parameterized queries (Supabase client)
- **Reason**: Standard SQL injection prevention
- **Impact**: Never concatenate user input into SQL strings

#### SC-2.4: CORS Policy
- **Constraint**: Must respect Supabase CORS settings (same-origin only)
- **Reason**: Storage bucket security
- **Impact**: Cannot upload files from external domains

---

### SC-3: Data Integrity

#### SC-3.1: Immutable Versions
- **Constraint**: Version snapshots must be immutable (no UPDATE allowed)
- **Reason**: Audit trail integrity
- **Impact**: Must use INSERT-only pattern for versions

#### SC-3.2: Soft Delete
- **Constraint**: Image deletion must be soft delete (mark as deleted)
- **Reason**: Prevent accidental data loss
- **Impact**: Must add `deleted_at` column, filter queries

#### SC-3.3: Foreign Key Constraints
- **Constraint**: Must use database foreign keys for referential integrity
- **Reason**: Prevent orphaned records
- **Impact**: Cannot delete users who have uploaded images or created versions

---

## Performance Constraints

### PC-1: Bundle Size

#### PC-1.1: Initial Bundle Limit
- **Constraint**: Total bundle size increase < 50 kB gzip
- **Baseline**: 338 kB gzip (current)
- **Target**: < 390 kB gzip (after Phase 5)
- **Impact**: Must code-split and lazy-load large dependencies

#### PC-1.2: Chunk Size Limit
- **Constraint**: Individual chunk size < 100 kB gzip
- **Reason**: HTTP/2 multiplexing works best with smaller chunks
- **Impact**: Must split large components (editor, media library)

#### PC-1.3: Tree Shaking
- **Constraint**: Must ensure tree shaking works for all dependencies
- **Reason**: Minimize unused code in bundle
- **Impact**: Must import only used modules (e.g., `import { Bold } from '@tiptap/extension-bold'`)

---

### PC-2: Runtime Performance

#### PC-2.1: Page Load Time
- **Constraint**: Time to Interactive (TTI) < 3 seconds on 4G
- **Measurement**: Lighthouse Performance score > 90
- **Impact**: Must optimize critical rendering path

#### PC-2.2: Editor Initialization
- **Constraint**: Editor must initialize within 1 second
- **Reason**: User expectation for responsive UI
- **Impact**: Must lazy-load editor extensions, minimize initial load

#### PC-2.3: Auto-Save Latency
- **Constraint**: Auto-save must complete within 1 second
- **Reason**: User should not notice save operation
- **Impact**: Must debounce auto-save, optimize payload size

#### PC-2.4: Image Upload Speed
- **Constraint**: 5 MB image must upload within 5 seconds on 4G
- **Reason**: User expectation for reasonable upload time
- **Impact**: Must optimize image compression, use streaming upload

---

### PC-3: Scalability

#### PC-3.1: Media Library Scale
- **Constraint**: Must support 10,000+ images without performance degradation
- **Reason**: Long-term growth expectation
- **Impact**: Must implement pagination, virtualization, database indexes

#### PC-3.2: Version History Scale
- **Constraint**: Must support 1,000+ versions per content item
- **Reason**: High-traffic blog posts may have many edits
- **Impact**: Must implement pagination, pruning strategy

#### PC-3.3: Concurrent Users
- **Constraint**: Must support 10+ concurrent admin users
- **Reason**: Team growth expectation
- **Impact**: Must handle concurrent edits, prevent race conditions

---

## Operational Constraints

### OC-1: Deployment

#### OC-1.1: Deployment Platform
- **Constraint**: Must deploy to Vercel (existing setup)
- **Reason**: All infrastructure is on Vercel
- **Impact**: Cannot use platform-specific features (AWS Lambda, Cloudflare Workers)

#### OC-1.2: CI/CD Pipeline
- **Constraint**: Must use GitHub Actions (existing pipeline)
- **Reason**: CI/CD is already configured
- **Impact**: Must integrate new tests into existing workflows

#### OC-1.3: Zero-Downtime Deployment
- **Constraint**: Deployment must not cause downtime
- **Reason**: Production site must remain available
- **Impact**: Must use feature flags, backward-compatible migrations

---

### OC-2: Monitoring

#### OC-2.1: Error Tracking
- **Constraint**: Must use Sentry (existing setup)
- **Reason**: All errors are tracked in Sentry
- **Impact**: Must instrument new features with Sentry error boundaries

#### OC-2.2: Analytics
- **Constraint**: Must use Google Analytics 4 (existing setup)
- **Reason**: User behavior tracking is already configured
- **Impact**: Must track new events (image upload, version restore)

#### OC-2.3: Performance Monitoring
- **Constraint**: Must monitor with Lighthouse CI (existing setup)
- **Reason**: Performance regression detection
- **Impact**: Must maintain Lighthouse score > 90

---

### OC-3: Maintenance

#### OC-3.1: Database Migrations
- **Constraint**: Must use Supabase migrations (SQL files with timestamps)
- **Reason**: Database schema changes must be version-controlled
- **Impact**: All schema changes must be migration files

#### OC-3.2: Backward Compatibility
- **Constraint**: Must maintain backward compatibility with CMS Phase 1-4
- **Reason**: Existing content must not break
- **Impact**: Cannot change existing table schemas (only add columns)

#### OC-3.3: Rollback Strategy
- **Constraint**: Must be able to rollback within 5 minutes
- **Reason**: Critical bug fix requirement
- **Impact**: Must document rollback procedure for each migration

---

## Compatibility Constraints

### CC-1: Browser Support

#### CC-1.1: Modern Browsers
- **Constraint**: Must support last 2 versions of:
  - Chrome, Edge, Firefox, Safari
- **Reason**: Target audience uses modern browsers
- **Impact**: Can use ES2020+ features, CSS Grid, etc.

#### CC-1.2: No IE11 Support
- **Constraint**: Internet Explorer 11 is not supported
- **Reason**: IE11 is deprecated (June 2022)
- **Impact**: No polyfills needed for IE11

#### CC-1.3: Mobile Browser Support
- **Constraint**: Must support iOS Safari and Chrome Mobile
- **Reason**: Admin users may use tablets/phones
- **Impact**: Must test on mobile devices, ensure responsive design

---

### CC-2: Device Support

#### CC-2.1: Desktop-First
- **Constraint**: Admin interface is optimized for desktop (min 1024px width)
- **Reason**: Content creation is primarily desktop workflow
- **Impact**: Mobile admin is functional but not optimized

#### CC-2.2: Minimum Screen Size
- **Constraint**: Must support screens ≥ 768px width (tablet)
- **Reason**: Editor requires sufficient horizontal space
- **Impact**: May show limited UI on smaller screens

---

### CC-3: Backward Compatibility

#### CC-3.1: Existing Content
- **Constraint**: All existing blog posts, services, portfolio items must render correctly
- **Reason**: Cannot break production content
- **Impact**: Must test migration thoroughly

#### CC-3.2: Markdown Compatibility
- **Constraint**: Must support existing markdown syntax (GitHub Flavored Markdown)
- **Reason**: Existing content uses GFM
- **Impact**: Cannot switch to different markdown flavor

#### CC-3.3: API Compatibility
- **Constraint**: Existing API hooks (useProjects, useBlogPosts) must continue to work
- **Reason**: Other components depend on these hooks
- **Impact**: Can extend hooks but not change signatures

---

## Legal and Compliance

### LC-1: Licensing

#### LC-1.1: Open Source Licenses
- **Constraint**: Must use MIT or permissive licenses (Apache 2.0, BSD)
- **Reason**: Commercial use compatibility
- **Acceptable**: MIT, Apache 2.0, BSD, ISC
- **Not Acceptable**: GPL, AGPL (copyleft licenses)

#### LC-1.2: Tiptap License
- **Constraint**: Tiptap core is MIT licensed (free)
- **Note**: Tiptap Pro features require license ($99+/month)
- **Impact**: Must use only MIT-licensed Tiptap extensions

#### LC-1.3: Attribution
- **Constraint**: Must include license notices for all dependencies
- **Reason**: Legal compliance
- **Impact**: Must document all new dependencies in package.json

---

### LC-2: Privacy

#### LC-2.1: User Data
- **Constraint**: Must comply with GDPR (if applicable)
- **Reason**: European users may access the site
- **Impact**: Must provide data deletion capability (admin users)

#### LC-2.2: Cookies
- **Constraint**: Must disclose cookie usage in privacy policy
- **Reason**: Cookie consent laws
- **Impact**: Must update privacy policy if adding new cookies

#### LC-2.3: Third-Party Services
- **Constraint**: Must document all third-party services in privacy policy
- **Reason**: User transparency
- **Impact**: Must update privacy policy for new services (if any)

---

### LC-3: Content Ownership

#### LC-3.1: User-Generated Content
- **Constraint**: Admins retain copyright to their content
- **Reason**: Standard practice for CMS platforms
- **Impact**: Must clarify in terms of service

#### LC-3.2: Uploaded Images
- **Constraint**: Admins must have rights to uploaded images
- **Reason**: Copyright compliance
- **Impact**: Must include terms of use disclaimer

---

## Summary of Critical Constraints

### Must Have (Non-Negotiable)

1. ✅ **Budget**: $0 for new paid tools
2. ✅ **Timeline**: 7-10 days development
3. ✅ **Technology**: React 18, Vite 5, Supabase (no changes)
4. ✅ **Bundle Size**: < +50 kB gzip increase
5. ✅ **Security**: RLS policies, XSS prevention, file validation
6. ✅ **Performance**: TTI < 3s, Lighthouse > 90
7. ✅ **Compatibility**: Backward compatible with Phase 1-4
8. ✅ **License**: MIT or permissive only

### Should Have (Flexible)

1. ⚠️ **Storage**: 1GB limit (can upgrade to Pro if needed)
2. ⚠️ **Mobile**: Desktop-first, mobile functional
3. ⚠️ **Browser**: Last 2 versions (can drop older if needed)

### Nice to Have (Optional)

1. 💡 **Image Optimization**: Server-side compression (can defer)
2. 💡 **CDN**: Faster image delivery (can add later)
3. 💡 **Advanced Search**: Full-text search (Phase 6)

---

## Constraint Validation Checklist

Before proceeding to planning (Stage 2), verify:

- [ ] All constraints documented
- [ ] All constraints justified (reason provided)
- [ ] All constraints marked as Must/Should/Nice-to-have
- [ ] All constraints measurable (testable)
- [ ] All constraints communicated to stakeholders
- [ ] All constraints accepted by development team
- [ ] No conflicting constraints (resolved)
- [ ] Mitigation strategies for risky constraints

---

**Next Steps**: Proceed to Stage 2 (Plan) - Architecture design must respect all constraints documented here
