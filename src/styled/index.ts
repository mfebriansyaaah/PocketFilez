import { Platform } from 'react-native';
import styledComponents, { ThemeProvider as ThemeProviderWeb } from 'styled-components';
import { ThemeProvider as ThemeProviderNative } from 'styled-components/native';

// Import native version for non-web platforms
// eslint-disable-next-line @typescript-eslint/no-require-imports
const styledNative = require('styled-components/native');

// Cross-platform styled-components wrapper
/* eslint-disable @typescript-eslint/no-explicit-any */
const isWeb = Platform.OS === 'web';

type StyledComponent = typeof styledComponents & {
  View: any;
  Text: any;
  Pressable: any;
  ScrollView: any;
  FlatList: any;
  TextInput: any;
  Image: any;
  TouchableOpacity: any;
  Modal: any;
};

let styled: StyledComponent;

if (isWeb) {
  styled = styledComponents as unknown as StyledComponent;
  Object.assign(styled, {
    View: styledComponents('div'),
    Text: styledComponents('span'),
    Pressable: styledComponents('button'),
    ScrollView: styledComponents('div'),
    FlatList: styledComponents('div'),
    TextInput: styledComponents('input'),
    Image: styledComponents('img'),
    TouchableOpacity: styledComponents('button'),
    Modal: styledComponents('div'),
  });
} else {
  styled = (styledNative.default || styledNative) as StyledComponent;
}

// Same ThemeProvider as the styled implementation so theme context is shared
export const ThemeProvider = isWeb ? ThemeProviderWeb : ThemeProviderNative;

export { styled };
export default styled;

// Simple global styles component for React Native
export function GlobalStyle() {
  // For React Native: no-op, styles handled via theme in components
  // For web: font is loaded via expo-font in _layout.tsx
  return null;
}


