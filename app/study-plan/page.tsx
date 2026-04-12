'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUserPlan } from '@/components/user-plan-provider';
import Link from 'next/link';
import { CheckCircle2, Circle, Zap, AlertCircle, Calendar } from 'lucide-react';

export default function StudyPlanPage() {
  const { studyPlan: plan, hydrated } = useUserPlan();
  const daysRemaining = plan.daysRemaining;
  const weeksCompleted = plan.currentWeekNumber - 1;
  const modules = plan.modules;
  const totalWeeks = modules.length;
  const progressPercent = (weeksCompleted / totalWeeks) * 100;

  // Group modules by phase: Foundation (Weeks 1-12) and Testing & Strategy (Weeks 13-16)
  const modulesGrouped = {
    foundation: modules.slice(0, 12),
    testing_strategy: modules.slice(12, 16),
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center text-[#a89d94] text-sm">
        Loading…
      </div>
    );
  }

  const renderModuleStatus = (module: any) => {
    const isCompleted = module.weekNumber < plan.currentWeekNumber;
    const isCurrent = module.id === plan.currentModuleId;
    
    if (isCompleted) return { icon: CheckCircle2, color: "text-[#7a8d7e]", bg: "bg-[#f5f1e8]" };
    if (isCurrent) return { icon: Zap, color: "text-[#a88080]", bg: "bg-[#f5f1e8]" };
    return { icon: Circle, color: "text-[#d4ccc3]", bg: "bg-[#ede8df]" };
  };

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        
        {/* Header Section */}
        <div className="mb-10 pb-6 border-b border-[#e8e3db]">
          <h1 className="text-4xl font-light text-[#3d2f3f] mb-2">Study Plan</h1>
          <p className="text-[#a89d94]">
            GregMat "I'm Overwhelmed" • 4-month foundation + strategy
          </p>
        </div>

        {/* Lateness Alert */}
        {plan.latenessState !== "on_track" && (
          <Card className="border-0 shadow-sm bg-[#f5f1e8] mb-8 border-l-4 border-l-[#a88080]">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#a88080] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#a88080]">You're slightly behind schedule</p>
                  <p className="text-sm text-[#8a7d74] mt-1">
                    Recovery deadline: <strong>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                  </p>
                  <p className="text-xs text-[#a88080] mt-2">Complete 1 module this week to recover.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overall Progress Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="border-0 shadow-sm bg-[#ede8df]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-[#a89d94] uppercase tracking-wide">Weeks Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#3d2f3f]">{weeksCompleted}</div>
              <div className="text-xs text-[#a89d94] mt-1">of {totalWeeks} weeks</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-[#ede8df]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-[#a89d94] uppercase tracking-wide">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#3d2f3f]">{Math.round(progressPercent)}%</div>
              <Progress value={progressPercent} className="h-1.5 mt-2" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-[#ede8df]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-[#a89d94] uppercase tracking-wide">Days to GRE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#3d2f3f]">{daysRemaining}</div>
              <div className="text-xs text-[#a89d94] mt-1">
                {plan.targetGREDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-[#ede8df]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-[#a89d94] uppercase tracking-wide">Current Phase</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold text-[#3d2f3f]">
                {plan.currentWeekNumber <= 12 ? 'Foundation' : 'Testing & Strategy'}
              </div>
              <div className="text-xs text-[#a89d94] mt-1">Month {Math.ceil(plan.currentWeekNumber / 4)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Module Roadmap */}
        <div className="space-y-10">
          {Object.entries(modulesGrouped).map(([phase, modules]) => {
            const phaseLabel = phase === 'foundation' 
              ? 'Foundation Phase: Core Concepts (Months 1-3)'
              : 'Testing & Strategy Phase: Practice & Refinement (Month 4)';

            const phaseWeeks = phase === 'foundation'
              ? 'Weeks 1-12'
              : 'Weeks 13-16';

            return (
              <div key={phase}>
                <div className="mb-4 pb-3 border-b border-[#e8e3db]">
                  <h2 className="text-lg font-semibold text-[#3d2f3f]">{phaseLabel}</h2>
                  <p className="text-sm text-[#a89d94] mt-1">{phaseWeeks}</p>
                </div>

                <div className="grid gap-3">
                  {modules.map((module) => {
                    const status = renderModuleStatus(module);
                    const StatusIcon = status.icon;
                    const isCompleted = module.weekNumber < plan.currentWeekNumber;
                    const isCurrent = module.id === plan.currentModuleId;

                    return (
                      <Link key={module.id} href={`/study-plan/${module.id}`}>
                        <Card className={`border-0 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                          isCurrent 
                            ? 'ring-2 ring-[#7a8d7e] bg-[#f5f1e8]' 
                            : isCompleted 
                            ? 'bg-[#f5f1e8]/30' 
                            : 'bg-white hover:bg-[#f5f1e8]'
                        }`}>
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-4">
                              <div className={`flex-shrink-0 ${status.color}`}>
                                <StatusIcon className="w-6 h-6" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className={`font-semibold text-sm ${
                                    isCompleted ? 'text-[#a89d94] line-through' : 'text-[#3d2f3f]'
                                  }`}>
                                    Week {module.weekNumber}: {module.title}
                                  </h3>
                                  {isCurrent && <Badge className="text-xs bg-[#3d2f3f] text-white">Current</Badge>}
                                  {isCompleted && <Badge variant="outline" className="text-xs border-[#e8e3db] text-[#a89d94]">Done</Badge>}
                                </div>
                                <p className="text-xs text-[#a89d94]">{module.description}</p>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-xs text-[#a89d94]">{module.parts.length} parts</span>
                                  <span className="text-xs text-[#a89d94]">•</span>
                                  <span className="text-xs text-[#a89d94]">
                                    {module.parts.reduce((sum, p) => sum + (p.estimatedHours || 0), 0).toFixed(1)} hours
                                  </span>
                                </div>
                              </div>

                              <div className="flex-shrink-0">
                                <ChevronRight className="w-5 h-5 text-[#d4ccc3]" />
                              </div>
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

        {/* Next Steps */}
        <Card className="border-0 shadow-sm bg-[#f5f1e8] mt-10">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#3d2f3f] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#7a8d7e]" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-[#3d2f3f]">
                You're currently on <strong>Week {plan.currentWeekNumber}</strong>. Complete all 4 parts of the current module to move forward.
              </p>
              <div className="flex gap-3">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full border-[#e8e3db] text-[#3d2f3f] hover:bg-[#ede8df]">Back to Dashboard</Button>
                </Link>
                <Button asChild className="flex-1 bg-[#3d2f3f] hover:bg-[#5a4a5c] text-white">
                  <Link href={`/study-plan/${plan.currentModuleId}`}>Continue Studying</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const ChevronRight = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
