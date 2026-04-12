# Future Content Ingestion Architecture

## Overview
This document defines the architecture for ingesting GRE prep materials (textbooks, PDFs, online resources) into the tutor app to power retrieval-based practice, adaptive coaching, and topic mastery tracking.

## Phase 1: Upload & Parse (Future Implementation)

### Source Upload Interface
- Accept PDF, EPUB, or plain text documents
- Metadata capture: title, author, source type, edition, date
- Store in blob storage with indexing metadata

### PDF/Document Parsing Pipeline
1. **Extract structure** from uploaded material
   - Chapter/section hierarchy
   - Concept blocks (definitions, examples)
   - Problem blocks (questions + answers + explanations)

2. **Segment content** into:
   - **Concept chunks**: 200-500 tokens, self-contained definitions
   - **Example chunks**: Step-by-step worked problems
   - **Problem chunks**: Practice questions with answers
   - **Explanation chunks**: Answer explanations and reasoning

3. **Preserve metadata** at chunk level:
   - Source location (chapter, section, page)
   - Content type (definition, example, problem, explanation)
   - Readability score and complexity indicators

## Phase 2: Topic Mapping (The Key Innovation)

### Topic Tagging Taxonomy
Each ingested chunk maps to the canonical quant taxonomy defined in `lib/data-schema.ts`:

```
QuantTopic (high-level): arithmetic_integers, algebra_linear_equations, etc.
QuantSubtopic (detailed): factors_multiples_divisibility, solving_linear, etc.
```

### Automated Tagging Strategy
1. **Rule-based extraction**: Keywords and patterns
   - "LCM" or "least common multiple" → `lcm_gcd` subtopic
   - "Inscribed angle" → `circle_properties` subtopic
   - "Solve for x" + algebra context → `solving_linear` subtopic

2. **LLM-assisted tagging** (secondary pass):
   - Ask: "What is the primary GRE quant concept in this problem?"
   - Ask: "What error categories might this problem trap students in?"
   - Suggest: "Secondary topics that connect to this problem"

3. **Human review layer** (quality control):
   - Flagged mismatches for curator review
   - Common mistagging patterns corrected in rules

### Multi-Topic Mapping
Many problems test multiple concepts:
- Problem: "A circle has center (0,0) and passes through (3,4). Find the circumference."
  - Primary: `geometry_circles` > `circle_properties`
  - Secondary: `algebra_coordinate_geometry` > `distance_formula`
  - Tertiary: `arithmetic_ratio_proportion` > `ratio_rates` (for diameter/circumference relationship)

All relationships stored for drill generation.

## Phase 3: Problem Structure (Retrieval Enablement)

### Problem Block Schema (Extended)
```typescript
interface ProblemBlock {
  id: string;
  sourceId: string;
  sourceLocation: string; // chapter, page reference
  questionText: string;
  
  // Question format
  questionType: QuestionType; // QC, MC-single, MC-multi, numeric, DI
  
  // Tagging
  primaryTopic: QuantTopic;
  secondaryTopics: QuantTopic[];
  primarySubtopic: QuantSubtopic;
  secondarySubtopics: QuantSubtopic[];
  
  // Difficulty
  difficulty: "easy" | "medium" | "hard";
  officialRating?: number; // percentile if known
  estimatedTimeSeconds: number;
  
  // Answers & Explanation
  answerChoices?: string[]; // For MC
  correctAnswer: string;
  officialExplanation: string;
  conceptsTestedList: string[]; // Free-text concepts
  
  // Error tagging
  commonErrorCategories: ErrorCategory[];
  commonMistakesExplained: {
    mistakeType: ErrorCategory;
    wrongAnswer: string;
    whyStudentsMakeIt: string;
    howToAvoid: string;
  }[];
  
  // Retrieval optimization
  retrievalTags: string[]; // Custom searchable tags
  keywords: string[];
  isPartOfSet?: string; // If part of Data Interpretation set
  
  // Stats (populated after usage)
  studentAttempts?: number;
  studentAccuracyPercent?: number;
  averageTimeSeconds?: number;
}
```

### Retrieval Tag Generation
Automatic tags for drill generation queries:
- `timers_needed`: For problems requiring time management
- `formula_heavy`: Requires formula recall
- `computation_heavy`: Calculation-intensive
- `reasoning_focus`: Conceptual reasoning more than calculation
- `wordproblem`: Requires reading comprehension
- `diagram_provided`: Student has a visual reference
- `coordinate_system`: Uses x-y coordinate plane
- `negative_numbers`: Tests negative number handling
- `common_trap_arc_angle`: Known error pattern
- Difficulty markers: `easy_trap`, `medium_multi_step`, `hard_synthesis`

## Phase 4: Drill Generation Engine (Future)

### Retrieval-Based Drill Builder
```typescript
interface DrillRequest {
  userId: string;
  focusTopic: QuantTopic | QuantSubtopic;
  difficulty?: Difficulty;
  questionTypes?: QuestionType[];
  maxTimeMinutes?: number;
  maxProblems?: number;
  
  // Adaptive parameters
  includeCommonMistakes?: boolean;
  includeWeakAreaReview?: boolean;
  includeSpacedRepetition?: boolean;
  
  // Variation preferences
  includeDifferentSources?: boolean;
}

function generateDrill(request: DrillRequest): Problem[] {
  // Query ingested materials
  const candidates = queryProblems({
    topics: request.focusTopic,
    difficulty: request.difficulty || "medium",
    types: request.questionTypes,
  });
  
  // Filter by user history
  const filtered = excludeRecentlyPracticed(candidates, userId);
  
  // Sort by pedagogical sequence
  const ordered = orderPedagogically(filtered, focusTopic);
  
  // Select & interleave
  return selectAndInterleave(ordered, maxProblems);
}
```

