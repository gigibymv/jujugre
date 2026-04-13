/** Days from local today (midnight) to target date (midnight). */
export function computeDaysRemaining(targetGREDate: Date): number {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(targetGREDate);
  end.setHours(0, 0, 0, 0);
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
