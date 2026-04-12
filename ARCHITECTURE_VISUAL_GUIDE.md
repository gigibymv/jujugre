# 🎓 GRE Tutor App: Architecture at a Glance

## The Foundation: Official GRE Curriculum (From Materials)

```
┌─────────────────────────────────────────────────────────────┐
│  ETS Official GRE Quantitative Reasoning Curriculum         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ARITHMETIC              ALGEBRA           GEOMETRY           │
│  ───────────              ──────           ────────           │
│  • Integers              • Expressions     • Lines            │
│  • Fractions             • Exponents       • Triangles        │
│  • Decimals              • Equations       • Circles          │
│  • Exponents             • Inequalities    • 3D Solids        │
│  • Ratio                 • Quadratics      • Polygons         │
│  • Percent               • Functions                         │
│                          • Coordinate Geo                    │
│                                                               │
│  DATA ANALYSIS                                               │
│  ──────────────                                              │
│  • Statistics                                                │
│  • Probability                                               │
│  • Counting                                                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
                              ↓
            (Extracted to lib/data-schema.ts)
                              ↓
                              ↓
```

## 12-Week Foundation Plan (4-Month Total)

```
FOUNDATION PHASE (Weeks 1-12)    STRATEGY PHASE (Week 13+)
┌──────────────────────────────┐  ┌──────────────────────┐
│                              │  │ Full-Length Tests   │
│ Week 1: Integers             │  │ Weak-Area Drills   │
│ Week 2: Fractions            │  │ Timed Practice     │
│ Week 3: Decimals             │  │ Strategy Refinement│
│ Week 4: Ratio & Percent      │  │                     │
│ Week 5: Exponents & Roots    │  │     (1 Month)      │
│ Week 6-8: Algebra (3 weeks)  │  └──────────────────────┘
│ Week 9: Coordinate Geometry  │
│ Week 10-11: Geometry (2 wks) │
│ Week 12: Data Analysis       │
│                              │
│    (12 Weeks)                │
└──────────────────────────────┘
```

## Module Structure (12 × 4 Parts)

```
Each Module: 4 Parts (Each ~1.5 hours)

Module 1: Integers
├── Part 1: Factors, Multiples & Divisibility
│   ├── Task: Watch lesson (35 min)
│   └── Task: Practice problems (25 min)
├── Part 2: LCM & GCD
│   ├── Task: Watch lesson (40 min)
│   └── Task: Practice problems (30 min)
├── Part 3: Prime Factorization
│   ├── Task: Watch lesson (30 min)
│   └── Task: Drill practice (20 min)
└── Part 4: Properties & Applications
    ├── Task: Review concepts (25 min)
    └── Task: Word problems (35 min)

Module 2: Fractions
├── Part 1: Fraction Basics
├── Part 2: Addition & Subtraction
├── Part 3: Multiplication & Division
└── Part 4: Ordering & Word Problems

... (10 more modules follow same pattern)
```

## Data Types (lib/data-schema.ts)

```typescript
// Official Topics (31 total)
QuantTopic
├── arithmetic_integers
├── arithmetic_fractions
├── arithmetic_decimals
├── arithmetic_exponents_roots
├── arithmetic_ratio_proportion
├── arithmetic_percent
├── algebra_expressions
├── algebra_exponents_rules
├── algebra_linear_equations
├── algebra_inequalities
├── algebra_quadratic_equations
├── algebra_functions
├── algebra_coordinate_geometry
├── algebra_graphing
├── geometry_lines_angles
├── geometry_triangles
├── geometry_quadrilaterals
├── geometry_circles
├── geometry_3d_solids
├── data_analysis_statistics
├── data_analysis_probability
├── data_analysis_counting
└── ... (9 more)

// Real Error Categories (20+)
ErrorCategory
├── computational_arithmetic
├── computational_algebra
├── conceptual_misunderstanding
├── angle_arc_confusion
├── probability_trap
├── sign_error
├── negative_number_error
├── absolute_value_error
├── fraction_decimal_confusion
└── ... (12 more)
```

