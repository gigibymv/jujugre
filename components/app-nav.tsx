'use client';

/**
 * Plum brand bar: primary surface + cream foreground (matches --primary / --primary-foreground).
 */
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

  const linkClass = (active: boolean) =>
    cn(
      'font-serif text-base font-medium tracking-tight transition-colors duration-200 md:text-lg',
      active
        ? 'border-b-2 border-primary-foreground pb-1 font-bold text-primary-foreground'
        : 'text-primary-foreground/75 hover:text-primary-foreground'
    );

  return (
    <header className="fixed top-0 z-50 w-full border-b border-primary-foreground/15 bg-primary pt-[env(safe-area-inset-top,0px)] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.2)]">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="shrink-0 font-serif text-xl font-bold italic tracking-tight text-primary-foreground sm:text-2xl"
        >
          Σ Jujugre
        </Link>

        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center justify-center gap-6 md:flex lg:gap-10"
        >
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={linkClass(active)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={sessionHref}
            className={cn(
              'hidden rounded-lg bg-primary-foreground px-4 py-2 text-xs font-medium uppercase tracking-widest text-primary shadow-sm transition-[transform,background-color] active:scale-95 sm:inline-flex sm:items-center sm:justify-center',
              'hover:bg-primary-foreground/90',
              sessionActive &&
                'ring-2 ring-accent/60 ring-offset-2 ring-offset-primary'
            )}
            aria-label={
              hydrated && !hasCompletedOnboarding
                ? 'Continue onboarding'
                : 'Open your current study module'
            }
          >
            Study session
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
              className="border-border bg-[#f9f8f3] text-foreground"
            >
              <SheetHeader>
                <SheetTitle className="font-serif text-foreground">Menu</SheetTitle>
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
                        'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium',
                        active
                          ? 'bg-primary/10 font-semibold text-primary'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {item.label}
                    </Link>
                  );
                })}
                <Link
                  href={sessionHref}
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 rounded-lg bg-primary px-3 py-3 text-center text-xs font-medium uppercase tracking-widest text-primary-foreground"
                >
                  Study session
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
