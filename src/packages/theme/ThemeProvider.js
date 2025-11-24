import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const theme = {
    colors: {
      primary: '#0A1D37', // Deep Navy
      background: '#F7F7F7', // Soft White
      textPrimary: '#1A1A1A', // Chocolate Black
      textSecondary: '#3A3A3A', // Charcoal
      hint: '#6D6D6D', // Muted Grey
      white: '#FFFFFF',
      black: '#000000',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
    },
    typography: {
      fontFamily: 'Nunito',
      h1: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1A1A1A',
        fontFamily: 'Nunito_700Bold',
      },
      h2: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1A1A1A',
        fontFamily: 'Nunito_600SemiBold',
      },
      h3: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A1A',
        fontFamily: 'Nunito_600SemiBold',
      },
      body: {
        fontSize: 16,
        fontWeight: '400',
        color: '#1A1A1A',
        fontFamily: 'Nunito_400Regular',
      },
      bodySecondary: {
        fontSize: 16,
        fontWeight: '400',
        color: '#3A3A3A',
        fontFamily: 'Nunito_400Regular',
      },
      caption: {
        fontSize: 14,
        fontWeight: '400',
        color: '#6D6D6D',
        fontFamily: 'Nunito_400Regular',
      },
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

