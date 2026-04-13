import {
  Module,
  ModulePart,
  Task,
  TopicMastery,
  ErrorLogEntry,
  StudyPlan,
  UserProfile,
  QuantTopic,
  QuantSubtopic,
  MasteryLevel,
  ErrorCategory,
  QuestionType,
  DailyCheckIn,
  CoachMessage,
  ErrorPatternAnalysis,
  ConceptPrerequisite,
  LearningRecommendation,
} from "./data-schema";

// Create a simple module factory
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
          taskType: "lesson" as const,
          estimatedMinutes: 35,
          /** Progress comes only from persisted taskCompletion — never seed demo checkmarks */
          completed: false,
        },
        {
          id: `${id}_p${partNum}_t2`,
          partId: `${id}_p${partNum}`,
          title: `Practice: 10 ${title} Problems`,
          description: `Apply concepts`,
          taskType: "practice" as const,
          estimatedMinutes: 25,
          completed: false,
        },
      ],
      estimatedHours: 3,
    })),
  };
}

// GregMat "I'm Overwhelmed" Plan: 12 weeks foundation + 4 weeks testing & strategy
export const mockModules: Module[] = [
  createModule("mod1", 1, "Integers & Divisibility", "Arithmetic", ["arithmetic_integers"], "factors_multiples_divisibility"),
  createModule("mod2", 2, "Fractions & Decimals", "Arithmetic", ["arithmetic_fractions", "arithmetic_decimals"], "fraction_operations"),
  createModule("mod3", 3, "Ratios & Percentages", "Arithmetic", ["arithmetic_ratio_proportion", "arithmetic_percent"], "ratio_rates"),
  createModule("mod4", 4, "Algebraic Expressions", "Algebra", ["algebra_expressions"], "polynomial_operations"),
  createModule("mod5", 5, "Equations & Inequalities", "Algebra", ["algebra_linear_equations", "algebra_inequalities"], "solving_linear"),
  createModule("mod6", 6, "Functions & Graphing", "Algebra", ["algebra_functions", "algebra_coordinate_geometry"], "function_notation"),
  createModule("mod7", 7, "Lines & Angles", "Geometry", ["geometry_lines_angles"], "angle_relationships"),
  createModule("mod8", 8, "Triangles & Polygons", "Geometry", ["geometry_triangles", "geometry_quadrilaterals"], "pythagorean_theorem"),
  createModule("mod9", 9, "Circles & 3D Solids", "Geometry", ["geometry_circles", "geometry_3d_solids"], "circle_properties"),
  createModule("mod10", 10, "Statistics & Distributions", "Data Analysis", ["data_analysis_statistics"], "mean_median_mode"),
  createModule("mod11", 11, "Probability Foundations", "Data Analysis", ["data_analysis_probability"], "probability_basics"),
  createModule("mod12", 12, "Counting & Combinatorics", "Data Analysis", ["data_analysis_counting", "data_analysis_interpretation"], "permutations_combinations"),
  // Month 4: Testing & Strategy Focus (Weeks 13-16) - Parked for future iteration
  // Will include: Full-Length Practice Tests, Error Review, Strategy Sessions, Test Day Prep
  // These require extended topic type system to support strategy and testing categories
];

