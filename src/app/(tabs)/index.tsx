import React from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Bell, Plus } from 'lucide-react-native';
import { Colours } from '@/constants/theme';
import { asc, gte } from 'drizzle-orm';
import { db } from '@/src/db/client';
import { workouts } from '@/src/db/schema';
import { useFocusQuery } from '@/src/lib/useFocusQuery';
import { Workout } from '@/src/lib/types';
import ScreenHeader from '@/src/components/screenHeader';
import LiquidButton from '@/src/components/liquidButton';
import WorkoutCard from '@/src/components/workoutCard';

const Index = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = Colours[isDark ? 'dark' : 'light'];

  const today = new Date().toISOString();

  const { data } = useFocusQuery<Workout[]>(
    db.select().from(workouts).where(gte(workouts.date, today)).orderBy(asc(workouts.date)).limit(1)
  );

  const nextRun = data ? data[0] : null;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
      <ScreenHeader
        title="dashboard"
        button1={
          <LiquidButton
            icon={<Bell size={22} color={theme.text} strokeWidth={1.5} />}
            onPress={() => router.push('/notifications')}
          />
        }
        button2={
          <LiquidButton
            icon={<Plus size={22} color={theme.text} strokeWidth={1.5} />}
            onPress={() => console.log('add activity')}
          />
        }
      />
      <View className="px-4">
        <Text className="text-xl font-bold mb-3 pl-2" style={{ color: theme.text }}>
          next run
        </Text>
        {nextRun ? (
          <WorkoutCard
            title={nextRun.title}
            description={nextRun.description ? nextRun.description : ''}
            date={new Date(nextRun.date).toISOString()}
            distance={`${nextRun.distanceKm} km`}
            type={nextRun.type}
            onPress={() => console.log('Open Workou:', nextRun.id, 'of type', nextRun.type)}
          />
        ) : (
          <View className="items-center">
            <Text className="text-sm mt-5" style={{ color: theme.textSecondary }}>
              no runs found!
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Index;
