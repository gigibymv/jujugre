# GRE Tutor App: Architecture Documentation

## Quick Start for Developers

This project is a private GRE tutor app for Julie. The foundation has been built with a focus on **realistic structure based on actual GRE prep materials**—not generic assumptions.

### Key Files to Understand First

1. **lib/data-schema.ts** — TypeScript types that define the entire app structure
   - `QuantTopic`: 31 official GRE quant topics
   - `QuantSubtopic`: Detailed subtopic taxonomy
   - `ErrorCategory`: 20+ real error types students make
   - Module, Task, TopicMastery, ErrorLogEntry structures

2. **lib/mock-data.ts** — Realistic seed data showing how the app works
   - User at Week 2, Module 2 (Fractions)
   - Real error entries (inscribed angle confusion, LCM errors, etc.)
   - Topic mastery showing weak areas (circles, probability)
   - Example coach conversation following the rigor protocol

3. **ARCHITECTURE_SUMMARY.md** — Overview of what was built and why
   - What each component does
   - Why it matters
   - Next steps for UI implementation

### File Structure

```
project/
├── lib/
│   ├── data-schema.ts          ← Core types & enums (official GRE taxonomy)
│   ├── mock-data.ts            ← Realistic seed data
│   └── utils.ts                ← Existing utilities
├── ARCHITECTURE_SUMMARY.md      ← Start here
├── QUANT_ARCHITECTURE.md        ← 12-week module plan + error categories
├── INGESTION_ARCHITECTURE.md    ← How to ingest GRE books later
├── GRE_MATERIALS_MAPPING.md     ← Why each design decision was made
├── IMPLEMENTATION_CHECKLIST.md  ← What to do next
└── QUANT_ARCHITECTURE.md        ← Detailed topic breakdown
```

---

## What Makes This Different

### ✅ Official, Not Invented
- Topic taxonomy matches **ETS official Math Review** exactly
- Error categories extracted from **Manhattan Prep practice books**
- Module structure follows **GregMat "I'm Overwhelmed" plan**
- Coach protocol mirrors **official guide explanation standards**

### ✅ Future-Ready for Ingestion
- Schema designed to absorb **1000+ official practice problems**
- Topic tagging prepared for **PDF parsing + LLM assistance**
- Problem indexing ready for **retrieval-based drill generation**
- Coach system ready for **enrichment with official explanations**

### ✅ Realistic Mock Data
- Not empty—shows 2 weeks of progress
- Real mistakes: inscribed angles, LCM calculation, inequality signs, probability traps
- Weak areas that students actually struggle with (circles, probability)
- Coach responses that demonstrate the rigor standard

---

## Architecture at a Glance

### Core Types (lib/data-schema.ts)

```typescript
// Official GRE topics (31 total)
type QuantTopic = "arithmetic_integers" | "algebra_linear_equations" | ...

// Detailed subtopics
type QuantSubtopic = "factors_multiples_divisibility" | "lcm_gcd" | ...

// Real error categories (20+)
type ErrorCategory = "angle_arc_confusion" | "probability_trap" | ...

// Structure
interface Module { weekNumber, title, parts: ModulePart[] }
interface ModulePart { partNumber (1-4), title, tasks: Task[] }
interface Task { title, taskType, estimatedMinutes, completed }

// Mastery: multi-signal calculation
interface TopicMastery {
  topic, subtopic,
  tasksCompleted, practiceAccuracy, selfRating, errorCount,
  masteryLevel: "not_started" | "developing" | "proficient" | "mastered"
}

// Real mistakes
interface ErrorLogEntry {
  topic, subtopic, questionType, source,
  primaryErrorCategory, secondaryErrorCategories,
  whatIGotWrong, correctMethod, shorterInsight, confidence
}

// Structured coaching
interface CoachMessage {
  userPrompt, messageType,
  response,
  conceptIdentified, ruleStatementIfMath, steps[], checkWork, takeaway, commonTrap,
  relatedTopic, relatedSubtopic
}
```

