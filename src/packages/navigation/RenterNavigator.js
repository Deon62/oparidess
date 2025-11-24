import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';

// Renter screens
import RenterHomeScreen from '../../screens/renter/RenterHomeScreen';
import CarListScreen from '../../screens/renter/CarListScreen';
import CarDetailsScreen from '../../screens/renter/CarDetailsScreen';
import BookingScreen from '../../screens/renter/BookingScreen';
import RenterProfileScreen from '../../screens/renter/RenterProfileScreen';

const Stack = createNativeStackNavigator();

const RenterNavigator = () => {
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
        name="RenterHome" 
        component={RenterHomeScreen}
        options={{ 
          title: 'Home',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="CarList" 
        component={CarListScreen}
        options={{ 
          title: 'Available Cars',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="CarDetails" 
        component={CarDetailsScreen}
        options={{ 
          title: 'Car Details',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen}
        options={{ 
          title: 'Book Car',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="RenterProfile" 
        component={RenterProfileScreen}
        options={{ 
          title: 'Profile',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
};

export default RenterNavigator;

