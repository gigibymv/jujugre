import type { DailyCheckIn, ErrorLogEntry, TopicMastery } from '@/lib/data-schema';

export const USER_ANALYTICS_STORAGE_KEY = 'jujugre-user-analytics-v1';

type PersistedTopicMastery = Omit<TopicMastery, 'lastReviewDate'> & {
  lastReviewDate: string | null;
};

type PersistedDailyCheckIn = Omit<DailyCheckIn, 'date'> & {
  date: string;
};

type PersistedErrorLogEntry = Omit<ErrorLogEntry, 'createdAt' | 'reviewDueDate'> & {
  createdAt: string;
  reviewDueDate: string;
};

type PersistedUserAnalyticsV1 = {
  version: 1;
  topicMastery: PersistedTopicMastery[];
  dailyCheckIns: PersistedDailyCheckIn[];
  errorLogEntries: PersistedErrorLogEntry[];
};

export type UserAnalyticsState = {
  topicMastery: TopicMastery[];
  dailyCheckIns: DailyCheckIn[];
  errorLogEntries: ErrorLogEntry[];
};

function isPersistedAnalyticsV1(raw: unknown): raw is PersistedUserAnalyticsV1 {
  if (!raw || typeof raw !== 'object') return false;
  const o = raw as Record<string, unknown>;
  return (
    o.version === 1 &&
    Array.isArray(o.topicMastery) &&
    Array.isArray(o.dailyCheckIns) &&
    Array.isArray(o.errorLogEntries)
  );
}

function toValidDate(raw: string): Date | null {
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toDomainState(persisted: PersistedUserAnalyticsV1): UserAnalyticsState {
  return {
    topicMastery: persisted.topicMastery
      .map((row) => ({
        ...row,
        lastReviewDate: row.lastReviewDate ? toValidDate(row.lastReviewDate) : null,
      }))
      .filter((row): row is TopicMastery => row.lastReviewDate !== undefined),
    dailyCheckIns: persisted.dailyCheckIns
      .map((row) => {
        const date = toValidDate(row.date);
        if (!date) return null;
        return { ...row, date };
      })
      .filter((row): row is DailyCheckIn => row !== null),
    errorLogEntries: persisted.errorLogEntries
      .map((row) => {
        const createdAt = toValidDate(row.createdAt);
        const reviewDueDate = toValidDate(row.reviewDueDate);
        if (!createdAt || !reviewDueDate) return null;
        return { ...row, createdAt, reviewDueDate };
      })
      .filter((row): row is ErrorLogEntry => row !== null),
  };
}

function toPersistedState(state: UserAnalyticsState): PersistedUserAnalyticsV1 {
  return {
    version: 1,
    topicMastery: state.topicMastery.map((row) => ({
      ...row,
      lastReviewDate: row.lastReviewDate ? row.lastReviewDate.toISOString() : null,
    })),
    dailyCheckIns: state.dailyCheckIns.map((row) => ({
      ...row,
      date: row.date.toISOString(),
    })),
    errorLogEntries: state.errorLogEntries.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
      reviewDueDate: row.reviewDueDate.toISOString(),
    })),
  };
}

export function createEmptyUserAnalyticsState(): UserAnalyticsState {
  return {
    topicMastery: [],
    dailyCheckIns: [],
    errorLogEntries: [],
  };
}

export function loadPersistedAnalytics(): UserAnalyticsState {
  if (typeof window === 'undefined') return createEmptyUserAnalyticsState();
  try {
    const raw = localStorage.getItem(USER_ANALYTICS_STORAGE_KEY);
    if (!raw) return createEmptyUserAnalyticsState();
    const parsed: unknown = JSON.parse(raw);
    if (!isPersistedAnalyticsV1(parsed)) return createEmptyUserAnalyticsState();
    return toDomainState(parsed);
  } catch {
    return createEmptyUserAnalyticsState();
  }
}

export function savePersistedAnalytics(state: UserAnalyticsState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    USER_ANALYTICS_STORAGE_KEY,
    JSON.stringify(toPersistedState(state))
  );
}

export function isAnalyticsStorageKey(key: string | null): boolean {
  if (!key) return false;
  return key === USER_ANALYTICS_STORAGE_KEY;
}
