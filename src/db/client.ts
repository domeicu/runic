import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations'; // Auto-generated alias
import * as schema from './schema';

// 1. Open the file on the device
const expoDb = openDatabaseSync('runic.db');

// 2. Export the Typed DB
export const db = drizzle(expoDb, { schema });

// 3. Helper Hook for your Root Layout
export const useDatabaseInit = () => {
  const { success, error } = useMigrations(db, migrations);
  return { isLoaded: success, error };
};
