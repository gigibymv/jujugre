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

  const prerequisites_unlocked = prerequisites.filter(p => {
    const prereqMastery = topicMasteryMap[p.prerequisiteSubtopic];
    return prereqMastery && masteryLevelRank[prereqMastery] >= masteryLevelRank[p.minimumMasteryRequired];
  });

  const prerequisites_locked = prerequisites.filter(p => {
    const prereqMastery = topicMasteryMap[p.prerequisiteSubtopic];
    return !prereqMastery || masteryLevelRank[prereqMastery] < masteryLevelRank[p.minimumMasteryRequired];
  });

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-600" />
          Learning Prerequisites
        </CardTitle>
        <p className="text-xs text-slate-600 mt-1">Concepts must be mastered in order to build strong foundations</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Unlocked prerequisites */}
        {prerequisites_unlocked.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Ready to Learn ({prerequisites_unlocked.length})
            </p>
            <div className="space-y-2">
              {prerequisites_unlocked.map((prereq, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-900">
                        {prereq.subtopic.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">{prereq.reason}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-300 shrink-0">
                      Prerequisite Met
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked prerequisites */}
        {prerequisites_locked.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
              <Lock className="w-4 h-4 text-amber-600" />
              Prerequisites to Master ({prerequisites_locked.length})
            </p>
            <div className="space-y-2">
              {prerequisites_locked.map((prereq, idx) => {
                const prereqMastery = topicMasteryMap[prereq.prerequisiteSubtopic];
                const isNotStarted = !prereqMastery || prereqMastery === 'not_started';

                return (
                  <div key={idx} className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-slate-900">
                          Master: {prereq.prerequisiteSubtopic.replace(/_/g, ' ')} first
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">{prereq.reason}</p>
                        <div className="mt-2">
                          <p className="text-xs text-amber-700 font-medium">
                            Current: <Badge variant="outline" className="text-xs ml-1">
                              {isNotStarted ? 'Not Started' : prereqMastery?.replace(/_/g, ' ')}
                            </Badge>
                          </p>
                          <p className="text-xs text-amber-700 mt-1">
                            Required: {prereq.minimumMasteryRequired}
                          </p>
                        </div>
                      </div>
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="p-3 rounded-lg bg-white/60 border border-current border-opacity-20 text-xs">
          <p className="font-semibold mb-1">Why prerequisites matter:</p>
          <p className="opacity-85">
            Mastering foundational concepts before moving to advanced topics ensures true understanding and prevents careless mistakes. This structured approach follows the rigorous GRE preparation methodology.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
