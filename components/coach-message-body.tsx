'use client';

import { ErrorBoundary } from '@/components/error-boundary';
import { cn } from '@/lib/utils';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import 'katex/dist/katex.min.css';

const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mt-4 font-serif text-xl font-medium text-foreground first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-3 font-serif text-lg font-medium text-foreground first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-3 font-serif text-base font-semibold text-foreground first:mt-0">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-2 border-accent/40 pl-3 text-muted-foreground">{children}</blockquote>
  ),
  hr: () => <hr className="my-4 border-border" />,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-accent underline underline-offset-2 hover:opacity-90"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  code: ({ className, children, ...props }) => {
    const inline = !className;
    if (inline) {
      return (
        <code
          className="rounded bg-muted/80 px-1.5 py-0.5 font-sans text-[0.9em] font-medium tracking-tight text-foreground"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-3 overflow-x-auto rounded-lg border border-border/50 bg-muted/50 p-3 font-mono text-xs last:mb-0">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="mb-3 overflow-x-auto last:mb-0">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-border">{children}</thead>,
  th: ({ children }) => (
    <th className="border border-border bg-muted/40 px-2 py-1.5 font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border border-border px-2 py-1.5">{children}</td>,
};

const rehypePlugins = [rehypeKatex({ errorColor: '#8a7d74' })];
const remarkPluginsFull = [remarkGfm, remarkMath];

function plainTextFallback(content: string, className?: string) {
  return (
    <div className={cn(className, 'whitespace-pre-wrap break-words')}>{content}</div>
  );
}

type CoachMessageBodyProps = {
  content: string;
  className?: string;
  /**
   * `gfm` — headings, lists, bold, etc. No KaTeX (safe on partial/streaming text).
   * `full` — GFM + inline/display math via KaTeX.
   */
  variant?: 'full' | 'gfm';
};

function CoachMarkdownGfm({ content, className }: CoachMessageBodyProps) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CoachMarkdownFull({ content, className }: CoachMessageBodyProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={remarkPluginsFull}
        rehypePlugins={rehypePlugins}
        components={mdComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Markdown (+ optional KaTeX) for coach replies. Streaming uses `variant="gfm"` so
 * `###` renders as headings instead of raw characters; full messages try KaTeX and
 * fall back to GFM-only if math rendering throws.
 */
export function CoachMessageBody({
  content,
  className,
  variant = 'full',
}: CoachMessageBodyProps) {
  const boundaryKey = content.slice(0, 200);

  if (variant === 'gfm') {
    return (
      <ErrorBoundary key={boundaryKey} fallback={plainTextFallback(content, className)}>
        <CoachMarkdownGfm content={content} className={className} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary
      key={boundaryKey}
      fallback={
        <ErrorBoundary fallback={plainTextFallback(content, className)}>
          <CoachMarkdownGfm content={content} className={className} />
        </ErrorBoundary>
      }
    >
      <CoachMarkdownFull content={content} className={className} />
    </ErrorBoundary>
  );
}
