import { create } from 'zustand';
import { ClipboardItem } from '../types/files';

interface ClipboardStore {
  clipboard: ClipboardItem | null;
  setClipboard: (item: ClipboardItem | null) => void;
  clearClipboard: () => void;
  hasContent: () => boolean;
}

export const useClipboardStore = create<ClipboardStore>((set, get) => ({
  clipboard: null,
  setClipboard: (item) => set({ clipboard: item }),
  clearClipboard: () => set({ clipboard: null }),
  hasContent: () => get().clipboard !== null,
}));
