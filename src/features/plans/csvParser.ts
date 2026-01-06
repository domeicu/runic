import Papa from 'papaparse';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { TrainingPlan, Workout } from '../../lib/types';
import { mapRunType, parseDistance } from '@/src/lib/parsingUtils';

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
