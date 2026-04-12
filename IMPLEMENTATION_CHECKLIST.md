# Implementation Checklist: GRE Materials Integration

## ✅ Completed: Content Architecture Foundation

### Topic & Error Taxonomy
- [x] Extracted official 4-part quant structure (Arithmetic, Algebra, Geometry, Data Analysis)
- [x] Mapped 31 official subtopics from ETS Math Review
- [x] Extracted 20+ realistic error categories from practice materials
- [x] Created topic→subtopic mapping helpers
- [x] Validated against official guide table of contents

### 12-Week Module Structure
- [x] Designed 12-module foundation phase (weeks 1-12)
- [x] Each module: 4 parts, 2-3 tasks per part, realistic time estimates
- [x] Ordered modules by pedagogical foundation: Arithmetic → Algebra → Geometry → Data Analysis
- [x] Created module templates for all 12 weeks
- [x] Documented rationale for each module's position

### Mock Data Population
- [x] User profile: Julie, week 2 progress, realistic weak areas
- [x] Study plan: Current week/module/part tracking, lateness detection ready
- [x] Error log: 4 entries featuring real GRE mistakes
  - [x] Inscribed angle trap (angle/arc confusion)
  - [x] LCM calculation error (product vs true LCM)
  - [x] Inequality sign flip (negative multiplier)
  - [x] Probability "at least" vs "exactly"
- [x] Topic mastery: Weak areas (circles, probability) with realistic signals
- [x] Coach conversations: Following strict explanation protocol
- [x] Daily check-ins: 2 days of realistic study activity

### Data Schema & Types
- [x] `QuantTopic` enum (31 topics, official)
- [x] `QuantSubtopic` enum (subtopic level detail)
- [x] `ErrorCategory` enum (20+ real categories)
- [x] `Module`, `ModulePart`, `Task` types
- [x] `TopicMastery` with multi-signal calculation
- [x] `ErrorLogEntry` with error taxonomy
- [x] `CoachMessage` with protocol fields
- [x] `StudyPlan` with lateness detection ready
- [x] `SourceMaterial` & `ProblemBlock` for future ingestion
- [x] Helper functions: `mapSubtopicToTopic()`, `calculateMasteryLevel()`

### Documentation
- [x] **QUANT_ARCHITECTURE.md** (299 lines)
  - Official topic structure
  - 12-week plan
  - Error categories
  - Mock data strategy
  - Future ingestion overview
  
- [x] **INGESTION_ARCHITECTURE.md** (304 lines)
  - PDF parsing pipeline
  - Topic mapping (rule + LLM + human)
  - Problem tagging schema
  - Retrieval drill generation
  - Coach enrichment strategy
  - 5-milestone implementation roadmap
  
- [x] **GRE_MATERIALS_MAPPING.md** (305 lines)
  - Source material analysis
  - How each book influenced design
  - Error patterns extracted
  - Topic distribution from official test
  - Difficulty calibration approach
  
- [x] **ARCHITECTURE_SUMMARY.md** (215 lines)
  - Overview of what was created
  - Why it matters
  - What it enables
  - Implementation roadmap

---

## 🔄 Ready for Next Phase: UI Implementation

### When Building Dashboard
- [ ] Import mock data from `lib/mock-data.ts`
- [ ] Use `StudyPlan.currentModuleId` to highlight current location
- [ ] Display `StudyPlan.isLate` status
- [ ] Show `TopicMastery` weak areas
- [ ] Display today's `Task` list with completion status
- [ ] Reference `QUANT_ARCHITECTURE.md` for topic terminology

### When Building Study Plan Page
- [ ] Display 12 modules with week numbers
- [ ] Show phase labels (Foundation: weeks 1-12, Strategy: week 13+)
- [ ] Current module/part highlighted
- [ ] Part completion status (0/4 parts done)
- [ ] Task checklist for current part
- [ ] Reference lateness detection in `StudyPlan`

### When Building Topic Mastery Page
- [ ] Use `QuantTopic` groups as main sections
- [ ] Display subtopic cards with mastery level
- [ ] Show multi-signal calculation: accuracy + completion + self-rating + errors
- [ ] Weak areas highlighted (low mastery score)
- [ ] Recommended next actions from mock data

### When Building Error Log
- [ ] Display entries with `ErrorCategory` tags
- [ ] Use structured fields: topic, subtopic, category, source
- [ ] Show "what I got wrong" + "correct method" side-by-side
- [ ] Sort by review due date
- [ ] Filter by error category or topic
- [ ] Link to coach for deeper analysis

### When Building AI Coach
- [ ] Load mock coach conversation to verify format
- [ ] Implement response fields: conceptIdentified, ruleStatementIfMath, steps[], check, takeaway, commonTrap
- [ ] For quant questions, follow protocol:
  1. Concept identification
  2. Rule/principle definition
  3. Step-by-step method
  4. Careful computation
  5. Answer verification
  6. Clear final answer
  7. Takeaway for retention
  8. Common trap warning

---

## 🔮 Ready for Future: Content Ingestion

### Phase 1: Upload & Parse (Weeks 1-2)
- [ ] PDF extraction pipeline
- [ ] Chunk segmentation (concept + example + problem blocks)
- [ ] Metadata preservation

### Phase 2: Topic Mapping (Weeks 3-4)
- [ ] Rule-based tagging (keywords → topics)
- [ ] LLM-assisted verification (secondary pass)
- [ ] Human review layer (QA dashboard)
- [ ] Validation: All problems mapped to official taxonomy

