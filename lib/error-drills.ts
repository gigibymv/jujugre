import type { ErrorCategory, ErrorLogEntry, QuantSubtopic } from '@/lib/data-schema';

export type DrillPack = {
  title: string;
  exercises: string[];
  /** Appended to the coach request so replies stay actionable */
  coachAsk: string;
};

const DEFAULT_DRILL: DrillPack = {
  title: 'Practice loop (any mistake)',
  exercises: [
    'Re-solve the item without notes, then compare to the correct path.',
    'Do two more items from the same chapter or set, timing yourself lightly.',
    'Write one sentence: “The rule I forgot was ___.”',
  ],
  coachAsk:
    'Give concise feedback: (1) name the concept, (2) the fix in one line, (3) two short practice prompts similar to my problem, (4) one trap to watch on test day.',
};

const BY_CATEGORY: Partial<Record<ErrorCategory, DrillPack>> = {
  sign_error: {
    title: 'Sign & inequality drills',
    exercises: [
      'Solve 4 linear inequalities that force a sign flip (e.g. multiply/divide by a negative).',
      'For each, state out loud when you must flip and why.',
    ],
    coachAsk:
      'Focus on sign rules and inequalities. After explaining my error, give two numeric examples and one verbal “when to flip” rule.',
  },
  probability_trap: {
    title: 'Probability structure',
    exercises: [
      'List sample space for a small experiment, then recompute P(A) without adding incompatible paths.',
      'Redo one “at least one” problem using the complement.',
    ],
    coachAsk:
      'Explain whether I misused independence, complement, or addition. Then give two tiny probability questions that test the same idea.',
  },
  fraction_decimal_confusion: {
    title: 'Fractions & decimals',
    exercises: [
      'Convert three awkward fractions to decimals and back without a calculator shortcut that hides structure.',
      'Do one percent-change problem writing the base explicitly each time.',
    ],
    coachAsk:
      'Pinpoint whether the mistake was conversion, common denominator, or percent base. Suggest two quick fraction/percent drills.',
  },
  formula_misapplication: {
    title: 'Formula + setup',
    exercises: [
      'Re-derive the formula from a diagram or definition (no memorization sprint).',
      'Apply the same formula to a simpler instance and check units.',
    ],
    coachAsk:
      'Show the correct formula in context and one way to sanity-check it. Propose one easier and one same-difficulty variant.',
  },
  conceptual_misunderstanding: {
    title: 'Concept first',
    exercises: [
      'Explain the idea in your own words in ≤3 sentences.',
      'Find a textbook definition and compare to your wording—fix gaps.',
    ],
    coachAsk:
      'Teach the underlying concept before algebra. End with one “explain why” question and one micro-computation.',
  },
  geometric_property_error: {
    title: 'Geometry facts',
    exercises: [
      'Draw the figure and label every given; re-read what the question asks (length vs area vs angle).',
      'State the exact theorem you used and its hypotheses.',
    ],
    coachAsk:
      'Clarify which geometric property applies. Suggest two figures that exercise the same property without repeating my exact numbers.',
  },
  angle_arc_confusion: {
    title: 'Angles & arcs',
    exercises: [
      'For one circle problem, identify central vs inscribed angles subtending the same arc.',
      'Compute both angles and check the factor-of-2 relationship.',
    ],
    coachAsk:
      'Use central vs inscribed angle language. Give one warm-up and one exam-style circle question.',
  },
  reading_comprehension: {
    title: 'Read the prompt',
    exercises: [
      'Underline what quantity is asked for before doing any algebra.',
      'Restate the problem in one sentence including constraints.',
    ],
    coachAsk:
      'Point out what I misread. Suggest a checklist for word problems and one practice prompt.',
  },
  computational_arithmetic: {
    title: 'Arithmetic accuracy',
    exercises: [
      'Redo the calculation on paper with one column per step.',
      'Estimate an order-of-magnitude check before accepting the final value.',
    ],
    coachAsk:
      'Show the clean arithmetic path and where my slip likely happened. Add two short arithmetic checks at the same difficulty.',
  },
  computational_algebra: {
    title: 'Algebra mechanics',
    exercises: [
      'Solve a parallel problem isolating the same variable pattern.',
      'Check the solution by substitution.',
    ],
    coachAsk:
      'Walk through the algebraic steps I should have used. Offer two isomorphic equations to drill.',
  },
};

const SUBTOPIC_HINTS: Partial<Record<QuantSubtopic, string[]>> = {
  solving_linear: [
    'Batch: 3 equations where distribution or combining like terms is the crux.',
  ],
  probability_basics: [
    'List outcomes for a 2-dice or coin problem before counting.',
  ],
  circle_properties: [
    'Sketch radii to the same arc; mark central vs inscribed angles.',
  ],
  percent_change: [
    'Write “new = old × (1 ± r)” and identify old vs new for each clause.',
  ],
};

export function getDrillPack(category: ErrorCategory, subtopic: QuantSubtopic): DrillPack {
  const base = BY_CATEGORY[category] ?? DEFAULT_DRILL;
  const extra = SUBTOPIC_HINTS[subtopic];
  if (!extra?.length) return base;
  return {
    ...base,
    exercises: [...base.exercises, ...extra],
  };
}

export function buildCoachPromptFromError(entry: ErrorLogEntry): string {
  const pack = getDrillPack(entry.errorCategory, entry.subtopic);
  const sub = entry.subtopic.replace(/_/g, ' ');
  const cat = entry.errorCategory.replace(/_/g, ' ');
  return `I logged a GRE quant mistake for review.

**Subtopic:** ${sub}
**Mistake type:** ${cat}
**Problem:** ${entry.problem}
**My answer:** ${entry.studentAnswer}
**Correct / target:** ${entry.correctAnswer}
**My note:** ${entry.explanation}
**Source:** ${entry.sourceReference}

Please ${pack.coachAsk}`;
}
