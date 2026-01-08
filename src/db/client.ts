import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import * as schema from './schema';
import { InferInsertModel } from 'drizzle-orm';
import { parseIcsPlan } from '../features/plans/icsParser';

const expoDb = openDatabaseSync('runic.db');

export const db = drizzle(expoDb, { schema });

export const useDatabaseInit = () => {
  const { success, error } = useMigrations(db, migrations);
  return { isLoaded: success, error };
};

export type NewWorkout = InferInsertModel<typeof schema.workouts>;

export const addWorkout = async (workoutData: Omit<NewWorkout, 'id'>) => {
  try {
    console.log('Adding workout to DB:', workoutData.title);

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

    console.log('Success. New ID:', result[0]?.id);
    return result[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
};

export const importIcsWorkouts = async (icsData: string) => {
  try {
    console.log('Importing workouts from ics...');

    const parsedEvents = parseIcsPlan(icsData);
    const formattedWorkouts = parsedEvents.workouts.map((e) => ({
      date: e.date.toISOString(),
      title: e.title,
      description: e.description || '',
      distanceKm: e.distanceKm,
      type: e.type,
      isCompleted: false,
    }));

    await db.insert(schema.workouts).values(formattedWorkouts);

    console.log(`Imported ${formattedWorkouts.length} workouts`);
    return { success: true };
  } catch (e) {
    console.error('Import failed:', e);
    return { success: false, error: e };
  }
};
