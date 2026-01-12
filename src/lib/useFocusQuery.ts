import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

export function useFocusQuery<T>(query: any): { data: T; refetch: () => void } {
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  const refetch = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const result = useLiveQuery(query, [refreshKey]);

  return {
    ...result,
    data: result.data as T,
    refetch,
  };
}
