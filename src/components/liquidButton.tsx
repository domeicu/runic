import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { useColorScheme } from 'nativewind';
import Colours from '@/constants/colours';

interface LiquidButtonProps {
  icon: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

const LiquidButton = ({ icon, onPress, style }: LiquidButtonProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = Colours[isDark ? 'dark' : 'light'];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="h-11 w-11 items-center justify-center rounded-full shadow-xl backdrop-blur-xl"
      style={[
        {
          backgroundColor: theme.glass,
          borderColor: theme.border,
          borderWidth: 1,
          shadowColor: isDark ? '#000' : '#A1A1AA',
          shadowOpacity: 0.2,
          shadowRadius: 10,
        },
        style,
      ]}
    >
      {icon}
    </TouchableOpacity>
  );
};

export default LiquidButton;
