import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Bell, Clock, Moon, Palette } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { useTheme } from '../lib/themeContext';
import { Layout } from '@/src/constants/theme';
import DataManagement from '../components/dataManagement';
import AccentPicker from '../components/accentPicker';

const Settings = () => {
  const { colorScheme } = useColorScheme();
  const { theme, updateMode } = useTheme();

  const getSixAM = () => {
    const date = new Date();
    date.setHours(6, 0, 0, 0);
    return date;
  };

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState(getSixAM());

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) setNotificationTime(selectedDate);
  };

  const IconContainer = ({ children }: { children: React.ReactNode }) => (
    <View className="w-8 items-start justify-center">{children}</View>
  );

  return (
    <ScrollView
      className="flex-1 px-4"
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* --- Notifications Section --- */}
      <View className="mb-2 mt-6">
        <View
          className="overflow-hidden border"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
            borderRadius: Layout.borderRadius.card,
          }}
        >
          {/* Toggle Switch */}
          <View
            className="flex-row items-center justify-between border-b p-4"
            style={{ borderColor: theme.border }}
          >
            <View className="flex-row items-center">
              <IconContainer>
                <Bell size={20} color={theme.textSecondary} />
              </IconContainer>
              <Text
                className="text-base font-medium lowercase"
                style={{ color: theme.text }}
              >
                allow notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.border, true: theme.accent }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : theme.text}
            />
          </View>

          {/* Time Picker */}
          {notificationsEnabled && (
            <View className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center">
                <IconContainer>
                  <Clock size={20} color={theme.textSecondary} />
                </IconContainer>
                <Text
                  className="text-base font-medium lowercase"
                  style={{ color: theme.text }}
                >
                  daily reminder
                </Text>
              </View>

              <View
                style={
                  Platform.OS === 'ios'
                    ? { transform: [{ scale: 0.85 }], marginRight: -10 }
                    : {}
                }
              >
                <DateTimePicker
                  value={notificationTime}
                  mode="time"
                  display="default"
                  onChange={handleTimeChange}
                  themeVariant={colorScheme ?? 'light'}
                  accentColor={theme.accent}
                />
              </View>
            </View>
          )}
        </View>
      </View>

      {/* --- Appearance Section --- */}
      <View className="mt-6">
        <View
          className="overflow-hidden border"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
            borderRadius: Layout.borderRadius.card,
          }}
        >
          {/* Dark/Light Mode Picker */}
          <View className="border-b p-4" style={{ borderColor: theme.border }}>
            <View className="mb-1 flex-row items-center">
              <IconContainer>
                <Moon size={20} color={theme.textSecondary} />
              </IconContainer>
              <Text
                className="text-base font-medium lowercase"
                style={{ color: theme.text }}
              >
                theme mode
              </Text>
            </View>

            <Picker
              selectedValue={colorScheme || 'system'}
              onValueChange={(val) => updateMode(val as any)}
              style={{
                color: theme.text,
                marginLeft: Platform.OS === 'android' ? 24 : -10,
              }}
              dropdownIconColor={theme.text}
              itemStyle={{ color: theme.text, fontSize: 15, height: 110 }}
            >
              <Picker.Item label="system default" value="system" />
              <Picker.Item label="light mode" value="light" />
              <Picker.Item label="dark mode" value="dark" />
            </Picker>
          </View>

          {/* Accent Color Picker */}
          <View className="p-4">
            <View className="mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <IconContainer>
                  <Palette size={20} color={theme.textSecondary} />
                </IconContainer>
                <Text
                  className="text-base font-medium lowercase"
                  style={{ color: theme.text }}
                >
                  accent color
                </Text>
              </View>
              <Text
                className="text-[10px] font-bold uppercase opacity-40"
                style={{ color: theme.text }}
              >
                {theme.accent}
              </Text>
            </View>
            <AccentPicker />
          </View>
        </View>
      </View>

      <DataManagement theme={theme} />
    </ScrollView>
  );
};

export default Settings;
