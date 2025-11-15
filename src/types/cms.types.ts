/**
 * CMS TypeScript Type Definitions
 *
 * Generated from Supabase migration files (20251115170300-170307)
 *
 * Type mapping:
 * - UUID → string
 * - TEXT → string
 * - TEXT[] → string[]
 * - TIMESTAMPTZ → string (ISO 8601)
 * - BOOLEAN → boolean
 * - INTEGER → number
 * - JSONB → Record<string, any>
 * - DATE → string (YYYY-MM-DD)
 */

// =====================================================
// ENUMS
// =====================================================

/**
 * Admin role types (CMS-001)
 */
export type AdminRole = 'super_admin' | 'admin' | 'editor';

/**
 * Roadmap item categories (CMS-002)
 */
export type RoadmapCategory = 'service' | 'platform' | 'internal';

/**
 * Roadmap item status (CMS-002)
 */
export type RoadmapStatus = 'planned' | 'in-progress' | 'completed' | 'on-hold';

/**
 * Portfolio project types (CMS-003)
 */
export type PortfolioProjectType = 'mvp' | 'fullstack' | 'design' | 'operations';

/**
 * Lab item categories (CMS-004)
 */
export type LabCategory = 'experiment' | 'idea' | 'community' | 'research';

/**
 * Lab item status (CMS-004)
 */
export type LabStatus = 'exploring' | 'developing' | 'testing' | 'completed' | 'archived';

/**
 * Blog post status (CMS-005)
 */
export type BlogPostStatus = 'draft' | 'published' | 'archived';

// =====================================================
// INTERFACES - Database Tables
// =====================================================

/**
 * Admin users with role-based permissions (CMS-001)
 * Table: public.admins
 */
