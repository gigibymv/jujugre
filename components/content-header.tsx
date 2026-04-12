import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/**
 * Shared page header aligned with Stitch “masthead”: eyebrow (sans caps) + serif title + optional description.
 * Pass `children` instead of `title` for custom title rows (e.g. Coach with icon).
 */
export function ContentHeader({
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header className={cn('mb-page-section border-b border-border/35 pb-8', className)}>
      {eyebrow ? <p className="page-eyebrow mb-2">{eyebrow}</p> : null}
      {children ?? (
        <>
          {title ? (
            <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground md:text-4xl">
              {title}
            </h1>
          ) : null}
          {description ? (
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{description}</p>
          ) : null}
        </>
      )}
    </header>
  );
}
