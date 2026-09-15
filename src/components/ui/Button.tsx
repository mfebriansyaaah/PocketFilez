import styled from '@/src/styled';
import React from 'react';
import { Pressable } from 'react-native';
import { DefaultTheme } from 'styled-components';

const StyledButton = styled(Pressable)<{ variant?: 'primary' | 'secondary' | 'ghost'; theme: DefaultTheme }>`
  padding: ${({ theme }: { theme: DefaultTheme }) => theme.spacing.md}px;
  border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacing.sm}px;

  ${({ variant = 'primary', theme, disabled }: { variant?: 'primary' | 'secondary' | 'ghost'; theme: DefaultTheme; disabled?: boolean | null | undefined }) => {
    if (disabled) return 'opacity: 0.4;';
    if (variant === 'primary') return `background-color: ${theme.colors.primary};`;
    if (variant === 'secondary') return `background-color: ${theme.colors.secondary};`;
    return 'background-color: transparent;';
  }}
`;

const StyledText = styled.Text<{ variant?: 'primary' | 'secondary' | 'ghost'; theme: DefaultTheme }>`
  color: ${({ variant = 'primary', theme }: { variant?: 'primary' | 'secondary' | 'ghost'; theme: DefaultTheme }) =>
    variant === 'ghost' ? theme.colors.text : '#FFFFFF'};
  font-size: 16px;
  font-weight: 600;
`;

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: object;
}

export function Button({ onPress, children, variant = 'primary', disabled, style }: ButtonProps) {
  return (
    <StyledButton onPress={onPress} variant={variant} disabled={disabled} style={style}>
      <StyledText variant={variant}>{children}</StyledText>
    </StyledButton>
  );
}
