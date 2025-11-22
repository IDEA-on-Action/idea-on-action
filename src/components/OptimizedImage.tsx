/**
 * OptimizedImage Component
 *
 * 성능 최적화된 이미지 컴포넌트
 * - Lazy loading (loading="lazy")
 * - 이미지 크기 명시 (CLS 방지)
 * - WebP 포맷 지원 (picture 요소)
 * - Placeholder/Skeleton UI
 * - 에러 핸들링
 *
 * Created: 2025-11-22
 * Related: TASK-076 이미지 최적화
 */

import { useState, useRef, useEffect, ImgHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  /** 이미지 소스 URL */
  src: string;
  /** 대체 텍스트 (접근성) */
  alt: string;
  /** 이미지 너비 (CLS 방지를 위해 명시 권장) */
  width?: number | string;
  /** 이미지 높이 (CLS 방지를 위해 명시 권장) */
  height?: number | string;
  /** WebP 소스 URL (선택적) */
  webpSrc?: string;
  /** 로딩 전략 (기본값: lazy) */
  loading?: 'lazy' | 'eager';
  /** 블러 placeholder 사용 여부 */
  placeholder?: boolean;
  /** placeholder 색상 */
  placeholderColor?: string;
  /** 로드 완료 콜백 */
  onLoad?: () => void;
  /** 에러 콜백 */
  onError?: (error: Error) => void;
  /** 페치 우선순위 */
  fetchPriority?: 'high' | 'low' | 'auto';
  /** 폴백 이미지 URL */
  fallbackSrc?: string;
  /** 이미지 비율 (예: 16/9, 4/3, 1) */
  aspectRatio?: number;
  /** 컨테이너 스타일 */
  containerClassName?: string;
}

/**
 * 성능 최적화된 이미지 컴포넌트
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <OptimizedImage
 *   src="/images/hero.jpg"
 *   alt="Hero image"
 *   width={1200}
 *   height={600}
 * />
 *
 * // WebP 지원 + Placeholder
 * <OptimizedImage
 *   src="/images/photo.jpg"
 *   webpSrc="/images/photo.webp"
 *   alt="Photo"
 *   width={400}
 *   height={300}
 *   placeholder
 * />
 *
 * // Hero 이미지 (즉시 로드)
 * <OptimizedImage
 *   src="/images/hero.jpg"
 *   alt="Hero"
 *   loading="eager"
 *   fetchPriority="high"
 *   width={1920}
 *   height={1080}
 * />
 * ```
 */
export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      webpSrc,
      loading = 'lazy',
      placeholder = true,
      placeholderColor = 'bg-muted',
      onLoad,
      onError,
      fetchPriority = 'auto',
      fallbackSrc = '/placeholder.svg',
      aspectRatio,
      className,
      containerClassName,
      style,
      ...props
    },
    ref
  ) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement | null>(null);

    // 이미지가 이미 캐시되어 있는지 확인
    useEffect(() => {
      const img = imgRef.current;
      if (img?.complete && img.naturalWidth > 0) {
        setIsLoaded(true);
      }
    }, [src]);

    const handleLoad = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    const handleError = () => {
      setHasError(true);
      onError?.(new Error(`Failed to load image: ${src}`));
    };

    // 실제 표시할 이미지 소스
    const imageSrc = hasError ? fallbackSrc : src;

    // 이미지 요소 공통 props
    const imageProps: ImgHTMLAttributes<HTMLImageElement> = {
      src: imageSrc,
      alt,
      width: width || undefined,
      height: height || undefined,
      loading,
      decoding: 'async',
      fetchPriority,
      onLoad: handleLoad,
      onError: handleError,
      className: cn(
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className
      ),
      style: {
        ...style,
        ...(aspectRatio && !height ? { aspectRatio: String(aspectRatio) } : {}),
      },
      ...props,
    };

    // 컨테이너 스타일
    const containerStyle: React.CSSProperties = {
      position: 'relative',
      width: width || '100%',
      height: height || (aspectRatio ? 'auto' : '100%'),
      ...(aspectRatio && !height ? { aspectRatio: String(aspectRatio) } : {}),
    };

    // ref를 병합하는 함수
    const setRefs = (element: HTMLImageElement | null) => {
      imgRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    return (
      <div className={cn('overflow-hidden', containerClassName)} style={containerStyle}>
        {/* Placeholder skeleton */}
        {placeholder && !isLoaded && !hasError && (
          <div
            className={cn(
              'absolute inset-0 animate-pulse',
              placeholderColor
            )}
            aria-hidden="true"
          />
        )}

        {/* WebP 지원 브라우저용 picture 요소 */}
        {webpSrc && !hasError ? (
          <picture>
            <source srcSet={webpSrc} type="image/webp" />
            <img ref={setRefs} {...imageProps} />
          </picture>
        ) : (
          <img ref={setRefs} {...imageProps} />
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

/**
 * Hero 이미지 최적화 프리셋
 * LCP 최적화를 위해 eager loading 및 high priority 사용
 */
export const HeroImage = forwardRef<HTMLImageElement, Omit<OptimizedImageProps, 'loading' | 'fetchPriority'>>(
  (props, ref) => (
    <OptimizedImage
      ref={ref}
      loading="eager"
      fetchPriority="high"
      placeholder={false}
      {...props}
    />
  )
);

HeroImage.displayName = 'HeroImage';

/**
 * 썸네일 이미지 프리셋
 * 작은 크기 이미지에 최적화
 */
export const ThumbnailImage = forwardRef<HTMLImageElement, Omit<OptimizedImageProps, 'loading'>>(
  (props, ref) => (
    <OptimizedImage
      ref={ref}
      loading="lazy"
      fetchPriority="low"
      {...props}
    />
  )
);

ThumbnailImage.displayName = 'ThumbnailImage';

export default OptimizedImage;
