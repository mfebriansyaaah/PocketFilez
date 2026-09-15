import styled from '@/src/styled';
import type { DefaultTheme } from 'styled-components';

export const Container = styled.View<{ theme: DefaultTheme }>`
  flex: 1;
  justify-content: center;
  padding: ${({ theme }: { theme: DefaultTheme }) => theme.spacing.xl}px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
`;

export const LogoWrap = styled.View`
  align-items: center;
  margin-bottom: 24px;
`;

export const Title = styled.Text<{ theme: DefaultTheme }>`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
  margin-bottom: 8px;
`;

export const Subtitle = styled.Text<{ theme: DefaultTheme }>`
  font-size: 16px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.textMuted};
  margin-bottom: 32px;
`;

export const EyeButton = styled.Pressable`
  position: absolute;
  right: 16px;
  top: 45px;
`;
