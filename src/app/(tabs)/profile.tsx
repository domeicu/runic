import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, User } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import LiquidButton from '@/src/components/liquidButton';
import ScreenHeader from '@/src/components/screenHeader';
import Colours from '@/constants/colours';

const Profile = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Select the active theme palette
  const theme = Colours[isDark ? 'dark' : 'light'];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
      <ScreenHeader
        title="profile"
        rightElement={
          <LiquidButton
            icon={<Settings size={22} color={theme.text} strokeWidth={1.5} />}
            onPress={() => console.log('Settings opened')}
          />
        }
      />

      {/* User Card */}
      <View className="px-4 mt-3">
        <View
          className="p-6 rounded-[32px] items-center border"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
          }}
        >
          {/* Avatar Circle */}
          <View
            className="h-24 w-24 rounded-full items-center justify-center mb-4 border-4 shadow-sm"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : theme.border,
              borderColor: theme.background,
            }}
          >
            <User size={48} color={theme.textSecondary} />
          </View>

          <Text className="text-xl font-bold" style={{ color: theme.text }}>
            Runner One
          </Text>
          <Text className="font-medium" style={{ color: theme.textSecondary }}>
            Level 12 • Marathoner
          </Text>
        </View>
      </View>

      {/* Placeholder for other profile content */}
      <View className="flex-1 px-6 mt-8">
        <Text
          className="font-semibold uppercase tracking-widest text-[10px] mb-4"
          style={{ color: theme.textSecondary }}
        >
          Stats Overview
        </Text>

        <View
          className="h-32 w-full rounded-3xl border border-dashed items-center justify-center"
          style={{
            borderColor: theme.border,
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F4F4F5',
          }}
        >
          <Text style={{ color: theme.textSecondary }}>Sync Strava to view stats</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
