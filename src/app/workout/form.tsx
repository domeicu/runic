import React, { useState, useEffect } from 'react';
import { Alert, View, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useColorScheme } from 'nativewind';
import { parseISO } from 'date-fns';

import { Colours } from '@/src/constants/theme';
import { getWorkoutById, addWorkout, updateWorkout } from '@/src/db/queries';
import { RUN_TYPES, RunType } from '@/src/types/types';
import { syncNotifications } from '@/src/lib/notifications';

import WorkoutTextInput from '@/src/components/workoutTextInput';
import WorkoutDateInput from '@/src/components/workoutDateInput';
import ChipSelector from '@/src/components/chipSelector';
import ActionButton from '@/src/components/actionButton';
import ModalHeader from '@/src/components/modalHeader';

export default function WorkoutForm() {
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditing = !!id;

  const params = useLocalSearchParams();
  const initialDate = params.date
    ? new Date((params.date as string) + 'T12:00:00')
    : new Date();
  const defaultForm = {
    distance: '',
    date: initialDate.toISOString(),
    title: '',
    type: RUN_TYPES[0],
    description: '',
    notes: '',
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (!id) return;

    getWorkoutById(Number(id))
      .then((data) => {
        if (data) {
          setForm({
            distance: data.distanceKm.toString(),
            date: data.date,
            title: data.title,
            type: data.type as RunType,
            description: data.description || '',
            notes: data.notes || '',
          });
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Could not load workout details');
        router.back();
      });
  }, [id]);

  const updateField = (key: keyof typeof defaultForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        title: form.title || 'Daily Run',
        distanceKm: parseFloat(form.distance || '5'),
        type: form.type as RunType,
        date: form.date,
        description: form.description,
        notes: form.notes,
      };

      let savedData;

      if (isEditing) {
        savedData = await updateWorkout(Number(id), payload);
      } else {
        savedData = await addWorkout({
          ...payload,
          dateCreated: new Date().toISOString(),
          externalId: null,
        });
      }

      const workoutToSync = Array.isArray(savedData) ? savedData[0] : savedData;
      await syncNotifications(workoutToSync);
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save workout');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <ModalHeader
        theme={theme}
        title={isEditing ? 'edit workout' : 'plan workout'}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <KeyboardAwareScrollView
          className="flex-1 p-6"
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={20}
        >
          <View className="flex-row gap-4">
            <View className="flex-1">
              <WorkoutDateInput
                theme={theme}
                label="date"
                value={parseISO(form.date)}
                onChange={(d) => updateField('date', d.toISOString())}
              />
            </View>
            <View className="flex-1">
              <WorkoutTextInput
                theme={theme}
                label="distance (km)"
                placeholder="5"
                value={form.distance}
                onChangeText={(t) => updateField('distance', t)}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <WorkoutTextInput
            theme={theme}
            label="title"
            placeholder="Daily Run"
            value={form.title}
            onChangeText={(t) => updateField('title', t)}
          />

          <ChipSelector
            theme={theme}
            values={RUN_TYPES}
            activeValue={form.type}
            onPress={(t) => updateField('type', t)}
          />

          <WorkoutTextInput
            theme={theme}
            label="description"
            value={form.description}
            onChangeText={(t) => updateField('description', t)}
            multiline
          />

          <WorkoutTextInput
            theme={theme}
            label="private notes"
            value={form.notes}
            onChangeText={(t) => updateField('notes', t)}
            multiline
          />
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>

      <View className="p-5 pb-12" style={{ borderColor: theme.border }}>
        <ActionButton
          theme={theme}
          label={isEditing ? 'update workout' : 'save workout'}
          onPress={handleSave}
          disabled={isSubmitting}
        />
      </View>
    </View>
  );
}
