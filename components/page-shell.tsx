import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/**
 * Full-width “canvas” (muted) + inner “paper” (card background) so layout reads clearly
 * against the nav and standalone cards on the page.
 */
export function PageShell({
  children,
  className,
  narrow,
}: {
  children: ReactNode;
  className?: string;
  /** Use max-w-3xl for coach / focused flows */
  narrow?: boolean;
}) {
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
