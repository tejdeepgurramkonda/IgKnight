import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const boardThemes = {
  classic: {
    name: 'Classic',
    light: '#f0d9b5',
    dark: '#b58863',
    selected: '#baca44',
    legalMove: '#646f40',
  },
  blue: {
    name: 'Blue',
    light: '#dee3e6',
    dark: '#8ca2ad',
    selected: '#4a90e2',
    legalMove: '#2d5a7b',
  },
  green: {
    name: 'Green',
    light: '#ffffdd',
    dark: '#86a666',
    selected: '#aad662',
    legalMove: '#5d7a3f',
  },
  purple: {
    name: 'Purple',
    light: '#e8e0f5',
    dark: '#9b7cb6',
    selected: '#b794f4',
    legalMove: '#6b4c8a',
  },
  brown: {
    name: 'Brown',
    light: '#f5deb3',
    dark: '#8b4513',
    selected: '#d4a574',
    legalMove: '#6b3410',
  },
  dark: {
    name: 'Dark',
    light: '#4a4a4a',
    dark: '#2b2b2b',
    selected: '#646f40',
    legalMove: '#3d4426',
  }
};

export const ThemeProvider = ({ children }) => {
  const [boardTheme, setBoardTheme] = useState(() => {
    const saved = localStorage.getItem('boardTheme');
    return saved || 'classic';
  });

  const [appTheme, setAppTheme] = useState(() => {
    const saved = localStorage.getItem('appTheme');
    return saved || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('boardTheme', boardTheme);
    
    // Apply board theme CSS variables
    const theme = boardThemes[boardTheme];
    if (theme) {
      document.documentElement.style.setProperty('--board-light', theme.light);
      document.documentElement.style.setProperty('--board-dark', theme.dark);
      document.documentElement.style.setProperty('--board-selected', theme.selected);
      document.documentElement.style.setProperty('--board-legal-move', theme.legalMove);
    }
  }, [boardTheme]);

  useEffect(() => {
    localStorage.setItem('appTheme', appTheme);
    document.documentElement.setAttribute('data-theme', appTheme);
  }, [appTheme]);

  const value = {
    boardTheme,
    setBoardTheme,
    appTheme,
    setAppTheme,
    boardThemes,
    toggleAppTheme: () => setAppTheme(prev => prev === 'dark' ? 'light' : 'dark')
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
