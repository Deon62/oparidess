import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';

// Driver screens
import DriverHomeScreen from '../../screens/driver/DriverHomeScreen';
import AvailableRidesScreen from '../../screens/driver/AvailableRidesScreen';
import ActiveRideScreen from '../../screens/driver/ActiveRideScreen';
import DriverHistoryScreen from '../../screens/driver/DriverHistoryScreen';
import DriverProfileScreen from '../../screens/driver/DriverProfileScreen';

const Stack = createNativeStackNavigator();

const DriverNavigator = () => {
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
        name="DriverHome" 
        component={DriverHomeScreen}
        options={{ 
          title: 'Home',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="AvailableRides" 
        component={AvailableRidesScreen}
        options={{ 
          title: 'Available Rides',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="ActiveRide" 
        component={ActiveRideScreen}
        options={{ 
          title: 'Active Ride',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="DriverHistory" 
        component={DriverHistoryScreen}
        options={{ 
          title: 'Ride History',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="DriverProfile" 
        component={DriverProfileScreen}
        options={{ 
          title: 'Profile',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
};

export default DriverNavigator;

