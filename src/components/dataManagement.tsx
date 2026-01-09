import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { db } from '@/src/db/client';
import { workouts } from '@/src/db/schema';

const DataManagement = () => {
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
    <View className="mx-4 mt-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <Text className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-400">
        Developer Tools
      </Text>

      <View className="flex-col gap-3">
        <TouchableOpacity
          onPress={handleClear}
          disabled={loading}
          className="flex-row items-center justify-center rounded-lg border border-red-900/50 bg-red-900/20 p-4 active:opacity-80"
        >
          <Text className="text-base font-bold text-red-400">
            clear database
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DataManagement;
