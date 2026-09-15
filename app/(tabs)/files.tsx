import { FileItem } from '@/src/components/FileItem';
import {
    ActionButton,
    Breadcrumb,
    BreadcrumbActiveText,
    BreadcrumbItem,
    BreadcrumbText,
    ButtonContainer,
    CloseBtn,
    Container,
    EmptyContainer,
    EmptySubText,
    EmptyText,
    FAB,
    FABContainer,
    FolderItem,
    FolderList,
    FolderNavText,
    GridIconContainer,
    GridItem,
    GridName,
    GridSize,
    HeaderActions,
    HeaderTop,
    IconBtn,
    ListWrapper,
    LoadingContainer,
    LoadingText,
    ModalContent,
    ModalContentSmall,
    ModalHeader,
    ModalOverlay,
    ModalOverlayCenter,
    ModalTitle,
    SearchBar,
    SearchInputText,
    SelectionActions,
    SelectionBar,
    SelectionText,
    SortBtn,
    SortBtnText,
    Toolbar,
    ToolbarGroup,
    ViewBtn,
} from '@/src/components/files/filesScreenStyles';
import { Button, Input } from '@/src/components/ui';
import { buildFullPath, useFilesScreen } from '@/src/hooks/useFilesScreen';
import { getBasePath } from '@/src/services/fileService';
import { theme } from '@/src/theme';
import { formatSize } from '@/src/utils/format';
import { LinearGradient } from 'expo-linear-gradient';
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
import React from 'react';
import {
    FlatList,
    GestureResponderEvent,
    Modal,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, Stop, LinearGradient as SvgLinearGradient, Text as SvgText } from 'react-native-svg';

export default function FilesScreen() {
  const {
    displayFiles,
    isLoading,
    sortKey,
    viewMode,
    selectedItems,
    searchQuery,
    showSearch,
    showNavModal,
    renameTarget,
    renameValue,
    selectedFolder,
    quickFolders,
    breadcrumbParts,
    hasContent,
    handleNavigate,
    handlePress,
    handleLongPress,
    handleCopy,
    handleCut,
    handlePaste,
    handleDeleteSelected,
    handleConfirmRename,
    setRenameTarget,
    setRenameValue,
    setSelectedItems,
    setShowNavModal,
    setSelectedFolder,
    handleConfirmNav,
    setSearchQuery,
    setShowSearch,
    setSortKey,
    setViewMode,
  } = useFilesScreen();

  const listContent = { paddingBottom: 0 };

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
              contentContainerStyle={listContent}
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
              contentContainerStyle={listContent}
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