// Topic Mastery: Multi-signal approach with realistic distributions
export const mockTopicMastery: TopicMastery[] = [
  {
    id: "tm1",
    topic: "arithmetic_fractions",
    subtopic: "fraction_operations",
    practiceAccuracyPercent: 78,
    taskCompletionPercent: 100,
    selfRatingAverage: 3.5,
    masteryLevel: "proficient",
    lastReviewDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "tm2",
    topic: "geometry_circles",
    subtopic: "circle_properties",
    practiceAccuracyPercent: 45,
    taskCompletionPercent: 50,
    selfRatingAverage: 2,
    masteryLevel: "developing",
    lastReviewDate: null,
  },
  {
    id: "tm3",
    topic: "data_analysis_probability",
    subtopic: "probability_basics",
    practiceAccuracyPercent: 62,
    taskCompletionPercent: 75,
    selfRatingAverage: 2.5,
    masteryLevel: "developing",
    lastReviewDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "tm4",
    topic: "algebra_linear_equations",
    subtopic: "solving_linear",
    practiceAccuracyPercent: 55,
    taskCompletionPercent: 60,
    selfRatingAverage: 2,
    masteryLevel: "developing",
    lastReviewDate: null,
  },
  {
    id: "tm5",
    topic: "arithmetic_integers",
    subtopic: "factors_multiples_divisibility",
    practiceAccuracyPercent: 85,
    taskCompletionPercent: 100,
    selfRatingAverage: 4,
    masteryLevel: "mastered",
    lastReviewDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

// Error Log: Realistic entries sourced to materials with protocol elements
export const mockErrorLogEntries: ErrorLogEntry[] = [
  {
    id: "err1",
    userId: "user1",
    topic: "arithmetic_fractions",
    subtopic: "fraction_operations",
    errorCategory: "computational_arithmetic",
    sourceReference: "Manhattan Prep 5LB Ch. 2, Problem 45",
    questionType: "multiple_choice_single",
    problem: "1/3 + 1/4 = ?",
    studentAnswer: "2/7",
    correctAnswer: "7/12",
    explanation: "Student added numerators and denominators separately. Must find common denominator: 1/3 = 4/12, 1/4 = 3/12, so 1/3 + 1/4 = 7/12.",
    protocolElements: ["concept_fraction_addition", "rule_common_denominator", "steps_find_lcd_multiply", "check_reasonableness", "takeaway_never_add_top_and_bottom_separately"],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    reviewDueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    reviewed: true,
  },
  {
    id: "err2",
    userId: "user1",
    topic: "geometry_circles",
    subtopic: "circle_properties",
    errorCategory: "formula_misapplication",
    sourceReference: "Official GRE Math Review, Chapter 8, Circles",
    questionType: "quantitative_comparison",
    problem: "Circle has radius 5. What is its area?",
    studentAnswer: "10π",
    correctAnswer: "25π",
    explanation: "Used circumference formula (2πr) instead of area (πr²). With r=5: A = π(5)² = 25π.",
    protocolElements: ["concept_circle_formulas", "rules_area_equals_pi_r_squared", "rules_circumference_equals_2_pi_r", "mistake_confusing_formulas"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    reviewDueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    reviewed: true,
  },
  {
    id: "err3",
    userId: "user1",
    topic: "algebra_linear_equations",
    subtopic: "solving_linear",
    errorCategory: "sign_error",
    sourceReference: "Manhattan Prep 5LB Ch. 6, Problem 87",
    questionType: "quantitative_comparison",
    problem: "If -2x > 8, what values of x satisfy this?",
    studentAnswer: "x > -4",
    correctAnswer: "x < -4",
    explanation: "When dividing by negative, FLIP the inequality. -2x > 8 → x < -4. Student forgot to flip.",
    protocolElements: ["concept_inequalities_sign_flip", "rule_flip_when_divide_by_negative", "steps_identify_divisor_sign", "trap_easy_to_miss_under_time_pressure"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    reviewDueDate: new Date(Date.now()),
    reviewed: false,
  },
  {
    id: "err4",
    userId: "user1",
    topic: "data_analysis_probability",
    subtopic: "probability_basics",
    errorCategory: "probability_trap",
    sourceReference: "GRE Math Review, Chapter 11, Probability Section",
    questionType: "multiple_choice_single",
    problem: "What is P(at least one heads in 3 coin flips)?",
    studentAnswer: "0.5 + 0.5 + 0.5 = 1.5",
    correctAnswer: "7/8",
    explanation: "Cannot add probabilities directly. Use complement: P(at least one) = 1 - P(none) = 1 - (1/2)³ = 7/8.",
    protocolElements: ["concept_probability_complement", "rule_at_least_one_use_complement", "mistake_adding_probabilities_directly", "trap_probabilities_dont_add"],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    reviewDueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    reviewed: false,
  },
  {
    id: "err5",
    userId: "user1",
    topic: "algebra_linear_equations",
    subtopic: "solving_linear",
    errorCategory: "variable_setup_error",
    sourceReference: "GRE Math Review, Word Problems",
    questionType: "numeric_entry",
    problem: "John has 5 times as many apples as Mary. Together they have 30. How many does John have?",
    studentAnswer: "5",
    correctAnswer: "25",
    explanation: "Let x = Mary's apples. John has 5x. x + 5x = 30 → x = 5. John has 5(5) = 25. Student found x, not 5x.",
    protocolElements: ["concept_variable_setup", "mistake_solving_for_wrong_quantity", "takeaway_answer_the_question_asked", "step_check_what_variable_represents"],
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    reviewDueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    reviewed: true,
  },
  {
    id: "err6",
    userId: "user1",
    topic: "data_analysis_interpretation",
    subtopic: "data_charts_interpretation",
    errorCategory: "reading_comprehension",
    sourceReference: "Manhattan Prep 5LB Ch. 12, Problem 345",
    questionType: "multiple_choice_single",
    problem: "Chart shows thousands on y-axis. Value for 2020 reads as 45. What's the actual number?",
    studentAnswer: "45",
    correctAnswer: "45000",
    explanation: "Y-axis is in thousands, so multiply: 45 × 1000 = 45,000. Student forgot scale factor.",
    protocolElements: ["concept_reading_axes", "rule_always_note_scale_first", "steps_identify_units_multiply", "trap_easy_to_forget_under_pressure"],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    reviewDueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    reviewed: true,
  },
  {
    id: "err7",
    userId: "user1",
    topic: "geometry_triangles",
    subtopic: "pythagorean_theorem",
    errorCategory: "computational_geometry",
    sourceReference: "Official GRE Guide Math Practice Set 2",
    questionType: "quantitative_comparison",
    problem: "Right triangle with legs 3 and 4. What's the hypotenuse?",
    studentAnswer: "7",
    correctAnswer: "5",
    explanation: "Use Pythagorean theorem: c² = 3² + 4² = 9 + 16 = 25 → c = 5. Student added instead of using the theorem.",
    protocolElements: ["concept_pythagorean_theorem", "rule_a_squared_plus_b_squared_equals_c_squared", "steps_substitute_and_solve"],
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    reviewDueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    reviewed: true,
  },
  {
    id: "err8",
    userId: "user1",
    topic: "arithmetic_percent",
    subtopic: "percent_change",
    errorCategory: "conceptual_misunderstanding",
    sourceReference: "Manhattan Prep 5LB Ch. 3, Problem 120",
    questionType: "numeric_entry",
    problem: "Price rises 20% then falls 20%. Final price vs original?",
    studentAnswer: "Same",
    correctAnswer: "Lower",
    explanation: "Increases and decreases apply to different base amounts. If $100 → $120 → $96. Not symmetric!",
    protocolElements: ["concept_percent_change_basis", "rule_percent_change_applies_to_current_amount", "trap_assuming_symmetry"],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    reviewDueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    reviewed: true,
  },
];

// Daily Check-ins: Realistic 14-day history
export const mockDailyCheckIns: DailyCheckIn[] = [
  { id: "ci1", userId: "user1", date: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000), taskCompletionPercent: 75, minutesSpent: 62, wordsLearned: 8, emotion: "neutral", notes: "" },
  { id: "ci2", userId: "user1", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), taskCompletionPercent: 85, minutesSpent: 58, wordsLearned: 12, emotion: "confident", notes: "" },
  { id: "ci3", userId: "user1", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), taskCompletionPercent: 60, minutesSpent: 45, wordsLearned: 5, emotion: "frustrated", notes: "Circles problems still tricky" },
  { id: "ci4", userId: "user1", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), taskCompletionPercent: 0, minutesSpent: 0, wordsLearned: 0, emotion: null, notes: "Rest day" },
  { id: "ci5", userId: "user1", date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), taskCompletionPercent: 90, minutesSpent: 70, wordsLearned: 15, emotion: "confident", notes: "" },
  { id: "ci6", userId: "user1", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), taskCompletionPercent: 70, minutesSpent: 55, wordsLearned: 10, emotion: "neutral", notes: "" },
  { id: "ci7", userId: "user1", date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), taskCompletionPercent: 80, minutesSpent: 65, wordsLearned: 11, emotion: "neutral", notes: "" },
  { id: "ci8", userId: "user1", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), taskCompletionPercent: 75, minutesSpent: 60, wordsLearned: 9, emotion: "confident", notes: "" },
  { id: "ci9", userId: "user1", date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), taskCompletionPercent: 65, minutesSpent: 50, wordsLearned: 7, emotion: "frustrated", notes: "Inequalities difficult" },
  { id: "ci10", userId: "user1", date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), taskCompletionPercent: 85, minutesSpent: 68, wordsLearned: 13, emotion: "confident", notes: "" },
  { id: "ci11", userId: "user1", date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), taskCompletionPercent: 0, minutesSpent: 0, wordsLearned: 0, emotion: null, notes: "Rest day" },
  { id: "ci12", userId: "user1", date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), taskCompletionPercent: 72, minutesSpent: 58, wordsLearned: 10, emotion: "neutral", notes: "" },
  { id: "ci13", userId: "user1", date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), taskCompletionPercent: 0, minutesSpent: 0, wordsLearned: 0, emotion: "overwhelmed", notes: "Missed day—too much work" },
  { id: "ci14", userId: "user1", date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000), taskCompletionPercent: 80, minutesSpent: 63, wordsLearned: 12, emotion: "confident", notes: "" },
];

