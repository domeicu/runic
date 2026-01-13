import React from 'react';
import { router } from 'expo-router';
import { SectionList, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Menu, Pencil, FileUp } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { asc } from 'drizzle-orm';
import { db } from '@/src/db/client';
import { workouts } from '@/src/db/schema';
import { useFocusQuery } from '@/src/lib/useFocusQuery';
import { Workout } from '@/src/lib/types';
import { groupWorkouts } from '@/src/lib/groupWorkouts';
import { Colours } from '@/src/constants/theme';
import ScreenHeader from '@/src/components/screenHeader';
import LiquidButton from '@/src/components/liquidButton';
import LiquidPillButton from '@/src/components/liquidPillButton';
import WorkoutCard from '@/src/components/workoutCard';
import EmptyState from '@/src/components/emptyState';

const Schedule = () => {
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];

  let { data } = useFocusQuery<Workout[]>(
    db.select().from(workouts).orderBy(asc(workouts.date))
  );

  const sections = React.useMemo(() => groupWorkouts(data || []), [data]);

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
        button2={
          <LiquidPillButton
            theme={theme}
            leftAction={{
              icon: <Pencil size={18} color={theme.text} />,
              onPress: () => router.push('/workout/form'),
            }}
            rightAction={{
              icon: <FileUp size={18} color={theme.text} />,
              onPress: () => router.push('/workout/import'),
            }}
          />
        }
      />
      <SectionList
        className="px-5"
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ minHeight: '100%', paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => {
          const isFirst = sections.indexOf(section) === 0;
          return (
            <Text
              className={`mb-2 px-1 text-xl font-bold ${!isFirst && 'mt-2'}`}
              style={{ color: theme.text }}
            >
              {section.title}
            </Text>
          );
        }}
        renderItem={({ item }) => (
          <View className="mb-2">
            <WorkoutCard
              theme={theme}
              title={item.title}
              description={item.description || ''}
              date={item.date}
              distance={`${item.distanceKm} km`}
              type={item.type}
              isCompleted={item.isCompleted}
              onPress={() => router.push(`/workout/${item.id}`)}
              onLongPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                router.push({
                  pathname: '/workout/form',
                  params: { id: item.id },
                });
              }}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            theme={theme}
            message="no runs found!"
            action={
              <View className="flex-row gap-2">
                <TouchableOpacity onPress={() => router.push('/workout/form')}>
                  <Text style={{ color: theme.accent }}>add</Text>
                </TouchableOpacity>
                <Text style={{ color: theme.textSecondary }}>/</Text>
                <TouchableOpacity
                  onPress={() => router.push('/workout/import')}
                >
                  <Text style={{ color: theme.accent }}>import</Text>
                </TouchableOpacity>
              </View>
            }
          />
        }
      />
    </SafeAreaView>
  );
};

export default Schedule;
