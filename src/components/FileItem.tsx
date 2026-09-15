import styled from '@/src/styled';
import { FileInfo, FileType } from '@/src/types/files';
import { formatSize } from '@/src/utils/format';
import { FileText, Folder, Image as ImageIcon, MoreVertical, Music, Video } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { DefaultTheme } from 'styled-components';

interface FileItemProps {
  item: FileInfo;
  onPress: (item: FileInfo) => void;
  onLongPress?: (item: FileInfo) => void;
  isSelected?: boolean;
  onMorePress?: (item: FileInfo) => void;
}

const Container = styled(Pressable)<{ isSelected?: boolean; theme: DefaultTheme }>`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: ${({ isSelected, theme }: { isSelected?: boolean; theme: DefaultTheme }) =>
    isSelected ? theme.colors.primaryLight + '20' : 'transparent'};
  border-left-width: 3px;
  border-left-color: ${({ isSelected, theme }: { isSelected?: boolean; theme: DefaultTheme }) =>
    isSelected ? theme.colors.primary : 'transparent'};
`;

const IconContainer = styled.View<{ theme: DefaultTheme }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.backgroundAlt};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const InfoContainer = styled.View`
  flex: 1;
`;

const NameText = styled.Text<{ theme: DefaultTheme }>`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
`;

const MetaText = styled.Text<{ theme: DefaultTheme }>`
  font-size: 12px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const MoreButton = styled.Pressable`
  padding: 8px;
  margin-left: -8px;
`;

function getIcon(type: FileType, isFolder: boolean) {
  if (isFolder) return <Folder size={22} color="#F59E0B" />;
  switch (type) {
    case 'image': return <ImageIcon size={22} color="#10B981" />;
    case 'video': return <Video size={22} color="#EF4444" />;
    case 'audio': return <Music size={22} color="#8B5CF6" />;
    case 'document': return <FileText size={22} color="#6366F1" />;
    default: return <FileText size={22} color="#94A3B8" /> ;
  }
}

function formatDate(timestamp: number): string {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function FileItem({ item, onPress, onLongPress, isSelected, onMorePress }: FileItemProps) {
  return (
    <Container
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress?.(item)}
      isSelected={isSelected}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${item.isDirectory ? 'folder' : formatSize(item.size)}`}
      accessibilityState={{ selected: isSelected }}
    >
      <IconContainer>{getIcon(item.type, item.isDirectory)}</IconContainer>
      <InfoContainer>
        <NameText numberOfLines={1}>{item.name}</NameText>
        <MetaText>
          {item.isDirectory ? 'Folder' : `${formatSize(item.size)} · ${formatDate(item.modifiedTime ?? Date.now())}`}
        </MetaText>
      </InfoContainer>
      <MoreButton onPress={() => onMorePress?.(item)} accessible accessibilityRole="button" accessibilityLabel={`More actions for ${item.name}`}>
        <MoreVertical size={18} color="#94A3B8" />
      </MoreButton>
    </Container>
  );
}
