import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

// Renter screens
import RenterHomeScreen from '../../screens/renter/RenterHomeScreen';
import CarListScreen from '../../screens/renter/CarListScreen';
import CarDetailsScreen from '../../screens/renter/CarDetailsScreen';
import BookingScreen from '../../screens/renter/BookingScreen';
import BookingConfirmationScreen from '../../screens/renter/BookingConfirmationScreen';
import CancellationScreen from '../../screens/renter/CancellationScreen';
import BookingsListScreen from '../../screens/renter/BookingsListScreen';
import PaymentScreen from '../../screens/renter/PaymentScreen';
import BookingTrackingScreen from '../../screens/renter/BookingTrackingScreen';
import PastRentalDetailsScreen from '../../screens/renter/PastRentalDetailsScreen';
import SettingsScreen from '../../screens/renter/SettingsScreen';
import RenterProfileScreen from '../../screens/renter/RenterProfileScreen';
import UpdateProfileScreen from '../../screens/renter/UpdateProfileScreen';
import WishlistScreen from '../../screens/renter/WishlistScreen';
import UploadDocsScreen from '../../screens/renter/UploadDocsScreen';
import AddPaymentScreen from '../../screens/renter/AddPaymentScreen';
import BecomeServiceProviderScreen from '../../screens/renter/BecomeServiceProviderScreen';
import ServiceProviderStep1Screen from '../../screens/renter/ServiceProviderStep1Screen';
import ServiceProviderStep2Screen from '../../screens/renter/ServiceProviderStep2Screen';
import ServiceProviderStep3Screen from '../../screens/renter/ServiceProviderStep3Screen';
import ServiceDetailsScreen from '../../screens/renter/ServiceDetailsScreen';
import ServiceBookingScreen from '../../screens/renter/ServiceBookingScreen';
import ServiceBookingConfirmationScreen from '../../screens/renter/ServiceBookingConfirmationScreen';
import WriteBlogScreen from '../../screens/renter/WriteBlogScreen';
import PreviewBlogScreen from '../../screens/renter/PreviewBlogScreen';

// Shared screens
import MessagesScreen from '../../screens/shared/MessagesScreen';
import ChatScreen from '../../screens/shared/ChatScreen';
import LanguageScreen from '../../screens/shared/LanguageScreen';
import NotificationPreferencesScreen from '../../screens/shared/NotificationPreferencesScreen';
import PrivacyScreen from '../../screens/shared/PrivacyScreen';
import AboutScreen from '../../screens/shared/AboutScreen';
import NotificationsScreen from '../../screens/shared/NotificationsScreen';
import CustomerSupportScreen from '../../screens/shared/CustomerSupportScreen';
import ReferFriendsScreen from '../../screens/shared/ReferFriendsScreen';
import CancellationPolicyScreen from '../../screens/shared/CancellationPolicyScreen';
import DisputeScreen from '../../screens/shared/DisputeScreen';
import ComingSoonScreen from '../../screens/shared/ComingSoonScreen';

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
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
          statusBarTranslucent: true,
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
        name="BookingConfirmation" 
        component={BookingConfirmationScreen}
        options={{ 
          title: 'Review Booking',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen}
        options={{ 
          title: 'Payment',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="BookingTracking" 
        component={BookingTrackingScreen}
        options={{ 
          title: 'Booking Details',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="Cancellation" 
        component={CancellationScreen}
        options={{ 
          title: 'Cancel Booking',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="CancellationPolicy" 
        component={CancellationPolicyScreen}
        options={{ 
          title: 'Cancellation Policy',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="Dispute" 
        component={DisputeScreen}
        options={{ 
          title: 'File a Dispute',
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
      <Stack.Screen 
        name="UpdateProfile" 
        component={UpdateProfileScreen}
        options={{ 
          title: 'Update Profile',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="UploadDocs" 
        component={UploadDocsScreen}
        options={{ 
          title: 'Upload Documents',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="AddPayment" 
        component={AddPaymentScreen}
        options={{ 
          title: 'Add Payment Method',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="ServiceProviderStep1" 
        component={ServiceProviderStep1Screen}
        options={{ 
          title: 'Business Information',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="ServiceProviderStep2" 
        component={ServiceProviderStep2Screen}
        options={{ 
          title: 'Documents & Verification',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="ServiceProviderStep3" 
        component={ServiceProviderStep3Screen}
        options={{ 
          title: 'Review & Submit',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="BecomeServiceProvider" 
        component={BecomeServiceProviderScreen}
        options={{ 
          title: 'Become Service Provider',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="ReferFriends" 
        component={ReferFriendsScreen}
        options={{ 
          title: 'Refer Friends',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="ComingSoon" 
        component={ComingSoonScreen}
        options={{ 
          title: 'Coming Soon',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="ServiceDetails" 
        component={ServiceDetailsScreen}
        options={{ 
          title: 'Service Details',
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="ServiceBooking" 
        component={ServiceBookingScreen}
        options={{ 
          title: 'Book Service',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="ServiceBookingConfirmation" 
        component={ServiceBookingConfirmationScreen}
        options={{ 
          title: 'Booking Confirmed',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="WriteBlog" 
        component={WriteBlogScreen}
        options={{ 
          title: 'Write Blog',
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="PreviewBlog" 
        component={PreviewBlogScreen}
        options={{ 
          title: 'Preview Blog',
          headerShown: false 
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
      <Stack.Screen 
        name="PastRentalDetails" 
        component={PastRentalDetailsScreen}
        options={{ 
          title: 'Past Rental Details',
          headerShown: false 
        }}
      />
    </Stack.Navigator>
  );
};

// Wishlist Stack Navigator
const WishlistStack = () => {
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
        name="Wishlist" 
        component={WishlistScreen}
        options={{ 
          title: 'Wishlist',
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
        name="Notifications" 
        component={NotificationsScreen}
        options={{ 
          title: 'Notifications',
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
        name="WriteBlog" 
        component={WriteBlogScreen}
        options={{ 
          title: 'Write Blog',
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="PreviewBlog" 
        component={PreviewBlogScreen}
        options={{ 
          title: 'Preview Blog',
          headerShown: false 
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
          } else if (route.name === 'WishlistTab') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'BookingsTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'MessagesTab') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
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
        options={{ 
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="WishlistTab" 
        component={WishlistStack}
        options={{ 
          title: 'Wishlist',
          tabBarLabel: 'Wishlist',
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
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Settings';
          const isSettingsScreen = routeName === 'Settings';
          
          return {
            title: 'Settings',
            tabBarLabel: 'Settings',
            tabBarIcon: ({ focused, color, size }) => {
              // Only highlight if we're on Settings screen, not on Notifications
              const shouldHighlight = focused && isSettingsScreen;
              return (
                <Ionicons 
                  name={shouldHighlight ? 'settings' : 'settings-outline'} 
                  size={size} 
                  color={shouldHighlight ? theme.colors.primary : theme.colors.hint} 
                />
              );
            },
          };
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // Get the current route name in the SettingsTab stack
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'Settings';
            
            // If we're not on the Settings screen, navigate to it instead
            if (routeName !== 'Settings') {
              e.preventDefault();
              navigation.navigate('SettingsTab', { screen: 'Settings' });
            }
            // Otherwise, let the default behavior happen (just focus the tab)
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default RenterNavigator;

