import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useUser } from '../../packages/context/UserContext';
import { Button, Input, Toggle } from '../../packages/components';

const SignupScreen = () => {
  const theme = useTheme();
  const { login } = useUser();
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);

  const handleSignup = () => {
    if (!agreeToTerms) {
      // TODO: Show error that terms must be agreed to
      return;
    }
    // TODO: Implement signup logic
    console.log('Signup:', formData);
  };

  const handleGoogleSignup = () => {
    // For testing: Navigate to renter home
    login({ email: 'test@google.com', name: 'Test User' }, 'renter');
    // Navigation will happen automatically via MainNavigator
  };

  const handleAppleSignup = () => {
    // TODO: Implement Apple signup
    console.log('Apple signup');
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Form Section */}
      <View style={styles.formSection}>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(value) => updateField('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChangeText={(value) => updateField('password', value)}
          secureTextEntry
        />
        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChangeText={(value) => updateField('confirmPassword', value)}
          secureTextEntry
        />

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

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.hint }]} />
          <Text style={[styles.dividerText, { color: theme.colors.hint }]}>OR</Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.hint }]} />
        </View>

        {/* Social Login Buttons */}
        <TouchableOpacity
          style={[styles.socialButton, { borderColor: theme.colors.hint }]}
          onPress={handleGoogleSignup}
          activeOpacity={0.7}
        >
          <Text style={[styles.socialButtonText, { color: theme.colors.textPrimary }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { borderColor: theme.colors.hint }]}
          onPress={handleAppleSignup}
          activeOpacity={0.7}
        >
          <Text style={[styles.socialButtonText, { color: theme.colors.textPrimary }]}>
            Continue with Apple
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
    flexGrow: 1,
    paddingBottom: 40,
  },
  formSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  termsContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  signupButton: {
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
  socialButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  socialButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default SignupScreen;

