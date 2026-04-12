'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  Brain,
  MessageSquare,
  Settings,
  Home,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useUserPlan } from '@/components/user-plan-provider';
import { cn } from '@/lib/utils';

export default function AppNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { studyPlan, hasCompletedOnboarding, hydrated } = useUserPlan();

  const sessionHref =
    hydrated && !hasCompletedOnboarding
      ? '/onboarding'
      : `/study-plan/${studyPlan.currentModuleId}`;
  const sessionActive = pathname?.startsWith('/study-plan/');

  const isActive = (path: string) =>
    pathname === path || pathname?.startsWith(path + '/');

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/study-plan', label: 'Study Plan', icon: BookOpen },
    { href: '/topic-mastery', label: 'Topics', icon: BarChart3 },
    { href: '/error-log', label: 'Errors', icon: Brain },
    { href: '/coach', label: 'Coach', icon: MessageSquare },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      aria-label="Primary"
      className={cn(
        'sticky top-0 z-50 border-b border-primary-foreground/12 bg-primary text-primary-foreground shadow-[0_1px_0_rgba(0,0,0,0.08)]'
      )}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-5 md:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 transition-opacity duration-150 ease-out hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary-foreground/25 bg-primary-foreground/10 text-sm font-semibold text-primary-foreground">
            Σ
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-sm font-semibold leading-tight tracking-tight">Jujugre</span>
            <span className="text-xs text-primary-foreground/65">GRE quant prep</span>
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out',
                  active
                    ? 'bg-accent/35 text-primary-foreground'
                    : 'text-primary-foreground/72 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                )}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-95" aria-hidden />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            href={sessionHref}
            className={cn(
              'flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium outline-none ring-offset-primary transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-primary-foreground/40 sm:gap-2 sm:px-3',
              sessionActive
                ? 'border-accent/50 bg-accent/25 text-primary-foreground'
                : 'border-primary-foreground/18 bg-primary-foreground/8 text-primary-foreground/90 hover:bg-primary-foreground/12'
            )}
            aria-label={
              hydrated && !hasCompletedOnboarding
                ? 'Continue onboarding'
                : 'Open your current study module'
            }
          >
            <BookOpen className="h-3.5 w-3.5 shrink-0 opacity-95 sm:h-4 sm:w-4" aria-hidden />
            <span className="leading-none">
              Study
              <span className="hidden sm:inline"> session</span>
            </span>
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10 md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-primary-foreground/15 bg-primary text-primary-foreground"
            >
              <SheetHeader>
                <SheetTitle className="text-primary-foreground">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors duration-150 ease-out',
                        active
                          ? 'bg-accent/35 text-primary-foreground'
                          : 'text-primary-foreground/72 hover:bg-primary-foreground/10'
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
