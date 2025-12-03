import React, { useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';

const UserAgreementScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  // Set navigation options to show status bar
  useLayoutEffect(() => {
    navigation.setOptions({
      statusBarStyle: 'dark',
      statusBarBackgroundColor: 'transparent',
    });
  }, [navigation]);

  // Hide bottom tab bar and ensure status bar is visible when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      // Ensure status bar is visible
      StatusBar.setHidden(false);
      StatusBar.setBarStyle('dark-content');
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
      title: 'Agreement Overview',
      content: 'This User Agreement establishes the relationship between Oparides and its users, including car owners, renters, and service providers. By using our platform, you agree to the terms outlined in this agreement.',
    },
    {
      title: 'Car Owner Responsibilities',
      content: 'Car owners must provide accurate vehicle information, maintain vehicles in safe and roadworthy condition, ensure proper insurance coverage, and respond promptly to booking requests. Owners are responsible for vehicle registration, licensing, and compliance with all applicable laws.',
    },
    {
      title: 'Renter Responsibilities',
      content: 'Renters must have a valid driver\'s license, meet age requirements, provide accurate personal information, and use vehicles responsibly. Renters are responsible for following traffic laws, returning vehicles on time and in the same condition (excluding normal wear), and reporting any issues immediately.',
    },
    {
      title: 'Booking Policies',
      content: 'Bookings are confirmed upon payment. Cancellation policies vary: free cancellation within 24 hours of booking, partial refunds for cancellations made 48 hours before pickup, and no refunds for same-day cancellations. Special events and services may have different policies clearly stated at booking.',
    },
    {
      title: 'Payment Terms',
      content: 'All payments are processed securely through our platform. Renters pay upfront, and owners receive payment after the rental period ends, minus platform fees. Service providers receive payment according to their service agreements. All prices include applicable taxes.',
    },
    {
      title: 'Cancellation Procedures',
      content: 'Cancellations must be made through the app. Refunds are processed automatically according to the cancellation policy. For disputes or special circumstances, contact customer support. Owners may cancel bookings but may face penalties for last-minute cancellations.',
    },
    {
      title: 'Dispute Resolution',
      content: 'In case of disputes between users, Oparides provides a dispute resolution process. Users should first attempt to resolve issues directly. If unsuccessful, disputes can be submitted through the app, and our team will mediate. For serious matters, legal recourse may be pursued according to Kenyan law.',
    },
    {
      title: 'Service Provider Terms',
      content: 'Service providers (chauffeurs, mechanics, car detailers, etc.) must maintain proper licenses, insurance, and qualifications. They are responsible for the quality of their services and must comply with all professional standards and regulations.',
    },
    {
      title: 'User Conduct',
      content: 'All users must treat each other with respect and professionalism. Harassment, discrimination, fraud, or any illegal activities are strictly prohibited and will result in immediate account termination and potential legal action.',
    },
    {
      title: 'Account Management',
      content: 'Users can update their profiles, payment methods, and preferences at any time. Account deletion requests are processed within 30 days. Some information may be retained for legal and safety purposes as required by law.',
    },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      <Text style={[styles.mainTitle, { color: theme.colors.textPrimary }]}>
        User Agreement
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
    </>
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

export default UserAgreementScreen;

