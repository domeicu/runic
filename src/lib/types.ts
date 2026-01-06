export type RunType = 'Easy' | 'Tempo' | 'Intervals' | 'Aerobic' | 'Recovery' | 'Race' | 'Long';

export interface Workout {
  id: string;
  date: Date;
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
