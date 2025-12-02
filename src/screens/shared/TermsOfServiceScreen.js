import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';

const TermsOfServiceScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  // Hide bottom tab bar when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      return () => {
        // Restore tab bar when leaving this screen
      };
    }, [navigation])
  );

  // Restore tab bar when component unmounts
  useEffect(() => {
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using the Oparides platform, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services. These terms apply to all users, including car owners, renters, and service providers.',
    },
    {
      title: '2. Platform Services',
      content: 'Oparides provides a peer-to-peer marketplace connecting car owners with renters, as well as access to professional services including chauffeurs, car detailing, roadside assistance, and moving services. We also offer discovery features for destinations, events, and automotive businesses.',
    },
    {
      title: '3. User Accounts',
      content: 'To use our platform, you must create an account and provide accurate, complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must be at least 18 years old to use our services.',
    },
    {
      title: '4. Vehicle Rentals',
      content: 'Car owners are responsible for ensuring their vehicles are in safe, roadworthy condition and properly insured. Renters must have a valid driver\'s license and meet all requirements. Both parties agree to comply with all applicable traffic laws and regulations. Oparides acts as an intermediary and is not responsible for the condition of vehicles or the actions of users.',
    },
    {
      title: '5. Booking and Payments',
      content: 'All bookings are subject to availability and confirmation. Payment must be made through our secure payment system. Cancellation policies vary by booking type and are clearly stated at the time of booking. Refunds are processed according to our cancellation policy.',
    },
    {
      title: '6. Prohibited Activities',
      content: 'Users are prohibited from using the platform for illegal activities, fraud, or any purpose that violates these terms. This includes but is not limited to: using vehicles for illegal purposes, providing false information, circumventing fees, or interfering with the platform\'s operations.',
    },
    {
      title: '7. Liability and Disclaimers',
      content: 'Oparides provides the platform "as is" and does not guarantee uninterrupted or error-free service. We are not liable for damages arising from vehicle rentals, service bookings, or use of the platform beyond our direct control. Users are responsible for their own actions and decisions.',
    },
    {
      title: '8. Modifications to Terms',
      content: 'Oparides reserves the right to modify these terms at any time. Users will be notified of significant changes. Continued use of the platform after changes constitutes acceptance of the modified terms.',
    },
    {
      title: '9. Termination',
      content: 'We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent or harmful activities. Users may terminate their accounts at any time through the app settings.',
    },
    {
      title: '10. Governing Law',
      content: 'These terms are governed by the laws of Kenya. Any disputes will be resolved through arbitration in accordance with Kenyan law.',
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.mainTitle, { color: theme.colors.textPrimary }]}>
        Terms of Service
      </Text>
      <Text style={[styles.lastUpdated, { color: theme.colors.hint }]}>
        Last Updated: January 2024
      </Text>

      {sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            {section.title}
          </Text>
          <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
            {section.content}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  lastUpdated: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 32,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  sectionContent: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 24,
  },
});

export default TermsOfServiceScreen;

