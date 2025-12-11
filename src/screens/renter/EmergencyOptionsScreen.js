import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../packages/theme/ThemeProvider';

const emergencyOptions = [
  { 
    id: 'accident', 
    label: 'Accident Report', 
    icon: 'alert-circle-outline',
    description: 'Report an accident and get immediate assistance'
  },
  { 
    id: 'breakdown', 
    label: 'Vehicle Breakdown', 
    icon: 'construct-outline',
    description: 'Get roadside assistance or towing services'
  },
  { 
    id: 'security', 
    label: 'Security Threat', 
    icon: 'shield-outline',
    description: 'Report suspicious activity or safety concerns'
  },
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
    <View style={[styles.container, { 
      paddingTop: insets.top + 16, 
      paddingBottom: insets.bottom + 24, 
      backgroundColor: theme.colors.background 
    }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: theme.colors.white }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Emergency Assistance
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Choose the type of emergency so we can connect you to the right help
          </Text>
        </View>

        {/* Emergency Options - No Cards, No Colors */}
        <View style={styles.optionsContainer}>
          {emergencyOptions.map((option, index) => (
            <React.Fragment key={option.id}>
              <TouchableOpacity
                style={styles.optionItem}
                activeOpacity={0.7}
                onPress={() => {
                  // navigation.navigate('Emergency' + option.id)
                }}
              >
                <View style={styles.optionLeft}>
                  <Ionicons name={option.icon} size={22} color={theme.colors.textPrimary} />
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionLabel, { color: theme.colors.textPrimary }]}>
                      {option.label}
                    </Text>
                    <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
                      {option.description}
                    </Text>
                  </View>
                </View>
                <Ionicons 
                  name="chevron-forward-outline" 
                  size={20} 
                  color={theme.colors.textSecondary} 
                />
              </TouchableOpacity>
              
              {/* Subtle separator line */}
              {index < emergencyOptions.length - 1 && (
                <View style={[styles.separator, { backgroundColor: theme.colors.border + '20' }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Emergency Contact Info */}
        <View style={[styles.emergencyInfo, { backgroundColor: theme.colors.background + '80' }]}>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color={theme.colors.textSecondary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              Direct Emergency Line:{' '}
              <Text style={[styles.infoHighlight, { color: theme.colors.textPrimary }]}>999</Text>
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={18} color={theme.colors.textSecondary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              For immediate danger, call 999 first
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginBottom: 40,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
    opacity: 0.8,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 4,
    backgroundColor: 'transparent',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 17,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    opacity: 0.7,
  },
  separator: {
    height: 1,
    marginLeft: 38, // Icon width (22) + gap (16) = 38
    marginRight: 4,
  },
  emergencyInfo: {
    padding: 20,
    borderRadius: 12,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    flex: 1,
    opacity: 0.9,
  },
  infoHighlight: {
    fontFamily: 'Nunito_700Bold',
  },
});

export default EmergencyOptionsScreen;