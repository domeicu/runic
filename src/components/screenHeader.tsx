import React from 'react';
import { View, Text } from 'react-native';

interface ScreenHeaderProps {
  theme: any;
  title: string;
  button1?: React.ReactNode;
  button2?: React.ReactNode;
}

const ScreenHeader = ({
  theme,
  title,
  button1,
  button2,
}: ScreenHeaderProps) => (
  <View className="w-full flex-row items-center justify-between px-6 py-4">
    <Text
      className="text-3xl font-bold lowercase tracking-tight"
      style={{ color: theme.text }}
    >
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
