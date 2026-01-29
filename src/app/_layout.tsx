import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen, Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';

import { Colours } from '../constants/theme';
import { setupNotifications, syncNotifications } from '../lib/notifications';
import { ThemeProvider, useTheme } from '../lib/themeContext';
import { useDatabaseInit } from '../db/client';

import './globals.css';

const RootNavigation = () => {
  const { theme } = useTheme();

  useEffect(() => {
    const init = async () => {
      const hasPermission = await setupNotifications();
      if (hasPermission) {
        console.log('Notification permissions granted');
        await syncNotifications();
      } else {
        console.log('Notification permissions denied');
      }
    };
    init();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: '600', color: theme.text },
        headerShadowVisible: true,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="workout/form"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="workout/import"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="workout/[id]"
        options={{
          title: 'workout details',
        }}
      />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="settings" />
    </Stack>
  );
};

const RootLayout = () => {
  const { colorScheme } = useColorScheme();
  const staticTheme = Colours[colorScheme ?? 'light'];

  const { isLoaded, error } = useDatabaseInit();

  useEffect(() => {
    if (isLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded, error]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: staticTheme.text }}>
          Database Load Error: {error.message}
        </Text>
      </View>
    );
  }

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={staticTheme.text} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
