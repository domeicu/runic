import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Alert, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useColorScheme } from 'nativewind';
import { parseISO } from 'date-fns';
import { Colours } from '@/src/constants/theme';
import { addWorkout, getWorkoutById, updateWorkout } from '@/src/db/client';
import { RUN_TYPES, RunType } from '@/src/lib/types';
import WorkoutTextInput from '@/src/components/workoutTextInput';
import WorkoutDateInput from '@/src/components/workoutDateInput';
import ChipSelector from '@/src/components/chipSelector';
import ActionButton from '@/src/components/actionButton';
import ModalHeader from '@/src/components/modalHeader';

export default function WorkoutForm() {
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];

  const params = useLocalSearchParams();
  const id = params.id ? Number(params.id) : null;

  const placeholders = {
    distance: '5',
    title: 'Daily Run',
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    distance: '',
    date: new Date().toISOString(),
    title: '',
    type: RUN_TYPES[0],
    description: '',
    notes: '',
  });

  useEffect(() => {
    if (id) {
      const loadData = async () => {
        try {
          const workout = await getWorkoutById(id);
          if (workout) {
            setForm({
              distance: workout.distanceKm.toString(),
              date: workout.date,
              title: workout.title,
              type: workout.type as RunType,
              description: workout.description || '',
              notes: workout.notes || '',
            });
          }
        } catch {
          Alert.alert('Error', 'Could not load workout details');
          router.back();
        }
      };
      loadData();
    }
  }, [id]);

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        title: form.title || placeholders.title,
        distanceKm: parseFloat(form.distance || placeholders.distance),
        type: form.type as RunType,
        date: form.date,
        description: form.description,
        notes: form.notes,
      };

      if (id) {
        await updateWorkout(id, payload);
      } else {
        await addWorkout({
          ...payload,
          dateCreated: new Date().toISOString(),
          externalId: null,
        });
      }
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', `Failed to ${id ? 'update' : 'save'} workout`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <ModalHeader theme={theme} title={id ? 'edit workout' : 'plan workout'} />

      <KeyboardAvoidingView className="flex-1">
        <KeyboardAwareScrollView
          className="flex-1 p-6"
          showsVerticalScrollIndicator={false}
          viewIsInsideTabBar={true}
          enableResetScrollToCoords={false}
          keyboardOpeningTime={0}
        >
          <View className="flex-row gap-4">
            <View className="flex-1">
              <WorkoutDateInput
                theme={theme}
                label="date"
                value={parseISO(form.date)}
                onChange={(date) => updateField('date', date.toISOString())}
              />
            </View>
            <View className="flex-1">
              <WorkoutTextInput
                theme={theme}
                label="distance (km)"
                value={form.distance}
                onChangeText={(text) => updateField('distance', text)}
                keyboardType="decimal-pad"
                placeholder={placeholders.distance}
              />
            </View>
          </View>

          <WorkoutTextInput
            theme={theme}
            label="title"
            value={form.title}
            onChangeText={(text) => updateField('title', text)}
            placeholder={placeholders.title}
          />

          <ChipSelector
            theme={theme}
            onPress={(type) => updateField('type', type)}
            values={RUN_TYPES}
            activeValue={form.type}
          />

          <WorkoutTextInput
            theme={theme}
            label="description"
            value={form.description}
            onChangeText={(text) => updateField('description', text)}
            multiline={true}
          />

          <WorkoutTextInput
            theme={theme}
            label="private notes"
            value={form.notes}
            onChangeText={(text) => updateField('notes', text)}
            multiline={true}
          />
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>

      <View className="p-5 pb-12" style={{ borderColor: theme.border }}>
        <ActionButton
          theme={theme}
          label={id ? 'update workout' : 'save workout'}
          onPress={handleSave}
          disabled={isSubmitting}
        />
      </View>
    </View>
  );
}
