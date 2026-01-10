import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen, Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Colours } from '@/src/constants/theme';
import { useDatabaseInit } from '../db/client';
import './globals.css';

const RootLayout = () => {
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];

  const { isLoaded, error } = useDatabaseInit();

  useEffect(() => {
    if (isLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded, error]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.text }}>
          Database Load Error: {error.message}
        </Text>
      </View>
    );
  }

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={theme.text} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: true,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="workout/add"
          options={{
            headerShown: false,
            presentation: 'modal',
            title: 'add workout',
          }}
        />
        <Stack.Screen
          name="workout/import"
          options={{
            headerShown: false,
            presentation: 'modal',
            title: 'import workout',
          }}
        />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="settings" />
      </Stack>
    </SafeAreaProvider>
  );
};

export default RootLayout;