// Coach Messages: 3 full protocol-compliant examples + 1 supportive
export const mockCoachMessages: CoachMessage[] = [
  {
    id: "coach1",
    userId: "user1",
    topic: "geometry_circles",
    subtopic: "circle_properties",
    userQuestion: "I keep confusing inscribed angles and central angles. Can you explain the difference?",
    coachResponse: `Let me break this down step by step using the protocol:

1. **Identify the Concept**: Inscribed angles and central angles are two ways to measure angles in a circle.

2. **Define the Rule**: 
   - Central angle: vertex is at the center O of the circle
   - Inscribed angle: vertex is on the circle itself, not at center
   - Inscribed Angle Theorem: A central angle is exactly TWICE the inscribed angle that subtends the same arc

3. **Show the Steps**:
   - Step 1: Identify which angle is central (vertex at center) and which is inscribed (vertex on circle)
   - Step 2: If you know the central angle, divide by 2 to get inscribed angle
   - Step 3: If you know the inscribed angle, multiply by 2 to get central angle

4. **Compute**: Let's say an arc is 100°. The central angle is 100°. The inscribed angle = 100° ÷ 2 = 50°

5. **Check**: Does it work? Yes. The inscribed angle (50°) × 2 = central angle (100°). ✓

6. **State the Answer**: Central angle = 2 × inscribed angle (for the same arc)

7. **Extract Takeaway**: Always identify WHERE the vertex is. That determines which angle you have. When in doubt, draw it.

8. **Flag the Trap**: Common trap is thinking they're equal. They're not—one is double the other. Many students miss this under pressure.`,
    protocolCompliant: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: "coach2",
    userId: "user1",
    topic: "algebra_linear_equations",
    subtopic: "solving_linear",
    userQuestion: "Why did I get the inequality backwards in that problem?",
    coachResponse: `Perfect question. Let me walk through the protocol for inequality signs:

1. **Identify the Concept**: Inequality operations and the sign-flip rule.

2. **Define the Rule**: When you multiply or divide both sides of an inequality by a NEGATIVE number, you must flip the direction of the inequality sign.

3. **Show the Steps**:
   - Start: -2x > 8
   - Divide both sides by -2
   - Divide left side: -2x ÷ (-2) = x
   - Divide right side: 8 ÷ (-2) = -4
   - FLIP: x < -4 (not x > -4)

4. **Compute**: Check with x = -5 (should satisfy x < -4). -2(-5) = 10. Is 10 > 8? Yes ✓

5. **Check**: Test x = -3 (should NOT satisfy). -2(-3) = 6. Is 6 > 8? No ✓

6. **State the Answer**: x < -4

7. **Extract Takeaway**: Flip the sign EVERY TIME you multiply/divide by negative. No exceptions. This is non-negotiable.

8. **Flag the Trap**: Under time pressure, many students forget the flip. It's the #1 inequality mistake on the GRE.`,
    protocolCompliant: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "coach3",
    userId: "user1",
    topic: "data_analysis_probability",
    subtopic: "probability_basics",
    userQuestion: "What's the complement rule and when do I use it?",
    coachResponse: `The complement rule is one of the most useful probability shortcuts. Here's the full explanation:

1. **Identify the Concept**: Probability complements and the complement rule.

2. **Define the Rule**: P(at least one event happens) = 1 - P(no events happen). The complement of "at least one" is "none."

3. **Show the Steps**:
   - Identify what "at least one" means (could be 1, 2, 3, ... all the way up)
   - Computing that directly is hard
   - Instead, find the probability of the opposite: "none at all"
   - Subtract from 1

4. **Compute Example**: 3 coin flips, P(at least one heads)?
   - P(no heads) = P(all tails) = (1/2)³ = 1/8
   - P(at least one heads) = 1 - 1/8 = 7/8

5. **Check**: List outcomes: HHH, HHT, HTH, HTT, THH, THT, TTH, TTT. 7 have at least one H. 7/8 ✓

6. **State the Answer**: Use complement for "at least one" questions.

7. **Extract Takeaway**: Anytime you see "at least one," consider the complement. It's faster than adding all possibilities.

8. **Flag the Trap**: Students try to add probabilities directly: 0.5 + 0.5 + 0.5 = 1.5 (wrong!). Probabilities don't add this way.`,
    protocolCompliant: true,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: "coach4",
    userId: "user1",
    topic: "arithmetic_fractions",
    subtopic: "fraction_operations",
    userQuestion: "I'm struggling with fractions. What should I focus on?",
    coachResponse: `Great question. You're at 78% accuracy on fractions, which is solid—you're in the "proficient" zone. Here's what I recommend: you've mastered the basics (common denominators, operations). Now focus on speed drills with harder denominators. Also, practice mixed numbers—that's where students usually slip. You have 8 days until this topic comes up again in the plan. Want me to explain the tricky part about converting improper fractions?`,
    protocolCompliant: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

// User Profile: Realistic after 2 weeks of study with extended timeline for Month 4
export const mockUserProfile: UserProfile = {
  id: "user1",
  name: "Scholar",
  email: "scholar@example.com",
  startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  targetGREDate: new Date(Date.now() + 130 * 24 * 60 * 60 * 1000),
  weeklyHoursTarget: 12,
  weakAreasFromOnboarding: ["geometry_circles", "algebra_linear_equations", "data_analysis_probability"],
};

// Study Plan: Currently in Week 1, on track through Month 4
export const mockStudyPlan: StudyPlan = {
  id: "plan1",
  userId: "user1",
  planName: `GregMat "I'm Overwhelmed" + Month 4 Testing & Strategy`,
  startDate: mockUserProfile.startDate,
  targetGREDate: mockUserProfile.targetGREDate,
  daysRemaining: 130,
  currentWeekNumber: 1,
  currentModuleId: "mod1",
  currentPartId: "mod1_p1",
  modules: mockModules,
  phase: "foundation" as const,
  isLate: false,
  latenessState: "on_track" as const,
  recoveryDeadline: null,
};

// Concept prerequisites showing mastery gates for structured learning
export const mockConceptPrerequisites: ConceptPrerequisite[] = [
  {
    subtopic: "quadratic_formula" as const,
    prerequisiteSubtopic: "polynomial_operations" as const,
    reason: "You must understand polynomial expansion and factoring to solve quadratics efficiently",
    minimumMasteryRequired: "proficient" as const,
  },
  {
    subtopic: "compound_inequalities" as const,
    prerequisiteSubtopic: "solving_linear" as const,
    reason: "Linear equation solving is the foundation for inequality solutions",
    minimumMasteryRequired: "proficient" as const,
  },
  {
    subtopic: "circle_properties" as const,
    prerequisiteSubtopic: "angle_relationships" as const,
    reason: "Understanding angle types is essential for inscribed and central angle relationships",
    minimumMasteryRequired: "developing" as const,
  },
  {
    subtopic: "radical_operations" as const,
    prerequisiteSubtopic: "exponent_rules" as const,
    reason: "Exponent rules apply to fractional exponents, which are roots",
    minimumMasteryRequired: "proficient" as const,
  },
];

// Error pattern analysis showing patterns of mistakes
export const mockErrorPatterns: ErrorPatternAnalysis[] = [
  {
    userId: "user1",
    errorCategory: "sign_error" as const,
    totalOccurrences: 2,
    affectedSubtopics: ["solving_linear" as const, "compound_inequalities" as const],
    commonTriggersAndTraps: ["Forgetting to flip inequality sign when multiplying by negative", "Careless sign flip on negative terms"],
    masteryGate: "careless_mistake" as const,
  },
  {
    userId: "user1",
    errorCategory: "conceptual_misunderstanding" as const,
    totalOccurrences: 1,
    affectedSubtopics: ["probability_basics" as const, "percent_change" as const],
    commonTriggersAndTraps: ["Assuming symmetry in percentage changes", "Misunderstanding complement rule"],
    masteryGate: "concept_unknown" as const,
  },
  {
    userId: "user1",
    errorCategory: "reading_comprehension" as const,
    totalOccurrences: 1,
    affectedSubtopics: ["data_charts_interpretation" as const],
    commonTriggersAndTraps: ["Forgetting to check axis scale", "Misreading chart units"],
    masteryGate: "careless_mistake" as const,
  },
];
