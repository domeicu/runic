import React from 'react';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { View, Text, Alert } from 'react-native';
import { useColorScheme } from 'nativewind';
import { CheckSquare, Pencil, Square } from 'lucide-react-native';
import { eq } from 'drizzle-orm';
import { useFocusQuery } from '@/src/lib/useFocusQuery';
import { workouts } from '@/src/db/schema';
import { db } from '@/src/db/client';
import { Workout } from '@/src/lib/types';
import { Colours, Layout } from '@/src/constants/theme';
import LiquidButton from '@/src/components/liquidButton';
import ActionButton from '@/src/components/actionButton';

export default function WorkoutDetail() {
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];

  const { id } = useLocalSearchParams();
  const workoutId = Array.isArray(id) ? Number(id[0]) : Number(id);

  const { data, refetch } = useFocusQuery<Workout[]>(
    db.select().from(workouts).where(eq(workouts.id, workoutId))
  );
  const workout = data?.[0];

  const handleComplete = async () => {
    if (!workout) return;
    try {
      await db
        .update(workouts)
        .set({ isCompleted: !workout.isCompleted })
        .where(eq(workouts.id, Number(workout.id)));
      refetch();
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

  const InfoItemLarge = ({ className, topText, bottomText }: any) => (
    <View className={className}>
      <Text
        className="pb-2 pl-1 text-sm"
        style={{ color: theme.textSecondary }}
      >
        {topText}
      </Text>
      <View
        className="border p-4"
        style={{
          borderRadius: Layout.borderRadius.card,
          borderColor: theme.border,
        }}
      >
        <Text style={{ color: theme.textSecondary }}>{bottomText}</Text>
      </View>
    </View>
  );

  if (!workout) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <Text style={{ color: theme.text }}>Workout not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-5" style={{ backgroundColor: theme.background }}>
      <View className="mt-4 flex-1">
        <View className="flex-row justify-between">
          <Text
            className="mb-2 pl-1 text-3xl font-bold"
            style={{ color: theme.text }}
          >
            {workout.title}
          </Text>
          <LiquidButton
            theme={theme}
            icon={<Pencil size={18} color={theme.text} />}
            onPress={() =>
              router.push({
                pathname: '/workout/form',
                params: { id: workout.id },
              })
            }
          />
        </View>
        <View className="mb-4 flex-row pl-1">
          <InfoItem
            className="flex-1"
            topText="date"
            bottomText={new Date(workout.date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
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
        <View className="mb-4 flex-row pl-1">
          <InfoItem
            className="flex-1"
            topText="date created"
            bottomText={new Date(workout.dateCreated).toLocaleDateString(
              'en-GB',
              {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }
            )}
          />
          <InfoItem
            className="flex-1"
            topText="complete"
            bottomText={workout.isCompleted ? 'true' : 'false'}
          />
          <InfoItem className="flex-1" />
        </View>

        <InfoItemLarge
          className="mb-4 px-0.5"
          topText="description"
          bottomText={workout.description ?? 'no description'}
        />

        <InfoItemLarge
          className="px-0.5"
          topText="private notes"
          bottomText={workout.notes ?? 'no private notes'}
        />
      </View>

      <View className="pb-7">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <ActionButton
              theme={theme}
              label="mark complete"
              toggledOff={!workout.isCompleted}
              renderIcon={(colour) =>
                workout.isCompleted ? (
                  <CheckSquare color={colour} />
                ) : (
                  <Square color={colour} />
                )
              }
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