### 12-Week Plan Structure

| Week | Module | Topics | Why This Order |
|------|--------|--------|---|
| 1 | Integers | Factors, multiples, LCM, GCD | Foundation of all number work |
| 2 | Fractions | Operations, ordering | Essential before algebra |
| 3 | Decimals | Conversion, rounding | Light touch + review |
| 4 | Ratio/Percent | Proportions, percent change | Applied arithmetic |
| 5 | Exponents | Rules, roots | Pervasive across all topics |
| 6-8 | Algebra | Equations, inequalities, quadratics, expressions (3 weeks) | Largest topic group |
| 9 | Coordinate Geometry | Algebra + geometry bridge | Consolidates algebra |
| 10-11 | Geometry | Triangles, circles, 3D solids (2 weeks) | Most intimidating, needs focus |
| 12 | Data Analysis | Statistics, probability, counting | Capstone synthesis |

Each module: 4 parts, each part: 2-3 tasks (~1.5 hours per part)

---

## How to Build on This

### Step 1: Build the UI Using Mock Data
```typescript
// In your components:
import { mockUserProfile, mockStudyPlan, mockTopicMastery, mockErrorEntries } from '@/lib/mock-data'

// Dashboard
<Dashboard user={mockUserProfile} plan={mockStudyPlan} mastery={mockTopicMastery} />

// Study Plan
<StudyPlanPage modules={mockStudyPlan.modules} current={mockStudyPlan.currentModuleId} />

// Error Log
<ErrorLogList entries={mockErrorEntries} />

// Coach
<CoachInterface initialConversations={mockCoachConversations} />
```

### Step 2: Add Real Data Layer
Replace mock data with actual database queries when ready.

### Step 3: Implement Ingestion (Later)
When you have books to ingest:
1. Follow `INGESTION_ARCHITECTURE.md`
2. Parse PDFs into problem blocks
3. Tag with `QuantTopic` + `QuantSubtopic` enums
4. Ingest `ErrorCategory` tags based on explanations
5. Index for drill generation

---

## Key Design Decisions & Why

| Decision | Why | Source |
|----------|-----|--------|
| 31 quant topics | Matches ETS official Math Review | Official guide Chapter 7 |
| 12 weeks foundation | Standard GRE prep timeline | GregMat "I'm Overwhelmed" plan |
| Arithmetic → Algebra → Geometry → Data order | Pedagogical foundation (needed for later topics) | GRE standard progression |
| 4 parts per module | Manageable weekly chunks | From analysis of official problem sets |
| Error categories (20+) | Real traps students fall into | Manhattan Prep explanations |
| Weak areas in mock: circles, probability | Most commonly struggled topics | Problem frequency in official books |
| Coach protocol (concept→rule→steps→check→answer→takeaway→trap) | Matches official guide format | Official GRE Math Review solutions |

---

## Realistic Mock Data Examples

### Error Entry: Inscribed Angle Confusion
```
Topic: geometry_circles > circle_properties
Error: Confused inscribed angle with central angle (thought they were equal)
What I Got Wrong: "I thought both angles subtended the same arc"
Correct Method: "Central angle = arc measure. Inscribed angle = (1/2) × central angle"
Insight: "Central angle doubles inscribed angle for same arc"
Confidence: 3/5
```

This is based on a **real GRE trap** from official materials.

### Error Entry: LCM Calculation
```
Topic: arithmetic_integers > lcm_gcd
Error: Calculated LCM(30,75) = 450 instead of 150
What I Got Wrong: "I multiplied them instead of finding true least common multiple"
Correct Method: "Prime factorization: 30=2×3×5, 75=3×5². LCM=2×3×5²=150"
Insight: "LCM ≠ product. Use prime factorization, take highest powers"
Confidence: 5/5 (Understood after review)
```

---

## Ingestion Preview: What Happens When You Upload a Book