### Phase 3: Retrieval Index (Weeks 5-6)
- [ ] Problem block storage with full schema
- [ ] Error category tagging per problem
- [ ] Retrieval tag generation ("common_trap_X", "time_efficient", etc.)
- [ ] Search/query API ready

### Phase 4: Drill Generation (Weeks 7-8)
- [ ] Retrieval-based drill builder
- [ ] Adaptive sequencing (difficulty + variety + spacing)
- [ ] Integration with topic mastery signals
- [ ] Execution & scoring

### Phase 5: Coach Enrichment (Weeks 9-10)
- [ ] Context injection from ingested materials
- [ ] Explanation enrichment (pull from official sources)
- [ ] Mistake analysis deepening
- [ ] Recommendation engine integration

---

## 📊 Quality Metrics for Verification

### Taxonomy Accuracy
- [ ] All 31 official topics represented
- [ ] All subtopics match ETS structure
- [ ] No extra or invented topics
- [ ] Topic→Subtopic mapping consistent

### Error Category Coverage
- [ ] All 4 major error types covered (computational, conceptual, trap, strategy)
- [ ] All 20+ specific categories can be applied to real problems
- [ ] Categories extracted from multiple sources (official guide, Manhattan, practice books)
- [ ] Mock errors demonstrate variety

### Mock Data Realism
- [ ] User profile matches typical GRE prep timeline
- [ ] Error entries feature real traps from materials
- [ ] Accuracy percentages realistic (60-90% range, not perfect)
- [ ] Task completion patterns plausible (some done, some in progress, some not started)
- [ ] Coach response follows official explanation format

### Documentation Completeness
- [ ] Every design decision traceable to source material
- [ ] Ingestion pipeline documented enough for implementation
- [ ] Topic taxonomy derivable from official guide
- [ ] Error categories extractable from practice books

---

## 📝 Implementation Order (When Building UI)

### Priority 1: Core Surfaces (Make Prototype Functional)
1. Onboarding (single screen, collect: GRE date, weak areas, plan confirmation)
2. Dashboard (current week/module/part, today's tasks, weak areas, days remaining)
3. Study Plan (4-month timeline, current position, next milestone)

### Priority 2: Learning Surfaces (Make Prototype Useful)
4. Topic Mastery (quant topics, mastery levels, weak area highlights)
5. Error Log (log entry creation, structured fields, list view)
6. AI Coach (simple Q&A, structured responses following protocol)

### Priority 3: Polish (Make Prototype Premium)
7. Settings (profile, logout)
8. Visual refinement (calm, premium, simple UX)
9. Empty state messages (every page has helpful empty state)

---

## 🚀 Success Criteria

### For V1 UI Build
- [x] Data schema complete (files already created)
- [x] Mock data comprehensive (files already created)
- [ ] UI renders all data types without errors
- [ ] Dashboard shows user's current position clearly
- [ ] Study plan reflects 4-month structure accurately
- [ ] Error log accepts structured entries
- [ ] Coach responds with protocol-compliant messages
- [ ] No empty-looking pages (all seeded with realistic data)

### For V1.5 Ingestion Prep
- [ ] Source material schema defined (INGESTION_ARCHITECTURE.md)
- [ ] Topic mapping strategy documented
- [ ] Problem tagging approach specified
- [ ] Drill generation rules outlined

### For Future Scalability
- [x] Topic taxonomy bounded (31 official topics, not infinite)
- [x] Error categories finite (20+, not unbounded)
- [x] Module structure modular (4 parts each, consistent)
- [x] Ingestion pipeline designed for automation
- [x] Coach protocol documented for consistency

---

## 🎯 Files to Reference During Implementation

| When You're... | Reference This File |
|---|---|
| Building dashboard | `lib/mock-data.ts` + `QUANT_ARCHITECTURE.md` |
| Adding study plan | `QUANT_ARCHITECTURE.md` (module structure) |
| Creating topic mastery | `lib/data-schema.ts` (topic enum) |
| Building error log | `QUANT_ARCHITECTURE.md` (error categories) |
| Implementing coach | `lib/mock-data.ts` (coach example) |
| Validating data structure | `lib/data-schema.ts` (types) |
| Understanding design choices | `GRE_MATERIALS_MAPPING.md` |
| Planning content ingestion | `INGESTION_ARCHITECTURE.md` |

---

## ✨ Summary

**What's Ready:**
- ✅ Taxonomy (official, not invented)
- ✅ Module structure (12 weeks, pedagogically ordered)
- ✅ Error categories (real traps, not generic)
- ✅ Mock data (realistic user states, actual GRE mistakes)
- ✅ Data schema (types that enforce structure)
- ✅ Documentation (why every choice was made)
- ✅ Ingestion roadmap (how to absorb official materials)

**What's Not Yet Built:**
- UI (dashboard, plan, topic mastery, error log, coach)
- Database layer (store user progress)
- API endpoints (serve data to UI)
- Ingestion pipeline (parse PDFs, tag problems)
- Admin dashboard (content management)

**The Advantage:**
Every UI you build fits into a structure validated against official GRE materials. Every problem you ingest later will tag itself correctly because the taxonomy is pre-defined. Every coach response will follow rigor standards because the protocol is documented.

The prototype is ready to be beautiful, not just functional.
