import { QueryProvider } from '@/src/providers/QueryProvider';
import { GlobalStyle, ThemeProvider } from '@/src/styled';
import { theme } from '@/src/theme';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const [, error] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (error) {
    console.error('Failed to load fonts:', error);
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <QueryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="permissions" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </QueryProvider>
    </ThemeProvider>
  );
}
