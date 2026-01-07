import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { db } from '@/src/db/client';
import { workouts } from '@/src/db/schema';
import { seedDatabase } from '@/src/db/seed'; // Ensure this path is correct

const DataManagement = () => {
  const [loading, setLoading] = useState(false);

  // 🗑️ Clear Logic
  const handleClear = async () => {
    Alert.alert('Clear Database', 'Are you sure? This will delete all workout history.', [
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
    ]);
  };

  // 🌱 Seed Logic
  const handleSeed = async () => {
    setLoading(true);
    try {
      const result = await seedDatabase();
      if (result.success) {
        Alert.alert('Success', 'Test data seeded successfully.');
      } else {
        Alert.alert('Error', 'Failed to seed data.');
      }
    } catch (e) {
      Alert.alert('Error', 'Unexpected error during seed.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mt-8 mx-4 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
      <Text className="text-zinc-400 font-medium mb-4 uppercase text-xs tracking-wider">
        Developer Tools
      </Text>

      <View className="flex-col gap-3">
        {/* Seed Button */}
        <TouchableOpacity
          onPress={handleSeed}
          disabled={loading}
          className="flex-row items-center justify-center bg-emerald-900/30 p-4 rounded-lg border border-emerald-800 active:opacity-80"
        >
          {loading ? (
            <ActivityIndicator color="#10b981" />
          ) : (
            <Text className="text-emerald-400 font-bold text-base">🌱 Seed Test Data</Text>
          )}
        </TouchableOpacity>

        {/* Clear Button */}
        <TouchableOpacity
          onPress={handleClear}
          disabled={loading}
          className="flex-row items-center justify-center bg-red-900/20 p-4 rounded-lg border border-red-900/50 active:opacity-80"
        >
          <Text className="text-red-400 font-bold text-base">🗑️ Clear Database</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DataManagement;
