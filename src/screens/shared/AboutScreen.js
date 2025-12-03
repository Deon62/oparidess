import React, { useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';

const AboutScreen = () => {
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

  // Restore tab bar when component unmounts (navigating away completely)
  useEffect(() => {
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  const handleLinkPress = (url) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  const aboutSections = [
    {
      title: 'About Oparides',
      content: 'Oparides is Kenya\'s leading peer-to-peer car rental and mobility services platform, connecting car owners with renters through a secure and user-friendly marketplace. We offer a comprehensive ecosystem that goes beyond traditional car rentals, providing vehicles, professional services, and discovery features all in one place. Our platform features three main sections: Vehicles for car rentals across different categories, Services for specialized mobility needs, and Discover for exploring destinations, events, and automotive businesses. Whether you need an everyday ride, a luxury vehicle for special occasions, commercial transport, or professional services like chauffeurs and car detailing, Oparides provides trusted solutions that prioritize safety, convenience, and customer satisfaction.',
    },
    {
      title: 'Our Mission',
      content: 'Our mission is to revolutionize transportation access in Kenya by creating a comprehensive mobility platform that empowers both car owners and renters. We aim to make car rental, professional services, and automotive discovery accessible to everyone through innovative technology, transparent pricing, and exceptional customer service. We are committed to building a trusted community where car owners can monetize their assets while renters enjoy affordable, reliable, and diverse mobility options. Beyond rentals, we connect users with professional services, help them discover amazing destinations and events, and provide access to automotive businesses like mechanics and parts shops. Our vision is to transform how Kenyans move, explore, and experience transportation.',
    },
    {
      title: 'What We Offer',
      items: [
        'Vehicle Rentals: Three categories including Everyday Picks for affordable daily rides, Premium & Luxury for business and special events, and Elite Collection for ultimate luxury experiences',
        'Commercial Vehicles: Pickups, Vans, and Trucks for work, cargo transport, and group travel needs',
        'Professional Services: Road trip planning, VIP wedding fleets, professional chauffeur services, moving services, car detailing, and 24/7 roadside assistance',
        'Discover Section: Curated destinations like Mombasa beaches, Lake Nakuru, and Hell\'s Gate for your next adventure',
        'Events & Experiences: Access to auto shows, classic car exhibitions, supercar rallies, and motor expos',
        'Automotive Businesses: Connect with verified auto parts shops and experienced mechanics for vehicle maintenance and repairs',
        'Flexible Booking: Choose from hourly, daily, weekly, or monthly rental periods to match your schedule',
        'Secure Payments: Multiple payment options including M-Pesa and card payments with transparent pricing',
        'Verified Network: All car owners, drivers, and businesses are verified with ratings and reviews for your peace of mind',
        '24/7 Support: Round-the-clock customer service for bookings, inquiries, and emergency assistance',
      ],
    },
  ];

  const contactInfo = [
    { icon: 'mail-outline', label: 'Email', value: 'support@oparides.com', action: () => handleLinkPress('mailto:support@oparides.com') },
    { icon: 'call-outline', label: 'Phone', value: '+254 7022 48 984', action: () => handleLinkPress('tel:+254702248984') },
    { icon: 'globe-outline', label: 'Website', value: 'opa.deonhq.xyz', action: () => handleLinkPress('https://opa.deonhq.xyz') },
  ];

  const socialLinks = [
    { icon: 'logo-reddit', label: 'Reddit', action: () => handleLinkPress('https://www.reddit.com/u/Deongideon_/s/3hle5mdWfx') },
    { icon: 'logo-twitter', label: 'Twitter', action: () => handleLinkPress('https://x.com/oparides?t=pfCVN_VtLwGBRyRUzuhlog&s=09') },
    { icon: 'logo-instagram', label: 'Instagram', action: () => handleLinkPress('https://instagram.com/deon_lii') },
    { icon: 'logo-linkedin', label: 'LinkedIn', action: () => handleLinkPress('https://www.linkedin.com/in/deon-orina-4a1722252?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app') },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      {/* App Logo/Title Section */}
      <View style={styles.headerSection}>
        <Text style={[styles.appTitle, { color: theme.colors.primary }]}>Oparides</Text>
        <Text style={[styles.appTagline, { color: theme.colors.textSecondary }]}>
          Premium Car Rental, Services & Discoveries
        </Text>
        <Text style={[styles.versionText, { color: theme.colors.hint }]}>Version 1.0.0</Text>
      </View>

      {/* About Sections */}
      {aboutSections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            {section.title}
          </Text>
          {section.content && (
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              {section.content}
            </Text>
          )}
          {section.items && (
            <View style={styles.itemsList}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.itemRow}>
                  <Ionicons name="checkmark-circle-outline" size={18} color={theme.colors.primary} />
                  <Text style={[styles.itemText, { color: theme.colors.textSecondary }]}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Contact Us
        </Text>
        {contactInfo.map((contact, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contactItem}
            onPress={contact.action}
            activeOpacity={0.7}
          >
            <Ionicons name={contact.icon} size={22} color={theme.colors.primary} />
            <View style={styles.contactInfo}>
              <Text style={[styles.contactLabel, { color: theme.colors.hint }]}>
                {contact.label}
              </Text>
              <Text style={[styles.contactValue, { color: theme.colors.textPrimary }]}>
                {contact.value}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Social Media */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Follow Us
        </Text>
        <View style={styles.socialContainer}>
          {socialLinks.map((social, index) => (
            <TouchableOpacity
              key={index}
              style={styles.socialButton}
              onPress={social.action}
              activeOpacity={0.7}
            >
              <Ionicons name={social.icon} size={24} color={theme.colors.primary} />
              <Text style={[styles.socialLabel, { color: theme.colors.textSecondary }]}>
                {social.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Copyright */}
      <View style={styles.footerSection}>
        <Text style={[styles.copyrightText, { color: theme.colors.hint }]}>
          © 2024 Oparides. All rights reserved.
        </Text>
      </View>
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
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 16,
  },
  appTitle: {
    fontSize: 42,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
    letterSpacing: -1,
  },
  appTagline: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  sectionContent: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 24,
  },
  itemsList: {
    gap: 12,
    marginTop: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemText: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    flex: 1,
    lineHeight: 22,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
    justifyContent: 'flex-start',
  },
  socialButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    minWidth: 70,
    flex: 0,
  },
  socialLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginTop: 6,
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 24,
  },
  copyrightText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
});

export default AboutScreen;

