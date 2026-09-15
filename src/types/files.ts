export type FileType = 'folder' | 'image' | 'video' | 'audio' | 'document' | 'other';

export interface FileInfo {
  uri: string;
  name: string;
  size: number;        // bytes
  mimeType?: string;
  modifiedTime?: number; // epoch ms
  isDirectory: boolean;
  type: FileType;
}

export interface ClipboardItem {
  sourcePaths: string[];
  operation: 'copy' | 'move';
  destPath?: string;
}
