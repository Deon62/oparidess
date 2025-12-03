import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';

const CancellationPolicyScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const policySections = [
    {
      title: 'Free Cancellation',
      timeFrame: 'More than 48 hours before pickup',
      refund: '100% refund',
      color: '#4CAF50',
      details: [
        'Full refund of booking fee and rental amount',
        'No cancellation charges',
        'Refund processed within 5-7 business days',
      ],
    },
    {
      title: 'Partial Refund',
      timeFrame: '24-48 hours before pickup',
      refund: '50% refund of booking fee',
      color: '#FF9800',
      details: [
        '50% of booking fee will be refunded',
        'Full rental amount is non-refundable',
        'Refund processed within 5-7 business days',
      ],
    },
    {
      title: 'No Refund',
      timeFrame: 'Less than 24 hours before pickup',
      refund: 'No refund',
      color: '#F44336',
      details: [
        'No refund for cancellations within 24 hours',
        'You may contact support for special circumstances',
        'Disputes can be filed through the dispute system',
      ],
    },
  ];

  const generalTerms = [
    'Cancellations must be made through the app or by contacting customer support',
    'Refunds are processed to the original payment method',
    'Processing time may vary depending on your payment provider',
    'If you need to cancel due to an emergency, contact support immediately',
    'Owner-initiated cancellations result in a full refund to the renter',
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Cancellation Policy
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Understand when and how you can cancel your booking
        </Text>
      </View>

      {policySections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Card style={[styles.policyCard, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.policyHeader, { borderLeftColor: section.color }]}>
              <View style={[styles.policyBadge, { backgroundColor: section.color + '20' }]}>
                <Text style={[styles.policyBadgeText, { color: section.color }]}>
                  {section.refund}
                </Text>
              </View>
              <View style={styles.policyHeaderContent}>
                <Text style={[styles.policyTitle, { color: theme.colors.textPrimary }]}>
                  {section.title}
                </Text>
                <Text style={[styles.policyTimeFrame, { color: theme.colors.textSecondary }]}>
                  {section.timeFrame}
                </Text>
              </View>
            </View>
            <View style={styles.policyDetails}>
              {section.details.map((detail, detailIndex) => (
                <View key={detailIndex} style={styles.detailItem}>
                  <Ionicons name="checkmark-circle" size={16} color={section.color} />
                  <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                    {detail}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      ))}

      <View style={styles.section}>
        <Card style={[styles.generalCard, { backgroundColor: theme.colors.white }]}>
          <View style={styles.generalHeader}>
            <Ionicons name="document-text-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.generalTitle, { color: theme.colors.textPrimary }]}>
              General Terms
            </Text>
          </View>
          <View style={styles.generalList}>
            {generalTerms.map((term, index) => (
              <View key={index} style={styles.termItem}>
                <Text style={[styles.termBullet, { color: theme.colors.primary }]}>•</Text>
                <Text style={[styles.termText, { color: theme.colors.textSecondary }]}>
                  {term}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <View style={[styles.supportCard, { backgroundColor: theme.colors.primary + '10' }]}>
          <Ionicons name="help-circle-outline" size={32} color={theme.colors.primary} />
          <Text style={[styles.supportTitle, { color: theme.colors.textPrimary }]}>
            Need Help?
          </Text>
          <Text style={[styles.supportText, { color: theme.colors.textSecondary }]}>
            If you have questions about cancellations or need to file a dispute, our support team is here to help.
          </Text>
          <TouchableOpacity
            style={[styles.supportButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              // Navigate to CustomerSupport in the ProfileTab
              const parent = navigation.getParent();
              if (parent) {
                parent.navigate('ProfileTab', { screen: 'CustomerSupport' });
              } else {
                navigation.navigate('CustomerSupport');
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.supportButtonText, { color: theme.colors.white }]}>
              Contact Support
            </Text>
          </TouchableOpacity>
        </View>
      </View>

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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  policyCard: {
    padding: 20,
    borderRadius: 16,
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    borderLeftWidth: 4,
    paddingLeft: 12,
    marginLeft: -12,
  },
  policyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  policyBadgeText: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  policyHeaderContent: {
    flex: 1,
  },
  policyTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  policyTimeFrame: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  policyDetails: {
    marginTop: 16,
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  generalCard: {
    padding: 20,
    borderRadius: 16,
  },
  generalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  generalTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  generalList: {
    gap: 12,
  },
  termItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  termBullet: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginTop: -2,
  },
  termText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  supportCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  supportTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginTop: 12,
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  supportButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  supportButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default CancellationPolicyScreen;

