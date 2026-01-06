import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import { Workout, TrainingPlan } from '../domain/types';

export const parseCsvPlan = (fileContent: string): TrainingPlan => {
  throw new Error('To implement');
};
