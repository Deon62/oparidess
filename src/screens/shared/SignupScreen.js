import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useUser } from '../../packages/context/UserContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Button, Input, Toggle } from '../../packages/components';

const SignupScreen = () => {
  const theme = useTheme();
  const { login } = useUser();
  const route = useRoute();
  const navigation = useNavigation();
  const { userType = 'renter' } = route.params || {};
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    referralCode: '',
  });
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);
  const [showReferralCode, setShowReferralCode] = React.useState(false);

  const handleSignup = () => {
    if (!agreeToTerms) {
      // TODO: Show error that terms must be agreed to
      return;
    }
    // Auto-login with entered details (even if incorrect)
    login(
      {
        email: formData.email || 'user@example.com',
        name: formData.email.split('@')[0] || 'User',
      },
      userType
    );
    // Navigation will happen automatically via MainNavigator
  };

  const handleGoogleSignup = () => {
    // Auto-login with Google (using selected userType)
    login({ email: 'test@google.com', name: 'Test User' }, userType);
    // Navigation will happen automatically via MainNavigator
  };

  const handleAppleSignup = () => {
    // Auto-login with Apple (using selected userType)
    login({ email: 'test@apple.com', name: 'Test User' }, userType);
    // Navigation will happen automatically via MainNavigator
  };

  const handleMobileSignup = () => {
    // Auto-signup with Mobile
    Alert.alert('Mobile Signup', 'Mobile number signup will be implemented soon.');
    // login({ email: 'mobile@example.com', name: 'Mobile User' }, userType);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Hide header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <Text 
            style={[styles.taglineText, { color: theme.colors.textPrimary }]}
            allowFontScaling={false}
          >
            Welcome to Opa😉
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
        <View style={styles.inputWrapper}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.centeredInput}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Input
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(value) => updateField('password', value)}
            secureTextEntry
            style={styles.centeredInput}
          />
        </View>
        {/* Referral Code - Optional and Collapsible */}
        {!showReferralCode ? (
          <TouchableOpacity
            onPress={() => setShowReferralCode(true)}
            style={styles.referralLinkContainer}
            activeOpacity={0.7}
          >
            <Text style={[styles.referralLinkText, { color: theme.colors.primary }]}>
              Have a referral code? (Optional)
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.inputWrapper}>
            <Input
              label="Referral Code (Optional)"
              placeholder="Enter the code you received from a friend"
              value={formData.referralCode}
              onChangeText={(value) => updateField('referralCode', value)}
              autoCapitalize="characters"
              style={styles.centeredInput}
            />
            <TouchableOpacity
              onPress={() => {
                setShowReferralCode(false);
                updateField('referralCode', '');
              }}
              style={styles.removeReferralButton}
              activeOpacity={0.7}
            >
              <Text style={[styles.removeReferralText, { color: theme.colors.hint }]}>
                Remove referral code
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Terms Toggle */}
        <View style={styles.termsContainer}>
          <Toggle
            value={agreeToTerms}
            onValueChange={setAgreeToTerms}
            label="I agree to the Terms and Conditions"
          />
        </View>

        {/* Sign Up Button */}
        <Button
          title="Sign Up"
          onPress={handleSignup}
          variant="primary"
          style={styles.signupButton}
          disabled={!agreeToTerms}
        />

        {/* Login Link */}
        <View style={styles.loginLinkContainer}>
          <Text style={[styles.loginLinkText, { color: theme.colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={[styles.loginLinkButton, { color: theme.colors.primary }]}>
              Login
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
        <TouchableOpacity
          style={[styles.socialButton, { borderColor: theme.colors.hint }]}
          onPress={handleMobileSignup}
          activeOpacity={0.7}
        >
          <Ionicons name="phone-portrait-outline" size={20} color={theme.colors.textPrimary} style={styles.socialIcon} />
          <Text style={[styles.socialButtonText, { color: theme.colors.textPrimary }]}>
            Continue with Mobile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { borderColor: theme.colors.hint }]}
          onPress={handleGoogleSignup}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: 'https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_128dp.png' }}
            style={styles.googleLogo}
            resizeMode="contain"
          />
          <Text style={[styles.socialButtonText, { color: theme.colors.textPrimary }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { borderColor: theme.colors.hint }]}
          onPress={handleAppleSignup}
          activeOpacity={0.7}
        >
          <Ionicons name="logo-apple" size={20} color={theme.colors.textPrimary} style={styles.socialIcon} />
          <Text style={[styles.socialButtonText, { color: theme.colors.textPrimary }]}>
            Continue with Apple
          </Text>
        </TouchableOpacity>
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
    paddingBottom: 20,
  },
  taglineContainer: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 16,
    alignItems: 'center',
  },
  taglineText: {
    fontSize: 22,
    fontFamily: 'Nunito_600SemiBold',
    textAlign: 'center',
  },
  formSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  inputWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  centeredInput: {
    width: '100%',
    maxWidth: 400,
  },
  referralLinkContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  referralLinkText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    textDecorationLine: 'underline',
  },
  removeReferralButton: {
    alignItems: 'flex-start',
    marginTop: -8,
    marginBottom: 8,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  removeReferralText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    fontStyle: 'italic',
  },
  termsContainer: {
    marginTop: 4,
    marginBottom: 16,
  },
  signupButton: {
    marginTop: 0,
    marginBottom: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
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
  socialButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  socialIcon: {
    marginRight: 12,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  loginLinkText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  loginLinkButton: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default SignupScreen;

