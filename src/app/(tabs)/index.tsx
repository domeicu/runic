import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import WorkoutCard from '@/src/components/workoutCard';
import { SafeAreaView } from 'react-native-safe-area-context';

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
            distance="13 km"
            type="Easy"
            pace="6:30 /km"
            onPress={() => console.log('Open Workout Details')}
          />
          <WorkoutCard
            title="Tempo Run"
            distance="8 km"
            type="Tempo"
            pace="4:15 /km"
            onPress={() => console.log('Open Workout Details')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
