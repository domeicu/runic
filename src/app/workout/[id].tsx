import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { View, Text, Alert } from 'react-native';
import { useColorScheme } from 'nativewind';
import { eq } from 'drizzle-orm';
import { workouts } from '@/src/db/schema';
import { db } from '@/src/db/client';
import { Colours, Layout } from '@/src/constants/theme';
import ActionButton from '@/src/components/actionButton';

export default function WorkoutDetail() {
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];

  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const workoutId = Array.isArray(id) ? id[0] : id;
    fetchWorkout(workoutId);
  }, [id]);

  const fetchWorkout = async (id: string) => {
    try {
      const result = await db.query.workouts.findFirst({
        where: eq(workouts.id, Number(id)),
      });
      setWorkout(result);
    } catch (e) {
      console.error('Failed to fetch workout:', e);
    }
  };

  const handleComplete = async () => {
    if (!workout) return;
    const newStatus = !workout.isCompleted;
    try {
      await db
        .update(workouts)
        .set({ isCompleted: newStatus })
        .where(eq(workouts.id, Number(id)));
      setWorkout({ ...workout, isCompleted: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout? This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.delete(workouts).where(eq(workouts.id, Number(id)));

              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            } catch (error) {
              console.error('Error deleting workout:', error);
              Alert.alert(
                'Error',
                'Could not delete the workout. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  const InfoItem = ({ className, topText, bottomText }: any) => (
    <View className={className}>
      <Text className="text-sm" style={{ color: theme.textSecondary }}>
        {topText}
      </Text>
      <Text className="text-lg" style={{ color: theme.textSecondary }}>
        {bottomText}
      </Text>
    </View>
  );

  if (!workout) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <Stack.Screen options={{ title: 'Not Found' }} />
        <Text style={{ color: theme.text }}>Workout not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-5" style={{ backgroundColor: theme.background }}>
      <Stack.Screen
        options={{
          title: 'workout details',
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }}
      />

      <View className="mt-4 flex-1">
        <Text
          className="mb-2 pl-1 text-3xl font-bold"
          style={{ color: theme.text }}
        >
          {workout.title}
        </Text>
        <View className="mb-4 flex-row pl-1">
          <InfoItem
            className="flex-1"
            topText="date"
            bottomText={new Date(workout.date).toLocaleDateString()}
          />
          <InfoItem
            className="flex-1"
            topText="distance"
            bottomText={`${workout.distanceKm} km`}
          />
          <InfoItem
            className="flex-1"
            topText="type"
            bottomText={workout.type}
          />
        </View>

        <View
          className="mb-4 border p-4"
          style={{
            borderRadius: Layout.borderRadius.card,
            borderColor: theme.border,
          }}
        >
          <Text style={{ color: theme.textSecondary }}>
            {workout.description ?? 'no description'}
          </Text>
        </View>
      </View>

      <View className="pb-7">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <ActionButton
              theme={theme}
              label="mark complete"
              toggledOff={!workout.isCompleted}
              onPress={() => handleComplete()}
            />
          </View>
          <View className="flex-1">
            <ActionButton
              theme={theme}
              label="delete activity"
              colour={theme.red}
              onPress={() => handleDelete()}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
