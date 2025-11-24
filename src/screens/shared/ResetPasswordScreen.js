import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button, Input } from '../../packages/components';

const ResetPasswordScreen = () => {
  const theme = useTheme();
  const [email, setEmail] = React.useState('');

  const handleResetPassword = () => {
    // TODO: Implement reset password logic
    console.log('Reset password for:', email);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.form}>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <Button
          title="Send Reset Link"
          onPress={handleResetPassword}
          variant="primary"
          style={styles.button}
        />
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
    paddingTop: 32,
  },
  form: {
    marginTop: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Nunito_400Regular',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default ResetPasswordScreen;

