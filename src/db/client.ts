import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/src/db/drizzle/migrations';
import * as schema from './schema';
import { eq, InferInsertModel } from 'drizzle-orm';
import { parseIcsPlan } from '../features/plans/icsParser';
import { parseCsvPlan } from '../features/plans/csvParser';
import { Workout } from '../lib/types';

const expoDb = openDatabaseSync('runic_v4.db');

export const db = drizzle(expoDb, { schema });

export const useDatabaseInit = () => {
  const { success, error } = useMigrations(db, migrations);
  return { isLoaded: success, error };
};

export const getWorkoutById = async (id: number) => {
  const result = await db
    .select()
    .from(schema.workouts)
    .where(eq(schema.workouts.id, id));
  return result[0];
};

type NewWorkout = InferInsertModel<typeof schema.workouts>;

export const updateWorkout = async (
  id: number,
  data: Partial<Omit<NewWorkout, 'id'>>
) => {
  const [result] = await db
    .update(schema.workouts)
    .set(data)
    .where(eq(schema.workouts.id, id))
    .returning();
  return result;
};

export const addWorkout = async (workoutData: Omit<NewWorkout, 'id'>) => {
  const [result] = await db
    .insert(schema.workouts)
    .values(workoutData)
    .returning();
  return result;
};

type ParserFunction = (data: string) => { workouts: Workout[] };

const processImport = async (
  rawData: string,
  parserStrategy: ParserFunction
): Promise<{ success: boolean; count: number }> => {
  const parsedResult = parserStrategy(rawData);
  const formattedWorkouts = parsedResult.workouts.map((e) => ({
    date: e.date.toISOString(),
    dateCreated: new Date().toISOString(),
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
