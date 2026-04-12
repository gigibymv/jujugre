# Security & Pre-Launch Validation Guide

## Security Checklist

### Code Security
- [x] No hardcoded API keys or secrets in code
- [x] Environment variables used for sensitive configuration
- [x] Database connection strings in environment only
- [x] Mock data used (no real user data in repo)
- [ ] All `console.log("[v0] ...")` debug statements removed before production

### Environment Variables
Required variables for production deployment:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**DO NOT commit `.env.local` or `.env` files**

### Database Security
- [x] Row Level Security (RLS) policies configured for all user tables
- [x] RLS policies enforce user isolation (users can only access their own data)
- [x] Supabase auth.users referenced for authentication
- [x] Foreign keys set up with ON DELETE CASCADE for data integrity
- [ ] Test RLS policies before production (use Supabase test harness)

### API Security
- [x] API routes validate required parameters
- [x] API routes return appropriate HTTP status codes
- [x] Error messages don't expose sensitive information
- [x] Error logging includes `[v0]` prefix for debugging
- [ ] Rate limiting not yet configured (add if experiencing abuse)
- [ ] CORS not yet configured (add if API called from external domains)

### HTTP Security Headers
Configured in `next.config.mjs`:
- [x] `X-Content-Type-Options: nosniff` (prevents MIME sniffing)
- [x] `X-Frame-Options: DENY` (prevents clickjacking)
- [x] `X-XSS-Protection: 1; mode=block` (XSS protection)

## Pre-Launch Validation

### Build Verification
```bash
# Remove build artifacts
rm -rf .next

# Run type checking
npx tsc --noEmit

# Build for production
npm run build

# Check for warnings or errors
# All should pass with 0 errors
```

### Performance Checks
- [ ] Lighthouse audit score 80+ (run in Chrome DevTools)
- [ ] First Contentful Paint (FCP) < 2 seconds
- [ ] Largest Contentful Paint (LCP) < 2.5 seconds
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Production build size < 500KB gzipped

### Testing Checklist

#### Functional Testing
- [ ] Dashboard loads with mock data
- [ ] Navigation works between all 8 pages
- [ ] Study plan shows all 16 weeks
- [ ] Current week shows as Week 1
- [ ] Weak areas display with correct colors
- [ ] Error boundary displays when JavaScript error occurs

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari on iOS
- [ ] Chrome on Android

#### Network Conditions
- [ ] Fast 3G connection
- [ ] Slow 3G connection
- [ ] Offline mode (Progressive Web App)

#### Accessibility
- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA standard (verified with WebAIM)
- [ ] Keyboard navigation works
- [ ] Screen reader tested (VoiceOver on Mac)

## Production Deployment Steps

### Before Deploying
1. [ ] All code reviewed for security issues
2. [ ] No debug `console.log` statements in code
3. [ ] All environment variables configured in Vercel
4. [ ] Database schema executed in Supabase
5. [ ] Build passes locally without errors
6. [ ] All tests pass (if applicable)

### During Deployment
1. [ ] Connect GitHub repository to Vercel
2. [ ] Configure environment variables in Vercel settings
3. [ ] Trigger deploy (automatic on main branch push or manual)
4. [ ] Monitor deployment logs for errors

### After Deployment
1. [ ] Visit production URL
2. [ ] Run through Manual Testing Checklist
3. [ ] Check Vercel error logs (Monitoring tab)
4. [ ] Verify database connectivity
5. [ ] Test error handling by triggering an error
6. [ ] Monitor performance metrics

## Incident Response

### If Critical Error on Production

**Immediate Actions:**
1. Identify the error in Vercel Monitoring dashboard
2. Check Supabase database status
3. Review recent code changes in GitHub

**Rollback Procedure:**
1. Go to Vercel dashboard
2. Click "Deployments" tab
3. Find the previous stable deployment
4. Click the menu (•••) and select "Promote to Production"

**Post-Incident:**
1. Document what went wrong
2. Identify root cause
3. Fix in development
4. Add test to prevent recurrence
5. Post summary to team

## Monitoring & Maintenance

### Ongoing Monitoring
- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure uptime monitoring (UptimeRobot)
- [ ] Regular security updates for dependencies
- [ ] Monthly backup of Supabase database

### Dependency Updates
```bash
# Check for outdated packages
npm outdated

# Update safe minor versions
npm update

# Check for security vulnerabilities
npm audit
npm audit fix
```

### Regular Tasks
- [ ] Monthly: Review error logs
- [ ] Quarterly: Update dependencies
- [ ] Yearly: Security audit
- [ ] Anytime: Review Vercel performance metrics

## Support & Troubleshooting

### Common Issues

**Issue: Database connection fails**
- Check Supabase status
- Verify environment variables in Vercel
- Check database RLS policies aren't blocking access

**Issue: Blank page or 500 error**
- Check browser console for errors
- Check Vercel logs
- Trigger error boundary test

**Issue: Slow performance**
- Run Lighthouse audit
- Check Vercel analytics
- Review database query performance

### Getting Help
1. Check error logs in Vercel dashboard
2. Review database logs in Supabase dashboard
3. Inspect browser DevTools for client-side errors
4. Check [Next.js documentation](https://nextjs.org/docs)
5. Review [Supabase documentation](https://supabase.io/docs)
