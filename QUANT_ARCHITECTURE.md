# Quant Architecture for GRE Tutor App

## Source Material Analysis

### Official GRE Quant Topic Structure
From "The Official Guide to the GRE" and official materials, the quant section covers:

#### 1. ARITHMETIC
- **1.1 Integers**: Factors, multiples, divisibility, divisors, LCM, GCD
- **1.2 Fractions**: Operations, simplification, ordering
- **1.3 Exponents and Roots**: Integer/rational exponents, roots, properties
- **1.4 Decimals**: Conversion, operations, rounding
- **1.5 Real Numbers**: Number line, ordering, absolute value
- **1.6 Ratio**: Proportions, rates, similar figures
- **1.7 Percent**: Percentage calculations, percent change, increases/decreases

#### 2. ALGEBRA
- **2.1 Algebraic Expressions**: Polynomials, factoring, expanding, simplification
- **2.2 Rules of Exponents**: Power rules, multiplication/division rules
- **2.3 Solving Linear Equations**: Isolating variables, applications
- **2.4 Solving Quadratic Equations**: Factoring, quadratic formula, discriminant
- **2.5 Solving Linear Inequalities**: Solution sets, compound inequalities, graphing
- **2.6 Functions**: Domain, range, evaluation, transformations
- **2.7 Applications**: Word problems, modeling
- **2.8 Coordinate Geometry**: Points, slopes, lines, distances, midpoints
- **2.9 Graphs of Functions**: Parabolas, transformations, reflections

#### 3. GEOMETRY
- **3.1 Lines and Angles**: Angle relationships, parallel lines, angle sums
- **3.2 Polygons**: Perimeter, area, interior angles, properties
- **3.3 Triangles**: Angle sums, special triangles (30-60-90, 45-45-90), similarity, Pythagorean theorem
- **3.4 Quadrilaterals**: Rectangles, parallelograms, trapezoids, area formulas
- **3.5 Circles**: Circumference, area, central angles, arcs, chords
- **3.6 Three-Dimensional Figures**: Volume, surface area, solid properties

#### 4. DATA ANALYSIS
- **4.1 Methods for Presenting Data**: Tables, graphs, charts, distributions
- **4.2 Numerical Methods for Describing Data**: Mean, median, mode, range, standard deviation, quartiles
- **4.3 Counting Methods**: Permutations, combinations, factorials
- **4.4 Probability**: Basic probability, compound events, independence
- **4.5 Distributions of Data**: Frequency distributions, normal distribution
- **4.6 Data Interpretation**: Reading and analyzing charts, inference

### Question Type Taxonomy (from Official GRE)

1. **Quantitative Comparison (QC)**: Compare Quantity A to Quantity B
   - Answer choices: A > B, B > A, Equal, Cannot be determined
   
2. **Multiple Choice – Single Answer**: Select one correct answer from 5 options

3. **Multiple Choice – Multiple Answers**: Select all correct answers (usually 2-3 of ~5 options)

4. **Numeric Entry**: Enter exact number or expression (integer or decimal)

5. **Data Interpretation Sets**: 3-4 questions based on single data display

### Error Categories (from practice materials)

#### Computational Errors
- Arithmetic miscalculation
- Order of operations mistake
- Sign error (+ vs -)
- Decimal place error
- Fraction simplification error

#### Conceptual Misunderstandings
- Misunderstanding the problem statement
- Incorrect formula application
- Confusion between similar concepts (e.g., median vs mean)
- Incorrect variable setup in word problems
- Wrong geometric property applied

#### Common Traps
- Absolute value handling
- Negative number operations
- Fraction vs decimal confusion
- Exponent rules misapplication
- Probability trap: "at least" vs "exactly"
- Data interpretation: confusing axis labels
- Geometry: angle vs arc confusion

#### Strategy Errors
- Not using answer choices to work backwards
- Missing the faster computational method
- Overcomplicating when estimation suffices
- Not checking units in word problems

## 12-Week Module Structure (GregMat "I'm Overwhelmed")

### Foundation Phase (Weeks 1-12, Months 1-3)

#### Module 1: Integers & Divisibility (Week 1)
- Part 1: Factors, multiples, divisibility
- Part 2: LCM and GCD
- Part 3: Prime factorization
- Part 4: Properties and applications

#### Module 2: Fractions (Week 2)
- Part 1: Fraction basics, simplification
- Part 2: Fraction operations (add, subtract)
- Part 3: Fraction operations (multiply, divide)
- Part 4: Ordering and word problems

#### Module 3: Decimals & Rounding (Week 3)
- Part 1: Decimal conversion and operations
- Part 2: Rounding and approximation
- Part 3: Decimal in word problems
- Part 4: Mixed operations

#### Module 4: Ratio & Proportion (Week 4)
- Part 1: Ratio fundamentals
- Part 2: Proportion and rates
- Part 3: Percentage basics
- Part 4: Percent change and applications

#### Module 5: Exponents & Roots (Week 5)
- Part 1: Exponent fundamentals
- Part 2: Exponent rules
- Part 3: Roots and radical operations
- Part 4: Combining exponents and roots

#### Module 6: Linear Equations & Inequalities (Week 6)
- Part 1: Solving linear equations
- Part 2: Solving linear inequalities
- Part 3: Compound inequalities
- Part 4: Word problems

#### Module 7: Quadratic Equations (Week 7)
- Part 1: Factoring and solving
- Part 2: Quadratic formula
- Part 3: Properties of quadratics
- Part 4: Applications

