'use client';

/**
 * Dashboard layout and surface tokens aligned with Stitch export
 * “Jujugre Dashboard | The Scholarly Editorial”.
 */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageShell } from '@/components/page-shell';
import { mockTopicMastery, mockDailyCheckIns } from '@/lib/mock-data';
import type { TopicMastery } from '@/lib/data-schema';
import { useUserPlan } from '@/components/user-plan-provider';
import Link from 'next/link';
import {
  ArrowRight,
  Calculator,
  Variable,
  Shapes,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const STITCH_PRIMARY = '#4e6053';
const STITCH_TRACK = '#e4e2dd';
const STITCH_MUTED = '#645d57';
const STITCH_INK = '#2a2520';

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

function avgAccuracy(topics: TopicMastery[], pred: (t: TopicMastery) => boolean): number {
  const filtered = topics.filter(pred);
  if (!filtered.length) return 0;
  return Math.round(
    filtered.reduce((s, t) => s + t.practiceAccuracyPercent, 0) / filtered.length
  );
}

function iconForTopic(topic: string) {
  if (topic.startsWith('arithmetic_')) return Calculator;
  if (topic.startsWith('algebra_')) return Variable;
  if (topic.startsWith('geometry_')) return Shapes;
  return BarChart3;
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

  const masteredCount = mockTopicMastery.filter((t) => t.masteryLevel === 'mastered').length;
  const avgAll =
    mockTopicMastery.length > 0
      ? Math.round(
          mockTopicMastery.reduce((s, t) => s + t.practiceAccuracyPercent, 0) /
            mockTopicMastery.length
        )
      : 0;

  const categoryBars = [
    { label: 'Arithmetic', pct: avgAccuracy(mockTopicMastery, (t) => t.topic.startsWith('arithmetic_')) },
    { label: 'Algebra', pct: avgAccuracy(mockTopicMastery, (t) => t.topic.startsWith('algebra_')) },
    { label: 'Geometry', pct: avgAccuracy(mockTopicMastery, (t) => t.topic.startsWith('geometry_')) },
    {
      label: 'Data analysis',
      pct: avgAccuracy(mockTopicMastery, (t) => t.topic.startsWith('data_analysis_')),
    },
  ];

  return (
    <PageShell variant="canvas">
      {hydrated && !hasCompletedOnboarding && (
        <div
          className="mb-8 flex flex-col gap-3 rounded-2xl border border-[#e4e2dd] bg-white px-4 py-3 text-sm shadow-[0_4px_24px_-4px_rgba(42,37,32,0.04)] sm:flex-row sm:items-center sm:justify-between"
          style={{ color: STITCH_INK }}
        >
          <span style={{ color: STITCH_MUTED }}>
            Set your GRE date and weekly hours so the dashboard matches your plan.
          </span>
          <Link href="/onboarding">
            <Button
              size="sm"
              className="shrink-0 uppercase tracking-widest text-white"
              style={{ backgroundColor: STITCH_PRIMARY }}
            >
              Complete setup
            </Button>
          </Link>
        </div>
      )}

      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between lg:mb-12">
        <blockquote
          className="max-w-2xl font-serif text-xl font-normal leading-snug tracking-tight md:text-2xl"
          style={{ color: STITCH_INK }}
          aria-label="Daily encouragement"
        >
          <span style={{ color: STITCH_MUTED }}>&ldquo;</span>
          {dailyQuote}
          <span style={{ color: STITCH_MUTED }}>&rdquo;</span>
        </blockquote>
        <Badge
          className={cn(
            'shrink-0 gap-1.5 border px-3 py-1.5 text-xs font-medium',
            isOnTrack
              ? 'border-[#c3c8c1]/50 bg-[#f5f3ee]'
              : 'border-red-200/80 bg-red-50 text-red-900'
          )}
          style={isOnTrack ? { color: STITCH_INK } : undefined}
        >
          {isOnTrack ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" style={{ color: STITCH_PRIMARY }} aria-hidden />
              On track
            </>
          ) : (
            <>
              <AlertTriangle className="h-3.5 w-3.5 text-red-600" aria-hidden />
              Catch up
            </>
          )}
        </Badge>
      </div>
      <p className="-mt-6 mb-10 text-sm lg:-mt-8 lg:mb-12" style={{ color: STITCH_MUTED }}>
        {supportiveMessage}
      </p>

      {/* Hero — Stitch: rounded-full white card, soft shadow */}
      <section className="relative mb-12 lg:mb-16">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
          style={{ background: `linear-gradient(135deg, ${STITCH_PRIMARY}22, transparent)` }}
          aria-hidden
        />
        <div
          className="relative overflow-hidden rounded-full border border-[#e4e2dd]/60 bg-white px-6 py-10 shadow-[0_12px_32px_-8px_rgba(42,37,32,0.06)] sm:px-10 sm:py-12 md:px-14"
        >
          <p
            className="text-center text-[10px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: STITCH_MUTED }}
          >
            Weekly progression
          </p>
          <h1
            className="mt-4 text-center font-serif text-2xl font-normal tracking-tight sm:text-3xl md:text-4xl"
            style={{ color: STITCH_INK }}
          >
            {currentModule?.title ?? 'Your study plan'}
          </h1>
          <p className="mt-2 text-center text-sm" style={{ color: STITCH_MUTED }}>
            Week {plan.currentWeekNumber} of 12 · {currentPart?.title}
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <div className="mb-2 flex justify-between text-xs font-medium" style={{ color: STITCH_MUTED }}>
              <span>Module focus</span>
              <span className="tabular-nums" style={{ color: STITCH_PRIMARY }}>
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: STITCH_TRACK }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: STITCH_PRIMARY,
                }}
              />
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/study-plan">
              <span
                className="inline-flex items-center rounded-full px-8 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white transition-transform active:scale-[0.98]"
                style={{ backgroundColor: STITCH_PRIMARY }}
              >
                Continue studying
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Middle — 12-col: focus (5) + next actions (7) */}
      <div className="mb-12 grid grid-cols-1 gap-10 lg:mb-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2
            className="mb-6 font-serif text-xl font-normal tracking-tight md:text-2xl"
            style={{ color: STITCH_INK }}
          >
            Focus areas
          </h2>
          <p className="mb-4 text-sm" style={{ color: STITCH_MUTED }}>
            Below 70% accuracy — review soon.
          </p>
          <div className="flex flex-col gap-3">
            {weakAreas.length > 0 ? (
              weakAreas.map((area) => {
                const Icon = iconForTopic(area.topic);
                return (
                  <Link
                    key={area.id}
                    href="/topic-mastery"
                    className="flex items-center gap-4 rounded-xl bg-[#f5f3ee] px-4 py-3 transition-colors hover:bg-[#ebe8e0] sm:px-5"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm"
                      style={{ color: STITCH_PRIMARY }}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium capitalize leading-snug" style={{ color: STITCH_INK }}>
                        {area.subtopic.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs" style={{ color: STITCH_MUTED }}>
                        Practice accuracy
                      </p>
                    </div>
                    <span
                      className="shrink-0 font-serif text-lg tabular-nums tracking-tight"
                      style={{ color: STITCH_PRIMARY }}
                    >
                      {area.practiceAccuracyPercent}%
                    </span>
                  </Link>
                );
              })
            ) : (
              <p className="rounded-xl bg-[#f5f3ee] px-4 py-6 text-sm italic" style={{ color: STITCH_MUTED }}>
                Strong work — all areas at 70% or above.
              </p>
            )}
          </div>
          <Link href="/topic-mastery" className="mt-5 inline-block">
            <span className="text-sm font-medium underline-offset-4 hover:underline" style={{ color: STITCH_PRIMARY }}>
              View all topics
            </span>
          </Link>
        </div>

        <div className="lg:col-span-7">
          <h2
            className="mb-6 font-serif text-xl font-normal tracking-tight md:text-2xl"
            style={{ color: STITCH_INK }}
          >
            Next actions
          </h2>
          <p className="mb-4 text-sm" style={{ color: STITCH_MUTED }}>
            What to do next.
          </p>
          <div className="rounded-2xl border border-[#c3c8c1]/30 bg-white/80 px-1 sm:px-2">
            {[
              {
                href: '/study-plan',
                title: `Complete week ${plan.currentWeekNumber}`,
                sub: 'Parts still open in your plan',
              },
              {
                href: '/error-log',
                title: 'Review errors',
                sub: 'Due for spaced review',
              },
              {
                href: '/coach',
                title: 'Ask the coach',
                sub: 'Step-by-step quant help',
              },
            ].map((row, i) => (
              <Link
                key={row.href}
                href={row.href}
                className={cn(
                  'flex items-center justify-between gap-4 border-[#c3c8c1]/30 py-5 pl-3 pr-2 transition-colors hover:bg-[#fbf9f4]/80 sm:pl-4',
                  i > 0 && 'border-t'
                )}
              >
                <div>
                  <p className="font-medium" style={{ color: STITCH_INK }}>
                    {row.title}
                  </p>
                  <p className="mt-0.5 text-sm" style={{ color: STITCH_MUTED }}>
                    {row.sub}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 opacity-50" style={{ color: STITCH_INK }} aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Stat row — Stitch: four #f5f3ee tiles */}
      <div className="mb-12 grid grid-cols-2 gap-4 lg:mb-16 lg:grid-cols-4 lg:gap-5">
        {[
          {
            eyebrow: 'This week',
            value: `${Math.round(progressPercent)}%`,
            sub: 'Current module',
          },
          {
            eyebrow: 'Accuracy',
            value: `${avgAll}%`,
            sub: 'Across topics',
          },
          {
            eyebrow: 'Topics',
            value: `${masteredCount}`,
            sub: `of ${mockTopicMastery.length} mastered`,
          },
          {
            eyebrow: 'Vocabulary',
            value: isClient ? String(totalWordsLearned) : '—',
            sub: `${mockDailyCheckIns.slice(0, 7).reduce((s, c) => s + c.wordsLearned, 0)} this week`,
          },
        ].map((stat) => (
          <div key={stat.eyebrow} className="rounded-2xl bg-[#f5f3ee] px-5 py-5 sm:px-6 sm:py-6">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: STITCH_MUTED }}
            >
              {stat.eyebrow}
            </p>
            <p
              className="mt-3 font-serif text-3xl font-normal tabular-nums tracking-tight sm:text-4xl"
              style={{ color: STITCH_INK }}
            >
              {stat.value}
            </p>
            <p className="mt-1 text-xs" style={{ color: STITCH_MUTED }}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Footer band — overall + domain bars */}
      <section
        className="-mx-4 rounded-2xl bg-[#f5f3ee] px-4 py-10 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 lg:py-12"
      >
        <h2
          className="mb-2 font-serif text-xl font-normal tracking-tight md:text-2xl"
          style={{ color: STITCH_INK }}
        >
          Overall progress
        </h2>
        <p className="mb-6 text-sm" style={{ color: STITCH_MUTED }}>
          Average accuracy across all quant topics you&apos;ve practiced.
        </p>
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs font-medium" style={{ color: STITCH_MUTED }}>
            <span>Blended score</span>
            <span className="tabular-nums" style={{ color: STITCH_PRIMARY }}>
              {avgAll}%
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-white" style={{ boxShadow: `inset 0 0 0 1px ${STITCH_TRACK}` }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${avgAll}%`, backgroundColor: STITCH_PRIMARY }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categoryBars.map((cat) => (
            <div key={cat.label}>
              <div className="mb-2 flex justify-between text-xs" style={{ color: STITCH_MUTED }}>
                <span>{cat.label}</span>
                <span className="tabular-nums font-medium" style={{ color: STITCH_INK }}>
                  {cat.pct}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/90">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${cat.pct}%`, backgroundColor: STITCH_PRIMARY }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3 text-xs" style={{ color: STITCH_MUTED }}>
          <span className="tabular-nums">{daysSinceStarted} days studying</span>
          <span aria-hidden>·</span>
          <span className="tabular-nums" suppressHydrationWarning>
            {isClient && plan.targetGREDate
              ? `${daysRemaining} days to test (${plan.targetGREDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })})`
              : 'Set your test date in onboarding'}
          </span>
        </div>
        <Link href="/topic-mastery" className="mt-6 inline-block">
          <Button
            variant="outline"
            className="border-[#c3c8c1]/50 bg-white text-xs font-semibold uppercase tracking-widest"
            style={{ color: STITCH_INK }}
          >
            Detailed topic report
          </Button>
        </Link>
      </section>
    </PageShell>
  );
}
