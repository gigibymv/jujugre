# 📚 Architecture Documentation Index

## Quick Navigation

### 🎯 Start Here
- **COMPLETION_SUMMARY.md** — What was built, what you got, next steps
- **README.md** — Project overview, file structure, key design decisions
- **ARCHITECTURE_SUMMARY.md** — What each component does and why

### 🏗️ Architecture & Design
- **QUANT_ARCHITECTURE.md** — Official topic structure, 12-week plan, error categories, module layout
- **INGESTION_ARCHITECTURE.md** — How to ingest GRE books, topic mapping, drill generation
- **GRE_MATERIALS_MAPPING.md** — How each design decision was sourced from official materials

### 💻 Implementation
- **IMPLEMENTATION_CHECKLIST.md** — What to build, what's ready, quality metrics
- **DEVELOPER_REFERENCE.md** — Code patterns, lookup guide, debugging tips
- **lib/data-schema.ts** — TypeScript types (official taxonomy embedded)
- **lib/mock-data.ts** — Realistic seed data

---

## Reading Paths

### "I want to understand the whole thing"
1. COMPLETION_SUMMARY.md (5 min)
2. ARCHITECTURE_SUMMARY.md (10 min)
3. README.md (10 min)
4. lib/data-schema.ts (15 min, skim types)
5. lib/mock-data.ts (10 min, see structure)

**Total**: ~50 minutes for full mental model

### "I want to build the UI right now"
1. README.md "Quick Start for Developers" (5 min)
2. DEVELOPER_REFERENCE.md (10 min)
3. Import types: `import type { ... } from '@/lib/data-schema'`
4. Seed with data: `import { mockUserProfile, mockStudyPlan, ... } from '@/lib/mock-data'`
5. Reference mock structure while building

**Total**: ~15 minutes to start coding

### "I need to understand why this design"
→ GRE_MATERIALS_MAPPING.md (entire document)
- Each section explains what source material inspired each decision
- Includes source references (official guide chapters, practice book sections)

### "I'm implementing ingestion later"
1. INGESTION_ARCHITECTURE.md (entire, ~300 lines, 30 min)
2. lib/data-schema.ts sections on SourceMaterial and ProblemBlock (10 min)
3. IMPLEMENTATION_CHECKLIST.md "Phase 1-5: Content Ingestion" (10 min)

**Total**: ~50 minutes to understand the pipeline

---

## File-by-File Summary

### Documentation Files (9 total)

| File | Length | When to Read | Purpose |
|------|--------|--------------|---------|
| COMPLETION_SUMMARY.md | 218 lines | First | What was delivered, overview |
| README.md | 317 lines | Second | Project guide, quick start |
| ARCHITECTURE_SUMMARY.md | 215 lines | Third | Components explained |
| QUANT_ARCHITECTURE.md | 299 lines | Design phase | 12-week plan, topic structure |
| INGESTION_ARCHITECTURE.md | 304 lines | Before ingestion | How to parse PDFs, index problems |
| GRE_MATERIALS_MAPPING.md | 305 lines | Understand design | Why each decision was made |
| IMPLEMENTATION_CHECKLIST.md | 267 lines | Build phase | What to build next |
| DEVELOPER_REFERENCE.md | 385 lines | During coding | Patterns, lookup guide |
| (This file) | — | Navigation | File index and reading paths |

### Code Files (2 total)

| File | Length | What's Inside |
|------|--------|--------------|
| lib/data-schema.ts | 359 lines | TypeScript types (QuantTopic, ErrorCategory, etc.) + helpers |
| lib/mock-data.ts | 583 lines | Realistic user, plan, mastery, errors, coach data |

---

## Key Numbers

- **31 quant topics** (all official, none invented)
- **30+ subtopics** (mapped to topics)
- **20+ error categories** (from practice materials)
- **12 modules** (weeks 1-12 foundation + week 13+ strategy)
- **4 parts per module** (consistent structure)
- **2-3 tasks per part** (~1.5 hours per part)
- **4 realistic error entries** (real GRE traps)
- **2+ weeks of mock progress** (user looks active)
- **~2,800 lines of documentation** (comprehensive)
- **~900 lines of code** (types + data)

---

## Architecture Layers

```
UI Layer (To be built)
    ↓
Data Model Layer (lib/data-schema.ts) ← Official taxonomy embedded
    ↓
Mock Data Layer (lib/mock-data.ts) ← Realistic seed data
    ↓
Future Ingestion Layer (INGESTION_ARCHITECTURE.md) ← Ready to absorb books
```

---

## How Materials Influenced Design

| Source Material | Influenced | Where Documented |
|---|---|---|
| Official GRE Math Review | 31 quant topics | QUANT_ARCHITECTURE.md, lib/data-schema.ts |
| Manhattan Prep 5 lb Book | Error categories | QUANT_ARCHITECTURE.md, lib/data-schema.ts |
| Official Practice Guides | Module difficulty progression | QUANT_ARCHITECTURE.md |
| GregMat "I'm Overwhelmed" | 12-week structure, module order | QUANT_ARCHITECTURE.md |
| Official Guide Solutions | Coach explanation protocol | QUANT_ARCHITECTURE.md, IMPLEMENTATION_CHECKLIST.md |

