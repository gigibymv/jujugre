'use client';

import { PageShell } from '@/components/page-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockTopicMastery, mockErrorPatterns, mockConceptPrerequisites } from '@/lib/mock-data';
import type { MasteryLevel } from '@/lib/data-schema';
import { ErrorPatternInsights } from '@/components/error-pattern-insights';
import { ConceptPrerequisites } from '@/components/concept-prerequisites';
import Link from 'next/link';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  Sparkles,
} from 'lucide-react';

export default function TopicMasteryPage() {
  const mastered = mockTopicMastery.filter((t) => t.masteryLevel === 'mastered');
  const proficient = mockTopicMastery.filter((t) => t.masteryLevel === 'proficient');
  const developing = mockTopicMastery.filter((t) => t.masteryLevel === 'developing');
  const notStarted = mockTopicMastery.filter((t) => t.masteryLevel === 'not_started');

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'mastered':
        return {
          bg: 'bg-muted/50',
          border: 'border-accent/45',
          text: 'text-accent',
          icon: CheckCircle2,
        };
      case 'proficient':
        return {
          bg: 'bg-muted/50',
          border: 'border-muted-foreground/30',
          text: 'text-muted-foreground',
          icon: TrendingUp,
        };
      case 'developing':
        return {
          bg: 'bg-muted/50',
          border: 'border-destructive/30',
          text: 'text-destructive',
          icon: AlertTriangle,
        };
      case 'not_started':
        return {
          bg: 'bg-muted/40',
          border: 'border-border',
          text: 'text-muted-foreground',
          icon: Clock,
        };
      default:
        return {
          bg: 'bg-muted/40',
          border: 'border-border',
          text: 'text-muted-foreground',
          icon: Clock,
        };
    }
  };

  const calculateMasteryScore = (topic: (typeof mockTopicMastery)[0]) => {
    return Math.round(
      topic.practiceAccuracyPercent * 0.4 +
        topic.taskCompletionPercent * 0.35 +
        topic.selfRatingAverage * 0.15 * 20 -
        (topic.practiceAccuracyPercent < 70 ? 10 : 0)
    );
  };

  const renderMasteryCard = (topic: (typeof mockTopicMastery)[0]) => {
    const colors = getMasteryColor(topic.masteryLevel);
    const IconComponent = colors.icon;
    const masteryScore = calculateMasteryScore(topic);
    const subtopicLabel = topic.subtopic
      .replace(/_/g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const coachLabel =
      topic.masteryLevel === 'mastered'
        ? 'Deep dive'
        : topic.masteryLevel === 'proficient'
          ? 'Practice'
          : 'Get help';

    return (
      <Card
        key={topic.id}
        className={`cursor-pointer border-2 transition-colors duration-150 ease-out hover:bg-muted/30 ${colors.border} ${colors.bg}`}
      >
        <CardContent className="pt-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex flex-1 items-start gap-3">
                <div
                  className={`flex shrink-0 rounded-lg border p-2 ${colors.bg} ${colors.border}`}
                >
                  <IconComponent className={`h-5 w-5 ${colors.text}`} aria-hidden />
                </div>
                <div>
                  <h3 className="font-semibold leading-tight text-foreground">{subtopicLabel}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {topic.topic.replace(/_/g, ' ').toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-2xl font-bold tabular-nums text-foreground">{masteryScore}%</div>
                <div className="text-xs text-muted-foreground">Mastery</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-background/80 px-3 py-3">
              <div className="text-center">
                <div className="mb-1 text-xs font-medium text-muted-foreground">Accuracy</div>
                <div className="text-lg font-bold tabular-nums text-foreground">
                  {topic.practiceAccuracyPercent}%
                </div>
                <Progress value={topic.practiceAccuracyPercent} className="mt-1.5" />
              </div>
              <div className="border-x border-border text-center">
                <div className="mb-1 text-xs font-medium text-muted-foreground">Completion</div>
                <div className="text-lg font-bold tabular-nums text-foreground">
                  {topic.taskCompletionPercent}%
                </div>
                <Progress value={topic.taskCompletionPercent} className="mt-1.5" />
              </div>
              <div className="text-center">
                <div className="mb-1 text-xs font-medium text-muted-foreground">Confidence</div>
                <div className="text-lg font-bold tabular-nums text-foreground">
                  {topic.selfRatingAverage}/5
                </div>
                <Progress value={(topic.selfRatingAverage / 5) * 100} className="mt-1.5" />
              </div>
            </div>

            {topic.lastReviewDate && (
              <div className="pt-1 text-xs text-muted-foreground">
                Last reviewed:{' '}
                <span className="font-medium text-foreground">
                  {topic.lastReviewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-2 border-t border-border pt-2 sm:grid-cols-2">
              <Link href={`/coach?topic=${topic.topic}`} className="min-w-0">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  {coachLabel}
                </Button>
              </Link>
              <Link href="/error-log" className="min-w-0">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Review errors
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <PageShell>
      <header className="mb-page-section border-b border-border pb-6">
        <p className="page-eyebrow mb-2">Topics</p>
        <h1 className="mb-2 font-serif text-3xl font-normal tracking-tight text-foreground md:text-4xl">
          Topic mastery
        </h1>
        <p className="text-muted-foreground">
          Track proficiency across GRE quantitative topics with multi-signal analysis.
        </p>
      </header>

      <div className="mb-page-block">
        <ErrorPatternInsights patterns={mockErrorPatterns} />
      </div>

      <div className="mb-page-section">
        <ConceptPrerequisites
          prerequisites={mockConceptPrerequisites}
          topicMasteryMap={mockTopicMastery.reduce(
            (acc, tm) => {
              acc[tm.subtopic] = tm.masteryLevel;
              return acc;
            },
            {} as Record<string, MasteryLevel>
          )}
        />
      </div>

      <div className="mb-page-section grid grid-cols-1 gap-6 md:grid-cols-4">
        {[
          { label: 'Mastered', count: mastered.length, hint: 'Strong command', tone: 'text-accent' },
          { label: 'Proficient', count: proficient.length, hint: 'Solid foundation', tone: 'text-foreground' },
          { label: 'Focus areas', count: developing.length, hint: 'Needs attention', tone: 'text-destructive' },
          { label: 'Not started', count: notStarted.length, hint: 'Coming up', tone: 'text-muted-foreground' },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardTitle className="page-eyebrow">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold tabular-nums ${s.tone}`}>{s.count}</div>
              <p className="mt-2 text-xs text-muted-foreground">{s.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {mastered.length > 0 && (
        <section className="mb-page-section">
          <div className="mb-page-tight flex items-center gap-2 border-b border-border pb-3">
            <CheckCircle2 className="h-5 w-5 text-accent" aria-hidden />
            <h2 className="font-sans text-lg font-semibold text-foreground">
              Mastered topics ({mastered.length})
            </h2>
            <span className="ml-auto text-xs font-semibold text-accent">Keep sharp</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{mastered.map(renderMasteryCard)}</div>
        </section>
      )}

      {proficient.length > 0 && (
        <section className="mb-page-section">
          <div className="mb-page-tight flex items-center gap-2 border-b border-border pb-3">
            <TrendingUp className="h-5 w-5 text-muted-foreground" aria-hidden />
            <h2 className="font-sans text-lg font-semibold text-foreground">
              Proficient topics ({proficient.length})
            </h2>
            <span className="ml-auto text-xs font-semibold text-muted-foreground">On track</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{proficient.map(renderMasteryCard)}</div>
        </section>
      )}

      {developing.length > 0 && (
        <section className="mb-page-section">
          <div className="mb-page-tight flex items-center gap-2 border-b border-border pb-3">
            <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden />
            <h2 className="font-sans text-lg font-semibold text-foreground">
              Focus areas ({developing.length})
            </h2>
            <span className="ml-auto text-xs font-semibold text-destructive">Priority</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{developing.map(renderMasteryCard)}</div>
        </section>
      )}

      {notStarted.length > 0 && (
        <section className="mb-page-section">
          <div className="mb-page-tight flex items-center gap-2 border-b border-border pb-3">
            <Clock className="h-5 w-5 text-muted-foreground" aria-hidden />
            <h2 className="font-sans text-lg font-semibold text-foreground">
              Not started ({notStarted.length})
            </h2>
            <span className="ml-auto text-xs font-semibold text-muted-foreground">Upcoming</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{notStarted.map(renderMasteryCard)}</div>
        </section>
      )}

      <Card className="mt-page-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <BarChart3 className="h-5 w-5 text-muted-foreground" aria-hidden />
            How mastery is calculated
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-foreground">
          <p className="font-medium">Your mastery score combines four signals:</p>
          <div className="space-y-2">
            {[
              { pct: '40%', title: 'Practice accuracy', desc: 'Correctness on practice problems' },
              { pct: '35%', title: 'Task completion', desc: 'Share of assigned work finished' },
              { pct: '15%', title: 'Self-confidence', desc: 'Your assessment of understanding' },
              { pct: '−10%', title: 'Error penalty', desc: 'When accuracy drops below 70%', warn: true },
            ].map((row) => (
              <div
                key={row.title}
                className={`flex items-start gap-3 rounded-lg border border-border p-2 ${row.warn ? 'bg-muted/40' : 'bg-muted/20'}`}
              >
                <div className="min-w-[3rem] text-lg font-bold tabular-nums">{row.pct}</div>
                <div>
                  <div className="font-semibold">{row.title}</div>
                  <div className="text-xs text-muted-foreground">{row.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="surface-quiet rounded-lg p-3">
            <p className="font-sans text-xs leading-relaxed text-foreground">
              <span className="font-semibold">Formula:</span>
              <br />
              Score = (Accuracy × 0.40) + (Completion × 0.35) + (Confidence × 0.15 × 20) − (Accuracy &lt; 70%
              ? 10 : 0)
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            <p className="mb-1 flex items-center gap-1.5 font-semibold text-foreground">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Why this matters
            </p>
            <p>
              Practice accuracy is weighted highest as the most reliable signal. The penalty below 70% marks a
              clear gate for targeted review.
            </p>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
