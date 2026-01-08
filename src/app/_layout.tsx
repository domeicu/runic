import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Colours } from '@/constants/theme';
import './globals.css';

const RootLayout = () => {
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'dark'];

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
          options={{ headerShown: false, presentation: 'modal', title: 'add workout' }}
        />
        <Stack.Screen
          name="workout/import"
          options={{ headerShown: false, presentation: 'modal', title: 'import workout' }}
        />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="settings" />
      </Stack>
    </SafeAreaProvider>
  );
};

export default RootLayout;
