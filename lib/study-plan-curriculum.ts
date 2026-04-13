/**
 * Canonical 12-week curriculum and plan builder — no demo user data.
 */
import type {
  ConceptPrerequisite,
  Module,
  QuantSubtopic,
  QuantTopic,
  StudyPlan,
  UserProfile,
} from '@/lib/data-schema';
import { computeDaysRemaining } from '@/lib/date-utils';
import { applyTaskCompletion } from '@/lib/study-plan-utils';

export const GREGMAT_PLAN_NAME = `GregMat "I'm Overwhelmed" + Month 4 Testing & Strategy`;

function createModule(
  id: string,
  weekNumber: number,
  title: string,
  topicGroup: string,
  topics: QuantTopic[],
  subtopic: QuantSubtopic
): Module {
  return {
    id,
    weekNumber,
    title,
    topicGroup,
    description: `Master ${title.toLowerCase()}`,
    parts: [1, 2, 3, 4].map((partNum) => ({
      id: `${id}_p${partNum}`,
      moduleId: id,
      partNumber: partNum as 1 | 2 | 3 | 4,
      title: `Part ${partNum}`,
      topics,
      subtopics: [subtopic],
      tasks: [
        {
          id: `${id}_p${partNum}_t1`,
          partId: `${id}_p${partNum}`,
          title: `Lesson: ${title}`,
          description: `Learn ${title}`,
          taskType: 'lesson' as const,
          estimatedMinutes: 35,
          completed: false,
        },
        {
          id: `${id}_p${partNum}_t2`,
          partId: `${id}_p${partNum}`,
          title: `Practice: 10 ${title} Problems`,
          description: `Apply concepts`,
          taskType: 'practice' as const,
          estimatedMinutes: 25,
          completed: false,
        },
      ],
      estimatedHours: 3,
    })),
  };
}

export const CURRICULUM_MODULES: Module[] = [
  createModule('mod1', 1, 'Integers & Divisibility', 'Arithmetic', ['arithmetic_integers'], 'factors_multiples_divisibility'),
  createModule('mod2', 2, 'Fractions & Decimals', 'Arithmetic', ['arithmetic_fractions', 'arithmetic_decimals'], 'fraction_operations'),
  createModule('mod3', 3, 'Ratios & Percentages', 'Arithmetic', ['arithmetic_ratio_proportion', 'arithmetic_percent'], 'ratio_rates'),
  createModule('mod4', 4, 'Algebraic Expressions', 'Algebra', ['algebra_expressions'], 'polynomial_operations'),
  createModule('mod5', 5, 'Equations & Inequalities', 'Algebra', ['algebra_linear_equations', 'algebra_inequalities'], 'solving_linear'),
  createModule('mod6', 6, 'Functions & Graphing', 'Algebra', ['algebra_functions', 'algebra_coordinate_geometry'], 'function_notation'),
  createModule('mod7', 7, 'Lines & Angles', 'Geometry', ['geometry_lines_angles'], 'angle_relationships'),
  createModule('mod8', 8, 'Triangles & Polygons', 'Geometry', ['geometry_triangles', 'geometry_quadrilaterals'], 'pythagorean_theorem'),
  createModule('mod9', 9, 'Circles & 3D Solids', 'Geometry', ['geometry_circles', 'geometry_3d_solids'], 'circle_properties'),
  createModule('mod10', 10, 'Statistics & Distributions', 'Data Analysis', ['data_analysis_statistics'], 'mean_median_mode'),
  createModule('mod11', 11, 'Probability Foundations', 'Data Analysis', ['data_analysis_probability'], 'probability_basics'),
  createModule('mod12', 12, 'Counting & Combinatorics', 'Data Analysis', ['data_analysis_counting', 'data_analysis_interpretation'], 'permutations_combinations'),
];

