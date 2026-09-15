import { Button } from '@/src/components/ui';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Platform, Text, View } from 'react-native';
import { DefaultTheme } from 'styled-components';
import styled from '@/src/styled';

const Container = styled.View<{ theme: DefaultTheme }>`
  flex: 1;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

const Title = styled.Text<{ theme: DefaultTheme }>`
  font-size: 24;
  font-weight: 700;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 16px;
`;

const Description = styled.Text<{ theme: DefaultTheme }>`
  font-size: 16;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.textMuted};
  text-align: center;
  line-height: 24;
  margin-bottom: 32px;
`;

const IconWrapper = styled.View<{ theme: DefaultTheme }>`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.primaryLight}20;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

const ButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 16;
  font-weight: 600;
`;

async function requestMediaPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  }

  const { status, granted } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted' || granted === true;
}

export default function PermissionsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function requestPermissions() {
    setLoading(true);
    try {
      const granted = await requestMediaPermission();
      if (granted) {
        router.replace('/files');
      } else {
        Alert.alert(
          'Izin Ditolak',
          'Aplikasi membutuhkan akses penyimpanan untuk membaca dan menulis file. Izin dapat diatur di Pengaturan > Aplikasi.',
          [{ text: 'OK' }],
        );
      }
    } catch (e) {
      console.error('Permission error:', e);
      router.replace('/files');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <IconWrapper>
        <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 40 }}>📁</Text>
        </View>
      </IconWrapper>
      <Title>Filer</Title>
      <Description>
        Aplikasi Filer membutuhkan akses ke penyimpanan perangkat Anda untuk membaca, memindahkan, menyalin, dan menghapus file serta folder.
      </Description>
      <Button onPress={requestPermissions} disabled={loading} variant="primary">
        <ButtonText>{loading ? 'Memproses...' : 'Lanjutkan'}</ButtonText>
        {!loading && <ArrowRight size={18} color="#FFFFFF" />}
      </Button>
    </Container>
    );
}

