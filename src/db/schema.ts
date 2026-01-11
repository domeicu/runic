import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const workouts = sqliteTable('workouts', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  date: text('date').notNull(), // Store as ISO string
  dateCreated: text('date_created').notNull(),
  distanceKm: real('distance_km').notNull(), // Map camelCase JS to snake_case DB
  title: text('title').notNull(),
  description: text('description'), // Can be null
  notes: text('notes'),
  type: text('type').notNull(), // 'Easy', 'Long Run', etc.
  isCompleted: integer('is_completed', { mode: 'boolean' }).default(false),

  // IDs for external services
  stravaActivityId: text('strava_activity_id'),
  externalId: text('external_id'), // For ICS files
});
