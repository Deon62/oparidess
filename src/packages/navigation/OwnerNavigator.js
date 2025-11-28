import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

// Owner screens
import OwnerHomeScreen from '../../screens/owner/OwnerHomeScreen';
import OwnerBookingsScreen from '../../screens/owner/OwnerBookingsScreen';
import OwnerCarsScreen from '../../screens/owner/OwnerCarsScreen';
import OwnerFinancesScreen from '../../screens/owner/OwnerFinancesScreen';
import OwnerSettingsScreen from '../../screens/owner/OwnerSettingsScreen';
import OwnerProfileScreen from '../../screens/owner/OwnerProfileScreen';
import UploadIdDocumentScreen from '../../screens/owner/UploadIdDocumentScreen';
import UploadBusinessDocumentScreen from '../../screens/owner/UploadBusinessDocumentScreen';
import AddCarScreen from '../../screens/owner/AddCarScreen';
import OwnerBookingDetailsScreen from '../../screens/owner/OwnerBookingDetailsScreen';
import OwnerWithdrawRequestScreen from '../../screens/owner/OwnerWithdrawRequestScreen';
import OwnerAddPaymentScreen from '../../screens/owner/OwnerAddPaymentScreen';

// Shared screens
import MessagesScreen from '../../screens/shared/MessagesScreen';
import NotificationsScreen from '../../screens/shared/NotificationsScreen';
import LanguageScreen from '../../screens/shared/LanguageScreen';
import NotificationPreferencesScreen from '../../screens/shared/NotificationPreferencesScreen';
import PrivacyScreen from '../../screens/shared/PrivacyScreen';
import AboutScreen from '../../screens/shared/AboutScreen';
import CustomerSupportScreen from '../../screens/shared/CustomerSupportScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack Navigator
const HomeStack = () => {
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
          title: 'Home',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ 
          title: 'Notifications',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="Messages" 
        component={MessagesScreen}
        options={{ 
          title: 'Messages',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="OwnerProfile" 
        component={OwnerProfileScreen}
        options={{ 
          title: 'My Profile',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="UploadIdDocument" 
        component={UploadIdDocumentScreen}
        options={{ 
          title: 'Upload ID Document',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="UploadBusinessDocument" 
        component={UploadBusinessDocumentScreen}
        options={{ 
          title: 'Upload Business Document',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
};

// Bookings Stack Navigator
const BookingsStack = () => {
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
        name="OwnerBookings" 
        component={OwnerBookingsScreen}
        options={{ 
          title: 'Bookings',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ 
          title: 'Notifications',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="Messages" 
        component={MessagesScreen}
        options={{ 
          title: 'Messages',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="OwnerProfile" 
        component={OwnerProfileScreen}
        options={{ 
          title: 'My Profile',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="UploadIdDocument" 
        component={UploadIdDocumentScreen}
        options={{ 
          title: 'Upload ID Document',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="UploadBusinessDocument" 
        component={UploadBusinessDocumentScreen}
        options={{ 
          title: 'Upload Business Document',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="OwnerBookingDetails" 
        component={OwnerBookingDetailsScreen}
        options={{ 
          title: 'Booking Details',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
};

// Cars Stack Navigator
const CarsStack = () => {
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
        name="OwnerCars" 
        component={OwnerCarsScreen}
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
    </Stack.Navigator>
  );
};

// Finances Stack Navigator
const FinancesStack = () => {
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
        name="OwnerFinances" 
        component={OwnerFinancesScreen}
        options={{ 
          title: 'Finances',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="WithdrawRequest" 
        component={OwnerWithdrawRequestScreen}
        options={{ 
          title: 'Withdraw Funds',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="AddPaymentMethod" 
        component={OwnerAddPaymentScreen}
        options={{ 
          title: 'Add Payment Method',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
};

// Settings Stack Navigator
const SettingsStack = () => {
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
        name="OwnerSettings" 
        component={OwnerSettingsScreen}
        options={{ 
          title: 'Settings',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ 
          title: 'Notifications',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="Language" 
        component={LanguageScreen}
        options={{ 
          title: 'Select Language',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="NotificationPreferences" 
        component={NotificationPreferencesScreen}
        options={{ 
          title: 'Notification Preferences',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="Privacy" 
        component={PrivacyScreen}
        options={{ 
          title: 'Privacy',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen}
        options={{ 
          title: 'About',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="CustomerSupport" 
        component={CustomerSupportScreen}
        options={{ 
          title: 'Customer Support',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="OwnerProfile" 
        component={OwnerProfileScreen}
        options={{ 
          title: 'My Profile',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="UploadIdDocument" 
        component={UploadIdDocumentScreen}
        options={{ 
          title: 'Upload ID Document',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="UploadBusinessDocument" 
        component={UploadBusinessDocumentScreen}
        options={{ 
          title: 'Upload Business Document',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
};

const OwnerNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'help-outline'; // Default icon

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'BookingsTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'CarsTab') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'FinancesTab') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.hint,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack}
        options={{ 
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="BookingsTab" 
        component={BookingsStack}
        options={{ 
          title: 'Bookings',
          tabBarLabel: 'Bookings',
        }}
      />
      <Tab.Screen 
        name="CarsTab" 
        component={CarsStack}
        options={{ 
          title: 'Cars',
          tabBarLabel: 'Cars',
        }}
      />
      <Tab.Screen 
        name="FinancesTab" 
        component={FinancesStack}
        options={{ 
          title: 'Finances',
          tabBarLabel: 'Finances',
        }}
      />
      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsStack}
        options={{ 
          title: 'Settings',
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export default OwnerNavigator;
