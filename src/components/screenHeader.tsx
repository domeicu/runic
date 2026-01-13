import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenHeaderProps {
  theme: any;
  title: string;
  button1?: React.ReactNode;
  button2?: React.ReactNode;
}

const HEADER_CONTENT_HEIGHT = 25;

const ScreenHeader = ({
  theme,
  title,
  button1,
  button2,
}: ScreenHeaderProps) => {
  const insets = useSafeAreaInsets();

  const hexToRGBA = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <View
      className="absolute top-0 z-50 w-full"
      style={{ paddingTop: insets.top }}
    >
      <LinearGradient
        colors={[
          hexToRGBA(theme.background, 1),
          hexToRGBA(theme.background, 0.85),
          hexToRGBA(theme.background, 0),
        ]}
        locations={[0.3, 0.8, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View className="mb-10 w-full flex-row items-center justify-between px-6 pt-6">
        <Text
          className="text-3xl font-bold lowercase tracking-tight"
          style={{ color: theme.text }}
        >
          {title}
        </Text>

        {(button1 || button2) && (
          <View className="flex-row items-center gap-2">
            {button2}
            {button1}
          </View>
        )}
      </View>
    </View>
  );
};

const Spacer = () => {
  const insets = useSafeAreaInsets();
  return <View style={{ height: insets.top + HEADER_CONTENT_HEIGHT }} />;
};

ScreenHeader.Spacer = Spacer;

export default ScreenHeader;
