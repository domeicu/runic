import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { Layout } from '@/constants/theme';

interface FormInputProps extends TextInputProps {
  label: string;
  theme: any;
}

const WorkoutTextInput = ({ label, theme, style, ...props }: FormInputProps) => (
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
      className={`p-4 text-lg leading-tight border ${props.multiline ? 'h-32' : ''}`}
      {...props}
    />
  </View>
);

export default WorkoutTextInput;
