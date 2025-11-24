import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useUser } from '../../packages/context/UserContext';
import { Button, Input } from '../../packages/components';

const LoginScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { login } = useUser();
  const { userType: routeUserType } = route.params || {};
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [selectedUserType, setSelectedUserType] = React.useState(routeUserType || 'renter');

  const handleLogin = () => {
    // Auto-login with entered details (even if incorrect)
    login(
      {
        email: email || 'user@example.com',
        name: email.split('@')[0] || 'User',
      },
      selectedUserType
    );
    // Navigation will happen automatically via MainNavigator
  };

  const handleGoogleLogin = () => {
    // Auto-login with Google (using selected userType)
    login({ email: 'test@google.com', name: 'Test User' }, selectedUserType);
    // Navigation will happen automatically via MainNavigator
  };

  const handleAppleLogin = () => {
    // Auto-login with Apple (using selected userType)
    login({ email: 'test@apple.com', name: 'Test User' }, selectedUserType);
    // Navigation will happen automatically via MainNavigator
  };

  const handleForgotPassword = () => {
    navigation.navigate('ResetPassword');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.formSection}>
        {/* Role Selection (only if not coming from route) */}
        {!routeUserType && (
          <View style={styles.roleSelector}>
            <Text style={[styles.roleLabel, { color: theme.colors.textPrimary }]}>
              I want to:
            </Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  {
                    backgroundColor: selectedUserType === 'renter' ? theme.colors.primary : theme.colors.white,
                    borderColor: selectedUserType === 'renter' ? theme.colors.primary : theme.colors.hint,
                  },
                ]}
                onPress={() => setSelectedUserType('renter')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    {
                      color: selectedUserType === 'renter' ? theme.colors.white : theme.colors.textPrimary,
                    },
                  ]}
                >
                  Browse Cars
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  {
                    backgroundColor: selectedUserType === 'owner' ? theme.colors.primary : theme.colors.white,
                    borderColor: selectedUserType === 'owner' ? theme.colors.primary : theme.colors.hint,
                  },
                ]}
                onPress={() => setSelectedUserType('owner')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    {
                      color: selectedUserType === 'owner' ? theme.colors.white : theme.colors.textPrimary,
                    },
                  ]}
                >
                  List Car
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  {
                    backgroundColor: selectedUserType === 'driver' ? theme.colors.primary : theme.colors.white,
                    borderColor: selectedUserType === 'driver' ? theme.colors.primary : theme.colors.hint,
                  },
                ]}
                onPress={() => setSelectedUserType('driver')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    {
                      color: selectedUserType === 'driver' ? theme.colors.white : theme.colors.textPrimary,
                    },
                  ]}
                >
                  Be Driver
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Forgot Password Link */}
        <TouchableOpacity
          onPress={handleForgotPassword}
          style={styles.forgotPasswordContainer}
          activeOpacity={0.7}
        >
          <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <Button
          title="Login"
          onPress={handleLogin}
          variant="primary"
          style={styles.loginButton}
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
          onPress={handleGoogleLogin}
          activeOpacity={0.7}
        >
          <Text style={[styles.socialButtonText, { color: theme.colors.textPrimary }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { borderColor: theme.colors.hint }]}
          onPress={handleAppleLogin}
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: -8,
    marginBottom: 24,
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
  roleSelector: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleButtonText: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    textAlign: 'center',
  },
});

export default LoginScreen;
