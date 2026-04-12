# GRE Tutor Publishing Checklist

## Phase 1: Environment Config & Build Setup ✅ DONE

- [x] Created `.env.example` with all required Supabase variables
- [x] Updated `next.config.mjs` with production optimizations
- [x] Enabled strict TypeScript checking for production (`ignoreBuildErrors: false`)
- [x] Added security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- [x] Configured image optimization for production

**Environment Variables to Set in Vercel:**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Phase 2: Database Integration (Supabase) ✅ DONE

- [x] Created database schema (`scripts/01-init-supabase.sql`)
- [x] Set up 6 core tables: users, study_plans, modules, topic_mastery, error_logs, daily_checkins, weak_areas
- [x] Implemented Row Level Security (RLS) policies for all user-owned tables
- [x] Created performance indexes on foreign keys and frequently-queried columns
- [x] Created API route: `/api/study-plan` for fetching and creating study plans
- [x] Added proper error handling and logging in API routes

**To Execute:**
1. Go to Supabase dashboard
2. Create new project or use existing
3. In SQL Editor, run the entire contents of `scripts/01-init-supabase.sql`
4. Verify all tables and RLS policies are created

## Phase 3: Error Handling & User Feedback ✅ DONE

- [x] Created `ErrorBoundary` component to catch and display errors gracefully
- [x] Integrated ErrorBoundary in root layout
- [x] Added error logging with `[v0]` prefix for debugging
- [x] API routes return proper error messages and HTTP status codes
- [x] Error boundary provides user-friendly fallback UI with recovery options

## Phase 4: Manual Testing Checklist ⏳ IN PROGRESS

### Desktop Testing
- [ ] Dashboard loads without errors
- [ ] Navigation between all 8 pages works smoothly
- [ ] Study plan displays all 16 weeks (Months 1-4)
- [ ] Week 1 displays as current (not Week 2)
- [ ] All warm palette colors display correctly
- [ ] Responsive nav with mobile menu

### Functionality Testing
- [ ] Mock data loads correctly on all pages
- [ ] Buttons are clickable and navigate properly
- [ ] Weak areas section shows sage/dusty-rose colors
- [ ] Progress bars display correctly with proper colors
- [ ] Error log and coach message formatting displays properly
- [ ] Topic mastery colors reflect correct status (sage/grey/rose/taupe)

### Mobile Testing
- [ ] App is usable on iPhone/iPad (375px, 768px viewports)
- [ ] Navigation collapses properly
- [ ] Text is readable without zooming
- [ ] Buttons are large enough to tap

### Error Scenarios
- [ ] Open browser DevTools and trigger a JavaScript error
- [ ] Error Boundary should display the error UI
- [ ] "Refresh Page" button should reload the app
- [ ] "Go Home" button should navigate to dashboard

## Phase 5: Security & Pre-Launch Validation ⏳ TODO

### Security Checklist
- [ ] No hardcoded secrets in code
- [ ] Environment variables properly configured in Vercel
- [ ] Database RLS policies are active
- [ ] API routes validate user authentication (when auth is added)
- [ ] No console.log debug statements in production code
- [ ] Security headers present in response (verify in DevTools)

### Build & Deployment
- [ ] `npm run build` completes without errors or warnings
- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] All imports resolve correctly
- [ ] Production build size is acceptable (< 500KB gzipped)
- [ ] No unused dependencies in package.json

### Pre-Launch Testing
- [ ] Test on production URL (after deployment)
- [ ] Verify all pages load correctly
- [ ] Check that CSS and images load properly
- [ ] Test on 4G/3G connection (throttle in DevTools)
- [ ] Verify Google Lighthouse score (target: 80+)
- [ ] Test browser compatibility (Chrome, Safari, Firefox)

## Deployment Instructions

### Step 1: Connect Supabase
1. Create Supabase project at https://app.supabase.com
2. Run database schema: copy contents of `scripts/01-init-supabase.sql` into Supabase SQL editor
3. Get your keys from Supabase Settings → API

### Step 2: Set Environment Variables in Vercel
1. Go to Vercel project settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` (from Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from Supabase)

### Step 3: Deploy
1. Push code to GitHub
2. Vercel auto-deploys on push
3. Or manually trigger deploy from Vercel dashboard

### Step 4: Verify Deployment
1. Visit your Vercel production URL
2. Run through Manual Testing Checklist
3. Monitor error logs in Vercel dashboard

## Known Limitations (Post-Launch Enhancements)

- Authentication not yet implemented (currently uses mock data)
- Email notifications not configured
- Reporting/analytics dashboard not built
- Mobile app not available
- Offline support not implemented

## Rollback Plan

If critical issues are found in production:
1. Revert to previous GitHub commit
2. Redeploy from Vercel dashboard
3. Post incident report in team chat
