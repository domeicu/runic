import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../lib/themeContext';

const Notifications = () => {
  const { theme } = useTheme();

  const NotificationItem = ({ title, description }: any) => (
    <TouchableOpacity
      className="flex-row items-center border-b p-4"
      style={{ borderColor: theme.border }}
    >
      <View className="mr-4">
        <Image
          className="h-12 w-12 rounded-full border"
          style={{ borderColor: theme.border }}
        />
      </View>
      <View className="flex-1">
        <Text className="flex-1 font-medium" style={{ color: theme.text }}>
          {title}
        </Text>
        <Text className="mr-2 text-sm" style={{ color: theme.textSecondary }}>
          {description}
        </Text>
      </View>
      <ChevronRight size={18} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      className="w-full flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ minHeight: '100%' }}
    >
      <View className="overflow-hidden"></View>
    </ScrollView>
  );
};

export default Notifications;
