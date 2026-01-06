import Papa from 'papaparse';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { TrainingPlan, Workout, RunType } from '../domain/types';

interface DefyWeekRow {
  Week: string;
  Distance: string; // Weekly total
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
  Saturday: string;
  Sunday: string;
}

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

/**
 * Maps CSV descriptions to your specific RunType definition.
 * Prioritizes "Key" workouts (Tempo/Intervals/Long) over general types.
 */
const mapRunType = (desc: string): RunType => {
  const lower = desc.toLowerCase();
  if (lower.includes('recovery')) return 'Recovery';
  if (lower.includes('long run') || lower.includes('med-long') || lower.includes('endurance'))
    return 'Long';
  if (lower.includes('lt') || lower.includes('tempo') || lower.includes('marathon-pace'))
    return 'Tempo';
  if (lower.includes('interval') || lower.includes('vo2max') || lower.includes('hill sprints'))
    return 'Intervals';
  if (lower.includes('race') || lower.includes('tune-up')) return 'Race';
  if (lower.includes('gen-aerobic') || lower.includes('steady')) return 'Aerobic';
  return 'Easy';
};

/**
 * Extracts numeric distance from strings like "LT 13 km with..." or "Recovery 6 km"
 */
const parseDistance = (desc: string): number => {
  const match = desc.match(/(\d+(\.\d+)?)\s*km/);
  return match ? parseFloat(match[1]) : 0;
};

export const parseCsvPlan = (fileContent: string): TrainingPlan => {
  const { data } = Papa.parse<DefyWeekRow>(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  const workouts: Workout[] = [];

  data.forEach((row) => {
    DAYS.forEach((day) => {
      const cellContent = row[day];
      if (!cellContent) return;
      const parts = cellContent.split(/:(.+)/);
      if (parts.length < 2) return;

      const dateStr = parts[0].trim();
      const fullDescription = parts[1].trim();
      const runType = mapRunType(fullDescription);
      const distance = parseDistance(fullDescription);

      if (fullDescription.toLowerCase().startsWith('rest')) return;

      workouts.push({
        id: uuidv4(),
        date: new Date(dateStr),
        distanceKm: distance,
        title: distance + 'km ' + runType + ' Run',
        description: fullDescription,
        type: runType,
        isCompleted: false,
      });
    });
  });

  return {
    id: uuidv4(),
    name: 'Imported Plan',
    source: 'csv',
    workouts,
  };
};
