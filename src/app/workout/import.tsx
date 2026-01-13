import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { UploadCloud, FileJson, X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Colours, Layout } from '@/src/constants/theme';
import {
  importCsvWorkouts,
  importIcsWorkouts,
} from '@/src/features/plans/importService';
import ActionButton from '@/src/components/actionButton';
import ModalHeader from '@/src/components/modalHeader';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export default function ImportWorkout() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];

  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null
  );
  const [isImporting, setIsImporting] = useState(false);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/calendar', 'text/csv'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets[0]) return;

      const asset = result.assets[0];
      if (asset.size && asset.size > MAX_FILE_SIZE) {
        Alert.alert('File too large', 'Please select a file under 20MB.');
        return;
      }
      setFile(asset);
    } catch {
      Alert.alert('Error', 'Could not pick file.');
    }
  };

  const handleImport = async () => {
    if (!file || isImporting) return;
    setIsImporting(true);

    try {
      const response = await fetch(file.uri);
      const content = await response.text();
      const ext = file.name.split('.').pop()?.toLowerCase();

      const result =
        ext === 'ics'
          ? await importIcsWorkouts(content)
          : await importCsvWorkouts(content);

      Alert.alert('Success', `Imported ${result.count} workouts.`);
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert('Import Failed', 'Please check your file format.');
    } finally {
      setIsImporting(false);
    }
  };

  const renderEmptyState = (
    <TouchableOpacity
      onPress={pickFile}
      className="flex-1 items-center justify-center border border-dashed"
      style={{
        backgroundColor: theme.glass,
        borderRadius: Layout.borderRadius.card,
        borderColor: theme.border,
      }}
    >
      <UploadCloud size={32} color={theme.accent} />
      <Text
        className="mt-2 text-lg font-semibold"
        style={{ color: theme.text }}
      >
        tap to browse
      </Text>
      <Text className="text-sm" style={{ color: theme.textSecondary }}>
        supports .ics, .csv
      </Text>
    </TouchableOpacity>
  );

  const renderFileState = file && (
    <View className="flex-1 justify-center">
      <View
        className="mb-6 flex-row items-center border p-4"
        style={{
          backgroundColor: theme.surface,
          borderRadius: Layout.borderRadius.card,
          borderColor: theme.border,
        }}
      >
        <View
          className="mr-4 rounded-lg bg-gray-100 p-3"
          style={{ backgroundColor: theme.border }}
        >
          <FileJson size={24} color={theme.text} />
        </View>
        <View className="flex-1">
          <Text
            className="mb-0.5 font-semibold"
            numberOfLines={1}
            style={{ color: theme.text }}
          >
            {file.name}
          </Text>
          <Text className="text-xs" style={{ color: theme.textSecondary }}>
            {(file.size ? file.size / 1024 : 0).toFixed(1)} KB
          </Text>
        </View>
        <TouchableOpacity onPress={() => setFile(null)} className="p-2">
          <X size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={pickFile} className="mb-8 items-center">
        <Text className="font-medium" style={{ color: theme.accent }}>
          choose a different file
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <ModalHeader theme={theme} title="import workouts" />

      <View className="flex-1 justify-center p-5">
        {file ? renderFileState : renderEmptyState}
      </View>

      <View className="px-5 pb-12 pt-0">
        <ActionButton
          theme={theme}
          label={isImporting ? 'importing...' : 'import workouts'}
          onPress={handleImport}
          disabled={!file || isImporting}
        />
      </View>
    </View>
  );
}
