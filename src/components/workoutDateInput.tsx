import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import { Layout } from '@/constants/theme';

interface DateInputProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  theme: any;
}

const WorkoutDateInput = ({ label, value, onChange, theme }: DateInputProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const handleChange = (event: any, selectedDate?: Date) => {
    // On Android, the picker closes automatically after selection
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const confirmIOS = () => {
    setShowPicker(false);
  };

  return (
    <View className="mb-5">
      <Text className="mb-2 font-medium" style={{ color: theme.textSecondary }}>
        {label}
      </Text>

      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderRadius: Layout.borderRadius.card,
        }}
        className="h-14 px-4 border flex-row items-center justify-between"
        activeOpacity={0.7}
      >
        <Text className="text-lg" style={{ color: theme.text }}>
          {format(value, 'd MMM yyyy')}
        </Text>
        <CalendarIcon size={20} color={theme.textSecondary} />
      </TouchableOpacity>

      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker value={value} mode="date" display="default" onChange={handleChange} />
      )}

      {Platform.OS === 'ios' && (
        <Modal transparent visible={showPicker} animationType="fade">
          <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
            <View className="flex-1 justify-end bg-black/40">
              <TouchableWithoutFeedback>
                <View
                  className="pb-8 rounded-t-3xl overflow-hidden"
                  style={{ backgroundColor: theme.surface }}
                >
                  <View
                    className="flex-row justify-end p-4 border-b"
                    style={{ borderColor: theme.border }}
                  >
                    <TouchableOpacity onPress={confirmIOS}>
                      <Text className="text-lg font-bold" style={{ color: theme.accent }}>
                        Done
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <DateTimePicker
                    value={value}
                    mode="date"
                    display="spinner"
                    onChange={handleChange}
                    textColor={theme.text}
                    themeVariant={theme.background === '#000000' ? 'dark' : 'light'} // Force dark/light mode
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

export default WorkoutDateInput;
