import React, { useMemo } from 'react';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Bell } from 'lucide-react-native';
import { asc, gte } from 'drizzle-orm';

import { db } from '@/src/db/client';
import { workouts } from '@/src/db/schema';
import { Colours } from '@/src/constants/theme';
import { useFocusQuery } from '@/src/lib/useFocusQuery';
import { Workout } from '@/src/lib/types';

import ScreenHeader from '@/src/components/screenHeader';
import DashboardWidget from '@/src/components/dashboardWidget';
import LiquidButton from '@/src/components/liquidButton';
import WorkoutCard from '@/src/components/workoutCard';
import { addImportButton } from '@/src/components/addImportButton';
import { EmptyWorkoutAction } from '@/src/components/emptyWorkoutAction';

const Index = () => {
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

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
        <DashboardWidget
          theme={theme}
          title="next run"
          emptyMessage="no runs found!"
          emptyAction={EmptyWorkoutAction({ theme })}
        >
          {item && <WorkoutCard theme={theme} item={item} />}
        </DashboardWidget>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
