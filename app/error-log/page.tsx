'use client';

// Trigger full rebuild - v6
// Cache invalidation timestamp: 2026-03-17T21:54:00Z

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockErrorLogEntries } from '@/lib/mock-data';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Clock, Zap, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function ErrorLogPage() {
  const [sortBy, setSortBy] = useState<'review_due' | 'recent' | 'topic'>('review_due');
  const [filterReviewed, setFilterReviewed] = useState<'all' | 'unreviewed' | 'reviewed'>('unreviewed');

  // Filter
  let filtered = mockErrorLogEntries;
  if (filterReviewed === 'unreviewed') {
    filtered = filtered.filter(e => !e.reviewed);
  } else if (filterReviewed === 'reviewed') {
    filtered = filtered.filter(e => e.reviewed);
  }

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'review_due') {
      return a.reviewDueDate.getTime() - b.reviewDueDate.getTime();
    } else if (sortBy === 'recent') {
      return b.createdAt.getTime() - a.createdAt.getTime();
    } else {
      return a.topic.localeCompare(b.topic);
    }
  });

  const unreviewedCount = mockErrorLogEntries.filter(e => !e.reviewed).length;
  const reviewDueNow = sorted.filter(e => e.reviewDueDate <= new Date()).length;

  // Group errors by category for insight
  const categoryStats = mockErrorLogEntries.reduce((acc: Record<string, number>, err) => {
    const cat = err.errorCategory;
    if (!acc[cat]) acc[cat] = 0;
    acc[cat]++;
    return acc;
  }, {});

  const topProblematicCategory = Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0] as [string, number] | undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f3] via-white to-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-slate-200">
          <h1 className="text-4xl font-light text-slate-900 mb-2">Error Log</h1>
          <p className="text-slate-600">
            Turn mistakes into reusable learning. Every error is a data point on your journey.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{mockErrorLogEntries.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Unreviewed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${unreviewedCount > 0 ? 'text-[#a88080]' : 'text-[#7a8d7e]'}`}>
                {unreviewedCount}
              </div>
              {reviewDueNow > 0 && (
                <p className="text-xs text-[#a88080] font-semibold mt-1">{reviewDueNow} due now</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Reviewed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#7a8d7e]">
                {mockErrorLogEntries.filter(e => e.reviewed).length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Top Issue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold text-slate-900">
                {topProblematicCategory ? topProblematicCategory[0].replace(/_/g, ' ') : 'N/A'}
              </div>
              {topProblematicCategory && (
                <p className="text-xs text-slate-500 mt-1">{String(topProblematicCategory[1])} errors</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alert: Review Due Now */}
        {reviewDueNow > 0 && (
          <Card className="border-0 shadow-sm bg-gradient-to-r from-amber-50 to-orange-50 mb-8 border-l-4 border-l-amber-400">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#a88080] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#a88080]">
                    {reviewDueNow} error{reviewDueNow !== 1 ? 's' : ''} due for review
                  </p>
                  <p className="text-sm text-[#a88080] mt-1">
                    Reviewing mistakes within 48 hours drastically improves retention. Focus on these first.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="flex gap-1 bg-white rounded-lg shadow-sm p-1 border border-slate-200">
            <Button
              variant={filterReviewed === 'unreviewed' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilterReviewed('unreviewed')}
              className="text-xs"
            >
              Unreviewed ({unreviewedCount})
            </Button>
            <Button
              variant={filterReviewed === 'reviewed' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilterReviewed('reviewed')}
              className="text-xs"
            >
              Reviewed ({mockErrorLogEntries.filter(e => e.reviewed).length})
            </Button>
            <Button
              variant={filterReviewed === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilterReviewed('all')}
              className="text-xs"
            >
              All
            </Button>
          </div>

          <div className="flex gap-2 bg-white rounded-lg shadow-sm p-1 border border-slate-200 md:ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs px-3 py-2 bg-white border-0 rounded text-slate-700"
            >
              <option value="review_due">Review Due (Priority)</option>
              <option value="recent">Most Recent</option>
              <option value="topic">By Topic</option>
            </select>
          </div>
        </div>

        {/* Error Entries */}
        <div className="space-y-3">
          {sorted.length === 0 ? (
            <Card className="border-0 shadow-sm bg-green-50 border-l-4 border-l-green-500">
              <CardContent className="pt-6 pb-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-[#7a8d7e] mx-auto mb-3" />
                <p className="font-semibold text-[#a88080] mb-1">All errors reviewed!</p>
                <p className="text-sm text-[#a88080]">Keep up the excellent work. Continue practicing to avoid future mistakes.</p>
              </CardContent>
            </Card>
          ) : (
            sorted.map(error => {
              const topicLabel = error.subtopic.replace(/_/g, ' ').split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
              const isReviewDue = error.reviewDueDate <= new Date();
              const daysUntilDue = Math.ceil((error.reviewDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

              return (
                <Card 
                  key={error.id} 
                  className={`border-2 shadow-sm hover:shadow-md transition-all ${
                    error.reviewed 
                      ? 'border-slate-200 bg-slate-50' 
                      : isReviewDue
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {/* Header: Topic, Category, Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs bg-white">{topicLabel}</Badge>
                            <Badge className="text-xs bg-[#f5f1e8] text-[#a88080] border-[#e8e3db]" variant="outline">
                              {error.errorCategory.replace(/_/g, ' ')}
                            </Badge>
                            {error.reviewed && (
                              <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                                ✓ Reviewed
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                            {error.problem}
                          </h3>
                        </div>

                        {/* Status Indicator */}
                        <div className="flex-shrink-0">
                          {!error.reviewed && isReviewDue && (
                            <div className="text-right">
                              <AlertCircle className="w-5 h-5 text-[#a88080] mb-1" />
                              <p className="text-xs font-semibold text-[#a88080]">Due Now</p>
                            </div>
                          )}
                          {!error.reviewed && !isReviewDue && (
                            <div className="text-right">
                              <Clock className="w-5 h-5 text-slate-400 mb-1" />
                              <p className="text-xs text-slate-600">{daysUntilDue}d away</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Student vs Correct Answer */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                          <div className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">You Answered</div>
                          <div className="font-mono text-red-900 font-semibold">{error.studentAnswer}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                          <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Correct Answer</div>
                          <div className="font-mono text-[#a88080] font-semibold">{error.correctAnswer}</div>
                        </div>
                      </div>

                      {/* Explanation */}
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Why This Matters</div>
                        <p className="text-sm text-slate-800 leading-relaxed">{error.explanation}</p>
                      </div>

                      {/* Protocol Elements */}
                      {error.protocolElements && error.protocolElements.length > 0 && (
                        <div className="p-3 rounded-lg bg-[#f5f1e8] border border-[#e8e3db]">
                          <div className="text-xs font-semibold text-[#a88080] uppercase tracking-wide mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Learning Concepts
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {error.protocolElements.map((el: string) => (
                              <Badge key={el} variant="outline" className="text-xs bg-white text-[#a88080] border-[#e8e3db]">
                                {el.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Source Reference */}
                      <div className="text-xs text-slate-600 flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span className="italic">Source: {error.sourceReference}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2 border-t border-slate-200">
                        {!error.reviewed && (
                          <>
                            <Link href={`/coach?error=${error.id}`} className="flex-1">
                              <Button variant="default" size="sm" className="w-full text-xs">
                                Discuss with Coach
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-xs"
                              onClick={() => {
                                // Mark as reviewed
                                console.log('Marked', error.id, 'as reviewed');
                              }}
                            >
                              Mark Reviewed
                            </Button>
                          </>
                        )}
                        {error.reviewed && (
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            Review Again
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Guidance Card */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-[#faf8f3] to-[#f5f1e8] mt-10">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">How to Use This Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <div className="flex gap-3">
              <div className="text-lg font-bold text-slate-900 min-w-[2rem]">1</div>
              <div>
                <div className="font-semibold text-slate-900">Review Errors Due</div>
                <div className="text-xs text-slate-600">Prioritize items marked "due now" to maximize learning impact.</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-lg font-bold text-slate-900 min-w-[2rem]">2</div>
              <div>
                <div className="font-semibold text-slate-900">Discuss with Coach</div>
                <div className="text-xs text-slate-600">Use the AI Coach to deeply understand the concept behind each mistake.</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-lg font-bold text-slate-900 min-w-[2rem]">3</div>
              <div>
                <div className="font-semibold text-slate-900">Practice Similar Problems</div>
                <div className="text-xs text-slate-600">Once you understand the concept, drill similar problems until the pattern is automatic.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
