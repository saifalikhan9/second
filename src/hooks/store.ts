import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Content = {
  id: string;
  title: string;
  link: string;
  type: 'twitter' | 'youtube' | 'linkedin';
  createdAt?: string;
};
interface ContentStore {
  content: Content[];
  isInitialLoading: boolean;
  isSavingContent: boolean;
  deletingContentIds: string[];
  setContents: (contents: Content[]) => void;
  setIsInitialLoading: (isLoading: boolean) => void;
  setIsSavingContent: (isLoading: boolean) => void;
  setDeletingContent: (contentId: string, isDeleting: boolean) => void;
  isDeletingContent: (contentId: string) => boolean;
  addContent: (content: Content) => void;
  deleteContent: (contentId: string) => void;
}

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      content: [],
      isInitialLoading: false,
      isSavingContent: false,
      deletingContentIds: [],
      setContents: (contents) => {
        set({ content: contents });
      },
      setIsInitialLoading: (isLoading) => {
        set({ isInitialLoading: isLoading });
      },
      setIsSavingContent: (isLoading) => {
        set({ isSavingContent: isLoading });
      },
      setDeletingContent: (contentId, isDeleting) =>
        set((state) => ({
          deletingContentIds: isDeleting
            ? [...new Set([...state.deletingContentIds, contentId])]
            : state.deletingContentIds.filter((id) => id !== contentId),
        })),
      isDeletingContent: (contentId) =>
        get().deletingContentIds.includes(contentId),
      addContent: (content) =>
        set((state) => ({
          content: [content, ...state.content],
        })),
      deleteContent: (contentId: string) =>
        set((state) => ({
          content: state.content.filter((content) => content.id !== contentId),
        })),
    }),
    {
      name: 'sb_content_store_v1', // name of the item in storage
      partialize: (state) => ({ content: state.content }), // only persist content array
    },
  ),
);
