import fs from 'fs';
import path from 'path';
import { parseCsvPlan } from '../parsers/csvParser';

describe('CSV Parser', () => {
  const csvPath = path.resolve(__dirname, './plan.csv');
  const validCsv = fs.readFileSync(csvPath, 'utf-8');

  test('parses a valid CSV file', () => {
    const plan = parseCsvPlan(validCsv);

    expect(plan.workouts).toHaveLength(18);
    expect(plan.workouts[0].distanceKm).toBe(13);
    expect(plan.workouts[0].title).toBe('13km Tempo Run');
    expect(plan.workouts[0].description).toBe('LT 13 km with 6 km at LT pace');
    expect(plan.workouts[0].type).toBe('Tempo');

    expect(plan.workouts[plan.workouts.length - 1].title).toBe('24km Long Run');
  });
});
