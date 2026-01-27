import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { and, gte, lte, eq, sql, desc, InferInsertModel } from 'drizzle-orm';
import { db } from './client';
import { workouts } from './schema';

export type NewWorkout = InferInsertModel<typeof workouts>;

export const getWorkoutById = async (id: number) => {
  const result = await db.select().from(workouts).where(eq(workouts.id, id));
  return result[0];
};

export const updateWorkout = async (
  id: number,
  data: Partial<Omit<NewWorkout, 'id'>>
) => {
  const [result] = await db
    .update(workouts)
    .set(data)
    .where(eq(workouts.id, id))
    .returning();
  return result;
};

export const addWorkout = async (workoutData: Omit<NewWorkout, 'id'>) => {
  const [result] = await db.insert(workouts).values(workoutData).returning();
  return result;
};

export const addWorkoutsBulk = async (
  workoutsData: Omit<NewWorkout, 'id'>[]
) => {
  if (workoutsData.length === 0) return [];

  return await db.insert(workouts).values(workoutsData).returning();
};

export const getWeeklyProgress = async () => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });

  const weeklyWorkouts = await db
    .select()
    .from(workouts)
    .where(
      and(
        gte(workouts.date, start.toISOString()),
        lte(workouts.date, end.toISOString())
      )
    );

  const goalDistance = weeklyWorkouts.reduce(
    (sum, w) => sum + (w.distanceKm || 0),
    0
  );

  const runDistance = weeklyWorkouts
    .filter((w) => w.isCompleted)
    .reduce((sum, w) => sum + (w.distanceKm || 0), 0);

  return {
    run: Math.round(runDistance * 10) / 10,
    goal: Math.round(goalDistance * 10) / 10,
  };
};

export const getMonthlyStats = async () => {
  const now = new Date();
  const start = startOfMonth(now).toISOString();
  const end = endOfMonth(now).toISOString();

  const [basicStats] = await db
    .select({
      totalRuns: sql<number>`count(*)`,
      longestRun: sql<number>`max(${workouts.distanceKm})`,
    })
    .from(workouts)
    .where(
      and(
        gte(workouts.date, start),
        lte(workouts.date, end),
        eq(workouts.isCompleted, true)
      )
    );

  const [favoriteType] = await db
    .select({ type: workouts.type })
    .from(workouts)
    .where(
      and(
        gte(workouts.date, start),
        lte(workouts.date, end),
        eq(workouts.isCompleted, true)
      )
    )
    .groupBy(workouts.type)
    .orderBy(desc(sql`count(*)`))
    .limit(1);

  return {
    totalRuns: basicStats?.totalRuns || 0,
    longestRun: basicStats?.longestRun || 0,
    topType: favoriteType?.type || '-',
  };
};
