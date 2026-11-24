export { formatINR } from '@triyugi/shared';

/** Show dates in IST regardless of the visitor's device timezone. */
export function formatDateIST(date: Date | string, withTime = false): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    ...(withTime ? { timeStyle: 'short' } : {}),
  }).format(new Date(date));
}
