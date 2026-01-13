import { eq, InferInsertModel } from 'drizzle-orm';
import { db } from './client';
import * as schema from './schema';

export type NewWorkout = InferInsertModel<typeof schema.workouts>;

export const getWorkoutById = async (id: number) => {
  const result = await db
    .select()
    .from(schema.workouts)
    .where(eq(schema.workouts.id, id));
  return result[0];
};

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

export const addWorkoutsBulk = async (
  workoutsData: Omit<NewWorkout, 'id'>[]
) => {
  if (workoutsData.length === 0) return [];

  return await db.insert(schema.workouts).values(workoutsData).returning();
};
