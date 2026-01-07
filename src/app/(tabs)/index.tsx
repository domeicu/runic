import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Bell } from 'lucide-react-native';
import { Colours } from '@/constants/theme';
import ScreenHeader from '@/src/components/screenHeader';
import LiquidButton from '@/src/components/liquidButton';
import WorkoutCard from '@/src/components/workoutCard';
import { router } from 'expo-router';

const Index = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = Colours[isDark ? 'dark' : 'light'];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
      <ScreenHeader
        title="runic"
        rightElement={
          <LiquidButton
            icon={<Bell size={22} color={theme.text} strokeWidth={1.5} />}
            onPress={() => router.push('/notifications')}
          />
        }
      />
      <ScrollView
        className="w-full flex-1 mt-3 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: '100%' }}
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

export default Index;
