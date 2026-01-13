import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useColorScheme } from 'nativewind';
import { db } from '@/src/db/client';
import { workouts } from '@/src/db/schema';
import { Layout, Colours } from '@/src/constants/theme';
import ActionButton from './actionButton';

const DataManagement = () => {
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];
  const [loading, setLoading] = useState(false);

  const handleClear = async () => {
    Alert.alert(
      'Clear Database',
      'Are you sure? This will delete all workout history.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await db.delete(workouts);
              Alert.alert('Success', 'Database cleared.');
            } catch (e) {
              Alert.alert('Error', 'Failed to clear database.');
              console.error(e);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View
      className="mt-8 border p-4"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
        borderRadius: Layout.borderRadius.card,
      }}
    >
      <View className="flex-col gap-3">
        <ActionButton
          theme={theme}
          label="clear database"
          onPress={handleClear}
          colour={theme.red}
          loading={loading}
        />
      </View>
    </View>
  );
};

export default DataManagement;