#### Module 8: Algebra – Advanced (Week 8)
- Part 1: Algebraic expressions
- Part 2: Factoring techniques
- Part 3: Polynomial operations
- Part 4: Systems of equations

#### Module 9: Coordinate Geometry (Week 9)
- Part 1: Points and distance
- Part 2: Slopes and lines
- Part 3: Graphing lines
- Part 4: Intersections and applications

#### Module 10: Geometry Fundamentals (Week 10)
- Part 1: Lines and angles
- Part 2: Triangles (basic properties)
- Part 3: Pythagorean theorem and special triangles
- Part 4: Quadrilaterals and polygons

#### Module 11: Advanced Geometry (Week 11)
- Part 1: Circles (properties and measurements)
- Part 2: Circle equations
- Part 3: 3D solids (volume and surface area)
- Part 4: Coordinate geometry applications

#### Module 12: Data Analysis & Probability (Week 12)
- Part 1: Data interpretation and statistics
- Part 2: Mean, median, mode, range, standard deviation
- Part 3: Probability fundamentals
- Part 4: Combinatorics and conditional probability

### Strategy Phase (Week 13+, Month 4)
- Full-length practice tests
- Targeted weak-area drills
- Test-taking strategy refinement
- Timed drills by topic
- Mock test execution

## Data Ingestion Architecture (Future)

### Source Material Schema
```
SourceMaterial
├── metadata
│   ├── title (e.g., "Official GRE Math Review")
│   ├── source_type (PDF, book, online)
│   ├── ingestion_date
│   └── edition_info
├── chapters/sections
│   ├── concept_blocks (each major concept)
│   │   ├── concept_name (e.g., "Prime Factorization")
│   │   ├── topic_mapping (arithmetic > integers)
│   │   ├── subtopic_mapping
│   │   ├── definition_text
│   │   ├── examples (structured)
│   │   ├── worked_problems (problem + solution)
│   │   └── common_mistakes
│   └── problem_blocks
│       ├── problem_id
│       ├── question_text
│       ├── question_type (QC, MC-single, MC-multi, numeric, DI-set)
│       ├── topic_tags (multi-topic possible)
│       ├── subtopic_tags
│       ├── difficulty_level (easy, medium, hard)
│       ├── answer_key
│       ├── explanation
│       ├── time_estimate
│       ├── common_errors_addressed
│       └── retrieval_tags (for drill generation)
```

### Topic Mapping Strategy
- Each problem tagged with primary + secondary topics
- Each concept linked to modules/parts
- Each explanation linked to possible misconceptions
- Difficulty cascades for progression

### Retrieval & Drill Generation
- Filter by: topic, subtopic, difficulty, question type, time constraint
- Adaptive sequencing based on error patterns
- Spaced repetition based on mastery decay
- Interleaving similar vs different concepts

## Mock Data Population Strategy

### User Profile
- Single user: Julie
- Target GRE date: 4 months from start
- Prep start date: calculated from current context
- Study capacity: 60 minutes/day, 5 days/week
- Current weak areas: (seeded from realistic struggles)
- Confidence level: moderate

### Realistic Progress States
- Week indicator (current week in program)
- Module completion status (tasks: started, in-progress, complete)
- Time spent per module (realistic durations)
- Parts completed vs total per module
- On-time vs behind status

### Topic Mastery Seeding
- Each quant topic initialized with signal from:
  - Tasks completed in that topic
  - Practice questions accuracy (60-90% realistic range)
  - Self-rating (1-5 scale)
  - Error log frequency
- Weak areas highlighted: typically Coordinate Geometry, Circle properties, Probability
- Strong areas: typically Basic Arithmetic, Simple Fractions

### Error Log Seeding
Realistic mistakes tied to:
1. **Common Traps**
   - Positive/negative confusion in exponents
   - Ratio vs rate error
   - Absolute value handling
   - Angle arc confusion

2. **Conceptual** 
   - Quadratic formula sign errors
   - Compound inequality boundary errors
   - Probability "at least" misinterpretation

3. **Computational**
   - GCD/LCM calculation error
   - Decimal rounding mistake
   - Fraction simplification oversight

### Coach Response Patterns
All quant explanations follow protocol:
1. **Concept**: "This question tests understanding of..."
2. **Rule**: "The key principle here is..."
3. **Method**: "Step 1: ... Step 2: ... Step 3: ..."
4. **Computation**: Show all arithmetic carefully
5. **Check**: Verify the answer makes sense
6. **Answer**: State clearly
7. **Takeaway**: What to remember for similar problems
8. **Trap**: "Common mistake: ..."

## V1 Implementation Checklist

- [ ] Topic taxonomy embedded in data layer
- [ ] Module/Part/Task structure implemented
- [ ] 12 modules with 4 parts each seeded
- [ ] Realistic daily task generation
- [ ] Error categories in error log structure
- [ ] Coach response templates matching protocol
- [ ] Mock data: user with 2+ weeks of progress
- [ ] Mock data: 3-5 weak-area error entries
- [ ] Mock data: Topic mastery with realistic signals
- [ ] Difficulty progression in future drill generation ready
- [ ] Source material schema defined for ingestion
- [ ] Retrieval tagging structure prepared

## Future Ingestion Pipeline

1. Upload GRE books/materials
2. Parse PDFs/docs to extract:
   - Concept explanations
   - Worked examples
   - Practice problems
   - Answer explanations
3. Map extracted content to topic taxonomy
4. Tag with difficulty, question type, time estimate
5. Index for retrieval-based drill generation
6. Backfill coach explanation templates
7. Generate recommendations from ingested materials
