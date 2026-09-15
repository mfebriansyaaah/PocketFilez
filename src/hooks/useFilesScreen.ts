import { useClipboardStore } from '@/src/hooks/useClipboard';
import {
    useCopyFiles,
    useDeleteFile,
    useDirectoryList,
    useMoveFiles,
    useRenameFile,
} from '@/src/hooks/useFileSystem';
import { getBasePath, getQuickFolders } from '@/src/services/fileService';
import type { FileInfo } from '@/src/types/files';
import { formatSize } from '@/src/utils/format';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, BackHandler } from 'react-native';

export type SortKey = 'name' | 'size' | 'modified' | 'type';
export type ViewMode = 'list' | 'grid';

/** Builds a full path from breadcrumb parts (works for both Android and iOS/Web bases). */
export function buildFullPath(parts: string[]): string {
  if (parts.length === 0) return getBasePath();
  const base = getBasePath();
  if (base.endsWith('/')) return base + parts.join('/');
  return base + '/' + parts.join('/');
}

export function useFilesScreen() {
  const [currentPath, setCurrentPath] = useState(getBasePath());
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedItems, setSelectedItems] = useState<FileInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNavModal, setShowNavModal] = useState(false);
  const [renameTarget, setRenameTarget] = useState<FileInfo | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const { clipboard, setClipboard, clearClipboard, hasContent } = useClipboardStore();

  const { data: files = [], isLoading, refetch } = useDirectoryList(currentPath);
  const deleteMutation = useDeleteFile();
  const renameMutation = useRenameFile();
  const copyMutation = useCopyFiles();
  const moveMutation = useMoveFiles();

  const handleNavigate = useCallback((path: string) => {
    setCurrentPath(path);
    setSelectedItems([]);
    setShowNavModal(false);
  }, []);

  // Handle Android hardware back button
  useEffect(() => {
    const onBackPress = () => {
      const normalized = currentPath.replace('file://', '');
      const base = getBasePath();

      if (normalized === base) {
        return false; // Let OS handle it (exit app)
      }

      const relativePath = normalized.startsWith(base)
        ? normalized.slice(base.length).replace(/^\//, '')
        : '';

      const parts = relativePath.split('/').filter(Boolean);

      if (parts.length === 0) {
        handleNavigate(base);
      } else {
        parts.pop();
        handleNavigate(buildFullPath(parts));
      }
      return true; // Handled
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [currentPath, handleNavigate]);

  useEffect(() => {
    if (showNavModal) {
      setSelectedFolder(null);
    }
  }, [showNavModal]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // Apply sort + search filtering
  const displayFiles = useMemo(() => {
    let result = [...files];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((f) => f.name.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      // Folders always on top
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;

      switch (sortKey) {
        case 'name': return a.name.localeCompare(b.name);
        case 'size': return (b.size ?? 0) - (a.size ?? 0);
        case 'modified': return (b.modifiedTime ?? 0) - (a.modifiedTime ?? 0);
        case 'type': return a.type.localeCompare(b.type);
        default: return 0;
      }
    });
    return result;
  }, [files, sortKey, searchQuery]);

  const handlePress = (item: FileInfo) => {
    if (selectedItems.length > 0) {
      toggleSelect(item);
      return;
    }
    if (item.isDirectory) {
      handleNavigate(item.uri);
    } else {
      handleFileAction(item);
    }
  };

  const handleLongPress = (item: FileInfo) => {
    if (selectedItems.length === 0) {
      setSelectedItems([item]);
    } else {
      toggleSelect(item);
    }
  };

  function toggleSelect(item: FileInfo) {
    setSelectedItems((prev) =>
      prev.find((f) => f.uri === item.uri)
        ? prev.filter((f) => f.uri !== item.uri)
        : [...prev, item],
    );
  }

  function handleFileAction(item: FileInfo) {
    const actions = [
      { label: 'Bagikan', press: () => {} },
      { label: 'Rename', press: () => openRename(item) },
      { label: 'Hapus', press: () => confirmDelete(item) },
    ];
    Alert.alert(
      item.name,
      `Size: ${formatSize(item.size)}`,
      actions.map((a) => ({ text: a.label, onPress: a.press })),
    );
  }

  function openRename(item: FileInfo) {
    setRenameTarget(item);
    setRenameValue(item.name);
  }

  function confirmDelete(item: FileInfo) {
    Alert.alert(
      'Hapus File',
      `Hapus "${item.name}"?${item.isDirectory ? ' Isi folder juga akan dihapus.' : ''}`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(item.uri),
        },
      ],
    );
  }

  const handleCopy = () => {
    setClipboard({
      sourcePaths: selectedItems.map((f) => f.uri),
      operation: 'copy',
    });
    setSelectedItems([]);
  };

  const handleCut = () => {
    setClipboard({
      sourcePaths: selectedItems.map((f) => f.uri),
      operation: 'move',
    });
    setSelectedItems([]);
  };

  const handlePaste = () => {
    if (!clipboard || !clipboard.sourcePaths.length) return;
    const dest = currentPath.endsWith('/') ? currentPath : currentPath + '/';
    if (clipboard.operation === 'copy') {
      copyMutation.mutate({ sources: clipboard.sourcePaths, dest });
    } else {
      moveMutation.mutate({ sources: clipboard.sourcePaths, dest });
    }
    clearClipboard();
    setSelectedItems([]);
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      'Hapus File',
      `Hapus ${selectedItems.length} file/folder terpilih?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            for (const item of selectedItems) {
              await deleteMutation.mutateAsync(item.uri);
            }
            setSelectedItems([]);
          },
        },
      ],
    );
  };

  const handleConfirmRename = () => {
    if (!renameTarget || !renameValue.trim()) return;
    renameMutation.mutate({ path: renameTarget.uri, newName: renameValue.trim() });
    setRenameTarget(null);
    setRenameValue('');
  };

  const handleConfirmNav = () => {
    if (!selectedFolder) return;
    handleNavigate(selectedFolder);
  };

  const quickFolders = getQuickFolders();
  const normalizedPath = currentPath.replace('file://', '');
  const base = getBasePath();
  const breadcrumbParts = normalizedPath
    .replace(base, '')
    .split('/')
    .filter(Boolean);

  return {
    // state
    currentPath,
    sortKey,
    viewMode,
    selectedItems,
    searchQuery,
    showSearch,
    showNavModal,
    renameTarget,
    renameValue,
    selectedFolder,
    // derived data
    displayFiles,
    isLoading,
    quickFolders,
    breadcrumbParts,
    hasContent,
    // navigation / path helpers
    handleNavigate,
    handlePress,
    handleLongPress,
    // selection & clipboard
    handleCopy,
    handleCut,
    handlePaste,
    handleDeleteSelected,
    setSelectedItems,
    // rename
    openRename,
    handleConfirmRename,
    setRenameTarget,
    setRenameValue,
    // navigation modal
    setShowNavModal,
    setSelectedFolder,
    handleConfirmNav,
    // search & view
    setSearchQuery,
    setShowSearch,
    setSortKey,
    setViewMode,
  };
}
