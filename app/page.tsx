'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PageShell } from '@/components/page-shell';
import { mockTopicMastery, mockDailyCheckIns } from '@/lib/mock-data';
import { useUserPlan } from '@/components/user-plan-provider';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const DAILY_QUOTES = [
  'Hard topics are just future strengths waiting to be unlocked.',
  'Precision today builds confidence tomorrow.',
  'Every problem solved is progress made.',
  "You're learning the exact patterns the GRE tests.",
  "Consistency over intensity—you've got this.",
  'Master one concept, and build from there.',
  'Rigor now means clarity on test day.',
  'Your effort is compounding into skill.',
];

function getDailyQuote(dateString?: string): string {
  const hashDate = dateString || new Date().toDateString();
  const hash = hashDate.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return DAILY_QUOTES[hash % DAILY_QUOTES.length];
}

export default function Dashboard() {
  const { user, studyPlan: plan, hasCompletedOnboarding, hydrated } = useUserPlan();
  const [isClient, setIsClient] = useState(false);
  const [dailyQuote, setDailyQuote] = useState('');

  useEffect(() => {
    setIsClient(true);
    setDailyQuote(getDailyQuote());
  }, []);

  const currentModule = plan.modules.find((m) => m.id === plan.currentModuleId);
  const currentPart = currentModule?.parts.find((p) => p.id === plan.currentPartId);
  const daysRemaining = plan.daysRemaining;

  const weakAreas = mockTopicMastery
    .filter((tm) => tm.masteryLevel === 'developing' || tm.masteryLevel === 'not_started')
    .sort((a, b) => (b.practiceAccuracyPercent || 0) - (a.practiceAccuracyPercent || 0))
    .slice(0, 3);

  const totalWordsLearned = mockDailyCheckIns.reduce((sum, ci) => sum + ci.wordsLearned, 0);
  const daysSinceStarted = isClient
    ? Math.floor((Date.now() - user.startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const tasksCompleted = currentPart?.tasks.filter((t) => t.completed).length || 0;
  const tasksTotal = currentPart?.tasks.length || 0;
  const progressPercent = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;

  const isOnTrack = plan.latenessState === 'on_track';
  const supportiveMessage = isOnTrack
    ? `You're on pace. Week ${plan.currentWeekNumber} of 12.`
    : `You're slightly behind. Complete one module this week to recover.`;

  return (
    <PageShell>
      {hydrated && !hasCompletedOnboarding && (
        <div className="mb-8 flex flex-col gap-3 rounded-lg border border-border bg-secondary/80 px-4 py-3 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="text-muted-foreground">
            Set your GRE date and weekly hours so the dashboard matches your plan.
          </span>
          <Link href="/onboarding">
            <Button size="sm" className="shrink-0">
              Complete setup
            </Button>
          </Link>
        </div>
      )}

      <header className="mb-page-section border-b border-border pb-8">
        <p className="page-eyebrow mb-2">Dashboard</p>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <blockquote className="max-w-2xl font-serif text-xl font-normal leading-snug tracking-tight text-foreground md:text-2xl">
            <span className="text-muted-foreground">&ldquo;</span>
            {dailyQuote}
            <span className="text-muted-foreground">&rdquo;</span>
          </blockquote>
          <Badge
            className={`shrink-0 gap-1.5 border px-3 py-1.5 text-xs font-medium ${
              isOnTrack
                ? 'border-accent/50 bg-accent/10 text-foreground [&_svg]:text-accent'
                : 'border-destructive/40 bg-destructive/10 text-destructive [&_svg]:text-destructive'
            }`}
          >
            {isOnTrack ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                On track
              </>
            ) : (
              <>
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                Catch up
              </>
            )}
          </Badge>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{supportiveMessage}</p>
      </header>

      <Card className="mb-page-section border-l-[3px] border-l-accent">
        <CardContent className="space-y-4 pt-6">
          <div>
            <p className="page-eyebrow">Today&apos;s focus</p>
            <h2 className="mt-1 font-serif text-2xl font-normal tracking-tight text-foreground">
              {currentModule?.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Week {plan.currentWeekNumber} · {currentPart?.title}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-foreground">
              <span>Module completion</span>
              <span className="font-semibold tabular-nums">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-muted" />
          </div>
          <Link href="/study-plan" className="block pt-2">
            <Button className="w-full font-medium sm:w-auto">
              Start today&apos;s work
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="mb-page-section grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
        {[
          {
            label: 'Days remaining',
            value: isClient ? daysRemaining : '—',
            sub:
              isClient && plan.targetGREDate
                ? plan.targetGREDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : '—',
          },
          {
            label: 'Topics mastered',
            value: mockTopicMastery.filter((t) => t.masteryLevel === 'mastered').length,
            sub: `${mockTopicMastery.length} total`,
          },
          {
            label: 'Words this week',
            value: mockDailyCheckIns.slice(0, 7).reduce((sum, ci) => sum + ci.wordsLearned, 0),
            sub: `${totalWordsLearned} total`,
          },
          {
            label: 'Study days',
            value: daysSinceStarted,
            sub: 'since start',
          },
        ].map((stat) => (
          <Card key={stat.label} className="bg-secondary/30">
            <CardHeader>
              <CardTitle className="page-eyebrow">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-serif text-3xl font-medium tabular-nums text-foreground">
                {stat.value}
              </div>
              <p
                className="mt-1 text-xs text-muted-foreground"
                suppressHydrationWarning={stat.label === 'Days remaining'}
              >
                {stat.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-page-section grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <AlertCircle className="h-5 w-5 text-destructive" aria-hidden />
              Focus areas
            </CardTitle>
            <p className="text-xs text-muted-foreground">Below 70% accuracy: review soon</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-4">
            {weakAreas.length > 0 ? (
              weakAreas.map((area) => (
                <Link
                  key={area.id}
                  href="/topic-mastery"
                  className="block w-full rounded-lg outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="surface-quiet cursor-pointer p-3 transition-colors duration-150 ease-out hover:bg-muted/60">
                    <div className="flex items-center justify-between gap-3">
                      <p className="min-w-0 text-sm font-semibold leading-snug text-foreground">
                        {area.subtopic.replace(/_/g, ' ')}
                      </p>
                      <span className="shrink-0 font-serif text-lg font-medium tabular-nums text-destructive">
                        {area.practiceAccuracyPercent}%
                        <span className="sr-only"> accuracy</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm italic text-muted-foreground">
                Strong work—all areas at 70% or above.
              </p>
            )}
            <Link href="/topic-mastery" className="block w-full">
              <Button variant="outline" className="w-full text-sm">
                View all topics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Zap className="h-5 w-5 text-accent" aria-hidden />
              Next actions
            </CardTitle>
            <p className="text-xs text-muted-foreground">What to do next</p>
          </CardHeader>
          <CardContent className="space-y-2 pt-4">
            <Link href="/study-plan">
              <Button
                variant="outline"
                className="h-auto w-full justify-start py-3 text-left font-normal"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold">Complete week {plan.currentWeekNumber}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Parts still open</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 opacity-60" />
              </Button>
            </Link>
            <Link href="/error-log">
              <Button
                variant="outline"
                className="h-auto w-full justify-start py-3 text-left font-normal"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold">Review errors</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Due for review</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 opacity-60" />
              </Button>
            </Link>
            <Link href="/coach">
              <Button
                variant="outline"
                className="h-auto w-full justify-start py-3 text-left font-normal"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold">Ask the coach</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Step-by-step quant help</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 opacity-60" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <TrendingUp className="h-5 w-5 text-accent" aria-hidden />
            Overall progress
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: 'Mastered',
                count: mockTopicMastery.filter((t) => t.masteryLevel === 'mastered').length,
                className: 'text-accent',
              },
              {
                label: 'Proficient',
                count: mockTopicMastery.filter((t) => t.masteryLevel === 'proficient').length,
                className: 'text-muted-foreground',
              },
              {
                label: 'Developing',
                count: mockTopicMastery.filter((t) => t.masteryLevel === 'developing').length,
                className: 'text-destructive',
              },
              {
                label: 'Not started',
                count: mockTopicMastery.filter((t) => t.masteryLevel === 'not_started').length,
                className: 'text-muted-foreground',
              },
            ].map((stat) => (
              <div key={stat.label} className="surface-quiet p-3 text-center">
                <div className={`font-serif text-2xl font-medium tabular-nums ${stat.className}`}>
                  {stat.count}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          <Link href="/topic-mastery">
            <Button variant="outline" className="mt-4 w-full text-sm">
              Detailed topic report
            </Button>
          </Link>
        </CardContent>
      </Card>
    </PageShell>
  );
}
