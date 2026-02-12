import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { getWeeklyProgress } from '@/src/db/queries';
import { Layout } from '../constants/theme';

interface WeeklyProgressCardProps {
  theme: any;
}

const WeeklyProgressCard = ({ theme }: WeeklyProgressCardProps) => {
  const router = useRouter();
  const [stats, setStats] = useState({ run: 0, goal: 0 });

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      getWeeklyProgress().then((data) => {
        if (isActive) {
          setStats(data);
        }
      });
      return () => {
        isActive = false;
      };
    }, [])
  );

  const percentage = stats.goal > 0 ? Math.min(stats.run / stats.goal, 1) : 0;

  const addAlpha = (color: string, opacity: number) => {
    if (!color.startsWith('#')) return color;
    const _opacity = Math.round(Math.min(Math.max(opacity, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase().padStart(2, '0');
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        requestAnimationFrame(() => {
          router.push({
            pathname: '/schedule',
            params: { viewMode: 'list' },
          });
        });
      }}
      className="w-full overflow-hidden border"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
        borderRadius: Layout.borderRadius.card,
      }}
    >
      <View className="p-4">
        <View className="flex-row items-baseline justify-between">
          <View className="flex-row items-baseline">
            <Text
              className="text-4xl font-extrabold tracking-tighter"
              style={{
                color: theme.text,
              }}
            >
              {stats.run.toFixed(1)}
            </Text>
            <Text
              className="ml-1 text-lg font-medium"
              style={{ color: theme.textSecondary }}
            >
              km
            </Text>
          </View>

          <View className="items-end">
            <Text
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: theme.textSecondary }}
            >
              Goal
            </Text>
            <Text className="text-lg font-bold" style={{ color: theme.text }}>
              {stats.goal.toFixed(1)}{' '}
              <Text
                className="text-sm font-normal"
                style={{ color: theme.textSecondary }}
              >
                km
              </Text>
            </Text>
          </View>
        </View>

        <View className="mt-4">
          <View
            className="h-3 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: theme.border }}
          >
            <View style={{ width: `${percentage * 100}%`, height: '100%' }}>
              <LinearGradient
                colors={[theme.accent, addAlpha(theme.accent, 0.6)]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={{ flex: 1, borderRadius: 99 }}
              />
            </View>
          </View>

          <View className="mt-1 flex-row justify-end">
            <Text
              className="text-xs font-bold"
              style={{ color: theme.textSecondary }}
            >
              {Math.round(percentage * 100)}% COMPLETE
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WeeklyProgressCard;
