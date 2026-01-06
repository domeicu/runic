import { RunType } from '../domain/types';

/**
 * Maps CSV descriptions to your specific RunType definition.
 * Prioritizes "Key" workouts (Tempo/Intervals/Long) over general types.
 */
export const mapRunType = (desc: string): RunType => {
  const lower = desc.toLowerCase();
  if (lower.includes('recovery')) return 'Recovery';
  if (lower.includes('long run') || lower.includes('med-long') || lower.includes('endurance'))
    return 'Long';
  if (lower.includes('lt') || lower.includes('tempo') || lower.includes('marathon-pace'))
    return 'Tempo';
  if (lower.includes('interval') || lower.includes('vo') || lower.includes('hill sprints'))
    return 'Intervals';
  if (lower.includes('race') || lower.includes('tune-up')) return 'Race';
  if (lower.includes('gen-aerobic') || lower.includes('steady')) return 'Aerobic';
  return 'Easy';
};

/**
 * Extracts numeric distance from strings like "LT 13 km with..." or "Recovery 6 km"
 */
export const parseDistance = (desc: string): number => {
  const match = desc.match(/(\d+(\.\d+)?)\s*km/);
  return match ? parseFloat(match[1]) : 0;
};
