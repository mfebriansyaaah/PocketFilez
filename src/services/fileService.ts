import { Directory, File, Paths } from 'expo-file-system';
import { requestPermissionsAsync } from 'expo-media-library';
import { Platform } from 'react-native';
import { FileInfo, FileType } from '../types/files';

// Determine base path based on platform
export function getBasePath(): string {
  if (Platform.OS === 'android') {
    return '/storage/emulated/0';
  }
  // iOS / Windows / web: use document directory
  return Paths.document.uri;
}

export function getFileType(uri: string, mimeType?: string): FileType {
  const mime = mimeType ?? '';
  const ext = uri.split('.').pop()?.toLowerCase() ?? '';

  if (mime.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
    return 'image';
  }
  if (mime.includes('video') || ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv'].includes(ext)) {
    return 'video';
  }
  if (mime.includes('audio') || ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(ext)) {
    return 'audio';
  }
  if (mime.includes('text') || ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'].includes(ext)) {
    return 'document';
  }
  if (mime.includes('zip') || ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return 'document';
  }
  return 'other';
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, '/').replace(/\/$/, '');
}

function toNativePath(path: string): string {
  const normalized = normalizePath(path);
  if (Platform.OS === 'android' && !normalized.startsWith('file://') && !normalized.startsWith('content://')) {
    return `file://${normalized}`;
  }
  return normalized;
}

function ensureTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

function safeInfo(entry: Directory | File) {
  try {
    return entry.info();
  } catch {
    return undefined;
  }
}

function safeSize(entry: Directory | File, info: { size?: number } | undefined): number {
  try {
    if ('size' in entry && typeof entry.size === 'number') {
      return entry.size;
    }
  } catch {
    // ignore
  }
  return info?.size ?? 0;
}

function safeModifiedTime(entry: Directory | File, info: { modificationTime?: number } | undefined): number {
  try {
    if ('lastModified' in entry && typeof entry.lastModified === 'number') {
      return entry.lastModified;
    }
  } catch {
    // ignore
  }
  return info?.modificationTime ?? Date.now();
}

function safeValue(entry: Directory | File, key: string, fallback: string): string {
  const raw = entry as unknown as Record<string, unknown>;
  if (key in entry && typeof raw[key] === 'string' && raw[key]) {
    return raw[key] as string;
  }
  if (key === 'uri') {
    try {
      const split = entry.uri.split('/').pop();
      if (split) return split;
    } catch {
      // ignore
    }
  }
  return fallback;
}

function safeBoolean(entry: Directory | File, key: string, fallback: boolean): boolean {
  const raw = entry as unknown as Record<string, unknown>;
  if (key in entry && typeof raw[key] === 'boolean') {
    return raw[key] as boolean;
  }
  return fallback;
}

function toFileInfo(entry: Directory | File): FileInfo {
  const uri = safeValue(entry, 'uri', '');
  const isDirectory = safeBoolean(entry, 'isDirectory', false) || entry.uri.endsWith('/');
  const name = safeValue(entry, 'name', uri.split('/').pop() ?? 'unknown');
  const info = safeInfo(entry);
  const size = safeSize(entry, info);
  const modifiedTime = safeModifiedTime(entry, info);
  const type = isDirectory ? 'folder' : getFileType(uri, safeValue(entry, 'type', ''));

  return {
    uri,
    name,
    size,
    modifiedTime,
    isDirectory,
    type,
  };
}

export async function listDirectory(path: string): Promise<FileInfo[]> {
  try {
    if (Platform.OS === 'android') {
      const { status } = await requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Storage permission not granted');
        return [];
      }
    }

    const dir = new Directory(toNativePath(path));
    if (!dir.exists) {
      return [];
    }

    const entries = dir.list();
    const results: FileInfo[] = [];

    for (const entry of entries) {
      try {
        results.push(toFileInfo(entry));
      } catch {
        // skip malformed entries instead of failing the whole listing
      }
    }

    results.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    return results;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}

export async function deleteFile(path: string): Promise<boolean> {
  try {
    const entry = path.endsWith('/') ? new Directory(toNativePath(path)) : new File(toNativePath(path));
    if (!entry.exists) return true;
    entry.delete();
    return true;
  } catch {
    return false;
  }
}

export async function renameFile(path: string, newName: string): Promise<boolean> {
  try {
    const entry = path.endsWith('/') ? new Directory(toNativePath(path)) : new File(toNativePath(path));
    if (!entry.exists) return false;
    entry.rename(newName.replace(/\/$/, ''));
    return true;
  } catch {
    return false;
  }
}

export async function copyFiles(sources: string[], destPath: string): Promise<boolean> {
  try {
    const destDir = ensureTrailingSlash(destPath);
    for (const src of sources) {
      const isDir = src.endsWith('/');
      const entry = isDir ? new Directory(toNativePath(src)) : new File(toNativePath(src));
      if (!entry.exists) continue;
      const dest = isDir ? new Directory(toNativePath(destDir + entry.name)) : new File(toNativePath(destDir + entry.name));
      await entry.copy(dest);
    }
    return true;
  } catch {
    return false;
  }
}

export async function moveFiles(sources: string[], destPath: string): Promise<boolean> {
  try {
    const destDir = ensureTrailingSlash(destPath);
    for (const src of sources) {
      const isDir = src.endsWith('/');
      const entry = isDir ? new Directory(toNativePath(src)) : new File(toNativePath(src));
      if (!entry.exists) continue;
      const dest = isDir ? new Directory(toNativePath(destDir + entry.name)) : new File(toNativePath(destDir + entry.name));
      await entry.move(dest);
    }
    return true;
  } catch {
    return false;
  }
}

export function getQuickFolders(): { label: string; path: string }[] {
  const basePath = getBasePath();
  if (Platform.OS === 'android') {
    return [
      { label: 'DCIM', path: '/storage/emulated/0/DCIM' },
      { label: 'Downloads', path: '/storage/emulated/0/Download' },
      { label: 'Documents', path: '/storage/emulated/0/Documents' },
      { label: 'Pictures', path: '/storage/emulated/0/Pictures' },
      { label: 'Music', path: '/storage/emulated/0/Music' },
      { label: 'Videos', path: '/storage/emulated/0/Videos' },
      { label: 'Internal Storage', path: basePath },
    ];
  }
  // iOS / Windows / web: use document directory as only quick folder
  return [{ label: 'Files', path: basePath }];
}