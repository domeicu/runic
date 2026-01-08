import React from 'react';
import { format, parseISO } from 'date-fns';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPin, ChevronRight, Calendar } from 'lucide-react-native';
import { RunType } from '../lib/types';
import { Layout } from '@/src/constants/theme';

interface WorkoutCardProps {
  theme: any;
  date: string;
  title: string;
  description: string;
  distance: string;
  type: RunType;
  onPress?: () => void;
}

const WorkoutCard = ({
  theme,
  date,
  title,
  description,
  distance,
  type,
  onPress,
}: WorkoutCardProps) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    className="flex-row items-center overflow-hidden pr-4 shadow-sm shadow-black/5"
    style={{
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: Layout.borderRadius.card,
    }}
  >
    {/* Left Strip: Using theme accent (Neon in dark, Weighted in light) */}
    <View className="w-1.5 h-full mr-3 opacity-90" style={{ backgroundColor: theme.accent }} />

    <View className="flex-1 py-4">
      {/* Header */}
      <View className="flex-row justify-between items-center px-2">
        <Text className="text-lg font-bold tracking-wide" style={{ color: theme.text }}>
          {title}
        </Text>

        {/* Badge */}
        <View
          className="px-2 py-0.5 border overflow-hidden"
          style={{
            backgroundColor: theme.border,
            borderColor: theme.border,
            borderRadius: Layout.borderRadius.small,
          }}
        >
          <Text
            className="text-[10px] font-extrabold tracking-widest uppercase"
            style={{ color: theme.accent }}
          >
            {type}
          </Text>
        </View>
      </View>

      <View className="mb-2 px-2">
        <Text className="text-sm font-medium" style={{ color: theme.textSecondary }}>
          {description}
        </Text>
      </View>

      {/* Stats Row */}
      <View className="flex-row justify-between items-center px-2">
        {date && (
          <View className="flex-row items-center gap-1.5 opacity-80">
            <Calendar size={16} color={theme.textSecondary} />
            <Text className="text-sm font-medium" style={{ color: theme.textSecondary }}>
              {format(parseISO(date), 'dd MMM')}
            </Text>
          </View>
        )}

        <View className="flex-row items-center gap-1.5 opacity-80">
          <MapPin size={16} color={theme.textSecondary} />
          <Text className="text-sm font-medium" style={{ color: theme.textSecondary }}>
            {distance}
          </Text>
        </View>
      </View>
    </View>

    <ChevronRight color={theme.textSecondary} size={20} className="opacity-30" />
  </TouchableOpacity>
);

export default WorkoutCard;
