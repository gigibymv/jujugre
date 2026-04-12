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
        className={cn('min-h-[calc(100dvh-7rem)] bg-[#fbf9f4]', className)}
      >
        <div
          className={cn(
            'mx-auto w-full max-w-screen-2xl px-4 pb-16 sm:px-8 lg:px-12 lg:pb-20',
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
          'mx-auto w-full px-4 py-6 sm:px-5 md:px-8 md:py-10',
          narrow ? 'max-w-3xl' : 'max-w-5xl'
        )}
      >
        <div
          className={cn(
            'rounded-2xl border border-border/50 bg-background',
            'shadow-paper ring-1 ring-foreground/[0.05]',
            'px-5 py-8 md:px-8 md:py-10'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
