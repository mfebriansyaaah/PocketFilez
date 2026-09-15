import styled from '@/src/styled';
import type { DefaultTheme } from 'styled-components';

export const Container = styled.View<{ theme: DefaultTheme }>`
  flex: 1;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

export const Title = styled.Text<{ theme: DefaultTheme }>`
  font-size: 24;
  font-weight: 700;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 16px;
`;

export const Description = styled.Text<{ theme: DefaultTheme }>`
  font-size: 16;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.textMuted};
  text-align: center;
  line-height: 24;
  margin-bottom: 32px;
`;

export const IconWrapper = styled.View<{ theme: DefaultTheme }>`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.primaryLight}20;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

export const ButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 16;
  font-weight: 600;
`;
