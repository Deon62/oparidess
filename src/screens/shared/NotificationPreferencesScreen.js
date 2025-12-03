import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Toggle } from '../../packages/components';

const NotificationPreferencesScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);

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

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
              Email Notifications
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
              Receive notifications via email
            </Text>
          </View>
          <Toggle
            value={emailNotifications}
            onValueChange={setEmailNotifications}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
              SMS Notifications
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
              Receive notifications via SMS
            </Text>
          </View>
          <Toggle
            value={smsNotifications}
            onValueChange={setSmsNotifications}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
              In-App Notifications
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
              Receive notifications within the app
            </Text>
          </View>
          <Toggle
            value={inAppNotifications}
            onValueChange={setInAppNotifications}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
              Marketing Notifications
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
              Receive promotional and marketing updates
            </Text>
          </View>
          <Toggle
            value={marketingNotifications}
            onValueChange={setMarketingNotifications}
          />
        </View>
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
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
});

export default NotificationPreferencesScreen;

