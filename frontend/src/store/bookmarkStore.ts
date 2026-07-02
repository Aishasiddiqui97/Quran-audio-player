import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Bookmark } from "@/types"

interface BookmarkState {
  bookmarks: Bookmark[]
  addBookmark: (surahNumber: number, ayahNumber: number, note?: string) => void
  removeBookmark: (surahNumber: number, ayahNumber: number) => void
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean
  getBookmarksBySurah: (surahNumber: number) => Bookmark[]
  clearBookmarks: () => void
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (surahNumber, ayahNumber, note) => {
        const exists = get().bookmarks.some(
          (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
        )
        if (exists) return
        set({
          bookmarks: [
            ...get().bookmarks,
            { surahNumber, ayahNumber, timestamp: Date.now(), note },
          ],
        })
      },
      removeBookmark: (surahNumber, ayahNumber) => {
        set({
          bookmarks: get().bookmarks.filter(
            (b) => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)
          ),
        })
      },
      isBookmarked: (surahNumber, ayahNumber) => {
        return get().bookmarks.some(
          (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
        )
      },
      getBookmarksBySurah: (surahNumber) => {
        return get().bookmarks.filter((b) => b.surahNumber === surahNumber)
      },
      clearBookmarks: () => set({ bookmarks: [] }),
    }),
    {
      name: "quran-bookmarks",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ bookmarks: state.bookmarks }),
    }
  )
)
