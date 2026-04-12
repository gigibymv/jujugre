'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockTopicMastery, mockErrorPatterns, mockConceptPrerequisites } from '@/lib/mock-data';
import { ErrorPatternInsights } from '@/components/error-pattern-insights';
import { ConceptPrerequisites } from '@/components/concept-prerequisites';
import Link from 'next/link';
import { TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export default function TopicMasteryPage() {
  // Group topics by mastery level
  const mastered = mockTopicMastery.filter(t => t.masteryLevel === 'mastered');
  const proficient = mockTopicMastery.filter(t => t.masteryLevel === 'proficient');
  const developing = mockTopicMastery.filter(t => t.masteryLevel === 'developing');
  const notStarted = mockTopicMastery.filter(t => t.masteryLevel === 'not_started');

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'mastered': return { bg: 'bg-[#f5f1e8]', border: 'border-[#7a8d7e]', text: 'text-[#7a8d7e]', icon: CheckCircle2 };
      case 'proficient': return { bg: 'bg-[#f5f1e8]', border: 'border-[#a89d94]', text: 'text-[#a89d94]', icon: TrendingUp };
      case 'developing': return { bg: 'bg-[#f5f1e8]', border: 'border-[#a88080]', text: 'text-[#a88080]', icon: AlertTriangle };
      case 'not_started': return { bg: 'bg-[#ede8df]', border: 'border-[#d4ccc3]', text: 'text-[#d4ccc3]', icon: Clock };
      default: return { bg: 'bg-[#ede8df]', border: 'border-[#d4ccc3]', text: 'text-[#d4ccc3]', icon: Clock };
    }
  };

  const calculateMasteryScore = (topic: any) => {
    return Math.round(
      (topic.practiceAccuracyPercent * 0.4) +
      (topic.taskCompletionPercent * 0.35) +
      (topic.selfRatingAverage * 0.15 * 20) -
      (topic.practiceAccuracyPercent < 70 ? 10 : 0)
    );
  };

  const renderMasteryCard = (topic: any) => {
    const colors = getMasteryColor(topic.masteryLevel);
    const IconComponent = colors.icon;
    const masteryScore = calculateMasteryScore(topic);
    const subtopicLabel = topic.subtopic.replace(/_/g, ' ').split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return (
      <Card key={topic.id} className={`border-2 ${colors.border} shadow-sm hover:shadow-md transition-all cursor-pointer ${colors.bg}`}>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {/* Header with Icon and Badge */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className={`p-2 rounded-lg ${colors.bg} border ${colors.border} flex-shrink-0`}>
                  <IconComponent className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#3d2f3f] leading-tight">{subtopicLabel}</h3>
                  <p className="text-xs text-[#a89d94] mt-0.5">{topic.topic.replace(/_/g, ' ').toUpperCase()}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold text-[#3d2f3f]">{masteryScore}%</div>
                <div className="text-xs text-[#3d2f3f]">Mastery</div>
              </div>
            </div>

            {/* Three-Signal Grid */}
            <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-lg bg-white/50 border border-slate-100">
              <div className="text-center">
                <div className="text-xs text-[#a89d94] mb-1 font-medium">Accuracy</div>
                <div className="text-lg font-bold text-[#3d2f3f]">{topic.practiceAccuracyPercent}%</div>
                <Progress value={topic.practiceAccuracyPercent} className="h-1.5 mt-1.5" />
              </div>
              <div className="text-center border-l border-r border-[#e8e3db]">
                <div className="text-xs text-[#a89d94] mb-1 font-medium">Completion</div>
                <div className="text-lg font-bold text-[#3d2f3f]">{topic.taskCompletionPercent}%</div>
                <Progress value={topic.taskCompletionPercent} className="h-1.5 mt-1.5" />
              </div>
              <div className="text-center">
                <div className="text-xs text-[#a89d94] mb-1 font-medium">Confidence</div>
                <div className="text-lg font-bold text-[#3d2f3f]">{topic.selfRatingAverage}/5</div>
                <Progress value={(topic.selfRatingAverage / 5) * 100} className="h-1.5 mt-1.5" />
              </div>
            </div>

            {/* Last Review Date */}
            {topic.lastReviewDate && (
              <div className="text-xs text-[#a89d94] pt-1">
                Last reviewed: <span className="font-medium">{topic.lastReviewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-[#e8e3db]">
              <Link href={`/coach?topic=${topic.topic}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  {topic.masteryLevel === 'mastered' ? '⭐ Deep Dive' : topic.masteryLevel === 'proficient' ? 'Practice' : 'Get Help'}
                </Button>
              </Link>
              <Link href="/error-log" className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Review Errors
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-[#e8e3db]">
          <h1 className="text-4xl font-light text-[#3d2f3f] mb-2">Topic Mastery</h1>
          <p className="text-[#a89d94]">
            Track your proficiency across all GRE quantitative topics with multi-signal analysis
          </p>
        </div>

        {/* Error Pattern Insights */}
        <div className="mb-8">
          <ErrorPatternInsights patterns={mockErrorPatterns} />
        </div>

        {/* Concept Prerequisites */}
        <div className="mb-10">
          <ConceptPrerequisites 
            prerequisites={mockConceptPrerequisites}
            topicMasteryMap={mockTopicMastery.reduce((acc, tm) => {
              acc[tm.subtopic] = tm.masteryLevel;
              return acc;
            }, {} as Record<string, any>)}
          />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-[#3d2f3f] uppercase tracking-wide">Mastered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#7a8d7e]">{mastered.length}</div>
              <p className="text-xs text-[#3d2f3f] mt-2">Excellent command</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-[#3d2f3f] uppercase tracking-wide">Proficient</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#a88080]">{proficient.length}</div>
              <p className="text-xs text-[#3d2f3f] mt-2">Solid foundation</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-[#3d2f3f] uppercase tracking-wide">Focus Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#a88080]">{developing.length}</div>
              <p className="text-xs text-[#3d2f3f] mt-2">Needs attention</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-[#3d2f3f] uppercase tracking-wide">Not Started</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#a89d94]">{notStarted.length}</div>
              <p className="text-xs text-[#3d2f3f] mt-2">Coming up</p>
            </CardContent>
          </Card>
        </div>

        {/* Mastered Topics */}
        {mastered.length > 0 && (
          <div className="mb-12">
            <div className="mb-4 pb-3 border-b border-[#e8e3db] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#7a8d7e]" />
              <h2 className="text-lg font-semibold text-[#3d2f3f]">Mastered Topics ({mastered.length})</h2>
              <span className="text-xs text-[#7a8d7e] font-semibold ml-auto">Keep Sharp</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mastered.map(renderMasteryCard)}
            </div>
          </div>
        )}

        {/* Proficient Topics */}
        {proficient.length > 0 && (
          <div className="mb-12">
            <div className="mb-4 pb-3 border-b border-[#e8e3db] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#a88080]" />
              <h2 className="text-lg font-semibold text-[#3d2f3f]">Proficient Topics ({proficient.length})</h2>
              <span className="text-xs text-[#a88080] font-semibold ml-auto">On Track</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proficient.map(renderMasteryCard)}
            </div>
          </div>
        )}

        {/* Developing Topics - HIGH PRIORITY */}
        {developing.length > 0 && (
          <div className="mb-12">
            <div className="mb-4 pb-3 border-b border-[#e8e3db] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#a88080]" />
              <h2 className="text-lg font-semibold text-[#3d2f3f]">Focus Areas ({developing.length})</h2>
              <span className="text-xs text-[#a88080] font-semibold ml-auto">PRIORITY</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {developing.map(renderMasteryCard)}
            </div>
          </div>
        )}

        {/* Not Started Topics */}
        {notStarted.length > 0 && (
          <div className="mb-12">
            <div className="mb-4 pb-3 border-b border-[#e8e3db] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#a89d94]" />
              <h2 className="text-lg font-semibold text-[#3d2f3f]">Not Started ({notStarted.length})</h2>
              <span className="text-xs text-[#a89d94] font-semibold ml-auto">Upcoming</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notStarted.map(renderMasteryCard)}
            </div>
          </div>
        )}

        {/* Methodology Card */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-[#f5f1e8] to-[#f5f1e8] mt-10">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#3d2f3f] flex items-center gap-2">
              📊 How Mastery is Calculated
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <p className="font-medium">Your mastery score combines four evidence-based signals:</p>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-2 rounded-lg bg-white/50">
                <div className="text-lg font-bold text-[#3d2f3f] min-w-[3rem]">40%</div>
                <div>
                  <div className="font-semibold text-[#3d2f3f]">Practice Accuracy</div>
                  <div className="text-xs text-[#a89d94]">Your correctness on practice problems</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg bg-white/50">
                <div className="text-lg font-bold text-[#3d2f3f] min-w-[3rem]">35%</div>
                <div>
                  <div className="font-semibold text-[#3d2f3f]">Task Completion</div>
                  <div className="text-xs text-[#a89d94]">Percentage of assigned work finished</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg bg-white/50">
                <div className="text-lg font-bold text-[#3d2f3f] min-w-[3rem]">15%</div>
                <div>
                  <div className="font-semibold text-[#3d2f3f]">Self-Confidence</div>
                  <div className="text-xs text-[#a89d94]">Your honest assessment of understanding</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg bg-white/50 border border-[#e8e3db]">
                <div className="text-lg font-bold text-[#a88080] min-w-[3rem]">-10%</div>
                <div>
                  <div className="font-semibold text-[#3d2f3f]">Error Penalty</div>
                  <div className="text-xs text-[#a89d94]">When accuracy drops below 70%</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 rounded-lg bg-white/50 border border-[#e8e3db]">
              <p className="text-xs font-mono text-slate-700 leading-relaxed">
                <span className="font-semibold text-[#3d2f3f]">Formula:</span><br/>
                Score = (Accuracy × 0.40) + (Completion × 0.35) + (Confidence × 0.15 × 20) − (Accuracy &lt; 70% ? 10 : 0)
              </p>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-[#f5f1e8] border border-[#e8e3db] text-xs text-[#a88080]">
              <p className="font-semibold mb-1">Why this matters:</p>
              <p>This formula ensures mastery is based on EVIDENCE, not opinion. We weight practice accuracy highest because it's the most reliable indicator. The 10-point penalty at 70% creates a clear mastery gate—below 70% accuracy signals you need targeted review.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
