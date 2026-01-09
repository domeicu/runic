import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/src/db/drizzle/migrations';
import * as schema from './schema';
import { InferInsertModel } from 'drizzle-orm';
import { parseIcsPlan } from '../features/plans/icsParser';
import { parseCsvPlan } from '../features/plans/csvParser';
import { Workout } from '../lib/types';

const expoDb = openDatabaseSync('runic.db');

export const db = drizzle(expoDb, { schema });

export const useDatabaseInit = () => {
  const { success, error } = useMigrations(db, migrations);
  return { isLoaded: success, error };
};

export type NewWorkout = InferInsertModel<typeof schema.workouts>;

export const addWorkout = async (workoutData: Omit<NewWorkout, 'id'>) => {
  const result = await db
    .insert(schema.workouts)
    .values({
      title: workoutData.title,
      date: workoutData.date,
      distanceKm: workoutData.distanceKm,
      type: workoutData.type,
      description: workoutData.description || null,
      isCompleted: workoutData.isCompleted ?? false,
      stravaActivityId: workoutData.stravaActivityId || null,
      externalId: workoutData.externalId || null,
    })
    .returning();
  return result[0];
};

type ParserFunction = (data: string) => { workouts: Workout[] };

const processImport = async (
  rawData: string,
  parserStrategy: ParserFunction
): Promise<{ success: boolean; count: number }> => {
  const parsedResult = parserStrategy(rawData);
  const formattedWorkouts = parsedResult.workouts.map((e) => ({
    date: e.date.toISOString(),
    title: e.title,
    description: e.description || '',
    distanceKm: e.distanceKm,
    type: e.type,
    isCompleted: false,
  }));
  if (formattedWorkouts.length > 0) {
    await db.insert(schema.workouts).values(formattedWorkouts);
  }
  return { success: true, count: formattedWorkouts.length };
};

export const importIcsWorkouts = (data: string) =>
  processImport(data, parseIcsPlan);
export const importCsvWorkouts = (data: string) =>
  processImport(data, parseCsvPlan);
