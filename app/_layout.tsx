import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';
import { TodoProvider } from '@/context/TodoContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsAuthenticated(!!token);
      } finally {
        setIsLoading(false);
        SplashScreen.hideAsync();
      }
    };

    if (loaded) {
      checkAuth();
    }
  }, [loaded]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/LoginScreen');
      }
    }
  }, [isAuthenticated, isLoading]);

  if (!loaded || isLoading) {
    return null; // Optionally return a custom loading/splash screen
  }

  return (
    <TodoProvider>
      <ThemeProvider
        value={colorScheme === 'dark' ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            primary: '#FFCC00',
            background: '#2E2E2E',
            card: '#373737',
            text: '#FFCC00',
            border: '#4A4A4A',
          },
        } : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: '#FFCC00',
            background: '#F5F5F5',
            card: '#FFFFFF',
            text: '#000000',
            border: '#DDDDDD',
          },
        }}
      >
        <Stack>
          <Stack.Screen name="auth/LoginScreen" options={{ headerShown: false }} />
          <Stack.Screen name="auth/RegisterScreen" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="todo/[id]" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </TodoProvider>
  );
}
