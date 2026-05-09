import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useAuth } from './AuthContext';
import { getThemeColors, spacing, Colors, Role, Mode } from '../utils/theme';

interface ThemeContextType {
  colors: Colors;
  spacing: typeof spacing;
  mode: Mode;
  role: Role | null;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  
  // mode is light by default if colorScheme is null/undefined
  const mode: Mode = colorScheme === 'dark' ? 'dark' : 'light';
  const role: Role | null = user ? (user.role.toUpperCase() as Role) : null;

  const colors = useMemo(() => getThemeColors(role, mode), [role, mode]);

  const value = useMemo(
    () => ({
      colors,
      spacing,
      mode,
      role,
    }),
    [colors, mode, role]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
