export const RUN_TYPES = [
  'Easy',
  'Aerobic',
  'Tempo',
  'Long',
  'Recovery',
  'Intervals',
  'Race',
];
export type RunType = (typeof RUN_TYPES)[number];

export interface Workout {
  id: string;
  date: Date;
  dateCreated: Date;
  distanceKm: number;
  title: string;
  description?: string;
  notes?: string;
  type: RunType;
  isCompleted: boolean;
  stravaActivityId?: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  source: 'csv' | 'ics' | 'manual';
  workouts: Workout[];
}
