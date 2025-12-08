import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Nunito_300Light, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import NetInfo from '@react-native-community/netinfo';

import { ThemeProvider, useTheme } from './src/packages/theme/ThemeProvider';
import { UserProvider } from './src/packages/context/UserContext';
import { WishlistProvider } from './src/packages/context/WishlistContext';
import { BookingsProvider } from './src/packages/context/BookingsContext';
import MainNavigator from './src/packages/navigation/MainNavigator';
import OfflineScreen from './src/screens/shared/OfflineScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_300Light,
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
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Check initial network state
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    // Also check immediately
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Show offline screen when disconnected
  if (!isConnected) {
    return <OfflineScreen />;
  }

  return (
    <UserProvider>
      <WishlistProvider>
        <BookingsProvider>
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
        </BookingsProvider>
      </WishlistProvider>
    </UserProvider>
  );
}

