import React, { useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';

const IntellectualPropertyScreen = () => {
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
      title: 'Ownership of Content',
      content: 'All content on the Oparides platform, including but not limited to logos, designs, text, graphics, images, software, code, user interfaces, and the overall design of the platform, is the exclusive property of Oparides and is protected by copyright, trademark, and other intellectual property laws.',
    },
    {
      title: 'Trademarks',
      content: 'The Oparides name, logo, and all related marks, graphics, and designs are trademarks of Oparides. These trademarks may not be used without our prior written permission. Unauthorized use of our trademarks may result in legal action.',
    },
    {
      title: 'User-Generated Content',
      content: 'When you upload content to our platform (such as vehicle photos, reviews, or profile information), you grant Oparides a non-exclusive, worldwide, royalty-free license to use, display, and distribute that content for the purpose of operating and promoting the platform. You retain ownership of your content but grant us these usage rights.',
    },
    {
      title: 'Prohibited Uses',
      content: 'Users may not copy, reproduce, distribute, modify, create derivative works, publicly display, or use any of our intellectual property without explicit written permission. This includes scraping, data mining, reverse engineering, or attempting to extract our platform\'s source code or algorithms.',
    },
    {
      title: 'Third-Party Content',
      content: 'Our platform may contain content from third parties, including user-submitted content, third-party services, or licensed materials. Respect for third-party intellectual property rights is required. Users are responsible for ensuring they have rights to any content they submit.',
    },
    {
      title: 'Copyright Protection',
      content: 'All original content on the Oparides platform is protected by copyright law. If you believe your copyright has been infringed, please contact us with details of the alleged infringement. We will investigate and take appropriate action in accordance with applicable laws.',
    },
    {
      title: 'License to Use Platform',
      content: 'Oparides grants users a limited, non-exclusive, non-transferable license to access and use the platform for its intended purposes. This license does not include the right to resell, redistribute, or commercially exploit the platform or its content.',
    },
    {
      title: 'Enforcement',
      content: 'Oparides takes intellectual property rights seriously. Violations of these terms may result in immediate account termination, removal of infringing content, and potential legal action. We reserve the right to pursue all available legal remedies for intellectual property violations.',
    },
    {
      title: 'Reporting Infringement',
      content: 'If you believe your intellectual property rights have been violated on our platform, please contact us at legal@oparides.com with detailed information about the alleged infringement, including your contact information and evidence of ownership.',
    },
    {
      title: 'Reservation of Rights',
      content: 'All rights not expressly granted in these terms are reserved by Oparides. Nothing in these terms should be construed as granting any license or right to use any intellectual property without our explicit written permission.',
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
        Intellectual Property
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

export default IntellectualPropertyScreen;

