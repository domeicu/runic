import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { UploadCloud, FileJson, X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { importCsvWorkouts, importIcsWorkouts } from '@/src/db/client';
import { Colours, Layout } from '@/src/constants/theme';
import ActionButton from '@/src/components/actionButton';
import ModalHeader from '@/src/components/modalHeader';

export default function ImportWorkout() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];

  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null
  );

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/calendar', 'text/csv'],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      if (result.assets[0].size && result.assets[0].size > 20 * 1024 * 1024) {
        Alert.alert('File too large', 'Please select a file under 20MB.');
        return;
      }
      setFile(result.assets[0]);
    } catch {
      Alert.alert('Error', 'Could not pick file.');
    }
  };

  const handleImport = async () => {
    if (!file) return;
    try {
      const response = await fetch(file.uri);
      const fileContent = await response.text();
      const res =
        file.name.split('.').pop()?.toLowerCase() === 'ics'
          ? await importIcsWorkouts(fileContent)
          : await importCsvWorkouts(fileContent);
      Alert.alert('Success', `Successfully imported ${res.count} workouts.`);
      router.back();
    } catch {
      Alert.alert('Failure', 'Workouts importing failed.');
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <ModalHeader theme={theme} title="import workouts" />
      <View className="flex-1 justify-center p-5">
        {!file ? (
          /* NO FILE SELECTED */
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
        ) : (
          /* FILE SELECTED */
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
                className="mr-4 p-3"
                style={{
                  backgroundColor: theme.border,
                  borderRadius: Layout.borderRadius.small,
                }}
              >
                <FileJson size={24} color={theme.text} />
              </View>

              <View className="flex-1">
                <Text
                  className="mb-0.5 text-base font-semibold"
                  numberOfLines={1}
                  style={{ color: theme.text }}
                >
                  {file.name}
                </Text>
                <Text
                  className="text-xs"
                  style={{ color: theme.textSecondary }}
                >
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
        )}
      </View>

      <View className="px-5 pb-12 pt-0">
        <ActionButton
          theme={theme}
          label="import workouts"
          onPress={handleImport}
          disabled={!file}
        />
      </View>
    </View>
  );
}
