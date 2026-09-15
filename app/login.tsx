import PocketFilezLogo from '@/src/components/PocketFilezLogo';
import {
    Container,
    EyeButton,
    LogoWrap,
    Subtitle,
    Title,
} from '@/src/components/login/loginScreenStyles';
import { Button, Input } from '@/src/components/ui';
import { LoginFormData, LoginSchema } from '@/src/schema/auth.schema';
import { setStorage, STORAGE_KEYS } from '@/src/storage/storage';
import { useAppStore } from '@/src/store/useStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

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
