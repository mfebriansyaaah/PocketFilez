import { FileItem } from '@/src/components/FileItem';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { useClipboardStore } from '@/src/hooks/useClipboard';
import {
    useCopyFiles,
    useDeleteFile,
    useDirectoryList,
    useMoveFiles,
    useRenameFile,
} from '@/src/hooks/useFileSystem';
import { getBasePath, getQuickFolders } from '@/src/services/fileService';
import styled from '@/src/styled';
import { theme } from '@/src/theme';
import { FileInfo } from '@/src/types/files';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import {
    ArrowUp,
    ChevronRight,
    Copy,
    File as FileIcon,
    Folder,
    Grid3X3,
    Image as ImageIcon,
    List,
    Music as MusicIcon,
    Scissors,
    Search,
    Settings,
    Trash2,
    Video as VideoIcon,
    X,
} from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    BackHandler,
    FlatList,
    GestureResponderEvent,
    Modal,
    Pressable,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, Stop, LinearGradient as SvgLinearGradient, Text as SvgText } from 'react-native-svg';
import { DefaultTheme } from 'styled-components';

type SortKey = 'name' | 'size' | 'modified' | 'type';
type ViewMode = 'list' | 'grid';

export default function FilesScreen() {
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

  // Handle Android hardware back button
  React.useEffect(() => {
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
  }, [currentPath]);

  React.useEffect(() => {
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

  // Build full path from breadcrumb parts for correct navigation
  function buildFullPath(parts: string[]): string {
    if (parts.length === 0) return getBasePath();
    const base = getBasePath();
    // For Android, base is '/storage/emulated/0', parts are ['DCIM', 'Camera']
    // For iOS/Web, base is the document URI, parts are relative
    if (base.endsWith('/')) return base + parts.join('/');
    return base + '/' + parts.join('/');
  }

  function handleNavigate(path: string) {
    setCurrentPath(path);
    setSelectedItems([]);
    setShowNavModal(false);
  }

  function handlePress(item: FileInfo) {
    if (selectedItems.length > 0) {
      toggleSelect(item);
      return;
    }
    if (item.isDirectory) {
      handleNavigate(item.uri);
    } else {
      handleFileAction(item);
    }
  }

  function handleLongPress(item: FileInfo) {
    if (selectedItems.length === 0) {
      setSelectedItems([item]);
    } else {
      toggleSelect(item);
    }
  }

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

  function handleCopy() {
    setClipboard({
      sourcePaths: selectedItems.map((f) => f.uri),
      operation: 'copy',
    });
    setSelectedItems([]);
  }

  function handleCut() {
    setClipboard({
      sourcePaths: selectedItems.map((f) => f.uri),
      operation: 'move',
    });
    setSelectedItems([]);
  }

  function handlePaste() {
    if (!clipboard || !clipboard.sourcePaths.length) return;
    const dest = currentPath.endsWith('/') ? currentPath : currentPath + '/';
    if (clipboard.operation === 'copy') {
      copyMutation.mutate({ sources: clipboard.sourcePaths, dest });
    } else {
      moveMutation.mutate({ sources: clipboard.sourcePaths, dest });
    }
    clearClipboard();
    setSelectedItems([]);
  }

  function handleDeleteSelected() {
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
  }

  function handleConfirmRename() {
    if (!renameTarget || !renameValue.trim()) return;
    renameMutation.mutate({ path: renameTarget.uri, newName: renameValue.trim() });
    setRenameTarget(null);
    setRenameValue('');
  }

  function handleConfirmNav() {
    if (!selectedFolder) return;
    handleNavigate(selectedFolder);
  }

  const quickFolders = getQuickFolders();
  const normalizedPath = currentPath.replace('file://', '');
  const base = getBasePath();
  const breadcrumbParts = normalizedPath
    .replace(base, '')
    .split('/')
    .filter(Boolean);


  return (
    <Container>
      {/* Pull-to-refresh wrapper */}
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      {/* Header */}
        <LinearGradient colors={['#2E073F', '#3B185F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingTop: 16, paddingHorizontal: 16 }}>
          <HeaderTop>
            <Svg height="30" width="150">
              <Defs>
                <SvgLinearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#03C4A1" />
                  <Stop offset="100%" stopColor="#892CDC" />
                </SvgLinearGradient>
              </Defs>
              <SvgText fill="url(#textGrad)" fontSize="28" fontWeight="900" x="0" y="22">PocketFilez</SvgText>
            </Svg>
            <HeaderActions>
              <IconBtn onPress={() => setShowSearch(!showSearch)}>
                <Search size={20} color="#ffffff" />
              </IconBtn>
              <IconBtn onPress={() => setShowNavModal(true)}>
                <Settings size={20} color="#ffffff" />
              </IconBtn>
            </HeaderActions>
          </HeaderTop>

          {/* Breadcrumb */}
          <Breadcrumb>
             <BreadcrumbItem onPress={() => handleNavigate(getBasePath())}>
               <Folder size={14} color="#ffffff" />
               <BreadcrumbText style={{ color: '#cccccc' }}>Root</BreadcrumbText>
             </BreadcrumbItem>
             {breadcrumbParts.map((part, i) => (
               <React.Fragment key={i}>
                 <ChevronRight size={14} color="#ffffff" />
                 <BreadcrumbItem onPress={() => handleNavigate(buildFullPath(breadcrumbParts.slice(0, i + 1)))}>
                   {i === breadcrumbParts.length - 1 ? (
                     <BreadcrumbActiveText style={{ color: '#ffffff' }}>{part}</BreadcrumbActiveText>
                   ) : (
                     <BreadcrumbText style={{ color: '#cccccc' }}>{part}</BreadcrumbText>
                   )}
                 </BreadcrumbItem>
               </React.Fragment>
             ))}
          </Breadcrumb>

          {/* Search */}
           {showSearch && (
             <SearchBar>
               <Search size={16} color="#ffffff" />
               <SearchInputText
                 placeholder="Cari file..."
                 placeholderTextColor="#cccccc"
                 value={searchQuery}
                 onChangeText={setSearchQuery}
                 autoFocus
               />
               {searchQuery.length > 0 && (
                 <TouchableOpacity onPress={() => setSearchQuery('')}>
                   <X size={16} color="#ffffff" />
                 </TouchableOpacity>
               )}
             </SearchBar>
           )}

          {/* Toolbar */}
          <Toolbar>
             <ToolbarGroup>
               <SortBtn active={sortKey === 'name'} onPress={() => setSortKey('name')}><SortBtnText style={{ color: '#ffffff' }}>A-Z</SortBtnText></SortBtn>
                <SortBtn active={sortKey === 'size'} onPress={() => setSortKey('size')}><SortBtnText style={{ color: '#ffffff' }}>Size</SortBtnText></SortBtn>
                <SortBtn active={sortKey === 'modified'} onPress={() => setSortKey('modified')}><SortBtnText style={{ color: '#ffffff' }}>Date</SortBtnText></SortBtn>
             </ToolbarGroup>
            <ToolbarGroup>
              <ViewBtn active={viewMode === 'list'} onPress={() => setViewMode('list')}>
                <List size={16} color={viewMode === 'list' ? '#ffffff' : '#cccccc'} />
              </ViewBtn>
              <ViewBtn active={viewMode === 'grid'} onPress={() => setViewMode('grid')}>
                <Grid3X3 size={16} color={viewMode === 'grid' ? '#ffffff' : '#cccccc'} />
              </ViewBtn>
            </ToolbarGroup>
          </Toolbar>

          {/* Selection bar */}
          {selectedItems.length > 0 && (
            <SelectionBar>
              <SelectionText style={{ color: '#ffffff' }}>{selectedItems.length} dipilih</SelectionText>
              <SelectionActions>
                <ActionButton icon={<Copy size={18} color="#ffffff" />} label="Salin" onPress={handleCopy} />
                <ActionButton icon={<Scissors size={18} color="#ffffff" />} label="Potong" onPress={handleCut} />
                {hasContent() && (
                  <ActionButton icon={<ArrowUp size={18} color="#ffffff" />} label="Tempel" onPress={handlePaste} />
                )}
                <ActionButton icon={<Trash2 size={18} color="#ffffff" />} label="Hapus" onPress={handleDeleteSelected} />
                <CloseBtn onPress={() => setSelectedItems([])}>
                  <X size={20} color="#ffffff" />
                </CloseBtn>
              </SelectionActions>
            </SelectionBar>
          )}
        </LinearGradient>


       {/* File List / Grid */}
        <ListWrapper>
          {isLoading ? (
            <LoadingContainer>
              <LoadingText>Loading files...</LoadingText>
            </LoadingContainer>
          ) : displayFiles.length === 0 ? (
            <EmptyContainer>
              <EmptyText>This folder is empty</EmptyText>
              <EmptySubText>Place files in this folder to see them</EmptySubText>
            </EmptyContainer>
          ) : viewMode === 'list' ? (
            <FlatList
              key={`list-${displayFiles.length}`}
              data={displayFiles}
              keyExtractor={(item) => item.uri}
              renderItem={({ item }) => (
                <FileItem
                  item={item}
                  onPress={handlePress}
                  onLongPress={handleLongPress}
                  isSelected={selectedItems.some((f) => f.uri === item.uri)}
                />
              )}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <FlatList
              key={`grid-${displayFiles.length}`}
              data={displayFiles}
              numColumns={2}
              keyExtractor={(item) => item.uri}
              renderItem={({ item }) => (
                <GridItem onPress={() => handlePress(item)}>
                  <GridIconContainer isSelected={selectedItems.some((f) => f.uri === item.uri)}>
                    {item.isDirectory ? (
                      <Folder size={32} color="#F59E0B" />
                    ) : item.type === 'image' ? (
                      <ImageIcon size={32} color="#10B981" />
                    ) : item.type === 'video' ? (
                      <VideoIcon size={32} color="#EF4444" />
                    ) : item.type === 'audio' ? (
                      <MusicIcon size={32} color="#8B5CF6" />
                    ) : (
                      <FileIcon size={32} color="#6366F1" />
                    )}
                  </GridIconContainer>
                  <GridName numberOfLines={2}>{item.name}</GridName>
                  <GridSize>{item.isDirectory ? 'Folder' : formatSize(item.size)}</GridSize>
                </GridItem>
              )}
              contentContainerStyle={styles.listContent}
            />
          )}
          
          <FABContainer>
            <FAB onPress={() => setShowNavModal(true)}>
              <ArrowUp size={24} color="#FFF" />
            </FAB>
          </FABContainer>
        </ListWrapper>


      {/* Navigation Modal */}
      <Modal visible={showNavModal} animationType="slide" transparent onRequestClose={() => setShowNavModal(false)}>
        <ModalOverlay onPress={() => setShowNavModal(false)}>
          <ModalContent onPress={(e: GestureResponderEvent) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Folder Navigation</ModalTitle>
              <CloseBtn onPress={() => setShowNavModal(false)}>
                <X size={20} color={theme.colors.textMuted} />
              </CloseBtn>
            </ModalHeader>
            <FolderList>
              <FolderItem selected={selectedFolder === getBasePath()} onPress={() => setSelectedFolder(selectedFolder === getBasePath() ? null : getBasePath())}>
                <Folder size={18} color="#E3651D" />
                <FolderNavText>Root ({getBasePath()})</FolderNavText>
              </FolderItem>
              {quickFolders.filter((qf) => qf.label !== 'Internal Storage').map((qf) => (
                <FolderItem key={qf.path} selected={selectedFolder === qf.path} onPress={() => setSelectedFolder(selectedFolder === qf.path ? null : qf.path)}>
                  <Folder size={18} color="#E3651D" />
                  <FolderNavText>{qf.label}</FolderNavText>
                </FolderItem>
              ))}
            </FolderList>
            {selectedFolder && (
              <ButtonContainer style={{ marginTop: 'auto' }}>
                <Button variant="primary" onPress={handleConfirmNav} disabled={!selectedFolder} style={{ flex: 1 }}>
                  Open
                </Button>
              </ButtonContainer>
            )}
          </ModalContent>
        </ModalOverlay>
      </Modal>

       {/* Rename Modal */}
       <Modal visible={!!renameTarget} animationType="fade" transparent onRequestClose={() => setRenameTarget(null)}>
         <ModalOverlayCenter onPress={() => setRenameTarget(null)}>
           <ModalContentSmall onPress={(e: GestureResponderEvent) => e.stopPropagation()}>
             <ModalTitle>Rename File</ModalTitle>

            <Input
              value={renameValue}
              onChangeText={setRenameValue}
              placeholder="Nama baru..."
            />
            <ButtonContainer>
              <Button variant="ghost" onPress={() => setRenameTarget(null)} style={{ flex: 1 }}>
                Batal
              </Button>
              <Button variant="primary" onPress={handleConfirmRename} style={{ flex: 1 }}>
                Simpan
              </Button>
            </ButtonContainer>
          </ModalContentSmall>
        </ModalOverlayCenter>
      </Modal>
      </SafeAreaView>
    </Container>
  );
}

// ─── Styled Components ───────────────────────────────────────────────

const Container = styled.View`
  flex: 1;
  background-color: #000000;
`;

const HeaderTop = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const HeaderActions = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const IconBtn = styled.Pressable`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #31363F;
  align-items: center;
  justify-content: center;
`;

const Breadcrumb = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  padding: 8px 0;
  margin-bottom: 8px;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
`;

const BreadcrumbItem = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 4px 2px;
`;

const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 8px 12px;
  margin-bottom: 8px;
  gap: 8px;
`;

const Toolbar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
`;

const ToolbarGroup = styled.View`
  flex-direction: row;
  gap: 4px;
  background-color: #31363F;
  border-radius: 8px;
  padding: 2px;
`;

const SortBtn = styled.Pressable<{ active?: boolean }>`
  padding: 6px 12px;
  border-radius: 6px;
  background-color: ${({ active }: { active?: boolean }) => active ? '#092328' : '#31363F'};
`;

const ViewBtn = styled.Pressable<{ active?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  background-color: ${({ active }: { active?: boolean }) => active ? '#092328' : 'transparent'};
`;

const SelectionBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.primary + '10'};
  border-radius: 12px;
  padding: 12px 16px;
  margin-top: 8px;
`;

const SelectionText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const SelectionActions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const ActionButton = styled.Pressable<{ icon: React.ReactNode; label: string }>`
  padding: 8px;
  border-radius: 8px;
  align-items: center;
`;

const CloseBtn = styled.Pressable`
  padding: 8px;
`;

// ─── Grid View ────────────────────────────────────────────────────────

const GridItem = styled(Pressable)`
  flex: 1;
  align-items: center;
  padding: 12px 8px;
`;

const GridIconContainer = styled.View<{ isSelected?: boolean }>`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background-color: ${({ isSelected, theme }: { isSelected?: boolean; theme: DefaultTheme }) => isSelected ? theme.colors.primaryLight + '30' : theme.colors.backgroundAlt};
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const GridName = styled.Text`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
  text-align: center;
  width: 100%;
  padding: 0 4px;
`;

const GridSize = styled.Text`
  font-size: 11px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

// ─── Modals ───────────────────────────────────────────────────────────

const ModalOverlay = styled(Pressable)`
  flex: 1;
  background-color: rgba(0,0,0,0.5);
  align-items: flex-end;
  justify-content: flex-end;
  padding-bottom: 32px;
`;

const ModalOverlayCenter = styled(Pressable)`
  flex: 1;
  background-color: rgba(0,0,0,0.5);
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(Pressable)`
  width: 100%;
  max-height: 52%;
  flex: 1;
  flex-direction: column;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
  border-radius: 20px 20px 0 0;
  padding: 20px;
  padding-bottom: 32px;
`;

const ModalContentSmall = styled(Pressable)`
  width: 85%;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
  border-radius: 16px;
  padding: 20px;
  gap: 16px;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
`;

const FolderList = styled.View`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 16px;
`;

const FolderItem = styled.Pressable<{ selected?: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 6px;
  margin: 2px 0;
  border-radius: 8px;
  background-color: ${({ selected, theme }: { selected?: boolean; theme: DefaultTheme }) => selected ? theme.colors.primaryLight + '20' : 'transparent'};
  border-width: ${({ selected }: { selected?: boolean }) => selected ? 2 : 0}px;
  border-style: solid;
  border-color: ${({ selected, theme }: { selected?: boolean; theme: DefaultTheme }) => selected ? theme.colors.primary : 'transparent'};
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  gap: 12px;
`;

// ─── FAB ──────────────────────────────────────────────────────────────

const FABContainer = styled.View`
  position: absolute;
  bottom: 24px;
  right: 24px;
`;

const ListWrapper = styled.View`
  flex: 1;
  position: relative;
  margin-bottom: 0;
  padding-bottom: 0;
  background-color: #ffffff;
`;

const FAB = styled(Pressable)`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.primary};
  align-items: center;
  justify-content: flex-start;
  padding-top: 8px;
  shadow-color: #000;
  shadow-offset: 0 4px;
  shadow-opacity: 0.2;
  shadow-radius: 8px;
  elevation: 6;
`;

// ─── Misc ─────────────────────────────────────────────────────────────

const LoadingContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const EmptyContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

function formatSize(bytes: number): string {
  if (bytes === 0) return '-';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + units[i];
}

  const styles = {
    listContent: { paddingBottom: 0 },
  };

const BreadcrumbText = styled.Text`
  font-size: 14px;
  color: #cccccc;
  margin-left: 2px;
`;

const BreadcrumbActiveText = styled.Text`
  font-size: 14px;
  color: #ffffff;
  font-weight: 600;
  margin-left: 2px;
`;

const SearchInputText = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: #ffffff;
`;

const LoadingText = styled.Text`
  font-size: 16px;
  color: #94A3B8;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: #64748B;
  margin-bottom: 8px;
`;

const EmptySubText = styled.Text`
  font-size: 14px;
  color: #94A3B8;
  text-align: center;
`;

const FolderNavText = styled.Text`
  font-size: 14px;
  color: #E3651D;
`;

const SortBtnText = styled.Text`
  font-size: 12px;
  color: #64748B;
`;



