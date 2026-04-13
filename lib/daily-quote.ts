import type { QuantTopic } from '@/lib/data-schema';

export type QuoteTone = 'encouraging' | 'rigorous' | 'calm';

export type DailyQuote = {
  id: string;
  text: string;
  by: string | null;
  lang: 'fr' | 'en';
  tone: QuoteTone;
  topics: QuantTopic[];
  qualityScore: number;
};

type QuoteImpression = {
  userId: string;
  dateKey: string;
  quoteId: string;
  shownAt: string;
};

const QUOTE_IMPRESSIONS_STORAGE_KEY = 'jujugre-quote-impressions-v1';
const MAX_IMPRESSIONS = 250;
const RECENT_LOOKBACK_DAYS = 14;

const QUOTE_BANK: DailyQuote[] = [
  {
    id: 'q-fr-1',
    text: 'Les sujets difficiles sont souvent tes plus grosses progressions de demain.',
    by: null,
    lang: 'fr',
    tone: 'encouraging',
    topics: ['algebra_linear_equations', 'geometry_circles'],
    qualityScore: 88,
  },
  {
    id: 'q-fr-2',
    text: 'La precision aujourd hui construit ta confiance le jour du test.',
    by: null,
    lang: 'fr',
    tone: 'rigorous',
    topics: ['arithmetic_fractions', 'data_analysis_probability'],
    qualityScore: 91,
  },
  {
    id: 'q-fr-3',
    text: 'Un probleme a la fois, une regle a la fois.',
    by: null,
    lang: 'fr',
    tone: 'calm',
    topics: ['arithmetic_percent', 'geometry_triangles'],
    qualityScore: 84,
  },
  {
    id: 'q-fr-4',
    text: 'Chaque erreur bien revue devient un point fort reutilisable.',
    by: null,
    lang: 'fr',
    tone: 'rigorous',
    topics: ['data_analysis_interpretation', 'algebra_inequalities'],
    qualityScore: 90,
  },
  {
    id: 'q-fr-5',
    text: 'La constance bat presque toujours l intensite.',
    by: null,
    lang: 'fr',
    tone: 'encouraging',
    topics: ['arithmetic_integers', 'data_analysis_statistics'],
    qualityScore: 87,
  },
  {
    id: 'q-fr-6',
    text: 'Quand tu bloques, ralentis: concept, regle, calcul, verification.',
    by: null,
    lang: 'fr',
    tone: 'calm',
    topics: ['algebra_functions', 'geometry_lines_angles'],
    qualityScore: 92,
  },
  {
    id: 'q-en-1',
    text: "Hard topics are often tomorrow's strongest wins.",
    by: null,
    lang: 'en',
    tone: 'encouraging',
    topics: ['geometry_circles', 'algebra_linear_equations'],
    qualityScore: 86,
  },
  {
    id: 'q-en-2',
    text: 'Discipline in setup saves time in computation.',
    by: null,
    lang: 'en',
    tone: 'rigorous',
    topics: ['arithmetic_fractions', 'data_analysis_probability'],
    qualityScore: 90,
  },
  {
    id: 'q-en-3',
    text: 'Slow down to speed up: concept first, arithmetic second.',
    by: null,
    lang: 'en',
    tone: 'calm',
    topics: ['algebra_inequalities', 'geometry_triangles'],
    qualityScore: 89,
  },
];

function dateKeyFromLocalDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function loadImpressions(): QuoteImpression[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUOTE_IMPRESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((row): row is QuoteImpression => {
      if (!row || typeof row !== 'object') return false;
      const o = row as Record<string, unknown>;
      return (
        typeof o.userId === 'string' &&
        typeof o.dateKey === 'string' &&
        typeof o.quoteId === 'string' &&
        typeof o.shownAt === 'string'
      );
    });
  } catch {
    return [];
  }
}

function saveImpressions(entries: QuoteImpression[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(QUOTE_IMPRESSIONS_STORAGE_KEY, JSON.stringify(entries));
}

function collectRecentQuoteIds(
  impressions: QuoteImpression[],
  userId: string,
  dateKey: string
): Set<string> {
  const lookbackStart = new Date(`${dateKey}T12:00:00`);
  lookbackStart.setDate(lookbackStart.getDate() - RECENT_LOOKBACK_DAYS);
  const minDateKey = dateKeyFromLocalDate(lookbackStart);
  return new Set(
    impressions
      .filter((entry) => entry.userId === userId && entry.dateKey >= minDateKey)
      .map((entry) => entry.quoteId)
  );
}

export function getDailyQuoteForUser(params: {
  userId: string;
  lang: 'fr' | 'en';
  preferredTone?: QuoteTone;
  weakTopics?: QuantTopic[];
  date?: Date;
}): DailyQuote | null {
  const dateKey = dateKeyFromLocalDate(params.date ?? new Date());
  const weakTopics = params.weakTopics ?? [];
  const tone = params.preferredTone;

  const langPool = QUOTE_BANK.filter((quote) => quote.lang === params.lang);
  const pool = langPool.length > 0 ? langPool : QUOTE_BANK;
  if (pool.length === 0) return null;

  const impressions = loadImpressions();
  const existingForDay = impressions.find(
    (entry) => entry.userId === params.userId && entry.dateKey === dateKey
  );
  if (existingForDay) {
    const existingQuote = pool.find((quote) => quote.id === existingForDay.quoteId);
    if (existingQuote) return existingQuote;
  }

  const recentQuoteIds = collectRecentQuoteIds(impressions, params.userId, dateKey);
  const scored = pool
    .map((quote) => {
      let score = quote.qualityScore;
      if (tone && quote.tone === tone) score += 10;
      if (quote.topics.some((topic) => weakTopics.includes(topic))) score += 14;
      if (recentQuoteIds.has(quote.id)) score -= 35;
      return { quote, score };
    })
    .sort((a, b) => b.score - a.score);

  const topCandidates = scored.slice(0, Math.max(1, Math.min(6, scored.length)));
  const seed = hashString(`${params.userId}:${dateKey}`);
  const selected = topCandidates[seed % topCandidates.length]?.quote ?? null;
  if (!selected) return null;

  if (typeof window !== 'undefined') {
    const nextImpressions = impressions
      .filter(
        (entry) => !(entry.userId === params.userId && entry.dateKey === dateKey)
      )
      .concat({
        userId: params.userId,
        dateKey,
        quoteId: selected.id,
        shownAt: new Date().toISOString(),
      })
      .slice(-MAX_IMPRESSIONS);
    saveImpressions(nextImpressions);
  }

  return selected;
}
