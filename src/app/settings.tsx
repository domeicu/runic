import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Bell, Clock, Moon, Palette } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../lib/themeContext';
import { Layout } from '@/src/constants/theme';
import DataManagement from '../components/dataManagement';
import AccentPicker from '../components/accentPicker';
import {
  setupNotifications,
  syncNotifications,
  cancelAllNotifications,
} from '@/src/lib/notifications';

const Settings = () => {
  const { colorScheme } = useColorScheme();
  const { theme, updateMode } = useTheme();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState(
    new Date(new Date().setHours(6, 0, 0, 0))
  );

  useEffect(() => {
    const loadSettings = async () => {
      const storedEnabled = await AsyncStorage.getItem('notifications_enabled');
      const storedTime = await AsyncStorage.getItem('notification_time');

      setNotificationsEnabled(
        storedEnabled === null ? true : storedEnabled === 'true'
      );

      if (storedTime) setNotificationTime(new Date(storedTime));
    };
    loadSettings();
  }, []);

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem('notifications_enabled', String(value));

    if (value) {
      const granted = await setupNotifications();
      if (granted) {
        await syncNotifications();
      } else {
        Alert.alert(
          'Permissions Required',
          'Please enable notifications in your phone settings to use this feature.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => setNotificationsEnabled(false),
            },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } else {
      await cancelAllNotifications();
    }
  };

  const handleTimeChange = async (event: any, selectedDate?: Date) => {
    if (!selectedDate) return;

    setNotificationTime(selectedDate);
    await AsyncStorage.setItem('notification_time', selectedDate.toISOString());

    if (notificationsEnabled) {
      await syncNotifications();
    }
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
      <View className="mb-2 mt-6">
        <View
          className="overflow-hidden border"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
            borderRadius: Layout.borderRadius.card,
          }}
        >
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
              onValueChange={toggleNotifications}
              trackColor={{ false: theme.border, true: theme.accent }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : theme.text}
            />
          </View>

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

      <View className="mt-6">
        <View
          className="overflow-hidden border"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
            borderRadius: Layout.borderRadius.card,
          }}
        >
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
