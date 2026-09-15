import { Platform } from 'react-native';
import { copyFiles, deleteFile, getBasePath, getFileType, getQuickFolders, listDirectory, moveFiles, renameFile } from '../fileService';

// Mock expo-file-system to avoid native module errors during unit tests
jest.mock('expo-modules-core', () => ({}));
jest.mock('expo-file-system', () => {
  const mockDirectoryInstance = {
    exists: true,
    list: jest.fn(),
    info: jest.fn(),
    delete: jest.fn(),
    rename: jest.fn(),
    copy: jest.fn(),
    move: jest.fn(),
  };
  const mockFileInstance = {
    exists: true,
    info: jest.fn(),
    delete: jest.fn(),
    rename: jest.fn(),
    copy: jest.fn(),
    move: jest.fn(),
  };

  return {
    Directory: jest.fn().mockImplementation((path) => {
      return {
        ...mockDirectoryInstance,
        uri: path,
        name: path.split('/').pop(),
      };
    }),
    File: jest.fn().mockImplementation((path) => {
      return {
        ...mockFileInstance,
        uri: path,
        name: path.split('/').pop(),
      };
    }),
    Paths: {
      document: { uri: 'mock-document-uri' },
    },
  };
});
jest.mock('expo-media-library', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: true, status: 'granted' }),
}));

import { Directory, File } from 'expo-file-system';

const MockDirectory = Directory as unknown as jest.Mock<Partial<Directory>>;
const MockFile = File as unknown as jest.Mock<Partial<File>>;

// Mock Platform.OS
jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
}));

describe('fileService - Synchronous Functions', () => {
  describe('getFileType', () => {
    test('should return "image" for image extensions', () => {
      expect(getFileType('image.jpg')).toBe('image');
      expect(getFileType('photo.png')).toBe('image');
      expect(getFileType('icon.svg')).toBe('image');
      expect(getFileType('img.webp')).toBe('image');
    });

    test('should return "video" for video extensions', () => {
      expect(getFileType('movie.mp4')).toBe('video');
      expect(getFileType('clip.mov')).toBe('video');
      expect(getFileType('vid.mkv')).toBe('video');
    });

    test('should return "audio" for audio extensions', () => {
      expect(getFileType('song.mp3')).toBe('audio');
      expect(getFileType('sound.wav')).toBe('audio');
      expect(getFileType('voice.m4a')).toBe('audio');
    });

    test('should return "document" for document/text extensions', () => {
      expect(getFileType('doc.pdf')).toBe('document');
      expect(getFileType('sheet.xlsx')).toBe('document');
      expect(getFileType('text.txt')).toBe('document');
    });

    test('should return "document" for archive extensions', () => {
      expect(getFileType('archive.zip')).toBe('document');
      expect(getFileType('files.rar')).toBe('document');
    });

    test('should return "other" for unknown extensions', () => {
      expect(getFileType('file.unknown')).toBe('other');
      expect(getFileType('noextension')).toBe('other');
    });

    test('should prioritize mimeType over extension', () => {
      expect(getFileType('file.txt', 'image/jpeg')).toBe('image');
    });
  });

  describe('getBasePath', () => {
    test('should return android path when OS is android', () => {
      Platform.OS = 'android';
      expect(getBasePath()).toBe('/storage/emulated/0');
    });

    test('should return document uri when OS is not android', () => {
      Platform.OS = 'ios';
      expect(getBasePath()).toBe('mock-document-uri');
    });
  });

  describe('getQuickFolders', () => {
    test('should return android specific folders when OS is android', () => {
      Platform.OS = 'android';
      const folders = getQuickFolders();
      expect(folders).toContainEqual({ label: 'DCIM', path: '/storage/emulated/0/DCIM' });
      expect(folders).toContainEqual({ label: 'Downloads', path: '/storage/emulated/0/Download' });
      expect(folders.length).toBeGreaterThan(1);
    });

    test('should return generic folder when OS is not android', () => {
      Platform.OS = 'ios';
      const folders = getQuickFolders();
      expect(folders).toEqual([{ label: 'Files', 'path': 'mock-document-uri' }]);
    });
  });
});

