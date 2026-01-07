import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useColorScheme } from 'nativewind';
import { Menu } from 'lucide-react-native';
import { asc } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/src/db/client';
import { workouts } from '@/src/db/schema';
import { RunType } from '@/src/lib/types';
import { Colours } from '@/constants/theme';
import ScreenHeader from '@/src/components/screenHeader';
import LiquidButton from '@/src/components/liquidButton';
import WorkoutCard from '@/src/components/workoutCard';

const Schedule = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = Colours[isDark ? 'dark' : 'light'];

  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  const { data } = useLiveQuery(db.select().from(workouts).orderBy(asc(workouts.date)), [
    refreshKey,
  ]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
      <ScreenHeader
        title="schedule"
        rightElement={
          <LiquidButton
            icon={<Menu size={22} color={theme.text} strokeWidth={1.5} />}
            onPress={() => console.log('Settings opened')}
          />
        }
      />
      <FlashList
        className="w-full flex-1 mt-3 px-4"
        data={data || []}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: '100%', paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => (
          <WorkoutCard
            title={item.title}
            description={item.description ? item.description : ''}
            date={item.date}
            distance={`${item.distanceKm} km`}
            type={item.type as RunType}
            onPress={() => console.log('Open Workou:', item.id, 'of type', item.type)}
          />
        )}
        ListHeaderComponent={
          <Text className="text-xl font-bold mb-3" style={{ color: theme.text }}>
            upcoming runs
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default Schedule;
