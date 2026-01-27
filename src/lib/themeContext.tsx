import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colours } from '@/src/constants/theme';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: typeof Colours.light;
  accent: string;
  updateAccent: (color: string) => Promise<void>;
  mode: ThemeMode;
  updateMode: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: Colours.light,
  accent: Colours.light.accent,
  updateAccent: async () => {},
  mode: 'system',
  updateMode: async () => {},
});

const KEY_ACCENT = 'user_theme_accent';
const KEY_MODE = 'user_theme_mode';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const baseTheme = Colours[colorScheme ?? 'light'];

  const [accent, setAccent] = useState(baseTheme.accent);
  const [mode, setMode] = useState<ThemeMode>('system');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedAccent = await AsyncStorage.getItem(KEY_ACCENT);
        if (savedAccent) setAccent(savedAccent);
        const savedMode = await AsyncStorage.getItem(KEY_MODE);
        if (savedMode) {
          setMode(savedMode as ThemeMode);
          setColorScheme(savedMode as any); // Force NativeWind to update
        }
      } catch (e) {
        console.warn('Failed to load theme settings', e);
      }
    };
    loadSettings();
  }, [setColorScheme]);

  const updateAccent = async (newColor: string) => {
    setAccent(newColor);
    await AsyncStorage.setItem(KEY_ACCENT, newColor);
  };

  const updateMode = async (newMode: ThemeMode) => {
    setMode(newMode);
    setColorScheme(newMode as any);
    await AsyncStorage.setItem(KEY_MODE, newMode);
  };

  const activeTheme = {
    ...baseTheme,
    accent: accent,
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        accent,
        updateAccent,
        mode,
        updateMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
