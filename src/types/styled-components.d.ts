import 'styled-components';
import 'styled-components/native';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryLight: string;
      secondary: string;
      background: string;
      backgroundAlt: string;
      text: string;
      textMuted: string;
      border: string;
      success: string;
      error: string;
      warning: string;
    };
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    typography: {
      h1: { fontSize: number; fontWeight: string };
      h2: { fontSize: number; fontWeight: string };
      h3: { fontSize: number; fontWeight: string };
      body: { fontSize: number; fontWeight: string };
      caption: { fontSize: number; fontWeight: string };
      captionSmall: { fontSize: number; fontWeight: string };
    };
  }
}

declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryLight: string;
      secondary: string;
      background: string;
      backgroundAlt: string;
      text: string;
      textMuted: string;
      border: string;
      success: string;
      error: string;
      warning: string;
    };
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    typography: {
      h1: { fontSize: number; fontWeight: string };
      h2: { fontSize: number; fontWeight: string };
      h3: { fontSize: number; fontWeight: string };
      body: { fontSize: number; fontWeight: string };
      caption: { fontSize: number; fontWeight: string };
      captionSmall: { fontSize: number; fontWeight: string };
    };
  }
}



