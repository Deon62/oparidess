import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const InsuranceDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Hide default header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Hide bottom tab bar and ensure status bar is visible when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      // Ensure status bar is visible
      StatusBar.setHidden(false);
      StatusBar.setBarStyle('dark-content');
      return () => {
        // Restore tab bar when leaving this screen
        navigation.getParent()?.setOptions({
          tabBarStyle: { display: 'flex' },
        });
      };
    }, [navigation])
  );

  const insuranceCovers = [
    {
      title: 'Collision Damage Waiver (CDW)',
      description: 'Protects you from financial responsibility in case of collision damage to the rental vehicle.',
      details: [
        'Covers damage to the rental vehicle in case of collision',
        'Reduces your liability to a minimal excess amount',
        'Applies regardless of who is at fault',
        'Does not cover damage to other vehicles or property',
      ],
      icon: 'car-sport',
    },
    {
      title: 'Theft Protection',
      description: 'Provides coverage if the rental vehicle is stolen during your rental period.',
      details: [
        'Full coverage if vehicle is stolen and not recovered',
        'Covers theft of vehicle parts and accessories',
        'Requires police report within 24 hours',
        'Excess applies if vehicle is recovered with damage',
      ],
      icon: 'shield-checkmark',
    },
    {
      title: 'Third Party Liability',
      description: 'Covers damages and injuries to third parties in case of an accident.',
      details: [
        'Minimum coverage of KSh 5,000,000',
        'Covers medical expenses for third parties',
        'Covers property damage to third parties',
        'Legal defense costs included',
      ],
      icon: 'people',
    },
    {
      title: 'Personal Accident Coverage',
      description: 'Provides medical coverage for you and your passengers in case of an accident.',
      details: [
        'Medical expenses up to KSh 1,000,000 per person',
        'Covers driver and up to 4 passengers',
        '24/7 emergency assistance included',
        'Death and disability benefits included',
      ],
      icon: 'medical',
    },
  ];

  const importantNotes = [
    {
      title: 'Excess Amount',
      description: 'You will be responsible for an excess amount of KSh 50,000 in case of a claim. This amount is deducted from the total claim amount.',
    },
    {
      title: 'What is Not Covered',
      description: 'The insurance does not cover: damage to tires and windscreens (unless caused by collision), damage from driving under the influence, damage from racing or off-road driving, personal belongings left in the vehicle, and damage from unauthorized drivers.',
    },
    {
      title: 'Claims Process',
      description: 'In case of an accident or damage, immediately contact our support team and file a report. Take photos of the damage and obtain a police report if required. Claims are processed within 5-7 business days.',
    },
    {
      title: 'Coverage Period',
      description: 'Insurance coverage is active from the moment you pick up the vehicle until you return it. Coverage does not extend beyond the rental period specified in your booking.',
    },
  ];

  const instructions = [
    'Review all coverage details before enabling insurance',
    'Keep your insurance documents accessible during the rental period',
    'Report any incidents immediately to our support team',
    'Follow all traffic laws and rental terms to maintain coverage',
    'Keep the vehicle in good condition and return it as received',
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Custom Header */}
      <View style={[styles.customHeader, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
            Insurance Details
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Additional Insurance Coverage
          </Text>
          <Text style={[styles.introText, { color: theme.colors.textSecondary }]}>
            Our comprehensive insurance package provides extensive protection for your peace of mind during your rental period. The coverage includes multiple protection layers to ensure you're well-protected against various risks.
          </Text>
          <View style={[styles.priceInfo, { backgroundColor: theme.colors.primary + '10' }]}>
            <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
            <Text style={[styles.priceText, { color: theme.colors.textPrimary }]}>
              Insurance Cost: KSh 1,500 per day
            </Text>
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Coverage Details Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Coverage Details
          </Text>
          {insuranceCovers.map((cover, index) => (
            <View key={index} style={styles.coverCard}>
              <View style={styles.coverHeader}>
                <View style={[styles.coverIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Ionicons name={cover.icon} size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.coverHeaderText}>
                  <Text style={[styles.coverTitle, { color: theme.colors.textPrimary }]}>
                    {cover.title}
                  </Text>
                </View>
              </View>
              <Text style={[styles.coverDescription, { color: theme.colors.textSecondary }]}>
                {cover.description}
              </Text>
              <View style={styles.coverDetailsList}>
                {cover.details.map((detail, detailIndex) => (
                  <View key={detailIndex} style={styles.coverDetailItem}>
                    <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
                    <Text style={[styles.coverDetailText, { color: theme.colors.textSecondary }]}>
                      {detail}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Important Notes Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Important Notes
          </Text>
          {importantNotes.map((note, index) => (
            <View key={index} style={styles.noteCard}>
              <Text style={[styles.noteTitle, { color: theme.colors.textPrimary }]}>
                {note.title}
              </Text>
              <Text style={[styles.noteDescription, { color: theme.colors.textSecondary }]}>
                {note.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Instructions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Important Instructions
          </Text>
          <View style={styles.instructionsList}>
            {instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={[styles.instructionNumber, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Text style={[styles.instructionNumberText, { color: theme.colors.primary }]}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
                  {instruction}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Contact Section */}
        <View style={styles.section}>
          <View style={[styles.contactCard, { backgroundColor: theme.colors.primary + '10' }]}>
            <Ionicons name="help-circle" size={24} color={theme.colors.primary} />
            <Text style={[styles.contactTitle, { color: theme.colors.textPrimary }]}>
              Need Help?
            </Text>
            <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
              If you have any questions about insurance coverage or need assistance with a claim, please contact our support team.
            </Text>
            <TouchableOpacity
              style={[styles.contactButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('CustomerSupport')}
              activeOpacity={0.7}
            >
              <Text style={[styles.contactButtonText, { color: theme.colors.white }]}>
                Contact Support
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customHeader: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  sectionSeparator: {
    borderTopWidth: 1,
    marginHorizontal: 24,
    marginTop: 16,
  },
  section: {
    marginHorizontal: 24,
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  introText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
    marginBottom: 16,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  priceText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    flex: 1,
  },
  coverCard: {
    marginBottom: 20,
  },
  coverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  coverIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverHeaderText: {
    flex: 1,
  },
  coverTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  coverDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  coverDetailsList: {
    gap: 8,
  },
  coverDetailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  coverDetailText: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
    flex: 1,
  },
  noteCard: {
    marginBottom: 16,
  },
  noteTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  noteDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionNumberText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
    flex: 1,
  },
  contactCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginTop: 12,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  contactButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  contactButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default InsuranceDetailsScreen;

