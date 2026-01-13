import { parseIcsPlan } from './icsParser';
import { parseCsvPlan } from './csvParser';
import { addWorkoutsBulk, NewWorkout } from '@/src/db/queries';

type ParserFunction = (data: string) => { workouts: any[] };

const processAndSave = async (
  rawData: string,
  parserStrategy: ParserFunction
) => {
  const parsedResult = parserStrategy(rawData);

  const formattedWorkouts: Omit<NewWorkout, 'id'>[] = parsedResult.workouts.map(
    (e) => ({
      date: e.date.toISOString(),
      dateCreated: new Date().toISOString(),
      title: e.title,
      description: e.description || '',
      distanceKm: e.distanceKm,
      type: e.type,
      isCompleted: false,
    })
  );

  if (formattedWorkouts.length > 0) {
    await addWorkoutsBulk(formattedWorkouts);
  }

  return { success: true, count: formattedWorkouts.length };
};

export const importIcsWorkouts = (data: string) =>
  processAndSave(data, parseIcsPlan);
export const importCsvWorkouts = (data: string) =>
  processAndSave(data, parseCsvPlan);
