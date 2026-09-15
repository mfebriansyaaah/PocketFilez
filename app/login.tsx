import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import type { DefaultTheme } from 'styled-components';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import PocketFilezLogo from '@/src/components/PocketFilezLogo';
import { LoginFormData, LoginSchema } from '@/src/schema/auth.schema';
import { setStorage, STORAGE_KEYS } from '@/src/storage/storage';
import { useAppStore } from '@/src/store/useStore';
import styled from '@/src/styled';

const Container = styled.View<{ theme: DefaultTheme }>`
  flex: 1;
  justify-content: center;
  padding: ${({ theme }: { theme: DefaultTheme }) => theme.spacing.xl}px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
`;

const LogoWrap = styled.View`
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.Text<{ theme: DefaultTheme }>`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const Subtitle = styled.Text<{ theme: DefaultTheme }>`
  font-size: 16px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.textMuted};
  margin-bottom: 32px;
`;

const EyeButton = styled.Pressable`
  position: absolute;
  right: 16px;
  top: 45px;
`;

export default function LoginScreen() {
  const router = useRouter();
  const setUser = useAppStore((state) => state.setUser);
  const setLoggedIn = useAppStore((state) => state.setLoggedIn);

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    // TODO: implement API call
    await setStorage(STORAGE_KEYS.TOKEN, 'mock-token');
    setUser({ name: 'John Doe', email: data.email });
    setLoggedIn(true);
    router.replace('/files');
  };

  return (
    <Container>
      <LogoWrap>
        <PocketFilezLogo size={128} />
      </LogoWrap>

      <Title>Welcome Back</Title>
      <Subtitle>Login to continue to your account</Subtitle>

      <Input
        value={watch('email')}
        onChangeText={(text) => setValue('email', text)}
        placeholder="Email address"
        error={errors.email?.message}
        keyboardType="email-address"
      />

      <View style={{ position: 'relative' }}>
        <Input
          value={watch('password')}
          onChangeText={(text) => setValue('password', text)}
          placeholder="Password"
          error={errors.password?.message}
          secureTextEntry={!showPassword}
        />
        <EyeButton onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <EyeOff size={20} color="#64748B" />
          ) : (
            <Eye size={20} color="#64748B" />
          )}
        </EyeButton>
      </View>

      <Button onPress={handleSubmit(onSubmit)} variant="primary">
        Login
      </Button>
    </Container>
  );
}
