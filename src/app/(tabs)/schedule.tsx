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
import { Colours } from '@/constants/theme';
import ScreenHeader from '@/src/components/screenHeader';
import LiquidButton from '@/src/components/liquidButton';
import WorkoutCard from '@/src/components/workoutCard';

const Schedule = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = Colours[isDark ? 'dark' : 'light'];

  let { data } = useFocusQuery<Workout[]>(db.select().from(workouts).orderBy(asc(workouts.date)));

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
      <ScreenHeader
        title="schedule"
        button1={
          <LiquidButton
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
            title={item.title}
            description={item.description ? item.description : ''}
            date={new Date(item.date).toISOString()}
            distance={`${item.distanceKm} km`}
            type={item.type}
            onPress={() => console.log('Open Workou:', item.id, 'of type', item.type)}
          />
        )}
        ListHeaderComponent={
          <Text className="text-xl font-bold mb-3 px-1" style={{ color: theme.text }}>
            upcoming runs
          </Text>
        }
        ListEmptyComponent={
          <View className="items-center">
            <Text className="text-sm mt-5" style={{ color: theme.textSecondary }}>
              no runs found!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Schedule;
