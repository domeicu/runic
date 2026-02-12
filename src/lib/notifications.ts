import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { isBefore, set, isValid } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '@/src/db/client';
import { Workout } from '@/src/types/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const setupNotifications = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
};

export const getNotificationPreferences = async () => {
  const enabled = await AsyncStorage.getItem('notifications_enabled');
  const time = await AsyncStorage.getItem('notification_time');

  const timeDate = time
    ? new Date(time)
    : new Date(new Date().setHours(6, 0, 0, 0));

  return {
    enabled: enabled === null ? true : enabled === 'true',
    time: timeDate,
  };
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const scheduleRunReminder = async (
  workoutId: number | string,
  workoutDate: Date | string,
  distance: number,
  type: string,
  reminderTime: { hour: number; minute: number }
) => {
  const date = new Date(workoutDate);
  if (!isValid(date)) return;

  const triggerDate = set(date, {
    hours: reminderTime.hour,
    minutes: reminderTime.minute,
    seconds: 0,
  });

  if (isBefore(triggerDate, new Date())) return;

  const notificationId = String(workoutId);

  await Notifications.cancelScheduledNotificationAsync(notificationId);
  await Notifications.scheduleNotificationAsync({
    identifier: notificationId,
    content: {
      title: 'Run day!',
      body: `You have a ${distance}km ${type} scheduled today.`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      year: triggerDate.getFullYear(),
      month: triggerDate.getMonth() + 1,
      day: triggerDate.getDate(),
      hour: triggerDate.getHours(),
      minute: triggerDate.getMinutes(),
    },
  });

  return notificationId;
};

export const syncNotifications = async (workout?: Workout) => {
  const { enabled, time } = await getNotificationPreferences();
  if (!enabled) {
    return;
  }
  const reminderTime = { hour: time.getHours(), minute: time.getMinutes() };

  if (workout) {
    await Notifications.cancelScheduledNotificationAsync(String(workout.id));
    await scheduleRunReminder(
      workout.id,
      workout.date,
      workout.distanceKm,
      workout.type,
      reminderTime
    );
    console.log(`Synced single notification for ID: ${workout.id}`);
    return;
  }

  const allWorkouts = await db.query.workouts.findMany();
  const futureRuns = allWorkouts.filter((w) => new Date(w.date) > new Date());

  await Notifications.cancelAllScheduledNotificationsAsync();
  for (const run of futureRuns) {
    await scheduleRunReminder(
      run.id,
      run.date,
      run.distanceKm,
      run.type,
      reminderTime
    );
  }

  console.log(`Full Sync: Scheduled ${futureRuns.length} reminders`);
};
