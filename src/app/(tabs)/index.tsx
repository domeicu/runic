import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WorkoutCard from '@/src/components/workoutCard';

const index = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-900">
      <Text className="text-3xl text-light-300 font-bold">runic</Text>
      <ScrollView
        className="w-full flex-1 mt-10 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: '100%', paddingBottom: 10 }}
      >
        <View className="gap-y-1">
          <WorkoutCard
            title="Easy Run"
            date="2026-03-10T12:00:00.000Z"
            distance="13 km"
            type="Easy"
            onPress={() => console.log('Open Workout Details')}
          />
          <WorkoutCard
            title="Tempo Run"
            date="2026-07-13T12:00:00.000Z"
            distance="8 km"
            type="Tempo"
            onPress={() => console.log('Open Workout Details')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
