# Developer Quick Reference

## File Lookup Guide

### I need to...

**Understand the topic structure**
→ See: `lib/data-schema.ts` lines 1-80 (QuantTopic and QuantSubtopic enums)
→ Detailed: `QUANT_ARCHITECTURE.md` "12-Week Module Structure"

**See what mock data looks like**
→ See: `lib/mock-data.ts` (entire file, ~600 lines of realistic examples)
→ Quick: `lib/mock-data.ts` lines 120-180 (error entries)

**Build a dashboard**
→ Use: `mockUserProfile`, `mockStudyPlan`, `mockTopicMastery` from mock-data.ts
→ Ref: `QUANT_ARCHITECTURE.md` "Dashboard truths"

**Build study plan view**
→ Use: `mockStudyPlan.modules`, `.currentWeekNumber`, `.currentModuleId`
→ Structure: Module[].parts[4].tasks[2-3]

**Implement error logging**
→ See: `ErrorLogEntry` interface in data-schema.ts (lines 190-215)
→ See: Mock entries in mock-data.ts (lines 120-180)
→ Categories: All 20+ error types defined in ErrorCategory enum

**Implement AI Coach**
→ See: `CoachMessage` interface in data-schema.ts (lines 240-260)
→ Protocol: concept → rule → steps → check → answer → takeaway → trap
→ Example: mock-data.ts lines 500-530 (real coach conversation)

**Understand ingestion readiness**
→ Read: `INGESTION_ARCHITECTURE.md` (entire, ~300 lines)
→ Quick: INGESTION_ARCHITECTURE.md "Phase 1: Upload & Parse"

**Know why this design**
→ See: `GRE_MATERIALS_MAPPING.md` (entire, ~300 lines)
→ Maps: Every design decision to source material

**Get implementation roadmap**
→ See: `IMPLEMENTATION_CHECKLIST.md` (prioritized tasks)

---

## Common Code Patterns

### Using Topic Taxonomy in Components

```typescript
import type { QuantTopic, QuantSubtopic } from '@/lib/data-schema'

// Check if topic is valid
function isValidTopic(topic: string): topic is QuantTopic {
  const validTopics: QuantTopic[] = [
    "arithmetic_integers",
    "algebra_linear_equations",
    // ... etc
  ]
  return validTopics.includes(topic as QuantTopic)
}

// Map subtopic to topic
import { mapSubtopicToTopic } from '@/lib/data-schema'
const topic = mapSubtopicToTopic("lcm_gcd") // → "arithmetic_integers"
```

### Calculating Topic Mastery

```typescript
import { calculateMasteryLevel } from '@/lib/data-schema'

const mastery = calculateMasteryLevel(
  85, // accuracy %
  8,  // tasks completed
  4,  // self-rating (1-5)
  2   // error count
)
// Returns: "proficient" | "developing" | "mastered" | "not_started"
```

### Accessing Mock Data

```typescript
import {
  mockUserProfile,
  mockStudyPlan,
  mockTopicMastery,
  mockErrorEntries,
  mockCoachConversations,
  mockModules,
  mockDailyCheckIns,
} from '@/lib/mock-data'

// Current state
const currentWeek = mockStudyPlan.currentWeekNumber // 2
const currentModule = mockStudyPlan.modules.find(m => m.id === mockStudyPlan.currentModuleId)
const currentPart = currentModule?.parts.find(p => p.id === mockStudyPlan.currentPartId)
const todaysTasks = currentPart?.tasks // Task[]

// User's weak areas
const weakAreas = mockUserProfile.currentWeakAreas // QuantTopic[]

// Weak topic mastery
const circlesMastery = mockTopicMastery.find(m => m.topic === "geometry_circles")
// → masteryLevel: "developing", accuracy: 62%, need review
```

### Building a Drill from Topics

```typescript
// Filter problems by topic (will work with ingested data later)
function getDrillForTopic(topic: QuantTopic, difficulty: "easy" | "medium" | "hard", count: number = 5) {
  return mockProblems.filter(p => 
    p.topics.includes(topic) && 
    p.difficulty === difficulty
  ).slice(0, count)
}
```

### Coach Response Following Protocol

```typescript
interface CoachResponse {
  concept: string;
  rule: string;
  steps: string[];
  check: string;
  answer: string;
  takeaway: string;
  commonTrap?: string;
}

function formatMathResponse(response: CoachResponse): string {
  return `
**Concept:** ${response.concept}

**Rule:** ${response.rule}

