// lib/data-schema.ts
// Type definitions for GRE Tutor App with realistic quant taxonomy

export type QuantTopic = 
  // Arithmetic
  | "arithmetic_integers"
  | "arithmetic_fractions"
  | "arithmetic_decimals"
  | "arithmetic_exponents_roots"
  | "arithmetic_ratio_proportion"
  | "arithmetic_percent"
  // Algebra
  | "algebra_expressions"
  | "algebra_exponents_rules"
  | "algebra_linear_equations"
  | "algebra_inequalities"
  | "algebra_quadratic_equations"
  | "algebra_functions"
  | "algebra_coordinate_geometry"
  | "algebra_graphing"
  // Geometry
  | "geometry_lines_angles"
  | "geometry_triangles"
  | "geometry_quadrilaterals"
  | "geometry_polygons"
  | "geometry_circles"
  | "geometry_3d_solids"
  // Data Analysis
  | "data_analysis_statistics"
  | "data_analysis_probability"
  | "data_analysis_counting"
  | "data_analysis_interpretation";

export type QuantSubtopic = 
  // Arithmetic subtopics
  | "factors_multiples_divisibility"
  | "lcm_gcd"
  | "prime_factorization"
  | "fraction_operations"
  | "decimal_rounding"
  | "exponent_rules"
  | "radical_operations"
  | "ratio_rates"
  | "percent_change"
  // Algebra subtopics
  | "polynomial_operations"
  | "factoring"
  | "solving_linear"
  | "compound_inequalities"
  | "quadratic_formula"
  | "slope_intercept"
  | "distance_formula"
  | "function_notation"
  // Geometry subtopics
  | "angle_relationships"
  | "pythagorean_theorem"
  | "special_triangles"
  | "triangle_similarity"
  | "circle_properties"
  | "volume_surface_area"
  | "coordinate_distance"
  // Data Analysis subtopics
  | "mean_median_mode"
  | "standard_deviation"
  | "probability_basics"
  | "conditional_probability"
  | "permutations_combinations"
  | "data_charts_interpretation";

export type QuestionType = 
  | "quantitative_comparison"
  | "multiple_choice_single"
  | "multiple_choice_multiple"
  | "numeric_entry"
  | "data_interpretation";

export type ErrorCategory = 
  | "computational_arithmetic"
  | "computational_algebra"
  | "computational_geometry"
  | "conceptual_misunderstanding"
  | "formula_misapplication"
  | "sign_error"
  | "negative_number_error"
  | "fraction_decimal_confusion"
  | "variable_setup_error"
  | "absolute_value_error"
  | "exponent_rule_error"
  | "probability_trap"
  | "geometric_property_error"
  | "angle_arc_confusion"
  | "axis_label_confusion"
  | "reading_comprehension"
  | "strategy_error"
  | "units_error"
  | "boundary_error"
  | "estimation_precision";

export type Difficulty = "easy" | "medium" | "hard";

export type MasteryLevel = 
  | "not_started"
  | "developing"
  | "proficient"
  | "mastered";

export interface Module {
  id: string;
  weekNumber: number;
  title: string;
  topicGroup: string; // e.g., "Arithmetic", "Algebra", etc.
  description: string;
  parts: ModulePart[];
}

export interface ModulePart {
  id: string;
  moduleId: string;
  partNumber: 1 | 2 | 3 | 4;
  title: string;
  topics: QuantTopic[];
  subtopics: QuantSubtopic[];
  tasks: Task[];
  estimatedHours: number;
}

export interface Task {
  id: string;
  partId: string;
  title: string;
  description: string;
  taskType: "lesson" | "practice" | "review" | "drill";
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: Date;
}

export interface TopicMastery {
  id: string;
  topic: QuantTopic;
  subtopic: QuantSubtopic;
  
  // Signals (multi-signal approach)
  practiceAccuracyPercent: number; // 0-100, weight: 40%
  taskCompletionPercent: number; // 0-100, weight: 35%
  selfRatingAverage: number; // 1-5, weight: 15%
  
  // Computed mastery level
  masteryLevel: MasteryLevel;
  lastReviewDate: Date | null;
}

export interface ErrorLogEntry {
  id: string;
  userId: string;
  topic: QuantTopic;
  subtopic: QuantSubtopic;
  errorCategory: ErrorCategory;
  sourceReference: string; // e.g., "Manhattan Prep 5LB Ch. 5, Problem 203"
  questionType: QuestionType;
  
  // Problem and answers
  problem: string;
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
  
  // Protocol elements for learning
  protocolElements: string[]; // Concepts, steps, traps addressed
  
  // Tracking
  createdAt: Date;
  reviewDueDate: Date;
  reviewed: boolean;
}

export interface SourceMaterial {
  id: string;
  title: string;
  sourceType: "official_guide" | "manhattan_prep" | "khan_academy" | "other";
  ingestedAt: Date;
  
