import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button } from '../../packages/components';
import Logo from '../../components/Logo';

const LandingScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('Signup', { userType: 'renter' });
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleCarOwnerRegister = () => {
    navigation.navigate('Signup', { userType: 'owner' });
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Logo Section */}
      <View style={[styles.logoContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.logoAlignLeft}>
          <Logo width={360} height={360} color={theme.colors.textPrimary} />
        </View>
        {/* Tagline Section - Below logo text */}
        <View style={styles.taglineContainer}>
          <Text style={[styles.tagline, { color: theme.colors.textPrimary }]}>
            Your Complete Mobility Solution
          </Text>
        </View>
      </View>

      {/* Commented out: Luxury Car Image Section */}
      {/* <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://pngimg.com/uploads/tesla_car/tesla_car_PNG29.png' }}
          style={styles.carImage}
          resizeMode="contain"
        />
      </View> */}

      {/* Commented out: Content Section */}
      {/* <View style={styles.contentSection}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Welcome to Opa
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Alles Gut (Everything is Good) with Opa
        </Text>
      </View> */}

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          variant="primary"
          style={styles.primaryButton}
        />
        <Button
          title="Login"
          onPress={handleLogin}
          variant="secondary"
          style={styles.secondaryButton}
        />
      </View>

      {/* Car Owner Register Link */}
      <View style={styles.carOwnerContainer}>
        <TouchableOpacity
          onPress={handleCarOwnerRegister}
          activeOpacity={0.7}
          style={styles.carOwnerLinkContainer}
        >
          <Text style={[styles.carOwnerText, { color: theme.colors.textSecondary }]}>
            List your car?{' '}
            <Text style={[styles.carOwnerLink, { color: theme.colors.primary }]}>
              Become a Car Owner
            </Text>
          </Text>
        </TouchableOpacity>
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
  logoContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 100,
    paddingBottom: 40,
    paddingHorizontal: 20,
    position: 'relative',
  },
  logoAlignLeft: {
    marginLeft: -40,
  },
  taglineContainer: {
    position: 'absolute',
    top: 360,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: 'center',
    zIndex: 1,
  },
  tagline: {
    fontSize: 20,
    fontFamily: 'Nunito_600SemiBold',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 28,
  },
  // Commented out: Car image styles
  // imageContainer: {
  //   width: '100%',
  //   height: 350,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   paddingTop: 40,
  //   paddingHorizontal: 20,
  // },
  // carImage: {
  //   width: '100%',
  //   height: '100%',
  // },
  contentSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 38,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 19,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 26,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 4,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 14,
    marginTop: 20,
  },
  primaryButton: {
    marginBottom: 0,
  },
  secondaryButton: {
    marginBottom: 0,
  },
  carOwnerContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  carOwnerLinkContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  carOwnerLinkContainer: {
    alignItems: 'center',
  },
  carOwnerText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
  carOwnerLink: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default LandingScreen;
