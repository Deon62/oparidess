import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../packages/theme/ThemeProvider';

import EmergencyIcon from '../../../assets/icons/emergency.svg';

const emergencyOptions = [
  { 
    id: 'accident', 
    label: 'Report accident', 
  },
  { 
    id: 'breakdown', 
    label: 'Report breakdown', 
  },
  { 
    id: 'security', 
    label: 'Report security threat', 
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
        <View style={styles.hero}>
          <EmergencyIcon width={220} height={220} />
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Emergency
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
                  if (option.id === 'security') {
                    navigation.navigate('ReportSecurityThreat');
                  }
                  if (option.id === 'breakdown') {
                    navigation.navigate('ReportBreakdown');
                  }
                }}
              >
                <Text style={[styles.optionLabel, { color: theme.colors.textPrimary }]}>
                  {option.label}
                </Text>
                <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              
              {/* Subtle separator line */}
              {index < emergencyOptions.length - 1 && (
                <View style={[styles.separator, { backgroundColor: theme.colors.border + '20' }]} />
              )}
            </React.Fragment>
          ))}
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
  hero: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  titleContainer: {
    marginBottom: 20,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 4,
    backgroundColor: 'transparent',
  },
  optionLabel: {
    fontSize: 17,
    fontFamily: 'Nunito_600SemiBold',
    flex: 1,
  },
  separator: {
    height: 1,
    marginLeft: 4,
    marginRight: 4,
  },
});

export default EmergencyOptionsScreen;