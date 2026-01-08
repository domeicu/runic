import React from 'react';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Bell, Pencil, FileUp } from 'lucide-react-native';
import { Colours } from '@/src/constants/theme';
import { asc, gte } from 'drizzle-orm';
import { db } from '@/src/db/client';
import { workouts } from '@/src/db/schema';
import { useFocusQuery } from '@/src/lib/useFocusQuery';
import { Workout } from '@/src/lib/types';
import ScreenHeader from '@/src/components/screenHeader';
import DashboardWidget from '@/src/components/dashboardWidget';
import LiquidButton from '@/src/components/liquidButton';
import LiquidPillButton from '@/src/components/liquidPillButton';
import WorkoutCard from '@/src/components/workoutCard';

const Index = () => {
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];

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

  const nextRun = data ? data[0] : null;

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
        button2={
          <LiquidPillButton
            theme={theme}
            leftAction={{
              icon: <Pencil size={18} color={theme.text} />,
              onPress: () => router.push('/workout/add'),
            }}
            rightAction={{
              icon: <FileUp size={18} color={theme.text} />,
              onPress: () => router.push('/workout/import'),
            }}
          />
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: '100%', paddingBottom: 10 }}
      >
        <DashboardWidget
          theme={theme}
          title="next run"
          emptyMessage="no runs found!"
        >
          {nextRun && (
            <WorkoutCard
              theme={theme}
              title={nextRun.title}
              description={nextRun.description ? nextRun.description : ''}
              date={new Date(nextRun.date).toISOString()}
              distance={`${nextRun.distanceKm} km`}
              type={nextRun.type}
              onPress={() =>
                console.log('Open Workou:', nextRun.id, 'of type', nextRun.type)
              }
            />
          )}
        </DashboardWidget>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
