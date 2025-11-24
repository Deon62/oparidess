import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

// Renter screens
import RenterHomeScreen from '../../screens/renter/RenterHomeScreen';
import CarListScreen from '../../screens/renter/CarListScreen';
import CarDetailsScreen from '../../screens/renter/CarDetailsScreen';
import BookingScreen from '../../screens/renter/BookingScreen';
import BookingsListScreen from '../../screens/renter/BookingsListScreen';
import SettingsScreen from '../../screens/renter/SettingsScreen';
import RenterProfileScreen from '../../screens/renter/RenterProfileScreen';

// Shared screens
import MessagesScreen from '../../screens/shared/MessagesScreen';
import ChatScreen from '../../screens/shared/ChatScreen';
import LanguageScreen from '../../screens/shared/LanguageScreen';
import NotificationPreferencesScreen from '../../screens/shared/NotificationPreferencesScreen';
import PrivacyScreen from '../../screens/shared/PrivacyScreen';
import AboutScreen from '../../screens/shared/AboutScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack Navigator (for Home tab and related screens)
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
        name="BookingsList" 
        component={BookingsListScreen}
        options={{ 
          title: 'My Bookings',
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
        component={SettingsScreen}
        options={{ 
          title: 'Settings',
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
        name="RenterProfile" 
        component={RenterProfileScreen}
        options={{ 
          title: 'My Profile',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
};

const RenterNavigator = () => {
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
          } else if (route.name === 'MessagesTab') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
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
        name="MessagesTab" 
        component={MessagesStack}
        options={{ 
          title: 'Messages',
          tabBarLabel: 'Messages',
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

export default RenterNavigator;

