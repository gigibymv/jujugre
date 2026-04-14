import type {
  DrillOutcome,
  ErrorCategory,
  ErrorLogEntry,
  QuantSubtopic,
  QuestionType,
} from '@/lib/data-schema';
import { mapSubtopicToTopic } from '@/lib/data-schema';

export const ERROR_LOG_STORAGE_KEY = 'jujugre-error-log-v1';

type SerializedErrorEntry = Omit<ErrorLogEntry, 'createdAt' | 'reviewDueDate' | 'lastFeedbackAt'> & {
  createdAt: string;
  reviewDueDate: string;
  lastFeedbackAt?: string;
};

type PersistedErrorLogV1 = {
  version: 1;
  entries: SerializedErrorEntry[];
};

function isPersistedV1(raw: unknown): raw is PersistedErrorLogV1 {
  if (!raw || typeof raw !== 'object') return false;
  const o = raw as Record<string, unknown>;
  return o.version === 1 && Array.isArray(o.entries);
}

function deserialize(e: SerializedErrorEntry): ErrorLogEntry {
  return {
    ...e,
    createdAt: new Date(e.createdAt),
    reviewDueDate: new Date(e.reviewDueDate),
    lastFeedbackAt: e.lastFeedbackAt ? new Date(e.lastFeedbackAt) : undefined,
  };
}

function serialize(e: ErrorLogEntry): SerializedErrorEntry {
  return {
    ...e,
    createdAt: e.createdAt.toISOString(),
    reviewDueDate: e.reviewDueDate.toISOString(),
    lastFeedbackAt: e.lastFeedbackAt ? e.lastFeedbackAt.toISOString() : undefined,
  };
}

export function loadErrorLogEntries(): ErrorLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ERROR_LOG_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!isPersistedV1(parsed)) return [];
    return parsed.entries.map(deserialize);
  } catch {
    return [];
  }
}

export function saveErrorLogEntries(entries: ErrorLogEntry[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const payload: PersistedErrorLogV1 = {
      version: 1,
      entries: entries.map(serialize),
    };
    localStorage.setItem(ERROR_LOG_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error('[jujugre] error-log save failed', err);
    return false;
  }
}

export function getErrorLogEntryById(id: string): ErrorLogEntry | null {
  return loadErrorLogEntries().find((e) => e.id === id) ?? null;
}

export type NewErrorLogInput = {
  problem: string;
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
  sourceReference: string;
  subtopic: QuantSubtopic;
  errorCategory: ErrorCategory;
  questionType: QuestionType;
  screenshotDataUrl?: string;
  screenshotName?: string;
};

const REVIEW_SPACING_DAYS = 3;

export function appendErrorLogEntry(input: NewErrorLogInput): ErrorLogEntry | null {
  const now = new Date();
  const reviewDue = new Date(now);
  reviewDue.setDate(reviewDue.getDate() + REVIEW_SPACING_DAYS);

  const entry: ErrorLogEntry = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `err-${Date.now()}`,
    userId: 'local',
    topic: mapSubtopicToTopic(input.subtopic),
    subtopic: input.subtopic,
    errorCategory: input.errorCategory,
    sourceReference: input.sourceReference.trim() || 'Practice / self-logged',
    questionType: input.questionType,
    problem: input.problem.trim(),
    studentAnswer: input.studentAnswer.trim(),
    correctAnswer: input.correctAnswer.trim() || '—',
    explanation: input.explanation.trim() || 'Add a short note when you review, or ask the coach.',
    protocolElements: [],
    screenshotDataUrl: input.screenshotDataUrl,
    screenshotName: input.screenshotName,
    createdAt: now,
    reviewDueDate: reviewDue,
    reviewed: false,
    confidence: 3,
    lastOutcome: 'struggled',
  };

  const next = [entry, ...loadErrorLogEntries()];
  return saveErrorLogEntries(next) ? entry : null;
}

export function setErrorLogEntryReviewed(id: string, reviewed: boolean): void {
  const entries = loadErrorLogEntries().map((e) =>
    e.id === id ? { ...e, reviewed } : e
  );
  saveErrorLogEntries(entries);
}

export function setErrorLogEntryOutcome(
  id: string,
  outcome: DrillOutcome,
  confidence?: 1 | 2 | 3 | 4 | 5
): void {
  const entries = loadErrorLogEntries().map((e) =>
    e.id === id
      ? {
          ...e,
          lastOutcome: outcome,
          confidence: confidence ?? e.confidence ?? 3,
          reviewed: outcome === 'mastered' ? true : e.reviewed,
          lastFeedbackAt: new Date(),
        }
      : e
  );
  saveErrorLogEntries(entries);
}

export function setErrorLogEntryCoachFeedback(id: string, coachResponse: string): void {
  const nextAction = coachResponse
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 220);
  const entries = loadErrorLogEntries().map((e) =>
    e.id === id
      ? {
          ...e,
          nextAction: nextAction || e.nextAction || 'Review coach explanation and retry two similar problems.',
          lastFeedbackAt: new Date(),
        }
      : e
  );
  saveErrorLogEntries(entries);
}

export function setErrorLogEntryScreenshot(
  id: string,
  screenshot: { dataUrl?: string; name?: string }
): boolean {
  const entries = loadErrorLogEntries().map((e) =>
    e.id === id
      ? {
          ...e,
          screenshotDataUrl: screenshot.dataUrl,
          screenshotName: screenshot.name,
        }
      : e
  );
  return saveErrorLogEntries(entries);
}
