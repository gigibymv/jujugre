'use client';

import { useUserPlan } from '@/components/user-plan-provider';
import { PageShell } from '@/components/page-shell';
import { ContentHeader } from '@/components/content-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import type { QuantSubtopic } from '@/lib/data-schema';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import { useMemo } from 'react';

function buildLogMistakeHref(opts: {
  weekNumber: number;
  moduleTitle: string;
  taskTitle: string;
  taskDescription?: string;
  subtopic: QuantSubtopic;
}): string {
  const source = `Study plan · Week ${opts.weekNumber} · ${opts.moduleTitle} · ${opts.taskTitle}`;
  const sp = new URLSearchParams();
  sp.set('new', '1');
  sp.set('subtopic', opts.subtopic);
  sp.set('source', source);
  if (opts.taskDescription?.trim()) {
    sp.set('problem', opts.taskDescription.trim().slice(0, 800));
  }
  return `/error-log?${sp.toString()}`;
}

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = typeof params.moduleId === 'string' ? params.moduleId : '';
  const { studyPlan, setTaskCompleted, hydrated } = useUserPlan();

  const module = useMemo(
    () => studyPlan.modules.find((m) => m.id === moduleId),
    [studyPlan.modules, moduleId]
  );

  if (!hydrated) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-surface-canvas text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!module) {
    return (
      <PageShell narrow>
        <p className="mb-4 text-foreground">Module not found.</p>
        <Button variant="outline" onClick={() => router.push('/study-plan')}>
          Back to study plan
        </Button>
      </PageShell>
    );
  }

  const allTasks = module.parts.flatMap((p) => p.tasks);
  const done = allTasks.filter((t) => t.completed).length;
  const pct = allTasks.length ? (done / allTasks.length) * 100 : 0;
  const isCurrent = studyPlan.currentModuleId === module.id;

  return (
    <PageShell narrow>
      <Link
        href="/study-plan"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Study plan
      </Link>

      <ContentHeader eyebrow="Module">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
            Week {module.weekNumber}: {module.title}
          </h1>
          {isCurrent && <Badge>Current</Badge>}
        </div>
        <p className="text-muted-foreground">{module.description}</p>
        <div className="mt-4 max-w-md space-y-2">
          <div className="flex justify-between text-sm text-foreground">
            <span>Module progress</span>
            <span className="tabular-nums">{Math.round(pct)}%</span>
          </div>
          <Progress value={pct} />
        </div>
      </ContentHeader>

      <div className="space-y-6">
        {module.parts.map((part) => (
          <Card key={part.id}>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Part {part.partNumber}: {part.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                ~{part.estimatedHours ?? 0} h · {part.tasks.length} tasks
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-4">
              {part.tasks.map((task) => {
                const subtopic = (part.subtopics[0] ?? 'factors_multiples_divisibility') as QuantSubtopic;
                const logHref = buildLogMistakeHref({
                  weekNumber: module.weekNumber,
                  moduleTitle: module.title,
                  taskTitle: task.title,
                  taskDescription: task.description,
                  subtopic,
                });
                return (
                  <div
                    key={task.id}
                    className="surface-quiet flex w-full flex-col gap-3 p-3 transition-colors duration-150 ease-out hover:bg-muted/50 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={(v) => setTaskCompleted(task.id, v === true)}
                        className="mt-0.5"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {task.completed ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" aria-hidden />
                          )}
                          <span className="text-sm font-medium text-foreground">{task.title}</span>
                        </div>
                        {task.description && (
                          <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          ~{task.estimatedMinutes} min · {task.taskType}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 sm:pt-0.5">
                      <Link
                        href={logHref}
                        className="text-xs font-medium text-accent underline-offset-4 hover:underline"
                      >
                        Log mistake
                      </Link>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/">
          <Button variant="outline" className="w-full sm:w-auto">
            Dashboard
          </Button>
        </Link>
      </div>
    </PageShell>
  );
}
