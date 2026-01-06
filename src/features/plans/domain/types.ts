export type RunType =
  | 'Easy'
  | 'Tempo'
  | 'Intervals'
  | 'Long Run'
  | 'Recovery'
  | 'Race'
  | 'Endurance';

export interface Workout {
  id: string;
  date: string;
  distanceKm: number;
  title: string;
  description?: string;
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
