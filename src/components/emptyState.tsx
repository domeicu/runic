import React from 'react';
import { View, Text } from 'react-native';
import { Layout } from '../constants/theme';

interface EmptyStateProps {
  theme: any;
  message: string;
  icon?: React.ReactNode;
}

const EmptyState = ({ theme, message, icon }: EmptyStateProps) => {
  return (
    <View
      className="items-center justify-center border border-dashed px-4 py-8"
      style={[
        {
          backgroundColor: theme.glass,
          borderColor: theme.border,
          borderRadius: Layout.borderRadius.card,
        },
      ]}
    >
      {icon && <View className="mb-3">{icon}</View>}
      <Text
        className="text-center text-sm font-medium"
        style={{ color: theme.textSecondary }}
      >
        {message}
      </Text>
    </View>
  );
};

export default EmptyState;
