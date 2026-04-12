'use client';

import { useUserPlan } from '@/components/user-plan-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import { useMemo } from 'react';

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
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center text-[#a89d94] text-sm">
        Loading…
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-[#faf8f3] px-6 py-10 max-w-2xl mx-auto">
        <p className="text-[#3d2f3f] mb-4">Module not found.</p>
        <Button variant="outline" onClick={() => router.push('/study-plan')}>
          Back to study plan
        </Button>
      </div>
    );
  }

  const allTasks = module.parts.flatMap((p) => p.tasks);
  const done = allTasks.filter((t) => t.completed).length;
  const pct = allTasks.length ? (done / allTasks.length) * 100 : 0;
  const isCurrent = studyPlan.currentModuleId === module.id;

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          href="/study-plan"
          className="inline-flex items-center gap-2 text-sm text-[#a89d94] hover:text-[#3d2f3f] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Study plan
        </Link>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-3xl font-light text-[#3d2f3f]">
              Week {module.weekNumber}: {module.title}
            </h1>
            {isCurrent && <Badge className="bg-[#3d2f3f] text-white">Current</Badge>}
          </div>
          <p className="text-[#a89d94]">{module.description}</p>
          <div className="mt-4 space-y-2 max-w-md">
            <div className="flex justify-between text-sm text-[#3d2f3f]">
              <span>Module progress</span>
              <span>{Math.round(pct)}%</span>
            </div>
            <Progress value={pct} className="h-2 bg-[#ede8df]" />
          </div>
        </div>

        <div className="space-y-6">
          {module.parts.map((part) => (
            <Card key={part.id} className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-2 border-b border-[#e8e3db]">
                <CardTitle className="text-base font-semibold text-[#3d2f3f]">
                  Part {part.partNumber}: {part.title}
                </CardTitle>
                <p className="text-xs text-[#a89d94]">
                  ~{part.estimatedHours ?? 0} h · {part.tasks.length} tasks
                </p>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {part.tasks.map((task) => (
                  <label
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-[#e8e3db] bg-[#faf8f3]/80 cursor-pointer hover:bg-[#f5f1e8] transition-colors"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(v) => setTaskCompleted(task.id, v === true)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#7a8d7e] shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#d4ccc3] shrink-0" />
                        )}
                        <span className="font-medium text-sm text-[#3d2f3f]">{task.title}</span>
                      </div>
                      {task.description && (
                        <p className="text-xs text-[#a89d94] mt-1 ml-6">{task.description}</p>
                      )}
                      <p className="text-xs text-[#a89d94] mt-1 ml-6">
                        ~{task.estimatedMinutes} min · {task.taskType}
                      </p>
                    </div>
                  </label>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex gap-3">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full border-[#d4ccc3]">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
