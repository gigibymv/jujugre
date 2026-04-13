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
  isAnalyticsStorageKey,
  loadPersistedAnalytics,
  savePersistedAnalytics,
  type UserAnalyticsState,
} from '@/lib/user-analytics';
import { getDailyQuoteForUser, type DailyQuote } from '@/lib/daily-quote';
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
  dailyQuote: DailyQuote | null;
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
  addErrorLogEntry: (
    input: Omit<ErrorLogEntry, 'id' | 'userId' | 'createdAt' | 'reviewDueDate' | 'reviewed'> & {
      reviewDueDate?: Date;
      reviewInDays?: number;
    }
  ) => void;
  setErrorLogReviewed: (errorId: string, reviewed: boolean) => void;
  resetLocalState: () => void;
};

const UserPlanContext = createContext<UserPlanContextValue | null>(null);

function createClientId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function UserPlanProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<PersistedUserStateV1 | null>(null);
  const [analytics, setAnalytics] = useState<UserAnalyticsState>(
    createEmptyUserAnalyticsState
  );
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);
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
      if (
        event.key !== null &&
        !isUserStorageKey(event.key) &&
        !isAnalyticsStorageKey(event.key)
      ) {
        return;
      }
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const lang = window.navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
    const quote = getDailyQuoteForUser({
      userId: user.id,
      lang,
      weakTopics: user.weakAreasFromOnboarding,
    });
    setDailyQuote(quote);
  }, [user.id, user.weakAreasFromOnboarding]);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    savePersistedAnalytics(analytics);
  }, [analytics, hydrated]);

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

  const addErrorLogEntry = useCallback(
    (
      input: Omit<ErrorLogEntry, 'id' | 'userId' | 'createdAt' | 'reviewDueDate' | 'reviewed'> & {
        reviewDueDate?: Date;
        reviewInDays?: number;
      }
    ) => {
      const now = new Date();
      const reviewDelayDays =
        typeof input.reviewInDays === 'number' && Number.isFinite(input.reviewInDays)
          ? Math.max(0, Math.min(30, Math.round(input.reviewInDays)))
          : 2;
      const defaultDueDate = new Date(now.getTime() + reviewDelayDays * 24 * 60 * 60 * 1000);
      const { reviewInDays: _reviewInDays, ...entryPayload } = input;
      const nextEntry: ErrorLogEntry = {
        ...entryPayload,
        id: createClientId('err'),
        userId: user.id,
        createdAt: now,
        reviewDueDate: input.reviewDueDate ?? defaultDueDate,
        reviewed: false,
      };
      setAnalytics((prev) => ({
        ...prev,
        errorLogEntries: [nextEntry, ...prev.errorLogEntries],
      }));
    },
    [user.id]
  );

  const setErrorLogReviewed = useCallback((errorId: string, reviewed: boolean) => {
    setAnalytics((prev) => ({
      ...prev,
      errorLogEntries: prev.errorLogEntries.map((entry) =>
        entry.id === errorId
          ? {
              ...entry,
              reviewed,
              reviewDueDate: reviewed ? entry.reviewDueDate : new Date(),
            }
          : entry
      ),
    }));
  }, []);

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
      dailyQuote,
      hasCompletedOnboarding: Boolean(persisted?.onboardingCompletedAt),
      completeOnboarding,
      setTaskCompleted,
      clearStudyProgress,
      updatePlanSettings,
      addErrorLogEntry,
      setErrorLogReviewed,
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
      dailyQuote,
      completeOnboarding,
      setTaskCompleted,
      clearStudyProgress,
      updatePlanSettings,
      addErrorLogEntry,
      setErrorLogReviewed,
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