---

## What's Ready vs What's Not

### ✅ Ready (Architecture Complete)
- Topic taxonomy (official, validated)
- Module structure (12 weeks, 4 parts each)
- Data types (all enums and interfaces)
- Mock data (realistic user states)
- Error categories (comprehensive)
- Ingestion design (documented)
- Documentation (complete)

### ⏳ Not Yet Built (UI & Persistence)
- Dashboard UI
- Study plan interface
- Error log UI
- AI coach interface
- Database persistence
- PDF ingestion pipeline
- Smart drill generation

### 🔮 Future (After UI complete)
- Content ingestion
- Retrieval-based drills
- Coach enrichment with official explanations
- Adaptive difficulty
- Recommendation engine

---

## Validation Checklist

All components verified:
- [x] Topics match ETS official Math Review
- [x] Subtopics properly mapped to topics
- [x] Error categories from real sources
- [x] Mock data realistic (not perfect scores)
- [x] Module order pedagogically sound
- [x] Difficulty levels calibrated
- [x] Coach protocol follows official standards
- [x] Ingestion schema compatible with PDFs

---

## Common Questions Answered

**Q: Is this a complete app?**
A: No. This is architecture + types + mock data. UI still needs to be built using these foundations.

**Q: Can I see what the app will look like?**
A: Not yet. But you can build the UI using the mock data structure—it will show a realistic user state (week 2, module 2, with progress and weak areas).

**Q: Is this generic GRE architecture?**
A: No. Every decision is grounded in official materials or Julie's specific 4-month plan.

**Q: Can I add my own topics?**
A: No (by design). Topics are bounded to the 31 official topics. This ensures consistency and future ingestion compatibility.

**Q: What if I need a different error category?**
A: First check if it's already in the enum with a different name. If genuinely new, verify it's a real GRE trap (not invented). All categories are sourced.

**Q: When can I ingest GRE books?**
A: The architecture is ready (INGESTION_ARCHITECTURE.md), but the implementation code doesn't exist yet. Phase 1 would build the PDF parser.

**Q: Is the mock data temporary?**
A: Yes and no. Mock data will be replaced with real user data. But its structure is permanent—the schema won't change.

---

## Getting Help

### **I'm confused about X**
1. Check this index file first
2. Find the relevant documentation file
3. Use Ctrl+F to search within that file
4. Check DEVELOPER_REFERENCE.md for code examples

### **I found a mistake**
- All decisions traced to sources (GRE_MATERIALS_MAPPING.md)
- All types match official curriculum (lib/data-schema.ts comments)
- All error entries are real traps (lib/mock-data.ts sourced from materials)

### **I want to extend something**
- Adding topics? Must match official curriculum (verify against ETS Math Review)
- Adding error categories? Must be real GRE traps (verify against practice materials)
- Adding modules? Follow the 4-part structure and topic mapping pattern

---

## Recommended Reading Order

### For Developers Building UI
```
1. README.md (quick start)
2. lib/data-schema.ts (understand types)
3. lib/mock-data.ts (see what data looks like)
4. DEVELOPER_REFERENCE.md (coding patterns)
5. IMPLEMENTATION_CHECKLIST.md (what to build)
```

### For Architects Designing Features
```
1. ARCHITECTURE_SUMMARY.md (overview)
2. QUANT_ARCHITECTURE.md (module structure)
3. GRE_MATERIALS_MAPPING.md (why designed this way)
4. INGESTION_ARCHITECTURE.md (future extensibility)
```

### For Product Managers Checking Progress
```
1. COMPLETION_SUMMARY.md (what was delivered)
2. README.md (feature list)
3. IMPLEMENTATION_CHECKLIST.md (what's next)
```

### For New Team Members Onboarding
```
1. README.md (overview)
2. ARCHITECTURE_SUMMARY.md (components)
3. DEVELOPER_REFERENCE.md (code patterns)
4. lib/data-schema.ts (the schema)
5. lib/mock-data.ts (example data)
```

---

## Next Steps

### Immediate (This Week)
- [ ] Read COMPLETION_SUMMARY.md
- [ ] Review README.md
- [ ] Study lib/data-schema.ts

### Short Term (Next 1-2 Weeks)
- [ ] Build dashboard using mock data
- [ ] Build study plan view
- [ ] Implement error log form

### Medium Term (Weeks 3-4)
- [ ] Build topic mastery view
- [ ] Implement AI coach interface
- [ ] Add persistence layer

### Long Term (After UI Complete)
- [ ] Implement PDF ingestion (follow INGESTION_ARCHITECTURE.md)
- [ ] Add smart drill generation
- [ ] Enrich coach with ingested materials

---

## Contact / Questions

All documentation is self-contained. If you need clarification:
1. Check DEVELOPER_REFERENCE.md (common questions)
2. See GRE_MATERIALS_MAPPING.md (why a design choice)
3. Review IMPLEMENTATION_CHECKLIST.md (what to do next)

---

**Last Updated**: March 17, 2026
**Status**: Architecture complete, UI ready to be built
**Next Phase**: UI Implementation
**Long-term Vision**: Content ingestion + adaptive learning + premium coaching
