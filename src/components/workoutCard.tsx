import React from 'react';
import { format, parseISO } from 'date-fns';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPin, ChevronRight, Calendar } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { RunType } from '../lib/types';

interface WorkoutCardProps {
  title: string;
  date: string;
  distance: string;
  type: RunType;
  onPress?: () => void;
}

const WorkoutCard = ({ title, date, distance, type = 'Easy', onPress }: WorkoutCardProps) => {
  // 1. Hook into the system theme
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // 2. Define Dynamic Colors for JS props
  // Dark Mode: Pure White | Light Mode: Deep Zinc (Almost Black)
  const accentColor = isDark ? '#FFFFFF' : '#18181B';

  // Dark Mode: Zinc-400 | Light Mode: Zinc-500
  const iconColor = isDark ? '#A1A1AA' : '#71717A';
  const chevronColor = isDark ? '#52525B' : '#D4D4D8';

  return (
    <TouchableOpacity
      // BG: White (Light) vs Zinc-900 (Dark)
      // Border: Zinc-200 (Light) vs White/10 (Dark)
      className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-white/10 rounded-2xl flex-row items-center overflow-hidden pr-4 shadow-sm shadow-black/5"
      onPress={onPress}
    >
      {/* Left Strip: Adapts via JS variable */}
      <View className="w-1.5 h-full mr-3 opacity-90" style={{ backgroundColor: accentColor }} />

      <View className="flex-1 py-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-2 px-2">
          {/* Title: Black (Light) vs White (Dark) */}
          <Text className="text-zinc-900 dark:text-white text-lg font-bold tracking-wide">
            {title}
          </Text>

          {/* Badge: Zinc-100 (Light) vs White/10 (Dark) */}
          <View className="bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/5 px-2 py-0.5 rounded overflow-hidden">
            <Text
              className="text-[10px] font-extrabold tracking-widest uppercase"
              style={{ color: accentColor }}
            >
              {type}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View className="flex-row justify-between items-center px-2">
          {date && (
            <View className="flex-row items-center gap-1.5 opacity-80">
              <Calendar size={16} color={iconColor} />
              <Text className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                {format(parseISO(date), 'dd MMMM yyyy')}
              </Text>
            </View>
          )}

          <View className="flex-row items-center gap-1.5 opacity-80">
            <MapPin size={16} color={iconColor} />
            {/* Secondary Text: Zinc-500 (Light) vs Zinc-400 (Dark) */}
            <Text className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{distance}</Text>
          </View>
        </View>
      </View>

      <ChevronRight color={chevronColor} size={20} className="opacity-50" />
    </TouchableOpacity>
  );
};

export default WorkoutCard;
