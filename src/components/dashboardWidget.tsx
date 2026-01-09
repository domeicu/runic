import React from 'react';
import { View, Text } from 'react-native';
import EmptyState from './emptyState';

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
        <EmptyState theme={theme} message={emptyMessage} />
      )}
    </View>
  );
};

export default DashboardWidget;
