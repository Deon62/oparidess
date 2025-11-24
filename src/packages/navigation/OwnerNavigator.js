import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';

// Owner screens
import OwnerHomeScreen from '../../screens/owner/OwnerHomeScreen';
import MyCarsScreen from '../../screens/owner/MyCarsScreen';
import AddCarScreen from '../../screens/owner/AddCarScreen';
import EditCarScreen from '../../screens/owner/EditCarScreen';
import OwnerBookingsScreen from '../../screens/owner/OwnerBookingsScreen';
import OwnerProfileScreen from '../../screens/owner/OwnerProfileScreen';

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
        component={OwnerHomeScreen}
        options={{ 
          title: 'Dashboard',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="MyCars" 
        component={MyCarsScreen}
        options={{ 
          title: 'My Cars',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="AddCar" 
        component={AddCarScreen}
        options={{ 
          title: 'Add Car',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="EditCar" 
        component={EditCarScreen}
        options={{ 
          title: 'Edit Car',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="OwnerBookings" 
        component={OwnerBookingsScreen}
        options={{ 
          title: 'Bookings',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="OwnerProfile" 
        component={OwnerProfileScreen}
        options={{ 
          title: 'Profile',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
};

export default OwnerNavigator;

