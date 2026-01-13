import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Settings } from 'lucide-react-native';
import { Colours } from '@/src/constants/theme';
import ScreenHeader from '@/src/components/screenHeader';
import LiquidButton from '@/src/components/liquidButton';

const Profile = () => {
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.background }}
    >
      <ScreenHeader
        theme={theme}
        title="profile"
        button1={
          <LiquidButton
            theme={theme}
            icon={<Settings size={22} color={theme.text} strokeWidth={1.5} />}
            onPress={() => router.push('/settings')}
          />
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
