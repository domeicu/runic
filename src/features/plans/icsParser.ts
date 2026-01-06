import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { TrainingPlan, Workout } from '../../lib/types';
import { mapRunType, parseDistance } from '@/src/lib/parsingUtils';

const parseIcsDate = (icsDate: string): Date => {
  const match = icsDate.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!match) return new Date(); // Fallback to today

  const [, year, month, day] = match;
  return new Date(`${year}-${month}-${day}`);
};

export const parseIcsPlan = (fileContent: string): TrainingPlan => {
  const workouts: Workout[] = [];

  const lines = fileContent.split(/\r\n|\n|\r/);

  let inEvent = false;
  let currentDtStart = '';
  let currentSummary = '';
  let currentDesc = '';

  for (const line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) {
      inEvent = true;
      currentDtStart = '';
      currentSummary = '';
      currentDesc = '';
      continue;
    }

    if (line.startsWith('END:VEVENT')) {
      inEvent = false;

      if (currentDtStart && currentSummary) {
        const cleanSummary = currentSummary.trim().toLowerCase();
        if (
          cleanSummary.startsWith('rest') ||
          cleanSummary.startsWith('training week') ||
          cleanSummary.startsWith('plan ends')
        ) {
          continue;
        }

        const textToAnalyze = currentDesc || currentSummary;

        const distanceKm = parseDistance(textToAnalyze);
        const type = mapRunType(textToAnalyze);

        const suffix = type.toLowerCase().endsWith('run') ? '' : ' Run';
        const formattedTitle = `${distanceKm}km ${type}${suffix}`;

        workouts.push({
          id: uuidv4(),
          date: parseIcsDate(currentDtStart),
          title: formattedTitle,
          description: currentDesc.trim(),
          distanceKm: distanceKm,
          type: type,
          isCompleted: false,
        });
      }
      continue;
    }

    if (inEvent) {
      if (line.startsWith('DTSTART')) {
        const parts = line.split(':');
        currentDtStart = parts[parts.length - 1];
      } else if (line.startsWith('SUMMARY')) {
        const parts = line.split(/:(.+)/);
        currentSummary = parts[1] || '';
      } else if (line.startsWith('DESCRIPTION')) {
        const parts = line.split(/:(.+)/);
        currentDesc = parts[1] || '';
      }
    }
  }

  return {
    id: uuidv4(),
    name: 'Imported Calendar',
    source: 'ics',
    workouts: workouts.sort((a, b) => a.date.getTime() - b.date.getTime()),
  };
};
