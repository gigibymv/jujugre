'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PageShell } from '@/components/page-shell';
import { ContentHeader } from '@/components/content-header';
import { useUserPlan } from '@/components/user-plan-provider';
import {
  ONBOARDING_WEAK_AREA_LABELS,
  toDateInputValue,
  weakTopicsToLabels,
} from '@/lib/user-state';
import { Lock, Bell, BookOpen, Calendar, RotateCcw, Eraser } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const WEEKLY_HOUR_OPTIONS = [5, 10, 20] as const;

export default function SettingsPage() {
  const router = useRouter();
  const {
    user,
    studyPlan: plan,
    hydrated,
    persisted,
    hasCompletedOnboarding,
    updatePlanSettings,
    clearStudyProgress,
    resetLocalState,
  } = useUserPlan();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const [targetGRE, setTargetGRE] = useState('');
  const [studyStart, setStudyStart] = useState('');
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [weakLabels, setWeakLabels] = useState<string[]>([]);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated || !persisted) return;
    setTargetGRE(toDateInputValue(new Date(persisted.targetGREDate)));
    setStudyStart(toDateInputValue(new Date(persisted.studyStartDate)));
    setWeeklyHours(persisted.weeklyHoursTarget);
    setWeakLabels(weakTopicsToLabels(persisted.weakAreasFromOnboarding));
  }, [
    hydrated,
    persisted?.targetGREDate,
    persisted?.studyStartDate,
    persisted?.weeklyHoursTarget,
    persisted?.weakAreasFromOnboarding?.join(','),
  ]);

  const weeklyHoursDisplay = user.weeklyHoursTarget;

  const toggleWeakLabel = (label: string) => {
    setWeakLabels((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
  };

  const handleSavePlan = () => {
    const target = new Date(`${targetGRE}T12:00:00`);
    const start = new Date(`${studyStart}T12:00:00`);
    if (Number.isNaN(target.getTime()) || Number.isNaN(start.getTime())) {
      setSaveMsg('Choose valid dates.');
      return;
    }
    updatePlanSettings({
      targetGREDate: target.toISOString(),
      studyStartDate: start.toISOString(),
      weeklyHoursTarget: weeklyHours,
      weakAreaLabels: weakLabels,
    });
    setSaveMsg('Saved.');
    window.setTimeout(() => setSaveMsg(null), 2500);
  };

  return (
    <PageShell narrow>
      <ContentHeader
        eyebrow="Account"
        title="Settings"
        description="Profile, plan, and preferences"
      />

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
          <p className="text-sm text-muted-foreground">
            Dates, weekly hours, and weak areas are edited in <strong className="text-foreground">Plan &amp; goals</strong>{' '}
            below. Use onboarding only if you prefer the step-by-step flow.
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/onboarding">Open onboarding wizard</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Calendar className="h-5 w-5 text-accent" aria-hidden />
            Plan &amp; goals
          </CardTitle>
          <p className="text-sm font-normal text-muted-foreground">
            Saved on this device. Changes apply to your study plan timeline and dashboard.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!hasCompletedOnboarding ? (
            <p className="text-sm text-muted-foreground">
              Complete onboarding first, then you can edit your plan here anytime.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="settings-study-start" className="font-medium text-foreground">
                    Study start
                  </Label>
                  <Input
                    id="settings-study-start"
                    type="date"
                    value={studyStart}
                    onChange={(e) => setStudyStart(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="settings-target-gre" className="font-medium text-foreground">
                    Target GRE date
                  </Label>
                  <Input
                    id="settings-target-gre"
                    type="date"
                    value={targetGRE}
                    onChange={(e) => setTargetGRE(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="settings-weekly-hours" className="font-medium text-foreground">
                  Study hours per week
                </Label>
                <Input
                  id="settings-weekly-hours"
                  type="number"
                  min={1}
                  max={40}
                  value={weeklyHours}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (Number.isNaN(n)) return;
                    setWeeklyHours(Math.min(40, Math.max(1, n)));
                  }}
                  className="mt-2 max-w-[9rem]"
                />
                <p className="mt-2 text-xs text-muted-foreground">Quick picks:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {WEEKLY_HOUR_OPTIONS.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setWeeklyHours(h)}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                        weeklyHours === h
                          ? 'border-primary bg-secondary/50 font-medium text-foreground'
                          : 'border-border text-muted-foreground hover:border-muted-foreground/40'
                      }`}
                    >
                      {h} h
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-3 block font-medium text-foreground">Weak areas (optional)</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {ONBOARDING_WEAK_AREA_LABELS.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleWeakLabel(area)}
                      className={`editorial-chip flex w-full items-center gap-2 ${
                        weakLabels.includes(area) ? 'editorial-chip-active' : 'editorial-chip-inactive'
                      }`}
                    >
                      <Checkbox
                        checked={weakLabels.includes(area)}
                        onCheckedChange={() => toggleWeakLabel(area)}
                      />
                      <span className="font-medium text-foreground">{area}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button type="button" className="sm:w-auto" onClick={handleSavePlan}>
                  Save plan changes
                </Button>
                {saveMsg ? (
                  <p className="text-sm text-muted-foreground" role="status">
                    {saveMsg}
                  </p>
                ) : null}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <BookOpen className="h-5 w-5 text-accent" aria-hidden />
            Study plan overview
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
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-destructive">
            <RotateCcw className="h-5 w-5" aria-hidden />
            Reset
          </CardTitle>
          <p className="text-sm font-normal text-muted-foreground">
            Two levels: clear only your task checkmarks, or wipe all saved plan data on this browser and redo
            onboarding.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full border-border"
            type="button"
            disabled={!hasCompletedOnboarding}
            onClick={() => {
              if (
                typeof window !== 'undefined' &&
                window.confirm(
                  'Clear all task checkmarks? Your dates, weak areas, and onboarding stay the same.'
                )
              ) {
                clearStudyProgress();
              }
            }}
          >
            <Eraser className="mr-2 h-4 w-4" aria-hidden />
            Clear study progress only
          </Button>
          <p className="text-xs text-muted-foreground">
            Removes every completed checkbox on the 12-week plan. Demo tasks no longer reappear after a full reset —
            progress is only what you save.
          </p>
          <Button
            variant="destructive"
            className="w-full"
            type="button"
            onClick={() => {
              if (
                typeof window !== 'undefined' &&
                window.confirm(
                  'Reset everything on this device? Plan, checkmarks, and onboarding will be cleared. This cannot be undone.'
                )
              ) {
                resetLocalState();
                router.push('/onboarding');
              }
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
            Full reset (onboarding again)
          </Button>
          <Button variant="outline" className="w-full border-destructive/40 text-destructive" type="button" disabled>
            Delete account
          </Button>
          <p className="text-xs text-muted-foreground">Account deletion is not available in this build.</p>
        </CardContent>
      </Card>

      <footer className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        <p>Jujugre</p>
        <p className="text-xs">Local-first prep · data stays on this device unless you add sync</p>
      </footer>
    </PageShell>
  );
}
