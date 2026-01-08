import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useColorScheme } from 'nativewind';
import { ChevronRight } from 'lucide-react-native';
import { Colours } from '@/constants/theme';

const Notifications = () => {
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];

  const NotificationItem = ({ title, description }: any) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b"
      style={{ borderColor: theme.border }}
    >
      <View className="mr-4">
        <Image className="w-12 h-12 border rounded-full" style={{ borderColor: theme.border }} />
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
      <View className="overflow-hidden border">
        <NotificationItem title="New follower" description="Guest has started following you." />
        <NotificationItem
          title="Goal reached"
          description="Weekly mileage goal of 50km reached. Congratulations!"
        />
        <NotificationItem
          title="New year"
          description="Happy new year! Let's make 2026 your year."
        />
      </View>
    </ScrollView>
  );
};

export default Notifications;
