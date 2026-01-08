import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Settings, User } from 'lucide-react-native';
import { Layout, Colours } from '@/src/constants/theme';
import ScreenHeader from '@/src/components/screenHeader';
import LiquidButton from '@/src/components/liquidButton';
import DataManagement from '@/src/components/dataManagement';

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

      {/* User Card */}
      <View className="mt-3 px-4">
        <View
          className="items-center rounded-[32px] border p-6"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
            borderRadius: Layout.borderRadius.card,
          }}
        >
          {/* Avatar Circle */}
          <View
            className="mb-4 h-24 w-24 items-center justify-center rounded-full border-4 shadow-sm"
            style={{
              backgroundColor: theme.border,
              borderColor: theme.background,
            }}
          >
            <User size={48} color={theme.textSecondary} />
          </View>

          <Text className="text-xl font-bold" style={{ color: theme.text }}>
            Guest
          </Text>
          <Text className="font-medium" style={{ color: theme.textSecondary }}>
            Level 0 • Runner
          </Text>
        </View>
      </View>

      {/* Placeholder for other profile content */}
      <View className="mt-8 flex-1 px-6">
        <Text
          className="mb-4 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: theme.textSecondary }}
        >
          Stats Overview
        </Text>

        <View
          className="h-32 w-full items-center justify-center border border-dashed"
          style={{
            borderColor: theme.border,
            borderRadius: Layout.borderRadius.card,
            backgroundColor: theme.surface,
          }}
        >
          <Text style={{ color: theme.textSecondary }}>
            Sync Strava to view stats
          </Text>
        </View>
      </View>

      <DataManagement />
      <View className="h-20" />
    </SafeAreaView>
  );
};

export default Profile;
