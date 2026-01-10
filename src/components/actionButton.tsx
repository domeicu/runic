import { Layout } from '@/src/constants/theme';
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ActionButtonProps {
  theme: any;
  label: string;
  onPress: () => void;
  colour?: string;
  loading?: boolean;
  disabled?: boolean;
  toggledOff?: boolean;
  icon?: React.ReactNode;
}

const ActionButton = ({
  theme,
  label,
  onPress,
  colour = theme.accent,
  loading = false,
  disabled = false,
  toggledOff = false,
  icon,
}: ActionButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className={
        'w-full flex-row items-center justify-center gap-2 border py-4'
      }
      style={
        disabled || toggledOff
          ? {
              borderRadius: Layout.borderRadius.card,
              borderColor: theme.border,
            }
          : {
              borderRadius: Layout.borderRadius.card,
              borderColor: colour,
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
              disabled || toggledOff
                ? { color: theme.textSecondary }
                : { color: colour }
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
