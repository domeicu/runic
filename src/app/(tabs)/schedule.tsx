import React, { useMemo } from 'react';
import { SectionList, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Menu } from 'lucide-react-native';
import { asc } from 'drizzle-orm';

import { db } from '@/src/db/client';
import { workouts } from '@/src/db/schema';
import { useFocusQuery } from '@/src/lib/useFocusQuery';
import { Workout } from '@/src/lib/types';
import { groupWorkouts } from '@/src/lib/groupWorkouts';
import { Colours } from '@/src/constants/theme';

import ScreenHeader from '@/src/components/screenHeader';
import LiquidButton from '@/src/components/liquidButton';
import WorkoutCard from '@/src/components/workoutCard';
import EmptyState from '@/src/components/emptyState';
import { addImportButton } from '@/src/components/addImportButton';
import { EmptyWorkoutAction } from '@/src/components/emptyWorkoutAction';

const Schedule = () => {
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];

  const { data } = useFocusQuery<Workout[]>(
    db.select().from(workouts).orderBy(asc(workouts.date))
  );

  const sections = useMemo(() => groupWorkouts(data || []), [data]);

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
        button2={addImportButton({ theme })}
      />
      <SectionList
        className="px-5"
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section }: { section: any }) => {
          const isFirst = section.title === sections[0].title;
          return (
            <Text
              className={`mb-2 px-1 text-xl font-bold ${!isFirst && 'mt-6'}`}
              style={{ color: theme.text }}
            >
              {section.title}
            </Text>
          );
        }}
        renderItem={({ item }: { item: Workout }) => (
          <View className="mb-2">
            <WorkoutCard theme={theme} item={item} />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            theme={theme}
            message="no runs found!"
            action={EmptyWorkoutAction({ theme })}
          />
        }
        contentContainerStyle={{ minHeight: '100%', paddingBottom: 400 }}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
};

export default Schedule;
