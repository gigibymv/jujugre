import type { QuantTopic, StudyPlan, UserProfile } from '@/lib/data-schema';
import { mockStudyPlan, mockUserProfile } from '@/lib/mock-data';

export const USER_STATE_STORAGE_KEY = 'jujugre-user-state-v1';
const USER_STORAGE_PREFIX = 'jujugre-';
const LEGACY_STORAGE_KEYS = [
  'jujugre-user-state',
  'jujugre-user-plan',
  'jujugre-study-progress',
  'jujugre-progress',
  'jujugre-onboarding',
  'jujugre-onboarding-state',
] as const;

export type PersistedUserStateV1 = {
  version: 1;
  studyStartDate: string;
  targetGREDate: string;
  weeklyHoursTarget: number;
  weakAreasFromOnboarding: QuantTopic[];
  onboardingCompletedAt: string;
  taskCompletion: Record<string, boolean>;
};

export const WEAK_AREA_LABEL_TO_TOPIC: Record<string, QuantTopic> = {
  Fractions: 'arithmetic_fractions',
  Algebra: 'algebra_linear_equations',
  Geometry: 'geometry_circles',
  'Data Analysis': 'data_analysis_statistics',
  Probability: 'data_analysis_probability',
};

/** Labels shown in onboarding / settings (same order as onboarding UI). */
export const ONBOARDING_WEAK_AREA_LABELS = [
  'Fractions',
  'Algebra',
  'Geometry',
  'Data Analysis',
  'Probability',
] as const;

export function toDateInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function weakTopicsToLabels(topics: QuantTopic[]): string[] {
  const labels: string[] = [];
  for (const t of topics) {
    const entry = (Object.entries(WEAK_AREA_LABEL_TO_TOPIC) as [string, QuantTopic][]).find(
      ([, v]) => v === t
    );
    if (entry) labels.push(entry[0]);
  }
  return [...new Set(labels)];
}

export function computeDaysRemaining(targetGREDate: Date): number {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(targetGREDate);
  end.setHours(0, 0, 0, 0);
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function isPersistedV1(raw: unknown): raw is PersistedUserStateV1 {
  if (!raw || typeof raw !== 'object') return false;
  const o = raw as Record<string, unknown>;
  return (
    o.version === 1 &&
    typeof o.studyStartDate === 'string' &&
    typeof o.targetGREDate === 'string' &&
    typeof o.weeklyHoursTarget === 'number' &&
    Array.isArray(o.weakAreasFromOnboarding) &&
    typeof o.onboardingCompletedAt === 'string' &&
    o.taskCompletion !== null &&
    typeof o.taskCompletion === 'object'
  );
}

export function loadPersistedState(): PersistedUserStateV1 | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_STATE_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isPersistedV1(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function savePersistedState(state: PersistedUserStateV1): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_STATE_STORAGE_KEY, JSON.stringify(state));
}

export function clearPersistedState(): void {
  if (typeof window === 'undefined') return;
  const keysToRemove = new Set<string>([USER_STATE_STORAGE_KEY, ...LEGACY_STORAGE_KEYS]);
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (key.startsWith(USER_STORAGE_PREFIX)) {
      keysToRemove.add(key);
    }
  }
  for (const key of keysToRemove) {
    localStorage.removeItem(key);
  }
}

export function isUserStorageKey(key: string | null): boolean {
  if (!key) return false;
  if (key === USER_STATE_STORAGE_KEY) return true;
  if (LEGACY_STORAGE_KEYS.includes(key as (typeof LEGACY_STORAGE_KEYS)[number])) return true;
  return key.startsWith(USER_STORAGE_PREFIX);
}

export function mergeUserProfile(persisted: PersistedUserStateV1 | null): UserProfile {
  if (!persisted) return { ...mockUserProfile };
  return {
    ...mockUserProfile,
    startDate: new Date(persisted.studyStartDate),
    targetGREDate: new Date(persisted.targetGREDate),
    weeklyHoursTarget: persisted.weeklyHoursTarget,
    weakAreasFromOnboarding: [...persisted.weakAreasFromOnboarding],
  };
}

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

export function buildStudyPlanForUser(user: UserProfile): StudyPlan {
  const plan = structuredClone(mockStudyPlan) as StudyPlan;
  plan.startDate = user.startDate;
  plan.targetGREDate = user.targetGREDate;
  plan.daysRemaining = computeDaysRemaining(user.targetGREDate);
  return plan;
}

export function patchPersistedPlanSettings(
  prev: PersistedUserStateV1,
  patch: {
    targetGREDate?: string;
    studyStartDate?: string;
    weeklyHoursTarget?: number;
    weakAreaLabels?: string[];
  }
): PersistedUserStateV1 {
  const weakAreasFromOnboarding =
    patch.weakAreaLabels !== undefined
      ? patch.weakAreaLabels
          .map((label) => WEAK_AREA_LABEL_TO_TOPIC[label])
          .filter((t): t is QuantTopic => t !== undefined)
      : prev.weakAreasFromOnboarding;
  return {
    ...prev,
    targetGREDate: patch.targetGREDate ?? prev.targetGREDate,
    studyStartDate: patch.studyStartDate ?? prev.studyStartDate,
    weeklyHoursTarget: patch.weeklyHoursTarget ?? prev.weeklyHoursTarget,
    weakAreasFromOnboarding,
  };
}

export function createInitialPersistedState(params: {
  targetGREDate: string;
  weeklyHoursTarget: number;
  weakAreaLabels: string[];
}): PersistedUserStateV1 {
  const now = new Date().toISOString();
  const weakAreasFromOnboarding = params.weakAreaLabels
    .map((label) => WEAK_AREA_LABEL_TO_TOPIC[label])
    .filter((t): t is QuantTopic => t !== undefined);
  return {
    version: 1,
    studyStartDate: now,
    targetGREDate: params.targetGREDate,
    weeklyHoursTarget: params.weeklyHoursTarget,
    weakAreasFromOnboarding,
    onboardingCompletedAt: now,
    taskCompletion: {},
  };
}
