'use client';

/**
 * Dashboard — editorial layout aligned with reference comps (cream canvas,
 * white elevated cards, forest green accent, no oversized pill hero).
 */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageShell } from '@/components/page-shell';
import type { QuantTopic, StudyPlan } from '@/lib/data-schema';
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
  FileText,
  Play,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

/** Reference green — slightly darker for contrast on cream */
const ACCENT = '#4a5d4e';
const MUTED = '#5c564f';
const INK = '#1f1c18';

/** Dashboard canvas: one CTA shape + one accent (avoid pill vs rounded-md + mixed greens). */
const CANVAS_PRIMARY_CTA_CLASS = cn(
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition-[transform,opacity] hover:opacity-95 active:scale-[0.99]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f1c18]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9f8f3]'
);

const DAILY_QUOTES = [
  { text: 'Hard topics are just future strengths waiting to be unlocked.', by: null },
  { text: 'Precision today builds confidence tomorrow.', by: null },
  { text: 'Every problem solved is progress made.', by: null },
  {
    text: 'The essence of mathematics is not to make simple things complicated, but to make complicated things simple.',
    by: 'S. Gudder',
  },
  { text: "You're learning the exact patterns the GRE tests.", by: null },
  { text: "Consistency over intensity—you've got this.", by: null },
  { text: 'Master one concept, and build from there.', by: null },
  { text: 'Rigor now means clarity on test day.', by: null },
  { text: 'Your effort is compounding into skill.', by: null },
];

function getDailyQuote(dateString?: string): (typeof DAILY_QUOTES)[0] {
  const hashDate = dateString || new Date().toDateString();
  const hash = hashDate.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return DAILY_QUOTES[hash % DAILY_QUOTES.length];
}

type DashboardWeakFocus = {
  id: string;
  topic: QuantTopic;
  subtopic: string;
  practiceAccuracyPercent: number;
};

function weakFocusFromOnboarding(areas: QuantTopic[]): DashboardWeakFocus[] {
  return areas.slice(0, 3).map((topic, i) => ({
    id: `weak-${i}`,
    topic,
    subtopic: topic.replace(/_/g, ' '),
    practiceAccuracyPercent: 0,
  }));
}

