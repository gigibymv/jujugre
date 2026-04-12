'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserPlan } from '@/components/user-plan-provider';
import { Lock, Bell, BookOpen, Calendar } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, studyPlan: plan, resetLocalState, hasCompletedOnboarding } = useUserPlan();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const weeklyHoursDisplay = user.weeklyHoursTarget;

  return (
    <div className="min-h-screen bg-[#faf8f3] py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-[#3d2f3f] mb-2">Settings</h1>
          <p className="text-[#a89d94]">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        <Card className="border-0 shadow-sm bg-white mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#3d2f3f]">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-700 font-medium">Name</Label>
              <Input value={user.name} readOnly className="mt-2 bg-slate-50" />
            </div>
            <div>
              <Label className="text-slate-700 font-medium">Email</Label>
              <Input value={user.email} readOnly className="mt-2 bg-slate-50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-700 font-medium">Study Start Date</Label>
                <Input
                  value={user.startDate.toLocaleDateString()}
                  readOnly
                  className="mt-2 bg-slate-50"
                />
              </div>
              <div>
                <Label className="text-slate-700 font-medium">Target GRE Date</Label>
                <Input
                  value={user.targetGREDate.toLocaleDateString()}
                  readOnly
                  className="mt-2 bg-slate-50"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/onboarding">Update plan & dates</Link>
              </Button>
              {hasCompletedOnboarding && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-[#a85a5a] border-[#e8c4c4] hover:bg-[#fdf2f2]"
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.confirm('Clear saved progress on this device?')) {
                      resetLocalState();
                    }
                  }}
                >
                  Reset local data
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Study Plan Section */}
        <Card className="border-0 shadow-sm bg-white mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#3d2f3f] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#a88080]" />
              Study Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#a89d94] font-medium">Plan Type</p>
                <p className="text-lg font-semibold text-[#3d2f3f] mt-1">
                  {plan.planName}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#a89d94] font-medium">Current Week</p>
                <p className="text-lg font-semibold text-[#3d2f3f] mt-1">
                  Week {plan.currentWeekNumber} of 12
                </p>
              </div>
              <div>
                <p className="text-sm text-[#a89d94] font-medium">Weekly Study Target</p>
                <p className="text-lg font-semibold text-[#3d2f3f] mt-1">
                  {weeklyHoursDisplay} hours
                </p>
              </div>
              <div>
                <p className="text-sm text-[#a89d94] font-medium">Plan Status</p>
                <Badge 
                  className={`mt-1 ${
                    plan.latenessState === 'on_track' 
                      ? 'bg-green-100 text-green-700' 
                      : plan.latenessState === 'recovering'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {plan.latenessState === 'on_track' 
                    ? 'On Track' 
                    : plan.latenessState === 'recovering'
                    ? 'Recovering'
                    : 'Behind'}
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Adjust Study Plan
            </Button>
          </CardContent>
        </Card>

        {/* Weak Areas */}
        <Card className="border-0 shadow-sm bg-white mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#3d2f3f] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#a88080]" />
              Initial Weak Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#a89d94]">
              Topics you identified as challenging at onboarding:
            </p>
            <div className="flex flex-wrap gap-2">
              {user.weakAreasFromOnboarding && user.weakAreasFromOnboarding.length > 0 ? (
                user.weakAreasFromOnboarding.map(area => (
                  <Badge key={area} variant="outline" className="text-sm">
                    {area.replace(/_/g, ' ')}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">None selected</p>
              )}
            </div>
            <Button variant="outline" className="w-full">
              Update Weak Areas
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-sm bg-white mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#3d2f3f] flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#a88080]" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-[#3d2f3f]">Push Notifications</p>
                <p className="text-sm text-slate-500">Study reminders and milestones</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  notifications ? 'bg-[#3d2f3f]' : 'bg-[#ede8df]'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-[#3d2f3f]">Email Updates</p>
                <p className="text-sm text-slate-500">Weekly progress reports</p>
              </div>
              <button
                onClick={() => setEmailUpdates(!emailUpdates)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  emailUpdates ? 'bg-[#3d2f3f]' : 'bg-[#ede8df]'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    emailUpdates ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Account & Security */}
        <Card className="border-0 shadow-sm bg-white mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#3d2f3f] flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" />
              Account & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full">
              View Login Activity
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-0 shadow-sm bg-red-50 border border-red-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-red-900">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50">
              Reset All Progress
            </Button>
            <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50">
              Delete Account
            </Button>
            <p className="text-xs text-red-700">
              These actions cannot be undone. Please be careful.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
          <p>GRE Tutor v1.0</p>
          <p>© 2026. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
