import React from 'react';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';

export const EmptyWorkoutAction = ({
  theme,
  date,
}: {
  theme: any;
  date?: string;
}) => {
  return (
    <View className="flex-row gap-2">
      <TouchableOpacity
        onPress={() =>
          router.push({ pathname: '/workout/form', params: { date } })
        }
      >
        <Text style={{ color: theme.accent }}>add</Text>
      </TouchableOpacity>

      <Text style={{ color: theme.textSecondary }}>/</Text>

      <TouchableOpacity onPress={() => router.push('/workout/import')}>
        <Text style={{ color: theme.accent }}>import</Text>
      </TouchableOpacity>
    </View>
  );
};
