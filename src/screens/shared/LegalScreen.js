import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';

const LegalScreen = () => {
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

  const handleSectionPress = (screenName) => {
    navigation.navigate(screenName);
  };

  const legalSections = [
    {
      title: 'Terms of Service',
      content: 'By using Oparides, you agree to our Terms of Service. These terms govern your use of our platform, including vehicle rentals, service bookings, and all interactions on the platform. Please read these terms carefully before using our services.',
      screenName: 'TermsOfService',
    },
    {
      title: 'User Agreement',
      content: 'Our User Agreement outlines the rights and responsibilities of both car owners and renters on the Oparides platform. This includes booking policies, payment terms, cancellation procedures, and dispute resolution processes.',
      screenName: 'UserAgreement',
    },
    {
      title: 'Liability & Insurance',
      content: 'Oparides provides comprehensive insurance coverage for all rentals. Car owners and renters are protected through our insurance policies. However, users are responsible for following all traffic laws and using vehicles responsibly. Any damages or incidents must be reported immediately.',
      screenName: 'LiabilityInsurance',
    },
    {
      title: 'Intellectual Property',
      content: 'All content on the Oparides platform, including logos, designs, text, graphics, and software, is the property of Oparides and protected by copyright and trademark laws. Unauthorized use of our intellectual property is prohibited.',
      screenName: 'IntellectualProperty',
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Legal Sections */}
      {legalSections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            {section.title}
          </Text>
          <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
            {section.content}
          </Text>
          <TouchableOpacity
            style={styles.readMoreButton}
            onPress={() => handleSectionPress(section.screenName)}
            activeOpacity={0.7}
          >
            <Text style={[styles.readMoreText, { color: theme.colors.primary }]}>
              Read More
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Contact for Legal Inquiries */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Legal Inquiries
        </Text>
        <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
          For legal inquiries or questions about our terms and policies, please contact our legal team.
        </Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleLinkPress('mailto:legal@oparides.com')}
          activeOpacity={0.7}
        >
          <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />
          <Text style={[styles.contactButtonText, { color: theme.colors.primary }]}>
            legal@oparides.com
          </Text>
        </TouchableOpacity>
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
    marginBottom: 12,
  },
  readMoreButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
    textDecorationLine: 'underline',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 21, 119, 0.3)',
    alignSelf: 'flex-start',
  },
  contactButtonText: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default LegalScreen;

