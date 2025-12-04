import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button } from '../../packages/components';
import Logo from '../../components/Logo';

const LandingScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  
  // Animation for logo
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Logo fade in and scale animation
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    navigation.navigate('Signup', { userType: 'renter' });
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };


  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.background + 'F5', theme.colors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradientContainer}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Animated.View 
            style={[
              styles.logoAlignLeft,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              }
            ]}
          >
            <Logo width={360} height={360} color={theme.colors.textPrimary} />
          </Animated.View>
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

    </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
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
    top: 420,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: 'center',
    zIndex: 1,
  },
  tagline: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
    letterSpacing: 0.8,
    lineHeight: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    paddingBottom: 40,
    gap: 14,
  },
  primaryButton: {
    marginBottom: 0,
  },
  secondaryButton: {
    marginBottom: 0,
  },
});

export default LandingScreen;
