import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useColorScheme } from 'nativewind';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { Bell, Clock, Palette, Moon } from 'lucide-react-native';
import { Layout, Colours } from '@/src/constants/theme';
import DataManagement from '../components/dataManagement';

const Settings = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];

  // --- Helpers ---
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return (
      '#' +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    );
  };

  const getSixAM = () => {
    const date = new Date();
    date.setHours(6, 0, 0, 0);
    return date;
  };

  // Generate 0-255 array once for the pickers
  const range0to255 = useMemo(
    () => Array.from({ length: 256 }, (_, i) => i),
    []
  );

  // --- State ---
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState(getSixAM());

  const [accentColor, setAccentColor] = useState(theme.accent);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [rgb, setRgb] = useState(hexToRgb(theme.accent));

  // Controls which RGB channel is currently expanded inline
  const [activePickerChannel, setActivePickerChannel] = useState<
    'r' | 'g' | 'b' | null
  >(null);

  // --- Effects ---
  useEffect(() => {
    setAccentColor(theme.accent);
    setRgb(hexToRgb(theme.accent));
  }, [colorScheme, theme.accent]);

  useEffect(() => {
    setAccentColor(rgbToHex(rgb.r, rgb.g, rgb.b));
  }, [rgb]);

  // --- Handlers ---
  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) setNotificationTime(selectedDate);
  };

  const togglePicker = (channel: 'r' | 'g' | 'b') => {
    // If clicking the already open channel, close it. Otherwise open the new one.
    setActivePickerChannel(activePickerChannel === channel ? null : channel);
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
      {/* notifications settings */}
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
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.border, true: accentColor }}
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
                  accentColor={accentColor}
                />
              </View>
            </View>
          )}
        </View>
      </View>

      {/* appearance settings */}
      <View className="mt-6">
        <View
          className="overflow-hidden border"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
            borderRadius: Layout.borderRadius.card,
          }}
        >
          {/* dark/light mode */}
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
              onValueChange={(val) => setColorScheme(val as any)}
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

          {/* accent colour button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowColorPicker(!showColorPicker)}
            className="flex-row items-center justify-between p-4"
            style={{
              borderBottomWidth: showColorPicker ? 1 : 0,
              borderColor: theme.border,
            }}
          >
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

            <View className="flex-row items-center">
              <Text
                className="mr-2 text-[10px] font-medium uppercase opacity-50"
                style={{ color: theme.text }}
              >
                {accentColor}
              </Text>
              <View
                className="h-6 w-6 rounded-full border"
                style={{
                  backgroundColor: accentColor,
                  borderColor: theme.border,
                }}
              />
            </View>
          </TouchableOpacity>

          {/* rgb sliders */}
          {showColorPicker && (
            <View className="bg-neutral-100 p-6 dark:bg-neutral-900/50">
              {['r', 'g', 'b'].map((channel) => {
                const isExpanded = activePickerChannel === channel;
                const channelKey = channel as 'r' | 'g' | 'b';

                return (
                  <View key={channel} className="mb-2">
                    {/* Row with Slider and Number */}
                    <View className="mb-2 flex-row items-center">
                      <Text
                        className="mr-2 w-4 font-bold uppercase"
                        style={{ color: theme.textSecondary }}
                      >
                        {channel}
                      </Text>
                      <Slider
                        style={{ flex: 1, height: 40 }}
                        minimumValue={0}
                        maximumValue={255}
                        step={1}
                        value={rgb[channelKey]}
                        onValueChange={(val) =>
                          setRgb((prev) => ({ ...prev, [channelKey]: val }))
                        }
                        minimumTrackTintColor={
                          channel === 'r'
                            ? '#ef4444'
                            : channel === 'g'
                              ? '#10b981'
                              : '#3b82f6'
                        }
                        maximumTrackTintColor={theme.border}
                        thumbTintColor={theme.text}
                      />

                      <TouchableOpacity
                        onPress={() => togglePicker(channelKey)}
                        className={`w-10 items-end justify-center rounded p-1 ${
                          isExpanded ? 'bg-black/5 dark:bg-white/10' : ''
                        }`}
                      >
                        <Text
                          className="text-right font-medium"
                          style={{
                            color: isExpanded ? theme.accent : theme.text,
                            fontWeight: isExpanded ? 'bold' : 'normal',
                          }}
                        >
                          {rgb[channelKey]}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Inline Expanded Picker */}
                    {isExpanded && (
                      <View className="mb-4 overflow-hidden rounded-xl bg-black/5 dark:bg-black/20">
                        <Picker
                          selectedValue={rgb[channelKey]}
                          onValueChange={(itemValue) =>
                            setRgb((prev) => ({
                              ...prev,
                              [channelKey]: itemValue,
                            }))
                          }
                          style={{ color: theme.text }}
                          itemStyle={{ color: theme.text, fontSize: 16 }}
                        >
                          {range0to255.map((i) => (
                            <Picker.Item key={i} label={String(i)} value={i} />
                          ))}
                        </Picker>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>

      <DataManagement />
    </ScrollView>
  );
};

export default Settings;
