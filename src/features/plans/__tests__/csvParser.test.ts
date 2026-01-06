import fs from 'fs';
import path from 'path';
import { parseCsvPlan } from '../parsers/csvParser';

describe('CSV Parser', () => {
  const csvPath = path.resolve(__dirname, './plan.csv');
  const validCsv = fs.readFileSync(csvPath, 'utf-8');

  test('parses a valid CSV file fixture', () => {
    const plan = parseCsvPlan(validCsv);

    expect(plan.workouts).toHaveLength(28);
    expect(plan.workouts[1].distanceKm).toBe(13);
  });
});
