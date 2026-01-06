import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const schedule = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-900">
      <Text className="text-xl text-white font-bold">schedule</Text>
    </SafeAreaView>
  );
};

export default schedule;
