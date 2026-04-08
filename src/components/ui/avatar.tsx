import * as React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
}

const AVATAR_SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

const Avatar = ({ fallback, size = 'md', className, ...props }: AvatarProps) => {
  const initials = fallback
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-medium',
        AVATAR_SIZES[size],
        className
      )}
      {...props}
    >
      {initials}
    </div>
  );
};

export { Avatar };
