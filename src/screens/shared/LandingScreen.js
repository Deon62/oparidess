import React, { useLayoutEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../packages/context/UserContext';

import SalesmanIcon from '../../../assets/icons/salesman.svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LandingScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { login } = useUser();
  const [loadingProvider, setLoadingProvider] = useState(null); // 'google' | 'apple' | null

  // Force status bar to be dark for this screen (Apple feel with light background)
  useLayoutEffect(() => {
    navigation.setOptions({
      statusBarStyle: 'dark',
      statusBarBackgroundColor: 'transparent',
    });
  }, [navigation]);

  // Ensure status bar stays dark when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        statusBarStyle: 'dark',
        statusBarBackgroundColor: 'transparent',
      });
    }, [navigation])
  );

  const handleSocialLogin = useCallback(
    async (provider) => {
      if (loadingProvider) return;
      setLoadingProvider(provider);

      const userData =
        provider === 'google'
          ? { email: 'test@google.com', name: 'Google User' }
          : { email: 'test@apple.com', name: 'Apple User' };

      // Show spinner briefly to indicate activity before auto-login
      await new Promise(resolve => setTimeout(resolve, 600));
      await login(userData, 'renter');
      setLoadingProvider(null);
    },
    [loadingProvider, login]
  );

  const handleTermsPress = () => {
    navigation.navigate('Legal');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="dark" />

      {/* Main Content */}
      <View style={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 12 }]}>
        {/* Hero Section with SVG */}
        <View style={styles.heroSection}>
          <SalesmanIcon width={280} height={280} />
          <Text style={[styles.heroTitle, { color: theme.colors.textPrimary }]}>
            Opa Rides
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.colors.textSecondary }]}>
            Your journey starts here
          </Text>
        </View>

        {/* Social Login Section */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton, { backgroundColor: theme.colors.white }]}
            onPress={() => handleSocialLogin('google')}
            activeOpacity={0.85}
            disabled={!!loadingProvider}
          >
            <View style={styles.socialContent}>
              {loadingProvider === 'google' && (
                <ActivityIndicator size="small" color={theme.colors.primary} style={styles.socialSpinner} />
              )}
              <Image
                source={{ uri: 'https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_128dp.png' }}
                style={styles.googleLogo}
                resizeMode="contain"
              />
              <Text style={[styles.socialText, { color: theme.colors.textPrimary }]}>
                {loadingProvider === 'google' ? 'Connecting…' : 'Continue with Google'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, styles.appleButton, { backgroundColor: '#FF1577' }]}
            onPress={() => handleSocialLogin('apple')}
            activeOpacity={0.9}
            disabled={!!loadingProvider}
          >
            <View style={styles.socialContent}>
              {loadingProvider === 'apple' && (
                <ActivityIndicator size="small" color={theme.colors.white} style={styles.socialSpinner} />
              )}
              <Ionicons name="logo-apple" size={26} color={theme.colors.white} style={styles.socialIcon} />
              <Text style={[styles.socialText, { color: theme.colors.white }]}>
                {loadingProvider === 'apple' ? 'Connecting…' : 'Continue with Apple'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Terms Text */}
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            By continuing, you agree to our{' '}
            <Text 
              style={[styles.termsLink, { color: theme.colors.textPrimary }]}
              onPress={handleTermsPress}
            >
              Terms
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: 'Nunito_700Bold',
    marginTop: 24,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
  },
  buttonContainer: {
    gap: 14,
    paddingBottom: 12,
  },
  socialButton: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
  },
  googleButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  appleButton: {
    shadowColor: '#FF1577',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  socialContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  socialText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  googleLogo: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  socialIcon: {
    width: 22,
    textAlign: 'center',
  },
  socialSpinner: {
    marginLeft: 6,
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.9,
  },
  termsLink: {
    fontFamily: 'Nunito_600SemiBold',
    textDecorationLine: 'underline',
  },
});

export default LandingScreen;
