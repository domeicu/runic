import React from 'react';
import { View, Text } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Colours } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  rightElement?: React.ReactNode;
}

const ScreenHeader = ({ title, rightElement }: ScreenHeaderProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = Colours[isDark ? 'dark' : 'light'];

  return (
    <View className="flex-row justify-between items-center pl-6 pr-4 py-3 w-full">
      <Text className="text-3xl font-bold tracking-tight lowercase" style={{ color: theme.text }}>
        {title}
      </Text>

      {rightElement && <View>{rightElement}</View>}
    </View>
  );
};

export default ScreenHeader;
