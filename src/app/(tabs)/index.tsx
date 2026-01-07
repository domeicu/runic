import React from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Bell } from 'lucide-react-native';
import { Colours } from '@/constants/theme';
import ScreenHeader from '@/src/components/screenHeader';
import LiquidButton from '@/src/components/liquidButton';

const Index = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = Colours[isDark ? 'dark' : 'light'];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
      <ScreenHeader
        title="runic"
        rightElement={
          <LiquidButton
            icon={<Bell size={22} color={theme.text} strokeWidth={1.5} />}
            onPress={() => router.push('/notifications')}
          />
        }
      />
    </SafeAreaView>
  );
};

export default Index;
