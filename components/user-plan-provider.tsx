'use client';

import {
  applyTaskCompletion,
  buildStudyPlanForUser,
  clearPersistedState,
  createInitialPersistedState,
  loadPersistedState,
  mergeUserProfile,
  savePersistedState,
  type PersistedUserStateV1,
} from '@/lib/user-state';
import type { StudyPlan, UserProfile } from '@/lib/data-schema';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type UserPlanContextValue = {
  hydrated: boolean;
  user: UserProfile;
  studyPlan: StudyPlan;
  hasCompletedOnboarding: boolean;
  completeOnboarding: (input: {
    targetGREDate: string;
    weeklyHoursTarget: number;
    weakAreaLabels: string[];
  }) => void;
  setTaskCompleted: (taskId: string, completed: boolean) => void;
  resetLocalState: () => void;
};

const UserPlanContext = createContext<UserPlanContextValue | null>(null);

export function UserPlanProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<PersistedUserStateV1 | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPersisted(loadPersistedState());
    setHydrated(true);
  }, []);

  const user = useMemo(() => mergeUserProfile(persisted), [persisted]);

  const studyPlan = useMemo(() => {
    const base = buildStudyPlanForUser(user);
    return applyTaskCompletion(base, persisted?.taskCompletion ?? {});
  }, [user, persisted?.taskCompletion]);

  const completeOnboarding = useCallback(
    (input: {
      targetGREDate: string;
      weeklyHoursTarget: number;
      weakAreaLabels: string[];
    }) => {
      const next = createInitialPersistedState(input);
      savePersistedState(next);
      setPersisted(next);
    },
    []
  );

  const setTaskCompleted = useCallback((taskId: string, completed: boolean) => {
    setPersisted((prev) => {
      const fallbackUser = mergeUserProfile(null);
      const base: PersistedUserStateV1 =
        prev ?? {
          version: 1,
          studyStartDate: fallbackUser.startDate.toISOString(),
          targetGREDate: fallbackUser.targetGREDate.toISOString(),
          weeklyHoursTarget: fallbackUser.weeklyHoursTarget,
          weakAreasFromOnboarding: [...fallbackUser.weakAreasFromOnboarding],
          onboardingCompletedAt: new Date().toISOString(),
          taskCompletion: {},
        };
      const next: PersistedUserStateV1 = {
        ...base,
        taskCompletion: { ...base.taskCompletion, [taskId]: completed },
      };
      savePersistedState(next);
      return next;
    });
  }, []);

  const resetLocalState = useCallback(() => {
    clearPersistedState();
    setPersisted(null);
  }, []);

  const value = useMemo(
    () => ({
      hydrated,
      user,
      studyPlan,
      hasCompletedOnboarding: Boolean(persisted?.onboardingCompletedAt),
      completeOnboarding,
      setTaskCompleted,
      resetLocalState,
    }),
    [
      hydrated,
      user,
      studyPlan,
      persisted?.onboardingCompletedAt,
      completeOnboarding,
      setTaskCompleted,
      resetLocalState,
    ]
  );

  return (
    <UserPlanContext.Provider value={value}>{children}</UserPlanContext.Provider>
  );
}

export function useUserPlan(): UserPlanContextValue {
  const ctx = useContext(UserPlanContext);
  if (!ctx) {
    throw new Error('useUserPlan must be used within UserPlanProvider');
  }
  return ctx;
}
