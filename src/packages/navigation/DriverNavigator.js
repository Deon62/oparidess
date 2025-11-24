import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

// Driver screens
import DriverHomeScreen from '../../screens/driver/DriverHomeScreen';
import AvailableRidesScreen from '../../screens/driver/AvailableRidesScreen';
import ActiveRideScreen from '../../screens/driver/ActiveRideScreen';
import DriverHistoryScreen from '../../screens/driver/DriverHistoryScreen';
import DriverProfileScreen from '../../screens/driver/DriverProfileScreen';
import DriverFinancesScreen from '../../screens/driver/DriverFinancesScreen';
import DriverSettingsScreen from '../../screens/driver/DriverSettingsScreen';
import UpdateProfileScreen from '../../screens/renter/UpdateProfileScreen';
import UploadIdDocumentScreen from '../../screens/driver/UploadIdDocumentScreen';
import UploadDrivingLicenseScreen from '../../screens/driver/UploadDrivingLicenseScreen';
import DriverBookingDetailsScreen from '../../screens/driver/DriverBookingDetailsScreen';
import WithdrawRequestScreen from '../../screens/driver/WithdrawRequestScreen';
import DriverAddPaymentScreen from '../../screens/driver/DriverAddPaymentScreen';

// Shared screens
import MessagesScreen from '../../screens/shared/MessagesScreen';
import ChatScreen from '../../screens/shared/ChatScreen';
import LanguageScreen from '../../screens/shared/LanguageScreen';
import NotificationPreferencesScreen from '../../screens/shared/NotificationPreferencesScreen';
import PrivacyScreen from '../../screens/shared/PrivacyScreen';
import AboutScreen from '../../screens/shared/AboutScreen';
import NotificationsScreen from '../../screens/shared/NotificationsScreen';
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
        name="DriverBookingDetails" 
        component={DriverBookingDetailsScreen}
        options={{ 
          title: 'Booking Details',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
};

// Rides Stack Navigator
const RidesStack = () => {
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
        name="DriverHistory" 
        component={DriverHistoryScreen}
        options={{ 
          title: 'Rides',
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
        name="AvailableRides" 
        component={AvailableRidesScreen}
        options={{ 
          title: 'Available Rides',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="DriverBookingDetails" 
        component={DriverBookingDetailsScreen}
        options={{ 
          title: 'Booking Details',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
};

// Messages Stack Navigator
const MessagesStack = () => {
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
        name="Messages" 
        component={MessagesScreen}
        options={{ 
          title: 'Messages',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={({ route }) => ({ 
          title: route.params?.userName || 'Chat',
          headerShown: true 
        })}
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
        name="DriverFinances" 
        component={DriverFinancesScreen}
        options={{ 
          title: 'Finances',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="WithdrawRequest" 
        component={WithdrawRequestScreen}
        options={{ 
          title: 'Withdraw Funds',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="AddPaymentMethod" 
        component={DriverAddPaymentScreen}
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
        name="Settings" 
        component={DriverSettingsScreen}
        options={{ 
          title: 'Settings',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="DriverProfile" 
        component={DriverProfileScreen}
        options={{ 
          title: 'My Profile',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="UpdateProfile" 
        component={UpdateProfileScreen}
        options={{ 
          title: 'Edit Profile',
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
        name="NotificationPreferences" 
        component={NotificationPreferencesScreen}
        options={{ 
          title: 'Notification Preferences',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="Language" 
        component={LanguageScreen}
        options={{ 
          title: 'Language',
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
        name="Privacy" 
        component={PrivacyScreen}
        options={{ 
          title: 'Privacy Policy',
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
        name="UploadIdDocument" 
        component={UploadIdDocumentScreen}
        options={{ 
          title: 'Upload ID Document',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="UploadDrivingLicense" 
        component={UploadDrivingLicenseScreen}
        options={{ 
          title: 'Upload Driving License',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
};

const DriverNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'help-outline'; // Default icon

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'RidesTab') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'MessagesTab') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'FinancesTab') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'SettingsTab') {
            // SettingsTab icon is handled in its own options to prevent highlighting when on Notifications
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
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'DriverHome';
          return {
            title: 'Home',
            tabBarLabel: 'Home',
            tabBarStyle: routeName === 'ActiveRide' ? { display: 'none' } : undefined,
          };
        }}
      />
      <Tab.Screen 
        name="RidesTab" 
        component={RidesStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'DriverHistory';
          return {
            title: 'Rides',
            tabBarLabel: 'Rides',
            tabBarStyle: routeName === 'ActiveRide' ? { display: 'none' } : undefined,
          };
        }}
      />
      <Tab.Screen 
        name="MessagesTab" 
        component={MessagesStack}
        options={{ 
          title: 'Messages',
          tabBarLabel: 'Messages',
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
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Settings';
          const isSettingsScreen = routeName === 'Settings';

          return {
            title: 'Settings',
            tabBarLabel: 'Settings',
            tabBarIcon: ({ focused, color, size }) => {
              const shouldHighlight = focused && isSettingsScreen;
              return (
                <Ionicons
                  name={shouldHighlight ? 'settings' : 'settings-outline'}
                  size={size}
                  color={shouldHighlight ? theme.colors.primary : theme.colors.hint}
                />
              );
            },
            listeners: ({ navigation }) => ({
              tabPress: (e) => {
                if (routeName !== 'Settings') {
                  e.preventDefault();
                  navigation.navigate('SettingsTab', { screen: 'Settings' });
                }
              },
            }),
          };
        }}
      />
    </Tab.Navigator>
  );
};

export default DriverNavigator;
