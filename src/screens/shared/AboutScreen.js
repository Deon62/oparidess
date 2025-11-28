import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../packages/theme/ThemeProvider';

const AboutScreen = () => {
  const theme = useTheme();

  const handleLinkPress = (url) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  const aboutSections = [
    {
      title: 'About Oparides',
      content: 'Oparides is your premium destination for car rentals. We connect car owners and renters to create a seamless mobility experience.',
    },
    {
      title: 'Our Mission',
      content: 'To revolutionize the way people access transportation by providing a trusted platform that makes car rental and chauffeur services accessible, convenient, and affordable for everyone.',
    },
    {
      title: 'What We Offer',
      items: [
        'Premium car rental services',
        'Professional chauffeur services',
        'Flexible booking options',
        '24/7 customer support',
        'Secure and reliable platform',
      ],
    },
  ];

  const contactInfo = [
    { icon: 'mail-outline', label: 'Email', value: 'support@oparides.com', action: () => handleLinkPress('mailto:support@oparides.com') },
    { icon: 'call-outline', label: 'Phone', value: '+254 7022 48 984', action: () => handleLinkPress('tel:+254702248984') },
    { icon: 'globe-outline', label: 'Website', value: 'opa.deonhq.xyz', action: () => handleLinkPress('https://opa.deonhq.xyz') },
  ];

  const socialLinks = [
    { icon: 'logo-reddit', label: 'Reddit', action: () => handleLinkPress('https://reddit.com/r/oparides') },
    { icon: 'logo-twitter', label: 'Twitter', action: () => handleLinkPress('https://twitter.com/oparides') },
    { icon: 'logo-instagram', label: 'Instagram', action: () => handleLinkPress('https://instagram.com/oparides') },
    { icon: 'logo-linkedin', label: 'LinkedIn', action: () => handleLinkPress('https://linkedin.com/company/oparides') },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* App Logo/Title Section */}
      <View style={styles.headerSection}>
        <Text style={[styles.appTitle, { color: theme.colors.primary }]}>Oparides</Text>
        <Text style={[styles.appTagline, { color: theme.colors.textSecondary }]}>
          Premium Car Rental & Chauffeur Services
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

