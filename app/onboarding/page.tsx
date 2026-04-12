'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserPlan } from '@/components/user-plan-provider';
import { useState } from 'react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useUserPlan();
  const [step, setStep] = useState(1);
  const [targetDate, setTargetDate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('10');
  const [weakAreas, setWeakAreas] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(3);
  const [agreed, setAgreed] = useState(false);

  const weakAreaOptions = [
    'Fractions',
    'Algebra',
    'Geometry',
    'Data Analysis',
    'Probability',
  ];

  const toggleWeakArea = (area: string) => {
    setWeakAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${
                  s <= step ? 'bg-[#3d2f3f]' : 'bg-[#ede8df]'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-slate-500">
            Step {step} of 4
          </p>
        </div>

        {/* Card Content */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-light text-[#3d2f3f]">
              {step === 1 && 'When is your GRE?'}
              {step === 2 && 'How much time can you commit?'}
              {step === 3 && 'Where do you need the most help?'}
              {step === 4 && 'Review your plan'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Target Date */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="targetDate" className="text-slate-700 font-medium">
                    Target GRE Date
                  </Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    Choose a date 3-4 months from now for best results
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Hours per Week */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-700 font-medium">
                    Study Hours Per Week
                  </Label>
                  <div className="mt-4 space-y-3">
                    {[
                      { value: 5, label: '5 hours / week', desc: 'Light (1 hr/day)' },
                      { value: 10, label: '10 hours / week', desc: 'Moderate (2 hrs/day)' },
                      { value: 20, label: '20 hours / week', desc: 'Intensive (3+ hrs/day)' },
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setHoursPerWeek(String(option.value))}
                        className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                          hoursPerWeek === String(option.value)
                            ? 'border-[#3d2f3f] bg-[#f5f1e8]'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-medium text-[#3d2f3f]">{option.label}</div>
                        <div className="text-sm text-slate-500">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Weak Areas */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-700 font-medium mb-3 block">
                    Select your weak areas (optional)
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {weakAreaOptions.map(area => (
                      <button
                        key={area}
                        onClick={() => toggleWeakArea(area)}
                        className={`p-3 rounded-lg border-2 transition-colors text-left ${
                          weakAreas.includes(area)
                            ? 'border-[#3d2f3f] bg-[#f5f1e8]'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={weakAreas.includes(area)}
                            onCheckedChange={() => toggleWeakArea(area)}
                          />
                          <span className="font-medium text-[#3d2f3f]">{area}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#7a8d7e] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-[#3d2f3f]">GRE Date Set</p>
                      <p className="text-sm text-slate-500">{targetDate || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#7a8d7e] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-[#3d2f3f]">Study Plan</p>
                      <p className="text-sm text-slate-500">{hoursPerWeek} hours per week</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#7a8d7e] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-[#3d2f3f]">Weak Areas</p>
                      <p className="text-sm text-slate-500">
                        {weakAreas.length > 0 ? weakAreas.join(', ') : 'None selected'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f5f1e8] p-4 rounded-lg border border-[#e8e3db]">
                  <p className="text-sm text-slate-700 mb-3">
                    ✨ You'll follow the proven 12-week GregMat plan, customized to your weak areas. Our AI coach will guide you with rigorous explanations and track your progress across all 28 GRE quant topics.
                  </p>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={agreed}
                      onCheckedChange={(val) => setAgreed(val as boolean)}
                      id="agree"
                    />
                    <Label htmlFor="agree" className="text-sm text-slate-700 cursor-pointer">
                      I'm ready to start my GRE prep journey
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Back
                </Button>
              )}
              {step < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !targetDate) ||
                    (step === 2 && !hoursPerWeek)
                  }
                  className="flex-1 gap-2 bg-[#3d2f3f] hover:bg-[#5a4a5c] text-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={!agreed}
                  className="flex-1 gap-2 bg-[#3d2f3f] hover:bg-[#5a4a5c] text-white"
                  onClick={() => {
                    const target = new Date(`${targetDate}T12:00:00`);
                    completeOnboarding({
                      targetGREDate: target.toISOString(),
                      weeklyHoursTarget: Number(hoursPerWeek) || 10,
                      weakAreaLabels: weakAreas,
                    });
                    router.push('/');
                  }}
                >
                  Start Studying
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          You can adjust your plan anytime in Settings.
        </p>
      </div>
    </div>
  );
}
