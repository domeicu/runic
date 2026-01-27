import React from 'react';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell } from 'lucide-react-native';
import { asc, gte } from 'drizzle-orm';

import { db } from '@/src/db/client';
import { workouts } from '@/src/db/schema';
import { Workout } from '@/src/types/types';
import { useFocusQuery } from '@/src/hooks/useFocusQuery';
import { useTheme } from '@/src/lib/themeContext';

import ScreenHeader from '@/src/components/screenHeader';
import DashboardWidget from '@/src/components/dashboardWidget';
import LiquidButton from '@/src/components/liquidButton';
import WorkoutCard from '@/src/components/workoutCard';
import WeeklyProgressCard from '@/src/components/weeklyProgress';
import { addImportButton } from '@/src/components/addImportButton';
import { EmptyWorkoutAction } from '@/src/components/emptyWorkoutAction';

const Index = () => {
  const { theme } = useTheme();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data } = useFocusQuery<Workout[]>(
    db
      .select()
      .from(workouts)
      .where(gte(workouts.date, today.toISOString()))
      .orderBy(asc(workouts.date))
      .limit(1)
  );

  const item = data ? data[0] : null;

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.background }}
    >
      <ScreenHeader
        theme={theme}
        title="dashboard"
        button1={
          <LiquidButton
            theme={theme}
            icon={<Bell size={22} color={theme.text} strokeWidth={1.5} />}
            onPress={() => router.push('/notifications')}
          />
        }
        button2={addImportButton({ theme })}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: '100%', paddingBottom: 10 }}
      >
        <ScreenHeader.Spacer />
        <DashboardWidget
          theme={theme}
          title="next run"
          emptyMessage="no runs found!"
          emptyAction={EmptyWorkoutAction({ theme })}
        >
          {item && <WorkoutCard theme={theme} item={item} />}
        </DashboardWidget>

        <DashboardWidget theme={theme} title="Weekly Progress">
          <WeeklyProgressCard theme={theme} />
        </DashboardWidget>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