## Mock Data: User's Current State

```
Week 2, Module 2 (Fractions), Part 1
↓
┌─────────────────────────────────────────┐
│ User: Julie                              │
├─────────────────────────────────────────┤
│ • Target GRE Date: 4 months away       │
│ • Weak Areas: Circles, Probability     │
│ • Study Capacity: 60 min/day, 5x/week  │
│ • Current Progress: Week 2 (1 week done) │
└─────────────────────────────────────────┘

Weekly Tasks Status:
├── Week 1: ✅ Complete (Integers)
├── Week 2: 🔄 In Progress (Fractions)
│   ├── Part 1: In Progress
│   ├── Part 2: Not Started
│   ├── Part 3: Not Started
│   └── Part 4: Not Started
└── Weeks 3-12: Not Started

Error Log (Real Mistakes):
├── ❌ Inscribed Angle ≠ Central Angle
│   └── Needs Review (2 days)
├── ❌ LCM Calculation Error
│   └── Reviewed ✓
├── ❌ Inequality Sign Flip
│   └── Needs Review (5 days)
└── ❌ Probability "At Least" Trap
    └── Needs Review (7 days)

Topic Mastery:
├── 🟡 Geometry Circles (62% accuracy)
│   └── Recommend: Review inscribed angles
├── 🟡 Data Probability (0% - not started)
│   └── Recommend: Foundation lesson
└── 🟢 Arithmetic Integers (87% accuracy)
    └── Status: Moving ahead ✓
```

## Error Pattern Examples

```
Real GRE Mistakes (from Materials)

1. INSCRIBED ANGLE TRAP
   Student thinks: Inscribed angle = Central angle
   Reality: Inscribed angle = (1/2) × Central angle
   ❌ Result: Off by 2x

2. LCM CALCULATION ERROR
   Student calculates: LCM(30, 75) = 30 × 75 = 2250
   Reality: Prime factorization → highest powers → 150
   ❌ Result: Way too large

3. INEQUALITY SIGN FLIP
   Student solves: -2x > 6 → x > -3
   Reality: Must flip sign → x < -3
   ❌ Result: Wrong direction

4. PROBABILITY "AT LEAST" TRAP
   Student calculates: P(exactly one 6)
   Problem asks: P(at least one 6)
   Reality: Use complement rule → 1 - P(no 6s)
   ❌ Result: Wrong magnitude
```

## Coach Response Protocol

```
When Student Asks: "Help me with inscribed angles"

Coach Response:
┌──────────────────────────────────────────┐
│ 1. CONCEPT                               │
│    "This tests inscribed angle theorem"  │
├──────────────────────────────────────────┤
│ 2. RULE                                  │
│    "Inscribed angle = (1/2) × central    │
│    angle for the same arc"               │
├──────────────────────────────────────────┤
│ 3. STEPS                                 │
│    • Identify the intercepted arc        │
│    • Find the central angle              │
│    • Divide by 2                         │
├──────────────────────────────────────────┤
│ 4. CHECK                                 │
│    "If central = 120°, inscribed = 60°.  │
│    That's half, so it checks out."       │
├──────────────────────────────────────────┤
│ 5. ANSWER                                │
│    "The inscribed angle is 60°"          │
├──────────────────────────────────────────┤
│ 6. TAKEAWAY                              │
│    "Remember: inscribed = half central   │
│    angle (same arc). Always."            │
├──────────────────────────────────────────┤
│ 7. TRAP                                  │
│    "Common mistake: Students often       │
│    confuse these and think they're equal.│
│    They never are!"                      │
└──────────────────────────────────────────┘
```

## Future Ingestion Pipeline

