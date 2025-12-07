import React, { useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LandingScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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

  const handleGetStarted = () => {
    navigation.navigate('Signup', { userType: 'renter' });
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

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
      <View style={[styles.overlay, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}>
        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>
            You were meant for more than just passenger seats
          </Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.getStartedButton, { backgroundColor: '#FF1577' }]}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: theme.colors.white }]}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={[styles.loginButtonText, { color: theme.colors.textPrimary }]}>Login</Text>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  tagline: {
    fontSize: 24,
    fontFamily: 'Nunito_600SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  buttonContainer: {
    gap: 14,
  },
  getStartedButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#FFFFFF',
  },
  loginButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
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
