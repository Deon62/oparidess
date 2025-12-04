import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

// Renter screens
import RenterHomeScreen from '../../screens/renter/RenterHomeScreen';
import CarListScreen from '../../screens/renter/CarListScreen';
import CarDetailsScreen from '../../screens/renter/CarDetailsScreen';
import CarManualScreen from '../../screens/renter/CarManualScreen';
import ServiceListScreen from '../../screens/renter/ServiceListScreen';
import DiscoverListScreen from '../../screens/renter/DiscoverListScreen';
import DiscoverDetailsScreen from '../../screens/renter/DiscoverDetailsScreen';
import ArticleScreen from '../../screens/renter/ArticleScreen';
import BookingScreen from '../../screens/renter/BookingScreen';
import BookingConfirmationScreen from '../../screens/renter/BookingConfirmationScreen';
import InsuranceDetailsScreen from '../../screens/renter/InsuranceDetailsScreen';
import CancellationScreen from '../../screens/renter/CancellationScreen';
import BookingsListScreen from '../../screens/renter/BookingsListScreen';
import PaymentScreen from '../../screens/renter/PaymentScreen';
import BookingTrackingScreen from '../../screens/renter/BookingTrackingScreen';
import PastRentalDetailsScreen from '../../screens/renter/PastRentalDetailsScreen';
import PendingRentalDetailsScreen from '../../screens/renter/PendingRentalDetailsScreen';
import SettingsScreen from '../../screens/renter/SettingsScreen';
import RenterProfileScreen from '../../screens/renter/RenterProfileScreen';
import UpdateProfileScreen from '../../screens/renter/UpdateProfileScreen';
import ChangePasswordScreen from '../../screens/renter/ChangePasswordScreen';
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
import SearchScreen from '../../screens/renter/SearchScreen';

