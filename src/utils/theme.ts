export type Role = 'STUDENT' | 'SUPERVISOR' | 'ADMIN';
export type Mode = 'light' | 'dark';

export const roleAccents: Record<Role, { light: string; dark: string }> = {
  STUDENT: { light: '#901b20', dark: '#C0363D' }, // Crimson
  SUPERVISOR: { light: '#203947', dark: '#3B6578' }, // Steel Teal
  ADMIN: { light: '#C9A84C', dark: '#D4B05A' }, // Deep Gold
};

export const roleAccentLight: Record<Role, { light: string; dark: string }> = {
  STUDENT: { light: '#FBE9EA', dark: '#2D1315' },
  SUPERVISOR: { light: '#E6EDEF', dark: '#0E1E26' },
  ADMIN: { light: '#FDF6E3', dark: '#1E1A0E' },
};

export const baseColors = {
  light: {
    background: '#FAFAFA',
    surface: '#F4F4F5',
    surfaceAlt: '#E4E4E7',
    border: '#E4E4E7',
    text: '#18181B',
    textSub: '#52525B',
    textMuted: '#A1A1AA',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
  dark: {
    background: '#09090B',
    surface: '#18181B',
    surfaceAlt: '#27272A',
    border: '#27272A',
    text: '#FAFAFA',
    textSub: '#A1A1AA',
    textMuted: '#71717A',
    error: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
  },
};

export const getThemeColors = (role: Role | null, mode: Mode) => {
  const base = baseColors[mode];
  const r = role || 'STUDENT'; // Default to STUDENT if no role
  
  return {
    primary: roleAccents[r][mode],
    secondary: base.success, // Currently mapped to Emerald in design
    error: base.error,
    background: base.background,
    surface: base.surface,
    text: base.text,
    textSecondary: base.textSub,
    border: base.border,
    // Add additional base colors for more granular control if needed:
    surfaceAlt: base.surfaceAlt,
    textMuted: base.textMuted,
    success: base.success,
    warning: base.warning,
    accentLight: roleAccentLight[r][mode],
  };
};

export type Colors = ReturnType<typeof getThemeColors>;

// Legacy static colors export for files that haven't been refactored yet, defaulting to Student Light
export const colors = getThemeColors('STUDENT', 'light');

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
