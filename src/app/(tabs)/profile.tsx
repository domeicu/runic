import React from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const profile = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-900">
      <Button title="Settings" />
      <Text className="text-xl text-white font-bold">profile</Text>
    </SafeAreaView>
  );
};

export default profile;