describe('fileService - Asynchronous Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listDirectory', () => {
    test('should return empty array if directory does not exist', async () => {
      MockDirectory.mockImplementationOnce(() => ({
        exists: false,
      }));
      const result = await listDirectory('/non/existent/path');
      expect(result).toEqual([]);
    });

    test('should return sorted list (folders first, then by name)', async () => {
      const mockFile = {
        uri: '/path/fileB.txt',
        name: 'fileB.txt',
        info: () => ({ size: 100, modificationTime: 1000 }),
      };
      const mockFolderA = {
        uri: '/path/folderA/',
        name: 'folderA',
        info: () => ({ modificationTime: 2000 }),
      };
      const mockFileA = {
        uri: '/path/fileA.txt',
        name: 'fileA.txt',
        info: () => ({ size: 200, modificationTime: 3000 }),
      };
      const mockFolderB = {
        uri: '/path/folderB/',
        name: 'folderB',
        info: () => ({ modificationTime: 4000 }),
      };

      const mockFileB = mockFile;

      MockDirectory.mockImplementationOnce(() => {
        const dir = {
          exists: true,
          list: () => [mockFolderA, mockFolderB, mockFileA, mockFileB],
        };
        return dir as unknown as Partial<Directory>;
      });

      const result = await listDirectory('/path/');
      
      expect(result[0].name).toBe('folderA');
      expect(result[1].name).toBe('folderB');
      expect(result[2].name).toBe('fileA.txt');
      expect(result[3].name).toBe('fileB.txt');
    });
  });

  describe('deleteFile', () => {
    test('should return true when file exists and is deleted', async () => {
      const mockFileInstance = {
        exists: true,
        delete: jest.fn(),
      };
      MockFile.mockImplementationOnce(() => mockFileInstance);
      
      const result = await deleteFile('/path/to/file.txt');
      expect(result).toBe(true);
      expect(mockFileInstance.delete).toHaveBeenCalled();
    });

    test('should return true if file does not exist', async () => {
      MockFile.mockImplementationOnce(() => ({
        exists: false,
      }));
      const result = await deleteFile('/path/to/missing.txt');
      expect(result).toBe(true);
    });

    test('should return false when deletion throws error', async () => {
      const mockFileInstance = {
        exists: true,
        delete: jest.fn().mockImplementation(() => {
          throw new Error('Delete failed');
        }),
      };
      MockFile.mockImplementationOnce(() => mockFileInstance);
      
      const result = await deleteFile('/path/to/file.txt');
      expect(result).toBe(false);
    });
  });

  describe('renameFile', () => {
    test('should return true when file is successfully renamed', async () => {
      const mockFileInstance = {
        exists: true,
        rename: jest.fn(),
      };
      MockFile.mockImplementationOnce(() => mockFileInstance);
      
      const result = await renameFile('/path/to/old.txt', 'new.txt');
      expect(result).toBe(true);
      expect(mockFileInstance.rename).toHaveBeenCalledWith('new.txt');
    });

    test('should return false if file does not exist', async () => {
      MockFile.mockImplementationOnce(() => {
        return { exists: false };
      });
      const result = await renameFile('/path/to/missing.txt', 'new.txt');
      expect(result).toBe(false);
    });

    test('should handle directory renaming', async () => {
      const mockDirInstance = {
        exists: true,
        rename: jest.fn(),
      };
      MockDirectory.mockImplementationOnce(() => mockDirInstance);
      
      const result = await renameFile('/path/to/dir/', 'newDir');
      expect(result).toBe(true);
      expect(mockDirInstance.rename).toHaveBeenCalledWith('newDir');
    });

    test('should return false when rename throws error', async () => {
      MockFile.mockImplementationOnce(() => {
        return {
          exists: true,
          rename: jest.fn().mockImplementation(() => { throw new Error(); }),
        };
      });
      const result = await renameFile('/path/to/file.txt', 'new.txt');
      expect(result).toBe(false);
    });
  });

  describe('copyFiles', () => {
    test('should return true when files are copied successfully', async () => {
      const mockFileInstance = {
        exists: true,
        copy: jest.fn(),
      };
      MockFile.mockImplementation(() => mockFileInstance);
      
      const result = await copyFiles(['/src/file1.txt'], '/dest/');
      expect(result).toBe(true);
      expect(mockFileInstance.copy).toHaveBeenCalled();
    });

    test('should skip files that do not exist', async () => {
      MockFile.mockImplementation(() => ({
        exists: false,
      }));
      const result = await copyFiles(['/src/missing.txt'], '/dest/');
      expect(result).toBe(true);
    });

    test('should return false when copy throws error', async () => {
      MockFile.mockImplementation(() => ({
        exists: true,
        copy: jest.fn().mockImplementation(() => { throw new Error(); }),
      }));
      const result = await copyFiles(['/src/file.txt'], '/dest/');
      expect(result).toBe(false);
    });
  });

  describe('moveFiles', () => {
    test('should return true when files are moved successfully', async () => {
      const mockFileInstance = {
        exists: true,
        move: jest.fn(),
      };
      MockFile.mockImplementation(() => mockFileInstance);
      
      const result = await moveFiles(['/src/file1.txt'], '/dest/');
      expect(result).toBe(true);
      expect(mockFileInstance.move).toHaveBeenCalled();
    });

    test('should return false when move throws error', async () => {
      MockFile.mockImplementation(() => ({
        exists: true,
        move: jest.fn().mockImplementation(() => { throw new Error(); }),
      }));
      const result = await moveFiles(['/src/file.txt'], '/dest/');
      expect(result).toBe(false);
    });
  });
});
