import fs from 'fs';
import path from 'path';
import { parseIcsPlan } from '../icsParser';

describe('ICS Parser', () => {
  const icsPath = path.resolve(__dirname, './plan.ics');
  const fileContent = fs.readFileSync(icsPath, 'utf-8');
  const plan = parseIcsPlan(fileContent);

  test('Filters out Rest days and successfully parses workouts', () => {
    // There are many events in the file, but "Rest" days should be skipped.
    expect(plan.workouts.length).toBeGreaterThan(0);

    const restDay = plan.workouts.find((w) =>
      w.title.toLowerCase().includes('rest or cross-train')
    );
    expect(restDay).toBeUndefined();
  });

  test('Correctly parses the "LT" workout (Jan 27) as Tempo', () => {
    // EVENT: DTSTART:20260127 -> SUMMARY: LT 13 km with 6 km at LT pace
    // Note: The parser sorts by date, so we find it by date matching
    const ltRun = plan.workouts.find((w) => w.date.toISOString().split('T')[0] === '2026-01-27');

    expect(ltRun).toBeDefined();
    expect(ltRun?.distanceKm).toBe(13);
    expect(ltRun?.type).toBe('Tempo');
  });

  test('Correctly parses "Gen-aerobic" (Jan 29) as Aerobic', () => {
    // EVENT: DTSTART:20260129 -> SUMMARY: Gen-aerobic 14 km
    const enduranceRun = plan.workouts.find(
      (w) => w.date.toISOString().split('T')[0] === '2026-01-29'
    );

    expect(enduranceRun).toBeDefined();
    expect(enduranceRun?.type).toBe('Aerobic');
    expect(enduranceRun?.distanceKm).toBe(14);

    expect(enduranceRun?.title).toBe('14km Aerobic Run');
  });

  test('Correctly parses "VO₂max" intervals (April 1) as Intervals', () => {
    // EVENT: DTSTART:20260401 -> VO₂max 13 km with 5 x 800 m...
    const intervalRun = plan.workouts.find(
      (w) => w.date.toISOString().split('T')[0] === '2026-04-01'
    );

    expect(intervalRun).toBeDefined();
    expect(intervalRun?.type).toBe('Intervals');
    // Ensure it grabbed the total volume (13km) not the interval distance
    expect(intervalRun?.distanceKm).toBe(13);
  });

  test('Ensures dates are real Date objects and sorted chronologically', () => {
    const firstRun = plan.workouts[0];
    const lastRun = plan.workouts[plan.workouts.length - 1];

    expect(firstRun.date).toBeInstanceOf(Date);

    // The plan starts in Jan 2026 and ends in May/June 2026
    expect(firstRun.date.getTime()).toBeLessThan(lastRun.date.getTime());
    expect(firstRun.date.getFullYear()).toBe(2026);
  });
});
