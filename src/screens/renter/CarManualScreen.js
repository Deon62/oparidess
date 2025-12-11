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

  const [expandedSections, setExpandedSections] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

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
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity
        style={[
          styles.backButton,
          { top: insets.top + 12, left: 16, backgroundColor: theme.colors.white },
        ]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
      </TouchableOpacity>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + 48 }]}
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
        {(manual?.sections?.length ? manual.sections : [
          {
            title: 'Getting Started',
            content: [
              'Locate the key fob in the provided key box.',
              'Press unlock button twice to unlock all doors.',
              'Adjust driver seat and mirrors before starting.',
              'Insert key or press start button (if keyless).',
              'Fasten your seatbelt and ensure passengers do the same.',
              'Check fuel level and tire pressure before driving.',
            ],
          },
          {
            title: 'Important Controls',
            content: [
              'AC controls are on the center console.',
              'Parking brake: pull lever up to engage.',
              'Headlights: turn dial on the left of steering wheel.',
              'Hazard lights: press the red triangle button.',
              'Wipers: toggle stalk on the right of steering wheel.',
              'Fuel cap release is near the driver’s seat base.',
            ],
          },
          {
            title: 'Safety & Assistance',
            content: [
              'ABS braking system is active—apply steady pressure.',
              'Airbags are located in front and side pillars.',
              'Use child locks for rear doors when needed.',
              'For breakdowns, pull over safely and switch on hazards.',
              'Emergency contacts are in the glovebox and in the app.',
              'Call the host if any warning lights stay on.',
            ],
          },
        ]).map((section, index, arr) => {
          const isExpanded = !!expandedSections[index];
          const hasMore = section.content.length > 5;
          const visibleContent = isExpanded ? section.content : section.content.slice(0, 5);

          return (
            <View key={index} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                {section.title}
              </Text>

              <View style={styles.sectionContent}>
                {visibleContent.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.manualItem}>
                    <View style={[styles.bulletPoint, { backgroundColor: theme.colors.primary }]} />
                    <Text style={[styles.manualItemText, { color: theme.colors.textSecondary }]}>
                      {item}
                    </Text>
                  </View>
                ))}

                {hasMore && (
                  <TouchableOpacity
                    onPress={() => toggleSection(index)}
                    activeOpacity={0.7}
                    style={styles.readMoreButton}
                  >
                    <Text style={[styles.readMoreText, { color: theme.colors.primary }]}>
                      {isExpanded ? 'Read less' : 'Read more'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {index < arr.length - 1 && (
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
              )}
            </View>
          );
        })}

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
  backButton: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
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
    marginBottom: 20,
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  sectionContent: {
    paddingVertical: 4,
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
  sectionSeparator: {
    borderTopWidth: 1,
    marginTop: 12,
    marginBottom: 12,
  },
  readMoreButton: {
    paddingVertical: 6,
  },
  readMoreText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default CarManualScreen;

