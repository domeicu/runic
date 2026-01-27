import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Settings } from 'lucide-react-native';

import { useTheme } from '@/src/lib/themeContext';

import ScreenHeader from '@/src/components/screenHeader';
import LiquidButton from '@/src/components/liquidButton';

const Profile = () => {
  const { theme } = useTheme();

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
