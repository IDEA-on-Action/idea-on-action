/**
 * LabForm Component
 * Lab/Bounty create/edit form with React Hook Form + Zod validation
 *
 * Features:
 * - 4 Accordion sections
 * - 11 form fields
 * - Zod validation
 * - Auto-slug generation
 * - MultiSelect for skills and tags
 * - Markdown description
 *
 * CMS Phase 2 - AdminLab LabForm
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

// UI Components
import { FormModal } from '@/components/admin/ui/FormModal';
import { MultiSelect } from '@/components/admin/ui/MultiSelect';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Types
import type { CMSLabItem, LabStatus, LabDifficulty } from '@/types/cms-lab.types';
import { generateSlug } from '@/lib/cms-utils';

// =====================================================
// ZOD SCHEMA
// =====================================================

const labSchema = z.object({
  // Basic Info
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase, numbers, and hyphens only'),
  status: z.enum(['open', 'in_progress', 'completed', 'closed']),

  // Description
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000),

  // Bounty Details
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  reward: z.string().max(200).optional().or(z.literal('')),
  skills_required: z.array(z.string()).min(1, 'At least one skill required').max(10),
  github_url: z.string().url('Invalid URL').optional().or(z.literal('')),

  // Contributors (display only, managed by applicants system)
  contributors: z.array(z.string()).max(20),

  // Tags
  tags: z.array(z.string()).min(1, 'At least one tag required').max(10),

  // Visibility
  is_published: z.boolean().default(false),
});

type LabFormValues = z.infer<typeof labSchema>;

// =====================================================
// COMPONENT PROPS
// =====================================================

export interface LabFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: CMSLabItem | null;
  onSuccess?: () => void;
  onSubmit: (values: Partial<CMSLabItem>) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
}

// =====================================================
// SKILLS OPTIONS (Common skills for Lab bounties)
// =====================================================

const skillsOptions = [
  { label: 'React', value: 'react' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Node.js', value: 'nodejs' },
  { label: 'Python', value: 'python' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'Docker', value: 'docker' },
  { label: 'AWS', value: 'aws' },
  { label: 'GraphQL', value: 'graphql' },
  { label: 'REST API', value: 'restapi' },
  { label: 'Supabase', value: 'supabase' },
  { label: 'Next.js', value: 'nextjs' },
  { label: 'Vue.js', value: 'vuejs' },
  { label: 'Angular', value: 'angular' },
  { label: 'Tailwind CSS', value: 'tailwindcss' },
  { label: 'Git', value: 'git' },
  { label: 'CI/CD', value: 'cicd' },
  { label: 'Testing', value: 'testing' },
  { label: 'UI/UX Design', value: 'design' },
  { label: 'Technical Writing', value: 'writing' },
];

// =====================================================
// TAGS OPTIONS (Can be fetched from tags table later)
// =====================================================

const tagsOptions = [
  { label: 'Bounty', value: 'bounty' },
  { label: 'Experiment', value: 'experiment' },
  { label: 'Research', value: 'research' },
  { label: 'Feature', value: 'feature' },
  { label: 'Bug Fix', value: 'bugfix' },
  { label: 'Documentation', value: 'documentation' },
  { label: 'Design', value: 'design' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'Fullstack', value: 'fullstack' },
  { label: 'DevOps', value: 'devops' },
  { label: 'AI/ML', value: 'aiml' },
  { label: 'Community', value: 'community' },
];

// =====================================================
// MAIN COMPONENT
// =====================================================

export function LabForm({
  isOpen,
  onClose,
  editingItem,
  onSuccess,
  onSubmit,
  isSubmitting = false,
  error = null,
}: LabFormProps) {
  // Form setup
  const form = useForm<LabFormValues>({
    resolver: zodResolver(labSchema),
    defaultValues: {
      title: '',
      slug: '',
      status: 'open',
      description: '',
      difficulty: 'beginner',
      reward: '',
      skills_required: [],
      github_url: '',
      contributors: [],
      tags: [],
      is_published: false,
    },
  });

  // Reset form when modal opens/closes or editing item changes
  useEffect(() => {
    if (isOpen && editingItem) {
      form.reset({
        title: editingItem.title || '',
        slug: editingItem.slug || '',
        status: editingItem.status || 'open',
        description: editingItem.description || '',
        difficulty: editingItem.difficulty || 'beginner',
        reward: editingItem.reward || '',
        skills_required: editingItem.skills_required || [],
        github_url: editingItem.github_url || '',
        contributors: editingItem.contributors || [],
        tags: editingItem.tags || [],
        is_published: editingItem.is_published || false,
      });
    } else if (isOpen && !editingItem) {
      form.reset();
    }
  }, [isOpen, editingItem, form]);

  // Slug auto-generation
  const handleTitleBlur = () => {
    const title = form.getValues('title');
    const currentSlug = form.getValues('slug');

    if (title && (!currentSlug || editingItem === null)) {
      form.setValue('slug', generateSlug(title));
    }
  };

  // Form submission
  const handleSubmit = async (values: LabFormValues) => {
    try {
      await onSubmit(values);
      toast.success(editingItem ? 'Lab bounty updated successfully' : 'Lab bounty created successfully');
      onSuccess?.();
      onClose();
      form.reset();
    } catch (err) {
      toast.error(`Failed to save lab bounty: ${(err as Error).message}`);
    }
  };

  // Character count helper
  const getCharCount = (field: keyof LabFormValues) => {
    const value = form.watch(field);
    return typeof value === 'string' ? value.length : 0;
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? 'Edit Lab Bounty' : 'New Lab Bounty'}
      description="Fill in the lab bounty details below"
      onSubmit={form.handleSubmit(handleSubmit)}
      submitLabel={editingItem ? 'Update' : 'Create'}
      loading={isSubmitting}
      error={error || undefined}
      size="lg"
    >
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <Accordion type="single" collapsible defaultValue="basic" className="w-full">
          {/* ========================================= */}
          {/* SECTION 1: BASIC INFORMATION */}
          {/* ========================================= */}
          <AccordionItem value="basic">
            <AccordionTrigger>Basic Information</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Lab bounty title"
                  {...form.register('title')}
                  onBlur={handleTitleBlur}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    placeholder="lab-bounty-slug"
                    {...form.register('slug')}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const title = form.getValues('title');
                      if (title) form.setValue('slug', generateSlug(title));
                    }}
                  >
                    Generate
                  </Button>
                </div>
                {form.formState.errors.slug && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={form.watch('status')}
                  onValueChange={(value) =>
                    form.setValue('status', value as LabStatus)
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open =â</SelectItem>
                    <SelectItem value="in_progress">In Progress =á</SelectItem>
                    <SelectItem value="completed">Completed </SelectItem>
                    <SelectItem value="closed">Closed U</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.status && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.status.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description * ({getCharCount('description')}/5000)</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed bounty description (supports Markdown)"
                  rows={8}
                  maxLength={5000}
                  {...form.register('description')}
                />
                <p className="text-xs text-muted-foreground mt-1">Supports Markdown formatting</p>
                {form.formState.errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ========================================= */}
          {/* SECTION 2: BOUNTY DETAILS */}
          {/* ========================================= */}
          <AccordionItem value="bounty">
            <AccordionTrigger>Bounty Details</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {/* Difficulty */}
              <div>
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select
                  value={form.watch('difficulty')}
                  onValueChange={(value) =>
                    form.setValue('difficulty', value as LabDifficulty)
                  }
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner =â</SelectItem>
                    <SelectItem value="intermediate">Intermediate =á</SelectItem>
                    <SelectItem value="advanced">Advanced =4</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.difficulty && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.difficulty.message}
                  </p>
                )}
              </div>

              {/* Reward */}
              <div>
                <Label htmlFor="reward">Reward</Label>
                <Input
                  id="reward"
                  placeholder="e.g., $500, 10% equity, or open source contribution"
                  maxLength={200}
                  {...form.register('reward')}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional: Describe monetary or non-monetary rewards
                </p>
                {form.formState.errors.reward && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.reward.message}
                  </p>
                )}
              </div>

              {/* Skills Required */}
              <div>
                <Label htmlFor="skills_required">Required Skills * (Max 10)</Label>
                <MultiSelect
                  options={skillsOptions}
                  value={form.watch('skills_required') || []}
                  onChange={(value) => form.setValue('skills_required', value)}
                  placeholder="Select skills"
                  maxCount={10}
                  onCreate={async (value) => {
                    // Add custom skill
                    const current = form.getValues('skills_required') || [];
                    form.setValue('skills_required', [...current, value]);
                  }}
                />
                {form.formState.errors.skills_required && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.skills_required.message}
                  </p>
                )}
              </div>

              {/* GitHub URL */}
              <div>
                <Label htmlFor="github_url">GitHub Repository URL</Label>
                <Input
                  id="github_url"
                  type="url"
                  placeholder="https://github.com/username/repo"
                  {...form.register('github_url')}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Link to the related GitHub repository or issue
                </p>
                {form.formState.errors.github_url && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.github_url.message}
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ========================================= */}
          {/* SECTION 3: CONTRIBUTORS & TAGS */}
          {/* ========================================= */}
          <AccordionItem value="meta">
            <AccordionTrigger>Contributors & Tags</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {/* Contributors (display only) */}
              <div>
                <Label htmlFor="contributors">Contributors</Label>
                <div className="text-sm text-muted-foreground mb-2">
                  Contributors are automatically added when applicants are accepted
                </div>
                {form.watch('contributors')?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {form.watch('contributors').map((contributor, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                      >
                        {contributor}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No contributors yet
                  </p>
                )}
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">Tags * (Max 10)</Label>
                <MultiSelect
                  options={tagsOptions}
                  value={form.watch('tags') || []}
                  onChange={(value) => form.setValue('tags', value)}
                  placeholder="Select tags"
                  maxCount={10}
                  onCreate={async (value) => {
                    // Add custom tag
                    const current = form.getValues('tags') || [];
                    form.setValue('tags', [...current, value]);
                  }}
                />
                {form.formState.errors.tags && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.tags.message}
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ========================================= */}
          {/* SECTION 4: VISIBILITY */}
          {/* ========================================= */}
          <AccordionItem value="visibility">
            <AccordionTrigger>Visibility</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {/* Published */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is_published" className="cursor-pointer">
                    {form.watch('is_published') ? 'Published' : 'Draft'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {form.watch('is_published')
                      ? 'This bounty is visible to the public'
                      : 'This bounty is only visible to admins'}
                  </p>
                </div>
                <Switch
                  id="is_published"
                  checked={form.watch('is_published')}
                  onCheckedChange={(checked) => form.setValue('is_published', checked)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </FormModal>
  );
}
