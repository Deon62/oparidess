import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';

// Shared authentication screens
import LandingScreen from '../../screens/shared/LandingScreen';
import LoginScreen from '../../screens/shared/LoginScreen';
import SignupScreen from '../../screens/shared/SignupScreen';
import ResetPasswordScreen from '../../screens/shared/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
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
      }}
    >
      <Stack.Screen 
        name="Landing" 
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ 
          title: 'Login',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{ 
          title: 'Sign Up',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="ResetPassword" 
        component={ResetPasswordScreen}
        options={{ 
          title: 'Reset Password',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

