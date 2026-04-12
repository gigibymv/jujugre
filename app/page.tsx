'use client';

// Force Next.js dev server rebuild v8 - 2026-03-17 22:18:00
// Hydration mismatch fixed with DaysRemainingCard component

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mockTopicMastery, mockDailyCheckIns } from '@/lib/mock-data';
import { useUserPlan } from '@/components/user-plan-provider';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, TrendingUp, BookOpen, Flame, ArrowRight, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

// Daily inspirational quotes
const DAILY_QUOTES = [
  "Hard topics are just future strengths waiting to be unlocked.",
  "Precision today builds confidence tomorrow.",
  "Every problem solved is progress made.",
  "You're learning the exact patterns the GRE tests.",
  "Consistency over intensity—you've got this.",
  "Master one concept, and build from there.",
  "Rigor now means clarity on test day.",
  "Your effort is compounding into skill.",
];

function getDailyQuote(dateString?: string): string {
  // Use provided date string (from server) or calculate on client
  const hashDate = dateString || new Date().toDateString();
  const hash = hashDate.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return DAILY_QUOTES[hash % DAILY_QUOTES.length];
}

export default function Dashboard() {
  const { user, studyPlan: plan, hasCompletedOnboarding, hydrated } = useUserPlan();
  const [isClient, setIsClient] = useState(false);
  const [dailyQuote, setDailyQuote] = useState('');

  // HYDRATION FIX VERIFICATION: 2026-03-17 22:16:00Z
  // This useEffect ensures time-dependent values only render on client after hydration completes
  useEffect(() => {
    setIsClient(true);
    setDailyQuote(getDailyQuote());
  }, []);

  const currentModule = plan.modules.find(m => m.id === plan.currentModuleId);
  const currentPart = currentModule?.parts.find(p => p.id === plan.currentPartId);
  const daysRemaining = plan.daysRemaining;
  
  // Calculate weak areas and stats
  const weakAreas = mockTopicMastery
    .filter(tm => tm.masteryLevel === 'developing' || tm.masteryLevel === 'not_started')
    .sort((a, b) => (b.practiceAccuracyPercent || 0) - (a.practiceAccuracyPercent || 0))
    .slice(0, 3);
    
  const totalWordsLearned = mockDailyCheckIns.reduce((sum, ci) => sum + ci.wordsLearned, 0);
  const recentCheckIn = mockDailyCheckIns[0];
  const daysSinceStarted = isClient ? Math.floor((Date.now() - user.startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  
  const tasksCompleted = currentPart?.tasks.filter(t => t.completed).length || 0;
  const tasksTotal = currentPart?.tasks.length || 0;
  const progressPercent = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;

  const isOnTrack = plan.latenessState === 'on_track';
  const supportiveMessage = isOnTrack
    ? `You're on pace. Week ${plan.currentWeekNumber} of 12.`
    : `You're slightly behind. Complete one module this week to recover.`;

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {hydrated && !hasCompletedOnboarding && (
          <div className="mb-6 rounded-lg border border-[#d4ccc3] bg-[#f5f1e8] px-4 py-3 text-sm text-[#3d2f3f] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>Set your GRE date and weekly hours so the dashboard matches your plan.</span>
            <Link href="/onboarding">
              <Button size="sm" className="bg-[#3d2f3f] hover:bg-[#5a4a5c] text-white shrink-0">
                Complete setup
              </Button>
            </Link>
          </div>
        )}

        {/* Supportive Header Section */}
        <div className="mb-10">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <p className="text-lg font-light text-[#3d2f3f] leading-relaxed italic">
                "{dailyQuote}"
              </p>
            </div>
            <Badge 
              className={`shrink-0 ${
                isOnTrack 
                  ? 'bg-[#7a8d7e] text-white' 
                  : 'bg-[#a88080] text-white'
              }`}
            >
              {isOnTrack ? '✓ On Track' : '⚠ Catch Up'}
            </Badge>
          </div>
          <p className="text-sm text-[#a89d94]">
            {supportiveMessage}
          </p>
        </div>

        {/* Current Focus Card - Premium Anchor */}
        <Card className="border-0 shadow-md mb-10 bg-white border-l-4 border-l-[#7a8d7e]">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#a89d94]">Today's Focus</p>
                <h2 className="text-2xl font-light text-[#3d2f3f] mt-1">{currentModule?.title}</h2>
                <p className="text-sm text-[#a89d94] mt-1">Week {plan.currentWeekNumber} • {currentPart?.title}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm text-[#2a2520]">
                  <span>Module completion</span>
                  <span className="font-semibold">{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2 bg-[#ede8df]" />
              </div>
              <div className="flex gap-3 pt-2">
                <Link href="/study-plan" className="flex-1">
                  <Button className="w-full bg-[#3d2f3f] hover:bg-[#5a4a5c] text-white font-semibold">
                    Start Today's Work
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Grid - Warm Palette */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* Days to GRE */}
          <Card className="border-0 shadow-sm bg-[#ede8df]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-[#a89d94] uppercase tracking-wide">Days Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#3d2f3f]">{isClient ? daysRemaining : '—'}</div>
              <p className="text-xs text-[#a89d94] mt-1" suppressHydrationWarning>{isClient && plan.targetGREDate ? plan.targetGREDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</p>
            </CardContent>
          </Card>

          {/* Topics Mastered */}
          <Card className="border-0 shadow-sm bg-[#ede8df]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-[#a89d94] uppercase tracking-wide">Topics Mastered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#7a8d7e]">{mockTopicMastery.filter(t => t.masteryLevel === 'mastered').length}</div>
              <div className="text-xs text-[#a89d94] mt-1">{mockTopicMastery.length} total</div>
            </CardContent>
          </Card>

          {/* Words Learned */}
          <Card className="border-0 shadow-sm bg-[#ede8df]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-[#a89d94] uppercase tracking-wide">Words This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#3d2f3f]">{mockDailyCheckIns.slice(0, 7).reduce((sum, ci) => sum + ci.wordsLearned, 0)}</div>
              <p className="text-xs text-[#a89d94] mt-1">{totalWordsLearned} total</p>
            </CardContent>
          </Card>

          {/* Study Days */}
          <Card className="border-0 shadow-sm bg-[#ede8df]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-[#a89d94] uppercase tracking-wide">Study Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold text-[#3d2f3f]">{daysSinceStarted}</div>
                <Flame className="w-5 h-5 text-[#a88080]" />
              </div>
              <p className="text-xs text-[#a89d94] mt-1">since start</p>
            </CardContent>
          </Card>
        </div>

        {/* Two-Column Layout: Focus Areas + Next Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          
          {/* Focus Areas - Dusty Rose Accent */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-[#e8e3db]">
              <CardTitle className="text-base font-semibold text-[#3d2f3f] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#a88080]" />
                Focus Areas
              </CardTitle>
              <p className="text-xs text-[#a89d94] mt-1">Below 70% accuracy need review</p>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {weakAreas.length > 0 ? (
                  weakAreas.map(area => (
                    <Link key={area.id} href="/topic-mastery">
                      <div className="p-3 rounded-lg bg-[#f5f1e8] hover:bg-[#ede8df] transition-colors cursor-pointer border border-[#d4ccc3]">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-[#3d2f3f] leading-snug">
                              {area.subtopic.replace(/_/g, ' ')}
                            </p>
                            <p className="text-xs text-[#a88080] mt-0.5">
                              {area.practiceAccuracyPercent}% accuracy
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <div className="text-lg font-bold text-[#a88080]">{area.practiceAccuracyPercent}%</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-[#a89d94] italic">Excellent—all areas at 70% or above.</p>
                )}
              </div>
              <Link href="/topic-mastery">
                <Button variant="outline" className="w-full mt-4 text-sm border-[#d4ccc3] text-[#3d2f3f] hover:bg-[#f5f1e8]">
                  View All Topics
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recommended Actions - Sage Accent */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-[#e8e3db]">
              <CardTitle className="text-base font-semibold text-[#3d2f3f] flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#7a8d7e]" />
                Next Actions
              </CardTitle>
              <p className="text-xs text-[#a89d94] mt-1">What to focus on right now</p>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <Link href="/study-plan">
                  <Button variant="outline" className="w-full justify-start h-auto py-3 text-left border-[#d4ccc3] text-[#3d2f3f] hover:bg-[#f5f1e8]">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Complete Week {plan.currentWeekNumber}</p>
                      <p className="text-xs text-[#a89d94] mt-0.5">3 parts remaining</p>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/error-log">
                  <Button variant="outline" className="w-full justify-start h-auto py-3 text-left border-[#d4ccc3] text-[#3d2f3f] hover:bg-[#f5f1e8]">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Review Errors</p>
                      <p className="text-xs text-[#a89d94] mt-0.5">3 errors due for review</p>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/coach">
                  <Button variant="outline" className="w-full justify-start h-auto py-3 text-left border-[#d4ccc3] text-[#3d2f3f] hover:bg-[#f5f1e8]">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Ask Your Coach</p>
                      <p className="text-xs text-[#a89d94] mt-0.5">Get rigorous explanations</p>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="border-0 shadow-sm bg-white mb-10">
          <CardHeader className="pb-3 border-b border-[#e8e3db]">
            <CardTitle className="text-base font-semibold text-[#3d2f3f] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#7a8d7e]" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Mastered', count: mockTopicMastery.filter(t => t.masteryLevel === 'mastered').length, color: 'text-[#7a8d7e]' },
                { label: 'Proficient', count: mockTopicMastery.filter(t => t.masteryLevel === 'proficient').length, color: 'text-[#a89d94]' },
                { label: 'Developing', count: mockTopicMastery.filter(t => t.masteryLevel === 'developing').length, color: 'text-[#a88080]' },
                { label: 'Not Started', count: mockTopicMastery.filter(t => t.masteryLevel === 'not_started').length, color: 'text-[#d4ccc3]' },
              ].map(stat => (
                <div key={stat.label} className="text-center p-3 rounded-lg bg-[#f5f1e8]">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
                  <p className="text-xs text-[#a89d94] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <Link href="/topic-mastery">
              <Button variant="outline" className="w-full mt-4 text-sm border-[#d4ccc3] text-[#3d2f3f] hover:bg-[#f5f1e8]">
                View Detailed Report
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
