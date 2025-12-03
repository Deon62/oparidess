import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useUser } from '../../packages/context/UserContext';
import { Button, Input, Toggle } from '../../packages/components';
import {
  isBiometricAvailable,
  authenticateWithBiometrics,
  getBiometricPreference,
  getLastUser,
} from '../../packages/utils/biometrics';

const LoginScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState('Biometric');
  const [lastUser, setLastUser] = useState(null);

  const handleLogin = () => {
    // Auto-login with entered details (even if incorrect)
    // User type will be determined by credentials in the future
    login(
      {
        email: email || 'user@example.com',
        name: email.split('@')[0] || 'User',
      },
      'renter' // Always renter for now - will be auto-detected from credentials later
    );
    // Navigation will happen automatically via MainNavigator
  };

  const handleGoogleLogin = () => {
    // Auto-login with Google
    // User type will be determined by credentials in the future
    login({ email: 'test@google.com', name: 'Test User' }, 'renter');
    // Navigation will happen automatically via MainNavigator
  };

  const handleAppleLogin = () => {
    // Auto-login with Apple
    // User type will be determined by credentials in the future
    login({ email: 'test@apple.com', name: 'Test User' }, 'renter');
    // Navigation will happen automatically via MainNavigator
  };


  const handleForgotPassword = () => {
    navigation.navigate('ResetPassword');
  };

  // Hide header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Check biometric availability and preference on mount
  useEffect(() => {
    const checkBiometrics = async () => {
      const availability = await isBiometricAvailable();
      if (availability.available) {
        setBiometricAvailable(true);
        setBiometricType(availability.type);
        const enabled = await getBiometricPreference();
        setBiometricEnabled(enabled);
        
        // Get last user if biometric is enabled
        if (enabled) {
          const lastUserData = await getLastUser();
          if (lastUserData) {
            setLastUser(lastUserData);
          }
        }
      }
    };
    checkBiometrics();
  }, []);

  const handleBiometricLogin = async () => {
    if (!biometricAvailable || !biometricEnabled) {
      Alert.alert('Biometric Login', 'Biometric authentication is not available or enabled.');
      return;
    }

    if (!lastUser) {
      Alert.alert('Biometric Login', 'No previous login found. Please login with email and password first.');
      return;
    }

    const result = await authenticateWithBiometrics();
    
    if (result.success) {
      // Login with last user data
      await login(lastUser.userData, lastUser.userType);
    } else if (result.error && result.error !== 'UserCancel') {
      Alert.alert('Authentication Failed', 'Biometric authentication failed. Please try again or use password.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Welcome Headline */}
        <View style={styles.headlineSection}>
          <Text style={[styles.headline, { color: theme.colors.textPrimary }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subheadline, { color: theme.colors.textSecondary }]}>
            Sign in to continue
          </Text>
        </View>

        <View style={styles.formSection}>
        <View style={styles.inputWrapper}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.centeredInput}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.centeredInput}
          />
        </View>

        {/* Remember Me and Forgot Password Row */}
        <View style={styles.rememberForgotRow}>
          <View style={styles.toggleWrapper}>
            <Toggle
              label="Remember Me"
              value={rememberMe}
              onValueChange={setRememberMe}
              style={styles.rememberMeToggle}
            />
          </View>
          <TouchableOpacity
            onPress={handleForgotPassword}
            activeOpacity={0.7}
            style={styles.forgotPasswordWrapper}
          >
            <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Biometric Login Button */}
        {biometricAvailable && biometricEnabled && lastUser && (
          <TouchableOpacity
            style={[styles.biometricButton, { borderColor: theme.colors.primary }]}
            onPress={handleBiometricLogin}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={biometricType === 'Face ID' ? 'scan-outline' : 'finger-print-outline'} 
              size={24} 
              color={theme.colors.primary} 
              style={styles.biometricIcon}
            />
            <Text style={[styles.biometricButtonText, { color: theme.colors.primary }]}>
              Login with {biometricType}
            </Text>
          </TouchableOpacity>
        )}

        {/* Divider before regular login if biometric is shown */}
        {biometricAvailable && biometricEnabled && lastUser && (
          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.hint }]} />
            <Text style={[styles.dividerText, { color: theme.colors.hint }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.hint }]} />
          </View>
        )}

        {/* Login Button */}
        <Button
          title="Login"
          onPress={handleLogin}
          variant="primary"
          style={styles.loginButton}
        />

        {/* Sign Up Link */}
        <View style={styles.signupLinkContainer}>
          <Text style={[styles.signupLinkText, { color: theme.colors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            activeOpacity={0.7}
          >
            <Text style={[styles.signupLinkButton, { color: theme.colors.primary }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.hint }]} />
          <Text style={[styles.dividerText, { color: theme.colors.hint }]}>OR</Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.hint }]} />
        </View>

        {/* Social Login Buttons */}
        <View style={styles.socialButtonsRow}>
          <TouchableOpacity
            style={[styles.socialButton, { borderColor: theme.colors.hint }]}
            onPress={handleGoogleLogin}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: 'https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_128dp.png' }}
              style={styles.googleLogo}
              resizeMode="contain"
            />
            <Text style={[styles.socialButtonText, { color: theme.colors.textPrimary }]}>
              Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, { borderColor: theme.colors.hint }]}
            onPress={handleAppleLogin}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-apple" size={20} color={theme.colors.textPrimary} style={styles.socialIcon} />
            <Text style={[styles.socialButtonText, { color: theme.colors.textPrimary }]}>
              Apple
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  headlineSection: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 8,
    alignItems: 'center',
  },
  headline: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheadline: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
  formSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  inputWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  centeredInput: {
    width: '100%',
    maxWidth: 400,
  },
  rememberForgotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -8,
    marginBottom: 24,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  toggleWrapper: {
    flex: 1,
    flexShrink: 1,
    marginRight: 8,
  },
  rememberMeToggle: {
    flex: 0,
  },
  forgotPasswordWrapper: {
    flexShrink: 0,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  loginButton: {
    marginTop: 0,
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.3,
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    paddingHorizontal: 16,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    gap: 12,
    marginBottom: 20,
  },
  socialButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    gap: 8,
  },
  socialIcon: {
    marginRight: 0,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 0,
  },
  socialButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  signupLinkText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  signupLinkButton: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  biometricButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  biometricIcon: {
    marginRight: 12,
  },
  biometricButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default LoginScreen;
