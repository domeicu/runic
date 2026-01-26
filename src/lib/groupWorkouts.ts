export const groupWorkouts = (workouts: any[]) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const dayOfWeek = now.getDay();
  const distanceToMonday = (dayOfWeek + 6) % 7;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - distanceToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const sections: { title: string; data: any[] }[] = [];
  const pastData: any[] = [];
  const thisWeekData: any[] = [];
  const futureMap = new Map<string, any[]>();

  workouts.forEach((item) => {
    const itemDate = new Date(item.date);

    if (itemDate < startOfWeek) {
      pastData.push(item);
    } else if (itemDate >= startOfWeek && itemDate <= endOfWeek) {
      thisWeekData.push(item);
    } else {
      const monthKey = itemDate
        .toLocaleString('default', { month: 'long', year: 'numeric' })
        .toLowerCase();

      if (!futureMap.has(monthKey)) {
        futureMap.set(monthKey, []);
      }
      futureMap.get(monthKey)?.push(item);
    }
  });

  if (pastData.length > 0) {
    sections.push({ title: 'past', data: pastData });
  }
  if (thisWeekData.length > 0) {
    sections.push({ title: 'this week', data: thisWeekData });
  }
  futureMap.forEach((data, title) => {
    sections.push({ title, data });
  });

  return sections;
};
