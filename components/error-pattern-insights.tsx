'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Zap, TrendingDown } from 'lucide-react';
import { ErrorPatternAnalysis } from '@/lib/data-schema';

interface ErrorPatternInsightsProps {
  patterns: ErrorPatternAnalysis[];
}

const masteryGateLabels: Record<string, { label: string; description: string; color: string }> = {
  concept_unknown: {
    label: 'Concept Gap',
    description: 'You may not understand the core concept yet',
    color: 'bg-red-50 border-red-200 text-red-700',
  },
  conceptual_error: {
    label: 'Conceptual Error',
    description: 'You understand the concept but apply it incorrectly',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
  },
  computational_error: {
    label: 'Calculation Error',
    description: 'The concept is solid, but arithmetic slipped',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  },
  careless_mistake: {
    label: 'Careless Mistake',
    description: 'You know this but rushed or missed a detail',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
  },
};

export function ErrorPatternInsights({ patterns }: ErrorPatternInsightsProps) {
  if (patterns.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-50 to-blue-50">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-blue-600" />
          Error Pattern Analysis
        </CardTitle>
        <p className="text-xs text-slate-600 mt-1">Identifying recurring mistakes to strengthen weak areas</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {patterns.map((pattern, idx) => {
          const gateInfo = masteryGateLabels[pattern.masteryGate];

          return (
            <div
              key={idx}
              className={`p-4 rounded-lg border-2 ${gateInfo.color}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-sm">{pattern.errorCategory.replace(/_/g, ' ')}</p>
                  <p className="text-xs mt-0.5 opacity-75">{gateInfo.description}</p>
                </div>
                <Badge className={`shrink-0 ${gateInfo.color}`}>
                  {gateInfo.label}
                </Badge>
              </div>

              {/* Occurrences and affected topics */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">{pattern.totalOccurrences} occurrence{pattern.totalOccurrences !== 1 ? 's' : ''}</span>
                </div>

                {pattern.affectedSubtopics.length > 0 && (
                  <div>
                    <p className="text-xs font-medium opacity-75 mb-1">Affected subtopics:</p>
                    <div className="flex flex-wrap gap-1">
                      {pattern.affectedSubtopics.map(subtopic => (
                        <Badge
                          key={subtopic}
                          variant="outline"
                          className="text-xs"
                        >
                          {subtopic.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {pattern.commonTriggersAndTraps.length > 0 && (
                  <div>
                    <p className="text-xs font-medium opacity-75 mb-1 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Common triggers:
                    </p>
                    <ul className="text-xs space-y-0.5 opacity-90">
                      {pattern.commonTriggersAndTraps.map((trigger, i) => (
                        <li key={i} className="list-disc list-inside">
                          {trigger}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Recommendation based on gate */}
              <div className="mt-3 pt-3 border-t border-current border-opacity-20 text-xs opacity-85">
                {pattern.masteryGate === 'concept_unknown' && (
                  '→ Go to Topic Mastery to get coach help on this concept'
                )}
                {pattern.masteryGate === 'conceptual_error' && (
                  '→ Review the learning concepts in your error log entries'
                )}
                {pattern.masteryGate === 'computational_error' && (
                  '→ Practice similar problems with careful arithmetic'
                )}
                {pattern.masteryGate === 'careless_mistake' && (
                  '→ Add a checklist step: "Did I check all details before answering?"'
                )}
              </div>
            </div>
          );
        })}

        <div className="p-3 rounded-lg bg-white/40 border border-current border-opacity-20 text-xs">
          <p className="font-semibold mb-1">How we identify patterns:</p>
          <p className="opacity-75">
            We analyze each error you log, categorize the type of mistake, and track which concepts are affected. This helps us spot systemic issues vs. one-off mistakes, so we can recommend the right recovery strategy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
