import React, { useState, useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Trophy, Activity, Tag } from 'lucide-react-native';
import { asc, gte } from 'drizzle-orm';

import { db } from '@/src/db/client';
import { workouts } from '@/src/db/schema';
import { getMonthlyStats } from '@/src/db/queries';
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

const StatItem = ({
  theme,
  icon,
  value,
  label,
  isLast = false,
}: {
  theme: any;
  icon: React.ReactNode;
  value: string | number;
  label: string;
  isLast?: boolean;
}) => (
  <View
    className={`flex-1 items-center px-1 ${!isLast ? 'border-r' : ''}`}
    style={{ borderColor: theme.border }}
  >
    <View className="mb-2">{icon}</View>
    <Text
      className="text-center text-xl font-bold"
      style={{ color: theme.text }}
      numberOfLines={1}
      adjustsFontSizeToFit
    >
      {value}
    </Text>
    <Text className="text-xs font-bold" style={{ color: theme.textSecondary }}>
      {label}
    </Text>
  </View>
);

const Index = () => {
  const { theme } = useTheme();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: nextRunData } = useFocusQuery<Workout[]>(
    db
      .select()
      .from(workouts)
      .where(gte(workouts.date, today.toISOString()))
      .orderBy(asc(workouts.date))
      .limit(1)
  );
  const nextItem = nextRunData ? nextRunData[0] : null;

  const [stats, setStats] = useState({
    longestRun: 0,
    topType: '-',
    totalRuns: 0,
  });

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchStats = async () => {
        const result = await getMonthlyStats();
        if (isActive) setStats(result);
      };
      fetchStats();
      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.background }}
    >
      <ScreenHeader
        theme={theme}
        title="dashboard"
        // button1={
        //   <LiquidButton
        //     theme={theme}
        //     icon={<Bell size={22} color={theme.text} strokeWidth={1.5} />}
        //     onPress={() => router.push('/notifications')}
        //   />
        // }
        button2={addImportButton({ theme })}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: '100%', paddingBottom: 20 }}
      >
        <ScreenHeader.Spacer />

        <DashboardWidget theme={theme} title="this month">
          <View className="flex-row items-center justify-between">
            <StatItem
              theme={theme}
              icon={<Trophy size={20} color={theme.accent} />}
              value={stats.longestRun}
              label="longest"
            />
            <StatItem
              theme={theme}
              icon={<Tag size={20} color={theme.accent} />}
              value={stats.topType}
              label="top type"
            />
            <StatItem
              theme={theme}
              icon={<Activity size={20} color={theme.accent} />}
              value={stats.totalRuns}
              label="runs"
              isLast
            />
          </View>
        </DashboardWidget>

        <DashboardWidget
          theme={theme}
          title="next run"
          emptyMessage="no runs found!"
          emptyAction={EmptyWorkoutAction({ theme })}
        >
          {nextItem && <WorkoutCard theme={theme} item={nextItem} />}
        </DashboardWidget>

        <DashboardWidget theme={theme} title="weekly progress">
          <WeeklyProgressCard theme={theme} />
        </DashboardWidget>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
