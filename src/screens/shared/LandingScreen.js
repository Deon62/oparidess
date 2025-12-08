import React, { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, AppState, ActivityIndicator, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../packages/context/UserContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LandingScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { login } = useUser();
  const [loadingProvider, setLoadingProvider] = useState(null); // 'google' | 'apple' | null

  // Force status bar to be light (white) for this screen
  useLayoutEffect(() => {
    navigation.setOptions({
      statusBarStyle: 'light',
      statusBarBackgroundColor: 'transparent',
    });
  }, [navigation]);

  // Ensure status bar stays light when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        statusBarStyle: 'light',
        statusBarBackgroundColor: 'transparent',
      });
    }, [navigation])
  );

  // Create video player - try using require() directly first
  const player = useVideoPlayer(require('../../../assets/logo/landing.mp4'), (player) => {
    player.loop = true;
    player.muted = true;
  });

  useEffect(() => {
    // Ensure video plays when component mounts
    if (player) {
      player.play();
    }
  }, [player]);

  useFocusEffect(
    React.useCallback(() => {
      // Resume playback when screen regains focus
      if (player) {
        player.play();
      }

      const appStateSubscription = AppState.addEventListener('change', (state) => {
        if (state === 'active' && player) {
          player.play();
        }
      });

      return () => {
        appStateSubscription.remove();
      };
    }, [player])
  );

  const handleSocialLogin = useCallback(
    async (provider) => {
      if (loadingProvider) return;
      setLoadingProvider(provider);

      const userData =
        provider === 'google'
          ? { email: 'test@google.com', name: 'Google User' }
          : { email: 'test@apple.com', name: 'Apple User' };

      await login(userData, 'renter');
      setLoadingProvider(null);
    },
    [loadingProvider, login]
  );

  const handleTermsPress = () => {
    navigation.navigate('Legal');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Video Background */}
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />

      {/* Content Overlay */}
      <View style={[styles.overlay, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 8 }]}>
        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>
            You were meant for more than just passenger seats
          </Text>
        </View>

        {/* Social Login Section */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: theme.colors.white }]}
            onPress={() => handleSocialLogin('google')}
            activeOpacity={0.85}
            disabled={!!loadingProvider}
          >
            <View style={styles.socialContent}>
              <Image
                source={{ uri: 'https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_128dp.png' }}
                style={styles.googleLogo}
                resizeMode="contain"
              />
              <Text style={[styles.socialText, { color: theme.colors.textPrimary }]}>
                {loadingProvider === 'google' ? 'Connecting…' : 'Continue with Google'}
              </Text>
              {loadingProvider === 'google' && (
                <ActivityIndicator size="small" color={theme.colors.primary} style={styles.socialSpinner} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: theme.colors.white }]}
            onPress={() => handleSocialLogin('apple')}
            activeOpacity={0.85}
            disabled={!!loadingProvider}
          >
            <View style={styles.socialContent}>
              <Ionicons name="logo-apple" size={26} color={theme.colors.textPrimary} style={styles.socialIcon} />
              <Text style={[styles.socialText, { color: theme.colors.textPrimary }]}>
                {loadingProvider === 'apple' ? 'Connecting…' : 'Continue with Apple'}
              </Text>
              {loadingProvider === 'apple' && (
                <ActivityIndicator size="small" color={theme.colors.primary} style={styles.socialSpinner} />
              )}
            </View>
          </TouchableOpacity>

          {/* Terms Text */}
          <Text style={[styles.termsText, { color: theme.colors.white }]}>
            By continuing, you agree to our{' '}
            <Text 
              style={[styles.termsLink, { color: theme.colors.white }]}
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
    backgroundColor: '#000',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    zIndex: 1,
    position: 'relative',
  },
  taglineContainer: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 52,
  },
  tagline: {
    fontSize: 24,
    fontFamily: 'Nunito_300Light',
    color: '#F4F6FB',
    textAlign: 'center',
    lineHeight: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  buttonContainer: {
    gap: 14,
  },
  socialButton: {
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
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
