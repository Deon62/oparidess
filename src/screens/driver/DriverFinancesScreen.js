import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';

const DriverFinancesScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, year

  // Mock financial data
  const earningsData = {
    week: {
      total: 1250,
      rides: 18,
      average: 69.44,
    },
    month: {
      total: 4850,
      rides: 72,
      average: 67.36,
    },
    year: {
      total: 58200,
      rides: 864,
      average: 67.36,
    },
  };

  const transactions = [
    {
      id: 1,
      type: 'earned',
      amount: 25,
      description: 'Ride from Nairobi CBD to Airport',
      date: '2024-01-15',
      time: '2:30 PM',
      status: 'completed',
    },
    {
      id: 2,
      type: 'earned',
      amount: 20,
      description: 'Ride from Westlands to Karen',
      date: '2024-01-15',
      time: '3:15 PM',
      status: 'completed',
    },
    {
      id: 3,
      type: 'withdrawal',
      amount: -500,
      description: 'Withdrawal to M-PESA',
      date: '2024-01-14',
      time: '10:00 AM',
      status: 'completed',
    },
    {
      id: 4,
      type: 'earned',
      amount: 15,
      description: 'Ride from Parklands to Kilimani',
      date: '2024-01-14',
      time: '4:00 PM',
      status: 'completed',
    },
    {
      id: 5,
      type: 'earned',
      amount: 30,
      description: 'Ride from Karen to Westlands',
      date: '2024-01-13',
      time: '11:30 AM',
      status: 'completed',
    },
  ];

  const currentData = earningsData[selectedPeriod];

  const formatCurrency = (amount) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {['week', 'month', 'year'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              {
                backgroundColor: selectedPeriod === period ? theme.colors.primary : theme.colors.white,
              },
            ]}
            onPress={() => setSelectedPeriod(period)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.periodButtonText,
                {
                  color: selectedPeriod === period ? theme.colors.white : theme.colors.textSecondary,
                  fontFamily: selectedPeriod === period ? 'Nunito_700Bold' : 'Nunito_600SemiBold',
                },
              ]}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Earnings Summary */}
      <View style={styles.summaryContainer}>
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.white }]}>
          <View style={styles.summaryHeader}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Total Earnings
            </Text>
            <Ionicons name="cash-outline" size={24} color={theme.colors.primary} />
          </View>
          <Text style={[styles.summaryAmount, { color: theme.colors.textPrimary }]}>
            {formatCurrency(currentData.total)}
          </Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={[styles.summaryStatValue, { color: theme.colors.textPrimary }]}>
                {currentData.rides}
              </Text>
              <Text style={[styles.summaryStatLabel, { color: theme.colors.textSecondary }]}>
                Rides
              </Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={[styles.summaryStatValue, { color: theme.colors.textPrimary }]}>
                {formatCurrency(currentData.average)}
              </Text>
              <Text style={[styles.summaryStatLabel, { color: theme.colors.textSecondary }]}>
                Avg/Ride
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.white }]}>
          <Ionicons name="trending-up-outline" size={24} color="#4CAF50" />
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
            +12%
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            vs Last Period
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.white }]}>
          <Ionicons name="wallet-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
            {formatCurrency(850)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Available Balance
          </Text>
        </View>
      </View>

      {/* Transactions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Recent Transactions
        </Text>
        {transactions.map((transaction) => (
          <Card key={transaction.id} style={[styles.transactionCard, { backgroundColor: theme.colors.white }]}>
            <View style={styles.transactionHeader}>
              <View
                style={[
                  styles.transactionIcon,
                  {
                    backgroundColor:
                      transaction.type === 'earned'
                        ? theme.colors.primary + '20'
                        : '#FF3B30' + '20',
                  },
                ]}
              >
                <Ionicons
                  name={transaction.type === 'earned' ? 'arrow-down' : 'arrow-up'}
                  size={20}
                  color={transaction.type === 'earned' ? theme.colors.primary : '#FF3B30'}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={[styles.transactionDescription, { color: theme.colors.textPrimary }]}>
                  {transaction.description}
                </Text>
                <View style={styles.transactionMeta}>
                  <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>
                    {formatDate(transaction.date)} • {transaction.time}
                  </Text>
                  {transaction.status === 'pending' && (
                    <View style={[styles.statusBadge, { backgroundColor: '#FFA500' + '20' }]}>
                      <Text style={[styles.statusText, { color: '#FFA500' }]}>Pending</Text>
                    </View>
                  )}
                </View>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  {
                    color: transaction.type === 'earned' ? theme.colors.primary : '#FF3B30',
                  },
                ]}
              >
                {transaction.type === 'earned' ? '+' : ''}
                {formatCurrency(transaction.amount)}
              </Text>
            </View>
          </Card>
        ))}
      </View>

      {/* Withdrawal Button */}
      <View style={styles.withdrawalContainer}>
        <TouchableOpacity
          style={[styles.withdrawalButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            // TODO: Navigate to withdrawal screen
            console.log('Withdraw funds');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="wallet-outline" size={20} color={theme.colors.white} />
          <Text style={[styles.withdrawalButtonText, { color: theme.colors.white }]}>
            Withdraw Funds
          </Text>
        </TouchableOpacity>
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
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodButtonText: {
    fontSize: 14,
  },
  summaryContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  summaryAmount: {
    fontSize: 36,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    gap: 24,
  },
  summaryStat: {
    flex: 1,
  },
  summaryStatValue: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  summaryStatLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  transactionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Nunito_600SemiBold',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  withdrawalContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  withdrawalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  withdrawalButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
});

export default DriverFinancesScreen;

