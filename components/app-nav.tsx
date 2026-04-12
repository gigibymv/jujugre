'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, BookOpen, Brain, MessageSquare, Settings, Home } from 'lucide-react';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function AppNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/study-plan', label: 'Study Plan', icon: BookOpen },
    { href: '/topic-mastery', label: 'Topics', icon: BarChart3 },
    { href: '/error-log', label: 'Errors', icon: Brain },
    { href: '/coach', label: 'Coach', icon: MessageSquare },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#3d2f3f] backdrop-blur-md border-b border-[#5a4a5c]">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <Link href="/" className="flex items-center gap-3 hover:opacity-75 transition-opacity flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7a8d7e] to-[#a88080] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            Σ
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold text-[#faf8f3] leading-tight">Jujugre</span>
            <span className="text-xs text-[#c9b5a0]">GRE prep</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-0.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <button
                  type="button"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                    active
                      ? 'bg-[#5a4a5c] text-[#c9b5a0] shadow-sm'
                      : 'text-[#a89d94] hover:text-[#faf8f3] hover:bg-[#5a4a5c]'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#7a8d7e] rounded-full border border-[#8a9d8e] text-xs font-semibold text-white shadow-sm">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse flex-shrink-0" />
          <span className="hidden sm:inline">Study Active</span>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden text-[#a89d94] hover:bg-[#5a4a5c] hover:text-[#faf8f3]"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#3d2f3f] border-[#5a4a5c] text-[#faf8f3]">
            <SheetHeader>
              <SheetTitle className="text-[#faf8f3]">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 mt-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${
                      active ? 'bg-[#5a4a5c] text-[#c9b5a0]' : 'text-[#a89d94] hover:bg-[#5a4a5c]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
