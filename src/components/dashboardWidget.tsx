import React from 'react';
import { View, Text } from 'react-native';
import EmptyState from './emptyState';

interface DashboardWidgetProps {
  theme: any;
  title: string;
  children: React.ReactNode;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
}

const DashboardWidget = ({
  theme,
  title,
  children,
  emptyMessage = 'nothing to display!',
  emptyAction,
}: DashboardWidgetProps) => {
  return (
    <View className="mb-6 px-5">
      <View className="mb-2 flex-row items-end justify-between px-1">
        <Text
          className="text-xl font-bold tracking-tight"
          style={{ color: theme.text }}
        >
          {title.toLowerCase()}
        </Text>
      </View>

      {children ? (
        children
      ) : (
        <EmptyState theme={theme} message={emptyMessage} action={emptyAction} />
      )}
    </View>
  );
};

export default DashboardWidget;
