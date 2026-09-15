import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import * as fileService from '../../services/fileService';
import { FileInfo } from '../../types/files';
import { useDeleteFile, useDirectoryList } from '../useFileSystem';

jest.mock('expo-file-system', () => ({
  Directory: jest.fn(),
  File: jest.fn(),
  Paths: { document: { uri: 'mock-document-uri' } },
}));
jest.mock('expo-media-library', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: true, status: 'granted' }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useFileSystem hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useDirectoryList', () => {
    test('should fetch directory list successfully', async () => {
      const mockFiles: FileInfo[] = [
        { name: 'test.txt', uri: '/path/test.txt', size: 0, isDirectory: false, type: 'document' },
      ];
      jest.spyOn(fileService, 'listDirectory').mockResolvedValue(mockFiles);

      const { result } = await renderHook(() => useDirectoryList('/mock/path'), {
        wrapper: createWrapper(),
      });

      // Wait for query to resolve
      await new Promise((resolve) => setTimeout(resolve, 0));
      
      expect(result.current.data).toEqual(mockFiles);
      expect(fileService.listDirectory).toHaveBeenCalledWith('/mock/path');
    });
  });

  describe('useDeleteFile', () => {
    test('should trigger deleteFile mutation', async () => {
      jest.spyOn(fileService, 'deleteFile').mockResolvedValue(true);

      const { result } = await renderHook(() => useDeleteFile(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('/path/to/delete');

      await waitFor(() => {
        expect(fileService.deleteFile).toHaveBeenCalledWith('/path/to/delete');
      });
    });
  });
});
