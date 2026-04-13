'use client';

import {
  applyTaskCompletion,
  buildStudyPlanForUser,
  clearPersistedState,
  createInitialPersistedState,
  isUserStorageKey,
  loadPersistedState,
  mergeUserProfile,
  patchPersistedPlanSettings,
  savePersistedState,
  type PersistedUserStateV1,
} from '@/lib/user-state';
import {
  createEmptyUserAnalyticsState,
  loadPersistedAnalytics,
  type UserAnalyticsState,
} from '@/lib/user-analytics';
import type { DailyCheckIn, ErrorLogEntry, StudyPlan, TopicMastery, UserProfile } from '@/lib/data-schema';
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
  /** Raw saved state (null after full reset or first visit). Exposed for settings sync. */
  persisted: PersistedUserStateV1 | null;
  user: UserProfile;
  studyPlan: StudyPlan;
  topicMastery: TopicMastery[];
  dailyCheckIns: DailyCheckIn[];
  errorLogEntries: ErrorLogEntry[];
  hasCompletedOnboarding: boolean;
  completeOnboarding: (input: {
    targetGREDate: string;
    weeklyHoursTarget: number;
    weakAreaLabels: string[];
  }) => void;
  setTaskCompleted: (taskId: string, completed: boolean) => void;
  /** Clears task checkmarks only; keeps dates, weak areas, onboarding. */
  clearStudyProgress: () => void;
  updatePlanSettings: (input: {
    targetGREDate?: string;
    studyStartDate?: string;
    weeklyHoursTarget?: number;
    weakAreaLabels?: string[];
  }) => void;
  resetLocalState: () => void;
};

const UserPlanContext = createContext<UserPlanContextValue | null>(null);

export function UserPlanProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<PersistedUserStateV1 | null>(null);
  const [analytics, setAnalytics] = useState<UserAnalyticsState>(
    createEmptyUserAnalyticsState
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPersisted(loadPersistedState());
    setAnalytics(loadPersistedAnalytics());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onStorage = (event: StorageEvent) => {
      // Keep all open tabs in sync after updates or hard resets.
      if (event.storageArea !== window.localStorage) return;
      if (event.key !== null && !isUserStorageKey(event.key)) return;
      setPersisted(loadPersistedState());
      setAnalytics(loadPersistedAnalytics());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
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

  const clearStudyProgress = useCallback(() => {
    setPersisted((prev) => {
      if (!prev) return prev;
      const next: PersistedUserStateV1 = { ...prev, taskCompletion: {} };
      savePersistedState(next);
      return next;
    });
  }, []);

  const updatePlanSettings = useCallback(
    (input: {
      targetGREDate?: string;
      studyStartDate?: string;
      weeklyHoursTarget?: number;
      weakAreaLabels?: string[];
    }) => {
      setPersisted((prev) => {
        if (!prev) return prev;
        const next = patchPersistedPlanSettings(prev, input);
        savePersistedState(next);
        return next;
      });
    },
    []
  );

  const resetLocalState = useCallback(() => {
    clearPersistedState();
    setPersisted(null);
    setAnalytics(createEmptyUserAnalyticsState());
  }, []);

  const value = useMemo(
    () => ({
      hydrated,
      persisted,
      user,
      studyPlan,
      topicMastery: analytics.topicMastery,
      dailyCheckIns: analytics.dailyCheckIns,
      errorLogEntries: analytics.errorLogEntries,
      hasCompletedOnboarding: Boolean(persisted?.onboardingCompletedAt),
      completeOnboarding,
      setTaskCompleted,
      clearStudyProgress,
      updatePlanSettings,
      resetLocalState,
    }),
    [
      hydrated,
      persisted,
      user,
      studyPlan,
      analytics.topicMastery,
      analytics.dailyCheckIns,
      analytics.errorLogEntries,
      completeOnboarding,
      setTaskCompleted,
      clearStudyProgress,
      updatePlanSettings,
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
