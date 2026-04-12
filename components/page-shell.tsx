import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

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
    <div className={cn('min-h-[calc(100dvh-4rem)] bg-background', className)}>
      <div
        className={cn(
          'mx-auto w-full px-5 py-10 md:px-8 md:py-12',
          narrow ? 'max-w-3xl' : 'max-w-5xl'
        )}
      >
        {children}
      </div>
    </div>
  );
}
