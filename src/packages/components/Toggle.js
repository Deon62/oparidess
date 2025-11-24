import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

const Toggle = ({ label, value, onValueChange, style }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.toggle,
          {
            backgroundColor: value ? theme.colors.primary : '#E0E0E0',
          },
        ]}
      >
        <View
          style={[
            styles.toggleCircle,
            {
              transform: [{ translateX: value ? 18 : 2 }],
            },
          ]}
        />
      </View>
      {label && (
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggle: {
    width: 40,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    padding: 2,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    flex: 1,
  },
});

export default Toggle;

