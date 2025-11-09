// Version 2.0 Type Definitions

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  status: 'backlog' | 'in-progress' | 'validate' | 'launched';
  category: string;
  image?: string;
  tags: string[];
  metrics: ProjectMetrics;
  tech: ProjectTech;
  links: ProjectLinks;
  timeline: ProjectTimeline;
  highlights?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectMetrics {
  progress: number;
  contributors: number;
  commits: number;
  tests: number;
  coverage?: number;
}

export interface ProjectTech {
  frontend?: string[];
  backend?: string[] | null;
  testing?: string[] | null;
  deployment?: string[];
}

export interface ProjectLinks {
  github?: string;
  demo?: string | null;
  docs?: string | null;
}

export interface ProjectTimeline {
  started: string;
  launched?: string | null;
  updated: string;
}

export interface Roadmap {
  id: number;
  quarter: string;
  theme: string;
  description?: string;
  progress: number;
  owner?: string;
  related_projects: string[];
  milestones: Milestone[];
  risk_level?: 'low' | 'medium' | 'high';
  kpis: Record<string, KPI>;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dueDate?: string;
  tasks?: string[];
}

export interface KPI {
  target: number;
  current: number;
  unit?: string;
}

export interface Log {
  id: number;
  type: 'release' | 'learning' | 'decision';
  title: string;
  content: string;
  project_id?: string | null;
  author_id?: string | null;
  tags: string[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Bounty {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'assigned' | 'in-progress' | 'done' | 'pending';
  difficulty: '초급' | '중급' | '고급';
  reward: number;
  estimated_hours?: number;
  skills_required: string[];
  deliverables: string[];
  deadline?: string;
  assignee_id?: string | null;
  applicants: string[];
  project_id?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: number;
  name: string;
  email: string;
  company?: string;
  package: 'mvp' | 'consulting' | 'design' | 'other';
  budget?: string;
  message: string;
  preferred_contact?: 'email' | 'phone' | 'calendar';
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  phone?: string;
  user_id?: string | null;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProposalFormValues {
  name: string;
  email: string;
  company?: string;
  package: 'mvp' | 'consulting' | 'design' | 'other';
  budget?: string;
  message: string;
  preferred_contact?: 'email' | 'phone' | 'calendar';
  phone?: string;
}
