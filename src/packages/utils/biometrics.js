import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BIOMETRIC_PREFERENCE_KEY = '@oparides:biometrics_enabled';
const LAST_USER_KEY = '@oparides:last_user';

/**
 * Check if biometric authentication is available on the device
 */
export const isBiometricAvailable = async () => {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      return { available: false, type: null, error: 'Biometric hardware not available' };
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      return { available: false, type: null, error: 'No biometrics enrolled on device' };
    }

    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    let biometricType = 'Biometric';
    
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      biometricType = 'Face ID';
    } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      biometricType = 'Fingerprint';
    } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      biometricType = 'Iris';
    }

    return { available: true, type: biometricType, error: null };
  } catch (error) {
    console.error('Biometric availability check error:', error);
    return { available: false, type: null, error: error.message };
  }
};

/**
 * Authenticate using biometrics
 */
export const authenticateWithBiometrics = async () => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to login',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
      fallbackLabel: 'Use Password',
    });

    return {
      success: result.success,
      error: result.error,
    };
  } catch (error) {
    console.error('Biometric authentication error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get biometric preference from storage
 */
export const getBiometricPreference = async () => {
  try {
    const value = await AsyncStorage.getItem(BIOMETRIC_PREFERENCE_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error getting biometric preference:', error);
    return false;
  }
};

/**
 * Save biometric preference to storage
 */
export const setBiometricPreference = async (enabled) => {
  try {
    await AsyncStorage.setItem(BIOMETRIC_PREFERENCE_KEY, enabled ? 'true' : 'false');
    return true;
  } catch (error) {
    console.error('Error saving biometric preference:', error);
    return false;
  }
};

/**
 * Save last user data for biometric login
 */
export const saveLastUser = async (userData, userType) => {
  try {
    await AsyncStorage.setItem(LAST_USER_KEY, JSON.stringify({ userData, userType }));
    return true;
  } catch (error) {
    console.error('Error saving last user:', error);
    return false;
  }
};

/**
 * Get last user data for biometric login
 */
export const getLastUser = async () => {
  try {
    const value = await AsyncStorage.getItem(LAST_USER_KEY);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  } catch (error) {
    console.error('Error getting last user:', error);
    return null;
  }
};

/**
 * Clear last user data
 */
export const clearLastUser = async () => {
  try {
    await AsyncStorage.removeItem(LAST_USER_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing last user:', error);
    return false;
  }
};




