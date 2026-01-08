import React from 'react';
import { View, Text } from 'react-native';

interface ScreenHeaderProps {
  theme: any;
  title: string;
  button1?: React.ReactNode;
  button2?: React.ReactNode;
}

const ScreenHeader = ({ theme, title, button1, button2 }: ScreenHeaderProps) => (
  <View className="flex-row justify-between items-center px-6 py-4 w-full">
    <Text className="text-3xl font-bold tracking-tight lowercase" style={{ color: theme.text }}>
      {title}
    </Text>
    {button1 && (
      <View className="flex-row gap-2">
        {button2}
        {button1}
      </View>
    )}
  </View>
);

export default ScreenHeader;
