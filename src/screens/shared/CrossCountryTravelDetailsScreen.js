import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CrossCountryTravelDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Cross Country Travel',
    });
  }, [navigation]);

  // Hide tab bar when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      return () => {
        // Restore tab bar when navigating away
        navigation.getParent()?.setOptions({
          tabBarStyle: undefined,
        });
      };
    }, [navigation])
  );

  const eastAfricanCountries = [
    { name: 'Kenya', flag: '🇰🇪' },
    { name: 'Tanzania', flag: '🇹🇿' },
    { name: 'Uganda', flag: '🇺🇬' },
    { name: 'Rwanda', flag: '🇷🇼' },
    { name: 'Burundi', flag: '🇧🇮' },
    { name: 'South Sudan', flag: '🇸🇸' },
    { name: 'Ethiopia', flag: '🇪🇹' },
    { name: 'Somalia', flag: '🇸🇴' },
  ];

  const requirements = [
    'Valid international driving permit (IDP)',
    'Vehicle registration documents',
    'Comprehensive insurance coverage',
    'Border crossing documentation',
    'Owner approval for cross-country travel',
    'Emergency contact information',
  ];

  const benefits = [
    'Additional insurance coverage for international travel',
    'Border crossing documentation support',
    '24/7 roadside assistance across borders',
    'Emergency support in case of breakdown',
    'Legal assistance for border-related issues',
  ];

  const importantNotes = [
    'Cross-country travel must be approved by the car owner in advance',
    'Additional charges apply per day of cross-country travel',
    'Some countries may require special permits or documentation',
    'Vehicle must be returned to the original pickup country',
    'Any damages or issues must be reported immediately',
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
          <Ionicons name="globe-outline" size={32} color={theme.colors.primary} />
        </View>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Cross Country Travel
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Travel across East African countries with ease and peace of mind
        </Text>
      </View>

      {/* Allowed Countries Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="map-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Allowed Countries
          </Text>
        </View>
        <Text style={[styles.sectionDescription, { color: theme.colors.textSecondary }]}>
          You can travel to the following East African countries with this add-on:
        </Text>
        <View style={styles.countriesList}>
          {eastAfricanCountries.map((country, index) => (
            <View key={index} style={styles.countryItem}>
              <Text style={styles.countryFlag}>{country.flag}</Text>
              <Text style={[styles.countryName, { color: theme.colors.textPrimary }]}>
                {country.name}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Separator Line */}
      <View style={[styles.separator, { backgroundColor: theme.colors.hint + '30' }]} />

      {/* Requirements Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="document-text-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Requirements
          </Text>
        </View>
        <View style={styles.list}>
          {requirements.map((requirement, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text style={[styles.listText, { color: theme.colors.textSecondary }]}>
                {requirement}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Separator Line */}
      <View style={[styles.separator, { backgroundColor: theme.colors.hint + '30' }]} />

      {/* Benefits Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="star-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            What's Included
          </Text>
        </View>
        <View style={styles.list}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.listText, { color: theme.colors.textSecondary }]}>
                {benefit}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Separator Line */}
      <View style={[styles.separator, { backgroundColor: theme.colors.hint + '30' }]} />

      {/* Important Notes Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle-outline" size={24} color="#FF9800" />
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Important Notes
          </Text>
        </View>
        <View style={styles.list}>
          {importantNotes.map((note, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="alert-circle-outline" size={20} color="#FF9800" />
              <Text style={[styles.listText, { color: theme.colors.textSecondary }]}>
                {note}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
    marginBottom: 16,
  },
  countriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    minWidth: '45%',
  },
  countryFlag: {
    fontSize: 24,
  },
  countryName: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  separator: {
    height: 1,
    marginHorizontal: 24,
  },
  list: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
});

export default CrossCountryTravelDetailsScreen;

