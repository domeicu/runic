import React from 'react';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPin, ChevronRight, Calendar, Check } from 'lucide-react-native';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';

import { Workout } from '@/src/types/types';
import { Layout } from '@/src/constants/theme';

const WorkoutCard = ({ theme, item }: { theme: any; item: Workout }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={() => router.push(`/workout/${item.id}`)}
    onLongPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      router.push({
        pathname: '/workout/form',
        params: { id: item.id },
      });
    }}
    className="flex-row items-center overflow-hidden pr-4 shadow-sm shadow-black/5"
    style={{
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: Layout.borderRadius.card,
      opacity: item.isCompleted ? 0.6 : 1,
    }}
  >
    <View
      className="mr-3 h-full w-1.5 opacity-90"
      style={
        item.isCompleted
          ? { backgroundColor: theme.border }
          : { backgroundColor: theme.accent }
      }
    />
    <View className="flex-1 py-4">
      <View className="flex-row items-center justify-between px-2">
        <Text
          className="text-lg font-bold tracking-wide"
          style={
            item.isCompleted
              ? {
                  color: theme.textSecondary,
                  textDecorationLine: 'line-through',
                }
              : { color: theme.text }
          }
        >
          {item.title}
        </Text>

        <View
          className="overflow-hidden border px-2 py-0.5"
          style={{
            backgroundColor: theme.border,
            borderColor: theme.border,
            borderRadius: Layout.borderRadius.small,
          }}
        >
          <Text
            className="text-[10px] font-extrabold uppercase tracking-widest"
            style={
              item.isCompleted
                ? { color: theme.border }
                : { color: theme.accent }
            }
          >
            {item.type}
          </Text>
        </View>
      </View>

      <View className="mb-2 px-2">
        <Text
          className="text-sm font-medium"
          style={{ color: theme.textSecondary }}
        >
          {item.description}
        </Text>
      </View>

      <View className="flex-row items-center justify-between px-2">
        {item.date && (
          <View className="flex-row items-center gap-1.5 opacity-80">
            <Calendar size={16} color={theme.textSecondary} />
            <Text
              className="text-sm font-medium"
              style={{ color: theme.textSecondary }}
            >
              {format(item.date, 'dd MMM')}
            </Text>
          </View>
        )}

        <View className="flex-row items-center gap-1.5 opacity-80">
          <MapPin size={16} color={theme.textSecondary} />
          <Text
            className="text-sm font-medium"
            style={{ color: theme.textSecondary }}
          >
            {item.distanceKm} km
          </Text>
        </View>
      </View>
    </View>

    {item.isCompleted ? (
      <Check color={theme.textSecondary} size={20} className="opacity-30" />
    ) : (
      <ChevronRight
        color={theme.textSecondary}
        size={20}
        className="opacity-30"
      />
    )}
  </TouchableOpacity>
);

export default WorkoutCard;
