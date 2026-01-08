import React from 'react';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

interface ModalHeaderProps {
  theme: any;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

const ModalHeader = ({
  theme,
  title,
  subtitle,
  onBack,
  showBackButton = true,
}: ModalHeaderProps) => {
  const handlePress = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View className="p-4 pt-8 border-b" style={{ borderColor: theme.border }}>
      <View className="flex-row items-center">
        {showBackButton && (
          <TouchableOpacity onPress={handlePress} className="p-2 mr-2">
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
        )}
        <View className="flex-1">
          <Text className="text-xl font-bold" style={{ color: theme.text }}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm mt-1" style={{ color: theme.textSecondary }}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default ModalHeader;
