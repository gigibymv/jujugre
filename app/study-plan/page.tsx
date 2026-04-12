'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PageShell } from '@/components/page-shell';
import { useUserPlan } from '@/components/user-plan-provider';
import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  Zap,
  AlertCircle,
  Calendar,
  ChevronRight,
} from 'lucide-react';

export default function StudyPlanPage() {
  const { studyPlan: plan, hydrated } = useUserPlan();
  const daysRemaining = plan.daysRemaining;
  const weeksCompleted = plan.currentWeekNumber - 1;
  const modules = plan.modules;
  const totalWeeks = modules.length;
  const progressPercent = (weeksCompleted / totalWeeks) * 100;

  const modulesGrouped = {
    foundation: modules.slice(0, 12),
    testing_strategy: modules.slice(12, 16),
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-muted text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  const renderModuleStatus = (module: { weekNumber: number; id: string }) => {
    const isCompleted = module.weekNumber < plan.currentWeekNumber;
    const isCurrent = module.id === plan.currentModuleId;

    if (isCompleted) return { icon: CheckCircle2, color: 'text-accent', bg: 'bg-secondary' };
    if (isCurrent) return { icon: Zap, color: 'text-accent', bg: 'bg-secondary' };
    return { icon: Circle, color: 'text-muted-foreground/50', bg: 'bg-muted/50' };
  };

  return (
    <PageShell>
      <header className="mb-page-section border-b border-border pb-8">
        <p className="page-eyebrow mb-2">Plan</p>
        <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground md:text-4xl">
          Study plan
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          GregMat &ldquo;I&apos;m Overwhelmed&rdquo; · foundation + strategy block
        </p>
      </header>

      {plan.latenessState !== 'on_track' && (
        <Card className="mb-page-block border-l-[3px] border-l-destructive bg-secondary/60">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden />
              <div>
                <p className="font-semibold text-destructive">Slightly behind schedule</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recovery target:{' '}
                  <strong>
                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </strong>
                </p>
                <p className="mt-2 text-xs text-destructive">Finish one module this week to recover.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-page-section grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
        <Card className="bg-secondary/40">
          <CardHeader>
            <CardTitle className="page-eyebrow">Weeks completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-serif text-3xl font-medium tabular-nums text-foreground">
              {weeksCompleted}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">of {totalWeeks} weeks</div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/40">
          <CardHeader>
            <CardTitle className="page-eyebrow">Overall progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-serif text-3xl font-medium tabular-nums text-foreground">
              {Math.round(progressPercent)}%
            </div>
            <Progress value={progressPercent} className="mt-2 h-1.5 bg-muted" />
          </CardContent>
        </Card>

        <Card className="bg-secondary/40">
          <CardHeader>
            <CardTitle className="page-eyebrow">Days to GRE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-serif text-3xl font-medium tabular-nums text-foreground">
              {daysRemaining}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {plan.targetGREDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/40">
          <CardHeader>
            <CardTitle className="page-eyebrow">Current phase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold text-foreground">
              {plan.currentWeekNumber <= 12 ? 'Foundation' : 'Testing & strategy'}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Month {Math.ceil(plan.currentWeekNumber / 4)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-10">
        {Object.entries(modulesGrouped).map(([phase, phaseModules]) => {
          const phaseLabel =
            phase === 'foundation'
              ? 'Foundation: core concepts (months 1–3)'
              : 'Testing & strategy: practice and refinement (month 4)';

          const phaseWeeks = phase === 'foundation' ? 'Weeks 1–12' : 'Weeks 13–16';

          return (
            <div key={phase}>
              <div className="mb-4 border-b border-border pb-3">
                <h2 className="text-lg font-semibold text-foreground">{phaseLabel}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{phaseWeeks}</p>
              </div>

              <div className="grid gap-3">
                {phaseModules.map((module) => {
                  const status = renderModuleStatus(module);
                  const StatusIcon = status.icon;
                  const isCompleted = module.weekNumber < plan.currentWeekNumber;
                  const isCurrent = module.id === plan.currentModuleId;

                  return (
                    <Link key={module.id} href={`/study-plan/${module.id}`}>
                      <Card
                        className={`cursor-pointer transition-colors duration-150 ease-out ${
                          isCurrent
                            ? 'border-accent/50 bg-secondary ring-1 ring-accent/25'
                            : isCompleted
                              ? 'bg-secondary/40 opacity-90'
                              : 'hover:bg-secondary/50'
                        }`}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-4">
                            <div className={`shrink-0 ${status.color}`}>
                              <StatusIcon className="h-6 w-6" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex flex-wrap items-center gap-2">
                                <h3
                                  className={`text-sm font-semibold ${
                                    isCompleted
                                      ? 'text-muted-foreground line-through'
                                      : 'text-foreground'
                                  }`}
                                >
                                  Week {module.weekNumber}: {module.title}
                                </h3>
                                {isCurrent && (
                                  <Badge className="text-xs">Current</Badge>
                                )}
                                {isCompleted && (
                                  <Badge variant="outline" className="text-xs font-normal">
                                    Done
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{module.description}</p>
                              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{module.parts.length} parts</span>
                                <span aria-hidden>·</span>
                                <span>
                                  {module.parts
                                    .reduce((sum, p) => sum + (p.estimatedHours || 0), 0)
                                    .toFixed(1)}{' '}
                                  hours
                                </span>
                              </div>
                            </div>

                            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/40" aria-hidden />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Card className="mt-page-section bg-secondary/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Calendar className="h-5 w-5 text-accent" aria-hidden />
            Next steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-foreground">
              You are on <strong>week {plan.currentWeekNumber}</strong>. Finish all four parts of the
              current module to advance.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to dashboard
                </Button>
              </Link>
              <Button asChild className="flex-1">
                <Link href={`/study-plan/${plan.currentModuleId}`}>Continue studying</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
