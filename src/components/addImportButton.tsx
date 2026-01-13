import React from 'react';
import { router } from 'expo-router';
import { Pencil, FileUp } from 'lucide-react-native';

import LiquidPillButton from '@/src/components/liquidPillButton';

export const addImportButton = ({ theme }: { theme: any }) => (
  <LiquidPillButton
    theme={theme}
    leftAction={{
      icon: <Pencil size={18} color={theme.text} />,
      onPress: () => router.push('/workout/form'),
    }}
    rightAction={{
      icon: <FileUp size={18} color={theme.text} />,
      onPress: () => router.push('/workout/import'),
    }}
  />
);
