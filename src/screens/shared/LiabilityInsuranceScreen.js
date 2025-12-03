import React, { useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';

const LiabilityInsuranceScreen = () => {
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
      title: 'Insurance Coverage',
      content: 'Oparides provides comprehensive insurance coverage for all vehicle rentals through our platform. This includes third-party liability, comprehensive coverage for vehicle damage, and protection for both car owners and renters. Coverage is active from the start of the rental period until the vehicle is returned.',
    },
    {
      title: 'Car Owner Protection',
      content: 'Car owners are protected against damage, theft, and liability claims during rental periods. Our insurance covers repairs, replacement costs, and legal expenses. Owners must maintain their own comprehensive insurance policies, and our coverage acts as additional protection specifically for platform rentals.',
    },
    {
      title: 'Renter Protection',
      content: 'Renters are covered for third-party liability and damage to the rental vehicle. The insurance includes collision coverage, theft protection, and personal accident coverage. Renters may be responsible for a deductible amount in case of claims, as specified in the rental agreement.',
    },
    {
      title: 'Damage Reporting',
      content: 'Any damage or incidents must be reported immediately through the app. Both owners and renters should document damage with photos and detailed descriptions. Failure to report damage promptly may affect insurance coverage. Our support team will guide you through the claims process.',
    },
    {
      title: 'Liability Limitations',
      content: 'Oparides is not liable for damages resulting from user negligence, illegal activities, or violations of traffic laws. Users are responsible for their own actions and must comply with all applicable laws. The platform acts as an intermediary and is not responsible for vehicle condition or user conduct beyond our direct control.',
    },
    {
      title: 'Exclusions',
      content: 'Insurance does not cover damages from racing, off-road use (unless specifically permitted), driving under the influence, unlicensed drivers, or use outside of Kenya without prior authorization. Intentional damage, fraud, or violations of terms are also excluded from coverage.',
    },
    {
      title: 'Claims Process',
      content: 'To file a claim, submit a report through the app with photos, documentation, and a detailed description. Our insurance team will review the claim within 48 hours. Approved claims are processed for repairs or compensation. Both parties will be kept informed throughout the process.',
    },
    {
      title: 'Deductibles and Fees',
      content: 'Deductibles apply to certain types of claims as specified in the rental agreement. These amounts vary based on the vehicle value and type of damage. Platform fees and insurance premiums are included in the rental price and are non-refundable.',
    },
    {
      title: 'Service Provider Insurance',
      content: 'Professional service providers (chauffeurs, mechanics, etc.) must maintain their own professional liability insurance. Oparides provides platform liability coverage, but service providers are responsible for their own professional insurance and qualifications.',
    },
    {
      title: 'Legal Compliance',
      content: 'All insurance coverage complies with Kenyan insurance regulations. Users must ensure they meet all legal requirements for vehicle operation, including valid licenses, registration, and compliance with traffic laws. Non-compliance may void insurance coverage.',
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
        Liability & Insurance
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

export default LiabilityInsuranceScreen;

