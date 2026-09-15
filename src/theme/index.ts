export const colors = {
  primary: '#6366F1',
  primaryLight: '#818CF8',
  secondary: '#EC4899',
  background: '#FFFFFF',
  backgroundAlt: '#F8FAFC',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const },
  h2: { fontSize: 24, fontWeight: '600' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 14, fontWeight: '400' as const },
  captionSmall: { fontSize: 12, fontWeight: '400' as const },
};

export const theme = {
  colors,
  spacing,
  typography,
};
