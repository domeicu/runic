import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';
import * as schema from './schema';

const expoDb = openDatabaseSync('runic_v4.db');

export const db = drizzle(expoDb, { schema });

export const useDatabaseInit = () => {
  const { success, error } = useMigrations(db, migrations);
  return { isLoaded: success, error };
};
