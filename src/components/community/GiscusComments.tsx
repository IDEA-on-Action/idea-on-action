import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface GiscusCommentsProps {
  /** The GitHub repository in the format "owner/repo" */
  repo?: string;
  /** The repository ID (from Giscus settings) */
  repoId?: string;
  /** The category name for discussions */
  category?: string;
  /** The category ID (from Giscus settings) */
  categoryId?: string;
  /** Mapping between parent page and discussion */
  mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  /** Enable reactions */
  reactionsEnabled?: boolean;
  /** Language */
  lang?: string;
}

/**
 * Giscus Comments Component
 *
 * GitHub Discussions-based comment system using Giscus.
 *
 * Setup Instructions:
 * 1. Install Giscus app on your repository: https://github.com/apps/giscus
 * 2. Enable Discussions in your repository settings
 * 3. Get your repository ID and category ID from: https://giscus.app/
 * 4. Update the props below with your repository information
 *
 * Example:
 * <GiscusComments
 *   repo="IDEA-on-Action/idea-on-action"
 *   repoId="YOUR_REPO_ID"
 *   category="General"
 *   categoryId="YOUR_CATEGORY_ID"
 * />
 */
export const GiscusComments = ({
  repo = 'IDEA-on-Action/idea-on-action', // TODO: Update with your repo
  repoId = 'CONFIGURE_REPO_ID', // TODO: Get from https://giscus.app/
  category = 'General',
  categoryId = 'CONFIGURE_CATEGORY_ID', // TODO: Get from https://giscus.app/
  mapping = 'pathname',
  reactionsEnabled = true,
  lang = 'ko',
}: GiscusCommentsProps) => {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if configuration is needed
    if (repoId.includes('CONFIGURE') || categoryId.includes('CONFIGURE')) {
      console.warn(
        'Giscus is not configured. Please update repoId and categoryId.\n' +
        'Get your values from: https://giscus.app/'
      );
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', mapping);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', reactionsEnabled ? '1' : '0');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', resolvedTheme === 'dark' ? 'dark' : 'light');
    script.setAttribute('data-lang', lang);
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    const container = containerRef.current;
    container.appendChild(script);

    return () => {
      // Cleanup
      if (container) {
        const iframe = container.querySelector('iframe.giscus-frame');
        if (iframe) {
          iframe.remove();
        }
      }
    };
  }, [repo, repoId, category, categoryId, mapping, reactionsEnabled, lang, resolvedTheme]);

  // Show placeholder if not configured
  if (repoId.includes('CONFIGURE') || categoryId.includes('CONFIGURE')) {
    return (
      <div className="glass-card p-8 text-center space-y-4">
        <h3 className="text-lg font-bold">댓글 시스템 설정 필요</h3>
        <p className="text-sm text-muted-foreground">
          Giscus 댓글 시스템을 사용하려면 GitHub Discussions를 설정해야 합니다.
        </p>
        <ol className="text-sm text-left space-y-2 max-w-md mx-auto">
          <li>1. GitHub repository에 Giscus 앱 설치</li>
          <li>2. Discussions 활성화</li>
          <li>3. <a href="https://giscus.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">giscus.app</a>에서 설정값 받기</li>
          <li>4. <code className="bg-muted px-1 py-0.5 rounded text-xs">GiscusComments.tsx</code>에 repoId와 categoryId 업데이트</li>
        </ol>
      </div>
    );
  }

  return <div ref={containerRef} className="giscus-container" />;
};
