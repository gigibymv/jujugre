'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Zap, TrendingDown } from 'lucide-react';
import { ErrorPatternAnalysis } from '@/lib/data-schema';

interface ErrorPatternInsightsProps {
  patterns: ErrorPatternAnalysis[];
}

const masteryGateLabels: Record<
  string,
  { label: string; description: string; box: string; badge: string }
> = {
  concept_unknown: {
    label: 'Concept gap',
    description: 'You may not understand the core concept yet.',
    box: 'border-destructive/35 bg-destructive/5',
    badge: 'border-destructive/30 bg-destructive/10 text-destructive',
  },
  conceptual_error: {
    label: 'Conceptual error',
    description: 'You understand the idea but applied it incorrectly.',
    box: 'border-chart-4/40 bg-muted/40',
    badge: 'border-border bg-muted text-foreground',
  },
  computational_error: {
    label: 'Calculation error',
    description: 'The concept is solid; arithmetic slipped.',
    box: 'border-border bg-muted/30',
    badge: 'border-border bg-secondary text-secondary-foreground',
  },
  careless_mistake: {
    label: 'Careless mistake',
    description: 'You know this but rushed or missed a detail.',
    box: 'border-primary/25 bg-muted/20',
    badge: 'border-primary/30 bg-primary/10 text-primary',
  },
};

export function ErrorPatternInsights({ patterns }: ErrorPatternInsightsProps) {
  if (patterns.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <TrendingDown className="h-5 w-5 text-muted-foreground" aria-hidden />
          Error pattern analysis
        </CardTitle>
        <p className="mt-1 text-xs text-muted-foreground">
          Recurring mistakes surfaced so you can strengthen weak areas.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {patterns.map((pattern, idx) => {
          const gateInfo = masteryGateLabels[pattern.masteryGate] ?? {
            label: pattern.masteryGate,
            description: '',
            box: 'border-border bg-muted/30',
            badge: 'border-border bg-muted',
          };

          return (
            <div key={idx} className={`rounded-lg border-2 p-4 ${gateInfo.box}`}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {pattern.errorCategory.replace(/_/g, ' ')}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{gateInfo.description}</p>
                </div>
                <Badge variant="outline" className={`shrink-0 ${gateInfo.badge}`}>
                  {gateInfo.label}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-foreground">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden />
                  <span className="font-medium">
                    {pattern.totalOccurrences} occurrence{pattern.totalOccurrences !== 1 ? 's' : ''}
                  </span>
                </div>

                {pattern.affectedSubtopics.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Affected subtopics</p>
                    <div className="flex flex-wrap gap-1">
                      {pattern.affectedSubtopics.map((subtopic) => (
                        <Badge key={subtopic} variant="outline" className="text-xs">
                          {subtopic.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {pattern.commonTriggersAndTraps.length > 0 && (
                  <div>
                    <p className="mb-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <Zap className="h-3 w-3" aria-hidden />
                      Common triggers
                    </p>
                    <ul className="space-y-0.5 text-xs text-muted-foreground">
                      {pattern.commonTriggersAndTraps.map((trigger, i) => (
                        <li key={i} className="list-inside list-disc">
                          {trigger}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                {pattern.masteryGate === 'concept_unknown' && (
                  <span>Next: open Topic mastery and get coach help on this concept.</span>
                )}
                {pattern.masteryGate === 'conceptual_error' && (
                  <span>Next: review the learning concepts in your error log entries.</span>
                )}
                {pattern.masteryGate === 'computational_error' && (
                  <span>Next: practice similar problems with careful arithmetic.</span>
                )}
                {pattern.masteryGate === 'careless_mistake' && (
                  <span>Next: add a checklist step: did you verify every detail before answering?</span>
                )}
              </div>
            </div>
          );
        })}

        <div className="surface-quiet rounded-lg p-3 text-xs text-muted-foreground">
          <p className="mb-1 font-semibold text-foreground">How we identify patterns</p>
          <p>
            We categorize each logged error and track affected concepts to separate systemic issues from
            one-offs, then suggest a recovery strategy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
