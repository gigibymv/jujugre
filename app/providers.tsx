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
        <AppNav />
        {children}
        <Analytics />
      </UserPlanProvider>
    </ErrorBoundary>
  );
}
