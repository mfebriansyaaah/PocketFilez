import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../../styled';
import { theme } from '../../theme';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('UI Components', () => {
  describe('Button', () => {
    test('should render children text', async () => {
      const { getByText } = await renderWithTheme(<Button onPress={() => {}}>Click Me</Button>);
      expect(getByText('Click Me')).toBeTruthy();
    });

    test('should call onPress when pressed', async () => {
      const onPressMock = jest.fn();
      const { getByText } = await renderWithTheme(<Button onPress={onPressMock}>Click Me</Button>);
      await fireEvent.press(getByText('Click Me'));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    test('should be disabled when disabled prop is true', async () => {
      const onPressMock = jest.fn();
      const { getByText } = await renderWithTheme(
        <Button onPress={onPressMock} disabled>
          Disabled
        </Button>,
      );
      await fireEvent.press(getByText('Disabled'));
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Input', () => {
    test('should render with correct value', async () => {
      const { getByDisplayValue } = await renderWithTheme(<Input value="Hello" onChangeText={() => {}} />);
      expect(getByDisplayValue('Hello')).toBeTruthy();
    });

    test('should call onChangeText when text changes', async () => {
      const onChangeTextMock = jest.fn();
      const { getByPlaceholderText } = await renderWithTheme(<Input value="" onChangeText={onChangeTextMock} placeholder="Enter text" />);
      await fireEvent.changeText(getByPlaceholderText('Enter text'), 'New Text');
      expect(onChangeTextMock).toHaveBeenCalledWith('New Text');
    });

    test('should render error message when provided', async () => {
      const { getByText } = await renderWithTheme(<Input value="" onChangeText={() => {}} error="Error Message" />);
      expect(getByText('Error Message')).toBeTruthy();
    });
  });
});