import fs from 'fs';
import path from 'path';
import { parseCsvPlan } from '../csvParser';

describe('CSV Parser', () => {
  // Make sure this points to the file with the 4 weeks of data you provided
  const csvPath = path.resolve(__dirname, './plan.csv');
  const validCsv = fs.readFileSync(csvPath, 'utf-8');
  const plan = parseCsvPlan(validCsv);

  test('Filters out Rest days and successfully parses workouts', () => {
    // Week 1 (4 runs) + Week 2 (4 runs) + Week 3 (5 runs) + Week 4 (5 runs) = 18 Total
    expect(plan.workouts).toHaveLength(18);

    const restDay = plan.workouts.find((w) =>
      w.title.toLowerCase().includes('rest or cross-train')
    );
    expect(restDay).toBeUndefined();
  });

  test('Correctly parses the "LT" workout (Jan 27) as Tempo', () => {
    // Row: "2026-01-27: LT 13 km with 6 km at LT pace"
    const ltRun = plan.workouts.find((w) => w.date.toISOString().split('T')[0] === '2026-01-27');

    expect(ltRun).toBeDefined();
    expect(ltRun?.distanceKm).toBe(13);
    expect(ltRun?.type).toBe('Tempo');
    // Parser splits on " with", so title should be clean
    expect(ltRun?.title).toBe('13km Tempo Run');
  });

  test('Correctly parses "Gen-aerobic" (Jan 29) as Aerobic', () => {
    // Row: "2026-01-29: Gen-aerobic 14 km"
    const enduranceRun = plan.workouts.find(
      (w) => w.date.toISOString().split('T')[0] === '2026-01-29'
    );

    expect(enduranceRun).toBeDefined();
    expect(enduranceRun?.type).toBe('Aerobic');
    expect(enduranceRun?.distanceKm).toBe(14);

    expect(enduranceRun?.title).toBe('14km Aerobic Run');
  });

  test('Correctly parses "Gen-aerobic + speed" (Feb 17) as Intervals', () => {
    // Row: "2026-02-17: Gen-aerobic + speed 13 km with..."
    // "Speed" keyword in our utils maps to Intervals
    const intervalRun = plan.workouts.find(
      (w) => w.date.toISOString().split('T')[0] === '2026-02-17'
    );

    expect(intervalRun).toBeDefined();
    expect(intervalRun?.type).toBe('Intervals');
    expect(intervalRun?.distanceKm).toBe(13);
  });

  test('Ensures dates are real Date objects and sorted chronologically', () => {
    const firstRun = plan.workouts[0];
    const lastRun = plan.workouts[plan.workouts.length - 1];

    expect(firstRun.date).toBeInstanceOf(Date);

    // First run is Jan 27, Last run is Feb 22
    expect(firstRun.date.getTime()).toBeLessThan(lastRun.date.getTime());
    expect(firstRun.date.getFullYear()).toBe(2026);
  });
});