/** Static learning-path rules (curriculum metadata, not user metrics). */
export const CURRICULUM_CONCEPT_PREREQUISITES: ConceptPrerequisite[] = [
  {
    subtopic: 'quadratic_formula',
    prerequisiteSubtopic: 'polynomial_operations',
    reason: 'You must understand polynomial expansion and factoring to solve quadratics efficiently',
    minimumMasteryRequired: 'proficient',
  },
  {
    subtopic: 'compound_inequalities',
    prerequisiteSubtopic: 'solving_linear',
    reason: 'Linear equation solving is the foundation for inequality solutions',
    minimumMasteryRequired: 'proficient',
  },
  {
    subtopic: 'circle_properties',
    prerequisiteSubtopic: 'angle_relationships',
    reason: 'Understanding angle types is essential for inscribed and central angle relationships',
    minimumMasteryRequired: 'developing',
  },
  {
    subtopic: 'radical_operations',
    prerequisiteSubtopic: 'exponent_rules',
    reason: 'Exponent rules apply to fractional exponents, which are roots',
    minimumMasteryRequired: 'proficient',
  },
];

function derivePlanCursor(modules: Module[]): {
  currentWeekNumber: number;
  currentModuleId: string;
  currentPartId: string;
} {
  for (const mod of modules) {
    for (const part of mod.parts) {
      for (const task of part.tasks) {
        if (!task.completed) {
          return {
            currentWeekNumber: mod.weekNumber,
            currentModuleId: mod.id,
            currentPartId: part.id,
          };
        }
      }
    }
  }
  const last = modules[modules.length - 1];
  const lastPart = last.parts[last.parts.length - 1];
  return {
    currentWeekNumber: last.weekNumber,
    currentModuleId: last.id,
    currentPartId: lastPart.id,
  };
}

function computeLateness(
  user: UserProfile,
  modules: Module[]
): Pick<StudyPlan, 'isLate' | 'latenessState' | 'recoveryDeadline'> {
  let total = 0;
  let done = 0;
  for (const m of modules) {
    for (const p of m.parts) {
      for (const t of p.tasks) {
        total += 1;
        if (t.completed) done += 1;
      }
    }
  }
  const start = user.startDate.getTime();
  const end = user.targetGREDate.getTime();
  const now = Date.now();
  const span = end - start;
  const elapsedRatio = span > 0 ? (now - start) / span : 0;
  const completionRatio = total > 0 ? done / total : 0;
  const slack = 0.08;
  if (elapsedRatio > 0.2 && completionRatio + slack < elapsedRatio) {
    return {
      isLate: true,
      latenessState: 'behind',
      recoveryDeadline: new Date(now + 7 * 24 * 60 * 60 * 1000),
    };
  }
  return { isLate: false, latenessState: 'on_track', recoveryDeadline: null };
}

export function buildStudyPlanFromCurriculum(
  user: UserProfile,
  taskCompletion: Record<string, boolean>
): StudyPlan {
  const modules = structuredClone(CURRICULUM_MODULES);
  let plan: StudyPlan = {
    id: 'local-plan',
    userId: user.id,
    planName: GREGMAT_PLAN_NAME,
    startDate: user.startDate,
    targetGREDate: user.targetGREDate,
    daysRemaining: computeDaysRemaining(user.targetGREDate),
    currentWeekNumber: 1,
    currentModuleId: 'mod1',
    currentPartId: 'mod1_p1',
    modules,
    phase: 'foundation',
    isLate: false,
    latenessState: 'on_track',
    recoveryDeadline: null,
  };

  plan = applyTaskCompletion(plan, taskCompletion);
  const cursor = derivePlanCursor(plan.modules);
  plan.currentWeekNumber = cursor.currentWeekNumber;
  plan.currentModuleId = cursor.currentModuleId;
  plan.currentPartId = cursor.currentPartId;
  const late = computeLateness(user, plan.modules);
  plan.isLate = late.isLate;
  plan.latenessState = late.latenessState;
  plan.recoveryDeadline = late.recoveryDeadline;

  return plan;
}
