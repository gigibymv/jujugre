'use client';

/**
 * Top bar aligned with Stitch export `Jujugre Dashboard` HTML:
 * cream surface, serif links, sage active state (#4e6053), fixed header.
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
import { useState, type CSSProperties } from 'react';
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

const STITCH_PRIMARY = '#4e6053';
const STITCH_MUTED = '#645d57';
const STITCH_INK = '#2a2520';

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
        ? 'border-b-2 pb-1 font-bold'
        : 'text-[#645d57] hover:text-[#4e6053]'
    );

  const linkStyle = (active: boolean): CSSProperties =>
    active
      ? {
          color: STITCH_PRIMARY,
          borderColor: STITCH_PRIMARY,
        }
      : {};

  return (
    <header
      className="fixed top-0 z-50 w-full border-b border-[#e4e2dd]/40 bg-[#f9f8f3] shadow-[0_4px_24px_-4px_rgba(31,28,24,0.05)]"
    >
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="shrink-0 font-serif text-xl font-bold italic tracking-tight sm:text-2xl"
          style={{ color: STITCH_INK }}
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
                style={linkStyle(active)}
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
              'hidden rounded-lg px-4 py-2 text-xs font-medium uppercase tracking-widest text-white transition-transform active:scale-95 sm:inline-flex sm:items-center sm:justify-center',
              sessionActive && 'ring-2 ring-[#4e6053]/30 ring-offset-2 ring-offset-[#f9f8f3]'
            )}
            style={{ backgroundColor: STITCH_PRIMARY }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#66796b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = STITCH_PRIMARY;
            }}
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
                className="text-[#2a2520] hover:bg-[#f0eee9] md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-[#e4e2dd] bg-[#f9f8f3] text-[#2a2520]">
              <SheetHeader>
                <SheetTitle className="font-serif text-[#2a2520]">Menu</SheetTitle>
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
                        active ? 'bg-[#f0eee9] font-semibold' : 'hover:bg-[#f5f3ee]'
                      )}
                      style={active ? { color: STITCH_PRIMARY } : { color: STITCH_MUTED }}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {item.label}
                    </Link>
                  );
                })}
                <Link
                  href={sessionHref}
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 rounded-lg px-3 py-3 text-center text-xs font-medium uppercase tracking-widest text-white"
                  style={{ backgroundColor: STITCH_PRIMARY }}
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