  concepts: ConceptBlock[];
  problems: ProblemBlock[];
}

export interface ConceptBlock {
  id: string;
  title: string;
  topic: QuantTopic;
  subtopic: QuantSubtopic;
  definition: string;
  examples: string[];
  commonMistakes: string[];
}

export interface ProblemBlock {
  id: string;
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  topics: QuantTopic[];
  subtopics: QuantSubtopic[];
  answerKey: string;
  explanation: string;
  timeEstimateSeconds: number;
  commonErrorsAddressed: ErrorCategory[];
  retrievalTags: string[];
}

export interface StudyPlan {
  id: string;
  userId: string;
  planName: string;
  startDate: Date;
  targetGREDate: Date;
  daysRemaining: number;
  currentWeekNumber: number;
  currentModuleId: string;
  currentPartId: string;
  
  modules: Module[];
  phase: "foundation" | "strategy";
  isLate: boolean;
  latenessState: "on_track" | "behind" | "recovering";
  recoveryDeadline: Date | null;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  startDate: Date;
  targetGREDate: Date;
  weeklyHoursTarget: number;
  weakAreasFromOnboarding: QuantTopic[];
}

export interface OnboardingData {
  targetGREDate: Date;
  studyCapacityChoice: "light" | "moderate" | "intensive";
  weakAreas: QuantTopic[];
}

export interface DailyCheckIn {
  id: string;
  userId: string;
  date: Date;
  taskCompletionPercent: number;
  minutesSpent: number;
  wordsLearned: number;
  emotion: "overwhelmed" | "frustrated" | "neutral" | "confident" | null;
  notes?: string;
}

export interface CoachMessage {
  id: string;
  userId: string;
  topic: QuantTopic;
  subtopic: QuantSubtopic;
  userQuestion: string;
  coachResponse: string;
  protocolCompliant: boolean;
  createdAt: Date;
}

// Error pattern analysis for tracking recurring mistakes
export interface ErrorPatternAnalysis {
  userId: string;
  errorCategory: ErrorCategory;
  totalOccurrences: number;
  affectedSubtopics: QuantSubtopic[];
  commonTriggersAndTraps: string[];
  masteryGate: "concept_unknown" | "conceptual_error" | "computational_error" | "careless_mistake";
}

// Concept mastery prerequisites for structured learning paths
export interface ConceptPrerequisite {
  subtopic: QuantSubtopic;
  prerequisiteSubtopic: QuantSubtopic;
  reason: string; // e.g., "You need factoring to solve quadratic equations"
  minimumMasteryRequired: MasteryLevel;
}

// Learning recommendation based on data patterns
export interface LearningRecommendation {
  userId: string;
  recommendationType: "drill_mastered" | "revisit_concept" | "error_recovery" | "practice_similar";
  targetSubtopic: QuantSubtopic;
  reason: string;
  priority: "immediate" | "high" | "medium" | "low";
  estimatedMinutes: number;
  createdAt: Date;
}

// Helper function to map subtopic to topic
export function mapSubtopicToTopic(subtopic: QuantSubtopic): QuantTopic {
  const mapping: Record<QuantSubtopic, QuantTopic> = {
    factors_multiples_divisibility: "arithmetic_integers",
    lcm_gcd: "arithmetic_integers",
    prime_factorization: "arithmetic_integers",
    fraction_operations: "arithmetic_fractions",
    decimal_rounding: "arithmetic_decimals",
    exponent_rules: "arithmetic_exponents_roots",
    radical_operations: "arithmetic_exponents_roots",
    ratio_rates: "arithmetic_ratio_proportion",
    percent_change: "arithmetic_percent",
    polynomial_operations: "algebra_expressions",
    factoring: "algebra_expressions",
    solving_linear: "algebra_linear_equations",
    compound_inequalities: "algebra_inequalities",
    quadratic_formula: "algebra_quadratic_equations",
    slope_intercept: "algebra_coordinate_geometry",
    distance_formula: "algebra_coordinate_geometry",
    function_notation: "algebra_functions",
    angle_relationships: "geometry_lines_angles",
    pythagorean_theorem: "geometry_triangles",
    special_triangles: "geometry_triangles",
    triangle_similarity: "geometry_triangles",
    circle_properties: "geometry_circles",
    volume_surface_area: "geometry_3d_solids",
    coordinate_distance: "algebra_coordinate_geometry",
    mean_median_mode: "data_analysis_statistics",
    standard_deviation: "data_analysis_statistics",
    probability_basics: "data_analysis_probability",
    conditional_probability: "data_analysis_probability",
    permutations_combinations: "data_analysis_counting",
    data_charts_interpretation: "data_analysis_interpretation",
  };
  return mapping[subtopic];
}
