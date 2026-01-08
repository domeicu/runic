import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { Layout } from '@/src/constants/theme';

interface FormInputProps extends TextInputProps {
  theme: any;
  label: string;
}

const WorkoutTextInput = ({
  theme,
  label,
  style,
  ...props
}: FormInputProps) => (
  <View className="mb-5">
    <Text className="mb-2 font-medium" style={{ color: theme.textSecondary }}>
      {label}
    </Text>
    <TextInput
      placeholderTextColor={theme.textSecondary}
      style={[
        {
          color: theme.text,
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderRadius: Layout.borderRadius.card,
        },
        style,
      ]}
      className={`border p-4 text-lg leading-tight ${props.multiline ? 'h-32' : ''}`}
      {...props}
    />
  </View>
);

export default WorkoutTextInput;
