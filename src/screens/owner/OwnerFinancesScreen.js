import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';

const OwnerFinancesScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, year

  // Commission rate (15%)
  const COMMISSION_RATE = 0.15;

  // Mock financial data
  const earningsData = {
    week: {
      gross: 1250,
      bookings: 18,
      average: 69.44,
    },
    month: {
      gross: 4850,
      bookings: 72,
      average: 67.36,
    },
    year: {
      gross: 58200,
      bookings: 864,
      average: 67.36,
    },
  };

  // Calculate commission and net earnings
  const calculateCommission = (gross) => {
    return gross * COMMISSION_RATE;
  };

  const currentData = earningsData[selectedPeriod];
  const commissionAmount = calculateCommission(currentData.gross);
  const netEarnings = currentData.gross - commissionAmount;

  const transactions = [
    {
      id: 1,
      type: 'earned',
      grossAmount: 135,
      description: 'Car rental - Toyota Corolla',
      date: '2024-01-15',
      time: '2:30 PM',
      status: 'completed',
    },
    {
      id: 2,
      type: 'earned',
      grossAmount: 180,
      description: 'Car rental - Honda Civic',
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
      grossAmount: 225,
      description: 'Car rental - Toyota Corolla',
      date: '2024-01-14',
      time: '4:00 PM',
      status: 'completed',
    },
    {
      id: 5,
      type: 'earned',
      grossAmount: 90,
      description: 'Car rental - Honda Civic',
      date: '2024-01-13',
      time: '11:30 AM',
      status: 'completed',
    },
  ];

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
              Net Earnings
            </Text>
            <Ionicons name="cash-outline" size={24} color={theme.colors.primary} />
          </View>
          <Text style={[styles.summaryAmount, { color: theme.colors.textPrimary }]}>
            {formatCurrency(netEarnings)}
          </Text>
          
          {/* Commission Breakdown */}
          <View style={[styles.commissionBreakdown, { backgroundColor: theme.colors.background }]}>
            <View style={styles.commissionRow}>
              <View style={styles.commissionRowLeft}>
                <Ionicons name="trending-up-outline" size={16} color={theme.colors.primary} />
                <Text style={[styles.commissionLabel, { color: theme.colors.textSecondary }]}>
                  Gross Earnings
                </Text>
              </View>
              <Text style={[styles.commissionValue, { color: theme.colors.textPrimary }]}>
                {formatCurrency(currentData.gross)}
              </Text>
            </View>
            <View style={styles.commissionRow}>
              <View style={styles.commissionRowLeft}>
                <Ionicons name="remove-circle-outline" size={16} color="#FF3B30" />
                <Text style={[styles.commissionLabel, { color: theme.colors.textSecondary }]}>
                  Commission ({COMMISSION_RATE * 100}%)
                </Text>
              </View>
              <Text style={[styles.commissionValue, { color: '#FF3B30' }]}>
                -{formatCurrency(commissionAmount)}
              </Text>
            </View>
            <View style={[styles.commissionDivider, { backgroundColor: theme.colors.hint + '30' }]} />
            <View style={styles.commissionRow}>
              <View style={styles.commissionRowLeft}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#4CAF50" />
                <Text style={[styles.commissionLabel, { color: theme.colors.textPrimary, fontFamily: 'Nunito_700Bold' }]}>
                  Net Earnings
                </Text>
              </View>
              <Text style={[styles.commissionValue, { color: '#4CAF50', fontFamily: 'Nunito_700Bold' }]}>
                {formatCurrency(netEarnings)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={[styles.summaryStatValue, { color: theme.colors.textPrimary }]}>
                {currentData.bookings}
              </Text>
              <Text style={[styles.summaryStatLabel, { color: theme.colors.textSecondary }]}>
                Bookings
              </Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={[styles.summaryStatValue, { color: theme.colors.textPrimary }]}>
                {formatCurrency(currentData.average)}
              </Text>
              <Text style={[styles.summaryStatLabel, { color: theme.colors.textSecondary }]}>
                Avg/Booking
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.white }]}>
          <Ionicons name="trending-up-outline" size={18} color="#4CAF50" />
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
            +12%
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            vs Last Period
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.white }]}>
          <Ionicons name="wallet-outline" size={18} color={theme.colors.primary} />
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
            {formatCurrency(netEarnings * 0.7)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Available Balance
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.white }]}>
          <Ionicons name="cut-outline" size={18} color="#FF3B30" />
          <Text style={[styles.statValue, { color: '#FF3B30' }]}>
            {formatCurrency(commissionAmount)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Commission
          </Text>
        </View>
      </View>

      {/* Transactions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Recent Transactions
        </Text>
        {transactions.map((transaction) => {
          const isEarned = transaction.type === 'earned';
          const grossAmount = isEarned ? transaction.grossAmount : Math.abs(transaction.amount);
          const commission = isEarned ? calculateCommission(grossAmount) : 0;
          const netAmount = isEarned ? grossAmount - commission : transaction.amount;

          return (
            <Card key={transaction.id} style={[styles.transactionCard, { backgroundColor: theme.colors.white }]}>
              <View style={styles.transactionHeader}>
                <View
                  style={[
                    styles.transactionIcon,
                    {
                      backgroundColor:
                        isEarned
                          ? theme.colors.primary + '20'
                          : '#FF3B30' + '20',
                    },
                  ]}
                >
                  <Ionicons
                    name={isEarned ? 'arrow-down' : 'arrow-up'}
                    size={20}
                    color={isEarned ? theme.colors.primary : '#FF3B30'}
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
                  {isEarned && (
                    <View style={styles.transactionBreakdown}>
                      <Text style={[styles.breakdownText, { color: theme.colors.textSecondary }]}>
                        Gross: {formatCurrency(grossAmount)} • Commission: -{formatCurrency(commission)}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.transactionAmountContainer}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color: isEarned ? '#4CAF50' : '#FF3B30',
                      },
                    ]}
                  >
                    {isEarned ? '+' : ''}
                    {formatCurrency(netAmount)}
                  </Text>
                  {isEarned && (
                    <Text style={[styles.transactionNetLabel, { color: theme.colors.textSecondary }]}>
                      Net
                    </Text>
                  )}
                </View>
              </View>
            </Card>
          );
        })}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.primary }]}
          onPress={() => {
            navigation.navigate('FinancesTab', {
              screen: 'AddPaymentMethod',
            });
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
          <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
            Add Payment Accounts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            navigation.navigate('FinancesTab', {
              screen: 'WithdrawRequest',
              params: { availableBalance: netEarnings * 0.7 },
            });
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="wallet-outline" size={20} color={theme.colors.white} />
          <Text style={[styles.actionButtonText, { color: theme.colors.white }]}>
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
    gap: 8,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  statLabel: {
    fontSize: 10,
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
  commissionBreakdown: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  commissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commissionRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commissionLabel: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
  },
  commissionValue: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  commissionDivider: {
    height: 1,
    marginVertical: 4,
  },
  transactionBreakdown: {
    marginTop: 6,
  },
  breakdownText: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  transactionNetLabel: {
    fontSize: 10,
    fontFamily: 'Nunito_400Regular',
    marginTop: 2,
  },
  actionsContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
});

export default OwnerFinancesScreen;
