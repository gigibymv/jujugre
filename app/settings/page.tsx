'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageShell } from '@/components/page-shell';
import { useUserPlan } from '@/components/user-plan-provider';
import { Lock, Bell, BookOpen, Calendar } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, studyPlan: plan, resetLocalState, hasCompletedOnboarding } = useUserPlan();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const weeklyHoursDisplay = user.weeklyHoursTarget;

  return (
    <PageShell narrow>
      <header className="mb-page-section border-b border-border pb-8">
        <p className="page-eyebrow mb-2">Account</p>
        <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground md:text-4xl">
          Settings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Profile, plan, and preferences</p>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-medium text-foreground">Name</Label>
            <Input value={user.name} readOnly className="mt-2 bg-muted/50" />
          </div>
          <div>
            <Label className="font-medium text-foreground">Email</Label>
            <Input value={user.email} readOnly className="mt-2 bg-muted/50" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="font-medium text-foreground">Study start</Label>
              <Input
                value={user.startDate.toLocaleDateString()}
                readOnly
                className="mt-2 bg-muted/50"
              />
            </div>
            <div>
              <Label className="font-medium text-foreground">Target GRE date</Label>
              <Input
                value={user.targetGREDate.toLocaleDateString()}
                readOnly
                className="mt-2 bg-muted/50"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/onboarding">Update plan and dates</Link>
            </Button>
            {hasCompletedOnboarding && (
              <Button
                type="button"
                variant="outline"
                className="w-full border-destructive/30 text-destructive hover:bg-destructive/5"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.confirm('Clear saved progress on this device?')) {
                    resetLocalState();
                  }
                }}
              >
                Reset local data
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Calendar className="h-5 w-5 text-accent" aria-hidden />
            Study plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Plan</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{plan.planName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current week</p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                Week {plan.currentWeekNumber} of 12
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Weekly target</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{weeklyHoursDisplay} hours</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge
                className="mt-1 font-normal"
                variant={
                  plan.latenessState === 'on_track'
                    ? 'default'
                    : plan.latenessState === 'recovering'
                      ? 'secondary'
                      : 'destructive'
                }
              >
                {plan.latenessState === 'on_track'
                  ? 'On track'
                  : plan.latenessState === 'recovering'
                    ? 'Recovering'
                    : 'Behind'}
              </Badge>
            </div>
          </div>
          <Button variant="outline" className="w-full" type="button" disabled>
            Adjust study plan (soon)
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <BookOpen className="h-5 w-5 text-accent" aria-hidden />
            Initial weak areas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">From onboarding:</p>
          <div className="flex flex-wrap gap-2">
            {user.weakAreasFromOnboarding && user.weakAreasFromOnboarding.length > 0 ? (
              user.weakAreasFromOnboarding.map((area) => (
                <Badge key={area} variant="outline" className="font-normal">
                  {area.replace(/_/g, ' ')}
                </Badge>
              ))
            ) : (
              <p className="text-sm italic text-muted-foreground">None selected</p>
            )}
          </div>
          <Button variant="outline" className="w-full" type="button" disabled>
            Update weak areas (soon)
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Bell className="h-5 w-5 text-accent" aria-hidden />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              title: 'Push notifications',
              desc: 'Study reminders and milestones',
              on: notifications,
              set: setNotifications,
            },
            {
              title: 'Email updates',
              desc: 'Weekly progress summary',
              on: emailUpdates,
              set: setEmailUpdates,
            },
          ].map((row) => (
            <div
              key={row.title}
              className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
            >
              <div>
                <p className="font-medium text-foreground">{row.title}</p>
                <p className="text-sm text-muted-foreground">{row.desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={row.on}
                onClick={() => row.set(!row.on)}
                className={`relative inline-flex h-8 w-14 items-center rounded-md transition-colors duration-150 ease-out ${
                  row.on ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-sm bg-card shadow-sm transition-transform duration-150 ease-out ${
                    row.on ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Lock className="h-5 w-5 text-muted-foreground" aria-hidden />
            Account and security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full" type="button" disabled>
            Change password
          </Button>
          <Button variant="outline" className="w-full" type="button" disabled>
            Two-factor authentication
          </Button>
          <Button variant="outline" className="w-full" type="button" disabled>
            Login activity
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/25 bg-destructive/5">
        <CardHeader className="border-destructive/20">
          <CardTitle className="text-lg font-semibold text-destructive">Danger zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full border-destructive/40 text-destructive" type="button" disabled>
            Reset all progress
          </Button>
          <Button variant="outline" className="w-full border-destructive/40 text-destructive" type="button" disabled>
            Delete account
          </Button>
          <p className="text-xs text-muted-foreground">Destructive actions are disabled in this build.</p>
        </CardContent>
      </Card>

      <footer className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        <p>Jujugre</p>
        <p className="text-xs">Local-first prep · data stays on this device unless you add sync</p>
      </footer>
    </PageShell>
  );
}
