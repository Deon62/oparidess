import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../packages/theme/ThemeProvider';

const emergencyOptions = [
  { id: 'accident', label: 'Accident report', icon: 'car-sport-outline' },
  { id: 'breakdown', label: 'Breakdown', icon: 'construct-outline' },
  { id: 'security', label: 'Security threat', icon: 'shield-outline' },
];

const EmergencyOptionsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({ tabBarStyle: { display: 'none' } });
      return () => {
        parent?.setOptions({ tabBarStyle: undefined });
      };
    }, [navigation])
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24, backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { marginTop: 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: theme.colors.white }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Emergency</Text>

      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Choose the situation so we can get you to the right help quickly.
      </Text>

      <View style={styles.optionsContainer}>
        {emergencyOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionCard, { backgroundColor: theme.colors.white, shadowColor: '#000' }]}
            activeOpacity={0.85}
            onPress={() => {
              // Destination screens to be wired later
              // navigation.navigate('Emergency' + option.id)
            }}
          >
            <Ionicons name={option.icon} size={24} color={theme.colors.primary} />
            <Text style={[styles.optionLabel, { color: theme.colors.textPrimary }]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 6,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 14,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default EmergencyOptionsScreen;
