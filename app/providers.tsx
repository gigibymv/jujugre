'use client';

import AppNav from '@/components/app-nav';
import { ErrorBoundary } from '@/components/error-boundary';
import { UserPlanProvider } from '@/components/user-plan-provider';
import { Analytics } from '@vercel/analytics/next';
import type { ReactNode } from 'react';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <UserPlanProvider>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <AppNav />
        <main
          id="main-content"
          tabIndex={-1}
          className="bg-[#f9f8f3] outline-none pt-[calc(6rem+env(safe-area-inset-top,0px))] sm:pt-[calc(7rem+env(safe-area-inset-top,0px))] md:pt-[calc(8rem+env(safe-area-inset-top,0px))] pb-[max(6rem,calc(env(safe-area-inset-bottom,0px)+4.5rem))] md:pb-12"
        >
          {children}
        </main>
        <Analytics />
      </UserPlanProvider>
    </ErrorBoundary>
  );
}
