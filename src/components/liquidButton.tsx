import React from 'react';
import { TouchableOpacity } from 'react-native';

interface LiquidButtonProps {
  theme: any;
  icon: React.ReactNode;
  onPress?: () => void;
}

const LiquidButton = ({ theme, icon, onPress }: LiquidButtonProps) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    className="h-11 w-11 items-center justify-center rounded-full shadow-xl backdrop-blur-xl"
    style={[
      {
        backgroundColor: theme.glass,
        borderColor: theme.border,
        borderWidth: 1,
        shadowColor: theme.shadow,
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
    ]}
  >
    {icon}
  </TouchableOpacity>
);

export default LiquidButton;
