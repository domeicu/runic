import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

export function useFocusQuery<T>(query: any): { data: T } {
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  return useLiveQuery(query, [refreshKey]);
}
