/**
 * Sacred Image Optimization Utilities
 * For the GodsIMiJ AI Solutions Empire
 */

export interface ImageSizes {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export const NODE_LOGO_SIZES: ImageSizes = {
  sm: '32px',
  md: '64px', 
  lg: '96px',
  xl: '128px'
};

export const HERO_LOGO_SIZES = {
  mobile: '192px',
  tablet: '256px',
  desktop: '320px'
};

/**
 * Generate responsive image sizes string for different breakpoints
 */
export const generateSizes = (sizes: Partial<ImageSizes>): string => {
  const sizeEntries = Object.entries(sizes);
  if (sizeEntries.length === 0) return '100vw';
  
  const sizeStrings = sizeEntries.map(([breakpoint, size]) => {
    switch (breakpoint) {
      case 'sm':
        return `(max-width: 640px) ${size}`;
      case 'md':
        return `(max-width: 768px) ${size}`;
      case 'lg':
        return `(max-width: 1024px) ${size}`;
      case 'xl':
        return `(max-width: 1280px) ${size}`;
      default:
        return size;
    }
  });
  
  return sizeStrings.join(', ');
};

/**
 * Optimize image loading based on viewport and connection
 */
export const getOptimalLoadingStrategy = (priority: boolean = false) => {
  return {
    loading: priority ? 'eager' as const : 'lazy' as const,
    decoding: 'async' as const,
    fetchPriority: priority ? 'high' as const : 'auto' as const
  };
};

/**
 * Sacred NODE logo configuration
 */
export const NODE_LOGO_CONFIG = {
  src: '/NODE.png',
  alt: 'GodsIMiJ AI Solutions - Sacred NODE Emblem',
  sizes: generateSizes({
    sm: NODE_LOGO_SIZES.sm,
    md: NODE_LOGO_SIZES.md,
    lg: NODE_LOGO_SIZES.lg,
    xl: NODE_LOGO_SIZES.xl
  })
};

/**
 * Performance monitoring for image loading
 */
export const trackImagePerformance = (imageName: string) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes(imageName)) {
          console.log(`Sacred Image ${imageName} loaded in ${entry.duration}ms`);
        }
      });
    });
    observer.observe({ entryTypes: ['resource'] });
  }
};

/**
 * Preload critical images
 */
export const preloadCriticalImages = () => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = '/NODE.png';
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  }
};