// Shared screens
import MessagesScreen from '../../screens/shared/MessagesScreen';
import ChatScreen from '../../screens/shared/ChatScreen';
import LanguageScreen from '../../screens/shared/LanguageScreen';
import NotificationPreferencesScreen from '../../screens/shared/NotificationPreferencesScreen';
import PrivacyScreen from '../../screens/shared/PrivacyScreen';
import AboutScreen from '../../screens/shared/AboutScreen';
import LegalScreen from '../../screens/shared/LegalScreen';
import TermsOfServiceScreen from '../../screens/shared/TermsOfServiceScreen';
import UserAgreementScreen from '../../screens/shared/UserAgreementScreen';
import LiabilityInsuranceScreen from '../../screens/shared/LiabilityInsuranceScreen';
import IntellectualPropertyScreen from '../../screens/shared/IntellectualPropertyScreen';
import NotificationsScreen from '../../screens/shared/NotificationsScreen';
import CustomerSupportScreen from '../../screens/shared/CustomerSupportScreen';
import ShareFeedbackScreen from '../../screens/shared/ShareFeedbackScreen';
import ReferFriendsScreen from '../../screens/shared/ReferFriendsScreen';
import CancellationPolicyScreen from '../../screens/shared/CancellationPolicyScreen';
import CrossCountryTravelDetailsScreen from '../../screens/shared/CrossCountryTravelDetailsScreen';
import DisputeScreen from '../../screens/shared/DisputeScreen';
import ComingSoonScreen from '../../screens/shared/ComingSoonScreen';
import ImageRepositoryScreen from '../../screens/shared/ImageRepositoryScreen';

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
        animation: 'simple_push',
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
        }}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ 
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen 
        name="CarList" 
        component={CarListScreen}
        options={{ 
          title: 'Available Cars',
          headerShown: true,
          animation: 'simple_push',
        }}
      />
      <Stack.Screen 
        name="ServiceList" 
        component={ServiceListScreen}
        options={{ 
          title: 'All Services',
          headerShown: true,
          animation: 'simple_push',
        }}
      />
      <Stack.Screen 
        name="DiscoverList" 
        component={DiscoverListScreen}
        options={{ 
          title: 'All Discoveries',
          headerShown: true,
          animation: 'simple_push',
        }}
      />
      <Stack.Screen 
        name="DiscoverDetails" 
        component={DiscoverDetailsScreen}
        options={{ 
          headerShown: false,
          animation: 'simple_push',
        }}
      />
      <Stack.Screen 
        name="Article" 
        component={ArticleScreen}
        options={{ 
          headerShown: false,
          animation: 'simple_push',
        }}
      />
      <Stack.Screen 
        name="CarDetails" 
        component={CarDetailsScreen}
        options={{ 
          title: 'Car Details',
          headerShown: true,
          animation: 'simple_push',
        }}
      />
      <Stack.Screen 
        name="CarManual" 
        component={CarManualScreen}
        options={{ 
          title: 'Car Manual',
          headerShown: true,
          animation: 'simple_push',
        }}
      />
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen}
        options={{ 
          title: 'Book Car',
          headerShown: true,
          animation: 'slide_from_bottom',
          animationDuration: 200,
          presentation: 'modal',
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="InsuranceDetails" 
        component={InsuranceDetailsScreen}
        options={{ 
          headerShown: false,
          animation: 'simple_push',
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="BookingConfirmation" 
        component={BookingConfirmationScreen}
        options={{ 
          title: 'Review Booking',
          headerShown: true,
          animation: 'slide_from_bottom',
          animationDuration: 200,
          presentation: 'modal',
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen}
        options={{ 
          title: 'Payment',
          headerShown: true,
          animation: 'slide_from_bottom',
          animationDuration: 200,
          presentation: 'modal',
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="BookingTracking" 
        component={BookingTrackingScreen}
        options={{ 
          title: 'Booking Details',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
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
        name="CrossCountryTravelDetails" 
        component={CrossCountryTravelDetailsScreen}
        options={{ 
          title: 'Cross Country Travel',
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
        name="UpdateProfile" 
        component={UpdateProfileScreen}
        options={{ 
          title: 'Update Profile',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="UploadDocs" 
        component={UploadDocsScreen}
        options={{ 
          title: 'Upload Documents',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="AddPayment" 
        component={AddPaymentScreen}
        options={{ 
          title: 'Add Payment Method',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
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
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
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
        name="ImageRepository" 
        component={ImageRepositoryScreen}
        options={{ 
          title: 'Image Repository',
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="ServiceDetails" 
        component={ServiceDetailsScreen}
        options={{ 
          title: 'Service Details',
          headerShown: false,
          animation: 'simple_push',
        }}
      />
      <Stack.Screen 
        name="ServiceBooking" 
        component={ServiceBookingScreen}
        options={{ 
          title: 'Book Service',
          headerShown: true,
          animation: 'slide_from_bottom',
          animationDuration: 200,
          presentation: 'modal',
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="ServiceBookingConfirmation" 
        component={ServiceBookingConfirmationScreen}
        options={{ 
          title: 'Review Booking',
          headerShown: true,
          animation: 'slide_from_bottom',
          animationDuration: 200,
          presentation: 'modal',
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
        animation: 'simple_push',
      }}
    >
      <Stack.Screen 
        name="BookingsList" 
        component={BookingsListScreen}
        options={{ 
          title: 'Past rentals',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="PastRentalDetails" 
        component={PastRentalDetailsScreen}
        options={{ 
          title: 'Past Rental Details',
          headerShown: false,
          animation: 'simple_push',
        }}
      />
      <Stack.Screen 
        name="BookingTracking" 
        component={BookingTrackingScreen}
        options={{ 
          title: 'Booking Details',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
          animation: 'simple_push',
        }}
      />
      <Stack.Screen 
        name="CarManual" 
        component={CarManualScreen}
        options={{ 
          title: 'Car Manual',
          headerShown: true,
          animation: 'simple_push',
        }}
      />
      <Stack.Screen 
        name="ImageRepository" 
        component={ImageRepositoryScreen}
        options={{ 
          title: 'Image Repository',
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="PendingRentalDetails" 
        component={PendingRentalDetailsScreen}
        options={{ 
          title: 'Pending Rental Details',
          headerShown: false,
          animation: 'simple_push',
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
        animation: 'simple_push',
      }}
    >
      <Stack.Screen 
        name="Wishlist" 
        component={WishlistScreen}
        options={{ 
          title: 'Wishlist',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
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
        animation: 'simple_push',
      }}
    >
      <Stack.Screen 
        name="Messages" 
        component={MessagesScreen}
        options={{ 
          title: 'Messages',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={({ route }) => ({ 
          title: route.params?.userName || 'Chat',
          headerShown: true,
          animation: 'simple_push',
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        })}
      />
    </Stack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStack = () => {
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
        animation: 'simple_push',
      }}
    >
      <Stack.Screen 
        name="RenterProfile" 
        component={RenterProfileScreen}
        options={{ 
          title: 'My Profile',
          headerShown: false,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          title: 'Settings',
          headerShown: false,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="Language" 
        component={LanguageScreen}
        options={{ 
          title: 'Select Language',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="NotificationPreferences" 
        component={NotificationPreferencesScreen}
        options={{ 
          title: 'Notification Preferences',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="Privacy" 
        component={PrivacyScreen}
        options={{ 
          title: 'Privacy',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen}
        options={{ 
          title: 'About',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="Legal" 
        component={LegalScreen}
        options={{ 
          title: 'Legal',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="TermsOfService" 
        component={TermsOfServiceScreen}
        options={{ 
          title: 'Terms of Service',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="UserAgreement" 
        component={UserAgreementScreen}
        options={{ 
          title: 'User Agreement',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="LiabilityInsurance" 
        component={LiabilityInsuranceScreen}
        options={{ 
          title: 'Liability & Insurance',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="IntellectualProperty" 
        component={IntellectualPropertyScreen}
        options={{ 
          title: 'Intellectual Property',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="UpdateProfile" 
        component={UpdateProfileScreen}
        options={{ 
          title: 'Update Profile',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen}
        options={{ 
          title: 'Change Password',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="UploadDocs" 
        component={UploadDocsScreen}
        options={{ 
          title: 'Upload Documents',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ 
          title: 'Notifications',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="CustomerSupport" 
        component={CustomerSupportScreen}
        options={{ 
          title: 'Customer Support',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="ShareFeedback" 
        component={ShareFeedbackScreen}
        options={{ 
          title: 'Help us Improve',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
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
      <Stack.Screen 
        name="ReferFriends" 
        component={ReferFriendsScreen}
        options={{ 
          title: 'Refer Friends',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="AddPayment" 
        component={AddPaymentScreen}
        options={{ 
          title: 'Add Payment Method',
          headerShown: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'transparent',
        }}
      />
      <Stack.Screen 
        name="ServiceProviderStep1" 
        component={ServiceProviderStep1Screen}
        options={{ 
          title: 'Business Information',
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="ServiceProviderStep2" 
        component={ServiceProviderStep2Screen}
        options={{ 
          title: 'Documents & Verification',
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="ServiceProviderStep3" 
        component={ServiceProviderStep3Screen}
        options={{ 
          title: 'Review & Submit',
          headerShown: false 
        }}
      />
    </Stack.Navigator>
  );
};

const RenterNavigator = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // Calculate safe bottom padding for Android devices with button navigation bars
  // Some devices (like Tecno) may report insets.bottom as 0 or very small
  // even when they have button navigation bars that overlap the app
  const getSafeBottomPadding = () => {
    if (Platform.OS === 'android') {
      // Minimum padding for button navigation bars (typically 48-56px)
      const MIN_BOTTOM_PADDING = 48; // Standard Android navigation bar height
      const MIN_BOTTOM_INSET_THRESHOLD = 8; // Threshold below which we assume button navigation
      
      // If insets.bottom is very small or zero (likely button navigation on some devices),
      // use minimum padding to prevent overlap
      if (insets.bottom < MIN_BOTTOM_INSET_THRESHOLD) {
        return MIN_BOTTOM_PADDING;
      }
      // If insets.bottom is already sufficient (like on Samsung with proper safe area),
      // use it as-is with a small minimum to ensure readability
      return Math.max(insets.bottom, 4);
    }
    // For iOS, use the actual inset
    return Math.max(insets.bottom, 4);
  };

  const safeBottomPadding = getSafeBottomPadding();
  const tabBarHeight = 58 + safeBottomPadding;

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
          } else if (route.name === 'ProfileTab') {
            // ProfileTab icon is handled in its own options
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.hint,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Nunito_600SemiBold',
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopWidth: 1,
          borderTopColor: theme.colors.hint + '30',
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
          height: tabBarHeight,
          paddingBottom: safeBottomPadding,
          paddingTop: 2,
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
        name="ProfileTab" 
        component={ProfileStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'RenterProfile';
          const isProfileScreen = routeName === 'RenterProfile';
          
          return {
            title: 'Profile',
            tabBarLabel: 'Profile',
            tabBarIcon: ({ focused, color, size }) => {
              // Only highlight if we're on Profile screen
              const shouldHighlight = focused && isProfileScreen;
              return (
                <Ionicons 
                  name={shouldHighlight ? 'person' : 'person-outline'} 
                  size={size} 
                  color={shouldHighlight ? theme.colors.primary : theme.colors.hint} 
                />
              );
            },
          };
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // Get the current route name in the ProfileTab stack
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'RenterProfile';
            
            // If we're not on the Profile screen, navigate to it instead
            if (routeName !== 'RenterProfile') {
              e.preventDefault();
              navigation.navigate('ProfileTab', { screen: 'RenterProfile' });
            }
            // Otherwise, let the default behavior happen (just focus the tab)
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default RenterNavigator;

