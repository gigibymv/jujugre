# GRE Tutor App - Quick Reference

## 🚀 What You Can Do Right Now

### Pages to Visit
- **Dashboard** (/) - See your study progress, today's checklist, weak areas
- **Study Plan** (/study-plan) - View the 12-week timeline with current module
- **Topic Mastery** (/topic-mastery) - Check strengths/weaknesses across all topics
- **Error Log** (/error-log) - Review mistakes and what you learned from them
- **AI Coach** (/coach) - Ask questions about concepts, mistakes, or get recommendations
- **Onboarding** (/onboarding) - Complete the 4-step setup (target date, hours/week, weak areas)
- **Settings** (/settings) - Manage profile, study plan, notifications

### Key Features Visible Now

**Dashboard:**
- Supportive message based on your status (on track vs behind)
- Current week and module
- Days remaining to GRE
- Today's tasks checklist (primary action)
- Weak areas needing focus
- Learning stats (words learned, study days, time invested)

**Study Plan:**
- 12-week timeline with current location highlighted
- Foundation Phase (Weeks 1-9) and Strategy Phase (Weeks 10-12)
- Module descriptions and part breakdown
- Lateness indicator with recovery path (if behind)

**Topic Mastery:**
- All topics grouped by mastery level (mastered/proficient/developing/not_started)
- Multi-signal scoring: accuracy, tasks completed, self-rating, errors
- Progress bars for each topic
- Quick actions: Review Errors, Ask Coach, Practice

**Error Log:**
- 4 realistic error entries from actual GRE materials
- Show what you got wrong, correct method, key insight
- Tags for pattern matching
- Filter by reviewed/unreviewed
- Sort by date, review due, or confidence

**AI Coach:**
- Chat interface for asking questions
- Suggested prompts to get started
- Shows full 8-step protocol in responses
- Follow-up actions: Explain Simpler, Give Another Example, Create Practice

**Onboarding:**
- Step 1: Set target GRE date
- Step 2: Choose study hours/week (light/moderate/intensive)
- Step 3: Mark weak areas (optional)
- Step 4: Review and confirm plan

## 📊 Mock Data Included

**User Profile:**
- Name: Julie
- Target: 160 on GRE
- Status: Week 2, Module 2 (Fractions)
- Weak areas: Geometry circles, Data probability, Algebra coordinate geometry
- Study capacity: 5 hours/week (60 min/day, 5 days/week)

**Study Plan:**
- Started 1 week ago
- 120 days remaining to GRE
- Current on Fractions module (Part 1)
- Following GregMat 12-week structure

**Topic Mastery:**
- 1 mastered topic (arithmetic integers)
- 3 weak topics (fractions, circles, probability)
- Multi-signal scores for each

**Error Entries:**
1. Inscribed angles (geometry) - angle/arc confusion
2. LCM calculation (arithmetic) - computational error
3. Inequality signs (algebra) - sign flip when multiplying by negative
4. Probability "at least one" (data analysis) - forgot complement rule

**Check-In History:**
- 14 days of realistic data
- Varies: 65-75% task completion, 45-65 min sessions
- Mood variation: confident, okay, struggling days

## 🛠 What's Ready for Next Phase

**Coach Integration:**
- Schema ready for real AI responses
- Enforces 8-step protocol in responses
- Can link to specific error entries or topics

**Content Seeding:**
- Script-ready structure for ingesting PDFs
- ConceptBlock, ProblemBlock ready
- Retrieval tags designed for adaptive drills

**Practice Generation:**
- Error linking to topics
- Retrieval tag system ready
- Can generate follow-up problems

**User Onboarding:**
- Form captures all needed preferences
- Flexible to adjust study plan anytime

## 🎨 Design Notes

**Colors Used:**
- Blue (#2563eb) - Primary actions, current state
- Slate (50-900) - Backgrounds, text, neutrals
- Green - Success/done status
- Amber - Caution/attention needed
- Red - Alerts only

**Typography:**
- Geist Sans throughout
- Generous line spacing (leading-relaxed)
- Clear hierarchy: xl for headings, sm for details

**Layout:**
- Flexbox-first approach
- One primary action per section
- Minimal competing information
- Calm, premium feel (like ChatGPT + Notion study space)

## ⚡ Quick Stats

- **7 main pages** fully designed and functional
- **28 official GRE subtopics** in taxonomy
- **5 question types** from official materials
- **20 error categories** sourced to textbooks
- **12 study modules** with 4 parts each
- **8-step quant protocol** enforced in schema
- **Multi-signal mastery** algorithm (4 signals)
- **4 realistic error entries** from actual mistakes
- **3 coach examples** showing full protocol
- **14-day history** with realistic variation

## 🔄 Architecture Ready For

- Real user authentication
- API integration for saving progress
- Real AI coaching (ChatGPT/Claude integration)
- Content ingestion from PDFs
- Adaptive drill generation
- Analytics and progress tracking
- Email notifications
- Mobile app version

---

**Status:** V1 Complete - All binding requirements met, all gaps resolved, fully functional prototype ready for user testing or AI integration.
