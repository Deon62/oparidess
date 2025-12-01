import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';

import { ThemeProvider, useTheme } from './src/packages/theme/ThemeProvider';
import { UserProvider } from './src/packages/context/UserContext';
import { WishlistProvider } from './src/packages/context/WishlistContext';
import MainNavigator from './src/packages/navigation/MainNavigator';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const AppContent = () => {
  const theme = useTheme();

  return (
    <UserProvider>
      <WishlistProvider>
        <NavigationContainer
          theme={{
            dark: false,
            colors: {
              primary: theme.colors.primary,
              background: theme.colors.background,
              card: theme.colors.background,
              text: theme.colors.textPrimary,
              border: 'transparent',
              notification: theme.colors.primary,
            },
          }}
        >
          <StatusBar style="dark" />
          <MainNavigator />
        </NavigationContainer>
      </WishlistProvider>
    </UserProvider>
  );
}

