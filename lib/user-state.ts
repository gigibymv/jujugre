import type { QuantTopic, StudyPlan, UserProfile } from '@/lib/data-schema';
import { DEFAULT_USER_PROFILE } from '@/lib/default-user-profile';
import { buildStudyPlanFromCurriculum } from '@/lib/study-plan-curriculum';

export { computeDaysRemaining } from '@/lib/date-utils';
export { applyTaskCompletion } from '@/lib/study-plan-utils';

export const USER_STATE_STORAGE_KEY = 'jujugre-user-state-v1';

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
  localStorage.removeItem(USER_STATE_STORAGE_KEY);
}

export function mergeUserProfile(persisted: PersistedUserStateV1 | null): UserProfile {
  if (!persisted) return { ...DEFAULT_USER_PROFILE };
  return {
    ...DEFAULT_USER_PROFILE,
    startDate: new Date(persisted.studyStartDate),
    targetGREDate: new Date(persisted.targetGREDate),
    weeklyHoursTarget: persisted.weeklyHoursTarget,
    weakAreasFromOnboarding: [...persisted.weakAreasFromOnboarding],
  };
}

export function buildStudyPlanForUser(
  user: UserProfile,
  taskCompletion: Record<string, boolean> = {}
): StudyPlan {
  return buildStudyPlanFromCurriculum(user, taskCompletion);
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
