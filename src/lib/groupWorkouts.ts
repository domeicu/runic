export const groupWorkouts = (workouts: any[]) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const sections: { title: string; data: any[] }[] = [];
  const pastData: any[] = [];
  const todayData: any[] = [];
  const monthMap = new Map<string, any[]>();

  workouts.forEach((item) => {
    const itemDate = new Date(item.date);
    const itemDayOnly = new Date(itemDate);
    itemDayOnly.setHours(0, 0, 0, 0);

    if (itemDayOnly < now) {
      pastData.push(item);
    } else if (itemDayOnly.getTime() === now.getTime()) {
      todayData.push(item);
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

  if (pastData.length > 0) {
    sections.push({ title: 'past', data: pastData });
  }

  if (todayData.length > 0) {
    sections.push({ title: 'today', data: todayData });
  }

  monthMap.forEach((data, title) => {
    sections.push({ title, data });
  });

  return sections;
};
