import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useColorScheme } from 'nativewind';
import { Menu } from 'lucide-react-native';
import { asc } from 'drizzle-orm';
import { db } from '@/src/db/client';
import { workouts } from '@/src/db/schema';
import { useFocusQuery } from '@/src/lib/useFocusQuery';
import { Workout } from '@/src/lib/types';
import { Colours } from '@/src/constants/theme';
import ScreenHeader from '@/src/components/screenHeader';
import LiquidButton from '@/src/components/liquidButton';
import WorkoutCard from '@/src/components/workoutCard';
import EmptyState from '@/src/components/emptyState';

const Schedule = () => {
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];

  let { data } = useFocusQuery<Workout[]>(
    db.select().from(workouts).orderBy(asc(workouts.date))
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.background }}
    >
      <ScreenHeader
        theme={theme}
        title="schedule"
        button1={
          <LiquidButton
            theme={theme}
            icon={<Menu size={22} color={theme.text} strokeWidth={1.5} />}
            onPress={() => console.log('Settings opened')}
          />
        }
      />
      <FlashList
        className="w-full flex-1 px-5"
        data={data || []}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: '100%', paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => (
          <WorkoutCard
            theme={theme}
            title={item.title}
            description={item.description ? item.description : ''}
            date={new Date(item.date).toISOString()}
            distance={`${item.distanceKm} km`}
            type={item.type}
            onPress={() =>
              console.log('Open Workou:', item.id, 'of type', item.type)
            }
          />
        )}
        ListHeaderComponent={
          <Text
            className="mb-3 px-1 text-xl font-bold"
            style={{ color: theme.text }}
          >
            upcoming runs
          </Text>
        }
        ListEmptyComponent={
          <EmptyState theme={theme} message="no runs found!" />
        }
      />
    </SafeAreaView>
  );
};

export default Schedule;
