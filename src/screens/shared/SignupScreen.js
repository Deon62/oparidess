import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button, Input } from '../../packages/components';

const SignupScreen = () => {
  const theme = useTheme();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignup = () => {
    // TODO: Implement signup logic
    console.log('Signup:', formData);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.form}>
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.name}
          onChangeText={(value) => updateField('name', value)}
        />
        <Input
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(value) => updateField('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Phone Number"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChangeText={(value) => updateField('phone', value)}
          keyboardType="phone-pad"
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
        <Button
          title="Sign Up"
          onPress={handleSignup}
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
  },
  form: {
    marginTop: 24,
  },
  button: {
    marginTop: 8,
  },
});

export default SignupScreen;

