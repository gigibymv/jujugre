import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/**
 * - `paper`: inner “sheet” on cream canvas (study plan, settings, …)
 * - `canvas`: full-width on cream only — matches Stitch dashboard export (no white frame)
 */
export function PageShell({
  children,
  className,
  narrow,
  variant = 'paper',
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
  variant?: 'paper' | 'canvas';
}) {
  if (variant === 'canvas') {
    return (
      <div
        className={cn('min-h-[calc(100dvh-7rem)] bg-[#f9f8f3]', className)}
      >
        <div
          className={cn(
            'mx-auto w-full max-w-screen-2xl px-3.5 pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))] sm:px-8 sm:pb-16 lg:px-12 lg:pb-20',
            narrow && 'max-w-3xl'
          )}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'min-h-[calc(100dvh-4rem)] bg-surface-canvas',
        className
      )}
    >
      <div
        className={cn(
          'mx-auto w-full px-3.5 py-5 sm:px-5 md:px-8 md:py-10',
          narrow ? 'max-w-3xl' : 'max-w-5xl'
        )}
      >
        <div
          className={cn(
            'rounded-2xl border border-border/50 bg-background',
            'shadow-paper ring-1 ring-foreground/[0.05]',
            'px-4 py-7 sm:px-5 md:px-8 md:py-10'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
