import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import { ChevronRight, Shield, Bell, Moon } from 'lucide-react-native';
import { Layout, Colours } from '@/src/constants/theme';

const Settings = () => {
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];

  const SettingItem = ({ icon: Icon, label, value }: any) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b"
      style={{ borderColor: theme.border }}
    >
      <View className="mr-4">
        <Icon size={20} color={theme.accent} />
      </View>
      <Text className="flex-1 font-medium" style={{ color: theme.text }}>
        {label}
      </Text>
      {value && (
        <Text className="mr-2 text-sm" style={{ color: theme.textSecondary }}>
          {value}
        </Text>
      )}
      <ChevronRight size={18} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      className="w-full flex-1 px-4"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ minHeight: '100%' }}
    >
      <View
        className="overflow-hidden border mt-4"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderRadius: Layout.borderRadius.card,
        }}
      >
        <SettingItem icon={Bell} label="Notifications" />
        <SettingItem icon={Shield} label="Privacy" />
        <SettingItem icon={Moon} label="Appearance" value={colorScheme} />
      </View>
    </ScrollView>
  );
};

export default Settings;