export interface Admin {
  id: string; // UUID
  userId: string; // UUID (FK to auth.users)
  role: AdminRole;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * Quarterly roadmap items with status and progress tracking (CMS-002)
 * Table: public.roadmap_items
 */
export interface RoadmapItem {
  id: string; // UUID
  title: string;
  description: string | null;
  category: RoadmapCategory;
  status: RoadmapStatus;
  progress: number; // 0-100
  priority: number;
  startDate: string | null; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
  tags: string[];
  published: boolean;
  createdBy: string | null; // UUID (FK to admins.user_id)
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * Portfolio case studies with detailed project information (CMS-003)
 * Table: public.portfolio_items
 */
export interface PortfolioItem {
  id: string; // UUID
  slug: string; // unique
  title: string;
  summary: string;
  description: string | null;
  clientName: string | null;
  clientLogo: string | null;
  projectType: PortfolioProjectType;
  thumbnail: string | null;
  images: string[];
  techStack: string[];
  projectUrl: string | null;
  githubUrl: string | null;
  duration: string | null;
  teamSize: number | null;
  startDate: string | null; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
  challenges: string | null;
  solutions: string | null;
  outcomes: string | null;
  testimonial: PortfolioTestimonial;
  featured: boolean;
  published: boolean;
  createdBy: string | null; // UUID (FK to admins.user_id)
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * Portfolio testimonial structure (JSONB field)
 */
export interface PortfolioTestimonial {
  author?: string;
  role?: string;
  company?: string;
  content?: string;
  avatar?: string;
}

/**
 * Lab experiments and ideas with community participation (CMS-004)
 * Table: public.lab_items
 */
export interface LabItem {
  id: string; // UUID
  slug: string; // unique
  title: string;
  subtitle: string | null;
  description: string;
  content: string | null; // Markdown
  category: LabCategory;
  status: LabStatus;
  techStack: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  contributors: string[];
  startDate: string | null; // YYYY-MM-DD
  tags: string[];
  published: boolean;
  createdBy: string | null; // UUID (FK to admins.user_id)
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * Blog posts with Markdown support (CMS-005, extended from existing table)
 * Table: public.blog_posts
 *
 * Note: This interface includes only the NEW columns added in CMS Phase 1.
 * For the complete blog_posts type, see src/types/database.types.ts
 */
export interface BlogPostCMSExtension {
  summary?: string | null; // Short summary for SEO
  tags?: string[]; // Array of tag names
  featured?: boolean; // Pin to top
}

/**
 * Blog post categories with color and icon (CMS-007)
 * Table: public.blog_categories
 */
export interface BlogCategory {
  id: string; // UUID
  name: string;
  slug: string; // unique
  description: string | null;
  color: string; // hex color code (default: #3b82f6)
  icon: string; // icon name (default: folder)
  postCount: number; // cached count
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * Team member information for About page (CMS-006)
 * Table: public.team_members
 */
export interface TeamMember {
  id: string; // UUID
  name: string;
  role: string;
  bio: string | null;
  avatar: string | null;
  email: string | null;
  skills: string[];
  socialLinks: TeamMemberSocialLinks;
  priority: number; // display order
  active: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * Team member social links structure (JSONB field)
 */
export interface TeamMemberSocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

/**
 * Global tags used across all content types (CMS-008)
 * Table: public.tags
 */
export interface Tag {
  id: string; // UUID
  name: string; // unique
  slug: string; // unique
  usageCount: number; // cached count
  createdAt: string; // ISO 8601
}

// =====================================================
// INSERT & UPDATE TYPES
// =====================================================

/**
 * Admin insert type (all fields except auto-generated)
 */
export type AdminInsert = Omit<Admin, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Admin update type (partial, excluding id)
 */
export type AdminUpdate = Partial<Omit<Admin, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Roadmap item insert type
 */
export type RoadmapItemInsert = Omit<RoadmapItem, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Roadmap item update type
 */
export type RoadmapItemUpdate = Partial<Omit<RoadmapItem, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Portfolio item insert type
 */
export type PortfolioItemInsert = Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Portfolio item update type
 */
export type PortfolioItemUpdate = Partial<Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Lab item insert type
 */
export type LabItemInsert = Omit<LabItem, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Lab item update type
 */
export type LabItemUpdate = Partial<Omit<LabItem, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Blog category insert type
 */
export type BlogCategoryInsert = Omit<BlogCategory, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Blog category update type
 */
export type BlogCategoryUpdate = Partial<Omit<BlogCategory, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Team member insert type
 */
export type TeamMemberInsert = Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Team member update type
 */
export type TeamMemberUpdate = Partial<Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Tag insert type
 */
export type TagInsert = Omit<Tag, 'id' | 'createdAt'>;

/**
 * Tag update type
 */
export type TagUpdate = Partial<Omit<Tag, 'id' | 'createdAt'>>;

// =====================================================
// HELPER TYPES
// =====================================================

/**
 * Admin with user details (joined with auth.users)
 */
export interface AdminWithUser extends Admin {
  user: {
    email: string;
    emailConfirmedAt: string | null;
    lastSignInAt: string | null;
  };
}

/**
 * Roadmap item with creator info
 */
export interface RoadmapItemWithCreator extends RoadmapItem {
  creator?: {
    userId: string;
    role: AdminRole;
  };
}

/**
 * Portfolio item with creator info
 */
export interface PortfolioItemWithCreator extends PortfolioItem {
  creator?: {
    userId: string;
    role: AdminRole;
  };
}

/**
 * Lab item with creator info
 */
export interface LabItemWithCreator extends LabItem {
  creator?: {
    userId: string;
    role: AdminRole;
  };
}

/**
 * Tag with related content counts
 */
export interface TagWithCounts extends Tag {
  roadmapCount?: number;
  portfolioCount?: number;
  labCount?: number;
  blogCount?: number;
}

// =====================================================
// QUERY FILTERS
// =====================================================

/**
 * Roadmap item filter options
 */
export interface RoadmapItemFilter {
  category?: RoadmapCategory;
  status?: RoadmapStatus;
  published?: boolean;
  tags?: string[];
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

/**
 * Portfolio item filter options
 */
export interface PortfolioItemFilter {
  projectType?: PortfolioProjectType;
  published?: boolean;
  featured?: boolean;
  techStack?: string[];
  tags?: string[];
}

/**
 * Lab item filter options
 */
export interface LabItemFilter {
  category?: LabCategory;
  status?: LabStatus;
  published?: boolean;
  tags?: string[];
  techStack?: string[];
}

/**
 * Blog category filter options
 */
export interface BlogCategoryFilter {
  slug?: string;
  minPostCount?: number;
}

/**
 * Team member filter options
 */
export interface TeamMemberFilter {
  active?: boolean;
  skills?: string[];
}

/**
 * Tag filter options
 */
export interface TagFilter {
  minUsageCount?: number;
  search?: string; // search in name
}
