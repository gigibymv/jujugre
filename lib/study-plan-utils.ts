import type { StudyPlan } from '@/lib/data-schema';

export function applyTaskCompletion(
  plan: StudyPlan,
  taskCompletion: Record<string, boolean>
): StudyPlan {
  if (Object.keys(taskCompletion).length === 0) return plan;
  const next = structuredClone(plan) as StudyPlan;
  for (const mod of next.modules) {
    for (const part of mod.parts) {
      for (const task of part.tasks) {
        if (taskCompletion[task.id] !== undefined) {
          task.completed = taskCompletion[task.id];
        }
      }
    }
  }
  return next;
}
