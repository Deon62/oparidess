import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';

// Shared authentication screens
import LandingScreen from '../../screens/shared/LandingScreen';
import OnboardingScreen from '../../screens/renter/OnboardingScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontFamily: 'Nunito_600SemiBold',
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        animation: 'none',
        gestureEnabled: false,
        headerBackTitleVisible: false,
        statusBarStyle: 'dark',
        statusBarBackgroundColor: theme.colors.background,
      }}
    >
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen}
        options={{ 
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="Landing" 
        component={LandingScreen}
        options={{ 
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

