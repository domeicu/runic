import { Layout } from '@/src/constants/theme';
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ActionButtonProps {
  theme: any;
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const ActionButton = ({
  theme,
  label,
  onPress,
  loading = false,
  disabled = false,
  icon,
}: ActionButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className={'w-full flex-row items-center justify-center gap-2 py-4'}
      style={
        disabled
          ? {
              borderRadius: Layout.borderRadius.card,
              backgroundColor: theme.surface,
            }
          : {
              borderRadius: Layout.borderRadius.card,
              backgroundColor: theme.accent,
            }
      }
    >
      {loading ? (
        <ActivityIndicator color={theme.text} />
      ) : (
        <>
          {icon}
          <Text
            className={'text-lg font-bold'}
            style={
              disabled ? { color: theme.textSecondary } : { color: theme.glass }
            }
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default ActionButton;
