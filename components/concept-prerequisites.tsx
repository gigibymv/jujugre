'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { ConceptPrerequisite, MasteryLevel } from '@/lib/data-schema';

interface ConceptPrerequisitesProps {
  prerequisites: ConceptPrerequisite[];
  topicMasteryMap: Record<string, MasteryLevel>;
}

const masteryLevelRank: Record<MasteryLevel, number> = {
  not_started: 0,
  developing: 1,
  proficient: 2,
  mastered: 3,
};

export function ConceptPrerequisites({ prerequisites, topicMasteryMap }: ConceptPrerequisitesProps) {
  if (prerequisites.length === 0) {
    return null;
  }

  const prerequisites_unlocked = prerequisites.filter((p) => {
    const prereqMastery = topicMasteryMap[p.prerequisiteSubtopic];
    return prereqMastery && masteryLevelRank[prereqMastery] >= masteryLevelRank[p.minimumMasteryRequired];
  });

  const prerequisites_locked = prerequisites.filter((p) => {
    const prereqMastery = topicMasteryMap[p.prerequisiteSubtopic];
    return !prereqMastery || masteryLevelRank[prereqMastery] < masteryLevelRank[p.minimumMasteryRequired];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Lock className="h-5 w-5 text-muted-foreground" aria-hidden />
          Learning prerequisites
        </CardTitle>
        <p className="mt-1 text-xs text-muted-foreground">
          Foundational concepts should be solid before stacking harder material.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {prerequisites_unlocked.length > 0 && (
          <div>
            <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden />
              Ready to learn ({prerequisites_unlocked.length})
            </p>
            <div className="space-y-2">
              {prerequisites_unlocked.map((prereq, idx) => (
                <div key={idx} className="rounded-lg border border-accent/30 bg-accent/5 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {prereq.subtopic.replace(/_/g, ' ')}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{prereq.reason}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 border-accent/40 bg-background text-accent">
                      Prerequisite met
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {prerequisites_locked.length > 0 && (
          <div>
            <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-foreground">
              <Lock className="h-4 w-4 text-muted-foreground" aria-hidden />
              Prerequisites to master ({prerequisites_locked.length})
            </p>
            <div className="space-y-2">
              {prerequisites_locked.map((prereq, idx) => {
                const prereqMastery = topicMasteryMap[prereq.prerequisiteSubtopic];
                const isNotStarted = !prereqMastery || prereqMastery === 'not_started';

                return (
                  <div key={idx} className="rounded-lg border border-border bg-muted/40 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          Master {prereq.prerequisiteSubtopic.replace(/_/g, ' ')} first
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{prereq.reason}</p>
                        <div className="mt-2">
                          <p className="text-xs font-medium text-foreground">
                            Current:{' '}
                            <Badge variant="outline" className="ml-1 text-xs">
                              {isNotStarted ? 'Not started' : prereqMastery?.replace(/_/g, ' ')}
                            </Badge>
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Required: {prereq.minimumMasteryRequired}
                          </p>
                        </div>
                      </div>
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="surface-quiet rounded-lg p-3 text-xs text-muted-foreground">
          <p className="mb-1 font-semibold text-foreground">Why prerequisites matter</p>
          <p>
            Solid foundations before advanced topics reduce repeated mistakes and match a structured quant
            prep path.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
