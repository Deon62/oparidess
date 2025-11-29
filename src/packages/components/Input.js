import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  style,
  prefix,
  ...props
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error
              ? '#FF3B30'
              : isFocused
              ? theme.colors.primary
              : '#E0E0E0',
            backgroundColor: theme.colors.white,
          },
        ]}
      >
        {prefix && (
          <Text style={[styles.prefix, { color: theme.colors.textSecondary }]}>
            {prefix}
          </Text>
        )}
        <TextInput
          style={[styles.input, { color: theme.colors.textPrimary }]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.hint}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Text style={[styles.eyeText, { color: theme.colors.hint }]}>
              {showPassword ? 'Show' : 'Hide'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  prefix: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    fontFamily: 'Nunito_400Regular',
  },
  eyeIcon: {
    padding: 4,
  },
  eyeText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Nunito_400Regular',
  },
});

export default Input;

