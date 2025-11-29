import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveLastUser, clearLastUser, getBiometricPreference } from '../utils/biometrics';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'renter', 'owner'
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user state (check for stored auth, etc.)
  useEffect(() => {
    // TODO: Check for stored authentication token/user data
    // For now, setting to null (not authenticated)
    setIsLoading(false);
  }, []);

  const login = async (userData, type) => {
    setUser(userData);
    setUserType(type);
    // Save user data for biometric login
    await saveLastUser(userData, type);
    // TODO: Store authentication token
  };

  const logout = async () => {
    setUser(null);
    setUserType(null);
    // Clear last user data
    await clearLastUser();
    // TODO: Clear stored authentication token
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    userType,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

