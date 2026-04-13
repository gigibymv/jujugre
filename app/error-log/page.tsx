'use client';

import { PageShell } from '@/components/page-shell';
import { ContentHeader } from '@/components/content-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserPlan } from '@/components/user-plan-provider';
import type { ErrorCategory, QuantSubtopic, QuestionType, QuantTopic } from '@/lib/data-schema';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Clock, Zap, BookOpen } from 'lucide-react';
import { useRef, useState } from 'react';

export default function ErrorLogPage() {
  const { hasCompletedOnboarding, errorLogEntries, addErrorLogEntry, setErrorLogReviewed } = useUserPlan();
  const [sortBy, setSortBy] = useState<'review_due' | 'recent' | 'topic'>('review_due');
  const [filterReviewed, setFilterReviewed] = useState<'all' | 'unreviewed' | 'reviewed'>('unreviewed');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [newEntry, setNewEntry] = useState({
    topic: 'algebra_linear_equations',
    subtopic: 'solving_linear',
    errorCategory: 'conceptual_misunderstanding',
    questionType: 'multiple_choice_single',
    sourceReference: '',
    problem: '',
    studentAnswer: '',
    correctAnswer: '',
    explanation: '',
    protocolElements: '',
    reviewInDays: '2',
  });

  let filtered = errorLogEntries;
  if (filterReviewed === 'unreviewed') {
    filtered = filtered.filter((e) => !e.reviewed);
  } else if (filterReviewed === 'reviewed') {
    filtered = filtered.filter((e) => e.reviewed);
  }

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'review_due') {
      return a.reviewDueDate.getTime() - b.reviewDueDate.getTime();
    }
    if (sortBy === 'recent') {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }
    return a.topic.localeCompare(b.topic);
  });

  const unreviewedCount = errorLogEntries.filter((e) => !e.reviewed).length;
  const reviewDueNow = sorted.filter((e) => e.reviewDueDate <= new Date()).length;

  const categoryStats = errorLogEntries.reduce(
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

  const handleScreenshotSelect = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('Only image files are supported for screenshots.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setFormError('Screenshot too large. Max size is 4 MB.');
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('Failed to read screenshot file.'));
      reader.readAsDataURL(file);
    });
    setScreenshotDataUrl(dataUrl);
    setScreenshotFileName(file.name);
    setFormError(null);
  };

  const resetForm = () => {
    setNewEntry({
      topic: 'algebra_linear_equations',
      subtopic: 'solving_linear',
      errorCategory: 'conceptual_misunderstanding',
      questionType: 'multiple_choice_single',
      sourceReference: '',
      problem: '',
      studentAnswer: '',
      correctAnswer: '',
      explanation: '',
      protocolElements: '',
      reviewInDays: '2',
    });
    setScreenshotDataUrl(null);
    setScreenshotFileName(null);
    setFormError(null);
  };

  const handleAddError = async () => {
    if (!newEntry.problem.trim() || !newEntry.studentAnswer.trim() || !newEntry.correctAnswer.trim()) {
      setFormError('Problem, your answer, and correct answer are required.');
      return;
    }
    const reviewInDaysNumber = Number(newEntry.reviewInDays);
    if (!Number.isFinite(reviewInDaysNumber) || reviewInDaysNumber < 0 || reviewInDaysNumber > 30) {
      setFormError('Review delay must be between 0 and 30 days.');
      return;
    }
    setIsSaving(true);
    try {
      addErrorLogEntry({
        topic: newEntry.topic as QuantTopic,
        subtopic: newEntry.subtopic as QuantSubtopic,
        errorCategory: newEntry.errorCategory as ErrorCategory,
        questionType: newEntry.questionType as QuestionType,
        sourceReference: newEntry.sourceReference.trim() || 'Self-logged',
        problem: newEntry.problem.trim(),
        studentAnswer: newEntry.studentAnswer.trim(),
        correctAnswer: newEntry.correctAnswer.trim(),
        explanation: newEntry.explanation.trim() || 'Review this mistake and derive the governing rule.',
        protocolElements: newEntry.protocolElements
          .split(',')
          .map((el) => el.trim())
          .filter(Boolean),
        reviewInDays: reviewInDaysNumber,
        screenshotDataUrl: screenshotDataUrl ?? undefined,
        screenshotFileName: screenshotFileName ?? undefined,
      });
      resetForm();
      setIsFormOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to save this error entry.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageShell>
      <ContentHeader
        eyebrow="Review"
        title="Error log"
        description="Turn mistakes into reusable learning. Each error is a data point on your path."
      />

      <Card className="mb-page-block">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Add an error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!isFormOpen ? (
            <Button type="button" onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
              Add new error
            </Button>
          ) : (
            <form
              aria-label="Add error form"
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                void handleAddError();
              }}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label htmlFor="error-topic" className="text-xs text-muted-foreground">
                  Topic
                  <input
                    id="error-topic"
                    name="topic"
                    className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
                    value={newEntry.topic}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, topic: e.target.value }))}
                  />
                </label>
                <label htmlFor="error-subtopic" className="text-xs text-muted-foreground">
                  Subtopic
                  <input
                    id="error-subtopic"
                    name="subtopic"
                    className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
                    value={newEntry.subtopic}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, subtopic: e.target.value }))}
                  />
                </label>
                <label htmlFor="error-category" className="text-xs text-muted-foreground">
                  Error category
                  <input
                    id="error-category"
                    name="errorCategory"
                    className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
                    value={newEntry.errorCategory}
                    onChange={(e) =>
                      setNewEntry((prev) => ({ ...prev, errorCategory: e.target.value }))
                    }
                  />
                </label>
                <label htmlFor="error-question-type" className="text-xs text-muted-foreground">
                  Question type
                  <input
                    id="error-question-type"
                    name="questionType"
                    className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
                    value={newEntry.questionType}
                    onChange={(e) =>
                      setNewEntry((prev) => ({ ...prev, questionType: e.target.value }))
                    }
                  />
                </label>
              </div>

              <label htmlFor="error-source-reference" className="block text-xs text-muted-foreground">
                Source
                <input
                  id="error-source-reference"
                  name="sourceReference"
                  className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
                  value={newEntry.sourceReference}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, sourceReference: e.target.value }))}
                />
              </label>
              <label htmlFor="error-problem" className="block text-xs text-muted-foreground">
                Problem statement
                <textarea
                  id="error-problem"
                  name="problem"
                  className="mt-1 min-h-20 w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
                  value={newEntry.problem}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, problem: e.target.value }))}
                />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label htmlFor="error-student-answer" className="text-xs text-muted-foreground">
                  Your answer
                  <input
                    id="error-student-answer"
                    name="studentAnswer"
                    className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
                    value={newEntry.studentAnswer}
                    onChange={(e) =>
                      setNewEntry((prev) => ({ ...prev, studentAnswer: e.target.value }))
                    }
                  />
                </label>
                <label htmlFor="error-correct-answer" className="text-xs text-muted-foreground">
                  Correct answer
                  <input
                    id="error-correct-answer"
                    name="correctAnswer"
                    className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
                    value={newEntry.correctAnswer}
                    onChange={(e) =>
                      setNewEntry((prev) => ({ ...prev, correctAnswer: e.target.value }))
                    }
                  />
                </label>
              </div>
              <label htmlFor="error-explanation" className="block text-xs text-muted-foreground">
                Explanation
                <textarea
                  id="error-explanation"
                  name="explanation"
                  className="mt-1 min-h-20 w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
                  value={newEntry.explanation}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, explanation: e.target.value }))}
                />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label htmlFor="error-protocol-elements" className="text-xs text-muted-foreground">
                  Learning concepts (comma separated)
                  <input
                    id="error-protocol-elements"
                    name="protocolElements"
                    className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
                    value={newEntry.protocolElements}
                    onChange={(e) =>
                      setNewEntry((prev) => ({ ...prev, protocolElements: e.target.value }))
                    }
                  />
                </label>
                <label htmlFor="error-review-days" className="text-xs text-muted-foreground">
                  Review in days (0-30)
                  <input
                    id="error-review-days"
                    name="reviewInDays"
                    type="number"
                    min={0}
                    max={30}
                    className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
                    value={newEntry.reviewInDays}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, reviewInDays: e.target.value }))}
                  />
                </label>
              </div>

              <div className="rounded-md border border-border bg-muted/20 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-foreground">Screenshot (optional)</p>
                  {screenshotDataUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setScreenshotDataUrl(null);
                        setScreenshotFileName(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  id="error-screenshot"
                  name="screenshot"
                  type="file"
                  accept="image/*"
                  className="text-xs"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    void handleScreenshotSelect(file);
                  }}
                />
                {screenshotFileName && (
                  <p className="mt-2 text-xs text-muted-foreground">Selected: {screenshotFileName}</p>
                )}
                {screenshotDataUrl && (
                  <img
                    src={screenshotDataUrl}
                    alt="Screenshot preview"
                    className="mt-3 max-h-40 rounded-md border border-border object-contain"
                  />
                )}
              </div>

              {formError && (
                <p className="text-sm text-destructive" role="alert">
                  {formError}
                </p>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving…' : 'Save error'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsFormOpen(false);
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="mb-page-section grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="page-eyebrow">Total errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-foreground">{errorLogEntries.length}</div>
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
              {errorLogEntries.filter((e) => e.reviewed).length}
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
            Reviewed ({errorLogEntries.filter((e) => e.reviewed).length})
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
            onChange={(e) => setSortBy(e.target.value as 'review_due' | 'recent' | 'topic')}
            className="rounded-md border-0 bg-transparent px-3 py-2 text-xs text-foreground"
          >
            <option value="review_due">Review due (priority)</option>
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
                {hasCompletedOnboarding ? 'No errors logged yet' : 'No error log yet'}
              </p>
              <p className="text-sm text-muted-foreground">
                {hasCompletedOnboarding
                  ? 'When you add mistakes, they will appear here for spaced review.'
                  : 'Complete onboarding and start practicing to build your error log.'}
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
            const isReviewDue = error.reviewDueDate <= new Date();
            const daysUntilDue = Math.ceil(
              (error.reviewDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );

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
                            {error.errorCategory.replace(/_/g, ' ')}
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

                    {error.screenshotDataUrl && (
                      <div className="rounded-lg border border-border bg-muted/20 p-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Screenshot
                        </p>
                        <img
                          src={error.screenshotDataUrl}
                          alt={error.screenshotFileName || 'Attached screenshot'}
                          className="max-h-56 rounded-md border border-border object-contain"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-2 border-t border-border pt-2 sm:grid-cols-2">
                      {!error.reviewed && (
                        <>
                          <Link href={`/coach?error=${error.id}`} className="min-w-0">
                            <Button variant="default" size="sm" className="w-full text-xs">
                              Discuss with coach
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full min-w-0 text-xs"
                            onClick={() => setErrorLogReviewed(error.id, true)}
                          >
                            Mark reviewed
                          </Button>
                        </>
                      )}
                      {error.reviewed && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs sm:col-span-2"
                          onClick={() => setErrorLogReviewed(error.id, false)}
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
              title: 'Review errors due',
              body: 'Prioritize items marked “due now” for the biggest learning impact.',
            },
            {
              n: '2',
              title: 'Discuss with coach',
              body: 'Use the coach to understand the concept behind each mistake.',
            },
            {
              n: '3',
              title: 'Practice similar problems',
              body: 'Drill until the pattern feels automatic.',
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
