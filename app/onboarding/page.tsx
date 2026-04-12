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
  const [agreed, setAgreed] = useState(false);

  const weakAreaOptions = ['Fractions', 'Algebra', 'Geometry', 'Data Analysis', 'Probability'];

  const toggleWeakArea = (area: string) => {
    setWeakAreas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-surface-canvas px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div
            className="mb-4 flex gap-2"
            role="group"
            aria-label="Onboarding progress"
          >
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors duration-150 ease-out ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
                aria-current={s === step ? 'step' : undefined}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Step {step} of 4
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl font-normal tracking-tight text-foreground">
              {step === 1 && 'When is your GRE?'}
              {step === 2 && 'How much time can you commit?'}
              {step === 3 && 'Where do you need the most help?'}
              {step === 4 && 'Review your plan'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="targetDate" className="font-medium text-foreground">
                    Target GRE date
                  </Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="mt-2"
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Choose a date 3–4 months from now for best results.
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label className="font-medium text-foreground">Study hours per week</Label>
                  <div className="mt-4 space-y-3">
                    {[
                      { value: 5, label: '5 hours / week', desc: 'Light (about 1 hr/day)' },
                      { value: 10, label: '10 hours / week', desc: 'Moderate (about 2 hrs/day)' },
                      { value: 20, label: '20 hours / week', desc: 'Intensive (3+ hrs/day)' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setHoursPerWeek(String(option.value))}
                        className={`w-full rounded-lg border-2 p-4 text-left transition-colors duration-150 ease-out ${
                          hoursPerWeek === String(option.value)
                            ? 'border-primary bg-muted/60'
                            : 'border-border hover:border-muted-foreground/30'
                        }`}
                      >
                        <div className="font-medium text-foreground">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label className="mb-3 block font-medium text-foreground">
                    Select your weak areas (optional)
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {weakAreaOptions.map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleWeakArea(area)}
                        className={`rounded-lg border-2 p-3 text-left transition-colors duration-150 ease-out ${
                          weakAreas.includes(area)
                            ? 'border-primary bg-muted/60'
                            : 'border-border hover:border-muted-foreground/30'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={weakAreas.includes(area)}
                            onCheckedChange={() => toggleWeakArea(area)}
                          />
                          <span className="font-medium text-foreground">{area}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="surface-quiet space-y-3 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                    <div>
                      <p className="font-medium text-foreground">GRE date set</p>
                      <p className="text-sm text-muted-foreground">{targetDate || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                    <div>
                      <p className="font-medium text-foreground">Study plan</p>
                      <p className="text-sm text-muted-foreground">{hoursPerWeek} hours per week</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                    <div>
                      <p className="font-medium text-foreground">Weak areas</p>
                      <p className="text-sm text-muted-foreground">
                        {weakAreas.length > 0 ? weakAreas.join(', ') : 'None selected'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-muted/40 p-4">
                  <p className="mb-3 text-sm text-foreground">
                    You will follow the 12-week GregMat-style plan, adjusted for your weak areas. The coach
                    helps with explanations and you can track progress across GRE quant topics.
                  </p>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={agreed}
                      onCheckedChange={(val) => setAgreed(val === true)}
                      id="agree"
                    />
                    <Label htmlFor="agree" className="cursor-pointer text-sm text-foreground">
                      I am ready to start my GRE prep
                    </Label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 border-t border-border pt-4">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Back
                </Button>
              )}
              {step < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={(step === 1 && !targetDate) || (step === 2 && !hoursPerWeek)}
                  className="flex-1 gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={!agreed}
                  className="flex-1 gap-2"
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
                  Start studying
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          You can adjust your plan anytime in{' '}
          <Link href="/settings" className="text-foreground underline-offset-4 hover:underline">
            Settings
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
