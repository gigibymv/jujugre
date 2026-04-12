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
import { cn } from '@/lib/utils';

export default function AppNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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
      className={cn(
        'sticky top-0 z-50 border-b border-[color-mix(in_oklab,var(--app-nav-foreground)_14%,var(--app-nav))]',
        'bg-app-nav text-app-nav-foreground'
      )}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-6 px-5 md:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 transition-opacity duration-150 ease-out hover:opacity-85"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-app-nav-border bg-app-nav-mark text-sm font-semibold text-app-nav-foreground">
            Σ
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-sm font-semibold leading-tight tracking-tight">Jujugre</span>
            <span className="text-xs text-app-nav-muted">GRE quant prep</span>
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <button
                  type="button"
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out',
                    active
                      ? 'bg-app-nav-active text-app-nav-active-foreground'
                      : 'text-app-nav-subtle hover:bg-app-nav-hover hover:text-app-nav-foreground'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-90" />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center rounded-md border border-app-nav-border/50 bg-app-nav-pill px-3 py-1.5 text-xs font-medium text-app-nav-pill-foreground sm:flex">
          Study session
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-app-nav-pill-foreground hover:bg-app-nav-active hover:text-app-nav-foreground md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="border-app-nav-active bg-app-nav text-app-nav-foreground"
          >
            <SheetHeader>
              <SheetTitle className="text-app-nav-foreground">Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors duration-150 ease-out',
                      active
                        ? 'bg-app-nav-active text-app-nav-active-foreground'
                        : 'text-app-nav-subtle hover:bg-app-nav-hover hover:text-app-nav-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