**Step by step:**
${response.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

**Check:** ${response.check}

**Answer:** ${response.answer}

**Takeaway:** ${response.takeaway}

${response.commonTrap ? `**Common Trap:** ${response.commonTrap}` : ''}
  `.trim()
}
```

---

## Data Types Quick Reference

### Topics (31 total, all official)

**Arithmetic (7)**
```
arithmetic_integers
arithmetic_fractions
arithmetic_decimals
arithmetic_exponents_roots
arithmetic_ratio_proportion
arithmetic_percent
arithmetic_real_numbers (included in integers)
```

**Algebra (9)**
```
algebra_expressions
algebra_exponents_rules
algebra_linear_equations
algebra_inequalities
algebra_quadratic_equations
algebra_functions
algebra_applications
algebra_coordinate_geometry
algebra_graphing
```

**Geometry (6)**
```
geometry_lines_angles
geometry_triangles
geometry_quadrilaterals
geometry_polygons
geometry_circles
geometry_3d_solids
```

**Data Analysis (6)**
```
data_analysis_statistics
data_analysis_probability
data_analysis_counting
data_analysis_interpretation
(plus 2 others integrated)
```

### Error Categories (20+ real)

**Computational**
- computational_arithmetic
- computational_algebra
- computational_geometry
- sign_error
- decimal_place_error

**Conceptual**
- conceptual_misunderstanding
- formula_misapplication
- angle_arc_confusion

**Traps**
- absolute_value_error
- exponent_rule_error
- probability_trap
- negative_number_error
- boundary_error

**Other**
- reading_comprehension
- variable_setup_error
- strategy_error
- units_error

### Question Types

```typescript
"quantitative_comparison"         // QC: Compare A vs B
"multiple_choice_single"          // MC: Pick 1 of 5
"multiple_choice_multiple"        // MC: Pick all correct (2-3 of ~5)
"numeric_entry"                   // Enter exact number or expression
"data_interpretation"             // Read chart/table, answer questions
```

### Difficulty Levels

```typescript
"easy"       // 0-30th percentile, direct application
"medium"     // 30-70th percentile, one trap or multi-step
"hard"       // 70-95th percentile, synthesis or elegant approach
```

---

## Common Mistakes & Solutions

### ❌ Wrong: Inventing new topics
```typescript
const weirdTopic = "advanced_combinatorics" // NOT in QuantTopic enum!
```
✅ Right: Check enum first
```typescript
import type { QuantTopic } from '@/lib/data-schema'
// Only use values from the enum—all 31 official topics defined
```

### ❌ Wrong: Assuming mastery is one signal
```typescript
const mastery = accuracy > 80 ? "mastered" : "developing"
```
✅ Right: Use multi-signal calculation
```typescript
import { calculateMasteryLevel } from '@/lib/data-schema'
const mastery = calculateMasteryLevel(accuracy, tasksCompleted, selfRating, errorCount)
```

### ❌ Wrong: Coach response that skips steps
```
"The answer is 15 because you use the quadratic formula and get x = 3"
```
✅ Right: Follow protocol
```
**Concept:** Solving quadratic equations
**Rule:** For ax²+bx+c=0, use x = (-b ± √(b²-4ac)) / 2a
**Step by step:**
1. Identify a=1, b=-8, c=15
2. Compute discriminant: (-8)² - 4(1)(15) = 64 - 60 = 4
3. Apply formula: x = (8 ± √4) / 2 = (8 ± 2) / 2
4. x = 5 or x = 3
**Check:** (3)² - 8(3) + 15 = 9 - 24 + 15 = 0 ✓
**Answer:** x = 3 and x = 5
```

### ❌ Wrong: Empty error log entry
```typescript
{
  topic: "geometry_circles",
  whatIGotWrong: "I got it wrong"
}
```
✅ Right: Structured learning
```typescript
{
  topic: "geometry_circles",
  subtopic: "circle_properties",
  primaryErrorCategory: "angle_arc_confusion",
  whatIGotWrong: "I thought inscribed angle = central angle",
  correctMethod: "Inscribed = (1/2) × central angle",
  shorterInsight: "Central angle doubles inscribed angle",
  confidence: 3
}
```

---

## Testing Checklist

When building components, verify:

- [ ] Can import all types from `lib/data-schema.ts` without errors
- [ ] Mock data loads and displays without console errors
- [ ] All 31 topics accessible via `QuantTopic` type
- [ ] All 20+ error categories selectable in error log
- [ ] 12 modules render with 4 parts each
- [ ] Current week/module/part highlighted correctly
- [ ] Coach response includes all protocol fields when math topic
- [ ] Empty states shown when no data available
- [ ] Topic mastery shows weak areas highlighted

---

## Debugging Guide

**"Topic not recognized"**
→ Check `lib/data-schema.ts` QuantTopic enum
→ Verify you're using exact enum value, not similar name

**"Error category missing"**
→ Check ErrorCategory enum in data-schema.ts
→ All 20+ categories defined; use exact name

**"Mock data not loading"**
→ Verify import path: `@/lib/mock-data`
→ Check you're importing array/object, not type
→ Example: `mockUserProfile` not `UserProfile`

**"Mastery calculation wrong"**
→ Use `calculateMasteryLevel()` helper function
→ Don't calculate directly
→ Parameters: accuracy(%), tasksCompleted, selfRating(1-5), errorCount

**"Coach response feels incomplete"**
→ Follow protocol: concept→rule→steps→check→answer→takeaway→trap
→ Check all fields in `CoachMessage` interface filled
→ Compare to `mockCoachConversations` example

---

## Performance Notes

- Mock data is ~600 lines, should load instantly
- 12 modules × 4 parts = 48 parts, each with 2-3 tasks ≈ 130 total tasks
- Should render smoothly even on slower devices
- Ingestion will be async (future), mock data is sync (now)

---

## Future Builder Notes

When you implement ingestion:

1. **Problems will use same schema as mock problems**
   - Ensure SourceMaterial and ProblemBlock interfaces in data-schema.ts match your parser output

2. **All new problems must tag to official topics**
   - No custom topics allowed
   - Use existing QuantTopic + QuantSubtopic enums

3. **Error categories from explanations**
   - Tag each problem with likely ErrorCategories
   - Use when user gets it wrong

4. **Drill generation will filter by topic**
   - `getDrillForTopic(topic, difficulty, count)` pattern
   - Eventually: smart sequencing based on mastery

---

**Keep it simple. Stay on the official curriculum. Build on the mock data.**
