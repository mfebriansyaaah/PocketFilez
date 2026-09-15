import styled from '@/src/styled';
import { TextInput } from 'react-native';

const InputContainer = styled.View`
  margin-bottom: 16px;
`;

const StyledInput = styled(TextInput)`
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  background-color: #FFFFFF;
`;

const ErrorText = styled.Text`
  color: #EF4444;
  font-size: 12px;
  margin-top: 4px;
`;

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'password';
}

export function Input({
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
}: InputProps) {
  return (
    <InputContainer>
      <StyledInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#94A3B8"
      />
      {error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  );
}
