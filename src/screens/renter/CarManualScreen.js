import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CarManualScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { car, manual, hostPhone } = route.params || {};

  const [expandedSection, setExpandedSection] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${car?.name || 'Car'} Manual`,
    });
  }, [navigation, car]);

  const handleCallOwner = () => {
    if (hostPhone) {
      Linking.openURL(`tel:${hostPhone}`).catch(() => {
        Alert.alert('Error', 'Unable to make phone call');
      });
    } else {
      Alert.alert('Phone Number', 'Owner phone number not available');
    }
  };

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Info */}
        <View style={styles.headerSection}>
          <Text style={[styles.carName, { color: theme.colors.textPrimary }]}>
            {car?.name || 'Car'} Quick Manual
          </Text>
          <Text style={[styles.headerDescription, { color: theme.colors.textSecondary }]}>
            Essential information to help you operate this vehicle safely and efficiently
          </Text>
        </View>

        {/* Quick Call Owner Button */}
        <TouchableOpacity
          style={[styles.callOwnerButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleCallOwner}
          activeOpacity={0.8}
        >
          <Ionicons name="call-outline" size={20} color={theme.colors.white} />
          <Text style={[styles.callOwnerText, { color: theme.colors.white }]}>
            Call Owner
          </Text>
        </TouchableOpacity>

        {/* Manual Sections */}
        {manual?.sections?.map((section, index) => (
          <View key={index} style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(index)}
              activeOpacity={0.7}
            >
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                {section.title}
              </Text>
              <Ionicons
                name={expandedSection === index ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={theme.colors.hint}
              />
            </TouchableOpacity>
            {expandedSection === index && (
              <View style={styles.sectionContent}>
                {section.content.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.manualItem}>
                    <View style={[styles.bulletPoint, { backgroundColor: theme.colors.primary }]} />
                    <Text style={[styles.manualItemText, { color: theme.colors.textSecondary }]}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  headerSection: {
    marginBottom: 24,
    gap: 8,
  },
  carName: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
  },
  callOwnerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  callOwnerText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  section: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  sectionContent: {
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  manualItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    flexShrink: 0,
  },
  manualItemText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
  },
});

export default CarManualScreen;

