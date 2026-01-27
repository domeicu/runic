import React, { useRef, useMemo, useState } from 'react';
import {
  SectionList,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar as CalendarIcon, List } from 'lucide-react-native';
import { Calendar } from 'react-native-calendars';
import { asc } from 'drizzle-orm';
import { format } from 'date-fns';

import { db } from '@/src/db/client';
import { workouts } from '@/src/db/schema';
import { useFocusQuery } from '@/src/hooks/useFocusQuery';
import { useAutoScrollToToday } from '@/src/hooks/useAutoScroll';
import { Workout } from '@/src/types/types';
import { groupWorkouts } from '@/src/lib/groupWorkouts';
import { useTheme } from '@/src/lib/themeContext';

import ScreenHeader from '@/src/components/screenHeader';
import LiquidButton from '@/src/components/liquidButton';
import WorkoutCard from '@/src/components/workoutCard';
import EmptyState from '@/src/components/emptyState';
import { addImportButton } from '@/src/components/addImportButton';
import { EmptyWorkoutAction } from '@/src/components/emptyWorkoutAction';
import { Layout } from '@/src/constants/theme';

const Schedule = () => {
  const { theme } = useTheme();

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [calendarId, setCalendarId] = useState(0);

  const { data } = useFocusQuery<Workout[]>(
    db.select().from(workouts).orderBy(asc(workouts.date))
  );

  const sections = useMemo(() => groupWorkouts(data || []), [data]);

  const initialScrollIndex = useMemo(() => {
    const thisWeekIndex = sections.findIndex((s) => s.title === 'this week');
    if (thisWeekIndex !== -1) return thisWeekIndex;

    return 0;
  }, [sections]);

  const listRef = useRef<SectionList>(null);
  const { handleTouchStart } = useAutoScrollToToday(
    listRef,
    sections,
    initialScrollIndex
  );

  const markedDates = useMemo(() => {
    const marks: any = {};

    data?.forEach((workout) => {
      if (!workout.date) return;
      const dateStr = format(new Date(workout.date), 'yyyy-MM-dd');
      marks[dateStr] = {
        marked: true,
        dotColor: theme.accent,
      };
    });

    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: theme.accent,
      selectedTextColor: '#ffffff',
    };

    return marks;
  }, [data, selectedDate, theme.accent]);

  const selectedDayWorkouts = useMemo(() => {
    return (
      data?.filter((w) => {
        if (!w.date) return false;
        return format(new Date(w.date), 'yyyy-MM-dd') === selectedDate;
      }) || []
    );
  }, [data, selectedDate]);

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
            icon={
              viewMode === 'list' ? (
                <CalendarIcon size={22} color={theme.text} strokeWidth={1.5} />
              ) : (
                <List size={22} color={theme.text} strokeWidth={1.5} />
              )
            }
            onPress={() =>
              setViewMode((prev) => (prev === 'list' ? 'calendar' : 'list'))
            }
          />
        }
        button2={addImportButton({ theme, date: selectedDate })}
      />
      {viewMode === 'list' ? (
        <SectionList
          ref={listRef}
          className="px-5"
          keyExtractor={(item) => item.id.toString()}
          sections={sections}
          ListHeaderComponent={<ScreenHeader.Spacer />}
          renderSectionHeader={({ section }: { section: any }) => {
            const isFirst = section.title === sections[0].title;
            return (
              <Text
                className={`mb-2 px-1 text-xl font-bold ${!isFirst && 'mt-4'}`}
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
            <View className="pt-2">
              <EmptyState
                theme={theme}
                message="no runs found!"
                action={EmptyWorkoutAction({ theme })}
              />
            </View>
          }
          onScrollToIndexFailed={() => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              listRef.current?.scrollToLocation({
                sectionIndex: initialScrollIndex,
                itemIndex: 0,
                viewPosition: 0.1,
                animated: true,
              });
            });
          }}
          onTouchStart={handleTouchStart}
          contentContainerStyle={{ minHeight: '100%', paddingBottom: 400 }}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      ) : (
        <FlatList
          className="px-5"
          data={selectedDayWorkouts}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <View>
              <ScreenHeader.Spacer />
              <View
                className="mb-6 mt-1 overflow-hidden border shadow-sm shadow-black/5"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  borderRadius: Layout.borderRadius.card,
                }}
              >
                <Calendar
                  key={calendarId}
                  firstDay={1}
                  current={selectedDate}
                  onDayPress={(day: any) => setSelectedDate(day.dateString)}
                  markedDates={markedDates}
                  theme={{
                    backgroundColor: theme.surface,
                    calendarBackground: theme.surface,
                    textSectionTitleColor: theme.textSecondary,
                    selectedDayBackgroundColor: theme.accent,
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: theme.accent,
                    dayTextColor: theme.text,
                    textDisabledColor: theme.border,
                    monthTextColor: theme.text,
                    arrowColor: theme.accent,
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '600',
                  }}
                />
              </View>
              <View className="mb-3 flex-row items-center justify-between px-1">
                <Text
                  className="text-xl font-bold"
                  style={{ color: theme.text }}
                >
                  {format(new Date(selectedDate), 'MMMM do')}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
                    setCalendarId((prev) => prev + 1);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{ color: theme.accent }}
                  >
                    Today
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View className="mb-2">
              <WorkoutCard theme={theme} item={item} />
            </View>
          )}
          ListEmptyComponent={
            <EmptyState
              theme={theme}
              message="no runs scheduled!"
              action={EmptyWorkoutAction({ theme, date: selectedDate })}
            />
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default Schedule;
