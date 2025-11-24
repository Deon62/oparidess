import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [userType, setUserType] = useState(null); // 'renter', 'owner', 'driver'
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user state (check for stored auth, etc.)
  useEffect(() => {
    // TODO: Check for stored authentication token/user data
    // For now, setting to null (not authenticated)
    setIsLoading(false);
  }, []);

  const login = (userData, type) => {
    setUser(userData);
    setUserType(type);
    // TODO: Store authentication token
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
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

