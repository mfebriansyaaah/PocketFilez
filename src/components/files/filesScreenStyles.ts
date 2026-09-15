import styled from '@/src/styled';
import React from 'react';
import { Pressable, View } from 'react-native';
import { DefaultTheme } from 'styled-components';

// ─── Layout ──────────────────────────────────────────────────────────

export const Container = styled.View`
  flex: 1;
  background-color: #000000;
`;

// ─── Header ──────────────────────────────────────────────────────────

export const HeaderTop = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const HeaderActions = styled.View`
  flex-direction: row;
  gap: 8px;
`;

export const IconBtn = styled.Pressable`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #31363F;
  align-items: center;
  justify-content: center;
`;

// ─── Breadcrumb ──────────────────────────────────────────────────────

export const Breadcrumb = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  padding: 8px 0;
  margin-bottom: 8px;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
`;

export const BreadcrumbItem = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 4px 2px;
`;

export const BreadcrumbText = styled.Text`
  font-size: 14px;
  color: #cccccc;
  margin-left: 2px;
`;

export const BreadcrumbActiveText = styled.Text`
  font-size: 14px;
  color: #ffffff;
  font-weight: 600;
  margin-left: 2px;
`;

// ─── Search ──────────────────────────────────────────────────────────

export const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 8px 12px;
  margin-bottom: 8px;
  gap: 8px;
`;

export const SearchInputText = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: #ffffff;
`;

// ─── Toolbar ─────────────────────────────────────────────────────────

export const Toolbar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
`;

export const ToolbarGroup = styled.View`
  flex-direction: row;
  gap: 4px;
  background-color: #31363F;
  border-radius: 8px;
  padding: 2px;
`;

export const SortBtn = styled.Pressable<{ active?: boolean }>`
  padding: 6px 12px;
  border-radius: 6px;
  background-color: ${({ active }: { active?: boolean }) => active ? '#092328' : '#31363F'};
`;

export const SortBtnText = styled.Text`
  font-size: 12px;
  color: #64748B;
`;

export const ViewBtn = styled.Pressable<{ active?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  background-color: ${({ active }: { active?: boolean }) => active ? '#092328' : 'transparent'};
`;

// ─── Selection bar ───────────────────────────────────────────────────

export const SelectionBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.primary + '10'};
  border-radius: 12px;
  padding: 12px 16px;
  margin-top: 8px;
`;

export const SelectionText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

export const SelectionActions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const ActionButton = styled.Pressable<{ icon: React.ReactNode; label: string }>`
  padding: 8px;
  border-radius: 8px;
  align-items: center;
`;

export const CloseBtn = styled.Pressable`
  padding: 8px;
`;

// ─── File list / grid ────────────────────────────────────────────────

export const ListWrapper = styled.View`
  flex: 1;
  position: relative;
  margin-bottom: 0;
  padding-bottom: 0;
  background-color: #ffffff;
`;

export const GridItem = styled(Pressable)`
  flex: 1;
  align-items: center;
  padding: 12px 8px;
`;

export const GridIconContainer = styled.View<{ isSelected?: boolean }>`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background-color: ${({ isSelected, theme }: { isSelected?: boolean; theme: DefaultTheme }) => isSelected ? theme.colors.primaryLight + '30' : theme.colors.backgroundAlt};
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

export const GridName = styled.Text`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
  text-align: center;
  width: 100%;
  padding: 0 4px;
`;

export const GridSize = styled.Text`
  font-size: 11px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

// ─── Modals ──────────────────────────────────────────────────────────

export const ModalOverlay = styled(Pressable)`
  flex: 1;
  background-color: rgba(0,0,0,0.5);
  align-items: flex-end;
  justify-content: flex-end;
  padding-bottom: 32px;
`;

export const ModalOverlayCenter = styled(Pressable)`
  flex: 1;
  background-color: rgba(0,0,0,0.5);
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled(Pressable)`
  width: 100%;
  max-height: 52%;
  flex: 1;
  flex-direction: column;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
  border-radius: 20px 20px 0 0;
  padding: 20px;
  padding-bottom: 32px;
`;

export const ModalContentSmall = styled(Pressable)`
  width: 85%;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
  border-radius: 16px;
  padding: 20px;
  gap: 16px;
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
`;

export const FolderList = styled.View`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 16px;
`;

export const FolderItem = styled.Pressable<{ selected?: boolean }>`
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

export const FolderNavText = styled.Text`
  font-size: 14px;
  color: #E3651D;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  gap: 12px;
`;

// ─── FAB ─────────────────────────────────────────────────────────────

export const FABContainer = styled.View`
  position: absolute;
  bottom: 24px;
  right: 24px;
`;

export const FAB = styled(Pressable)`
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

// ─── Misc (loading / empty states) ───────────────────────────────────

export const LoadingContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const LoadingText = styled.Text`
  font-size: 16px;
  color: #94A3B8;
`;

export const EmptyContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

export const EmptyText = styled.Text`
  font-size: 16px;
  color: #64748B;
  margin-bottom: 8px;
`;

export const EmptySubText = styled.Text`
  font-size: 14px;
  color: #94A3B8;
  text-align: center;
`;
