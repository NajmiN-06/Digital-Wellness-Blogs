import {create} from "zustand";

interface ReadingListState {
  savedIds: string[]; // List of bookmarked blog IDs
  deletedBlogs: any[]; // Array to store deleted blog objects
  moveToTrash: (blog: any) => void; // Function to delete and store
  toggleSave: (id: string) => void;
}
export const useReadingList = create<ReadingListState>((set) => ({
  savedIds: [],
  deletedBlogs: [],
  toggleSave: (id) => set((state) => {
    const isAlreadySaved = state.savedIds.includes(id);
    return {
      // If it's there, remove it. If not, add it.
      savedIds: isAlreadySaved 
        ? state.savedIds.filter(savedId => savedId !== id)
        : [...state.savedIds, id]
    };
  }),
  moveToTrash: (blog) => set((state) => ({
    deletedBlogs: [...state.deletedBlogs, blog],
    //if it was bookmarked, remove it from bookmarks too
    savedIds: state.savedIds.filter(id => id !== blog.id)
  })),
}));