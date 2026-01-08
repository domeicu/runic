import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useColorScheme } from 'nativewind';
import { ArrowLeft } from 'lucide-react-native';
import { parseISO } from 'date-fns';
import { Colours, Layout } from '@/constants/theme';
import { addWorkout } from '@/src/db/client';
import { RUN_TYPES } from '@/src/lib/types';
import WorkoutTextInput from '@/src/components/workoutTextInput';
import WorkoutDateInput from '@/src/components/workoutDateInput';
import ChipSelector from '@/src/components/chipSelector';

export default function AddWorkout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = Colours[isDark ? 'dark' : 'light'];

  const [form, setForm] = useState({
    distance: '',
    date: new Date().toISOString(),
    title: '',
    type: RUN_TYPES[0],
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.title || !form.distance) {
      Alert.alert('Missing Fields', 'Please enter at least a title and distance.');
      return;
    }

    setIsSubmitting(true);
    try {
      // await addWorkout({
      //   title: form.title,
      //   distanceKm: parseFloat(form.distance),
      //   durationMin: form.duration ? parseInt(form.duration) : 0,
      //   type: form.type as any, // Cast to your Enum type
      //   date: new Date().toISOString(), // Defaults to 'Now' for this stub
      //   description: form.description,
      //   externalId: null, // Manual entry
      // });
      addWorkout();

      // Go back to dashboard and refresh
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save workout');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Header */}
      <View className="flex-row items-center p-4 pt-8 border-b border-zinc-100 dark:border-zinc-800">
        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text className="text-xl font-bold" style={{ color: theme.text }}>
          plan workout
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 p-6">
          <View className="flex-row gap-4">
            <View className="flex-1">
              <WorkoutDateInput
                label="date"
                value={parseISO(form.date)}
                onChange={(date) => updateField('date', date.toISOString())}
                theme={theme}
              />
            </View>
            <View className="flex-1">
              <WorkoutTextInput
                label="distance (km)"
                theme={theme}
                keyboardType="decimal-pad"
                placeholder="5.0"
              />
            </View>
          </View>

          <WorkoutTextInput label="title" theme={theme} placeholder="Morning Run" />

          <ChipSelector
            theme={theme}
            onPress={(type) => updateField('type', type)}
            values={RUN_TYPES}
            activeValue={form.type}
          />

          <WorkoutTextInput label="description" theme={theme} multiline={true} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer / Submit Button */}
      <View className="p-4 border-t border-zinc-100 dark:border-zinc-800 pb-8">
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSubmitting}
          className={'w-full py-4 mb-10 items-center'}
          style={
            isSubmitting
              ? { borderRadius: Layout.borderRadius.card, backgroundColor: theme.glass }
              : { borderRadius: Layout.borderRadius.card, backgroundColor: theme.accent }
          }
        >
          <Text
            className="text-white font-bold text-lg"
            style={!isSubmitting && { color: theme.glass }}
          >
            {isSubmitting ? 'Saving...' : 'Save Workout'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
