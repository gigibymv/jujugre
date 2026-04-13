import type { UserProfile } from '@/lib/data-schema';

/** Defaults when nothing is saved locally (no demo progress or fake dates). */
export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'local',
  name: 'Student',
  email: '',
  startDate: new Date(),
  targetGREDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  weeklyHoursTarget: 10,
  weakAreasFromOnboarding: [],
};
