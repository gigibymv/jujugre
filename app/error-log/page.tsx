'use client';

import { PageShell } from '@/components/page-shell';
import { ContentHeader } from '@/components/content-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type {
  DrillOutcome,
  ErrorCategory,
  ErrorLogEntry,
  QuantSubtopic,
  QuestionType,
} from '@/lib/data-schema';
import {
  appendErrorLogEntry,
  loadErrorLogEntries,
  setErrorLogEntryOutcome,
  setErrorLogEntryReviewed,
} from '@/lib/error-log-storage';
import {
  ERROR_CATEGORY_OPTIONS,
  QUESTION_TYPE_OPTIONS,
  SUBTOPIC_OPTIONS,
} from '@/lib/error-log-form-options';
import { getDrillPack } from '@/lib/error-drills';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Clock, Zap, BookOpen, ListChecks, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const CATEGORY_LABEL = Object.fromEntries(ERROR_CATEGORY_OPTIONS.map((o) => [o.value, o.label]));

const OUTCOME_META: Record<DrillOutcome, { label: string; score: number }> = {
  struggled: { label: 'Struggled', score: 20 },
  partial: { label: 'Partial', score: 10 },
  mastered: { label: 'Mastered', score: -8 },
};

function computePriority(error: ErrorLogEntry, allEntries: ErrorLogEntry[], now: Date): number {
  const daysUntilDue = Math.ceil((error.reviewDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const dueBoost = daysUntilDue <= 0 ? 40 : Math.max(0, 18 - daysUntilDue * 2);
  const repeatCount = allEntries.filter(
    (e) => e.id !== error.id && e.subtopic === error.subtopic && e.errorCategory === error.errorCategory
  ).length;
  const confidencePenalty = (5 - (error.confidence ?? 3)) * 4;
  const outcomeScore = OUTCOME_META[error.lastOutcome ?? 'struggled'].score;
  return dueBoost + repeatCount * 14 + confidencePenalty + outcomeScore + (error.reviewed ? -20 : 18);
}

export default function ErrorLogPage() {
  const [entries, setEntries] = useState<ErrorLogEntry[]>([]);
  const [sortBy, setSortBy] = useState<'priority' | 'review_due' | 'recent' | 'topic'>('priority');
  const [filterReviewed, setFilterReviewed] = useState<'all' | 'unreviewed' | 'reviewed'>('unreviewed');
  const [formOpen, setFormOpen] = useState(false);

  const [problem, setProblem] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [sourceReference, setSourceReference] = useState('');
  const [subtopic, setSubtopic] = useState<QuantSubtopic>(SUBTOPIC_OPTIONS[0]!.value);
  const [errorCategory, setErrorCategory] = useState<ErrorCategory>(ERROR_CATEGORY_OPTIONS[0]!.value);
  const [questionType, setQuestionType] = useState<QuestionType>('numeric_entry');

  const refresh = useCallback(() => {
    setEntries(loadErrorLogEntries());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleAddMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim() || !studentAnswer.trim()) return;
    appendErrorLogEntry({
      problem,
      studentAnswer,
      correctAnswer,
      explanation,
      sourceReference,
      subtopic,
      errorCategory,
      questionType,
    });
    setProblem('');
    setStudentAnswer('');
    setCorrectAnswer('');
    setExplanation('');
    setSourceReference('');
    refresh();
    setFormOpen(false);
    setFilterReviewed('unreviewed');
  };

  let filtered = entries;
  if (filterReviewed === 'unreviewed') {
    filtered = filtered.filter((e) => !e.reviewed);
  } else if (filterReviewed === 'reviewed') {
    filtered = filtered.filter((e) => e.reviewed);
  }

  const now = new Date();

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === 'priority') {
        return computePriority(b, entries, now) - computePriority(a, entries, now);
      }
      if (sortBy === 'review_due') {
        return a.reviewDueDate.getTime() - b.reviewDueDate.getTime();
      }
      if (sortBy === 'recent') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
      return a.topic.localeCompare(b.topic);
    });
  }, [entries, filtered, sortBy]);

  const unreviewedCount = entries.filter((e) => !e.reviewed).length;
  const reviewDueNow = sorted.filter((e) => e.reviewDueDate <= now).length;

  const categoryStats = entries.reduce(
    (acc: Record<string, number>, err) => {
      const cat = err.errorCategory;
      acc[cat] = (acc[cat] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const topProblematicCategory = Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0] as
    | [string, number]
    | undefined;

  return (
    <PageShell>
      <ContentHeader
        eyebrow="Review"
        title="Error log"
        description="Log a mistake in a few fields, run the suggested drills, then open the coach for structured feedback."
      />

      <div className="mb-page-block">
        <Button
          type="button"
          variant={formOpen ? 'secondary' : 'default'}
          size="sm"
          className="gap-2"
          onClick={() => setFormOpen((o) => !o)}
        >
          <Plus className="h-4 w-4" aria-hidden />
          {formOpen ? 'Close form' : 'Add a mistake'}
        </Button>
      </div>

      {formOpen && (
        <Card className="mb-page-section border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">New error entry</CardTitle>
            <p className="text-sm text-muted-foreground">
              Short notes are enough. The coach gets a structured prompt; drills below are matched to the mistake
              type.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMistake} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="err-subtopic">Subtopic</Label>
                  <select
                    id="err-subtopic"
                    value={subtopic}
                    onChange={(e) => setSubtopic(e.target.value as QuantSubtopic)}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    {SUBTOPIC_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="err-category">Mistake type</Label>
                  <select
                    id="err-category"
                    value={errorCategory}
                    onChange={(e) => setErrorCategory(e.target.value as ErrorCategory)}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    {ERROR_CATEGORY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="err-qtype">Question format</Label>
                  <select
                    id="err-qtype"
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    {QUESTION_TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="err-problem">Problem (stem or summary)</Label>
                <Textarea
                  id="err-problem"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="e.g. If x² − 5x + 6 = 0, what is the sum of the solutions?"
                  required
                  rows={3}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="err-wrong">Your answer</Label>
                  <Input
                    id="err-wrong"
                    value={studentAnswer}
                    onChange={(e) => setStudentAnswer(e.target.value)}
                    placeholder="What you put"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="err-right">Correct answer</Label>
                  <Input
                    id="err-right"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    placeholder="Answer key / target"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="err-explain">What went wrong? (optional)</Label>
                <Textarea
                  id="err-explain"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="One line is fine — e.g. forgot to flip the inequality."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="err-source">Source (optional)</Label>
                <Input
                  id="err-source"
                  value={sourceReference}
                  onChange={(e) => setSourceReference(e.target.value)}
                  placeholder="Book, test, or deck name"
                />
              </div>

              <Button type="submit" className="w-full sm:w-auto">
                Save to error log
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="mb-page-section grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="page-eyebrow">Total errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-foreground">{entries.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="page-eyebrow">Unreviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold tabular-nums ${unreviewedCount > 0 ? 'text-destructive' : 'text-accent'}`}
            >
              {unreviewedCount}
            </div>
            {reviewDueNow > 0 && (
              <p className="mt-1 text-xs font-medium text-destructive">{reviewDueNow} due now</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="page-eyebrow">Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-accent">
              {entries.filter((e) => e.reviewed).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="page-eyebrow">Top issue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-foreground">
              {topProblematicCategory ? topProblematicCategory[0].replace(/_/g, ' ') : 'N/A'}
            </div>
            {topProblematicCategory && (
              <p className="mt-1 text-xs text-muted-foreground">{String(topProblematicCategory[1])} errors</p>
            )}
          </CardContent>
        </Card>
      </div>

      {reviewDueNow > 0 && (
        <Card className="mb-page-block border-l-4 border-l-muted-foreground bg-muted/30">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
              <div>
                <p className="font-semibold text-foreground">
                  {reviewDueNow} error{reviewDueNow !== 1 ? 's' : ''} due for review
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Reviewing within 48 hours improves retention. Tackle these first.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-page-block flex flex-col gap-3 md:flex-row">
        <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
          <Button
            variant={filterReviewed === 'unreviewed' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilterReviewed('unreviewed')}
            className="text-xs"
          >
            Unreviewed ({unreviewedCount})
          </Button>
          <Button
            variant={filterReviewed === 'reviewed' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilterReviewed('reviewed')}
            className="text-xs"
          >
            Reviewed ({entries.filter((e) => e.reviewed).length})
          </Button>
          <Button
            variant={filterReviewed === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilterReviewed('all')}
            className="text-xs"
          >
            All
          </Button>
        </div>

        <div className="flex gap-2 rounded-lg border border-border bg-card p-1 md:ml-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'priority' | 'review_due' | 'recent' | 'topic')}
            className="rounded-md border-0 bg-transparent px-3 py-2 text-xs text-foreground"
          >
            <option value="priority">Smart priority</option>
            <option value="review_due">Review due</option>
            <option value="recent">Most recent</option>
            <option value="topic">By topic</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <Card className="border-l-4 border-l-accent bg-muted/20">
            <CardContent className="pb-6 pt-6 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-accent" aria-hidden />
              <p className="mb-1 font-semibold text-foreground">
                {entries.length === 0 ? 'No errors logged yet' : 'Nothing in this filter'}
              </p>
              <p className="text-sm text-muted-foreground">
                {entries.length === 0
                  ? 'Use “Add a mistake” above, or errors from practice will land here once wired.'
                  : 'Switch filter to “All” or “Unreviewed”, or add a new entry.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          sorted.map((error) => {
            const topicLabel = error.subtopic
              .replace(/_/g, ' ')
              .split(' ')
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
            const isReviewDue = error.reviewDueDate <= now;
            const daysUntilDue = Math.ceil(
              (error.reviewDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );
            const drillPack = getDrillPack(error.errorCategory, error.subtopic);
            const priorityScore = computePriority(error, entries, now);
            const categoryLabel = CATEGORY_LABEL[error.errorCategory] ?? error.errorCategory.replace(/_/g, ' ');

            return (
              <Card
                key={error.id}
                className={`border-2 transition-colors duration-150 ease-out ${
                  error.reviewed
                    ? 'border-accent/30 bg-accent/[0.09]'
                    : isReviewDue
                      ? 'border-muted-foreground/35 bg-muted/30'
                      : 'border-border bg-card'
                }`}
              >
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {topicLabel}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {categoryLabel}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Priority {priorityScore}
                          </Badge>
                          {error.reviewed && (
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <CheckCircle2 className="h-3 w-3" aria-hidden />
                              Reviewed
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold leading-snug text-foreground">{error.problem}</h3>
                      </div>

                      <div className="shrink-0">
                        {!error.reviewed && isReviewDue && (
                          <div className="text-right">
                            <AlertCircle className="mb-1 h-5 w-5 text-destructive" aria-hidden />
                            <p className="text-xs font-semibold text-destructive">Due now</p>
                          </div>
                        )}
                        {!error.reviewed && !isReviewDue && (
                          <div className="text-right">
                            <Clock className="mb-1 h-5 w-5 text-muted-foreground" aria-hidden />
                            <p className="text-xs text-muted-foreground">{daysUntilDue}d away</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-3">
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-destructive">
                          You answered
                        </div>
                        <div className="font-sans font-semibold tabular-nums text-foreground">
                          {error.studentAnswer}
                        </div>
                      </div>
                      <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">
                          Correct answer
                        </div>
                        <div className="font-sans font-semibold tabular-nums text-foreground">
                          {error.correctAnswer}
                        </div>
                      </div>
                    </div>

                    <div className="surface-quiet rounded-lg p-3">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Why this matters
                      </div>
                      <p className="text-sm leading-relaxed text-foreground">{error.explanation}</p>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/25 p-3">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <ListChecks className="h-4 w-4" aria-hidden />
                        Suggested drills — {drillPack.title}
                      </div>
                      <ul className="list-inside list-disc space-y-1.5 text-sm text-foreground">
                        {drillPack.exercises.map((line, i) => (
                          <li key={i} className="leading-relaxed">
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-3">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Drill feedback
                      </div>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {(Object.keys(OUTCOME_META) as DrillOutcome[]).map((outcome) => (
                          <Button
                            key={outcome}
                            variant={error.lastOutcome === outcome ? 'default' : 'outline'}
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              setErrorLogEntryOutcome(error.id, outcome);
                              refresh();
                            }}
                          >
                            {OUTCOME_META[outcome].label}
                          </Button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Confidence:</span>
                        <select
                          value={error.confidence ?? 3}
                          onChange={(e) => {
                            setErrorLogEntryOutcome(error.id, error.lastOutcome ?? 'struggled', Number(e.target.value) as 1 | 2 | 3 | 4 | 5);
                            refresh();
                          }}
                          className="rounded-md border border-input bg-transparent px-2 py-1"
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              {n}/5
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {error.nextAction && (
                      <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">
                          Next action
                        </div>
                        <p className="text-sm leading-relaxed text-foreground">{error.nextAction}</p>
                      </div>
                    )}

                    {error.protocolElements && error.protocolElements.length > 0 && (
                      <div className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <Zap className="h-4 w-4" aria-hidden />
                          Learning concepts
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {error.protocolElements.map((el: string) => (
                            <Badge key={el} variant="outline" className="text-xs">
                              {el.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="italic">Source: {error.sourceReference}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2 border-t border-border pt-2 sm:grid-cols-2">
                      <Link href={`/coach?fromError=${encodeURIComponent(error.id)}`} className="min-w-0">
                        <Button variant="default" size="sm" className="w-full text-xs">
                          Discuss with coach
                        </Button>
                      </Link>
                      {!error.reviewed ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full min-w-0 text-xs"
                          onClick={() => {
                            setErrorLogEntryReviewed(error.id, true);
                            refresh();
                          }}
                        >
                          Mark reviewed
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full min-w-0 text-xs"
                          onClick={() => {
                            setErrorLogEntryReviewed(error.id, false);
                            refresh();
                          }}
                        >
                          Review again
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Card className="mt-page-section">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">How to use this log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {[
            {
              n: '1',
              title: 'Log the mistake',
              body: 'Problem, your answer, and mistake type — enough for drills + coach context.',
            },
            {
              n: '2',
              title: 'Run the suggested drills',
              body: 'Short, repeatable loops matched to the error category (and subtopic when relevant).',
            },
            {
              n: '3',
              title: 'Open the coach',
              body: 'The message is prefilled so you get protocol-style feedback and similar practice ideas.',
            },
          ].map((item) => (
            <div key={item.n} className="flex gap-3">
              <div className="min-w-[2rem] text-lg font-bold text-foreground">{item.n}</div>
              <div>
                <div className="font-semibold text-foreground">{item.title}</div>
                <div className="text-xs">{item.body}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