```
PDF Upload:
Official_GRE_Math_Review.pdf
        ↓
    ┌───────────────────────────────┐
    │  Phase 1: Parse              │
    │  Extract concept blocks       │
    │  + worked examples            │
    │  + problems + solutions       │
    └───────────────────────────────┘
        ↓
    ┌───────────────────────────────┐
    │  Phase 2: Tag Topics          │
    │  Rule-based extraction        │
    │  LLM verification             │
    │  Human review layer           │
    └───────────────────────────────┘
        ↓
    ┌───────────────────────────────┐
    │  Phase 3: Index               │
    │  Store problem blocks         │
    │  Add retrieval tags           │
    │  Enable search                │
    └───────────────────────────────┘
        ↓
    ┌───────────────────────────────┐
    │  Phase 4: Generate Drills     │
    │  Smart sequencing             │
    │  Adaptive difficulty          │
    │  Personalized to weak areas   │
    └───────────────────────────────┘
        ↓
    ┌───────────────────────────────┐
    │  Phase 5: Enrich Coach        │
    │  Pull official explanations   │
    │  Show concept linkages        │
    │  Make recommendations         │
    └───────────────────────────────┘

Result: 300+ new practice problems
        ready for adaptive learning
```

## App Architecture Layers

```
┌─────────────────────────────────────────┐
│          UI Layer (To Build)             │
│  Dashboard | Plan | Topics | Errors | Coach │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│      TypeScript Type Layer               │
│      (lib/data-schema.ts)                │
│  • QuantTopic enum (31 official)         │
│  • QuantSubtopic enum (30+)              │
│  • ErrorCategory enum (20+)              │
│  • Module, Task, TopicMastery types      │
│  • ErrorLogEntry, CoachMessage types     │
│  • SourceMaterial, ProblemBlock types    │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│     Mock Data Layer (Realistic)          │
│      (lib/mock-data.ts)                  │
│  • User: Week 2 progress                 │
│  • 4 Real error entries                  │
│  • Topic mastery signals                 │
│  • Coach conversation example            │
│  • Study plan structure                  │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│     Future Persistence Layer             │
│  • Database (not yet implemented)        │
│  • PDF ingestion (designed, not built)   │
│  • Drill generation (designed, not built)│
└─────────────────────────────────────────┘
```

## File Dependency Map

```
lib/data-schema.ts (Official taxonomy)
    ↑
    ├── Referenced by: Every component
    └── Used in: Type safety, validation

lib/mock-data.ts (Realistic data)
    ↑
    ├── Uses: lib/data-schema.ts types
    ├── Referenced by: Component development
    └── Enables: Building without database

QUANT_ARCHITECTURE.md (Module structure)
    ↑
    ├── Source: Official materials
    └── Reference: Building study plan view

INGESTION_ARCHITECTURE.md (Future plan)
    ↑
    ├── Based on: lib/data-schema.ts types
    ├── Depends on: QUANT_ARCHITECTURE.md
    └── Target: PDF parsing + problem indexing

GRE_MATERIALS_MAPPING.md (Decision rationale)
    ↑
    └── Reference: Every design question
```

## Quality Checklist

```
✅ Official: All 31 topics from ETS Math Review
✅ Grounded: Error categories from practice materials
✅ Realistic: Mock data shows plausible user state
✅ Structured: 12 modules × 4 parts × 2-3 tasks each
✅ Documented: Every design traced to sources
✅ Ready: Schema designed for future ingestion
✅ Extensible: Bounded taxonomy, not open-ended
✅ Rigorous: Coach protocol follows official standards
```

## What's Ready vs What's Not

```
READY ✅                          NOT YET ⏳
──────────                        ──────────
✅ Topic taxonomy                  ⏳ Dashboard UI
✅ Module structure                ⏳ Study Plan UI
✅ Data types (schema)             ⏳ Error Log UI
✅ Mock data                       ⏳ Coach Interface
✅ Error categories                ⏳ Database layer
✅ Documentation                   ⏳ Ingestion pipeline
                                   ⏳ Drill generation
```

---

**The foundation is set. Build confidently.**
