import React from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  sizes = "100vw",
  className,
  ...props
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      sizes={sizes}
      className={cn(
        "max-w-full h-auto object-contain",
        className
      )}
      {...props}
    />
  );
};

// Sacred NODE Logo Component with responsive sizing
export const NodeLogo: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  return (
    <OptimizedImage
      src="/NODE.png"
      alt="GodsIMiJ AI Solutions - NODE Seal"
      className={cn(
        sizeClasses[size],
        "drop-shadow-lg hover:drop-shadow-xl transition-all duration-300",
        className
      )}
      priority={size === 'xl'}
    />
  );
};

// Hero NODE Logo with glow effect
export const HeroNodeLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("relative", className)}>
      <OptimizedImage
        src="/NODE.png"
        alt="GodsIMiJ AI Solutions - Sacred NODE Emblem"
        className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 object-contain drop-shadow-2xl node-logo"
        priority
        sizes="(max-width: 768px) 128px, (max-width: 1024px) 192px, 256px"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl -z-10 animate-pulse" />
    </div>
  );
};
