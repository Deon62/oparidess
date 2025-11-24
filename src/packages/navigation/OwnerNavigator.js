import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';

// Shared screens
import ComingSoonScreen from '../../screens/shared/ComingSoonScreen';

const Stack = createNativeStackNavigator();

const OwnerNavigator = () => {
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
        name="OwnerHome" 
        component={ComingSoonScreen}
        options={{ 
          title: 'Coming Soon',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
};

export default OwnerNavigator;

