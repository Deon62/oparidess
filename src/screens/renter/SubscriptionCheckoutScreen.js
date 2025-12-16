import React, { useLayoutEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../packages/theme/ThemeProvider';

const mpesaLogo = require('../../../assets/images/mpesa.png');

const SubscriptionCheckoutScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const planId = route.params?.planId ?? 'classic';
  const planTitle = route.params?.planTitle ?? 'Classic Plan';
  const planSubtitle = route.params?.planSubtitle ?? 'Seamless car subscriptions';
  const amount = route.params?.amount ?? 85_000;

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('mpesa');

  const tax = useMemo(() => Math.round(amount * 0.02), [amount]);
  const total = useMemo(() => amount + tax, [amount, tax]);

  const ribbonIconName = useMemo(() => {
    if (planId === 'free') return 'ribbon-outline';
    return 'ribbon';
  }, [planId]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const formatKes = (value) => {
    try {
      return `KES ${Number(value).toLocaleString('en-KE')}`;
    } catch {
      return `KES ${value}`;
    }
  };

  const handleSubscribe = () => {
    // Placeholder for payment flow
    navigation.goBack();
  };

  const mpesaName = route.params?.mpesaName ?? 'John Doe';
  const mpesaPhone = route.params?.mpesaPhone ?? '+254 7XX XXX XXX';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}> 
        <TouchableOpacity
          style={[styles.headerBack, { backgroundColor: theme.colors.white }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Subscription</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.planTop}>
          <Ionicons name={ribbonIconName} size={74} color={theme.colors.primary} style={styles.ribbonIcon} />
          <Text style={[styles.planTitle, { color: theme.colors.textPrimary }]}>{planTitle}</Text>
          <Text style={[styles.planSubtitle, { color: theme.colors.textSecondary }]}>{planSubtitle}</Text>
        </View>

        <View style={styles.paymentMethods}>
          <TouchableOpacity
            style={[
              styles.paymentMethodCard,
              { backgroundColor: theme.colors.white },
              selectedPaymentMethodId === 'mpesa' ? styles.paymentMethodCardSelected : null,
            ]}
            onPress={() => setSelectedPaymentMethodId('mpesa')}
            activeOpacity={0.9}
          >
            <View style={styles.paymentMethodTopRow}>
              <View style={styles.paymentMethodLeft}>
                <Image source={mpesaLogo} style={styles.mpesaLogo} resizeMode="contain" />
                <View>
                  <Text style={[styles.paymentMethodTitle, { color: theme.colors.textPrimary }]}>M-Pesa</Text>
                  <Text style={[styles.paymentMethodSub, { color: theme.colors.textSecondary }]}>{mpesaName}</Text>
                </View>
              </View>
              <Ionicons
                name={selectedPaymentMethodId === 'mpesa' ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={selectedPaymentMethodId === 'mpesa' ? '#0B1B3A' : theme.colors.hint}
              />
            </View>
            <Text style={[styles.paymentMethodMeta, { color: theme.colors.textSecondary }]}>{mpesaPhone}</Text>
            <Text style={[styles.paymentMethodHint, { color: theme.colors.textSecondary }]}>You’ll receive an STK push to complete payment.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentMethodCard,
              { backgroundColor: theme.colors.white },
              selectedPaymentMethodId === 'card' ? styles.paymentMethodCardSelected : null,
            ]}
            onPress={() => setSelectedPaymentMethodId('card')}
            activeOpacity={0.9}
          >
            <View style={styles.paymentMethodTopRow}>
              <View style={styles.paymentMethodLeft}>
                <Ionicons name="card-outline" size={22} color={theme.colors.textPrimary} />
                <View>
                  <Text style={[styles.paymentMethodTitle, { color: theme.colors.textPrimary }]}>Card</Text>
                  <Text style={[styles.paymentMethodSub, { color: theme.colors.textSecondary }]}>•••• 7173</Text>
                </View>
              </View>
              <Ionicons
                name={selectedPaymentMethodId === 'card' ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={selectedPaymentMethodId === 'card' ? '#0B1B3A' : theme.colors.hint}
              />
            </View>
            <Text style={[styles.paymentMethodMeta, { color: theme.colors.textSecondary }]}>JANE FOX • 09/28</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.summary, { backgroundColor: theme.colors.white }]}> 
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Amount</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.textPrimary }]}>{formatKes(amount)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Tax</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.textPrimary }]}>{formatKes(tax)}</Text>
          </View>

          <View style={[styles.summaryDivider, { backgroundColor: '#EFEFEF' }]} />

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryTotalLabel, { color: theme.colors.textPrimary }]}>Total</Text>
            <Text style={[styles.summaryTotalValue, { color: theme.colors.textPrimary }]}>{formatKes(total)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: '#FF1577' }]}
          onPress={handleSubscribe}
          activeOpacity={0.9}
        >
          <Text style={[styles.ctaText, { color: theme.colors.white }]}>Get Subscription</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  planTop: {
    alignItems: 'center',
    marginBottom: 18,
  },
  ribbonIcon: {
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
  },
  paymentMethods: {
    gap: 12,
    marginBottom: 18,
  },
  paymentMethodCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(11, 27, 58, 0.10)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  paymentMethodCardSelected: {
    borderColor: 'rgba(11, 27, 58, 0.35)',
  },
  paymentMethodTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mpesaLogo: {
    width: 38,
    height: 20,
  },
  paymentMethodTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 2,
  },
  paymentMethodSub: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  paymentMethodMeta: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 6,
  },
  paymentMethodHint: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 18,
  },
  summary: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  summaryDivider: {
    height: 1,
    marginVertical: 10,
  },
  summaryTotalLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  summaryTotalValue: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  ctaButton: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 0.2,
  },
});

export default SubscriptionCheckoutScreen;