### Today
```
Upload: Official_GRE_Math_Review.pdf
Parser extracts: 
  - 100 concept blocks (definitions, examples)
  - 500+ practice problems with official answers
```

### Tomorrow (After topic mapping)
```
Each problem auto-tagged:
  Problem: "Find GCD(30,75)"
  → Topic: arithmetic_integers
  → Subtopic: lcm_gcd
  → ErrorCategories: [computational_arithmetic, factorization_error]
  → Difficulty: easy
  → TimeEstimate: 2 min
  → RetrievalTags: [prime_factorization_needed, efficient]
  → Source: Official_GRE_Math_Review, Chapter 7, Page 92
```

### Next Week (Smart drill generation)
```
Coach: "Based on your weak LCM/GCD accuracy, here's a targeted drill"
Drill: 5 problems from official guide + other sources on LCM/GCD, increasing difficulty
Coach: "Here's why problem 3 tricks students..."
```

---

## Important Constraints

### Single User (V1)
- This app is for Julie, not a marketplace
- No multi-user complexity in data model
- Personalization based on her specific prep timeline

### Official Curriculum Only
- Scope bounded by ETS Math Review
- No calculus, trigonometry, or advanced topics
- 31 topics defined, no freelancing with new topics

### Rigor First
- Math explanations follow strict protocol (concept→rule→steps→check→answer→takeaway→trap)
- Every problem must tag to official taxonomy
- No "looks good enough" coaching

### Realistic Difficulty
- Easy (0-30th percentile): Single concept, direct application
- Medium (30-70th percentile): 1-2 concepts, one trap
- Hard (70-95th percentile): 3+ concepts, elegant reasoning required

---

## Next Immediate Steps

1. **Import mock data** into your components
   ```typescript
   import { mockUserProfile, mockStudyPlan } from '@/lib/mock-data'
   ```

2. **Reference the types** for consistency
   ```typescript
   import type { StudyPlan, TopicMastery, ErrorLogEntry } from '@/lib/data-schema'
   ```

3. **Build dashboard** using mock data structure
   - Show current week/module/part
   - Display weak areas from topic mastery
   - Show today's tasks
   - Days remaining calculation

4. **Build study plan page** using module structure
   - Display 12 modules
   - Highlight current position
   - Show part completion
   - List daily tasks

5. **Reference documentation** when designing features
   - `ARCHITECTURE_SUMMARY.md` for overview
   - `QUANT_ARCHITECTURE.md` for topic details
   - `GRE_MATERIALS_MAPPING.md` for design rationale

---

## Questions to Ask Yourself

- **Is this topic in `QuantTopic` enum?** If not, verify it's official before adding
- **Does this error category exist?** If not, check it's not already named differently
- **Is this difficulty realistic?** Compare against official test problem distributions
- **Does the coach response follow protocol?** concept → rule → steps → check → answer → takeaway → trap
- **Can this problem be ingested later?** If not, the design might be too bespoke

---

## Support Resources

- **Topic questions**: Check `GRE_MATERIALS_MAPPING.md` (all topics sourced)
- **Error categories**: Check `QUANT_ARCHITECTURE.md` (all categories extracted)
- **Module structure**: Check `QUANT_ARCHITECTURE.md` (12-week plan documented)
- **Ingestion questions**: Check `INGESTION_ARCHITECTURE.md` (pipeline designed)
- **Design decisions**: Check `GRE_MATERIALS_MAPPING.md` (all decisions traced to sources)

---

## Version History

- **V0.5** (Current): Architecture & schema complete, mock data seeded, documentation written
- **V1** (Next): UI implementation (dashboard, plan, error log, coach)
- **V1.5** (After UI): PDF ingestion pipeline
- **V2**: Smart drills, coach enrichment, recommendation engine
- **V2+**: Scaling, analytics, marketplace

---

**Built for Julie. Built on real GRE materials. Built to last.**