function planWideTaskCompletionPercent(plan: StudyPlan): number {
  let total = 0;
  let done = 0;
  for (const m of plan.modules) {
    for (const p of m.parts) {
      for (const t of p.tasks) {
        total += 1;
        if (t.completed) done += 1;
      }
    }
  }
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

function iconForTopic(topic: string) {
  if (topic.startsWith('arithmetic_')) return Calculator;
  if (topic.startsWith('algebra_')) return Variable;
  if (topic.startsWith('geometry_')) return Shapes;
  return BarChart3;
}

function topicCategoryCaps(topic: string): string {
  if (topic.startsWith('arithmetic_')) return 'Arithmetic';
  if (topic.startsWith('algebra_')) return 'Algebra';
  if (topic.startsWith('geometry_')) return 'Geometry';
  if (topic.startsWith('data_analysis_')) return 'Data analysis';
  return 'Quant';
}

export default function Dashboard() {
  const { user, studyPlan: plan, hasCompletedOnboarding, hydrated } = useUserPlan();
  const [isClient, setIsClient] = useState(false);
  const [dailyQuote, setDailyQuote] = useState<(typeof DAILY_QUOTES)[0] | null>(null);

  useEffect(() => {
    setIsClient(true);
    setDailyQuote(getDailyQuote());
  }, []);

  const currentModule = plan.modules.find((m) => m.id === plan.currentModuleId);
  const currentPart = currentModule?.parts.find((p) => p.id === plan.currentPartId);
  const daysRemaining = plan.daysRemaining;

  const weakAreas = weakFocusFromOnboarding(user.weakAreasFromOnboarding ?? []);

  const totalWordsLearned = 0;
  const daysSinceStarted = isClient
    ? Math.floor((Date.now() - user.startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const tasksCompleted = currentPart?.tasks.filter((t) => t.completed).length || 0;
  const tasksTotal = currentPart?.tasks.length || 0;
  const progressPercent = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;

  const isOnTrack = plan.latenessState === 'on_track';

  const categoryBars = [
    { label: 'Arithmetic', pct: 0 },
    { label: 'Algebra', pct: 0 },
    { label: 'Geometry', pct: 0 },
    { label: 'Data analysis', pct: 0 },
  ];

  const weekLabel = `Week ${plan.currentWeekNumber} of 12`;
  const focusTitle = currentModule?.title ?? 'Your study plan';
  const partLabel = currentPart?.title ?? 'Current part';

  let questionsApprox = 0;
  for (const m of plan.modules) {
    for (const p of m.parts) {
      questionsApprox += p.tasks.filter((t) => t.completed).length * 12;
    }
  }

  const planWidePct = planWideTaskCompletionPercent(plan);

  return (
    <PageShell variant="canvas">
      {hydrated && !hasCompletedOnboarding && (
        <div
          className="mb-8 flex flex-col gap-3 rounded-xl border border-[#dcd8cf] bg-white/90 px-4 py-3 text-sm shadow-sm sm:flex-row sm:items-center sm:justify-between"
          style={{ color: INK }}
        >
          <span style={{ color: MUTED }}>
            Set your GRE date and weekly hours so the dashboard matches your plan.
          </span>
          <Link
            href="/onboarding"
            className={cn(CANVAS_PRIMARY_CTA_CLASS, 'w-full shrink-0 sm:w-auto')}
            style={{ backgroundColor: ACCENT }}
          >
            Complete setup
            <ArrowRight className="h-4 w-4 shrink-0 opacity-95" aria-hidden />
          </Link>
        </div>
      )}

      {/* Top: status + quote — no extra redundant subtitle block */}
      <header className="mb-8 lg:mb-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="min-w-0 flex-1">
            <Badge
              variant="outline"
              className={cn(
                'mb-4 w-fit gap-1 border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]',
                isOnTrack
                  ? 'border-[#c8c3ba] bg-white/80 text-[#4a4540]'
                  : 'border-red-200 bg-red-50 text-red-900'
              )}
            >
              {isOnTrack ? (
                <>
                  <CheckCircle2 className="h-3 w-3" style={{ color: ACCENT }} aria-hidden />
                  On track
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3 w-3 text-red-600" aria-hidden />
                  Catch up
                </>
              )}
            </Badge>
            {dailyQuote && (
              <>
                <blockquote
                  className="font-serif text-xl font-normal italic leading-snug tracking-tight text-[#2a2622] md:text-2xl lg:max-w-3xl"
                  aria-label="Daily encouragement"
                >
                  &ldquo;{dailyQuote.text}&rdquo;
                </blockquote>
                {dailyQuote.by ? (
                  <p
                    className="mt-3 font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-[#7a7269]"
                  >
                    — {dailyQuote.by}
                  </p>
                ) : null}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Weekly card: rounded rectangle (not full pill), CTA on the right on large screens */}
      <section className="mb-10 lg:mb-14">
        <div
          className="flex flex-col gap-8 rounded-2xl border border-[#e8e4dc] bg-white px-5 py-6 shadow-[0_8px_28px_-12px_rgba(31,28,24,0.08)] sm:px-7 sm:py-8 lg:flex-row lg:items-stretch lg:gap-10 lg:px-8 lg:py-7"
        >
          <div className="min-w-0 flex-1">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7a7269]">
              Weekly progression
            </p>
            <h1 className="mt-2 font-serif text-xl font-normal tracking-tight text-[#1f1c18] sm:text-2xl lg:text-[1.65rem]">
              Current focus: {weekLabel} — {focusTitle}
            </h1>
            <p className="mt-1.5 font-sans text-sm text-[#5c564f]">{partLabel}</p>

            {/* Completion + Accuracy: labels tight to values, shared visual rhythm */}
            <div className="mt-6 grid grid-cols-2 gap-6 sm:gap-10 lg:mt-7 lg:max-w-xl">
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a7269]">
                    Completion
                  </span>
                  <span className="font-serif text-2xl tabular-nums tracking-tight text-[#1f1c18]">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#ebe7df]">
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{ width: `${progressPercent}%`, backgroundColor: ACCENT }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a7269]">
                    Plan overall
                  </span>
                  <span className="font-serif text-2xl tabular-nums tracking-tight text-[#1f1c18]">
                    {planWidePct}%
                  </span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#ebe7df]">
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{ width: `${planWidePct}%`, backgroundColor: ACCENT }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col justify-center lg:w-[min(100%,14rem)]">
            <Link
              href="/study-plan"
              className={cn(CANVAS_PRIMARY_CTA_CLASS, 'w-full')}
              style={{ backgroundColor: ACCENT }}
            >
              Start today&apos;s work
              <ArrowRight className="h-4 w-4 shrink-0 opacity-95" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <div className="mb-10 grid grid-cols-1 gap-10 lg:mb-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="font-serif text-xl font-normal tracking-tight text-[#1f1c18] md:text-2xl">
              Focus areas
            </h2>
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a7269]">
              High priority
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {weakAreas.length > 0 ? (
              weakAreas.map((area) => {
                const Icon = iconForTopic(area.topic);
                const cat = topicCategoryCaps(area.topic);
                return (
                  <Link
                    key={area.id}
                    href="/topic-mastery"
                    className="flex items-center gap-3 rounded-xl border border-transparent bg-[#f3f1eb] px-3 py-3 transition-colors hover:border-[#dcd8cf] hover:bg-[#ebe8e0] sm:gap-4 sm:px-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-[#5a6b5c] shadow-sm">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-base font-medium capitalize leading-tight text-[#1f1c18]">
                        {area.subtopic.replace(/_/g, ' ')}
                      </p>
                      <p className="mt-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[#7a7269]">
                        {cat}
                      </p>
                    </div>
                    <div className="shrink-0 text-right leading-none">
                      <p className="font-serif text-xl tabular-nums tracking-tight text-[#1f1c18]">
                        {area.practiceAccuracyPercent}%
                      </p>
                      <p className="mt-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-[#7a7269]">
                        Accuracy
                      </p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="rounded-xl bg-[#f3f1eb] px-4 py-5 text-sm text-[#5c564f]">
                Choose weak areas in Settings (or onboarding) to pin focus topics here. Practice data will fill in
                as you log work.
              </p>
            )}
          </div>
          <Link href="/topic-mastery" className="mt-4 inline-block text-sm font-medium text-[#4a5d4e] underline-offset-4 hover:underline">
            View all topics
          </Link>
        </div>

        <div className="lg:col-span-7">
          <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="font-serif text-xl font-normal tracking-tight text-[#1f1c18] md:text-2xl">
              Next actions
            </h2>
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a7269]">
              Pending tasks
            </span>
          </div>
          <div className="divide-y divide-[#e5e1d8] rounded-2xl border border-[#e5e1d8] bg-white">
            {[
              {
                href: '/study-plan',
                title: `Complete week ${plan.currentWeekNumber}`,
                sub: 'Open your plan and finish the next part.',
                Icon: CheckCircle2,
              },
              {
                href: '/error-log',
                title: 'Review recent mistakes',
                sub: 'Spaced review for errors due today.',
                Icon: FileText,
              },
              {
                href: '/coach',
                title: 'Ask the quant coach',
                sub: 'Step-by-step help on a stuck topic.',
                Icon: Play,
              },
            ].map((row) => (
              <Link
                key={row.href}
                href={row.href}
                className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-[#faf9f6] sm:px-5 sm:py-4"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e5e1d8] bg-[#f9f8f3] text-[#4a5d4e]"
                  aria-hidden
                >
                  <row.Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm font-semibold text-[#1f1c18]">{row.title}</p>
                  <p className="mt-0.5 text-sm leading-snug text-[#5c564f]">{row.sub}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#a39a8f]" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Four white stat cards — stronger contrast on cream */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:gap-4 lg:mb-14 lg:grid-cols-4">
        {[
          {
            eyebrow: 'Questions solved',
            value: Math.max(questionsApprox, 0).toLocaleString('en-US'),
            sub: isOnTrack ? 'On pace this week' : 'Add a review block',
          },
          {
            eyebrow: 'Plan progress',
            value: `${planWidePct}%`,
            sub: 'All tasks in the 12-week plan',
          },
          {
            eyebrow: 'Completion',
            value: `${Math.round(progressPercent)}%`,
            sub: 'This module',
          },
          {
            eyebrow: 'Vocabulary',
            value: isClient ? String(totalWordsLearned) : '—',
            sub: 'Optional — track in your notebook for now',
          },
        ].map((stat) => (
          <div
            key={stat.eyebrow}
            className="rounded-xl border border-[#e8e4dc] bg-white px-4 py-4 shadow-sm sm:px-5 sm:py-5"
          >
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a7269]">
              {stat.eyebrow}
            </p>
            <p className="mt-1.5 font-serif text-2xl font-normal tabular-nums tracking-tight text-[#1f1c18] sm:text-3xl">
              {stat.value}
            </p>
            <p className="mt-1 font-sans text-xs leading-tight text-[#5c564f]">{stat.sub}</p>
          </div>
        ))}
      </div>

      <section className="-mx-4 rounded-2xl border border-[#e5e1d8] bg-[#f3f1eb] px-4 py-8 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-10 lg:py-10">
        <h2 className="font-serif text-xl font-normal tracking-tight text-[#1f1c18] md:text-2xl">
          By domain
        </h2>
        <p className="mt-1 max-w-xl text-sm text-[#5c564f]">
          Domain-level accuracy appears when you log practice or errors. Until then, use your plan and weak-area
          picks to prioritize.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categoryBars.map((cat) => (
            <div key={cat.label} className="rounded-xl border border-[#e5e1d8] bg-white px-3 py-3">
              <div className="flex items-center justify-between text-xs text-[#5c564f]">
                <span className="font-medium text-[#1f1c18]">{cat.label}</span>
                <span className="tabular-nums font-semibold text-[#1f1c18]">{cat.pct}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#ebe7df]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${cat.pct}%`, backgroundColor: ACCENT }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-[#5c564f]">
          <span className="tabular-nums">{daysSinceStarted}</span> days studying
          <span className="mx-2 text-[#c4bdb4]">·</span>
          <span className="tabular-nums" suppressHydrationWarning>
            {isClient && plan.targetGREDate
              ? `${daysRemaining} days to test`
              : 'Set your test date in settings'}
          </span>
        </p>
        <Link href="/topic-mastery" className="mt-5 inline-block">
          <Button
            variant="outline"
            className="border-[#d0cbc2] bg-white text-xs font-semibold uppercase tracking-widest text-[#1f1c18]"
          >
            Topic report
          </Button>
        </Link>
      </section>
    </PageShell>
  );
}
