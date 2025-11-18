/**
 * WordPress.com REST API Types
 * API Documentation: https://developer.wordpress.com/docs/api/
 */

export interface WordPressAuthor {
  ID: number
  login: string
  name: string
  email: string | false
  avatar_URL: string
  profile_URL: string
}

export interface WordPressCategory {
  [key: string]: {
    ID: number
    name: string
    slug: string
    description: string
    post_count: number
  }
}

export interface WordPressPost {
  ID: number
  site_ID: number
  title: string
  excerpt: string
  content: string
  date: string // ISO 8601 format
  modified: string
  status: 'publish' | 'draft' | 'pending' | 'private' | 'trash'
  type: 'post' | 'page'
  author: WordPressAuthor
  categories: WordPressCategory
  tags: { [key: string]: unknown }
  featured_image: string
  post_thumbnail: {
    ID: number
    URL: string
    width: number
    height: number
  } | null
  URL: string
  short_URL: string
  comment_count: number
  like_count: number
  discussion: {
    comments_open: boolean
    pings_open: boolean
  }
  attachments: {
    [key: number]: {
      ID: number
      URL: string
      mime_type: string
      width: number
      height: number
    }
  }
}

export interface WordPressResponse {
  found: number // Total posts found
  posts: WordPressPost[]
  meta?: {
    next_page?: string
    links?: {
      self: string
      help: string
      site: string
    }
  }
}

/**
 * Unified Blog Post Type (Supabase + WordPress)
 */
export interface UnifiedBlogPost {
  id: string // WordPress: `wp-${ID}`, Supabase: UUID
  source: 'wordpress' | 'supabase'
  title: string
  excerpt: string
  content: string
  publishedAt: Date
  author: {
    name: string
    avatar?: string
  }
  categories: string[]
  tags: string[]
  featuredImage?: string
  url: string
  commentCount?: number
  likeCount?: number
}

/**
 * Helper function to convert WordPress post to unified format
 */
export function wordpressToUnified(wp: WordPressPost): UnifiedBlogPost {
  const categories = Object.values(wp.categories || {}).map(cat => cat.name)
  const tags = Object.keys(wp.tags || {})

  return {
    id: `wp-${wp.ID}`,
    source: 'wordpress',
    title: wp.title,
    excerpt: wp.excerpt,
    content: wp.content,
    publishedAt: new Date(wp.date),
    author: {
      name: wp.author.name,
      avatar: wp.author.avatar_URL,
    },
    categories,
    tags,
    featuredImage: wp.featured_image || wp.post_thumbnail?.URL,
    url: wp.URL,
    commentCount: wp.comment_count,
    likeCount: wp.like_count,
  }
}
