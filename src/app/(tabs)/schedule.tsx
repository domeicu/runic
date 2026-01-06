import React from 'react';
// import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Menu } from 'lucide-react-native';
import { Colours } from '@/constants/theme';
import ScreenHeader from '@/src/components/screenHeader';
import LiquidButton from '@/src/components/liquidButton';

const Schedule = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = Colours[isDark ? 'dark' : 'light'];

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
    </SafeAreaView>
  );
};

export default Schedule;