### Adaptive Sequencing Rules
1. **Difficulty progression**: Easy → medium → hard (confidence-dependent)
2. **Variety principle**: Alternate between different problem types
3. **Interleaving**: Mix related subtopics to avoid "problem-set myopia"
4. **Spacing**: Review problems from earlier modules
5. **Elaboration**: Link to weak-area error patterns

## Phase 5: Coach Context Enhancement

### Enriching AI Coach with Ingested Materials

#### Concept Explanation Mode
When user asks: "Explain inscribed angles"

1. Retrieve concept block from ingested materials
2. Find worked examples from source
3. Extract common mistakes tagged in problems
4. Augment with coach protocol:
   - **Concept**: [From source]
   - **Rule**: [From definition block]
   - **Method**: [From worked example]
   - **Takeaway**: [Synthesized]
   - **Trap**: [From error-tagged problems]

#### Mistake Analysis Mode
When user asks: "Why did I get this wrong?" (on ingested problem)

1. Look up official explanation
2. Match to student's error category
3. Find similar problems they got correct
4. Recommend next practice from retrieval index
5. Suggest conceptual review if needed

### Recommendation Engine
Based on:
- Error log patterns (which errors repeated?)
- Topic mastery signals (which topics lagging?)
- Ingested material index (what resources available?)

Output: "I notice you're struggling with inscribed angles. Let's do 3 problems on this, starting with the definition, then building to harder applications."

## Phase 6: Future Enrichment

### Incremental Enhancement Path
1. **V1**: Single-user, mocked data, topic structure defined
2. **V1.5**: Upload + parse PDFs, basic topic mapping, drill index
3. **V2**: Smart retrieval drills, ingested material-powered coaching
4. **V2.5**: Multi-source ingestion, cross-book consistency checking
5. **V3**: Marketplace of ingested materials, competitive analytics

### Data Quality Gates
- Minimum 3 problems per subtopic before enabling adaptive drills
- Explanation quality score (readability, completeness)
- Error category consistency checks
- Difficulty calibration against official test data if available

## Implementation Sequence for Future

### Milestone 1: Ingestion Pipeline (Week 1-2)
- PDF parser integration
- Chunk extraction and storage
- Metadata preservation

### Milestone 2: Topic Mapping (Week 3-4)
- Rule-based tagging implementation
- LLM tagging prompts
- Manual review workflow
- Tag validation dashboard

### Milestone 3: Retrieval Index (Week 5-6)
- Problem block schema finalization
- Error category tagging
- Retrieval tag generation
- Search/query API

### Milestone 4: Drill Generation (Week 7-8)
- Retrieval-based drill builder
- Adaptive sequencing logic
- Drill execution and scoring
- Integration with topic mastery

### Milestone 5: Coach Enhancement (Week 9-10)
- Context injection from ingested materials
- Concept explanation enrichment
- Mistake analysis deepening
- Recommendation engine integration

## Success Metrics for Ingestion

1. **Coverage**: % of GRE quant curriculum covered by ingested materials
2. **Accuracy**: Topic mapping agreement between rule-based, LLM, and human review
3. **Utility**: % of drills generated from ingested materials
4. **Quality**: Student accuracy on ingested problems vs external benchmarks
5. **Diversity**: Problems from multiple sources balanced in drill generation
6. **Efficiency**: Average time to ingest new textbook end-to-end

## Example: Ingesting "Official GRE Math Review"

### What Gets Extracted
- **Arithmetic section**:
  - Definition blocks for integers, factors, divisibility (→ topic mapping: `arithmetic_integers`)
  - ~50 worked examples with solutions
  - ~100+ practice problems with official explanations
  
- **Tagging**:
  - Problem: "Find GCD(30, 75)"
    - Primary: `arithmetic_integers` > `lcm_gcd`
    - Error tags: `computational_arithmetic`, `factorization_error`
    - Time estimate: 2-3 minutes
    - Difficulty: easy
    - Retrieval tags: `prime_factorization_needed`, `time_efficient`

### What Becomes Available
1. **Practice**: New drill set option: "30 GCD/LCM problems from official guide"
2. **Coaching**: Coach can pull official explanations as reference
3. **Recommendations**: "Based on your errors, here are 3 GCD/LCM problems that test the exact concept you missed"
4. **Analytics**: "Your accuracy on official guide GCD problems (92%) vs your accuracy on other GCD problems (78%) suggests you learn well from official explanations"

---

## Technical Implementation Notes

### Storage & Indexing
- Ingested chunks stored in database with full-text search index
- Vector embeddings for semantic search on future (concept similarity)
- Retrieval tags indexed for fast filtering

### Performance Considerations
- Drill generation must complete in <500ms for responsive UX
- Topic mastery updates should reflect ingested problem accuracy in near-real-time
- Coach response generation should leverage cached extracted content

### Privacy & Attribution
- All ingested materials tagged with source attribution
- Coach explanations clearly indicate if they're from official vs synthesized
- Student progress on ingested problems tracked separately for source analytics
