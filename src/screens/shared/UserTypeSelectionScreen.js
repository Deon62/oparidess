import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
    },
    {
      id: 'owner',
      title: 'List a Car',
      description: 'Share your car and earn money when you\'re not using it',
    },
    {
      id: 'driver',
      title: 'Be a Chauffeur',
      description: 'Offer your professional driving services',
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
            android_ripple={null}
          >
            <Card style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
                  {type.title}
                </Text>
                <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
                  {type.description}
                </Text>
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
    paddingTop: 32,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  cardTouchable: {
    marginBottom: 0,
  },
  card: {
    marginBottom: 0,
  },
  cardContent: {
    gap: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
  },
});

export default UserTypeSelectionScreen;
