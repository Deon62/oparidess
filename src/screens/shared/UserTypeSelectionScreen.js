import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';

const UserTypeSelectionScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleUserTypeSelection = (userType) => {
    // Navigate to signup with user type
    navigation.navigate('Signup', { userType });
  };

  const userTypes = [
    {
      id: 'renter',
      title: 'Browse for a Car',
      description: 'Find and rent the perfect car for your journey',
      icon: 'car-outline',
      color: '#0A1D37',
      gradient: ['#0A1D37', '#1a3a5a'],
    },
    {
      id: 'owner',
      title: 'List a Car',
      description: 'Share your car and earn money when you\'re not using it',
      icon: 'business-outline',
      color: '#FF6B35',
      gradient: ['#FF6B35', '#ff8c5a'],
    },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Choose Your Role
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Select how you want to use Oparides
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {userTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            onPress={() => handleUserTypeSelection(type.id)}
            activeOpacity={1}
            style={styles.cardTouchable}
          >
            <Card style={styles.card}>
              <View style={styles.cardContent}>
                <Ionicons name={type.icon} size={40} color={type.color} style={styles.icon} />
                <View style={styles.textContainer}>
                  <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
                    {type.title}
                  </Text>
                  <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
                    {type.description}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color={type.color} style={styles.arrow} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    paddingHorizontal: 24,
    gap: 20,
    paddingBottom: 20,
  },
  cardTouchable: {
    marginBottom: 0,
  },
  card: {
    marginBottom: 0,
    borderWidth: 0,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  icon: {
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 0,
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  arrow: {
    flexShrink: 0,
  },
});

export default UserTypeSelectionScreen;
