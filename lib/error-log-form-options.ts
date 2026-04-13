import type { ErrorCategory, QuantSubtopic, QuestionType } from '@/lib/data-schema';

/** Compact labels for the add-error form (full taxonomy in data-schema). */
export const ERROR_CATEGORY_OPTIONS: { value: ErrorCategory; label: string }[] = [
  { value: 'conceptual_misunderstanding', label: 'Concept — misunderstood the idea' },
  { value: 'formula_misapplication', label: 'Formula — wrong rule or wrong use' },
  { value: 'sign_error', label: 'Sign — inequality or negative slip' },
  { value: 'computational_arithmetic', label: 'Arithmetic slip' },
  { value: 'computational_algebra', label: 'Algebra manipulation slip' },
  { value: 'computational_geometry', label: 'Geometry calculation slip' },
  { value: 'fraction_decimal_confusion', label: 'Fraction / decimal / percent' },
  { value: 'probability_trap', label: 'Probability trap' },
  { value: 'variable_setup_error', label: 'Variable / setup (word problem)' },
  { value: 'exponent_rule_error', label: 'Exponent / root rules' },
  { value: 'geometric_property_error', label: 'Geometry property / theorem' },
  { value: 'angle_arc_confusion', label: 'Angle vs arc / circle' },
  { value: 'reading_comprehension', label: 'Misread the question' },
  { value: 'strategy_error', label: 'Strategy / approach' },
  { value: 'units_error', label: 'Units' },
  { value: 'negative_number_error', label: 'Negative numbers' },
  { value: 'absolute_value_error', label: 'Absolute value' },
  { value: 'axis_label_confusion', label: 'Graph / axis / scale' },
  { value: 'boundary_error', label: 'Boundary / constraint' },
  { value: 'estimation_precision', label: 'Estimation / rounding' },
];

export const SUBTOPIC_OPTIONS: { value: QuantSubtopic; label: string }[] = [
  { value: 'factors_multiples_divisibility', label: 'Integers — factors & divisibility' },
  { value: 'fraction_operations', label: 'Fractions — operations' },
  { value: 'percent_change', label: 'Percent change' },
  { value: 'ratio_rates', label: 'Ratios & rates' },
  { value: 'solving_linear', label: 'Linear equations' },
  { value: 'compound_inequalities', label: 'Inequalities' },
  { value: 'quadratic_formula', label: 'Quadratics' },
  { value: 'function_notation', label: 'Functions' },
  { value: 'coordinate_distance', label: 'Coordinate distance / geometry' },
  { value: 'angle_relationships', label: 'Lines & angles' },
  { value: 'triangle_similarity', label: 'Triangles & similarity' },
  { value: 'pythagorean_theorem', label: 'Pythagorean theorem' },
  { value: 'circle_properties', label: 'Circles' },
  { value: 'volume_surface_area', label: '3D volume / surface area' },
  { value: 'mean_median_mode', label: 'Statistics — mean / median' },
  { value: 'probability_basics', label: 'Probability basics' },
  { value: 'conditional_probability', label: 'Conditional probability' },
  { value: 'permutations_combinations', label: 'Counting' },
  { value: 'data_charts_interpretation', label: 'Charts & data interpretation' },
];

export const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: 'multiple_choice_single', label: 'Multiple choice (one answer)' },
  { value: 'multiple_choice_multiple', label: 'Multiple choice (several answers)' },
  { value: 'numeric_entry', label: 'Numeric entry' },
  { value: 'quantitative_comparison', label: 'Quantitative comparison' },
  { value: 'data_interpretation', label: 'Data interpretation set' },
];
