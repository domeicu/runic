import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useColorScheme } from 'nativewind';
import { parseISO } from 'date-fns';
import { Colours } from '@/constants/theme';
import { addWorkout } from '@/src/db/client';
import { RUN_TYPES, RunType } from '@/src/lib/types';
import WorkoutTextInput from '@/src/components/workoutTextInput';
import WorkoutDateInput from '@/src/components/workoutDateInput';
import ChipSelector from '@/src/components/chipSelector';
import ActionButton from '@/src/components/actionButton';
import ModalHeader from '@/src/components/modalHeader';

export default function AddWorkout() {
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];

  const [form, setForm] = useState({
    distance: '5.0',
    date: new Date().toISOString(),
    title: 'Morning Run',
    type: RUN_TYPES[0],
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await addWorkout({
        title: form.title,
        distanceKm: parseFloat(form.distance),
        type: form.type as RunType,
        date: form.date,
        description: form.description,
        externalId: null,
      });
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save workout');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <ModalHeader title="plan workout" theme={theme} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 p-6">
          <View className="flex-row gap-4">
            <View className="flex-1">
              <WorkoutDateInput
                label="date"
                theme={theme}
                value={parseISO(form.date)}
                onChange={(date) => updateField('date', date.toISOString())}
              />
            </View>
            <View className="flex-1">
              <WorkoutTextInput
                label="distance (km)"
                theme={theme}
                onChangeText={(text) => updateField('distance', text)}
                keyboardType="decimal-pad"
                placeholder="5.0"
              />
            </View>
          </View>

          <WorkoutTextInput
            label="title"
            theme={theme}
            onChangeText={(text) => updateField('title', text)}
            placeholder="Morning Run"
          />

          <ChipSelector
            theme={theme}
            onPress={(type) => updateField('type', type)}
            values={RUN_TYPES}
            activeValue={form.type}
          />

          <WorkoutTextInput
            label="description"
            theme={theme}
            onChangeText={(text) => updateField('description', text)}
            multiline={true}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="p-5 pb-12" style={{ borderColor: theme.border }}>
        <ActionButton
          label="save workout"
          theme={theme}
          onPress={handleSave}
          disabled={isSubmitting}
        />
      </View>
    </View>
  );
}
