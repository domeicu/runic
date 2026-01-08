import React from 'react';
import { View, Text } from 'react-native';
import { Layout } from '@/src/constants/theme';

interface DashboardWidgetProps {
  theme: any;
  title: string;
  children: React.ReactNode;
  emptyMessage?: string;
  action?: React.ReactNode;
}

const DashboardWidget = ({
  theme,
  title,
  children,
  emptyMessage = 'nothing to display!',
  action,
}: DashboardWidgetProps) => {
  return (
    <View className="mb-6 px-5">
      <View className="mb-3 flex-row items-end justify-between px-1">
        <Text
          className="text-xl font-bold tracking-tight"
          style={{ color: theme.text }}
        >
          {title.toLowerCase()}
        </Text>
        {action && <View className="mb-1">{action}</View>}
      </View>

      {children ? (
        children
      ) : (
        <View
          className="items-center border border-dashed py-6"
          style={{
            backgroundColor: theme.glass,
            borderColor: theme.border,
            borderRadius: Layout.borderRadius.card,
          }}
        >
          <Text
            className="text-sm font-medium opacity-60"
            style={{ color: theme.text }}
          >
            {emptyMessage.toLowerCase()}
          </Text>
        </View>
      )}
    </View>
  );
};

export default DashboardWidget;
