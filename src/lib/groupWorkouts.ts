// src/utils/grouping.ts

export const groupWorkouts = (workouts: any[]) => {
  const now = new Date();

  const currentDay = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - currentDay);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const sections: { title: string; data: typeof workouts }[] = [];

  let thisWeekData: typeof workouts = [];
  const monthMap = new Map<string, typeof workouts>();

  workouts.forEach((item) => {
    const itemDate = new Date(item.date);

    if (itemDate >= startOfWeek && itemDate <= endOfWeek) {
      thisWeekData.push(item);
    } else {
      const monthKey = itemDate
        .toLocaleString('default', { month: 'long', year: 'numeric' })
        .toLowerCase();

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, []);
      }
      monthMap.get(monthKey)?.push(item);
    }
  });

  if (thisWeekData.length > 0) {
    sections.push({ title: 'this week', data: thisWeekData });
  }

  monthMap.forEach((data, title) => {
    sections.push({ title, data });
  });

  return sections;
};
